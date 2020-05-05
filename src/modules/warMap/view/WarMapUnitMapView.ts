
namespace TinyWars.WarMap {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types
    import ProtoTypes   = Utility.ProtoTypes;
    import TimeModel    = Time.TimeModel;

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

        public initWithDataList(dataList: Types.UnitViewData[]): void {
            this._clearUnits();

            const tickCount = TimeModel.getUnitAnimationTickCount();
            for (const data of dataList) {
                this._addUnit(data, tickCount);
            }
            this._reviseZOrderForAllUnits();
        }
        public initWithMapRawData(mapRawData: ProtoTypes.IMapRawData): void {
            this.initWithDataList(_createUnitViewDataList(mapRawData.units, mapRawData.unitDataList, mapRawData.mapWidth, mapRawData.mapHeight));
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
            const unitType = Utility.ConfigManager.getUnitTypeAndPlayerIndex(data.viewId).unitType;
            const view     = new WarMapUnitView(data, tickCount);
            this._unitViews.push(view);

            if (Utility.ConfigManager.checkIsUnitTypeInCategory(data.configVersion, unitType, Types.UnitCategory.Air)) {
                this._airLayer.addChild(view);
            } else if (Utility.ConfigManager.checkIsUnitTypeInCategory(data.configVersion, unitType, Types.UnitCategory.Ground)) {
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

    function _createUnitViewDataList(unitViewIds: number[], unitDataList: ProtoTypes.ISerializedWarUnit[], mapWidth: number, mapHeight: number): Types.UnitViewData[] {
        const configVersion = Utility.ConfigManager.getNewestConfigVersion();
        const dataList      : Types.UnitViewData[] = [];

        if (unitViewIds) {
            let index = 0;
            for (let y = 0; y < mapHeight; ++y) {
                for (let x = 0; x < mapWidth; ++x) {
                    const viewId = unitViewIds[index];
                    ++index;
                    if (viewId > 0) {
                        dataList.push({
                            configVersion: configVersion,
                            gridX        : x,
                            gridY        : y,
                            viewId       : viewId,
                        });
                    }
                }
            }
        } else if (unitDataList) {
            for (const unitData of unitDataList) {
                if (unitData.loaderUnitId == null) {
                    dataList.push({
                        configVersion,
                        gridX   : unitData.gridX,
                        gridY   : unitData.gridY,
                        viewId  : unitData.viewId,
                    });
                }
            }
        }

        return dataList;
    }
}
