
namespace TinyWars.MultiCustomWar {
    export class McwFieldView extends egret.DisplayObjectContainer {
        private _field                  : McwField;
        private _tileMapView            : McwTileMapView;
        private _actionPlannerView      : McwActionPlannerView;
        private _unitMapView            : McwUnitMapView;
        private _cursorView             : McwCursorView;
        private _gridVisionEffectView   : McwGridVisionEffectView;

        public init(field: McwField): void {
            egret.assert(!this._field, "McwFieldView.init() already initialied!");
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

        public startRunningView(): void {
        }
        public stopRunningView(): void {
        }
    }
}
