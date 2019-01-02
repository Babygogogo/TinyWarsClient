
namespace TinyWars.OnlineWar {
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
                { type: Notify.Type.UnitAnimationTick, callback: this._onNotifyUnitAnimationTick }
            ], this);
        }

        public initWithDatas(datas: Types.UnitViewData[]): void {
            this._clearUnits();

            const tickCount = TimeModel.getUnitAnimationTickCount();
            for (const data of datas) {
                this._addUnit(data, tickCount);
            }
            this._reviseZOrderForAllUnits();
        }

        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const tickCount = TimeModel.getUnitAnimationTickCount();
            for (const view of this._unitViews) {
                view.updateOnAnimationTick(tickCount);
            }
        }

        private _reviseZOrderForAllUnits(): void {
            this._reviseZOrderForSingleLayer(this._airLayer);
            this._reviseZOrderForSingleLayer(this._groundLayer);
            this._reviseZOrderForSingleLayer(this._seaLayer);
        }

        private _reviseZOrderForSingleLayer(layer: egret.DisplayObjectContainer): void {
            const unitsCount = layer.numChildren;
            const unitViews: UnitView[] = [];
            for (let i = 0; i < unitsCount; ++i) {
                unitViews.push(layer.getChildAt(i) as UnitView);
            }
            unitViews.sort((a, b): number => {
                const dataA = a.getData();
                const dataB = b.getData();
                return dataA.gridY !== dataB.gridY ? dataA.gridY - dataB.gridY : dataA.unitId - dataB.unitId;
            })

            for (let i = 0; i < unitsCount; ++i) {
                layer.addChildAt(unitViews[i], i);
            }
        }

        private _addUnit(data: Types.UnitViewData, tickCount: number): void {
            const unitType = IdConverter.getUnitTypeAndPlayerIndex(data.viewId).unitType;
            const view     = new UnitView(data, tickCount);
            this._unitViews.push(view);

            if (ConfigManager.checkIsInUnitCategory(data.configVersion, unitType, Types.UnitCategory.Air)) {
                this._airLayer.addChild(view);
            } else if (ConfigManager.checkIsInUnitCategory(data.configVersion, unitType, Types.UnitCategory.Ground)) {
                this._groundLayer.addChild(view);
            } else {
                this._seaLayer.addChild(view);
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
