
namespace TinyWars.MapEditor {
    import TimeModel    = Time.TimeModel;
    import CommonModel  = Common.CommonModel;

    const { width: GRID_WIDTH, height: GRID_HEIGHT } = Utility.ConfigManager.getGridSize();

    export class MeTileSimpleView {
        private _imgBase    = new GameUi.UiImage();
        private _imgObject  = new GameUi.UiImage();

        private _baseViewId     : number;
        private _objectViewId   : number;

        public constructor() {
            this._imgBase.anchorOffsetY     = GRID_HEIGHT;
            this._imgObject.anchorOffsetY   = GRID_HEIGHT * 2;
        }

        public init(tileBaseViewId: number, tileObjectViewId: number): MeTileSimpleView {
            this._baseViewId    = tileBaseViewId;
            this._objectViewId  = tileObjectViewId;

            return this;
        }

        public startRunningView(): void {
            this.updateView();
        }

        public updateView(): void {
            this._updateImages();
        }

        public setHasFog(hasFog: boolean): void {
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

        protected _updateImages(): void {
            const objectId = this._objectViewId;
            if (objectId == null) {
                this._imgObject.visible = false;
            } else {
                this._imgObject.visible = true;
                this._imgObject.source  = CommonModel.getTileObjectImageSource(objectId, false);
            }

            const baseId = this._baseViewId;
            if (baseId == null) {
                this._imgBase.visible = false;
            } else {
                this._imgBase.visible = true;
                this._imgBase.source  = CommonModel.getTileBaseImageSource(baseId, false);
            }
        }
    }
}
