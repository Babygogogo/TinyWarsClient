
namespace TinyWars.MultiCustomWar {
    import Types = Utility.Types;

    export class McwFieldView extends egret.DisplayObjectContainer {
        private _field          : McwField;
        private _tileMapView    : McwTileMapView;
        private _unitMapView    : McwUnitMapView;
        private _cursorView     : McwCursorView;

        public init(field: McwField): void {
            egret.assert(!this._field, "McwFieldView.init() already initialied!");
            this._field = field;

            this._tileMapView   = field.getTileMap().getView();
            this._unitMapView   = field.getUnitMap().getView();
            this._cursorView    = field.getCursor().getView();
            this.addChild(this._tileMapView);
            this.addChild(this._unitMapView);
            this.addChild(this._cursorView);
        }

        public startRunning(): void {
        }
    }
}
