
namespace TinyWars.MapEditor {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import FloatText    = Utility.FloatText;

    export class MeOffsetPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeOffsetPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _inputOffsetX   : GameUi.UiTextInput;
        private _inputOffsetY   : GameUi.UiTextInput;
        private _labelTips      : GameUi.UiLabel;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _offsetX   : number;
        private _offsetY  : number;

        public static show(): void {
            if (!MeOffsetPanel._instance) {
                MeOffsetPanel._instance = new MeOffsetPanel();
            }
            MeOffsetPanel._instance.open();
        }

        public static hide(): void {
            if (MeOffsetPanel._instance) {
                MeOffsetPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this.skinName = "resource/skins/mapEditor/MeOffsetPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm, },
                { ui: this._inputOffsetX,   callback: this._onFocusOutInputOffsetX, eventType: egret.Event.FOCUS_OUT },
                { ui: this._inputOffsetY,   callback: this._onFocusOutInputOffsetY, eventType: egret.Event.FOCUS_OUT },
            ];
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            const war               = MeManager.getWar();
            this._inputOffsetY.text = "" + 0;
            this._inputOffsetX.text = "" + 0;
            this._offsetX           = 0;
            this._offsetY           = 0;
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const offsetX   = this._offsetX;
            const offsetY   = this._offsetY;
            const war       = MeManager.getWar();
            if ((offsetX !== 0) || (offsetY !== 0)) {
                war.stopRunning()
                    .init(MeUtility.addOffset(war.getField().serialize(), offsetX, offsetY), war.getSlotIndex(), war.getConfigVersion(), war.getIsReview())
                    .startRunning()
                    .startRunningView();
            }

            this.close();
            MeWarMenuPanel.hide();
        }

        private _onFocusOutInputOffsetX(e: egret.Event): void {
            const input = this._inputOffsetX;
            let offsetX = Number(input.text);
            if (isNaN(offsetX)) {
                offsetX = 0;
            }
            this._offsetX  = offsetX;
            input.text      = "" + offsetX;
        }

        private _onFocusOutInputOffsetY(e: egret.Event): void {
            const input = this._inputOffsetY;
            let offsetY = Number(input.text);
            if (isNaN(offsetY)) {
                offsetY = 0;
            }
            this._offsetY = offsetY;
            input.text      = "" + offsetY;
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text   = Lang.getText(Lang.Type.B0293);
            this._labelTips.text    = Lang.getText(Lang.Type.A0088);
        }
    }
}
