
namespace Common {
    export type OpenDataForHelpPanel = {
        title  : string;
        content: string;
    }

    export class HelpPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: HelpPanel;

        private _labelTitle  : GameUi.UiLabel;
        private _labelContent: GameUi.UiLabel;

        private _openData: OpenDataForHelpPanel;

        public static open(data: OpenDataForHelpPanel): void {
            if (!HelpPanel._instance) {
                HelpPanel._instance = new HelpPanel();
            }
            HelpPanel._instance._openData = data;
            HelpPanel._instance.open();
        }

        public static close(): void {
            if (HelpPanel._instance) {
                HelpPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/HelpPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => HelpPanel.close();
        }

        protected _onOpened(): void {
            this._labelTitle.text   = this._openData.title;
            this._labelContent.text = this._openData.content;
        }
    }
}
