
// import TwnsUiLabel      from "./UiLabel";
// import TwnsUiImage      from "./UiImage";
// import Helpers          from "../helpers/Helpers";
// import Types            from "../helpers/Types";
// import SoundManager     from "../helpers/SoundManager";

namespace TwnsUiButton {
    import ShortSfxCode = Types.ShortSfxCode;

    export class UiButton extends eui.Button {
        private readonly _imgExtra!     : eui.Image;
        private readonly _imgDisplay!   : TwnsUiImage.UiImage;
        private readonly _imgRed!       : eui.Image;

        private _shortSfxCode   = ShortSfxCode.ButtonNeutral01;

        public constructor() {
            super();

            this.addEventListener(egret.Event.COMPLETE, this._onCompleted, this);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onTouchBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_END, this._onTouchEnd, this);
            this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onTouchReleaseOutside, this);
        }

        public checkRedVisible(): boolean {
            return this._imgRed ? this._imgRed.visible : false;
        }
        public setRedVisible(visible: boolean): void {
            if (this._imgRed) {
                this._imgRed.visible = visible;
            }
        }

        public getImgExtraVisible(): boolean {
            return this._imgExtra ? this._imgExtra.visible : false;
        }
        public setImgExtraVisible(visible: boolean): void {
            if (this._imgExtra) {
                this._imgExtra.visible = visible;
            }
        }
        public setImgExtraSource(source: string): void {
            if (this._imgExtra) {
                this._imgExtra.source = source;
            }
        }

        public setImgDisplaySource(source: string): void {
            const img = this._imgDisplay;
            (img) && (img.source = source);
        }

        public setTextColor(color: number): void {
            const label = this.labelDisplay;
            if (label instanceof TwnsUiLabel.UiLabel) {
                label.textColor = color;
            }
        }

        public setShortSfxCode(code: ShortSfxCode): void {
            this._shortSfxCode = code;
        }
        public getShortSfxCode(): ShortSfxCode {
            return this._shortSfxCode;
        }

        private _onCompleted(): void {
            this.removeEventListener(egret.Event.COMPLETE, this._onCompleted, this);

            this.setRedVisible(false);
            this.setImgExtraVisible(false);
        }
        private _onTouchBegin(): void {
            Helpers.changeColor(this, Types.ColorType.White, 50);
        }
        private _onTouchEnd(): void {
            SoundManager.playShortSfx(this.getShortSfxCode());
            Helpers.changeColor(this, Types.ColorType.Origin);
        }
        private _onTouchReleaseOutside(): void {
            Helpers.changeColor(this, Types.ColorType.Origin);
        }
    }
}

// export default TwnsUiButton;
