
namespace OnlineWar {
    import UiImage     = GameUi.UiImage;
    import Notify      = Utility.Notify;
    import IdConverter = Utility.IdConverter;
    import Types       = Utility.Types
    import TimeModel   = Time.TimeModel;

    export class UnitMapView extends egret.DisplayObjectContainer {
        private _unitViews  : UnitView[] = [];
        private _airLayer   : egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        private _groundLayer: egret.DisplayObjectContainer = new egret.DisplayObjectContainer();
        private _seaLayer   : egret.DisplayObjectContainer = new egret.DisplayObjectContainer();

        public constructor() {
            super();

            this.addChild(this._seaLayer);
            this.addChild(this._groundLayer);
            this.addChild(this._airLayer);

            Notify.addEventListeners([
                { name: Notify.Type.UnitAnimationTick, callback: this._onNotifyUnitAnimationTick }
            ], this);
        }

        public initWithDatas(datas: Types.UnitViewData[]): void {
            this._clearUnits();

            const tickCount = TimeModel.getUnitAnimationTickCount();
            for (const data of datas) {
                this._addUnit(data, tickCount);
            }
        }

        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const tickCount = TimeModel.getUnitAnimationTickCount();
            for (const view of this._unitViews) {
                view.updateOnAnimationTick(tickCount);
            }
        }

        private _addUnit(data: Types.UnitViewData, tickCount: number): void {
            const unitType = IdConverter.getUnitTypeAndPlayerIndex(data.viewId).unitType;
            if (Config.checkIsInUnitCategory(data.configVersion, unitType, Types.UnitCategory.Air)) {
                this._airLayer.addChild(new UnitView(data, tickCount));
            } else if (Config.checkIsInUnitCategory(data.configVersion, unitType, Types.UnitCategory.Ground)) {
                this._groundLayer.addChild(new UnitView(data, tickCount));
            } else {
                this._seaLayer.addChild(new UnitView(data, tickCount));
            }
        }

        private _clearUnits(): void {
            for (const view of this._unitViews) {
                (view.parent) && (view.parent.removeChild(view));
            }
            this._unitViews.length = 0;
        }
    }
}
