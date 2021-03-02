
namespace TinyWars.BaseWar {
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import ClientErrorCode          = Utility.ClientErrorCode;
    import ProtoTypes               = Utility.ProtoTypes;
    import ISerialField             = ProtoTypes.WarSerialization.ISerialField;
    import MapSizeAndMaxPlayerIndex = Types.MapSizeAndMaxPlayerIndex;

    export abstract class BwField {
        private _unitMap                    : BwUnitMap;
        private _tileMap                    : BwTileMap;
        private _fogMap                     : BwFogMap;
        private readonly _cursor            = new BwCursor();
        private readonly _actionPlanner     = new (this._getActionPlannerClass())();
        private readonly _gridVisualEffect  = new BwGridVisualEffect();
        private readonly _view              = new BwFieldView();

        protected abstract _getFogMapClass(): new () => BwFogMap;
        protected abstract _getTileMapClass(): new () => BwTileMap;
        protected abstract _getUnitMapClass(): new () => BwUnitMap;
        protected abstract _getActionPlannerClass(): new () => BwActionPlanner;

        public async init(
            data                    : ISerialField,
            configVersion           : string,
            mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex
        ): Promise<ClientErrorCode> {
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

            const actionPlannerError = this.getActionPlanner().init(mapSizeAndMaxPlayerIndex);
            if (actionPlannerError) {
                return actionPlannerError;
            }

            this._setFogMap(fogMap);
            this._setTileMap(tileMap);
            this._setUnitMap(unitMap);

            await this._initCursor(mapSizeAndMaxPlayerIndex);
            this._initGridVisionEffect();

            this.getView().init(this);

            return ClientErrorCode.NoError;
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
            this.getGridVisualEffect().startRunning(war);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
            this.getTileMap().startRunningView();
            this.getUnitMap().startRunningView();
            this.getCursor().startRunningView();
            this.getActionPlanner().startRunningView();
            this.getGridVisualEffect().startRunningView();
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
            this.getTileMap().stopRunning();
            this.getUnitMap().stopRunning();
            this.getCursor().stopRunning();
            this.getActionPlanner().stopRunning();
            this.getGridVisualEffect().stopRunning();
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
            await this.getCursor().init(mapSizeAndMaxPlayerIndex);
        }
        private async _fastInitCursor(mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex): Promise<void> {
            await this.getCursor().fastInit(mapSizeAndMaxPlayerIndex);
        }
        public getCursor(): BwCursor {
            return this._cursor;
        }

        private async _fastInitActionPlanner(mapSizeAndMaxPlayerIndex: MapSizeAndMaxPlayerIndex): Promise<void> {
            await this.getActionPlanner().fastInit(mapSizeAndMaxPlayerIndex);
        }
        public getActionPlanner(): BwActionPlanner {
            return this._actionPlanner;
        }

        private _initGridVisionEffect(): void {
            this.getGridVisualEffect().init();
        }
        private _fastInitGridVisionEffect(): void {
            this.getGridVisualEffect().fastInit();
        }
        public getGridVisualEffect(): BwGridVisualEffect {
            return this._gridVisualEffect;
        }
    }
}
