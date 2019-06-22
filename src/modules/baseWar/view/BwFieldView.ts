
namespace TinyWars.BaseWar {
    export class BwFieldView extends egret.DisplayObjectContainer {
        private _field                  : BwField;
        private _tileMapView            : BwTileMapView;
        private _actionPlannerView      : BwActionPlannerView;
        private _unitMapView            : BwUnitMapView;
        private _cursorView             : BwCursorView;
        private _gridVisionEffectView   : BwGridVisionEffectView;

        public init(field: BwField): void {
            if (!this._field) {
                this._field = field;

                this._tileMapView           = field.getTileMap().getView();
                this._actionPlannerView     = field.getActionPlanner().getView();
                this._unitMapView           = field.getUnitMap().getView();
                this._cursorView            = field.getCursor().getView();
                this._gridVisionEffectView  = field.getGridVisionEffect().getView();
                this.addChild(this._tileMapView);
                this.addChild(this._actionPlannerView.getContainerForGrids());
                this.addChild(this._unitMapView);
                this.addChild(this._actionPlannerView.getContainerForUnits());
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
