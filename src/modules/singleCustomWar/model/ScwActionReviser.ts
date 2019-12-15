
namespace TinyWars.SingleCustomWar.ScwActionReviser {
    import Types            = Utility.Types;
    import WarActionCodes   = Utility.WarActionCodes;
    import Helpers          = Utility.Helpers;
    import Logger           = Utility.Logger;
    import TurnPhaseCode    = Types.TurnPhaseCode;
    import WarAction        = Types.WarActionContainer;

    const REVISERS: { [warActionCode: number]: (war: ScwWar, rawAction: WarAction) => WarAction } = {
        [WarActionCodes.WarActionPlayerBeginTurn]   : reviseScwPlayerBeginTurn,
        [WarActionCodes.WarActionPlayerDeleteUnit]  : reviseScwPlayerDeleteUnit,
        [WarActionCodes.WarActionPlayerEndTurn]     : reviseScwPlayerEndTurn,
        // [WarActionCodes.WarActionPlayerProduceUnit] : reviseScwPlayerProduceUnit,
        // [WarActionCodes.WarActionUnitAttack]        : reviseScwUnitAttack,
        // [WarActionCodes.WarActionUnitBeLoaded]      : reviseScwUnitBeLoaded,
        // [WarActionCodes.WarActionUnitBuildTile]     : reviseScwUnitBuildTile,
        // [WarActionCodes.WarActionUnitCaptureTile]   : reviseScwUnitCaptureTile,
        // [WarActionCodes.WarActionUnitDive]          : reviseScwUnitDive,
        // [WarActionCodes.WarActionUnitDrop]          : reviseScwUnitDrop,
        // [WarActionCodes.WarActionUnitJoin]          : reviseScwUnitJoin,
        // [WarActionCodes.WarActionUnitLaunchFlare]   : reviseScwUnitLaunchFlare,
        // [WarActionCodes.WarActionUnitLaunchSilo]    : reviseScwUnitLaunchSilo,
        // [WarActionCodes.WarActionUnitLoadCo]        : reviseScwUnitLoadCo,
        // [WarActionCodes.WarActionUnitProduceUnit]   : reviseScwUnitProduceUnit,
        // [WarActionCodes.WarActionUnitSupply]        : reviseScwUnitSupply,
        // [WarActionCodes.WarActionUnitSurface]       : reviseScwUnitSurface,
        // [WarActionCodes.WarActionUnitUseCoSkill]    : reviseScwUnitUseCoSkill,
        // [WarActionCodes.WarActionUnitWait]          : reviseScwUnitWait,
    };

    function reviseScwPlayerBeginTurn(war: ScwWar, rawAction: WarAction): WarAction {
        // TODO
        return null;
    }

    function reviseScwPlayerDeleteUnit(war: ScwWar, rawAction: WarAction): WarAction {
        // TODO
        return null;
    }

    function reviseScwPlayerEndTurn(war: ScwWar, rawAction: WarAction): WarAction { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseScwPlayerEndTurn() invalid turn phase code: ${currPhaseCode}`
        );

        return {
            actionId                : war.getNextActionId(),
            WarActionPlayerEndTurn  : {}
        };
    }

    export function revise(war: ScwWar, rawAction: WarAction): WarAction {
        return REVISERS[Helpers.getWarActionCode(rawAction)](war, rawAction);
    }
}
