
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsUiButton         from "../../tools/ui/UiButton";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";

namespace TwnsCommonErrorPanel {
    import LangTextType         = TwnsLangTextType.LangTextType;

    type OpenData = {
        content     : string;
        callback?   : () => any;
    };
    export class CommonErrorPanel extends TwnsUiPanel.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Top;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonErrorPanel;

        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelContent! : TwnsUiLabel.UiLabel;
        private readonly _btnClose!     : TwnsUiButton.UiButton;

        public static show(openData: OpenData): void {
            if (!CommonErrorPanel._instance) {
                CommonErrorPanel._instance = new CommonErrorPanel();
            }
            CommonErrorPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (CommonErrorPanel._instance) {
                await CommonErrorPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonErrorPanel.exml";
            this._setIsTouchMaskEnabled();
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnClose, callback: this._onTouchedBtnClose },
            ]);

            this._btnClose.label    = Lang.getText(LangTextType.B0026);
            this._labelTitle.text   = Lang.getText(LangTextType.A0056);
            this._labelContent.setRichText(this._getOpenData().content);
        }

        private _onTouchedBtnClose(): void {
            const openData = this._getOpenData();
            (openData.callback) && (openData.callback());

            this.close();
        }
    }
}

export default TwnsCommonErrorPanel;
