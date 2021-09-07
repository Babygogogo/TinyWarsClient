
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import FloatText            from "../../tools/helpers/FloatText";
import Helpers              from "../../tools/helpers/Helpers";
import LocalStorage         from "../../tools/helpers/LocalStorage";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import TwnsUiButton         from "../../tools/ui/UiButton";
import TwnsUiImage          from "../../tools/ui/UiImage";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";
import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
import UserModel            from "../../user/model/UserModel";
import UserProxy            from "../../user/model/UserProxy";

namespace TwnsUserSetPasswordPanel {
    import NotifyType   = TwnsNotifyType.NotifyType;
    import LangTextType = TwnsLangTextType.LangTextType;

    export class UserSetPasswordPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

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

        private static _instance: UserSetPasswordPanel;

        public static show(): void {
            if (!UserSetPasswordPanel._instance) {
                UserSetPasswordPanel._instance = new UserSetPasswordPanel();
            }
            UserSetPasswordPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (UserSetPasswordPanel._instance) {
                await UserSetPasswordPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
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
            await this._showCloseAnimation().catch(err => { CompatibilityHelpers.showError(err); throw err; });
        }

        private _onMsgUserSetPassword(): void {
            FloatText.show(Lang.getText(LangTextType.A0148));

            const password = this._inputNewPassword0.text;
            LocalStorage.setPassword(password);
            UserModel.setSelfPassword(password);
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
                UserProxy.reqUserSetPassword(this._inputOldPassword.text, newPassword);
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

export default TwnsUserSetPasswordPanel;
