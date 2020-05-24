
namespace TinyWars.BaseWar {
    import MapManager           = WarMap.WarMapModel;
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import SerializedBwFogMap   = Types.SerializedFogMap;
    import ForceFogCode         = Types.ForceFogCode;
    import GridIndex            = Types.GridIndex;
    import MapSize              = Types.MapSize;
    import Visibility           = Types.Visibility;

    export abstract class BwFogMap {
        private _forceFogCode           : ForceFogCode;
        private _forceExpirePlayerIndex : number | null;
        private _forceExpireTurnIndex   : number | null;
        private _mapSize                : MapSize;
        private _mapsFromPaths          : Map<number, Visibility[][]>;
        private _war                    : BwWar;

        public async init(data: SerializedBwFogMap, mapSizeAndMaxPlayerIndex: Types.MapSizeAndMaxPlayerIndex): Promise<BwFogMap> {
            const mapSize       : MapSize = { width: mapSizeAndMaxPlayerIndex.mapWidth, height: mapSizeAndMaxPlayerIndex.mapHeight };
            this._mapsFromPaths = createEmptyMaps<Visibility>(mapSize, mapSizeAndMaxPlayerIndex.maxPlayerIndex);
            this._setMapSize(mapSize);
            this.setForceFogCode(data.forceFogCode || ForceFogCode.None);
            this.setForceExpirePlayerIndex(data.forceExpirePlayerIndex);
            this.setForceExpireTurnIndex(data.forceExpireTurnIndex);

            for (const d of data.mapsForPath || []) {
                this.resetMapFromPathsForPlayer(d.playerIndex, d.encodedMap);
            }

            return this;
        }
        public async fastInit(data: SerializedBwFogMap, mapSizeAndMaxPlayerIndex: Types.MapSizeAndMaxPlayerIndex): Promise<BwFogMap> {
            return this.init(data, mapSizeAndMaxPlayerIndex);
        }

        public startRunning(war: BwWar): void {
            this._war = war;
        }

