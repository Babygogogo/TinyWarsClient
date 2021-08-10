
import TwnsUiImage                  from "../../tools/ui/UiImage";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
import FloatText                    from "../../tools/helpers/FloatText";
import Helpers                      from "../../tools/helpers/Helpers";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import LocalStorage                 from "../../tools/helpers/LocalStorage";
import Logger                       from "../../tools/helpers/Logger";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import Types                        from "../../tools/helpers/Types";
import UserModel                    from "../model/UserModel";
import UserProxy                    from "../model/UserProxy";

namespace TwnsUserRegisterPanel {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export class UserRegisterPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private _imgMask            : TwnsUiImage.UiImage;
        private _group              : eui.Group;
        private _labelTitle         : TwnsUiLabel.UiLabel;
        private _labelAccount       : TwnsUiLabel.UiLabel;
        private _inputAccount       : TwnsUiTextInput.UiTextInput;
        private _labelPassword      : TwnsUiLabel.UiLabel;
        private _inputPassword      : TwnsUiTextInput.UiTextInput;
        private _labelNickname      : TwnsUiLabel.UiLabel;
        private _inputNickname      : TwnsUiTextInput.UiTextInput;
        private _btnRegister        : TwnsUiButton.UiButton;
        private _btnClose           : TwnsUiButton.UiButton;
        private _labelTips          : TwnsUiLabel.UiLabel;

        private static _instance: UserRegisterPanel;

        public static show(): void {
            if (!UserRegisterPanel._instance) {
                UserRegisterPanel._instance = new UserRegisterPanel();
            }
            UserRegisterPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (UserRegisterPanel._instance) {
                await UserRegisterPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/user/UserRegisterPanel.exml";
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

            this._btnClose.setShortSfxCode(Types.ShortSfxCode.ButtonCancel01);
            this._btnRegister.setShortSfxCode(Types.ShortSfxCode.ButtonConfirm01);

            this._showOpenAnimation();
            this._updateComponentsForLanguage();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onMsgUserRegister(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgUserRegister.IS;
            FloatText.show(Lang.getText(LangTextType.A0004));

            const account = data.account;
            if (account == null) {
                Logger.error(`RegisterPanel._onMsgUserRegister() empty account!`);
                return;
            }

            const password  = this._inputPassword.text;
            LocalStorage.setAccount(account);
            LocalStorage.setPassword(password);
            UserModel.setSelfAccount(account);
            UserModel.setSelfPassword(password);
            UserProxy.reqLogin(account, password, false);
        }
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnRegister(): void {
            const account  = this._inputAccount.text;
            const password = this._inputPassword.text;
            const nickname = this._inputNickname.text;
            if (!Helpers.checkIsAccountValid(account)) {
                FloatText.show(Lang.getText(LangTextType.A0001));
            } else if (!Helpers.checkIsPasswordValid(password)) {
                FloatText.show(Lang.getText(LangTextType.A0003));
            } else if (!Helpers.checkIsNicknameValid(nickname)) {
                FloatText.show(Lang.getText(LangTextType.A0002));
            } else {
                UserProxy.reqUserRegister(account, password, nickname);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._btnRegister.label     = Lang.getText(LangTextType.B0174);
            this._btnClose.label        = Lang.getText(LangTextType.B0154);
            this._labelTitle.text       = Lang.getText(LangTextType.B0174);
            this._labelAccount.text     = `${Lang.getText(LangTextType.B0170)}:`;
            this._labelPassword.text    = `${Lang.getText(LangTextType.B0171)}:`;
            this._labelNickname.text    = `${Lang.getText(LangTextType.B0175)}:`;
            this._labelTips.setRichText(Lang.getText(LangTextType.R0005));
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

export default TwnsUserRegisterPanel;
