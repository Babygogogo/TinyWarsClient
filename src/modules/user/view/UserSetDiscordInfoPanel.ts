
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiTextInput          from "../../tools/ui/UiTextInput";
// import UserModel                from "../../user/model/UserModel";
// import UserProxy                from "../../user/model/UserProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User {
    import NotifyType           = Notify.NotifyType;
    import LangTextType         = Lang.LangTextType;

    export type OpenDataForUserSetDiscordInfoPanel = void;
    export class UserSetDiscordInfoPanel extends TwnsUiPanel.UiPanel<OpenDataForUserSetDiscordInfoPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelDiscordId!   : TwnsUiLabel.UiLabel;
        private readonly _labelNote!        : TwnsUiLabel.UiLabel;
        private readonly _inputDiscordId!   : TwnsUiTextInput.UiTextInput;
        private readonly _labelUrl!         : TwnsUiLabel.UiLabel;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private readonly _groupTurn!        : eui.Group;
        private readonly _imgTurn!          : TwnsUiImage.UiImage;
        private readonly _labelTurn!        : TwnsUiLabel.UiLabel;

        private readonly _groupRankPhase!   : eui.Group;
        private readonly _imgRankPhase!     : TwnsUiImage.UiImage;
        private readonly _labelRankPhase!   : TwnsUiLabel.UiLabel;

        private readonly _groupRoom!        : eui.Group;
        private readonly _imgRoom!          : TwnsUiImage.UiImage;
        private readonly _labelRoom!        : TwnsUiLabel.UiLabel;

        private _isRequesting   = false;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserSetDiscordInfo,           callback: this._onMsgUserSetDiscordId },
                { type: NotifyType.MsgUserSetDiscordInfoFailed,     callback: this._onMsgUserSetDiscordIdFailed },
            ]);
            this._setUiListenerArray([
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
                { ui: this._btnClose,           callback: this.close },
                { ui: this._labelUrl,           callback: this._onTouchedLabelUrl },
                { ui: this._groupTurn,          callback: this._onTouchedGroupTurn },
                { ui: this._groupRankPhase,     callback: this._onTouchedGroupRankPhase },
                { ui: this._groupRoom,          callback: this._onTouchedGroupRoom },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._isRequesting = false;

            const labelUrl          = this._labelUrl;
            labelUrl.touchEnabled   = true;
            labelUrl.textFlow       = [{
                text    : CommonConstants.DiscordUrl,
                style   : { underline: true },
            }];

            this._updateComponentsForLanguage();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            const discordInfo           = User.UserModel.getSelfDiscordInfo();
            this._inputDiscordId.text   = discordInfo?.discordId ?? ``;
            this._imgRankPhase.visible  = !discordInfo?.ignoreRankPhaseNotification;
            this._imgRoom.visible       = !discordInfo?.ignoreRoomNotification;
            this._imgTurn.visible       = !discordInfo?.ignoreTurnNotification;
        }
        protected _onClosing(): void {
            // nothing to do
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
                    User.UserProxy.reqSetDiscordInfo({
                        discordId,
                        ignoreRankPhaseNotification : this._imgRankPhase.visible ? null : true,
                        ignoreRoomNotification      : this._imgRoom.visible ? null : true,
                        ignoreTurnNotification      : this._imgTurn.visible ? null : true,
                    });
                }
            }
        }

        private _onTouchedLabelUrl(): void {
            if ((window) && (window.open)) {
                PanelHelpers.open(PanelHelpers.PanelDict.CommonConfirmPanel, {
                    content : Lang.getFormattedText(LangTextType.F0065, `Discord`),
                    callback: () => {
                        window.open(CommonConstants.DiscordUrl);
                    },
                });
            }
        }

        private _onTouchedGroupTurn(): void {
            const img   = this._imgTurn;
            img.visible = !img.visible;
        }
        private _onTouchedGroupRankPhase(): void {
            const img   = this._imgRankPhase;
            img.visible = !img.visible;
        }
        private _onTouchedGroupRoom(): void {
            const img   = this._imgRoom;
            img.visible = !img.visible;
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
            this._labelTurn.text        = Lang.getText(LangTextType.B0918);
            this._labelRankPhase.text   = Lang.getText(LangTextType.B0919);
            this._labelRoom.text        = Lang.getText(LangTextType.B0920);
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

// export default TwnsUserSetDiscordInfoPanel;
