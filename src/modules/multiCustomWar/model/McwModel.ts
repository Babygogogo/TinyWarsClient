
namespace TinyWars.MultiCustomWar.McwModel {
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import Helpers              = Utility.Helpers;
    import DestructionHelpers   = Utility.DestructionHelpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import Lang                 = Utility.Lang;
    import FloatText            = Utility.FloatText;
    import ActionContainer      = ProtoTypes.IActionContainer;
    import ActionCodes          = Network.Codes;
    import AlertPanel           = Common.AlertPanel;
    import GridIndex            = Types.GridIndex;
    import SerializedMcwTile    = Types.SerializedMcwTile;
    import SerializedMcwUnit    = Types.SerializedMcwUnit;
    import UnitState            = Types.UnitState;
    import MovePath             = Types.MovePath;
    import TileType             = Types.TileType;

    const _EXECUTORS = new Map<ActionCodes, (data: ActionContainer) => Promise<void>>([
        [ActionCodes.S_McwPlayerBeginTurn,      _executeMcwPlayerBeginTurn],
        [ActionCodes.S_McwPlayerEndTurn,        _executeMcwPlayerEndTurn],
        [ActionCodes.S_McwPlayerSurrender,      _executeMcwPlayerSurrender],
        [ActionCodes.S_McwProduceUnitOnTile,    _executeMcwProduceUnitOnTile],
        [ActionCodes.S_McwUnitAttack,           _executeMcwUnitAttack],
        [ActionCodes.S_McwUnitBeLoaded,         _executeMcwUnitBeLoaded],
        [ActionCodes.S_McwUnitCaptureTile,      _executeMcwUnitCaptureTile],
        [ActionCodes.S_McwUnitDrop,             _executeMcwUnitDrop],
        [ActionCodes.S_McwUnitWait,             _executeMcwUnitWait],
    ]);

    let _war            : McwWar;
    let _cachedActions  = new Array<ActionContainer>();

    export function init(): void {
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for managing war.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    export async function loadWar(data: Types.SerializedMcwWar): Promise<McwWar> {
        if (_war) {
            Logger.warn(`McwModel.loadWar() another war has been loaded already!`);
            unloadWar();
        }

        _war = (await new MultiCustomWar.McwWar().init(data)).startRunning().startRunningView();
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
    export function updateOnBeginTurn(data: ProtoTypes.IS_McwPlayerBeginTurn): void {
        _updateByActionContainer({ S_McwPlayerBeginTurn: data }, data.warId, data.actionId);
    }
    export function updateOnEndTurn(data: ProtoTypes.IS_McwPlayerEndTurn): void {
        _updateByActionContainer({ S_McwPlayerEndTurn: data }, data.warId, data.actionId);
    }
    export function updateOnPlayerSurrender(data: ProtoTypes.IS_McwPlayerSurrender): void {
        _updateByActionContainer({ S_McwPlayerSurrender: data }, data.warId, data.actionId);
    }
    export function updateOnProduceUnitOnTile(data: ProtoTypes.IS_McwProduceUnitOnTile): void {
        _updateByActionContainer({ S_McwProduceUnitOnTile: data }, data.warId, data.actionId);
    }
    export function updateOnUnitAttack(data: ProtoTypes.IS_McwUnitAttack): void {
        _updateByActionContainer({ S_McwUnitAttack: data }, data.warId, data.actionId);
    }
    export function updateOnUnitBeLoaded(data: ProtoTypes.IS_McwUnitBeLoaded): void {
        _updateByActionContainer({ S_McwUnitBeLoaded: data }, data.warId, data.actionId);
    }
    export function updateOnUnitCaptureTile(data: ProtoTypes.IS_McwUnitCaptureTile): void {
        _updateByActionContainer({ S_McwUnitCaptureTile: data }, data.warId, data.actionId);
    }
    export function updateOnUnitDrop(data: ProtoTypes.IS_McwUnitDrop): void {
        _updateByActionContainer({ S_McwUnitDrop: data }, data.warId, data.actionId);
    }
    export function updateOnUnitWait(data: ProtoTypes.IS_McwUnitWait): void {
        _updateByActionContainer({ S_McwUnitWait: data }, data.warId, data.actionId);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Util functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    function _updateByActionContainer(container: ActionContainer, warId: number, actionId: number): void {
        if ((_war) && (_war.getWarId() === warId)) {
            if (actionId !== _war.getNextActionId() + _cachedActions.length) {
                // TODO: refresh the war.
            } else {
                _cachedActions.push(container);
                _checkAndRunFirstCachedAction();
            }
        }
    }

    async function _checkAndRunFirstCachedAction(): Promise<void> {
        const container = _cachedActions.length ? _cachedActions.shift() : undefined;
        if ((container) && (_war.getIsRunningWar()) && (!_war.getIsEnded()) && (!_war.getIsRunningAction())) {
            _war.setIsRunningAction(true);
            _war.setNextActionId(_war.getNextActionId() + 1);
            await _EXECUTORS.get(Helpers.getActionCode(container))(container);
            _war.setIsRunningAction(false);

            if (!_war.getPlayerLoggedIn().getIsAlive()) {
                _war.setIsEnded(true);
                AlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0035),
                    content : Lang.getText(Lang.Type.A0023),
                    callback: () => Utility.FlowManager.gotoLobby(),
                });

            } else {
                if (_war.getPlayerManager().getAliveTeamsCount(false) <= 1) {
                    _war.setIsEnded(true);
                    AlertPanel.show({
                        title   : Lang.getText(Lang.Type.B0034),
                        content : Lang.getText(Lang.Type.A0022),
                        callback: () => Utility.FlowManager.gotoLobby(),
                    });

                } else {
                    // Do nothing, because the server will tell what to do next.
                }
            }
        }
    }

