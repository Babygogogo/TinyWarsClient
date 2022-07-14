
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import LocalStorage             from "../../tools/helpers/LocalStorage";
// import NoSleepManager           from "../../tools/helpers/NoSleepManager";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiTextInput          from "../../tools/ui/UiTextInput";
// import UserModel                from "../model/UserModel";
// import UserProxy                from "../model/UserProxy";
// import TwnsUserRegisterPanel    from "./UserRegisterPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User {
    import NotifyType       = Notify.NotifyType;
    import LangTextType     = Lang.LangTextType;

    export type OpenDataForUserLoginPanel = void;
    export class UserLoginPanel extends TwnsUiPanel.UiPanel<OpenDataForUserLoginPanel> {
        private readonly _imgTitle!                 : TwnsUiImage.UiImage;

        private readonly _groupAccount!             : eui.Group;
        private readonly _labelAccount!             : TwnsUiLabel.UiLabel;
        private readonly _inputAccount!             : TwnsUiTextInput.UiTextInput;

        private readonly _groupPassword!            : eui.Group;
        private readonly _labelPassword!            : TwnsUiLabel.UiLabel;
        private readonly _inputPassword!            : TwnsUiTextInput.UiTextInput;

        private readonly _groupPasswordCommand!     : eui.Group;
        private readonly _groupRememberPassword!    : eui.Group;
        private readonly _labelRememberPassword!    : TwnsUiLabel.UiLabel;
        private readonly _imgRememberPasswordCheck! : TwnsUiImage.UiImage;
        private readonly _btnForgetPassword!        : TwnsUiButton.UiButton;

        private readonly _groupButton!              : eui.Group;
        private readonly _btnRegister!              : TwnsUiButton.UiButton;
        private readonly _btnLogin!                 : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserLogin,        callback: this._onMsgUserLogin },
                { type: NotifyType.MsgUserLoginAsGuest, callback: this._onMsgUserLoginAsGuest },
            ]);
            this._setUiListenerArray([
                { ui: this,                         callback: this._onTouchedSelf },
                { ui: this._btnLogin,               callback: this._onTouchedBtnLogin },
                { ui: this._btnRegister,            callback: this._onTouchedBtnRegister },
                { ui: this._btnForgetPassword,      callback: this._onTouchedBtnForgetPassword },
                { ui: this._groupRememberPassword,  callback: this._onTouchedGroupRememberPassword },
            ]);

            const isRememberPassword                = LocalStorage.getIsRememberPassword();
            this._inputAccount.text                 = LocalStorage.getAccount();
            this._inputPassword.text                = isRememberPassword ? LocalStorage.getPassword() : ``;
            this._btnLogin.enabled                  = true;
            this._imgRememberPasswordCheck.visible  = isRememberPassword;
            this._btnLogin.setShortSfxCode(Types.ShortSfxCode.ButtonConfirm01);
            this._updateComponentsForLanguage();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onMsgUserLogin(): void {
            FloatText.show(Lang.getText(LangTextType.A0000));
            this._btnLogin.enabled = false;
        }
        private _onMsgUserLoginAsGuest(): void {
            this._onMsgUserLogin();
        }
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedSelf(): void {
            SoundManager.init();
        }

        private _onTouchedBtnLogin(): void {
            NoSleepManager.enable();

            const account  = this._inputAccount.text;
            const password = this._inputPassword.text;
            if (!Helpers.checkIsAccountValid(account)) {
                FloatText.show(Lang.getText(LangTextType.A0001));
            } else {
                if (!Helpers.checkIsPasswordValid(password)) {
                    FloatText.show(Lang.getText(LangTextType.A0003));
                } else {
                    LocalStorage.setAccount(account);
                    LocalStorage.setPassword(password);
                    User.UserModel.setSelfAccount(account);
                    User.UserModel.setSelfPassword(password);
                    User.UserProxy.reqLogin(account, password, false);
                }
            }
        }

        private _onTouchedBtnRegister(): void {
            NoSleepManager.enable();

            PanelHelpers.open(PanelHelpers.PanelDict.UserRegisterPanel, void 0);
        }

        private _onTouchedBtnForgetPassword(): void {
            FloatText.show(Lang.getText(LangTextType.A0115));
        }

        private _onTouchedGroupRememberPassword(): void {
            const isRemember = LocalStorage.getIsRememberPassword();
            LocalStorage.setIsRememberPassword(!isRemember);
            SoundManager.playShortSfx(isRemember ? Types.ShortSfxCode.ButtonCancel01 : Types.ShortSfxCode.ButtonConfirm01);
            this._imgRememberPasswordCheck.visible = !isRemember;
        }

        private _updateComponentsForLanguage(): void {
            this._btnLogin.label                = Lang.getText(LangTextType.B0173);
            this._btnRegister.label             = `${Lang.getText(LangTextType.B0174)}*`;
            this._btnForgetPassword.label       = Lang.getText(LangTextType.B0626);
            this._labelRememberPassword.text    = Lang.getText(LangTextType.B0172);
            this._labelAccount.text             = `${Lang.getText(LangTextType.B0170)}:`;
            this._labelPassword.text            = `${Lang.getText(LangTextType.B0171)}:`;
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgTitle,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
                tweenTime   : 1000,
            });
            Helpers.resetTween({
                obj         : this._groupAccount,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 800,
            });
            Helpers.resetTween({
                obj         : this._groupPassword,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 900,
            });
            Helpers.resetTween({
                obj         : this._groupPasswordCommand,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 1000,
            });
            Helpers.resetTween({
                obj         : this._groupButton,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 1100,
            });

            await Helpers.wait(1100 + CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgTitle,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupAccount,
                beginProps  : { alpha: 1, y: 0 },
                endProps    : { alpha: 0, y: 40 },
            });
            Helpers.resetTween({
                obj         : this._groupPassword,
                beginProps  : { alpha: 1, y: 0 },
                endProps    : { alpha: 0, y: 40 },
            });
            Helpers.resetTween({
                obj         : this._groupPasswordCommand,
                beginProps  : { alpha: 1, y: 0 },
                endProps    : { alpha: 0, y: 40 },
            });
            Helpers.resetTween({
                obj         : this._groupButton,
                beginProps  : { alpha: 1, y: 0 },
                endProps    : { alpha: 0, y: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsUserLoginPanel;
