
import TwnsBwActionPlanner      from "../../baseWar/model/BwActionPlanner";
import TwnsBwUnit               from "../../baseWar/model/BwUnit";
import TwnsBwProduceUnitPanel   from "../../baseWar/view/BwProduceUnitPanel";
import TwnsBwUnitActionsPanel   from "../../baseWar/view/BwUnitActionsPanel";
import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
import MpwProxy                 from "../../multiPlayerWar/model/MpwProxy";
import FloatText                from "../../tools/helpers/FloatText";
import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
import Logger                   from "../../tools/helpers/Logger";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import UserModel                from "../../user/model/UserModel";
import TwnsMpwWar               from "./MpwWar";

namespace TwnsMpwActionPlanner {
    import BwProduceUnitPanel   = TwnsBwProduceUnitPanel.BwProduceUnitPanel;
    import CommonConfirmPanel   = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import TurnPhaseCode        = Types.TurnPhaseCode;
    import UnitState            = Types.UnitActionState;
    import GridIndex            = Types.GridIndex;
    import State                = Types.ActionPlannerState;
    import UnitActionType       = Types.UnitActionType;
    import UnitType             = Types.UnitType;

    export class MpwActionPlanner extends TwnsBwActionPlanner.BwActionPlanner {
        private _getPlayerIndexLoggedIn(): number | undefined {
            const war = this._getWar();
            if (!(war instanceof TwnsMpwWar.MpwWar)) {
                Logger.error(`MpwActionPlanner._getPlayerIndexLoggedIn() empty war.`);
                return undefined;
            }
            return war.getPlayerIndexLoggedIn();
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

            const war = this._getWar();
            if (war == null) {
                Logger.error(`MpwActionPlanner._setStateChoosingProductionTargetOnTap() empty war.`);
                return;
            }

            BwProduceUnitPanel.show({
                gridIndex,
                war,
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting requesting state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
            const war = this._getWar();
            if (war == null) {
                Logger.error(`MpwActionPlanner.setStateRequestingPlayerProduceUnit() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner.setStateRequestingPlayerVoteForDraw() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitProduceUnit() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitBeLoaded() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitBeLoaded() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitUseCoSuperPower() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitUseCoPower() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitLoadCo() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitWait() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitAttackUnit() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
        }

        protected _setStateRequestingUnitAttackTile(targetGridIndex: GridIndex): void {
            const war = this._getWar();
            if (war == null) {
                Logger.error(`MpwActionPlanner._setStateRequestingUnitAttackTile() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
        }

        private _setStateRequestingUnitBuildTile(): void {
            const war = this._getWar();
            if (war == null) {
                Logger.error(`MpwActionPlanner._setStateRequestingUnitBuildTile() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitCaptureTile() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitDive() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitSurface() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitDropOnTap() empty unit.`);
                return;
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitDropOnTap() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitDropOnChooseAction() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitLaunchFlare() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitLaunchSilo() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner._setStateRequestingUnitSupply() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner.setStateRequestingPlayerEndTurn() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner.setStateRequestingPlayerSurrender() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner.setStateRequestingPlayerDeleteUnit() empty war.`);
                return;
            }

            const gridIndex = war.getCursor().getGridIndex();
            if (gridIndex == null) {
                Logger.error(`MpwActionPlanner.setStateRequestingPlayerDeleteUnit() empty gridIndex.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                Logger.error(`MpwActionPlanner.setStateRequestingPlayerUseCoSkill() empty war.`);
                return;
            }

            MpwProxy.reqMpwExecuteWarAction(war, {
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
                TwnsBwUnitActionsPanel.BwUnitActionsPanel.show(this._getDataForUnitActionsPanel());
            } else {
                TwnsBwUnitActionsPanel.BwUnitActionsPanel.hide();
            }
        }

        protected _checkCanControlUnit(unit: TwnsBwUnit.BwUnit): boolean {
            const war           = this._getWar();
            const playerInTurn  = war ? war.getPlayerInTurn() : undefined;
            if (playerInTurn == null) {
                Logger.error(`MpwActionPlanner._checkCanControlUnit() empty playerInTurn.`);
                return false;
            }

            return (playerInTurn.getUserId() === UserModel.getSelfUserId())
                && (playerInTurn.getPlayerIndex() === unit.getPlayerIndex());
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State {
            const selfPlayerIndex = this._getPlayerIndexLoggedIn();
            if (selfPlayerIndex == null) {
                Logger.error(`MpwActionPlanner._getNextStateOnTapWhenIdle() empty selfPlayerIndex.`);
                return State.Idle;
            }

            const turnManager       = this._getTurnManager();
            const unit              = this._getUnitMap().getUnitOnMap(gridIndex);
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
                const cursor                    = this.getCursor();
                const cursorPreviousGridIndex   = cursor ? cursor.getPreviousGridIndex() : null;
                if (cursorPreviousGridIndex == null) {
                    Logger.error(`MpwActionPlanner._getNextStateOnTapWhenChoosingAttackTarget() empty cursorPreviousGridIndex.`);
                    return State.Idle;
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
                    Logger.error(`MpwActionPlanner._getNextStateOnTapWhenChoosingDropDestination() empty focusUnit.`);
                    return State.Idle;
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
        protected _getActionUnitBeLoaded(): TwnsBwActionPlanner.DataForUnitAction[] {
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
        protected _getActionUnitJoin(): TwnsBwActionPlanner.DataForUnitAction[] {
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
        protected _getActionUnitUseCoSuperPower(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return !this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.SuperPower)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoSuperPower,
                        callback    : () => {
                            CommonConfirmPanel.show({
                                content : Lang.getText(LangTextType.A0058),
                                callback: () => this._setStateRequestingUnitUseCoSuperPower(),
                            });
                        },
                    }];
            }
        }
        protected _getActionUnitUseCoPower(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return !this.getFocusUnit().checkCanUseCoSkill(Types.CoSkillType.Power)
                    ? []
                    : [{
                        actionType  : UnitActionType.UseCoPower,
                        callback    : () => {
                            CommonConfirmPanel.show({
                                content : Lang.getText(LangTextType.A0054),
                                callback: () => this._setStateRequestingUnitUseCoPower(),
                            });
                        },
                    }];
            }
        }
        protected _getActionUnitLoadCo(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return this.getFocusUnit().checkCanLoadCoAfterMovePath(this.getMovePath())
                    ? [{ actionType: UnitActionType.LoadCo, callback: () => this._setStateRequestingUnitLoadCo() }]
                    : [];
            }
        }
        protected _getActionUnitCapture(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanCaptureTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.Capture, callback: () => this._setStateRequestingUnitCaptureTile() }]
                    : [];
            }
        }
        protected _getActionUnitDive(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanDive())
                    ? [{ actionType: UnitActionType.Dive, callback: () => this._setStateRequestingUnitDive() }]
                    : [];
            }
        }
        protected _getActionUnitSurface(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanSurface())
                    ? [{ actionType: UnitActionType.Surface, callback: () => this._setStateRequestingUnitSurface() }]
                    : [];
            }
        }
        protected _getActionUnitBuildTile(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                return (this.getFocusUnit().checkCanBuildOnTile(this._getTileMap().getTile(this.getMovePathDestination())))
                    ? [{ actionType: UnitActionType.BuildTile, callback: () => this._setStateRequestingUnitBuildTile() }]
                    : [];
            }
        }
        protected _getActionUnitSupply(): TwnsBwActionPlanner.DataForUnitAction[] {
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
        protected _getActionUnitProduceUnit(): TwnsBwActionPlanner.DataForUnitAction[] {
            if (this.getChosenUnitsForDrop().length) {
                return [];
            } else {
                const focusUnit = this.getFocusUnit();
                if (focusUnit == null) {
                    Logger.error(`MpwActionPlanner._getActionUnitProduceUnit() empty focusUnit.`);
                    return [];
                }

                const produceUnitType = focusUnit.getProduceUnitType();
                if ((this.getFocusUnitLoaded()) || (this.getMovePath().length !== 1) || (produceUnitType == null)) {
                    return [];
                } else {
                    const costForProduceUnit = focusUnit.getProduceUnitCost();
                    if (focusUnit.getCurrentProduceMaterial() < 1) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0051)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else if (focusUnit.getLoadedUnitsCount() >= focusUnit.getMaxLoadUnitsCount()) {
                        return [{
                            actionType          : UnitActionType.ProduceUnit,
                            callback            : () => FloatText.show(Lang.getText(LangTextType.B0052)),
                            costForProduceUnit,
                            produceUnitType,
                        }];
                    } else if ((this._getWar() as TwnsMpwWar.MpwWar).getPlayerLoggedIn().getFund() < costForProduceUnit) {
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
        protected _getActionUnitWait(hasOtherAction: boolean): TwnsBwActionPlanner.DataForUnitAction[] {
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
                                content : Lang.getText(LangTextType.A0055),
                                callback: () => this._setStateRequestingUnitDropOnChooseAction(),
                            }),
                    }];
                } else {
                    return [{
                        actionType  : UnitActionType.Wait,
                        callback    : !hasOtherAction
                            ? () => this._setStateRequestingUnitWait()
                            : () => CommonConfirmPanel.show({
                                content : Lang.getText(LangTextType.A0055),
                                callback: () => this._setStateRequestingUnitWait(),
                            }),
                    }];
                }
            }
        }
    }
}

export default TwnsMpwActionPlanner;
