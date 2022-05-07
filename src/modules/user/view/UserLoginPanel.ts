
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import LocalStorage             from "../../tools/helpers/LocalStorage";
// import NoSleepManager           from "../../tools/helpers/NoSleepManager";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
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
    import NotifyType       = Twns.Notify.NotifyType;
    import LangTextType     = Twns.Lang.LangTextType;

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
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserLogin,    callback: this._onMsgUserLogin },
            ]);
            this._setUiListenerArray([
                { ui: this,                         callback: this._onTouchedSelf },
                { ui: this._btnLogin,               callback: this._onTouchedBtnLogin },
                { ui: this._btnRegister,            callback: this._onTouchedBtnRegister },
                { ui: this._btnForgetPassword,      callback: this._onTouchedBtnForgetPassword },
                { ui: this._groupRememberPassword,  callback: this._onTouchedGroupRememberPassword },
            ]);

            const isRememberPassword                = Twns.LocalStorage.getIsRememberPassword();
            this._inputAccount.text                 = Twns.LocalStorage.getAccount();
            this._inputPassword.text                = isRememberPassword ? Twns.LocalStorage.getPassword() : ``;
            this._btnLogin.enabled                  = true;
            this._imgRememberPasswordCheck.visible  = isRememberPassword;
            this._btnLogin.setShortSfxCode(Twns.Types.ShortSfxCode.ButtonConfirm01);
            this._updateComponentsForLanguage();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onMsgUserLogin(): void {
            Twns.FloatText.show(Lang.getText(LangTextType.A0000));
            this._btnLogin.enabled = false;
        }
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedSelf(): void {
            Twns.SoundManager.init();
        }

        private _onTouchedBtnLogin(): void {
            Twns.NoSleepManager.enable();

            const account  = this._inputAccount.text;
            const password = this._inputPassword.text;
            if (!Twns.Helpers.checkIsAccountValid(account)) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0001));
            } else {
                if (!Twns.Helpers.checkIsPasswordValid(password)) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0003));
                } else {
                    Twns.LocalStorage.setAccount(account);
                    Twns.LocalStorage.setPassword(password);
                    Twns.User.UserModel.setSelfAccount(account);
                    Twns.User.UserModel.setSelfPassword(password);
                    Twns.User.UserProxy.reqLogin(account, password, false);
                }
            }
        }

        private _onTouchedBtnRegister(): void {
            Twns.NoSleepManager.enable();

            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.UserRegisterPanel, void 0);
        }

        private _onTouchedBtnForgetPassword(): void {
            Twns.FloatText.show(Lang.getText(LangTextType.A0115));
        }

        private _onTouchedGroupRememberPassword(): void {
            const isRemember = Twns.LocalStorage.getIsRememberPassword();
            Twns.LocalStorage.setIsRememberPassword(!isRemember);
            Twns.SoundManager.playShortSfx(isRemember ? Twns.Types.ShortSfxCode.ButtonCancel01 : Twns.Types.ShortSfxCode.ButtonConfirm01);
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
            Twns.Helpers.resetTween({
                obj         : this._imgTitle,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
                tweenTime   : 1000,
            });
            Twns.Helpers.resetTween({
                obj         : this._groupAccount,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 800,
            });
            Twns.Helpers.resetTween({
                obj         : this._groupPassword,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 900,
            });
            Twns.Helpers.resetTween({
                obj         : this._groupPasswordCommand,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 1000,
            });
            Twns.Helpers.resetTween({
                obj         : this._groupButton,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 0 },
                waitTime    : 1100,
            });

            await Twns.Helpers.wait(1100 + Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgTitle,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupAccount,
                beginProps  : { alpha: 1, y: 0 },
                endProps    : { alpha: 0, y: 40 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupPassword,
                beginProps  : { alpha: 1, y: 0 },
                endProps    : { alpha: 0, y: 40 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupPasswordCommand,
                beginProps  : { alpha: 1, y: 0 },
                endProps    : { alpha: 0, y: 40 },
            });
            Twns.Helpers.resetTween({
                obj         : this._groupButton,
                beginProps  : { alpha: 1, y: 0 },
                endProps    : { alpha: 0, y: 40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsUserLoginPanel;
