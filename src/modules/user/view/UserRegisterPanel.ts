
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import LocalStorage         from "../../tools/helpers/LocalStorage";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import UserModel            from "../model/UserModel";
// import UserProxy            from "../model/UserProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsUserRegisterPanel {
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;

    export type OpenData = void;
    export class UserRegisterPanel extends TwnsUiPanel2.UiPanel2<OpenData> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelAccount!     : TwnsUiLabel.UiLabel;
        private readonly _inputAccount!     : TwnsUiTextInput.UiTextInput;
        private readonly _labelPassword!    : TwnsUiLabel.UiLabel;
        private readonly _inputPassword!    : TwnsUiTextInput.UiTextInput;
        private readonly _labelNickname!    : TwnsUiLabel.UiLabel;
        private readonly _inputNickname!    : TwnsUiTextInput.UiTextInput;
        private readonly _btnRegister!      : TwnsUiButton.UiButton;
        private readonly _btnClose!         : TwnsUiButton.UiButton;
        private readonly _labelTips!        : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserRegister, callback: this._onMsgUserRegister },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,    callback: this.close },
                { ui: this._btnRegister, callback: this._onTouchedBtnRegister },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._btnRegister.setShortSfxCode(Types.ShortSfxCode.ButtonConfirm01);

            this._updateComponentsForLanguage();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onMsgUserRegister(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgUserRegister.IS;
            FloatText.show(Lang.getText(LangTextType.A0004));

            const account   = Helpers.getExisted(data.account, ClientErrorCode.UserRegisterPanel_OnMsgUserRegister_00);
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

        protected async _showOpenAnimation(): Promise<void> {
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });

            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsUserRegisterPanel;
