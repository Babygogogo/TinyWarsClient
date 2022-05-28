
// import TwnsBwPlayer                 from "../../baseWar/model/BwPlayer";
// import TwnsBwTile                   from "../../baseWar/model/BwTile";
// import TwnsBwUnit                   from "../../baseWar/model/BwUnit";
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import TwnsBwBeginTurnPanel         from "../../baseWar/view/BwBeginTurnPanel";
// import TwnsBwCaptureProgressPanel   from "../../baseWar/view/BwCaptureProgressPanel";
// import UserModel                    from "../../user/model/UserModel";
// import TwnsClientErrorCode          from "../helpers/ClientErrorCode";
// import CommonConstants              from "../helpers/CommonConstants";
// import ConfigManager                from "../helpers/ConfigManager";
// import FloatText                    from "../helpers/FloatText";
// import GridIndexHelpers             from "../helpers/GridIndexHelpers";
// import Helpers                      from "../helpers/Helpers";
// import Types                        from "../helpers/Types";
// import Notify                       from "../notify/Notify";
// import Notify               from "../notify/NotifyType";
// import ProtoTypes                   from "../proto/ProtoTypes";
// import WarCommonHelpers             from "./WarCommonHelpers";
// import WarCoSkillHelpers            from "./WarCoSkillHelpers";
// import WarDamageCalculator          from "./WarDamageCalculator";
// import WarDestructionHelpers        from "./WarDestructionHelpers";
// import WarVisibilityHelpers         from "./WarVisibilityHelpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarHelpers.WarActionExecutor {
    import GridIndex                            = Types.GridIndex;
    import UnitActionState                      = Types.UnitActionState;
    import MovePath                             = Types.MovePath;
    import WarAction                            = CommonProto.WarAction;
    import IWarActionContainer                  = WarAction.IWarActionContainer;
    import IWarActionPlayerDeleteUnit           = WarAction.IWarActionPlayerDeleteUnit;
    import IWarActionPlayerEndTurn              = WarAction.IWarActionPlayerEndTurn;
    import IWarActionPlayerProduceUnit          = WarAction.IWarActionPlayerProduceUnit;
    import IWarActionPlayerSurrender            = WarAction.IWarActionPlayerSurrender;
    import IWarActionPlayerVoteForDraw          = WarAction.IWarActionPlayerVoteForDraw;
    import IWarActionPlayerUseCoSkill           = WarAction.IWarActionPlayerUseCoSkill;
    import IWarActionSystemBeginTurn            = WarAction.IWarActionSystemBeginTurn;
    import IWarActionSystemCallWarEvent         = WarAction.IWarActionSystemCallWarEvent;
    import IWarActionSystemDestroyPlayerForce   = WarAction.IWarActionSystemDestroyPlayerForce;
    import IWarActionSystemEndWar               = WarAction.IWarActionSystemEndWar;
    import IWarActionSystemEndTurn              = WarAction.IWarActionSystemEndTurn;
    import IWarActionSystemHandleBootPlayer     = WarAction.IWarActionSystemHandleBootPlayer;
    import IWarActionSystemVoteForDraw          = WarAction.IWarActionSystemVoteForDraw;
    import IWarActionUnitAttackTile             = WarAction.IWarActionUnitAttackTile;
    import IWarActionUnitAttackUnit             = WarAction.IWarActionUnitAttackUnit;
    import IWarActionUnitBeLoaded               = WarAction.IWarActionUnitBeLoaded;
    import IWarActionUnitBuildTile              = WarAction.IWarActionUnitBuildTile;
    import IWarActionUnitCaptureTile            = WarAction.IWarActionUnitCaptureTile;
    import IWarActionUnitDive                   = WarAction.IWarActionUnitDive;
    import IWarActionUnitDropUnit               = WarAction.IWarActionUnitDropUnit;
    import IWarActionUnitJoinUnit               = WarAction.IWarActionUnitJoinUnit;
    import IWarActionUnitLaunchFlare            = WarAction.IWarActionUnitLaunchFlare;
    import IWarActionUnitLaunchSilo             = WarAction.IWarActionUnitLaunchSilo;
    import IWarActionUnitLoadCo                 = WarAction.IWarActionUnitLoadCo;
    import IWarActionUnitProduceUnit            = WarAction.IWarActionUnitProduceUnit;
    import IWarActionUnitSupplyUnit             = WarAction.IWarActionUnitSupplyUnit;
    import IWarActionUnitSurface                = WarAction.IWarActionUnitSurface;
    import IWarActionUnitUseCoSkill             = WarAction.IWarActionUnitUseCoSkill;
    import IWarActionUnitWait                   = WarAction.IWarActionUnitWait;
    import BwPlayer                             = BaseWar.BwPlayer;
    import BwUnit                               = BaseWar.BwUnit;
    import BwTile                               = BaseWar.BwTile;
    import BwWar                                = BaseWar.BwWar;
    import NotifyType                           = Notify.NotifyType;

    type ResultForHandleDestructionForTile = {
        damagedTileSet?     : Set<BwTile>;
        destroyedTileSet?   : Set<BwTile>;
    };

    export async function checkAndExecute(war: BwWar, action: IWarActionContainer, isFast: boolean): Promise<void> {
        if (!war.getIsRunning()) {
            throw Helpers.newError(`!war.getIsRunning().`, ClientErrorCode.BwWarActionExecutor_CheckAndExecute_00);
        }
        if (war.getIsExecutingAction()) {
            throw Helpers.newError(`war.getIsExecutingAction().`, ClientErrorCode.BwWarActionExecutor_CheckAndExecute_01);
        }
        if (war.getIsEnded()) {
            throw Helpers.newError(`war.getIsEnded().`, ClientErrorCode.BwWarActionExecutor_CheckAndExecute_02);
        }

        const actionPlanner = war.getActionPlanner();
        war.setIsExecutingAction(true);
        actionPlanner.setStateExecutingAction();

        await doExecuteAction(war, action, isFast);

        actionPlanner.setStateIdle();
        war.setIsExecutingAction(false);
    }

    async function doExecuteAction(war: BwWar, action: IWarActionContainer, isFast: boolean): Promise<void> {
        if      (action.WarActionPlayerDeleteUnit)          { await exePlayerDeleteUnit(war, action.WarActionPlayerDeleteUnit, isFast); }
        else if (action.WarActionPlayerEndTurn)             { await exePlayerEndTurn(war, action.WarActionPlayerEndTurn, isFast); }
        else if (action.WarActionPlayerProduceUnit)         { await exePlayerProduceUnit(war, action.WarActionPlayerProduceUnit, isFast); }
        else if (action.WarActionPlayerSurrender)           { await exePlayerSurrender(war, action.WarActionPlayerSurrender, isFast); }
        else if (action.WarActionPlayerVoteForDraw)         { await exePlayerVoteForDraw(war, action.WarActionPlayerVoteForDraw, isFast); }
        else if (action.WarActionPlayerUseCoSkill)          { await exePlayerUseCoSkill(war, action.WarActionPlayerUseCoSkill, isFast); }
        else if (action.WarActionSystemBeginTurn)           { await exeSystemBeginTurn(war, action.WarActionSystemBeginTurn, isFast); }
        else if (action.WarActionSystemCallWarEvent)        { await exeSystemCallWarEvent(war, action.WarActionSystemCallWarEvent, isFast); }
        else if (action.WarActionSystemDestroyPlayerForce)  { await exeSystemDestroyPlayerForce(war, action.WarActionSystemDestroyPlayerForce, isFast); }
        else if (action.WarActionSystemEndWar)              { await exeSystemEndWar(war, action.WarActionSystemEndWar, isFast); }
        else if (action.WarActionSystemEndTurn)             { await exeSystemEndTurn(war, action.WarActionSystemEndTurn, isFast); }
        else if (action.WarActionSystemHandleBootPlayer)    { await exeSystemHandleBootPlayer(war, action.WarActionSystemHandleBootPlayer, isFast); }
        else if (action.WarActionSystemVoteForDraw)         { await exeSystemVoteForDraw(war, action.WarActionSystemVoteForDraw, isFast); }
        else if (action.WarActionUnitAttackTile)            { await exeUnitAttackTile(war, action.WarActionUnitAttackTile, isFast); }
        else if (action.WarActionUnitAttackUnit)            { await exeUnitAttackUnit(war, action.WarActionUnitAttackUnit, isFast); }
        else if (action.WarActionUnitBeLoaded)              { await exeUnitBeLoaded(war, action.WarActionUnitBeLoaded, isFast); }
        else if (action.WarActionUnitBuildTile)             { await exeUnitBuildTile(war, action.WarActionUnitBuildTile, isFast); }
        else if (action.WarActionUnitCaptureTile)           { await exeUnitCaptureTile(war, action.WarActionUnitCaptureTile, isFast); }
        else if (action.WarActionUnitDive)                  { await exeUnitDive(war, action.WarActionUnitDive, isFast); }
        else if (action.WarActionUnitDropUnit)              { await exeUnitDropUnit(war, action.WarActionUnitDropUnit, isFast); }
        else if (action.WarActionUnitJoinUnit)              { await exeUnitJoinUnit(war, action.WarActionUnitJoinUnit, isFast); }
        else if (action.WarActionUnitLaunchFlare)           { await exeUnitLaunchFlare(war, action.WarActionUnitLaunchFlare, isFast); }
        else if (action.WarActionUnitLaunchSilo)            { await exeUnitLaunchSilo(war, action.WarActionUnitLaunchSilo, isFast); }
        else if (action.WarActionUnitLoadCo)                { await exeUnitLoadCo(war, action.WarActionUnitLoadCo, isFast); }
        else if (action.WarActionUnitProduceUnit)           { await exeUnitProduceUnit(war, action.WarActionUnitProduceUnit, isFast); }
        else if (action.WarActionUnitSupplyUnit)            { await exeUnitSupplyUnit(war, action.WarActionUnitSupplyUnit, isFast); }
        else if (action.WarActionUnitSurface)               { await exeUnitSurface(war, action.WarActionUnitSurface, isFast); }
        else if (action.WarActionUnitUseCoSkill)            { await exeUnitUseCoSkill(war, action.WarActionUnitUseCoSkill, isFast); }
        else if (action.WarActionUnitWait)                  { await exeUnitWait(war, action.WarActionUnitWait, isFast); }
        else                                                { await exeUnknownAction(); }

        if (!isFast) {
            Notify.dispatch(NotifyType.WarActionNormalExecuted);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerDeleteUnit(war: BwWar, action: IWarActionPlayerDeleteUnit, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExePlayerDeleteUnit(war, action)
            : await normalExePlayerDeleteUnit(war, action);
    }
    async function fastExePlayerDeleteUnit(war: BwWar, action: IWarActionPlayerDeleteUnit): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExePlayerDeleteUnit_00),
                isFastExecute   : true,
            });
        } else {
            const gridIndex = action.gridIndex as GridIndex;
            const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
            if (focusUnit) {
                war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
                WarHelpers.WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExePlayerDeleteUnit(war: BwWar, action: IWarActionPlayerDeleteUnit): Promise<void> {
        // const desc = await war.getDescForExePlayerDeleteUnit(action);
        // (desc) && (FloatText.show(desc));

        const actionExtraData = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExePlayerDeleteUnit_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute   : false,
            });

        } else {
            const gridIndex = action.gridIndex as GridIndex;
            const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
            if (focusUnit) {
                war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
                WarHelpers.WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerEndTurn(war: BwWar, action: IWarActionPlayerEndTurn, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExePlayerEndTurn(war, action)
            : await normalExePlayerEndTurn(war, action);
    }
    async function fastExePlayerEndTurn(war: BwWar, action: IWarActionPlayerEndTurn): Promise<void> {
        war.getTurnManager().endPhaseMain(action, true);
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExePlayerEndTurn(war: BwWar, action: IWarActionPlayerEndTurn): Promise<void> {
        // const desc = await war.getDescForExePlayerEndTurn(action);
        // (desc) && (FloatText.show(desc));

        war.getTurnManager().endPhaseMain(action, false);
        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerProduceUnit(war: BwWar, action: IWarActionPlayerProduceUnit, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExePlayerProduceUnit(war, action)
            : await normalExePlayerProduceUnit(war, action);
    }
    async function fastExePlayerProduceUnit(war: BwWar, action: IWarActionPlayerProduceUnit): Promise<void> {
        handlePlayerProduceUnit(war, action);
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExePlayerProduceUnit(war: BwWar, action: IWarActionPlayerProduceUnit): Promise<void> {
        // const desc = await war.getDescForExePlayerProduceUnit(action);
        // (desc) && (FloatText.show(desc));

        handlePlayerProduceUnit(war, action);
        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    function handlePlayerProduceUnit(war: BwWar, action: IWarActionPlayerProduceUnit): void {
        const extraData = action.extraData;
        if (extraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(extraData.commonExtraData, ClientErrorCode.WarActionExecutor_HandlePlayerProduceUnit_00),
                isFastExecute   : true,
            });

        } else {
            const unitMap       = war.getUnitMap();
            const unitId        = unitMap.getNextUnitId();
            const gridIndex     = action.gridIndex as GridIndex;
            const unitType      = Helpers.getExisted(action.unitType);
            const unitHp        = Helpers.getExisted(action.unitHp);
            const gameConfig    = war.getGameConfig();
            const playerInTurn  = war.getPlayerInTurn();
            const playerIndex   = playerInTurn.getPlayerIndex();
            const skillCfg      = war.getTileMap().getTile(gridIndex).getEffectiveSelfUnitProductionSkillCfg(playerIndex);
            const cfgCost       = Helpers.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.productionCost);
            const cost          = Math.floor(
                cfgCost
                * (skillCfg ? skillCfg[5] : 100)
                * WarHelpers.WarCommonHelpers.getNormalizedHp(unitHp)
                * playerInTurn.getUnitCostModifier(gridIndex, false, unitType)
                / 100
                / CommonConstants.UnitHpNormalizer
            );
            const unit          = new BwUnit();
            unit.init({
                gridIndex,
                playerIndex,
                unitType,
                unitId,
                actionState     : ((skillCfg) && (skillCfg[6] === 1)) ? UnitActionState.Idle : UnitActionState.Acted,
                currentHp       : unitHp,
                currentPromotion: getPromotionForPlayerProduceUnit(war, gridIndex, unitType),
            }, gameConfig);
            unit.startRunning(war);
            unit.startRunningView();
            unitMap.setUnitOnMap(unit);
            unitMap.setNextUnitId(unitId + 1);
            playerInTurn.setFund(playerInTurn.getFund() - cost);
        }
    }
    function getPromotionForPlayerProduceUnit(war: BwWar, gridIndex: GridIndex, unitType: number): number {
        const player                    = war.getPlayerInTurn();
        const coZoneRadius              = player.getCoZoneRadius();
        const gameConfig                = war.getGameConfig();
        const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
        let promotion                   = 0;
        for (const skillId of war.getPlayerInTurn().getCoCurrentSkills()) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.selfPromotionBonusByProduce;
            if ((cfg)                                                       &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))    &&
                (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                    gridIndex,
                    coSkillAreaType         : cfg[0],
                    getCoGridIndexArrayOnMap,
                    coZoneRadius,
                }))
            ) {
                promotion += cfg[2];
            }
        }

        return promotion;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerSurrender(war: BwWar, action: IWarActionPlayerSurrender, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExePlayerSurrender(war, action)
            : await normalExePlayerSurrender(war, action);
    }
    async function fastExePlayerSurrender(war: BwWar, action: IWarActionPlayerSurrender): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExePlayerSurrender_00),
                isFastExecute   : true,
            });
        } else {
            war.getPlayerInTurn().setAliveState(Types.PlayerAliveState.Dying);
        }
    }
    async function normalExePlayerSurrender(war: BwWar, action: IWarActionPlayerSurrender): Promise<void> {
        const desc = await war.getDescForExePlayerSurrender(action);
        (desc) && (FloatText.show(desc));

        const actionExtraData = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExePlayerSurrender_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute   : false,
            });

        } else {
            war.getPlayerInTurn().setAliveState(Types.PlayerAliveState.Dying);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerVoteForDraw(war: BwWar, action: IWarActionPlayerVoteForDraw, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExePlayerVoteForDraw(war, action)
            : await normalExePlayerVoteForDraw(war, action);
    }
    async function fastExePlayerVoteForDraw(war: BwWar, action: IWarActionPlayerVoteForDraw): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExePlayerVoteForDraw_00),
                isFastExecute   : true,
            });
        } else {
            const playerInTurn = war.getPlayerInTurn();
            playerInTurn.setHasVotedForDraw(true);
        }

        const drawVoteManager   = war.getDrawVoteManager();
        const isAgree           = actionExtraData ? actionExtraData.isAgree : action.isAgree;
        if (!isAgree) {
            drawVoteManager.setRemainingVotes(null);
        } else {
            drawVoteManager.setRemainingVotes((drawVoteManager.getRemainingVotes() || drawVoteManager.getMaxVotes()) - 1);
        }
    }
    async function normalExePlayerVoteForDraw(war: BwWar, action: IWarActionPlayerVoteForDraw): Promise<void> {
        const desc = await war.getDescForExePlayerVoteForDraw(action);
        (desc) && (FloatText.show(desc));

        const actionExtraData = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExePlayerVoteForDraw_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute                       : false,
            });

        } else {
            const playerInTurn = war.getPlayerInTurn();
            playerInTurn.setHasVotedForDraw(true);
        }

        const drawVoteManager   = war.getDrawVoteManager();
        const isAgree           = actionExtraData ? actionExtraData.isAgree : action.isAgree;
        if (!isAgree) {
            drawVoteManager.setRemainingVotes(null);
        } else {
            drawVoteManager.setRemainingVotes((drawVoteManager.getRemainingVotes() || drawVoteManager.getMaxVotes()) - 1);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerUseCoSkill(war: BwWar, action: IWarActionPlayerUseCoSkill, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExePlayerUseCoSkill(war, action)
            : await normalExePlayerUseCoSkill(war, action);
    }
    async function fastExePlayerUseCoSkill(war: BwWar, action: IWarActionPlayerUseCoSkill): Promise<void> {
        const playerInTurn      = war.getPlayerInTurn();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            const skillType         = Helpers.getExisted(actionExtraData.skillType, ClientErrorCode.WarActionExecutor_FastExePlayerUseCoSkill_00);
            const skillIdArray      = playerInTurn.getCoSkills(skillType);
            const skillDataArray    = Helpers.getExisted(actionExtraData.skillDataArray, ClientErrorCode.WarActionExecutor_FastExePlayerUseCoSkill_01);
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                WarHelpers.WarCoSkillHelpers.exeInstantSkill({
                    war,
                    player          : playerInTurn,
                    skillId         : skillIdArray[skillIndex],
                    skillData       : Helpers.getExisted(skillDataArray.find(v => v.skillIndex === skillIndex), ClientErrorCode.WarActionExecutor_FastExePlayerUseCoSkill_02),
                    hasExtraData    : true,
                    isFastExecute   : true,
                });
            }

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExePlayerUseCoSkill_03),
                isFastExecute   : true,
            });

        } else {
            const skillType     = Helpers.getExisted(action.skillType, ClientErrorCode.WarActionExecutor_FastExePlayerUseCoSkill_04);
            const skillIdArray  = playerInTurn.getCoSkills(skillType);
            playerInTurn.updateOnUseCoSkill(skillType);

            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                WarHelpers.WarCoSkillHelpers.exeInstantSkill({
                    war,
                    player          : playerInTurn,
                    skillId         : skillIdArray[skillIndex],
                    skillData       : WarHelpers.WarCoSkillHelpers.getDataForUseCoSkill(war, playerInTurn, skillIndex),
                    hasExtraData    : false,
                    isFastExecute   : true,
                });
            }

            if (playerInTurn.getUserId() == null) {
                const playerIndex = playerInTurn.getPlayerIndex();
                for (const unit of war.getUnitMap().getAllUnits()) {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.checkAndUpdateAiMode();
                    }
                }
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExePlayerUseCoSkill(war: BwWar, action: IWarActionPlayerUseCoSkill): Promise<void> {
        const gridVisualEffect  = war.getGridVisualEffect();
        const unitMap           = war.getUnitMap();
        const playerInTurn      = war.getPlayerInTurn();
        const actionExtraData   = action.extraData;
        const playerIndex       = playerInTurn.getPlayerIndex();
        if (actionExtraData) {
            const skillType         = Helpers.getExisted(actionExtraData.skillType, ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_00);
            const skillDataArray    = Helpers.getExisted(actionExtraData.skillDataArray, ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_01);
            const skillIdArray      = playerInTurn.getCoSkills(skillType);
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                WarHelpers.WarCoSkillHelpers.exeInstantSkill({
                    war,
                    player          : playerInTurn,
                    skillId         : skillIdArray[skillIndex],
                    skillData       : Helpers.getExisted(skillDataArray.find(v => v.skillIndex === skillIndex), ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_02),
                    hasExtraData    : true,
                    isFastExecute   : false,
                });
            }

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_03),
                isFastExecute   : false,
            });

            for (const unit of unitMap.getAllUnitsOnMap()) {
                if (unit.getPlayerIndex() === playerIndex) {
                    unit.updateView();
                    gridVisualEffect.showEffectSkillActivation(unit.getGridIndex());
                }
            }

        } else {
            const skillType = Helpers.getExisted(action.skillType, ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_04);
            playerInTurn.updateOnUseCoSkill(skillType);

            const skillIdArray = playerInTurn.getCoSkills(skillType);
            for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                WarHelpers.WarCoSkillHelpers.exeInstantSkill({
                    war,
                    player          : playerInTurn,
                    skillId         : skillIdArray[skillIndex],
                    skillData       : WarHelpers.WarCoSkillHelpers.getDataForUseCoSkill(war, playerInTurn, skillIndex),
                    hasExtraData    : false,
                    isFastExecute   : false,
                });
            }

            if (playerInTurn.getUserId() == null) {
                for (const unit of war.getUnitMap().getAllUnits()) {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.checkAndUpdateAiMode();
                    }
                }
            }

            for (const unit of unitMap.getAllUnitsOnMap()) {
                if (unit.getPlayerIndex() === playerIndex) {
                    unit.updateView();
                    gridVisualEffect.showEffectSkillActivation(unit.getGridIndex());
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemBeginTurn(war: BwWar, action: IWarActionSystemBeginTurn, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeSystemBeginTurn(war, action)
            : await normalExeSystemBeginTurn(war, action);
    }
    async function fastExeSystemBeginTurn(war: BwWar, action: IWarActionSystemBeginTurn): Promise<void> {
        await war.getTurnManager().endPhaseWaitBeginTurn(action, true);
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeSystemBeginTurn(war: BwWar, action: IWarActionSystemBeginTurn): Promise<void> {
        // const desc = await war.getDescForExeSystemBeginTurn(action);
        // (desc) && (FloatText.show(desc));

        // return war.getTurnManager().endPhaseWaitBeginTurn(action);

        const playerInTurn  = war.getPlayerInTurn();
        const playerIndex   = playerInTurn.getPlayerIndex();
        if ((playerIndex !== CommonConstants.PlayerIndex.Neutral)         &&
            (playerInTurn.getAliveState() !== Types.PlayerAliveState.Dead)
        ) {
            const nickname = await playerInTurn.getNickname();
            await new Promise<void>(resolve => {
                PanelHelpers.open(PanelHelpers.PanelDict.BwBeginTurnPanel, {
                    gameConfig          : war.getGameConfig(),
                    playerIndex,
                    teamIndex           : playerInTurn.getTeamIndex(),
                    nickname,
                    coId                : playerInTurn.getCoId(),
                    unitAndTileSkinId   : playerInTurn.getUnitAndTileSkinId(),
                    callbackOnFinish    : () => resolve(),
                });
            });
        }

        await war.getTurnManager().endPhaseWaitBeginTurn(action, false);
        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemCallWarEvent(war: BwWar, action: IWarActionSystemCallWarEvent, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeSystemCallWarEvent(war, action)
            : await normalExeSystemCallWarEvent(war, action);
    }
    async function fastExeSystemCallWarEvent(war: BwWar, action: IWarActionSystemCallWarEvent): Promise<void> {
        const warEventManager   = war.getWarEventManager();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            warEventManager.updateWarEventCalledCountOnCall(Helpers.getExisted(actionExtraData.warEventId, ClientErrorCode.WarActionExecutor_FastExeSystemCallWarEvent_00));
            await warEventManager.callWarEvent(action, true);
        } else {
            warEventManager.updateWarEventCalledCountOnCall(Helpers.getExisted(action.warEventId, ClientErrorCode.WarActionExecutor_FastExeSystemCallWarEvent_02));
            await warEventManager.callWarEvent(action, true);
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeSystemCallWarEvent(war: BwWar, action: IWarActionSystemCallWarEvent): Promise<void> {
        // const desc = await war.getDescForExeSystemCallWarEvent(action);
        // (desc) && (FloatText.show(desc));

        const warEventManager   = war.getWarEventManager();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            warEventManager.updateWarEventCalledCountOnCall(Helpers.getExisted(actionExtraData.warEventId, ClientErrorCode.WarActionExecutor_NormalExeSystemCallWarEvent_00));
            await warEventManager.callWarEvent(action, false);
        } else {
            warEventManager.updateWarEventCalledCountOnCall(Helpers.getExisted(action.warEventId, ClientErrorCode.WarActionExecutor_NormalExeSystemCallWarEvent_01));
            await warEventManager.callWarEvent(action, false);
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
        war.getView().updatePersistentText();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemDestroyPlayerForce(war: BwWar, action: IWarActionSystemDestroyPlayerForce, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeSystemDestroyPlayerForce(war, action)
            : await normalExeSystemDestroyPlayerForce(war, action);
    }
    async function fastExeSystemDestroyPlayerForce(war: BwWar, action: IWarActionSystemDestroyPlayerForce): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeSystemDestroyPlayerForce_00),
                isFastExecute   : true,
            });
            war.getDrawVoteManager().setRemainingVotes(null);
        } else {
            WarHelpers.WarDestructionHelpers.destroyPlayerForce(war, Helpers.getExisted(action.targetPlayerIndex), false);
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeSystemDestroyPlayerForce(war: BwWar, action: IWarActionSystemDestroyPlayerForce): Promise<void> {
        // const desc = await war.getDescForExeSystemDestroyPlayerForce(action);
        // (desc) && (FloatText.show(desc));

        const actionExtraData = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeSystemDestroyPlayerForce_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute                       : false,
            });
            war.getDrawVoteManager().setRemainingVotes(null);

        } else {
            WarHelpers.WarDestructionHelpers.destroyPlayerForce(war, Helpers.getExisted(action.targetPlayerIndex), true);
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemEndWar(war: BwWar, action: IWarActionSystemEndWar, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeSystemEndWar(war)
            : await normalExeSystemEndWar(war, action);
    }
    async function fastExeSystemEndWar(war: BwWar): Promise<void> {
        war.setIsEnded(true);
    }
    async function normalExeSystemEndWar(war: BwWar, action: IWarActionSystemEndWar): Promise<void> {
        const desc = await war.getDescForExeSystemEndWar(action);
        (desc) && (FloatText.show(desc));

        war.setIsEnded(true);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemEndTurn(war: BwWar, action: IWarActionSystemEndTurn, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeSystemEndTurn(war, action)
            : await normalExeSystemEndTurn(war, action);
    }
    async function fastExeSystemEndTurn(war: BwWar, action: IWarActionSystemEndTurn): Promise<void> {
        war.getTurnManager().endPhaseMain(action, true);
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeSystemEndTurn(war: BwWar, action: IWarActionSystemEndTurn): Promise<void> {
        // const desc = await war.getDescForExeSystemEndTurn(action);
        // (desc) && (FloatText.show(desc));

        war.getTurnManager().endPhaseMain(action, false);
        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemHandleBootPlayer(war: BwWar, action: IWarActionSystemHandleBootPlayer, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeSystemHandleBootPlayer(war, action)
            : await normalExeSystemHandleBootPlayer(war, action);
    }
    async function fastExeSystemHandleBootPlayer(war: BwWar, action: IWarActionSystemHandleBootPlayer): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeSystemHandleBootPlayer_00),
                isFastExecute   : true,
            });
        } else {
            war.getPlayerInTurn().setAliveState(Types.PlayerAliveState.Dying);
        }
    }
    async function normalExeSystemHandleBootPlayer(war: BwWar, action: IWarActionSystemHandleBootPlayer): Promise<void> {
        const desc = await war.getDescForExeSystemHandleBootPlayer(action);
        (desc) && (FloatText.show(desc));

        const actionExtraData = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeSystemHandleBootPlayer_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute                       : false,
            });

        } else {
            war.getPlayerInTurn().setAliveState(Types.PlayerAliveState.Dying);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemVoteForDraw(war: BwWar, action: IWarActionSystemVoteForDraw, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeSystemVoteForDraw(war, action)
            : await normalExeSystemVoteForDraw(war, action);
    }
    async function fastExeSystemVoteForDraw(war: BwWar, action: IWarActionSystemVoteForDraw): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeSystemVoteForDraw_00),
                isFastExecute   : true,
            });
        } else {
            const playerInTurn = war.getPlayerInTurn();
            playerInTurn.setHasVotedForDraw(true);
        }

        const drawVoteManager = war.getDrawVoteManager();
        if (!action.isAgree) {
            drawVoteManager.setRemainingVotes(null);
        } else {
            drawVoteManager.setRemainingVotes((drawVoteManager.getRemainingVotes() || drawVoteManager.getMaxVotes()) - 1);
        }
    }
    async function normalExeSystemVoteForDraw(war: BwWar, action: IWarActionSystemVoteForDraw): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeSystemVoteForDraw_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute   : false,
            });

        } else {
            const playerInTurn = war.getPlayerInTurn();
            playerInTurn.setHasVotedForDraw(true);
        }

        const drawVoteManager = war.getDrawVoteManager();
        if (!action.isAgree) {
            drawVoteManager.setRemainingVotes(null);
        } else {
            drawVoteManager.setRemainingVotes((drawVoteManager.getRemainingVotes() || drawVoteManager.getMaxVotes()) - 1);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitAttackTile(war: BwWar, action: IWarActionUnitAttackTile, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitAttackTile(war, action)
            : await normalExeUnitAttackTile(war, action);
    }
    async function fastExeUnitAttackTile(war: BwWar, action: IWarActionUnitAttackTile): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackTile_00),
                isFastExecute   : true,
            });

        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            if (path.isBlocked) {
                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

            } else {
                const targetGridIndex       = action.targetGridIndex as GridIndex;
                const battleDamageInfoArray = WarHelpers.WarDamageCalculator.getFinalBattleDamage({
                    war,
                    attackerMovePath: pathNodes,
                    launchUnitId,
                    targetGridIndex,
                });
                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                const tileMap           = war.getTileMap();
                const affectedPlayerSet = new Set<BwPlayer>();
                const affectedUnitSet   = new Set<BwUnit>();
                const damagedUnitSet    = new Set<BwUnit>();
                const destroyedTileSet  = new Set<BwTile>();
                const damagedTileSet    = new Set<BwTile>();

                for (const battleDamageInfo of battleDamageInfoArray) {
                    const unitId1   = Helpers.getExisted(battleDamageInfo.attackerUnitId, ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackTile_01);
                    const unit1     = Helpers.getExisted(unitMap.getUnitById(unitId1), ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackTile_02);
                    const player1   = unit1.getPlayer();
                    const damage    = Helpers.getExisted(battleDamageInfo.damage, ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackTile_03);
                    affectedPlayerSet.add(player1);
                    affectedUnitSet.add(unit1);

                    const unitId2 = battleDamageInfo.targetUnitId;
                    if (unitId2 != null) {
                        const unit2                 = Helpers.getExisted(unitMap.getUnitById(unitId2), ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackTile_04);
                        const unitGridIndex1        = unit1.getGridIndex();
                        const unitGridIndex2        = unit2.getGridIndex();
                        const playerIndex1          = unit1.getPlayerIndex();
                        const playerIndex2          = unit2.getPlayerIndex();
                        const coGridIndexArray1     = unitMap.getCoGridIndexListOnMap(playerIndex1);
                        const coGridIndexArray2     = unitMap.getCoGridIndexListOnMap(playerIndex2);
                        const unitOldHp2            = unit2.getCurrentHp();
                        const player2               = unit2.getPlayer();
                        const unitNewHp2            = Math.max(0, unitOldHp2 - damage);
                        const unitLostNormalizedHp2 = WarHelpers.WarCommonHelpers.getNormalizedHp(unitOldHp2) - WarHelpers.WarCommonHelpers.getNormalizedHp(unitNewHp2);
                        const isInCoZone1           = (unit1.getHasLoadedCo()) || (player1.checkIsInCoZone(unitGridIndex1, coGridIndexArray1));

                        handlePrimaryWeaponAmmoForUnitAttackUnit(unit1, unit2);
                        handleHpForUnit(unit2, unitNewHp2);
                        handlePromotionForUnitAttackUnit({
                            attackerPlayer              : player1,
                            attackerUnit                : unit1,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            attackerCoGridIndexListOnMap: coGridIndexArray1,
                            isTargetDestroyed           : unitNewHp2 <= 0,
                        });
                        handleFundForUnitAttackUnit({
                            attackerPlayer              : player1,
                            attackerUnit                : unit1,
                            targetUnit                  : unit2,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            isAttackerInAttackerCoZone  : isInCoZone1,
                        });
                        handleEnergyForUnitAttackUnit({
                            war,
                            attackerPlayer              : player1,
                            targetPlayer                : player2,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            targetCfgProductionCost     : unit2.getProductionCfgCost(),
                            isAttackerInAttackerCoZone  : isInCoZone1,
                            isTargetInTargetCoZone      : (unit2.getHasLoadedCo()) || (player2.checkIsInCoZone(unitGridIndex2, coGridIndexArray2)),
                        });
                        handleDestructionForUnit({
                            war,
                            unit    : unit2,
                        });

                        affectedPlayerSet.add(player2);
                        affectedUnitSet.add(unit2);
                        damagedUnitSet.add(unit2);

                        continue;
                    }

                    const gridIndex2 = GridIndexHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex);
                    if (gridIndex2 != null) {
                        const tile2         = tileMap.getTile(gridIndex2);
                        const tileOldHp2    = Helpers.getExisted(tile2.getCurrentHp(), ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackTile_05);
                        handlePrimaryWeaponAmmoForUnitAttackTile(unit1, tile2);
                        handleHpForTile(tile2, Math.max(0, tileOldHp2 - damage));

                        const result = handleDestructionForTile(war, tile2);
                        for (const tile of Helpers.getExisted(result.damagedTileSet)) {
                            damagedTileSet.add(tile);
                        }
                        for (const tile of Helpers.getExisted(result.destroyedTileSet)) {
                            destroyedTileSet.add(tile);
                        }

                        continue;
                    }

                    throw Helpers.newError(`Invalid battleDamageInfo.`, ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackTile_06);
                }

                for (const affectedPlayer of affectedPlayerSet) {
                    if ((!affectedPlayer.checkIsNeutral())                              &&
                        (!unitMap.checkHasUnit(affectedPlayer.getPlayerIndex()))        &&
                        (affectedPlayer.getAliveState() !== Types.PlayerAliveState.Dead)
                    ) {
                        affectedPlayer.setAliveState(Types.PlayerAliveState.Dying);
                    }
                }
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitAttackTile(war: BwWar, action: IWarActionUnitAttackTile): Promise<void> {
        // const desc = await war.getDescForExeUnitAttackTile(action);
        // (desc) && (FloatText.show(desc));

        const actionExtraData = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_00);
            const targetGridIndex = GridIndexHelpers.convertGridIndex(actionExtraData.targetGridIndex);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : targetGridIndex,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute                       : false,
            });

        } else {
            const path              = action.path as MovePath;
            const launchUnitId      = action.launchUnitId;
            const pathNodes         = path.nodes;
            const unitMap           = war.getUnitMap();
            const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            const targetGridIndex   = GridIndexHelpers.convertGridIndex(action.targetGridIndex);

            if (path.isBlocked) {
                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : true,
                    aiming      : null,
                });
                focusUnit.updateView();

            } else {
                if (targetGridIndex == null) {
                    throw Helpers.newError(`Empty targetGridIndex.`, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_01);
                }
                const battleDamageInfoArray = WarHelpers.WarDamageCalculator.getFinalBattleDamage({
                    war,
                    attackerMovePath: pathNodes,
                    launchUnitId,
                    targetGridIndex,
                });

                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                const allVisibleUnits = WarHelpers.WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : false,
                    aiming      : targetGridIndex,
                });

                const tileMap           = war.getTileMap();
                const affectedPlayerSet = new Set<BwPlayer>();
                const affectedUnitSet   = new Set<BwUnit>();
                const damagedUnitSet    = new Set<BwUnit>();
                const destroyedTileSet  = new Set<BwTile>();
                const damagedTileSet    = new Set<BwTile>();

                for (const battleDamageInfo of battleDamageInfoArray) {
                    const unitId1   = Helpers.getExisted(battleDamageInfo.attackerUnitId, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_02);
                    const unit1     = Helpers.getExisted(unitMap.getUnitById(unitId1), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_03);
                    const player1   = unit1.getPlayer();
                    const damage    = Helpers.getExisted(battleDamageInfo.damage, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_04);
                    affectedPlayerSet.add(player1);
                    affectedUnitSet.add(unit1);

                    const unitId2 = battleDamageInfo.targetUnitId;
                    if (unitId2 != null) {
                        const unitGridIndex1        = unit1.getGridIndex();
                        const unit2                 = Helpers.getExisted(unitMap.getUnitById(unitId2), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_05);
                        const unitGridIndex2        = unit2.getGridIndex();
                        const playerIndex1          = unit1.getPlayerIndex();
                        const playerIndex2          = unit2.getPlayerIndex();
                        const coGridIndexArray1     = unitMap.getCoGridIndexListOnMap(playerIndex1);
                        const coGridIndexArray2     = unitMap.getCoGridIndexListOnMap(playerIndex2);
                        const unitOldHp2            = unit2.getCurrentHp();
                        const player2               = unit2.getPlayer();
                        const unitNewHp2            = Math.max(0, unitOldHp2 - damage);
                        const unitLostNormalizedHp2 = WarHelpers.WarCommonHelpers.getNormalizedHp(unitOldHp2) - WarHelpers.WarCommonHelpers.getNormalizedHp(unitNewHp2);
                        const isInCoZone1           = (unit1.getHasLoadedCo()) || (player1.checkIsInCoZone(unitGridIndex1, coGridIndexArray1));

                        handlePrimaryWeaponAmmoForUnitAttackUnit(unit1, unit2);
                        handleHpForUnit(unit2, unitNewHp2);
                        handlePromotionForUnitAttackUnit({
                            attackerPlayer              : player1,
                            attackerUnit                : unit1,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            attackerCoGridIndexListOnMap: coGridIndexArray1,
                            isTargetDestroyed           : unitNewHp2 <= 0,
                        });
                        handleFundForUnitAttackUnit({
                            attackerPlayer              : player1,
                            attackerUnit                : unit1,
                            targetUnit                  : unit2,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            isAttackerInAttackerCoZone  : isInCoZone1,
                        });
                        handleEnergyForUnitAttackUnit({
                            war,
                            attackerPlayer              : player1,
                            targetPlayer                : player2,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            targetCfgProductionCost     : unit2.getProductionCfgCost(),
                            isAttackerInAttackerCoZone  : isInCoZone1,
                            isTargetInTargetCoZone      : (unit2.getHasLoadedCo()) || (player2.checkIsInCoZone(unitGridIndex2, coGridIndexArray2)),
                        });
                        handleDestructionForUnit({
                            war,
                            unit    : unit2,
                        });

                        affectedPlayerSet.add(player2);
                        affectedUnitSet.add(unit2);
                        damagedUnitSet.add(unit2);

                        continue;
                    }

                    const gridIndex2 = GridIndexHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex);
                    if (gridIndex2 != null) {
                        const tile2         = tileMap.getTile(gridIndex2);
                        const tileOldHp2    = Helpers.getExisted(tile2.getCurrentHp(), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_06);
                        handlePrimaryWeaponAmmoForUnitAttackTile(unit1, tile2);
                        handleHpForTile(tile2, Math.max(0, tileOldHp2 - damage));

                        const result = handleDestructionForTile(war, tile2);
                        for (const tile of Helpers.getExisted(result.damagedTileSet)) {
                            damagedTileSet.add(tile);
                        }
                        for (const tile of Helpers.getExisted(result.destroyedTileSet)) {
                            destroyedTileSet.add(tile);
                        }

                        continue;
                    }

                    throw Helpers.newError(`Invalid battleDamageInfo.`, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_07);
                }

                for (const affectedPlayer of affectedPlayerSet) {
                    const affectedPlayerIndex = affectedPlayer.getPlayerIndex();
                    if ((!unitMap.checkHasUnit(affectedPlayerIndex))                    &&
                        (affectedPlayer.getAliveState() !== Types.PlayerAliveState.Dead)
                    ) {
                        affectedPlayer.setAliveState(Types.PlayerAliveState.Dying);
                    }
                }

                const gridVisionEffect      = war.getGridVisualEffect();
                let isVisibleUnitDestroyed  = false;
                for (const unit of affectedUnitSet) {
                    if (allVisibleUnits.has(unit)) {
                        const gridIndex = unit.getGridIndex();
                        if (unit.getCurrentHp() <= 0) {
                            isVisibleUnitDestroyed = true;
                            gridVisionEffect.showEffectExplosion(gridIndex);

                        } else {
                            unit.updateView();
                            if (damagedUnitSet.has(unit)) {
                                gridVisionEffect.showEffectDamage(gridIndex);
                            }
                        }
                    }
                }
                for (const tile of damagedTileSet) {
                    if (!destroyedTileSet.has(tile)) {
                        tile.flushDataToView();
                        gridVisionEffect.showEffectDamage(tile.getGridIndex());
                    }
                }
                for (const tile of destroyedTileSet) {
                    tile.flushDataToView();
                    gridVisionEffect.showEffectExplosion(tile.getGridIndex());
                }
                if ((isVisibleUnitDestroyed) || (destroyedTileSet.size)) {
                    war.getView().showVibration();
                    SoundManager.playShortSfx(Types.ShortSfxCode.Explode);
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitAttackUnit(war: BwWar, action: IWarActionUnitAttackUnit, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitAttackUnit(war, action)
            : await normalExeUnitAttackUnit(war, action);
    }
    async function fastExeUnitAttackUnit(war: BwWar, action: IWarActionUnitAttackUnit): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackUnit_00),
                isFastExecute   : true,
            });

        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            if (path.isBlocked) {
                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

            } else {
                const targetGridIndex       = action.targetGridIndex as GridIndex;
                const battleDamageInfoArray = WarHelpers.WarDamageCalculator.getFinalBattleDamage({
                    war,
                    attackerMovePath: pathNodes,
                    launchUnitId,
                    targetGridIndex,
                });
                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                const tileMap           = war.getTileMap();
                const affectedPlayerSet = new Set<BwPlayer>();
                const affectedUnitSet   = new Set<BwUnit>();
                const damagedUnitSet    = new Set<BwUnit>();
                const destroyedTileSet  = new Set<BwTile>();
                const damagedTileSet    = new Set<BwTile>();

                for (const battleDamageInfo of battleDamageInfoArray) {
                    const unitId1   = Helpers.getExisted(battleDamageInfo.attackerUnitId, ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackUnit_01);
                    const unit1     = Helpers.getExisted(unitMap.getUnitById(unitId1),ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackUnit_02);
                    const player1   = unit1.getPlayer();
                    const damage    = Helpers.getExisted(battleDamageInfo.damage, ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackUnit_03);
                    affectedPlayerSet.add(player1);
                    affectedUnitSet.add(unit1);

                    const unitId2 = battleDamageInfo.targetUnitId;
                    if (unitId2 != null) {
                        const unit2                 = Helpers.getExisted(unitMap.getUnitById(unitId2), ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackUnit_04);
                        const unitGridIndex1        = unit1.getGridIndex();
                        const unitGridIndex2        = unit2.getGridIndex();
                        const playerIndex1          = unit1.getPlayerIndex();
                        const playerIndex2          = unit2.getPlayerIndex();
                        const coGridIndexArray1     = unitMap.getCoGridIndexListOnMap(playerIndex1);
                        const coGridIndexArray2     = unitMap.getCoGridIndexListOnMap(playerIndex2);
                        const unitOldHp2            = unit2.getCurrentHp();
                        const player2               = unit2.getPlayer();
                        const unitNewHp2            = Math.max(0, unitOldHp2 - damage);
                        const unitLostNormalizedHp2 = WarHelpers.WarCommonHelpers.getNormalizedHp(unitOldHp2) - WarHelpers.WarCommonHelpers.getNormalizedHp(unitNewHp2);
                        const isInCoZone1           = (unit1.getHasLoadedCo()) || (player1.checkIsInCoZone(unitGridIndex1, coGridIndexArray1));

                        handlePrimaryWeaponAmmoForUnitAttackUnit(unit1, unit2);
                        handleHpForUnit(unit2, unitNewHp2);
                        handlePromotionForUnitAttackUnit({
                            attackerPlayer              : player1,
                            attackerUnit                : unit1,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            attackerCoGridIndexListOnMap: coGridIndexArray1,
                            isTargetDestroyed           : unitNewHp2 <= 0,
                        });
                        handleFundForUnitAttackUnit({
                            attackerPlayer              : player1,
                            attackerUnit                : unit1,
                            targetUnit                  : unit2,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            isAttackerInAttackerCoZone  : isInCoZone1,
                        });
                        handleEnergyForUnitAttackUnit({
                            war,
                            attackerPlayer              : player1,
                            targetPlayer                : player2,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            targetCfgProductionCost     : unit2.getProductionCfgCost(),
                            isAttackerInAttackerCoZone  : isInCoZone1,
                            isTargetInTargetCoZone      : (unit2.getHasLoadedCo()) || (player2.checkIsInCoZone(unitGridIndex2, coGridIndexArray2)),
                        });
                        handleDestructionForUnit({
                            war,
                            unit    : unit2,
                        });

                        affectedPlayerSet.add(player2);
                        affectedUnitSet.add(unit2);
                        damagedUnitSet.add(unit2);

                        continue;
                    }

                    const gridIndex2 = GridIndexHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex);
                    if (gridIndex2 != null) {
                        const tile2         = tileMap.getTile(gridIndex2);
                        const tileOldHp2    = Helpers.getExisted(tile2.getCurrentHp(), ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackUnit_05);
                        handlePrimaryWeaponAmmoForUnitAttackTile(unit1, tile2);
                        handleHpForTile(tile2, Math.max(0, tileOldHp2 - damage));

                        const result = handleDestructionForTile(war, tile2);
                        for (const tile of Helpers.getExisted(result.damagedTileSet)) {
                            damagedTileSet.add(tile);
                        }
                        for (const tile of Helpers.getExisted(result.destroyedTileSet)) {
                            destroyedTileSet.add(tile);
                        }

                        continue;
                    }

                    throw Helpers.newError(`Invalid battleDamageInfo.`, ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackUnit_06);
                }

                for (const affectedPlayer of affectedPlayerSet) {
                    if ((!affectedPlayer.checkIsNeutral())                              &&
                        (!unitMap.checkHasUnit(affectedPlayer.getPlayerIndex()))        &&
                        (affectedPlayer.getAliveState() !== Types.PlayerAliveState.Dead)
                    ) {
                        affectedPlayer.setAliveState(Types.PlayerAliveState.Dying);
                    }
                }
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitAttackUnit(war: BwWar, action: IWarActionUnitAttackUnit): Promise<void> {
        // const desc = await war.getDescForExeUnitAttackUnit(action);
        // (desc) && (FloatText.show(desc));

        const warView           = war.getView();
        const gridVisualEffect  = war.getGridVisualEffect();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            const commonExtraData   = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_00);
            const targetGridIndex   = GridIndexHelpers.convertGridIndex(actionExtraData.targetGridIndex);
            const movingUnitAndPath = commonExtraData.movingUnitAndPath;
            const movingUnitData    = movingUnitAndPath?.unit;
            const movingPath        = movingUnitAndPath?.path;
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath,
                aiming                  : targetGridIndex,
                deleteViewAfterMoving   : true,
            });

            const destroyedUnitIdArray  = commonExtraData.destroyedUnitIdArray;
            const isWarViewVibrated     = WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute       : false,
            });

            const movingUnitId  = movingUnitData?.unitId;
            const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
            if ((movingUnitId != null)                                      &&
                ((destroyedUnitIdArray?? []).indexOf(movingUnitId) >= 0)    &&
                (lastNode?.isVisible)
            ) {
                gridVisualEffect.showEffectExplosion(Helpers.getExisted(GridIndexHelpers.convertGridIndex(lastNode.gridIndex), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_01));
                if (!isWarViewVibrated) {
                    warView.showVibration();
                    SoundManager.playShortSfx(Types.ShortSfxCode.Explode);
                }
            }

        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            if (path.isBlocked) {
                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : true,
                    aiming      : null,
                });
                focusUnit.updateView();

            } else {
                const targetGridIndex = GridIndexHelpers.convertGridIndex(action.targetGridIndex);
                if (targetGridIndex == null) {
                    throw Helpers.newError(`Empty targetGridIndex.`, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_02);
                }

                const battleDamageInfoArray = WarHelpers.WarDamageCalculator.getFinalBattleDamage({
                    war,
                    attackerMovePath: pathNodes,
                    launchUnitId,
                    targetGridIndex,
                });
                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                const allVisibleUnits = WarHelpers.WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : false,
                    aiming      : allVisibleUnits.has(Helpers.getExisted(unitMap.getUnitOnMap(targetGridIndex), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_03)) ? targetGridIndex : null,
                });

                const tileMap           = war.getTileMap();
                const affectedPlayerSet = new Set<BwPlayer>();
                const affectedUnitSet   = new Set<BwUnit>();
                const damagedUnitSet    = new Set<BwUnit>();
                const destroyedTileSet  = new Set<BwTile>();
                const damagedTileSet    = new Set<BwTile>();

                for (const battleDamageInfo of battleDamageInfoArray) {
                    const unitId1   = Helpers.getExisted(battleDamageInfo.attackerUnitId, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_04);
                    const unit1     = Helpers.getExisted(unitMap.getUnitById(unitId1), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_05);
                    const player1   = unit1.getPlayer();
                    const damage    = Helpers.getExisted(battleDamageInfo.damage, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_06);
                    affectedPlayerSet.add(player1);
                    affectedUnitSet.add(unit1);

                    const unitId2 = battleDamageInfo.targetUnitId;
                    if (unitId2 != null) {
                        const unit2                 = Helpers.getExisted(unitMap.getUnitById(unitId2), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_07);
                        const unitGridIndex1        = unit1.getGridIndex();
                        const unitGridIndex2        = unit2.getGridIndex();
                        const playerIndex1          = unit1.getPlayerIndex();
                        const playerIndex2          = unit2.getPlayerIndex();
                        const coGridIndexArray1     = unitMap.getCoGridIndexListOnMap(playerIndex1);
                        const coGridIndexArray2     = unitMap.getCoGridIndexListOnMap(playerIndex2);
                        const unitOldHp2            = unit2.getCurrentHp();
                        const player2               = unit2.getPlayer();
                        const unitNewHp2            = Math.max(0, unitOldHp2 - damage);
                        const unitLostNormalizedHp2 = WarHelpers.WarCommonHelpers.getNormalizedHp(unitOldHp2) - WarHelpers.WarCommonHelpers.getNormalizedHp(unitNewHp2);
                        const isInCoZone1           = (unit1.getHasLoadedCo()) || (player1.checkIsInCoZone(unitGridIndex1, coGridIndexArray1));

                        handlePrimaryWeaponAmmoForUnitAttackUnit(unit1, unit2);
                        handleHpForUnit(unit2, unitNewHp2);
                        handlePromotionForUnitAttackUnit({
                            attackerPlayer              : player1,
                            attackerUnit                : unit1,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            attackerCoGridIndexListOnMap: coGridIndexArray1,
                            isTargetDestroyed           : unitNewHp2 <= 0,
                        });
                        handleFundForUnitAttackUnit({
                            attackerPlayer              : player1,
                            attackerUnit                : unit1,
                            targetUnit                  : unit2,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            isAttackerInAttackerCoZone  : isInCoZone1,
                        });
                        handleEnergyForUnitAttackUnit({
                            war,
                            attackerPlayer              : player1,
                            targetPlayer                : player2,
                            targetLostNormalizedHp      : unitLostNormalizedHp2,
                            targetCfgProductionCost     : unit2.getProductionCfgCost(),
                            isAttackerInAttackerCoZone  : isInCoZone1,
                            isTargetInTargetCoZone      : (unit2.getHasLoadedCo()) || (player2.checkIsInCoZone(unitGridIndex2, coGridIndexArray2)),
                        });
                        handleDestructionForUnit({
                            war,
                            unit    : unit2,
                        });

                        affectedPlayerSet.add(player2);
                        affectedUnitSet.add(unit2);
                        damagedUnitSet.add(unit2);

                        continue;
                    }

                    const gridIndex2 = GridIndexHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex);
                    if (gridIndex2 != null) {
                        const tile2         = tileMap.getTile(gridIndex2);
                        const tileOldHp2    = Helpers.getExisted(tile2.getCurrentHp(), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_08);
                        handlePrimaryWeaponAmmoForUnitAttackTile(unit1, tile2);
                        handleHpForTile(tile2, Math.max(0, tileOldHp2 - damage));

                        const result = handleDestructionForTile(war, tile2);
                        for (const tile of Helpers.getExisted(result.damagedTileSet)) {
                            damagedTileSet.add(tile);
                        }
                        for (const tile of Helpers.getExisted(result.destroyedTileSet)) {
                            destroyedTileSet.add(tile);
                        }

                        continue;
                    }

                    throw Helpers.newError(`Invalid battleDamageInfo.`, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_09);
                }

                for (const affectedPlayer of affectedPlayerSet) {
                    const affectedPlayerIndex = affectedPlayer.getPlayerIndex();
                    if ((!unitMap.checkHasUnit(affectedPlayerIndex))                    &&
                        (affectedPlayer.getAliveState() !== Types.PlayerAliveState.Dead)
                    ) {
                        affectedPlayer.setAliveState(Types.PlayerAliveState.Dying);
                    }
                }

                let isVisibleUnitDestroyed  = false;
                for (const unit of affectedUnitSet) {
                    if (allVisibleUnits.has(unit)) {
                        const gridIndex = unit.getGridIndex();
                        if (unit.getCurrentHp() <= 0) {
                            isVisibleUnitDestroyed = true;
                            gridVisualEffect.showEffectExplosion(gridIndex);

                        } else {
                            unit.updateView();
                            if (damagedUnitSet.has(unit)) {
                                gridVisualEffect.showEffectDamage(gridIndex);
                            }
                        }
                    }
                }
                for (const tile of damagedTileSet) {
                    if (!destroyedTileSet.has(tile)) {
                        tile.flushDataToView();
                        gridVisualEffect.showEffectDamage(tile.getGridIndex());
                    }
                }
                for (const tile of destroyedTileSet) {
                    tile.flushDataToView();
                    gridVisualEffect.showEffectExplosion(tile.getGridIndex());
                }
                if ((isVisibleUnitDestroyed) || (destroyedTileSet.size)) {
                    war.getView().showVibration();
                    SoundManager.playShortSfx(Types.ShortSfxCode.Explode);
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitBeLoaded(war: BwWar, action: IWarActionUnitBeLoaded, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitBeLoaded(war, action)
            : await normalExeUnitBeLoaded(war, action);
    }
    async function fastExeUnitBeLoaded(war: BwWar, action: IWarActionUnitBeLoaded): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitBeLoaded_00),
                isFastExecute   : true,
            });
        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            focusUnit.setActionState(UnitActionState.Acted);
            if (path.isBlocked) {
                unitMap.setUnitOnMap(focusUnit);
            } else {
                const loaderUnit = Helpers.getExisted(unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]));
                unitMap.setUnitLoaded(focusUnit);
                focusUnit.setLoaderUnitId(loaderUnit.getUnitId());
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitBeLoaded(war: BwWar, action: IWarActionUnitBeLoaded): Promise<void> {
        // const desc = await war.getDescForExeUnitBeLoaded(action);
        // (desc) && (FloatText.show(desc));

        const unitMap           = war.getUnitMap();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            const commonExtraData       = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitBeLoaded_00);
            const movingUnitAndPath     = commonExtraData.movingUnitAndPath;
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute       : false,
            });

            {
                const movingPath    = movingUnitAndPath?.path;
                const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
                if ((lastNode) && (lastNode.isVisible) && (!lastNode.isBlocked)) {
                    const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(lastNode.gridIndex), ClientErrorCode.WarActionExecutor_NormalExeUnitBeLoaded_01);
                    unitMap.getUnitOnMap(gridIndex)?.updateView();
                }
            }

        } else {
            const revisedPath   = action.path as MovePath;
            const pathNodes     = revisedPath.nodes;
            const launchUnitId  = action.launchUnitId;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            focusUnit.setActionState(UnitActionState.Acted);

            if (revisedPath.isBlocked) {
                unitMap.setUnitOnMap(focusUnit);

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : revisedPath.isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();

            } else {
                const loaderUnit = Helpers.getExisted(unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]));
                unitMap.setUnitLoaded(focusUnit);
                focusUnit.setLoaderUnitId(loaderUnit.getUnitId());

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : revisedPath.isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();
                focusUnit.setViewVisible(false);
                loaderUnit.updateView();
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitBuildTile(war: BwWar, action: IWarActionUnitBuildTile, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitBuildTile(war, action)
            : await normalExeUnitBuildTile(war, action);
    }
    async function fastExeUnitBuildTile(war: BwWar, action: IWarActionUnitBuildTile): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.BwWarActionExecutor_FastExeUnitBuildTile_00),
                isFastExecute   : true,
            });
        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            if (!path.isBlocked) {
                const endingGridIndex   = pathNodes[pathNodes.length - 1];
                const tile              = war.getTileMap().getTile(endingGridIndex);
                const buildPoint        = Helpers.getExisted(tile.getCurrentBuildPoint()) - Helpers.getExisted(focusUnit.getBuildAmount());
                // if (tile.getIsFogEnabled()) {
                //     tile.setFogDisabled();
                // }
                if (buildPoint > 0) {
                    focusUnit.setIsBuildingTile(true);
                    tile.setCurrentBuildPoint(buildPoint);
                } else {
                    const targetTileCfg = Helpers.getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType()), ClientErrorCode.BwWarActionExecutor_FastExeUnitBuildTile_01);
                    focusUnit.setIsBuildingTile(false);
                    focusUnit.setCurrentBuildMaterial(Helpers.getExisted(focusUnit.getCurrentBuildMaterial()) - 1);
                    tile.resetByTypeAndPlayerIndex({
                        baseType        : Helpers.getExisted(targetTileCfg.dstBaseType),
                        objectType      : Helpers.getExisted(targetTileCfg.dstObjectType),
                        playerIndex     : focusUnit.getPlayerIndex(),
                    });
                }
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitBuildTile(war: BwWar, action: IWarActionUnitBuildTile): Promise<void> {
        // const desc = await war.getDescForExeUnitBuildTile(action);
        // (desc) && (FloatText.show(desc));

        const unitMap           = war.getUnitMap();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.BwWarActionExecutor_NormalExeUnitBuildTile_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute   : false,
            });

        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            if (!path.isBlocked) {
                const endingGridIndex   = pathNodes[pathNodes.length - 1];
                const tile              = war.getTileMap().getTile(endingGridIndex);
                const buildPoint        = Helpers.getExisted(tile.getCurrentBuildPoint()) - Helpers.getExisted(focusUnit.getBuildAmount());
                // if (tile.getIsFogEnabled()) {
                //     tile.setFogDisabled();
                // }
                if (buildPoint > 0) {
                    focusUnit.setIsBuildingTile(true);
                    tile.setCurrentBuildPoint(buildPoint);
                } else {
                    const targetTileCfg = Helpers.getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType()), ClientErrorCode.BwWarActionExecutor_NormalExeUnitBuildTile_01);
                    focusUnit.setIsBuildingTile(false);
                    focusUnit.setCurrentBuildMaterial(Helpers.getExisted(focusUnit.getCurrentBuildMaterial()) - 1);
                    tile.resetByTypeAndPlayerIndex({
                        baseType        : Helpers.getExisted(targetTileCfg.dstBaseType),
                        objectType      : Helpers.getExisted(targetTileCfg.dstObjectType),
                        playerIndex     : focusUnit.getPlayerIndex(),
                    });
                }
            }

            await focusUnit.moveViewAlongPath({
                pathNodes,
                isDiving    : focusUnit.getIsDiving(),
                isBlocked   : path.isBlocked,
                aiming      : null,
            });
            focusUnit.updateView();
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitCaptureTile(war: BwWar, action: IWarActionUnitCaptureTile, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitCaptureTile(war, action)
            : await normalExeUnitCaptureTile(war, action);
    }
    async function fastExeUnitCaptureTile(war: BwWar, action: IWarActionUnitCaptureTile): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitCaptureTile_00),
                isFastExecute   : true,
            });
        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            if (path.isBlocked) {
                // nothing to do.
            } else {
                const destination       = pathNodes[pathNodes.length - 1];
                const tile              = war.getTileMap().getTile(destination);
                const restCapturePoint  = Helpers.getExisted(tile.getCurrentCapturePoint()) - Helpers.getExisted(focusUnit.getCaptureAmount(destination));
                if ((restCapturePoint <= 0) && (tile.checkIsDefeatOnCapture())) {
                    tile.getPlayer().setAliveState(Types.PlayerAliveState.Dying);
                }

                if (restCapturePoint > 0) {
                    focusUnit.setIsCapturingTile(true);
                    tile.setCurrentCapturePoint(restCapturePoint);
                } else {
                    const tileObjectType = tile.getObjectType();
                    focusUnit.setIsCapturingTile(false);
                    tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
                    tile.resetByTypeAndPlayerIndex({
                        baseType        : tile.getBaseType(),
                        objectType      : tile.getGameConfig().getTileObjectCfg(tileObjectType)?.typeAfterOwnerChange ?? tileObjectType,
                        playerIndex     : focusUnit.getPlayerIndex(),
                    });
                }
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitCaptureTile(war: BwWar, action: IWarActionUnitCaptureTile): Promise<void> {
        // const desc = await war.getDescForExeUnitCaptureTile(action);
        // (desc) && (FloatText.show(desc));

        const actionExtraData   = action.extraData;
        const unitMap           = war.getUnitMap();
        const tileMap           = war.getTileMap();
        const playerInTurn      = war.getPlayerInTurn();
        const isSelfInTurn      = playerInTurn.getUserId() === User.UserModel.getSelfUserId();
        if (actionExtraData) {
            const commonExtraData       = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitCaptureTile_00);
            const movingUnitAndPath     = commonExtraData.movingUnitAndPath;
            const movingPath            = movingUnitAndPath?.path;
            const tileArrayAfterAction  = commonExtraData.tileArrayAfterAction;
            const extraUnitView         = await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : false,
            });

            {
                const lastNode = movingPath ? movingPath[movingPath.length - 1] : null;
                if ((isSelfInTurn) && (lastNode) && (!lastNode.isBlocked)) {
                    const gridIndex             = Helpers.getExisted(GridIndexHelpers.convertGridIndex(lastNode.gridIndex), ClientErrorCode.WarActionExecutor_NormalExeUnitCaptureTile_01);
                    const tile                  = tileMap.getTile(gridIndex);
                    const maxCapturePoint       = Helpers.getExisted(tile.getMaxCapturePoint(), ClientErrorCode.WarActionExecutor_NormalExeUnitCaptureTile_02);
                    const tileDataAfterAction   = Helpers.getExisted(tileArrayAfterAction?.find(v => {
                        return GridIndexHelpers.checkIsEqual(gridIndex, Helpers.getExisted(GridIndexHelpers.convertGridIndex(v.gridIndex), ClientErrorCode.WarActionExecutor_NormalExeUnitCaptureTile_03));
                    }), ClientErrorCode.WarActionExecutor_NormalExeUnitCaptureTile_04);
                    await new Promise<void>(resolve => {
                        PanelHelpers.open(PanelHelpers.PanelDict.BwCaptureProgressPanel, {
                            maxValue            : maxCapturePoint,
                            newValue            : maxCapturePoint - (tileDataAfterAction.currentCapturePoint ?? 0),
                            currentValue        : maxCapturePoint - Helpers.getExisted(tile.getCurrentCapturePoint(), ClientErrorCode.WarActionExecutor_NormalExeUnitCaptureTile_05),
                            callbackOnFinish    : () => resolve(),
                        });
                    });
                }
            }

            (extraUnitView) && (unitMap.getView().removeUnit(extraUnitView));

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute       : false,
            });

        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            if (path.isBlocked) {
                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : true,
                    aiming      : null,
                });
                focusUnit.updateView();

            } else {
                const destination           = pathNodes[pathNodes.length - 1];
                const tile                  = war.getTileMap().getTile(destination);
                const maxCapturePoint       = Helpers.getExisted(tile.getMaxCapturePoint());
                const currentCapturePoint   = Helpers.getExisted(tile.getCurrentCapturePoint());
                const restCapturePoint      = currentCapturePoint - Helpers.getExisted(focusUnit.getCaptureAmount(destination));
                if ((restCapturePoint <= 0) && (tile.checkIsDefeatOnCapture())) {
                    tile.getPlayer().setAliveState(Types.PlayerAliveState.Dying);
                }

                if (restCapturePoint > 0) {
                    focusUnit.setIsCapturingTile(true);
                    tile.setCurrentCapturePoint(restCapturePoint);
                } else {
                    const tileObjectType = tile.getObjectType();
                    focusUnit.setIsCapturingTile(false);
                    tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
                    tile.resetByTypeAndPlayerIndex({
                        baseType    : tile.getBaseType(),
                        objectType  : tile.getGameConfig().getTileObjectCfg(tileObjectType)?.typeAfterOwnerChange ?? tileObjectType,
                        playerIndex : focusUnit.getPlayerIndex(),
                    });
                }

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : false,
                    aiming      : null,
                });
                if (isSelfInTurn) {
                    await new Promise<void>(resolve => {
                        PanelHelpers.open(PanelHelpers.PanelDict.BwCaptureProgressPanel, {
                            maxValue            : maxCapturePoint,
                            newValue            : maxCapturePoint - restCapturePoint,
                            currentValue        : maxCapturePoint - currentCapturePoint,
                            callbackOnFinish    : () => resolve(),
                        });
                    });
                }
                focusUnit.updateView();
                tile.flushDataToView();
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitDive(war: BwWar, action: IWarActionUnitDive, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitDive(war, action)
            : await normalExeUnitDive(war, action);
    }
    async function fastExeUnitDive(war: BwWar, action: IWarActionUnitDive): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitDive_00),
                isFastExecute   : true,
            });
        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            const isSuccessful  = !path.isBlocked;
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);
            (isSuccessful) && (focusUnit.setIsDiving(true));
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitDive(war: BwWar, action: IWarActionUnitDive): Promise<void> {
        // const desc = await war.getDescForExeUnitDive(action);
        // (desc) && (FloatText.show(desc));

        const gridVisualEffect  = war.getGridVisualEffect();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            const commonExtraData   = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitDive_00);
            const movingUnitAndPath = commonExtraData.movingUnitAndPath;
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            const movingPath    = movingUnitAndPath?.path;
            const lastNode      = movingPath ? movingPath[movingPath?.length - 1] : null;
            if ((lastNode?.isVisible) && (!lastNode.isBlocked)) {
                gridVisualEffect.showEffectDive(Helpers.getExisted(GridIndexHelpers.convertGridIndex(lastNode.gridIndex), ClientErrorCode.WarActionExecutor_NormalExeUnitDive_01));
            }

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute       : false,
            });

        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            const isSuccessful  = !path.isBlocked;
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);
            (isSuccessful) && (focusUnit.setIsDiving(true));

            await focusUnit.moveViewAlongPath({
                pathNodes,
                isDiving    : false,
                isBlocked   : path.isBlocked,
                aiming      : null,
            });
            focusUnit.updateView();
            if (isSuccessful) {
                const endingGridIndex = pathNodes[pathNodes.length - 1];
                if (WarHelpers.WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                    war,
                    unitType            : focusUnit.getUnitType(),
                    unitPlayerIndex     : focusUnit.getPlayerIndex(),
                    gridIndex           : endingGridIndex,
                    observerTeamIndexes : war.getPlayerManager().getWatcherTeamIndexesForSelf(),
                    isDiving            : false,
                })) {
                    gridVisualEffect.showEffectDive(endingGridIndex);
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitDropUnit(war: BwWar, action: IWarActionUnitDropUnit, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitDropUnit(war, action)
            : await normalExeUnitDropUnit(war, action);
    }
    async function fastExeUnitDropUnit(war: BwWar, action: IWarActionUnitDropUnit): Promise<void> {
        const fogMap            = war.getFogMap();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitDropUnit_00),
                isFastExecute   : true,
            });
        } else {
            const path              = action.path as MovePath;
            const launchUnitId      = action.launchUnitId;
            const pathNodes         = path.nodes;
            const unitMap           = war.getUnitMap();
            const endingGridIndex   = pathNodes[pathNodes.length - 1];
            const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            const shouldUpdateFogMap    = war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex());
            const unitsForDrop          : BwUnit[] = [];
            for (const { unitId, gridIndex } of (action.dropDestinations || []) as Types.DropDestination[]) {
                const unitForDrop = Helpers.getExisted(unitMap.getUnitLoadedById(unitId));
                unitMap.setUnitUnloaded(unitId, gridIndex);
                for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                    unit.setGridIndex(gridIndex);
                }

                unitForDrop.setLoaderUnitId(null);
                unitForDrop.setGridIndex(gridIndex);
                unitForDrop.setActionState(UnitActionState.Acted);
                unitsForDrop.push(unitForDrop);

                if (shouldUpdateFogMap) {
                    fogMap.updateMapFromPathsByUnitAndPath(unitForDrop, [endingGridIndex, gridIndex]);
                }
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitDropUnit(war: BwWar, action: IWarActionUnitDropUnit): Promise<void> {
        // const desc = await war.getDescForExeUnitDropUnit(action);
        // (desc) && (FloatText.show(desc));

        const actionExtraData   = action.extraData;
        const gridVisualEffect  = war.getGridVisualEffect();
        const unitMap           = war.getUnitMap();
        if (actionExtraData) {
            const commonExtraData   = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitDropUnit_00);
            const movingUnitAndPath = commonExtraData.movingUnitAndPath;
            const movingUnitView    = await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : false,
            });

            const movingPath    = movingUnitAndPath?.path;
            const lastNode      = movingPath ? movingPath[movingPath?.length - 1] : null;
            const unitMapView   = unitMap.getView();
            if (lastNode) {
                if (lastNode.isVisible) {
                    if (actionExtraData.isDropBlocked) {
                        gridVisualEffect.showEffectBlock(Helpers.getExisted(GridIndexHelpers.convertGridIndex(lastNode.gridIndex), ClientErrorCode.WarActionExecutor_NormalExeUnitDropUnit_01));
                    }
                } else {
                    (movingUnitView) && (unitMapView.removeUnit(movingUnitView));
                }
            }

            await Promise.all((actionExtraData.droppingUnitAndPathArray ?? []).map(v => WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : v,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            })));
            (movingUnitView) && (unitMapView.removeUnit(movingUnitView));

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute       : false,
            });

        } else {
            const path              = action.path as MovePath;
            const launchUnitId      = action.launchUnitId;
            const pathNodes         = path.nodes;
            const endingGridIndex   = pathNodes[pathNodes.length - 1];
            const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            const shouldUpdateFogMap    = war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex());
            const fogMap                = war.getFogMap();
            const unitsForDrop          : BwUnit[] = [];
            for (const { unitId, gridIndex } of (action.dropDestinations || []) as Types.DropDestination[]) {
                const unitForDrop = Helpers.getExisted(unitMap.getUnitLoadedById(unitId));
                unitMap.setUnitUnloaded(unitId, gridIndex);
                for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                    unit.setGridIndex(gridIndex);
                }

                unitForDrop.setLoaderUnitId(null);
                unitForDrop.setGridIndex(gridIndex);
                unitForDrop.setActionState(UnitActionState.Acted);
                unitsForDrop.push(unitForDrop);

                if (shouldUpdateFogMap) {
                    fogMap.updateMapFromPathsByUnitAndPath(unitForDrop, [endingGridIndex, gridIndex]);
                }
            }

            await focusUnit.moveViewAlongPath({
                pathNodes,
                isDiving    : focusUnit.getIsDiving(),
                isBlocked   : path.isBlocked,
                aiming      : null,
            });
            if (action.isDropBlocked) {
                gridVisualEffect.showEffectBlock(endingGridIndex);
            }
            focusUnit.updateView();

            const promises: Promise<void>[] = [];
            for (const unitForDrop of unitsForDrop) {
                promises.push((async () => {
                    await unitForDrop.moveViewAlongPath({
                        pathNodes   : [endingGridIndex, unitForDrop.getGridIndex()],
                        isDiving    : unitForDrop.getIsDiving(),
                        isBlocked   : false,
                        aiming      : null,
                    });
                    unitForDrop.updateView();
                })());
            }
            await Promise.all(promises);
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitJoinUnit(war: BwWar, action: IWarActionUnitJoinUnit, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitJoinUnit(war, action)
            : await normalExeUnitJoinUnit(war, action);
    }
    async function fastExeUnitJoinUnit(war: BwWar, action: IWarActionUnitJoinUnit): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitJoinUnit_00),
                isFastExecute   : true,
            });
        } else {
            const path              = action.path as MovePath;
            const launchUnitId      = action.launchUnitId;
            const pathNodes         = path.nodes;
            const endingGridIndex   = pathNodes[pathNodes.length - 1];
            const unitMap           = war.getUnitMap();
            const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

            if (path.isBlocked) {
                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

            } else {
                const targetUnit    = Helpers.getExisted(unitMap.getUnitOnMap(endingGridIndex));
                const player        = war.getPlayer(focusUnit.getPlayerIndex());
                unitMap.removeUnitOnMap(endingGridIndex, true);
                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                focusUnit.setHasLoadedCo(focusUnit.getHasLoadedCo() || targetUnit.getHasLoadedCo());

                if (focusUnit.checkHasPrimaryWeapon()) {
                    focusUnit.setPrimaryWeaponCurrentAmmo(Math.min(
                        Helpers.getExisted(focusUnit.getPrimaryWeaponMaxAmmo()),
                        Helpers.getExisted(focusUnit.getPrimaryWeaponCurrentAmmo()) + Helpers.getExisted(targetUnit.getPrimaryWeaponCurrentAmmo()),
                    ));
                }

                const joinIncome = focusUnit.getJoinIncome(targetUnit);
                if (joinIncome !== 0) {
                    player.setFund(player.getFund() + joinIncome);
                }

                if (war.getGameConfig().getSystemCfg().isUnitHpRoundedUpWhenHealed) {
                    focusUnit.setCurrentHp(Math.min(
                        focusUnit.getMaxHp(),
                        (focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()) * CommonConstants.UnitHpNormalizer,
                    ));
                } else {
                    const joinedNormalizedHp = Math.min(
                        focusUnit.getNormalizedMaxHp(),
                        focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()
                    );
                    focusUnit.setCurrentHp(Math.max(
                        (joinedNormalizedHp - 1) * CommonConstants.UnitHpNormalizer + 1,
                        Math.min(focusUnit.getCurrentHp() + targetUnit.getCurrentHp(), focusUnit.getMaxHp())
                    ));
                }

                focusUnit.setCurrentFuel(Math.min(
                    focusUnit.getMaxFuel(),
                    focusUnit.getCurrentFuel() + targetUnit.getCurrentFuel()
                ));

                const maxBuildMaterial = focusUnit.getMaxBuildMaterial();
                if (maxBuildMaterial != null) {
                    focusUnit.setCurrentBuildMaterial(Math.min(
                        maxBuildMaterial,
                        Helpers.getExisted(focusUnit.getCurrentBuildMaterial()) + Helpers.getExisted(targetUnit.getCurrentBuildMaterial()),
                    ));
                }

                const maxProduceMaterial = focusUnit.getMaxProduceMaterial();
                if (maxProduceMaterial != null) {
                    focusUnit.setCurrentProduceMaterial(Math.min(
                        maxProduceMaterial,
                        Helpers.getExisted(focusUnit.getCurrentProduceMaterial()) + Helpers.getExisted(targetUnit.getCurrentProduceMaterial()),
                    ));
                }

                focusUnit.setCurrentPromotion(Math.max(focusUnit.getCurrentPromotion(), targetUnit.getCurrentPromotion()));

                focusUnit.setIsCapturingTile(targetUnit.getIsCapturingTile());

                focusUnit.setIsBuildingTile(targetUnit.getIsBuildingTile());

                // flare ammo
                {
                    const maxAmmo = focusUnit.getFlareMaxAmmo();
                    if (maxAmmo != null) {
                        focusUnit.setFlareCurrentAmmo(Math.min(
                            maxAmmo,
                            Helpers.getExisted(focusUnit.getFlareCurrentAmmo()) + Helpers.getExisted(targetUnit.getFlareCurrentAmmo()),
                        ));
                    }
                }
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitJoinUnit(war: BwWar, action: IWarActionUnitJoinUnit): Promise<void> {
        // const desc = await war.getDescForExeUnitJoinUnit(action);
        // (desc) && (FloatText.show(desc));

        const unitMap           = war.getUnitMap();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            const commonExtraData   = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitJoinUnit_00);
            const movingUnitAndPath = commonExtraData.movingUnitAndPath;
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            const movingPath    = movingUnitAndPath?.path;
            const lastNode      = movingPath ? movingPath[movingPath?.length - 1] : null;
            if ((lastNode?.isVisible) && (!lastNode.isBlocked)) {
                const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(lastNode.gridIndex), ClientErrorCode.WarActionExecutor_NormalExeUnitJoinUnit_01);
                if (unitMap.getUnitOnMap(gridIndex)) {
                    unitMap.removeUnitOnMap(gridIndex, true);
                }
            }

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute       : false,
            });

        } else {
            const path              = action.path as MovePath;
            const launchUnitId      = action.launchUnitId;
            const pathNodes         = path.nodes;
            const endingGridIndex   = pathNodes[pathNodes.length - 1];
            const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

            if (path.isBlocked) {
                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : path.isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();

            } else {
                const targetUnit    = Helpers.getExisted(unitMap.getUnitOnMap(endingGridIndex));
                const player        = war.getPlayer(focusUnit.getPlayerIndex());
                unitMap.removeUnitOnMap(endingGridIndex, false);
                WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                focusUnit.setHasLoadedCo(focusUnit.getHasLoadedCo() || targetUnit.getHasLoadedCo());

                if (focusUnit.checkHasPrimaryWeapon()) {
                    focusUnit.setPrimaryWeaponCurrentAmmo(Math.min(
                        Helpers.getExisted(focusUnit.getPrimaryWeaponMaxAmmo()),
                        Helpers.getExisted(focusUnit.getPrimaryWeaponCurrentAmmo()) + Helpers.getExisted(targetUnit.getPrimaryWeaponCurrentAmmo())
                    ));
                }

                const joinIncome = focusUnit.getJoinIncome(targetUnit);
                if (joinIncome !== 0) {
                    player.setFund(player.getFund() + joinIncome);
                }

                if (war.getGameConfig().getSystemCfg().isUnitHpRoundedUpWhenHealed) {
                    focusUnit.setCurrentHp(Math.min(
                        focusUnit.getMaxHp(),
                        (focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()) * CommonConstants.UnitHpNormalizer,
                    ));
                } else {
                    const joinedNormalizedHp = Math.min(
                        focusUnit.getNormalizedMaxHp(),
                        focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()
                    );
                    focusUnit.setCurrentHp(Math.max(
                        (joinedNormalizedHp - 1) * CommonConstants.UnitHpNormalizer + 1,
                        Math.min(focusUnit.getCurrentHp() + targetUnit.getCurrentHp(), focusUnit.getMaxHp())
                    ));
                }

                focusUnit.setCurrentFuel(Math.min(
                    focusUnit.getMaxFuel(),
                    focusUnit.getCurrentFuel() + targetUnit.getCurrentFuel()
                ));

                const maxBuildMaterial = focusUnit.getMaxBuildMaterial();
                if (maxBuildMaterial != null) {
                    focusUnit.setCurrentBuildMaterial(Math.min(
                        maxBuildMaterial,
                        Helpers.getExisted(focusUnit.getCurrentBuildMaterial()) + Helpers.getExisted(targetUnit.getCurrentBuildMaterial())
                    ));
                }

                const maxProduceMaterial = focusUnit.getMaxProduceMaterial();
                if (maxProduceMaterial != null) {
                    focusUnit.setCurrentProduceMaterial(Math.min(
                        maxProduceMaterial,
                        Helpers.getExisted(focusUnit.getCurrentProduceMaterial()) + Helpers.getExisted(targetUnit.getCurrentProduceMaterial())
                    ));
                }

                focusUnit.setCurrentPromotion(Math.max(focusUnit.getCurrentPromotion(), targetUnit.getCurrentPromotion()));

                focusUnit.setIsCapturingTile(targetUnit.getIsCapturingTile());

                focusUnit.setIsBuildingTile(targetUnit.getIsBuildingTile());

                // flare ammo
                {
                    const maxAmmo = focusUnit.getFlareMaxAmmo();
                    if (maxAmmo != null) {
                        focusUnit.setFlareCurrentAmmo(Math.min(
                            maxAmmo,
                            Helpers.getExisted(focusUnit.getFlareCurrentAmmo()) + Helpers.getExisted(targetUnit.getFlareCurrentAmmo())
                        ));
                    }
                }

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : path.isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();
                unitMap.getView().removeUnit(targetUnit.getView());
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitLaunchFlare(war: BwWar, action: IWarActionUnitLaunchFlare, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitLaunchFlare(war, action)
            : await normalExeUnitLaunchFlare(war, action);
    }
    async function fastExeUnitLaunchFlare(war: BwWar, action: IWarActionUnitLaunchFlare): Promise<void> {
        const fogMap            = war.getFogMap();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitLaunchFlare_01),
                isFastExecute   : true,
            });
        } else {
            const path          = action.path as MovePath;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const launchUnitId  = action.launchUnitId;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            const isFlareSucceeded  = !path.isBlocked;
            const flareRadius       = Helpers.getExisted(focusUnit.getFlareRadius());
            const targetGridIndex   = GridIndexHelpers.convertGridIndex(action.targetGridIndex);
            if (isFlareSucceeded) {
                if (targetGridIndex == null) {
                    throw Helpers.newError(`Empty targetGridIndex.`, ClientErrorCode.WarActionExecutor_FastExeUnitLaunchFlare_02);
                }

                focusUnit.setFlareCurrentAmmo(Helpers.getExisted(focusUnit.getFlareCurrentAmmo()) - 1);
                fogMap.updateMapFromPathsByFlare(focusUnit.getPlayerIndex(), targetGridIndex, flareRadius);
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitLaunchFlare(war: BwWar, action: IWarActionUnitLaunchFlare): Promise<void> {
        // const desc = await war.getDescForExeUnitLaunchFlare(action);
        // (desc) && (FloatText.show(desc));

        const gridVisualEffect  = war.getGridVisualEffect();
        const mapSize           = war.getTileMap().getMapSize();
        const fogMap            = war.getFogMap();
        const playerIndexInTurn = war.getPlayerIndexInTurn();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitLaunchFlare_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            const targetGridIndex   = GridIndexHelpers.convertGridIndex(actionExtraData.targetGridIndex);
            if (targetGridIndex) {
                const flareRadius = Helpers.getExisted(actionExtraData.flareRadius, ClientErrorCode.WarActionExecutor_NormalExeUnitLaunchFlare_01);
                for (const grid of GridIndexHelpers.getGridsWithinDistance({ origin: targetGridIndex, minDistance: 0, maxDistance: flareRadius, mapSize })) {
                    gridVisualEffect.showEffectFlare(grid);
                }
            }

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute       : false,
            });

        } else {
            const path          = action.path as MovePath;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const launchUnitId  = action.launchUnitId;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            const isFlareSucceeded  = !path.isBlocked;
            const flareRadius       = Helpers.getExisted(focusUnit.getFlareRadius());
            const targetGridIndex   = GridIndexHelpers.convertGridIndex(action.targetGridIndex);
            if (isFlareSucceeded) {
                if (targetGridIndex == null) {
                    throw Helpers.newError(`Empty targetGridIndex.`, ClientErrorCode.WarActionExecutor_NormalExeUnitLaunchFlare_02);
                }

                focusUnit.setFlareCurrentAmmo(Helpers.getExisted(focusUnit.getFlareCurrentAmmo()) - 1);
                fogMap.updateMapFromPathsByFlare(playerIndexInTurn, targetGridIndex, flareRadius);
            }

            await focusUnit.moveViewAlongPath({
                pathNodes,
                isDiving    : focusUnit.getIsDiving(),
                isBlocked   : path.isBlocked,
                aiming      : null,
            });
            if ((isFlareSucceeded) && (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()))) {
                if (targetGridIndex == null) {
                    throw Helpers.newError(`Empty targetGridIndex.`, ClientErrorCode.WarActionExecutor_NormalExeUnitLaunchFlare_03);
                }

                for (const grid of GridIndexHelpers.getGridsWithinDistance({ origin: targetGridIndex, minDistance: 0, maxDistance: flareRadius, mapSize })) {
                    gridVisualEffect.showEffectFlare(grid);
                }
            }

            focusUnit.updateView();
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitLaunchSilo(war: BwWar, action: IWarActionUnitLaunchSilo, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitLaunchSilo(war, action)
            : await normalExeUnitLaunchSilo(war, action);
    }
    async function fastExeUnitLaunchSilo(war: BwWar, action: IWarActionUnitLaunchSilo): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitLaunchFlare_00),
                isFastExecute   : true,
            });
        } else {
            const path          = action.path as MovePath;
            const pathNodes     = path.nodes;
            const launchUnitId  = action.launchUnitId;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            if (path.isBlocked) {
                // nothing to do.
            } else {
                const targetGridIndex   = action.targetGridIndex as GridIndex;
                const tile              = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
                const launchSiloParams  = Helpers.getExisted(tile.getGameConfig().getTileObjectCfg(tile.getObjectType())?.launchSiloParams);
                tile.resetByTypeAndPlayerIndex({
                    baseType        : tile.getBaseType(),
                    objectType      : Helpers.getExisted(launchSiloParams[1]),
                    playerIndex     : CommonConstants.PlayerIndex.Neutral,
                });

                const targetGrids   = GridIndexHelpers.getGridsWithinDistance({ origin: targetGridIndex, minDistance: 0, maxDistance: launchSiloParams[2], mapSize: unitMap.getMapSize() });
                const targetUnits   : BwUnit[] = [];
                for (const grid of targetGrids) {
                    const unit = unitMap.getUnitOnMap(grid);
                    if (unit) {
                        targetUnits.push(unit);
                        unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - launchSiloParams[3]));
                    }
                }
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitLaunchSilo(war: BwWar, action: IWarActionUnitLaunchSilo): Promise<void> {
        // const desc = await war.getDescForExeUnitLaunchSilo(action);
        // (desc) && (FloatText.show(desc));

        const gridVisualEffect  = war.getGridVisualEffect();
        const unitMap           = war.getUnitMap();
        const mapSize           = unitMap.getMapSize();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitLaunchSilo_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            const launchSiloParams  = Helpers.getExisted(war.getGameConfig().getAllTileObjectCfgArray().find(v => v.launchSiloParams != null)?.launchSiloParams);
            const targetGridIndex   = GridIndexHelpers.convertGridIndex(actionExtraData.targetGridIndex);
            if (targetGridIndex) {
                for (const grid of GridIndexHelpers.getGridsWithinDistance({ origin: targetGridIndex, minDistance: 0, maxDistance: launchSiloParams[2], mapSize })) {
                    gridVisualEffect.showEffectSiloExplosion(grid);
                }
            }

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute   : false,
            });

        } else {
            const path          = action.path as MovePath;
            const pathNodes     = path.nodes;
            const launchUnitId  = action.launchUnitId;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            if (path.isBlocked) {
                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : path.isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();

            } else {
                const tile              = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
                const launchSiloParams  = Helpers.getExisted(tile.getGameConfig().getTileObjectCfg(tile.getObjectType())?.launchSiloParams);
                tile.resetByTypeAndPlayerIndex({
                    baseType    : tile.getBaseType(),
                    objectType  : Helpers.getExisted(launchSiloParams[1]),
                    playerIndex : CommonConstants.PlayerIndex.Neutral,
                });

                const targetGridIndex   = GridIndexHelpers.convertGridIndex(action.targetGridIndex);
                const targetGrids       = GridIndexHelpers.getGridsWithinDistance({ origin: Helpers.getExisted(targetGridIndex, ClientErrorCode.WarActionExecutor_NormalExeUnitLaunchSilo_01), minDistance: 0, maxDistance: launchSiloParams[2], mapSize });
                const targetUnits       : BwUnit[] = [];
                for (const grid of targetGrids) {
                    const unit = unitMap.getUnitOnMap(grid);
                    if (unit) {
                        targetUnits.push(unit);
                        unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - launchSiloParams[3]));
                    }
                }

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : path.isBlocked,
                    aiming      : null,
                });
                for (const grid of targetGrids) {
                    gridVisualEffect.showEffectSiloExplosion(grid);
                }
                for (const unit of targetUnits) {
                    unit.updateView();
                }

                focusUnit.updateView();
                tile.flushDataToView();
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitLoadCo(war: BwWar, action: IWarActionUnitLoadCo, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitLoadCo(war, action)
            : await normalExeUnitLoadCo(war, action);
    }
    async function fastExeUnitLoadCo(war: BwWar, action: IWarActionUnitLoadCo): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.BwWarActionExecutor_FastExeUnitLoadCo_00),
                isFastExecute   : true,
            });
        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], action.launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            if (path.isBlocked) {
                focusUnit.setActionState(UnitActionState.Acted);
            } else {
                const playerIndex           = focusUnit.getPlayerIndex();
                const energyAddPctOnLoadCo  = war.getCommonSettingManager().getSettingsEnergyAddPctOnLoadCo(playerIndex);
                focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());
                focusUnit.setHasLoadedCo(true);

                const player        = war.getPlayer(playerIndex);
                const coMaxEnergy   = player.getCoMaxEnergy();
                player.setFund(player.getFund() - focusUnit.getLoadCoCost());
                player.setCoCurrentEnergy(Math.min(
                    coMaxEnergy,
                    player.getCoCurrentEnergy() + Math.floor(coMaxEnergy * energyAddPctOnLoadCo / 100))
                );
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitLoadCo(war: BwWar, action: IWarActionUnitLoadCo): Promise<void> {
        // const desc = await war.getDescForExeUnitLoadCo(action);
        // (desc) && (FloatText.show(desc));

        const actionExtraData = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.BwWarActionExecutor_NormalExeUnitLoadCo_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute   : false,
            });

        } else {
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], action.launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);

            if (path.isBlocked) {
                focusUnit.setActionState(UnitActionState.Acted);
            } else {
                const playerIndex           = focusUnit.getPlayerIndex();
                const energyAddPctOnLoadCo  = war.getCommonSettingManager().getSettingsEnergyAddPctOnLoadCo(playerIndex);
                focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());
                focusUnit.setHasLoadedCo(true);

                const player        = war.getPlayer(playerIndex);
                const coMaxEnergy   = player.getCoMaxEnergy();
                player.setFund(player.getFund() - focusUnit.getLoadCoCost());
                player.setCoCurrentEnergy(Math.min(
                    coMaxEnergy,
                    player.getCoCurrentEnergy() + Math.floor(coMaxEnergy * energyAddPctOnLoadCo / 100))
                );
            }

            await focusUnit.moveViewAlongPath({
                pathNodes,
                isDiving    : focusUnit.getIsDiving(),
                isBlocked   : path.isBlocked,
                aiming      : null,
            });
            focusUnit.updateView();
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitProduceUnit(war: BwWar, action: IWarActionUnitProduceUnit, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitProduceUnit(war, action)
            : await normalExeUnitProduceUnit(war, action);
    }
    async function fastExeUnitProduceUnit(war: BwWar, action: IWarActionUnitProduceUnit): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitProduceUnit_00),
                isFastExecute   : true,
            });
        } else {
            const path          = action.path as MovePath;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const launchUnitId  = action.launchUnitId;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            if (path.isBlocked) {
                // nothing to do.
            } else {
                const gridIndex         = focusUnit.getGridIndex();
                const producedUnitId    = unitMap.getNextUnitId();
                const producedUnit      = new BwUnit();
                const unitType          = Helpers.getExisted(focusUnit.getProduceUnitType(), ClientErrorCode.WarActionExecutor_FastExeUnitProduceUnit_01);
                producedUnit.init({
                    gridIndex,
                    playerIndex     : focusUnit.getPlayerIndex(),
                    unitType,
                    unitId          : producedUnitId,
                    loaderUnitId    : focusUnit.getUnitId(),
                    currentPromotion: getPromotionForUnitProduceUnit(war, focusUnit, unitType),
                }, war.getGameConfig());
                producedUnit.startRunning(war);
                producedUnit.setActionState(UnitActionState.Acted);

                const player = war.getPlayerInTurn();
                player.setFund(player.getFund() - focusUnit.getProduceUnitCost());
                unitMap.setNextUnitId(producedUnitId + 1);
                unitMap.setUnitLoaded(producedUnit);
                focusUnit.setCurrentProduceMaterial(Helpers.getExisted(focusUnit.getCurrentProduceMaterial()) - 1);
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitProduceUnit(war: BwWar, action: IWarActionUnitProduceUnit): Promise<void> {
        // const desc = await war.getDescForExeUnitProduceUnit(action);
        // (desc) && (FloatText.show(desc));

        const actionExtraData = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitProduceUnit_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute   : false,
            });

        } else {
            const path          = action.path as MovePath;
            const pathNodes     = path.nodes;
            const unitMap       = war.getUnitMap();
            const launchUnitId  = action.launchUnitId;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            if (path.isBlocked) {
                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : path.isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();

            } else {
                const gridIndex         = focusUnit.getGridIndex();
                const producedUnitId    = unitMap.getNextUnitId();
                const producedUnit      = new BwUnit();
                const unitType          = Helpers.getExisted(focusUnit.getProduceUnitType(), ClientErrorCode.WarActionExecutor_NormalExeUnitProduceUnit_01);
                producedUnit.init({
                    gridIndex,
                    playerIndex     : focusUnit.getPlayerIndex(),
                    unitType,
                    unitId          : producedUnitId,
                    loaderUnitId    : focusUnit.getUnitId(),
                    currentPromotion: getPromotionForUnitProduceUnit(war, focusUnit, unitType),
                }, war.getGameConfig());
                producedUnit.startRunning(war);
                producedUnit.setActionState(UnitActionState.Acted);

                const player = war.getPlayerInTurn();
                player.setFund(player.getFund() - focusUnit.getProduceUnitCost());
                unitMap.setNextUnitId(producedUnitId + 1);
                unitMap.setUnitLoaded(producedUnit);
                focusUnit.setCurrentProduceMaterial(Helpers.getExisted(focusUnit.getCurrentProduceMaterial()) - 1);

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : path.isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    function getPromotionForUnitProduceUnit(war: BwWar, producerUnit: BwUnit, targetUnitType: number): number {
        const player                    = producerUnit.getPlayer();
        const coZoneRadius              = player.getCoZoneRadius();
        const gridIndex                 = producerUnit.getGridIndex();
        const gameConfig                = war.getGameConfig();
        const hasLoadedCo               = producerUnit.getHasLoadedCo();
        const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
        let promotion                   = 0;
        for (const skillId of war.getPlayerInTurn().getCoCurrentSkills()) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.selfPromotionBonusByProduce;
            if ((cfg)                                                                   &&
                (gameConfig.checkIsUnitTypeInCategory(targetUnitType, cfg[1]))          &&
                ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                    gridIndex,
                    coSkillAreaType         : cfg[0],
                    getCoGridIndexArrayOnMap,
                    coZoneRadius,
                })))
            ) {
                promotion += cfg[2];
            }
        }

        return promotion;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitSupplyUnit(war: BwWar, action: IWarActionUnitSupplyUnit, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitSupplyUnit(war, action)
            : await normalExeUnitSupplyUnit(war, action);
    }
    async function fastExeUnitSupplyUnit(war: BwWar, action: IWarActionUnitSupplyUnit): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitSupplyUnit_00),
                isFastExecute   : true,
            });
        } else {
            const revisedPath   = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = revisedPath.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            const isBlocked = revisedPath.isBlocked;
            if (isBlocked) {
                // nothing to do.
            } else {
                const suppliedUnits : BwUnit[] = [];
                const playerIndex   = focusUnit.getPlayerIndex();
                for (const gridIndex of GridIndexHelpers.getAdjacentGrids(pathNodes[pathNodes.length - 1], unitMap.getMapSize())) {
                    const unit = unitMap.getUnitOnMap(gridIndex);
                    if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                        const maxFlareAmmo          = unit.getFlareMaxAmmo();
                        const maxPrimaryWeaponAmmo  = unit.getPrimaryWeaponMaxAmmo();
                        unit.updateByRepairData({
                            deltaFuel               : unit.getMaxFuel() - unit.getCurrentFuel(),
                            deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - Helpers.getExisted(unit.getFlareCurrentAmmo()) : null,
                            deltaPrimaryWeaponAmmo  : maxPrimaryWeaponAmmo ? maxPrimaryWeaponAmmo - Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo()) : null,
                        });
                        suppliedUnits.push(unit);
                    }
                }
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitSupplyUnit(war: BwWar, action: IWarActionUnitSupplyUnit): Promise<void> {
        // const desc = await war.getDescForExeUnitSupplyUnit(action);
        // (desc) && (FloatText.show(desc));

        const actionExtraData = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitSupplyUnit_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute   : false,
            });

        } else {
            const revisedPath   = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = revisedPath.nodes;
            const unitMap       = war.getUnitMap();
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            const isBlocked = revisedPath.isBlocked;
            if (isBlocked) {
                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked,
                    aiming      : null,
                 });
                focusUnit.updateView();

            } else {
                const suppliedUnits : BwUnit[] = [];
                const playerIndex   = focusUnit.getPlayerIndex();
                for (const gridIndex of GridIndexHelpers.getAdjacentGrids(pathNodes[pathNodes.length - 1], unitMap.getMapSize())) {
                    const unit = unitMap.getUnitOnMap(gridIndex);
                    if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                        const maxFlareAmmo          = unit.getFlareMaxAmmo();
                        const maxPrimaryWeaponAmmo  = unit.getPrimaryWeaponMaxAmmo();
                        unit.updateByRepairData({
                            deltaFuel               : unit.getMaxFuel() - unit.getCurrentFuel(),
                            deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - Helpers.getExisted(unit.getFlareCurrentAmmo()) : null,
                            deltaPrimaryWeaponAmmo  : maxPrimaryWeaponAmmo ? maxPrimaryWeaponAmmo - Helpers.getExisted(unit.getPrimaryWeaponCurrentAmmo()) : null,
                        });
                        suppliedUnits.push(unit);
                    }
                }

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();

                const gridVisionEffect = war.getGridVisualEffect();
                for (const unit of suppliedUnits) {
                    unit.updateView();
                    gridVisionEffect.showEffectSupply(unit.getGridIndex());
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitSurface(war: BwWar, action: IWarActionUnitSurface, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitSurface(war, action)
            : await normalExeUnitSurface(war, action);
    }
    async function fastExeUnitSurface(war: BwWar, action: IWarActionUnitSurface): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitSurface_00),
                isFastExecute   : true,
            });
        } else {
            const unitMap       = war.getUnitMap();
            const revisedPath   = action.path as MovePath;
            const pathNodes     = revisedPath.nodes;
            const launchUnitId  = action.launchUnitId;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            const isSuccessful  = !revisedPath.isBlocked;
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);
            (isSuccessful) && (focusUnit.setIsDiving(false));
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitSurface(war: BwWar, action: IWarActionUnitSurface): Promise<void> {
        // const desc = await war.getDescForExeUnitSurface(action);
        // (desc) && (FloatText.show(desc));

        const gridVisualEffect  = war.getGridVisualEffect();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            const commonExtraData   = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitSurface_00);
            const movingUnitAndPath = commonExtraData.movingUnitAndPath;
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            const movingPath    = movingUnitAndPath?.path;
            const lastNode      = movingPath ? movingPath[movingPath?.length - 1] : null;
            if ((lastNode?.isVisible) && (!lastNode.isBlocked)) {
                gridVisualEffect.showEffectSurface(Helpers.getExisted(GridIndexHelpers.convertGridIndex(lastNode.gridIndex), ClientErrorCode.WarActionExecutor_NormalExeUnitSurface_01));
            }

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute                       : false,
            });

        } else {
            const unitMap       = war.getUnitMap();
            const revisedPath   = action.path as MovePath;
            const pathNodes     = revisedPath.nodes;
            const launchUnitId  = action.launchUnitId;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            const isSuccessful  = !revisedPath.isBlocked;
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);
            (isSuccessful) && (focusUnit.setIsDiving(false));

            await focusUnit.moveViewAlongPath({
                pathNodes,
                isDiving    : true,
                isBlocked   : revisedPath.isBlocked,
                aiming      : null,
            });
            focusUnit.updateView();
            if (isSuccessful) {
                const endingGridIndex = pathNodes[pathNodes.length - 1];
                if (WarHelpers.WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                    war,
                    unitType            : focusUnit.getUnitType(),
                    unitPlayerIndex     : focusUnit.getPlayerIndex(),
                    gridIndex           : endingGridIndex,
                    observerTeamIndexes : war.getPlayerManager().getWatcherTeamIndexesForSelf(),
                    isDiving            : false,
                })) {
                    gridVisualEffect.showEffectSurface(endingGridIndex);
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitUseCoSkill(war: BwWar, action: IWarActionUnitUseCoSkill, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitUseCoSkill(war, action)
            : await normalExeUnitUseCoSkill(war, action);
    }
    async function fastExeUnitUseCoSkill(war: BwWar, action: IWarActionUnitUseCoSkill): Promise<void> {
        const playerInTurn      = war.getPlayerInTurn();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            const skillType: Types.Undefinable<Types.CoSkillType> = actionExtraData.skillType;
            if (skillType != null) {
                const skillIdArray      = playerInTurn.getCoSkills(skillType);
                const skillDataArray    = Helpers.getExisted(actionExtraData.skillDataArray, ClientErrorCode.WarActionExecutor_FastExeUnitUseCoSkill_00);
                for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                    WarHelpers.WarCoSkillHelpers.exeInstantSkill({
                        war,
                        player          : playerInTurn,
                        skillId         : skillIdArray[skillIndex],
                        skillData       : Helpers.getExisted(skillDataArray.find(v => v.skillIndex === skillIndex), ClientErrorCode.WarActionExecutor_FastExeUnitUseCoSkill_01),
                        hasExtraData    : true,
                        isFastExecute   : true,
                    });
                }
            }

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitUseCoSkill_02),
                isFastExecute   : true,
            });

        } else {
            const unitMap           = war.getUnitMap();
            const revisedPath       = action.path as MovePath;
            const pathNodes         = revisedPath.nodes;
            const launchUnitId      = action.launchUnitId;
            const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), ClientErrorCode.WarActionExecutor_FastExeUnitUseCoSkill_03);
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            if (!revisedPath.isBlocked) {
                playerInTurn.updateOnUseCoSkill(Helpers.getExisted(action.skillType, ClientErrorCode.WarActionExecutor_FastExeUnitUseCoSkill_04));

                const skillIdArray = playerInTurn.getCoCurrentSkills();
                for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                    const dataForUseCoSkill = WarHelpers.WarCoSkillHelpers.getDataForUseCoSkill(war, playerInTurn, skillIndex);
                    WarHelpers.WarCoSkillHelpers.exeInstantSkill({
                        war,
                        player          : playerInTurn,
                        skillId         : skillIdArray[skillIndex],
                        skillData       : dataForUseCoSkill,
                        hasExtraData    : false,
                        isFastExecute   : true,
                    });
                }

                if (playerInTurn.getUserId() == null) {
                    const playerIndex = playerInTurn.getPlayerIndex();
                    for (const unit of war.getUnitMap().getAllUnits()) {
                        if (unit.getPlayerIndex() === playerIndex) {
                            unit.checkAndUpdateAiMode();
                        }
                    }
                }
            }
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitUseCoSkill(war: BwWar, action: IWarActionUnitUseCoSkill): Promise<void> {
        const unitMap           = war.getUnitMap();
        const gridVisualEffect  = war.getGridVisualEffect();
        const playerInTurn      = war.getPlayerInTurn();
        const playerIndex       = playerInTurn.getPlayerIndex();
        const actionExtraData   = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitUseCoSkill_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            const skillType: Types.Undefinable<Types.CoSkillType> = actionExtraData.skillType;
            if (skillType != null) {
                const skillIdArray      = playerInTurn.getCoSkills(skillType);
                const skillDataArray    = Helpers.getExisted(actionExtraData.skillDataArray, ClientErrorCode.WarActionExecutor_NormalExeUnitUseCoSkill_01);
                for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                    WarHelpers.WarCoSkillHelpers.exeInstantSkill({
                        war,
                        player          : playerInTurn,
                        skillId         : skillIdArray[skillIndex],
                        skillData       : Helpers.getExisted(skillDataArray.find(v => v.skillIndex === skillIndex), ClientErrorCode.WarActionExecutor_NormalExeUnitUseCoSkill_02),
                        hasExtraData    : true,
                        isFastExecute   : false,
                    });
                }
            }

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute   : false,
            });

            if (skillType != null) {
                for (const unit of unitMap.getAllUnitsOnMap()) {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.updateView();
                        gridVisualEffect.showEffectSkillActivation(unit.getGridIndex());
                    }
                }
            }

        } else {
            const revisedPath       = action.path as MovePath;
            const pathNodes         = revisedPath.nodes;
            const launchUnitId      = action.launchUnitId;
            const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), ClientErrorCode.WarActionExecutor_NormalExeUnitUseCoSkill_03);
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            await focusUnit.moveViewAlongPath({
                pathNodes,
                isDiving    : focusUnit.getIsDiving(),
                isBlocked   : revisedPath.isBlocked,
                aiming      : null,
            });
            focusUnit.updateView();

            if (!revisedPath.isBlocked) {
                playerInTurn.updateOnUseCoSkill(Helpers.getExisted(action.skillType, ClientErrorCode.WarActionExecutor_NormalExeUnitUseCoSkill_04));

                const skillIdArray = playerInTurn.getCoCurrentSkills();
                for (let skillIndex = 0; skillIndex < skillIdArray.length; ++skillIndex) {
                    WarHelpers.WarCoSkillHelpers.exeInstantSkill({
                        war,
                        player          : playerInTurn,
                        skillId         : skillIdArray[skillIndex],
                        skillData       : WarHelpers.WarCoSkillHelpers.getDataForUseCoSkill(war, playerInTurn, skillIndex),
                        hasExtraData    : false,
                        isFastExecute   : false,
                    });
                }

                if (playerInTurn.getUserId() == null) {
                    for (const unit of war.getUnitMap().getAllUnits()) {
                        if (unit.getPlayerIndex() === playerIndex) {
                            unit.checkAndUpdateAiMode();
                        }
                    }
                }

                for (const unit of unitMap.getAllUnitsOnMap()) {
                    if (unit.getPlayerIndex() === playerIndex) {
                        unit.updateView();
                        gridVisualEffect.showEffectSkillActivation(unit.getGridIndex());
                    }
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitWait(war: BwWar, action: IWarActionUnitWait, isFast: boolean): Promise<void> {
        war.getPlayerInTurn().setHasTakenManualAction(true);
        isFast
            ? await fastExeUnitWait(war, action)
            : await normalExeUnitWait(war, action);
    }
    async function fastExeUnitWait(war: BwWar, action: IWarActionUnitWait): Promise<void> {
        const actionExtraData = action.extraData;
        if (actionExtraData) {
            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData : Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_FastExeUnitWait_00),
                isFastExecute   : true,
            });
        } else {
            const unitMap       = war.getUnitMap();
            const path          = action.path as MovePath;
            const launchUnitId  = action.launchUnitId;
            const pathNodes     = path.nodes;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption, });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);
        }
        war.updateTilesAndUnitsOnVisibilityChanged(true);
    }
    async function normalExeUnitWait(war: BwWar, action: IWarActionUnitWait): Promise<void> {
        // const desc = await war.getDescForExeUnitWait(action);
        // (desc) && (FloatText.show(desc));

        const actionExtraData = action.extraData;
        if (actionExtraData) {
            const commonExtraData = Helpers.getExisted(actionExtraData.commonExtraData, ClientErrorCode.WarActionExecutor_NormalExeUnitWait_00);
            await WarHelpers.WarCommonHelpers.moveExtraUnit({
                war,
                movingUnitAndPath       : commonExtraData.movingUnitAndPath,
                aiming                  : null,
                deleteViewAfterMoving   : true,
            });

            WarHelpers.WarCommonHelpers.handleCommonExtraDataForWarActions({
                war,
                commonExtraData,
                isFastExecute   : false,
            });

        } else {
            const unitMap       = war.getUnitMap();
            const revisedPath   = action.path as MovePath;
            const pathNodes     = revisedPath.nodes;
            const launchUnitId  = action.launchUnitId;
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), ClientErrorCode.WarActionExecutor_NormalExeUnitWait_01);
            WarHelpers.WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            await focusUnit.moveViewAlongPath({
                pathNodes,
                isDiving    : focusUnit.getIsDiving(),
                isBlocked   : revisedPath.isBlocked,
                aiming      : null,
            });
            focusUnit.updateView();
        }

        war.updateTilesAndUnitsOnVisibilityChanged(false);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnknownAction(): Promise<void> {
        throw Helpers.newError(`Unknown action.`, ClientErrorCode.BwWarActionExecutor_ExeUnknownAction_00);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function handlePrimaryWeaponAmmoForUnitAttackTile(attackerUnit: BwUnit, targetTile: BwTile): void {
        const targetArmorType = Helpers.getExisted(targetTile.getArmorType(), ClientErrorCode.BwWarActionExecutor_HandlePrimaryWeaponForUnitAttackTile_00);
        const attackerAmmo = attackerUnit.getPrimaryWeaponCurrentAmmo();
        if ((attackerAmmo != null)                                                              &&
            (attackerAmmo > 0)                                                                  &&
            (attackerUnit.getCfgBaseDamage(targetArmorType, Types.WeaponType.Primary) != null)
        ) {
            attackerUnit.setPrimaryWeaponCurrentAmmo(attackerAmmo - 1);
        }
    }
    function handleHpForTile(tile: BwTile, newHp: number): void {
        tile.setCurrentHp(newHp);
    }
    function handleDestructionForTile(war: BwWar, tile: BwTile): ResultForHandleDestructionForTile {
        const hp        = Helpers.getExisted(tile.getCurrentHp(), ClientErrorCode.BwWarActionExecutor_HandleDestructionForTile_00);
        const gridIndex = tile.getGridIndex();
        if (hp > 0) {
            return {
                damagedTileSet  : new Set([tile]),
                destroyedTileSet: new Set(),
            };
        }

        const destroyedTileSet          = new Set([tile]);
        const destroyConnectedTileType  = tile.getTemplateCfg().destroyConnectedTypeWhenDestroyed;
        if (destroyConnectedTileType != null) {
            const tileMap = war.getTileMap();
            for (const g of WarCommonHelpers.getConnectedGridIndexArrayWithTileType(tileMap, gridIndex, destroyConnectedTileType)) {
                const plasmaTile = tileMap.getTile(g);
                plasmaTile.resetOnTileObjectDestroyed();
                destroyedTileSet.add(plasmaTile);
            }
        }

        tile.resetOnTileObjectDestroyed();

        return {
            damagedTileSet  : new Set(),
            destroyedTileSet,
        };
    }
    function handlePrimaryWeaponAmmoForUnitAttackUnit(attackerUnit: BwUnit, targetUnit: BwUnit): void {
        const targetArmorType   = targetUnit.getArmorType();
        const attackerAmmo      = attackerUnit.getPrimaryWeaponCurrentAmmo();
        if ((attackerAmmo != null)                                                              &&
            (attackerAmmo > 0)                                                                  &&
            (attackerUnit.getCfgBaseDamage(targetArmorType, Types.WeaponType.Primary) != null)
        ) {
            attackerUnit.setPrimaryWeaponCurrentAmmo(attackerAmmo - 1);
        }
    }
    function handleHpForUnit(unit: BwUnit, unitNewHp: number): void {
        unit.setCurrentHp(unitNewHp);
    }
    function handlePromotionForUnitAttackUnit({ attackerPlayer, attackerUnit, targetLostNormalizedHp, attackerCoGridIndexListOnMap, isTargetDestroyed}: {
        attackerPlayer              : BwPlayer,
        attackerUnit                : BwUnit,
        targetLostNormalizedHp      : number,
        attackerCoGridIndexListOnMap: GridIndex[],
        isTargetDestroyed           : boolean,
    }): void {
        const gameConfig        = attackerUnit.getGameConfig();
        const attackerUnitType  = attackerUnit.getUnitType();
        const attackerGridIndex = attackerUnit.getGridIndex();
        if (isTargetDestroyed) {
            attackerUnit.addPromotion();
        }

        if (attackerPlayer.getCoId()) {
            const attackerCoZoneRadius  = attackerPlayer.getCoZoneRadius();
            const hasAttackerLoadedCo   = attackerUnit.getHasLoadedCo();
            for (const skillId of attackerPlayer.getCoCurrentSkills() || []) {
                const cfg = gameConfig.getCoSkillCfg(skillId)?.promotionBonusByAttack;
                if ((cfg)                                                                           &&
                    (targetLostNormalizedHp >= cfg[2])                                              &&
                    (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg[1]))                &&
                    ((hasAttackerLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex               : attackerGridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap: () => attackerCoGridIndexListOnMap,
                        coZoneRadius            : attackerCoZoneRadius,
                    })))
                ) {
                    attackerUnit.addPromotion();
                }
            }
        }
    }
    function handleFundForUnitAttackUnit({ attackerPlayer, attackerUnit, targetUnit, targetLostNormalizedHp, isAttackerInAttackerCoZone } :{
        attackerPlayer              : BwPlayer;
        attackerUnit                : BwUnit;
        targetUnit                  : BwUnit;
        targetLostNormalizedHp      : number;
        isAttackerInAttackerCoZone  : boolean;
    }): void {
        if ((targetLostNormalizedHp == 0) || (attackerPlayer.getCoId() === CommonConstants.CoId.Empty)) {
            return;
        }

        const currentFund       = attackerPlayer.getFund();
        const gameConfig        = attackerUnit.getGameConfig();
        const attackerUnitType  = attackerUnit.getUnitType();
        const targetUnitType    = targetUnit.getUnitType();
        const targetUnitCost    = targetUnit.getProductionFinalCost();
        let addFund             = 0;
        for (const skillId of attackerPlayer.getCoCurrentSkills() || []) {
            const cfg = gameConfig.getCoSkillCfg(skillId)?.selfGetFundByAttackUnit;
            if ((cfg)                                                                       &&
                ((isAttackerInAttackerCoZone) || (cfg[0] === Types.CoSkillAreaType.Halo))   &&
                (gameConfig.checkIsUnitTypeInCategory(attackerUnitType, cfg[1]))            &&
                (gameConfig.checkIsUnitTypeInCategory(targetUnitType, cfg[2]))
            ) {
                addFund += targetUnitCost / 10 * targetLostNormalizedHp * cfg[3] / 100;
            }
        }

        attackerPlayer.setFund(Math.floor(currentFund + addFund));
    }
    function handleEnergyForUnitAttackUnit({ war, attackerPlayer, targetPlayer, targetLostNormalizedHp, targetCfgProductionCost, isAttackerInAttackerCoZone, isTargetInTargetCoZone }: {
        war                         : BwWar;
        attackerPlayer              : BwPlayer;
        targetPlayer                : BwPlayer;
        targetLostNormalizedHp      : number;
        targetCfgProductionCost     : number;
        isAttackerInAttackerCoZone  : boolean;
        isTargetInTargetCoZone      : boolean;
    }): void {
        if (targetLostNormalizedHp <= 0) {
            return;
        }

        const commonSettingManager  = war.getCommonSettingManager();
        const gameConfig            = war.getGameConfig();
        if (attackerPlayer.checkCanGetEnergyWithBattle()) {
            const coEnergyType1 = attackerPlayer.getCoEnergyType();
            if (coEnergyType1 === Types.CoEnergyType.Trilogy) {
                const multiplier1       = commonSettingManager.getSettingsEnergyGrowthMultiplier(attackerPlayer.getPlayerIndex());
                const energyParameters1 = Helpers.getExisted(attackerPlayer.getGlobalCoEnergyParameters());
                attackerPlayer.setCoCurrentEnergy(Math.min(
                    attackerPlayer.getCoMaxEnergy(),
                    attackerPlayer.getCoCurrentEnergy() + Math.floor(targetLostNormalizedHp * targetCfgProductionCost * multiplier1 * energyParameters1[2] / 100 / 10 / 100),
                ));

            } else if (coEnergyType1 === Types.CoEnergyType.Dor) {
                const coType1 = attackerPlayer.getCoType();
                if (((coType1 === Types.CoType.Zoned) && (isAttackerInAttackerCoZone)) ||
                    (coType1 === Types.CoType.Global)
                ) {
                    const playerIndex1  = attackerPlayer.getPlayerIndex();
                    const multiplier1   = commonSettingManager.getSettingsEnergyGrowthMultiplier(playerIndex1);
                    const energy1       = attackerPlayer.getCoCurrentEnergy();
                    attackerPlayer.setCoCurrentEnergy(Math.min(
                        attackerPlayer.getCoMaxEnergy(),
                        energy1 + Math.floor(targetLostNormalizedHp * multiplier1 * gameConfig.getSystemEnergyGrowthMultiplierForAttacker() / 100),
                    ));
                }

            } else {
                throw Helpers.newError(`Invalid coEnergyType1: ${coEnergyType1}`, ClientErrorCode.BwWarActionExecutor_HandleEnergyForUnitAttackUnit_00);
            }
        }

        if (targetPlayer.checkCanGetEnergyWithBattle()) {
            const coEnergyType2 = targetPlayer.getCoEnergyType();
            if (coEnergyType2 === Types.CoEnergyType.Trilogy) {
                const multiplier2       = commonSettingManager.getSettingsEnergyGrowthMultiplier(targetPlayer.getPlayerIndex());
                const energyParameters2 = Helpers.getExisted(targetPlayer.getGlobalCoEnergyParameters());
                targetPlayer.setCoCurrentEnergy(Math.min(
                    targetPlayer.getCoMaxEnergy(),
                    targetPlayer.getCoCurrentEnergy() + Math.floor(targetLostNormalizedHp * targetCfgProductionCost * multiplier2 * energyParameters2[3] / 100 / 10 / 100),
                ));

            } else if (coEnergyType2 === Types.CoEnergyType.Dor) {
                const coType2 = targetPlayer.getCoType();
                if (((coType2 === Types.CoType.Zoned) && (isTargetInTargetCoZone)) ||
                    (coType2 === Types.CoType.Global)
                ) {
                    const playerIndex2  = targetPlayer.getPlayerIndex();
                    const multiplier2   = commonSettingManager.getSettingsEnergyGrowthMultiplier(playerIndex2);
                    const energy2       = targetPlayer.getCoCurrentEnergy();
                    targetPlayer.setCoCurrentEnergy(Math.min(
                        targetPlayer.getCoMaxEnergy(),
                        energy2 + Math.floor(targetLostNormalizedHp * multiplier2 * gameConfig.getSystemEnergyGrowthMultiplierForDefender() / 100),
                    ));
                }

            } else {
                throw Helpers.newError(`Invalid coEnergyType2: ${coEnergyType2}`, ClientErrorCode.BwWarActionExecutor_HandleEnergyForUnitAttackUnit_01);
            }
        }
    }
    function handleDestructionForUnit({ war, unit }: {
        war             : BwWar,
        unit            : BwUnit,
    }): void {
        const targetGridIndex = unit.getGridIndex();
        if (unit.getCurrentHp() <= 0) {
            WarHelpers.WarDestructionHelpers.destroyUnitOnMap(war, targetGridIndex, false);
        }
    }
}

// export default WarActionExecutor;
