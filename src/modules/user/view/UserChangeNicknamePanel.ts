
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
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
    import LangTextType = Twns.Lang.LangTextType;

    export type OpenDataForUserChangeNicknamePanel = void;
    export class UserChangeNicknamePanel extends TwnsUiPanel.UiPanel<OpenDataForUserChangeNicknamePanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelNickname!    : TwnsUiLabel.UiLabel;
        private readonly _labelNote!        : TwnsUiLabel.UiLabel;
        private readonly _inputNickname!    : TwnsUiTextInput.UiTextInput;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private _isRequesting   = false;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserSetNickname,          callback: this._onMsgUserSetNickname },
                { type: NotifyType.MsgUserSetNicknameFailed,    callback: this._onMsgUserSetNicknameFailed },
            ]);
            this._setUiListenerArray([
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
                { ui: this._btnClose,   callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._isRequesting          = false;
            this._inputNickname.text    = Twns.User.UserModel.getSelfNickname() || ``;
            this._updateComponentsForLanguage();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onTouchedBtnConfirm(): void {
            if (this._isRequesting) {
                Twns.FloatText.show(Lang.getText(LangTextType.A0046));
            } else {
                const nickname = this._inputNickname.text;
                if (!Twns.Helpers.checkIsNicknameValid(nickname)) {
                    Twns.FloatText.show(Lang.getText(LangTextType.A0002));
                } else {
                    this._isRequesting = true;
                    Twns.User.UserProxy.reqSetNickname(nickname);
                }
            }
        }

        private _onMsgUserSetNickname(): void {
            Twns.FloatText.show(Lang.getText(LangTextType.A0047));
            this.close();
        }
        private _onMsgUserSetNicknameFailed(): void {
            this._isRequesting = false;
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0149);
            this._labelNickname.text    = Lang.getText(LangTextType.B0242);
            this._labelNote.text        = Lang.getText(LangTextType.A0066);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnClose.label        = Lang.getText(LangTextType.B0154);
        }

        protected async _showOpenAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Twns.Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Twns.Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Twns.Helpers.wait(Twns.CommonConstants.DefaultTweenTime);
        }
    }
}

// export default TwnsUserChangeNicknamePanel;
