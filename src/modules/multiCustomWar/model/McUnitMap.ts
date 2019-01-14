
namespace TinyWars.MultiCustomWar {
    import Types        = Utility.Types;
    import Helpers      = Utility.Helpers;
    import Logger       = Utility.Logger;
    import Visibility   = Utility.VisibilityCalculator;
    import MapModel     = WarMap.WarMapModel;

    export class McUnitMap {
        private _war            : McWar;
        private _nextUnitId     : number;
        private _map            : (McUnit | undefined)[][];
        private _mapSize        : Types.MapSize;
        private _loadedUnits    : Map<number, McUnit>;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers and serializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public constructor() {
        }

        public init(configVersion: number, mapIndexKey: Types.MapIndexKey, data?: Types.SerializedMcUnitMap): Promise<McUnitMap> {
            return data
                ? this._initWithSerializedData(configVersion, mapIndexKey, data)
                : this._initWithoutSerializedData(configVersion, mapIndexKey);
        }
        private async _initWithSerializedData(configVersion: number, mapIndexKey: Types.MapIndexKey, data: Types.SerializedMcUnitMap): Promise<McUnitMap> {
            const { mapWidth, mapHeight }   = await MapModel.getMapData(mapIndexKey);
            const unitDatas                 = data.units;
            const map                       = Helpers.createEmptyMap<McUnit>(mapWidth);
            const loadedUnits               = new Map<number, McUnit>();
            if (unitDatas) {
                for (const unitData of unitDatas) {
                    const unit = new McUnit(unitData, configVersion);
                    if (unit.getLoaderUnitId() == null) {
                        map[unit.getGridX()][unit.getGridY()] = unit;
                    } else {
                        loadedUnits.set(unit.getUnitId(), unit);
                    }
                }
            }

            this._map           = map;
            this._loadedUnits   = loadedUnits;
            this._setMapSize(mapWidth, mapHeight);
            this.setNextUnitId(data.nextUnitId!);

            return this;
        }
        private async _initWithoutSerializedData(configVersion: number, mapIndexKey: Types.MapIndexKey): Promise<McUnitMap> {
            const { mapWidth, mapHeight, units: unitViewIds } = await MapModel.getMapData(mapIndexKey);
            const map       = Helpers.createEmptyMap<McUnit>(mapWidth);
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
            this._loadedUnits   = new Map<number, McUnit>();
            this._setMapSize(mapWidth, mapHeight);
            this.setNextUnitId(nextUnitId);

            return this;
        }

        public startRunning(war: McWar): void {
            this._war = war;
            this.forEachUnitOnMap(unit => unit.startRunning(war));
            this.forEachUnitLoaded(unit => unit.startRunning(war));
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
            const war = this._war;
            const units: Types.SerializedMcUnit[] = [];
            this.forEachUnitOnMap(unit => {
                if (Visibility.checkIsUnitOnMapVisibleToPlayer(war, unit.getGridIndex(), unit.getType(), unit.getIsDiving(), unit.getPlayerIndex(), playerIndex)) {
                    units.push(unit.serialize());

                    for (const loadedUnit of this.getUnitsLoadedByLoader(unit, true)) {
                        units.push(loadedUnit.serialize());
                    }
                }
            });

            return {
                units       : units.length ? units : undefined,
                nextUnitId  : this.getNextUnitId(),
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _setMapSize(width: number, height: number): void {
            this._mapSize = { width: width, height: height };
        }
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
            return this._loadedUnits.get(unitId);
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
            this._map[x][y] = undefined;
            this._loadedUnits.set(unit.getUnitId(), unit);
        }
        public setUnitUnloaded(unitId: number, gridIndex: Types.GridIndex): void {
            this._map[gridIndex.x][gridIndex.y] = this._loadedUnits.get(unitId);
            this._loadedUnits.delete(unitId);
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
            this._loadedUnits.set(unit.getUnitId(), unit);
        }
        public removeUnitLoaded(unitId: number): void {
            this._loadedUnits.delete(unitId);
        }

        public forEachUnitOnMap(func: (unit: McUnit) => any): void {
            const { width, height } = this.getMapSize();
            const map               = this._map;
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const unit = map[x][y];
                    (unit) && (func(unit));
                }
            }
        }
        public forEachUnitLoaded(func: (unit: McUnit) => any): void {
            for (const [, unit] of this._loadedUnits) {
                func(unit);
            }
        }
    }
}
