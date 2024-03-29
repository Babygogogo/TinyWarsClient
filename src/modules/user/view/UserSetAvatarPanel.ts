
// import TwnsChatPanel            from "../../chat/view/ChatPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import UserModel                from "../../user/model/UserModel";
// import UserProxy                from "../../user/model/UserProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User {
    import LangTextType     = Twns.Lang.LangTextType;
    import NotifyType       = Twns.Notify.NotifyType;

    export type OpenDataForUserSetAvatarPanel = void;
    export class UserSetAvatarPanel extends TwnsUiPanel.UiPanel<OpenDataForUserSetAvatarPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;

        private readonly _sclAvatar!        : TwnsUiScrollList.UiScrollList<DataForAvatarRenderer>;
        private readonly _imgAvatar!        : TwnsUiImage.UiImage;
        private readonly _btnConfirm!       : TwnsUiButton.UiButton;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;

        private _gameConfig : Config.GameConfig | null = null;

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
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._gameConfig = await Twns.Config.ConfigManager.getLatestGameConfig();
            this._updateView();
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
            if ((avatarId != null) && (avatarId !== Twns.User.UserModel.getSelfAvatarId())) {
                Twns.User.UserProxy.reqSetAvatarId(avatarId);
            }
            this.close();
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
            this._imgAvatar.source = Twns.Config.ConfigManager.getUserAvatarImageSource(this._sclAvatar.getSelectedData()?.avatarId ?? Twns.User.UserModel.getSelfAvatarId() ?? 1);
        }
        private _updateSclAvatar(): void {
            const dataArray: DataForAvatarRenderer[] = [];
            for (const avatarId of this._gameConfig?.getAvailableUserAvatarIdArray() ?? []) {
                dataArray.push({
                    avatarId,
                    panel   : this,
                });
            }

            const selfAvatarId  = Twns.User.UserModel.getSelfAvatarId() ?? 1;
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
            this._imgAvatar.source = Twns.Config.ConfigManager.getUserAvatarImageSource(data.avatarId);
        }

        public onItemTapEvent(): void {
            this._getData().panel.updateOnSetSelectedAvatar();
        }
    }
}

// export default TwnsUserSetAvatarPanel;
