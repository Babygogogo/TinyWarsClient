
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsBwUnitMapView    from "../view/BwUnitMapView";
import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
import TwnsBwUnit           from "./BwUnit";
import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
import TwnsBwWar            from "./BwWar";

namespace TwnsBwUnitMap {
    import GridIndex        = Types.GridIndex;
    import WarSerialization = ProtoTypes.WarSerialization;
    import ISerialUnitMap   = WarSerialization.ISerialUnitMap;
    import ISerialUnit      = WarSerialization.ISerialUnit;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import BwUnit           = TwnsBwUnit.BwUnit;
    import BwUnitMapView    = TwnsBwUnitMapView.BwUnitMapView;
    import BwWar            = TwnsBwWar.BwWar;

    export class BwUnitMap {
        private _war?           : BwWar;
        private _nextUnitId?    : number;
        private _map?           : (BwUnit | null)[][];
        private _mapSize?       : Types.MapSize;
        private _loadedUnits?   : Map<number, BwUnit>;

        private readonly _view  = new BwUnitMapView();

        public init({ data, configVersion, mapSize, playersCountUnneutral }: {
            data                    : Types.Undefinable<ISerialUnitMap>;
            configVersion           : string;
            mapSize                 : Types.MapSize;
            playersCountUnneutral   : number;
        }): ClientErrorCode {
            if (data == null) {
                return ClientErrorCode.BwUnitMapInit00;
            }

            const nextUnitId = data.nextUnitId;
            if (nextUnitId == null) {
                return ClientErrorCode.BwUnitMapInit01;
            }

            if (!WarCommonHelpers.checkIsValidMapSize(mapSize)) {
                return ClientErrorCode.BwUnitMapInit02;
            }

            const mapWidth      = mapSize.width;
            const map           = Helpers.createEmptyMap<BwUnit>(mapWidth);
            const loadedUnits   = new Map<number, BwUnit>();
            const allUnits      = new Map<number, BwUnit>();

            for (const unitData of data.units || []) {
                const unit      = new BwUnit();
                const unitError = unit.init(unitData, configVersion);
                if (unitError) {
                    return unitError;
                }

                const gridIndex = unit.getGridIndex();
                if ((!gridIndex) || (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))) {
                    return ClientErrorCode.BwUnitMapInit03;
                }

                const unitId = unit.getUnitId();
                if (unitId == null) {
                    return ClientErrorCode.BwUnitMapInit04;
                }
                if (allUnits.has(unitId)) {
                    return ClientErrorCode.BwUnitMapInit05;
                }
                if (unitId >= nextUnitId) {
                    return ClientErrorCode.BwUnitMapInit06;
                }
                allUnits.set(unitId, unit);

                const playerIndex = unit.getPlayerIndex();
                if ((playerIndex == null) || (playerIndex > playersCountUnneutral)) {
                    return ClientErrorCode.BwUnitMapInit07;
                }

                if (unit.getLoaderUnitId() != null) {
                    loadedUnits.set(unitId, unit);
                } else {
                    const { x, y } = gridIndex;
                    if (map[x][y]) {
                        return ClientErrorCode.BwUnitMapInit08;
                    }

                    map[x][y] = unit;
                }
            }

            const loadUnitCounts = new Map<number, number>();
            for (const [, loadedUnit] of loadedUnits) {
                const loaderId = loadedUnit.getLoaderUnitId();
                if (loaderId == null) {
                    return ClientErrorCode.BwUnitMapInit09;
                }

                const loader = allUnits.get(loaderId);
                if (loader == null) {
                    return ClientErrorCode.BwUnitMapInit10;
                }
                if (loader.getPlayerIndex() !== loadedUnit.getPlayerIndex()) {
                    return ClientErrorCode.BwUnitMapInit11;
                }

                const gridIndex1 = loader.getGridIndex();
                const gridIndex2 = loadedUnit.getGridIndex();
                if ((!gridIndex1) || (!gridIndex2) || (!GridIndexHelpers.checkIsEqual(gridIndex1, gridIndex2))) {
                    return ClientErrorCode.BwUnitMapInit12;
                }

                const maxLoadCount  = loader.getMaxLoadUnitsCount();
                const loadCount     = (loadUnitCounts.get(loaderId) || 0) + 1;
                if ((maxLoadCount == null) || (loadCount > maxLoadCount)) {
                    return ClientErrorCode.BwUnitMapInit13;
                }
                loadUnitCounts.set(loaderId, loadCount);

                const unitType = loadedUnit.getUnitType();
                if (unitType == null) {
                    return ClientErrorCode.BwUnitMapInit14;
                }

                const loadUnitCategory = loader.getLoadUnitCategory();
                if ((loadUnitCategory == null)                                                          ||
                    (!ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, loadUnitCategory))
                ) {
                    return ClientErrorCode.BwUnitMapInit15;
                }
            }

