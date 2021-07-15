
import TwnsUiImage                      from "../../tools/ui/UiImage";
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiTextInput                  from "../../tools/ui/UiTextInput";
import TwnsUserRegisterPanel                from "./UserRegisterPanel";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import LocalStorage                 from "../../tools/helpers/LocalStorage";
import NoSleepManager               from "../../tools/helpers/NoSleepManager";
import UserModel                    from "../model/UserModel";
import UserProxy                    from "../model/UserProxy";
import FloatText                    from "../../tools/helpers/FloatText";
import Helpers                      from "../../tools/helpers/Helpers";
import SoundManager                 from "../../tools/helpers/SoundManager";

namespace TwnsUserLoginPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;

    export class UserLoginPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        // @ts-ignore
        private _imgTitle                   : TwnsUiImage.UiImage;

        // @ts-ignore
        private _groupAccount               : eui.Group;
        // @ts-ignore
        private _labelAccount               : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private _inputAccount               : TwnsUiTextInput.UiTextInput;

        // @ts-ignore
        private _groupPassword              : eui.Group;
        // @ts-ignore
        private _labelPassword              : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private _inputPassword              : TwnsUiTextInput.UiTextInput;

        // @ts-ignore
        private _groupPasswordCommand       : eui.Group;
        // @ts-ignore
        private _groupRememberPassword      : eui.Group;
        // @ts-ignore
        private _labelRememberPassword      : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private _imgRememberPasswordCheck   : TwnsUiImage.UiImage;
        // @ts-ignore
        private _btnForgetPassword          : TwnsUiButton.UiButton;

        // @ts-ignore
        private _groupButton                : eui.Group;
        // @ts-ignore
        private _btnRegister                : TwnsUiButton.UiButton;
        // @ts-ignore
        private _btnLogin                   : TwnsUiButton.UiButton;

        private static _instance: UserLoginPanel;

        public static show(): void {
            if (!UserLoginPanel._instance) {
                UserLoginPanel._instance = new UserLoginPanel();
            }
            UserLoginPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (UserLoginPanel._instance) {
                await UserLoginPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/user/UserLoginPanel.exml";
        }

        protected _onOpened(): void {
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

            this._showOpenAnimation();

            const isRememberPassword                = LocalStorage.getIsRememberPassword();
            this._inputAccount.text                 = LocalStorage.getAccount();
            this._inputPassword.text                = isRememberPassword ? LocalStorage.getPassword() : ``;
            this._btnLogin.enabled                  = true;
            this._imgRememberPasswordCheck.visible  = isRememberPassword;
            this._updateComponentsForLanguage();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onMsgUserLogin(): void {
            FloatText.show(Lang.getText(LangTextType.A0000));
            this._btnLogin.enabled = false;
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
                    UserModel.setSelfAccount(account);
                    UserModel.setSelfPassword(password);
                    UserProxy.reqLogin(account, password, false);
                }
            }
        }

        private _onTouchedBtnRegister(): void {
            NoSleepManager.enable();

            TwnsUserRegisterPanel.UserRegisterPanel.show();
        }

        private _onTouchedBtnForgetPassword(): void {
            FloatText.show(Lang.getText(LangTextType.A0115));
        }

        private _onTouchedGroupRememberPassword(): void {
            const isRemember = LocalStorage.getIsRememberPassword();
            LocalStorage.setIsRememberPassword(!isRemember);
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

        private _showOpenAnimation(): void {
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
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgTitle,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    callback    : resolve,
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
            });
        }
    }
}

export default TwnsUserLoginPanel;