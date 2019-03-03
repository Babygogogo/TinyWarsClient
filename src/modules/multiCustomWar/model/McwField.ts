
namespace TinyWars.MultiCustomWar {
    import Types                = Utility.Types;
    import SerializedMcField    = Types.SerializedMcwField;

    export class McwField {
        private _unitMap: McwUnitMap;
        private _tileMap: McwTileMap;
        private _fogMap : McwFogMap;
        private _cursor : McwCursor;
        private _view   : McwFieldView;

        public constructor() {
        }

        public async init(data: SerializedMcField, configVersion: number, mapIndexKey: Types.MapIndexKey): Promise<McwField> {
            this._setFogMap(await new McwFogMap().init(data.fogMap, mapIndexKey));
            this._setTileMap(await new McwTileMap().init(configVersion, mapIndexKey, data.tileMap));
            this._setUnitMap(await new McwUnitMap().init(configVersion, mapIndexKey, data.unitMap));
            this._setCursor(await new McwCursor().init(mapIndexKey));

            this._view = this._view || new McwFieldView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: McwWar): void {
            this.getTileMap().startRunning(war);
            this.getUnitMap().startRunning(war);
            this.getFogMap().startRunning(war);
            this.getCursor().startRunning(war);
        }
        public startRunningView(): void {
            this.getView().startRunning();
            this.getTileMap().startRunningView();
            this.getUnitMap().startRunningView();
            this.getCursor().startRunningView();
        }
        public stopRunning(): void {
            this.getTileMap().stopRunning();
            this.getUnitMap().stopRunning();
            this.getCursor().stopRunning();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): McwFieldView {
            return this._view;
        }

        private _setFogMap(map: McwFogMap): void {
            this._fogMap = map;
        }
        public getFogMap(): McwFogMap {
            return this._fogMap;
        }

        private _setTileMap(map: McwTileMap): void {
            this._tileMap = map;
        }
        public getTileMap(): McwTileMap {
            return this._tileMap;
        }

        private _setUnitMap(map: McwUnitMap): void {
            this._unitMap = map;
        }
        public getUnitMap(): McwUnitMap {
            return this._unitMap;
        }

        private _setCursor(cursor: McwCursor): void {
            this._cursor = cursor;
        }
        public getCursor(): McwCursor {
            return this._cursor;
        }
    }
}

