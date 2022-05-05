
// import TwnsChangeLogPanel           from "../../changeLog/view/ChangeLogPanel";
// import TwnsChatPanel                from "../../chat/view/ChatPanel";
// import TwnsCommonChangeVersionPanel from "../../common/view/CommonChangeVersionPanel";
// import TwnsCommonDamageChartPanel   from "../../common/view/CommonDamageChartPanel";
// import TwnsCommonRankListPanel      from "../../common/view/CommonRankListPanel";
// import TwnsCommonServerStatusPanel  from "../../common/view/CommonServerStatusPanel";
// import TwnsLobbyBackgroundPanel     from "../../lobby/view/LobbyBackgroundPanel";
// import TwnsMmMainMenuPanel          from "../../mapManagement/view/MmMainMenuPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import LocalStorage                 from "../../tools/helpers/LocalStorage";
// import StageManager                 from "../../tools/helpers/StageManager";
// import Timer                        from "../../tools/helpers/Timer";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Notify               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiRadioButton            from "../../tools/ui/UiRadioButton";
// import UserModel                    from "../../user/model/UserModel";
// import UserProxy                    from "../../user/model/UserProxy";
// import TwnsUserChangeDiscordIdPanel from "./UserChangeDiscordIdPanel";
// import TwnsUserChangeNicknamePanel  from "./UserChangeNicknamePanel";
// import TwnsUserOnlineUsersPanel     from "./UserOnlineUsersPanel";
// import TwnsUserSetPasswordPanel     from "./UserSetPasswordPanel";
// import TwnsUserSetPrivilegePanel    from "./UserSetPrivilegePanel";
// import TwnsUserSetSoundPanel        from "./UserSetSoundPanel";
// import TwnsUserSetStageScalePanel   from "./UserSetStageScalePanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import LangTextType = Lang.LangTextType;
    import NotifyType   = Notify.NotifyType;

    export type OpenDataForCommonGameChartPanel = {
    };
    export class CommonGameChartPanel extends TwnsUiPanel.UiPanel<OpenDataForCommonGameChartPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnClose!         : TwnsUiButton.UiButton;
        private readonly _group!            : eui.Group;
        private readonly _scroller!         : eui.Scroller;

        private readonly _groupButtons!     : eui.Group;
        private readonly _btnUnit!          : TwnsUiButton.UiButton;
        private readonly _btnTile!          : TwnsUiButton.UiButton;
        private readonly _btnCo!            : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,       callback: this.close },
                { ui: this._btnUnit,        callback: this._onTouchedBtnUnit },
                { ui: this._btnTile,        callback: this._onTouchedBtnTile },
                { ui: this._btnCo,          callback: this._onTouchedBtnCo },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._scroller.viewport.scrollV = 0;
            this._updateView();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private async _onTouchedBtnUnit(): Promise<void> {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonDamageChartPanel, {
                gameConfig: await Config.ConfigManager.getLatestGameConfig(),
            });
        }
        private async _onTouchedBtnTile(): Promise<void> {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonTileChartPanel, {
                gameConfig: await Config.ConfigManager.getLatestGameConfig(),
            });
        }
        private async _onTouchedBtnCo(): Promise<void> {
            const gameConfig = await Config.ConfigManager.getLatestGameConfig();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseSingleCoPanel, {
                gameConfig,
                availableCoIdArray  : gameConfig.getEnabledCoArray().map(v => v.coId).filter(v => v !== CommonConstants.CoEmptyId),
                currentCoId         : null,
                callbackOnConfirm   : null,
            });
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

        private async _updateView(): Promise<void> {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(LangTextType.B0900);
            this._btnUnit.label     = Lang.getText(LangTextType.B0304);
            this._btnTile.label     = Lang.getText(LangTextType.B0899);
            this._btnCo.label       = Lang.getText(LangTextType.B0425);
        }
    }
}

// export default TwnsCommonGameChartPanel;
