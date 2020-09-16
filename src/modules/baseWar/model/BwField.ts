
namespace TinyWars.BaseWar {
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import ProtoTypes               = Utility.ProtoTypes;
    import ISerialField             = ProtoTypes.WarSerialization.ISerialField;
    import MapSizeAndMaxPlayerIndex = Types.MapSizeAndMaxPlayerIndex;

    export abstract class BwField {
        private _unitMap            : BwUnitMap;
        private _tileMap            : BwTileMap;
        private _fogMap             : BwFogMap;
        private _cursor             : BwCursor;
        private _actionPlanner      : BwActionPlanner;
        private _gridVisionEffect   : BwGridVisionEffect;
        private _view               : BwFieldView;

        protected abstract _getFogMapClass(): new () => BwFogMap;
        protected abstract _getTileMapClass(): new () => BwTileMap;
        protected abstract _getUnitMapClass(): new () => BwUnitMap;
        protected abstract _getCursorClass(): new () => BwCursor;
        protected abstract _getActionPlannerClass(): new () => BwActionPlanner;
        protected abstract _getGridVisionEffectClass(): new () => BwGridVisionEffect;
        protected abstract _getViewClass(): new () => BwFieldView;

        public async init(
            data                    : ISerialField,
            configVersion           : string,
            mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex
        ): Promise<BwField | undefined> {
            const fogMapData = data.fogMap;
            if (fogMapData == null) {
                Logger.error(`BwField.init() empty fogMapData.`);
                return undefined;
            }

            const tileMapData = data.tileMap;
            if (tileMapData == null) {
                Logger.error(`BwField.init() empty tileMapData.`);
                return undefined;
            }

            const unitMapData = data.unitMap;
            if (unitMapData == null) {
                Logger.error(`BwField.init() empty unitMapData.`);
                return undefined;
            }

            const fogMap = await (this.getFogMap() || new (this._getFogMapClass())()).init(fogMapData, mapSizeAndMaxPlayerIndex);
            if (fogMap == null) {
                Logger.error(`BwField.init() empty fogMap.`);
                return undefined;
            }

            const tileMap = await (this.getTileMap() || new (this._getTileMapClass())()).init(tileMapData, configVersion, mapSizeAndMaxPlayerIndex);
            if (tileMap == null) {
                Logger.error(`BwField.init() empty tileMap.`);
                return undefined;
            }

            const unitMap = await (this.getUnitMap() || new (this._getUnitMapClass())()).init(unitMapData, configVersion, mapSizeAndMaxPlayerIndex);
            if (unitMap == null) {
                Logger.error(`BwField.init() empty unitMap.`);
                return undefined;
            }

            this._setFogMap(fogMap);
            this._setTileMap(tileMap);
            this._setUnitMap(unitMap);

            await this._initCursor(mapSizeAndMaxPlayerIndex);
            await this._initActionPlanner(mapSizeAndMaxPlayerIndex);
            await this._initGridVisionEffect();

            const view = this.getView() || new (this._getViewClass())();
            view.init(this);
            this._setView(view);

            return this;
        }
        public async fastInit(
            data                    : ISerialField,
            configVersion           : string,
            mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex
        ): Promise<BwField> {
            await this.getFogMap().fastInit(data.fogMap, mapSizeAndMaxPlayerIndex);
            await this.getTileMap().fastInit(data.tileMap, configVersion, mapSizeAndMaxPlayerIndex);
            await this.getUnitMap().fastInit(data.unitMap, configVersion, mapSizeAndMaxPlayerIndex);
            await this._fastInitCursor(mapSizeAndMaxPlayerIndex);
            await this._fastInitActionPlanner(mapSizeAndMaxPlayerIndex);
            await this._fastInitGridVisionEffect();

            this.getView().fastInit(this);

            return this;
        }

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

        public serialize(): ISerialField {
            return {
                fogMap  : this.getFogMap().serialize(),
                unitMap : this.getUnitMap().serialize(),
                tileMap : this.getTileMap().serialize(),
            };
        }
        public serializeForSimulation(): ISerialField {
            return {
                fogMap  : this.getFogMap().serializeForSimulation(),
                unitMap : this.getUnitMap().serializeForSimulation(),
                tileMap : this.getTileMap().serializeForSimulation(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _setView(view: BwFieldView): void {
            this._view = view;
        }
        public getView(): BwFieldView {
            return this._view;
        }

        private _setFogMap(map: BwFogMap): void {
            this._fogMap = map;
        }
        public getFogMap(): BwFogMap {
            return this._fogMap;
        }

        private _setTileMap(map: BwTileMap): void {
            this._tileMap = map;
        }
        public getTileMap(): BwTileMap {
            return this._tileMap;
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
        private async _fastInitCursor(mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex): Promise<void> {
            await this.getCursor().fastInit(mapSizeAndMaxPlayerIndex);
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
        private async _fastInitActionPlanner(mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex): Promise<void> {
            await this.getActionPlanner().fastInit(mapSizeAndMaxPlayerIndex);
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
        private async _fastInitGridVisionEffect(): Promise<void> {
            await this.getGridVisionEffect().fastInit();
        }
        private _setGridVisionEffect(gridVisionEffect: BwGridVisionEffect): void {
            this._gridVisionEffect = gridVisionEffect;
        }
        public getGridVisionEffect(): BwGridVisionEffect {
            return this._gridVisionEffect;
        }
    }
}
