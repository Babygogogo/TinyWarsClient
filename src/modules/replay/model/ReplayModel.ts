
namespace TinyWars.Replay.ReplayModel {
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import Helpers              = Utility.Helpers;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import ProtoManager         = Utility.ProtoManager;
    import WarActionCodes       = Utility.WarActionCodes;
    import WarActionContainer   = ProtoTypes.IWarActionContainer;
    import BwHelpers            = BaseWar.BwHelpers;
    import GridIndex            = Types.GridIndex;
    import SerializedBwTile     = Types.SerializedBwTile;
    import SerializedBwUnit     = Types.SerializedBwUnit;
    import UnitState            = Types.UnitState;
    import MovePath             = Types.MovePath;
    import TileType             = Types.TileType;

    const _EXECUTORS = new Map<WarActionCodes, (war: ReplayWar, data: WarActionContainer) => Promise<void>>([
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
    const _FAST_EXECUTORS = new Map<WarActionCodes, (war: ReplayWar, data: WarActionContainer) => Promise<void>>([
        [WarActionCodes.WarActionPlayerBeginTurn,       _fastExecuteMcwPlayerBeginTurn],
        [WarActionCodes.WarActionPlayerDeleteUnit,      _fastExecuteMcwPlayerDeleteUnit],
        [WarActionCodes.WarActionPlayerEndTurn,         _fastExecuteMcwPlayerEndTurn],
        [WarActionCodes.WarActionPlayerProduceUnit,     _fastExecuteMcwPlayerProduceUnit],
        [WarActionCodes.WarActionPlayerSurrender,       _fastExecuteMcwPlayerSurrender],
        [WarActionCodes.WarActionPlayerVoteForDraw,     _fastExecuteMcwPlayerVoteForDraw],
        [WarActionCodes.WarActionUnitAttack,            _fastExecuteMcwUnitAttack],
        [WarActionCodes.WarActionUnitBeLoaded,          _fastExecuteMcwUnitBeLoaded],
        [WarActionCodes.WarActionUnitBuildTile,         _fastExecuteMcwUnitBuildTile],
        [WarActionCodes.WarActionUnitCaptureTile,       _fastExecuteMcwUnitCaptureTile],
        [WarActionCodes.WarActionUnitDive,              _fastExecuteMcwUnitDive],
        [WarActionCodes.WarActionUnitDrop,              _fastExecuteMcwUnitDrop],
        [WarActionCodes.WarActionUnitJoin,              _fastExecuteMcwUnitJoin],
        [WarActionCodes.WarActionUnitLaunchFlare,       _fastExecuteMcwUnitLaunchFlare],
        [WarActionCodes.WarActionUnitLaunchSilo,        _fastExecuteMcwUnitLaunchSilo],
        [WarActionCodes.WarActionUnitLoadCo,            _fastExecuteMcwUnitLoadCo],
        [WarActionCodes.WarActionUnitProduceUnit,       _fastExecuteMcwUnitProduceUnit],
        [WarActionCodes.WarActionUnitSupply,            _fastExecuteMcwUnitSupply],
        [WarActionCodes.WarActionUnitSurface,           _fastExecuteMcwUnitSurface],
        [WarActionCodes.WarActionUnitUseCoSkill,        _fastExecuteMcwUnitUseCoSkill],
        [WarActionCodes.WarActionUnitWait,              _fastExecuteMcwUnitWait],
    ]);

    let _war: ReplayWar;

    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(encodedWarData: Uint8Array, nicknames: string[]): Promise<ReplayWar> {
        if (_war) {
            Logger.warn(`ReplayModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        const warData = ProtoManager.decodeAsSerializedWar(encodedWarData);
        for (let i = 0; i < nicknames.length; ++i) {
            warData.players[i + 1].nickname = nicknames[i];
        }

        _war = (await new ReplayWar().init(warData)).startRunning().startRunningView() as ReplayWar;
        return _war;
    }

    export function unloadWar(): void {
        if (_war) {
            _war.stopRunning();
            _war = undefined;
        }
    }

    export function getWar(): ReplayWar | undefined {
        return _war;
    }

    export function executeNextAction(war: ReplayWar, isFastExecute: boolean): Promise<void> | void {
        const action = war.getNextAction();
        if ((action)                    &&
            (war.getIsRunning())        &&
            (!war.checkIsInEnd())       &&
            (!war.getIsExecutingAction())
        ) {
            return _executeAction(war, action, isFastExecute);
        } else {
            FloatText.show(Lang.getText(Lang.Type.B0110));
            return;
        }
    }

    async function _executeAction(war: ReplayWar, container: WarActionContainer, isFastExecute: boolean): Promise<void> {
        war.setIsExecutingAction(true);
        war.setNextActionId(war.getNextActionId() + 1);

        const actionId = war.getNextActionId();
        if (war.getTurnManager().getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn) {
            if (war.getCheckPointId(actionId) == null) {
                war.setCheckPointId(actionId, war.getCheckPointId(actionId - 1) + 1);
            }
        } else {
            if (war.getCheckPointId(actionId) == null) {
                war.setCheckPointId(actionId, war.getCheckPointId(actionId - 1));
            }
        }

        if (isFastExecute) {
            await _FAST_EXECUTORS.get(Helpers.getWarActionCode(container))(war, container);
        } else {
            await _EXECUTORS.get(Helpers.getWarActionCode(container))(war, container);
        }

        if (war.getNextActionId() >= war.getTotalActionsCount()) {
            war.setIsAutoReplay(false);
            FloatText.show(Lang.getText(Lang.Type.B0093));
        }
        war.setIsExecutingAction(false);

        if ((war.getTurnManager().getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn) || (war.checkIsInEnd())) {
            const checkPointId = war.getCheckPointId(actionId);
            if (war.getWarData(checkPointId) == null) {
                war.setWarData(checkPointId, war.serialize());
            }
        }

        if ((!war.checkIsInEnd()) && (war.getIsAutoReplay()) && (!war.getIsExecutingAction()) && (war.getIsRunning())) {
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
    async function _executeMcwPlayerBeginTurn(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${war.getPlayerInTurn().getNickname()} ${Lang.getText(Lang.Type.B0094)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        await war.getTurnManager().endPhaseWaitBeginTurn(data);
        actionPlanner.setStateIdle();
    }

    async function _executeMcwPlayerDeleteUnit(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0081)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

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

    async function _executeMcwPlayerEndTurn(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0036)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        await war.getTurnManager().endPhaseMain();
        actionPlanner.setStateIdle();
    }

    async function _executeMcwPlayerProduceUnit(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0095)} ${Lang.getUnitName(data.WarActionPlayerProduceUnit.unitType)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionPlayerProduceUnit;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const gridIndex     = action.gridIndex as GridIndex;
        const unitMap       = war.getUnitMap();
        const unitId        = unitMap.getNextUnitId();
        const playerInTurn  = war.getPlayerInTurn();

        if ((gridIndex) && (action.unitType != null)) {
            // TODO: take skills into account.
            const playerIndex   = playerInTurn.getPlayerIndex();
            const unit          = new ReplayUnit().init({
                unitId,
                viewId  : ConfigManager.getUnitViewId(action.unitType, playerIndex)!,
                gridX   : gridIndex.x,
                gridY   : gridIndex.y,
            }, war.getConfigVersion());
            unit.setState(UnitState.Acted);
            unit.startRunning(war);
            unit.startRunningView();

            unitMap.addUnitOnMap(unit);
            war.getFogMap().updateMapFromUnitsForPlayerOnArriving(playerIndex, gridIndex, unit.getVisionRangeForPlayer(playerIndex, gridIndex));
        }

        unitMap.setNextUnitId(unitId + 1);
        playerInTurn.setFund(playerInTurn.getFund() - action.cost);

        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

        actionPlanner.setStateIdle();
    }

    async function _executeMcwPlayerSurrender(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${war.getPlayerInTurn().getNickname()} ${Lang.getText(Lang.Type.B0055)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const player = war.getPlayerInTurn();
        DestructionHelpers.destroyPlayerForce(war, player.getPlayerIndex(), true);
        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

        actionPlanner.setStateIdle();
    }

    async function _executeMcwPlayerVoteForDraw(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(
            `${war.getPlayerInTurn().getNickname()} ${data.WarActionPlayerVoteForDraw.isAgree ? Lang.getText(Lang.Type.B0096) : Lang.getText(Lang.Type.B0085)}` +
            `(${war.getNextActionId()} / ${war.getTotalActionsCount()})`
        );

        const playerInTurn = war.getPlayerInTurn();
        playerInTurn.setHasVotedForDraw(true);

        if (!data.WarActionPlayerVoteForDraw.isAgree) {
            FloatText.show(Lang.getFormatedText(Lang.Type.F0017, playerInTurn.getNickname()));
            war.setRemainingVotesForDraw(undefined);
        } else {
            if (war.getRemainingVotesForDraw()) {
                FloatText.show(Lang.getFormatedText(Lang.Type.F0018, playerInTurn.getNickname()));
            } else {
                FloatText.show(Lang.getFormatedText(Lang.Type.F0019, playerInTurn.getNickname()));
            }
            war.setRemainingVotesForDraw((war.getRemainingVotesForDraw() || war.getPlayerManager().getAlivePlayersCount(false)) - 1);
        }

        actionPlanner.setStateIdle();
    }

    async function _executeMcwUnitAttack(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0097)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitAttack;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = war.getUnitMap();
        const attacker  = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitAttack, path, action.launchUnitId, path.fuelConsumption);
        attacker.setState(UnitState.Acted);

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
            const tileMap           = war.getTileMap() as ReplayTileMap;
            const attackTarget      = unitMap.getUnitOnMap(targetGridIndex) || tileMap.getTile(targetGridIndex);
            const targetUnit        = attackTarget instanceof ReplayUnit ? attackTarget : undefined;

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
                targetUnit.setCurrentPromotion(Math.min(targetUnit.getMaxPromotion(), targetUnit.getCurrentPromotion() + 1));
            }

            const targetOldHp = attackTarget.getCurrentHp()!;
            const targetNewHp = Math.max(0, targetOldHp - action.attackDamage);
            attackTarget.setCurrentHp(targetNewHp);
            if ((targetNewHp === 0) && (targetUnit)) {
                attacker.setCurrentPromotion(Math.min(attacker.getMaxPromotion(), attacker.getCurrentPromotion() + 1));
            }

            const destination = pathNodes[pathNodes.length - 1];
            if (targetUnit) {
                const attackerPlayer    = war.getPlayer(attacker.getPlayerIndex())!;
                const targetLostHp      = Helpers.getNormalizedHp(targetOldHp) - Helpers.getNormalizedHp(targetNewHp);
                if ((targetLostHp > 0)                                                                                      &&
                    (attackerPlayer.getCoId() != null)                                                                      &&
                    (!attackerPlayer.getCoUsingSkillType())                                                                   &&
                    ((attacker.getUnitId() === attackerPlayer.getCoUnitId()) || (attackerPlayer.checkIsInCoZone(destination)))
                ) {
                    attackerPlayer.setCoCurrentEnergy(Math.min(
                        attackerPlayer.getCoMaxEnergy() || 0,
                        attackerPlayer.getCoCurrentEnergy() + Math.floor(targetLostHp * war.getSettingsEnergyGrowthModifier() / 100)
                    ));
                }

                const targetPlayer      = war.getPlayer(targetUnit.getPlayerIndex())!;
                const attackerLostHp    = Helpers.getNormalizedHp(attackerOldHp) - Helpers.getNormalizedHp(attackerNewHp);
                if ((attackerLostHp > 0)                    &&
                    (targetPlayer.getCoId() != null)        &&
                    (!targetPlayer.getCoUsingSkillType())     &&
                    (targetPlayer.checkIsInCoZone(destination))
                ) {
                    targetPlayer.setCoCurrentEnergy(Math.min(
                        targetPlayer.getCoMaxEnergy() || 0,
                        targetPlayer.getCoCurrentEnergy() + Math.floor(attackerLostHp * war.getSettingsEnergyGrowthModifier() / 100)
                    ));
                }
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
                            if ((attackTarget as ReplayTile).getType() === TileType.Meteor) {
                                for (const gridIndex of getAdjacentPlasmas(tileMap, targetGridIndex)) {
                                    const plasma = tileMap.getTile(gridIndex);
                                    plasma.destroyTileObject();
                                    plasma.updateView();
                                    gridVisionEffect.showEffectExplosion(gridIndex);
                                }
                            }
                            (attackTarget as ReplayTile).destroyTileObject();
                            attackTarget.updateView();
                            gridVisionEffect.showEffectExplosion(targetGridIndex);
                        }
                    }

                    if (lostPlayerIndex) {
                        FloatText.show(Lang.getFormatedText(Lang.Type.F0015, war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                        DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
                    }

                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                    actionPlanner.setStateIdle();
                    resolve();
                }, targetGridIndex);
            });
        }
    }

    async function _executeMcwUnitBeLoaded(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0098)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitBeLoaded;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        const loaderUnit    = path.isBlocked ? undefined : unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]);
        moveUnit(war, WarActionCodes.WarActionUnitBeLoaded, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);
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

    async function _executeMcwUnitBuildTile(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0099)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitBuildTile;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitBuildTile, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

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

                const playerIndex = focusUnit.getPlayerIndex();
                war.getFogMap().updateMapFromTilesForPlayerOnGettingOwnership(playerIndex, endingGridIndex, tile.getVisionRangeForPlayer(playerIndex));
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

    async function _executeMcwUnitCaptureTile(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0100)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitCaptureTile;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitCaptureTile, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

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
                const fogMap = war.getFogMap();
                if (previousPlayerIndex > 0) {
                    fogMap.updateMapFromTilesForPlayerOnLosingOwnership(previousPlayerIndex, destination, tile.getVisionRangeForPlayer(previousPlayerIndex));
                }

                const playerIndexActing = focusUnit.getPlayerIndex();
                focusUnit.setIsCapturingTile(false);
                tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
                tile.resetByPlayerIndex(playerIndexActing);
                fogMap.updateMapFromTilesForPlayerOnGettingOwnership(playerIndexActing, destination, tile.getVisionRangeForPlayer(playerIndexActing));
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
                        FloatText.show(Lang.getFormatedText(Lang.Type.F0016, war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                        DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, true);
                        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                        actionPlanner.setStateIdle();
                        resolve();
                    });
                });
            }
        }
    }

    async function _executeMcwUnitDive(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0101)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitDive;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const focusUnit     = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        const isSuccessful  = !path.isBlocked;
        moveUnit(war, WarActionCodes.WarActionUnitDive, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(true));

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, false, path.isBlocked, () => {
                focusUnit.updateView();
                if (isSuccessful) {
                    const endingGridIndex = pathNodes[pathNodes.length - 1];
                    war.getGridVisionEffect().showEffectDive(endingGridIndex);
                }
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                actionPlanner.setStateIdle();
                resolve();
            });
        });
    }

    async function _executeMcwUnitDrop(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0102)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitDrop;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path              = action.path as MovePath;
        const pathNodes         = path.nodes;
        const unitMap           = war.getUnitMap();
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitDrop, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

        const playerIndex           = focusUnit.getPlayerIndex();
        const fogMap                = war.getFogMap();
        const unitsForDrop          = [] as ReplayUnit[];
        for (const { unitId, gridIndex } of (action.dropDestinations || []) as Types.DropDestination[]) {
            const unitForDrop = unitMap.getUnitLoadedById(unitId) as ReplayUnit;
            unitMap.setUnitUnloaded(unitId, gridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                unit.setGridIndex(gridIndex);
            }

            unitForDrop.setLoaderUnitId(undefined);
            unitForDrop.setGridIndex(gridIndex);
            unitForDrop.setState(UnitState.Acted);
            unitsForDrop.push(unitForDrop);

            fogMap.updateMapFromPathsByUnitAndPath(unitForDrop, [endingGridIndex, gridIndex]);
            fogMap.updateMapFromUnitsForPlayerOnArriving(playerIndex, gridIndex, unitForDrop.getVisionRangeForPlayer(playerIndex, gridIndex));
        }

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                if (action.isDropBlocked) {
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
                    }))
                }
                Promise.all(promises).then(() => {
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);
                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        });
    }

    async function _executeMcwUnitJoin(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0103)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitJoin;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path              = action.path as MovePath;
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const unitMap           = war.getUnitMap();
        const focusUnit         = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        const targetUnit        = path.isBlocked ? undefined : unitMap.getUnitOnMap(endingGridIndex);
        (targetUnit) && (unitMap.removeUnitOnMap(endingGridIndex, false));
        moveUnit(war, WarActionCodes.WarActionUnitJoin, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

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
                (joinedNormalizedHp - 1) * ConfigManager.UNIT_HP_NORMALIZER + 1,
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

    async function _executeMcwUnitLaunchFlare(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0104)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitLaunchFlare;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitLaunchFlare, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

        const isFlareSucceeded  = !path.isBlocked;
        const targetGridIndex   = action.targetGridIndex as GridIndex;
        const flareRadius       = focusUnit.getFlareRadius();
        if (isFlareSucceeded) {
            focusUnit.setFlareCurrentAmmo(focusUnit.getFlareCurrentAmmo() - 1);
            war.getFogMap().updateMapFromPathsByFlare(focusUnit.getPlayerIndex(), targetGridIndex, flareRadius);
        }

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                if (isFlareSucceeded) {
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

    async function _executeMcwUnitLaunchSilo(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0105)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitLaunchSilo;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = war.getUnitMap();
        const focusUnit = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitLaunchSilo, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

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

            const targetGrids   = GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, ConfigManager.SILO_RADIUS, unitMap.getMapSize());
            const targetUnits   = [] as ReplayUnit[];
            for (const grid of targetGrids) {
                const unit = unitMap.getUnitOnMap(grid) as ReplayUnit;
                if (unit) {
                    targetUnits.push(unit);
                    unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - ConfigManager.SILO_DAMAGE));
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

    async function _executeMcwUnitLoadCo(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0139)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitLoadCo;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitLoadCo, path, action.launchUnitId, path.fuelConsumption);

        if (path.isBlocked) {
            focusUnit.setState(UnitState.Acted);
        } else {
            focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());

            const player    = war.getPlayer(focusUnit.getPlayerIndex())!;
            const maxEnergy = player.getCoMaxEnergy();
            player.setFund(player.getFund() - focusUnit.getLoadCoCost()!);
            player.setCoUnitId(focusUnit.getUnitId());
            player.setCoCurrentEnergy(maxEnergy == null ? 0 : Math.floor(maxEnergy * war.getSettingsInitialEnergy() / 100));
            player.setCoUsingSkillType(false);
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

    async function _executeMcwUnitProduceUnit(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0106)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitProduceUnit;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitProduceUnit, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

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
            const producedUnit      = new ReplayUnit().init({
                unitId      : producedUnitId,
                viewId      : ConfigManager.getUnitViewId(focusUnit.getProduceUnitType(), focusUnit.getPlayerIndex())!,
                gridX       : gridIndex.x,
                gridY       : gridIndex.y,
                loaderUnitId: focusUnit.getUnitId(),
            }, war.getConfigVersion());
            producedUnit.startRunning(war);
            producedUnit.setState(Types.UnitState.Acted);

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

    async function _executeMcwUnitSupply(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0107)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitSupply;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = war.getUnitMap();
        const focusUnit = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitSupply, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

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
            const suppliedUnits = [] as ReplayUnit[];
            const playerIndex   = focusUnit.getPlayerIndex();
            for (const gridIndex of GridIndexHelpers.getAdjacentGrids(pathNodes[pathNodes.length - 1], unitMap.getMapSize())) {
                const unit = unitMap.getUnitOnMap(gridIndex) as ReplayUnit;
                if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                    unit.updateOnSupplied();
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

    async function _executeMcwUnitSurface(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0108)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitSurface;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const focusUnit     = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        const isSuccessful  = !path.isBlocked;
        moveUnit(war, WarActionCodes.WarActionUnitSurface, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(false));

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, true, path.isBlocked, () => {
                focusUnit.updateView();
                if (isSuccessful) {
                    const endingGridIndex = pathNodes[pathNodes.length - 1];
                    war.getGridVisionEffect().showEffectSurface(endingGridIndex);
                }
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(war);

                actionPlanner.setStateIdle();
                resolve();
            });
        });
    }

    async function _executeMcwUnitUseCoSkill(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0142)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitUseCoSkill;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const focusUnit     = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        const isSuccessful  = !path.isBlocked;
        moveUnit(war, WarActionCodes.WarActionUnitUseCoSkill, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

        const player    = focusUnit.getPlayer();
        const skills    = player.getCoSkills() || [];
        const dataList  = action.extraDataList || [];
        if (isSuccessful) {
            player.setCoUsingSkillType(true);
            for (let i = 0; i < skills.length; ++i) {
                BwHelpers.exeInstantSkill(war, player, skills[i], dataList[i]);
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
                        const skillCfg          = ConfigManager.getCoSkillCfg(configVersion, skills[i]);
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

    async function _executeMcwUnitWait(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const actionPlanner = war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        FloatText.show(`${Lang.getText(Lang.Type.B0109)} (${war.getNextActionId()} / ${war.getTotalActionsCount()})`);

        const action = data.WarActionUnitWait;
        updateTilesAndUnitsBeforeExecutingAction(war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitWait, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

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
    // The fast executors for war actions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _fastExecuteMcwPlayerBeginTurn(war: ReplayWar, data: WarActionContainer): Promise<void> {
        war.getTurnManager().endPhaseWaitBeginTurn(data);
    }

    async function _fastExecuteMcwPlayerDeleteUnit(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action    = data.WarActionPlayerDeleteUnit;
        const gridIndex = action.gridIndex as GridIndex;
        const focusUnit = war.getUnitMap().getUnitOnMap(gridIndex);
        if (focusUnit) {
            war.getFogMap().updateMapFromPathsByUnitAndPath(focusUnit, [gridIndex]);
            DestructionHelpers.destroyUnitOnMap(war, gridIndex, false);
        }
    }

    async function _fastExecuteMcwPlayerEndTurn(war: ReplayWar, data: WarActionContainer): Promise<void> {
        war.getTurnManager().endPhaseMain();
    }

    async function _fastExecuteMcwPlayerProduceUnit(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionPlayerProduceUnit;

        const gridIndex     = action.gridIndex as GridIndex;
        const unitMap       = war.getUnitMap();
        const unitId        = unitMap.getNextUnitId();
        const playerInTurn  = war.getPlayerInTurn();

        if ((gridIndex) && (action.unitType != null)) {
            // TODO: take skills into account.
            const playerIndex   = playerInTurn.getPlayerIndex();
            const unit          = new ReplayUnit().init({
                unitId,
                viewId  : ConfigManager.getUnitViewId(action.unitType, playerIndex)!,
                gridX   : gridIndex.x,
                gridY   : gridIndex.y,
            }, war.getConfigVersion());
            unit.setState(UnitState.Acted);
            unit.startRunning(war);
            unit.startRunningView();

            unitMap.addUnitOnMap(unit);
            war.getFogMap().updateMapFromUnitsForPlayerOnArriving(playerIndex, gridIndex, unit.getVisionRangeForPlayer(playerIndex, gridIndex));
        }

        unitMap.setNextUnitId(unitId + 1);
        playerInTurn.setFund(playerInTurn.getFund() - action.cost);
    }

    async function _fastExecuteMcwPlayerSurrender(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const player = war.getPlayerInTurn();
        DestructionHelpers.destroyPlayerForce(war, player.getPlayerIndex(), false);
    }

    async function _fastExecuteMcwPlayerVoteForDraw(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const playerInTurn = war.getPlayerInTurn();
        playerInTurn.setHasVotedForDraw(true);

        if (!data.WarActionPlayerVoteForDraw.isAgree) {
            war.setRemainingVotesForDraw(undefined);
        } else {
            war.setRemainingVotesForDraw((war.getRemainingVotesForDraw() || war.getPlayerManager().getAlivePlayersCount(false)) - 1);
        }
    }

    async function _fastExecuteMcwUnitAttack(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitAttack;

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = war.getUnitMap();
        const attacker  = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitAttack, path, action.launchUnitId, path.fuelConsumption);
        attacker.setState(UnitState.Acted);

        if (path.isBlocked) {
        } else {
            const counterDamage     = action.counterDamage;
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tileMap           = war.getTileMap() as ReplayTileMap;
            const attackTarget      = unitMap.getUnitOnMap(targetGridIndex) || tileMap.getTile(targetGridIndex);
            const targetUnit        = attackTarget instanceof ReplayUnit ? attackTarget : undefined;

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
                targetUnit.setCurrentPromotion(Math.min(targetUnit.getMaxPromotion(), targetUnit.getCurrentPromotion() + 1));
            }

            const targetOldHp = attackTarget.getCurrentHp()!;
            const targetNewHp = Math.max(0, targetOldHp - action.attackDamage);
            attackTarget.setCurrentHp(targetNewHp);
            if ((targetNewHp === 0) && (targetUnit)) {
                attacker.setCurrentPromotion(Math.min(attacker.getMaxPromotion(), attacker.getCurrentPromotion() + 1));
            }

            const destination = pathNodes[pathNodes.length - 1];
            if (targetUnit) {
                const attackerPlayer    = war.getPlayer(attacker.getPlayerIndex())!;
                const targetLostHp      = Helpers.getNormalizedHp(targetOldHp) - Helpers.getNormalizedHp(targetNewHp);
                if ((targetLostHp > 0)                                                                                      &&
                    (attackerPlayer.getCoId() != null)                                                                      &&
                    (!attackerPlayer.getCoUsingSkillType())                                                                   &&
                    ((attacker.getUnitId() === attackerPlayer.getCoUnitId()) || (attackerPlayer.checkIsInCoZone(destination)))
                ) {
                    attackerPlayer.setCoCurrentEnergy(Math.min(
                        attackerPlayer.getCoMaxEnergy() || 0,
                        attackerPlayer.getCoCurrentEnergy() + Math.floor(targetLostHp * war.getSettingsEnergyGrowthModifier() / 100)
                    ));
                }

                const targetPlayer      = war.getPlayer(targetUnit.getPlayerIndex())!;
                const attackerLostHp    = Helpers.getNormalizedHp(attackerOldHp) - Helpers.getNormalizedHp(attackerNewHp);
                if ((attackerLostHp > 0)                    &&
                    (targetPlayer.getCoId() != null)        &&
                    (!targetPlayer.getCoUsingSkillType())     &&
                    (targetPlayer.checkIsInCoZone(destination))
                ) {
                    targetPlayer.setCoCurrentEnergy(Math.min(
                        targetPlayer.getCoMaxEnergy() || 0,
                        targetPlayer.getCoCurrentEnergy() + Math.floor(attackerLostHp * war.getSettingsEnergyGrowthModifier() / 100)
                    ));
                }
            }

            const lostPlayerIndex   = action.lostPlayerIndex;
            if (attackerNewHp > 0) {
            } else {
                DestructionHelpers.destroyUnitOnMap(war, destination, false);
            }

            if (targetNewHp > 0) {
            } else {
                if (targetUnit) {
                    DestructionHelpers.destroyUnitOnMap(war, targetGridIndex, false);
                } else {
                    if ((attackTarget as ReplayTile).getType() === TileType.Meteor) {
                        for (const gridIndex of getAdjacentPlasmas(tileMap, targetGridIndex)) {
                            const plasma = tileMap.getTile(gridIndex);
                            plasma.destroyTileObject();
                        }
                    }
                    (attackTarget as ReplayTile).destroyTileObject();
                }
            }

            if (lostPlayerIndex) {
                DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, false);
            }
        }
    }

    async function _fastExecuteMcwUnitBeLoaded(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitBeLoaded;

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        const loaderUnit    = path.isBlocked ? undefined : unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]);
        moveUnit(war, WarActionCodes.WarActionUnitBeLoaded, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);
        (loaderUnit) && (focusUnit.setLoaderUnitId(loaderUnit.getUnitId()));
    }

    async function _fastExecuteMcwUnitBuildTile(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitBuildTile;

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitBuildTile, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

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

                const playerIndex = focusUnit.getPlayerIndex();
                war.getFogMap().updateMapFromTilesForPlayerOnGettingOwnership(playerIndex, endingGridIndex, tile.getVisionRangeForPlayer(playerIndex));
            }
        }
    }

    async function _fastExecuteMcwUnitCaptureTile(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitCaptureTile;

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitCaptureTile, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

        if (path.isBlocked) {
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
                const fogMap = war.getFogMap();
                if (previousPlayerIndex > 0) {
                    fogMap.updateMapFromTilesForPlayerOnLosingOwnership(previousPlayerIndex, destination, tile.getVisionRangeForPlayer(previousPlayerIndex));
                }

                const playerIndexActing = focusUnit.getPlayerIndex();
                focusUnit.setIsCapturingTile(false);
                tile.setCurrentCapturePoint(tile.getMaxCapturePoint());
                tile.resetByPlayerIndex(playerIndexActing);
                fogMap.updateMapFromTilesForPlayerOnGettingOwnership(playerIndexActing, destination, tile.getVisionRangeForPlayer(playerIndexActing));
            }

            if (!lostPlayerIndex) {
            } else {
                DestructionHelpers.destroyPlayerForce(war, lostPlayerIndex, false);
            }
        }
    }

    async function _fastExecuteMcwUnitDive(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitDive;

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const focusUnit     = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        const isSuccessful  = !path.isBlocked;
        moveUnit(war, WarActionCodes.WarActionUnitDive, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(true));
    }

    async function _fastExecuteMcwUnitDrop(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitDrop;

        const path              = action.path as MovePath;
        const pathNodes         = path.nodes;
        const unitMap           = war.getUnitMap();
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitDrop, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

        const playerIndex           = focusUnit.getPlayerIndex();
        const fogMap                = war.getFogMap();
        const unitsForDrop          = [] as ReplayUnit[];
        for (const { unitId, gridIndex } of (action.dropDestinations || []) as Types.DropDestination[]) {
            const unitForDrop = unitMap.getUnitLoadedById(unitId) as ReplayUnit;
            unitMap.setUnitUnloaded(unitId, gridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                unit.setGridIndex(gridIndex);
            }

            unitForDrop.setLoaderUnitId(undefined);
            unitForDrop.setGridIndex(gridIndex);
            unitForDrop.setState(UnitState.Acted);
            unitsForDrop.push(unitForDrop);

            fogMap.updateMapFromPathsByUnitAndPath(unitForDrop, [endingGridIndex, gridIndex]);
            fogMap.updateMapFromUnitsForPlayerOnArriving(playerIndex, gridIndex, unitForDrop.getVisionRangeForPlayer(playerIndex, gridIndex));
        }
    }

    async function _fastExecuteMcwUnitJoin(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitJoin;

        const path              = action.path as MovePath;
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const unitMap           = war.getUnitMap();
        const focusUnit         = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        const targetUnit        = path.isBlocked ? undefined : unitMap.getUnitOnMap(endingGridIndex);
        (targetUnit) && (unitMap.removeUnitOnMap(endingGridIndex, false));
        moveUnit(war, WarActionCodes.WarActionUnitJoin, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

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
                (joinedNormalizedHp - 1) * ConfigManager.UNIT_HP_NORMALIZER + 1,
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
    }

    async function _fastExecuteMcwUnitLaunchFlare(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitLaunchFlare;

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitLaunchFlare, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

        const isFlareSucceeded  = !path.isBlocked;
        const targetGridIndex   = action.targetGridIndex as GridIndex;
        const flareRadius       = focusUnit.getFlareRadius();
        if (isFlareSucceeded) {
            focusUnit.setFlareCurrentAmmo(focusUnit.getFlareCurrentAmmo() - 1);
            war.getFogMap().updateMapFromPathsByFlare(focusUnit.getPlayerIndex(), targetGridIndex, flareRadius);
        }
    }

    async function _fastExecuteMcwUnitLaunchSilo(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitLaunchSilo;

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = war.getUnitMap();
        const focusUnit = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitLaunchSilo, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

        if (path.isBlocked) {
        } else {
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tile              = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
            tile.resetByObjectViewIdAndBaseViewId(focusUnit.getTileObjectViewIdAfterLaunchSilo());

            const targetGrids   = GridIndexHelpers.getGridsWithinDistance(targetGridIndex, 0, ConfigManager.SILO_RADIUS, unitMap.getMapSize());
            const targetUnits   = [] as ReplayUnit[];
            for (const grid of targetGrids) {
                const unit = unitMap.getUnitOnMap(grid) as ReplayUnit;
                if (unit) {
                    targetUnits.push(unit);
                    unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - ConfigManager.SILO_DAMAGE));
                }
            }
        }
    }

    async function _fastExecuteMcwUnitLoadCo(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitLoadCo;

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitLoadCo, path, action.launchUnitId, path.fuelConsumption);

        if (path.isBlocked) {
            focusUnit.setState(UnitState.Acted);
        } else {
            focusUnit.setCurrentPromotion(focusUnit.getMaxPromotion());

            const player    = war.getPlayer(focusUnit.getPlayerIndex())!;
            const maxEnergy = player.getCoMaxEnergy();
            player.setFund(player.getFund() - focusUnit.getLoadCoCost()!);
            player.setCoUnitId(focusUnit.getUnitId());
            player.setCoCurrentEnergy(maxEnergy == null ? 0 : Math.floor(maxEnergy * war.getSettingsInitialEnergy() / 100));
            player.setCoUsingSkillType(false);
        }
    }

    async function _fastExecuteMcwUnitProduceUnit(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitProduceUnit;

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitProduceUnit, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

        if (path.isBlocked) {
        } else {
            // TODO: take skills into account.
            const gridIndex         = focusUnit.getGridIndex();
            const producedUnitId    = unitMap.getNextUnitId();
            const producedUnit      = new ReplayUnit().init({
                unitId      : producedUnitId,
                viewId      : ConfigManager.getUnitViewId(focusUnit.getProduceUnitType(), focusUnit.getPlayerIndex())!,
                gridX       : gridIndex.x,
                gridY       : gridIndex.y,
                loaderUnitId: focusUnit.getUnitId(),
            }, war.getConfigVersion());
            producedUnit.startRunning(war);
            producedUnit.setState(Types.UnitState.Acted);

            const player = war.getPlayerInTurn();
            player.setFund(player.getFund() - action.cost);
            unitMap.setNextUnitId(producedUnitId + 1);
            unitMap.addUnitLoaded(producedUnit);
            focusUnit.setCurrentProduceMaterial(focusUnit.getCurrentProduceMaterial()! - 1);
        }
    }

    async function _fastExecuteMcwUnitSupply(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitSupply;

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = war.getUnitMap();
        const focusUnit = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitSupply, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

        if (path.isBlocked) {
        } else {
            const suppliedUnits = [] as ReplayUnit[];
            const playerIndex   = focusUnit.getPlayerIndex();
            for (const gridIndex of GridIndexHelpers.getAdjacentGrids(pathNodes[pathNodes.length - 1], unitMap.getMapSize())) {
                const unit = unitMap.getUnitOnMap(gridIndex) as ReplayUnit;
                if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                    unit.updateOnSupplied();
                    suppliedUnits.push(unit);
                }
            }
        }
    }

    async function _fastExecuteMcwUnitSurface(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitSurface;

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const focusUnit     = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        const isSuccessful  = !path.isBlocked;
        moveUnit(war, WarActionCodes.WarActionUnitSurface, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);
        (isSuccessful) && (focusUnit.setIsDiving(false));
    }

    async function _fastExecuteMcwUnitUseCoSkill(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitUseCoSkill;

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const focusUnit     = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        const isSuccessful  = !path.isBlocked;
        moveUnit(war, WarActionCodes.WarActionUnitUseCoSkill, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);

        const player    = focusUnit.getPlayer();
        const skills    = player.getCoSkills() || [];
        const dataList  = action.extraDataList || [];
        if (isSuccessful) {
            player.setCoUsingSkillType(true);
            for (let i = 0; i < skills.length; ++i) {
                BwHelpers.exeInstantSkill(war, player, skills[i], dataList[i]);
            }
        }
    }

    async function _fastExecuteMcwUnitWait(war: ReplayWar, data: WarActionContainer): Promise<void> {
        const action = data.WarActionUnitWait;

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(war, WarActionCodes.WarActionUnitWait, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Acted);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helpers for executors.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function addUnits(war: ReplayWar, unitsData: SerializedBwUnit[] | undefined | null, isViewVisible: boolean): void {
        if ((unitsData) && (unitsData.length)) {
            const unitMap       = war.getUnitMap();
            const fogMap        = war.getFogMap();
            const configVersion = war.getConfigVersion();

            for (const unitData of unitsData) {
                const unit      = new ReplayUnit().init(unitData, configVersion);
                const isOnMap   = unit.getLoaderUnitId() == null;
                if (isOnMap) {
                    unitMap.addUnitOnMap(unit);
                } else {
                    unitMap.addUnitLoaded(unit);
                }
                unit.startRunning(war);
                unit.startRunningView();
                unit.setViewVisible(isViewVisible);

                if (isOnMap) {
                    const playerIndex   = unit.getPlayerIndex();
                    const gridIndex     = unit.getGridIndex();
                    fogMap.updateMapFromUnitsForPlayerOnArriving(playerIndex, gridIndex, unit.getVisionRangeForPlayer(playerIndex, gridIndex));
                }
            }
        }
    }
    function updateTiles(war: ReplayWar, tilesData: SerializedBwTile[] | undefined | null): void {
        if ((tilesData) && (tilesData.length)) {
            const tileMap   = war.getTileMap();
            const fogMap    = war.getFogMap();

            for (const tileData of tilesData) {
                const gridIndex = { x: tileData.gridX, y: tileData.gridY };
                const tile      = tileMap.getTile(gridIndex);
                egret.assert(tile.getIsFogEnabled(), "ReplayModel.updateTiles() the tile has no fog and therefore should not be updated!");
                tile.setFogDisabled(tileData);

                const playerIndex = tile.getPlayerIndex();
                if (playerIndex > 0) {
                    fogMap.updateMapFromTilesForPlayerOnGettingOwnership(playerIndex, gridIndex, tile.getVisionRangeForPlayer(playerIndex));
                }
            }
        }
    }
    function updateTilesAndUnitsBeforeExecutingAction(
        war     : ReplayWar,
        action  : {
            actingTiles?    : ProtoTypes.ISerializedWarTile[],
            actingUnits?    : ProtoTypes.ISerializedWarUnit[],
            discoveredTiles?: ProtoTypes.ISerializedWarTile[],
            discoveredUnits?: ProtoTypes.ISerializedWarUnit[],
        }
    ): void {
        addUnits(war, action.actingUnits as SerializedBwUnit[] | undefined | null, false);
        addUnits(war, action.discoveredUnits as SerializedBwUnit[] | undefined | null, false);
        updateTiles(war, action.actingTiles as SerializedBwTile[] | undefined | null);
        updateTiles(war, action.discoveredTiles as SerializedBwTile[] | undefined | null);
    }

    function moveUnit(war: ReplayWar, actionCode: WarActionCodes, revisedPath: MovePath, launchUnitId: number | null | undefined, fuelConsumption: number): void {
        const pathNodes             = revisedPath.nodes;
        const beginningGridIndex    = pathNodes[0];
        const fogMap                = war.getFogMap();
        const unitMap               = war.getUnitMap();
        const focusUnit             = unitMap.getUnit(beginningGridIndex, launchUnitId)!;
        const playerIndex           = focusUnit.getPlayerIndex();
        const isUnitBeLoaded        = (actionCode === WarActionCodes.WarActionUnitBeLoaded) && (!revisedPath.isBlocked);
        fogMap.updateMapFromPathsByUnitAndPath(focusUnit, pathNodes);

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
            if (!isLaunching) {
                fogMap.updateMapFromUnitsForPlayerOnLeaving(playerIndex, beginningGridIndex, focusUnit.getVisionRangeForPlayer(playerIndex, beginningGridIndex)!);
            }
            if (!isUnitBeLoaded) {
                fogMap.updateMapFromUnitsForPlayerOnArriving(playerIndex, endingGridIndex, focusUnit.getVisionRangeForPlayer(playerIndex, endingGridIndex)!);
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

    function getAdjacentPlasmas(tileMap: ReplayTileMap, origin: GridIndex): GridIndex[] {
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
