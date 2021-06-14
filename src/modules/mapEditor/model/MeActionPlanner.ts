
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
        protected _getActionUnitBeLoaded(): BaseWar.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitJoin(): BaseWar.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitUseCoSuperPower(): BaseWar.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitUseCoPower(): BaseWar.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitLoadCo(): BaseWar.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitCapture(): BaseWar.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitDive(): BaseWar.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitSurface(): BaseWar.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitBuildTile(): BaseWar.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitSupply(): BaseWar.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitProduceUnit(): BaseWar.DataForUnitAction[] {
            return [];
        }
        protected _getActionUnitWait(hasOtherAction: boolean): BaseWar.DataForUnitAction[] {
            return [];
        }
    }
}
