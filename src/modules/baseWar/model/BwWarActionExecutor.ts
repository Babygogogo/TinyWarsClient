
namespace TinyWars.BaseWar.BwWarActionExecutor {
    import Types                                = Utility.Types;
    import ProtoTypes                           = Utility.ProtoTypes;
    import DestructionHelpers                   = Utility.DestructionHelpers;
    import GridIndexHelpers                     = Utility.GridIndexHelpers;
    import VisibilityHelpers                    = Utility.VisibilityHelpers;
    import Lang                                 = Utility.Lang;
    import FloatText                            = Utility.FloatText;
    import ConfigManager                        = Utility.ConfigManager;
    import DamageCalculator                     = Utility.DamageCalculator;
    import CommonConstants                      = Utility.CommonConstants;
    import ClientErrorCode                      = Utility.ClientErrorCode;
    import BwHelpers                            = BaseWar.BwHelpers;
    import BwCoSkillHelper                      = BaseWar.BwCoSkillHelper;
    import GridIndex                            = Types.GridIndex;
    import UnitActionState                      = Types.UnitActionState;
    import MovePath                             = Types.MovePath;
    import TileType                             = Types.TileType;
    import WarAction                            = ProtoTypes.WarAction;
    import IWarActionContainer                  = WarAction.IWarActionContainer;
    import IWarActionPlayerDeleteUnit           = WarAction.IWarActionPlayerDeleteUnit;
    import IWarActionPlayerEndTurn              = WarAction.IWarActionPlayerEndTurn;
    import IWarActionPlayerProduceUnit          = WarAction.IWarActionPlayerProduceUnit;
    import IWarActionPlayerSurrender            = WarAction.IWarActionPlayerSurrender;
    import IWarActionPlayerVoteForDraw          = WarAction.IWarActionPlayerVoteForDraw;
    import IWarActionSystemBeginTurn            = WarAction.IWarActionSystemBeginTurn;
    import IWarActionSystemCallWarEvent         = WarAction.IWarActionSystemCallWarEvent;
    import IWarActionSystemDestroyPlayerForce   = WarAction.IWarActionSystemDestroyPlayerForce;
    import IWarActionSystemEndWar               = WarAction.IWarActionSystemEndWar;
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
    import IDataForUseCoSkill                   = ProtoTypes.Structure.IDataForUseCoSkill;

    type ResultForHandleDestructionForTile = {
        errorCode           : ClientErrorCode;
        damagedTileSet?     : Set<BwTile>;
        destroyedTileSet?   : Set<BwTile>;
    };

    export async function checkAndExecute(war: BwWar, action: IWarActionContainer, isFast: boolean): Promise<ClientErrorCode> {
        if (!war.getIsRunning()) {
            return ClientErrorCode.BwWarActionExecutor_CheckAndExecute_00;
        }
        if (war.getIsExecutingAction()) {
            return ClientErrorCode.BwWarActionExecutor_CheckAndExecute_01;
        }
        if (war.getIsEnded()) {
            return ClientErrorCode.BwWarActionExecutor_CheckAndExecute_02;
        }

        const actionPlanner = war.getActionPlanner();
        war.setIsExecutingAction(true);
        actionPlanner.setStateExecutingAction();

        const errorCode = await doExecuteAction(war, action, isFast);

        actionPlanner.setStateIdle();
        war.setIsExecutingAction(false);

        return errorCode;
    }

