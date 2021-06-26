
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.User {
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;
    import Helpers      = Utility.Helpers;
    import LocalStorage = Utility.LocalStorage;

    export class UserSetPasswordPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        // @ts-ignore
        private readonly _imgMask                   : GameUi.UiImage;
        // @ts-ignore
        private readonly _group                     : eui.Group;
        // @ts-ignore
        private readonly _labelTitle                : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelOldPasswordTitle     : GameUi.UiLabel;
        // @ts-ignore
        private readonly _inputOldPassword          : GameUi.UiTextInput;
        // @ts-ignore
        private readonly _labelNewPasswordTitle0    : GameUi.UiLabel;
        // @ts-ignore
        private readonly _inputNewPassword0         : GameUi.UiTextInput;
        // @ts-ignore
        private readonly _labelNewPasswordTitle1    : GameUi.UiLabel;
        // @ts-ignore
        private readonly _inputNewPassword1         : GameUi.UiTextInput;
        // @ts-ignore
        private readonly _btnConfirm                : GameUi.UiButton;
        // @ts-ignore
        private readonly _btnCancel                 : GameUi.UiButton;

        private static _instance: UserSetPasswordPanel;

        public static show(): void {
            if (!UserSetPasswordPanel._instance) {
                UserSetPasswordPanel._instance = new UserSetPasswordPanel();
            }
            UserSetPasswordPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (UserSetPasswordPanel._instance) {
                await UserSetPasswordPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/user/UserSetPasswordPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserSetPassword,  callback: this._onMsgUserSetPassword },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);

            this._showOpenAnimation();
            this._updateOnLanguageChanged();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onMsgUserSetPassword(): void {
            FloatText.show(Lang.getText(Lang.Type.A0148));

            const password = this._inputNewPassword0.text;
            LocalStorage.setPassword(password);
            User.UserModel.setSelfPassword(password);
            this.close();
        }
        private _onNotifyLanguageChanged(): void {
            this._updateOnLanguageChanged();
        }

        private _onTouchedBtnConfirm(): void {
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

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve) => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                    callback    : resolve,
                });
            });
        }
    }
}
