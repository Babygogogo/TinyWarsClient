
namespace TinyWars.User {
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;

    export class UserChangeNicknamePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private _labelName      : GameUi.UiLabel;
        private _labelNickname  : GameUi.UiLabel;
        private _labelNote      : GameUi.UiLabel;
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

            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/user/UserChangeNicknamePanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserSetNickname,          callback: this._onMsgUserSetNickname },
                { type: NotifyType.MsgUserSetNicknameFailed,    callback: this._onMsgUserSetNicknameFailed },
            ]);
            this._setUiListenerArray([
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);

            this._isRequesting          = false;
            this._inputNickname.text    = await UserModel.getSelfNickname();
            this._updateComponentsForLanguage();
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
                    UserProxy.reqSetNickname(nickname);
                }
            }
        }

        private _onMsgUserSetNickname(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0047));
            this.close();
        }
        private _onMsgUserSetNicknameFailed(e: egret.Event): void {
            this._isRequesting = false;
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelName.text        = Lang.getText(Lang.Type.B0149);
            this._labelNickname.text    = `${Lang.getText(Lang.Type.B0242)}:`;
            this._labelNote.text        = Lang.getText(Lang.Type.A0066);
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
        }
    }
}
