
namespace TinyWars.SingleCustomWar {
    import Types                = Utility.Types;
    import DamageCalculator     = Utility.DamageCalculator;
    import Lang                 = Utility.Lang;
    import ActionPlannerState   = Types.ActionPlannerState;

    export class ScwCursorView extends BaseWar.BwCursorView {
        protected _updateConForDamage(): void {
            const actionPlanner = this._getActionPlanner();
            if (actionPlanner) {
                const con           = this._getConForDamage();
                const cursor        = this._getCursor();
                const gridIndex     = cursor.getGridIndex();
                const labelDamage   = this._getLabelDamage();
                const state         = actionPlanner.getState();

                if (state === ActionPlannerState.Idle) {
                    con.visible = false;

                } else if (state === ActionPlannerState.ExecutingAction) {
                    con.visible = false;

                } else if (state === ActionPlannerState.MakingMovePath) {
                    const war                           = cursor.getWar() as ScwWar;
                    const focusUnitLoaded               = actionPlanner.getFocusUnitLoaded();
                    const [attackDamage, counterDamage] = DamageCalculator.getEstimatedBattleDamage(
                        war,
                        actionPlanner.getMovePath(),
                        focusUnitLoaded ? focusUnitLoaded.getUnitId() : undefined,
                        gridIndex
                    );
                    if (attackDamage == null) {
                        con.visible = false;
                    } else {
                        con.visible = true;
                        const target = war.getUnitMap().getUnitOnMap(gridIndex) || war.getTileMap().getTile(gridIndex);
                        labelDamage.text = `${Lang.getText(Lang.Type.B0077)}: ${attackDamage} / ${target.getCurrentHp()}\n`
                            + `${Lang.getText(Lang.Type.B0078)}: ${counterDamage == null ? `---` : counterDamage} / ${(actionPlanner.getFocusUnit()).getCurrentHp()}`;
                    }

                } else if (state === ActionPlannerState.ChoosingAction) {
                    con.visible = false;

                } else if (state === ActionPlannerState.ChoosingAttackTarget) {
                    const war                           = cursor.getWar() as ScwWar;
                    const focusUnitLoaded               = actionPlanner.getFocusUnitLoaded();
                    const [attackDamage, counterDamage] = DamageCalculator.getEstimatedBattleDamage(
                        war,
                        actionPlanner.getMovePath(),
                        focusUnitLoaded ? focusUnitLoaded.getUnitId() : undefined,
                        gridIndex
                    );
                    if (attackDamage == null) {
                        con.visible = false;
                    } else {
                        con.visible         = true;
                        const target        = war.getUnitMap().getUnitOnMap(gridIndex) || war.getTileMap().getTile(gridIndex);
                        labelDamage.text    = `${Lang.getText(Lang.Type.B0077)}: ${attackDamage} / ${target.getCurrentHp()}\n`
                            + `${Lang.getText(Lang.Type.B0078)}: ${counterDamage == null ? `---` : counterDamage} / ${(actionPlanner.getFocusUnit()).getCurrentHp()}`;
                    }

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
