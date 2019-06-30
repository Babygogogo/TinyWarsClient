
namespace TinyWars.User {
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;

    export class UserChangeNicknamePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private _inputNickname  : GameUi.UiTextInput;
        private _btnConfirm     : GameUi.UiButton;

        private _isRequesting   = false;

        private static _instance: UserChangeNicknamePanel;

        public static show(): void {
            if (!UserChangeNicknamePanel._instance) {
                UserChangeNicknamePanel._instance = new UserChangeNicknamePanel();
            }
            UserChangeNicknamePanel._instance.open();
        }

        public static hide(): void {
            if (UserChangeNicknamePanel._instance) {
                UserChangeNicknamePanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/user/UserChangeNicknamePanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: NotifyType.SUserChangeNickname,         callback: this._onSUserChangeNickname },
                { type: NotifyType.SUserChangeNicknameFailed,   callback: this._onSUserChangeNicknameFailed },
            ];
            this._uiListeners = [
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ];
        }
        protected _onOpened(): void {
            this._isRequesting          = false;
            this._inputNickname.text    = UserModel.getSelfNickname();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            if (this._isRequesting) {
                FloatText.show(Lang.getText(Lang.Type.A0046));
            } else {
                const nickname = this._inputNickname.text;
                if (!Utility.Helpers.checkIsNicknameValid(nickname)) {
                    FloatText.show(Lang.getText(Lang.Type.A0002));
                } else {
                    this._isRequesting = true;
                    UserProxy.reqChangeNickname(nickname);
                }
            }
        }

        private _onSUserChangeNickname(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0047));
            this.close();
        }
        private _onSUserChangeNicknameFailed(e: egret.Event): void {
            this._isRequesting = false;
        }
    }
}
