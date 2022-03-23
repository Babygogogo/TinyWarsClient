
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsBwUnitMapView    from "../view/BwUnitMapView";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
// import TwnsBwUnit           from "./BwUnit";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
// import TwnsBwWar            from "./BwWar";

namespace TwnsBwUnitMap {
    import GridIndex        = Types.GridIndex;
    import WarSerialization = ProtoTypes.WarSerialization;
    import ISerialUnitMap   = WarSerialization.ISerialUnitMap;
    import ISerialUnit      = WarSerialization.ISerialUnit;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    export class BwUnitMap {
        private _war?           : Twns.BaseWar.BwWar;
        private _nextUnitId?    : number;
        private _map?           : (TwnsBwUnit.BwUnit | null)[][];
        private _mapSize?       : Types.MapSize;
        private _loadedUnits?   : Map<number, TwnsBwUnit.BwUnit>;

        private readonly _view  = new TwnsBwUnitMapView.BwUnitMapView();

        public init({ data, configVersion, mapSize, playersCountUnneutral }: {
            data                    : Types.Undefinable<ISerialUnitMap>;
            configVersion           : string;
            mapSize                 : Types.MapSize;
            playersCountUnneutral   : number;
        }): void {
            if (data == null) {
                throw Helpers.newError(`Empty data.`, ClientErrorCode.BwUnitMap_Init_00);
            }

            const nextUnitId = Helpers.getExisted(data.nextUnitId, ClientErrorCode.BwUnitMap_Init_01);
            if (!WarCommonHelpers.checkIsValidMapSize(mapSize)) {
                throw Helpers.newError(`Invalid mapSize.`, ClientErrorCode.BwUnitMap_Init_02);
            }

            const mapWidth      = mapSize.width;
            const map           = Helpers.createEmptyMap<TwnsBwUnit.BwUnit>(mapWidth);
            const loadedUnits   = new Map<number, TwnsBwUnit.BwUnit>();
            const allUnits      = new Map<number, TwnsBwUnit.BwUnit>();
            for (const unitData of data.units || []) {
                const unit = new TwnsBwUnit.BwUnit();
                unit.init(unitData, configVersion);

                const gridIndex = unit.getGridIndex();
                if ((!gridIndex) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
                    throw Helpers.newError(`Invalid gridIndex: ${gridIndex.x}, ${gridIndex.y}`, ClientErrorCode.BwUnitMap_Init_03);
                }

                const unitId = unit.getUnitId();
                if (allUnits.has(unitId)) {
                    throw Helpers.newError(`Duplicated unitId: ${unitId}`, ClientErrorCode.BwUnitMap_Init_04);
                }
                if (unitId >= nextUnitId) {
                    throw Helpers.newError(`Invalid unitId: ${unitId}`, ClientErrorCode.BwUnitMap_Init_05);
                }
                allUnits.set(unitId, unit);

                const playerIndex = unit.getPlayerIndex();
                if ((playerIndex == null) || (playerIndex > playersCountUnneutral)) {
                    throw Helpers.newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwUnitMap_Init_06);
                }

                if (unit.getLoaderUnitId() != null) {
                    loadedUnits.set(unitId, unit);
                } else {
                    const { x, y } = gridIndex;
                    if (map[x][y]) {
                        throw Helpers.newError(`The grid is occupied: ${x}, ${y}`, ClientErrorCode.BwUnitMap_Init_07);
                    }

                    map[x][y] = unit;
                }
            }

            const loadUnitCounts = new Map<number, number>();
            for (const [, loadedUnit] of loadedUnits) {
                const loaderId  = Helpers.getExisted(loadedUnit.getLoaderUnitId(), ClientErrorCode.BwUnitMap_Init_08);
                const loader    = Helpers.getExisted(allUnits.get(loaderId), ClientErrorCode.BwUnitMap_Init_09);
                if (loader.getPlayerIndex() !== loadedUnit.getPlayerIndex()) {
                    throw Helpers.newError(`Invalid playerIndex.`, ClientErrorCode.BwUnitMap_Init_10);
                }

                const gridIndex1 = loader.getGridIndex();
                const gridIndex2 = loadedUnit.getGridIndex();
                if ((!gridIndex1) || (!gridIndex2) || (!GridIndexHelpers.checkIsEqual(gridIndex1, gridIndex2))) {
                    throw Helpers.newError(`Invalid gridIndex.`, ClientErrorCode.BwUnitMap_Init_11);
                }

                const maxLoadCount  = loader.getMaxLoadUnitsCount();
                const loadCount     = (loadUnitCounts.get(loaderId) || 0) + 1;
                if ((maxLoadCount == null) || (loadCount > maxLoadCount)) {
                    throw Helpers.newError(`Over load.`, ClientErrorCode.BwUnitMap_Init_12);
                }
                loadUnitCounts.set(loaderId, loadCount);

                const unitType          = loadedUnit.getUnitType();
                const loadUnitCategory  = loader.getLoadUnitCategory();
                if ((loadUnitCategory == null)                                                          ||
                    (!ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, loadUnitCategory))
                ) {
                    throw Helpers.newError(`Invalid unitType: ${unitType}`, ClientErrorCode.BwUnitMap_Init_13);
                }
            }

