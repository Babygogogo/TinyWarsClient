
namespace TinyWars.ReplayWar.RwActionExecutor {
    import Logger               = Utility.Logger;
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import ConfigManager        = Utility.ConfigManager;
    import DamageCalculator     = Utility.DamageCalculator;
    import WarActionCodes       = Utility.WarActionCodes;
    import BwHelpers            = BaseWar.BwHelpers;
    import BwUnit               = BaseWar.BwUnit;
    import BwCoSkillHelper      = BaseWar.BwCoSkillHelper;
    import GridIndex            = Types.GridIndex;
    import UnitActionState      = Types.UnitActionState;
    import MovePath             = Types.MovePath;
    import TileType             = Types.TileType;
    import IDataForUseCoSkill   = ProtoTypes.Structure.IDataForUseCoSkill;
    import IWarActionContainer  = ProtoTypes.WarAction.IWarActionContainer;
    import CommonConstants      = Utility.CommonConstants;

    const _EXECUTORS = new Map<WarActionCodes, (war: RwWar, data: IWarActionContainer) => Promise<void>>([
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
    const _FAST_EXECUTORS = new Map<WarActionCodes, (war: RwWar, data: IWarActionContainer) => Promise<void>>([
        [WarActionCodes.WarActionSystemBeginTurn,           _fastExeSystemBeginTurn],
        [WarActionCodes.WarActionSystemCallWarEvent,        _fastExeSystemCallWarEvent],
        [WarActionCodes.WarActionSystemDestroyPlayerForce,  _fastExeSystemDestroyPlayerForce],
        [WarActionCodes.WarActionSystemEndWar,              _fastExeSystemEndWar],
        [WarActionCodes.WarActionPlayerDeleteUnit,          _fastExePlayerDeleteUnit],
        [WarActionCodes.WarActionPlayerEndTurn,             _fastExePlayerEndTurn],
        [WarActionCodes.WarActionPlayerProduceUnit,         _fastExePlayerProduceUnit],
        [WarActionCodes.WarActionPlayerSurrender,           _fastExePlayerSurrender],
        [WarActionCodes.WarActionPlayerVoteForDraw,         _fastExePlayerVoteForDraw],
        [WarActionCodes.WarActionUnitAttackUnit,            _fastExeUnitAttackUnit],
        [WarActionCodes.WarActionUnitAttackTile,            _fastExeUnitAttackTile],
        [WarActionCodes.WarActionUnitBeLoaded,              _fastExeUnitBeLoaded],
        [WarActionCodes.WarActionUnitBuildTile,             _fastExeUnitBuildTile],
        [WarActionCodes.WarActionUnitCaptureTile,           _fastExeUnitCaptureTile],
        [WarActionCodes.WarActionUnitDive,                  _fastExeUnitDive],
        [WarActionCodes.WarActionUnitDropUnit,              _fastExeUnitDropUnit],
        [WarActionCodes.WarActionUnitJoinUnit,              _fastExeUnitJoinUnit],
        [WarActionCodes.WarActionUnitLaunchFlare,           _fastExeUnitLaunchFlare],
        [WarActionCodes.WarActionUnitLaunchSilo,            _fastExeUnitLaunchSilo],
        [WarActionCodes.WarActionUnitLoadCo,                _fastExeUnitLoadCo],
        [WarActionCodes.WarActionUnitProduceUnit,           _fastExeUnitProduceUnit],
        [WarActionCodes.WarActionUnitSupplyUnit,            _fastExeUnitSupplyUnit],
        [WarActionCodes.WarActionUnitSurface,               _fastExeUnitSurface],
        [WarActionCodes.WarActionUnitUseCoSkill,            _fastExeUnitUseCoSkill],
        [WarActionCodes.WarActionUnitWait,                  _fastExeUnitWait],
    ]);

    export async function executeNextAction(war: RwWar, isFastExecute: boolean): Promise<void> {
        const action = war.getNextAction();
        if ((action == null)            ||
            (!war.getIsRunning())       ||
            (war.checkIsInEnd())        ||
            (war.getIsExecutingAction())
        ) {
            FloatText.show(Lang.getText(Lang.Type.B0110));
        } else {
            await _executeAction(war, action, isFastExecute);
        }
    }

    async function _executeAction(war: RwWar, container: IWarActionContainer, isFastExecute: boolean): Promise<void> {
        war.setIsExecutingAction(true);
        war.setNextActionId(war.getNextActionId() + 1);
        if (isFastExecute) {
            await _FAST_EXECUTORS.get(Helpers.getWarActionCode(container))(war, container);
        } else {
            await _EXECUTORS.get(Helpers.getWarActionCode(container))(war, container);
        }
        war.setIsExecutingAction(false);

        const isInEnd = war.checkIsInEnd();
        if (isInEnd) {
            war.setIsAutoReplay(false);
        }

        const actionId          = war.getNextActionId();
        const turnManager       = war.getTurnManager();
        const prevCheckPointId  = war.getCheckPointId(actionId - 1);
        const prevTurnData      = war.getCheckPointData(prevCheckPointId).warData.turnManager;
        const isNewCheckPoint   = (isInEnd) || (turnManager.getTurnIndex() !== prevTurnData.turnIndex) || (turnManager.getPlayerIndexInTurn() !== prevTurnData.playerIndex);
        const checkPointId      = isNewCheckPoint ? prevCheckPointId + 1 : prevCheckPointId;
        if (war.getCheckPointId(actionId) == null) {
            war.setCheckPointId(actionId, checkPointId);
        }
        if (war.getCheckPointData(checkPointId) == null) {
            war.setCheckPointData(checkPointId, war.serializeForCheckPoint());
        }

        if ((!isInEnd) && (war.getIsAutoReplay()) && (!war.getIsExecutingAction()) && (war.getIsRunning())) {
            egret.setTimeout(() => {
                if ((!war.checkIsInEnd()) && (war.getIsAutoReplay()) && (!war.getIsExecutingAction()) && (war.getIsRunning())) {
                    _executeAction(war, war.getNextAction(), isFastExecute);
                }
            }, undefined, 1000);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The 'true' executors for war actions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _exeSystemBeginTurn(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${await war.getPlayerInTurn().getNickname()} ${Lang.getText(Lang.Type.B0094)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        war.getTurnManager().endPhaseWaitBeginTurn(data.WarActionSystemBeginTurn);

        actionPlanner.setStateIdle();
    }

    async function _exeSystemCallWarEvent(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0451)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const warEventManager   = war.getWarEventManager();
        const warEventId        = data.WarActionSystemCallWarEvent.warEventId;
        warEventManager.updateWarEventCalledCountOnCall(warEventId)
        await warEventManager.callWarEvent(warEventId, false);

        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeSystemDestroyPlayerForce(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const playerIndex = data.WarActionSystemDestroyPlayerForce.targetPlayerIndex;
        FloatText.show(`${await war.getPlayer(playerIndex).getNickname()}${Lang.getText(Lang.Type.B0450)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        DestructionHelpers.destroyPlayerForce(war, playerIndex, true);

        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeSystemEndWar(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0087)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        // Nothing to do.

        actionPlanner.setStateIdle();
    }

    async function _exePlayerDeleteUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0081)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action    = data.WarActionPlayerDeleteUnit;
        const gridIndex = action.gridIndex as GridIndex;
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit == null) {
            Logger.error(`RwActionExecutor._exePlayerDeleteUnit() empty focusUnit.`);
            return undefined;
        }

        war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
        DestructionHelpers.destroyUnitOnMap(war, gridIndex, true);

        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerEndTurn(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0036)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        war.getTurnManager().endPhaseMain(data.WarActionPlayerEndTurn);

        actionPlanner.setStateIdle();
    }

    async function _exePlayerProduceUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionPlayerProduceUnit;
        const unitType      = action.unitType;
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0095)} ${Lang.getUnitName(unitType)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const gridIndex     = action.gridIndex as GridIndex;
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

        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerSurrender(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const player        = war.getPlayerInTurn();
        actionPlanner.setStateExecutingAction();
        FloatText.show(
            `${await player.getNickname()} ${Lang.getText(data.WarActionPlayerSurrender.isBoot ? Lang.Type.B0396: Lang.Type.B0055)} ` +
            `(${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`
        );

        player.setAliveState(Types.PlayerAliveState.Dying);

        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerVoteForDraw(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.WarActionPlayerVoteForDraw;
        actionPlanner.setStateExecutingAction();
        FloatText.show(
            `${await war.getPlayerInTurn().getNickname()} ${action.isAgree ? Lang.getText(Lang.Type.B0096) : Lang.getText(Lang.Type.B0085)}` +
            `(${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`
        );

        const playerInTurn = war.getPlayerInTurn();
        playerInTurn.setHasVotedForDraw(true);

        const drawVoteManager = war.getDrawVoteManager();
        if (!action.isAgree) {
            FloatText.show(Lang.getFormattedText(Lang.Type.F0017, await playerInTurn.getNickname()));
            drawVoteManager.setRemainingVotes(undefined);
        } else {
            const remainingVotes = drawVoteManager.getRemainingVotes();
            if (remainingVotes) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0018, await playerInTurn.getNickname()));
            } else {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0019, await playerInTurn.getNickname()));
            }
            drawVoteManager.setRemainingVotes((remainingVotes || war.getPlayerManager().getAlivePlayersCount(false)) - 1);
        }

        actionPlanner.setStateIdle();
    }

    async function _exeUnitAttackUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0097)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action        = data.WarActionUnitAttackUnit;
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
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            const attackerGridIndex             = pathNodes[pathNodes.length - 1];
            const targetGridIndex               = action.targetGridIndex as GridIndex;
            const [attackDamage, counterDamage] = DamageCalculator.getFinalBattleDamage(war, pathNodes, launchUnitId, targetGridIndex);
            const targetUnit                    = unitMap.getUnitOnMap(targetGridIndex);
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);

            // Handle ammo.
            const attackerAmmo = attackerUnit.getPrimaryWeaponCurrentAmmo();
            const targetAmmo = targetUnit.getPrimaryWeaponCurrentAmmo();
            if ((attackerAmmo != null)                                                                      &&
                (attackerAmmo > 0)                                                                          &&
                (attackerUnit.getCfgBaseDamage(targetUnit.getArmorType(), Types.WeaponType.Primary) != null)
            ) {
                attackerUnit.setPrimaryWeaponCurrentAmmo(attackerAmmo - 1);
            }
            if ((counterDamage != null)                                                                     &&
                (targetAmmo != null)                                                                        &&
                (targetAmmo > 0)                                                                            &&
                (targetUnit.getCfgBaseDamage(attackerUnit.getArmorType(), Types.WeaponType.Primary) != null)
            ) {
                targetUnit.setPrimaryWeaponCurrentAmmo(targetAmmo - 1);
            }

            // Handle hp.
            const attackerOldHp = attackerUnit.getCurrentHp();
            const attackerNewHp = Math.max(0, attackerOldHp - (counterDamage || 0));
            const targetOldHp   = targetUnit.getCurrentHp();
            const targetNewHp   = Math.max(0, targetOldHp - attackDamage);
            targetUnit.setCurrentHp(targetNewHp);
            attackerUnit.setCurrentHp(attackerNewHp);

            // Handle promotion.
            const configVersion                 = war.getConfigVersion();
            const attackerPlayer                = attackerUnit.getPlayer();
            const targetPlayer                  = targetUnit.getPlayer();
            const attackerPlayerIndex           = attackerUnit.getPlayerIndex();
            const targetPlayerIndex             = targetUnit.getPlayerIndex();
            const attackerLostNormalizedHp      = counterDamage == null ? undefined : BwHelpers.getNormalizedHp(attackerOldHp) - BwHelpers.getNormalizedHp(attackerNewHp);
            const targetLostNormalizedHp        = BwHelpers.getNormalizedHp(targetOldHp) - BwHelpers.getNormalizedHp(targetNewHp);
            const attackerUnitType              = attackerUnit.getUnitType();
            const targetUnitType                = targetUnit.getUnitType();
            const attackerCoGridIndexListOnMap  = unitMap.getCoGridIndexListOnMap(attackerPlayerIndex);
            const targetCoGridIndexListOnMap    = unitMap.getCoGridIndexListOnMap(targetPlayerIndex);
            const isAttackerDestroyed           = attackerNewHp <= 0;
            const isTargetDestroyed             = targetNewHp <= 0;
            if (isAttackerDestroyed) {
                targetUnit.addPromotion();
            }
            if (isTargetDestroyed) {
                attackerUnit.addPromotion();
            }
            if (attackerPlayer.getCoId()) {
                const attackerCoZoneRadius = attackerPlayer.getCoZoneRadius();
                if (attackerCoZoneRadius == null) {
                    Logger.error(`RwActionExecutor._exeUnitAttackUnit() empty attackerCoZoneRadius.`);
                    return undefined;
                }

                const hasAttackerLoadedCo = attackerUnit.getHasLoadedCo();
                if (hasAttackerLoadedCo == null) {
                    Logger.error(`RwActionExecutor._exeUnitAttackUnit() empty hasAttackerLoadedCo.`);
                    return undefined;
                }

                for (const skillId of attackerPlayer.getCoCurrentSkills() || []) {
                    const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).promotionBonusByAttack;
                    if ((cfg)                                                                                                                                                   &&
                        (targetLostNormalizedHp >= cfg[2])                                                                                                                      &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))                                                                      &&
                        ((hasAttackerLoadedCo) || (BwHelpers.checkIsGridIndexInsideCoSkillArea(attackerGridIndex, cfg[0], attackerCoGridIndexListOnMap, attackerCoZoneRadius)))
                    ) {
                        attackerUnit.addPromotion();
                    }
                }
            }
            if (targetPlayer.getCoId()) {
                const targetCoZoneRadius = targetPlayer.getCoZoneRadius();
                if (targetCoZoneRadius == null) {
                    Logger.error(`RwActionExecutor._exeUnitAttackUnit() empty targetCoZoneRadius.`);
                    return undefined;
                }

                for (const skillId of targetPlayer.getCoCurrentSkills() || []) {
                    const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).promotionBonusByAttack;
                    if ((cfg)                                                                                                                   &&
                        (attackerLostNormalizedHp != null)                                                                                      &&
                        (attackerLostNormalizedHp >= cfg[2])                                                                                    &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, targetUnitType, cfg[1]))                                        &&
                        (BwHelpers.checkIsGridIndexInsideCoSkillArea(targetGridIndex, cfg[0], targetCoGridIndexListOnMap, targetCoZoneRadius))
                    ) {
                        targetUnit.addPromotion();
                    }
                }
            }

            // Handle co energy.
            const attackerEnergy                = attackerPlayer.getCoCurrentEnergy();
            const targetEnergy                  = targetPlayer.getCoCurrentEnergy();
            const commonSettingManager          = war.getCommonSettingManager();
            const multiplierForAttacker         = commonSettingManager.getSettingsEnergyGrowthMultiplier(attackerPlayerIndex);
            const multiplierForTarget           = commonSettingManager.getSettingsEnergyGrowthMultiplier(targetPlayerIndex);
            const isAttackerInAttackerCoZone    = (attackerUnit.getHasLoadedCo()) || (attackerPlayer.checkIsInCoZone(attackerGridIndex, attackerCoGridIndexListOnMap));
            const isAttackerInTargetCoZone      = targetPlayer.checkIsInCoZone(attackerGridIndex, targetCoGridIndexListOnMap);
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
            if ((attackerLostNormalizedHp != null)              &&
                (attackerLostNormalizedHp > 0)                  &&
                (targetEnergy != null)                          &&
                (!targetPlayer.checkCoIsUsingActiveSkill())     &&
                (isAttackerInTargetCoZone)
            ) {
                targetPlayer.setCoCurrentEnergy(Math.min(
                    targetPlayer.getCoMaxEnergy(),
                    targetEnergy + Math.floor(attackerLostNormalizedHp * multiplierForTarget / 100)
                ));
            }

            // Handle animation and destruction.
            const gridVisionEffect = war.getGridVisionEffect();
            await attackerUnit.moveViewAlongPath(pathNodes, attackerUnit.getIsDiving(), false, targetGridIndex);
            if (!isAttackerDestroyed) {
                attackerUnit.updateView();
                if ((counterDamage != null) && (!isTargetDestroyed)) {
                    gridVisionEffect.showEffectDamage(attackerGridIndex);
                }
            } else {
                DestructionHelpers.destroyUnitOnMap(war, attackerGridIndex, true);
            }

            if (!isTargetDestroyed) {
                targetUnit.updateView();
                gridVisionEffect.showEffectDamage(targetGridIndex);
            } else {
                DestructionHelpers.destroyUnitOnMap(war, targetGridIndex, true);
            }

            if ((isTargetDestroyed) && (!unitMap.checkHasUnit(targetPlayerIndex))) {
                targetPlayer.setAliveState(Types.PlayerAliveState.Dying);
            }
            if ((isAttackerDestroyed) && (!unitMap.checkHasUnit(attackerPlayerIndex))) {
                attackerPlayer.setAliveState(Types.PlayerAliveState.Dying);
            }

            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitAttackTile(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0097)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action        = data.WarActionUnitAttackTile;
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
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            const targetGridIndex               = action.targetGridIndex as GridIndex;
            const [attackDamage, counterDamage] = DamageCalculator.getFinalBattleDamage(war, pathNodes, launchUnitId, targetGridIndex);
            const tileMap                       = war.getTileMap();
            const targetTile                    = tileMap.getTile(targetGridIndex);
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);

            if (attackerUnit.getCfgBaseDamage(targetTile.getArmorType(), Types.WeaponType.Primary) != null) {
                const attackerAmmo = attackerUnit.getPrimaryWeaponCurrentAmmo();
                if ((attackerAmmo != null) && (attackerAmmo > 0)) {
                    attackerUnit.setPrimaryWeaponCurrentAmmo(attackerAmmo - 1);
                }
            }

            const targetNewHp = Math.max(0, targetTile.getCurrentHp() - attackDamage);
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

            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitBeLoaded(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0098)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action        = data.WarActionUnitBeLoaded;
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
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        } else {
            const loaderUnit = unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]);
            unitMap.setUnitLoaded(focusUnit);
            focusUnit.setLoaderUnitId(loaderUnit.getUnitId());

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();
            focusUnit.setViewVisible(false);
            loaderUnit.updateView();
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitBuildTile(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0099)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action        = data.WarActionUnitBuildTile;
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
                    Logger.error(`RwActionExecutor._exeUnitBuildTile() empty targetTileCfg.`);
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
        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitCaptureTile(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0100)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action        = data.WarActionUnitCaptureTile;
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
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

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
                tile.resetByTypeAndPlayerIndex(
                    { baseType: tile.getBaseType(), objectType: tileObjectType === Types.TileObjectType.Headquarters ? Types.TileObjectType.City : tileObjectType, playerIndex: focusUnit.getPlayerIndex() },
                );
            }

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false);
            focusUnit.updateView();
            tile.flushDataToView();
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitDive(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0101)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action        = data.WarActionUnitDive;
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
            war.getGridVisionEffect().showEffectDive(pathNodes[pathNodes.length - 1]);
        }

        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitDropUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0102)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action            = data.WarActionUnitDropUnit;
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
        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitJoinUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0103)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action            = data.WarActionUnitJoinUnit;
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
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
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
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitLaunchFlare(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0104)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action        = data.WarActionUnitLaunchFlare;
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
        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitLaunchSilo(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0105)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action        = data.WarActionUnitLaunchSilo;
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
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tile              = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
            tile.resetByTypeAndPlayerIndex(
                { baseType: tile.getBaseType(), objectType: Types.TileObjectType.EmptySilo, playerIndex: CommonConstants.WarNeutralPlayerIndex },
            );

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
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitLoadCo(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0139)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action        = data.WarActionUnitLoadCo;
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
                Logger.error(`RwActionExecutor._exeUnitLoadCo() empty energyAddPctOnLoadCo.`);
                return undefined;
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
        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitProduceUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0106)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action        = data.WarActionUnitProduceUnit;
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
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
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
            player.setFund(player.getFund() - focusUnit.getProduceUnitCost());
            unitMap.setNextUnitId(producedUnitId + 1);
            unitMap.setUnitLoaded(producedUnit);
            focusUnit.setCurrentProduceMaterial(focusUnit.getCurrentProduceMaterial()! - 1);

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitSupplyUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0107)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action        = data.WarActionUnitSupplyUnit;
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
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
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

            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitSurface(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0108)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action    = data.WarActionUnitSurface;
        const unitMap   = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`RwActionExecutor._exeUnitSurface() empty unitMap.`);
            return undefined;
        }

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
            war.getGridVisionEffect().showEffectSurface(endingGridIndex);
        }

        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitUseCoSkill(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0142)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action    = data.WarActionUnitUseCoSkill;
        const skillType = action.skillType;
        if (skillType == null) {
            Logger.error(`RwActionExecutor._exeUnitUseCoSkill() empty skillType.`);
            return undefined;
        }

        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`RwActionExecutor._exeUnitUseCoSkill() empty unitMap.`);
            return undefined;
        }

        const revisedPath   = action.path as MovePath;
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        if (focusUnit == null) {
            Logger.error(`RwActionExecutor._exeUnitUseCoSkill() empty focusUnit.`);
            return undefined;
        }

        const teamIndexInTurn = focusUnit.getTeamIndex();
        if (teamIndexInTurn == null) {
            Logger.error(`RwActionExecutor._exeUnitUseCoSkill() empty teamIndexInTurn.`);
            return undefined;
        }

        const player = focusUnit.getPlayer();
        if (player == null) {
            Logger.error(`RwActionExecutor._exeUnitUseCoSkill() empty player.`);
            return undefined;
        }

        const currentEnergy = player.getCoCurrentEnergy();
        if (currentEnergy == null) {
            Logger.error(`RwActionExecutor._exeUnitUseCoSkill() empty currentEnergy.`);
            return undefined;
        }

        if (revisedPath.isBlocked) {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), revisedPath.isBlocked);
            focusUnit.updateView();
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            player.setCoUsingSkillType(skillType);

            if (skillType === Types.CoSkillType.Power) {
                const powerEnergy = player.getCoPowerEnergy();
                if (powerEnergy == null) {
                    Logger.error(`RwActionExecutor._exeUnitUseCoSkill() empty powerEnergy.`);
                    return undefined;
                }
                player.setCoCurrentEnergy(currentEnergy - powerEnergy);

            } else if (skillType === Types.CoSkillType.SuperPower) {
                const superPowerEnergy = player.getCoSuperPowerEnergy();
                if (superPowerEnergy == null) {
                    Logger.error(`RwActionExecutor._exeUnitUseCoSkill() empty superPowerEnergy.`);
                    return undefined;
                }

                player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

            } else {
                Logger.error(`RwActionExecutor._exeUnitUseCoSkill() invalid skillType: ${skillType}`);
                return undefined;
            }

            const skillDataList : IDataForUseCoSkill[] = [];
            const skillIdList   = player.getCoCurrentSkills() || [];
            for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                const dataForUseCoSkill = BwCoSkillHelper.getDataForUseCoSkill(war, player, skillIndex);
                if (dataForUseCoSkill == null) {
                    Logger.error(`RwActionExecutor._exeUnitUseCoSkill() empty dataForUseCoSkill.`);
                    return undefined;
                }

                BwCoSkillHelper.exeInstantSkill(war, player, pathNodes[pathNodes.length - 1], skillIdList[skillIndex], dataForUseCoSkill);
                skillDataList.push(dataForUseCoSkill);
            }

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), revisedPath.isBlocked);
            focusUnit.updateView();
            RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);

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

            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitWait(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0109)} (${war.getNextActionId()} / ${war.getTotalActionsCount()} ${Lang.getText(Lang.Type.B0191)}: ${war.getTurnManager().getTurnIndex()})`);

        const action    = data.WarActionUnitWait;
        const unitMap   = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`RwActionExecutor._exeUnitWait() empty unitMap.`);
            return undefined;
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption, });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
        focusUnit.updateView();
        RwUtility.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The fast executors for war actions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _fastExeSystemBeginTurn(war: RwWar, data: IWarActionContainer): Promise<void> {
        war.getTurnManager().endPhaseWaitBeginTurn(data.WarActionSystemBeginTurn);
    }

    async function _fastExeSystemCallWarEvent(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const warEventManager   = war.getWarEventManager();
        const warEventId        = data.WarActionSystemCallWarEvent.warEventId;
        warEventManager.updateWarEventCalledCountOnCall(warEventId)
        await warEventManager.callWarEvent(warEventId, true);

        actionPlanner.setStateIdle();
    }

    async function _fastExeSystemDestroyPlayerForce(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        DestructionHelpers.destroyPlayerForce(war, data.WarActionSystemDestroyPlayerForce.targetPlayerIndex, false);

        actionPlanner.setStateIdle();
    }

    async function _fastExeSystemEndWar(war: RwWar, data: IWarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        // Nothing to do.

        actionPlanner.setStateIdle();
    }

    async function _fastExePlayerDeleteUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action    = data.WarActionPlayerDeleteUnit;
        const gridIndex = action.gridIndex as GridIndex;
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit == null) {
            Logger.error(`RwActionExecutor._fastExePlayerDeleteUnit() empty focusUnit.`);
            return undefined;
        }

        war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
        DestructionHelpers.destroyUnitOnMap(war, gridIndex, false);
    }

    async function _fastExePlayerEndTurn(war: RwWar, data: IWarActionContainer): Promise<void> {
        war.getTurnManager().endPhaseMain(data.WarActionPlayerEndTurn);
    }

    async function _fastExePlayerProduceUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionPlayerProduceUnit;
        const unitType      = action.unitType;
        const gridIndex     = action.gridIndex as GridIndex;
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

    async function _fastExePlayerSurrender(war: RwWar, data: IWarActionContainer): Promise<void> {
        war.getPlayerInTurn().setAliveState(Types.PlayerAliveState.Dying);
    }

    async function _fastExePlayerVoteForDraw(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionPlayerVoteForDraw;
        const playerInTurn  = war.getPlayerInTurn();
        playerInTurn.setHasVotedForDraw(true);

        const drawVoteManager = war.getDrawVoteManager();
        if (!action.isAgree) {
            drawVoteManager.setRemainingVotes(undefined);
        } else {
            drawVoteManager.setRemainingVotes((drawVoteManager.getRemainingVotes() || war.getPlayerManager().getAlivePlayersCount(false)) - 1);
        }
    }

    async function _fastExeUnitAttackUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionUnitAttackUnit;
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const attackerUnit  = unitMap.getUnit(pathNodes[0], launchUnitId);

        if (path.isBlocked) {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);
        } else {
            const targetGridIndex               = action.targetGridIndex as GridIndex;
            const [attackDamage, counterDamage] = DamageCalculator.getFinalBattleDamage(war, pathNodes, launchUnitId, targetGridIndex);
            const attackerGridIndex             = pathNodes[pathNodes.length - 1];
            const targetUnit                    = unitMap.getUnitOnMap(targetGridIndex);
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);

            // Handle ammo.
            const attackerAmmo = attackerUnit.getPrimaryWeaponCurrentAmmo();
            const targetAmmo = targetUnit.getPrimaryWeaponCurrentAmmo();
            if ((attackerAmmo != null)                                                                      &&
                (attackerAmmo > 0)                                                                          &&
                (attackerUnit.getCfgBaseDamage(targetUnit.getArmorType(), Types.WeaponType.Primary) != null)
            ) {
                attackerUnit.setPrimaryWeaponCurrentAmmo(attackerAmmo - 1);
            }
            if ((counterDamage != null)                                                                     &&
                (targetAmmo != null)                                                                        &&
                (targetAmmo > 0)                                                                            &&
                (targetUnit.getCfgBaseDamage(attackerUnit.getArmorType(), Types.WeaponType.Primary) != null)
            ) {
                targetUnit.setPrimaryWeaponCurrentAmmo(targetAmmo - 1);
            }

            // Handle hp.
            const attackerOldHp = attackerUnit.getCurrentHp();
            const attackerNewHp = Math.max(0, attackerOldHp - (counterDamage || 0));
            const targetOldHp   = targetUnit.getCurrentHp();
            const targetNewHp   = Math.max(0, targetOldHp - attackDamage);
            targetUnit.setCurrentHp(targetNewHp);
            attackerUnit.setCurrentHp(attackerNewHp);

            // Handle promotion.
            const configVersion                 = war.getConfigVersion();
            const attackerPlayer                = attackerUnit.getPlayer();
            const targetPlayer                  = targetUnit.getPlayer();
            const attackerPlayerIndex           = attackerUnit.getPlayerIndex();
            const targetPlayerIndex             = targetUnit.getPlayerIndex();
            const attackerLostNormalizedHp      = counterDamage == null ? undefined : BwHelpers.getNormalizedHp(attackerOldHp) - BwHelpers.getNormalizedHp(attackerNewHp);
            const targetLostNormalizedHp        = BwHelpers.getNormalizedHp(targetOldHp) - BwHelpers.getNormalizedHp(targetNewHp);
            const attackerUnitType              = attackerUnit.getUnitType();
            const targetUnitType                = targetUnit.getUnitType();
            const attackerCoGridIndexListOnMap  = unitMap.getCoGridIndexListOnMap(attackerPlayerIndex);
            const targetCoGridIndexListOnMap    = unitMap.getCoGridIndexListOnMap(targetPlayerIndex);
            const isAttackerDestroyed           = attackerNewHp <= 0;
            const isTargetDestroyed             = targetNewHp <= 0;
            if (isAttackerDestroyed) {
                targetUnit.addPromotion();
            }
            if (isTargetDestroyed) {
                attackerUnit.addPromotion();
            }
            if (attackerPlayer.getCoId()) {
                const attackerCoZoneRadius = attackerPlayer.getCoZoneRadius();
                if (attackerCoZoneRadius == null) {
                    Logger.error(`RwActionExecutor._fastExeUnitAttackUnit() empty attackerCoZoneRadius.`);
                    return undefined;
                }

                const hasAttackerLoadedCo = attackerUnit.getHasLoadedCo();
                if (hasAttackerLoadedCo == null) {
                    Logger.error(`RwActionExecutor._fastExeUnitAttackUnit() empty hasAttackerLoadedCo.`);
                    return undefined;
                }

                for (const skillId of attackerPlayer.getCoCurrentSkills() || []) {
                    const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).promotionBonusByAttack;
                    if ((cfg)                                                                                                                                                   &&
                        (targetLostNormalizedHp >= cfg[2])                                                                                                                      &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))                                                                      &&
                        ((hasAttackerLoadedCo) || (BwHelpers.checkIsGridIndexInsideCoSkillArea(attackerGridIndex, cfg[0], attackerCoGridIndexListOnMap, attackerCoZoneRadius)))
                    ) {
                        attackerUnit.addPromotion();
                    }
                }
            }
            if (targetPlayer.getCoId()) {
                const targetCoZoneRadius = targetPlayer.getCoZoneRadius();
                if (targetCoZoneRadius == null) {
                    Logger.error(`RwActionExecutor._fastExeUnitAttackUnit() empty targetCoZoneRadius.`);
                    return undefined;
                }

                for (const skillId of targetPlayer.getCoCurrentSkills() || []) {
                    const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).promotionBonusByAttack;
                    if ((cfg)                                                                                                                   &&
                        (attackerLostNormalizedHp != null)                                                                                      &&
                        (attackerLostNormalizedHp >= cfg[2])                                                                                    &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, targetUnitType, cfg[1]))                                        &&
                        (BwHelpers.checkIsGridIndexInsideCoSkillArea(targetGridIndex, cfg[0], targetCoGridIndexListOnMap, targetCoZoneRadius))
                    ) {
                        targetUnit.addPromotion();
                    }
                }
            }

            // Handle co energy.
            const attackerEnergy                = attackerPlayer.getCoCurrentEnergy();
            const targetEnergy                  = targetPlayer.getCoCurrentEnergy();
            const commonSettingManager          = war.getCommonSettingManager();
            const multiplierForAttacker         = commonSettingManager.getSettingsEnergyGrowthMultiplier(attackerPlayerIndex);
            const multiplierForTarget           = commonSettingManager.getSettingsEnergyGrowthMultiplier(targetPlayerIndex);
            const isAttackerInAttackerCoZone    = (attackerUnit.getHasLoadedCo()) || (attackerPlayer.checkIsInCoZone(attackerGridIndex, attackerCoGridIndexListOnMap));
            const isAttackerInTargetCoZone      = targetPlayer.checkIsInCoZone(attackerGridIndex, targetCoGridIndexListOnMap);
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
            if ((attackerLostNormalizedHp != null)              &&
                (attackerLostNormalizedHp > 0)                  &&
                (targetEnergy != null)                          &&
                (!targetPlayer.checkCoIsUsingActiveSkill())     &&
                (isAttackerInTargetCoZone)
            ) {
                targetPlayer.setCoCurrentEnergy(Math.min(
                    targetPlayer.getCoMaxEnergy(),
                    targetEnergy + Math.floor(attackerLostNormalizedHp * multiplierForTarget / 100)
                ));
            }

            // Handle animation and destruction.
            if (isAttackerDestroyed) {
                DestructionHelpers.destroyUnitOnMap(war, attackerGridIndex, false);
            }
            if (isTargetDestroyed) {
                DestructionHelpers.destroyUnitOnMap(war, targetGridIndex, false);
            }

            if ((isTargetDestroyed) && (!unitMap.checkHasUnit(targetPlayerIndex))) {
                targetPlayer.setAliveState(Types.PlayerAliveState.Dying);
            }
            if ((isAttackerDestroyed) && (!unitMap.checkHasUnit(attackerPlayerIndex))) {
                attackerPlayer.setAliveState(Types.PlayerAliveState.Dying);
            }
        }
    }

    async function _fastExeUnitAttackTile(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionUnitAttackTile;
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const attackerUnit  = unitMap.getUnit(pathNodes[0], launchUnitId);

        if (path.isBlocked) {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);
        } else {
            const targetGridIndex               = action.targetGridIndex as GridIndex;
            const [attackDamage, counterDamage] = DamageCalculator.getFinalBattleDamage(war, pathNodes, launchUnitId, targetGridIndex);
            const tileMap                       = war.getTileMap();
            const targetTile                    = tileMap.getTile(targetGridIndex);
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);

            if (attackerUnit.getCfgBaseDamage(targetTile.getArmorType(), Types.WeaponType.Primary) != null) {
                const attackerAmmo = attackerUnit.getPrimaryWeaponCurrentAmmo();
                if ((attackerAmmo != null) && (attackerAmmo > 0)) {
                    attackerUnit.setPrimaryWeaponCurrentAmmo(attackerAmmo - 1);
                }
            }

            const targetNewHp = Math.max(0, targetTile.getCurrentHp() - attackDamage);
            targetTile.setCurrentHp(targetNewHp);

            if (targetNewHp > 0) {
                // nothing to do.
            } else {
                if (targetTile.getType() === TileType.Meteor) {
                    for (const gridIndex of BwHelpers.getAdjacentPlasmas(tileMap, targetGridIndex)) {
                        const plasma = tileMap.getTile(gridIndex);
                        plasma.destroyTileObject();
                    }
                }
                targetTile.destroyTileObject();
            }
        }
    }

    async function _fastExeUnitBeLoaded(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionUnitBeLoaded;
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        focusUnit.setActionState(UnitActionState.Acted);
        if (path.isBlocked) {
            unitMap.setUnitOnMap(focusUnit);
        } else {
            const loaderUnit = unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]);
            unitMap.setUnitLoaded(focusUnit);
            focusUnit.setLoaderUnitId(loaderUnit.getUnitId());
        }
    }

    async function _fastExeUnitBuildTile(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionUnitBuildTile;
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
                    Logger.error(`RwActionExecutor._fastExeUnitBuildTile() empty targetTileCfg.`);
                    return undefined;
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
    }

    async function _fastExeUnitCaptureTile(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionUnitCaptureTile;
        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            // nothing to do.
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
        }
    }

    async function _fastExeUnitDive(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionUnitDive;
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
    }

    async function _fastExeUnitDropUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action            = data.WarActionUnitDropUnit;
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
    }

    async function _fastExeUnitJoinUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action            = data.WarActionUnitJoinUnit;
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

        } else {
            const targetUnit    = unitMap.getUnitOnMap(endingGridIndex);
            const player        = war.getPlayer(focusUnit.getPlayerIndex());
            unitMap.removeUnitOnMap(endingGridIndex, true);
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
        }
    }

    async function _fastExeUnitLaunchFlare(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionUnitLaunchFlare;
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
    }

    async function _fastExeUnitLaunchSilo(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionUnitLaunchSilo;
        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const launchUnitId  = action.launchUnitId;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
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

    async function _fastExeUnitLoadCo(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionUnitLoadCo;
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
                Logger.error(`RwActionExecutor._fastExeUnitLoadCo() empty energyAddPctOnLoadCo.`);
                return undefined;
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
    }

    async function _fastExeUnitProduceUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionUnitProduceUnit;
        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            // nothing to do.
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
        }
    }

    async function _fastExeUnitSupplyUnit(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action        = data.WarActionUnitSupplyUnit;
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
                        deltaFlareAmmo          : maxFlareAmmo ? maxFlareAmmo - unit.getFlareCurrentAmmo()! : null,
                        deltaPrimaryWeaponAmmo  : maxPrimaryWeaponAmmo ? maxPrimaryWeaponAmmo - unit.getPrimaryWeaponCurrentAmmo()! : null,
                    });
                    suppliedUnits.push(unit);
                }
            }
        }
    }

    async function _fastExeUnitSurface(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action    = data.WarActionUnitSurface;
        const unitMap   = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`RwActionExecutor._exeUnitSurface() empty unitMap.`);
            return undefined;
        }

        const revisedPath   = action.path as MovePath;
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        const isSuccessful  = !revisedPath.isBlocked;
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(false));
    }

    async function _fastExeUnitUseCoSkill(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action    = data.WarActionUnitUseCoSkill;
        const skillType = action.skillType;
        if (skillType == null) {
            Logger.error(`RwActionExecutor._fastExeUnitUseCoSkill() empty skillType.`);
            return undefined;
        }

        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`RwActionExecutor._fastExeUnitUseCoSkill() empty unitMap.`);
            return undefined;
        }

        const revisedPath   = action.path as MovePath;
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        if (focusUnit == null) {
            Logger.error(`RwActionExecutor._fastExeUnitUseCoSkill() empty focusUnit.`);
            return undefined;
        }

        const teamIndexInTurn = focusUnit.getTeamIndex();
        if (teamIndexInTurn == null) {
            Logger.error(`RwActionExecutor._fastExeUnitUseCoSkill() empty teamIndexInTurn.`);
            return undefined;
        }

        const player = focusUnit.getPlayer();
        if (player == null) {
            Logger.error(`RwActionExecutor._fastExeUnitUseCoSkill() empty player.`);
            return undefined;
        }

        const currentEnergy = player.getCoCurrentEnergy();
        if (currentEnergy == null) {
            Logger.error(`RwActionExecutor._fastExeUnitUseCoSkill() empty currentEnergy.`);
            return undefined;
        }

        if (revisedPath.isBlocked) {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

        } else {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            player.setCoUsingSkillType(skillType);

            if (skillType === Types.CoSkillType.Power) {
                const powerEnergy = player.getCoPowerEnergy();
                if (powerEnergy == null) {
                    Logger.error(`RwActionExecutor._fastExeUnitUseCoSkill() empty powerEnergy.`);
                    return undefined;
                }
                player.setCoCurrentEnergy(currentEnergy - powerEnergy);

            } else if (skillType === Types.CoSkillType.SuperPower) {
                const superPowerEnergy = player.getCoSuperPowerEnergy();
                if (superPowerEnergy == null) {
                    Logger.error(`RwActionExecutor._fastExeUnitUseCoSkill() empty superPowerEnergy.`);
                    return undefined;
                }

                player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

            } else {
                Logger.error(`RwActionExecutor._fastExeUnitUseCoSkill() invalid skillType: ${skillType}`);
                return undefined;
            }

            const skillDataList : IDataForUseCoSkill[] = [];
            const skillIdList   = player.getCoCurrentSkills() || [];
            for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                const dataForUseCoSkill = BwCoSkillHelper.getDataForUseCoSkill(war, player, skillIndex);
                if (dataForUseCoSkill == null) {
                    Logger.error(`RwActionExecutor._fastExeUnitUseCoSkill() empty dataForUseCoSkill.`);
                    return undefined;
                }

                BwCoSkillHelper.exeInstantSkill(war, player, pathNodes[pathNodes.length - 1], skillIdList[skillIndex], dataForUseCoSkill);
                skillDataList.push(dataForUseCoSkill);
            }
        }
    }

    async function _fastExeUnitWait(war: RwWar, data: IWarActionContainer): Promise<void> {
        const action    = data.WarActionUnitWait;
        const unitMap   = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`RwActionExecutor._exeUnitWait() empty unitMap.`);
            return undefined;
        }

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption, });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);
    }
}
