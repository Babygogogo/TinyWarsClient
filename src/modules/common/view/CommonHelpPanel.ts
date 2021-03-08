
namespace TinyWars.Common {
    type OpenDataForCommonHelpPanel = {
        title  : string;
        content: string;
    }

    export class CommonHelpPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonHelpPanel;

        private _labelTitle  : GameUi.UiLabel;
        private _labelContent: GameUi.UiLabel;

        public static show(openData: OpenDataForCommonHelpPanel): void {
            if (!CommonHelpPanel._instance) {
                CommonHelpPanel._instance = new CommonHelpPanel();
            }
            CommonHelpPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (CommonHelpPanel._instance) {
                await CommonHelpPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/common/CommonHelpPanel.exml";
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
        }

        protected _onOpened(): void {
            const openData = this._getOpenData<OpenDataForCommonHelpPanel>();
            this._labelTitle.text = openData.title;
            this._labelContent.setRichText(openData.content);
        }
    }
}
