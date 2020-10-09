
namespace TinyWars.SingleCustomWar.ScwModel {
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import ProtoTypes               = Utility.ProtoTypes;
    import Helpers                  = Utility.Helpers;
    import DestructionHelpers       = Utility.DestructionHelpers;
    import GridIndexHelpers         = Utility.GridIndexHelpers;
    import VisibilityHelpers        = Utility.VisibilityHelpers;
    import Lang                     = Utility.Lang;
    import FloatText                = Utility.FloatText;
    import WarActionCodes           = Utility.WarActionCodes;
    import ConfigManager            = Utility.ConfigManager;
    import DamageCalculator         = Utility.DamageCalculator;
    import BwHelpers                = BaseWar.BwHelpers;
    import BwCoSkillHelper          = BaseWar.BwCoSkillHelper;
    import CommonAlertPanel         = Common.CommonAlertPanel;
    import GridIndex                = Types.GridIndex;
    import UnitActionState          = Types.UnitActionState;
    import MovePath                 = Types.MovePath;
    import TileType                 = Types.TileType;
    import WarSerialization         = ProtoTypes.WarSerialization;
    import IActionContainer         = ProtoTypes.WarAction.IActionContainer;
    import IDataForUseCoSkill       = ProtoTypes.Structure.IDataForUseCoSkill;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

    const _EXECUTORS = new Map<WarActionCodes, (war: ScwWar, data: IActionContainer) => Promise<void>>([
        [WarActionCodes.ActionPlayerBeginTurn,      _exePlayerBeginTurn],
        [WarActionCodes.ActionPlayerDeleteUnit,     _exePlayerDeleteUnit],
        [WarActionCodes.ActionPlayerEndTurn,        _exePlayerEndTurn],
        [WarActionCodes.ActionPlayerProduceUnit,    _exePlayerProduceUnit],
        [WarActionCodes.ActionPlayerSurrender,      _exePlayerSurrender],
        [WarActionCodes.ActionPlayerVoteForDraw,    _exePlayerVoteForDraw],
        [WarActionCodes.ActionUnitAttackUnit,       _exeUnitAttackUnit],
        [WarActionCodes.ActionUnitAttackTile,       _exeUnitAttackTile],
        [WarActionCodes.ActionUnitBeLoaded,         _exeUnitBeLoaded],
        [WarActionCodes.ActionUnitBuildTile,        _exeUnitBuildTile],
        [WarActionCodes.ActionUnitCaptureTile,      _exeUnitCaptureTile],
        [WarActionCodes.ActionUnitDive,             _exeUnitDive],
        [WarActionCodes.ActionUnitDrop,             _exeUnitDrop],
        [WarActionCodes.ActionUnitJoin,             _exeUnitJoin],
        [WarActionCodes.ActionUnitLaunchFlare,      _exeUnitLaunchFlare],
        [WarActionCodes.ActionUnitLaunchSilo,       _exeUnitLaunchSilo],
        [WarActionCodes.ActionUnitLoadCo,           _exeUnitLoadCo],
        [WarActionCodes.ActionUnitProduceUnit,      _exeUnitProduceUnit],
        [WarActionCodes.ActionUnitSupply,           _exeUnitSupply],
        [WarActionCodes.ActionUnitSurface,          _exeUnitSurface],
        [WarActionCodes.ActionUnitUseCoSkill,       _exeUnitUseCoSkill],
        [WarActionCodes.ActionUnitWait,             _exeUnitWait],
    ]);