    function _checkAndRequestBeginTurn(): void {
        const turnManager = _war.getTurnManager();
        if ((turnManager.getPhaseCode() === Types.TurnPhaseCode.WaitBeginTurn)      &&
            (_war.getPlayerIndexLoggedIn() ===  turnManager.getPlayerIndexInTurn())
        ) {
            _war.getActionPlanner().setStateRequestingPlayerBeginTurn();
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The 'true' executors for war actions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    async function _executeMcwPlayerBeginTurn(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        await _war.getTurnManager().endPhaseWaitBeginTurn(data.S_McwPlayerBeginTurn);
        actionPlanner.setStateIdle();
    }

    async function _executeMcwPlayerEndTurn(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();
        await _war.getTurnManager().endPhaseMain();

        if (_war.getPlayerInTurn() === _war.getPlayerLoggedIn()) {
            actionPlanner.setStateRequestingPlayerBeginTurn();
        } else {
            actionPlanner.setStateIdle();
        }
    }

    async function _executeMcwPlayerSurrender(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const player = _war.getPlayerInTurn();
        DestructionHelpers.destroyPlayerForce(_war, player.getPlayerIndex(), true);
        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(_war);
        FloatText.show(Lang.getFormatedText(Lang.Type.F0008, player.getNickname()));

        actionPlanner.setStateIdle();
    }

    async function _executeMcwProduceUnitOnTile(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.S_McwProduceUnitOnTile;
        updateTilesAndUnitsBeforeExecutingAction(_war, action);

        const gridIndex     = action.gridIndex as GridIndex;
        const unitMap       = _war.getUnitMap();
        const unitId        = unitMap.getNextUnitId();
        const playerInTurn  = _war.getPlayerInTurn();

        if ((gridIndex) && (action.unitType != null)) {
            // TODO: take skills into account.
            const playerIndex   = playerInTurn.getPlayerIndex();
            const unit          = new McwUnit().init({
                unitId,
                viewId  : ConfigManager.getUnitViewId(action.unitType, playerIndex)!,
                gridX   : gridIndex.x,
                gridY   : gridIndex.y,
            }, _war.getConfigVersion());
            unit.setState(UnitState.Actioned);
            unit.startRunning(_war);
            unit.startRunningView();

            unitMap.addUnitOnMap(unit);
            _war.getFogMap().updateMapFromUnitsForPlayerOnArriving(playerIndex, gridIndex, unit.getVisionRangeForPlayer(playerIndex, gridIndex));
        }

        unitMap.setNextUnitId(unitId + 1);
        playerInTurn.setFund(playerInTurn.getFund() - action.cost);

        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(_war);

        actionPlanner.setStateIdle();
    }

    async function _executeMcwUnitAttack(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.S_McwUnitAttack;
        updateTilesAndUnitsBeforeExecutingAction(_war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const unitMap   = _war.getUnitMap();
        const attacker  = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(_war, ActionCodes.S_McwUnitAttack, path, action.launchUnitId, path.fuelConsumption);
        attacker.setState(UnitState.Actioned);

        if (path.isBlocked) {
            return new Promise<void>(resolve => {
                attacker.moveViewAlongPath(pathNodes, attacker.getIsDiving(), true, () => {
                    attacker.updateView();
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(_war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        } else {
            const counterDamage     = action.counterDamage;
            const targetGridIndex   = action.targetGridIndex as GridIndex;
            const tileMap           = _war.getTileMap();
            const attackTarget      = unitMap.getUnitOnMap(targetGridIndex) || tileMap.getTile(targetGridIndex);
            const targetUnit        = attackTarget instanceof McwUnit ? attackTarget : undefined;

            if (attacker.getPrimaryWeaponBaseDamage(attackTarget.getArmorType()) != null) {
                attacker.setPrimaryWeaponCurrentAmmo(attacker.getPrimaryWeaponCurrentAmmo()! - 1);
            }
            if ((counterDamage != null) && (targetUnit) && (targetUnit.getPrimaryWeaponBaseDamage(attacker.getArmorType()) != null)) {
                targetUnit.setPrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponCurrentAmmo()! - 1);
            }

            // TODO: deal with skills and energy.

            const attackerNewHp = Math.max(0, attacker.getCurrentHp() - (counterDamage || 0));
            attacker.setCurrentHp(attackerNewHp);
            if ((attackerNewHp === 0) && (targetUnit)) {
                targetUnit.setCurrentPromotion(Math.min(targetUnit.getMaxPromotion(), targetUnit.getCurrentPromotion() + 1));
            }

            const targetNewHp = Math.max(0, attackTarget.getCurrentHp()! - action.attackDamage);
            attackTarget.setCurrentHp(targetNewHp);
            if ((targetNewHp === 0) && (targetUnit)) {
                attacker.setCurrentPromotion(Math.min(attacker.getMaxPromotion(), attacker.getCurrentPromotion() + 1));
            }

            const attackerGridIndex = pathNodes[pathNodes.length - 1];
            const lostPlayerIndex   = action.lostPlayerIndex;
            const gridVisionEffect  = _war.getGridVisionEffect();

            return new Promise<void>(resolve => {
                attacker.moveViewAlongPath(pathNodes, attacker.getIsDiving(), false, () => {
                    if (attackerNewHp > 0) {
                        attacker.updateView();
                        if ((counterDamage != null) && (targetNewHp > 0)) {
                             gridVisionEffect.showEffectDamage(attackerGridIndex);
                        }
                    } else {
                        DestructionHelpers.destroyUnitOnMap(_war, attackerGridIndex, false, true);
                    }

                    if (targetNewHp > 0) {
                        attackTarget.updateView();
                        gridVisionEffect.showEffectDamage(targetGridIndex);
                    } else {
                        if (targetUnit) {
                            DestructionHelpers.destroyUnitOnMap(_war, targetGridIndex, false, true);
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
                        FloatText.show(Lang.getFormatedText(Lang.Type.F0015, _war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                        DestructionHelpers.destroyPlayerForce(_war, lostPlayerIndex, true);
                    }

                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(_war);

                    actionPlanner.setStateIdle();
                    resolve();
                }, targetGridIndex);
            });
        }
    }

    async function _executeMcwUnitBeLoaded(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.S_McwUnitBeLoaded;
        updateTilesAndUnitsBeforeExecutingAction(_war, action);

        const path          = action.path as MovePath;
        const pathNodes     = path.nodes;
        const unitMap       = _war.getUnitMap();
        const focusUnit     = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        const loaderUnit    = path.isBlocked ? undefined : unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]);
        moveUnit(_war, ActionCodes.S_McwUnitBeLoaded, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Actioned);
        (loaderUnit) && (focusUnit.setLoaderUnitId(loaderUnit.getUnitId()));

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                focusUnit.updateView();
                focusUnit.setViewVisible(false);
                (loaderUnit) && (loaderUnit.updateView());
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(_war);

                actionPlanner.setStateIdle();
                resolve();
            });
        })
    }

    async function _executeMcwUnitCaptureTile(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.S_McwUnitCaptureTile;
        updateTilesAndUnitsBeforeExecutingAction(_war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = _war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(_war, ActionCodes.S_McwUnitCaptureTile, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Actioned);

        if (path.isBlocked) {
            return new Promise<void>(resolve => {
                focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), true, () => {
                    focusUnit.updateView();
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(_war);

                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        } else {
            const destination           = pathNodes[pathNodes.length - 1];
            const tile                  = _war.getTileMap().getTile(destination);
            const restCapturePoint      = tile.getCurrentCapturePoint() - focusUnit.getCaptureAmount();
            const previousPlayerIndex   = tile.getPlayerIndex();
            const lostPlayerIndex       = ((restCapturePoint <= 0) && (tile.checkIsDefeatOnCapture())) ? previousPlayerIndex : undefined;

            if (restCapturePoint > 0) {
                focusUnit.setIsCapturingTile(true);
                tile.setCurrentCapturePoint(restCapturePoint);
            } else {
                const fogMap = _war.getFogMap();
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
                        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(_war);

                        actionPlanner.setStateIdle();
                        resolve();
                    });
                });
            } else {
                return new Promise<void>(resolve => {
                    focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false, () => {
                        focusUnit.updateView();
                        tile.updateView();
                        FloatText.show(Lang.getFormatedText(Lang.Type.F0016, _war.getPlayerManager().getPlayer(lostPlayerIndex).getNickname()));
                        DestructionHelpers.destroyPlayerForce(_war, lostPlayerIndex, true);
                        McwHelpers.updateTilesAndUnitsOnVisibilityChanged(_war);

                        actionPlanner.setStateIdle();
                        resolve();
                    });
                });
            }
        }
    }

    async function _executeMcwUnitDrop(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.S_McwUnitDrop;
        updateTilesAndUnitsBeforeExecutingAction(_war, action);

        const path              = action.path as MovePath;
        const pathNodes         = path.nodes;
        const unitMap           = _war.getUnitMap();
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = unitMap.getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(_war, ActionCodes.S_McwUnitDrop, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Actioned);

        const playerIndex           = focusUnit.getPlayerIndex();
        const shouldUpdateFogMap    = _war.getPlayerLoggedIn().getTeamIndex() === focusUnit.getTeamIndex();
        const fogMap                = _war.getFogMap();
        const unitsForDrop          = [] as McwUnit[];
        for (const { unitId, gridIndex } of action.dropDestinations as Types.DropDestination[]) {
            const unitForDrop = unitMap.getUnitLoadedById(unitId);
            unitMap.setUnitUnloaded(unitId, gridIndex);
            for (const unit of unitMap.getUnitsLoadedByLoader(unitForDrop, true)) {
                unit.setGridIndex(gridIndex);
            }

            unitForDrop.setLoaderUnitId(undefined);
            unitForDrop.setGridIndex(gridIndex);
            unitForDrop.setState(UnitState.Actioned);
            unitsForDrop.push(unitForDrop);

            if (shouldUpdateFogMap) {
                fogMap.updateMapFromPathsByUnitAndPath(unitForDrop, [endingGridIndex, gridIndex]);
                fogMap.updateMapFromUnitsForPlayerOnArriving(playerIndex, gridIndex, unitForDrop.getVisionRangeForPlayer(playerIndex, gridIndex));
            }
        }

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                if (action.isDropBlocked) {
                    _war.getGridVisionEffect().showEffectBlock(endingGridIndex);
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
                    McwHelpers.updateTilesAndUnitsOnVisibilityChanged(_war);
                    actionPlanner.setStateIdle();
                    resolve();
                });
            });
        });
    }

    async function _executeMcwUnitWait(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.S_McwUnitWait;
        updateTilesAndUnitsBeforeExecutingAction(_war, action);

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = _war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(_war, ActionCodes.S_McwUnitWait, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Actioned);

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                focusUnit.updateView();
                McwHelpers.updateTilesAndUnitsOnVisibilityChanged(_war);

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
            const fogMap        = war.getFogMap();
            const configVersion = war.getConfigVersion();

            for (const unitData of unitsData) {
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

                if (isOnMap) {
                    const playerIndex   = unit.getPlayerIndex();
                    const gridIndex     = unit.getGridIndex();
                    fogMap.updateMapFromUnitsForPlayerOnArriving(playerIndex, gridIndex, unit.getVisionRangeForPlayer(playerIndex, gridIndex));
                }
            }
        }
    }
    function updateTiles(war: McwWar, tilesData: SerializedMcwTile[] | undefined | null): void {
        if ((tilesData) && (tilesData.length)) {
            const tileMap   = war.getTileMap();
            const fogMap    = war.getFogMap();

            for (const tileData of tilesData) {
                const gridIndex = { x: tileData.gridX, y: tileData.gridY };
                const tile      = tileMap.getTile(gridIndex);
                egret.assert(tile.getIsFogEnabled(), "McwModel.updateTiles() the tile has no fog and therefore should not be updated!");
                tile.setFogDisabled(tileData);

                const playerIndex = tile.getPlayerIndex();
                if (playerIndex > 0) {
                    fogMap.updateMapFromTilesForPlayerOnGettingOwnership(playerIndex, gridIndex, tile.getVisionRangeForPlayer(playerIndex));
                }
            }
        }
    }
    function updateTilesAndUnitsBeforeExecutingAction(
        war     : McwWar,
        action  : {
            actingTiles?    : ProtoTypes.ISerializedMcwTile[],
            actingUnits?    : ProtoTypes.ISerializedMcwUnit[],
            discoveredTiles?: ProtoTypes.ISerializedMcwTile[],
            discoveredUnits?: ProtoTypes.ISerializedMcwUnit[],
        }
    ): void {
        addUnits(war, action.actingUnits as SerializedMcwUnit[] | undefined | null, false);
        addUnits(war, action.discoveredUnits as SerializedMcwUnit[] | undefined | null, false);
        updateTiles(war, action.actingTiles as SerializedMcwTile[] | undefined | null);
        updateTiles(war, action.discoveredTiles as SerializedMcwTile[] | undefined | null);
    }

    function moveUnit(war: McwWar, actionCode: ActionCodes, revisedPath: MovePath, launchUnitId: number | null | undefined, fuelConsumption: number): void {
        const pathNodes             = revisedPath.nodes;
        const beginningGridIndex    = pathNodes[0];
        const fogMap                = war.getFogMap();
        const unitMap               = war.getUnitMap();
        const focusUnit             = unitMap.getUnit(beginningGridIndex, launchUnitId)!;
        const playerIndex           = focusUnit.getPlayerIndex();
        const shouldUpdateFogMap    = war.getPlayerLoggedIn().getTeamIndex() === focusUnit.getTeamIndex();
        const isUnitBeLoaded        = (actionCode === ActionCodes.S_McwUnitBeLoaded) && (!revisedPath.isBlocked);
        if (shouldUpdateFogMap) {
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
            if ((shouldUpdateFogMap) && (!isLaunching)) {
                fogMap.updateMapFromUnitsForPlayerOnLeaving(playerIndex, beginningGridIndex, focusUnit.getVisionRangeForPlayer(playerIndex, beginningGridIndex)!);
            }
            if ((shouldUpdateFogMap) && (!isUnitBeLoaded)) {
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
