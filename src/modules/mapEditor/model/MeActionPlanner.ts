
namespace TinyWars.MapEditor {
    import Types                = Utility.Types;
    import GridIndex            = Types.GridIndex;
    import State                = Types.ActionPlannerState;

    export class MeActionPlanner extends BaseWar.BwActionPlanner {
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for setting common state.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _setStateChoosingProductionTargetOnTap(gridIndex: GridIndex): void {
        }

        protected _setStateRequestingUnitAttackUnit(gridIndex: GridIndex): void {
        }

        protected _setStateRequestingUnitAttackTile(gridIndex: GridIndex): void {
        }

        protected _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void {
        }

        protected _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void {
        }

        protected _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void {
        }

        public setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: Types.UnitType, unitHp: number): void {
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _updateView(): void {
        }

        protected _checkCanControlUnit(unit: BaseWar.BwUnit): boolean {
            return false;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for getting the next state when the player inputs.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getNextStateOnTapWhenIdle(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenChoosingAttackTarget(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenChoosingDropDestination(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenChoosingFlareDestination(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenChoosingSiloDestination(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenChoosingProductionTarget(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenPreviewingAttackableArea(gridIndex: GridIndex): State {
            return State.Idle;
        }
        protected _getNextStateOnTapWhenPreviewingMovableArea(gridIndex: GridIndex): State {
            return State.Idle;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for generating actions for the focused unit.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected _getActionUnitBeLoaded(): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
        protected _getActionUnitJoin(): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
        protected _getActionUnitUseCoSuperPower(): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
        protected _getActionUnitUseCoPower(): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
        protected _getActionUnitLoadCo(): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
        protected _getActionUnitCapture(): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
        protected _getActionUnitDive(): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
        protected _getActionUnitSurface(): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
        protected _getActionUnitBuildTile(): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
        protected _getActionUnitSupply(): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
        protected _getActionUnitProduceUnit(): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
        protected _getActionUnitWait(hasOtherAction: boolean): BaseWar.DataForUnitActionRenderer[] {
            return [];
        }
    }
}
