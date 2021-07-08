
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.Login {
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;
    import Logger       = Utility.Logger;
    import LocalStorage = Utility.LocalStorage;
    import Helpers      = Utility.Helpers;

    export class RegisterPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        // @ts-ignore
        private _imgMask            : GameUi.UiImage;
        // @ts-ignore
        private _group              : eui.Group;
        // @ts-ignore
        private _labelTitle         : GameUi.UiLabel;
        // @ts-ignore
        private _labelAccount       : GameUi.UiLabel;
        // @ts-ignore
        private _inputAccount       : GameUi.UiTextInput;
        // @ts-ignore
        private _labelPassword      : GameUi.UiLabel;
        // @ts-ignore
        private _inputPassword      : GameUi.UiTextInput;
        // @ts-ignore
        private _labelNickname      : GameUi.UiLabel;
        // @ts-ignore
        private _inputNickname      : GameUi.UiTextInput;
        // @ts-ignore
        private _btnRegister        : GameUi.UiButton;
        // @ts-ignore
        private _btnClose           : GameUi.UiButton;
        // @ts-ignore
        private _labelTips          : GameUi.UiLabel;

        private static _instance: RegisterPanel;

        public static show(): void {
            if (!RegisterPanel._instance) {
                RegisterPanel._instance = new RegisterPanel();
            }
            RegisterPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (RegisterPanel._instance) {
                await RegisterPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/login/RegisterPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserRegister, callback: this._onMsgUserRegister },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,    callback: this.close },
                { ui: this._btnRegister, callback: this._onTouchedBtnRegister },
            ]);

            this._showOpenAnimation();
            this._updateComponentsForLanguage();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onMsgUserRegister(e: egret.Event): void {
            const data = e.data as Utility.ProtoTypes.NetMessage.MsgUserRegister.IS;
            FloatText.show(Lang.getText(Lang.Type.A0004));

            const account = data.account;
            if (account == null) {
                Logger.error(`RegisterPanel._onMsgUserRegister() empty account!`);
                return;
            }

            const password  = this._inputPassword.text;
            LocalStorage.setAccount(account);
            LocalStorage.setPassword(password);
            User.UserModel.setSelfAccount(account);
            User.UserModel.setSelfPassword(password);
            User.UserProxy.reqLogin(account, password, false);
        }
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnRegister(): void {
            const account  = this._inputAccount.text;
            const password = this._inputPassword.text;
            const nickname = this._inputNickname.text;
            if (!Utility.Helpers.checkIsAccountValid(account)) {
                FloatText.show(Lang.getText(Lang.Type.A0001));
            } else if (!Utility.Helpers.checkIsPasswordValid(password)) {
                FloatText.show(Lang.getText(Lang.Type.A0003));
            } else if (!Utility.Helpers.checkIsNicknameValid(nickname)) {
                FloatText.show(Lang.getText(Lang.Type.A0002));
            } else {
                User.UserProxy.reqUserRegister(account, password, nickname);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._btnRegister.label     = Lang.getText(Lang.Type.B0174);
            this._btnClose.label        = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text       = Lang.getText(Lang.Type.B0174);
            this._labelAccount.text     = `${Lang.getText(Lang.Type.B0170)}:`;
            this._labelPassword.text    = `${Lang.getText(Lang.Type.B0171)}:`;
            this._labelNickname.text    = `${Lang.getText(Lang.Type.B0175)}:`;
            this._labelTips.setRichText(Lang.getText(Lang.Type.R0005));
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
            return new Promise<void>(resolve => {
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
