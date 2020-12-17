
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
        public fastInit(field: BwField): void {
            this._field = field;
        }

        public startRunningView(): void {
        }
        public stopRunningView(): void {
        }

        private _getUnitMapView(): BwUnitMapView {
            return this._unitMapView;
        }
        private _getTileMapView(): BwTileMapView {
            return this._tileMapView;
        }

        public setUnitsVisible(visible: boolean): void {
            this._getUnitMapView().visible = visible;
        }
        public getUnitsVisible(): boolean {
            return this._getUnitMapView().visible;
        }

        public setTileObjectsVisible(visible: boolean): void {
            this._getTileMapView().setObjectLayerVisible(visible);
        }
        public getTileObjectsVisible(): boolean {
            return this._getTileMapView().getObjectLayerVisible();
        }

        public setTileBasesVisible(visible: boolean): void {
            this._getTileMapView().setBaseLayerVisible(visible);
        }
        public getTileBasesVisible(): boolean {
            return this._getTileMapView().getBaseLayerVisible();
        }
    }
}
