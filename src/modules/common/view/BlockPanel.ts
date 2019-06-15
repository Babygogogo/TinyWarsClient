
namespace TinyWars.Common {
    import Lang = Utility.Lang;

    export type OpenDataForBlockPanel = {
        title  : string;
        content: string;
    }

    export class BlockPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: BlockPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelContent   : GameUi.UiLabel;

        private _openData: OpenDataForBlockPanel;

        public static show(data: OpenDataForBlockPanel): void {
            if (!BlockPanel._instance) {
                BlockPanel._instance = new BlockPanel();
            }
            BlockPanel._instance._openData = data;
            BlockPanel._instance.open();
        }

        public static hide(): void {
            if (BlockPanel._instance) {
                BlockPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/BlockPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
        }

        protected _onOpened(): void {
            this._labelTitle.text = this._openData.title;
            this._labelContent.setRichText(this._openData.content);
        }
    }
}
