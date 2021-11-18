
// import TwnsChatPanel            from "../../chat/view/ChatPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import UserModel                from "../../user/model/UserModel";
// import UserProxy                from "../../user/model/UserProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsUserSetAvatarPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

    export type OpenData = void;
    export class UserSetAvatarPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private readonly _sclAvatar!        : TwnsUiScrollList.UiScrollList<DataForAvatarRenderer>;
        private readonly _imgAvatar!        : TwnsUiImage.UiImage;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,      callback: this.close },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
                { ui: this._btnClose,       callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._sclAvatar.setItemRenderer(AvatarRenderer);

            this._updateView();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        public updateOnSetSelectedAvatar(): void {
            this._updateImgAvatar();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onTouchedBtnConfirm(): void {
            const avatarId = this._sclAvatar.getSelectedData()?.avatarId;
            if ((avatarId != null) && (avatarId !== UserModel.getSelfAvatarId())) {
                UserProxy.reqSetAvatarId(avatarId);
            }
            this.close();
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

        private _updateView(): void {
            this._updateComponentsForLanguage();
            this._updateImgAvatar();
            this._updateSclAvatar();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(LangTextType.B0707);
            this._btnCancel.label   = Lang.getText(LangTextType.B0154);
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
        }

        private _updateImgAvatar(): void {
            this._imgAvatar.source = ConfigManager.getUserAvatarImageSource(this._sclAvatar.getSelectedData()?.avatarId ?? UserModel.getSelfAvatarId() ?? 1);
        }
        private _updateSclAvatar(): void {
            const dataArray: DataForAvatarRenderer[] = [];
            for (const avatarId of ConfigManager.getAvailableUserAvatarIdArray(Helpers.getExisted(ConfigManager.getLatestConfigVersion(), ClientErrorCode.UserSetAvatarPanel_UpdateSclAvatar_00))) {
                dataArray.push({
                    avatarId,
                    panel   : this,
                });
            }

            const selfAvatarId  = UserModel.getSelfAvatarId() ?? 1;
            const list          = this._sclAvatar;
            list.bindData(dataArray);
            list.setSelectedIndex(dataArray.findIndex(v => v.avatarId === selfAvatarId));
        }
    }

    type DataForAvatarRenderer = {
        avatarId    : number;
        panel       : UserSetAvatarPanel;
    };
    class AvatarRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForAvatarRenderer> {
        private readonly _imgAvatar!    : TwnsUiImage.UiImage;

        protected async _onDataChanged(): Promise<void> {
            const data             = this._getData();
            this._imgAvatar.source = ConfigManager.getUserAvatarImageSource(data.avatarId);
        }

        public onItemTapEvent(): void {
            this._getData().panel.updateOnSetSelectedAvatar();
        }
    }
}

// export default TwnsUserSetAvatarPanel;
