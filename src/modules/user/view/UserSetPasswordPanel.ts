
namespace TinyWars.User {
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;
    import LocalStorage = Utility.LocalStorage;

    export class UserSetPasswordPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private _labelTitle             : GameUi.UiLabel;
        private _labelOldPasswordTitle  : GameUi.UiLabel;
        private _inputOldPassword       : GameUi.UiTextInput;
        private _labelNewPasswordTitle0 : GameUi.UiLabel;
        private _inputNewPassword0      : GameUi.UiTextInput;
        private _labelNewPasswordTitle1 : GameUi.UiLabel;
        private _inputNewPassword1      : GameUi.UiTextInput;
        private _btnConfirm             : GameUi.UiButton;
        private _btnCancel              : GameUi.UiButton;

        private static _instance: UserSetPasswordPanel;

        public static show(): void {
            if (!UserSetPasswordPanel._instance) {
                UserSetPasswordPanel._instance = new UserSetPasswordPanel();
            }
            UserSetPasswordPanel._instance.open();
        }

        public static hide(): void {
            if (UserSetPasswordPanel._instance) {
                UserSetPasswordPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask  = () => this.close();
            this.skinName               = "resource/skins/user/UserSetPasswordPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserSetPassword,  callback: this._onMsgUserSetPassword },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
        }

        protected _onOpened(): void {
            this._updateOnLanguageChanged();
        }

        private _onMsgUserSetPassword(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0148));

            const password = this._inputNewPassword0.text;
            LocalStorage.setPassword(password);
            User.UserModel.setSelfPassword(password);
            this.close();
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateOnLanguageChanged();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const newPassword = this._inputNewPassword0.text;
            if (!Utility.Helpers.checkIsPasswordValid(newPassword)) {
                FloatText.show(Lang.getText(Lang.Type.A0003));
            } else if (newPassword !== this._inputNewPassword1.text) {
                FloatText.show(Lang.getText(Lang.Type.A0147));
            } else {
                User.UserProxy.reqUserSetPassword(this._inputOldPassword.text, newPassword);
            }
        }

        private _updateOnLanguageChanged(): void {
            this._labelTitle.text               = Lang.getText(Lang.Type.B0426);
            this._labelOldPasswordTitle.text    = Lang.getText(Lang.Type.B0427);
            this._labelNewPasswordTitle0.text   = Lang.getText(Lang.Type.B0428);
            this._labelNewPasswordTitle1.text   = Lang.getText(Lang.Type.B0429);
            this._btnConfirm.label              = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label               = Lang.getText(Lang.Type.B0154);
        }
    }
}