    async function doExecuteAction(war: BwWar, action: IWarActionContainer, isFast: boolean): Promise<ClientErrorCode> {
        if      (action.WarActionPlayerDeleteUnit)          { return await exePlayerDeleteUnit(war, action.WarActionPlayerDeleteUnit, isFast); }
        else if (action.WarActionPlayerEndTurn)             { return await exePlayerEndTurn(war, action.WarActionPlayerEndTurn, isFast); }
        else if (action.WarActionPlayerProduceUnit)         { return await exePlayerProduceUnit(war, action.WarActionPlayerProduceUnit, isFast); }
        else if (action.WarActionPlayerSurrender)           { return await exePlayerSurrender(war, action.WarActionPlayerSurrender, isFast); }
        else if (action.WarActionPlayerVoteForDraw)         { return await exePlayerVoteForDraw(war, action.WarActionPlayerVoteForDraw, isFast); }
        else if (action.WarActionSystemBeginTurn)           { return await exeSystemBeginTurn(war, action.WarActionSystemBeginTurn, isFast); }
        else if (action.WarActionSystemCallWarEvent)        { return await exeSystemCallWarEvent(war, action.WarActionSystemCallWarEvent, isFast); }
        else if (action.WarActionSystemDestroyPlayerForce)  { return await exeSystemDestroyPlayerForce(war, action.WarActionSystemDestroyPlayerForce, isFast); }
        else if (action.WarActionSystemEndWar)              { return await exeSystemEndWar(war, action.WarActionSystemEndWar, isFast); }
        else if (action.WarActionUnitAttackTile)            { return await exeUnitAttackTile(war, action.WarActionUnitAttackTile, isFast); }
        else if (action.WarActionUnitAttackUnit)            { return await exeUnitAttackUnit(war, action.WarActionUnitAttackUnit, isFast); }
        else if (action.WarActionUnitBeLoaded)              { return await exeUnitBeLoaded(war, action.WarActionUnitBeLoaded, isFast); }
        else if (action.WarActionUnitBuildTile)             { return await exeUnitBuildTile(war, action.WarActionUnitBuildTile, isFast); }
        else if (action.WarActionUnitCaptureTile)           { return await exeUnitCaptureTile(war, action.WarActionUnitCaptureTile, isFast); }
        else if (action.WarActionUnitDive)                  { return await exeUnitDive(war, action.WarActionUnitDive, isFast); }
        else if (action.WarActionUnitDropUnit)              { return await exeUnitDropUnit(war, action.WarActionUnitDropUnit, isFast); }
        else if (action.WarActionUnitJoinUnit)              { return await exeUnitJoinUnit(war, action.WarActionUnitJoinUnit, isFast); }
        else if (action.WarActionUnitLaunchFlare)           { return await exeUnitLaunchFlare(war, action.WarActionUnitLaunchFlare, isFast); }
        else if (action.WarActionUnitLaunchSilo)            { return await exeUnitLaunchSilo(war, action.WarActionUnitLaunchSilo, isFast); }
        else if (action.WarActionUnitLoadCo)                { return await exeUnitLoadCo(war, action.WarActionUnitLoadCo, isFast); }
        else if (action.WarActionUnitProduceUnit)           { return await exeUnitProduceUnit(war, action.WarActionUnitProduceUnit, isFast); }
        else if (action.WarActionUnitSupplyUnit)            { return await exeUnitSupplyUnit(war, action.WarActionUnitSupplyUnit, isFast); }
        else if (action.WarActionUnitSurface)               { return await exeUnitSurface(war, action.WarActionUnitSurface, isFast); }
        else if (action.WarActionUnitUseCoSkill)            { return await exeUnitUseCoSkill(war, action.WarActionUnitUseCoSkill, isFast); }
        else if (action.WarActionUnitWait)                  { return await exeUnitWait(war, action.WarActionUnitWait, isFast); }
        else                                                { return await exeUnknownAction(); }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerDeleteUnit(war: BwWar, action: IWarActionPlayerDeleteUnit, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? exePlayerDeleteUnitFast(war, action)
            : exePlayerDeleteUnitNormal(war, action);
    }
    async function exePlayerDeleteUnitFast(war: BwWar, action: IWarActionPlayerDeleteUnit): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exePlayerDeleteUnitNormal(war: BwWar, action: IWarActionPlayerDeleteUnit): Promise<ClientErrorCode> {
        const gridIndex = action.gridIndex as GridIndex;
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
            DestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerEndTurn(war: BwWar, action: IWarActionPlayerEndTurn, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exePlayerEndTurnFast(war, action)
            : await exePlayerEndTurnNormal(war, action);
    }
    async function exePlayerEndTurnFast(war: BwWar, action: IWarActionPlayerEndTurn): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exePlayerEndTurnNormal(war: BwWar, action: IWarActionPlayerEndTurn): Promise<ClientErrorCode> {
        FloatText.show(Lang.getFormattedText(Lang.Type.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn()));

        war.getTurnManager().endPhaseMain(action);
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerProduceUnit(war: BwWar, action: IWarActionPlayerProduceUnit, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exePlayerProduceUnitFast(war, action)
            : await exePlayerProduceUnitNormal(war, action);
    }
    async function exePlayerProduceUnitFast(war: BwWar, action: IWarActionPlayerProduceUnit): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exePlayerProduceUnitNormal(war: BwWar, action: IWarActionPlayerProduceUnit): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

            const unitMap       = war.getUnitMap();
            const unitId        = unitMap.getNextUnitId();
            const playerInTurn  = war.getPlayerInTurn();
            const unitData      = extraData.unitData;
            if (unitData == null) {
                return ClientErrorCode.BwWarActionExecutor_ExePlayerProduceUnitNormal_00;
            }

            const unit = new BaseWar.BwUnit();
            unit.init(unitData, war.getConfigVersion());
            unit.startRunning(war);
            unit.startRunningView();
            unitMap.setUnitOnMap(unit);
            unitMap.setNextUnitId(unitId + 1);
            playerInTurn.setFund(playerInTurn.getFund() - extraData.cost);

        } else {
            const gridIndex     = action.gridIndex as GridIndex;
            const unitType      = action.unitType;
            const unitHp        = action.unitHp;
            const configVersion = war.getConfigVersion();
            const unitMap       = war.getUnitMap();
            const unitId        = unitMap.getNextUnitId();
            const playerInTurn  = war.getPlayerInTurn();
            const playerIndex   = playerInTurn.getPlayerIndex();
            const skillCfg      = war.getTileMap().getTile(gridIndex).getEffectiveSelfUnitProductionSkillCfg(playerIndex);
            const cfgCost       = ConfigManager.getUnitTemplateCfg(configVersion, unitType).productionCost;
            const cost          = Math.floor(cfgCost * (skillCfg ? skillCfg[5] : 100) / 100 * BwHelpers.getNormalizedHp(unitHp) / CommonConstants.UnitHpNormalizer);
            const unit          = new BaseWar.BwUnit();
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

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerSurrender(war: BwWar, action: IWarActionPlayerSurrender, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exePlayerSurrenderFast(war, action)
            : await exePlayerSurrenderNormal(war, action);
    }
    async function exePlayerSurrenderFast(war: BwWar, data: IWarActionPlayerSurrender): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exePlayerSurrenderNormal(war: BwWar, action: IWarActionPlayerSurrender): Promise<ClientErrorCode> {
        const player = war.getPlayerInTurn();
        FloatText.show(Lang.getFormattedText(action.isBoot ? Lang.Type.F0028 : Lang.Type.F0008, await player.getNickname()));

        player.setAliveState(Types.PlayerAliveState.Dying);

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exePlayerVoteForDraw(war: BwWar, action: IWarActionPlayerVoteForDraw, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exePlayerVoteForDrawFast(war, action)
            : await exePlayerVoteForDrawNormal(war, action);
    }
    async function exePlayerVoteForDrawFast(war: BwWar, action: IWarActionPlayerVoteForDraw): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exePlayerVoteForDrawNormal(war: BwWar, action: IWarActionPlayerVoteForDraw): Promise<ClientErrorCode> {
        const playerInTurn = war.getPlayerInTurn();
        playerInTurn.setHasVotedForDraw(true);

        const nickname          = await playerInTurn.getNickname();
        const drawVoteManager   = war.getDrawVoteManager();
        if (!action.isAgree) {
            FloatText.show(Lang.getFormattedText(Lang.Type.F0017, nickname));
            drawVoteManager.setRemainingVotes(undefined);
        } else {
            const remainingVotes = drawVoteManager.getRemainingVotes();
            if (remainingVotes) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0018, nickname));
            } else {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0019, nickname));
            }
            drawVoteManager.setRemainingVotes((remainingVotes || war.getPlayerManager().getAlivePlayersCount(false)) - 1);
        }

        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemBeginTurn(war: BwWar, action: IWarActionSystemBeginTurn, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeSystemBeginTurnFast(war, action)
            : await exeSystemBeginTurnNormal(war, action);
    }
    async function exeSystemBeginTurnFast(war: BwWar, action: IWarActionSystemBeginTurn): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeSystemBeginTurnNormal(war: BwWar, action: IWarActionSystemBeginTurn): Promise<ClientErrorCode> {
        const playerIndex = war.getPlayerIndexInTurn();
        if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
            FloatText.show(Lang.getFormattedText(Lang.Type.F0022, Lang.getText(Lang.Type.B0111), playerIndex));
        } else {
            FloatText.show(Lang.getFormattedText(Lang.Type.F0022, await war.getPlayerInTurn().getNickname(), playerIndex));
        }