        protected _getWar(): BwWar {
            return this._war;
        }
        protected _getMapsFromPaths(): Map<number, Visibility[][]> {
            return this._mapsFromPaths;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _setMapSize(mapSize: MapSize): void {
            this._mapSize = mapSize;
        }
        public getMapSize(): MapSize {
            return this._mapSize;
        }

        public setForceFogCode(code: ForceFogCode): void {
            this._forceFogCode = code;
        }
        public getForceFogCode(): ForceFogCode {
            return this._forceFogCode;
        }

        public checkHasFogByDefault(): boolean {
            return this._war.getSettingsHasFog();
        }
        public checkHasFogCurrently(): boolean {
            const fogCode = this.getForceFogCode();
            return (fogCode === ForceFogCode.Fog)
                || ((this.checkHasFogByDefault()) && (fogCode !== ForceFogCode.Clear));
        }

        public setForceExpireTurnIndex(index: number | undefined | null): void {
            this._forceExpireTurnIndex = index;
        }
        public getForceExpireTurnIndex(): number | undefined | null {
            return this._forceExpireTurnIndex;
        }

        public setForceExpirePlayerIndex(index: number | undefined | null): void {
            this._forceExpirePlayerIndex = index;
        }
        public getForceExpirePlayerIndex(): number | undefined | null {
            return this._forceExpirePlayerIndex;
        }

        public resetAllMapsForPlayer(playerIndex: number): void {
            this.resetMapFromPathsForPlayer(playerIndex);
        }

        public resetMapFromPathsForPlayer(playerIndex: number, encodedData?: string): void {
            const map = this._mapsFromPaths.get(playerIndex)!;
            if (encodedData == null) {
                fillMap(map, 0);
            } else {
                const { width, height } = this.getMapSize();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        map[x][y] = Number(encodedData[x + y * width]) as Visibility;
                    }
                }
            }
        }
        public updateMapFromPathsByUnitAndPath(unit: BwUnit, path: GridIndex[]): void {
            const playerIndex   = unit.getPlayerIndex();
            const map           = this._mapsFromPaths.get(playerIndex)!;
            const mapSize       = this.getMapSize();
            const isTrueVision  = unit.checkIsTrueVision();

            for (const pathNode of path) {
                const visionRange = unit.getVisionRangeForPlayer(playerIndex, pathNode);
                if (visionRange) {
                    for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(pathNode, 0, 1, mapSize)) {
                        map[gridIndex.x][gridIndex.y] = Visibility.TrueVision;
                    }
                    for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(pathNode, 2, visionRange, mapSize)) {
                        if (isTrueVision) {
                            map[gridIndex.x][gridIndex.y] = Visibility.TrueVision;
                        } else {
                            if (map[gridIndex.x][gridIndex.y] === Visibility.OutsideVision) {
                                map[gridIndex.x][gridIndex.y] = Visibility.InsideVision;
                            }
                        }
                    }
                }
            }
        }
        public updateMapFromPathsByFlare(playerIndex: number, flareGridIndex: GridIndex, flareRadius: number): void {
            const map = this._mapsFromPaths.get(playerIndex)!;
            for (const gridIndex of GridIndexHelpers.getGridsWithinDistance(flareGridIndex, 0, flareRadius, this.getMapSize())) {
                map[gridIndex.x][gridIndex.y] = 2;
            }
        }

        public getVisibilityFromPathsForPlayer(gridIndex: GridIndex, playerIndex: number): Visibility {
            if (!this.checkHasFogCurrently()) {
                return Visibility.TrueVision;
            } else {
                return this._mapsFromPaths.get(playerIndex)![gridIndex.x][gridIndex.y];
            }
        }
        public getVisibilityMapFromPathsForTeam(teamIndex: number): Visibility[][] {
            return this.getVisibilityMapFromPathsForTeams(new Set([teamIndex]));
        }
        public getVisibilityMapFromPathsForTeams(teamIndexes: Set<number>): Visibility[][] {
            const { width, height } = this.getMapSize();
            const resultMap         = Helpers.createEmptyMap<Visibility>(width, height, Visibility.OutsideVision);
            if (!this.checkHasFogCurrently()) {
                resultMap.forEach(column => column.fill(Visibility.TrueVision));
            } else {
                const mapFromPaths  = this._mapsFromPaths;
                const playerIndexes = this._getWar().getPlayerManager().getPlayerIndexesInTeams(teamIndexes);
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        for (const playerIndex of playerIndexes) {
                            resultMap[x][y] = Math.max(
                                resultMap[x][y],
                                mapFromPaths.get(playerIndex)[x][y] || Visibility.OutsideVision
                            );
                        }
                    }
                }
            }
            return resultMap;
        }
        public getVisibilityMapFromPathsForUser(userId: number): Visibility[][] {
            return this.getVisibilityMapFromPathsForTeams(this._getWar().getWatcherTeamIndexes(userId));
        }

        public getVisibilityFromTilesForPlayer(gridIndex: GridIndex, playerIndex: number): Visibility {
            if (!this.checkHasFogCurrently()) {
                return Visibility.TrueVision;
            } else {
                const tileMap = this._getWar().getTileMap();
                if (tileMap.getTile(gridIndex).getPlayerIndex() === playerIndex) {
                    return Visibility.TrueVision;
                } else {
                    const { width, height } = tileMap.getMapSize();
                    for (let x = 0; x < width; ++x) {
                        for (let y = 0; y < height; ++y) {
                            const tileGridIndex = { x, y };
                            const visionRange   = tileMap.getTile(tileGridIndex).getVisionRangeForPlayer(playerIndex);
                            if ((visionRange != null) && (GridIndexHelpers.getDistance(gridIndex, tileGridIndex) <= visionRange)) {
                                return Visibility.InsideVision;
                            }
                        }
                    }
                    return Visibility.OutsideVision;
                }
            }
        }
        public getVisibilityMapFromTilesForTeam(teamIndex: number): Visibility[][] {
            return this.getVisibilityMapFromTilesForTeams(new Set([teamIndex]));
        }
        public getVisibilityMapFromTilesForTeams(teamIndexes: Set<number>): Visibility[][] {
            const mapSize           = this.getMapSize();
            const { width, height } = mapSize;
            const resultMap         = Helpers.createEmptyMap<Visibility>(width, height, Visibility.OutsideVision);
            if (!this.checkHasFogCurrently()) {
                resultMap.forEach(column => column.fill(Visibility.TrueVision));
            } else {
                const tileMap = this._getWar().getTileMap();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        const tileGridIndex : GridIndex = { x, y };
                        const tile          = tileMap.getTile(tileGridIndex);
                        if (teamIndexes.has(tile.getTeamIndex())) {
                            resultMap[x][y] = Visibility.TrueVision;
                        }

                        const visionRange = tile.getVisionRangeForTeamIndexes(teamIndexes);
                        if (visionRange != null) {
                            for (const g of GridIndexHelpers.getGridsWithinDistance(tileGridIndex, 0, visionRange, mapSize)) {
                                if (resultMap[g.x][g.y] === Visibility.OutsideVision) {
                                    resultMap[g.x][g.y] = Visibility.InsideVision;
                                }
                            }
                        }
                    }
                }
            }
            return resultMap;
        }
        public getVisibilityMapFromTilesForUser(userId: number): Visibility[][] {
            return this.getVisibilityMapFromTilesForTeams(this._getWar().getWatcherTeamIndexes(userId));
        }

        public getVisibilityFromUnitsForPlayer(gridIndex: GridIndex, playerIndex: number): Visibility {
            if (!this.checkHasFogCurrently()) {
                return Visibility.TrueVision;
            } else {
                const unitMap           = this._getWar().getUnitMap();
                const { width, height } = unitMap.getMapSize();
                let isInside            = false;
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        const unitGridIndex = { x, y };
                        const unit          = unitMap.getUnitOnMap(unitGridIndex);
                        if (unit) {
                            const visionRange = unit.getVisionRangeForPlayer(playerIndex, unitGridIndex);
                            if (visionRange != null) {
                                const distance = GridIndexHelpers.getDistance(gridIndex, unitGridIndex);
                                if (distance <= 1) {
                                    return Visibility.TrueVision;
                                }
                                if (visionRange >= distance) {
                                    if (unit.checkIsTrueVision()) {
                                        return Visibility.TrueVision;
                                    }
                                    isInside = true;
                                }
                            }
                        }
                    }
                }
                return isInside ? Visibility.InsideVision : Visibility.OutsideVision;
            }
        }
        public getVisibilityMapFromUnitsForTeam(teamIndex: number): Visibility[][] {
            return this.getVisibilityMapFromUnitsForTeams(new Set([teamIndex]));
        }
        public getVisibilityMapFromUnitsForTeams(teamIndexes: Set<number>): Visibility[][] {
            const mapSize           = this.getMapSize();
            const { width, height } = mapSize;
            const resultMap         = Helpers.createEmptyMap<Visibility>(width, height, Visibility.OutsideVision);
            if (!this.checkHasFogCurrently()) {
                resultMap.forEach(column => column.fill(Visibility.TrueVision));
            } else {
                const unitMap = this._getWar().getUnitMap();
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        const unitGridIndex : GridIndex = { x, y };
                        const unit          = unitMap.getUnitOnMap(unitGridIndex);
                        if (unit) {
                            const visionRange = unit.getVisionRangeForTeamIndexes(teamIndexes, unitGridIndex);
                            if (visionRange != null) {
                                for (const g of GridIndexHelpers.getGridsWithinDistance(unitGridIndex, 0, 1, mapSize)) {
                                    resultMap[g.x][g.y] = Visibility.TrueVision;
                                }

                                const isTrueVision = unit.checkIsTrueVision();
                                for (const g of GridIndexHelpers.getGridsWithinDistance(unitGridIndex, 2, visionRange, mapSize)) {
                                    if (isTrueVision) {
                                        resultMap[g.x][g.y] = Visibility.TrueVision;
                                    } else {
                                        if (resultMap[g.x][g.y] === Visibility.OutsideVision) {
                                            resultMap[g.x][g.y] = Visibility.InsideVision;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            return resultMap;
        }
        public getVisibilityMapFromUnitsForUser(userId: number): Visibility[][] {
            return this.getVisibilityMapFromUnitsForTeams(this._getWar().getWatcherTeamIndexes(userId));
        }
    }

    function createEmptyMaps<T extends (number | Visibility)>(mapSize: MapSize, maxPlayerIndex: number): Map<number, T[][]> {
        const map = new Map<number, T[][]>();
        for (let i = 0; i <= maxPlayerIndex; ++i) {
            map.set(i, Helpers.createEmptyMap<T>(mapSize.width, mapSize.height, 0 as T));
        }
        return map;
    }

    function fillMap(map: number[][], data: number): void {
        for (const column of map) {
            column.fill(data);
        }
    }
}
