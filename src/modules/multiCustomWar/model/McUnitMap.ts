
namespace TinyWars.MultiCustomWar {
    import Types    = Utility.Types;
    import Helpers  = Utility.Helpers;
    import Logger   = Utility.Logger;
    import MapModel = Map.MapModel;

    type LoadedUnits = { [unitId: number]: McUnit };

    export class McUnitMap {
        private _war            : McWar;
        private _nextUnitId     : number;
        private _map            : (McUnit | undefined)[][];
        private _mapSize        : Types.MapSize;
        private _loadedUnits    : LoadedUnits;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers and serializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public constructor(configVersion?: number, mapIndexKey?: Types.MapIndexKey, data?: Types.SerializedMcUnitMap) {
            if ((configVersion != null) && (mapIndexKey)) {
                this.init(configVersion, mapIndexKey, data);
            }
        }

        public init(configVersion: number, mapIndexKey: Types.MapIndexKey, data?: Types.SerializedMcUnitMap): Promise<void> {
            if (data) {
                return this._initWithSerializedData(configVersion, mapIndexKey, data);
            } else {
                return this._initWithoutSerializedData(configVersion, mapIndexKey);
            }
        }

        private async _initWithSerializedData(configVersion: number, mapIndexKey: Types.MapIndexKey, data: Types.SerializedMcUnitMap): Promise<void> {
            const { mapWidth, mapHeight }   = await MapModel.getMapData(mapIndexKey);
            const unitDatas                 = data.units;
            const map                       = createEmptyMap(mapWidth);
            const loadedUnits: LoadedUnits  = {};
            if (unitDatas) {
                for (const unitData of unitDatas) {
                    const unit = new McUnit(unitData, configVersion);
                    if (unit.getLoaderUnitId() == null) {
                        map[unit.getGridX()][unit.getGridY()] = unit;
                    } else {
                        loadedUnits[unit.getUnitId()] = unit;
                    }
                }
            }

            this._map           = map;
            this._loadedUnits   = loadedUnits;
            this._mapSize       = { width: mapWidth, height: mapHeight };
            this.setNextUnitId(data.nextUnitId!);
        }

        private async _initWithoutSerializedData(configVersion: number, mapIndexKey: Types.MapIndexKey): Promise<void> {
            const { mapWidth, mapHeight, units: unitViewIds } = await MapModel.getMapData(mapIndexKey);
            const map       = createEmptyMap(mapWidth);
            let nextUnitId  = 0;
            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const viewId = unitViewIds[x + y * mapWidth];
                    if (viewId !== 0) {
                        map[x][y] = new McUnit({
                            gridX   : x,
                            gridY   : y,
                            viewId  : viewId,
                            unitId  : nextUnitId,
                        }, configVersion);
                        ++nextUnitId;
                    }
                }
            }

            this._map           = map;
            this._loadedUnits   = {};
            this._mapSize       = { width: mapWidth, height: mapHeight };
            this.setNextUnitId(nextUnitId);
        }

        public serialize(): Types.SerializedMcUnitMap {
            const units: Types.SerializedMcUnit[] = [];
            this.forEachUnitOnMap(unit => units.push(unit.serialize()));
            this.forEachUnitLoaded(unit => units.push(unit.serialize()));

            return {
                units       : units,
                nextUnitId  : this.getNextUnitId(),
            };
        }

        public serializeForPlayerIndex(playerIndex: number): Types.SerializedMcUnitMap {
            Logger.error("McUnitMap.serializeForPlayerIndex() TODO!!");
            return {};
        }

        public startRunning(war: McWar): void {
            this._war = war;
            this.forEachUnitOnMap(unit => unit.startRunning(war));
            this.forEachUnitLoaded(unit => unit.startRunning(war));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getMapSize(): Types.MapSize {
            return this._mapSize;
        }

        public getNextUnitId(): number {
            return this._nextUnitId;
        }
        public setNextUnitId(id: number): void {
            this._nextUnitId = id;
        }

        public getUnitOnMap(gridIndex: Types.GridIndex): McUnit | undefined {
            return this._map[gridIndex.x][gridIndex.y];
        }
        public getUnitLoadedById(unitId: number): McUnit | undefined {
            return this._loadedUnits[unitId];
        }
        public getUnitsLoadedByLoader(loader: McUnit, isRecursive: boolean): McUnit[] {
            const units: McUnit[] = [];
            this.forEachUnitLoaded((unit: McUnit) => {
                if (unit.getLoaderUnitId() === loader.getUnitId()) {
                    units.push(unit);
                    (isRecursive) && (units.push(...this.getUnitsLoadedByLoader(unit, isRecursive)));
                }
            });
            return units;
        }

        public swapUnit(gridIndex1: Types.GridIndex, gridIndex2: Types.GridIndex): void {
            if (!Helpers.checkIsGridIndexEqual(gridIndex1, gridIndex2)) {
                const {x: x1, y: y1}    = gridIndex1;
                const {x: x2, y: y2}    = gridIndex1;
                const map               = this._map;
                [map[x1][y1], map[x2][y2]] = [map[x2][y2], map[x1][y1]];
            }
        }

        public setUnitLoaded(gridIndex: Types.GridIndex): void {
            const { x, y }  = gridIndex;
            const unit      = this._map[x][y]!;
            this._loadedUnits[unit.getUnitId()] = unit;
            this._map[x][y]                     = undefined;
        }
        public setUnitUnloaded(unitId: number, gridIndex: Types.GridIndex): void {
            const { x, y }  = gridIndex;
            this._map[x][y] = this._loadedUnits[unitId];
            delete this._loadedUnits[unitId];
        }

        public addUnitOnMap(unit: McUnit): void {
            const x = unit.getGridX();
            const y = unit.getGridY();
            this._map[x][y] = unit;
        }
        public removeUnitOnMap(gridIndex: Types.GridIndex): void {
            this._map[gridIndex.x][gridIndex.y] = undefined;
        }

        public addUnitLoaded(unit: McUnit): void {
            this._loadedUnits[unit.getUnitId()] = unit;
        }
        public removeUnitLoaded(unitId: number): void {
            delete this._loadedUnits[unitId];
        }

        public forEachUnitOnMap(func: (unit: McUnit) => any): void {
            const { width, height } = this._mapSize;
            const map               = this._map;
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const unit = map[x][y];
                    (unit) && (func(unit));
                }
            }
        }
        public forEachUnitLoaded(func: (unit: McUnit) => any): void {
            const loadedUnits = this._loadedUnits;
            for (const i in loadedUnits) {
                func(loadedUnits[i]);
            }
        }
    }

    function createEmptyMap(mapWidth: number): McUnit[][] {
        const matrix = new Array<McUnit[]>(mapWidth);
        for (let i = 0; i < mapWidth; ++i) {
            matrix[i] = [];
        }
        return matrix;
    }
}

