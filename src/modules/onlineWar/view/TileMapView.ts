
namespace OnlineWar {
    import UiImage  = GameUi.UiImage;
    import Notify   = Utility.Notify;
    import TimeModel = Time.TimeModel;

    export class TileMapView extends egret.DisplayObjectContainer {
        private _isInitialized: boolean;

        private _baseLayer  : TileBaseLayer;
        private _objectLayer: TileObjectLayer;

        public init(width: number, height: number): void {
            egret.assert(!this._isInitialized, "TileMapView.init() already initialized!");
            this._isInitialized = true;

            this._baseLayer = new TileBaseLayer();
            this._baseLayer.init(width, height);
            this._objectLayer = new TileObjectLayer();
            this._objectLayer.init(width, height);

            Notify.addEventListeners([
                { name: Notify.Type.TileAnimationTick, callback: this._onNotifyTileAnimationTick }
            ], this);
        }

        public updateWithBaseViewIds(ids: number[][]): void {
            this._baseLayer.updateWithViewIds(ids);
        }

        public updateWithObjectViewIds(ids: number[][]): void {
            this._objectLayer.updateWithViewIds(ids);
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
    }

    abstract class TileLayerBase extends egret.DisplayObjectContainer {
        private _isInitialized: boolean;

        protected _ids   : number[][];
        protected _images: UiImage[][];
        protected _width : number;
        protected _height: number;

        public init(width: number, height: number): void {
            egret.assert(!this._isInitialized, "TileLayerBase.init() already initialized!");
            this._isInitialized = true;

            this._width  = width;
            this._height = height;

            this._ids    = new Array(width);
            this._images = new Array(width);
            for (let x = 0; x < width; ++x) {
                this._ids[x]    = new Array(height);
                this._images[x] = new Array(height);

                for (let y = 0; y < height; ++y) {
                    this._images[x][y] = new UiImage();
                }
            }
        }

        public updateWithViewIds(ids: number[][]): void {
            const tickCount = TimeModel.getTileAnimationTickCount();
            for (let x = 0; x < this._width; ++x) {
                for (let y = 0; y < this._height; ++y) {
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
            for (let x = 0; x < this._width; ++x) {
                for (let y = 0; y < this._height; ++y) {
                    images[x][y].source = this._getImageSource(ids[x][y], tickCount);
                }
            }
        }

        protected abstract _getImageSource(id: number, tickCount: number): string;
    }

    class TileBaseLayer extends TileLayerBase {
        protected _getImageSource(id: number, tickCount: number): string {
            // TODO
            return undefined;
        }
    }

    class TileObjectLayer extends TileLayerBase {
        protected _getImageSource(id: number, tickCount: number): string {
            // TODO
            return undefined;
        }
    }
}
