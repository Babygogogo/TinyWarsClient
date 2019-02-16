
namespace TinyWars.MultiCustomWar {
    export class McwUnitView extends egret.DisplayObjectContainer {
        private _imgHp      = new GameUi.UiImage();
        private _imgUnit    = new GameUi.UiImage();

        public constructor() {
            super();

            this._imgUnit.addEventListener(eui.UIEvent.RESIZE, () => this._imgUnit.anchorOffsetY = this._imgUnit.height, this);
            this.addChild(this._imgUnit);
            this.addChild(this._imgHp);
        }
    }
}
