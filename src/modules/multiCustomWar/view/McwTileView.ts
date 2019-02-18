
namespace TinyWars.MultiCustomWar {
    import TimeModel    = Time.TimeModel;
    import Helpers      = Utility.Helpers;
    import Types        = Utility.Types;

    export class McwTileView {
        private _tile       : McwTile;
        private _imgBase    = new GameUi.UiImage;
        private _imgObject  = new GameUi.UiImage;
        private _hasFog     = false;

        public constructor() {
            this._imgBase.addEventListener(  eui.UIEvent.RESIZE, () => this._imgBase.anchorOffsetY   = this._imgBase.height,   this);
            this._imgObject.addEventListener(eui.UIEvent.RESIZE, () => this._imgObject.anchorOffsetY = this._imgObject.height, this);
        }

        public init(tile: McwTile): void {
            this._tile = tile;

            this.updateImages();
        }

        public startRunning(): void {
            this.setHasFog(!this._tile.checkIsVisibleToLoggedInPlayer());
        }

        public setHasFog(hasFog: boolean): void {
            this._hasFog = hasFog;
            this.updateImages();
        }

        public getImgObject(): GameUi.UiImage {
            return this._imgObject;
        };
        public getImgBase(): GameUi.UiImage {
            return this._imgBase;
        }

        public updateImages(): void {
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