            this._setMap(map);
            this._setLoadedUnits(loadedUnits);
            this._setMapSize(mapWidth, mapSize.height);
            this.setNextUnitId(nextUnitId);

            this.getView().init(this);

            return ClientErrorCode.NoError;
        }
        public fastInit({ data, configVersion, mapSize, playersCountUnneutral }: {
            data                    : Types.Undefinable<ISerialUnitMap>;
            configVersion           : string;
            mapSize                 : Types.MapSize;
            playersCountUnneutral   : number;
        }): ClientErrorCode {
            return this.init({ data, configVersion, mapSize, playersCountUnneutral });
        }

        public startRunning(war: BwWar): void {
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

        private _setMap(map: (BwUnit | null)[][]): void {
            this._map = map;
        }
        private _getMap(): (BwUnit | null)[][] {
            return Helpers.getDefined(this._map);
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

        public getUnit(gridIndex: GridIndex, unitId: Types.Undefinable<number>): BwUnit | null {
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

        public getUnitOnMap(gridIndex: GridIndex): BwUnit | null {
            return this._getMap()[gridIndex.x][gridIndex.y] ?? null;
        }
        public getVisibleUnitOnMap(gridIndex: GridIndex): BwUnit | null {
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

        public getUnitLoadedById(unitId: number): BwUnit | null {
            return this.getLoadedUnits().get(unitId) ?? null;
        }
        private _setLoadedUnits(units: Map<number, BwUnit>): void {
            this._loadedUnits = units;
        }
        public getLoadedUnits(): Map<number, BwUnit> {
            return Helpers.getDefined(this._loadedUnits);
        }
        public getUnitsLoadedByLoader(loader: BwUnit, isRecursive: boolean): BwUnit[] {
            const units: BwUnit[] = [];
            this._forEachUnitLoaded((unit: BwUnit) => {
                if (unit.getLoaderUnitId() === loader.getUnitId()) {
                    units.push(unit);
                    (isRecursive) && (units.push(...this.getUnitsLoadedByLoader(unit, isRecursive)));
                }
            });
            return units;
        }

        public getAllUnitsOnMap(): BwUnit[] {
            const units: BwUnit[] = [];
            this._forEachUnitOnMap(unit => units.push(unit));
            return units;
        }
        public getAllUnitsLoaded(): BwUnit[] {
            const units: BwUnit[] = [];
            this._forEachUnitLoaded(unit => units.push(unit));
            return units;
        }
        public getAllUnits(): BwUnit[] {
            const units = this.getAllUnitsOnMap();
            this._forEachUnitLoaded(unit => units.push(unit));
            return units;
        }

        public setUnitLoaded(unit: BwUnit): void {
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

        public setUnitOnMap(unit: BwUnit): void {
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

        private _forEachUnit(func: (unit: BwUnit) => any): void {
            this._forEachUnitOnMap(func);
            this._forEachUnitLoaded(func);
        }
        private _forEachUnitOnMap(func: (unit: BwUnit) => any): void {
            for (const column of this._getMap()) {
                for (const unit of column) {
                    (unit) && (func(unit));
                }
            }
        }
        private _forEachUnitLoaded(func: (unit: BwUnit) => any): void {
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

        public getAllCoUnits(playerIndex: number): BwUnit[] {
            const coUnits: BwUnit[] = [];
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

export default TwnsBwUnitMap;
