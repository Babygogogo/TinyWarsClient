
namespace TinyWars.WarMap {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import ConfigManager    = Utility.ConfigManager;
    import TimeModel        = Time.TimeModel;
    import WarSerialization = ProtoTypes.WarSerialization;

    export class WarMapUnitMapView extends egret.DisplayObjectContainer {
        private readonly _unitViews             : WarMapUnitView[] = [];
        private readonly _airLayer              = new egret.DisplayObjectContainer();
        private readonly _groundLayer           = new egret.DisplayObjectContainer();
        private readonly _seaLayer              = new egret.DisplayObjectContainer();
        private readonly _notifyListenerArray   : Notify.Listener[] = [
            { type: Notify.Type.UnitAnimationTick, callback: this._onNotifyUnitAnimationTick }
        ];

        public constructor() {
            super();

            this.addChild(this._seaLayer);
            this.addChild(this._groundLayer);
            this.addChild(this._airLayer);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }

        public showUnitMap({ unitDataArray, playerManagerData }: {
            unitDataArray       : WarSerialization.ISerialUnit[];
            playerManagerData   : WarSerialization.ISerialPlayerManager | null;
        }): void {
            this._initWithDataList(_createUnitViewDataList({ unitDataArray, playerManagerData }));
        }
        private _initWithDataList(dataList: Types.WarMapUnitViewData[]): void {
            this.clear();

            const tickCount = TimeModel.getUnitAnimationTickCount();
            for (const data of dataList) {
                this._addUnit(data, tickCount);
            }
            this._reviseZOrderForAllUnits();
        }
        public clear(): void {
            for (const view of this._unitViews) {
                (view.parent) && (view.parent.removeChild(view));
            }
            this._unitViews.length = 0;
        }

        private _onAddedToStage(e: egret.Event): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.addEventListeners(this._notifyListenerArray, this);
        }
        private _onRemovedFromStage(e: egret.Event): void {
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            Notify.removeEventListeners(this._notifyListenerArray, this);
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
            const unitsCount    = layer.numChildren;
            const unitViews     : WarMapUnitView[] = [];
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

            const configVersion = ConfigManager.getLatestFormalVersion();
            if (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, Types.UnitCategory.Air)) {
                this._airLayer.addChild(view);
            } else if (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, Types.UnitCategory.Ground)) {
                this._groundLayer.addChild(view);
            } else {
                this._seaLayer.addChild(view);
            }
        }
    }

    function _createUnitViewDataList({ unitDataArray, playerManagerData }: {
        unitDataArray       : WarSerialization.ISerialUnit[];
        playerManagerData   : WarSerialization.ISerialPlayerManager | null;
    }): Types.WarMapUnitViewData[] {
        const dataArray: Types.WarMapUnitViewData[] = [];
        if (unitDataArray) {
            const loaderUnitIdSet = new Set<number>();
            for (const unitData of unitDataArray) {
                const loaderUnitId = unitData.loaderUnitId;
                if (loaderUnitId == null) {
                    dataArray.push(Helpers.deepClone(unitData));
                } else {
                    loaderUnitIdSet.add(loaderUnitId);
                }
            }

            const playerDataArray = playerManagerData ? playerManagerData.players || [] : [];
            for (const unitData of dataArray) {
                if (loaderUnitIdSet.has(unitData.unitId)) {
                    unitData.hasLoadedUnit = true;
                }

                const playerData = playerDataArray.find(v => v.playerIndex === unitData.playerIndex);
                if (playerData) {
                    unitData.coUsingSkillType = playerData.coUsingSkillType;
                }
            }
        }

        return dataArray;
    }
}