        await war.getTurnManager().endPhaseWaitBeginTurn(action);
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemCallWarEvent(war: BwWar, action: IWarActionSystemCallWarEvent, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeSystemCallWarEventFast(war, action)
            : await exeSystemCallWarEventNormal(war, action);
    }
    async function exeSystemCallWarEventFast(war: BwWar, action: IWarActionSystemCallWarEvent): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeSystemCallWarEventNormal(war: BwWar, action: IWarActionSystemCallWarEvent): Promise<ClientErrorCode> {
        FloatText.show(`${Lang.getText(Lang.Type.B0451)}`);

        const warEventManager   = war.getWarEventManager();
        const warEventId        = action.warEventId;
        warEventManager.updateWarEventCalledCountOnCall(warEventId);

        const extraDataList = action.extraDataList;
        if (extraDataList == null) {
            await warEventManager.callWarEvent(warEventId, false);
        } else {
            const unitMap       = war.getUnitMap();
            const configVersion = war.getConfigVersion();
            const actionIdArray = warEventManager.getWarEvent(warEventId).actionIdArray;
            for (let index = 0; index < actionIdArray.length; ++index) {
                const warEventAction = warEventManager.getWarEventAction(actionIdArray[index]);
                if (warEventAction.WeaAddUnit) {
                    for (const unitData of extraDataList.find(v => v.indexForActionIdList === index).ExtraDataForWeaAddUnit.unitList || []) {
                        const unit = new BaseWar.BwUnit();
                        unit.init(unitData, configVersion);
                        unit.startRunning(war);
                        unit.startRunningView();
                        unitMap.setUnitOnMap(unit);
                        unitMap.setNextUnitId(Math.max(unitData.unitId + 1, unitMap.getNextUnitId()));
                    }

                } else if (warEventAction.WeaSetPlayerAliveState) {
                    const actionData    = warEventAction.WeaSetPlayerAliveState;
                    const player        = war.getPlayer(actionData.playerIndex);
                    if (player != null) {
                        player.setAliveState(actionData.playerAliveState);
                    }

                } else {
                    // TODO add executors for other actions.
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemDestroyPlayerForce(war: BwWar, action: IWarActionSystemDestroyPlayerForce, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? exeSystemDestroyPlayerForceFast(war, action)
            : exeSystemDestroyPlayerForceNormal(war, action);
    }
    async function exeSystemDestroyPlayerForceFast(war: BwWar, action: IWarActionSystemDestroyPlayerForce): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeSystemDestroyPlayerForceNormal(war: BwWar, action: IWarActionSystemDestroyPlayerForce): Promise<ClientErrorCode> {
        const playerIndex = action.targetPlayerIndex;
        FloatText.show(`${await war.getPlayer(playerIndex).getNickname()}${Lang.getText(Lang.Type.B0450)}`);

        DestructionHelpers.destroyPlayerForce(war, playerIndex, true);

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeSystemEndWar(war: BwWar, action: IWarActionSystemEndWar, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? exeSystemEndWarFast(war, action)
            : exeSystemEndWarNormal(war, action);
    }
    async function exeSystemEndWarFast(war: BwWar, action: IWarActionSystemEndWar): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeSystemEndWarNormal(war: BwWar, action: IWarActionSystemEndWar): Promise<ClientErrorCode> {
        FloatText.show(`${Lang.getText(Lang.Type.B0087)}`);

        war.setIsEnded(true);
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitAttackTile(war: BwWar, action: IWarActionUnitAttackTile, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? exeUnitAttackTileFast(war, action)
            : exeUnitAttackTileNormal(war, action);
    }
    async function exeUnitAttackTileFast(war: BwWar, action: IWarActionUnitAttackTile): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitAttackTileNormal(war: BwWar, action: IWarActionUnitAttackTile): Promise<ClientErrorCode> {
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();

        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

            const focusUnit = unitMap.getUnit(pathNodes[0], launchUnitId);
            if (path.isBlocked) {
                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), true);
                focusUnit.updateView();

            } else {
                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false, action.targetGridIndex as GridIndex);

                const tileMap           = war.getTileMap();
                const damagedTileSet    = new Set<BwTile>();
                const destroyedTileSet  = new Set<BwTile>();
                const damagedUnitSet    = new Set<BwUnit>();
                for (const battleDamageInfo of extraData.battleDamageInfoArray || []) {
                    const targetUnitId = battleDamageInfo.targetUnitId;
                    if (targetUnitId != null) {
                        damagedUnitSet.add(unitMap.getUnitById(targetUnitId));
                        continue;
                    }

                    const targetTileGridIndex = BwHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex);
                    if (targetTileGridIndex == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackTileNormal_00;
                    }

                    const tile = tileMap.getTile(targetTileGridIndex);
                    tile.setCurrentHp(Math.max(0, tile.getCurrentHp() - battleDamageInfo.damage));

                    const {
                        errorCode       : errorCodeForTileDestruction,
                        damagedTileSet  : damagedTiles,
                        destroyedTileSet: destroyedTiles,
                    } = handleDestructionForTile(war, tile);
                    if (errorCodeForTileDestruction) {
                        return errorCodeForTileDestruction;
                    }

                    for (const t of damagedTiles) {
                        damagedTileSet.add(t);
                    }
                    for (const t of destroyedTiles) {
                        destroyedTileSet.add(t);
                    }
                }

                const configVersion     = war.getConfigVersion();
                const affectedUnitSet   = new Set<BwUnit>();
                for (const affectedUnitData of extraData.affectedUnitsAfterAction || []) {
                    const unit = unitMap.getUnitById(affectedUnitData.unitId);
                    unit.init(affectedUnitData, configVersion);
                    if (unit.getCurrentHp() <= 0) {
                        DestructionHelpers.destroyUnitOnMap(war, unit.getGridIndex(), false);
                    }

                    affectedUnitSet.add(unit);
                }

                for (const affectedPlayerData of extraData.affectedPlayersAfterAction || []) {
                    war.getPlayer(affectedPlayerData.playerIndex).init(affectedPlayerData, configVersion);
                }

                const allVisibleUnits   = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
                const gridVisionEffect  = war.getGridVisionEffect();
                let canVibrateScreen    = false;
                for (const unit of affectedUnitSet) {
                    if (allVisibleUnits.has(unit)) {
                        const gridIndex = unit.getGridIndex();
                        if (unit.getCurrentHp() <= 0) {
                            canVibrateScreen = true;
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
                if ((canVibrateScreen) || (destroyedTileSet.size)) {
                    war.getView().showVibration();
                }
            }

        } else {
            const focusUnit = unitMap.getUnit(pathNodes[0], launchUnitId);
            if (path.isBlocked) {
                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), true);
                focusUnit.updateView();

            } else {
                const targetGridIndex                                           = action.targetGridIndex as GridIndex;
                const { errorCode: errorCodeForDamage, battleDamageInfoArray }  = DamageCalculator.getFinalBattleDamage({
                    war,
                    attackerMovePath: pathNodes,
                    launchUnitId,
                    targetGridIndex,
                });
                if (errorCodeForDamage) {
                    return errorCodeForDamage;
                } else if (battleDamageInfoArray == null) {
                    return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackTileNormal_01;
                }

                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false, targetGridIndex);

                const tileMap           = war.getTileMap();
                const affectedPlayerSet = new Set<BaseWar.BwPlayer>();
                const affectedUnitSet   = new Set<BwUnit>();
                const destroyedTileSet  = new Set<BwTile>();
                const damagedTileSet    = new Set<BwTile>();
                for (const battleDamageInfo of battleDamageInfoArray) {
                    const gridIndex2 = BwHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex);
                    if (gridIndex2 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackTileNormal_02;
                    }

                    const tile2 = tileMap.getTile(gridIndex2);
                    if (tile2 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackTileNormal_03;
                    }

                    const unitId1 = battleDamageInfo.attackerUnitId;
                    if (unitId1 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackTileNormal_04;
                    }

                    const unit1 = unitMap.getUnitById(unitId1);
                    if (unit1 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackTileNormal_05;
                    }

                    const tileOldHp2 = tile2.getCurrentHp();
                    if (tileOldHp2 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackTileNormal_06;
                    }

                    const damage = battleDamageInfo.damage;
                    if (damage == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackTileNormal_07;
                    }

                    const player1 = unit1.getPlayer();
                    if (player1 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackTileNormal_08;
                    }

                    affectedPlayerSet.add(player1);
                    affectedUnitSet.add(unit1);

                    const errorCodeForPrimaryAmmo = handlePrimaryWeaponAmmoForUnitAttackTile(unit1, tile2);
                    if (errorCodeForPrimaryAmmo) {
                        return errorCodeForPrimaryAmmo;
                    }

                    const errorCodeForHp = handleHpForTile(tile2, Math.max(0, tileOldHp2 - damage));
                    if (errorCodeForHp) {
                        return errorCodeForHp;
                    }

                    const {
                        errorCode       : errorCodeForTileDestruction,
                        damagedTileSet  : damagedTiles,
                        destroyedTileSet: destroyedTiles,
                    } = handleDestructionForTile(war, tile2);
                    if (errorCodeForTileDestruction) {
                        return errorCodeForTileDestruction;
                    }

                    for (const tile of damagedTiles) {
                        damagedTileSet.add(tile);
                    }
                    for (const tile of destroyedTiles) {
                        destroyedTileSet.add(tile);
                    }
                }

                for (const affectedPlayer of affectedPlayerSet) {
                    const affectedPlayerIndex = affectedPlayer.getPlayerIndex();
                    if (affectedPlayerIndex == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackTileNormal_09;
                    }

                    if ((!unitMap.checkHasUnit(affectedPlayerIndex))                    &&
                        (affectedPlayer.getAliveState() !== Types.PlayerAliveState.Dead)
                    ) {
                        affectedPlayer.setAliveState(Types.PlayerAliveState.Dying);
                    }
                }

                for (const affectedUnit of affectedUnitSet) {
                    affectedUnit.updateView();
                }

                const gridVisionEffect = war.getGridVisionEffect();
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
                if (destroyedTileSet.size) {
                    war.getView().showVibration();
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitAttackUnit(war: BwWar, action: IWarActionUnitAttackUnit, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitAttackUnitFast(war, action)
            : await exeUnitAttackUnitNormal(war, action);
    }
    async function exeUnitAttackUnitFast(war: BwWar, action: IWarActionUnitAttackUnit): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitAttackUnitNormal(war: BwWar, action: IWarActionUnitAttackUnit): Promise<ClientErrorCode> {
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();

        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

            const focusUnit = unitMap.getUnit(pathNodes[0], launchUnitId);
            if (path.isBlocked) {
                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), true);
                focusUnit.updateView();

            } else {
                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false, action.targetGridIndex as GridIndex);

                const tileMap           = war.getTileMap();
                const damagedTileSet    = new Set<BwTile>();
                const destroyedTileSet  = new Set<BwTile>();
                const damagedUnitSet    = new Set<BwUnit>();
                for (const battleDamageInfo of extraData.battleDamageInfoArray || []) {
                    const targetUnitId = battleDamageInfo.targetUnitId;
                    if (targetUnitId != null) {
                        damagedUnitSet.add(unitMap.getUnitById(targetUnitId));
                        continue;
                    }

                    const targetTileGridIndex = BwHelpers.convertGridIndex(battleDamageInfo.targetTileGridIndex);
                    if (targetTileGridIndex == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackTileNormal_00;
                    }

                    const tile = tileMap.getTile(targetTileGridIndex);
                    tile.setCurrentHp(Math.max(0, tile.getCurrentHp() - battleDamageInfo.damage));

                    const {
                        errorCode       : errorCodeForTileDestruction,
                        damagedTileSet  : damagedTiles,
                        destroyedTileSet: destroyedTiles,
                    } = handleDestructionForTile(war, tile);
                    if (errorCodeForTileDestruction) {
                        return errorCodeForTileDestruction;
                    }

                    for (const t of damagedTiles) {
                        damagedTileSet.add(t);
                    }
                    for (const t of destroyedTiles) {
                        destroyedTileSet.add(t);
                    }
                }

                const configVersion     = war.getConfigVersion();
                const affectedUnitSet   = new Set<BwUnit>();
                for (const affectedUnitData of extraData.affectedUnitsAfterAction || []) {
                    const unit = unitMap.getUnitById(affectedUnitData.unitId);
                    unit.init(affectedUnitData, configVersion);
                    if (unit.getCurrentHp() <= 0) {
                        DestructionHelpers.destroyUnitOnMap(war, unit.getGridIndex(), false);
                    }

                    affectedUnitSet.add(unit);
                }

                for (const affectedPlayerData of extraData.affectedPlayersAfterAction || []) {
                    war.getPlayer(affectedPlayerData.playerIndex).init(affectedPlayerData, configVersion);
                }

                const allVisibleUnits   = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
                const gridVisionEffect  = war.getGridVisionEffect();
                let canVibrateScreen    = false;
                for (const unit of affectedUnitSet) {
                    if (allVisibleUnits.has(unit)) {
                        const gridIndex = unit.getGridIndex();
                        if (unit.getCurrentHp() <= 0) {
                            canVibrateScreen = true;
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
                if ((canVibrateScreen) || (destroyedTileSet.size)) {
                    war.getView().showVibration();
                }
            }

        } else {
            const focusUnit = unitMap.getUnit(pathNodes[0], launchUnitId);
            if (path.isBlocked) {
                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), true);
                focusUnit.updateView();

            } else {
                const targetGridIndex                                           = action.targetGridIndex as GridIndex;
                const { errorCode: errorCodeForDamage, battleDamageInfoArray }  = DamageCalculator.getFinalBattleDamage({
                    war,
                    attackerMovePath: pathNodes,
                    launchUnitId,
                    targetGridIndex,
                });
                if (errorCodeForDamage) {
                    return errorCodeForDamage;
                } else if (battleDamageInfoArray == null) {
                    return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_00;
                }

                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false, targetGridIndex);

                const affectedPlayerSet = new Set<BwPlayer>();
                const affectedUnitSet   = new Set<BwUnit>();
                const damagedUnitSet    = new Set<BwUnit>();
                for (const battleDamageInfo of battleDamageInfoArray) {
                    const unitId1 = battleDamageInfo.attackerUnitId;
                    if (unitId1 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_01;
                    }

                    const unit1 = unitMap.getUnitById(unitId1);
                    if (unit1 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_02;
                    }

                    const unitId2 = battleDamageInfo.targetUnitId;
                    if (unitId2 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_03;
                    }

                    const unit2 = unitMap.getUnitById(unitId2);
                    if (unit2 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_04;
                    }

                    const unitOldHp2 = unit2.getCurrentHp();
                    if (unitOldHp2 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_05;
                    }

                    const player1 = unit1.getPlayer();
                    if (player1 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_06;
                    }

                    const player2 = unit2.getPlayer();
                    if (player2 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_07;
                    }

                    const unitGridIndex1 = unit1.getGridIndex();
                    if (unitGridIndex1 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_08;
                    }

                    const playerIndex1 = unit1.getPlayerIndex();
                    if (playerIndex1 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_09;
                    }

                    const coGridIndexArray1 = unitMap.getCoGridIndexListOnMap(playerIndex1);
                    if (coGridIndexArray1 == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_10;
                    }

                    const damage = battleDamageInfo.damage;
                    if (damage == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_11;
                    }

                    affectedPlayerSet.add(player1);
                    affectedPlayerSet.add(player2);
                    affectedUnitSet.add(unit1);
                    affectedUnitSet.add(unit2);
                    damagedUnitSet.add(unit2);

                    const unitNewHp2            = Math.max(0, unitOldHp2 - damage);
                    const unitLostNormalizedHp2 = BwHelpers.getNormalizedHp(unitOldHp2) - BwHelpers.getNormalizedHp(unitNewHp2);

                    const errorCodeForPrimaryAmmo = handlePrimaryWeaponAmmoForUnitAttackUnit(unit1, unit2);
                    if (errorCodeForPrimaryAmmo) {
                        return errorCodeForPrimaryAmmo;
                    }

                    const errorCodeForHp = handleHpForUnit(unit2, unitNewHp2);
                    if (errorCodeForHp) {
                        return errorCodeForHp;
                    }

                    const errorCodeForPromotion = handlePromotionForUnitAttackUnit({
                        attackerPlayer              : player1,
                        attackerUnit                : unit1,
                        targetLostNormalizedHp      : unitLostNormalizedHp2,
                        attackerCoGridIndexListOnMap: coGridIndexArray1,
                        isTargetDestroyed           : unitNewHp2 <= 0,
                    });
                    if (errorCodeForPromotion) {
                        return errorCodeForPromotion;
                    }

                    const errorCodeForEnergy = handleEnergyForUnitAttackUnit({
                        war,
                        attackerPlayer              : player1,
                        targetLostNormalizedHp      : unitLostNormalizedHp2,
                        isAttackerInAttackerCoZone  : (unit1.getHasLoadedCo()) || (player1.checkIsInCoZone(unitGridIndex1, coGridIndexArray1)),
                    });
                    if (errorCodeForEnergy) {
                        return errorCodeForEnergy;
                    }

                    const errorCodeForUnitDestruction = handleDestructionForUnit({
                        war,
                        unit    : unit2,
                    });
                    if (errorCodeForUnitDestruction) {
                        return errorCodeForUnitDestruction;
                    }
                }

                for (const affectedPlayer of affectedPlayerSet) {
                    const affectedPlayerIndex = affectedPlayer.getPlayerIndex();
                    if (affectedPlayerIndex == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitAttackUnitNormal_12;
                    }

                    if ((!unitMap.checkHasUnit(affectedPlayerIndex))                    &&
                        (affectedPlayer.getAliveState() !== Types.PlayerAliveState.Dead)
                    ) {
                        affectedPlayer.setAliveState(Types.PlayerAliveState.Dying);
                    }
                }

                const allVisibleUnits   = VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
                const gridVisionEffect  = war.getGridVisionEffect();
                let canVibrateScreen    = false;
                for (const unit of affectedUnitSet) {
                    if (allVisibleUnits.has(unit)) {
                        const gridIndex = unit.getGridIndex();
                        if (unit.getCurrentHp() <= 0) {
                            canVibrateScreen = true;
                            gridVisionEffect.showEffectExplosion(gridIndex);

                        } else {
                            unit.updateView();
                            if (damagedUnitSet.has(unit)) {
                                gridVisionEffect.showEffectDamage(gridIndex);
                            }
                        }
                    }
                }
                if (canVibrateScreen) {
                    war.getView().showVibration();
                }
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitBeLoaded(war: BwWar, action: IWarActionUnitBeLoaded, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitBeLoadedFast(war, action)
            : await exeUnitBeLoadedNormal(war, action);
    }
    async function exeUnitBeLoadedFast(war: BwWar, action: IWarActionUnitBeLoaded): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitBeLoadedNormal(war: BwWar, action: IWarActionUnitBeLoaded): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        focusUnit.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            unitMap.setUnitOnMap(focusUnit);

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();

        } else {
            const loaderUnit = unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]);
            unitMap.setUnitLoaded(focusUnit);
            focusUnit.setLoaderUnitId(loaderUnit.getUnitId());

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();
            focusUnit.setViewVisible(false);
            loaderUnit.updateView();
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitBuildTile(war: BwWar, action: IWarActionUnitBuildTile, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitBuildTileFast(war, action)
            : await exeUnitBuildTileNormal(war, action);
    }
    async function exeUnitBuildTileFast(war: BwWar, action: IWarActionUnitBuildTile): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitBuildTileNormal(war: BwWar, action: IWarActionUnitBuildTile): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        if (!path.isBlocked) {
            const endingGridIndex   = pathNodes[pathNodes.length - 1];
            const tile              = war.getTileMap().getTile(endingGridIndex);
            const buildPoint        = tile.getCurrentBuildPoint() - focusUnit.getBuildAmount();
            // if (tile.getIsFogEnabled()) {
            //     tile.setFogDisabled();
            // }
            if (buildPoint > 0) {
                focusUnit.setIsBuildingTile(true);
                tile.setCurrentBuildPoint(buildPoint);
            } else {
                const targetTileCfg = focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType());
                if (targetTileCfg == null) {
                    return ClientErrorCode.BwWarActionExecutor_ExeUnitBuildTileNormal_00;
                }

                focusUnit.setIsBuildingTile(false);
                focusUnit.setCurrentBuildMaterial(focusUnit.getCurrentBuildMaterial() - 1);
                tile.resetByTypeAndPlayerIndex({
                    baseType        : targetTileCfg.dstBaseType,
                    objectType      : targetTileCfg.dstObjectType,
                    playerIndex     : focusUnit.getPlayerIndex(),
                });
            }
        }

