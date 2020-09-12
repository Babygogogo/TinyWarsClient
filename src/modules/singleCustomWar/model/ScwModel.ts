
namespace TinyWars.SingleCustomWar.ScwModel {
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import Helpers              = Utility.Helpers;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import WarActionCodes       = Utility.WarActionCodes;
    import ConfigManager        = Utility.ConfigManager;
    import BwHelpers            = BaseWar.BwHelpers;
    import BwCoSkillHelpers     = BaseWar.BwCoSkillHelpers;
    import CommonAlertPanel     = Common.CommonAlertPanel;
    import GridIndex            = Types.GridIndex;
    import UnitActionState      = Types.UnitActionState;
    import MovePath             = Types.MovePath;
    import TileType             = Types.TileType;
    import WarSerialization     = ProtoTypes.WarSerialization;
    import ISerialTile          = WarSerialization.ISerialTile;
    import ISerialUnit          = WarSerialization.ISerialUnit;
    import IActionContainer     = ProtoTypes.WarAction.IActionContainer;
    import IDataForUseCoSkill   = ProtoTypes.Structure.IDataForUseCoSkill;
    import CommonConstants      = ConfigManager.COMMON_CONSTANTS;

    const _EXECUTORS = new Map<WarActionCodes, (war: ScwWar, data: IActionContainer) => Promise<void>>([
        [WarActionCodes.ActionPlayerBeginTurn,      _executeScwPlayerBeginTurn],
        [WarActionCodes.ActionPlayerDeleteUnit,     _executeScwPlayerDeleteUnit],
        [WarActionCodes.ActionPlayerEndTurn,        _executeScwPlayerEndTurn],
        [WarActionCodes.ActionPlayerProduceUnit,    _executeScwPlayerProduceUnit],
        [WarActionCodes.ActionPlayerSurrender,      _executeScwPlayerSurrender],
        [WarActionCodes.ActionPlayerVoteForDraw,    _executeScwPlayerVoteForDraw],
        [WarActionCodes.ActionUnitAttackUnit,       _executeScwUnitAttackUnit],
        [WarActionCodes.ActionUnitAttackTile,       _executeScwUnitAttackTile],
        [WarActionCodes.ActionUnitBeLoaded,         _executeScwUnitBeLoaded],
        [WarActionCodes.ActionUnitBuildTile,        _executeScwUnitBuildTile],
        [WarActionCodes.ActionUnitCaptureTile,      _executeScwUnitCaptureTile],
        [WarActionCodes.ActionUnitDive,             _executeScwUnitDive],
        [WarActionCodes.ActionUnitDrop,             _executeScwUnitDrop],
        [WarActionCodes.ActionUnitJoin,             _executeScwUnitJoin],
        [WarActionCodes.ActionUnitLaunchFlare,      _executeScwUnitLaunchFlare],
        [WarActionCodes.ActionUnitLaunchSilo,       _executeScwUnitLaunchSilo],
        [WarActionCodes.ActionUnitLoadCo,           _executeScwUnitLoadCo],
        [WarActionCodes.ActionUnitProduceUnit,      _executeScwUnitProduceUnit],
        [WarActionCodes.ActionUnitSupply,           _executeScwUnitSupply],
        [WarActionCodes.ActionUnitSurface,          _executeScwUnitSurface],
        [WarActionCodes.ActionUnitUseCoSkill,       _executeScwUnitUseCoSkill],
        [WarActionCodes.ActionUnitWait,             _executeScwUnitWait],
    ]);

    let _war            : ScwWar;
    let _cachedActions  = new Array<IActionContainer>();

    export function init(): void {
        // Notify.addEventListeners([
        //     { type: Notify.Type.SMmMergeMap, callback: _onNotifySMmMergeMap, thisObject: ScwModel },
        // ]);
    }

    // function _onNotifySMmMergeMap(e: egret.Event): void {
    //     const data  = e.data as ProtoTypes.IS_MmMergeMap;
    //     const war   = getWar();
    //     if ((war) && (war.getMapId() === data.srcMapFileName)) {
    //         war.setMapId(data.dstMapFileName);
    //     }
    // }

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
            war.addExecutedAction(container);
            await _EXECUTORS.get(Helpers.getWarActionCode(container))(war, container);
            war.setIsExecutingAction(false);

