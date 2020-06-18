
namespace TinyWars.MultiCustomWar.McwModel {
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
    import Notify               = Utility.Notify;
    import WarActionContainer   = ProtoTypes.IWarActionContainer;
    import BwHelpers            = BaseWar.BwHelpers;
    import AlertPanel           = Common.CommonAlertPanel;
    import GridIndex            = Types.GridIndex;
    import SerializedMcwTile    = Types.SerializedTile;
    import SerializedMcwUnit    = Types.SerializedUnit;
    import UnitState            = Types.UnitActionState;
    import MovePath             = Types.MovePath;
    import TileType             = Types.TileType;

    const _EXECUTORS = new Map<WarActionCodes, (war: McwWar, data: WarActionContainer) => Promise<void>>([
        [WarActionCodes.WarActionPlayerBeginTurn,       _executeMcwPlayerBeginTurn],
        [WarActionCodes.WarActionPlayerDeleteUnit,      _executeMcwPlayerDeleteUnit],
        [WarActionCodes.WarActionPlayerEndTurn,         _executeMcwPlayerEndTurn],
        [WarActionCodes.WarActionPlayerProduceUnit,     _executeMcwPlayerProduceUnit],
        [WarActionCodes.WarActionPlayerSurrender,       _executeMcwPlayerSurrender],
        [WarActionCodes.WarActionPlayerVoteForDraw,     _executeMcwPlayerVoteForDraw],
        [WarActionCodes.WarActionUnitAttack,            _executeMcwUnitAttack],
        [WarActionCodes.WarActionUnitBeLoaded,          _executeMcwUnitBeLoaded],
        [WarActionCodes.WarActionUnitBuildTile,         _executeMcwUnitBuildTile],
        [WarActionCodes.WarActionUnitCaptureTile,       _executeMcwUnitCaptureTile],
        [WarActionCodes.WarActionUnitDive,              _executeMcwUnitDive],
        [WarActionCodes.WarActionUnitDrop,              _executeMcwUnitDrop],
        [WarActionCodes.WarActionUnitJoin,              _executeMcwUnitJoin],
        [WarActionCodes.WarActionUnitLaunchFlare,       _executeMcwUnitLaunchFlare],
        [WarActionCodes.WarActionUnitLaunchSilo,        _executeMcwUnitLaunchSilo],
        [WarActionCodes.WarActionUnitLoadCo,            _executeMcwUnitLoadCo],
        [WarActionCodes.WarActionUnitProduceUnit,       _executeMcwUnitProduceUnit],
        [WarActionCodes.WarActionUnitSupply,            _executeMcwUnitSupply],
        [WarActionCodes.WarActionUnitSurface,           _executeMcwUnitSurface],
        [WarActionCodes.WarActionUnitUseCoSkill,        _executeMcwUnitUseCoSkill],
        [WarActionCodes.WarActionUnitWait,              _executeMcwUnitWait],
    ]);

    let _war            : McwWar;
    let _cachedActions  = new Array<WarActionContainer>();

    export function init(): void {
        Notify.addEventListeners([
            { type: Notify.Type.SMmMergeMap, callback: _onNotifySMmMergeMap, thisObject: McwModel },
        ]);
    }

