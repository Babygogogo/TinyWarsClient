
namespace TinyWars.MultiCustomWar {
    import TimeModel    = Time.TimeModel;
    import Helpers      = Utility.Helpers;
    import Types        = Utility.Types;

    export class McwTileView {
        private _tile       : McwTile;
        private _imgBase    = new GameUi.UiImage;
        private _imgObject  = new GameUi.UiImage;

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
            const color = hasFog ? Types.ColorType.Dark : Types.ColorType.Origin;
            Helpers.changeColor(this._imgBase, color);
            Helpers.changeColor(this._imgObject, color);
        }

        public getImgObject(): GameUi.UiImage {
            return this._imgObject;
        };
        public getImgBase(): GameUi.UiImage {
            return this._imgBase;
        }

        public updateImages(): void {
            const tile              = this._tile;
            const tickCount         = TimeModel.getTileAnimationTickCount();

            const objectId          = tile.getObjectViewId();
            this._imgObject.source  = objectId == null ? "" : ConfigManager.getTileObjectImageSource(objectId, tickCount);

            const baseId            = tile.getBaseViewId();
            this._imgBase.source    = baseId == null ? "" : ConfigManager.getTileBaseImageSource(baseId, tickCount);
        }
    }
}
