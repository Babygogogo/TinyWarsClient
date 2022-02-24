
// import TwnsCommonConfirmPanel   from "../../common/view/CommonConfirmPanel";
// import CcrModel                 from "../../coopCustomRoom/model/CcrModel";
// import McrModel                 from "../../multiCustomRoom/model/McrModel";
// import TwnsMcrMainMenuPanel     from "../../multiCustomRoom/view/McrMainMenuPanel";
// import MfrModel                 from "../../multiFreeRoom/model/MfrModel";
// import MpwModel                 from "../../multiPlayerWar/model/MpwModel";
// import MrrModel                 from "../../multiRankRoom/model/MrrModel";
// import TwnsMrrMainMenuPanel     from "../../multiRankRoom/view/MrrMainMenuPanel";
// import TwnsSpmMainMenuPanel     from "../../singlePlayerMode/view/SpmMainMenuPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsLobbyPanel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import LangTextType         = TwnsLangTextType.LangTextType;

    export type OpenData = void;
    export class LobbyPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupTips!            : eui.Group;
        private readonly _groupWelcome!         : eui.Group;
        private readonly _labelTips0!           : TwnsUiLabel.UiLabel;
        private readonly _labelTips1!           : TwnsUiLabel.UiLabel;
        private readonly _groupQq!              : eui.Group;
        private readonly _labelTips2!           : TwnsUiLabel.UiLabel;
        private readonly _labelTips3!           : TwnsUiLabel.UiLabel;
        private readonly _groupDiscord!         : eui.Group;
        private readonly _labelTips4!           : TwnsUiLabel.UiLabel;
        private readonly _labelTips5!           : TwnsUiLabel.UiLabel;
        private readonly _groupGithub!          : eui.Group;
        private readonly _labelTips6!           : TwnsUiLabel.UiLabel;
        private readonly _labelTips7!           : TwnsUiLabel.UiLabel;
        private readonly _groupSwitchVersion!   : eui.Group;
        private readonly _labelTips8!           : TwnsUiLabel.UiLabel;
        private readonly _labelTips9!           : TwnsUiLabel.UiLabel;

        private readonly _group!                : eui.Group;
        private readonly _btnSinglePlayer!      : TwnsUiButton.UiButton;
        private readonly _btnMultiPlayer!       : TwnsUiButton.UiButton;
        private readonly _btnRanking!           : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._groupDiscord,       callback: this._onTouchedGroupDiscord },
                { ui: this._groupGithub,        callback: this._onTouchedGroupGithub },
                { ui: this._groupSwitchVersion, callback: this._onTouchedGroupSwitchVersion },
                { ui: this._btnMultiPlayer,     callback: this._onTouchedBtnMultiPlayer },
                { ui: this._btnSinglePlayer,    callback: this._onTouchedBtnSinglePlayer },
                { ui: this._btnRanking,         callback: this._onTouchedBtnRanking },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserLogout,                       callback: this._onMsgUserLogout },
                { type: NotifyType.MsgMcrGetJoinedRoomIdArray,          callback: this._onMsgMcrGetJoinedRoomIdArray },
                { type: NotifyType.MsgMfrGetJoinedRoomIdArray,          callback: this._onMsgMfrGetJoinedRoomIdArray },
                { type: NotifyType.MsgCcrGetJoinedRoomIdArray,          callback: this._onMsgCcrGetJoinedRoomIdArray },
                { type: NotifyType.MsgMrrGetJoinedRoomIdArray,          callback: this._onMsgMrrGetJoinedRoomIdArray },
                { type: NotifyType.MsgMpwCommonGetWarProgressInfo,      callback: this._onMsgMpwCommonGetWarProgressInfo },
                { type: NotifyType.MsgMpwWatchGetRequestedWarIdArray,   callback: this._onMsgMpwWatchGetRequestedWarIdArray },
            ]);

            this._updateComponentsForLanguage();
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            // nothing to do
        }
        protected _onClosing(): void {
            // nothing to do
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedGroupDiscord(): void {
            if ((window) && (window.open)) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    content : Lang.getFormattedText(LangTextType.F0065, `Discord`),
                    callback: () => {
                        window.open(CommonConstants.DiscordUrl);
                    },
                });
            }
        }

        private _onTouchedGroupGithub(): void {
            if ((window) && (window.open)) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    content : Lang.getFormattedText(LangTextType.F0065, `GitHub`),
                    callback: () => {
                        window.open(CommonConstants.GithubUrl);
                    },
                });
            }
        }

        private _onTouchedGroupSwitchVersion(): void {
            if (window?.open) {
                const isTest = (CommonConstants.GameVersion as any) === Types.GameVersion.Legacy;
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonConfirmPanel, {
                    content : Lang.getFormattedText(LangTextType.F0065, Lang.getText(isTest ? LangTextType.B0854 : LangTextType.B0854)),
                    callback: () => {
                        window.open(isTest ? CommonConstants.TestVersionUrl : CommonConstants.LegacyVersionUrl);
                    },
                });
            }
        }

        private _onTouchedBtnMultiPlayer(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.McrMainMenuPanel, void 0);
        }

        private _onTouchedBtnSinglePlayer(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.SpmMainMenuPanel, void 0);
        }

        private _onTouchedBtnRanking(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MrrMainMenuPanel, void 0);
        }

        private _onMsgUserLogout(): void {
            this.close();
        }

        private _onMsgMcrGetJoinedRoomIdArray(): void {
            this._updateBtnMultiPlayer();
        }

        private _onMsgMfrGetJoinedRoomIdArray(): void {
            this._updateBtnMultiPlayer();
        }

        private _onMsgCcrGetJoinedRoomIdArray(): void {
            this._updateBtnMultiPlayer();
        }

        private _onMsgMrrGetJoinedRoomIdArray(): void {
            this._updateBtnRanking();
        }

        private _onMsgMpwCommonGetWarProgressInfo(): void {
            this._updateBtnMultiPlayer();
            this._updateBtnRanking();
        }

        private _onMsgMpwWatchGetRequestedWarIdArray(): void {
            this._updateBtnMultiPlayer();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        protected async _showOpenAnimation(): Promise<void> {
            // const group = this._group;
            // Tween.removeTweens(group);
            // Tween.get(group)
            //     .set({ alpha: 0, right: 20 })
            //     .to({ alpha: 1, right: 60 }, 200);
            const group = this._group;
            group.alpha = 1;
            group.right = 60;

            Helpers.resetTween({
                obj         : this._btnMultiPlayer,
                beginProps  : { alpha: 0, right: -40 },
                endProps    : { alpha: 1, right: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnRanking,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, right: 0 },
            });
            Helpers.resetTween({
                obj         : this._btnSinglePlayer,
                beginProps  : { alpha: 0, right: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, right: 0 },
            });

            // const groupTips = this._groupTips;
            // Tween.removeTweens(groupTips);
            // Tween.get(groupTips)
            //     .set({ alpha: 0, left: 20 })
            //     .to({ alpha: 1, left: 60 }, 200);
            const groupTips = this._groupTips;
            groupTips.alpha = 1;
            groupTips.left  = 60;

            Helpers.resetTween({
                obj         : this._groupWelcome,
                beginProps  : { alpha: 0, left: -40 },
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupQq,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 50,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupDiscord,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 100,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupGithub,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 150,
                endProps    : { alpha: 1, left: 0 },
            });
            Helpers.resetTween({
                obj         : this._groupSwitchVersion,
                beginProps  : { alpha: 0, left: -40 },
                waitTime    : 200,
                endProps    : { alpha: 1, left: 0 },
            });

            await Helpers.wait(200 + CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, right: 60 },
                endProps    : { alpha: 0, right: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupTips,
                beginProps  : { alpha: 1, left: 60 },
                endProps    : { alpha: 0, left: 20 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }

        private async _updateComponentsForLanguage(): Promise<void> {
            this._labelTips0.text       = Lang.getText(LangTextType.A0195);
            this._labelTips1.text       = ` `;
            this._labelTips2.text       = `${Lang.getText(LangTextType.B0537)}:`;
            this._labelTips3.text       = `368142455`;
            this._labelTips4.text       = `${Lang.getText(LangTextType.B0538)}:`;
            this._labelTips5.textFlow   = [{
                text    : CommonConstants.DiscordUrl,
                style   : { underline: true },
            }];
            this._labelTips6.text       = `${Lang.getText(LangTextType.B0539)}:`;
            this._labelTips7.textFlow   = [{
                text    : CommonConstants.GithubUrl,
                style   : { underline: true },
            }];

            const labelTips8    = this._labelTips8;
            const labelTips9    = this._labelTips9;
            if ((CommonConstants.GameVersion as any) === Types.GameVersion.Legacy) {
                labelTips8.text     = `${Lang.getText(LangTextType.B0854)}:`;
                labelTips9.textFlow = [{
                    text    : CommonConstants.TestVersionUrl,
                    style   : { underline: true },
                }];
            } else {
                labelTips8.text     = `${Lang.getText(LangTextType.B0853)}:`;
                labelTips9.textFlow = [{
                    text    : CommonConstants.LegacyVersionUrl,
                    style   : { underline: true },
                }];
            }
        }

        private async _updateBtnMultiPlayer(): Promise<void> {
            this._btnMultiPlayer.setRedVisible(await TwnsLobbyModel.checkIsRedForMultiPlayer());
        }

        private async _updateBtnRanking(): Promise<void> {
            this._btnRanking.setRedVisible(
                (await MpwModel.checkIsRedForMyMrwWars()) ||
                (await MrrModel.checkIsRed())
            );
        }
    }
}

// export default TwnsLobbyPanel;
