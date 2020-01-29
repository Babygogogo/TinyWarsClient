
namespace TinyWars.MapEditor {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import MapModel         = WarMap.WarMapModel;

    export class MeUnitMap {
        private _war            : MeWar;
        private _configVersion  : string;
        private _nextUnitId     : number;
        private _map            : (MeUnit | undefined)[][];
        private _mapSize        : Types.MapSize;
        private _loadedUnits    : Map<number, MeUnit>;

        private _view   : MeUnitMapView;

        public init(configVersion: string, mapRawData: Types.MapRawData): MeUnitMap {
            this._configVersion = configVersion;
            this._initWithMapRawData(configVersion, mapRawData);

            this._view = this._view || new MeUnitMapView();
            this._view.init(this);

            return this;
        }
        private _initWithMapRawData(configVersion: string, mapRawData: Types.MapRawData): MeUnitMap {
            const { mapWidth, mapHeight }   = mapRawData;
            const map                       = Helpers.createEmptyMap<MeUnit>(mapWidth);
            const loadedUnits               = new Map<number, MeUnit>();

            const unitViewIds = mapRawData.units;
            if (unitViewIds) {
                let nextUnitId = 0;
                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        const viewId = unitViewIds[x + y * mapWidth];
                        if (viewId !== 0) {
                            map[x][y] = new MeUnit().init({
                                gridX   : x,
                                gridY   : y,
                                viewId  : viewId,
                                unitId  : nextUnitId,
                            }, configVersion);
                            ++nextUnitId;
                        }
                    }
                }
                this.setNextUnitId(nextUnitId);

            } else {
                const unitDataList = mapRawData.unitDataList;
                if (unitDataList) {
                    let nextUnitId = 0;
                    for (const unitData of unitDataList) {
                        const unit  = new MeUnit().init(unitData, configVersion);
                        nextUnitId  = Math.max(nextUnitId, unitData.unitId + 1);
                        if (unit.getLoaderUnitId() == null) {
                            map[unit.getGridX()][unit.getGridY()] = unit;
                        } else {
                            loadedUnits.set(unit.getUnitId(), unit);
                        }
                    }
                    this.setNextUnitId(nextUnitId);

                } else {
                    this.setNextUnitId(0);
                }
            }

            this._map           = map;
            this._loadedUnits   = loadedUnits;
            this._setMapSize(mapWidth, mapHeight);

