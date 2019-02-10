
namespace TinyWars.Common {
    import Lang = Utility.Lang;

    export type OpenDataForAlertPanel = {
        title  : string;
        content: string;
    }

    export class AlertPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: AlertPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelContent   : GameUi.UiLabel;
        private _btnClose       : GameUi.UiButton;

        private _openData: OpenDataForAlertPanel;

        public static show(data: OpenDataForAlertPanel): void {
            if (!AlertPanel._instance) {
                AlertPanel._instance = new AlertPanel();
            }
            AlertPanel._instance._openData = data;
            AlertPanel._instance.open();
        }

        public static hide(): void {
            if (AlertPanel._instance) {
                AlertPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/common/AlertPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnClose, callback: this._onTouchedBtnClose },
            ];
        }

        protected _onOpened(): void {
            this._btnClose.label    = Lang.getText(Lang.BigType.B01, Lang.SubType.S26);
            this._labelTitle.text   = this._openData.title;
            this._labelContent.setRichText(this._openData.content);
        }

        private _onTouchedBtnClose(e: egret.TouchEvent): void {
            AlertPanel.hide();
        }
    }
}
