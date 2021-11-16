
// import SoundManager         from "../../tools/helpers/SoundManager";
// import Types                from "../../tools/helpers/Types";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBwCaptureProgressPanel {
    export type OpenData = {
        maxValue        : number;
        currentValue    : number;
        newValue        : number;
        callbackOnFinish: () => void;
    };
    export class BwCaptureProgressPanel extends TwnsUiPanel2.UiPanel2<OpenData> {
        private readonly _group!        : eui.Group;
        private readonly _pbarProgress! : eui.ProgressBar;

        protected _onOpening(): void {
            this._setIsTouchMaskEnabled();
            this._setCallbackOnTouchedMask(() => {
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
                egret.Tween.removeTweens(this._pbarProgress);
                this.close();
            });
        }
        protected async _updateOnOpenDataChanged(oldOpenData: OpenData | null): Promise<void> {
            if (oldOpenData) {
                oldOpenData.callbackOnFinish();
            }

            const openData  = this._getOpenData();
            const pbar      = this._pbarProgress;
            pbar.maximum    = openData.maxValue;
            pbar.value      = openData.currentValue;

            egret.Tween.removeTweens(pbar);
            egret.Tween.get(pbar)
                .wait(250)
                .to({ value: openData.newValue }, 250)
                .wait(500)
                .call(() => this.close());
        }
        protected _onClosing(): void {
            egret.Tween.removeTweens(this._pbarProgress);
            this._getOpenData().callbackOnFinish();
        }
    }
}

// export default TwnsBwCaptureProgressPanel;
