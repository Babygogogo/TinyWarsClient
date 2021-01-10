
namespace TinyWars.Common {
    export type OpenDataForCommonBlockPanel = {
        title  : string;
        content: string;
    }

    export class CommonBlockPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Notify1;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CommonBlockPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelContent   : GameUi.UiLabel;

        private _openData: OpenDataForCommonBlockPanel;

        public static show(data: OpenDataForCommonBlockPanel): void {
            if (!CommonBlockPanel._instance) {
                CommonBlockPanel._instance = new CommonBlockPanel();
            }
            CommonBlockPanel._instance._openData = data;
            CommonBlockPanel._instance.open();
        }

        public static hide(): void {
            if (CommonBlockPanel._instance) {
                CommonBlockPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonBlockPanel.exml";
            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
        }

        protected _onOpened(): void {
            this._labelTitle.text = this._openData.title;
            this._labelContent.setRichText(this._openData.content);
        }
    }
}
