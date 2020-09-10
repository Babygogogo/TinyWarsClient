
namespace TinyWars.WarMap {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import TimeModel        = Time.TimeModel;

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

        public initWithDataList(dataList: Types.WarMapUnitViewData[]): void {
            this._clearUnits();

            const tickCount = TimeModel.getUnitAnimationTickCount();
            for (const data of dataList) {
                this._addUnit(data, tickCount);
            }
            this._reviseZOrderForAllUnits();
        }
        public initWithMapRawData(mapRawData: ProtoTypes.Map.IMapRawData): void {
            this.initWithDataList(_createUnitViewDataList(mapRawData.unitDataList));
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
            unitViews.sort((v1, v2): number => {
                const g1 = v1.getData().gridIndex;
                const g2 = v2.getData().gridIndex;
                const y1 = g1.y;
                const y2 = g2.y;
                return y1 !== y2 ? y1 - y2 : g1.x - g2.x;
            })

            for (let i = 0; i < unitsCount; ++i) {
                layer.addChildAt(unitViews[i], i);
            }
        }

        private _addUnit(data: Types.WarMapUnitViewData, tickCount: number): void {
            const unitType = data.unitType;
            const view     = new WarMapUnitView(data, tickCount);
            this._unitViews.push(view);

            const configVersion = ConfigManager.getNewestConfigVersion();
            if (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, Types.UnitCategory.Air)) {
                this._airLayer.addChild(view);
            } else if (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, Types.UnitCategory.Ground)) {
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

    function _createUnitViewDataList(unitDataList: ProtoTypes.WarSerialization.ISerialUnit[]): Types.WarMapUnitViewData[] {
        const dataList: Types.WarMapUnitViewData[] = [];
        if (unitDataList) {
            for (const unitData of unitDataList) {
                if (unitData.loaderUnitId == null) {
                    dataList.push({
                        gridIndex       : unitData.gridIndex as Types.GridIndex,
                        skinId          : ConfigManager.getUnitAndTileDefaultSkinId(unitData.playerIndex),
                        unitType        : unitData.unitType,
                        unitActionState : unitData.actionState,
                    });
                }
            }
        }

        return dataList;
    }
}
