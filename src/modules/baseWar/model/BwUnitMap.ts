
namespace TinyWars.BaseWar {
    import Types                    = Utility.Types;
    import Helpers                  = Utility.Helpers;
    import GridIndexHelpers         = Utility.GridIndexHelpers;
    import Logger                   = Utility.Logger;
    import ProtoTypes               = Utility.ProtoTypes;
    import VisibilityHelpers        = Utility.VisibilityHelpers;
    import MapSizeAndMaxPlayerIndex = Types.MapSizeAndMaxPlayerIndex;
    import GridIndex                = Types.GridIndex;
    import WarSerialization         = ProtoTypes.WarSerialization;
    import ISerialUnitMap           = WarSerialization.ISerialUnitMap;
    import ISerialUnit              = WarSerialization.ISerialUnit;

    export abstract class BwUnitMap {
        private _war            : BwWar;
        private _configVersion  : string;
        private _nextUnitId     : number;
        private _map            : (BwUnit | undefined)[][];
        private _mapSize        : Types.MapSize;
        private _loadedUnits    : Map<number, BwUnit>;

        private _view   : BwUnitMapView;

        protected abstract _getViewClass(): new () => BwUnitMapView;
        public abstract getUnitClass(): new () => BwUnit;

        public init(
            data                    : ISerialUnitMap,
            configVersion           : string,
            mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex,
        ): BwUnitMap | undefined {
            const nextUnitId = data.nextUnitId;
            if (nextUnitId == null) {
                Logger.error(`BwUnitMap.init() empty nextUnitId.`);
                return undefined;
            }

            const { mapWidth, mapHeight }   = mapSizeAndMaxPlayerIndex;
            const map                       = Helpers.createEmptyMap<BwUnit>(mapWidth);
            const loadedUnits               = new Map<number, BwUnit>();
            for (const unitData of data.units || []) {
                const unit = new (this.getUnitClass())().init(unitData, configVersion);
                if (!unit) {
                    Logger.error(`BwUnitMap.init() failed to create a unit! unitData: ${JSON.stringify(unitData)}`);
                    return undefined;
                }

                const gridIndex = unit.getGridIndex();
                if ((!gridIndex) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, { width: mapWidth, height: mapHeight }))) {
                    Logger.error(`BwUnitMap.init() invalid gridIndex: ${JSON.stringify(gridIndex)}`);
                    return undefined;
                }

                if (unit.getLoaderUnitId() == null) {
                    map[gridIndex.x][gridIndex.y] = unit;
                } else {
                    const unitId = unit.getUnitId();
                    if (unitId == null) {
                        Logger.error(`BwUnitMap.init() empty unitId! unitData: ${JSON.stringify(unitData)}`);
                        return;
                    }
                    loadedUnits.set(unitId, unit);
                }
            }

            this._setConfigVersion(configVersion);
            this._setMap(map);
            this._setLoadedUnits(loadedUnits);
            this._setMapSize(mapWidth, mapHeight);
            this.setNextUnitId(nextUnitId);

            const view = this.getView() || new (this._getViewClass())();
            view.init(this);
            this._setView(view);

