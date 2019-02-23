
namespace TinyWars.MultiCustomWar {
    import Notify = Utility.Notify;

    export class McwTileMapView extends egret.DisplayObjectContainer {
        private _tileViews      = new Array<McwTileView>();
        private _baseLayer      = new egret.DisplayObjectContainer();
        private _objectLayer    = new egret.DisplayObjectContainer();

        private _tileMap    : McwTileMap;

        private _notifyListeners = [
            { type: Notify.Type.TileAnimationTick, callback: this._onNotifyTileAnimationTick },
        ];

        public constructor() {
            super();

            this.addChild(this._baseLayer);
            this.addChild(this._objectLayer);
        }

        public init(tileMap: McwTileMap): void {
            this._tileMap = tileMap;

            this._tileViews.length = 0;
            this._baseLayer.removeChildren();
            this._objectLayer.removeChildren();

            const gridSize = ConfigManager.getGridSize();
            tileMap.forEachTile(tile => {
                const view  = tile.getView();
                const x     = gridSize.width * tile.getGridX();
                const y     = gridSize.height * (tile.getGridY() + 1);
                this._tileViews.push(view);

                const imgBase = view.getImgBase();
                imgBase.x   = x;
                imgBase.y   = y;
                this._baseLayer.addChild(imgBase);

                const imgObject = view.getImgObject();
                imgObject.x = x;
                imgObject.y = y;
                this._objectLayer.addChild(imgObject);
            });
        }

        public startRunning(): void {
            Notify.addEventListeners(this._notifyListeners, this);
        }
        public stopRunning(): void {
            Notify.removeEventListeners(this._notifyListeners, this);
        }

        private _onNotifyTileAnimationTick(e: egret.Event): void {
            for (const view of this._tileViews) {
                view.updateOnAnimationTick();
            }
        }
    }
}
