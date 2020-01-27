
namespace TinyWars.MapEditor {
    export class MeFieldView extends egret.DisplayObjectContainer {
        private _field                  : MeField;
        private _tileMapView            : MeTileMapView;
        private _unitMapView            : MeUnitMapView;
        private _cursorView             : MeCursorView;
        private _gridVisionEffectView   : MeGridVisionEffectView;

        public init(field: MeField): void {
            if (!this._field) {
                this._field = field;

                this._tileMapView           = field.getTileMap().getView();
                this._unitMapView           = field.getUnitMap().getView();
                this._cursorView            = field.getCursor().getView();
                this._gridVisionEffectView  = field.getGridVisionEffect().getView();
                this.addChild(this._tileMapView);
                this.addChild(this._unitMapView);
                this.addChild(this._cursorView);
                this.addChild(this._gridVisionEffectView);
            }
        }

        public startRunningView(): void {
        }
        public stopRunningView(): void {
        }
    }
}
