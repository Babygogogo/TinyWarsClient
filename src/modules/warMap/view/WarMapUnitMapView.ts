
namespace TinyWars.WarMap {
    import Notify      = Utility.Notify;
    import Types       = Utility.Types
    import TimeModel   = Time.TimeModel;

    export class WarMapUnitMapView extends egret.DisplayObjectContainer {
        private _unitViews  : WarMapUnitView[] = [];
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
            const unitViews: WarMapUnitView[] = [];
            for (let i = 0; i < unitsCount; ++i) {
                unitViews.push(layer.getChildAt(i) as WarMapUnitView);
            }
            unitViews.sort((a, b): number => {
                const dataA = a.getData();
                const dataB = b.getData();
                return dataA.gridY !== dataB.gridY ? dataA.gridY - dataB.gridY : dataA.gridX - dataB.gridY;
            })

            for (let i = 0; i < unitsCount; ++i) {
                layer.addChildAt(unitViews[i], i);
            }
        }

        private _addUnit(data: Types.UnitViewData, tickCount: number): void {
            const unitType = ConfigManager.getUnitTypeAndPlayerIndex(data.viewId).unitType;
            const view     = new WarMapUnitView(data, tickCount);
            this._unitViews.push(view);

            if (ConfigManager.checkIsUnitTypeInCategory(data.configVersion, unitType, Types.UnitCategory.Air)) {
                this._airLayer.addChild(view);
            } else if (ConfigManager.checkIsUnitTypeInCategory(data.configVersion, unitType, Types.UnitCategory.Ground)) {
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
