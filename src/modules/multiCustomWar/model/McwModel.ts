
namespace TinyWars.MultiCustomWar.McwModel {
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import ProtoTypes               = Utility.ProtoTypes;
    import Helpers                  = Utility.Helpers;
    import DestructionHelpers       = Utility.DestructionHelpers;
    import GridIndexHelpers         = Utility.GridIndexHelpers;
    import VisibilityHelpers        = Utility.VisibilityHelpers;
    import ConfigManager            = Utility.ConfigManager;
    import Lang                     = Utility.Lang;
    import FloatText                = Utility.FloatText;
    import WarActionCodes           = Utility.WarActionCodes;
    import BwUnit                   = BaseWar.BwUnit;
    import BwCoSkillHelper          = BaseWar.BwCoSkillHelper;
    import BwHelpers                = BaseWar.BwHelpers;
    import CommonAlertPanel         = Common.CommonAlertPanel;
    import GridIndex                = Types.GridIndex;
    import UnitActionState          = Types.UnitActionState;
    import MovePath                 = Types.MovePath;
    import TileType                 = Types.TileType;
    import ActionContainer          = ProtoTypes.WarAction.IActionContainer;
    import CommonConstants          = ConfigManager.COMMON_CONSTANTS;

    const _EXECUTORS = new Map<WarActionCodes, (war: McwWar, data: ActionContainer) => Promise<void>>([
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

    let _war            : McwWar;
    let _cachedActions  = new Array<ActionContainer>();

    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(data: ProtoTypes.WarSerialization.ISerialWar): Promise<McwWar> {
        if (_war) {
            Logger.warn(`McwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        _war = (await new MultiCustomWar.McwWar().init(data)).startRunning().startRunningView() as McwWar;
        _checkAndRequestBeginTurn();

        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war                    = undefined;
            _cachedActions.length   = 0;
        }
    }

    export function getWar(): McwWar | undefined {
        return _war;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Handlers for war actions that McwProxy receives.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function updateOnPlayerSyncWar(data: ProtoTypes.NetMessage.IS_McwPlayerSyncWar): Promise<void> {
        const war = getWar();
        if ((war) && (war.getWarId() === data.warId)) {
            const status = data.status as Types.SyncWarStatus;
            if (status === Types.SyncWarStatus.Defeated) {
                war.setIsEnded(true);
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0023),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });

            } else if (status === Types.SyncWarStatus.EndedOrNotExists) {
                war.setIsEnded(true);
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0035),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });

            } else if (status === Types.SyncWarStatus.NoError) {
                const requestType = data.requestType as Types.SyncWarRequestType;
                if (requestType === Types.SyncWarRequestType.PlayerForce) {
                    war.setIsEnded(true);
                    await Utility.FlowManager.gotoMultiCustomWar(data.war),
                    FloatText.show(Lang.getText(Lang.Type.A0038));

                } else {
                    const cachedActionsCount = _cachedActions.length;
                    if (data.executedActionsCount !== war.getExecutedActionsCount() + cachedActionsCount) {
                        war.setIsEnded(true);
                        await Utility.FlowManager.gotoMultiCustomWar(data.war);
                        FloatText.show(Lang.getText(Lang.Type.A0036));

                    } else {
                        if (requestType === Types.SyncWarRequestType.PlayerRequest) {
                            FloatText.show(Lang.getText(Lang.Type.A0038));
                        } else {
                            // Nothing to do.
                        }
                        if (!war.getIsExecutingAction()) {
                            if (cachedActionsCount) {
                                _checkAndRunFirstCachedAction();
                            } else {
                                _checkAndRequestBeginTurn();
                            }
                        }
                    }
                }

            } else if (status === Types.SyncWarStatus.NotJoined) {
                // Something wrong!!
                war.setIsEnded(true);
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0037),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });

            } else if (status === Types.SyncWarStatus.Synchronized) {
                const requestType = data.requestType as Types.SyncWarRequestType;
                if (requestType === Types.SyncWarRequestType.PlayerRequest) {
                    FloatText.show(Lang.getText(Lang.Type.A0038));
                } else {
                    // Nothing to do.
                }

            } else {
                // Something wrong!!
                war.setIsEnded(true);
                CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0037),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });
            }
        }
    }

    export function updateByActionContainer(container: ActionContainer, warId: number): void {
        const war = getWar();
        if ((war) && (war.getWarId() === warId)) {
            if (container.actionId !== war.getExecutedActionsCount() + _cachedActions.length) {
                McwProxy.reqMcwPlayerSyncWar(war, Types.SyncWarRequestType.ReconnectionRequest);
            } else {
                _cachedActions.push(container);
                _checkAndRunFirstCachedAction();
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _checkAndRunFirstCachedAction(): Promise<void> {
        const war       = getWar();
        const container = _cachedActions.length ? _cachedActions.shift() : undefined;
        if ((container) && (war.getIsRunning()) && (!war.getIsEnded()) && (!war.getIsExecutingAction())) {
            war.setIsExecutingAction(true);
            war.setExecutedActionsCount(war.getExecutedActionsCount() + 1);
            await _EXECUTORS.get(Helpers.getWarActionCode(container))(war, container);
            war.setIsExecutingAction(false);

            if (war.getIsRunning()) {
                if (!war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().size) {
                    war.setIsEnded(true);
                    CommonAlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0035),
                        content : Lang.getText(Lang.Type.A0023),
                        callback: () => Utility.FlowManager.gotoLobby(),
                    });

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
                            _checkAndRunFirstCachedAction();
                        }
                    }
                }
            }
        }
    }

    function _checkAndRequestBeginTurn(): void {
        const war           = getWar();
        const turnManager   = war.getTurnManager();
        if ((turnManager.getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn)      &&
            (war.getPlayerIndexLoggedIn() ===  turnManager.getPlayerIndexInTurn())
        ) {
            (war.getActionPlanner() as McwActionPlanner).setStateRequestingPlayerBeginTurn();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The 'true' executors for war actions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _exePlayerBeginTurn(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(Lang.getFormattedText(Lang.Type.F0022, await war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn()));

        await war.getTurnManager().endPhaseWaitBeginTurn(data.ActionPlayerBeginTurn);

        actionPlanner.setStateIdle();
    }

    async function _exePlayerDeleteUnit(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action    = data.ActionPlayerDeleteUnit;
        const gridIndex = action.gridIndex as GridIndex;
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
            DestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
        }

        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerEndTurn(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionPlayerEndTurn;
        await war.getTurnManager().endPhaseMain(action);

        if (war.getPlayerInTurn() === war.getPlayerLoggedIn()) {
            (actionPlanner as McwActionPlanner).setStateRequestingPlayerBeginTurn();
        } else {
            actionPlanner.setStateIdle();
        }
    }

    async function _exePlayerProduceUnit(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionPlayerProduceUnit;
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

        const unit = (new (unitMap.getUnitClass())).init(unitData, war.getConfigVersion());
        unit.startRunning(war);
        unit.startRunningView();
        unitMap.setUnitOnMap(unit);
        unitMap.setNextUnitId(unitId + 1);
        playerInTurn.setFund(playerInTurn.getFund() - extraData.cost);

        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerSurrender(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.ActionPlayerSurrender;
        const player = war.getPlayerInTurn();
        DestructionHelpers.destroyPlayerForce(war, player.getPlayerIndex(), true);
        FloatText.show(Lang.getFormattedText(action.isBoot ? Lang.Type.F0028: Lang.Type.F0008, await player.getNickname()));

        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exePlayerVoteForDraw(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action        = data.ActionPlayerVoteForDraw;
        const playerInTurn  = war.getPlayerInTurn();
        const nickname      = await playerInTurn.getNickname();
        playerInTurn.setHasVotedForDraw(true);

        if (!action.isAgree) {
            FloatText.show(Lang.getFormattedText(Lang.Type.F0017, nickname));
            war.setRemainingVotesForDraw(undefined);
        } else {
            if (war.getRemainingVotesForDraw()) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0018, nickname));
            } else {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0019, nickname));
            }
            war.setRemainingVotesForDraw((war.getRemainingVotesForDraw() || war.getPlayerManager().getAlivePlayersCount(false)) - 1);
        }

        actionPlanner.setStateIdle();
    }

    async function _exeUnitAttackUnit(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitAttackUnit;
        const extraData     = action.extraData;
        actionPlanner.setStateExecutingAction();
        BwHelpers.updateTilesAndUnitsBeforeExecutingAction(war, extraData);

        // const path      = action.path as MovePath;
        // const pathNodes = path.nodes;
        // const unitMap   = war.getUnitMap();
        // const attacker  = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        // moveUnit(war, WarActionCodes.WarActionUnitAttack, path, action.launchUnitId, path.fuelConsumption);
        // attacker.setActionState(UnitState.Acted);

        // if (path.isBlocked) {
        //     return new Promise<void>(resolve => {
        //         attacker.moveViewAlongPath(pathNodes, attacker.getIsDiving(), true, () => {
        //             attacker.updateView();
        //             McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

        //             actionPlanner.setStateIdle();
        //             resolve();
        //         });
        //     });
        // } else {
        //     const counterDamage     = action.counterDamage;
        //     const targetGridIndex   = action.targetGridIndex as GridIndex;
        //     const tileMap           = war.getTileMap() as McwTileMap;
        //     const attackTarget      = unitMap.getUnitOnMap(targetGridIndex) || tileMap.getTile(targetGridIndex);
        //     const targetUnit        = attackTarget instanceof McwUnit ? attackTarget : undefined;

        //     if (attacker.getPrimaryWeaponBaseDamage(attackTarget.getArmorType()) != null) {
        //         attacker.setPrimaryWeaponCurrentAmmo(attacker.getPrimaryWeaponCurrentAmmo()! - 1);
        //     }
        //     if ((counterDamage != null) && (targetUnit) && (targetUnit.getPrimaryWeaponBaseDamage(attacker.getArmorType()) != null)) {
        //         targetUnit.setPrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponCurrentAmmo()! - 1);
        //     }

        //     // TODO: deal with skills and energy.

        //     const attackerOldHp = attacker.getCurrentHp();
        //     const attackerNewHp = Math.max(0, attackerOldHp - (counterDamage || 0));
        //     attacker.setCurrentHp(attackerNewHp);
        //     if ((attackerNewHp === 0) && (targetUnit)) {
        //         targetUnit.addPromotion();
        //     }

        //     const targetOldHp   = attackTarget.getCurrentHp()!;
        //     const targetNewHp   = Math.max(0, targetOldHp - action.attackDamage);
        //     attackTarget.setCurrentHp(targetNewHp);
        //     if ((targetNewHp === 0) && (targetUnit)) {
        //         attacker.addPromotion();
        //     }

        //     const destination       = pathNodes[pathNodes.length - 1];
        //     const attackerPlayer    = war.getPlayer(attacker.getPlayerIndex())!;
        //     if (targetUnit) {
        //         const configVersion         = war.getConfigVersion();
        //         const targetLostHp          = Helpers.getNormalizedHp(targetOldHp) - Helpers.getNormalizedHp(targetNewHp);
        //         const attackerCoGridIndex   = attackerPlayer.getCoGridIndexListOnMap();
        //         const isAttackerInCoZone    = (attacker.getUnitId() === attackerPlayer.getCoUnitId()) || (attackerPlayer.checkIsInCoZone(destination, attackerCoGridIndex));
        //         if ((targetLostHp > 0)                              &&
        //             (attackerPlayer.getCoId() != null)              &&
        //             (!attackerPlayer.checkCoIsUsingActiveSkill())   &&
        //             (isAttackerInCoZone)
        //         ) {
        //             attackerPlayer.setCoCurrentEnergy(Math.min(
        //                 attackerPlayer.getCoMaxEnergy(),
        //                 attackerPlayer.getCoCurrentEnergy() + Math.floor(targetLostHp * war.getSettingsEnergyGrowthMultiplier() / 100)
        //             ));
        //         }
        //         const attackerUnitType = attacker.getType();
        //         for (const skillId of attackerPlayer.getCoCurrentSkills() || []) {
        //             const cfg = Utility.ConfigManager.getCoSkillCfg(configVersion, skillId)!.promotionBonusByAttack;
        //             if ((cfg)                                                                           &&
        //                 (targetLostHp >= cfg[2])                                                        &&
        //                 (Utility.ConfigManager.checkIsUnitTypeInCategory(configVersion, attackerUnitType, cfg[1]))
        //             ) {
        //                 if (cfg[0] === Types.CoSkillAreaType.Zone) {
        //                     if (isAttackerInCoZone) {
        //                         attacker.addPromotion();
        //                     }
        //                 } else if (cfg[0] === Types.CoSkillAreaType.OnMap) {
        //                     if (!!attackerCoGridIndex) {
        //                         attacker.addPromotion();
        //                     }
        //                 }
        //             }
        //         }

        //         const targetPlayer      = war.getPlayer(targetUnit.getPlayerIndex())!;
        //         const targetCoGridIndex = targetPlayer.getCoGridIndexListOnMap();
        //         const attackerLostHp    = Helpers.getNormalizedHp(attackerOldHp) - Helpers.getNormalizedHp(attackerNewHp);
        //         if ((attackerLostHp > 0)                                        &&
        //             (targetPlayer.getCoId() != null)                            &&
        //             (!targetPlayer.checkCoIsUsingActiveSkill())                 &&
        //             (targetPlayer.checkIsInCoZone(destination, targetCoGridIndex))
        //         ) {
        //             targetPlayer.setCoCurrentEnergy(Math.min(
        //                 targetPlayer.getCoMaxEnergy(),
        //                 targetPlayer.getCoCurrentEnergy() + Math.floor(attackerLostHp * war.getSettingsEnergyGrowthMultiplier() / 100)
        //             ));
        //         }
        //         const isTargetInCoZone  = targetPlayer.checkIsInCoZone(targetGridIndex, targetCoGridIndex);
        //         const targetUnitType    = targetUnit.getType();
        //         for (const skillId of targetPlayer.getCoCurrentSkills() || []) {
        //             const cfg = Utility.ConfigManager.getCoSkillCfg(configVersion, skillId)!.promotionBonusByAttack;
        //             if ((cfg)                                                                           &&
        //                 (attackerLostHp >= cfg[2])                                                      &&
        //                 (Utility.ConfigManager.checkIsUnitTypeInCategory(configVersion, targetUnitType, cfg[1]))
        //             ) {
        //                 if (cfg[0] === Types.CoSkillAreaType.Zone) {
        //                     if (isTargetInCoZone) {
        //                         targetUnit.addPromotion();
        //                     }
        //                 } else if (cfg[0] === Types.CoSkillAreaType.OnMap) {
        //                     if (!!targetCoGridIndex) {
        //                         targetUnit.addPromotion();
        //                     }
        //                 }
        //             }
        //         }
        //     }

        //     const configVersion             = war.getConfigVersion();
        //     const attackerUnitAfterAction   = action.attackerUnitAfterAction as Types.SerializedUnit;
        //     if (attackerUnitAfterAction) {
        //         attacker.init(attackerUnitAfterAction, configVersion);
        //         attacker.startRunning(war);
        //     }
        //     const targetUnitAfterAction = action.targetUnitAfterAction as Types.SerializedUnit;
        //     if (targetUnitAfterAction) {
        //         targetUnit.init(targetUnitAfterAction, configVersion);
        //         targetUnit.startRunning(war);
        //     }
        //     if (action.attackerCoEnergy != null) {
        //         attackerPlayer.setCoCurrentEnergy(action.attackerCoEnergy);
        //     }
        //     if (action.targetCoEnergy != null) {
        //         war.getPlayer(targetUnit.getPlayerIndex())!.setCoCurrentEnergy(action.targetCoEnergy);
        //     }

        //     const lostPlayerIndex   = action.lostPlayerIndex;
        //     const gridVisionEffect  = war.getGridVisionEffect();

        //     return new Promise<void>(resolve => {
        //         attacker.moveViewAlongPath(pathNodes, attacker.getIsDiving(), false, () => {
        //             if (attackerNewHp > 0) {
        //                 attacker.updateView();
        //                 if ((counterDamage != null) && (targetNewHp > 0)) {
        //                     gridVisionEffect.showEffectDamage(destination);
        //                 }
        //             } else {
        //                 DestructionHelpers.destroyUnitOnMap(war, destination, true);
        //             }

        //             if (targetNewHp > 0) {
        //                 attackTarget.flushDataToView();
        //                 gridVisionEffect.showEffectDamage(targetGridIndex);
        //             } else {
        //                 if (targetUnit) {
        //                     DestructionHelpers.destroyUnitOnMap(war, targetGridIndex, true);
        //                 } else {
        //                     if ((attackTarget as McwTile).getType() === TileType.Meteor) {
        //                         for (const gridIndex of BwHelpers.getAdjacentPlasmas(tileMap, targetGridIndex)) {
        //                             const plasma = tileMap.getTile(gridIndex);
        //                             plasma.destroyTileObject();
        //                             plasma.flushDataToView();
        //                             gridVisionEffect.showEffectExplosion(gridIndex);
        //                         }
        //                     }
        //                     (attackTarget as McwTile).destroyTileObject();
        //                     attackTarget.flushDataToView();
        //                     gridVisionEffect.showEffectExplosion(targetGridIndex);
        //                 }
        //             }

        //             if (lostPlayerIndex) {
        //                 FloatText.show(Lang.getFormattedText(Lang.Type.F0015, await war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
        //                 DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
        //             }

        //             McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

        //             actionPlanner.setStateIdle();
        //             resolve();
        //         }, targetGridIndex);
        //     });
        // }
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
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
                lostPlayerIndex,
            } = extraData;

            // Handle animation and destruction.
            await attackerUnit.moveViewAlongPath(pathNodes, attackerUnit.getIsDiving(), false, targetGridIndex);
            attackerUnit.getPlayer().setCoCurrentEnergy(extraData.attackerCoEnergyAfterAction);
            targetUnit.getPlayer().setCoCurrentEnergy(extraData.targetCoEnergyAfterAction);

            const gridVisionEffect = war.getGridVisionEffect();
            if (attackerUnitAfterAction) {
                attackerUnit.init(attackerUnitAfterAction, attackerUnit.getConfigVersion());
                attackerUnit.updateView();
                if (counterDamage != null) {
                    gridVisionEffect.showEffectDamage(attackerGridIndex);
                }
            } else {
                DestructionHelpers.destroyUnitOnMap(war, attackerGridIndex, true);
            }

            if (targetUnitAfterAction) {
                targetUnit.init(targetUnitAfterAction, targetUnit.getConfigVersion());
                targetUnit.updateView();
                gridVisionEffect.showEffectDamage(targetGridIndex);
            } else {
                DestructionHelpers.destroyUnitOnMap(war, targetGridIndex, true);
            }

            if (lostPlayerIndex != null) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0015, await war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
            }

            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitAttackTile(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitAttackTile;
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
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

            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitBeLoaded(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitBeLoaded;
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        } else {
            const loaderUnit = unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]);
            unitMap.setUnitLoaded(focusUnit);
            focusUnit.setLoaderUnitId(loaderUnit.getUnitId());

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();
            focusUnit.setViewVisible(false);
            loaderUnit.updateView();
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitBuildTile(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitBuildTile;
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
                    targetTileCfg.dstBaseType,
                    targetTileCfg.dstObjectType,
                    focusUnit.getPlayerIndex(),
                );
            }
        }

        await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
        focusUnit.updateView();
        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitCaptureTile(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitCaptureTile;
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
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
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
                actionPlanner.setStateIdle();

            } else {
                await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false);
                focusUnit.updateView();
                tile.flushDataToView();
                FloatText.show(Lang.getFormattedText(Lang.Type.F0016, await war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
                actionPlanner.setStateIdle();
            }
        }
    }

    async function _exeUnitDive(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitDive;
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
                unitType            : focusUnit.getType(),
                unitPlayerIndex     : focusUnit.getPlayerIndex(),
                gridIndex           : endingGridIndex,
                observerTeamIndexes : war.getPlayerManager().getAliveWatcherTeamIndexesForSelf(),
                isDiving            : false,
            })) {
                war.getGridVisionEffect().showEffectDive(endingGridIndex);
            }
        }

        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitDrop(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitDrop;
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
            promises.push(unitForDrop.moveViewAlongPath(
                [endingGridIndex, unitForDrop.getGridIndex()],
                unitForDrop.getIsDiving(),
                false,
            ));
        }
        await Promise.all(promises);
        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitJoin(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitJoin;
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitLaunchFlare(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitLaunchFlare;
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
        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitLaunchSilo(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitLaunchSilo;
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitLoadCo(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitLoadCo;
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
            const initialEnergyPercentage   = war.getSettingsInitialEnergyPercentage(playerIndex);
            if (initialEnergyPercentage == null) {
                Logger.error(`McwModel._exeUnitLoadCo() empty initialEnergyPercentage.`);
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
        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitProduceUnit(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitProduceUnit;
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
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
            player.setFund(player.getFund() - extraData.cost);
            unitMap.setNextUnitId(producedUnitId + 1);
            unitMap.setUnitLoaded(producedUnit);
            focusUnit.setCurrentProduceMaterial(focusUnit.getCurrentProduceMaterial()! - 1);

            await focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked);
            focusUnit.updateView();
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitSupply(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitSupply;
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
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

            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
            actionPlanner.setStateIdle();
        }
    }

    async function _exeUnitSurface(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitSurface;
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
                unitType            : focusUnit.getType(),
                unitPlayerIndex     : focusUnit.getPlayerIndex(),
                gridIndex           : endingGridIndex,
                observerTeamIndexes : war.getPlayerManager().getAliveWatcherTeamIndexesForSelf(),
                isDiving            : false,
            })) {
                war.getGridVisionEffect().showEffectSurface(endingGridIndex);
            }
        }

        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }

    async function _exeUnitUseCoSkill(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitUseCoSkill;
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
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
            McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

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

    async function _exeUnitWait(war: McwWar, data: ActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        const action        = data.ActionUnitWait;
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
        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        actionPlanner.setStateIdle();
    }
}
