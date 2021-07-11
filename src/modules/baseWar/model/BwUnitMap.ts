
import { BwWar }                from "./BwWar";
import { BwUnit }               from "./BwUnit";
import { BwUnitMapView }        from "../view/BwUnitMapView";
import { ClientErrorCode }      from "../../../utility/ClientErrorCode";
import * as BwHelpers           from "./BwHelpers";
import { Types }                from "../../../utility/Types";
import * as Helpers             from "../../../utility/Helpers";
import * as GridIndexHelpers    from "../../../utility/GridIndexHelpers";
import { Logger }               from "../../../utility/Logger";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import * as VisibilityHelpers   from "../../../utility/VisibilityHelpers";
import * as ConfigManager       from "../../../utility/ConfigManager";
import GridIndex                = Types.GridIndex;
import WarSerialization         = ProtoTypes.WarSerialization;
import ISerialUnitMap           = WarSerialization.ISerialUnitMap;
import ISerialUnit              = WarSerialization.ISerialUnit;

export class BwUnitMap {
    private _war            : BwWar | undefined;
    private _nextUnitId     : number | undefined;
    private _map            : (BwUnit | undefined)[][] | undefined;
    private _mapSize        : Types.MapSize | undefined;
    private _loadedUnits    : Map<number, BwUnit> | undefined;

    private readonly _view  = new BwUnitMapView();

    public init({ data, configVersion, mapSize, playersCountUnneutral }: {
        data                    : ISerialUnitMap | null | undefined;
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

        if (!BwHelpers.checkIsValidMapSize(mapSize)) {
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
        data                    : ISerialUnitMap | null | undefined;
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

    public serialize(): ISerialUnitMap | undefined {
        const nextUnitId = this.getNextUnitId();
        if (nextUnitId == null) {
            Logger.error(`BwUnitMap.serialize() empty nextUnitId.`);
            return undefined;
        }

        const units: ISerialUnit[] = [];
        for (const unit of this.getAllUnits()) {
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
    public serializeForCreateSfw(): ISerialUnitMap | undefined {
        const nextUnitId = this.getNextUnitId();
        if (nextUnitId == null) {
            Logger.error(`BwUnitMap.serializeForCreateSfw() empty nextUnitId.`);
            return undefined;
        }

        const war           = this.getWar();
        const units         : ISerialUnit[] = [];
        const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
        for (const unit of VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
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
    public serializeForCreateMfr(): ISerialUnitMap | undefined {
        const nextUnitId = this.getNextUnitId();
        if (nextUnitId == null) {
            Logger.error(`BwUnitMap.serializeForCreateMfr() empty nextUnitId.`);
            return undefined;
        }

        const war           = this.getWar();
        const units         : ISerialUnit[] = [];
        const teamIndexes   = war.getPlayerManager().getAliveWatcherTeamIndexesForSelf();
        for (const unit of VisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, teamIndexes)) {
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

    private _setMap(map: (BwUnit | undefined)[][]): void {
        this._map = map;
    }
    private _getMap(): (BwUnit | undefined)[][] | undefined {
        return this._map;
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

        const unitType = unit.getUnitType();
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

    private _forEachUnit(func: (unit: BwUnit) => any): void {
        this._forEachUnitOnMap(func);
        this._forEachUnitLoaded(func);
    }
    private _forEachUnitOnMap(func: (unit: BwUnit) => any): void {
        for (const column of this._map) {
            for (const unit of column) {
                (unit) && (func(unit));
            }
        }
    }
    private _forEachUnitLoaded(func: (unit: BwUnit) => any): void {
        for (const [, unit] of this._loadedUnits) {
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
            || (this.checkIsCoLoadedByAnyUnitLoaded(playerIndex));
    }
    public checkIsCoLoadedByAnyUnitLoaded(playerIndex: number): boolean | undefined {
        const units = this.getLoadedUnits();
        if (units == null) {
            Logger.error(`BwUnitMap.checkIsCoLoadedByAnyUnitLoaded() empty units.`);
            return undefined;
        }

        for (const [, unit] of units) {
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
        for (const [, unit] of loadedUnits) {
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
