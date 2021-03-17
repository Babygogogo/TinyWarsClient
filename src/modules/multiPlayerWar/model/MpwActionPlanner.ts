
namespace TinyWars.MultiPlayerWar {
    import Types                = Utility.Types;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import Logger               = Utility.Logger;
    import FloatText            = Utility.FloatText;
    import Lang                 = Utility.Lang;
    import TurnPhaseCode        = Types.TurnPhaseCode;
    import UnitState            = Types.UnitActionState;
    import GridIndex            = Types.GridIndex;
    import State                = Types.ActionPlannerState;
    import UnitActionType       = Types.UnitActionType;
    import UnitType             = Types.UnitType;
    import BwHelpers            = BaseWar.BwHelpers;
    import CommonConfirmPanel   = Common.CommonConfirmPanel;

    export class MpwActionPlanner extends BaseWar.BwActionPlanner {
        private _getPlayerIndexLoggedIn(): number {
            return (this._getWar() as MpwWar).getPlayerIndexLoggedIn();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting common state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setStateChoosingProductionTargetOnTap(gridIndex: GridIndex): void {
            this._clearFocusUnitOnMap();
            this._clearFocusUnitLoaded();
            this._clearChoosingUnitForDrop();
            this._clearChosenUnitsForDrop();
            this._clearAvailableDropDestinations();
            this._clearDataForPreviewingAttackableArea();
            this._clearDataForPreviewingMovableArea();

            this._setState(State.ChoosingProductionTarget);
            this._updateView();
            BaseWar.BwProduceUnitPanel.show({
                gridIndex,
                war     : this._getWar(),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting requesting state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
            MpwProxy.reqMcwPlayerProduceUnit(this._getWar(), gridIndex, unitType, unitHp);

            this._setState(State.RequestingPlayerProduceUnit);
            this._updateView();
        }

        public setStateRequestingPlayerVoteForDraw(isAgree: boolean): void {
            MpwProxy.reqMcwPlayerVoteForDraw(this._getWar(), isAgree);

            this._setState(State.RequestingPlayerVoteForDraw);
            this._updateView();
        }

        private _setStateRequestingUnitProduceUnit(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitProduceUnit(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitProduceUnit);
            this._updateView();
        }

        private _setStateRequestingUnitBeLoaded(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitBeLoaded(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitBeLoaded);
            this._updateView();
        }

        private _setStateRequestingUnitJoin(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitJoin(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitJoin);
            this._updateView();
        }

        private _setStateRequestingUnitUseCoSuperPower(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitUseCoSkill(this._getWar(), Types.CoSkillType.SuperPower, this.getMovePath(), unit ? unit.getUnitId() : null);

            this._setState(State.RequestingUnitUseCoSuperPower);
            this._updateView();
        }

        private _setStateRequestingUnitUseCoPower(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitUseCoSkill(this._getWar(), Types.CoSkillType.Power, this.getMovePath(), unit ? unit.getUnitId() : null);

            this._setState(State.RequestingUnitUseCoPower);
            this._updateView();
        }

        private _setStateRequestingUnitLoadCo(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitLoadCo(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : null);

            this._setState(State.RequestingUnitLoadCo);
            this._updateView();
        }

        private _setStateRequestingUnitWait(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitWait(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitWait);
            this._updateView();
        }

        protected _setStateRequestingUnitAttackUnit(targetGridIndex: GridIndex): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitAttackUnit(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined, targetGridIndex);

            this._setState(State.RequestingUnitAttackUnit);
            this._updateView();
        }

        protected _setStateRequestingUnitAttackTile(targetGridIndex: GridIndex): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitAttackTile(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined, targetGridIndex);

            this._setState(State.RequestingUnitAttackTile);
            this._updateView();
        }

        private _setStateRequestingUnitBuildTile(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitBuildTile(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitBuildTile);
            this._updateView();
        }

        private _setStateRequestingUnitCaptureTile(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitCaptureTile(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitCaptureTile);
            this._updateView();
        }

        private _setStateRequestingUnitDive(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitDive(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitDive);
            this._updateView();
        }

        private _setStateRequestingUnitSurface(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitSurface(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitSurface);
            this._updateView();
        }

        protected _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void {
            this._pushBackChosenUnitForDrop({
                unit        : this.getChoosingUnitForDrop(),
                destination : gridIndex,
            });

            const destinations = [] as Types.DropDestination[];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push({ unitId: data.unit.getUnitId(), gridIndex: data.destination });
            }

            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitDrop(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined, destinations);

            this._setState(State.RequestingUnitDrop);
            this._updateView();
        }
        private _setStateRequestingUnitDropOnChooseAction(): void {
            const destinations = [] as Types.DropDestination[];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push({ unitId: data.unit.getUnitId(), gridIndex: data.destination });
            }

            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitDrop(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined, destinations);

