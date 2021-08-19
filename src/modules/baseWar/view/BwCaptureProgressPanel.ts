
import Helpers          from "../../tools/helpers/Helpers";
import Types            from "../../tools/helpers/Types";
import TwnsUiPanel      from "../../tools/ui/UiPanel";

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

        private readonly _group         : eui.Group;
        private readonly _pbarProgress  : eui.ProgressBar;

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
            const openData  = this._getOpenData();
            const pbar      = this._pbarProgress;
            pbar.maximum    = openData.maxValue;
            pbar.value      = openData.currentValue;

            Helpers.resetTween({
                obj         : pbar,
                beginProps  : {},
                endProps    : { value: openData.newValue },
                waitTime    : 500,
                tweenTime   : 250,
                callback    : () => {
                    egret.setTimeout(() => this.close(), this, 500);
                },
            });
        }
        protected async _onClosed(): Promise<void> {
            this._getOpenData().callbackOnFinish();
        }
    }
}

export default TwnsBwCaptureProgressPanel;
