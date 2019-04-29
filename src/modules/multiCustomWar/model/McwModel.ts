
namespace TinyWars.MultiCustomWar.McwModel {
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import ProtoTypes           = Utility.ProtoTypes;
    import Helpers              = Utility.Helpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import DestructionHelpers   = Utility.DestructionHelpers;
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

    const _EXECUTORS = new Map<ActionCodes, (data: ActionContainer) => Promise<void>>([
        [ActionCodes.S_McwPlayerBeginTurn,  _executeMcwPlayerBeginTurn],
        [ActionCodes.S_McwPlayerEndTurn,    _executeMcwPlayerEndTurn],
        [ActionCodes.S_McwPlayerSurrender,  _executeMcwPlayerSurrender],
        [ActionCodes.S_McwUnitBeLoaded,     _executeMcwUnitBeLoaded],
        [ActionCodes.S_McwUnitCaptureTile,  _executeMcwUnitCaptureTile],
        [ActionCodes.S_McwUnitWait,         _executeMcwUnitWait],
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
    export function updateOnUnitBeLoaded(data: ProtoTypes.IS_McwUnitBeLoaded): void {
        _updateByActionContainer({ S_McwUnitBeLoaded: data }, data.warId, data.actionId);
    }
    export function updateOnUnitCaptureTile(data: ProtoTypes.IS_McwUnitCaptureTile): void {
        _updateByActionContainer({ S_McwUnitCaptureTile: data }, data.warId, data.actionId);
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
        updateTilesAndUnitsOnVisibilityChanged(_war);
        FloatText.show(Lang.getFormatedText(Lang.Type.F0008, player.getNickname()));

        actionPlanner.setStateIdle();
    }

    async function _executeMcwUnitBeLoaded(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.S_McwUnitBeLoaded;
        updateTilesAndUnitsBeforeExecutingAction(
            _war,
            action.actingTiles as SerializedMcwTile[],
            action.actingUnits as SerializedMcwUnit[],
            action.discoveredTiles as SerializedMcwTile[],
            action.discoveredUnits as SerializedMcwUnit[]
        );

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
                updateTilesAndUnitsOnVisibilityChanged(_war);

                actionPlanner.setStateIdle();
                resolve();
            });
        })
    }

    async function _executeMcwUnitCaptureTile(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.S_McwUnitCaptureTile;
        updateTilesAndUnitsBeforeExecutingAction(
            _war,
            action.actingTiles as SerializedMcwTile[],
            action.actingUnits as SerializedMcwUnit[],
            action.discoveredTiles as SerializedMcwTile[],
            action.discoveredUnits as SerializedMcwUnit[]
        );

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = _war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(_war, ActionCodes.S_McwUnitCaptureTile, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Actioned);

        if (path.isBlocked) {
            return new Promise<void>(resolve => {
                focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), true, () => {
                    focusUnit.updateView();
                    updateTilesAndUnitsOnVisibilityChanged(_war);

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
                        updateTilesAndUnitsOnVisibilityChanged(_war);

                        actionPlanner.setStateIdle();
                        resolve();
                    });
                });
            } else {
                const playerManager = _war.getPlayerManager();
                if ((_war.getPlayerIndexLoggedIn() === lostPlayerIndex) || (playerManager.getAliveTeamsCount(false, lostPlayerIndex) <= 1)) {
                    _war.setIsEnded(true);
                }

                return new Promise<void>(resolve => {
                    focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), false, () => {
                        focusUnit.updateView();
                        tile.updateView();
                        FloatText.show(Lang.getFormatedText(Lang.Type.F0013, playerManager.getPlayer(lostPlayerIndex).getNickname()));
                        DestructionHelpers.destroyPlayerForce(_war, lostPlayerIndex, true);
                        updateTilesAndUnitsOnVisibilityChanged(_war);

                        actionPlanner.setStateIdle();
                        resolve();
                    });
                });
            }
        }
    }

    async function _executeMcwUnitWait(data: ActionContainer): Promise<void> {
        const actionPlanner = _war.getActionPlanner();
        actionPlanner.setStateExecutingAction();

        const action = data.S_McwUnitWait;
        updateTilesAndUnitsBeforeExecutingAction(
            _war,
            action.actingTiles as SerializedMcwTile[],
            action.actingUnits as SerializedMcwUnit[],
            action.discoveredTiles as SerializedMcwTile[],
            action.discoveredUnits as SerializedMcwUnit[]
        );

        const path      = action.path as MovePath;
        const pathNodes = path.nodes;
        const focusUnit = _war.getUnitMap().getUnit(pathNodes[0], action.launchUnitId);
        moveUnit(_war, ActionCodes.S_McwUnitWait, path, action.launchUnitId, path.fuelConsumption);
        focusUnit.setState(UnitState.Actioned);

        return new Promise<void>(resolve => {
            focusUnit.moveViewAlongPath(pathNodes, focusUnit.getIsDiving(), path.isBlocked, () => {
                focusUnit.updateView();
                updateTilesAndUnitsOnVisibilityChanged(_war);

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
                const unit = new McwUnit().init(unitData, configVersion);
                if (unit.getLoaderUnitId() == null) {
                    unitMap.addUnitOnMap(unit);
                } else {
                    unitMap.addUnitLoaded(unit);
                }
                unit.startRunning(war);
                unit.setViewVisible(isViewVisible);
            }
        }
    }
    function updateTiles(war: McwWar, tilesData: SerializedMcwTile[] | undefined | null): void {
        if ((tilesData) && (tilesData.length)) {
            const tileMap = war.getTileMap();
            for (const tileData of tilesData) {
                const tile = tileMap.getTile({ x: tileData.gridX, y: tileData.gridY });
                egret.assert(tile.getIsFogEnabled(), "McwModel.updateTiles() the tile has no fog and therefore should not be updated!");
                tile.setFogDisabled(tileData);
            }
        }
    }
    function updateTilesAndUnitsBeforeExecutingAction(
        war             : McwWar,
        actingTiles     : SerializedMcwTile[] | undefined | null,
        actingUnits     : SerializedMcwUnit[] | undefined | null,
        discoveredTiles : SerializedMcwTile[] | undefined | null,
        discoveredUnits : SerializedMcwUnit[] | undefined | null
    ): void {
        addUnits(war, actingUnits, false);
        addUnits(war, discoveredUnits, false);
        updateTiles(war, actingTiles);
        updateTiles(war, discoveredTiles);
    }

    function updateTilesAndUnitsOnVisibilityChanged(war: McwWar): void {
        const playerIndex = war.getPlayerIndexLoggedIn();
        war.getTileMap().forEachTile(tile => {
            if (VisibilityHelpers.checkIsTileVisibleToPlayer(war, tile.getGridIndex(), playerIndex)) {
                tile.setFogDisabled();
            } else {
                tile.setFogEnabled();
            }
            tile.updateView();
        });
        war.getUnitMap().forEachUnitOnMap(unit => {
            const gridIndex = unit.getGridIndex();
            if (VisibilityHelpers.checkIsUnitOnMapVisibleToPlayer({
                war,
                gridIndex,
                unitType            : unit.getType(),
                isDiving            : unit.getIsDiving(),
                unitPlayerIndex     : unit.getPlayerIndex(),
                observerPlayerIndex : playerIndex,
            })) {
                unit.setViewVisible(true);
            } else {
                DestructionHelpers.destroyUnitOnMap(war, gridIndex, false);
            }
        })
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
}