    let _war            : ScwWar;
    let _cachedActions  = new Array<IActionContainer>();

    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(data: WarSerialization.ISerialWar): Promise<ScwWar> {
        if (_war) {
            Logger.warn(`McwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        _war = (await new SingleCustomWar.ScwWar().init(data)).startRunning().startRunningView() as ScwWar;
        checkAndRequestBeginTurnOrRunRobot(_war);

        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war                    = undefined;
            _cachedActions.length   = 0;
        }
    }

    export function getWar(): ScwWar | undefined {
        return _war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export function updateByWarAction(container: IActionContainer): void {
        const war = getWar();
        if (war) {
            if (container.actionId !== war.getExecutedActionsCount() + _cachedActions.length) {
                Logger.error(`ScwModel._updateByActionContainer() invalid action id: ${container.actionId}`);
            } else {
                _cachedActions.push(container);
                _checkAndRunFirstCachedAction();
            }
        }
    }

    async function _checkAndRunFirstCachedAction(): Promise<void> {
        const war       = getWar();
        const container = _cachedActions.length ? _cachedActions.shift() : undefined;
        if ((container) && (war.getIsRunning()) && (!war.getIsEnded()) && (!war.getIsExecutingAction())) {
            war.setIsExecutingAction(true);
            if (war.getIsSinglePlayerCheating()) {
                war.setExecutedActionsCount(war.getExecutedActionsCount() + 1);
            } else {
                war.addExecutedAction(container);
            }
            await _EXECUTORS.get(Helpers.getWarActionCode(container))(war, container);
            war.setIsExecutingAction(false);

            if (war.getIsRunning()) {
                const playerManager = war.getPlayerManager();
                if (!playerManager.getAliveWatcherTeamIndexesForSelf().size) {
                    if (war.getHumanPlayers().length > 0) {
                        war.setIsEnded(true);
                        CommonAlertPanel.show({
                            title   : Lang.getText(Lang.Type.B0035),
                            content : Lang.getText(Lang.Type.A0023),
                            callback: () => Utility.FlowManager.gotoLobby(),
                        });
                    } else {
                        if (playerManager.getAliveTeamsCount(false) <= 1) {
                            war.setIsEnded(true);
                            CommonAlertPanel.show({
                                title   : Lang.getText(Lang.Type.B0034),
                                content : Lang.getText(Lang.Type.A0022),
                                callback: () => Utility.FlowManager.gotoLobby(),
                            });

                        } else {
                            if (_cachedActions.length) {
                                _checkAndRunFirstCachedAction();
                            } else {
                                checkAndRequestBeginTurnOrRunRobot(war);
                            }
                        }
                    }

                } else {
                    if (war.getRemainingVotesForDraw() === 0) {
                        war.setIsEnded(true);
                        CommonAlertPanel.show({
                            title   : Lang.getText(Lang.Type.B0082),
                            content : Lang.getText(Lang.Type.A0030),
                            callback: () => Utility.FlowManager.gotoLobby(),
                        });

                    } else {
                        if (playerManager.getAliveTeamsCount(false) <= 1) {
                            war.setIsEnded(true);
                            CommonAlertPanel.show({
                                title   : Lang.getText(Lang.Type.B0034),
                                content : Lang.getText(Lang.Type.A0022),
                                callback: () => Utility.FlowManager.gotoLobby(),
                            });

                        } else {
                            if (_cachedActions.length) {
                                _checkAndRunFirstCachedAction();
                            } else {
                                checkAndRequestBeginTurnOrRunRobot(war);
                            }
                        }
                    }
                }
            }
        }
    }

    export async function checkAndRequestBeginTurnOrRunRobot(war: ScwWar): Promise<void> {
        if (!war.checkIsHumanInTurn()) {
            updateByWarAction(ScwActionReviser.revise(war, await ScwRobot.getNextAction(war)))
        } else {
            if (war.getTurnManager().getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn) {
                (war.getActionPlanner() as ScwActionPlanner).setStateRequestingPlayerBeginTurn();
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The 'true' executors for war actions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _exePlayerBeginTurn(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const playerIndex = war.getPlayerIndexInTurn();
        if (playerIndex === 0) {
            FloatText.show(Lang.getFormattedText(Lang.Type.F0022, Lang.getText(Lang.Type.B0111), playerIndex));
        } else {
            FloatText.show(Lang.getFormattedText(
                Lang.Type.F0022,
                war.checkIsHumanInTurn() ? Lang.getText(Lang.Type.B0031) : Lang.getText(Lang.Type.B0256),
                playerIndex
            ));
        }

        await war.getTurnManager().endPhaseWaitBeginTurn(data.ActionPlayerBeginTurn);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerDeleteUnit(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action    = data.ActionPlayerDeleteUnit;
        const gridIndex = action.gridIndex as GridIndex;
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
            DestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
        }

        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerEndTurn(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        await war.getTurnManager().endPhaseMain(data.ActionPlayerEndTurn);

        actionPlanner.setStateIdle();
    }

    async function _exePlayerProduceUnit(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionPlayerProduceUnit;
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
        const unit          = (new (unitMap.getUnitClass())).init({
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

        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerSurrender(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const player        = war.getPlayerInTurn();
        actionPlanner.setStateExecutingAction();
        FloatText.show(Lang.getFormattedText(data.ActionPlayerSurrender.isBoot ? Lang.Type.F0028 : Lang.Type.F0008, await player.getNickname()));

        DestructionHelpers.destroyPlayerForce(war, player.getPlayerIndex(), true);

        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerVoteForDraw(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionPlayerVoteForDraw;

        const playerInTurn = war.getPlayerInTurn();
        playerInTurn.setHasVotedForDraw(true);

        if (!action.isAgree) {
            FloatText.show(Lang.getFormattedText(Lang.Type.F0017, await playerInTurn.getNickname()));
            war.setRemainingVotesForDraw(undefined);
        } else {
            const remainingVotes = war.getRemainingVotesForDraw();
            if (remainingVotes) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0018, await playerInTurn.getNickname()));
            } else {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0019, await playerInTurn.getNickname()));
            }
            war.setRemainingVotesForDraw((remainingVotes || war.getPlayerManager().getAlivePlayersCount(false)) - 1);
        }

        actionPlanner.setStateIdle();
    }

    async function _exeUnitAttackUnit(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionUnitAttackUnit;
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
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);

            const attackerGridIndex             = pathNodes[pathNodes.length - 1];
            const targetGridIndex               = action.targetGridIndex as GridIndex;
            const [attackDamage, counterDamage] = DamageCalculator.getFinalBattleDamage(war, pathNodes, launchUnitId, targetGridIndex);
            const targetUnit                    = unitMap.getUnitOnMap(targetGridIndex);

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
            const attackerUnitType              = attackerUnit.getType();
            const targetUnitType                = targetUnit.getType();
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
                    Logger.error(`ScwModel._exeUnitAttackUnit() empty attackerCoZoneRadius.`);
                    return undefined;
                }

                const hasAttackerLoadedCo = attackerUnit.getHasLoadedCo();
                if (hasAttackerLoadedCo == null) {
                    Logger.error(`ScwModel._exeUnitAttackUnit() empty hasAttackerLoadedCo.`);
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
                    Logger.error(`ExeMcwUnitAttackUnit.handlePromotion() empty targetCoZoneRadius.`);
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
            const multiplierForAttacker         = war.getSettingsEnergyGrowthMultiplier(attackerPlayerIndex);
            const multiplierForTarget           = war.getSettingsEnergyGrowthMultiplier(targetPlayerIndex);
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

            const lostPlayerIndex = ((isTargetDestroyed) && (!unitMap.checkHasUnit(targetPlayerIndex)))
                ? (targetPlayerIndex)
                : (((isAttackerDestroyed) && (!unitMap.checkHasUnit(attackerPlayerIndex)))
                    ? (attackerPlayerIndex)
                    : (undefined)
                );
            if (lostPlayerIndex) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0015, await war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
            }

            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitAttackTile(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionUnitAttackTile;
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
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(attackerUnit);
            attackerUnit.setActionState(UnitActionState.Acted);

            const targetGridIndex               = action.targetGridIndex as GridIndex;
            const [attackDamage, counterDamage] = DamageCalculator.getFinalBattleDamage(war, pathNodes, launchUnitId, targetGridIndex);
            const tileMap                       = war.getTileMap() as ScwTileMap;
            const targetTile                    = tileMap.getTile(targetGridIndex);
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

            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitBeLoaded(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionUnitBeLoaded;
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
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        } else {
            const loaderUnit = unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]);
            unitMap.setUnitLoaded(focusUnit);
            focusUnit.setLoaderUnitId(loaderUnit.getUnitId());

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();
            focusUnit.setViewVisible(false);
            loaderUnit.updateView();
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitBuildTile(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionUnitBuildTile;
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
                    Logger.error(`ExeMcwUnitBuildTile.executeAction() empty targetTileCfg.`);
                    return undefined;
                }

                focusUnit.setIsBuildingTile(false);
                focusUnit.setCurrentBuildMaterial(focusUnit.getCurrentBuildMaterial() - 1);
                tile.resetByTypeAndPlayerIndex(
                    targetTileCfg.dstBaseType,
                    targetTileCfg.dstObjectType,
                    focusUnit.getPlayerIndex(),
                );
            }
        }

        await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
        focusUnit.updateView();
        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitCaptureTile(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionUnitCaptureTile;
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
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            const destination           = pathNodes[pathNodes.length - 1];
            const tile                  = war.getTileMap().getTile(destination);
            const restCapturePoint      = tile.getCurrentCapturePoint() - focusUnit.getCaptureAmount();
            const previousPlayerIndex   = tile.getPlayerIndex();
            const lostPlayerIndex       = ((restCapturePoint <= 0) && (tile.checkIsDefeatOnCapture())) ? previousPlayerIndex : undefined;

            if (restCapturePoint > 0) {
                focusUnit.setIsCapturingTile(true);
                tile.setCurrentCapturePoint(restCapturePoint);
            } else {
                const tileObjectType = tile.getObjectType();
                focusUnit.setIsCapturingTile(false);
                tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
                tile.resetByTypeAndPlayerIndex(
                    tile.getBaseType(),
                    tileObjectType === Types.TileObjectType.Headquarters ? Types.TileObjectType.City : tileObjectType,
                    focusUnit.getPlayerIndex(),
                );
            }

            if (lostPlayerIndex == null) {
                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false);
                focusUnit.updateView();
                tile.flushDataToView();
                ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
                actionPlanner.setStateIdle();

            } else {
                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false);
                focusUnit.updateView();
                tile.flushDataToView();
                FloatText.show(Lang.getFormattedText(Lang.Type.F0016, await war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
                ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
                actionPlanner.setStateIdle();
            }
        }
    }

    async function _exeUnitDive(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionUnitDive;
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
                unitType            : focusUnit.getType(),
                unitPlayerIndex     : focusUnit.getPlayerIndex(),
                gridIndex           : endingGridIndex,
                observerTeamIndexes : war.getPlayerManager().getAliveWatcherTeamIndexesForSelf(),
                isDiving            : false,
            })) {
                war.getGridVisionEffect().showEffectDive(endingGridIndex);
            }
        }

        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitDrop(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action            = data.ActionUnitDrop;
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
        const unitsForDrop          = [] as ScwUnit[];
        for (const { unitId, gridIndex } of (action.dropDestinations || []) as Types.DropDestination[]) {
            const unitForDrop = unitMap.getUnitLoadedById(unitId) as ScwUnit;
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
            promises.push(unitForDrop.moveViewAlongPath(
                [endingGridIndex, unitForDrop.getGridIndex()],
                unitForDrop.getIsDiving(),
                false,
            ));
        }
        await Promise.all(promises);
        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitJoin(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action            = data.ActionUnitJoin;
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
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
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
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitLaunchFlare(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionUnitLaunchFlare;
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
        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitLaunchSilo(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionUnitLaunchSilo;
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
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tile              = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
            tile.resetByTypeAndPlayerIndex(
                tile.getBaseType(),
                Types.TileObjectType.EmptySilo,
                CommonConstants.WarNeutralPlayerIndex,
            );

            const targetGrids   = GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, Utility.ConfigManager.SILO_RADIUS, unitMap.getMapSize());
            const targetUnits   = [] as ScwUnit[];
            for (const grid of targetGrids) {
                const unit = unitMap.getUnitOnMap(grid) as ScwUnit;
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
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitLoadCo(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionUnitLoadCo;
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
            const initialEnergyPercentage   = war.getSettingsInitialEnergyPercentage(playerIndex);
            if (initialEnergyPercentage == null) {
                Logger.error(`ScwModel._exeUnitLoadCo() empty initialEnergyPercentage.`);
                return undefined;
            }

            focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());

            const player = war.getPlayer(playerIndex);
            player.setFund(player.getFund() - focusUnit.getLoadCoCost()!);
            if (player.getCoCurrentEnergy() == null) {
                player.setCoCurrentEnergy(Math.floor(player.getCoMaxEnergy() * initialEnergyPercentage / 100));
            }
            player.setCoUsingSkillType(Types.CoSkillType.Passive);
        }

        await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
        focusUnit.updateView();
        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitProduceUnit(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionUnitProduceUnit;
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
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            const gridIndex         = focusUnit.getGridIndex();
            const producedUnitId    = unitMap.getNextUnitId();
            const producedUnit      = (new (unitMap.getUnitClass())).init({
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
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitSupply(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionUnitSupply;
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
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            const suppliedUnits = [] as ScwUnit[];
            const playerIndex   = focusUnit.getPlayerIndex();
            for (const gridIndex of GridIndexHelpers.getAdjacentGrids(pathNodes[pathNodes.length - 1], unitMap.getMapSize())) {
                const unit = unitMap.getUnitOnMap(gridIndex) as ScwUnit;
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

            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitSurface(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action    = data.ActionUnitSurface;
        const unitMap   = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`ScwModel._exeUnitSurface() empty unitMap.`);
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
            if (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams({
                war,
                unitType            : focusUnit.getType(),
                unitPlayerIndex     : focusUnit.getPlayerIndex(),
                gridIndex           : endingGridIndex,
                observerTeamIndexes : war.getPlayerManager().getAliveWatcherTeamIndexesForSelf(),
                isDiving            : false,
            })) {
                war.getGridVisionEffect().showEffectSurface(endingGridIndex);
            }
        }

        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitUseCoSkill(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action    = data.ActionUnitUseCoSkill;
        const skillType = action.skillType;
        if (skillType == null) {
            Logger.error(`ScwModel._exeUnitUseCoSkill() empty skillType.`);
            return undefined;
        }

        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`ScwModel._exeUnitUseCoSkill() empty unitMap.`);
            return undefined;
        }

        const revisedPath   = action.path as MovePath;
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        if (focusUnit == null) {
            Logger.error(`ScwModel._exeUnitUseCoSkill() empty focusUnit.`);
            return undefined;
        }

        const teamIndexInTurn = focusUnit.getTeamIndex();
        if (teamIndexInTurn == null) {
            Logger.error(`ScwModel._exeUnitUseCoSkill() empty teamIndexInTurn.`);
            return undefined;
        }

        const player = focusUnit.getPlayer();
        if (player == null) {
            Logger.error(`ScwModel._exeUnitUseCoSkill() empty player.`);
            return undefined;
        }

        const currentEnergy = player.getCoCurrentEnergy();
        if (currentEnergy == null) {
            Logger.error(`ScwModel._exeUnitUseCoSkill() empty currentEnergy.`);
            return undefined;
        }

        if (revisedPath.isBlocked) {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), revisedPath.isBlocked);
            focusUnit.updateView();
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();

        } else {
            BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitActionState.Acted);

            player.setCoUsingSkillType(skillType);

            if (skillType === Types.CoSkillType.Power) {
                const powerEnergy = player.getCoPowerEnergy();
                if (powerEnergy == null) {
                    Logger.error(`ScwModel._exeUnitUseCoSkill() empty powerEnergy.`);
                    return undefined;
                }
                player.setCoCurrentEnergy(currentEnergy - powerEnergy);

            } else if (skillType === Types.CoSkillType.SuperPower) {
                const superPowerEnergy = player.getCoSuperPowerEnergy();
                if (superPowerEnergy == null) {
                    Logger.error(`ScwModel._exeUnitUseCoSkill() empty superPowerEnergy.`);
                    return undefined;
                }

                player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

            } else {
                Logger.error(`ScwModel._exeUnitUseCoSkill() invalid skillType: ${skillType}`);
                return undefined;
            }

            const skillDataList : IDataForUseCoSkill[] = [];
            const skillIdList   = player.getCoCurrentSkills() || [];
            for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                const dataForUseCoSkill = BwCoSkillHelper.getDataForUseCoSkill(war, player, skillIndex);
                if (dataForUseCoSkill == null) {
                    Logger.error(`ScwModel._exeUnitUseCoSkill() empty dataForUseCoSkill.`);
                    return undefined;
                }

                BwCoSkillHelper.exeInstantSkill(war, player, pathNodes[pathNodes.length - 1], skillIdList[skillIndex], dataForUseCoSkill);
                skillDataList.push(dataForUseCoSkill);
            }

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), revisedPath.isBlocked);
            focusUnit.updateView();
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

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

    async function _exeUnitWait(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action    = data.ActionUnitWait;
        const unitMap   = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`ScwModel._exeUnitWait() empty unitMap.`);
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
        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }
}