            this._setState(State.RequestingUnitDrop);
            this._updateView();
        }

        protected _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitLaunchFlare(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined, gridIndex);

            this._setState(State.RequestingUnitLaunchFlare);
            this._updateView();
        }

        protected _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitLaunchSilo(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined, gridIndex);

            this._setState(State.RequestingUnitLaunchSilo);
            this._updateView();
        }

        private _setStateRequestingUnitSupply(): void {
            const unit = this.getFocusUnitLoaded();
            MpwProxy.reqMcwUnitSupply(this._getWar(), this.getMovePath(), unit ? unit.getUnitId() : undefined);

            this._setState(State.RequestingUnitSupply);
            this._updateView();
        }

        public setStateRequestingPlayerEndTurn(): void {
            MpwProxy.reqMcwPlayerEndTurn(this._getWar());

            this._setState(State.RequestingPlayerEndTurn);
            this._updateView();
        }

        public setStateRequestingPlayerSurrender(): void {
            MpwProxy.reqMcwPlayerSurrender(this._getWar());

            this._setState(State.RequestingPlayerSurrender);
            this._updateView();
        }

        public setStateRequestingPlayerDeleteUnit(): void {
            MpwProxy.reqMcwPlayerDeleteUnit(this._getWar(), this.getCursor().getGridIndex());

            this._setState(State.RequestingPlayerDeleteUnit);
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _updateView(): void {
            this.getView().updateView();

            const currState = this.getState();
            if (currState === State.ChoosingAction) {
                BaseWar.BwUnitActionsPanel.show(this._getDataForUnitActionsPanel());
            } else {
                BaseWar.BwUnitActionsPanel.hide();
            }
        }

        protected _checkCanControlUnit(unit: BaseWar.BwUnit): boolean {
            const playerInTurn = this._getWar().getPlayerInTurn();
            return (playerInTurn.getUserId() === User.UserModel.getSelfUserId())
                && (playerInTurn.getPlayerIndex() === unit.getPlayerIndex());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return State.MakingMovePath;
                } else {
                    if (unit.checkHasWeapon()) {
                        return State.PreviewingAttackableArea;
                    } else {
                        return State.PreviewingMovableArea;
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenChoosingAttackTarget(gridIndex: GridIndex): State {
            if (!this.checkHasAttackableGridAfterMove(gridIndex)) {
                return State.ChoosingAction;
            } else {
                if (GridIndexHelpers.checkIsEqual(this.getCursor().getPreviousGridIndex(), gridIndex)) {
                    if (this._getUnitMap().getUnitOnMap(gridIndex)) {
                        return State.RequestingUnitAttackUnit;
                    } else {
                        return State.RequestingUnitAttackTile;
                    }
                } else {
                    return State.ChoosingAttackTarget;
                }
            }
        }
        protected _getNextStateOnTapWhenChoosingDropDestination(gridIndex: GridIndex): State {
            if (this.getAvailableDropDestinations().every(g => !GridIndexHelpers.checkIsEqual(g, gridIndex))) {
                return State.ChoosingAction;
            } else {
                const chosenUnits               = [this.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of this.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const restLoadedUnits = this.getFocusUnit().getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (this._calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return State.ChoosingAction;
                    }
                }

                return State.RequestingUnitDrop;
            }
        }
        protected _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State {
            if (GridIndexHelpers.getDistance(this.getMovePathDestination(), gridIndex) > this.getFocusUnit().getFlareMaxRange()) {
                return State.ChoosingAction;
            } else {
                if (GridIndexHelpers.checkIsEqual(gridIndex, this.getCursor().getPreviousGridIndex())) {
                    return State.RequestingUnitLaunchFlare;
                } else {
                    return State.ChoosingFlareDestination;
                }
            }
        }
        protected _getNextStateOnTapWhenChoosingSiloDestination(gridIndex: GridIndex): State {
            if (GridIndexHelpers.checkIsEqual(gridIndex, this.getCursor().getPreviousGridIndex())) {
                return State.RequestingUnitLaunchSilo;
            } else {
                return State.ChoosingSiloDestination;
            }
        }
        protected _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State {
            if (GridIndexHelpers.checkIsEqual(this.getCursor().getPreviousGridIndex(), gridIndex)) {
                return State.ChoosingProductionTarget;
            } else {
                const turnManager       = this._getTurnManager();
                const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
                const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
                const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
                if (!unit) {
                    const tile = this._getTileMap().getTile(gridIndex);
                    if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                        return State.ChoosingProductionTarget;
                    } else {
                        return State.Idle;
                    }
                } else {
                    if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                        return State.MakingMovePath;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingAttackableArea;
                        } else {
                            return State.PreviewingMovableArea;
                        }
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingAttackableArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitsForPreviewingAttackableArea().has(unit.getUnitId())) {
                        return State.PreviewingMovableArea;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingAttackableArea;
                        } else {
                            return State.PreviewingMovableArea;
                        }
                    }
                }
            }
        }
        protected _getNextStateOnTapWhenPreviewingMovableArea(gridIndex: GridIndex): State {
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    return State.Idle;
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
                    return State.MakingMovePath;
                } else {
                    if (this.getUnitForPreviewingMovableArea() !== unit) {
                        return State.PreviewingMovableArea;
                    } else {
                        if (unit.checkHasWeapon()) {
                            return State.PreviewingAttackableArea;
                        } else {
                            return State.Idle;
                        }
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for generating actions for the focused unit.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getActionUnitBeLoaded(): BaseWar.DataForUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = this.getFocusUnit();
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const loader = this._getUnitMap().getUnitOnMap(destination);
                return (loader) && (loader.checkCanLoadUnit(focusUnit))
                    ? [{ actionType: UnitActionType.BeLoaded, callback: () => this._setStateRequestingUnitBeLoaded() }]
                    : [];
            }
        }
        protected _getActionUnitJoin(): BaseWar.DataForUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = this.getFocusUnit();
            if (GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), destination)) {
                return [];
            } else {
                const target = this._getUnitMap().getUnitOnMap(destination);
                return (target) && (focusUnit.checkCanJoinUnit(target))
                    ? [{ actionType: UnitActionType.Join, callback: () => this._setStateRequestingUnitJoin() }]
                    : [];
            }
        }
        protected _getActionUnitUseCoSuperPower(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return !this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.SuperPower)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoSuperPower,
                        callback    : () => {
                            CommonConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0088),
                                content : Lang.getText(Lang.Type.A0058),
                                callback: () => this._setStateRequestingUnitUseCoSuperPower(),
                            });
                        },
                    }];
            }
        }
        protected _getActionUnitUseCoPower(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return !this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.Power)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoPower,
                        callback    : () => {
                            CommonConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0088),
                                content : Lang.getText(Lang.Type.A0054),
                                callback: () => this._setStateRequestingUnitUseCoPower(),
                            });
                        },
                    }];
            }
        }
        protected _getActionUnitLoadCo(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return this.getFocusUnit().checkCanLoadCoAfterMovePath(this.getMovePath())
                    ? [{ actionType: UnitActionType.LoadCo, callback: () => this._setStateRequestingUnitLoadCo() }]
                    : [];
            }
        }
        protected _getActionUnitCapture(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanCaptureTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.Capture, callback: () => this._setStateRequestingUnitCaptureTile() }]
                    : [];
            }
        }
        protected _getActionUnitDive(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanDive())
                    ? [{ actionType: UnitActionType.Dive, callback: () => this._setStateRequestingUnitDive() }]
                    : [];
            }
        }
        protected _getActionUnitSurface(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanSurface())
                    ? [{ actionType: UnitActionType.Surface, callback: () => this._setStateRequestingUnitSurface() }]
                    : [];
            }
        }
        protected _getActionUnitBuildTile(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanBuildOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.BuildTile, callback: () => this._setStateRequestingUnitBuildTile() }]
                    : [];
            }
        }
        protected _getActionUnitSupply(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                const focusUnit     = this.getFocusUnit();
                const playerIndex   = focusUnit.getPlayerIndex();
                const unitMap       = this._getUnitMap();
                if (focusUnit.checkIsAdjacentUnitSupplier()) {
                    for (const gridIndex of GridIndexHelpers.getAdjacentGrids(this.getMovePathDestination(), this._getMapSize())) {
                        const unit = unitMap.getUnitOnMap(gridIndex);
                        if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                            return [{ actionType: UnitActionType.Supply, callback: () => this._setStateRequestingUnitSupply() }];
                        }
                    }
                }
                return [];
            }
        }
        protected _getActionUnitProduceUnit(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                const focusUnit         = this.getFocusUnit();
                const produceUnitType   = focusUnit.getProduceUnitType();
                if ((this.getFocusUnitLoaded()) || (this.getMovePath().length !== 1) || (produceUnitType == null)) {
                    return [];
                } else {
                    if (focusUnit.getCurrentProduceMaterial() < 1) {
                        return [{
                            actionType      : UnitActionType.ProduceUnit,
                            callback        : () => FloatText.show(Lang.getText(Lang.Type.B0051)),
                            canProduceUnit  : false,
                            produceUnitType,
                        }];
                    } else if (focusUnit.getLoadedUnitsCount() >= focusUnit.getMaxLoadUnitsCount()) {
                        return [{
                            actionType      : UnitActionType.ProduceUnit,
                            callback        : () => FloatText.show(Lang.getText(Lang.Type.B0052)),
                            canProduceUnit  : false,
                            produceUnitType,
                        }];
                    } else if ((this._getWar() as MpwWar).getPlayerLoggedIn().getFund() < focusUnit.getProduceUnitCost()) {
                        return [{
                            actionType      : UnitActionType.ProduceUnit,
                            callback        : () => FloatText.show(Lang.getText(Lang.Type.B0053)),
                            canProduceUnit  : false,
                            produceUnitType,
                        }];
                    } else {
                        return [{
                            actionType      : UnitActionType.ProduceUnit,
                            callback        : () => this._setStateRequestingUnitProduceUnit(),
                            canProduceUnit  : true,
                            produceUnitType,
                        }];
                    }
                }
            }
        }
        protected _getActionUnitWait(hasOtherAction: boolean): BaseWar.DataForUnitAction[] {
            const existingUnit = this._getUnitMap().getUnitOnMap(this.getMovePathDestination());
            if ((existingUnit) && (existingUnit !== this.getFocusUnit())) {
                return [];
            } else {
                if (this.getChosenUnitsForDrop().length) {
                    return [{
                        actionType  : UnitActionType.Wait,
                        callback    : !hasOtherAction
                            ? () => this._setStateRequestingUnitDropOnChooseAction()
                            : () => CommonConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0088),
                                content : Lang.getText(Lang.Type.A0055),
                                callback: () => this._setStateRequestingUnitDropOnChooseAction(),
                            }),
                    }];
                } else {
                    return [{
                        actionType  : UnitActionType.Wait,
                        callback    : !hasOtherAction
                            ? () => this._setStateRequestingUnitWait()
                            : () => CommonConfirmPanel.show({
                                title   : Lang.getText(Lang.Type.B0088),
                                content : Lang.getText(Lang.Type.A0055),
                                callback: () => this._setStateRequestingUnitWait(),
                            }),
                    }];
                }
            }
        }
    }
}
