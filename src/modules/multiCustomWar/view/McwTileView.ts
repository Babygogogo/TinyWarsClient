
namespace TinyWars.MultiCustomWar {
    import TimeModel    = Time.TimeModel;

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = ConfigManager.getGridSize();

    export class McwTileView {
        private _tile       : McwTile;
        private _imgBase    = new GameUi.UiImage();
        private _imgObject  = new GameUi.UiImage();
        private _hasFog     = false;

        public constructor() {
            this._imgBase.anchorOffsetY     = GRID_HEIGHT;
            this._imgObject.anchorOffsetY   = GRID_HEIGHT * 2;
        }

        public init(tile: McwTile): McwTileView {
            this._tile = tile;

            return this;
        }

        public startRunningView(): void {
            this.updateView();
        }

        public updateView(): void {
            this.setHasFog(this._tile.getIsFogEnabled());
        }

        public setHasFog(hasFog: boolean): void {
            this._hasFog = hasFog;
            this._updateImages();
        }

        public getImgObject(): GameUi.UiImage {
            return this._imgObject;
        };
        public getImgBase(): GameUi.UiImage {
            return this._imgBase;
        }

        public updateOnAnimationTick(): void {
            this._updateImages();
        }

        private _updateImages(): void {
            const tile      = this._tile;
            const tickCount = TimeModel.getTileAnimationTickCount();

            const objectId = tile.getObjectViewId();
            if (objectId == null) {
                this._imgObject.visible = false;
            } else {
                this._imgObject.visible = true;
                this._imgObject.source  = ConfigManager.getTileObjectImageSource(objectId, tickCount, this._hasFog);
            }

            const baseId = tile.getBaseViewId();
            if (baseId == null) {
                this._imgBase.visible = false;
            } else {
                this._imgBase.visible = true;
                this._imgBase.source  = ConfigManager.getTileBaseImageSource(baseId, tickCount, this._hasFog);
            }
        }
    }
}
