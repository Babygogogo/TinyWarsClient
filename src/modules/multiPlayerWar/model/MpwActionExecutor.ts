
namespace TinyWars.MultiPlayerWar.MpwActionExecutor {
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import Helpers              = Utility.Helpers;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import ConfigManager        = Utility.ConfigManager;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import WarActionCodes       = Utility.WarActionCodes;
    import BwUnit               = BaseWar.BwUnit;
    import BwCoSkillHelper      = BaseWar.BwCoSkillHelper;
    import BwHelpers            = BaseWar.BwHelpers;
    import CommonAlertPanel     = Common.CommonAlertPanel;
    import GridIndex            = Types.GridIndex;
    import UnitActionState      = Types.UnitActionState;
    import MovePath             = Types.MovePath;
    import TileType             = Types.TileType;
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;
    import CommonConstants      = ConfigManager.COMMON_CONSTANTS;

    const _EXECUTORS = new Map<WarActionCodes, (war: MpwWar, data: IWarActionContainer) => Promise<void>>([
        [WarActionCodes.WarActionSystemBeginTurn,           _exeSystemBeginTurn],
        [WarActionCodes.WarActionSystemCallWarEvent,        _exeSystemCallWarEvent],
        [WarActionCodes.WarActionSystemDestroyPlayerForce,  _exeSystemDestroyPlayerForce],
        [WarActionCodes.WarActionSystemEndWar,              _exeSystemEndWar],
        [WarActionCodes.WarActionPlayerDeleteUnit,          _exePlayerDeleteUnit],
        [WarActionCodes.WarActionPlayerEndTurn,             _exePlayerEndTurn],
        [WarActionCodes.WarActionPlayerProduceUnit,         _exePlayerProduceUnit],
        [WarActionCodes.WarActionPlayerSurrender,           _exePlayerSurrender],
        [WarActionCodes.WarActionPlayerVoteForDraw,         _exePlayerVoteForDraw],
        [WarActionCodes.WarActionUnitAttackUnit,            _exeUnitAttackUnit],
        [WarActionCodes.WarActionUnitAttackTile,            _exeUnitAttackTile],
        [WarActionCodes.WarActionUnitBeLoaded,              _exeUnitBeLoaded],
        [WarActionCodes.WarActionUnitBuildTile,             _exeUnitBuildTile],
        [WarActionCodes.WarActionUnitCaptureTile,           _exeUnitCaptureTile],
        [WarActionCodes.WarActionUnitDive,                  _exeUnitDive],
        [WarActionCodes.WarActionUnitDropUnit,              _exeUnitDropUnit],
        [WarActionCodes.WarActionUnitJoinUnit,              _exeUnitJoinUnit],
        [WarActionCodes.WarActionUnitLaunchFlare,           _exeUnitLaunchFlare],
        [WarActionCodes.WarActionUnitLaunchSilo,            _exeUnitLaunchSilo],
        [WarActionCodes.WarActionUnitLoadCo,                _exeUnitLoadCo],
        [WarActionCodes.WarActionUnitProduceUnit,           _exeUnitProduceUnit],
        [WarActionCodes.WarActionUnitSupplyUnit,            _exeUnitSupplyUnit],
        [WarActionCodes.WarActionUnitSurface,               _exeUnitSurface],
        [WarActionCodes.WarActionUnitUseCoSkill,            _exeUnitUseCoSkill],
        [WarActionCodes.WarActionUnitWait,                  _exeUnitWait],
    ]);

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function checkAndRunFirstCachedAction(war: MpwWar, actionList: IWarActionContainer[]): Promise<void> {
        if ((!war.getIsRunning()) || (war.getIsEnded()) || (war.getIsExecutingAction())) {
            return;
        }

        const container = actionList.shift();
        if (container == null) {
            return;
        }

        war.setIsExecutingAction(true);
        war.getExecutedActionManager().addExecutedAction(container);
        await _EXECUTORS.get(Helpers.getWarActionCode(container))(war, container);
        war.setIsExecutingAction(false);

        const playerManager     = war.getPlayerManager();
        const remainingVotes    = war.getDrawVoteManager().getRemainingVotes();
        const selfPlayer        = playerManager.getPlayerByUserId(User.UserModel.getSelfUserId());
        const callbackForGoBack = () => {
            if (war instanceof MultiRankWar.MrwWar) {
                Utility.FlowManager.gotoMrrMyWarListPanel();
            } else {
                Utility.FlowManager.gotoMcrMyWarListPanel();
            }
        };
        if (war.getIsEnded()) {
            if (remainingVotes === 0) {
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0030),
                    callback: callbackForGoBack,
                });
            } else {
                if (selfPlayer == null) {
                    CommonAlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0035),
                        callback: callbackForGoBack,
                    });
                } else {
                    CommonAlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : selfPlayer.getAliveState() === Types.PlayerAliveState.Alive ? Lang.getText(Lang.Type.A0022) : Lang.getText(Lang.Type.A0023),
                        callback: callbackForGoBack,
                    });
                }
            }
        } else {
            if (war.getIsRunning()) {
                if (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().size) {
                    war.setIsEnded(true);
                    CommonAlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0035),
                        content : selfPlayer ? Lang.getText(Lang.Type.A0023) : Lang.getText(Lang.Type.A0152),
                        callback: callbackForGoBack,
                    });
                } else {
                    checkAndRunFirstCachedAction(war, actionList);
                }
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The 'true' executors for war actions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _exeSystemBeginTurn(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(Lang.getFormattedText(Lang.Type.F0022, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn()));

        await war.getTurnManager().endPhaseWaitBeginTurn(data.WarActionSystemBeginTurn);

        actionPlanner.setStateIdle();
    }

    async function _exeSystemCallWarEvent(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0451)}`);

        const action            = data.WarActionSystemCallWarEvent;
        const extraDataList     = action.extraDataList;
        const warEventId        = action.warEventId;
        const warEventManager   = war.getWarEventManager();
        const unitMap           = war.getUnitMap();
        const configVersion     = war.getConfigVersion();
        warEventManager.updateWarEventCalledCountOnCall(warEventId);

        const actionIdArray = warEventManager.getWarEvent(warEventId).actionIdArray;
        for (let index = 0; index < actionIdArray.length; ++index) {
            const warEventAction = warEventManager.getWarEventAction(actionIdArray[index]);
            if (warEventAction.WarEventActionAddUnit) {
                for (const unitData of extraDataList.find(v => v.indexForActionIdList === index).ExtraDataForWeaAddUnit.unitList || []) {
                    const unit = new BaseWar.BwUnit();
                    unit.init(unitData, configVersion);
                    unit.startRunning(war);
                    unit.startRunningView();
                    unitMap.setUnitOnMap(unit);
                    unitMap.setNextUnitId(Math.max(unitData.unitId + 1, unitMap.getNextUnitId()));
                }

            } else {
                // TODO add executors for other actions.
            }
        }

        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeSystemDestroyPlayerForce(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${await war.getPlayerInTurn().getNickname()}${Lang.getText(Lang.Type.B0450)}`);

        DestructionHelpers.destroyPlayerForce(war, data.WarActionSystemDestroyPlayerForce.targetPlayerIndex, true);

        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeSystemEndWar(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0087)}`);

        war.setIsEnded(true);

        actionPlanner.setStateIdle();
    }

    async function _exePlayerDeleteUnit(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action    = data.WarActionPlayerDeleteUnit;
        const gridIndex = action.gridIndex as GridIndex;
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
            DestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
        }

        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerEndTurn(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(Lang.getFormattedText(Lang.Type.F0030, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn()));

        const action = data.WarActionPlayerEndTurn;
        await war.getTurnManager().endPhaseMain(action);

        actionPlanner.setStateIdle();
    }

    async function _exePlayerProduceUnit(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionPlayerProduceUnit;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

        const unitMap       = war.getUnitMap();
        const unitId        = unitMap.getNextUnitId();
        const playerInTurn  = war.getPlayerInTurn();
        const unitData      = extraData.unitData;
        if (unitData == null) {
            Logger.error(`McwModel._exePlayerProduceUnit() empty unitData.`);
            return undefined;
        }

        const unit = new BaseWar.BwUnit();
        unit.init(unitData, war.getConfigVersion());
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setUnitOnMap(unit);
        unitMap.setNextUnitId(unitId + 1);
        playerInTurn.setFund(playerInTurn.getFund() - extraData.cost);

        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerSurrender(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionPlayerSurrender;
        const player = war.getPlayerInTurn();
        player.setAliveState(Types.PlayerAliveState.Dying);
        FloatText.show(Lang.getFormattedText(action.isBoot ? Lang.Type.F0028: Lang.Type.F0008, await player.getNickname()));

        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerVoteForDraw(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.WarActionPlayerVoteForDraw;
        const playerInTurn  = war.getPlayerInTurn();
        const nickname      = await playerInTurn.getNickname();
        playerInTurn.setHasVotedForDraw(true);

        const drawVoteManager = war.getDrawVoteManager();
        if (!action.isAgree) {
            FloatText.show(Lang.getFormattedText(Lang.Type.F0017, nickname));
            drawVoteManager.setRemainingVotes(undefined);
        } else {
            if (drawVoteManager.getRemainingVotes()) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0018, nickname));
            } else {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0019, nickname));
            }
            drawVoteManager.setRemainingVotes((drawVoteManager.getRemainingVotes() || war.getPlayerManager().getAlivePlayersCount(false)) - 1);
        }

        actionPlanner.setStateIdle();
    }

    async function _exeUnitAttackUnit(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitAttackUnit;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const attackerUnit  = unitMap.getUnit(pathNodes[0], launchUnitId);

        if (path.isBlocked) {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);

            await attackerUnit.moveViewAlongPath(pathNodes, attackerUnit.getIsDiving(), true);
            attackerUnit.updateView();
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);

            const attackerGridIndex = pathNodes[pathNodes.length - 1];
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const targetUnit        = unitMap.getUnitOnMap(targetGridIndex);
            const {
                attackDamage,
                counterDamage,
                attackerUnitAfterAction,
                targetUnitAfterAction,
            } = extraData;

            // Handle animation and destruction.
            await attackerUnit.moveViewAlongPath(pathNodes, attackerUnit.getIsDiving(), false, targetGridIndex);
            attackerUnit.getPlayer().setCoCurrentEnergy(extraData.attackerCoEnergyAfterAction);
            targetUnit.getPlayer().setCoCurrentEnergy(extraData.targetCoEnergyAfterAction);

            const gridVisionEffect = war.getGridVisionEffect();
            if (attackerUnitAfterAction) {
                attackerUnit.init(attackerUnitAfterAction, attackerUnit.getConfigVersion());
                attackerUnit.startRunning(war);
                attackerUnit.startRunningView();
                attackerUnit.updateView();
                if (counterDamage != null) {
                    gridVisionEffect.showEffectDamage(attackerGridIndex);
                }
            } else {
                DestructionHelpers.destroyUnitOnMap(war, attackerGridIndex, true);
            }

            if (targetUnitAfterAction) {
                targetUnit.init(targetUnitAfterAction, targetUnit.getConfigVersion());
                targetUnit.startRunning(war);
                targetUnit.startRunningView();
                targetUnit.updateView();
                gridVisionEffect.showEffectDamage(targetGridIndex);
            } else {
                DestructionHelpers.destroyUnitOnMap(war, targetGridIndex, true);
            }

            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitAttackTile(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitAttackTile;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const attackerUnit  = unitMap.getUnit(pathNodes[0], launchUnitId);

        if (path.isBlocked) {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);

            await attackerUnit.moveViewAlongPath(pathNodes, attackerUnit.getIsDiving(), true);
            attackerUnit.updateView();
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);

            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tileMap           = war.getTileMap();
            const targetTile        = tileMap.getTile(targetGridIndex);
            if (attackerUnit.getCfgBaseDamage(targetTile.getArmorType(), Types.WeaponType.Primary) != null) {
                const attackerAmmo = attackerUnit.getPrimaryWeaponCurrentAmmo();
                if ((attackerAmmo != null) && (attackerAmmo > 0)) {
                    attackerUnit.setPrimaryWeaponCurrentAmmo(attackerAmmo - 1);
                }
            }

            const targetNewHp = Math.max(0, targetTile.getCurrentHp() - extraData.attackDamage);
            targetTile.setCurrentHp(targetNewHp);

            const gridVisionEffect = war.getGridVisionEffect();
            await attackerUnit.moveViewAlongPath(pathNodes, attackerUnit.getIsDiving(), false, targetGridIndex);
            attackerUnit.updateView();
            if (targetNewHp > 0) {
                targetTile.flushDataToView();
                gridVisionEffect.showEffectDamage(targetGridIndex);
            } else {
                if (targetTile.getType() === TileType.Meteor) {
                    for (const gridIndex of BwHelpers.getAdjacentPlasmas(tileMap, targetGridIndex)) {
                        const plasma = tileMap.getTile(gridIndex);
                        plasma.destroyTileObject();
                        plasma.flushDataToView();
                        gridVisionEffect.showEffectExplosion(gridIndex);
                    }
                }
                targetTile.destroyTileObject();
                targetTile.flushDataToView();
                gridVisionEffect.showEffectExplosion(targetGridIndex);
            }

            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitBeLoaded(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitBeLoaded;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        } else {
            const loaderUnit = unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]);
            unitMap.setUnitLoaded(focusUnit);
            focusUnit.setLoaderUnitId(loaderUnit.getUnitId());

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();
            focusUnit.setViewVisible(false);
            loaderUnit.updateView();
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitBuildTile(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitBuildTile;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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
            if (buildPoint > 0) {
                focusUnit.setIsBuildingTile(true);
                tile.setCurrentBuildPoint(buildPoint);
            } else {
                const targetTileCfg = focusUnit.getBuildTargetTileCfg(tile.getBaseType(), tile.getObjectType());
                if (targetTileCfg == null) {
                    Logger.error(`McwModel._exeUnitBuildTile() empty targetTileCfg.`);
                    return undefined;
                }

                focusUnit.setIsBuildingTile(false);
                focusUnit.setCurrentBuildMaterial(focusUnit.getCurrentBuildMaterial() - 1);
                tile.resetByTypeAndPlayerIndex(
                    { baseType: targetTileCfg.dstBaseType, objectType: targetTileCfg.dstObjectType, playerIndex: focusUnit.getPlayerIndex() },
                );
            }
        }

        await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
        focusUnit.updateView();
        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitCaptureTile(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitCaptureTile;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            const destination       = pathNodes[pathNodes.length - 1];
            const tile              = war.getTileMap().getTile(destination);
            const restCapturePoint  = tile.getCurrentCapturePoint() - focusUnit.getCaptureAmount();
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
                    playerIndex : focusUnit.getPlayerIndex()
                });
            }

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false);
            focusUnit.updateView();
            tile.flushDataToView();
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitDive(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitDive;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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

        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitDropUnit(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitDropUnit;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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
        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitJoinUnit(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitJoinUnit;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

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

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();
            unitMap.getView().removeUnit(targetUnit.getView());
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitLaunchFlare(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitLaunchFlare;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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
        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitLaunchSilo(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitLaunchSilo;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tile              = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
            tile.resetByTypeAndPlayerIndex(
                { baseType: tile.getBaseType(), objectType: Types.TileObjectType.EmptySilo, playerIndex: CommonConstants.WarNeutralPlayerIndex },
            );

            const targetGrids   = GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, Utility.ConfigManager.SILO_RADIUS, unitMap.getMapSize());
            const targetUnits   : BwUnit[] = [];
            for (const grid of targetGrids) {
                const unit = unitMap.getUnitOnMap(grid);
                if (unit) {
                    targetUnits.push(unit);
                    unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - Utility.ConfigManager.SILO_DAMAGE));
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
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitLoadCo(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitLoadCo;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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
            const playerIndex               = focusUnit.getPlayerIndex();
            const initialEnergyPercentage   = war.getCommonSettingManager().getSettingsInitialEnergyPercentage(playerIndex);
            if (initialEnergyPercentage == null) {
                Logger.error(`McwModel._exeUnitLoadCo() empty initialEnergyPercentage.`);
                return undefined;
            }

            focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());
            focusUnit.setHasLoadedCo(true);

            const player = war.getPlayer(playerIndex);
            player.setFund(player.getFund() - focusUnit.getLoadCoCost()!);
            if (player.getCoCurrentEnergy() == null) {
                player.setCoCurrentEnergy(Math.floor(player.getCoMaxEnergy() * initialEnergyPercentage / 100));
            }
            player.setCoUsingSkillType(Types.CoSkillType.Passive);
        }

        await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
        focusUnit.updateView();
        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitProduceUnit(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitProduceUnit;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

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
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitSupplyUnit(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitSupplyUnit;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

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

            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitSurface(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitSurface;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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

        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitUseCoSkill(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitUseCoSkill;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

        const skillType     = action.skillType;
        const unitMap       = war.getUnitMap();
        const revisedPath   = action.path as MovePath;
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        const player        = focusUnit.getPlayer();
        const currentEnergy = player.getCoCurrentEnergy();

        if (revisedPath.isBlocked) {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), revisedPath.isBlocked);
            focusUnit.updateView();
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            player.setCoUsingSkillType(skillType);

            if (skillType === Types.CoSkillType.Power) {
                const powerEnergy = player.getCoPowerEnergy();
                if (powerEnergy == null) {
                    Logger.error(`McwModel._exeUnitUseCoSkill() empty powerEnergy.`);
                    return undefined;
                }
                player.setCoCurrentEnergy(currentEnergy - powerEnergy);

            } else if (skillType === Types.CoSkillType.SuperPower) {
                const superPowerEnergy = player.getCoSuperPowerEnergy();
                if (superPowerEnergy == null) {
                    Logger.error(`McwModel._exeUnitUseCoSkill() empty superPowerEnergy.`);
                    return undefined;
                }

                player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

            } else {
                Logger.error(`McwModel._exeUnitUseCoSkill() invalid skillType: ${skillType}`);
                return undefined;
            }

            const skillDataList = extraData.skillDataList;
            const skillIdList   = player.getCoCurrentSkills() || [];
            for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                const dataForUseCoSkill = skillDataList.find(v => v.skillIndex === skillIndex);
                if (dataForUseCoSkill == null) {
                    Logger.error(`McwModel._exeUnitUseCoSkill() empty dataForUseCoSkill.`);
                    return undefined;
                }

                BwCoSkillHelper.exeInstantSkill(war, player, pathNodes[pathNodes.length - 1], skillIdList[skillIndex], dataForUseCoSkill);
            }

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), revisedPath.isBlocked);
            focusUnit.updateView();
            MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);

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

            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitWait(war: MpwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionUnitWait;
        const extraData     = action.extraData
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

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
        MpwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }
}
