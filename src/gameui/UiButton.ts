
import { UiLabel }          from "./UiLabel";
import { UiImage }          from "./UiImage";
import * as Helpers         from "../utility/Helpers";
import * as Types           from "../utility/Types";
import * as SoundManager    from "../utility/SoundManager";

export class UiButton extends eui.Button {
    private _imgExtra       : eui.Image;
    private _imgDisplay     : UiImage;
    private _imgRed         : eui.Image;

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
        if (label instanceof UiLabel) {
            label.textColor = color;
        }
    }

    private _onCompleted(): void {
        this.removeEventListener(egret.Event.COMPLETE, this._onCompleted, this);

        this.setRedVisible(false);
        this.setImgExtraVisible(false);
    }
    private _onTouchBegin(): void {
        Helpers.changeColor(this, Types.ColorType.White, 50);
        SoundManager.playEffect("button.mp3");
    }
    private _onTouchEnd(): void {
        Helpers.changeColor(this, Types.ColorType.Origin);
    }
    private _onTouchReleaseOutside(): void {
        Helpers.changeColor(this, Types.ColorType.Origin);
    }
}
