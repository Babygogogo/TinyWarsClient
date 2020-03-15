
namespace TinyWars.BaseWar {
    import Types                    = Utility.Types;
    import MapSizeAndMaxPlayerIndex = Types.MapSizeAndMaxPlayerIndex;

    export abstract class BwField {
        private _unitMap            : BwUnitMap;
        private _tileMap            : BwTileMap;
        private _fogMap             : BwFogMap;
        private _cursor             : BwCursor;
        private _actionPlanner      : BwActionPlanner;
        private _gridVisionEffect   : BwGridVisionEffect;
        private _view               : BwFieldView;

        public async init(
            data                    : Types.SerializedField,
            configVersion           : string,
            mapFileName             : string | null | undefined,
            mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex
        ): Promise<BwField> {
            await this._initFogMap(data.fogMap, mapSizeAndMaxPlayerIndex);
            await this._initTileMap(data.tileMap, configVersion, mapFileName, mapSizeAndMaxPlayerIndex);
            await this._initUnitMap(data.unitMap, configVersion, mapFileName, mapSizeAndMaxPlayerIndex);
            await this._initCursor(mapSizeAndMaxPlayerIndex);
            await this._initActionPlanner(mapSizeAndMaxPlayerIndex);
            await this._initGridVisionEffect();

            this._view = this._view || new (this._getViewClass())();
            this._view.init(this);

            return this;
        }
        protected abstract _getFogMapClass(): new () => BwFogMap;
        protected abstract _getTileMapClass(): new () => BwTileMap;
        protected abstract _getUnitMapClass(): new () => BwUnitMap;
        protected abstract _getCursorClass(): new () => BwCursor;
        protected abstract _getActionPlannerClass(): new () => BwActionPlanner;
        protected abstract _getGridVisionEffectClass(): new () => BwGridVisionEffect;
        protected abstract _getViewClass(): new () => BwFieldView;

        public startRunning(war: BwWar): void {
            this.getTileMap().startRunning(war);
            this.getUnitMap().startRunning(war);
            this.getFogMap().startRunning(war);
            this.getCursor().startRunning(war);
            this.getActionPlanner().startRunning(war);
            this.getGridVisionEffect().startRunning(war);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
            this.getTileMap().startRunningView();
            this.getUnitMap().startRunningView();
            this.getCursor().startRunningView();
            this.getActionPlanner().startRunningView();
            this.getGridVisionEffect().startRunningView();
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
            this.getTileMap().stopRunning();
            this.getUnitMap().stopRunning();
            this.getCursor().stopRunning();
            this.getActionPlanner().stopRunning();
            this.getGridVisionEffect().stopRunning();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): BwFieldView {
            return this._view;
        }

        private async _initFogMap(data: Types.SerializedFogMap, mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex): Promise<void> {
            const fogMap = this.getFogMap() || new (this._getFogMapClass())();
            await fogMap.init(data, mapSizeAndMaxPlayerIndex);
            this._setFogMap(fogMap);
        }
        private _setFogMap(map: BwFogMap): void {
            this._fogMap = map;
        }
        public getFogMap(): BwFogMap {
            return this._fogMap;
        }

        private async _initTileMap(
            data                    : Types.SerializedTileMap | null | undefined,
            configVersion           : string,
            mapFileName             : string | null | undefined,
            mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex
        ): Promise<void> {
            const tileMap = this.getTileMap() || new (this._getTileMapClass())();
            await tileMap.init(data, configVersion, mapFileName, mapSizeAndMaxPlayerIndex);
            this._setTileMap(tileMap);
        }
        private _setTileMap(map: BwTileMap): void {
            this._tileMap = map;
        }
        public getTileMap(): BwTileMap {
            return this._tileMap;
        }

        private async _initUnitMap(
            data                    : Types.SerializedUnitMap | null | undefined,
            configVersion           : string,
            mapFileName             : string | null | undefined,
            mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex
        ): Promise<void> {
            const unitMap = this.getUnitMap() || new (this._getUnitMapClass())();
            await unitMap.init(data, configVersion, mapFileName, mapSizeAndMaxPlayerIndex);
            this._setUnitMap(unitMap);
        }
        private _setUnitMap(map: BwUnitMap): void {
            this._unitMap = map;
        }
        public getUnitMap(): BwUnitMap {
            return this._unitMap;
        }

        private async _initCursor(mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex): Promise<void> {
            const cursor = this.getCursor() || new (this._getCursorClass())();
            await cursor.init(mapSizeAndMaxPlayerIndex);
            this._setCursor(cursor);
        }
        private _setCursor(cursor: BwCursor): void {
            this._cursor = cursor;
        }
        public getCursor(): BwCursor {
            return this._cursor;
        }

        private async _initActionPlanner(mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex): Promise<void> {
            const actionPlanner = this.getActionPlanner() || new (this._getActionPlannerClass())();
            await actionPlanner.init(mapSizeAndMaxPlayerIndex);
            this._setActionPlanner(actionPlanner);
        }
        private _setActionPlanner(actionPlanner: BwActionPlanner): void {
            this._actionPlanner = actionPlanner;
        }
        public getActionPlanner(): BwActionPlanner {
            return this._actionPlanner;
        }

        private async _initGridVisionEffect(): Promise<void> {
            const effect = this.getGridVisionEffect() || new (this._getGridVisionEffectClass())();
            await effect.init();
            this._setGridVisionEffect(effect);
        }
        private _setGridVisionEffect(gridVisionEffect: BwGridVisionEffect): void {
            this._gridVisionEffect = gridVisionEffect;
        }
        public getGridVisionEffect(): BwGridVisionEffect {
            return this._gridVisionEffect;
        }
    }
}