            return this;
        }
        public async fastInit(
            data                    : ISerialUnitMap | null | undefined,
            configVersion           : string,
            mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex,
        ): Promise<BwUnitMap> {
            return this.init(data, configVersion, mapSizeAndMaxPlayerIndex);
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

        public serialize(): ISerialUnitMap | undefined {
            const nextUnitId = this.getNextUnitId();
            if (nextUnitId == null) {
                Logger.error(`BwUnitMap.serialize() empty nextUnitId.`);
                return undefined;
            }

            const units: ISerialUnit[] = [];
            for (const unit of this._getAllUnits()) {
                const serializedUnit = unit.serialize();
                if (!serializedUnit) {
                    Logger.error(`BwUnitMap.serialize() empty serializedUnit.`);
                    return undefined;
                }

                units.push(serializedUnit);
            }

            return {
                units,
                nextUnitId,
            };
        }
        public serializeForSimulation(): ISerialUnitMap | undefined {
            const nextUnitId = this.getNextUnitId();
            if (nextUnitId == null) {
                Logger.error(`BwUnitMap.serializeForSimulation() empty nextUnitId.`);
                return undefined;
            }

            const war           = this.getWar();
            const units         : ISerialUnit[] = [];
            const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            for (const unit of VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
                units.push(unit.serializeForSimulation());

                if (teamIndexes.has(unit.getTeamIndex())) {
                    for (const loadedUnit of this.getUnitsLoadedByLoader(unit, true)) {
                        units.push(loadedUnit.serializeForSimulation());
                    }
                }
            }

            return {
                units,
                nextUnitId,
            };
        }

        private _setMap(map: (BwUnit | undefined)[][]): void {
            this._map = map;
        }
        private _getMap(): (BwUnit | undefined)[][] | undefined {
            return this._map;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _setView(view: BwUnitMapView): void {
            this._view = view;
        }
        public getView(): BwUnitMapView {
            return this._view;
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        public getWar(): BwWar {
            return this._war;
        }

        private _setConfigVersion(configVersion: string): void {
            this._configVersion = configVersion;
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
        public getVisibleUnitOnMap(gridIndex: GridIndex): BwUnit | undefined | null {
            const unit = this.getUnitOnMap(gridIndex);
            if (unit == null) {
                return null;
            }

            const war = this._war;
            if (war == null) {
                Logger.error(`BwUnitMap.getVisibleUnitOnMap() empty war.`);
                return undefined;
            }

            const unitType = unit.getType();
            if (unitType == null) {
                Logger.error(`BwUnitMap.getVisibleUnitOnMap() empty unitType.`);
                return undefined;
            }

            const isDiving = unit.getIsDiving();
            if (isDiving == null) {
                Logger.error(`BwUnitMap.getVisibleUnitOnMap() empty isDiving.`);
                return undefined;
            }

            const playerInTurn = war.getPlayerInTurn();
            if (playerInTurn == null) {
                Logger.error(`BwUnitMap.getVisibleUnitOnMap() empty playerInTurn.`);
                return undefined;
            }

            const observerTeamIndex = playerInTurn.getTeamIndex();
            if (observerTeamIndex == null) {
                Logger.error(`BwUnitMap.getVisibleUnitOnMap() empty observerTeamIndex.`);
                return undefined;
            }

            const unitPlayerIndex = unit.getPlayerIndex();
            if (unitPlayerIndex == null) {
                Logger.error(`BwUnitMap.getVisibleUnitOnMap() empty unitPlayerIndex.`);
                return undefined;
            }

            return (VisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                war,
                unitType,
                isDiving,
                observerTeamIndex,
                gridIndex,
                unitPlayerIndex,
            }))
            ? unit
            : null;
        }

        public getUnitLoadedById(unitId: number): BwUnit | undefined {
            return this._loadedUnits.get(unitId);
        }
        private _setLoadedUnits(units: Map<number, BwUnit>): void {
            this._loadedUnits = units;
        }
        public getLoadedUnits(): Map<number, BwUnit> {
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

        private _getAllUnitsOnMap(): BwUnit[] {
            const units: BwUnit[] = [];
            this.forEachUnitOnMap(unit => units.push(unit));
            return units;
        }
        protected _getAllUnits(): BwUnit[] {
            const units = this._getAllUnitsOnMap();
            this.forEachUnitLoaded(unit => units.push(unit));
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

        public setUnitLoaded(unit: BwUnit): void {
            const loadedUnits = this.getLoadedUnits();
            if (loadedUnits == null) {
                Logger.error(`BwUnitMap.setUnitLoaded() the map is not initialized.`);
                return;
            }

            const unitId = unit.getUnitId();
            if (unitId == null) {
                Logger.error(`BwUnitMap.setUnitLoaded() the unit has no unitId.`);
                return;
            }

            if (loadedUnits.has(unitId)) {
                Logger.error(`BwUnitMap.setUnitLoaded() the unit is already loaded?!?.`);
                return;
            }

            loadedUnits.set(unitId, unit);
            this.getView().addUnit(unit.getView(), true);
        }
        public setUnitUnloaded(unitId: number, gridIndex: Types.GridIndex): void {
            this._map[gridIndex.x][gridIndex.y] = this._loadedUnits.get(unitId);
            this._loadedUnits.delete(unitId);
        }

        public setUnitOnMap(unit: BwUnit): void {
            const mapSize   = this.getMapSize();
            const map       = this._getMap();
            if ((!mapSize) || (!map)) {
                Logger.error(`BwUnitMap.setUnitOnMap() the map is not initialized.`);
                return;
            }

            const gridIndex = unit.getGridIndex();
            if ((!gridIndex) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
                Logger.error(`BwUnitMap.setUnitOnMap() the unit is outside map! gridIndex: ${JSON.stringify(gridIndex)}`);
                return;
            }
            if (this.getUnitOnMap(gridIndex)) {
                Logger.error(`BwUnitMap.setUnitOnMap() another unit exists in the same grid! gridIndex: ${JSON.stringify(gridIndex)}`);
                return;
            }

            map[gridIndex.x][gridIndex.y] = unit;
            this.getView().addUnit(unit.getView(), true);
        }
        public removeUnitOnMap(gridIndex: Types.GridIndex, removeView: boolean): void {
            const unit = this.getUnitOnMap(gridIndex);
            this._map[gridIndex.x][gridIndex.y] = undefined;
            (removeView) && (this.getView().removeUnit(unit.getView()));
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

        public checkIsCoLoadedByAnyUnit(playerIndex: number): boolean | undefined {
            return (this.checkIsCoLoadedByAnyUnitOnMap(playerIndex))
                || (this.checkIsCoLoadedByAnyUnitLoaded(playerIndex))
        }
        public checkIsCoLoadedByAnyUnitLoaded(playerIndex: number): boolean | undefined {
            const units = this.getLoadedUnits();
            if (units == null) {
                Logger.error(`BwUnitMap.checkIsCoLoadedByAnyUnitLoaded() empty units.`);
                return undefined;
            }

            for (const [_, unit] of units) {
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getHasLoadedCo())) {
                    return true;
                }
            }
            return false;
        }
        public checkIsCoLoadedByAnyUnitOnMap(playerIndex: number): boolean | undefined {
            const map = this._getMap();
            if (map == null) {
                Logger.error(`BwUnitMap.checkIsCoLoadedByAnyUnitOnMap() empty map.`);
                return undefined;
            }

            return map.some(v => v.some(u => (u != null) && (u.getPlayerIndex() === playerIndex) && (u.getHasLoadedCo())));
        }

        public getCoGridIndexListOnMap(playerIndex: number): GridIndex[] | undefined {
            const map = this._getMap();
            if (map == null) {
                Logger.error(`BwUnitMap.getCoGridIndexListOnMap() empty map.`);
                return undefined;
            }

            const list: GridIndex[] = [];
            for (const column of map) {
                for (const unit of column) {
                    if ((unit) && (unit.getHasLoadedCo()) && (unit.getPlayerIndex() === playerIndex)) {
                        const gridIndex = unit.getGridIndex();
                        if (gridIndex == null) {
                            Logger.error(`BwUnitMap.getCoGridIndexListOnMap() empty gridIndex.`);
                            return undefined;
                        }
                        list.push(gridIndex);
                    }
                }
            }

            return list;
        }

        public getAllCoUnits(playerIndex: number): BwUnit[] | undefined {
            const loadedUnits = this.getLoadedUnits();
            if (loadedUnits == null) {
                Logger.error(`BwUnitMap.getCoUnitsCount() empty loadedUnits.`);
                return undefined;
            }

            const map = this._getMap();
            if (map == null) {
                Logger.error(`BwUnitMap.checkIsCoLoadedByAnyUnitOnMap() empty map.`);
                return undefined;
            }

            const coUnits: BwUnit[] = [];
            for (const [_, unit] of loadedUnits) {
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getHasLoadedCo())) {
                    coUnits.push(unit);
                }
            }
            for (const column of map) {
                for (const unit of column) {
                    if ((unit) && (unit.getPlayerIndex() == playerIndex) && (unit.getHasLoadedCo())) {
                        coUnits.push(unit);
                    }
                }
            }
            return coUnits;
        }
    }
}
