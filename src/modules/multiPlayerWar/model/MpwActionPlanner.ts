
// import TwnsBwActionPlanner      from "../../baseWar/model/BwActionPlanner";
// import TwnsBwUnit               from "../../baseWar/model/BwUnit";
// import TwnsBwDamagePreviewPanel from "../../baseWar/view/BwDamagePreviewPanel";
// import TwnsBwUnitActionsPanel   from "../../baseWar/view/BwUnitActionsPanel";
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import MpwProxy                 from "../../multiPlayerWar/model/MpwProxy";
// import FloatText                from "../../tools/helpers/FloatText";
// import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
// import Helpers                  from "../../tools/helpers/Helpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import UserModel                from "../../user/model/UserModel";
// import TwnsMpwWar               from "./MpwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiPlayerWar {
    import LangTextType         = Lang.LangTextType;
    import TurnPhaseCode        = Types.TurnPhaseCode;
    import UnitState            = Types.UnitActionState;
    import GridIndex            = Types.GridIndex;
    import State                = Types.ActionPlannerState;
    import UnitActionType       = Types.UnitActionType;
    import UnitType             = Types.UnitType;

    export class MpwActionPlanner extends BaseWar.BwActionPlanner {
        private _getPlayerIndexLoggedIn(): number | null {
            const war = this._getWar();
            if (!(war instanceof MultiPlayerWar.MpwWar)) {
                throw Helpers.newError(`Invalid war.`);
            }
            return war.getPlayerIndexLoggedIn();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting requesting state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner.setStateRequestingPlayerProduceUnit() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionPlayerProduceUnit  : {
                    gridIndex,
                    unitType,
                    unitHp,
                },
            });

            this._setState(State.RequestingPlayerProduceUnit);
            this._updateView();
        }

        public setStateRequestingPlayerVoteForDraw(isAgree: boolean): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner.setStateRequestingPlayerVoteForDraw() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionPlayerVoteForDraw  : {
                    isAgree,
                },
            });

            this._setState(State.RequestingPlayerVoteForDraw);
            this._updateView();
        }

        private _setStateRequestingUnitProduceUnit(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitProduceUnit() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitProduceUnit: {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                },
            });

            this._setState(State.RequestingUnitProduceUnit);
            this._updateView();
        }

        private _setStateRequestingUnitBeLoaded(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitBeLoaded() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitBeLoaded   : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                },
            });

            this._setState(State.RequestingUnitBeLoaded);
            this._updateView();
        }

        private _setStateRequestingUnitJoin(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitBeLoaded() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitJoinUnit   : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                },
            });

            this._setState(State.RequestingUnitJoin);
            this._updateView();
        }

        private _setStateRequestingUnitUseCoSuperPower(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitUseCoSuperPower() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitUseCoSkill : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                    skillType       : Types.CoSkillType.SuperPower,
                },
            });

            this._setState(State.RequestingUnitUseCoSuperPower);
            this._updateView();
        }

        private _setStateRequestingUnitUseCoPower(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitUseCoPower() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitUseCoSkill : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                    skillType       : Types.CoSkillType.Power,
                },
            });

            this._setState(State.RequestingUnitUseCoPower);
            this._updateView();
        }

        private _setStateRequestingUnitLoadCo(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitLoadCo() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId            : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitLoadCo : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                },
            });

            this._setState(State.RequestingUnitLoadCo);
            this._updateView();
        }

        private _setStateRequestingUnitWait(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitWait() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId            : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitWait   : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                },
            });

            this._setState(State.RequestingUnitWait);
            this._updateView();
        }

        protected _setStateRequestingUnitAttackUnit(targetGridIndex: GridIndex): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitAttackUnit() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitAttackUnit : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                    targetGridIndex,
                },
            });

            this._setState(State.RequestingUnitAttackUnit);
            this._updateView();
            SoundManager.playShortSfx(Types.ShortSfxCode.CursorConfirm01);
        }

        protected _setStateRequestingUnitAttackTile(targetGridIndex: GridIndex): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitAttackTile() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitAttackTile : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                    targetGridIndex,
                },
            });

            this._setState(State.RequestingUnitAttackTile);
            this._updateView();
            SoundManager.playShortSfx(Types.ShortSfxCode.CursorConfirm01);
        }

        private _setStateRequestingUnitBuildTile(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitBuildTile() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitBuildTile  : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                },
            });

            this._setState(State.RequestingUnitBuildTile);
            this._updateView();
        }

        private _setStateRequestingUnitCaptureTile(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitCaptureTile() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitCaptureTile: {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                },
            });

            this._setState(State.RequestingUnitCaptureTile);
            this._updateView();
        }

        private _setStateRequestingUnitDive(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitDive() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId            : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitDive   : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                },
            });

            this._setState(State.RequestingUnitDive);
            this._updateView();
        }

        private _setStateRequestingUnitSurface(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitSurface() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitSurface    : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                },
            });

            this._setState(State.RequestingUnitSurface);
            this._updateView();
        }

        protected _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void {
            const unit = this.getChoosingUnitForDrop();
            if (unit == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitDropOnTap() empty unit.`);
            }

            this._pushBackChosenUnitForDrop({
                unit,
                destination : gridIndex,
            });

            const destinations: Types.DropDestination[] = [];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push({ unitId: data.unit.getUnitId(), gridIndex: data.destination });
            }

            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitDropOnTap() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitDropUnit   : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                    dropDestinations: destinations,
                },
            });

            this._setState(State.RequestingUnitDrop);
            this._updateView();
        }
        private _setStateRequestingUnitDropOnChooseAction(): void {
            const destinations = [] as Types.DropDestination[];
            for (const data of this.getChosenUnitsForDrop()) {
                destinations.push({ unitId: data.unit.getUnitId(), gridIndex: data.destination });
            }

            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitDropOnChooseAction() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitDropUnit   : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                    dropDestinations: destinations,
                },
            });

            this._setState(State.RequestingUnitDrop);
            this._updateView();
        }

        protected _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitLaunchFlare() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitLaunchFlare: {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                    targetGridIndex : gridIndex,
                },
            });

            this._setState(State.RequestingUnitLaunchFlare);
            this._updateView();
        }

        protected _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitLaunchSilo() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitLaunchSilo : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                    targetGridIndex : gridIndex,
                },
            });

            this._setState(State.RequestingUnitLaunchSilo);
            this._updateView();
        }

        private _setStateRequestingUnitSupply(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner._setStateRequestingUnitSupply() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionUnitSupplyUnit : {
                    path: {
                        nodes: this.getMovePath(),
                    },
                    launchUnitId    : this._getUnitIdForFocusUnitLoaded(),
                },
            });

            this._setState(State.RequestingUnitSupply);
            this._updateView();
        }

        public setStateRequestingPlayerEndTurn(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner.setStateRequestingPlayerEndTurn() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionPlayerEndTurn  : {
                },
            });

            this._setState(State.RequestingPlayerEndTurn);
            this._updateView();
        }

        public setStateRequestingPlayerSurrender(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner.setStateRequestingPlayerSurrender() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionPlayerSurrender: {
                },
            });

            this._setState(State.RequestingPlayerSurrender);
            this._updateView();
        }

        public setStateRequestingPlayerDeleteUnit(): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner.setStateRequestingPlayerDeleteUnit() empty war.`);
            }

            const gridIndex = war.getCursor().getGridIndex();
            if (gridIndex == null) {
                throw Helpers.newError(`MpwActionPlanner.setStateRequestingPlayerDeleteUnit() empty gridIndex.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionPlayerDeleteUnit   : {
                    gridIndex,
                },
            });

            this._setState(State.RequestingPlayerDeleteUnit);
            this._updateView();
        }

        public setStateRequestingPlayerUseCoSkill(skillType: Types.CoSkillType): void {
            const war = this._getWar();
            if (war == null) {
                throw Helpers.newError(`MpwActionPlanner.setStateRequestingPlayerUseCoSkill() empty war.`);
            }

            MultiPlayerWar.MpwProxy.reqMpwExecuteWarAction(war, {
                actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
                WarActionPlayerUseCoSkill   : {
                    skillType,
                },
            });

            this._setState(State.RequestingPlayerUseCoSkill);
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _updateView(): void {
            this.getView().updateView();

            const currState = this.getState();
            if (currState === State.ChoosingAction) {
                PanelHelpers.open(PanelHelpers.PanelDict.BwUnitActionsPanel, this._getDataForUnitActionsPanel());
            } else {
                PanelHelpers.close(PanelHelpers.PanelDict.BwUnitActionsPanel);
            }
            if ((currState === State.MakingMovePath) || (currState === State.ChoosingAttackTarget)) {
                PanelHelpers.open(PanelHelpers.PanelDict.BwDamagePreviewPanel, { war: this._getWar() });
            } else {
                PanelHelpers.close(PanelHelpers.PanelDict.BwDamagePreviewPanel);
            }
        }

        protected _checkCanControlUnit(unit: BaseWar.BwUnit): boolean {
            const war           = this._getWar();
            const playerInTurn  = war.getPlayerInTurn();
            return (playerInTurn.getUserId() === User.UserModel.getSelfUserId())
                && (playerInTurn.getPlayerIndex() === unit.getPlayerIndex());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State {
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (selfPlayerIndex != null) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
        protected _getNextStateOnTapWhenChoosingAttackTarget(gridIndex: GridIndex): State {
            if (!this.checkHasAttackableGridAfterMove(gridIndex)) {
                return State.ChoosingAction;
            } else {
                const cursor                    = this.getCursor();
                const cursorPreviousGridIndex   = cursor ? cursor.getPreviousGridIndex() : null;
                if (cursorPreviousGridIndex == null) {
                    throw Helpers.newError(`MpwActionPlanner._getNextStateOnTapWhenChoosingAttackTarget() empty cursorPreviousGridIndex.`);
                }

                if (GridIndexHelpers.checkIsEqual(cursorPreviousGridIndex, gridIndex)) {
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
            if ((this.getAvailableDropDestinations() || []).every(g => !GridIndexHelpers.checkIsEqual(g, gridIndex))) {
                return State.ChoosingAction;
            } else {
                const chosenUnits               = [this.getChoosingUnitForDrop()];
                const chosenDropDestinations    = [gridIndex];
                for (const data of this.getChosenUnitsForDrop()) {
                    chosenUnits.push(data.unit);
                    chosenDropDestinations.push(data.destination);
                }

                const focusUnit = this.getFocusUnit();
                if (focusUnit == null) {
                    throw Helpers.newError(`MpwActionPlanner._getNextStateOnTapWhenChoosingDropDestination() empty focusUnit.`);
                }

                const restLoadedUnits = focusUnit.getLoadedUnits().filter(unit => chosenUnits.every(u => u !== unit));
                for (const unit of restLoadedUnits) {
                    if (this._calculateAvailableDropDestination(unit, chosenDropDestinations).length) {
                        return State.ChoosingAction;
                    }
                }

                return State.RequestingUnitDrop;
            }
        }
        protected _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State {
            if (GridIndexHelpers.getDistance(this.getMovePathDestination(), gridIndex) > Helpers.getExisted(this.getFocusUnit()?.getFlareMaxRange())) {
                return State.ChoosingAction;
            } else {
                const previousGridIndex = this.getCursor().getPreviousGridIndex();
                if ((previousGridIndex) && GridIndexHelpers.checkIsEqual(gridIndex, previousGridIndex)) {
                    return State.RequestingUnitLaunchFlare;
                } else {
                    return State.ChoosingFlareDestination;
                }
            }
        }
        protected _getNextStateOnTapWhenChoosingSiloDestination(gridIndex: GridIndex): State {
            const previousGridIndex = this.getCursor().getPreviousGridIndex();
            if ((previousGridIndex) && GridIndexHelpers.checkIsEqual(gridIndex, previousGridIndex)) {
                return State.RequestingUnitLaunchSilo;
            } else {
                return State.ChoosingSiloDestination;
            }
        }
        protected _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State {
            const previousGridIndex = this.getCursor().getPreviousGridIndex();
            if ((previousGridIndex) && GridIndexHelpers.checkIsEqual(previousGridIndex, gridIndex)) {
                return State.ChoosingProductionTarget;
            } else {
                const turnManager       = this._getTurnManager();
                const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
                const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
                const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
                if (!unit) {
                    const tile = this._getTileMap().getTile(gridIndex);
                    if ((isSelfInTurn) && (selfPlayerIndex != null) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                        return State.ChoosingProductionTarget;
                    } else {
                        if (tile.checkIsMapWeapon()) {
                            return State.PreviewingTileAttackableArea;
                        } else {
                            return State.Idle;
                        }
                    }
                } else {
                    if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (selfPlayerIndex != null) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (selfPlayerIndex != null) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (selfPlayerIndex != null) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
            const selfPlayerIndex   = this._getPlayerIndexLoggedIn();
            const isSelfInTurn      = (turnManager.getPlayerIndexInTurn() === selfPlayerIndex) && (turnManager.getPhaseCode() === TurnPhaseCode.Main);
            if (!unit) {
                const tile = this._getTileMap().getTile(gridIndex);
                if ((isSelfInTurn) && (selfPlayerIndex != null) && (tile.checkIsUnitProducerForPlayer(selfPlayerIndex))) {
                    return State.ChoosingProductionTarget;
                } else {
                    if (tile.checkIsMapWeapon()) {
                        return State.PreviewingTileAttackableArea;
                    } else {
                        return State.Idle;
                    }
                }
            } else {
                if ((isSelfInTurn) && ((unit.getActionState() === UnitState.Idle) && (unit.getPlayerIndex() === selfPlayerIndex))) {
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
        protected _getActionUnitBeLoaded(): BaseWar.DataForUnitAction[] {
            const destination   = this.getMovePathDestination();
            const focusUnit     = Helpers.getExisted(this.getFocusUnit());
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
            const focusUnit     = Helpers.getExisted(this.getFocusUnit());
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
                return !Helpers.getExisted(this.getFocusUnit()).checkCanUseCoSkill(Types.CoSkillType.SuperPower)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoSuperPower,
                        callback    : () => {
                            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                                content : Lang.getText(LangTextType.A0058),
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
                return !Helpers.getExisted(this.getFocusUnit()).checkCanUseCoSkill(Types.CoSkillType.Power)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoPower,
                        callback    : () => {
                            PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                                content : Lang.getText(LangTextType.A0054),
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
                return Helpers.getExisted(this.getFocusUnit()).checkCanLoadCoAfterMovePath(this.getMovePath())
                    ? [{ actionType: UnitActionType.LoadCo, callback: () => this._setStateRequestingUnitLoadCo() }]
                    : [];
            }
        }
        protected _getActionUnitCapture(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanCaptureTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.Capture, callback: () => this._setStateRequestingUnitCaptureTile() }]
                    : [];
            }
        }
        protected _getActionUnitDive(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanDive())
                    ? [{ actionType: UnitActionType.Dive, callback: () => this._setStateRequestingUnitDive() }]
                    : [];
            }
        }
        protected _getActionUnitSurface(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanSurface())
                    ? [{ actionType: UnitActionType.Surface, callback: () => this._setStateRequestingUnitSurface() }]
                    : [];
            }
        }
        protected _getActionUnitBuildTile(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (Helpers.getExisted(this.getFocusUnit()).checkCanBuildOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.BuildTile, callback: () => this._setStateRequestingUnitBuildTile() }]
                    : [];
            }
        }
        protected _getActionUnitSupply(): BaseWar.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                const focusUnit     = Helpers.getExisted(this.getFocusUnit());
                const playerIndex   = focusUnit.getPlayerIndex();
                const unitMap       = this._getUnitMap();
                if (focusUnit.checkIsAdjacentUnitSupplier()) {
                    for (const gridIndex of GridIndexHelpers.getAdjacentGrids(this.getMovePathDestination(), this.getMapSize())) {
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
                const focusUnit         = Helpers.getExisted(this.getFocusUnit());
                const produceUnitType   = focusUnit.getProduceUnitType();
                if ((this.getFocusUnitLoaded())                                                                                                                     ||
                    (this.getMovePath().length !== 1)                                                                                                               ||
                    (produceUnitType == null)                                                                                                                       ||
                    ((focusUnit.getWar().getCommonSettingManager().getSettingsBannedUnitTypeArray(focusUnit.getPlayerIndex()) ?? []).indexOf(produceUnitType) >= 0)
                ) {
                    return [];
                } else {
                    const costForProduceUnit = focusUnit.getProduceUnitCost();
                    if (Helpers.getExisted(focusUnit.getCurrentProduceMaterial()) < 1) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0051)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else if (focusUnit.getLoadedUnitsCount() >= Helpers.getExisted(focusUnit.getMaxLoadUnitsCount())) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0052)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else if (Helpers.getExisted((this._getWar() as MultiPlayerWar.MpwWar).getPlayerLoggedIn()?.getFund()) < costForProduceUnit) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0053)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => this._setStateRequestingUnitProduceUnit(),
                            costForProduceUnit,
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
                            : () => PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                                content : Lang.getText(LangTextType.A0055),
                                callback: () => this._setStateRequestingUnitDropOnChooseAction(),
                            }),
                    }];
                } else {
                    return [{
                        actionType  : UnitActionType.Wait,
                        callback    : !hasOtherAction
                            ? () => this._setStateRequestingUnitWait()
                            : () => PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                                content : Lang.getText(LangTextType.A0055),
                                callback: () => this._setStateRequestingUnitWait(),
                            }),
                    }];
                }
            }
        }
    }
}

// export default TwnsMpwActionPlanner;
