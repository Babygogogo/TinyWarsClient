
namespace TinyWars.Common {
    import Lang = Utility.Lang;

    export type OpenDataForConfirmPanel = {
        title   : string;
        content : string;
        callback: () => any;
    }

    export class ConfirmPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ConfirmPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelContent   : GameUi.UiLabel;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _openData: OpenDataForConfirmPanel;

        public static show(data: OpenDataForConfirmPanel): void {
            if (!ConfirmPanel._instance) {
                ConfirmPanel._instance = new ConfirmPanel();
            }
            ConfirmPanel._instance._openData = data;
            ConfirmPanel._instance.open();
        }

        public static hide(): void {
            if (ConfirmPanel._instance) {
                ConfirmPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/ConfirmPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
            ];
        }

        protected _onOpened(): void {
            this._btnConfirm.label    = Lang.getText(Lang.BigType.B01, Lang.SubType.S26);
            this._labelTitle.text   = this._openData.title;
            this._labelContent.setRichText(this._openData.content);
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            ConfirmPanel.hide();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            ConfirmPanel.hide();
            (this._openData as OpenDataForConfirmPanel).callback();
        }
    }
}
