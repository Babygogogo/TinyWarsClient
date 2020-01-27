
namespace TinyWars.MapEditor {
    import Types = Utility.Types;

    export class MeField {
        private _unitMap            : MeUnitMap;
        private _tileMap            : MeTileMap;
        private _cursor             : MeCursor;
        private _gridVisionEffect   : MeGridVisionEffect;
        private _view               : MeFieldView;

        public init(data: Types.MapRawData, configVersion: string): MeField {
            this._setTileMap((this.getTileMap() || new MeTileMap()).init(configVersion, data));
            this._setUnitMap((this.getUnitMap() || new MeUnitMap()).init(configVersion, data));
            this._setCursor((this.getCursor() || new MeCursor()).init(data));
            this._setGridVisionEffect((this.getGridVisionEffect() || new MeGridVisionEffect()).init());

            this._view = this._view || new MeFieldView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: MeWar): void {
            this.getTileMap().startRunning(war);
            this.getUnitMap().startRunning(war);
            this.getCursor().startRunning(war);
            this.getGridVisionEffect().startRunning(war);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
            this.getTileMap().startRunningView();
            this.getUnitMap().startRunningView();
            this.getCursor().startRunningView();
            this.getGridVisionEffect().startRunningView();
        }
        public stopRunning(): void {
            this.getView().stopRunningView();
            this.getTileMap().stopRunning();
            this.getUnitMap().stopRunning();
            this.getCursor().stopRunning();
            this.getGridVisionEffect().stopRunning();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): MeFieldView {
            return this._view;
        }

        private _setTileMap(map: MeTileMap): void {
            this._tileMap = map;
        }
        public getTileMap(): MeTileMap {
            return this._tileMap;
        }

        private _setUnitMap(map: MeUnitMap): void {
            this._unitMap = map;
        }
        public getUnitMap(): MeUnitMap {
            return this._unitMap;
        }

        private _setCursor(cursor: MeCursor): void {
            this._cursor = cursor;
        }
        public getCursor(): MeCursor {
            return this._cursor;
        }

        private _setGridVisionEffect(gridVisionEffect: MeGridVisionEffect): void {
            this._gridVisionEffect = gridVisionEffect;
        }
        public getGridVisionEffect(): MeGridVisionEffect {
            return this._gridVisionEffect;
        }
    }
}
