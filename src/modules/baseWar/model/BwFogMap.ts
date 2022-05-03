
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import TwnsBwUnit           from "./BwUnit";
// import TwnsBwWar            from "./BwWar";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import Types                from "../../tools/helpers/Types";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import ForceFogCode             = Twns.Types.ForceFogCode;
    import GridIndex                = Twns.Types.GridIndex;
    import MapSize                  = Twns.Types.MapSize;
    import Visibility               = Twns.Types.Visibility;
    import WarSerialization         = CommonProto.WarSerialization;
    import ISerialFogMap            = WarSerialization.ISerialFogMap;
    import IDataForFogMapFromPath   = WarSerialization.IDataForFogMapFromPath;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import BwWar                    = BaseWar.BwWar;

    export abstract class BwFogMap {
        private _forceFogCode?              : ForceFogCode;
        private _forceExpirePlayerIndex?    : number | null;
        private _forceExpireTurnIndex?      : number | null;
        private _mapSize?                   : MapSize;
        private _allMapsFromPath?           : Map<number, Visibility[][]>;
        private _war?                       : BwWar;

        public abstract startRunning(war: BwWar): void;

        public init({ data, mapSize, playersCountUnneutral }: {
            data                    : Twns.Types.Undefinable<ISerialFogMap>;
            mapSize                 : MapSize;
            playersCountUnneutral   : number;
        }): void {
            if (data == null) {
                throw Twns.Helpers.newError(`Empty data.`, ClientErrorCode.BwFogMap_Init_00);
            }

            const forceFogCode = data.forceFogCode as ForceFogCode;
            if ((forceFogCode !== ForceFogCode.Clear)   &&
                (forceFogCode !== ForceFogCode.Fog)     &&
                (forceFogCode !== ForceFogCode.None)
            ) {
                throw Twns.Helpers.newError(`Invalid forceFogCode: ${forceFogCode}`, ClientErrorCode.BwFogMap_Init_01);
            }

            const forceExpirePlayerIndex = data.forceExpirePlayerIndex;
            if ((forceExpirePlayerIndex != null)                                                                                    &&
                ((forceExpirePlayerIndex < CommonConstants.WarNeutralPlayerIndex) || (forceExpirePlayerIndex > playersCountUnneutral))
            ) {
                throw Twns.Helpers.newError(`Invalid forceExpirePlayerIndex: ${forceExpirePlayerIndex}`, ClientErrorCode.BwFogMap_Init_02);
            }

            const forceExpireTurnIndex = data.forceExpireTurnIndex;
            if (((forceExpirePlayerIndex == null) && (forceExpireTurnIndex != null)) ||
                ((forceExpirePlayerIndex != null) && (forceExpireTurnIndex == null))
            ) {
                throw Twns.Helpers.newError(`Invalid forceExpireTurnIndex: ${forceExpireTurnIndex}`, ClientErrorCode.BwFogMap_Init_03);
            }

            if (!WarHelpers.WarCommonHelpers.checkIsValidMapSize(mapSize)) {
                throw Twns.Helpers.newError(`Invalid mapSize.`, ClientErrorCode.BwFogMap_Init_04);
            }

            const allMapsFromPath   = createEmptyMaps<Visibility>(mapSize, playersCountUnneutral);
            const playerIndexSet    = new Set<number>();
            for (const d of data.mapsFromPath || []) {
                const playerIndex = Twns.Helpers.getExisted(d.playerIndex, ClientErrorCode.BwFogMap_Init_05);
                if (playerIndexSet.has(playerIndex)) {
                    throw Twns.Helpers.newError(`Duplicated playerIndex: ${playerIndex}`, ClientErrorCode.BwFogMap_Init_06);
                }
                playerIndexSet.add(playerIndex);

                const mapFromPath = Twns.Helpers.getExisted(allMapsFromPath.get(playerIndex), ClientErrorCode.BwFogMap_Init_07);
                resetMapFromPath(mapFromPath, mapSize, d.visibilityArray ?? null);
            }

            this._setMapSize(Twns.Helpers.deepClone(mapSize));
            this._setAllMapsFromPath(allMapsFromPath);
            this.setForceFogCode(forceFogCode);
            this.setForceExpirePlayerIndex(forceExpirePlayerIndex ?? null);
            this.setForceExpireTurnIndex(forceExpireTurnIndex ?? null);
        }
        public fastInit({ data, mapSize, playersCountUnneutral }: {
            data                    : Twns.Types.Undefinable<ISerialFogMap>;
            mapSize                 : Twns.Types.MapSize;
            playersCountUnneutral   : number;
        }): void {
            this.init({
                data,
                mapSize,
                playersCountUnneutral
            });
        }

        public serialize(): ISerialFogMap {
            const mapSize               = this.getMapSize();
            const serialMapsFromPath    : IDataForFogMapFromPath[] = [];
            for (const [playerIndex, map] of this._getAllMapsFromPath()) {
                const visibilityArray = WarHelpers.WarCommonHelpers.getVisibilityArrayWithMapFromPath(map, mapSize);
                if (visibilityArray != null) {
                    serialMapsFromPath.push({
                        playerIndex,
                        visibilityArray,
                    });
                }
            }

            return {
                forceFogCode            : this.getForceFogCode(),
                forceExpirePlayerIndex  : this.getForceExpirePlayerIndex(),
                forceExpireTurnIndex    : this.getForceExpireTurnIndex(),
                mapsFromPath            : serialMapsFromPath,
            };
        }
        public serializeForCreateSfw(): ISerialFogMap {
            const mapSize           = this.getMapSize();
            const war               = this._getWar();
            const targetTeamIndexes = war.getPlayerManager().getWatcherTeamIndexesForSelf();
            const mapsFromPath       : IDataForFogMapFromPath[] = [];

            for (const [playerIndex, map] of this._getAllMapsFromPath()) {
                const player = war.getPlayer(playerIndex);
                if ((player)                                                    &&
                    (player.getAliveState() === Twns.Types.PlayerAliveState.Alive)   &&
                    (targetTeamIndexes.has(player.getTeamIndex()))
                ) {
                    const visibilityArray = WarHelpers.WarCommonHelpers.getVisibilityArrayWithMapFromPath(map, mapSize);
                    if (visibilityArray != null) {
                        mapsFromPath.push({
                            playerIndex,
                            visibilityArray,
                        });
                    }
                }
            }
            return {
                forceFogCode            : this.getForceFogCode(),
                forceExpirePlayerIndex  : this.getForceExpirePlayerIndex(),
                forceExpireTurnIndex    : this.getForceExpireTurnIndex(),
                mapsFromPath,
            };
        }
        public serializeForCreateMfr(): ISerialFogMap {
            return this.serializeForCreateSfw();
        }

        protected _setWar(war: BwWar): void {
            this._war = war;
        }
        protected _getWar(): BwWar {
            return Twns.Helpers.getExisted(this._war);
        }

        private _setAllMapsFromPath(mapsFromPath: Map<number, Visibility[][]>): void {
            this._allMapsFromPath = mapsFromPath;
        }
        protected _getAllMapsFromPath(): Map<number, Visibility[][]> {
            return Twns.Helpers.getExisted(this._allMapsFromPath);
        }
        private _getMapFromPath(playerIndex: number): Visibility[][] {
            return Twns.Helpers.getExisted(this._getAllMapsFromPath().get(playerIndex));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _setMapSize(mapSize: MapSize): void {
            this._mapSize = mapSize;
        }
        public getMapSize(): MapSize {
            return Twns.Helpers.getExisted(this._mapSize);
        }

        public setForceFogCode(code: ForceFogCode): void {
            this._forceFogCode = code;
        }
        public getForceFogCode(): ForceFogCode {
            return Twns.Helpers.getExisted(this._forceFogCode);
        }

        public checkHasFogByDefault(): boolean {
            return this._getWar().getCommonSettingManager().getSettingsHasFogByDefault();
        }
        public checkHasFogCurrently(): boolean {
            const fogCode = this.getForceFogCode();
            if (fogCode === ForceFogCode.Fog) {
                return true;
            } else if (fogCode === ForceFogCode.Clear) {
                return false;
            } else {
                const war               = this._getWar();
                const weatherFogType    = war.getGameConfig().getWeatherCfg(war.getWeatherManager().getCurrentWeatherType())?.fog;
                if (weatherFogType === Twns.Types.WeatherFogType.Fog) {
                    return true;
                } else if (weatherFogType === Twns.Types.WeatherFogType.NoFog) {
                    return false;
                } else {
                    return this.checkHasFogByDefault();
                }
            }
        }

        public setForceExpireTurnIndex(index: number | null): void {
            this._forceExpireTurnIndex = index;
        }
        public getForceExpireTurnIndex(): number | null {
            return Twns.Helpers.getDefined(this._forceExpireTurnIndex, ClientErrorCode.BwFogMap_GetForceExpireTurnIndex_00);
        }

        public setForceExpirePlayerIndex(index: number | null): void {
            this._forceExpirePlayerIndex = index;
        }
        public getForceExpirePlayerIndex(): number | null {
            return Twns.Helpers.getDefined(this._forceExpirePlayerIndex, ClientErrorCode.BwFogMap_GetForceExpirePlayerIndex_00);
        }

        public updateOnPlayerTurnSwitched(): void {
            const expireTurnIndex   = this.getForceExpireTurnIndex();
            const expirePlayerIndex = this.getForceExpirePlayerIndex();
            if ((expireTurnIndex == null) || (expirePlayerIndex == null)) {
                return;
            }

            const turnManager       = this._getWar().getTurnManager();
            const currentTurnIndex  = turnManager.getTurnIndex();
            if ((expireTurnIndex < currentTurnIndex)                                                                ||
                (expireTurnIndex === currentTurnIndex) && (expirePlayerIndex <= turnManager.getPlayerIndexInTurn())
            ) {
                this.setForceFogCode(Twns.Types.ForceFogCode.None);
                this.setForceExpireTurnIndex(null);
                this.setForceExpirePlayerIndex(null);
            }
        }

        public resetAllMapsForPlayer(playerIndex: number): void {
            this.resetMapFromPathsForPlayerWithEncodedData(playerIndex);
        }

        public resetMapFromPathsForPlayer(playerIndex: number, visibilityList: Twns.Types.Visibility[] | null): void {
            resetMapFromPath(this._getMapFromPath(playerIndex), this.getMapSize(), visibilityList);
        }
        public resetMapFromPathsForPlayerWithEncodedData(playerIndex: number, encodedData?: string): void {
            const map = Twns.Helpers.getExisted(this._getAllMapsFromPath().get(playerIndex));
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
        public updateMapFromPathsByUnitAndPath(unit: BaseWar.BwUnit, path: GridIndex[]): void {
            const playerIndex   = unit.getPlayerIndex();
            const mapSize       = this.getMapSize();
            const mapFromPath   = this._getMapFromPath(playerIndex);
            for (const pathNode of path) {
                const visionRange = unit.getVisionRangeForPlayer(playerIndex, pathNode);
                if (visionRange) {
                    for (const gridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: pathNode, minDistance: 0, maxDistance: 1, mapSize })) {
                        mapFromPath[gridIndex.x][gridIndex.y] = Visibility.TrueVision;
                    }
                    for (const gridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: pathNode, minDistance: 2, maxDistance: visionRange, mapSize })) {
                        if (unit.checkIsTrueVision(gridIndex)) {
                            mapFromPath[gridIndex.x][gridIndex.y] = Visibility.TrueVision;
                        } else {
                            if (mapFromPath[gridIndex.x][gridIndex.y] === Visibility.OutsideVision) {
                                mapFromPath[gridIndex.x][gridIndex.y] = Visibility.InsideVision;
                            }
                        }
                    }
                }
            }
        }
        public updateMapFromPathsByVisibilityArray(playerIndex: number, visibilityArray: Twns.Types.Undefinable<number[]>): void {
            if (visibilityArray == null) {
                return;
            }

            const map       = this._getMapFromPath(playerIndex);
            const mapSize   = this.getMapSize();
            for (const value of visibilityArray) {
                const gridIndex                 = GridIndexHelpers.getGridIndexByGridId(Math.floor(value / 10), mapSize);
                map[gridIndex.x][gridIndex.y]   = value % 10;
            }
        }
        public updateMapFromPathsByFlare(playerIndex: number, flareGridIndex: GridIndex, flareRadius: number): void {
            const map = this._getMapFromPath(playerIndex);
            for (const gridIndex of GridIndexHelpers.getGridsWithinDistance({ origin: flareGridIndex, minDistance: 0, maxDistance: flareRadius, mapSize: this.getMapSize() })) {
                map[gridIndex.x][gridIndex.y] = 2;
            }
        }

        public getVisibilityFromPathsForPlayer(gridIndex: GridIndex, playerIndex: number): Visibility {
            if (!this.checkHasFogCurrently()) {
                return Visibility.TrueVision;
            } else {
                return this._getMapFromPath(playerIndex)[gridIndex.x][gridIndex.y];
            }
        }
        public getVisibilityMapFromPathsForTeam(teamIndex: number): Visibility[][] {
            return this.getVisibilityMapFromPathsForTeams(new Set([teamIndex]));
        }
        public getVisibilityMapFromPathsForTeams(teamIndexes: Set<number>): Visibility[][] {
            const { width, height } = this.getMapSize();
            const resultMap         = Twns.Helpers.createEmptyMap<Visibility>(width, height, Visibility.OutsideVision);
            if (!this.checkHasFogCurrently()) {
                resultMap.forEach(column => column.fill(Visibility.TrueVision));
            } else {
                const mapFromPaths  = this._getAllMapsFromPath();
                const playerIndexes = this._getWar().getPlayerManager().getPlayerIndexesInTeams(teamIndexes);
                for (let x = 0; x < width; ++x) {
                    for (let y = 0; y < height; ++y) {
                        for (const playerIndex of playerIndexes) {
                            resultMap[x][y] = Math.max(
                                resultMap[x][y],
                                Twns.Helpers.getExisted(mapFromPaths.get(playerIndex))[x][y] || Visibility.OutsideVision
                            );
                        }
                    }
                }
            }
            return resultMap;
        }
        // public getVisibilityMapFromPathsForUser(userId: number): Visibility[][] {
        //     return this.getVisibilityMapFromPathsForTeams(this._getWar().getWatcherTeamIndexes(userId));
        // }

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
            const resultMap         = Twns.Helpers.createEmptyMap<Visibility>(width, height, Visibility.OutsideVision);
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
                            for (const g of GridIndexHelpers.getGridsWithinDistance({ origin: tileGridIndex, minDistance: 0, maxDistance: visionRange, mapSize })) {
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
        // public getVisibilityMapFromTilesForUser(userId: number): Visibility[][] {
        //     return this.getVisibilityMapFromTilesForTeams(this._getWar().getWatcherTeamIndexes(userId));
        // }

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
                                    if (unit.checkIsTrueVision(unitGridIndex)) {
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
            const resultMap         = Twns.Helpers.createEmptyMap<Visibility>(width, height, Visibility.OutsideVision);
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
                                for (const g of GridIndexHelpers.getGridsWithinDistance({ origin: unitGridIndex, minDistance: 0, maxDistance: 1, mapSize })) {
                                    resultMap[g.x][g.y] = Visibility.TrueVision;
                                }

                                const isTrueVision = unit.checkIsTrueVision(unitGridIndex);
                                for (const g of GridIndexHelpers.getGridsWithinDistance({ origin: unitGridIndex, minDistance: 2, maxDistance: visionRange, mapSize })) {
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
        // public getVisibilityMapFromUnitsForUser(userId: number): Visibility[][] {
        //     return this.getVisibilityMapFromUnitsForTeams(this._getWar().getWatcherTeamIndexes(userId));
        // }
    }

    function createEmptyMaps<T extends (number | Visibility)>(mapSize: MapSize, maxPlayerIndex: number): Map<number, T[][]> {
        const map = new Map<number, T[][]>();
        for (let i = 0; i <= maxPlayerIndex; ++i) {
            map.set(i, Twns.Helpers.createEmptyMap<T>(mapSize.width, mapSize.height, 0 as T));
        }
        return map;
    }

    function fillMap(map: number[][], data: number): void {
        for (const column of map) {
            column.fill(data);
        }
    }

    function resetMapFromPath(mapFromPath: Visibility[][], mapSize: MapSize, visibilityList: Visibility[] | null): void {
        const { width, height } = mapSize;
        if (mapFromPath.length !== width) {
            throw Twns.Helpers.newError(`Invalid width: ${width}`, ClientErrorCode.BwFogMap_ResetMapFromPath_00);
        }

        for (let x = 0; x < width; ++x) {
            const column = mapFromPath[x];
            if ((column == null) || (column.length !== height)) {
                throw Twns.Helpers.newError(`Invalid height: ${height}`, ClientErrorCode.BwFogMap_ResetMapFromPath_01);
            }
        }

        if (visibilityList == null) {
            fillMap(mapFromPath, 0);
            return;
        }

        if (visibilityList.length !== width * height) {
            throw Twns.Helpers.newError(`Invalid visibilityList.length: ${visibilityList.length}`, ClientErrorCode.BwFogMap_ResetMapFromPath_02);
        }

        for (let x = 0; x < width; ++x) {
            const column = mapFromPath[x];
            for (let y = 0; y < height; ++y) {
                const visibility = visibilityList[x + y * width];
                if ((visibility !== Visibility.InsideVision)    &&
                    (visibility !== Visibility.OutsideVision)   &&
                    (visibility !== Visibility.TrueVision)
                ) {
                    throw Twns.Helpers.newError(`Invalid visibility: ${visibility}`, ClientErrorCode.BwFogMap_ResetMapFromPath_03);
                }

                column[y] = visibility;
            }
        }
    }
}

// export default TwnsBwFogMap;
