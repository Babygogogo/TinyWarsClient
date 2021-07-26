
import WarCommonHelpers     from "./WarCommonHelpers";
import TwnsBwUnit           from "../../baseWar/model/BwUnit";
import TwnsBwWar            from "../../baseWar/model/BwWar";
import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
import CommonConstants      from "../helpers/CommonConstants";
import ConfigManager        from "../helpers/ConfigManager";
import GridIndexHelpers     from "../helpers/GridIndexHelpers";
import Types                from "../helpers/Types";
import ProtoTypes           from "../proto/ProtoTypes";
import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
import WarVisibilityHelpers from "./WarVisibilityHelpers";

namespace WarActionReviser {
    import TurnPhaseCode        = Types.TurnPhaseCode;
    import GridIndex            = Types.GridIndex;
    import DropDestination      = Types.DropDestination;
    import PlayerAliveState     = Types.PlayerAliveState;
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;
    import WarAction            = ProtoTypes.WarAction;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import BwUnitMap            = TwnsBwUnitMap.BwUnitMap;
    import BwWar                = TwnsBwWar.BwWar;

    type ErrorCodeAndAction = {
        errorCode   : ClientErrorCode;
        action?     : IWarActionContainer;
    };

    export function revise(war: BwWar, rawAction: IWarActionContainer): ErrorCodeAndAction {
        if (Object.keys(rawAction).length !== 2) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_Revise_00 };
        }

        const actionId = rawAction.actionId;
        if ((actionId == null) || (actionId !== war.getExecutedActionManager().getExecutedActionsCount())) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_Revise_01 };
        }

        const { errorCode, action } = doRevise(war, rawAction);
        if (errorCode) {
            return { errorCode };
        } else if (action == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_Revise_01 };
        }

        action.actionId = actionId;
        return {
            errorCode   : ClientErrorCode.NoError,
            action,
        };
    }

    function doRevise(war: BwWar, rawAction: IWarActionContainer): ErrorCodeAndAction {
        if      (rawAction.WarActionPlayerDeleteUnit)           { return revisePlayerDeleteUnit(war, rawAction.WarActionPlayerDeleteUnit); }
        else if (rawAction.WarActionPlayerEndTurn)              { return revisePlayerEndTurn(war, rawAction.WarActionPlayerEndTurn); }
        else if (rawAction.WarActionPlayerProduceUnit)          { return revisePlayerProduceUnit(war, rawAction.WarActionPlayerProduceUnit); }
        else if (rawAction.WarActionPlayerSurrender)            { return revisePlayerSurrender(war, rawAction.WarActionPlayerSurrender); }
        else if (rawAction.WarActionPlayerVoteForDraw)          { return revisePlayerVoteForDraw(war, rawAction.WarActionPlayerVoteForDraw); }
        else if (rawAction.WarActionPlayerUseCoSkill)           { return revisePlayerUseCoSkill(war, rawAction.WarActionPlayerUseCoSkill); }
        else if (rawAction.WarActionSystemBeginTurn)            { return reviseSystemBeginTurn(war, rawAction.WarActionSystemBeginTurn); }
        else if (rawAction.WarActionSystemCallWarEvent)         { return reviseSystemCallWarEvent(war, rawAction.WarActionSystemCallWarEvent); }
        else if (rawAction.WarActionSystemDestroyPlayerForce)   { return reviseSystemDestroyPlayerForce(war, rawAction.WarActionSystemDestroyPlayerForce); }
        else if (rawAction.WarActionSystemEndWar)               { return reviseSystemEndWar(war, rawAction.WarActionSystemEndWar); }
        else if (rawAction.WarActionSystemEndTurn)              { return reviseSystemEndTurn(war, rawAction.WarActionSystemEndTurn); }
        else if (rawAction.WarActionSystemHandleBootPlayer)     { return reviseSystemHandleBootPlayer(war, rawAction.WarActionSystemHandleBootPlayer); }
        else if (rawAction.WarActionUnitAttackTile)             { return reviseUnitAttackTile(war, rawAction.WarActionUnitAttackTile); }
        else if (rawAction.WarActionUnitAttackUnit)             { return reviseUnitAttackUnit(war, rawAction.WarActionUnitAttackUnit); }
        else if (rawAction.WarActionUnitBeLoaded)               { return reviseUnitBeLoaded(war, rawAction.WarActionUnitBeLoaded); }
        else if (rawAction.WarActionUnitBuildTile)              { return reviseUnitBuildTile(war, rawAction.WarActionUnitBuildTile); }
        else if (rawAction.WarActionUnitCaptureTile)            { return reviseUnitCaptureTile(war, rawAction.WarActionUnitCaptureTile); }
        else if (rawAction.WarActionUnitDive)                   { return reviseUnitDive(war, rawAction.WarActionUnitDive); }
        else if (rawAction.WarActionUnitDropUnit)               { return reviseUnitDropUnit(war, rawAction.WarActionUnitDropUnit); }
        else if (rawAction.WarActionUnitJoinUnit)               { return reviseUnitJoinUnit(war, rawAction.WarActionUnitJoinUnit); }
        else if (rawAction.WarActionUnitLaunchFlare)            { return reviseUnitLaunchFlare(war, rawAction.WarActionUnitLaunchFlare); }
        else if (rawAction.WarActionUnitLaunchSilo)             { return reviseUnitLaunchSilo(war, rawAction.WarActionUnitLaunchSilo); }
        else if (rawAction.WarActionUnitLoadCo)                 { return reviseUnitLoadCo(war, rawAction.WarActionUnitLoadCo); }
        else if (rawAction.WarActionUnitProduceUnit)            { return reviseUnitProduceUnit(war, rawAction.WarActionUnitProduceUnit); }
        else if (rawAction.WarActionUnitSupplyUnit)             { return reviseUnitSupplyUnit(war, rawAction.WarActionUnitSupplyUnit); }
        else if (rawAction.WarActionUnitSurface)                { return reviseUnitSurface(war, rawAction.WarActionUnitSurface); }
        else if (rawAction.WarActionUnitUseCoSkill)             { return reviseUnitUseCoSkill(war, rawAction.WarActionUnitUseCoSkill); }
        else if (rawAction.WarActionUnitWait)                   { return reviseUnitWait(war, rawAction.WarActionUnitWait); }
        else                                                    { return reviseUnknownAction(); }
    }

    function revisePlayerDeleteUnit(war: BwWar, rawAction: WarAction.IWarActionPlayerDeleteUnit): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerDeleteUnit_00 };
        }

        const gridIndex = GridIndexHelpers.convertGridIndex(rawAction.gridIndex);
        if (gridIndex == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerDeleteUnit_01 };
        }

        const playerIndexInTurn = war.getPlayerIndexInTurn();
        if (playerIndexInTurn == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerDeleteUnit_02 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerDeleteUnit_03 };
        }

        const unitMap   = war.getUnitMap();
        const focusUnit = unitMap.getUnitOnMap(gridIndex);
        if ((!focusUnit)                                                ||
            (focusUnit.getActionState() !== Types.UnitActionState.Idle) ||
            (focusUnit.getPlayerIndex() !== playerIndexInTurn)          ||
            (unitMap.countUnitsOnMapForPlayer(playerIndexInTurn) <= 1)
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerDeleteUnit_04 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionPlayerDeleteUnit   : {
                    gridIndex,
                },
            }
        };
    }

    function revisePlayerEndTurn(war: BwWar, rawAction: WarAction.IWarActionPlayerEndTurn): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerEndTurn_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerEndTurn_01 };
        }

        if ((war.getDrawVoteManager().getRemainingVotes() != null)  &&
            (!playerInTurn.getHasVotedForDraw())                    &&
            (!playerInTurn.checkIsNeutral())
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerEndTurn_02 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionPlayerEndTurn  : {},
            },
        };
    }

    function revisePlayerProduceUnit(war: BwWar, rawAction: WarAction.IWarActionPlayerProduceUnit): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_00 };
        }

        const unitHp = rawAction.unitHp;
        if ((unitHp == null) || (unitHp <= 0) || (unitHp > CommonConstants.UnitMaxHp)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_01 };
        }

        const unitMap   = war.getUnitMap();
        const mapSize   = unitMap.getMapSize();
        if (mapSize == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_02 };
        }

        const gridIndex = GridIndexHelpers.convertGridIndex(rawAction.gridIndex);
        if ((gridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_03 };
        }

        if (unitMap.getUnitOnMap(gridIndex)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_04 };
        }

        const playerInTurn      = war.getPlayerInTurn();
        const playerIndexInTurn = playerInTurn ? playerInTurn.getPlayerIndex() : null;
        if ((playerInTurn == null)                                      ||
            (playerInTurn.getAliveState() !== PlayerAliveState.Alive)   ||
            (playerIndexInTurn == null)                                 ||
            (playerIndexInTurn === CommonConstants.WarNeutralPlayerIndex)
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_05 };
        }

        const tile = war.getTileMap().getTile(gridIndex);
        if (tile == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_06 };
        }

        const unitType = rawAction.unitType;
        if (unitType == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_07 };
        }

        const configVersion = war.getConfigVersion();
        if (configVersion == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_08 };
        }

        const fund = playerInTurn.getFund();
        if (fund == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_09 };
        }

        const skillCfg              = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndexInTurn);
        const produceUnitCategory   = skillCfg
            ? skillCfg[1]
            : (playerIndexInTurn === tile.getPlayerIndex() ? tile.getCfgProduceUnitCategory() : null);
        if ((produceUnitCategory == null)                                                           ||
            (!ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, produceUnitCategory))
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_10 };
        }

        if ((skillCfg)                                      &&
            ((unitHp > skillCfg[4]) || (unitHp < skillCfg[3]))
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_11 };
        }
        if ((!skillCfg) && (unitHp !== CommonConstants.UnitMaxHp)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_12 };
        }

        const unitTemplateCfg   = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
        const cfgCost           = unitTemplateCfg ? unitTemplateCfg.productionCost : null;
        if (cfgCost == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_13 };
        }

        const cost = Math.floor(cfgCost * (skillCfg ? skillCfg[5] : 100) / 100 * WarCommonHelpers.getNormalizedHp(unitHp) / CommonConstants.UnitHpNormalizer);
        if (cost > fund) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerProduceUnit_14 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionPlayerProduceUnit: {
                    gridIndex,
                    unitHp,
                    unitType,
                },
            },
        };
    }

    function revisePlayerSurrender(war: BwWar, rawAction: WarAction.IWarActionPlayerSurrender): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerSurrender_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null)                                                      ||
            (playerInTurn.getPlayerIndex() === CommonConstants.WarNeutralPlayerIndex)   ||
            (playerInTurn.getAliveState() !== PlayerAliveState.Alive)
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerSurrender_01 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionPlayerSurrender: {
                },
            },
        };
    }

    function revisePlayerVoteForDraw(war: BwWar, rawAction: WarAction.IWarActionPlayerVoteForDraw): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerVoteForDraw_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerVoteForDraw_01 };
        }

        if ((playerInTurn.getPlayerIndex() === CommonConstants.WarNeutralPlayerIndex) ||
            (playerInTurn.getHasVotedForDraw())
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerVoteForDraw_02 };
        }

        const isAgree = rawAction.isAgree;
        if ((isAgree == null)                                                   ||
            ((war.getDrawVoteManager().getRemainingVotes() == null) && (!isAgree))
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerVoteForDraw_03 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionPlayerVoteForDraw: {
                    isAgree,
                },
            },
        };
    }

    function revisePlayerUseCoSkill(war: BwWar, rawAction: WarAction.IWarActionPlayerUseCoSkill): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerUseCoSkill_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null)                                                      ||
            (playerInTurn.getPlayerIndex() === CommonConstants.WarNeutralPlayerIndex)   ||
            (playerInTurn.getAliveState() !== PlayerAliveState.Alive)
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerUseCoSkill_01 };
        }

        const skillType = rawAction.skillType;
        if (!playerInTurn.checkCanUseCoSkill(skillType)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_RevisePlayerUseCoSkill_02 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionPlayerUseCoSkill: {
                    skillType,
                },
            },
        };
    }

    function reviseSystemBeginTurn(war: BwWar, rawAction: WarAction.IWarActionSystemBeginTurn): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.WaitBeginTurn) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseSystemBeginTurn_00 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionSystemBeginTurn: {
                },
            },
        };
    }

    function reviseSystemCallWarEvent(war: BwWar, rawAction: WarAction.IWarActionSystemCallWarEvent): ErrorCodeAndAction {
        const warEventId = rawAction.warEventId;
        if (warEventId == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseSystemCallWarEvent_00 };
        }

        if (warEventId !== war.getWarEventManager().getCallableWarEventId()) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseSystemCallWarEvent_01 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionSystemCallWarEvent: {
                    warEventId,
                },
            },
        };
    }

    function reviseSystemDestroyPlayerForce(war: BwWar, rawAction: WarAction.IWarActionSystemDestroyPlayerForce): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseSystemDestroyPlayerForce_00 };
        }

        const targetPlayerIndex = rawAction.targetPlayerIndex;
        if ((targetPlayerIndex == null) || (targetPlayerIndex === CommonConstants.WarNeutralPlayerIndex)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseSystemDestroyPlayerForce_01 };
        }

        const player = war.getPlayer(targetPlayerIndex);
        if ((player == null) || (player.getAliveState() !== PlayerAliveState.Dying)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseSystemDestroyPlayerForce_02 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionSystemDestroyPlayerForce: {
                    targetPlayerIndex,
                },
            },
        };
    }

    function reviseSystemEndWar(war: BwWar, rawAction: WarAction.IWarActionSystemEndWar): ErrorCodeAndAction {
        if (!war.checkCanEnd()) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseSystemEndWar_00 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionSystemEndWar: {
                },
            },
        };
    }

    function reviseSystemEndTurn(war: BwWar, rawAction: WarAction.IWarActionSystemEndTurn): ErrorCodeAndAction {
        const playerInTurn = war.getPlayerInTurn();
        if (playerInTurn == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseSystemEndTurn_00 };
        }

        if (war.getTurnPhaseCode() !== Types.TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseSystemEndTurn_01 };
        }

        if ((playerInTurn.getPlayerIndex() !== CommonConstants.WarNeutralPlayerIndex)   &&
            (playerInTurn.getAliveState() !== Types.PlayerAliveState.Dead)
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseSystemEndTurn_02 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionSystemEndTurn: {
                },
            },
        };
    }

    function reviseSystemHandleBootPlayer(war: BwWar, rawAction: WarAction.IWarActionSystemHandleBootPlayer): ErrorCodeAndAction {
        if (!war.checkIsBoot()) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseSystemHandleBootPlayer_00 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionSystemHandleBootPlayer: {
                },
            },
        };
    }

    function reviseUnitAttackTile(war: BwWar, rawAction: WarAction.IWarActionUnitAttackTile): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackTile_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackTile_01 };
        }

        const tileMap = war.getTileMap();
        const mapSize = tileMap.getMapSize();
        if (mapSize == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackTile_02 };
        }

        const targetGridIndex = GridIndexHelpers.convertGridIndex(rawAction.targetGridIndex);
        if ((targetGridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, mapSize))) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackTile_03 };
        }

        const unitMap = war.getUnitMap();
        if (unitMap.getUnitOnMap(targetGridIndex)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackTile_04 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackTile_05 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackTile_06 };
        }

        const attackerUnit = unitMap.getUnit(revisedPath.nodes[0], launchUnitId);
        if (attackerUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackTile_07 };
        }
        if (!attackerUnit.checkCanAttackTargetAfterMovePath(rawPathNodes, targetGridIndex)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackTile_08 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitAttackTile : {
                    path    : revisedPath,
                    launchUnitId,
                    targetGridIndex,
                },
            },
        };
    }

    function reviseUnitAttackUnit(war: BwWar, rawAction: WarAction.IWarActionUnitAttackUnit): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackUnit_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackUnit_01 };
        }

        const unitMap = war.getUnitMap();
        const mapSize = unitMap.getMapSize();
        if (mapSize == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackUnit_02 };
        }

        const targetGridIndex = GridIndexHelpers.convertGridIndex(rawAction.targetGridIndex);
        if ((targetGridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, mapSize))) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackUnit_03 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackUnit_04 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackUnit_05 };
        }

        const attackerUnit = unitMap.getUnit(revisedPath.nodes[0], launchUnitId);
        if (attackerUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackUnit_06 };
        }
        if (!attackerUnit.checkCanAttackTargetAfterMovePath(rawPathNodes, targetGridIndex)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitAttackUnit_07 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitAttackUnit : {
                    path            : revisedPath,
                    launchUnitId,
                    targetGridIndex,
                },
            },
        };
    }

    function reviseUnitBeLoaded(war: BwWar, rawAction: WarAction.IWarActionUnitBeLoaded): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitBeLoaded_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitBeLoaded_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitBeLoaded_02 };
        }

        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(revisedPath.nodes[0], launchUnitId);
        if (focusUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitBeLoaded_03 };
        }

        const rawPathNodes  = rawPath ? rawPath.nodes || [] : [];
        const destination   = rawPathNodes[rawPathNodes.length - 1] as GridIndex;
        const loaderUnit    = unitMap.getUnitOnMap(destination);
        if ((rawPathNodes.length <= 1)              ||
            (!loaderUnit)                           ||
            (!loaderUnit.checkCanLoadUnit(focusUnit))
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitBeLoaded_04 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitBeLoaded: {
                    path        : revisedPath,
                    launchUnitId,
                },
            },
        };
    }

    function reviseUnitBuildTile(war: BwWar, rawAction: WarAction.IWarActionUnitBuildTile): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitBuildTile_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitBuildTile_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitBuildTile_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitBuildTile_03 };
        }

        const tile = war.getTileMap().getTile(rawPathNodes[rawPathNodes.length - 1]);
        if (tile == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitBuildTile_04 };
        }

        const focusUnit = war.getUnitMap().getUnit(rawPathNodes[0], launchUnitId);
        if ((focusUnit == null) || (!focusUnit.checkCanBuildOnTile(tile))) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitBuildTile_05 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitBuildTile  : {
                    path        : revisedPath,
                    launchUnitId,
                },
            },
        };
    }

    function reviseUnitCaptureTile(war: BwWar, rawAction: WarAction.IWarActionUnitCaptureTile): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitCaptureTile_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitCaptureTile_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitCaptureTile_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitCaptureTile_03 };
        }

        const focusUnit = war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId);
        if (focusUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitCaptureTile_04 };
        }

        const tile = war.getTileMap().getTile(rawPathNodes[rawPathNodes.length - 1]);
        if (tile == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitCaptureTile_05 };
        }

        if (!focusUnit.checkCanCaptureTile(tile)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitCaptureTile_06 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitCaptureTile: {
                    path        : revisedPath,
                    launchUnitId,
                },
            },
        };
    }

    function reviseUnitDive(war: BwWar, rawAction: WarAction.IWarActionUnitDive): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDive_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDive_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDive_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDive_03 };
        }

        const focusUnit = war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId);
        if (focusUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDive_04 };
        }

        if (!focusUnit.checkCanDive()) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDive_05 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitDive   : {
                    path        : revisedPath,
                    launchUnitId,
                },
            },
        };
    }

    function reviseUnitDropUnit(war: BwWar, rawAction: WarAction.IWarActionUnitDropUnit): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDropUnit_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDropUnit_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDropUnit_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDropUnit_03 };
        }

        const focusUnit = war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId);
        if (focusUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDropUnit_04 };
        }

        const dropDestinations = rawAction.dropDestinations;
        if ((!dropDestinations) || (!checkIsDropDestinationsValid(war, rawAction))) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitDropUnit_05 };
        }

        const revisedDropDestinations   = getRevisedDropDestinations(war, rawAction, revisedPath);
        const isDropBlocked             =  (!revisedPath.isBlocked) && (revisedDropDestinations.length < dropDestinations.length);
        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitDropUnit   : {
                    path            : revisedPath,
                    launchUnitId,
                    dropDestinations: revisedDropDestinations,
                    isDropBlocked,
                },
            },
        };
    }

    function reviseUnitJoinUnit(war: BwWar, rawAction: WarAction.IWarActionUnitJoinUnit): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitJoinUnit_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitJoinUnit_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitJoinUnit_02 };
        }

        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(revisedPath.nodes[0], launchUnitId);
        if (focusUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitJoinUnit_03 };
        }

        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        const existingUnit  = unitMap.getUnitOnMap(rawPathNodes[rawPathNodes.length - 1]);
        if ((!existingUnit) || (!focusUnit.checkCanJoinUnit(existingUnit))) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitJoinUnit_04 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitJoinUnit   : {
                    path        : revisedPath,
                    launchUnitId,
                },
            },
        };
    }

    function reviseUnitLaunchFlare(war: BwWar, rawAction: WarAction.IWarActionUnitLaunchFlare): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchFlare_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchFlare_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchFlare_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchFlare_03 };
        }

        const unitMap   = war.getUnitMap();
        const focusUnit = unitMap.getUnit(revisedPath.nodes[0], launchUnitId);
        if (focusUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchFlare_04 };
        }

        const mapSize = unitMap.getMapSize();
        if (mapSize == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchFlare_05 };
        }

        const flareMaxRange = focusUnit.getFlareMaxRange();
        if (flareMaxRange == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchFlare_06 };
        }

        const targetGridIndex = GridIndexHelpers.convertGridIndex(rawAction.targetGridIndex);
        if (targetGridIndex == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchFlare_07 };
        }

        if ((rawPathNodes.length !== 1)                                                     ||
            (!focusUnit.getFlareCurrentAmmo())                                              ||
            (!war.getFogMap().checkHasFogCurrently())                                       ||
            (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, mapSize))                  ||
            (GridIndexHelpers.getDistance(targetGridIndex, revisedPath.nodes[0]) > flareMaxRange)
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchFlare_08 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitLaunchFlare: {
                    path            : revisedPath,
                    launchUnitId,
                    targetGridIndex,
                },
            },
        };
    }

    function reviseUnitLaunchSilo(war: BwWar, rawAction: WarAction.IWarActionUnitLaunchSilo): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchSilo_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchSilo_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchSilo_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchSilo_03 };
        }

        const unitMap   = war.getUnitMap();
        const focusUnit = unitMap.getUnit(revisedPath.nodes[0], launchUnitId);
        if (focusUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchSilo_04 };
        }

        const mapSize = unitMap.getMapSize();
        if (mapSize == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchSilo_05 };
        }

        const tile = war.getTileMap().getTile(rawPathNodes[rawPathNodes.length - 1]);
        if ((tile == null) || (!focusUnit.checkCanLaunchSiloOnTile(tile))) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchSilo_06 };
        }

        const targetGridIndex = GridIndexHelpers.convertGridIndex(rawAction.targetGridIndex);
        if ((targetGridIndex == null)                                       ||
            (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, mapSize))
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLaunchSilo_07 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitLaunchSilo : {
                    path            : revisedPath,
                    launchUnitId,
                    targetGridIndex,
                },
            },
        };
    }

    function reviseUnitLoadCo(war: BwWar, rawAction: WarAction.IWarActionUnitLoadCo): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLoadCo_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLoadCo_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLoadCo_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLoadCo_03 };
        }

        const focusUnit = war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId);
        if ((focusUnit == null) || (!focusUnit.checkCanLoadCoAfterMovePath(rawPathNodes))) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitLoadCo_04 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitLoadCo : {
                    path        : revisedPath,
                    launchUnitId,
                },
            },
        };
    }

    function reviseUnitProduceUnit(war: BwWar, rawAction: WarAction.IWarActionUnitProduceUnit): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitProduceUnit_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitProduceUnit_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitProduceUnit_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitProduceUnit_03 };
        }

        const focusUnit = war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId);
        if (focusUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitProduceUnit_04 };
        }

        const fund = playerInTurn.getFund();
        if (fund == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitProduceUnit_05 };
        }

        const cost          = focusUnit.getProduceUnitCost();
        const maxLoadCount  = focusUnit.getMaxLoadUnitsCount();
        if ((launchUnitId != null)                          ||
            (rawPathNodes.length !== 1)                     ||
            (!focusUnit.getCurrentProduceMaterial())        ||
            (cost == null)                                  ||
            (cost > fund)                                   ||
            (maxLoadCount == null)                          ||
            (focusUnit.getLoadedUnitsCount() >= maxLoadCount)
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitProduceUnit_06 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitProduceUnit    : {
                    path        : revisedPath,
                    launchUnitId,
                },
            },
        };
    }

    function reviseUnitSupplyUnit(war: BwWar, rawAction: WarAction.IWarActionUnitSupplyUnit): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSupplyUnit_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSupplyUnit_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSupplyUnit_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSupplyUnit_03 };
        }

        const unitMap   = war.getUnitMap();
        const focusUnit = unitMap.getUnit(revisedPath.nodes[0], launchUnitId);
        if (focusUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSupplyUnit_04 };
        }

        if (!checkCanDoSupply(unitMap, focusUnit, rawPathNodes[rawPathNodes.length - 1])) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSupplyUnit_05 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitSupplyUnit : {
                    path        : revisedPath,
                    launchUnitId,
                },
            },
        };
    }

    function reviseUnitSurface(war: BwWar, rawAction: WarAction.IWarActionUnitSurface): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSurface_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSurface_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSurface_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSurface_03 };
        }

        const focusUnit = war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId);
        if (focusUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSurface_04 };
        }

        if (!focusUnit.checkCanSurface()) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitSurface_05 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitSurface: {
                    path        : revisedPath,
                    launchUnitId,
                },
            },
        };
    }

    function reviseUnitUseCoSkill(war: BwWar, rawAction: WarAction.IWarActionUnitUseCoSkill): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitUseCoSkill_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitUseCoSkill_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitUseCoSkill_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitUseCoSkill_03 };
        }

        const focusUnit = war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId);
        if (focusUnit == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitUseCoSkill_04 };
        }

        const skillType = rawAction.skillType as Types.CoSkillType;
        if ((skillType !== Types.CoSkillType.Power)     &&
            (skillType !== Types.CoSkillType.SuperPower)
        ) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitUseCoSkill_05 };
        }

        if (!focusUnit.checkCanUseCoSkill(skillType)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitUseCoSkill_06 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitUseCoSkill : {
                    path        : revisedPath,
                    launchUnitId,
                    skillType,
                },
            },
        };
    }

    function reviseUnitWait(war: BwWar, rawAction: WarAction.IWarActionUnitWait): ErrorCodeAndAction {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitWait_00 };
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitWait_01 };
        }

        const rawPath                                               = rawAction.path;
        const launchUnitId                                          = rawAction.launchUnitId;
        const { errorCode: errorCodeForRevisedPath, revisedPath }   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        if (errorCodeForRevisedPath) {
            return { errorCode: errorCodeForRevisedPath };
        } else if (revisedPath == null) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitWait_02 };
        }

        const rawPathNodes = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            return { errorCode: ClientErrorCode.BwWarActionReviser_ReviseUnitWait_03 };
        }

        return {
            errorCode   : ClientErrorCode.NoError,
            action      : {
                WarActionUnitWait   : {
                    path        : revisedPath,
                    launchUnitId,
                },
            },
        };
    }

    function reviseUnknownAction(): ErrorCodeAndAction {
        return {
            errorCode   : ClientErrorCode.BwWarActionReviser_ReviseUnknownAction_00,
            action      : undefined,
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function checkIsDropDestinationsValid(war: BwWar, action: WarAction.IWarActionUnitDropUnit): boolean | undefined {
        const destinations = action.dropDestinations;
        if (destinations == null) {
            return false;
        }

        const destinationsCount = destinations.length;
        if (destinationsCount <= 0) {
            return false;
        }

        const path = action.path;
        if (path == null) {
            return false;
        }

        const unitMap       = war.getUnitMap();
        const pathNodes     = (path.nodes || []) as GridIndex[];
        const loaderUnit    = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        if (loaderUnit == null) {
            return false;
        }

        const tileMap                   = war.getTileMap();
        const loaderEndingGridIndex     = pathNodes[pathNodes.length - 1];
        const loaderEndingTile          = tileMap.getTile(loaderEndingGridIndex);
        if (loaderEndingTile == null) {
            return false;
        }

        const loaderEndingTileType = loaderEndingTile.getType();
        if (loaderEndingTileType == null) {
            return false;
        }
        if (!loaderUnit.checkCanDropLoadedUnit(loaderEndingTileType)) {
            return false;
        }

        const mapSize = tileMap.getMapSize();
        if (mapSize == null) {
            return false;
        }

        const loaderUnitId  = loaderUnit.getUnitId();
        const teamIndex     = loaderUnit.getTeamIndex();
        if (teamIndex == null) {
            return false;
        }

        for (let i = 0; i < destinationsCount; ++i) {
            const data              = destinations[i];
            const droppingGridIndex = GridIndexHelpers.convertGridIndex(data.gridIndex);
            if ((!droppingGridIndex)                                                        ||
                (!GridIndexHelpers.checkIsInsideMap(droppingGridIndex, mapSize))            ||
                (!GridIndexHelpers.checkIsAdjacent(droppingGridIndex, loaderEndingGridIndex))
            ) {
                return false;
            }

            const droppingUnitId = data.unitId;
            if (droppingUnitId == null) {
                return false;
            }

            const dropTargetTile = tileMap.getTile(droppingGridIndex);
            if (dropTargetTile == null) {
                return false;
            }

            const droppingUnit = unitMap.getUnitLoadedById(droppingUnitId);
            if ((droppingUnit == null)                                      ||
                (droppingUnit.getLoaderUnitId() !== loaderUnitId)           ||
                (loaderEndingTile.getMoveCostByUnit(droppingUnit) == null)  ||
                (dropTargetTile.getMoveCostByUnit(droppingUnit) == null)
            ) {
                return false;
            }

            const existingUnit = unitMap.getUnitOnMap(droppingGridIndex);
            if ((existingUnit) && (existingUnit !== loaderUnit)) {
                const unitType = existingUnit.getUnitType();
                if (unitType == null) {
                    return false;
                }

                const isDiving = existingUnit.getIsDiving();
                if (isDiving == null) {
                    return false;
                }

                const unitPlayerIndex = existingUnit.getPlayerIndex();
                if (unitPlayerIndex == null) {
                    return false;
                }

                if (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                    war,
                    gridIndex           : droppingGridIndex,
                    unitType,
                    isDiving,
                    unitPlayerIndex,
                    observerTeamIndex   : teamIndex,
                })) {
                    return false;
                }
            }

            for (let j = i + 1; j < destinationsCount; ++j) {
                const nextData  = destinations[j];
                const gridIndex = GridIndexHelpers.convertGridIndex(nextData.gridIndex);
                if ((!gridIndex)                                                    ||
                    (droppingUnitId === nextData.unitId)                            ||
                    (GridIndexHelpers.checkIsEqual(droppingGridIndex, gridIndex))
                ) {
                    return false;
                }
            }
        }

        return true;
    }

    function getRevisedDropDestinations(war: BwWar, action: WarAction.IWarActionUnitDropUnit, revisedPath: Types.MovePath): DropDestination[] {
        const destinations: DropDestination[] = [];
        if (!revisedPath.isBlocked) {
            const unitMap       = war.getUnitMap();
            const loaderUnit    = unitMap.getUnit(revisedPath.nodes[0], action.launchUnitId);
            for (const raw of action.dropDestinations as DropDestination[]) {
                const existingUnit = unitMap.getUnitOnMap(raw.gridIndex);
                if ((existingUnit) && (existingUnit !== loaderUnit)) {
                    break;
                } else {
                    destinations.push(raw);
                }
            }
        }
        return destinations;
    }

    function checkCanDoSupply(unitMap: BwUnitMap, focusUnit: TwnsBwUnit.BwUnit, destination: GridIndex): boolean {
        if (focusUnit.checkIsAdjacentUnitSupplier()) {
            const mapSize = unitMap.getMapSize();
            if (mapSize == null) {
                return false;
            }

            const playerIndex = focusUnit.getPlayerIndex();
            for (const gridIndex of GridIndexHelpers.getAdjacentGrids(destination, mapSize)) {
                const unit = unitMap.getUnitOnMap(gridIndex);
                if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                    return true;
                }
            }
        }

        return false;
    }
}

export default WarActionReviser;
