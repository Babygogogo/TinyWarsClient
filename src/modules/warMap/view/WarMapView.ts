
namespace TinyWars.WarMap {
    import CommonModel      = Common.CommonModel;
    import UiImage          = GameUi.UiImage;
    import TimeModel        = Time.TimeModel;
    import Notify           = Utility.Notify;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import Types            = Utility.Types;
    import MapSize          = Types.MapSize;
    import IMapRawData      = ProtoTypes.Map.IMapRawData;
    import ISerialTile      = ProtoTypes.WarSerialization.ISerialTile;
    import CommonConstants  = Utility.CommonConstants;

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = CommonConstants.GridSize;

    export class WarMapView extends egret.DisplayObjectContainer {
        private readonly _tileMapView   = new TileMapView();
        private readonly _unitMapView   = new UnitMapView();

        public constructor() {
            super();

            this.addChild(this._tileMapView);
            this.addChild(this._unitMapView);
        }

        public showMap(mapRawData: IMapRawData): void {
            this.width  = GRID_WIDTH  * mapRawData.mapWidth;
            this.height = GRID_HEIGHT * mapRawData.mapHeight;
            this._tileMapView.showTileMap(mapRawData.tileDataArray);
            this._unitMapView.showUnitMap(mapRawData);
        }
        public clear(): void {
            this._tileMapView.clear();
            this._unitMapView.clear();
        }
    }

    class TileMapView extends egret.DisplayObjectContainer {
        private readonly _baseLayer             = new TileBaseLayer();
        private readonly _objectLayer           = new TileObjectLayer();
        private readonly _notifyListenerArray   : Notify.Listener[] = [
            { type: Notify.Type.TileAnimationTick, callback: this._onNotifyTileAnimationTick }
        ];

        public constructor() {
            super();

            this.addChild(this._baseLayer);
            this.addChild(this._objectLayer);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);

            // this._initTest();
        }

        public showTileMap(dataList: ISerialTile[]): void {
            this._baseLayer.updateWithTileDataList(dataList);
            this._objectLayer.updateWithTileDataList(dataList);
        }
        public clear(): void {
            this.showTileMap([]);
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
        private _onNotifyTileAnimationTick(e: egret.Event): void {
            this._baseLayer.updateViewOnTick();
            this._objectLayer.updateViewOnTick();
        }

        // private _initTest(): void {
        //     const ids1: number[][] = new Array(this._colCount);
        //     const ids2: number[][] = new Array(this._colCount);
        //     for (let x = 0; x < this._colCount; ++x) {
        //         ids1[x] = new Array(this._rowCount);
        //         ids2[x] = new Array(this._rowCount);
        //         for (let y = 0; y < this._rowCount; ++y) {
        //             ids1[x][y] = Math.floor(Math.random() * 100);
        //             ids2[x][y] = Math.floor(Math.random() * 109);
        //         }
        //     }
        //     this.updateWithBaseViewIdMatrix(ids1);
        //     this.updateWithObjectViewIdMatrix(ids2);
        // }
    }

    abstract class TileLayerBase extends eui.Component {
        private readonly _tileDataMap   : ISerialTile[][] = [];
        private readonly _imageMap      : UiImage[][] = [];

        public updateWithTileDataList(tileDataArray: ISerialTile[]): void {
            const mapSize = getMapSize(tileDataArray);
            this._resetTileDataMap(mapSize, tileDataArray);
            this._resetImageMap(mapSize);

            this.updateViewOnTick();
        }

