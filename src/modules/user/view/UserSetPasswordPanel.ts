
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import LocalStorage         from "../../tools/helpers/LocalStorage";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiImage          from "../../tools/ui/UiImage";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import UserModel            from "../../user/model/UserModel";
// import UserProxy            from "../../user/model/UserProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User {
    import NotifyType   = Twns.Notify.NotifyType;
    import LangTextType = TwnsLangTextType.LangTextType;

    export type OpenDataForUserSetPasswordPanel = void;
    export class UserSetPasswordPanel extends TwnsUiPanel.UiPanel<OpenDataForUserSetPasswordPanel> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _group!                    : eui.Group;
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _labelOldPasswordTitle!    : TwnsUiLabel.UiLabel;
        private readonly _inputOldPassword!         : TwnsUiTextInput.UiTextInput;
        private readonly _labelNewPasswordTitle0!   : TwnsUiLabel.UiLabel;
        private readonly _inputNewPassword0!        : TwnsUiTextInput.UiTextInput;
        private readonly _labelNewPasswordTitle1!   : TwnsUiLabel.UiLabel;
        private readonly _inputNewPassword1!        : TwnsUiTextInput.UiTextInput;
        private readonly _btnConfirm!               : TwnsUiButton.UiButton;
        private readonly _btnCancel!                : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserSetPassword,  callback: this._onMsgUserSetPassword },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this.close },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._updateOnLanguageChanged();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onMsgUserSetPassword(): void {
            FloatText.show(Lang.getText(LangTextType.A0148));

            const password = this._inputNewPassword0.text;
            LocalStorage.setPassword(password);
            Twns.User.UserModel.setSelfPassword(password);
            this.close();
        }
        private _onNotifyLanguageChanged(): void {
            this._updateOnLanguageChanged();
        }

        private _onTouchedBtnConfirm(): void {
            const newPassword = this._inputNewPassword0.text;
            if (!Helpers.checkIsPasswordValid(newPassword)) {
                FloatText.show(Lang.getText(LangTextType.A0003));
            } else if (newPassword !== this._inputNewPassword1.text) {
                FloatText.show(Lang.getText(LangTextType.A0147));
            } else {
                Twns.User.UserProxy.reqUserSetPassword(this._inputOldPassword.text, newPassword);
            }
        }

        private _updateOnLanguageChanged(): void {
            this._labelTitle.text               = Lang.getText(LangTextType.B0426);
            this._labelOldPasswordTitle.text    = Lang.getText(LangTextType.B0427);
            this._labelNewPasswordTitle0.text   = Lang.getText(LangTextType.B0428);
            this._labelNewPasswordTitle1.text   = Lang.getText(LangTextType.B0429);
            this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
            this._btnCancel.label               = Lang.getText(LangTextType.B0154);
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

// export default TwnsUserSetPasswordPanel;
