
// import TwnsBwUnit           from "../../baseWar/model/BwUnit";
// import TwnsBwUnitMap        from "../../baseWar/model/BwUnitMap";
// import TwnsBwWar            from "../../baseWar/model/BwWar";
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import CommonConstants      from "../helpers/CommonConstants";
// import ConfigManager        from "../helpers/ConfigManager";
// import GridIndexHelpers     from "../helpers/GridIndexHelpers";
// import Helpers              from "../helpers/Helpers";
// import Types                from "../helpers/Types";
// import ProtoTypes           from "../proto/ProtoTypes";
// import WarCommonHelpers     from "./WarCommonHelpers";
// import WarVisibilityHelpers from "./WarVisibilityHelpers";

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

    export function revise(war: BwWar, rawAction: IWarActionContainer): IWarActionContainer {
        if (Object.keys(rawAction).length !== 2) {
            throw Helpers.newError(`Invalid rawAction.keys.`, ClientErrorCode.WarActionReviser_Revise_00);
        }

        const actionId = rawAction.actionId;
        if ((actionId == null) || (actionId !== war.getExecutedActionManager().getExecutedActionsCount())) {
            throw Helpers.newError(`Invalid actionId: ${actionId}`, ClientErrorCode.WarActionReviser_Revise_01);
        }

        const action = doRevise(war, rawAction);
        action.actionId = actionId;
        return action;
    }

    function doRevise(war: BwWar, rawAction: IWarActionContainer): IWarActionContainer {
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
        else if (rawAction.WarActionSystemVoteForDraw)          { return reviseSystemVoteForDraw(war, rawAction.WarActionSystemVoteForDraw); }
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

    function revisePlayerDeleteUnit(war: BwWar, rawAction: WarAction.IWarActionPlayerDeleteUnit): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_RevisePlayerDeleteUnit_00);
        }

        const gridIndex         = Helpers.getExisted(GridIndexHelpers.convertGridIndex(rawAction.gridIndex), ClientErrorCode.WarActionReviser_RevisePlayerDeleteUnit_01);
        const playerIndexInTurn = war.getPlayerIndexInTurn();
        const playerInTurn      = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_RevisePlayerDeleteUnit_02);
        }

        const unitMap   = war.getUnitMap();
        const focusUnit = unitMap.getUnitOnMap(gridIndex);
        if ((!focusUnit)                                                ||
            (focusUnit.getActionState() !== Types.UnitActionState.Idle) ||
            (focusUnit.getPlayerIndex() !== playerIndexInTurn)          ||
            (unitMap.countUnitsOnMapForPlayer(playerIndexInTurn) <= 1)
        ) {
            throw Helpers.newError(`Invalid focusUnit.`, ClientErrorCode.WarActionReviser_RevisePlayerDeleteUnit_03);
        }

        return {
            WarActionPlayerDeleteUnit   : {
                gridIndex,
            },
        };
    }

    function revisePlayerEndTurn(war: BwWar, rawAction: WarAction.IWarActionPlayerEndTurn): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_RevisePlayerEndTurn_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_RevisePlayerEndTurn_01);
        }

        if ((war.getDrawVoteManager().getRemainingVotes() != null)  &&
            (!playerInTurn.getHasVotedForDraw())                    &&
            (!playerInTurn.checkIsNeutral())
        ) {
            throw Helpers.newError(`The player hasn't voted for draw.`, ClientErrorCode.WarActionReviser_RevisePlayerEndTurn_02);
        }

        return {
            WarActionPlayerEndTurn  : {},
        };
    }

    function revisePlayerProduceUnit(war: BwWar, rawAction: WarAction.IWarActionPlayerProduceUnit): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_RevisePlayerProduceUnit_00);
        }

        const unitHp = rawAction.unitHp;
        if ((unitHp == null) || (unitHp <= 0) || (unitHp > CommonConstants.UnitMaxHp)) {
            throw Helpers.newError(`Invalid unitHp: ${unitHp}`, ClientErrorCode.WarActionReviser_RevisePlayerProduceUnit_01);
        }

        const unitMap   = war.getUnitMap();
        const mapSize   = unitMap.getMapSize();
        const gridIndex = GridIndexHelpers.convertGridIndex(rawAction.gridIndex);
        if ((gridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
            throw Helpers.newError(`Invalid gridIndex.`, ClientErrorCode.WarActionReviser_RevisePlayerProduceUnit_02);
        }

        if (unitMap.getUnitOnMap(gridIndex)) {
            throw Helpers.newError(`Grid occupied.`, ClientErrorCode.WarActionReviser_RevisePlayerProduceUnit_03);
        }

        const playerInTurn      = war.getPlayerInTurn();
        const playerIndexInTurn = playerInTurn ? playerInTurn.getPlayerIndex() : null;
        if ((playerInTurn == null)                                      ||
            (playerInTurn.getAliveState() !== PlayerAliveState.Alive)   ||
            (playerIndexInTurn == null)                                 ||
            (playerIndexInTurn === CommonConstants.WarNeutralPlayerIndex)
        ) {
            throw Helpers.newError(`Invalid playerIndexInTurn: ${playerIndexInTurn}`, ClientErrorCode.WarActionReviser_RevisePlayerProduceUnit_04);
        }

        const tile                  = war.getTileMap().getTile(gridIndex);
        const unitType              = Helpers.getExisted(rawAction.unitType, ClientErrorCode.WarActionReviser_RevisePlayerProduceUnit_05);
        const configVersion         = war.getConfigVersion();
        const fund                  = playerInTurn.getFund();
        const skillCfg              = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndexInTurn);
        const produceUnitCategory   = skillCfg
            ? skillCfg[1]
            : (playerIndexInTurn === tile.getPlayerIndex() ? tile.getCfgProduceUnitCategory() : null);
        if ((produceUnitCategory == null)                                                           ||
            (!ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, produceUnitCategory))
        ) {
            throw Helpers.newError(`Invalid produceUnitCategory: ${produceUnitCategory}`, ClientErrorCode.WarActionReviser_RevisePlayerProduceUnit_06);
        }

        if ((skillCfg)                                      &&
            ((unitHp > skillCfg[4]) || (unitHp < skillCfg[3]))
        ) {
            throw Helpers.newError(`Invalid unitHp: ${unitHp}`, ClientErrorCode.WarActionReviser_RevisePlayerProduceUnit_07);
        }
        if ((!skillCfg) && (unitHp !== CommonConstants.UnitMaxHp)) {
            throw Helpers.newError(`Invalid unitHp: ${unitHp}`, ClientErrorCode.WarActionReviser_RevisePlayerProduceUnit_08);
        }

        const cfgCost   = ConfigManager.getUnitTemplateCfg(configVersion, unitType).productionCost;
        const modifier  = playerInTurn.getUnitCostModifier(gridIndex, false, unitType);
        const cost      = Math.floor(
            cfgCost
            * (skillCfg ? skillCfg[5] : 100)
            * WarCommonHelpers.getNormalizedHp(unitHp)
            * modifier
            / 100
            / CommonConstants.UnitHpNormalizer
        );
        if (cost > fund) {
            throw Helpers.newError(`Invalid cost: ${cost}`, ClientErrorCode.WarActionReviser_RevisePlayerProduceUnit_09);
        }

        return {
            WarActionPlayerProduceUnit: {
                gridIndex,
                unitHp,
                unitType,
            },
        };
    }

    function revisePlayerSurrender(war: BwWar, rawAction: WarAction.IWarActionPlayerSurrender): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_RevisePlayerSurrender_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null)                                                      ||
            (playerInTurn.getPlayerIndex() === CommonConstants.WarNeutralPlayerIndex)   ||
            (playerInTurn.getAliveState() !== PlayerAliveState.Alive)
        ) {
            throw Helpers.newError(`Invalid playerIndex or aliveState.`, ClientErrorCode.WarActionReviser_RevisePlayerSurrender_01);
        }

        return {
            WarActionPlayerSurrender: {
            },
        };
    }

    function revisePlayerVoteForDraw(war: BwWar, rawAction: WarAction.IWarActionPlayerVoteForDraw): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_RevisePlayerVoteForDraw_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_RevisePlayerVoteForDraw_01);
        }

        if ((playerInTurn.getPlayerIndex() === CommonConstants.WarNeutralPlayerIndex) ||
            (playerInTurn.getHasVotedForDraw())
        ) {
            throw Helpers.newError(`Voted for draw.`, ClientErrorCode.WarActionReviser_RevisePlayerVoteForDraw_02);
        }

        const isAgree = rawAction.isAgree;
        if ((isAgree == null)                                                   ||
            ((war.getDrawVoteManager().getRemainingVotes() == null) && (!isAgree))
        ) {
            throw Helpers.newError(`Invalid isAgree: ${isAgree}`, ClientErrorCode.WarActionReviser_RevisePlayerVoteForDraw_03);
        }

        return {
            WarActionPlayerVoteForDraw: {
                isAgree,
            },
        };
    }

    function revisePlayerUseCoSkill(war: BwWar, rawAction: WarAction.IWarActionPlayerUseCoSkill): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_RevisePlayerUseCoSkill_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null)                                                      ||
            (playerInTurn.getPlayerIndex() === CommonConstants.WarNeutralPlayerIndex)   ||
            (playerInTurn.getAliveState() !== PlayerAliveState.Alive)
        ) {
            throw Helpers.newError(`Invalid playerIndex or aliveState.`, ClientErrorCode.WarActionReviser_RevisePlayerUseCoSkill_01);
        }

        const skillType = rawAction.skillType;
        if ((skillType == null) || (!playerInTurn.checkCanUseCoSkill(skillType))) {
            throw Helpers.newError(`Invalid skillType: ${skillType}`, ClientErrorCode.WarActionReviser_RevisePlayerUseCoSkill_02);
        }

        return {
            WarActionPlayerUseCoSkill: {
                skillType,
            },
        };
    }

    function reviseSystemBeginTurn(war: BwWar, rawAction: WarAction.IWarActionSystemBeginTurn): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.WaitBeginTurn) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseSystemBeginTurn_00);
        }

        return {
            WarActionSystemBeginTurn: {
            },
        };
    }

    function reviseSystemCallWarEvent(war: BwWar, rawAction: WarAction.IWarActionSystemCallWarEvent): IWarActionContainer {
        const warEventId = Helpers.getExisted(rawAction.warEventId, ClientErrorCode.WarActionReviser_ReviseSystemCallWarEvent_00);
        if (warEventId !== war.getWarEventManager().getCallableWarEventId()) {
            throw Helpers.newError(`Invalid warEventId: ${warEventId}`, ClientErrorCode.WarActionReviser_ReviseSystemCallWarEvent_01);
        }

        return {
            WarActionSystemCallWarEvent: {
                warEventId,
            },
        };
    }

    function reviseSystemDestroyPlayerForce(war: BwWar, rawAction: WarAction.IWarActionSystemDestroyPlayerForce): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseSystemDestroyPlayerForce_00);
        }

        const targetPlayerIndex = rawAction.targetPlayerIndex;
        if ((targetPlayerIndex == null) || (targetPlayerIndex === CommonConstants.WarNeutralPlayerIndex)) {
            throw Helpers.newError(`Invalid targetPlayerIndex: ${targetPlayerIndex}`, ClientErrorCode.WarActionReviser_ReviseSystemDestroyPlayerForce_01);
        }

        const player = war.getPlayer(targetPlayerIndex);
        if ((player == null) || (player.getAliveState() !== PlayerAliveState.Dying)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseSystemDestroyPlayerForce_02);
        }

        return {
            WarActionSystemDestroyPlayerForce: {
                targetPlayerIndex,
            },
        };
    }

    function reviseSystemEndWar(war: BwWar, rawAction: WarAction.IWarActionSystemEndWar): IWarActionContainer {
        if (!war.checkCanEnd()) {
            throw Helpers.newError(`Can not end.`, ClientErrorCode.WarActionReviser_ReviseSystemEndWar_00);
        }

        return {
            WarActionSystemEndWar: {
            },
        };
    }

    function reviseSystemEndTurn(war: BwWar, rawAction: WarAction.IWarActionSystemEndTurn): IWarActionContainer {
        const playerInTurn = war.getPlayerInTurn();
        if (war.getTurnPhaseCode() !== Types.TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseSystemEndTurn_00);
        }

        if ((playerInTurn.getPlayerIndex() !== CommonConstants.WarNeutralPlayerIndex)   &&
            (playerInTurn.getAliveState() !== Types.PlayerAliveState.Dead)
        ) {
            throw Helpers.newError(`Invalid playerIndex or aliveState.`, ClientErrorCode.WarActionReviser_ReviseSystemEndTurn_01);
        }

        return {
            WarActionSystemEndTurn: {
            },
        };
    }

    function reviseSystemHandleBootPlayer(war: BwWar, rawAction: WarAction.IWarActionSystemHandleBootPlayer): IWarActionContainer {
        if (!war.checkIsBoot()) {
            throw Helpers.newError(`Is not boot.`, ClientErrorCode.WarActionReviser_ReviseSystemHandleBootPlayer_00);
        }

        return {
            WarActionSystemHandleBootPlayer: {
            },
        };
    }

    function reviseSystemVoteForDraw(war: BwWar, rawAction: WarAction.IWarActionSystemVoteForDraw): IWarActionContainer {
        const playerInTurn = war.getPlayerInTurn();
        if (war.getTurnPhaseCode() !== Types.TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseSystemVoteForDraw_00);
        }

        if ((playerInTurn.getPlayerIndex() !== CommonConstants.WarNeutralPlayerIndex)   &&
            (playerInTurn.getAliveState() !== Types.PlayerAliveState.Dead)
        ) {
            throw Helpers.newError(`Invalid playerIndex or aliveState.`, ClientErrorCode.WarActionReviser_ReviseSystemVoteForDraw_01);
        }

        return {
            WarActionSystemVoteForDraw: {
                isAgree: Helpers.getExisted(rawAction.isAgree, ClientErrorCode.WarActionReviser_ReviseSystemVoteForDraw_02),
            },
        };
    }

    function reviseUnitAttackTile(war: BwWar, rawAction: WarAction.IWarActionUnitAttackTile): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitAttackTile_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitAttackTile_01);
        }

        const tileMap           = war.getTileMap();
        const mapSize           = tileMap.getMapSize();
        const targetGridIndex   = GridIndexHelpers.convertGridIndex(rawAction.targetGridIndex);
        if ((targetGridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, mapSize))) {
            throw Helpers.newError(`Invalid targetGridIndex.`, ClientErrorCode.WarActionReviser_ReviseUnitAttackTile_02);
        }

        const unitMap = war.getUnitMap();
        if (unitMap.getUnitOnMap(targetGridIndex)) {
            throw Helpers.newError(`Occupied tile.`, ClientErrorCode.WarActionReviser_ReviseUnitAttackTile_03);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitAttackTile_04);
        }

        const attackerUnit = Helpers.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarActionReviser_ReviseUnitAttackTile_05);
        if (!attackerUnit.checkCanAttackTargetAfterMovePath(rawPathNodes, targetGridIndex)) {
            throw Helpers.newError(`Can not attack.`, ClientErrorCode.WarActionReviser_ReviseUnitAttackTile_06);
        }

        return {
            WarActionUnitAttackTile : {
                path    : revisedPath,
                launchUnitId,
                targetGridIndex,
            },
        };
    }

    function reviseUnitAttackUnit(war: BwWar, rawAction: WarAction.IWarActionUnitAttackUnit): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitAttackUnit_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitAttackUnit_01);
        }

        const unitMap           = war.getUnitMap();
        const mapSize           = unitMap.getMapSize();
        const targetGridIndex   = GridIndexHelpers.convertGridIndex(rawAction.targetGridIndex);
        if ((targetGridIndex == null) || (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, mapSize))) {
            throw Helpers.newError(`Invalid targetGridIndex.`, ClientErrorCode.WarActionReviser_ReviseUnitAttackUnit_02);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitAttackUnit_03);
        }

        const attackerUnit = Helpers.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarActionReviser_ReviseUnitAttackUnit_04);
        if (!attackerUnit.checkCanAttackTargetAfterMovePath(rawPathNodes, targetGridIndex)) {
            throw Helpers.newError(`Can not attack.`, ClientErrorCode.WarActionReviser_ReviseUnitAttackUnit_05);
        }

        return {
            WarActionUnitAttackUnit : {
                path            : revisedPath,
                launchUnitId,
                targetGridIndex,
            },
        };
    }

    function reviseUnitBeLoaded(war: BwWar, rawAction: WarAction.IWarActionUnitBeLoaded): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitBeLoaded_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitBeLoaded_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarActionReviser_ReviseUnitBeLoaded_02);
        const rawPathNodes  = rawPath ? rawPath.nodes || [] : [];
        const destination   = rawPathNodes[rawPathNodes.length - 1] as GridIndex;
        const loaderUnit    = unitMap.getUnitOnMap(destination);
        if ((rawPathNodes.length <= 1)              ||
            (!loaderUnit)                           ||
            (!loaderUnit.checkCanLoadUnit(focusUnit))
        ) {
            throw Helpers.newError(`Invalid loaderUnit.`, ClientErrorCode.WarActionReviser_ReviseUnitBeLoaded_03);
        }

        return {
            WarActionUnitBeLoaded: {
                path        : revisedPath,
                launchUnitId,
            },
        };
    }

    function reviseUnitBuildTile(war: BwWar, rawAction: WarAction.IWarActionUnitBuildTile): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitBuildTile_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitBuildTile_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitBuildTile_02);
        }

        const tile      = war.getTileMap().getTile(rawPathNodes[rawPathNodes.length - 1]);
        const focusUnit = war.getUnitMap().getUnit(rawPathNodes[0], launchUnitId);
        if ((focusUnit == null) || (!focusUnit.checkCanBuildOnTile(tile))) {
            throw Helpers.newError(`Invalid focusUnit.`, ClientErrorCode.WarActionReviser_ReviseUnitBuildTile_03);
        }

        return {
            WarActionUnitBuildTile  : {
                path        : revisedPath,
                launchUnitId,
            },
        };
    }

    function reviseUnitCaptureTile(war: BwWar, rawAction: WarAction.IWarActionUnitCaptureTile): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitCaptureTile_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitCaptureTile_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitCaptureTile_02);
        }

        const focusUnit = Helpers.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarActionReviser_ReviseUnitCaptureTile_03);
        const tile      = war.getTileMap().getTile(rawPathNodes[rawPathNodes.length - 1]);
        if (!focusUnit.checkCanCaptureTile(tile)) {
            throw Helpers.newError(`Can not capture.`, ClientErrorCode.WarActionReviser_ReviseUnitCaptureTile_04);
        }

        return {
            WarActionUnitCaptureTile: {
                path        : revisedPath,
                launchUnitId,
            },
        };
    }

    function reviseUnitDive(war: BwWar, rawAction: WarAction.IWarActionUnitDive): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitDive_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitDive_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitDive_02);
        }

        const focusUnit = Helpers.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarActionReviser_ReviseUnitDive_03);
        if (!focusUnit.checkCanDive()) {
            throw Helpers.newError(`Can not dive.`, ClientErrorCode.WarActionReviser_ReviseUnitDive_04);
        }

        return {
            WarActionUnitDive   : {
                path        : revisedPath,
                launchUnitId,
            },
        };
    }

    function reviseUnitDropUnit(war: BwWar, rawAction: WarAction.IWarActionUnitDropUnit): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitDropUnit_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitDropUnit_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitDropUnit_02);
        }

        const dropDestinations  = rawAction.dropDestinations;
        if ((!dropDestinations) || (!checkIsDropDestinationsValid(war, rawAction))) {
            throw Helpers.newError(`Invalid dropDestinations.`, ClientErrorCode.WarActionReviser_ReviseUnitDropUnit_03);
        }

        const revisedDropDestinations   = getRevisedDropDestinations(war, rawAction, revisedPath);
        const isDropBlocked             =  (!revisedPath.isBlocked) && (revisedDropDestinations.length < dropDestinations.length);
        return {
            WarActionUnitDropUnit   : {
                path            : revisedPath,
                launchUnitId,
                dropDestinations: revisedDropDestinations,
                isDropBlocked,
            },
        };
    }

    function reviseUnitJoinUnit(war: BwWar, rawAction: WarAction.IWarActionUnitJoinUnit): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitJoinUnit_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitJoinUnit_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarActionReviser_ReviseUnitJoinUnit_02);
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        const existingUnit  = unitMap.getUnitOnMap(rawPathNodes[rawPathNodes.length - 1]);
        if ((!existingUnit) || (!focusUnit.checkCanJoinUnit(existingUnit))) {
            throw Helpers.newError(`Invalid existingUnit.`, ClientErrorCode.WarActionReviser_ReviseUnitJoinUnit_03);
        }

        return {
            WarActionUnitJoinUnit   : {
                path        : revisedPath,
                launchUnitId,
            },
        };
    }

    function reviseUnitLaunchFlare(war: BwWar, rawAction: WarAction.IWarActionUnitLaunchFlare): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitLaunchFlare_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitLaunchFlare_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitLaunchFlare_02);
        }

        const unitMap           = war.getUnitMap();
        const focusUnit         = Helpers.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarActionReviser_ReviseUnitLaunchFlare_03);
        const mapSize           = unitMap.getMapSize();
        const flareMaxRange     = Helpers.getExisted(focusUnit.getFlareMaxRange(), ClientErrorCode.WarActionReviser_ReviseUnitLaunchFlare_04);
        const targetGridIndex   = Helpers.getExisted(GridIndexHelpers.convertGridIndex(rawAction.targetGridIndex), ClientErrorCode.WarActionReviser_ReviseUnitLaunchFlare_05);
        if ((rawPathNodes.length !== 1)                                                     ||
            (!focusUnit.getFlareCurrentAmmo())                                              ||
            (!war.getFogMap().checkHasFogCurrently())                                       ||
            (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, mapSize))                  ||
            (GridIndexHelpers.getDistance(targetGridIndex, revisedPath.nodes[0]) > flareMaxRange)
        ) {
            throw Helpers.newError(`Can not launch.`, ClientErrorCode.WarActionReviser_ReviseUnitLaunchFlare_06);
        }

        return {
            WarActionUnitLaunchFlare: {
                path            : revisedPath,
                launchUnitId,
                targetGridIndex,
            },
        };
    }

    function reviseUnitLaunchSilo(war: BwWar, rawAction: WarAction.IWarActionUnitLaunchSilo): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitLaunchSilo_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitLaunchSilo_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitLaunchSilo_02);
        }

        const unitMap   = war.getUnitMap();
        const focusUnit = Helpers.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarActionReviser_ReviseUnitLaunchSilo_03);
        const mapSize   = unitMap.getMapSize();
        const tile      = war.getTileMap().getTile(rawPathNodes[rawPathNodes.length - 1]);
        if ((tile == null) || (!focusUnit.checkCanLaunchSiloOnTile(tile))) {
            throw Helpers.newError(`Can not launch silo.`, ClientErrorCode.WarActionReviser_ReviseUnitLaunchSilo_04);
        }

        const targetGridIndex = GridIndexHelpers.convertGridIndex(rawAction.targetGridIndex);
        if ((targetGridIndex == null)                                       ||
            (!GridIndexHelpers.checkIsInsideMap(targetGridIndex, mapSize))
        ) {
            throw Helpers.newError(`Invalid targetGridIndex.`, ClientErrorCode.WarActionReviser_ReviseUnitLaunchSilo_05);
        }

        return {
            WarActionUnitLaunchSilo : {
                path            : revisedPath,
                launchUnitId,
                targetGridIndex,
            },
        };
    }

    function reviseUnitLoadCo(war: BwWar, rawAction: WarAction.IWarActionUnitLoadCo): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitLoadCo_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitLoadCo_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitLoadCo_02);
        }

        const focusUnit = war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId);
        if ((focusUnit == null) || (!focusUnit.checkCanLoadCoAfterMovePath(rawPathNodes))) {
            throw Helpers.newError(`Can not load co.`, ClientErrorCode.WarActionReviser_ReviseUnitLoadCo_03);
        }

        return {
            WarActionUnitLoadCo : {
                path        : revisedPath,
                launchUnitId,
            },
        };
    }

    function reviseUnitProduceUnit(war: BwWar, rawAction: WarAction.IWarActionUnitProduceUnit): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitProduceUnit_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitProduceUnit_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitProduceUnit_02);
        }

        const focusUnit     = Helpers.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarActionReviser_ReviseUnitProduceUnit_03);
        const fund          = playerInTurn.getFund();
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
            throw Helpers.newError(`Invalid focusUnit.`, ClientErrorCode.WarActionReviser_ReviseUnitProduceUnit_04);
        }

        return {
            WarActionUnitProduceUnit    : {
                path        : revisedPath,
                launchUnitId,
            },
        };
    }

    function reviseUnitSupplyUnit(war: BwWar, rawAction: WarAction.IWarActionUnitSupplyUnit): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitSupplyUnit_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitSupplyUnit_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitSupplyUnit_02);
        }

        const unitMap   = war.getUnitMap();
        const focusUnit = Helpers.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId),ClientErrorCode.WarActionReviser_ReviseUnitSupplyUnit_03);
        if (!checkCanDoSupply(unitMap, focusUnit, rawPathNodes[rawPathNodes.length - 1])) {
            throw Helpers.newError(`Can not supply.`, ClientErrorCode.WarActionReviser_ReviseUnitSupplyUnit_04);
        }

        return {
            WarActionUnitSupplyUnit : {
                path        : revisedPath,
                launchUnitId,
            },
        };
    }

    function reviseUnitSurface(war: BwWar, rawAction: WarAction.IWarActionUnitSurface): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitSurface_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitSurface_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitSurface_02);
        }

        const focusUnit = Helpers.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarActionReviser_ReviseUnitSurface_03);
        if (!focusUnit.checkCanSurface()) {
            throw Helpers.newError(`Can not surface.`, ClientErrorCode.WarActionReviser_ReviseUnitSurface_04);
        }

        return {
            WarActionUnitSurface: {
                path        : revisedPath,
                launchUnitId,
            },
        };
    }

    function reviseUnitUseCoSkill(war: BwWar, rawAction: WarAction.IWarActionUnitUseCoSkill): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitUseCoSkill_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitUseCoSkill_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitUseCoSkill_02);
        }

        const focusUnit = Helpers.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarActionReviser_ReviseUnitUseCoSkill_03);
        const skillType = rawAction.skillType as Types.CoSkillType;
        if ((skillType !== Types.CoSkillType.Power)     &&
            (skillType !== Types.CoSkillType.SuperPower)
        ) {
            throw Helpers.newError(`Invalid skillType: ${skillType}`, ClientErrorCode.WarActionReviser_ReviseUnitUseCoSkill_04);
        }

        if (!focusUnit.checkCanUseCoSkill(skillType)) {
            throw Helpers.newError(`Can not use skill.`, ClientErrorCode.WarActionReviser_ReviseUnitUseCoSkill_05);
        }

        return {
            WarActionUnitUseCoSkill : {
                path        : revisedPath,
                launchUnitId,
                skillType,
            },
        };
    }

    function reviseUnitWait(war: BwWar, rawAction: WarAction.IWarActionUnitWait): IWarActionContainer {
        if (war.getTurnPhaseCode() !== TurnPhaseCode.Main) {
            throw Helpers.newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarActionReviser_ReviseUnitWait_00);
        }

        const playerInTurn = war.getPlayerInTurn();
        if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayerAliveState.Alive)) {
            throw Helpers.newError(`Invalid aliveState.`, ClientErrorCode.WarActionReviser_ReviseUnitWait_01);
        }

        const rawPath       = rawAction.path;
        const launchUnitId  = rawAction.launchUnitId;
        const revisedPath   = WarCommonHelpers.getRevisedPath({ war, rawPath, launchUnitId });
        const rawPathNodes  = (rawPath ? rawPath.nodes || [] : []) as GridIndex[];
        if (WarCommonHelpers.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
            throw Helpers.newError(`Destination occupied.`, ClientErrorCode.WarActionReviser_ReviseUnitWait_02);
        }

        return {
            WarActionUnitWait   : {
                path        : revisedPath,
                launchUnitId,
            },
        };
    }

    function reviseUnknownAction(): IWarActionContainer {
        throw Helpers.newError(`Invalid action.`, ClientErrorCode.WarActionReviser_ReviseUnknownAction_00);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function checkIsDropDestinationsValid(war: BwWar, action: WarAction.IWarActionUnitDropUnit): boolean {
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

// export default WarActionReviser;
