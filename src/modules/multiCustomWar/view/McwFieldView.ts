
namespace TinyWars.MultiCustomWar {
    import Types = Utility.Types;

    export class McwFieldView extends egret.DisplayObjectContainer {
        private _field          : McwField;
        private _tileMapView    : McwTileMapView;
        private _unitMapView    : McwUnitMapView;

        public init(field: McwField): void {
            egret.assert(!this._field, "McwFieldView.init() already initialied!");
            this._field = field;

            this._tileMapView   = field.getTileMap().getView();
            this._unitMapView   = field.getUnitMap().getView();
            this.addChild(this._tileMapView);
            this.addChild(this._unitMapView);
        }

        public startRunning(): void {
        }
    }
}
