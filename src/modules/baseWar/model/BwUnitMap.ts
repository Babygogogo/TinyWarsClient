
namespace TinyWars.BaseWar {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import MapModel         = WarMap.WarMapModel;

    export abstract class BwUnitMap {
        private _war            : BwWar;
        private _configVersion  : string;
        private _nextUnitId     : number;
        private _map            : (BwUnit | undefined)[][];
        private _mapSize        : Types.MapSize;
        private _loadedUnits    : Map<number, BwUnit>;

        private _view   : BwUnitMapView;

        protected abstract _getViewClass(): new () => BwUnitMapView;
        protected abstract _getBwUnitClass(): new () => BwUnit;

        public async init(configVersion: string, mapFileName: string, data?: Types.SerializedBwUnitMap): Promise<BwUnitMap> {
            this._configVersion = configVersion;
            if (data) {
                await this._initWithSerializedData(configVersion, mapFileName, data)
            } else {
                await this._initWithoutSerializedData(configVersion, mapFileName);
            }

            this._view = this._view || new (this._getViewClass())();
            this._view.init(this);

            return this;
        }
        private async _initWithSerializedData(configVersion: string, mapFileName: string, data: Types.SerializedBwUnitMap): Promise<BwUnitMap> {
            const { mapWidth, mapHeight }   = await MapModel.getMapRawData(mapFileName);
            const unitDataList              = data.units;
            const map                       = Helpers.createEmptyMap<BwUnit>(mapWidth);
            const loadedUnits               = new Map<number, BwUnit>();
            if (unitDataList) {
                for (const unitData of unitDataList) {
                    const unit = new (this._getBwUnitClass())().init(unitData, configVersion);
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
        private async _initWithoutSerializedData(configVersion: string, mapFileName: string): Promise<BwUnitMap> {
            const { mapWidth, mapHeight, units: unitViewIds } = await MapModel.getMapRawData(mapFileName);
            const map       = Helpers.createEmptyMap<BwUnit>(mapWidth);
            let nextUnitId  = 0;
            for (let x = 0; x < mapWidth; ++x) {
                for (let y = 0; y < mapHeight; ++y) {
                    const viewId = unitViewIds[x + y * mapWidth];
                    if (viewId !== 0) {
                        map[x][y] = new (this._getBwUnitClass())().init({
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
            this._loadedUnits   = new Map<number, BwUnit>();
            this._setMapSize(mapWidth, mapHeight);
            this.setNextUnitId(nextUnitId);

            return this;
        }

        public startRunning(war: BwWar): void {
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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): BwUnitMapView {
            return this._view;
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        public getWar(): BwWar {
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

        public getUnit(gridIndex: Types.GridIndex, unitId: number | undefined | null): BwUnit | undefined {
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
        public getUnitById(unitId: number): BwUnit | null {
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

        public getUnitOnMap(gridIndex: Types.GridIndex): BwUnit | undefined {
            return this._map[gridIndex.x][gridIndex.y];
        }
        public getUnitLoadedById(unitId: number): BwUnit | undefined {
            return this._loadedUnits.get(unitId);
        }
        public getUnitsLoaded(): Map<number, BwUnit> {
            return this._loadedUnits;
        }
        public getUnitsLoadedByLoader(loader: BwUnit, isRecursive: boolean): BwUnit[] {
            const units: BwUnit[] = [];
            this.forEachUnitLoaded((unit: BwUnit) => {
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

        public addUnitOnMap(unit: BwUnit): void {
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

        public addUnitLoaded(unit: BwUnit): void {
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

        public forEachUnit(func: (unit: BwUnit) => any): void {
            this.forEachUnitOnMap(func);
            this.forEachUnitLoaded(func);
        }
        public forEachUnitOnMap(func: (unit: BwUnit) => any): void {
            for (const column of this._map) {
                for (const unit of column) {
                    (unit) && (func(unit));
                }
            }
        }
        public forEachUnitLoaded(func: (unit: BwUnit) => any): void {
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
