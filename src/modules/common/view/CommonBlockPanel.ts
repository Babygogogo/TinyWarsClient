
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import Types                        from "../../tools/helpers/Types";

namespace TwnsCommonBlockPanel {
    type OpenDataForCommonBlockPanel = {
        title  : string;
        content: string;
    };
    export class CommonBlockPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonBlockPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonBlockPanel;

        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelContent! : TwnsUiLabel.UiLabel;

        public static show(openData: OpenDataForCommonBlockPanel): void {
            if (!CommonBlockPanel._instance) {
                CommonBlockPanel._instance = new CommonBlockPanel();
            }
            CommonBlockPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (CommonBlockPanel._instance) {
                await CommonBlockPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonBlockPanel.exml";
            this._setIsTouchMaskEnabled();
        }

        protected _onOpened(): void {
            const openData          = this._getOpenData();
            this._labelTitle.text   = openData.title;
            this._labelContent.setRichText(openData.content);
        }
    }
}

export default TwnsCommonBlockPanel;
