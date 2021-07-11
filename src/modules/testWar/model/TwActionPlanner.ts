
import { BwUnit }                               from "../../baseWar/model/BwUnit";
import { BwActionPlanner, DataForUnitAction }   from "../../baseWar/model/BwActionPlanner";
import * as Types                               from "../../../utility/Types";
import GridIndex                                = Types.GridIndex;
import State                                    = Types.ActionPlannerState;

export class TwActionPlanner extends BwActionPlanner {
    private _getPlayerIndexInTurn(): number {
        return this._getWar().getPlayerIndexInTurn();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for setting common state.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected _setStateChoosingProductionTargetOnTap(gridIndex: GridIndex): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for setting requesting state.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected _setStateRequestingUnitAttackUnit(targetGridIndex: GridIndex): void {
        // nothing to do
    }

    protected _setStateRequestingUnitAttackTile(targetGridIndex: GridIndex): void {
        // nothing to do
    }

    protected _setStateRequestingUnitDropOnTap(gridIndex: GridIndex): void {
        // nothing to do
    }

    protected _setStateRequestingUnitLaunchFlare(gridIndex: GridIndex): void {
        // nothing to do
    }

    protected _setStateRequestingUnitLaunchSilo(gridIndex: GridIndex): void {
        // nothing to do
    }

    public setStateRequestingPlayerProduceUnit(gridIndex: GridIndex, unitType: Types.UnitType, unitHp: number): void {
        // nothing to do
    }

    public setStateRequestingPlayerEndTurn(): void {
        // nothing to do
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    protected _updateView(): void {
        // nothing to do
    }

    protected _checkCanControlUnit(unit: BwUnit): boolean {
        const playerInTurn = this._getWar().getPlayerInTurn();
        return (unit.getPlayerIndex() === playerInTurn.getPlayerIndex())
            && (playerInTurn.getUserId() != null);
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
    protected _getActionUnitBeLoaded(): DataForUnitAction[] {
        return [];
    }
    protected _getActionUnitJoin(): DataForUnitAction[] {
        return [];
    }
    protected _getActionUnitUseCoSuperPower(): DataForUnitAction[] {
        return [];
    }
    protected _getActionUnitUseCoPower(): DataForUnitAction[] {
        return [];
    }
    protected _getActionUnitLoadCo(): DataForUnitAction[] {
        return [];
    }
    protected _getActionUnitCapture(): DataForUnitAction[] {
        return [];
    }
    protected _getActionUnitDive(): DataForUnitAction[] {
        return [];
    }
    protected _getActionUnitSurface(): DataForUnitAction[] {
        return [];
    }
    protected _getActionUnitBuildTile(): DataForUnitAction[] {
        return [];
    }
    protected _getActionUnitSupply(): DataForUnitAction[] {
        return [];
    }
    protected _getActionUnitProduceUnit(): DataForUnitAction[] {
        return [];
    }
    protected _getActionUnitWait(hasOtherAction: boolean): DataForUnitAction[] {
        return [];
    }
}
