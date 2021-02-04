
namespace TinyWars.Common {
    type OpenDataForCommonBlockPanel = {
        title  : string;
        content: string;
    }

    export class CommonBlockPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonBlockPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelContent   : GameUi.UiLabel;

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
            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
        }

        protected _onOpened(): void {
            const openData          = this._getOpenData<OpenDataForCommonBlockPanel>();
            this._labelTitle.text   = openData.title;
            this._labelContent.setRichText(openData.content);
        }
    }
}
