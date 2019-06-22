
namespace TinyWars.Replay {
    import Types                = Utility.Types;
    import ActionPlannerState   = Types.ActionPlannerState;

    export class ReplayCursorView extends BaseWar.BwCursorView {
        protected _updateConForDamage(): void {
            const actionPlanner = this._getActionPlanner();
            if (actionPlanner) {
                const con       = this._getConForDamage();
                const gridIndex = this._getCursor().getGridIndex();
                const state     = actionPlanner.getState();

                if (state === ActionPlannerState.Idle) {
                    con.visible = false;

                } else if (state === ActionPlannerState.ExecutingAction) {
                    con.visible = false;

                } else if (state === ActionPlannerState.MakingMovePath) {
                    con.visible = false;

                } else if (state === ActionPlannerState.ChoosingAction) {
                    con.visible = false;

                } else if (state === ActionPlannerState.ChoosingAttackTarget) {
                    con.visible = false;

                } else if (state === ActionPlannerState.ChoosingDropDestination) {
                    con.visible = false;

                } else if (state === ActionPlannerState.ChoosingFlareDestination) {
                    con.visible = false;

                } else if (state === ActionPlannerState.ChoosingSiloDestination) {
                    con.visible = false;

                } else if (state === ActionPlannerState.ChoosingProductionTarget) {
                    con.visible = false;

                } else if (state === ActionPlannerState.PreviewingAttackableArea) {
                    con.visible = false;

                } else if (state === ActionPlannerState.PreviewingMovableArea) {
                    con.visible = false;

                } else {
                    // TODO
                }
            }
        }
    }
}
