
namespace TinyWars.OnlineWar {
    import UiImage     = GameUi.UiImage;
    import Notify      = Utility.Notify;
    import IdConverter = Utility.IdConverter;
    import TimeModel   = Time.TimeModel;

    export class TileMapView extends egret.DisplayObjectContainer {
        private _isInitialized: boolean;

        private _colCount   : number;
        private _rowCount   : number;
        private _baseLayer  : TileBaseLayer;
        private _objectLayer: TileObjectLayer;

        public init(colCount: number, rowCount: number): void {
            egret.assert(!this._isInitialized, "TileMapView.init() already initialized!");
            this._isInitialized = true;

            this._colCount = colCount;
            this._rowCount = rowCount;

            this._baseLayer = new TileBaseLayer();
            this._baseLayer.init(colCount, rowCount);
            this.addChild(this._baseLayer);

            this._objectLayer = new TileObjectLayer();
            this._objectLayer.init(colCount, rowCount);
            this.addChild(this._objectLayer);

            Notify.addEventListeners([
                { name: Notify.Type.TileAnimationTick, callback: this._onNotifyTileAnimationTick }
            ], this);

            // this._initTest();
        }

        public updateWithBaseViewIdArray(ids: number[]): void {
            this._baseLayer.updateWithViewIdArray(ids);
        }
        public updateWithBaseViewIdMatrix(ids: number[][]): void {
            this._baseLayer.updateWithViewIdMatrix(ids);
        }

        public updateWithObjectViewIdArray(ids: number[]): void {
            this._objectLayer.updateWithViewIdArray(ids);
        }
        public updateWithObjectViewIdMatrix(ids: number[][]): void {
            this._objectLayer.updateWithViewIdMatrix(ids);
        }

        public updateWithBaseViewId(id: number, x: number, y: number): void {
            this._baseLayer.updateWithViewId(id, x, y);
        }

        public updateWithObjectViewId(id: number, x: number, y: number): void {
            this._objectLayer.updateWithViewId(id, x, y);
        }

        private _onNotifyTileAnimationTick(e: egret.Event): void {
            this._baseLayer.updateViewOnTick();
            this._objectLayer.updateViewOnTick();
        }

        private _initTest(): void {
            const ids1: number[][] = new Array(this._colCount);
            const ids2: number[][] = new Array(this._colCount);
            for (let x = 0; x < this._colCount; ++x) {
                ids1[x] = new Array(this._rowCount);
                ids2[x] = new Array(this._rowCount);
                for (let y = 0; y < this._rowCount; ++y) {
                    ids1[x][y] = Math.floor(Math.random() * 100);
                    ids2[x][y] = Math.floor(Math.random() * 109);
                }
            }
            this.updateWithBaseViewIdMatrix(ids1);
            this.updateWithObjectViewIdMatrix(ids2);
        }
    }

    abstract class TileLayerBase extends eui.Component {
        private _isInitialized: boolean;

        protected _ids     : number[][];
        protected _images  : UiImage[][];
        protected _colCount: number;
        protected _rowCount: number;

        public init(colCount: number, rowCount: number): void {
            egret.assert(!this._isInitialized, "TileLayerBase.init() already initialized!");
            this._isInitialized = true;

            const gridSize = Config.getGridSize();
            this._colCount = colCount;
            this._rowCount = rowCount;
            this.width     = gridSize.width  * colCount;
            this.height    = gridSize.height * rowCount;

            this._ids      = new Array(colCount);
            this._images   = new Array(colCount);
            for (let x = 0; x < colCount; ++x) {
                this._ids[x]    = new Array(rowCount);
                this._images[x] = new Array(rowCount);
            }

            for (let y = 0; y < rowCount; ++y) {
                const bottom = gridSize.height * (rowCount - y - 1);
                for (let x = 0; x < colCount; ++x) {
                    const img = new UiImage();
                    img.left   = gridSize.width * x;
                    img.bottom = bottom;
                    this._images[x][y] = img;
                    this.addChild(img);
                }
            }
        }

        public updateWithViewIdArray(ids: number[]): void {
            const tickCount = TimeModel.getTileAnimationTickCount();
            const cols      = this._colCount;
            const rows      = this._rowCount;
            for (let x = 0; x < cols; ++x) {
                for (let y = 0; y < rows; ++y) {
                    const id = ids[x + y * cols];
                    this._ids[x][y]           = id;
                    this._images[x][y].source = this._getImageSource(id, tickCount);
                }
            }
        }

        public updateWithViewIdMatrix(ids: number[][]): void {
            const tickCount = TimeModel.getTileAnimationTickCount();
            for (let x = 0; x < this._colCount; ++x) {
                for (let y = 0; y < this._rowCount; ++y) {
                    const id = ids[x][y];
                    this._ids[x][y]           = id;
                    this._images[x][y].source = this._getImageSource(id, tickCount);
                }
            }
        }

        public updateWithViewId(id: number, x: number, y: number): void {
            this._ids[x][y]           = id;
            this._images[x][y].source = this._getImageSource(id, TimeModel.getTileAnimationTickCount());
        }

        public updateViewOnTick(): void {
            const images = this._images;
            const ids    = this._ids;
            const tickCount = Time.TimeModel.getTileAnimationTickCount();
            for (let x = 0; x < this._colCount; ++x) {
                for (let y = 0; y < this._rowCount; ++y) {
                    images[x][y].source = this._getImageSource(ids[x][y], tickCount);
                }
            }
        }

        protected abstract _getImageSource(id: number, tickCount: number): string;
    }

    class TileBaseLayer extends TileLayerBase {
        protected _getImageSource(id: number, tickCount: number): string {
            return id == null
                ? undefined
                : IdConverter.getTileBaseImageSource(id, tickCount);
        }
    }

    class TileObjectLayer extends TileLayerBase {
        protected _getImageSource(id: number, tickCount: number): string {
            return id == null
            ? undefined
            : IdConverter.getTileObjectImageSource(id, tickCount);
        }
    }
}
