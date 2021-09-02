
import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import FloatText                from "../../tools/helpers/FloatText";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiTextInput          from "../../tools/ui/UiTextInput";
import UserModel                from "../../user/model/UserModel";
import UserProxy                from "../../user/model/UserProxy";

export namespace TwnsUserChangeDiscordIdPanel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import CommonConfirmPanel   = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;

    export class UserChangeDiscordIdPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelDiscordId!   : TwnsUiLabel.UiLabel;
        private readonly _labelNote!        : TwnsUiLabel.UiLabel;
        private readonly _inputDiscordId!   : TwnsUiTextInput.UiTextInput;
        private readonly _labelUrl!         : TwnsUiLabel.UiLabel;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private _isRequesting   = false;

        private static _instance: UserChangeDiscordIdPanel;

        public static show(): void {
            if (!UserChangeDiscordIdPanel._instance) {
                UserChangeDiscordIdPanel._instance = new UserChangeDiscordIdPanel();
            }
            UserChangeDiscordIdPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (UserChangeDiscordIdPanel._instance) {
                await UserChangeDiscordIdPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/user/UserChangeDiscordIdPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserSetDiscordId,         callback: this._onMsgUserSetDiscordId },
                { type: NotifyType.MsgUserSetDiscordIdFailed,   callback: this._onMsgUserSetDiscordIdFailed },
            ]);
            this._setUiListenerArray([
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
                { ui: this._btnClose,   callback: this.close },
                { ui: this._labelUrl,   callback: this._onTouchedLabelUrl },
            ]);

            this._isRequesting          = false;
            this._inputDiscordId.text   = UserModel.getSelfDiscordId() ?? ``;

            const labelUrl          = this._labelUrl;
            labelUrl.touchEnabled   = true;
            labelUrl.textFlow       = [{
                text    : CommonConstants.DiscordUrl,
                style   : { underline: true },
            }];

            this._showOpenAnimation();
            this._updateComponentsForLanguage();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onTouchedBtnConfirm(): void {
            if (this._isRequesting) {
                FloatText.show(Lang.getText(LangTextType.A0046));
            } else {
                const discordId = this._inputDiscordId.text;
                if (!Helpers.checkIsDiscordIdValid(discordId)) {
                    FloatText.show(Lang.getText(LangTextType.A0048));
                } else {
                    this._isRequesting = true;
                    UserProxy.reqSetDiscordId(discordId);
                }
            }
        }

        private _onTouchedLabelUrl(): void {
            if ((window) && (window.open)) {
                CommonConfirmPanel.show({
                    content : Lang.getFormattedText(LangTextType.F0065, `Discord`),
                    callback: () => {
                        window.open(CommonConstants.DiscordUrl);
                    },
                });
            }
        }

        private _onMsgUserSetDiscordId(): void {
            FloatText.show(Lang.getText(LangTextType.A0049));
            this.close();
        }
        private _onMsgUserSetDiscordIdFailed(): void {
            this._isRequesting = false;
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelTitle.text       = Lang.getText(LangTextType.B0150);
            this._labelDiscordId.text   = Lang.getText(LangTextType.B0243);
            this._labelNote.text        = Lang.getText(LangTextType.A0067);
            this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
            this._btnClose.label        = Lang.getText(LangTextType.B0154);
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

export default TwnsUserChangeDiscordIdPanel;