        await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
        focusUnit.updateView();
        war.updateTilesAndUnitsOnVisibilityChanged();

        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitCaptureTile(war: BwWar, action: IWarActionUnitCaptureTile, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitCaptureTileFast(war, action)
            : await exeUnitCaptureTileNormal(war, action);
    }
    async function exeUnitCaptureTileFast(war: BwWar, action: IWarActionUnitCaptureTile): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitCaptureTileNormal(war: BwWar, action: IWarActionUnitCaptureTile): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), true);
            focusUnit.updateView();

        } else {
            const destination       = pathNodes[pathNodes.length - 1];
            const tile              = war.getTileMap().getTile(destination);
            const restCapturePoint  = tile.getCurrentCapturePoint() - focusUnit.getCaptureAmount();
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
            }

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false);
            focusUnit.updateView();
            tile.flushDataToView();
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitDive(war: BwWar, action: IWarActionUnitDive, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitDiveFast(war, action)
            : await exeUnitDiveNormal(war, action);
    }
    async function exeUnitDiveFast(war: BwWar, action: IWarActionUnitDive): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitDiveNormal(war: BwWar, action: IWarActionUnitDive): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        const isSuccessful  = !path.isBlocked;
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(true));

        await focusUnit.moveViewAlongPath(pathNodes, false, path.isBlocked);
        focusUnit.updateView();
        if (isSuccessful) {
            const endingGridIndex = pathNodes[pathNodes.length - 1];
            if (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
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
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitDropUnit(war: BwWar, action: IWarActionUnitDropUnit, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitDropUnitFast(war, action)
            : await exeUnitDropUnitNormal(war, action);
    }
    async function exeUnitDropUnitFast(war: BwWar, action: IWarActionUnitDropUnit): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitDropUnitNormal(war: BwWar, action: IWarActionUnitDropUnit): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const path              = action.path as MovePath;
        const launchUnitId      = action.launchUnitId;
        const pathNodes         = path.nodes;
        const unitMap           = war.getUnitMap();
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        const shouldUpdateFogMap    = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex());
        const fogMap                = war.getFogMap();
        const unitsForDrop          : BwUnit[] = [];
        for (const { unitId, gridIndex } of (action.dropDestinations || []) as Types.DropDestination[]) {
            const unitForDrop = unitMap.getUnitLoadedById(unitId);
            unitMap.setUnitUnloaded(unitId, gridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                unit.setGridIndex(gridIndex);
            }

            unitForDrop.setLoaderUnitId(undefined);
            unitForDrop.setGridIndex(gridIndex);
            unitForDrop.setActionState(UnitActionState.Acted);
            unitsForDrop.push(unitForDrop);

            if (shouldUpdateFogMap) {
                fogMap.updateMapFromPathsByUnitAndPath(unitForDrop, [endingGridIndex, gridIndex]);
            }
        }

        await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
        if (action.isDropBlocked) {
            war.getGridVisionEffect().showEffectBlock(endingGridIndex);
        }
        focusUnit.updateView();

        const promises: Promise<void>[] = [];
        for (const unitForDrop of unitsForDrop) {
            promises.push((async () => {
                await unitForDrop.moveViewAlongPath(
                    [endingGridIndex, unitForDrop.getGridIndex()],
                    unitForDrop.getIsDiving(),
                    false,
                );
                unitForDrop.updateView();
            })());
        }
        await Promise.all(promises);
        war.updateTilesAndUnitsOnVisibilityChanged();

        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitJoinUnit(war: BwWar, action: IWarActionUnitJoinUnit, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitJoinUnitFast(war, action)
            : await exeUnitJoinUnitNormal(war, action);
    }
    async function exeUnitJoinUnitFast(war: BwWar, action: IWarActionUnitJoinUnit): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitJoinUnitNormal(war: BwWar, action: IWarActionUnitJoinUnit): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const path              = action.path as MovePath;
        const launchUnitId      = action.launchUnitId;
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const unitMap           = war.getUnitMap();
        const focusUnit         = unitMap.getUnit(pathNodes[0], launchUnitId);

        if (path.isBlocked) {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();

        } else {
            const targetUnit    = unitMap.getUnitOnMap(endingGridIndex);
            const player        = war.getPlayer(focusUnit.getPlayerIndex());
            unitMap.removeUnitOnMap(endingGridIndex, false);
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            focusUnit.setHasLoadedCo(focusUnit.getHasLoadedCo() || targetUnit.getHasLoadedCo());

            if (focusUnit.checkHasPrimaryWeapon()) {
                focusUnit.setPrimaryWeaponCurrentAmmo(Math.min(
                    focusUnit.getPrimaryWeaponMaxAmmo()!,
                    focusUnit.getPrimaryWeaponCurrentAmmo()! + targetUnit.getPrimaryWeaponCurrentAmmo()!
                ));
            }

            const joinIncome = focusUnit.getJoinIncome(targetUnit)!;
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
                    focusUnit.getCurrentBuildMaterial()! + targetUnit.getCurrentBuildMaterial()!
                ));
            }

            const maxProduceMaterial = focusUnit.getMaxProduceMaterial();
            if (maxProduceMaterial != null) {
                focusUnit.setCurrentProduceMaterial(Math.min(
                    maxProduceMaterial,
                    focusUnit.getCurrentProduceMaterial()! + targetUnit.getCurrentProduceMaterial()!
                ))
            }

            focusUnit.setCurrentPromotion(Math.max(focusUnit.getCurrentPromotion(), targetUnit.getCurrentPromotion()));

            focusUnit.setIsCapturingTile(targetUnit.getIsCapturingTile());

            focusUnit.setIsBuildingTile(targetUnit.getIsBuildingTile());

            // flare ammo
            {
                const maxAmmo = focusUnit.getFlareMaxAmmo();
                if (maxAmmo != null) {
                    const focusUnitCurrentAmmo  = focusUnit.getFlareCurrentAmmo();
                    const targetUnitCurrentAmmo = targetUnit.getFlareCurrentAmmo();
                    focusUnit.setFlareCurrentAmmo(Math.min(
                        maxAmmo,
                        focusUnitCurrentAmmo + targetUnitCurrentAmmo
                    ));
                }
            }

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();
            unitMap.getView().removeUnit(targetUnit.getView());
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitLaunchFlare(war: BwWar, action: IWarActionUnitLaunchFlare, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitLaunchFlareFast(war, action)
            : await exeUnitLaunchFlareNormal(war, action);
    }
    async function exeUnitLaunchFlareFast(war: BwWar, action: IWarActionUnitLaunchFlare): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitLaunchFlareNormal(war: BwWar, action: IWarActionUnitLaunchFlare): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        const isFlareSucceeded  = !path.isBlocked;
        const targetGridIndex   = action.targetGridIndex as GridIndex;
        const flareRadius       = focusUnit.getFlareRadius();
        if (isFlareSucceeded) {
            focusUnit.setFlareCurrentAmmo(focusUnit.getFlareCurrentAmmo() - 1);
            war.getFogMap().updateMapFromPathsByFlare(focusUnit.getPlayerIndex(), targetGridIndex, flareRadius);
        }

        await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
        if ((isFlareSucceeded) && (war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()))) {
            const effect = war.getGridVisionEffect();
            for (const grid of GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, flareRadius, war.getTileMap().getMapSize())) {
                effect.showEffectFlare(grid);
            }
        }

        focusUnit.updateView();
        war.updateTilesAndUnitsOnVisibilityChanged();

        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitLaunchSilo(war: BwWar, action: IWarActionUnitLaunchSilo, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitLaunchSiloFast(war, action)
            : await exeUnitLaunchSiloNormal(war, action);
    }
    async function exeUnitLaunchSiloFast(war: BwWar, action: IWarActionUnitLaunchSilo): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitLaunchSiloNormal(war: BwWar, action: IWarActionUnitLaunchSilo): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const launchUnitId  = action.launchUnitId;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();
            war.updateTilesAndUnitsOnVisibilityChanged();

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

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            const effect = war.getGridVisionEffect();
            for (const grid of targetGrids) {
                effect.showEffectSiloExplosion(grid);
            }
            for (const unit of targetUnits) {
                unit.updateView();
            }

            focusUnit.updateView();
            tile.flushDataToView();
            war.updateTilesAndUnitsOnVisibilityChanged();
        }

        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitLoadCo(war: BwWar, action: IWarActionUnitLoadCo, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitLoadCoFast(war, action)
            : await exeUnitLoadCoNormal(war, action);
    }
    async function exeUnitLoadCoFast(war: BwWar, action: IWarActionUnitLoadCo): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitLoadCoNormal(war: BwWar, action: IWarActionUnitLoadCo): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);

        if (path.isBlocked) {
            focusUnit.setActionState(UnitActionState.Acted);
        } else {
            const playerIndex           = focusUnit.getPlayerIndex();
            const energyAddPctOnLoadCo  = war.getCommonSettingManager().getSettingsEnergyAddPctOnLoadCo(playerIndex);
            if (energyAddPctOnLoadCo == null) {
                return ClientErrorCode.BwWarActionExecutor_ExeUnitLoadCoNormal_00;
            }

            focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());
            focusUnit.setHasLoadedCo(true);

            const player        = war.getPlayer(playerIndex);
            const coMaxEnergy   = player.getCoMaxEnergy();
            player.setFund(player.getFund() - focusUnit.getLoadCoCost()!);
            player.setCoCurrentEnergy(Math.min(
                coMaxEnergy,
                player.getCoCurrentEnergy() + Math.floor(coMaxEnergy * energyAddPctOnLoadCo / 100))
            );
        }

        await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
        focusUnit.updateView();
        war.updateTilesAndUnitsOnVisibilityChanged();

        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitProduceUnit(war: BwWar, action: IWarActionUnitProduceUnit, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitProduceUnitFast(war, action)
            : await exeUnitProduceUnitNormal(war, action);
    }
    async function exeUnitProduceUnitFast(war: BwWar, action: IWarActionUnitProduceUnit): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitProduceUnitNormal(war: BwWar, action: IWarActionUnitProduceUnit): Promise<ClientErrorCode> {
        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.launchUnitId;
        const extraData     = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

            const focusUnit = unitMap.getUnit(pathNodes[0], launchUnitId);
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            if (path.isBlocked) {
                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
                focusUnit.updateView();

            } else {
                const gridIndex         = focusUnit.getGridIndex();
                const producedUnitId    = unitMap.getNextUnitId();
                const producedUnit      = new BaseWar.BwUnit();
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
                player.setFund(player.getFund() - extraData.cost);
                unitMap.setNextUnitId(producedUnitId + 1);
                unitMap.setUnitLoaded(producedUnit);
                focusUnit.setCurrentProduceMaterial(focusUnit.getCurrentProduceMaterial()! - 1);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
                focusUnit.updateView();
            }

        } else {
            const focusUnit = unitMap.getUnit(pathNodes[0], launchUnitId);
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            if (path.isBlocked) {
                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
                focusUnit.updateView();

            } else {
                const gridIndex         = focusUnit.getGridIndex();
                const producedUnitId    = unitMap.getNextUnitId();
                const producedUnit      = new BaseWar.BwUnit();
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
                focusUnit.setCurrentProduceMaterial(focusUnit.getCurrentProduceMaterial()! - 1);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
                focusUnit.updateView();
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitSupplyUnit(war: BwWar, action: IWarActionUnitSupplyUnit, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitSupplyUnitFast(war, action)
            : await exeUnitSupplyUnitNormal(war, action);
    }
    async function exeUnitSupplyUnitFast(war: BwWar, action: IWarActionUnitSupplyUnit): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitSupplyUnitNormal(war: BwWar, action: IWarActionUnitSupplyUnit): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const revisedPath   = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = revisedPath.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        const isBlocked = revisedPath.isBlocked;
        if (isBlocked) {
            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), isBlocked);
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
                        deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - unit.getFlareCurrentAmmo()! : null,
                        deltaPrimaryWeaponAmmo  : maxPrimaryWeaponAmmo ? maxPrimaryWeaponAmmo - unit.getPrimaryWeaponCurrentAmmo()! : null,
                    });
                    suppliedUnits.push(unit);
                }
            }

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), isBlocked);
            focusUnit.updateView();

            const gridVisionEffect = war.getGridVisionEffect();
            for (const unit of suppliedUnits) {
                unit.updateView();
                gridVisionEffect.showEffectSupply(unit.getGridIndex());
            }
        }

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitSurface(war: BwWar, action: IWarActionUnitSurface, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitSurfaceFast(war, action)
            : await exeUnitSurfaceNormal(war, action);
    }
    async function exeUnitSurfaceFast(war: BwWar, action: IWarActionUnitSurface): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitSurfaceNormal(war: BwWar, action: IWarActionUnitSurface): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const unitMap       = war.getUnitMap();
        const revisedPath   = action.path as MovePath;
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        const isSuccessful  = !revisedPath.isBlocked;
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(false));

        await focusUnit.moveViewAlongPath(pathNodes, true, revisedPath.isBlocked);
        focusUnit.updateView();
        if (isSuccessful) {
            const endingGridIndex = pathNodes[pathNodes.length - 1];
            if (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
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
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitUseCoSkill(war: BwWar, action: IWarActionUnitUseCoSkill, isFast: boolean): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitUseCoSkillFast(war, action)
            : await exeUnitUseCoSkillNormal(war, action);
    }
    async function exeUnitUseCoSkillFast(war: BwWar, action: IWarActionUnitUseCoSkill): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitUseCoSkillNormal(war: BwWar, action: IWarActionUnitUseCoSkill): Promise<ClientErrorCode> {
        const unitMap       = war.getUnitMap();
        const revisedPath   = action.path as MovePath;
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.launchUnitId;
        const skillType     = action.skillType;
        if (skillType == null) {
            return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_00;
        }

        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

            const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
            const player        = focusUnit.getPlayer();
            const currentEnergy = player.getCoCurrentEnergy();

            if (revisedPath.isBlocked) {
                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), revisedPath.isBlocked);
                focusUnit.updateView();

            } else {
                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                player.setCoUsingSkillType(skillType);

                if (skillType === Types.CoSkillType.Power) {
                    const powerEnergy = player.getCoPowerEnergy();
                    if (powerEnergy == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_01;
                    }
                    player.setCoCurrentEnergy(currentEnergy - powerEnergy);

                } else if (skillType === Types.CoSkillType.SuperPower) {
                    const superPowerEnergy = player.getCoSuperPowerEnergy();
                    if (superPowerEnergy == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_02;
                    }

                    player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

                } else {
                    return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_03;
                }

                const skillDataList = extraData.skillDataList;
                const skillIdList   = player.getCoCurrentSkills() || [];
                for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                    const dataForUseCoSkill = skillDataList.find(v => v.skillIndex === skillIndex);
                    if (dataForUseCoSkill == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_04;
                    }

                    BwCoSkillHelper.exeInstantSkill(war, player, pathNodes[pathNodes.length - 1], skillIdList[skillIndex], dataForUseCoSkill);
                }

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), revisedPath.isBlocked);
                focusUnit.updateView();

                const gridVisionEffect  = war.getGridVisionEffect();
                const playerIndex       = focusUnit.getPlayerIndex();
                unitMap.forEachUnitOnMap(unit => {
                    unit.updateView();
                    if (unit.getPlayerIndex() === playerIndex) {
                        gridVisionEffect.showEffectSkillActivation(unit.getGridIndex());
                    }
                });

                const configVersion = war.getConfigVersion();
                const mapSize       = unitMap.getMapSize();
                for (let i = 0; i < skillIdList.length; ++i) {
                    const skillCfg          = Utility.ConfigManager.getCoSkillCfg(configVersion, skillIdList[i]);
                    const indiscriminateCfg = skillCfg ? skillCfg.indiscriminateAreaDamage : null;
                    if (indiscriminateCfg) {
                        for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(
                            skillDataList.find(v => v.skillIndex === i).indiscriminateAreaDamageCenter as GridIndex,
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
            const focusUnit = unitMap.getUnit(pathNodes[0], launchUnitId);
            if (focusUnit == null) {
                return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_05;
            }

            const teamIndexInTurn = focusUnit.getTeamIndex();
            if (teamIndexInTurn == null) {
                return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_06;
            }

            const player = focusUnit.getPlayer();
            if (player == null) {
                return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_07;
            }

            const currentEnergy = player.getCoCurrentEnergy();
            if (currentEnergy == null) {
                return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_08;
            }

            if (revisedPath.isBlocked) {
                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), revisedPath.isBlocked);
                focusUnit.updateView();

            } else {
                BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
                unitMap.setUnitOnMap(focusUnit);
                focusUnit.setActionState(UnitActionState.Acted);

                player.setCoUsingSkillType(skillType);

                if (skillType === Types.CoSkillType.Power) {
                    const powerEnergy = player.getCoPowerEnergy();
                    if (powerEnergy == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_09;
                    }
                    player.setCoCurrentEnergy(currentEnergy - powerEnergy);

                } else if (skillType === Types.CoSkillType.SuperPower) {
                    const superPowerEnergy = player.getCoSuperPowerEnergy();
                    if (superPowerEnergy == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_10;
                    }

                    player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

                } else {
                    return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_11;
                }

                const skillDataList : IDataForUseCoSkill[] = [];
                const skillIdList   = player.getCoCurrentSkills() || [];
                for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                    const dataForUseCoSkill = BwCoSkillHelper.getDataForUseCoSkill(war, player, skillIndex);
                    if (dataForUseCoSkill == null) {
                        return ClientErrorCode.BwWarActionExecutor_ExeUnitUseCoSkillNormal_12;
                    }

                    BwCoSkillHelper.exeInstantSkill(war, player, pathNodes[pathNodes.length - 1], skillIdList[skillIndex], dataForUseCoSkill);
                    skillDataList.push(dataForUseCoSkill);
                }

                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), revisedPath.isBlocked);
                focusUnit.updateView();

                const gridVisionEffect  = war.getGridVisionEffect();
                const playerIndex       = focusUnit.getPlayerIndex();
                unitMap.forEachUnitOnMap(unit => {
                    unit.updateView();
                    if (unit.getPlayerIndex() === playerIndex) {
                        gridVisionEffect.showEffectSkillActivation(unit.getGridIndex());
                    }
                });

                const configVersion = war.getConfigVersion();
                const mapSize       = unitMap.getMapSize();
                for (let i = 0; i < skillIdList.length; ++i) {
                    const skillCfg          = Utility.ConfigManager.getCoSkillCfg(configVersion, skillIdList[i]);
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

        war.updateTilesAndUnitsOnVisibilityChanged();
        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnitWait(war: BwWar, action: IWarActionUnitWait, isFast): Promise<ClientErrorCode> {
        return isFast
            ? await exeUnitWaitFast(war, action)
            : await exeUnitWaitNormal(war, action);
    }
    async function exeUnitWaitFast(war: BwWar, action: IWarActionUnitWait): Promise<ClientErrorCode> {
        // TODO
        return ClientErrorCode.NoError;
    }
    async function exeUnitWaitNormal(war: BwWar, action: IWarActionUnitWait): Promise<ClientErrorCode> {
        const extraData = action.extraData;
        if (extraData) {
            BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);
        }

        const unitMap       = war.getUnitMap();
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption, });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
        focusUnit.updateView();
        war.updateTilesAndUnitsOnVisibilityChanged();

        return ClientErrorCode.NoError;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function exeUnknownAction(): Promise<ClientErrorCode> {
        return ClientErrorCode.BwWarActionExecutor_ExeUnknownAction_00;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function handlePrimaryWeaponAmmoForUnitAttackTile(attackerUnit: BaseWar.BwUnit, targetTile: BaseWar.BwTile): ClientErrorCode {
        const targetArmorType = targetTile.getArmorType();
        if (targetArmorType == null) {
            return ClientErrorCode.BwWarActionExecutor_HandlePrimaryWeaponForUnitAttackTile_00;
        }

        const attackerAmmo = attackerUnit.getPrimaryWeaponCurrentAmmo();
        if ((attackerAmmo != null)                                                              &&
            (attackerAmmo > 0)                                                                  &&
            (attackerUnit.getCfgBaseDamage(targetArmorType, Types.WeaponType.Primary) != null)
        ) {
            attackerUnit.setPrimaryWeaponCurrentAmmo(attackerAmmo - 1);
        }

        return ClientErrorCode.NoError;
    }
    function handleHpForTile(tile: BaseWar.BwTile, newHp: number): ClientErrorCode {
        tile.setCurrentHp(newHp);

        return ClientErrorCode.NoError;
    }
    function handleDestructionForTile(war: BaseWar.BwWar, tile: BaseWar.BwTile): ResultForHandleDestructionForTile {
        const hp = tile.getCurrentHp();
        if (hp == null) {
            return { errorCode: ClientErrorCode.BwWarActionExecutor_HandleDestructionForTile_00 };
        }

        const gridIndex = tile.getGridIndex();
        if (gridIndex == null) {
            return { errorCode: ClientErrorCode.BwWarActionExecutor_HandleDestructionForTile_01 };
        }

        if (hp > 0) {
            return {
                errorCode       : ClientErrorCode.NoError,
                damagedTileSet  : new Set([tile]),
                destroyedTileSet: new Set(),
            };
        }

        const destroyedTileSet = new Set([tile]);
        if (tile.getType() === TileType.Meteor) {
            const tileMap           = war.getTileMap();
            const adjacentPlasmas   = BwHelpers.getAdjacentPlasmas(tileMap, gridIndex);
            if (adjacentPlasmas == null) {
                return { errorCode: ClientErrorCode.BwWarActionExecutor_HandleDestructionForTile_02 };
            }

            for (const g of adjacentPlasmas) {
                const plasmaTile = tileMap.getTile(g);
                if (plasmaTile == null) {
                    return { errorCode: ClientErrorCode.BwWarActionExecutor_HandleDestructionForTile_03 };
                }

                plasmaTile.destroyTileObject();
                destroyedTileSet.add(plasmaTile);
            }
        }

        tile.destroyTileObject();

        return {
            errorCode       : ClientErrorCode.NoError,
            damagedTileSet  : new Set(),
            destroyedTileSet,
        };
    }
    function handlePrimaryWeaponAmmoForUnitAttackUnit(attackerUnit: BaseWar.BwUnit, targetUnit: BaseWar.BwUnit): ClientErrorCode {
        const targetArmorType = targetUnit.getArmorType();
        if (targetArmorType == null) {
            return ClientErrorCode.BwWarActionExecutor_HandlePrimaryWeaponForUnitAttackUnit_00;
        }

        const attackerAmmo = attackerUnit.getPrimaryWeaponCurrentAmmo();
        if ((attackerAmmo != null)                                                              &&
            (attackerAmmo > 0)                                                                  &&
            (attackerUnit.getCfgBaseDamage(targetArmorType, Types.WeaponType.Primary) != null)
        ) {
            attackerUnit.setPrimaryWeaponCurrentAmmo(attackerAmmo - 1);
        }

        return ClientErrorCode.NoError;
    }
    function handleHpForUnit(unit: BaseWar.BwUnit, unitNewHp: number): ClientErrorCode {
        unit.setCurrentHp(unitNewHp);

        return ClientErrorCode.NoError;
    }
    function handlePromotionForUnitAttackUnit({ attackerPlayer, attackerUnit, targetLostNormalizedHp, attackerCoGridIndexListOnMap, isTargetDestroyed}: {
        attackerPlayer              : BaseWar.BwPlayer,
        attackerUnit                : BaseWar.BwUnit,
        targetLostNormalizedHp      : number,
        attackerCoGridIndexListOnMap: GridIndex[],
        isTargetDestroyed           : boolean,
    }): ClientErrorCode {
        const configVersion = attackerUnit.getConfigVersion();
        if (configVersion == null) {
            return ClientErrorCode.BwWarActionExecutor_HandlePromotionForUnitAttackUnit_00;
        }

        const attackerUnitType = attackerUnit.getUnitType();
        if (attackerUnitType == null) {
            return ClientErrorCode.BwWarActionExecutor_HandlePromotionForUnitAttackUnit_01;
        }

        const attackerGridIndex = attackerUnit.getGridIndex();
        if (attackerGridIndex == null) {
            return ClientErrorCode.BwWarActionExecutor_HandlePromotionForUnitAttackUnit_02;
        }

        if (isTargetDestroyed) {
            attackerUnit.addPromotion();
        }

        if (attackerPlayer.getCoId()) {
            const attackerCoZoneRadius = attackerPlayer.getCoZoneRadius();
            if (attackerCoZoneRadius == null) {
                return ClientErrorCode.BwWarActionExecutor_HandlePromotionForUnitAttackUnit_03;
            }

            const hasAttackerLoadedCo = attackerUnit.getHasLoadedCo();
            if (hasAttackerLoadedCo == null) {
                return ClientErrorCode.BwWarActionExecutor_HandlePromotionForUnitAttackUnit_04;
            }

            for (const skillId of attackerPlayer.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.promotionBonusByAttack;
                if ((cfg)                                                                                                                                                   &&
                    (targetLostNormalizedHp >= cfg[2])                                                                                                                      &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))                                                                      &&
                    ((hasAttackerLoadedCo) || (BwHelpers.checkIsGridIndexInsideCoSkillArea(attackerGridIndex, cfg[0], attackerCoGridIndexListOnMap, attackerCoZoneRadius)))
                ) {
                    attackerUnit.addPromotion();
                }
            }
        }

        return ClientErrorCode.NoError;
    }
    function handleEnergyForUnitAttackUnit({ war, attackerPlayer, targetLostNormalizedHp, isAttackerInAttackerCoZone }: {
        war                         : BaseWar.BwWar,
        attackerPlayer              : BaseWar.BwPlayer,
        targetLostNormalizedHp      : number,
        isAttackerInAttackerCoZone  : boolean,
    }): ClientErrorCode {
        const attackerPlayerIndex = attackerPlayer.getPlayerIndex();
        if (attackerPlayerIndex == null) {
            return ClientErrorCode.BwWarActionExecutor_HandleEnergyForUnitAttackUnit_00;
        }

        const multiplierForAttacker = war.getCommonSettingManager().getSettingsEnergyGrowthMultiplier(attackerPlayerIndex);
        if (multiplierForAttacker == null) {
            return ClientErrorCode.BwWarActionExecutor_HandleEnergyForUnitAttackUnit_01;
        }

        const attackerEnergy = attackerPlayer.getCoCurrentEnergy();
        if ((targetLostNormalizedHp > 0)                    &&
            (attackerEnergy != null)                        &&
            (!attackerPlayer.checkCoIsUsingActiveSkill())   &&
            (isAttackerInAttackerCoZone)
        ) {
            attackerPlayer.setCoCurrentEnergy(Math.min(
                attackerPlayer.getCoMaxEnergy(),
                attackerEnergy + Math.floor(targetLostNormalizedHp * multiplierForAttacker / 100)
            ));
        }

        return ClientErrorCode.NoError;
    }
    function handleDestructionForUnit({ war, unit }: {
        war             : BaseWar.BwWar,
        unit            : BaseWar.BwUnit,
    }): ClientErrorCode {
        const targetGridIndex = unit.getGridIndex();
        if (targetGridIndex == null) {
            return ClientErrorCode.BwWarActionExecutor_HandleDestructionForUnit_00;
        }

        if (unit.getCurrentHp() <= 0) {
            DestructionHelpers.destroyUnitOnMap(war, targetGridIndex, false);
        }

        return ClientErrorCode.NoError;
    }
}
