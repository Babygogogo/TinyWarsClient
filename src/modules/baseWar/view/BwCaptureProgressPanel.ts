
// import SoundManager         from "../../tools/helpers/SoundManager";
// import Types                from "../../tools/helpers/Types";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";

namespace TwnsBwCaptureProgressPanel {
    type OpenDataForBwCaptureProgressPanel = {
        maxValue        : number;
        currentValue    : number;
        newValue        : number;
        callbackOnFinish: () => void;
    };
    export class BwCaptureProgressPanel extends TwnsUiPanel.UiPanel<OpenDataForBwCaptureProgressPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: BwCaptureProgressPanel;

        private readonly _group!        : eui.Group;
        private readonly _pbarProgress! : eui.ProgressBar;

        public static show(openData: OpenDataForBwCaptureProgressPanel): void {
            if (!BwCaptureProgressPanel._instance) {
                BwCaptureProgressPanel._instance = new BwCaptureProgressPanel();
            }
            BwCaptureProgressPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (BwCaptureProgressPanel._instance) {
                await BwCaptureProgressPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/baseWar/BwCaptureProgressPanel.exml";
        }

        protected _onOpened(): void {
            this._setCallbackOnTouchedMask(() => {
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
                this.close();
            });

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
        protected async _onClosed(): Promise<void> {
            egret.Tween.removeTweens(this._pbarProgress);
            this._getOpenData().callbackOnFinish();
        }
    }
}

// export default TwnsBwCaptureProgressPanel;