        public updateViewOnTick(): void {
            const imageMap      = this._imageMap;
            const tileDataMap   = this._tileDataMap;
            const width         = tileDataMap.length;
            const height        = width > 0 ? tileDataMap[0].length : 0;
            const tickCount     = Time.TimeModel.getTileAnimationTickCount();
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    imageMap[x][y].source = this._getImageSource(tileDataMap[x][y], tickCount);
                }
            }
        }

        private _resetTileDataMap(mapSize: MapSize, tileDataArray: ISerialTile[]): void {
            const map       = this._tileDataMap;
            const width     = mapSize.width;
            const height    = mapSize.height;
            map.length      = width;
            for (let x = 0; x < width; ++x) {
                if (map[x] == null) {
                    map[x] = [];
                }

                const column    = map[x];
                column.length   = height;
                column.fill(undefined);
            }

            for (const tileData of tileDataArray) {
                const gridIndex                 = tileData.gridIndex;
                map[gridIndex.x][gridIndex.y]   = tileData;
            }
        }
        private _resetImageMap(mapSize: MapSize): void {
            const map       = this._imageMap;
            const width     = mapSize.width;
            const height    = mapSize.height;
            for (let x = width; x < map.length; ++x) {
                for (const img of map[x] || []) {
                    (img) && (img.parent) && (img.parent.removeChild(img));
                }
            }
            map.length = width;

            for (let x = 0; x < width; ++x) {
                if (map[x] == null) {
                    map[x] = [];
                }

                const column = map[x];
                for (let y = height; y < column.length; ++y) {
                    const img = column[y];
                    (img) && (img.parent) && (img.parent.removeChild(img));
                }
                column.length = height;

                for (let y = 0; y < height; ++y) {
                    if (column[y] == null) {
                        const img   = new UiImage();
                        img.x       = GRID_WIDTH * x;
                        img.y       = this._getImageY(y);
                        column[y]   = img;
                        this.addChild(img);
                    }
                }
            }
        }

        protected abstract _getImageSource(tileData: ISerialTile, tickCount: number): string;
        protected abstract _getImageY(gridY: number): number;
    }

    class TileBaseLayer extends TileLayerBase {
        protected _getImageSource(tileData: ISerialTile, tickCount: number): string {
            return tileData == null
                ? undefined
                : CommonModel.getCachedTileBaseImageSource({
                    version : User.UserModel.getSelfSettingsTextureVersion(),
                    baseType: tileData.baseType,
                    shapeId : tileData.baseShapeId || 0,
                    isDark  : false,
                    skinId  : CommonConstants.UnitAndTileNeutralSkinId,
                    tickCount,
                });
        }

        protected _getImageY(gridY: number): number {
            return GRID_HEIGHT * gridY;
        }
    }

    class TileObjectLayer extends TileLayerBase {
        protected _getImageSource(tileData: ISerialTile, tickCount: number): string {
            return tileData == null
                ? undefined
                : CommonModel.getCachedTileObjectImageSource({
                    version     : User.UserModel.getSelfSettingsTextureVersion(),
                    objectType  : tileData.objectType,
                    shapeId     : tileData.objectShapeId || 0,
                    isDark      : false,
                    skinId      : tileData.playerIndex,
                    tickCount,
                });
        }

        protected _getImageY(gridY: number): number {
            return GRID_HEIGHT * (gridY - 1);
        }
    }

    class UnitMapView extends egret.DisplayObjectContainer {
        private readonly _unitViews             : UnitView[] = [];
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

        public showUnitMap(mapRawData: ProtoTypes.Map.IMapRawData): void {
            this._initWithDataList(_createUnitViewDataList(mapRawData.unitDataArray));
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
            const unitsCount = layer.numChildren;
            const unitViews: UnitView[] = [];
            for (let i = 0; i < unitsCount; ++i) {
                unitViews.push(layer.getChildAt(i) as UnitView);
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
            const view     = new UnitView(data, tickCount);
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

    class UnitView extends egret.DisplayObjectContainer {
        private _unitImage: UiImage;

        private _data   : Types.WarMapUnitViewData;

        public constructor(data?: Types.WarMapUnitViewData, tickCount?: number) {
            super();

            const unitImage  = new UiImage();
            unitImage.bottom = -GRID_HEIGHT;
            this._unitImage  = unitImage;
            this.addChild(unitImage);

            (data) && (this.update(data, tickCount));
        }

        public update(data: Types.WarMapUnitViewData, tickCount?: number): void {
            const gridIndex = data.gridIndex;
            this._data = data;
            this.updateOnAnimationTick(tickCount || TimeModel.getUnitAnimationTickCount());
            this.x = gridIndex.x * GRID_WIDTH - GRID_WIDTH / 4;
            this.y = gridIndex.y * GRID_HEIGHT - GRID_HEIGHT / 2;
        }

        public getData(): Types.WarMapUnitViewData {
            return this._data;
        }

        public updateOnAnimationTick(tickCount: number): void {
            const data = this._data;
            if (data) {
                this._unitImage.source = CommonModel.getCachedUnitImageSource({
                    version     : User.UserModel.getSelfSettingsTextureVersion(),
                    skinId      : data.skinId,
                    unitType    : data.unitType,
                    isMoving    : false,
                    isDark      : data.unitActionState === Types.UnitActionState.Acted,
                    tickCount,
                });
            }
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

    function getMapSize(tileDataArray: ISerialTile[]): MapSize {
        let width   = 0;
        let height  = 0;
        for (const tile of tileDataArray) {
            const gridIndex = tile.gridIndex;
            width           = Math.max(gridIndex.x + 1, width);
            height          = Math.max(gridIndex.y + 1, height);
        }

        return { width, height };
    }
}