            return this;
        }

        public startRunning(war: MeWar): void {
            this._setWar(war);
            this.forEachUnitOnMap(unit => unit.startRunning(war));
            this.forEachUnitLoaded(unit => unit.startRunning(war));
        }
        public startRunningView(): void {
            this.getView().startRunningView();
            this.forEachUnitOnMap(unit => unit.startRunningView());
            this.forEachUnitLoaded(unit => unit.startRunningView());
        }
        public stopRunning(): void {
            this.forEachUnit(unit => unit.stopRunning());
            this.getView().stopRunningView();
        }

        public serialize(): Types.SerializedUnit[] {
            const dataList: Types.SerializedUnit[] = [];
            this.forEachUnit(unit => {
                dataList.push(unit.serialize());
            });
            return dataList;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): MeUnitMapView {
            return this._view;
        }

        private _setWar(war: MeWar): void {
            this._war = war;
        }
        public getWar(): MeWar {
            return this._war;
        }

        public getConfigVersion(): string {
            return this._configVersion;
        }

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

        public getUnit(gridIndex: Types.GridIndex, unitId: number | undefined | null): MeUnit | undefined {
            if (unitId == null) {
                return this.getUnitOnMap(gridIndex);
            } else {
                const unitLoaded = this.getUnitLoadedById(unitId);
                if (unitLoaded) {
                    return unitLoaded;
                } else {
                    const unitOnMap = this.getUnitOnMap(gridIndex);
                    if (!unitOnMap) {
                        return null;
                    } else {
                        return unitOnMap.getUnitId() === unitId ? unitOnMap : null;
                    }
                }
            }
        }
        public getUnitById(unitId: number): MeUnit | null {
            const unitLoaded = this.getUnitLoadedById(unitId);
            if (unitLoaded) {
                return unitLoaded;
            } else {
                for (const column of this._map) {
                    for (const unit of column) {
                        if ((unit) && (unit.getUnitId() === unitId)) {
                            return unit;
                        }
                    }
                }
                return null;
            }
        }

        public reviseAllUnitIds(): void {
            const allUnits  = new Map<number, { unit: MeUnit, newUnitId: number }>();
            let nextUnitId  = 0;
            this.forEachUnit(unit => {
                allUnits.set(unit.getUnitId(), { unit, newUnitId: nextUnitId } );
                ++nextUnitId;
            });
            for (const [, value] of allUnits) {
                const unit = value.unit;
                unit.setUnitId(value.newUnitId);

                const loaderUnitId = unit.getLoaderUnitId();
                if (loaderUnitId != null) {
                    unit.setLoaderUnitId(allUnits.get(loaderUnitId).newUnitId);
                }
            }
            this.setNextUnitId(nextUnitId);
        }

        public getUnitOnMap(gridIndex: Types.GridIndex): MeUnit | undefined {
            return this._map[gridIndex.x][gridIndex.y];
        }
        public getUnitLoadedById(unitId: number): MeUnit | undefined {
            return this._loadedUnits.get(unitId);
        }
        public getUnitsLoaded(): Map<number, MeUnit> {
            return this._loadedUnits;
        }
        public getUnitsLoadedByLoader(loader: MeUnit, isRecursive: boolean): MeUnit[] {
            const units: MeUnit[] = [];
            this.forEachUnitLoaded((unit: MeUnit) => {
                if (unit.getLoaderUnitId() === loader.getUnitId()) {
                    units.push(unit);
                    (isRecursive) && (units.push(...this.getUnitsLoadedByLoader(unit, isRecursive)));
                }
            });
            return units;
        }

        public swapUnit(gridIndex1: Types.GridIndex, gridIndex2: Types.GridIndex): void {
            if (!GridIndexHelpers.checkIsEqual(gridIndex1, gridIndex2)) {
                const {x: x1, y: y1}    = gridIndex1;
                const {x: x2, y: y2}    = gridIndex2;
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

        public addUnitOnMap(unit: MeUnit): void {
            const x = unit.getGridX();
            const y = unit.getGridY();
            this._map[x][y] = unit;
            this.getView().addUnit(unit.getView(), true);
        }
        public removeUnitOnMap(gridIndex: Types.GridIndex, removeView: boolean): void {
            const unit = this.getUnitOnMap(gridIndex);
            this._map[gridIndex.x][gridIndex.y] = undefined;
            (removeView) && (this.getView().removeUnit(unit.getView()));
        }

        public addUnitLoaded(unit: MeUnit): void {
            this._loadedUnits.set(unit.getUnitId(), unit);
            this.getView().addUnit(unit.getView(), true);
        }
        public removeUnitLoaded(unitId: number): void {
            const unit = this._loadedUnits.get(unitId);
            this._loadedUnits.delete(unitId);
            this.getView().removeUnit(unit.getView());
        }
        public removeUnitsLoadedForPlayer(playerIndex: number): void {
            const units = this._loadedUnits;
            for (const [unitId, unit] of units) {
                if (unit.getPlayerIndex() === playerIndex) {
                    units.delete(unitId);
                    this.getView().removeUnit(unit.getView());
                }
            }
        }

        public forEachUnit(func: (unit: MeUnit) => any): void {
            this.forEachUnitOnMap(func);
            this.forEachUnitLoaded(func);
        }
        public forEachUnitOnMap(func: (unit: MeUnit) => any): void {
            for (const column of this._map) {
                for (const unit of column) {
                    (unit) && (func(unit));
                }
            }
        }
        public forEachUnitLoaded(func: (unit: MeUnit) => any): void {
            for (const [, unit] of this._loadedUnits) {
                func(unit);
            }
        }

        public countUnitsOnMapForPlayer(playerIndex: number): number {
            let count = 0;
            this.forEachUnitOnMap(unit => {
                (unit.getPlayerIndex() === playerIndex) && (++count);
            });
            return count;
        }

        public checkHasUnit(playerIndex: number): boolean {
            for (const column of this._map) {
                for (const unit of column) {
                    if ((unit) && (unit.getPlayerIndex() === playerIndex)) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}
