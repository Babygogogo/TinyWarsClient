
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
// import TwnsNotifyType               from "../notify/NotifyType";
// import ProtoTypes                   from "../proto/ProtoTypes";
// import WarCommonHelpers             from "./WarCommonHelpers";
// import WarCoSkillHelpers            from "./WarCoSkillHelpers";
// import WarDamageCalculator          from "./WarDamageCalculator";
// import WarDestructionHelpers        from "./WarDestructionHelpers";
// import WarVisibilityHelpers         from "./WarVisibilityHelpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WarActionExecutor {
    import GridIndex                            = Types.GridIndex;
    import UnitActionState                      = Types.UnitActionState;
    import MovePath                             = Types.MovePath;
    import TileType                             = Types.TileType;
    import WarAction                            = ProtoTypes.WarAction;
    import IDataForUseCoSkill                   = ProtoTypes.Structure.IDataForUseCoSkill;
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
    import ClientErrorCode                      = TwnsClientErrorCode.ClientErrorCode;
    import BwPlayer                             = TwnsBwPlayer.BwPlayer;
    import BwUnit                               = TwnsBwUnit.BwUnit;
    import BwTile                               = TwnsBwTile.BwTile;
    import BwWar                                = TwnsBwWar.BwWar;
    import NotifyType                           = TwnsNotifyType.NotifyType;

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
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerDeleteUnit(war: BwWar, action: IWarActionPlayerDeleteUnit, isFast: boolean): Promise<void> {
        isFast
            ? await fastExePlayerDeleteUnit(war, action)
            : await normalExePlayerDeleteUnit(war, action);
    }
    async function fastExePlayerDeleteUnit(war: BwWar, action: IWarActionPlayerDeleteUnit): Promise<void> {
        const gridIndex = action.gridIndex as GridIndex;
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
            WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
        }
    }
    async function normalExePlayerDeleteUnit(war: BwWar, action: IWarActionPlayerDeleteUnit): Promise<void> {
        const desc = await war.getDescForExePlayerDeleteUnit(action);
        (desc) && (FloatText.show(desc));

        const gridIndex = action.gridIndex as GridIndex;
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
            WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerEndTurn(war: BwWar, action: IWarActionPlayerEndTurn, isFast: boolean): Promise<void> {
        isFast
            ? await fastExePlayerEndTurn(war, action)
            : await normalExePlayerEndTurn(war, action);
    }
    async function fastExePlayerEndTurn(war: BwWar, action: IWarActionPlayerEndTurn): Promise<void> {
        war.getTurnManager().endPhaseMain(action);
    }
    async function normalExePlayerEndTurn(war: BwWar, action: IWarActionPlayerEndTurn): Promise<void> {
        // const desc = await war.getDescForExePlayerEndTurn(action);
        // (desc) && (FloatText.show(desc));

        war.getTurnManager().endPhaseMain(action);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerProduceUnit(war: BwWar, action: IWarActionPlayerProduceUnit, isFast: boolean): Promise<void> {
        isFast
            ? await fastExePlayerProduceUnit(war, action)
            : await normalExePlayerProduceUnit(war, action);
    }
    async function fastExePlayerProduceUnit(war: BwWar, action: IWarActionPlayerProduceUnit): Promise<void> {
        const unitType      = action.unitType as Types.UnitType;
        const gridIndex     = action.gridIndex as GridIndex;
        const unitHp        = Helpers.getExisted(action.unitHp, ClientErrorCode.WarActionExecutor_FastExePlayerProduceUnit_00);
        const configVersion = war.getConfigVersion();
        const unitMap       = war.getUnitMap();
        const unitId        = unitMap.getNextUnitId();
        const playerInTurn  = war.getPlayerInTurn();
        const playerIndex   = playerInTurn.getPlayerIndex();
        const skillCfg      = war.getTileMap().getTile(gridIndex).getEffectiveSelfUnitProductionSkillCfg(playerIndex);
        const cfgCost       = ConfigManager.getUnitTemplateCfg(configVersion, unitType).productionCost;
        const costModifier  = playerInTurn.getUnitCostModifier(gridIndex, false, unitType);
        const cost          = Math.floor(
            cfgCost
            * (skillCfg ? skillCfg[5] : 100)
            * WarCommonHelpers.getNormalizedHp(unitHp)
            * costModifier
            / 100
            / CommonConstants.UnitHpNormalizer
        );
        const unit          = new BwUnit();
        unit.init({
            gridIndex,
            playerIndex,
            unitType,
            unitId,
            actionState : ((skillCfg) && (skillCfg[6] === 1)) ? UnitActionState.Idle : UnitActionState.Acted,
            currentHp   : unitHp != null ? unitHp : CommonConstants.UnitMaxHp,
        }, configVersion);
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setUnitOnMap(unit);
        unitMap.setNextUnitId(unitId + 1);
        playerInTurn.setFund(playerInTurn.getFund() - cost);
    }
    async function normalExePlayerProduceUnit(war: BwWar, action: IWarActionPlayerProduceUnit): Promise<void> {
        const desc = await war.getDescForExePlayerProduceUnit(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);

            const unitMap       = war.getUnitMap();
            const unitId        = unitMap.getNextUnitId();
            const playerInTurn  = war.getPlayerInTurn();
            const unitData      = Helpers.getExisted(extraData.unitData, ClientErrorCode.BwWarActionExecutor_NormalExePlayerProduceUnit_00);
            const unit          = new BwUnit();
            unit.init(unitData, war.getConfigVersion());
            unit.startRunning(war);
            unit.startRunningView();
            unitMap.setUnitOnMap(unit);
            unitMap.setNextUnitId(unitId + 1);
            playerInTurn.setFund(playerInTurn.getFund() - Helpers.getExisted(extraData.cost));

        } else {
            const gridIndex     = action.gridIndex as GridIndex;
            const unitType      = Helpers.getExisted(action.unitType);
            const unitHp        = Helpers.getExisted(action.unitHp);
            const configVersion = war.getConfigVersion();
            const unitMap       = war.getUnitMap();
            const unitId        = unitMap.getNextUnitId();
            const playerInTurn  = war.getPlayerInTurn();
            const playerIndex   = playerInTurn.getPlayerIndex();
            const skillCfg      = war.getTileMap().getTile(gridIndex).getEffectiveSelfUnitProductionSkillCfg(playerIndex);
            const cfgCost       = ConfigManager.getUnitTemplateCfg(configVersion, unitType).productionCost;
            const cost          = Math.floor(
                cfgCost
                * (skillCfg ? skillCfg[5] : 100)
                * WarCommonHelpers.getNormalizedHp(unitHp)
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
                actionState : ((skillCfg) && (skillCfg[6] === 1)) ? UnitActionState.Idle : UnitActionState.Acted,
                currentHp   : unitHp,
            }, configVersion);
            unit.startRunning(war);
            unit.startRunningView();
            unitMap.setUnitOnMap(unit);
            unitMap.setNextUnitId(unitId + 1);
            playerInTurn.setFund(playerInTurn.getFund() - cost);
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerSurrender(war: BwWar, action: IWarActionPlayerSurrender, isFast: boolean): Promise<void> {
        isFast
            ? await fastExePlayerSurrender(war)
            : await normalExePlayerSurrender(war, action);
    }
    async function fastExePlayerSurrender(war: BwWar): Promise<void> {
        war.getPlayerInTurn().setAliveState(Types.PlayerAliveState.Dying);
    }
    async function normalExePlayerSurrender(war: BwWar, action: IWarActionPlayerSurrender): Promise<void> {
        const desc = await war.getDescForExePlayerSurrender(action);
        (desc) && (FloatText.show(desc));

        war.getPlayerInTurn().setAliveState(Types.PlayerAliveState.Dying);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerVoteForDraw(war: BwWar, action: IWarActionPlayerVoteForDraw, isFast: boolean): Promise<void> {
        isFast
            ? await fastExePlayerVoteForDraw(war, action)
            : await normalExePlayerVoteForDraw(war, action);
    }
    async function fastExePlayerVoteForDraw(war: BwWar, action: IWarActionPlayerVoteForDraw): Promise<void> {
        const playerInTurn = war.getPlayerInTurn();
        playerInTurn.setHasVotedForDraw(true);

        const drawVoteManager = war.getDrawVoteManager();
        if (!action.isAgree) {
            drawVoteManager.setRemainingVotes(null);
        } else {
            drawVoteManager.setRemainingVotes((drawVoteManager.getRemainingVotes() || drawVoteManager.getMaxVotes()) - 1);
        }
    }
    async function normalExePlayerVoteForDraw(war: BwWar, action: IWarActionPlayerVoteForDraw): Promise<void> {
        const desc = await war.getDescForExePlayerVoteForDraw(action);
        (desc) && (FloatText.show(desc));

        const playerInTurn = war.getPlayerInTurn();
        playerInTurn.setHasVotedForDraw(true);

        const drawVoteManager = war.getDrawVoteManager();
        if (!action.isAgree) {
            drawVoteManager.setRemainingVotes(null);
        } else {
            drawVoteManager.setRemainingVotes((drawVoteManager.getRemainingVotes() || drawVoteManager.getMaxVotes()) - 1);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerUseCoSkill(war: BwWar, action: IWarActionPlayerUseCoSkill, isFast: boolean): Promise<void> {
        isFast
            ? await fastExePlayerUseCoSkill(war, action)
            : await normalExePlayerUseCoSkill(war, action);
    }
    async function fastExePlayerUseCoSkill(war: BwWar, action: IWarActionPlayerUseCoSkill): Promise<void> {
        const skillType         = Helpers.getExisted(action.skillType, ClientErrorCode.BwWarActionExecutor_FastExePlayerUseCoSkill_00);
        const playerInTurn      = war.getPlayerInTurn();
        const currentEnergy     = playerInTurn.getCoCurrentEnergy();
        playerInTurn.setCoUsingSkillType(skillType);

        if (skillType === Types.CoSkillType.Power) {
            const powerEnergy = Helpers.getExisted(playerInTurn.getCoPowerEnergy(), ClientErrorCode.BwWarActionExecutor_FastExePlayerUseCoSkill_01);
            playerInTurn.setCoCurrentEnergy(currentEnergy - powerEnergy);

        } else if (skillType === Types.CoSkillType.SuperPower) {
            const superPowerEnergy = Helpers.getExisted(playerInTurn.getCoSuperPowerEnergy(), ClientErrorCode.BwWarActionExecutor_FastExePlayerUseCoSkill_02);
            playerInTurn.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

        } else {
            throw Helpers.newError(`Invalid skillType: ${skillType}`, ClientErrorCode.BwWarActionExecutor_FastExePlayerUseCoSkill_03);
        }

        const skillDataList : IDataForUseCoSkill[] = [];
        const skillIdList   = playerInTurn.getCoCurrentSkills() || [];
        for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
            const dataForUseCoSkill = Helpers.getExisted(WarCoSkillHelpers.getDataForUseCoSkill(war, playerInTurn, skillIndex), ClientErrorCode.BwWarActionExecutor_FastExePlayerUseCoSkill_04);
            WarCoSkillHelpers.exeInstantSkill({
                war,
                player      : playerInTurn,
                skillId     : skillIdList[skillIndex],
                extraData   : dataForUseCoSkill,
            });
            skillDataList.push(dataForUseCoSkill);
        }
    }
    async function normalExePlayerUseCoSkill(war: BwWar, action: IWarActionPlayerUseCoSkill): Promise<void> {
        const unitMap   = war.getUnitMap();
        const skillType = Helpers.getExisted(action.skillType, ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_00);
        const extraData = action.extraData;
        if (extraData) {
            // WarCommonHelpers.updateTilesAndUnits(war, extraData);

            const player        = war.getPlayerInTurn();
            const currentEnergy = player.getCoCurrentEnergy();
            player.setCoUsingSkillType(skillType);

            if (skillType === Types.CoSkillType.Power) {
                const powerEnergy = Helpers.getExisted(player.getCoPowerEnergy(), ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_01);
                player.setCoCurrentEnergy(currentEnergy - powerEnergy);

            } else if (skillType === Types.CoSkillType.SuperPower) {
                const superPowerEnergy = Helpers.getExisted(player.getCoSuperPowerEnergy(), ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_02);
                player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

            } else {
                throw Helpers.newError(`Invalid skillType: ${skillType}`, ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_03);
            }

            const skillDataArray    = Helpers.getExisted(extraData.skillDataArray);
            const skillIdList       = player.getCoCurrentSkills() || [];
            for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                const dataForUseCoSkill = Helpers.getExisted(skillDataArray.find(v => v.skillIndex === skillIndex), ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_04);
                WarCoSkillHelpers.exeInstantSkill({
                    war,
                    player,
                    skillId     : skillIdList[skillIndex],
                    extraData   : dataForUseCoSkill,
                });
            }

            const gridVisionEffect  = war.getGridVisionEffect();
            const playerIndex       = player.getPlayerIndex();
            for (const unit of unitMap.getAllUnitsOnMap()) {
                unit.updateView();
                if (unit.getPlayerIndex() === playerIndex) {
                    gridVisionEffect.showEffectSkillActivation(unit.getGridIndex());
                }
            }

            const configVersion = war.getConfigVersion();
            const mapSize       = unitMap.getMapSize();
            for (let i = 0; i < skillIdList.length; ++i) {
                const skillCfg          = ConfigManager.getCoSkillCfg(configVersion, skillIdList[i]);
                const indiscriminateCfg = skillCfg ? skillCfg.indiscriminateAreaDamage : null;
                if (indiscriminateCfg) {
                    for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(
                        skillDataArray.find(v => v.skillIndex === i)?.indiscriminateAreaDamageCenter as GridIndex,
                        0,
                        indiscriminateCfg[1],
                        mapSize)
                    ) {
                        const unit = unitMap.getUnitOnMap(gridIndex);
                        (unit) && (unit.updateView());

                        gridVisionEffect.showEffectExplosion(gridIndex);
                    }
                }
            }

        } else {
            const player            = war.getPlayerInTurn();
            const currentEnergy     = player.getCoCurrentEnergy();
            player.setCoUsingSkillType(skillType);

            if (skillType === Types.CoSkillType.Power) {
                const powerEnergy = Helpers.getExisted(player.getCoPowerEnergy(), ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_05);
                player.setCoCurrentEnergy(currentEnergy - powerEnergy);

            } else if (skillType === Types.CoSkillType.SuperPower) {
                const superPowerEnergy = Helpers.getExisted(player.getCoSuperPowerEnergy(), ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_06);
                player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

            } else {
                throw Helpers.newError(`Invalid skillType: ${skillType}`, ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_07);
            }

            const skillDataList : IDataForUseCoSkill[] = [];
            const skillIdList   = player.getCoCurrentSkills() || [];
            for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                const dataForUseCoSkill = Helpers.getExisted(WarCoSkillHelpers.getDataForUseCoSkill(war, player, skillIndex), ClientErrorCode.BwWarActionExecutor_NormalExePlayerUseCoSkill_08);
                WarCoSkillHelpers.exeInstantSkill({
                    war,
                    player,
                    skillId     : skillIdList[skillIndex],
                    extraData   : dataForUseCoSkill,
                });
                skillDataList.push(dataForUseCoSkill);
            }

            const gridVisionEffect  = war.getGridVisionEffect();
            const playerIndex       = player.getPlayerIndex();
            for (const unit of unitMap.getAllUnitsOnMap()) {
                unit.updateView();
                if (unit.getPlayerIndex() === playerIndex) {
                    gridVisionEffect.showEffectSkillActivation(unit.getGridIndex());
                }
            }

            const configVersion = war.getConfigVersion();
            const mapSize       = unitMap.getMapSize();
            for (let i = 0; i < skillIdList.length; ++i) {
                const skillCfg          = ConfigManager.getCoSkillCfg(configVersion, skillIdList[i]);
                const indiscriminateCfg = skillCfg ? skillCfg.indiscriminateAreaDamage : null;
                if (indiscriminateCfg) {
                    for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(skillDataList[i].indiscriminateAreaDamageCenter as GridIndex, 0, indiscriminateCfg[1], mapSize)) {
                        const unit = unitMap.getUnitOnMap(gridIndex);
                        (unit) && (unit.updateView());

                        gridVisionEffect.showEffectExplosion(gridIndex);
                    }
                }
            }
        }

        WarCommonHelpers.updateTilesAndUnits(war, {
            discoveredTiles: extraData?.discoveredTilesAfterAction,
            discoveredUnits: extraData?.discoveredUnitsAfterAction,
        });
        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemBeginTurn(war: BwWar, action: IWarActionSystemBeginTurn, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeSystemBeginTurn(war, action)
            : await normalExeSystemBeginTurn(war, action);
    }
    async function fastExeSystemBeginTurn(war: BwWar, action: IWarActionSystemBeginTurn): Promise<void> {
        war.getTurnManager().endPhaseWaitBeginTurn(action);
    }
    async function normalExeSystemBeginTurn(war: BwWar, action: IWarActionSystemBeginTurn): Promise<void> {
        // const desc = await war.getDescForExeSystemBeginTurn(action);
        // (desc) && (FloatText.show(desc));

        // return war.getTurnManager().endPhaseWaitBeginTurn(action);

        const playerInTurn  = war.getPlayerInTurn();
        const playerIndex   = playerInTurn.getPlayerIndex();
        if ((playerIndex !== CommonConstants.WarNeutralPlayerIndex)         &&
            (playerInTurn.getAliveState() !== Types.PlayerAliveState.Dead)
        ) {
            const nickname = await playerInTurn.getNickname();
            await new Promise<void>(resolve => {
                TwnsBwBeginTurnPanel.BwBeginTurnPanel.show({
                    playerIndex,
                    teamIndex           : playerInTurn.getTeamIndex(),
                    nickname,
                    callbackOnFinish    : () => resolve(),
                });
            });
        }

        war.getTurnManager().endPhaseWaitBeginTurn(action);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemCallWarEvent(war: BwWar, action: IWarActionSystemCallWarEvent, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeSystemCallWarEvent(war, action)
            : await normalExeSystemCallWarEvent(war, action);
    }
    async function fastExeSystemCallWarEvent(war: BwWar, action: IWarActionSystemCallWarEvent): Promise<void> {
        const warEventManager   = war.getWarEventManager();
        const warEventId        = Helpers.getExisted(action.warEventId);
        warEventManager.updateWarEventCalledCountOnCall(warEventId);
        await warEventManager.callWarEvent(warEventId, true);
    }
    async function normalExeSystemCallWarEvent(war: BwWar, action: IWarActionSystemCallWarEvent): Promise<void> {
        const desc = await war.getDescForExeSystemCallWarEvent(action);
        (desc) && (FloatText.show(desc));

        const warEventManager   = war.getWarEventManager();
        const warEventId        = Helpers.getExisted(action.warEventId);
        warEventManager.updateWarEventCalledCountOnCall(warEventId);

        const extraDataList = action.extraDataList;
        if (extraDataList == null) {
            await warEventManager.callWarEvent(warEventId, false);
        } else {
            const unitMap       = war.getUnitMap();
            const configVersion = war.getConfigVersion();
            const actionIdArray = Helpers.getExisted(warEventManager.getWarEvent(warEventId).actionIdArray);
            for (let index = 0; index < actionIdArray.length; ++index) {
                const warEventAction = warEventManager.getWarEventAction(actionIdArray[index]);
                if (warEventAction.WeaAddUnit) {
                    for (const unitData of extraDataList.find(v => v.indexForActionIdList === index)?.ExtraDataForWeaAddUnit?.unitList || []) {
                        const unit = new BwUnit();
                        unit.init(unitData, configVersion);
                        unit.startRunning(war);
                        unit.startRunningView();
                        unitMap.setUnitOnMap(unit);
                        unitMap.setNextUnitId(Math.max(Helpers.getExisted(unitData.unitId) + 1, unitMap.getNextUnitId()));
                    }

                } else if (warEventAction.WeaSetPlayerAliveState) {
                    const actionData    = warEventAction.WeaSetPlayerAliveState;
                    const player        = war.getPlayer(Helpers.getExisted(actionData.playerIndex));
                    if (player != null) {
                        player.setAliveState(Helpers.getExisted(actionData.playerAliveState));
                    }

                } else {
                    // TODO add executors for other actions.
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemDestroyPlayerForce(war: BwWar, action: IWarActionSystemDestroyPlayerForce, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeSystemDestroyPlayerForce(war, action)
            : await normalExeSystemDestroyPlayerForce(war, action);
    }
    async function fastExeSystemDestroyPlayerForce(war: BwWar, action: IWarActionSystemDestroyPlayerForce): Promise<void> {
        WarDestructionHelpers.destroyPlayerForce(war, Helpers.getExisted(action.targetPlayerIndex), false);
    }
    async function normalExeSystemDestroyPlayerForce(war: BwWar, action: IWarActionSystemDestroyPlayerForce): Promise<void> {
        const desc = await war.getDescForExeSystemDestroyPlayerForce(action);
        (desc) && (FloatText.show(desc));

        WarDestructionHelpers.destroyPlayerForce(war, Helpers.getExisted(action.targetPlayerIndex), true);

        war.updateTilesAndUnitsOnVisibilityChanged();
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
        war.getTurnManager().endPhaseMain(action);
    }
    async function normalExeSystemEndTurn(war: BwWar, action: IWarActionSystemEndTurn): Promise<void> {
        // const desc = await war.getDescForExeSystemEndTurn(action);
        // (desc) && (FloatText.show(desc));

        war.getTurnManager().endPhaseMain(action);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemHandleBootPlayer(war: BwWar, action: IWarActionSystemHandleBootPlayer, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeSystemHandleBootPlayer(war)
            : await normalExeSystemHandleBootPlayer(war, action);
    }
    async function fastExeSystemHandleBootPlayer(war: BwWar): Promise<void> {
        war.getPlayerInTurn().setAliveState(Types.PlayerAliveState.Dying);
    }
    async function normalExeSystemHandleBootPlayer(war: BwWar, action: IWarActionSystemHandleBootPlayer): Promise<void> {
        const desc = await war.getDescForExeSystemHandleBootPlayer(action);
        (desc) && (FloatText.show(desc));

        war.getPlayerInTurn().setAliveState(Types.PlayerAliveState.Dying);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemVoteForDraw(war: BwWar, action: IWarActionSystemVoteForDraw, isFast: boolean): Promise<void> {
        const drawVoteManager = war.getDrawVoteManager();
        drawVoteManager.setRemainingVotes(action.isAgree
            ? Helpers.getExisted(drawVoteManager.getRemainingVotes(), ClientErrorCode.WarActionExecutor_ExeSystemVoteForDraw_00) - 1
            : null
        );
        war.getPlayerInTurn().setHasVotedForDraw(true);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitAttackTile(war: BwWar, action: IWarActionUnitAttackTile, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitAttackTile(war, action)
            : await normalExeUnitAttackTile(war, action);
    }
    async function fastExeUnitAttackTile(war: BwWar, action: IWarActionUnitAttackTile): Promise<void> {
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);

            const focusUnit = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            if (path.isBlocked) {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

            } else {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                const tileMap           = war.getTileMap();
                const damagedTileSet    = new Set<BwTile>();
                const destroyedTileSet  = new Set<BwTile>();
                const damagedUnitSet    = new Set<BwUnit>();
                for (const battleDamageInfo of extraData.battleDamageInfoArray || []) {
                    const targetUnitId = battleDamageInfo.targetUnitId;
                    if (targetUnitId != null) {
                        damagedUnitSet.add(Helpers.getExisted(unitMap.getUnitById(targetUnitId)));
                        continue;
                    }

                    const targetTileGridIndex   = Helpers.getExisted(GridIndexHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex), ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackTile_00);
                    const tile                  = tileMap.getTile(targetTileGridIndex);
                    tile.setCurrentHp(Math.max(0, Helpers.getExisted(tile.getCurrentHp()) - Helpers.getExisted(battleDamageInfo.damage)));

                    const result = handleDestructionForTile(war, tile);
                    for (const t of Helpers.getExisted(result.damagedTileSet)) {
                        damagedTileSet.add(t);
                    }
                    for (const t of Helpers.getExisted(result.destroyedTileSet)) {
                        destroyedTileSet.add(t);
                    }
                }

                const configVersion = war.getConfigVersion();
                for (const affectedUnitData of extraData.affectedUnitsAfterAction || []) {
                    const unit = Helpers.getExisted(unitMap.getUnitById(Helpers.getExisted(affectedUnitData.unitId)));
                    unit.init(affectedUnitData, configVersion);
                    unit.startRunning(war);
                    if (unit.getCurrentHp() <= 0) {
                        WarDestructionHelpers.destroyUnitOnMap(war, unit.getGridIndex(), false);
                    }
                }

                for (const affectedPlayerData of extraData.affectedPlayersAfterAction || []) {
                    war.getPlayer(Helpers.getExisted(affectedPlayerData.playerIndex)).init(affectedPlayerData, configVersion);
                }
            }

        } else {
            const focusUnit = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            if (path.isBlocked) {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

            } else {
                const targetGridIndex       = action.targetGridIndex as GridIndex;
                const battleDamageInfoArray = WarDamageCalculator.getFinalBattleDamage({
                    war,
                    attackerMovePath: pathNodes,
                    launchUnitId,
                    targetGridIndex,
                });
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
                        const unitLostNormalizedHp2 = WarCommonHelpers.getNormalizedHp(unitOldHp2) - WarCommonHelpers.getNormalizedHp(unitNewHp2);
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
                    const affectedPlayerIndex = affectedPlayer.getPlayerIndex();
                    if ((!unitMap.checkHasUnit(affectedPlayerIndex))                    &&
                        (affectedPlayer.getAliveState() !== Types.PlayerAliveState.Dead)
                    ) {
                        affectedPlayer.setAliveState(Types.PlayerAliveState.Dying);
                    }
                }
            }
        }
    }
    async function normalExeUnitAttackTile(war: BwWar, action: IWarActionUnitAttackTile): Promise<void> {
        const desc = await war.getDescForExeUnitAttackTile(action);
        (desc) && (FloatText.show(desc));

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);

            const focusUnit = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            if (path.isBlocked) {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                const allVisibleUnits = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : false,
                    aiming      : action.targetGridIndex as GridIndex,
                });

                const tileMap           = war.getTileMap();
                const damagedTileSet    = new Set<BwTile>();
                const destroyedTileSet  = new Set<BwTile>();
                const damagedUnitSet    = new Set<BwUnit>();
                for (const battleDamageInfo of extraData.battleDamageInfoArray || []) {
                    const targetUnitId = battleDamageInfo.targetUnitId;
                    if (targetUnitId != null) {
                        damagedUnitSet.add(Helpers.getExisted(unitMap.getUnitById(targetUnitId)));
                        continue;
                    }

                    const targetTileGridIndex   = Helpers.getExisted(GridIndexHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_00);
                    const tile                  = tileMap.getTile(targetTileGridIndex);
                    tile.setCurrentHp(Math.max(0, Helpers.getExisted(tile.getCurrentHp()) - Helpers.getExisted(battleDamageInfo.damage)));

                    const result = handleDestructionForTile(war, tile);
                    for (const t of Helpers.getExisted(result.damagedTileSet)) {
                        damagedTileSet.add(t);
                    }
                    for (const t of Helpers.getExisted(result.destroyedTileSet)) {
                        destroyedTileSet.add(t);
                    }
                }

                const configVersion     = war.getConfigVersion();
                const affectedUnitSet   = new Set<BwUnit>();
                for (const affectedUnitData of extraData.affectedUnitsAfterAction || []) {
                    const unit = Helpers.getExisted(unitMap.getUnitById(Helpers.getExisted(affectedUnitData.unitId)));
                    unit.init(affectedUnitData, configVersion);
                    unit.startRunning(war);
                    if (unit.getCurrentHp() <= 0) {
                        WarDestructionHelpers.destroyUnitOnMap(war, unit.getGridIndex(), false);
                    }

                    affectedUnitSet.add(unit);
                }

                for (const affectedPlayerData of extraData.affectedPlayersAfterAction || []) {
                    war.getPlayer(Helpers.getExisted(affectedPlayerData.playerIndex)).init(affectedPlayerData, configVersion);
                }

                const gridVisionEffect      = war.getGridVisionEffect();
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
                }
            }

        } else {
            const focusUnit = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            if (path.isBlocked) {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
                const targetGridIndex       = action.targetGridIndex as GridIndex;
                const battleDamageInfoArray = WarDamageCalculator.getFinalBattleDamage({
                    war,
                    attackerMovePath: pathNodes,
                    launchUnitId,
                    targetGridIndex,
                });

                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                const allVisibleUnits = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
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
                    const unitId1   = Helpers.getExisted(battleDamageInfo.attackerUnitId, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_01);
                    const unit1     = Helpers.getExisted(unitMap.getUnitById(unitId1), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_02);
                    const player1   = unit1.getPlayer();
                    const damage    = Helpers.getExisted(battleDamageInfo.damage, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_03);
                    affectedPlayerSet.add(player1);
                    affectedUnitSet.add(unit1);

                    const unitId2 = battleDamageInfo.targetUnitId;
                    if (unitId2 != null) {
                        const unitGridIndex1        = unit1.getGridIndex();
                        const unit2                 = Helpers.getExisted(unitMap.getUnitById(unitId2), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_04);
                        const unitGridIndex2        = unit2.getGridIndex();
                        const playerIndex1          = unit1.getPlayerIndex();
                        const playerIndex2          = unit2.getPlayerIndex();
                        const coGridIndexArray1     = unitMap.getCoGridIndexListOnMap(playerIndex1);
                        const coGridIndexArray2     = unitMap.getCoGridIndexListOnMap(playerIndex2);
                        const unitOldHp2            = unit2.getCurrentHp();
                        const player2               = unit2.getPlayer();
                        const unitNewHp2            = Math.max(0, unitOldHp2 - damage);
                        const unitLostNormalizedHp2 = WarCommonHelpers.getNormalizedHp(unitOldHp2) - WarCommonHelpers.getNormalizedHp(unitNewHp2);
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
                        const tileOldHp2    = Helpers.getExisted(tile2.getCurrentHp(), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_05);
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

                    throw Helpers.newError(`Invalid battleDamageInfo.`, ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackTile_06);
                }

                for (const affectedPlayer of affectedPlayerSet) {
                    const affectedPlayerIndex = affectedPlayer.getPlayerIndex();
                    if ((!unitMap.checkHasUnit(affectedPlayerIndex))                    &&
                        (affectedPlayer.getAliveState() !== Types.PlayerAliveState.Dead)
                    ) {
                        affectedPlayer.setAliveState(Types.PlayerAliveState.Dying);
                    }
                }

                const gridVisionEffect      = war.getGridVisionEffect();
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
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitAttackUnit(war: BwWar, action: IWarActionUnitAttackUnit, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitAttackUnit(war, action)
            : await normalExeUnitAttackUnit(war, action);
    }
    async function fastExeUnitAttackUnit(war: BwWar, action: IWarActionUnitAttackUnit): Promise<void> {
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);

            const focusUnit = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            if (path.isBlocked) {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

            } else {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                const tileMap           = war.getTileMap();
                const damagedTileSet    = new Set<BwTile>();
                const destroyedTileSet  = new Set<BwTile>();
                const damagedUnitSet    = new Set<BwUnit>();
                for (const battleDamageInfo of extraData.battleDamageInfoArray || []) {
                    const targetUnitId = battleDamageInfo.targetUnitId;
                    if (targetUnitId != null) {
                        damagedUnitSet.add(Helpers.getExisted(unitMap.getUnitById(targetUnitId)));
                        continue;
                    }

                    const targetTileGridIndex   = Helpers.getExisted(GridIndexHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex), ClientErrorCode.BwWarActionExecutor_FastExeUnitAttackUnit_00);
                    const tile                  = tileMap.getTile(targetTileGridIndex);
                    tile.setCurrentHp(Math.max(0, Helpers.getExisted(tile.getCurrentHp()) - Helpers.getExisted(battleDamageInfo.damage)));

                    const result = handleDestructionForTile(war, tile);
                    for (const t of Helpers.getExisted(result.damagedTileSet)) {
                        damagedTileSet.add(t);
                    }
                    for (const t of Helpers.getExisted(result.destroyedTileSet)) {
                        destroyedTileSet.add(t);
                    }
                }

                const configVersion = war.getConfigVersion();
                for (const affectedUnitData of extraData.affectedUnitsAfterAction || []) {
                    const unit = Helpers.getExisted(unitMap.getUnitById(Helpers.getExisted(affectedUnitData.unitId)));
                    unit.init(affectedUnitData, configVersion);
                    unit.startRunning(war);
                    if (unit.getCurrentHp() <= 0) {
                        WarDestructionHelpers.destroyUnitOnMap(war, unit.getGridIndex(), false);
                    }
                }

                for (const affectedPlayerData of extraData.affectedPlayersAfterAction || []) {
                    war.getPlayer(Helpers.getExisted(affectedPlayerData.playerIndex)).init(affectedPlayerData, configVersion);
                }
            }

        } else {
            const focusUnit = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            if (path.isBlocked) {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

            } else {
                const targetGridIndex       = action.targetGridIndex as GridIndex;
                const battleDamageInfoArray = WarDamageCalculator.getFinalBattleDamage({
                    war,
                    attackerMovePath: pathNodes,
                    launchUnitId,
                    targetGridIndex,
                });
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
                        const unitLostNormalizedHp2 = WarCommonHelpers.getNormalizedHp(unitOldHp2) - WarCommonHelpers.getNormalizedHp(unitNewHp2);
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
                    const affectedPlayerIndex = affectedPlayer.getPlayerIndex();
                    if ((!unitMap.checkHasUnit(affectedPlayerIndex))                    &&
                        (affectedPlayer.getAliveState() !== Types.PlayerAliveState.Dead)
                    ) {
                        affectedPlayer.setAliveState(Types.PlayerAliveState.Dying);
                    }
                }
            }
        }
    }
    async function normalExeUnitAttackUnit(war: BwWar, action: IWarActionUnitAttackUnit): Promise<void> {
        const desc = await war.getDescForExeUnitAttackUnit(action);
        (desc) && (FloatText.show(desc));

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);

            const focusUnit = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            if (path.isBlocked) {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                const allVisibleUnits = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
                {
                    const targetGridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(action.targetGridIndex), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_00);
                    await focusUnit.moveViewAlongPath({
                        pathNodes,
                        isDiving    : focusUnit.getIsDiving(),
                        isBlocked   : false,
                        aiming      : allVisibleUnits.has(Helpers.getExisted(unitMap.getUnitOnMap(targetGridIndex), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_01)) ? targetGridIndex : null,
                    });
                }

                const tileMap           = war.getTileMap();
                const damagedTileSet    = new Set<BwTile>();
                const destroyedTileSet  = new Set<BwTile>();
                const damagedUnitSet    = new Set<BwUnit>();
                for (const battleDamageInfo of extraData.battleDamageInfoArray || []) {
                    const targetUnitId = battleDamageInfo.targetUnitId;
                    if (targetUnitId != null) {
                        damagedUnitSet.add(Helpers.getExisted(unitMap.getUnitById(targetUnitId)));
                        continue;
                    }

                    const targetTileGridIndex   = Helpers.getExisted(GridIndexHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex), ClientErrorCode.BwWarActionExecutor_NormalExeUnitAttackUnit_02);
                    const tile                  = tileMap.getTile(targetTileGridIndex);
                    tile.setCurrentHp(Math.max(0, Helpers.getExisted(tile.getCurrentHp()) - Helpers.getExisted(battleDamageInfo.damage)));

                    const tileDestructionsData = handleDestructionForTile(war, tile);
                    for (const t of Helpers.getExisted(tileDestructionsData.damagedTileSet)) {
                        damagedTileSet.add(t);
                    }
                    for (const t of Helpers.getExisted(tileDestructionsData.destroyedTileSet)) {
                        destroyedTileSet.add(t);
                    }
                }

                const configVersion     = war.getConfigVersion();
                const affectedUnitSet   = new Set<BwUnit>();
                for (const affectedUnitData of extraData.affectedUnitsAfterAction || []) {
                    const unit = Helpers.getExisted(unitMap.getUnitById(Helpers.getExisted(affectedUnitData.unitId)));
                    unit.init(affectedUnitData, configVersion);
                    unit.startRunning(war);
                    if (unit.getCurrentHp() <= 0) {
                        WarDestructionHelpers.destroyUnitOnMap(war, unit.getGridIndex(), false);
                    }

                    affectedUnitSet.add(unit);
                }

                for (const affectedPlayerData of extraData.affectedPlayersAfterAction || []) {
                    war.getPlayer(Helpers.getExisted(affectedPlayerData.playerIndex)).init(affectedPlayerData, configVersion);
                }

                const gridVisionEffect      = war.getGridVisionEffect();
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
                }
            }

        } else {
            const focusUnit = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            if (path.isBlocked) {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
                const targetGridIndex       = action.targetGridIndex as GridIndex;
                const battleDamageInfoArray = WarDamageCalculator.getFinalBattleDamage({
                    war,
                    attackerMovePath: pathNodes,
                    launchUnitId,
                    targetGridIndex,
                });
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                const allVisibleUnits = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
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
                        const unitLostNormalizedHp2 = WarCommonHelpers.getNormalizedHp(unitOldHp2) - WarCommonHelpers.getNormalizedHp(unitNewHp2);
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

                const gridVisionEffect      = war.getGridVisionEffect();
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
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitBeLoaded(war: BwWar, action: IWarActionUnitBeLoaded, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitBeLoaded(war, action)
            : await normalExeUnitBeLoaded(war, action);
    }
    async function fastExeUnitBeLoaded(war: BwWar, action: IWarActionUnitBeLoaded): Promise<void> {
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        focusUnit.setActionState(UnitActionState.Acted);
        if (path.isBlocked) {
            unitMap.setUnitOnMap(focusUnit);
        } else {
            const loaderUnit = Helpers.getExisted(unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]));
            unitMap.setUnitLoaded(focusUnit);
            focusUnit.setLoaderUnitId(loaderUnit.getUnitId());
        }
    }
    async function normalExeUnitBeLoaded(war: BwWar, action: IWarActionUnitBeLoaded): Promise<void> {
        const desc = await war.getDescForExeUnitBeLoaded(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        focusUnit.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            unitMap.setUnitOnMap(focusUnit);

            await focusUnit.moveViewAlongPath({
                pathNodes,
                isDiving    : focusUnit.getIsDiving(),
                isBlocked   : path.isBlocked,
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
                isBlocked   : path.isBlocked,
                aiming      : null,
            });
            focusUnit.updateView();
            focusUnit.setViewVisible(false);
            loaderUnit.updateView();
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitBuildTile(war: BwWar, action: IWarActionUnitBuildTile, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitBuildTile(war, action)
            : await normalExeUnitBuildTile(war, action);
    }
    async function fastExeUnitBuildTile(war: BwWar, action: IWarActionUnitBuildTile): Promise<void> {
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
                const targetTileCfg = Helpers.getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType()), ClientErrorCode.BwWarActionExecutor_FastExeUnitBuildTile_00);
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
    async function normalExeUnitBuildTile(war: BwWar, action: IWarActionUnitBuildTile): Promise<void> {
        const desc = await war.getDescForExeUnitBuildTile(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
                const targetTileCfg = Helpers.getExisted(focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType()), ClientErrorCode.BwWarActionExecutor_NormalExeUnitBuildTile_00);
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
        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitCaptureTile(war: BwWar, action: IWarActionUnitCaptureTile, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitCaptureTile(war, action)
            : await normalExeUnitCaptureTile(war, action);
    }
    async function fastExeUnitCaptureTile(war: BwWar, action: IWarActionUnitCaptureTile): Promise<void> {
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            // TODO: capture amount is incorrect if the co has zoned capture skill and is invisible!
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
                    objectType      : tileObjectType === Types.TileObjectType.Headquarters ? Types.TileObjectType.City : tileObjectType,
                    playerIndex     : focusUnit.getPlayerIndex(),
                });
                Notify.dispatch(NotifyType.BwTileBeCaptured);
            }
        }
    }
    async function normalExeUnitCaptureTile(war: BwWar, action: IWarActionUnitCaptureTile): Promise<void> {
        const desc = await war.getDescForExeUnitCaptureTile(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
            // TODO: capture amount is incorrect if the co has zoned capture skill and is invisible!
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
                    objectType  : tileObjectType === Types.TileObjectType.Headquarters ? Types.TileObjectType.City : tileObjectType,
                    playerIndex : focusUnit.getPlayerIndex(),
                });
            }

            await focusUnit.moveViewAlongPath({
                pathNodes,
                isDiving    : focusUnit.getIsDiving(),
                isBlocked   : false,
                aiming      : null,
            });
            if (war.getPlayerInTurn().getUserId() === UserModel.getSelfUserId()) {
                await new Promise<void>(resolve => {
                    TwnsBwCaptureProgressPanel.BwCaptureProgressPanel.show({
                        maxValue            : maxCapturePoint,
                        newValue            : maxCapturePoint - restCapturePoint,
                        currentValue        : maxCapturePoint - currentCapturePoint,
                        callbackOnFinish    : () => resolve(),
                    });
                });
            }
            focusUnit.updateView();
            tile.flushDataToView();
            Notify.dispatch(NotifyType.BwTileBeCaptured);
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitDive(war: BwWar, action: IWarActionUnitDive, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitDive(war, action)
            : await normalExeUnitDive(war, action);
    }
    async function fastExeUnitDive(war: BwWar, action: IWarActionUnitDive): Promise<void> {
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const isSuccessful  = !path.isBlocked;
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(true));
    }
    async function normalExeUnitDive(war: BwWar, action: IWarActionUnitDive): Promise<void> {
        const desc = await war.getDescForExeUnitDive(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const isSuccessful  = !path.isBlocked;
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
            if (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                war,
                unitType            : focusUnit.getUnitType(),
                unitPlayerIndex     : focusUnit.getPlayerIndex(),
                gridIndex           : endingGridIndex,
                observerTeamIndexes : war.getPlayerManager().getAliveWatcherTeamIndexesForSelf(),
                isDiving            : false,
            })) {
                war.getGridVisionEffect().showEffectDive(endingGridIndex);
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitDropUnit(war: BwWar, action: IWarActionUnitDropUnit, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitDropUnit(war, action)
            : await normalExeUnitDropUnit(war, action);
    }
    async function fastExeUnitDropUnit(war: BwWar, action: IWarActionUnitDropUnit): Promise<void> {
        const path              = action.path as MovePath;
        const launchUnitId      = action.launchUnitId;
        const pathNodes         = path.nodes;
        const unitMap           = war.getUnitMap();
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        const shouldUpdateFogMap    = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex());
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
    }
    async function normalExeUnitDropUnit(war: BwWar, action: IWarActionUnitDropUnit): Promise<void> {
        const desc = await war.getDescForExeUnitDropUnit(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const path              = action.path as MovePath;
        const launchUnitId      = action.launchUnitId;
        const pathNodes         = path.nodes;
        const unitMap           = war.getUnitMap();
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        const shouldUpdateFogMap    = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex());
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
            war.getGridVisionEffect().showEffectBlock(endingGridIndex);
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
        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitJoinUnit(war: BwWar, action: IWarActionUnitJoinUnit, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitJoinUnit(war, action)
            : await normalExeUnitJoinUnit(war, action);
    }
    async function fastExeUnitJoinUnit(war: BwWar, action: IWarActionUnitJoinUnit): Promise<void> {
        const path              = action.path as MovePath;
        const launchUnitId      = action.launchUnitId;
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const unitMap           = war.getUnitMap();
        const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        if (path.isBlocked) {
            WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

        } else {
            const targetUnit    = Helpers.getExisted(unitMap.getUnitOnMap(endingGridIndex));
            const player        = war.getPlayer(focusUnit.getPlayerIndex());
            unitMap.removeUnitOnMap(endingGridIndex, true);
            WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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

            const joinedNormalizedHp = Math.min(
                focusUnit.getNormalizedMaxHp(),
                focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()
            );
            focusUnit.setCurrentHp(Math.max(
                (joinedNormalizedHp - 1) * CommonConstants.UnitHpNormalizer + 1,
                Math.min(focusUnit.getCurrentHp() + targetUnit.getCurrentHp(), focusUnit.getMaxHp())
            ));

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
    async function normalExeUnitJoinUnit(war: BwWar, action: IWarActionUnitJoinUnit): Promise<void> {
        const desc = await war.getDescForExeUnitJoinUnit(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const path              = action.path as MovePath;
        const launchUnitId      = action.launchUnitId;
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const unitMap           = war.getUnitMap();
        const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        if (path.isBlocked) {
            WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
            WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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

            const joinedNormalizedHp = Math.min(
                focusUnit.getNormalizedMaxHp(),
                focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()
            );
            focusUnit.setCurrentHp(Math.max(
                (joinedNormalizedHp - 1) * CommonConstants.UnitHpNormalizer + 1,
                Math.min(focusUnit.getCurrentHp() + targetUnit.getCurrentHp(), focusUnit.getMaxHp())
            ));

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

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitLaunchFlare(war: BwWar, action: IWarActionUnitLaunchFlare, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitLaunchFlare(war, action)
            : await normalExeUnitLaunchFlare(war, action);
    }
    async function fastExeUnitLaunchFlare(war: BwWar, action: IWarActionUnitLaunchFlare): Promise<void> {
        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        const isFlareSucceeded  = !path.isBlocked;
        const targetGridIndex   = action.targetGridIndex as GridIndex;
        const flareRadius       = Helpers.getExisted(focusUnit.getFlareRadius());
        if (isFlareSucceeded) {
            focusUnit.setFlareCurrentAmmo(Helpers.getExisted(focusUnit.getFlareCurrentAmmo()) - 1);
            war.getFogMap().updateMapFromPathsByFlare(focusUnit.getPlayerIndex(), targetGridIndex, flareRadius);
        }
    }
    async function normalExeUnitLaunchFlare(war: BwWar, action: IWarActionUnitLaunchFlare): Promise<void> {
        const desc = await war.getDescForExeUnitLaunchFlare(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        const isFlareSucceeded  = !path.isBlocked;
        const targetGridIndex   = action.targetGridIndex as GridIndex;
        const flareRadius       = Helpers.getExisted(focusUnit.getFlareRadius());
        if (isFlareSucceeded) {
            focusUnit.setFlareCurrentAmmo(Helpers.getExisted(focusUnit.getFlareCurrentAmmo()) - 1);
            war.getFogMap().updateMapFromPathsByFlare(focusUnit.getPlayerIndex(), targetGridIndex, flareRadius);
        }

        await focusUnit.moveViewAlongPath({
            pathNodes,
            isDiving    : focusUnit.getIsDiving(),
            isBlocked   : path.isBlocked,
            aiming      : null,
        });
        if ((isFlareSucceeded) && (war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()))) {
            const effect = war.getGridVisionEffect();
            for (const grid of GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, flareRadius, war.getTileMap().getMapSize())) {
                effect.showEffectFlare(grid);
            }
        }

        focusUnit.updateView();
        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitLaunchSilo(war: BwWar, action: IWarActionUnitLaunchSilo, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitLaunchSilo(war, action)
            : await normalExeUnitLaunchSilo(war, action);
    }
    async function fastExeUnitLaunchSilo(war: BwWar, action: IWarActionUnitLaunchSilo): Promise<void> {
        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const launchUnitId  = action.launchUnitId;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tile              = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
            tile.resetByTypeAndPlayerIndex({
                baseType        : tile.getBaseType(),
                objectType      : Types.TileObjectType.EmptySilo,
                playerIndex     : CommonConstants.WarNeutralPlayerIndex,
            });

            const targetGrids   = GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, CommonConstants.SiloRadius, unitMap.getMapSize());
            const targetUnits   : BwUnit[] = [];
            for (const grid of targetGrids) {
                const unit = unitMap.getUnitOnMap(grid);
                if (unit) {
                    targetUnits.push(unit);
                    unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - CommonConstants.SiloDamage));
                }
            }
        }
    }
    async function normalExeUnitLaunchSilo(war: BwWar, action: IWarActionUnitLaunchSilo): Promise<void> {
        const desc = await war.getDescForExeUnitLaunchSilo(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const launchUnitId  = action.launchUnitId;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tile              = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
            tile.resetByTypeAndPlayerIndex({
                baseType    : tile.getBaseType(),
                objectType  : Types.TileObjectType.EmptySilo,
                playerIndex : CommonConstants.WarNeutralPlayerIndex,
            });

            const targetGrids   = GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, CommonConstants.SiloRadius, unitMap.getMapSize());
            const targetUnits   : BwUnit[] = [];
            for (const grid of targetGrids) {
                const unit = unitMap.getUnitOnMap(grid);
                if (unit) {
                    targetUnits.push(unit);
                    unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - CommonConstants.SiloDamage));
                }
            }

            await focusUnit.moveViewAlongPath({
                pathNodes,
                isDiving    : focusUnit.getIsDiving(),
                isBlocked   : path.isBlocked,
                aiming      : null,
            });
            const effect = war.getGridVisionEffect();
            for (const grid of targetGrids) {
                effect.showEffectSiloExplosion(grid);
            }
            for (const unit of targetUnits) {
                unit.updateView();
            }

            focusUnit.updateView();
            tile.flushDataToView();
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitLoadCo(war: BwWar, action: IWarActionUnitLoadCo, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitLoadCo(war, action)
            : await normalExeUnitLoadCo(war, action);
    }
    async function fastExeUnitLoadCo(war: BwWar, action: IWarActionUnitLoadCo): Promise<void> {
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], action.launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
    async function normalExeUnitLoadCo(war: BwWar, action: IWarActionUnitLoadCo): Promise<void> {
        const desc = await war.getDescForExeUnitLoadCo(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], action.launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitProduceUnit(war: BwWar, action: IWarActionUnitProduceUnit, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitProduceUnit(war, action)
            : await normalExeUnitProduceUnit(war, action);
    }
    async function fastExeUnitProduceUnit(war: BwWar, action: IWarActionUnitProduceUnit): Promise<void> {
        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const gridIndex         = focusUnit.getGridIndex();
            const producedUnitId    = unitMap.getNextUnitId();
            const producedUnit      = new BwUnit();
            producedUnit.init({
                gridIndex,
                playerIndex : focusUnit.getPlayerIndex(),
                unitType    : focusUnit.getProduceUnitType(),
                unitId      : producedUnitId,
                loaderUnitId: focusUnit.getUnitId(),
            }, war.getConfigVersion());
            producedUnit.startRunning(war);
            producedUnit.setActionState(UnitActionState.Acted);

            const player = war.getPlayerInTurn();
            player.setFund(player.getFund() - focusUnit.getProduceUnitCost());
            unitMap.setNextUnitId(producedUnitId + 1);
            unitMap.setUnitLoaded(producedUnit);
            focusUnit.setCurrentProduceMaterial(Helpers.getExisted(focusUnit.getCurrentProduceMaterial()) - 1);
        }
    }
    async function normalExeUnitProduceUnit(war: BwWar, action: IWarActionUnitProduceUnit): Promise<void> {
        const desc = await war.getDescForExeUnitProduceUnit(action);
        (desc) && (FloatText.show(desc));

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.launchUnitId;
        const extraData     = action.extraData;
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);

            WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
                producedUnit.init({
                    gridIndex,
                    playerIndex : focusUnit.getPlayerIndex(),
                    unitType    : focusUnit.getProduceUnitType(),
                    unitId      : producedUnitId,
                    loaderUnitId: focusUnit.getUnitId(),
                }, war.getConfigVersion());
                producedUnit.startRunning(war);
                producedUnit.setActionState(UnitActionState.Acted);

                const player = war.getPlayerInTurn();
                player.setFund(player.getFund() - Helpers.getExisted(extraData.cost));
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

        } else {
            WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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
                producedUnit.init({
                    gridIndex,
                    playerIndex : focusUnit.getPlayerIndex(),
                    unitType    : focusUnit.getProduceUnitType(),
                    unitId      : producedUnitId,
                    loaderUnitId: focusUnit.getUnitId(),
                }, war.getConfigVersion());
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

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitSupplyUnit(war: BwWar, action: IWarActionUnitSupplyUnit, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitSupplyUnit(war, action)
            : await normalExeUnitSupplyUnit(war, action);
    }
    async function fastExeUnitSupplyUnit(war: BwWar, action: IWarActionUnitSupplyUnit): Promise<void> {
        const revisedPath   = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
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
    async function normalExeUnitSupplyUnit(war: BwWar, action: IWarActionUnitSupplyUnit): Promise<void> {
        const desc = await war.getDescForExeUnitSupplyUnit(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const revisedPath   = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
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

            const gridVisionEffect = war.getGridVisionEffect();
            for (const unit of suppliedUnits) {
                unit.updateView();
                gridVisionEffect.showEffectSupply(unit.getGridIndex());
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitSurface(war: BwWar, action: IWarActionUnitSurface, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitSurface(war, action)
            : await normalExeUnitSurface(war, action);
    }
    async function fastExeUnitSurface(war: BwWar, action: IWarActionUnitSurface): Promise<void> {
        const unitMap       = war.getUnitMap();
        const revisedPath   = action.path as MovePath;
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const isSuccessful  = !revisedPath.isBlocked;
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(false));
    }
    async function normalExeUnitSurface(war: BwWar, action: IWarActionUnitSurface): Promise<void> {
        const desc = await war.getDescForExeUnitSurface(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const unitMap       = war.getUnitMap();
        const revisedPath   = action.path as MovePath;
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        const isSuccessful  = !revisedPath.isBlocked;
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
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
            if (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                war,
                unitType            : focusUnit.getUnitType(),
                unitPlayerIndex     : focusUnit.getPlayerIndex(),
                gridIndex           : endingGridIndex,
                observerTeamIndexes : war.getPlayerManager().getAliveWatcherTeamIndexesForSelf(),
                isDiving            : false,
            })) {
                war.getGridVisionEffect().showEffectSurface(endingGridIndex);
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitUseCoSkill(war: BwWar, action: IWarActionUnitUseCoSkill, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitUseCoSkill(war, action)
            : await normalExeUnitUseCoSkill(war, action);
    }
    async function fastExeUnitUseCoSkill(war: BwWar, action: IWarActionUnitUseCoSkill): Promise<void> {
        const skillType         = Helpers.getExisted(action.skillType, ClientErrorCode.BwWarActionExecutor_FastExeUnitUseCoSkill_00);
        const unitMap           = war.getUnitMap();
        const revisedPath       = action.path as MovePath;
        const pathNodes         = revisedPath.nodes;
        const launchUnitId      = action.launchUnitId;
        const focusUnit         = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), ClientErrorCode.BwWarActionExecutor_FastExeUnitUseCoSkill_01);
        const player            = focusUnit.getPlayer();
        const currentEnergy     = player.getCoCurrentEnergy();
        if (revisedPath.isBlocked) {
            WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

        } else {
            WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            player.setCoUsingSkillType(skillType);

            if (skillType === Types.CoSkillType.Power) {
                const powerEnergy = Helpers.getExisted(player.getCoPowerEnergy(), ClientErrorCode.BwWarActionExecutor_FastExeUnitUseCoSkill_02);
                player.setCoCurrentEnergy(currentEnergy - powerEnergy);

            } else if (skillType === Types.CoSkillType.SuperPower) {
                const superPowerEnergy = Helpers.getExisted(player.getCoSuperPowerEnergy(), ClientErrorCode.BwWarActionExecutor_FastExeUnitUseCoSkill_03);
                player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

            } else {
                throw Helpers.newError(`Invalid skillType: ${skillType}`, ClientErrorCode.BwWarActionExecutor_FastExeUnitUseCoSkill_04);
            }

            const skillDataList : IDataForUseCoSkill[] = [];
            const skillIdList   = player.getCoCurrentSkills() || [];
            for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                const dataForUseCoSkill = WarCoSkillHelpers.getDataForUseCoSkill(war, player, skillIndex);
                WarCoSkillHelpers.exeInstantSkill({
                    war,
                    player,
                    skillId     : skillIdList[skillIndex],
                    extraData   : dataForUseCoSkill,
                });
                skillDataList.push(dataForUseCoSkill);
            }
        }
    }
    async function normalExeUnitUseCoSkill(war: BwWar, action: IWarActionUnitUseCoSkill): Promise<void> {
        const unitMap       = war.getUnitMap();
        const revisedPath   = action.path as MovePath;
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.launchUnitId;
        const skillType     = Helpers.getExisted(action.skillType, ClientErrorCode.BwWarActionExecutor_NormalExeUnitUseCoSkill_00);
        const extraData     = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);

            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
            const player        = focusUnit.getPlayer();
            const currentEnergy = player.getCoCurrentEnergy();

            if (revisedPath.isBlocked) {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : revisedPath.isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();

            } else {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                player.setCoUsingSkillType(skillType);

                if (skillType === Types.CoSkillType.Power) {
                    const powerEnergy = Helpers.getExisted(player.getCoPowerEnergy(), ClientErrorCode.BwWarActionExecutor_NormalExeUnitUseCoSkill_01);
                    player.setCoCurrentEnergy(currentEnergy - powerEnergy);

                } else if (skillType === Types.CoSkillType.SuperPower) {
                    const superPowerEnergy = Helpers.getExisted(player.getCoSuperPowerEnergy(), ClientErrorCode.BwWarActionExecutor_NormalExeUnitUseCoSkill_02);
                    player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

                } else {
                    throw Helpers.newError(`Invalid skillType: ${skillType}`, ClientErrorCode.BwWarActionExecutor_NormalExeUnitUseCoSkill_03);
                }

                const skillDataList = Helpers.getExisted(extraData.skillDataList);
                const skillIdList   = player.getCoCurrentSkills() || [];
                for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                    const dataForUseCoSkill = Helpers.getExisted(skillDataList.find(v => v.skillIndex === skillIndex), ClientErrorCode.BwWarActionExecutor_NormalExeUnitUseCoSkill_04);
                    WarCoSkillHelpers.exeInstantSkill({
                        war,
                        player,
                        skillId     : skillIdList[skillIndex],
                        extraData   : dataForUseCoSkill,
                    });
                }

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : revisedPath.isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();

                const gridVisionEffect  = war.getGridVisionEffect();
                const playerIndex       = focusUnit.getPlayerIndex();
                for (const unit of unitMap.getAllUnitsOnMap()) {
                    unit.updateView();
                    if (unit.getPlayerIndex() === playerIndex) {
                        gridVisionEffect.showEffectSkillActivation(unit.getGridIndex());
                    }
                }

                const configVersion = war.getConfigVersion();
                const mapSize       = unitMap.getMapSize();
                for (let i = 0; i < skillIdList.length; ++i) {
                    const skillCfg          = ConfigManager.getCoSkillCfg(configVersion, skillIdList[i]);
                    const indiscriminateCfg = skillCfg ? skillCfg.indiscriminateAreaDamage : null;
                    if (indiscriminateCfg) {
                        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(
                            Helpers.getExisted(GridIndexHelpers.convertGridIndex(skillDataList.find(v => v.skillIndex === i)?.indiscriminateAreaDamageCenter)),
                            0,
                            indiscriminateCfg[1],
                            mapSize)
                        ) {
                            const unit = unitMap.getUnitOnMap(gridIndex);
                            (unit) && (unit.updateView());

                            gridVisionEffect.showEffectExplosion(gridIndex);
                        }
                    }
                }
            }

        } else {
            const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId), ClientErrorCode.BwWarActionExecutor_NormalExeUnitUseCoSkill_05);
            const player        = focusUnit.getPlayer();
            const currentEnergy = player.getCoCurrentEnergy();
            if (revisedPath.isBlocked) {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : revisedPath.isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();

            } else {
                WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                player.setCoUsingSkillType(skillType);

                if (skillType === Types.CoSkillType.Power) {
                    const powerEnergy = Helpers.getExisted(player.getCoPowerEnergy(), ClientErrorCode.BwWarActionExecutor_NormalExeUnitUseCoSkill_06);
                    player.setCoCurrentEnergy(currentEnergy - powerEnergy);

                } else if (skillType === Types.CoSkillType.SuperPower) {
                    const superPowerEnergy = Helpers.getExisted(player.getCoSuperPowerEnergy(), ClientErrorCode.BwWarActionExecutor_NormalExeUnitUseCoSkill_07);
                    player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

                } else {
                    throw Helpers.newError(`Invalid skillType: ${skillType}`, ClientErrorCode.BwWarActionExecutor_NormalExeUnitUseCoSkill_08);
                }

                const skillDataList : IDataForUseCoSkill[] = [];
                const skillIdList   = player.getCoCurrentSkills() || [];
                for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                    const dataForUseCoSkill = WarCoSkillHelpers.getDataForUseCoSkill(war, player, skillIndex);
                    WarCoSkillHelpers.exeInstantSkill({
                        war,
                        player,
                        skillId     : skillIdList[skillIndex],
                        extraData   : dataForUseCoSkill,
                    });
                    skillDataList.push(dataForUseCoSkill);
                }

                await focusUnit.moveViewAlongPath({
                    pathNodes,
                    isDiving    : focusUnit.getIsDiving(),
                    isBlocked   : revisedPath.isBlocked,
                    aiming      : null,
                });
                focusUnit.updateView();

                const gridVisionEffect  = war.getGridVisionEffect();
                const playerIndex       = focusUnit.getPlayerIndex();
                for (const unit of unitMap.getAllUnitsOnMap()) {
                    unit.updateView();
                    if (unit.getPlayerIndex() === playerIndex) {
                        gridVisionEffect.showEffectSkillActivation(unit.getGridIndex());
                    }
                }

                const configVersion = war.getConfigVersion();
                const mapSize       = unitMap.getMapSize();
                for (let i = 0; i < skillIdList.length; ++i) {
                    const skillCfg          = ConfigManager.getCoSkillCfg(configVersion, skillIdList[i]);
                    const indiscriminateCfg = skillCfg ? skillCfg.indiscriminateAreaDamage : null;
                    if (indiscriminateCfg) {
                        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(skillDataList[i].indiscriminateAreaDamageCenter as GridIndex, 0, indiscriminateCfg[1], mapSize)) {
                            const unit = unitMap.getUnitOnMap(gridIndex);
                            (unit) && (unit.updateView());

                            gridVisionEffect.showEffectExplosion(gridIndex);
                        }
                    }
                }
            }
        }


        WarCommonHelpers.updateTilesAndUnits(war, {
            discoveredTiles : extraData?.discoveredTilesAfterAction,
            discoveredUnits : extraData?.discoveredUnitsAfterAction,
        });
        war.updateTilesAndUnitsOnVisibilityChanged();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitWait(war: BwWar, action: IWarActionUnitWait, isFast: boolean): Promise<void> {
        isFast
            ? await fastExeUnitWait(war, action)
            : await normalExeUnitWait(war, action);
    }
    async function fastExeUnitWait(war: BwWar, action: IWarActionUnitWait): Promise<void> {
        const unitMap       = war.getUnitMap();
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption, });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);
    }
    async function normalExeUnitWait(war: BwWar, action: IWarActionUnitWait): Promise<void> {
        const desc = await war.getDescForExeUnitWait(action);
        (desc) && (FloatText.show(desc));

        const extraData = action.extraData;
        if (extraData) {
            WarCommonHelpers.updateTilesAndUnits(war, extraData);
        }

        const unitMap       = war.getUnitMap();
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const focusUnit     = Helpers.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        WarCommonHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption, });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        await focusUnit.moveViewAlongPath({
            pathNodes,
            isDiving    : focusUnit.getIsDiving(),
            isBlocked   : path.isBlocked,
            aiming      : null,
        });
        focusUnit.updateView();
        war.updateTilesAndUnitsOnVisibilityChanged();
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

        const destroyedTileSet = new Set([tile]);
        if (tile.getType() === TileType.Meteor) {
            const tileMap = war.getTileMap();
            for (const g of WarCommonHelpers.getAdjacentPlasmas(tileMap, gridIndex)) {
                const plasmaTile = tileMap.getTile(g);
                plasmaTile.destroyTileObject();
                destroyedTileSet.add(plasmaTile);
            }
        }

        tile.destroyTileObject();

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
        const configVersion     = attackerUnit.getConfigVersion();
        const attackerUnitType  = attackerUnit.getUnitType();
        const attackerGridIndex = attackerUnit.getGridIndex();
        if (isTargetDestroyed) {
            attackerUnit.addPromotion();
        }

        if (attackerPlayer.getCoId()) {
            const attackerCoZoneRadius  = attackerPlayer.getCoZoneRadius();
            const hasAttackerLoadedCo   = attackerUnit.getHasLoadedCo();
            for (const skillId of attackerPlayer.getCoCurrentSkills() || []) {
                const skillCfg  = ConfigManager.getCoSkillCfg(configVersion, skillId);
                const cfg       = skillCfg.promotionBonusByAttack;
                if ((cfg)                                                                                                                                                   &&
                    (targetLostNormalizedHp >= cfg[2])                                                                                                                      &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))                                                                      &&
                    ((hasAttackerLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
        if ((targetLostNormalizedHp == 0) || (attackerPlayer.getCoId() === CommonConstants.CoEmptyId)) {
            return;
        }

        const currentFund       = attackerPlayer.getFund();
        const configVersion     = attackerUnit.getConfigVersion();
        const attackerUnitType  = attackerUnit.getUnitType();
        const targetUnitType    = targetUnit.getUnitType();
        const targetUnitCost    = targetUnit.getProductionFinalCost();
        let addFund             = 0;
        for (const skillId of attackerPlayer.getCoCurrentSkills() || []) {
            const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.selfGetFundByAttackUnit;
            if ((cfg)                                                                               &&
                ((isAttackerInAttackerCoZone) || (cfg[0] === Types.CoSkillAreaType.Halo))           &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))  &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, targetUnitType, cfg[2]))
            ) {
                addFund += targetUnitCost / 10 * targetLostNormalizedHp * cfg[3] / 100;
            }
        }

        attackerPlayer.setFund(Math.floor(currentFund + addFund));
    }
    function handleEnergyForUnitAttackUnit({ war, attackerPlayer, targetPlayer, targetLostNormalizedHp, isAttackerInAttackerCoZone, isTargetInTargetCoZone }: {
        war                         : BwWar;
        attackerPlayer              : BwPlayer;
        targetPlayer                : BwPlayer;
        targetLostNormalizedHp      : number;
        isAttackerInAttackerCoZone  : boolean;
        isTargetInTargetCoZone      : boolean;
    }): void {
        if (targetLostNormalizedHp <= 0) {
            return;
        }

        const commonSettingManager  = war.getCommonSettingManager();
        const configVersion         = war.getConfigVersion();
        if (!attackerPlayer.checkCoIsUsingActiveSkill()) {
            const coType1 = attackerPlayer.getCoType();
            if (((coType1 === Types.CoType.Zoned) && (isAttackerInAttackerCoZone)) ||
                (coType1 === Types.CoType.Global)
            ) {
                const playerIndex1  = attackerPlayer.getPlayerIndex();
                const multiplier1   = Helpers.getExisted(playerIndex1 == null ? null : commonSettingManager.getSettingsEnergyGrowthMultiplier(playerIndex1), ClientErrorCode.BwWarActionExecutor_HandleEnergyForUnitAttackUnit_00);
                const energy1       = attackerPlayer.getCoCurrentEnergy();
                attackerPlayer.setCoCurrentEnergy(Math.min(
                    attackerPlayer.getCoMaxEnergy(),
                    energy1 + Math.floor(targetLostNormalizedHp * multiplier1 * ConfigManager.getSystemEnergyGrowthMultiplierForAttacker(configVersion) / 100),
                ));
            }
        }

        if (!targetPlayer.checkCoIsUsingActiveSkill()) {
            const coType2 = targetPlayer.getCoType();
            if (((coType2 === Types.CoType.Zoned) && (isTargetInTargetCoZone)) ||
                (coType2 === Types.CoType.Global)
            ) {
                const playerIndex2  = targetPlayer.getPlayerIndex();
                const multiplier2   = Helpers.getExisted(playerIndex2 == null ? null : commonSettingManager.getSettingsEnergyGrowthMultiplier(playerIndex2), ClientErrorCode.BwWarActionExecutor_HandleEnergyForUnitAttackUnit_01);
                const energy2       = targetPlayer.getCoCurrentEnergy();
                targetPlayer.setCoCurrentEnergy(Math.min(
                    targetPlayer.getCoMaxEnergy(),
                    energy2 + Math.floor(targetLostNormalizedHp * multiplier2 * ConfigManager.getSystemEnergyGrowthMultiplierForDefender(configVersion) / 100),
                ));
            }
        }
    }
    function handleDestructionForUnit({ war, unit }: {
        war             : BwWar,
        unit            : BwUnit,
    }): void {
        const targetGridIndex = unit.getGridIndex();
        if (unit.getCurrentHp() <= 0) {
            WarDestructionHelpers.destroyUnitOnMap(war, targetGridIndex, false);
        }
    }
}

// export default WarActionExecutor;
