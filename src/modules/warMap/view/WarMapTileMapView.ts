
namespace TinyWars.WarMap {
    import Notify       = Utility.Notify;
    import ProtoTypes   = Utility.ProtoTypes;
    import UiImage      = GameUi.UiImage;
    import TimeModel    = Time.TimeModel;
    import CommonModel  = Common.CommonModel;
    import ISerialTile  = ProtoTypes.WarSerialization.ISerialTile;

    const { width: _GRID_WIDTH, height: _GRID_HEIGHT } = Utility.ConfigManager.getGridSize();

    export class WarMapTileMapView extends egret.DisplayObjectContainer {
        private _isInitialized: boolean;

        // private _colCount   : number;
        // private _rowCount   : number;
        private _baseLayer  : TileBaseLayer;
        private _objectLayer: TileObjectLayer;

        public init(colCount: number, rowCount: number): void {
            egret.assert(!this._isInitialized, "WarMapTileMapView.init() already initialized!");
            this._isInitialized = true;

            // this._colCount = colCount;
            // this._rowCount = rowCount;

            this._baseLayer = new TileBaseLayer();
            this._baseLayer.init(colCount, rowCount);
            this.addChild(this._baseLayer);

            this._objectLayer = new TileObjectLayer();
            this._objectLayer.init(colCount, rowCount);
            this.addChild(this._objectLayer);

            Notify.addEventListeners([
                { type: Notify.Type.TileAnimationTick, callback: this._onNotifyTileAnimationTick }
            ], this);

            // this._initTest();
        }

        public updateWithTileDataList(dataList: ISerialTile[]): void {
            this._baseLayer.updateWithTileDataList(dataList);
            this._objectLayer.updateWithTileDataList(dataList);
        }
        // public updateWithBaseViewIdMatrix(ids: number[][]): void {
        //     this._baseLayer.updateWithViewIdMatrix(ids);
        // }

        // public updateWithObjectViewIdArray(ids: number[]): void {
        //     this._objectLayer.updateWithViewIdArray(ids);
        // }
        // public updateWithObjectViewIdMatrix(ids: number[][]): void {
        //     this._objectLayer.updateWithViewIdMatrix(ids);
        // }

        // public updateWithBaseViewId(id: number, x: number, y: number): void {
        //     this._baseLayer.updateWithViewId(id, x, y);
        // }

        // public updateWithObjectViewId(id: number, x: number, y: number): void {
        //     this._objectLayer.updateWithViewId(id, x, y);
        // }

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
        private _isInitialized: boolean;

        protected _tileDataMap  : ISerialTile[][];
        protected _images       : UiImage[][];
        protected _colCount     : number;
        protected _rowCount     : number;

        public init(colCount: number, rowCount: number): void {
            egret.assert(!this._isInitialized, "TileLayerBase.init() already initialized!");
            this._isInitialized = true;

            this._colCount = colCount;
            this._rowCount = rowCount;
            this.width     = _GRID_WIDTH  * colCount;
            this.height    = _GRID_HEIGHT * rowCount;

            this._tileDataMap   = new Array(colCount);
            this._images        = new Array(colCount);
            for (let x = 0; x < colCount; ++x) {
                this._tileDataMap[x]    = new Array(rowCount);
                this._images[x]         = new Array(rowCount);
            }

            for (let y = 0; y < rowCount; ++y) {
                const posY = this._getImageY(y);
                for (let x = 0; x < colCount; ++x) {
                    const img = new UiImage();
                    img.x               = _GRID_WIDTH * x;
                    img.y               = posY;
                    this._images[x][y]  = img;
                    this.addChild(img);
                }
            }
        }

        public updateWithTileDataList(tileDataList: ISerialTile[]): void {
            const tickCount = TimeModel.getTileAnimationTickCount();
            const cols      = this._colCount;
            const rows      = this._rowCount;
            for (let x = 0; x < cols; ++x) {
                for (let y = 0; y < rows; ++y) {
                    const tileData              = tileDataList[x + y * cols];
                    this._tileDataMap[x][y]     = tileData;
                    this._images[x][y].source   = this._getImageSource(tileData, tickCount);
                }
            }
        }

        // public updateWithViewIdMatrix(ids: number[][]): void {
        //     const tickCount = TimeModel.getTileAnimationTickCount();
        //     for (let x = 0; x < this._colCount; ++x) {
        //         for (let y = 0; y < this._rowCount; ++y) {
        //             const id = ids[x][y];
        //             this._ids[x][y]           = id;
        //             this._images[x][y].source = this._getImageSource(id, tickCount);
        //         }
        //     }
        // }

        // public updateWithViewId(id: number, x: number, y: number): void {
        //     this._ids[x][y]           = id;
        //     this._images[x][y].source = this._getImageSource(id, TimeModel.getTileAnimationTickCount());
        // }

        public updateViewOnTick(): void {
            const images = this._images;
            const ids    = this._tileDataMap;
            const tickCount = Time.TimeModel.getTileAnimationTickCount();
            for (let x = 0; x < this._colCount; ++x) {
                for (let y = 0; y < this._rowCount; ++y) {
                    images[x][y].source = this._getImageSource(ids[x][y], tickCount);
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
                    version : CommonModel.getUnitAndTileTextureVersion(),
                    baseType: tileData.baseType,
                    shapeId : tileData.baseShapeId || 0,
                    isDark  : false,
                    skinId  : tileData.playerIndex,
                    tickCount,
                });
        }

        protected _getImageY(gridY: number): number {
            return _GRID_HEIGHT * gridY;
        }
    }

    class TileObjectLayer extends TileLayerBase {
        protected _getImageSource(tileData: ISerialTile, tickCount: number): string {
            return tileData == null
                ? undefined
                : CommonModel.getCachedTileObjectImageSource({
                    version     : CommonModel.getUnitAndTileTextureVersion(),
                    objectType  : tileData.objectType,
                    shapeId     : tileData.baseShapeId || 0,
                    isDark      : false,
                    skinId      : tileData.playerIndex,
                    tickCount,
                });
        }

        protected _getImageY(gridY: number): number {
            return _GRID_HEIGHT * (gridY - 1);
        }
    }
}
