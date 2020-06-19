
namespace TinyWars.Common {
    export type OpenDataForCommonHelpPanel = {
        title  : string;
        content: string;
    }

    export class CommonHelpPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonHelpPanel;

        private _labelTitle  : GameUi.UiLabel;
        private _labelContent: GameUi.UiLabel;

        private _openData: OpenDataForCommonHelpPanel;

        public static show(data: OpenDataForCommonHelpPanel): void {
            if (!CommonHelpPanel._instance) {
                CommonHelpPanel._instance = new CommonHelpPanel();
            }
            CommonHelpPanel._instance._openData = data;
            CommonHelpPanel._instance.open();
        }

        public static hide(): void {
            if (CommonHelpPanel._instance) {
                CommonHelpPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/common/CommonHelpPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => CommonHelpPanel.hide();
        }

        protected _onOpened(): void {
            this._labelTitle.text = this._openData.title;
            this._labelContent.setRichText(this._openData.content);
        }
    }
}