            if (war.getIsRunning()) {
                if (!war.checkHasAliveWatcherTeam(User.UserModel.getSelfUserId())) {
                    if (war.getHumanPlayers().length > 0) {
                        war.setIsEnded(true);
                        CommonAlertPanel.show({
                            title   : Lang.getText(Lang.Type.B0035),
                            content : Lang.getText(Lang.Type.A0023),
                            callback: () => Utility.FlowManager.gotoLobby(),
                        });
                    } else {
                        if (war.getPlayerManager().getAliveTeamsCount(false) <= 1) {
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
                        if (war.getPlayerManager().getAliveTeamsCount(false) <= 1) {
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
    async function _executeScwPlayerBeginTurn(war: ScwWar, data: IActionContainer): Promise<void> {
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

        await war.getTurnManager().endPhaseWaitBeginTurn(data);
        actionPlanner.setStateIdle();
    }

    async function _executeScwPlayerDeleteUnit(war: ScwWar, data: IActionContainer): Promise<void> {
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

    async function _executeScwPlayerEndTurn(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        await war.getTurnManager().endPhaseMain();

        actionPlanner.setStateIdle();
    }

    async function _executeScwPlayerProduceUnit(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionPlayerProduceUnit;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

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
        const cost          = Math.floor(cfgCost * (skillCfg ? skillCfg[5] : 100) / 100 * Helpers.getNormalizedHp(unitHp) / CommonConstants.UnitHpNormalizer);
        const unit          = new ScwUnit().init({
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

    async function _executeScwPlayerSurrender(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const player = war.getPlayerInTurn();
        DestructionHelpers.destroyPlayerForce(war, player.getPlayerIndex(), true);
        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        FloatText.show(Lang.getFormattedText(Lang.Type.F0008, player.getNickname()));

        actionPlanner.setStateIdle();
    }

    async function _executeScwPlayerVoteForDraw(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionPlayerVoteForDraw;

        const playerInTurn = war.getPlayerInTurn();
        playerInTurn.setHasVotedForDraw(true);

        if (!action.isAgree) {
            FloatText.show(Lang.getFormattedText(Lang.Type.F0017, playerInTurn.getNickname()));
            war.setRemainingVotesForDraw(undefined);
        } else {
            const remainingVotes = war.getRemainingVotesForDraw();
            if (remainingVotes) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0018, playerInTurn.getNickname()));
            } else {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0019, playerInTurn.getNickname()));
            }
            war.setRemainingVotesForDraw((remainingVotes || war.getPlayerManager().getAlivePlayersCount(false)) - 1);
        }

        actionPlanner.setStateIdle();
    }

    async function _executeScwUnitAttackUnit(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitAttack;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = war.getUnitMap();
        const attacker  = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        BwHelpers.moveUnit(war, WarActionCodes.WarActionUnitAttack, path, action.launchUnitId, path.fuelConsumption);
        attacker.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            return new Promise<void>(resolve => {
                attacker.moveViewAlongPath(pathNodes, attacker.getIsDiving(), true, () => {
                    attacker.updateView();
                    ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        } else {
            const counterDamage     = action.counterDamage;
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tileMap           = war.getTileMap() as ScwTileMap;
            const attackTarget      = unitMap.getUnitOnMap(targetGridIndex) || tileMap.getTile(targetGridIndex);
            const targetUnit        = attackTarget instanceof ScwUnit ? attackTarget : undefined;

            if (attacker.getPrimaryWeaponBaseDamage(attackTarget.getArmorType()) != null) {
                attacker.setPrimaryWeaponCurrentAmmo(attacker.getPrimaryWeaponCurrentAmmo()! - 1);
            }
            if ((counterDamage != null) && (targetUnit) && (targetUnit.getPrimaryWeaponBaseDamage(attacker.getArmorType()) != null)) {
                targetUnit.setPrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponCurrentAmmo()! - 1);
            }

            // TODO: deal with skills and energy.

            const attackerOldHp = attacker.getCurrentHp();
            const attackerNewHp = Math.max(0, attackerOldHp - (counterDamage || 0));
            attacker.setCurrentHp(attackerNewHp);
            if ((attackerNewHp === 0) && (targetUnit)) {
                targetUnit.addPromotion();
            }

            const targetOldHp   = attackTarget.getCurrentHp()!;
            const targetNewHp   = Math.max(0, targetOldHp - action.attackDamage);
            attackTarget.setCurrentHp(targetNewHp);
            if ((targetNewHp === 0) && (targetUnit)) {
                attacker.addPromotion();
            }

            const destination       = pathNodes[pathNodes.length - 1];
            const attackerPlayer    = war.getPlayer(attacker.getPlayerIndex())!;
            if (targetUnit) {
                const configVersion         = war.getConfigVersion();
                const targetLostHp          = Helpers.getNormalizedHp(targetOldHp) - Helpers.getNormalizedHp(targetNewHp);
                const attackerCoGridIndex   = attackerPlayer.getCoGridIndexOnMap();
                const isAttackerInCoZone    = (attacker.getUnitId() === attackerPlayer.getCoUnitId()) || (attackerPlayer.checkIsInCoZone(destination, attackerCoGridIndex));
                if ((targetLostHp > 0)                              &&
                    (attackerPlayer.getCoId() != null)              &&
                    (!attackerPlayer.checkCoIsUsingActiveSkill())   &&
                    (isAttackerInCoZone)
                ) {
                    attackerPlayer.setCoCurrentEnergy(Math.min(
                        attackerPlayer.getCoMaxEnergy(),
                        attackerPlayer.getCoCurrentEnergy() + Math.floor(targetLostHp * war.getSettingsEnergyGrowthMultiplier() / 100)
                    ));
                }
                const attackerUnitType = attacker.getType();
                for (const skillId of attackerPlayer.getCoCurrentSkills() || []) {
                    const cfg = Utility.ConfigManager.getCoSkillCfg(configVersion, skillId)!.promotionBonusByAttack;
                    if ((cfg)                                                                           &&
                        (targetLostHp >= cfg[2])                                                        &&
                        (Utility.ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))
                    ) {
                        if (cfg[0] === Types.CoSkillAreaType.Zone) {
                            if (isAttackerInCoZone) {
                                attacker.addPromotion();
                            }
                        } else if (cfg[0] === Types.CoSkillAreaType.OnMap) {
                            if (!!attackerCoGridIndex) {
                                attacker.addPromotion();
                            }
                        }
                    }
                }

                const targetPlayer      = war.getPlayer(targetUnit.getPlayerIndex())!;
                const targetCoGridIndex = targetPlayer.getCoGridIndexOnMap();
                const attackerLostHp    = Helpers.getNormalizedHp(attackerOldHp) - Helpers.getNormalizedHp(attackerNewHp);
                if ((attackerLostHp > 0)                                        &&
                    (targetPlayer.getCoId() != null)                            &&
                    (!targetPlayer.checkCoIsUsingActiveSkill())                 &&
                    (targetPlayer.checkIsInCoZone(destination, targetCoGridIndex))
                ) {
                    targetPlayer.setCoCurrentEnergy(Math.min(
                        targetPlayer.getCoMaxEnergy(),
                        targetPlayer.getCoCurrentEnergy() + Math.floor(attackerLostHp * war.getSettingsEnergyGrowthMultiplier() / 100)
                    ));
                }
                const isTargetInCoZone  = targetPlayer.checkIsInCoZone(targetGridIndex, targetCoGridIndex);
                const targetUnitType    = targetUnit.getType();
                for (const skillId of targetPlayer.getCoCurrentSkills() || []) {
                    const cfg = Utility.ConfigManager.getCoSkillCfg(configVersion, skillId)!.promotionBonusByAttack;
                    if ((cfg)                                                                           &&
                        (attackerLostHp >= cfg[2])                                                      &&
                        (Utility.ConfigManager.checkIsUnitTypeInCategory(configVersion, targetUnitType, cfg[1]))
                    ) {
                        if (cfg[0] === Types.CoSkillAreaType.Zone) {
                            if (isTargetInCoZone) {
                                targetUnit.addPromotion();
                            }
                        } else if (cfg[0] === Types.CoSkillAreaType.OnMap) {
                            if (!!targetCoGridIndex) {
                                targetUnit.addPromotion();
                            }
                        }
                    }
                }
            }

            const configVersion             = war.getConfigVersion();
            const attackerUnitAfterAction   = action.attackerUnitAfterAction as Types.SerializedUnit;
            if (attackerUnitAfterAction) {
                attacker.init(attackerUnitAfterAction, configVersion);
                attacker.startRunning(war);
            }
            const targetUnitAfterAction = action.targetUnitAfterAction as Types.SerializedUnit;
            if (targetUnitAfterAction) {
                targetUnit.init(targetUnitAfterAction, configVersion);
                targetUnit.startRunning(war);
            }
            if (action.attackerCoEnergy != null) {
                attackerPlayer.setCoCurrentEnergy(action.attackerCoEnergy);
            }
            if (action.targetCoEnergy != null) {
                war.getPlayer(targetUnit.getPlayerIndex())!.setCoCurrentEnergy(action.targetCoEnergy);
            }

            const lostPlayerIndex   = action.lostPlayerIndex;
            const gridVisionEffect  = war.getGridVisionEffect();

            return new Promise<void>(resolve => {
                attacker.moveViewAlongPath(pathNodes, attacker.getIsDiving(), false, () => {
                    if (attackerNewHp > 0) {
                        attacker.updateView();
                        if ((counterDamage != null) && (targetNewHp > 0)) {
                            gridVisionEffect.showEffectDamage(destination);
                        }
                    } else {
                        DestructionHelpers.destroyUnitOnMap(war, destination, true);
                    }

                    if (targetNewHp > 0) {
                        attackTarget.updateView();
                        gridVisionEffect.showEffectDamage(targetGridIndex);
                    } else {
                        if (targetUnit) {
                            DestructionHelpers.destroyUnitOnMap(war, targetGridIndex, true);
                        } else {
                            if ((attackTarget as ScwTile).getType() === TileType.Meteor) {
                                for (const gridIndex of getAdjacentPlasmas(tileMap, targetGridIndex)) {
                                    const plasma = tileMap.getTile(gridIndex);
                                    plasma.destroyTileObject();
                                    plasma.updateView();
                                    gridVisionEffect.showEffectExplosion(gridIndex);
                                }
                            }
                            (attackTarget as ScwTile).destroyTileObject();
                            attackTarget.updateView();
                            gridVisionEffect.showEffectExplosion(targetGridIndex);
                        }
                    }

                    if (lostPlayerIndex) {
                        FloatText.show(Lang.getFormattedText(Lang.Type.F0015, war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                        DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
                    }

                    ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                }, targetGridIndex);
            });
        }
    }

    async function _executeScwUnitAttackTile(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitAttack;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = war.getUnitMap();
        const attacker  = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        BwHelpers.moveUnit(war, WarActionCodes.WarActionUnitAttack, path, action.launchUnitId, path.fuelConsumption);
        attacker.setActionState(UnitActionState.Acted);

        if (path.isBlocked) {
            return new Promise<void>(resolve => {
                attacker.moveViewAlongPath(pathNodes, attacker.getIsDiving(), true, () => {
                    attacker.updateView();
                    ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        } else {
            const counterDamage     = action.counterDamage;
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tileMap           = war.getTileMap() as ScwTileMap;
            const attackTarget      = unitMap.getUnitOnMap(targetGridIndex) || tileMap.getTile(targetGridIndex);
            const targetUnit        = attackTarget instanceof ScwUnit ? attackTarget : undefined;

            if (attacker.getPrimaryWeaponBaseDamage(attackTarget.getArmorType()) != null) {
                attacker.setPrimaryWeaponCurrentAmmo(attacker.getPrimaryWeaponCurrentAmmo()! - 1);
            }
            if ((counterDamage != null) && (targetUnit) && (targetUnit.getPrimaryWeaponBaseDamage(attacker.getArmorType()) != null)) {
                targetUnit.setPrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponCurrentAmmo()! - 1);
            }

            // TODO: deal with skills and energy.

            const attackerOldHp = attacker.getCurrentHp();
            const attackerNewHp = Math.max(0, attackerOldHp - (counterDamage || 0));
            attacker.setCurrentHp(attackerNewHp);
            if ((attackerNewHp === 0) && (targetUnit)) {
                targetUnit.addPromotion();
            }

            const targetOldHp   = attackTarget.getCurrentHp()!;
            const targetNewHp   = Math.max(0, targetOldHp - action.attackDamage);
            attackTarget.setCurrentHp(targetNewHp);
            if ((targetNewHp === 0) && (targetUnit)) {
                attacker.addPromotion();
            }

            const destination       = pathNodes[pathNodes.length - 1];
            const attackerPlayer    = war.getPlayer(attacker.getPlayerIndex())!;
            if (targetUnit) {
                const configVersion         = war.getConfigVersion();
                const targetLostHp          = Helpers.getNormalizedHp(targetOldHp) - Helpers.getNormalizedHp(targetNewHp);
                const attackerCoGridIndex   = attackerPlayer.getCoGridIndexOnMap();
                const isAttackerInCoZone    = (attacker.getUnitId() === attackerPlayer.getCoUnitId()) || (attackerPlayer.checkIsInCoZone(destination, attackerCoGridIndex));
                if ((targetLostHp > 0)                              &&
                    (attackerPlayer.getCoId() != null)              &&
                    (!attackerPlayer.checkCoIsUsingActiveSkill())   &&
                    (isAttackerInCoZone)
                ) {
                    attackerPlayer.setCoCurrentEnergy(Math.min(
                        attackerPlayer.getCoMaxEnergy(),
                        attackerPlayer.getCoCurrentEnergy() + Math.floor(targetLostHp * war.getSettingsEnergyGrowthMultiplier() / 100)
                    ));
                }
                const attackerUnitType = attacker.getType();
                for (const skillId of attackerPlayer.getCoCurrentSkills() || []) {
                    const cfg = Utility.ConfigManager.getCoSkillCfg(configVersion, skillId)!.promotionBonusByAttack;
                    if ((cfg)                                                                           &&
                        (targetLostHp >= cfg[2])                                                        &&
                        (Utility.ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))
                    ) {
                        if (cfg[0] === Types.CoSkillAreaType.Zone) {
                            if (isAttackerInCoZone) {
                                attacker.addPromotion();
                            }
                        } else if (cfg[0] === Types.CoSkillAreaType.OnMap) {
                            if (!!attackerCoGridIndex) {
                                attacker.addPromotion();
                            }
                        }
                    }
                }

                const targetPlayer      = war.getPlayer(targetUnit.getPlayerIndex())!;
                const targetCoGridIndex = targetPlayer.getCoGridIndexOnMap();
                const attackerLostHp    = Helpers.getNormalizedHp(attackerOldHp) - Helpers.getNormalizedHp(attackerNewHp);
                if ((attackerLostHp > 0)                                        &&
                    (targetPlayer.getCoId() != null)                            &&
                    (!targetPlayer.checkCoIsUsingActiveSkill())                 &&
                    (targetPlayer.checkIsInCoZone(destination, targetCoGridIndex))
                ) {
                    targetPlayer.setCoCurrentEnergy(Math.min(
                        targetPlayer.getCoMaxEnergy(),
                        targetPlayer.getCoCurrentEnergy() + Math.floor(attackerLostHp * war.getSettingsEnergyGrowthMultiplier() / 100)
                    ));
                }
                const isTargetInCoZone  = targetPlayer.checkIsInCoZone(targetGridIndex, targetCoGridIndex);
                const targetUnitType    = targetUnit.getType();
                for (const skillId of targetPlayer.getCoCurrentSkills() || []) {
                    const cfg = Utility.ConfigManager.getCoSkillCfg(configVersion, skillId)!.promotionBonusByAttack;
                    if ((cfg)                                                                           &&
                        (attackerLostHp >= cfg[2])                                                      &&
                        (Utility.ConfigManager.checkIsUnitTypeInCategory(configVersion, targetUnitType, cfg[1]))
                    ) {
                        if (cfg[0] === Types.CoSkillAreaType.Zone) {
                            if (isTargetInCoZone) {
                                targetUnit.addPromotion();
                            }
                        } else if (cfg[0] === Types.CoSkillAreaType.OnMap) {
                            if (!!targetCoGridIndex) {
                                targetUnit.addPromotion();
                            }
                        }
                    }
                }
            }

            const configVersion             = war.getConfigVersion();
            const attackerUnitAfterAction   = action.attackerUnitAfterAction as Types.SerializedUnit;
            if (attackerUnitAfterAction) {
                attacker.init(attackerUnitAfterAction, configVersion);
                attacker.startRunning(war);
            }
            const targetUnitAfterAction = action.targetUnitAfterAction as Types.SerializedUnit;
            if (targetUnitAfterAction) {
                targetUnit.init(targetUnitAfterAction, configVersion);
                targetUnit.startRunning(war);
            }
            if (action.attackerCoEnergy != null) {
                attackerPlayer.setCoCurrentEnergy(action.attackerCoEnergy);
            }
            if (action.targetCoEnergy != null) {
                war.getPlayer(targetUnit.getPlayerIndex())!.setCoCurrentEnergy(action.targetCoEnergy);
            }

            const lostPlayerIndex   = action.lostPlayerIndex;
            const gridVisionEffect  = war.getGridVisionEffect();

            return new Promise<void>(resolve => {
                attacker.moveViewAlongPath(pathNodes, attacker.getIsDiving(), false, () => {
                    if (attackerNewHp > 0) {
                        attacker.updateView();
                        if ((counterDamage != null) && (targetNewHp > 0)) {
                            gridVisionEffect.showEffectDamage(destination);
                        }
                    } else {
                        DestructionHelpers.destroyUnitOnMap(war, destination, true);
                    }

                    if (targetNewHp > 0) {
                        attackTarget.updateView();
                        gridVisionEffect.showEffectDamage(targetGridIndex);
                    } else {
                        if (targetUnit) {
                            DestructionHelpers.destroyUnitOnMap(war, targetGridIndex, true);
                        } else {
                            if ((attackTarget as ScwTile).getType() === TileType.Meteor) {
                                for (const gridIndex of getAdjacentPlasmas(tileMap, targetGridIndex)) {
                                    const plasma = tileMap.getTile(gridIndex);
                                    plasma.destroyTileObject();
                                    plasma.updateView();
                                    gridVisionEffect.showEffectExplosion(gridIndex);
                                }
                            }
                            (attackTarget as ScwTile).destroyTileObject();
                            attackTarget.updateView();
                            gridVisionEffect.showEffectExplosion(targetGridIndex);
                        }
                    }

                    if (lostPlayerIndex) {
                        FloatText.show(Lang.getFormattedText(Lang.Type.F0015, war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                        DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
                    }

                    ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                }, targetGridIndex);
            });
        }
    }

    async function _executeScwUnitBeLoaded(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitBeLoaded;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

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

    async function _executeScwUnitBuildTile(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitBuildTile;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

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

    async function _executeScwUnitCaptureTile(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitCaptureTile;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

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
                tile.updateView();
                ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
                actionPlanner.setStateIdle();

            } else {
                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false);
                focusUnit.updateView();
                tile.updateView();
                FloatText.show(Lang.getFormattedText(Lang.Type.F0016, war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
                ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
                actionPlanner.setStateIdle();
            }
        }
    }

    async function _executeScwUnitDive(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitDive;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

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
            if (VisibilityHelpers.checkIsUnitOnMapVisibleToUser({
                war,
                unitType            : focusUnit.getType(),
                unitPlayerIndex     : focusUnit.getPlayerIndex(),
                gridIndex           : endingGridIndex,
                observerUserId      : User.UserModel.getSelfUserId(),
                isDiving            : false,
            })) {
                war.getGridVisionEffect().showEffectDive(endingGridIndex);
            }
        }

        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _executeScwUnitDrop(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitDrop;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

        const path              = action.path as MovePath;
        const launchUnitId      = action.launchUnitId;
        const pathNodes         = path.nodes;
        const unitMap           = war.getUnitMap();
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = unitMap.getUnit(pathNodes[0], launchUnitId);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitActionState.Acted);

        const shouldUpdateFogMap    = war.getWatcherTeamIndexes(User.UserModel.getSelfUserId()).has(focusUnit.getTeamIndex());
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

    async function _executeScwUnitJoin(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitJoin;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

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

    async function _executeScwUnitLaunchFlare(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitLaunchFlare;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

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
        if ((isFlareSucceeded) && (war.getWatcherTeamIndexes(User.UserModel.getSelfUserId()).has(focusUnit.getTeamIndex()))) {
            const effect = war.getGridVisionEffect();
            for (const grid of GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, flareRadius, war.getTileMap().getMapSize())) {
                effect.showEffectFlare(grid);
            }
        }

        focusUnit.updateView();
        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _executeScwUnitLaunchSilo(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitLaunchSilo;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

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
            tile.updateView();
            ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _executeScwUnitLoadCo(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitLoadCo;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

        const path          = action.path as MovePath;
        const launchUnitId  = action.launchUnitId;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        unitMap.setUnitOnMap(focusUnit);
        BwHelpers.moveUnit({ war, pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });

        if (path.isBlocked) {
            focusUnit.setActionState(UnitActionState.Acted);
        } else {
            const playerIndex               = focusUnit.getPlayerIndex();
            const initialEnergyPercentage   = war.getSettingsInitialEnergyPercentage(playerIndex);
            if (initialEnergyPercentage == null) {
                Logger.error(`ScwModel._executeScwUnitLoadCo() empty initialEnergyPercentage.`);
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

    async function _executeScwUnitProduceUnit(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitProduceUnit;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

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
            // TODO: take skills into account.
            const gridIndex         = focusUnit.getGridIndex();
            const producedUnitId    = unitMap.getNextUnitId();
            const producedUnit      = new ScwUnit().init({
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

    async function _executeScwUnitSupply(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitSupply;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

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

    async function _executeScwUnitSurface(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitSurface;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`ScwModel._executeScwUnitSurface() empty unitMap.`);
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
            if (VisibilityHelpers.checkIsUnitOnMapVisibleToUser({
                war,
                unitType            : focusUnit.getType(),
                unitPlayerIndex     : focusUnit.getPlayerIndex(),
                gridIndex           : endingGridIndex,
                observerUserId      : User.UserModel.getSelfUserId(),
                isDiving            : false,
            })) {
                war.getGridVisionEffect().showEffectSurface(endingGridIndex);
            }
        }
        ScwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

        actionPlanner.setStateIdle();
    }

    async function _executeScwUnitUseCoSkill(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action    = data.ActionUnitUseCoSkill;
        const skillType = action.skillType;
        if (skillType == null) {
            Logger.error(`ScwModel._executeScwUnitUseCoSkill() empty skillType.`);
            return undefined;
        }

        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`ScwModel._executeScwUnitUseCoSkill() empty unitMap.`);
            return undefined;
        }

        const revisedPath   = action.path as MovePath;
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.launchUnitId;
        const focusUnit     = unitMap.getUnit(pathNodes[0], launchUnitId);
        if (focusUnit == null) {
            Logger.error(`ScwModel._executeScwUnitUseCoSkill() empty focusUnit.`);
            return undefined;
        }

        const teamIndexInTurn = focusUnit.getTeamIndex();
        if (teamIndexInTurn == null) {
            Logger.error(`ScwModel._executeScwUnitUseCoSkill() empty teamIndexInTurn.`);
            return undefined;
        }

        const player = focusUnit.getPlayer();
        if (player == null) {
            Logger.error(`ScwModel._executeScwUnitUseCoSkill() empty player.`);
            return undefined;
        }

        const currentEnergy = player.getCoCurrentEnergy();
        if (currentEnergy == null) {
            Logger.error(`ScwModel._executeScwUnitUseCoSkill() empty currentEnergy.`);
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
                    Logger.error(`ScwModel._executeScwUnitUseCoSkill() empty powerEnergy.`);
                    return undefined;
                }
                player.setCoCurrentEnergy(currentEnergy - powerEnergy);

            } else if (skillType === Types.CoSkillType.SuperPower) {
                const superPowerEnergy = player.getCoSuperPowerEnergy();
                if (superPowerEnergy == null) {
                    Logger.error(`ScwModel._executeScwUnitUseCoSkill() empty superPowerEnergy.`);
                    return undefined;
                }

                player.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

            } else {
                Logger.error(`ScwModel._executeScwUnitUseCoSkill() invalid skillType: ${skillType}`);
                return undefined;
            }

            const skillDataList : IDataForUseCoSkill[] = [];
            const skillIdList   = player.getCoCurrentSkills() || [];
            for (let skillIndex = 0; skillIndex < skillIdList.length; ++skillIndex) {
                const dataForUseCoSkill = BwCoSkillHelpers.getDataForUseCoSkill(war, player, skillIndex);
                if (dataForUseCoSkill == null) {
                    Logger.error(`ScwModel._executeScwUnitUseCoSkill() empty dataForUseCoSkill.`);
                    return undefined;
                }

                BwCoSkillHelpers.exeInstantSkill(war, player, pathNodes[pathNodes.length - 1], skillIdList[skillIndex], dataForUseCoSkill);
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

    async function _executeScwUnitWait(war: ScwWar, data: IActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionUnitWait;
        updateTilesAndUnitsBeforeExecutingAction(war, action.extraData);

        const unitMap = war.getUnitMap();
        if (unitMap == null) {
            Logger.error(`ScwModel._executeScwUnitWait() empty unitMap.`);
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helpers for executors.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function addUnits(war: ScwWar, unitsData: ISerialUnit[] | undefined | null, isViewVisible: boolean): void {
        if ((unitsData) && (unitsData.length)) {
            const unitMap       = war.getUnitMap();
            const configVersion = war.getConfigVersion();

            for (const unitData of unitsData) {
                if (!unitMap.getUnitById(unitData.unitId)) {
                    const unit      = new ScwUnit().init(unitData, configVersion);
                    const isOnMap   = unit.getLoaderUnitId() == null;
                    if (isOnMap) {
                        unitMap.setUnitOnMap(unit);
                    } else {
                        unitMap.setUnitLoaded(unit);
                    }
                    unit.startRunning(war);
                    unit.startRunningView();
                    unit.setViewVisible(isViewVisible);
                }
            }
        }
    }
    function updateTiles(war: ScwWar, tilesData: ISerialTile[] | undefined | null): void {
        if ((tilesData) && (tilesData.length)) {
            const tileMap   = war.getTileMap();
            for (const tileData of tilesData) {
                const gridIndex = BwHelpers.convertGridIndex(tileData.gridIndex);
                if (gridIndex == null) {
                    Logger.error(`ScwModel.updateTiles() empty gridIndex.`);
                    return undefined;
                }

                const tile = tileMap.getTile(gridIndex);
                if (tile.getIsFogEnabled()) {
                    tile.setFogDisabled(tileData);
                }
            }
        }
    }
    function updateTilesAndUnitsBeforeExecutingAction(
        war         : ScwWar,
        extraData   : {
            actingTiles?    : ISerialTile[],
            actingUnits?    : ISerialUnit[],
            discoveredTiles?: ISerialTile[],
            discoveredUnits?: ISerialUnit[],
        } | undefined | null,
    ): void {
        if (extraData) {
            addUnits(war, extraData.actingUnits as ISerialUnit[] | undefined | null, false);
            addUnits(war, extraData.discoveredUnits as ISerialUnit[] | undefined | null, false);
            updateTiles(war, extraData.actingTiles as ISerialTile[] | undefined | null);
            updateTiles(war, extraData.discoveredTiles as ISerialTile[] | undefined | null);
        }
    }

    function getAdjacentPlasmas(tileMap: ScwTileMap, origin: GridIndex): GridIndex[] {
        const plasmas           = [origin];
        const mapSize           = tileMap.getMapSize();
        const mapHeight         = mapSize.height;
        const searchedIndexes   = new Set<number>([getIndexOfGridIndex(mapHeight, origin)]);

        let i = 0;
        while (i < plasmas.length) {
            for (const adjacentGridIndex of GridIndexHelpers.getAdjacentGrids(plasmas[i], mapSize)) {
                if (tileMap.getTile(adjacentGridIndex).getType() === TileType.Plasma) {
                    const searchIndex = getIndexOfGridIndex(mapHeight, adjacentGridIndex);
                    if (!searchedIndexes.has(searchIndex)) {
                        searchedIndexes.add(searchIndex);
                        plasmas.push(adjacentGridIndex);
                    }
                }
            }
            ++i;
        }

        plasmas.shift();
        return plasmas;
    }

    function getIndexOfGridIndex(mapHeight: number, gridIndex: GridIndex): number {
        return gridIndex.x * mapHeight + gridIndex.y;
    }
}
