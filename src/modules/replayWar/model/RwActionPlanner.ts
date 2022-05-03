
// import TwnsBwActionPlanner      from "../../baseWar/model/BwActionPlanner";
// import TwnsBwDamagePreviewPanel from "../../baseWar/view/BwDamagePreviewPanel";
// import TwnsBwUnitActionsPanel   from "../../baseWar/view/BwUnitActionsPanel";
// import FloatText                from "../../tools/helpers/FloatText";
// import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.ReplayWar {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import TurnPhaseCode        = Twns.Types.TurnPhaseCode;
    import UnitState            = Twns.Types.UnitActionState;
    import GridIndex            = Twns.Types.GridIndex;
    import State                = Twns.Types.ActionPlannerState;
    import UnitActionType       = Twns.Types.UnitActionType;

    export class RwActionPlanner extends Twns.BaseWar.BwActionPlanner {
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _updateView(): void {
            this.getView().updateView();

            const currState = this.getState();
            if (currState === State.ChoosingAction) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.BwUnitActionsPanel, this._getDataForUnitActionsPanel());
            } else {
                Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.BwUnitActionsPanel);
            }
            if ((currState === State.MakingMovePath) || (currState === State.ChoosingAttackTarget)) {
                Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.BwDamagePreviewPanel, { war: this._getWar() });
            } else {
                Twns.PanelHelpers.close(Twns.PanelHelpers.PanelDict.BwDamagePreviewPanel);
            }
        }

        protected _checkCanControlUnit(): boolean {
            return false;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for settings the state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setStateRequestingUnitAttackUnit(): void {
            // nothing to do
        }

        protected _setStateRequestingUnitAttackTile(): void {
            // nothing to do
        }

        protected _setStateRequestingUnitDropOnTap(): void {
            // nothing to do
        }

        protected _setStateRequestingUnitLaunchSilo(): void {
            // nothing to do
        }

        protected _setStateRequestingUnitLaunchFlare(): void {
            // nothing to do
        }

        public setStateRequestingPlayerProduceUnit(): void {
            // nothing to do
        }

        public setStateRequestingPlayerEndTurn(): void {
            // nothing to do
        }

        public setStateRequestingPlayerUseCoSkill(): void {
            // nothing to do
        }

        public setStateRequestingPlayerDeleteUnit(): void {
            // nothing to do
        }

        public setStateRequestingPlayerVoteForDraw(): void {
            // nothing to do
        }

        public setStateRequestingPlayerSurrender(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._getWar().getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if (unit.checkHasWeapon()) {
                    return State.PreviewingUnitAttackableArea;
                } else {
                    return State.PreviewingUnitMovableArea;
                }
            }
        }
        protected _getNextStateOnTapWhenChoosingAttackTarget(gridIndex: GridIndex): State {
            if (!this.checkHasAttackableGridAfterMove(gridIndex)) {
                return State.ChoosingAction;
            } else {
                return State.ChoosingAttackTarget;
            }
        }
        protected _getNextStateOnTapWhenChoosingDropDestination(gridIndex: GridIndex): State {
            if (Twns.Helpers.getExisted(this.getAvailableDropDestinations()).every(g => !GridIndexHelpers.checkIsEqual(g, gridIndex))) {
                return State.ChoosingAction;
            } else {
                const chosenUnits               = [this.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of this.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = Twns.Helpers.getExisted(this.getFocusUnit()).getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (this._calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return State.ChoosingAction;
                    }
                }

                return State.ChoosingAction;
            }
        }
        protected _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State {
            if (GridIndexHelpers.getDistance(this.getMovePathDestination(), gridIndex) > Twns.Helpers.getExisted(Twns.Helpers.getExisted(this.getFocusUnit()).getFlareMaxRange())) {
                return State.ChoosingAction;
            } else {
                return State.ChoosingFlareDestination;
            }
        }
        protected _getNextStateOnTapWhenChoosingSiloDestination(): State {
            return State.ChoosingSiloDestination;
        }
        protected _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State {
            const previousGridIndex = this.getCursor().getPreviousGridIndex();
            if ((previousGridIndex) && GridIndexHelpers.checkIsEqual(previousGridIndex, gridIndex)) {
                return State.ChoosingProductionTarget;
            } else {
                const turnManager       = this._getTurnManager();
                const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
                const playerIndexInTurn = this._getWar().getPlayerInTurn().getPlayerIndex();
                const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
                if (!unit) {
                    const tile = this._getTileMap().getTile(gridIndex);
                    if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                        return State.ChoosingProductionTarget;
                    } else {
                        if (tile.checkIsMapWeapon()) {
                            return State.PreviewingTileAttackableArea;
                        } else {
                            return State.Idle;
                        }
                    }
                } else {
                    if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                        return State.MakingMovePath;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingUnitAttackableArea;
                        } else {
                            return State.PreviewingUnitMovableArea;
                        }
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingUnitAttackableArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._getWar().getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitsForPreviewingAttackableArea().has(unit.getUnitId())) {
                        return State.PreviewingUnitMovableArea;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingUnitAttackableArea;
                        } else {
                            return State.PreviewingUnitMovableArea;
                        }
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingUnitMovableArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._getWar().getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitForPreviewingMovableArea() !== unit) {
                        return State.PreviewingUnitMovableArea;
                    } else {
                        return State.PreviewingUnitVisibleArea;
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingUnitVisibleArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._getWar().getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitForPreviewingVisibleArea() !== unit) {
                        return State.PreviewingUnitVisibleArea;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingUnitAttackableArea;
                        } else {
                            return State.PreviewingUnitMovableArea;
                        }
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingTileAttackableArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const playerIndexInTurn = this._getWar().getPlayerInTurn().getPlayerIndex();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === playerIndexInTurn) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(playerIndexInTurn))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === playerIndexInTurn))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitsForPreviewingAttackableArea().has(unit.getUnitId())) {
                        return State.PreviewingUnitMovableArea;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingUnitAttackableArea;
                        } else {
                            return State.PreviewingUnitMovableArea;
                        }
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for generating actions for the focused unit.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getActionUnitBeLoaded(): Twns.BaseWar.DataForUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = Twns.Helpers.getExisted(this.getFocusUnit());
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const loader = this._getUnitMap().getUnitOnMap(destination);
                return (loader) && (loader.checkCanLoadUnit(focusUnit))
                    ? [{ actionType: UnitActionType.BeLoaded, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitJoin(): Twns.BaseWar.DataForUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = Twns.Helpers.getExisted(this.getFocusUnit());
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const target = this._getUnitMap().getUnitOnMap(destination);
                return (target) && (focusUnit.checkCanJoinUnit(target))
                    ? [{ actionType: UnitActionType.Join, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitUseCoSuperPower(): Twns.BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return Twns.Helpers.getExisted(this.getFocusUnit()).checkCanUseCoSkill(Twns.Types.CoSkillType.SuperPower)
                    ? [{ actionType: UnitActionType.UseCoSuperPower, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitUseCoPower(): Twns.BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return Twns.Helpers.getExisted(this.getFocusUnit()).checkCanUseCoSkill(Twns.Types.CoSkillType.Power)
                    ? [{ actionType: UnitActionType.UseCoPower, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitLoadCo(): Twns.BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return Twns.Helpers.getExisted(this.getFocusUnit()).checkCanLoadCoAfterMovePath(this.getMovePath())
                    ? [{ actionType: UnitActionType.LoadCo, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitCapture(): Twns.BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Twns.Helpers.getExisted(this.getFocusUnit()).checkCanCaptureTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.Capture, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitDive(): Twns.BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Twns.Helpers.getExisted(this.getFocusUnit()).checkCanDive())
                    ? [{ actionType: UnitActionType.Dive, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitSurface(): Twns.BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Twns.Helpers.getExisted(this.getFocusUnit()).checkCanSurface())
                    ? [{ actionType: UnitActionType.Surface, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitBuildTile(): Twns.BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Twns.Helpers.getExisted(this.getFocusUnit()).checkCanBuildOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.BuildTile, callback: () => {
                        // nothing to do
                    } }]
                    : [];
            }
        }
        protected _getActionUnitSupply(): Twns.BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                const focusUnit     = Twns.Helpers.getExisted(this.getFocusUnit());
                const playerIndex   = focusUnit.getPlayerIndex();
                const unitMap       = this._getUnitMap();
                if (focusUnit.checkIsAdjacentUnitSupplier()) {
                    for (const gridIndex of GridIndexHelpers.getAdjacentGrids(this.getMovePathDestination(), this.getMapSize())) {
                        const unit = unitMap.getUnitOnMap(gridIndex);
                        if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                            return [{ actionType: UnitActionType.Supply, callback: () => {
                                // nothing to do
                            } }];
                        }
                    }
                }
                return [];
            }
        }
        protected _getActionUnitProduceUnit(): Twns.BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                const focusUnit         = Twns.Helpers.getExisted(this.getFocusUnit());
                const produceUnitType   = focusUnit.getProduceUnitType();
                if ((this.getFocusUnitLoaded()) || (this.getMovePath().length !== 1) || (produceUnitType == null)) {
                    return [];
                } else {
                    const costForProduceUnit = focusUnit.getProduceUnitCost();
                    if (Twns.Helpers.getExisted(focusUnit.getCurrentProduceMaterial()) < 1) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0051)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else if (focusUnit.getLoadedUnitsCount() >= Twns.Helpers.getExisted(focusUnit.getMaxLoadUnitsCount())) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0052)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else if (this._getWar().getPlayerInTurn().getFund() < focusUnit.getProduceUnitCost()) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0053)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else {
                        return [{
                            actionType      : UnitActionType.ProduceUnit,
                            callback        : () => {
                                // nothing to do
                            },
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    }
                }
            }
        }
        protected _getActionUnitWait(): Twns.BaseWar.DataForUnitAction[] {
            const existingUnit = this._getUnitMap().getUnitOnMap(this.getMovePathDestination());
            if ((existingUnit) && (existingUnit !== this.getFocusUnit())) {
                return [];
            } else {
                if (this.getChosenUnitsForDrop().length) {
                    return [{ actionType: UnitActionType.Wait, callback: () => {
                        // nothing to do
                    } }];
                } else {
                    return [{ actionType: UnitActionType.Wait, callback: () => {
                        // nothing to do
                    } }];
                }
            }
        }
    }
}

// export default TwnsRwActionPlanner;
