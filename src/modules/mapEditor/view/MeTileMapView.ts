
namespace TinyWars.MapEditor {
    import Notify = Utility.Notify;

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = Utility.ConfigManager.getGridSize();

    export class MeTileMapView extends egret.DisplayObjectContainer {
        private _tileViews          = new Array<MeTileView>();
        private _baseLayer          = new egret.DisplayObjectContainer();
        private _objectLayer        = new egret.DisplayObjectContainer();

        private _tileMap    : MeTileMap;

        private _notifyListeners = [
            { type: Notify.Type.TileAnimationTick, callback: this._onNotifyTileAnimationTick },
        ];

        public constructor() {
            super();

            this.addChild(this._baseLayer);
            this.addChild(this._objectLayer);
        }

        public init(tileMap: MeTileMap): void {
            this._tileMap = tileMap;

            this._tileViews.length = 0;
            this._baseLayer.removeChildren();
            this._objectLayer.removeChildren();

            tileMap.forEachTile(tile => {
                const view  = tile.getView();
                const x     = GRID_WIDTH * tile.getGridX();
                const y     = GRID_HEIGHT * (tile.getGridY() + 1);
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

        public startRunningView(): void {
            Notify.addEventListeners(this._notifyListeners, this);
        }
        public stopRunningView(): void {
            Notify.removeEventListeners(this._notifyListeners, this);
        }

        protected _getTileMap(): MeTileMap {
            return this._tileMap;
        }

        private _onNotifyTileAnimationTick(e: egret.Event): void {
            for (const view of this._tileViews) {
                view.updateOnAnimationTick();
            }
        }

        public setBaseLayerVisible(visible: boolean): void {
            this._baseLayer.visible = visible;
        }
        public getBaseLayerVisible(): boolean {
            return this._baseLayer.visible;
        }

        public setObjectLayerVisible(visible: boolean): void {
            this._objectLayer.visible = visible;
        }
        public getObjectLayerVisible(): boolean {
            return this._objectLayer.visible;
        }
    }
}
