
namespace TinyWars.Replay {
    export class ReplayFieldView extends egret.DisplayObjectContainer {
        private _field                  : ReplayField;
        private _tileMapView            : ReplayTileMapView;
        private _actionPlannerView      : ReplayActionPlannerView;
        private _unitMapView            : ReplayUnitMapView;
        private _cursorView             : ReplayCursorView;
        private _gridVisionEffectView   : ReplayGridVisionEffectView;

        public init(field: ReplayField): void {
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

        public startRunning(): void {
        }
    }
}