            this._setMap(map);
            this._setLoadedUnits(loadedUnits);
            this._setMapSize(mapWidth, mapSize.height);
            this.setNextUnitId(nextUnitId);

            this.getView().init(this);
        }
        public fastInit({ data, configVersion, mapSize, playersCountUnneutral }: {
            data                    : Types.Undefinable<ISerialUnitMap>;
            configVersion           : string;
            mapSize                 : Types.MapSize;
            playersCountUnneutral   : number;
        }): void {
            this.init({ data, configVersion, mapSize, playersCountUnneutral });
        }

        public startRunning(war: Twns.BaseWar.BwWar): void {
            this._setWar(war);
            this._forEachUnitOnMap(unit => unit.startRunning(war));
            this._forEachUnitLoaded(unit => unit.startRunning(war));
        }
        public startRunningView(): void {
            this.getView().startRunningView();
            this._forEachUnitOnMap(unit => unit.startRunningView());
            this._forEachUnitLoaded(unit => unit.startRunningView());
        }
        public stopRunning(): void {
            this._forEachUnit(unit => unit.stopRunning());
            this.getView().stopRunningView();
        }

        public serialize(): ISerialUnitMap {
            const units: ISerialUnit[] = [];
            for (const unit of this.getAllUnits()) {
                units.push(unit.serialize());
            }

            return {
                units,
                nextUnitId  : this.getNextUnitId(),
            };
        }
        public serializeForCreateSfw(): ISerialUnitMap {
            const nextUnitId    = this.getNextUnitId();
            const war           = this.getWar();
            const units         : ISerialUnit[] = [];
            const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            for (const unit of WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
                units.push(unit.serializeForCreateSfw());

                if (teamIndexes.has(unit.getTeamIndex())) {
                    for (const loadedUnit of this.getUnitsLoadedByLoader(unit, true)) {
                        units.push(loadedUnit.serializeForCreateSfw());
                    }
                }
            }

            return {
                units,
                nextUnitId,
            };
        }
        public serializeForCreateMfr(): ISerialUnitMap {
            const nextUnitId    = this.getNextUnitId();
            const war           = this.getWar();
            const units         : ISerialUnit[] = [];
            const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
            for (const unit of WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
                units.push(unit.serializeForCreateMfr());

                if (teamIndexes.has(unit.getTeamIndex())) {
                    for (const loadedUnit of this.getUnitsLoadedByLoader(unit, true)) {
                        units.push(loadedUnit.serializeForCreateMfr());
                    }
                }
            }

            return {
                units,
                nextUnitId,
            };
        }

        private _setMap(map: (TwnsBwUnit.BwUnit | null)[][]): void {
            this._map = map;
        }
        private _getMap(): (TwnsBwUnit.BwUnit | null)[][] {
            return Helpers.getExisted(this._map);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): TwnsBwUnitMapView.BwUnitMapView {
            return this._view;
        }

        private _setWar(war: Twns.BaseWar.BwWar): void {
            this._war = war;
        }
        public getWar(): Twns.BaseWar.BwWar {
            return Helpers.getExisted(this._war);
        }

        private _setMapSize(width: number, height: number): void {
            this._mapSize = { width: width, height: height };
        }
        public getMapSize(): Types.MapSize {
            return Helpers.getExisted(this._mapSize);
        }

        public getNextUnitId(): number {
            return Helpers.getExisted(this._nextUnitId);
        }
        public setNextUnitId(id: number): void {
            this._nextUnitId = id;
        }

        public getUnit(gridIndex: GridIndex, unitId: Types.Undefinable<number>): TwnsBwUnit.BwUnit | null {
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
        public getUnitById(unitId: number): TwnsBwUnit.BwUnit | null {
            const unitLoaded = this.getUnitLoadedById(unitId);
            if (unitLoaded) {
                return unitLoaded;
            } else {
                for (const column of this._getMap()) {
                    for (const unit of column) {
                        if ((unit) && (unit.getUnitId() === unitId)) {
                            return unit;
                        }
                    }
                }
                return null;
            }
        }

        public getUnitOnMap(gridIndex: GridIndex): TwnsBwUnit.BwUnit | null {
            return this._getMap()[gridIndex.x][gridIndex.y] ?? null;
        }
        public getVisibleUnitOnMap(gridIndex: GridIndex): TwnsBwUnit.BwUnit | null {
            const unit = this.getUnitOnMap(gridIndex);
            if (unit == null) {
                return null;
            }

            const war = this.getWar();
            return (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                war,
                unitType            : unit.getUnitType(),
                isDiving            : unit.getIsDiving(),
                observerTeamIndex   : war.getPlayerInTurn().getTeamIndex(),
                gridIndex,
                unitPlayerIndex     : unit.getPlayerIndex(),
            }))
                ? unit
                : null;
        }

        public getUnitLoadedById(unitId: number): TwnsBwUnit.BwUnit | null {
            return this.getLoadedUnits().get(unitId) ?? null;
        }
        private _setLoadedUnits(units: Map<number, TwnsBwUnit.BwUnit>): void {
            this._loadedUnits = units;
        }
        public getLoadedUnits(): Map<number, TwnsBwUnit.BwUnit> {
            return Helpers.getExisted(this._loadedUnits);
        }
        public getUnitsLoadedByLoader(loader: TwnsBwUnit.BwUnit, isRecursive: boolean): TwnsBwUnit.BwUnit[] {
            const units: TwnsBwUnit.BwUnit[] = [];
            this._forEachUnitLoaded((unit: TwnsBwUnit.BwUnit) => {
                if (unit.getLoaderUnitId() === loader.getUnitId()) {
                    units.push(unit);
                    (isRecursive) && (units.push(...this.getUnitsLoadedByLoader(unit, isRecursive)));
                }
            });
            return units;
        }

        public getAllUnitsOnMap(): TwnsBwUnit.BwUnit[] {
            const units: TwnsBwUnit.BwUnit[] = [];
            this._forEachUnitOnMap(unit => units.push(unit));
            return units;
        }
        public getAllUnitsLoaded(): TwnsBwUnit.BwUnit[] {
            const units: TwnsBwUnit.BwUnit[] = [];
            this._forEachUnitLoaded(unit => units.push(unit));
            return units;
        }
        public getAllUnits(): TwnsBwUnit.BwUnit[] {
            const units = this.getAllUnitsOnMap();
            this._forEachUnitLoaded(unit => units.push(unit));
            return units;
        }

        public setUnitLoaded(unit: TwnsBwUnit.BwUnit): void {
            const loadedUnits = this.getLoadedUnits();
            if (loadedUnits == null) {
                throw Helpers.newError(`BwUnitMap.setUnitLoaded() the map is not initialized.`);
            }

            const unitId = unit.getUnitId();
            if (unitId == null) {
                throw Helpers.newError(`BwUnitMap.setUnitLoaded() the unit has no unitId.`);
            }

            if (loadedUnits.has(unitId)) {
                throw Helpers.newError(`BwUnitMap.setUnitLoaded() the unit is already loaded?!?.`);
            }

            loadedUnits.set(unitId, unit);
            this.getView().addUnit(unit.getView(), true);
        }
        public setUnitUnloaded(unitId: number, gridIndex: Types.GridIndex): void {
            const loadedUnits = this.getLoadedUnits();
            this._getMap()[gridIndex.x][gridIndex.y] = Helpers.getExisted(loadedUnits.get(unitId));
            loadedUnits.delete(unitId);
        }

        public setUnitOnMap(unit: TwnsBwUnit.BwUnit): void {
            const mapSize   = this.getMapSize();
            const map       = this._getMap();
            if ((!mapSize) || (!map)) {
                throw Helpers.newError(`BwUnitMap.setUnitOnMap() the map is not initialized.`);
            }

            const gridIndex = unit.getGridIndex();
            if ((!gridIndex) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
                throw Helpers.newError(`BwUnitMap.setUnitOnMap() the unit is outside map! gridIndex: ${JSON.stringify(gridIndex)}`);
            }
            if (this.getUnitOnMap(gridIndex)) {
                throw Helpers.newError(`BwUnitMap.setUnitOnMap() another unit exists in the same grid! gridIndex: ${JSON.stringify(gridIndex)}`);
            }

            map[gridIndex.x][gridIndex.y] = unit;
            this.getView().addUnit(unit.getView(), true);
        }
        public removeUnitOnMap(gridIndex: Types.GridIndex, removeView: boolean): void {
            const unit = this.getUnitOnMap(gridIndex);
            this._getMap()[gridIndex.x][gridIndex.y] = null;
            (removeView) && (this.getView().removeUnit(Helpers.getExisted(unit).getView()));
        }

        public removeUnitLoaded(unitId: number): void {
            const loadedUnits   = this.getLoadedUnits();
            const unit          = Helpers.getExisted(loadedUnits.get(unitId));
            loadedUnits.delete(unitId);
            this.getView().removeUnit(unit.getView());
        }
        public removeUnitsLoadedForPlayer(playerIndex: number): void {
            const units = this.getLoadedUnits();
            for (const [unitId, unit] of units) {
                if (unit.getPlayerIndex() === playerIndex) {
                    units.delete(unitId);
                    this.getView().removeUnit(unit.getView());
                }
            }
        }

        public removeUnitById(unitId: number, removeView: boolean): void {
            const unit = this.getUnitById(unitId);
            if (unit) {
                if (unit.getLoaderUnitId() == null) {
                    this.removeUnitOnMap(unit.getGridIndex(), removeView);
                } else {
                    this.removeUnitLoaded(unitId);
                }
            }
        }

        private _forEachUnit(func: (unit: TwnsBwUnit.BwUnit) => any): void {
            this._forEachUnitOnMap(func);
            this._forEachUnitLoaded(func);
        }
        private _forEachUnitOnMap(func: (unit: TwnsBwUnit.BwUnit) => any): void {
            for (const column of this._getMap()) {
                for (const unit of column) {
                    (unit) && (func(unit));
                }
            }
        }
        private _forEachUnitLoaded(func: (unit: TwnsBwUnit.BwUnit) => any): void {
            for (const [, unit] of this.getLoadedUnits()) {
                func(unit);
            }
        }

        public countUnitsOnMapForPlayer(playerIndex: number): number {
            let count = 0;
            this._forEachUnitOnMap(unit => {
                (unit.getPlayerIndex() === playerIndex) && (++count);
            });
            return count;
        }
        public countUnitsLoadedForPlayer(playerIndex: number): number {
            let count = 0;
            this._forEachUnitLoaded(unit => {
                (unit.getPlayerIndex() === playerIndex) && (++count);
            });
            return count;
        }
        public countAllUnitsForPlayer(playerIndex: number): number {
            return this.countUnitsLoadedForPlayer(playerIndex) + this.countUnitsOnMapForPlayer(playerIndex);
        }

        public checkHasUnit(playerIndex: number): boolean {
            for (const column of this._getMap()) {
                for (const unit of column) {
                    if ((unit) && (unit.getPlayerIndex() === playerIndex)) {
                        return true;
                    }
                }
            }
            return false;
        }

        public checkIsCoLoadedByAnyUnit(playerIndex: number): boolean {
            return (this.checkIsCoLoadedByAnyUnitOnMap(playerIndex))
                || (this.checkIsCoLoadedByAnyUnitLoaded(playerIndex));
        }
        public checkIsCoLoadedByAnyUnitLoaded(playerIndex: number): boolean {
            for (const [, unit] of this.getLoadedUnits()) {
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getHasLoadedCo())) {
                    return true;
                }
            }
            return false;
        }
        public checkIsCoLoadedByAnyUnitOnMap(playerIndex: number): boolean {
            return this._getMap().some(v => v.some(u => (u?.getPlayerIndex() === playerIndex) && (u.getHasLoadedCo())));
        }

        public getCoGridIndexListOnMap(playerIndex: number): GridIndex[] {
            const list: GridIndex[] = [];
            for (const column of this._getMap()) {
                for (const unit of column) {
                    if ((unit) && (unit.getHasLoadedCo()) && (unit.getPlayerIndex() === playerIndex)) {
                        list.push(unit.getGridIndex());
                    }
                }
            }

            return list;
        }

        public getAllCoUnits(playerIndex: number): TwnsBwUnit.BwUnit[] {
            const coUnits: TwnsBwUnit.BwUnit[] = [];
            for (const [, unit] of this.getLoadedUnits()) {
                if ((unit.getPlayerIndex() === playerIndex) && (unit.getHasLoadedCo())) {
                    coUnits.push(unit);
                }
            }
            for (const column of this._getMap()) {
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

// export default TwnsBwUnitMap;