    function _onNotifySMmMergeMap(e: egret.Event): void {
        const data  = e.data as ProtoTypes.IS_MmMergeMap;
        const war   = getWar();
        if ((war) && (war.getMapFileName() === data.srcMapFileName)) {
            war.setMapFileName(data.dstMapFileName);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(data: Types.SerializedWar): Promise<McwWar> {
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
    export async function updateOnPlayerSyncWar(data: ProtoTypes.IS_McwPlayerSyncWar): Promise<void> {
        const war = getWar();
        if ((war) && (war.getWarId() === data.warId)) {
            const status = data.status as Types.SyncWarStatus;
            if (status === Types.SyncWarStatus.Defeated) {
                war.setIsEnded(true);
                AlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0023),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });

            } else if (status === Types.SyncWarStatus.EndedOrNotExists) {
                war.setIsEnded(true);
                AlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0035),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });

            } else if (status === Types.SyncWarStatus.NoError) {
                const requestType = data.requestType as Types.SyncWarRequestType;
                if (requestType === Types.SyncWarRequestType.PlayerForce) {
                    war.setIsEnded(true);
                    await Utility.FlowManager.gotoMultiCustomWar(data.war as Types.SerializedWar),
                    FloatText.show(Lang.getText(Lang.Type.A0038));

                } else {
                    const cachedActionsCount = _cachedActions.length;
                    if (data.nextActionId !== war.getNextActionId() + cachedActionsCount) {
                        war.setIsEnded(true);
                        await Utility.FlowManager.gotoMultiCustomWar(data.war as Types.SerializedWar);
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
                AlertPanel.show({
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
                AlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0037),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });
            }
        }
    }

    export function updateOnPlayerBeginTurn(data: ProtoTypes.IS_McwPlayerBeginTurn): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnPlayerDeleteUnit(data: ProtoTypes.IS_McwPlayerDeleteUnit): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnPlayerEndTurn(data: ProtoTypes.IS_McwPlayerEndTurn): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnPlayerSurrender(data: ProtoTypes.IS_McwPlayerSurrender): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnPlayerVoteForDraw(data: ProtoTypes.IS_McwPlayerVoteForDraw): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnPlayerProduceUnit(data: ProtoTypes.IS_McwPlayerProduceUnit): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitAttack(data: ProtoTypes.IS_McwUnitAttack): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitBeLoaded(data: ProtoTypes.IS_McwUnitBeLoaded): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitBuildTile(data: ProtoTypes.IS_McwUnitBuildTile): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitCaptureTile(data: ProtoTypes.IS_McwUnitCaptureTile): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitDive(data: ProtoTypes.IS_McwUnitDive): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitDrop(data: ProtoTypes.IS_McwUnitDrop): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitJoin(data: ProtoTypes.IS_McwUnitJoin): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitLaunchFlare(data: ProtoTypes.IS_McwUnitLaunchFlare): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitLaunchSilo(data: ProtoTypes.IS_McwUnitLaunchSilo): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitLoadCo(data: ProtoTypes.IS_McwUnitLoadCo): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitProduceUnit(data: ProtoTypes.IS_McwUnitProduceUnit): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitSupply(data: ProtoTypes.IS_McwUnitSupply): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitSurface(data: ProtoTypes.IS_McwUnitSurface): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitUseCoSkill(data: ProtoTypes.IS_McwUnitUseCoSkill): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }
    export function updateOnUnitWait(data: ProtoTypes.IS_McwUnitWait): void {
        _updateByActionContainer(data.actionContainer, data.warId);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _updateByActionContainer(container: WarActionContainer, warId: number): void {
        const war = getWar();
        if ((war) && (war.getWarId() === warId)) {
            if (container.actionId !== war.getNextActionId() + _cachedActions.length) {
                McwProxy.reqMcwPlayerSyncWar(war, Types.SyncWarRequestType.ReconnectionRequest);
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
            war.setNextActionId(war.getNextActionId() + 1);
            await _EXECUTORS.get(Helpers.getWarActionCode(container))(war, container);
            war.setIsExecutingAction(false);

            if (war.getIsRunning()) {
                if (!war.checkHasAliveWatcherTeam(User.UserModel.getSelfUserId())) {
                    war.setIsEnded(true);
                    AlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0035),
                        content : Lang.getText(Lang.Type.A0023),
                        callback: () => Utility.FlowManager.gotoLobby(),
                    });

                } else {
                    if (war.getRemainingVotesForDraw() === 0) {
                        war.setIsEnded(true);
                        AlertPanel.show({
                            title   : Lang.getText(Lang.Type.B0082),
                            content : Lang.getText(Lang.Type.A0030),
                            callback: () => Utility.FlowManager.gotoLobby(),
                        });

                    } else {
                        if (war.getPlayerManager().getAliveTeamsCount(false) <= 1) {
                            war.setIsEnded(true);
                            AlertPanel.show({
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
    async function _executeMcwPlayerBeginTurn(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(Lang.getFormattedText(Lang.Type.F0022, war.getPlayerInTurn().getNickname(), war.getPlayerIndexInTurn()));

        await war.getTurnManager().endPhaseWaitBeginTurn(data);
        actionPlanner.setStateIdle();
    }

    async function _executeMcwPlayerDeleteUnit(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action    = data.WarActionPlayerDeleteUnit;
        const gridIndex = action.gridIndex as GridIndex;
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
            DestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
        }

        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

        actionPlanner.setStateIdle();
    }

    async function _executeMcwPlayerEndTurn(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        await war.getTurnManager().endPhaseMain();

        const action = data.WarActionPlayerEndTurn;
        war.getPlayerManager().setListForRestTimeToBoot(action.listForRestTimeToBoot);

        if (war.getPlayerInTurn() === war.getPlayerLoggedIn()) {
            (actionPlanner as McwActionPlanner).setStateRequestingPlayerBeginTurn();
        } else {
            actionPlanner.setStateIdle();
        }
    }

    async function _executeMcwPlayerProduceUnit(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionPlayerProduceUnit;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const gridIndex     = action.gridIndex as GridIndex;
        const unitMap       = war.getUnitMap();
        const unitId        = unitMap.getNextUnitId();
        const playerInTurn  = war.getPlayerInTurn();
        const unitData      = action.unitData as Types.SerializedUnit;

        if (unitData) {
            const unit = new McwUnit().init(unitData, war.getConfigVersion());
            unit.startRunning(war);
            unit.startRunningView();

            unitMap.addUnitOnMap(unit);

        } else if ((gridIndex) && (action.unitType != null)) {
            // TODO: take skills into account.
            const playerIndex   = playerInTurn.getPlayerIndex();
            const unit          = new McwUnit().init({
                unitId,
                viewId  : Utility.ConfigManager.getUnitViewId(action.unitType, playerIndex)!,
                gridX   : gridIndex.x,
                gridY   : gridIndex.y,
            }, war.getConfigVersion());
            unit.setActionState(UnitState.Acted);
            unit.startRunning(war);
            unit.startRunningView();

            unitMap.addUnitOnMap(unit);
        }

        unitMap.setNextUnitId(unitId + 1);
        playerInTurn.setFund(playerInTurn.getFund() - action.cost);

        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

        actionPlanner.setStateIdle();
    }

    async function _executeMcwPlayerSurrender(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const player = war.getPlayerInTurn();
        DestructionHelpers.destroyPlayerForce(war, player.getPlayerIndex(), true);
        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
        FloatText.show(Lang.getFormattedText(Lang.Type.F0008, player.getNickname()));

        actionPlanner.setStateIdle();
    }

    async function _executeMcwPlayerVoteForDraw(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const playerInTurn = war.getPlayerInTurn();
        playerInTurn.setHasVotedForDraw(true);

        if (!data.WarActionPlayerVoteForDraw.isAgree) {
            FloatText.show(Lang.getFormattedText(Lang.Type.F0017, playerInTurn.getNickname()));
            war.setRemainingVotesForDraw(undefined);
        } else {
            if (war.getRemainingVotesForDraw()) {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0018, playerInTurn.getNickname()));
            } else {
                FloatText.show(Lang.getFormattedText(Lang.Type.F0019, playerInTurn.getNickname()));
            }
            war.setRemainingVotesForDraw((war.getRemainingVotesForDraw() || war.getPlayerManager().getAlivePlayersCount(false)) - 1);
        }

        actionPlanner.setStateIdle();
    }

    async function _executeMcwUnitAttack(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitAttack;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = war.getUnitMap();
        const attacker  = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitAttack, path, action.launchUnitId, path.fuelConsumption);
        attacker.setActionState(UnitState.Acted);

        if (path.isBlocked) {
            return new Promise<void>(resolve => {
                attacker.moveViewAlongPath(pathNodes, attacker.getIsDiving(), true, () => {
                    attacker.updateView();
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        } else {
            const counterDamage     = action.counterDamage;
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tileMap           = war.getTileMap() as McwTileMap;
            const attackTarget      = unitMap.getUnitOnMap(targetGridIndex) || tileMap.getTile(targetGridIndex);
            const targetUnit        = attackTarget instanceof McwUnit ? attackTarget : undefined;

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
                            if ((attackTarget as McwTile).getType() === TileType.Meteor) {
                                for (const gridIndex of getAdjacentPlasmas(tileMap, targetGridIndex)) {
                                    const plasma = tileMap.getTile(gridIndex);
                                    plasma.destroyTileObject();
                                    plasma.updateView();
                                    gridVisionEffect.showEffectExplosion(gridIndex);
                                }
                            }
                            (attackTarget as McwTile).destroyTileObject();
                            attackTarget.updateView();
                            gridVisionEffect.showEffectExplosion(targetGridIndex);
                        }
                    }

                    if (lostPlayerIndex) {
                        FloatText.show(Lang.getFormattedText(Lang.Type.F0015, war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                        DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
                    }

                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                }, targetGridIndex);
            });
        }
    }

    async function _executeMcwUnitBeLoaded(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitBeLoaded;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        const loaderUnit    = path.isBlocked ? undefined : unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]);
        moveUnit(war, WarActionCodes.WarActionUnitBeLoaded, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);
        (loaderUnit) && (focusUnit.setLoaderUnitId(loaderUnit.getUnitId()));

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                focusUnit.updateView();
                focusUnit.setViewVisible(false);
                (loaderUnit) && (loaderUnit.updateView());
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                actionPlanner.setStateIdle();
                resolve();
            });
        })
    }

    async function _executeMcwUnitBuildTile(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitBuildTile;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitBuildTile, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);

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
                focusUnit.setIsBuildingTile(false);
                focusUnit.setCurrentBuildMaterial(focusUnit.getCurrentBuildMaterial() - 1);
                tile.resetByObjectViewIdAndBaseViewId(focusUnit.getBuildTargetTileObjectViewId(tile.getType()));
            }
        }

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                focusUnit.updateView();
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                actionPlanner.setStateIdle();
                resolve();
            })
        });
    }

    async function _executeMcwUnitCaptureTile(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitCaptureTile;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitCaptureTile, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);

        if (path.isBlocked) {
            return new Promise<void>(resolve => {
                focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), true, () => {
                    focusUnit.updateView();
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
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
                const playerIndexActing = focusUnit.getPlayerIndex();
                focusUnit.setIsCapturingTile(false);
                tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
                tile.resetByPlayerIndex(playerIndexActing);
            }

            if (!lostPlayerIndex) {
                return new Promise<void>(resolve => {
                    focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false, () => {
                        focusUnit.updateView();
                        tile.updateView();
                        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                        actionPlanner.setStateIdle();
                        resolve();
                    });
                });
            } else {
                return new Promise<void>(resolve => {
                    focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false, () => {
                        focusUnit.updateView();
                        tile.updateView();
                        FloatText.show(Lang.getFormattedText(Lang.Type.F0016, war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                        DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
                        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                        actionPlanner.setStateIdle();
                        resolve();
                    });
                });
            }
        }
    }

    async function _executeMcwUnitDive(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitDive;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const focusUnit     = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        const isSuccessful  = !path.isBlocked;
        moveUnit(war, WarActionCodes.WarActionUnitDive, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(true));

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, false, path.isBlocked, () => {
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
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                actionPlanner.setStateIdle();
                resolve();
            });
        });
    }

    async function _executeMcwUnitDrop(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitDrop;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path              = action.path as MovePath;
        const pathNodes         = path.nodes;
        const unitMap           = war.getUnitMap();
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitDrop, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);

        const shouldUpdateFogMap    = war.getWatcherTeamIndexes(User.UserModel.getSelfUserId()).has(focusUnit.getTeamIndex());
        const fogMap                = war.getFogMap();
        const unitsForDrop          = [] as McwUnit[];
        for (const { unitId, gridIndex } of (action.dropDestinations || []) as Types.DropDestination[]) {
            const unitForDrop = unitMap.getUnitLoadedById(unitId) as McwUnit;
            unitMap.setUnitUnloaded(unitId, gridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                unit.setGridIndex(gridIndex);
            }

            unitForDrop.setLoaderUnitId(undefined);
            unitForDrop.setGridIndex(gridIndex);
            unitForDrop.setActionState(UnitState.Acted);
            unitsForDrop.push(unitForDrop);

            if (shouldUpdateFogMap) {
                fogMap.updateMapFromPathsByUnitAndPath(unitForDrop, [endingGridIndex, gridIndex]);
            }
        }

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                if ((action.isDropBlocked)                              &&
                    (VisibilityHelpers.checkIsUnitOnMapVisibleToUser({
                        war,
                        gridIndex       : endingGridIndex,
                        unitType        : focusUnit.getType(),
                        isDiving        : focusUnit.getIsDiving(),
                        unitPlayerIndex : focusUnit.getPlayerIndex(),
                        observerUserId  : User.UserModel.getSelfUserId(),
                    }))
                ) {
                    war.getGridVisionEffect().showEffectBlock(endingGridIndex);
                }
                focusUnit.updateView();

                const promises = [] as Promise<void>[];
                for (const unitForDrop of unitsForDrop) {
                    promises.push(new Promise<void>(r => {
                        unitForDrop.moveViewAlongPath(
                            [endingGridIndex, unitForDrop.getGridIndex()],
                            unitForDrop.getIsDiving(),
                            false,
                            () => {
                                unitForDrop.updateView();
                                r();
                            }
                        );
                    }));
                }
                Promise.all(promises).then(() => {
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        });
    }

    async function _executeMcwUnitJoin(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitJoin;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path              = action.path as MovePath;
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const unitMap           = war.getUnitMap();
        const focusUnit         = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        const targetUnit        = path.isBlocked ? undefined : unitMap.getUnitOnMap(endingGridIndex);
        moveUnit(war, WarActionCodes.WarActionUnitJoin, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);

        if (targetUnit) {
            const player = war.getPlayer(focusUnit.getPlayerIndex())!;
            if (player.getCoUnitId() === targetUnit.getUnitId()) {
                player.setCoUnitId(focusUnit.getUnitId());
            }

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
                (joinedNormalizedHp - 1) * Utility.ConfigManager.UNIT_HP_NORMALIZER + 1,
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
        }

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                focusUnit.updateView();
                (targetUnit) && (unitMap.getView().removeUnit(targetUnit.getView()));
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                actionPlanner.setStateIdle();
                resolve();
            });
        });
    }

    async function _executeMcwUnitLaunchFlare(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitLaunchFlare;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitLaunchFlare, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);

        const isFlareSucceeded  = !path.isBlocked;
        const targetGridIndex   = action.targetGridIndex as GridIndex;
        const flareRadius       = focusUnit.getFlareRadius();
        if (isFlareSucceeded) {
            focusUnit.setFlareCurrentAmmo(focusUnit.getFlareCurrentAmmo() - 1);
            war.getFogMap().updateMapFromPathsByFlare(focusUnit.getPlayerIndex(), targetGridIndex, flareRadius);
        }

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                if ((isFlareSucceeded) && (war.getWatcherTeamIndexes(User.UserModel.getSelfUserId()).has(focusUnit.getTeamIndex()))) {
                    const effect = war.getGridVisionEffect();
                    for (const grid of GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, flareRadius, war.getTileMap().getMapSize())) {
                        effect.showEffectFlare(grid);
                    }
                }

                focusUnit.updateView();
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                actionPlanner.setStateIdle();
                resolve();
            });
        });
    }

    async function _executeMcwUnitLaunchSilo(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitLaunchSilo;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = war.getUnitMap();
        const focusUnit = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitLaunchSilo, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);

        if (path.isBlocked) {
            return new Promise<void>(resolve => {
                focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                    focusUnit.updateView();
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        } else {
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tile              = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
            tile.resetByObjectViewIdAndBaseViewId(focusUnit.getTileObjectViewIdAfterLaunchSilo());

            const targetGrids   = GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, Utility.ConfigManager.SILO_RADIUS, unitMap.getMapSize());
            const targetUnits   = [] as McwUnit[];
            for (const grid of targetGrids) {
                const unit = unitMap.getUnitOnMap(grid) as McwUnit;
                if (unit) {
                    targetUnits.push(unit);
                    unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - Utility.ConfigManager.SILO_DAMAGE));
                }
            }

            return new Promise<void>(resolve => {
                focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                    const effect = war.getGridVisionEffect();
                    for (const grid of targetGrids) {
                        effect.showEffectSiloExplosion(grid);
                    }
                    for (const unit of targetUnits) {
                        unit.updateView();
                    }

                    focusUnit.updateView();
                    tile.updateView();
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        }
    }

    async function _executeMcwUnitLoadCo(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitLoadCo;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitLoadCo, path, action.launchUnitId, path.fuelConsumption);

        if (path.isBlocked) {
            focusUnit.setActionState(UnitState.Acted);
        } else {
            focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());

            const player    = war.getPlayer(focusUnit.getPlayerIndex())!;
            const maxEnergy = player.getCoMaxEnergy();
            player.setFund(player.getFund() - focusUnit.getLoadCoCost()!);
            player.setCoUnitId(focusUnit.getUnitId());
            player.setCoCurrentEnergy(maxEnergy == null ? 0 : Math.floor(maxEnergy * war.getSettingsInitialEnergy() / 100));
            player.setCoUsingSkillType(Types.CoSkillType.Passive);
        }

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                focusUnit.updateView();
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                actionPlanner.setStateIdle();
                resolve();
            });
        });
    }

    async function _executeMcwUnitProduceUnit(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitProduceUnit;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitProduceUnit, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);

        if (path.isBlocked) {
            return new Promise<void>(resolve => {
                focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                    focusUnit.updateView();
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        } else {
            // TODO: take skills into account.
            const gridIndex         = focusUnit.getGridIndex();
            const producedUnitId    = unitMap.getNextUnitId();
            const producedUnit      = new McwUnit().init({
                unitId      : producedUnitId,
                viewId      : Utility.ConfigManager.getUnitViewId(focusUnit.getProduceUnitType(), focusUnit.getPlayerIndex())!,
                gridX       : gridIndex.x,
                gridY       : gridIndex.y,
                loaderUnitId: focusUnit.getUnitId(),
            }, war.getConfigVersion());
            producedUnit.startRunning(war);
            producedUnit.setActionState(Types.UnitActionState.Acted);

            const player = war.getPlayerInTurn();
            player.setFund(player.getFund() - action.cost);
            unitMap.setNextUnitId(producedUnitId + 1);
            unitMap.addUnitLoaded(producedUnit);
            focusUnit.setCurrentProduceMaterial(focusUnit.getCurrentProduceMaterial()! - 1);

            return new Promise<void>(resolve => {
                focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                    focusUnit.updateView();
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        }
    }

    async function _executeMcwUnitSupply(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitSupply;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = war.getUnitMap();
        const focusUnit = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitSupply, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);

        if (path.isBlocked) {
            return new Promise<void>(resolve => {
                focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                    focusUnit.updateView();
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        } else {
            const suppliedUnits = [] as McwUnit[];
            const playerIndex   = focusUnit.getPlayerIndex();
            for (const gridIndex of GridIndexHelpers.getAdjacentGrids(pathNodes[pathNodes.length - 1], unitMap.getMapSize())) {
                const unit = unitMap.getUnitOnMap(gridIndex) as McwUnit;
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

            return new Promise<void>(resolve => {
                focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                    focusUnit.updateView();

                    const gridVisionEffect = war.getGridVisionEffect();
                    for (const unit of suppliedUnits) {
                        unit.updateView();
                        gridVisionEffect.showEffectSupply(unit.getGridIndex());
                    }

                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        }
    }

    async function _executeMcwUnitSurface(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitSurface;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const focusUnit     = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        const isSuccessful  = !path.isBlocked;
        moveUnit(war, WarActionCodes.WarActionUnitSurface, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(false));

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, true, path.isBlocked, () => {
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
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                actionPlanner.setStateIdle();
                resolve();
            });
        });
    }

    async function _executeMcwUnitUseCoSkill(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitUseCoSkill;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const focusUnit     = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        const isSuccessful  = !path.isBlocked;
        moveUnit(war, WarActionCodes.WarActionUnitUseCoSkill, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);

        const player    = focusUnit.getPlayer();
        const skillType = action.skillType;
        const skills    = player.getCoSkills(skillType) || [];
        const dataList  = action.extraDataList || [];
        if (isSuccessful) {
            player.setCoUsingSkillType(skillType);
            for (let i = 0; i < skills.length; ++i) {
                BwHelpers.exeInstantSkill(war, player, pathNodes[pathNodes.length - 1], skills[i], dataList[i]);
            }

            if (skillType === Types.CoSkillType.Power) {
                player.setCoCurrentEnergy(Math.max(0, player.getCoCurrentEnergy() - player.getCoPowerEnergy()!));
            } else if (skillType === Types.CoSkillType.SuperPower) {
                player.setCoCurrentEnergy(Math.max(0, player.getCoCurrentEnergy() - player.getCoSuperPowerEnergy()!));
            }
        }

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                focusUnit.updateView();
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                if (isSuccessful) {
                    const gridVisionEffect  = war.getGridVisionEffect();
                    const playerIndex       = focusUnit.getPlayerIndex();
                    const unitMap           = war.getUnitMap();
                    unitMap.forEachUnitOnMap(unit => {
                        unit.updateView();
                        if (unit.getPlayerIndex() === playerIndex) {
                            gridVisionEffect.showEffectSkillActivation(unit.getGridIndex());
                        }
                    });

                    const configVersion = war.getConfigVersion();
                    for (let i = 0; i < skills.length; ++i) {
                        const skillCfg          = Utility.ConfigManager.getCoSkillCfg(configVersion, skills[i]);
                        const indiscriminateCfg = skillCfg ? skillCfg.indiscriminateAreaDamage : null;
                        if (indiscriminateCfg) {
                            for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(dataList[i].indiscriminateAreaDamageCenter as GridIndex, 0, indiscriminateCfg[1], unitMap.getMapSize())) {
                                const unit = unitMap.getUnitOnMap(gridIndex);
                                (unit) && (unit.updateView());

                                gridVisionEffect.showEffectExplosion(gridIndex);
                            }
                        }
                    }
                }

                actionPlanner.setStateIdle();
                resolve();
            });
        });
    }

    async function _executeMcwUnitWait(war: McwWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.WarActionUnitWait;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitWait, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setActionState(UnitState.Acted);

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                focusUnit.updateView();
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                actionPlanner.setStateIdle();
                resolve();
            });
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helpers for executors.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function addUnits(war: McwWar, unitsData: SerializedMcwUnit[] | undefined | null, isViewVisible: boolean): void {
        if ((unitsData) && (unitsData.length)) {
            const unitMap       = war.getUnitMap();
            const configVersion = war.getConfigVersion();

            for (const unitData of unitsData) {
                if (!unitMap.getUnitById(unitData.unitId)) {
                    const unit      = new McwUnit().init(unitData, configVersion);
                    const isOnMap   = unit.getLoaderUnitId() == null;
                    if (isOnMap) {
                        unitMap.addUnitOnMap(unit);
                    } else {
                        unitMap.addUnitLoaded(unit);
                    }
                    unit.startRunning(war);
                    unit.startRunningView();
                    unit.setViewVisible(isViewVisible);
                }
            }
        }
    }
    function updateTiles(war: McwWar, tilesData: SerializedMcwTile[] | undefined | null): void {
        if ((tilesData) && (tilesData.length)) {
            const tileMap   = war.getTileMap();
            for (const tileData of tilesData) {
                const gridIndex = { x: tileData.gridX, y: tileData.gridY };
                const tile      = tileMap.getTile(gridIndex);
                if (tile.getIsFogEnabled()) {
                    tile.setFogDisabled(tileData);
                }
            }
        }
    }
    function updateTilesAndUnitsBeforeExecutingAction(
        war     : McwWar,
        action  : {
            actingTiles?    : ProtoTypes.ISerializedWarTile[],
            actingUnits?    : ProtoTypes.ISerializedWarUnit[],
            discoveredTiles?: ProtoTypes.ISerializedWarTile[],
            discoveredUnits?: ProtoTypes.ISerializedWarUnit[],
        }
    ): void {
        addUnits(war, action.actingUnits as SerializedMcwUnit[] | undefined | null, false);
        addUnits(war, action.discoveredUnits as SerializedMcwUnit[] | undefined | null, false);
        updateTiles(war, action.actingTiles as SerializedMcwTile[] | undefined | null);
        updateTiles(war, action.discoveredTiles as SerializedMcwTile[] | undefined | null);
    }

    function moveUnit(war: McwWar, actionCode: WarActionCodes, revisedPath: MovePath, launchUnitId: number | null | undefined, fuelConsumption: number): void {
        const pathNodes             = revisedPath.nodes;
        const beginningGridIndex    = pathNodes[0];
        const fogMap                = war.getFogMap();
        const unitMap               = war.getUnitMap();
        const focusUnit             = unitMap.getUnit(beginningGridIndex, launchUnitId)!;
        const isUnitBeLoaded        = (actionCode === WarActionCodes.WarActionUnitBeLoaded) && (!revisedPath.isBlocked);
        if (war.getWatcherTeamIndexes(User.UserModel.getSelfUserId()).has(focusUnit.getTeamIndex())) {
            fogMap.updateMapFromPathsByUnitAndPath(focusUnit, pathNodes);
        }

        if (pathNodes.length > 1) {
            const endingGridIndex   = pathNodes[pathNodes.length - 1];
            const isLaunching       = launchUnitId != null;

            focusUnit.setGridIndex(endingGridIndex);
            focusUnit.setIsCapturingTile(false);
            focusUnit.setIsBuildingTile(false);
            focusUnit.setCurrentFuel(focusUnit.getCurrentFuel() - fuelConsumption);
            for (const unit of unitMap.getUnitsLoadedByLoader(focusUnit, true)) {
                unit.setGridIndex(endingGridIndex);
            }

            if ((actionCode === WarActionCodes.WarActionUnitJoin) && (!revisedPath.isBlocked)) {
                unitMap.removeUnitOnMap(endingGridIndex, false);
            }

            if (isLaunching) {
                focusUnit.setLoaderUnitId(undefined);
                const loaderUnit = unitMap.getUnitOnMap(beginningGridIndex);
                (loaderUnit) && (loaderUnit.updateView());

                if (!isUnitBeLoaded) {
                    unitMap.setUnitUnloaded(launchUnitId!, endingGridIndex);
                }
            } else {
                if (isUnitBeLoaded) {
                    unitMap.setUnitLoaded(beginningGridIndex);
                } else {
                    unitMap.swapUnit(beginningGridIndex, endingGridIndex);
                }

                const tile = war.getTileMap().getTile(beginningGridIndex);
                tile.setCurrentBuildPoint(tile.getMaxBuildPoint());
                tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
            }
        }
    }

    function getAdjacentPlasmas(tileMap: McwTileMap, origin: GridIndex): GridIndex[] {
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
