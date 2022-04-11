
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
namespace TwnsUserPanel {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;
    import WarType      = Types.WarType;

    export type OpenData = {
        userId  : number;
    };
    export class UserPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _group!                    : eui.Group;
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;

        private readonly _btnChat!                  : TwnsUiButton.UiButton;
        private readonly _imgAvatar!                : TwnsUiImage.UiImage;
        private readonly _btnSetAvatar!             : TwnsUiButton.UiButton;
        private readonly _imgLogo!                  : TwnsUiImage.UiImage;

        private readonly _labelStdRankScoreTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelStdRankScore!        : TwnsUiLabel.UiLabel;
        private readonly _labelStdRankRankTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelStdRankRank!         : TwnsUiLabel.UiLabel;
        private readonly _labelStdRankRankSuffix!   : TwnsUiLabel.UiLabel;
        private readonly _labelFogRankScoreTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelFogRankScore!        : TwnsUiLabel.UiLabel;
        private readonly _labelFogRankRankTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelFogRankRank!         : TwnsUiLabel.UiLabel;
        private readonly _labelFogRankRankSuffix!   : TwnsUiLabel.UiLabel;
        private readonly _labelSpmRankScoreTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelSpmRankScore!        : TwnsUiLabel.UiLabel;
        private readonly _labelSpmRankRankTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelSpmRankRank!         : TwnsUiLabel.UiLabel;
        private readonly _labelSpmRankRankSuffix!   : TwnsUiLabel.UiLabel;

        private readonly _labelRegisterTimeTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelRegisterTime1!       : TwnsUiLabel.UiLabel;
        private readonly _labelRegisterTime2!       : TwnsUiLabel.UiLabel;
        private readonly _labelLastLoginTimeTitle!  : TwnsUiLabel.UiLabel;
        private readonly _labelLastLoginTime1!      : TwnsUiLabel.UiLabel;
        private readonly _labelLastLoginTime2!      : TwnsUiLabel.UiLabel;
        private readonly _labelOnlineTimeTitle!     : TwnsUiLabel.UiLabel;
        private readonly _labelOnlineTime!          : TwnsUiLabel.UiLabel;
        private readonly _labelLoginCountTitle!     : TwnsUiLabel.UiLabel;
        private readonly _labelLoginCount!          : TwnsUiLabel.UiLabel;
        private readonly _labelUserId!              : TwnsUiLabel.UiLabel;
        private readonly _labelUserIdTitle!         : TwnsUiLabel.UiLabel;
        private readonly _labelDiscordId!           : TwnsUiLabel.UiLabel;

        private readonly _labelHistoryStd!          : TwnsUiLabel.UiLabel;
        private readonly _labelHistoryStdWin!       : TwnsUiLabel.UiLabel;
        private readonly _labelHistoryStdLose!      : TwnsUiLabel.UiLabel;
        private readonly _labelHistoryStdDraw!      : TwnsUiLabel.UiLabel;
        private readonly _labelHistoryStdRatio!     : TwnsUiLabel.UiLabel;
        private readonly _labelHistoryFog!          : TwnsUiLabel.UiLabel;
        private readonly _labelHistoryFogWin!       : TwnsUiLabel.UiLabel;
        private readonly _labelHistoryFogLose!      : TwnsUiLabel.UiLabel;
        private readonly _labelHistoryFogDraw!      : TwnsUiLabel.UiLabel;
        private readonly _labelHistoryFogRatio!     : TwnsUiLabel.UiLabel;

        private readonly _sclHistoryStd!            : TwnsUiScrollList.UiScrollList<DataForHistoryRenderer>;
        private readonly _sclHistoryFog!            : TwnsUiScrollList.UiScrollList<DataForHistoryRenderer>;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgUserGetPublicInfo,    callback: this._onNotifyMsgUserGetPublicInfo },
                { type: NotifyType.MsgUserSetNickname,      callback: this._onNotifyMsgUserSetNickname },
                { type: NotifyType.MsgUserSetDiscordId,     callback: this._onNotifyMsgUserSetDiscordId },
                { type: NotifyType.MsgUserSetAvatarId,      callback: this._onNotifyMsgUserSetAvatarId },
            ]);
            this._setUiListenerArray([
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnSetAvatar,       callback: this._onTouchedBtnSetAvatar },
                { ui: this._btnClose,           callback: this.close },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();

            this._sclHistoryStd.setItemRenderer(HistoryRenderer);
            this._sclHistoryFog.setItemRenderer(HistoryRenderer);

            this._updateView();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            UserProxy.reqUserGetPublicInfo(this._getOpenData().userId);
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMsgUserGetPublicInfo(): void {
            this._updateView();
        }
        private _onNotifyMsgUserSetNickname(): void {
            const userId = this._getOpenData().userId;
            if (userId === UserModel.getSelfUserId()) {
                UserProxy.reqUserGetPublicInfo(userId);
            }
        }
        private _onNotifyMsgUserSetDiscordId(): void {
            const userId = this._getOpenData().userId;
            if (userId === UserModel.getSelfUserId()) {
                UserProxy.reqUserGetPublicInfo(userId);
            }
        }
        private _onNotifyMsgUserSetAvatarId(): void {
            const userId = this._getOpenData().userId;
            if (userId === UserModel.getSelfUserId()) {
                UserProxy.reqUserGetPublicInfo(userId);
            }
        }
        private _onTouchedBtnChat(): void {
            const userId = this._getOpenData().userId;
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.ChatPanel, { toUserId: userId });
        }
        private _onTouchedBtnSetAvatar(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.UserSetAvatarPanel, void 0);
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
            const userId    = this._getOpenData().userId;
            const info      = await UserModel.getUserPublicInfo(userId);
            if (info) {
                const registerTime          = info.registerTime;
                const labelRegisterTime1    = this._labelRegisterTime1;
                const labelRegisterTime2    = this._labelRegisterTime2;
                if (registerTime == null) {
                    labelRegisterTime1.text     = CommonConstants.ErrorTextForUndefined;
                    labelRegisterTime2.text     = CommonConstants.ErrorTextForUndefined;
                } else {
                    labelRegisterTime1.text     = Helpers.getTimestampShortText(registerTime, { hour: false, minute: false, second: false });
                    labelRegisterTime2.text     = Helpers.getTimestampShortText(registerTime, { year: false, month: false, date: false });
                }

                const loginTime             = info.lastLoginTime;
                const labelLastLoginTime1   = this._labelLastLoginTime1;
                const labelLastLoginTime2   = this._labelLastLoginTime2;
                if (loginTime == null) {
                    labelLastLoginTime1.text    = CommonConstants.ErrorTextForUndefined;
                    labelLastLoginTime2.text    = CommonConstants.ErrorTextForUndefined;
                } else {
                    labelLastLoginTime1.text    = Helpers.getTimestampShortText(loginTime, { hour: false, minute: false, second: false });
                    labelLastLoginTime2.text    = Helpers.getTimestampShortText(loginTime, { year: false, month: false, date: false });
                }

                this._labelLoginCount.text      = `${info.loginCount}`;
                this._labelUserId.text          = `${userId}`;
                this._labelDiscordId.text       = info.discordId || "--";
            }

            this._updateComponentsForLanguage();
            this._updateLabelOnlineTime();
            this._updateBtnChat();
            this._updateBtnSetAvatar();
            this._updateImgAvatar();
        }

        private _updateBtnChat(): void {
            this._btnChat.visible = this._getOpenData().userId !== UserModel.getSelfUserId();
        }

        private _updateBtnSetAvatar(): void {
            this._btnSetAvatar.visible = this._getOpenData().userId === UserModel.getSelfUserId();
        }

        private async _updateImgAvatar(): Promise<void> {
            const info              = await UserModel.getUserPublicInfo(this._getOpenData().userId);
            this._imgAvatar.source  = Twns.Config.ConfigManager.getUserAvatarImageSource(info?.avatarId ?? 1);
        }

        private _updateComponentsForLanguage(): void {
            this._labelStdRankScoreTitle.text   = Lang.getText(LangTextType.B0198);
            this._labelStdRankRankTitle.text    = Lang.getText(LangTextType.B0546);
            this._labelFogRankScoreTitle.text   = Lang.getText(LangTextType.B0199);
            this._labelFogRankRankTitle.text    = Lang.getText(LangTextType.B0547);
            this._labelSpmRankScoreTitle.text   = Lang.getText(LangTextType.B0819);
            this._labelSpmRankRankTitle.text    = Lang.getText(LangTextType.B0820);
            this._labelUserIdTitle.text         = Lang.getText(LangTextType.B0640);
            this._labelRegisterTimeTitle.text   = Lang.getText(LangTextType.B0194);
            this._labelLastLoginTimeTitle.text  = Lang.getText(LangTextType.B0195);
            this._labelOnlineTimeTitle.text     = Lang.getText(LangTextType.B0196);
            this._labelLoginCountTitle.text     = Lang.getText(LangTextType.B0197);
            this._labelHistoryStd.text          = Lang.getText(LangTextType.B0548);
            this._labelHistoryStdWin.text       = Lang.getText(LangTextType.B0550);
            this._labelHistoryStdLose.text      = Lang.getText(LangTextType.B0551);
            this._labelHistoryStdDraw.text      = Lang.getText(LangTextType.B0552);
            this._labelHistoryStdRatio.text     = Lang.getText(LangTextType.B0553);
            this._labelHistoryFog.text          = Lang.getText(LangTextType.B0549);
            this._labelHistoryFogWin.text       = Lang.getText(LangTextType.B0550);
            this._labelHistoryFogLose.text      = Lang.getText(LangTextType.B0551);
            this._labelHistoryFogDraw.text      = Lang.getText(LangTextType.B0552);
            this._labelHistoryFogRatio.text     = Lang.getText(LangTextType.B0553);
            this._btnChat.label                 = Lang.getText(LangTextType.B0383);
            this._btnSetAvatar.label            = Lang.getText(LangTextType.B0707);

            this._updateLabelTitle();
            this._updateComponentsForStdRank();
            this._updateComponentsForFogRank();
            this._updateComponentsForSpmRank();
            this._updateSclHistoryStd();
            this._updateSclHistoryFog();
        }

        private async _updateLabelTitle(): Promise<void> {
            const nickname          = await UserModel.getUserNickname(this._getOpenData().userId);
            this._labelTitle.text   = Lang.getFormattedText(LangTextType.F0009, nickname);
        }
        private async _updateComponentsForStdRank(): Promise<void> {
            const data                      = await UserModel.getUserMrwRankScoreInfo(this._getOpenData().userId, WarType.MrwStd, 2);
            const rawScore                  = data ? data.currentScore : null;
            const score                     = rawScore != null ? rawScore : CommonConstants.RankInitialScore;
            const rankName                  = `(${(await Twns.Config.ConfigManager.getLatestGameConfig()).getRankName(score) ?? CommonConstants.ErrorTextForUndefined})`;
            this._labelStdRankScore.text    = `${score} ${rankName}`;

            const rank                          = data ? data.currentRank : null;
            this._labelStdRankRank.text         = rank == null ? `--` : `${rank}`;
            this._labelStdRankRankSuffix.text   = Helpers.getSuffixForRank(rank) || ``;
        }
        private async _updateComponentsForFogRank(): Promise<void> {
            const data                      = await UserModel.getUserMrwRankScoreInfo(this._getOpenData().userId, WarType.MrwFog, 2);
            const rawScore                  = data ? data.currentScore : null;
            const score                     = rawScore != null ? rawScore : CommonConstants.RankInitialScore;
            const rankName                  = `(${(await Twns.Config.ConfigManager.getLatestGameConfig()).getRankName(score) ?? CommonConstants.ErrorTextForUndefined})`;
            this._labelFogRankScore.text    = `${score} ${rankName}`;

            const rank                          = data ? data.currentRank : null;
            this._labelFogRankRank.text         = rank == null ? `--` : `${rank}`;
            this._labelFogRankRankSuffix.text   = Helpers.getSuffixForRank(rank) || ``;
        }
        private async _updateComponentsForSpmRank(): Promise<void> {
            const userId                        = this._getOpenData().userId;
            const rankScore                     = (await UserModel.getUserPublicInfo(userId))?.spmOverallRankScore ?? 0;
            const rankIndex                     = (await Twns.LeaderboardModel.getSpmOverallRankIndex(userId)) ?? 0;
            this._labelSpmRankScore.text        = rankScore > 0 ? Helpers.formatString(`%.2f`, rankScore) : `--`;

            const isRankValid                   = (rankIndex > 0) && (rankScore > 0);
            this._labelSpmRankRank.text         = isRankValid ? `${rankIndex}` : `--`;
            this._labelSpmRankRankSuffix.text   = isRankValid ? Helpers.getSuffixForRank(rankIndex) || `` : ``;
        }
        private _updateSclHistoryStd(): void {
            const userId    = this._getOpenData().userId;
            let index       = 0;
            const dataList  : DataForHistoryRenderer[] = [{
                index       : index++,
                userId,
                warType     : WarType.MrwStd,
                playersCount: 2,
            }];
            for (let playersCount = 2; playersCount <= CommonConstants.WarMaxPlayerIndex; ++playersCount) {
                dataList.push({
                    index       : index++,
                    userId,
                    warType     : WarType.McwStd,
                    playersCount,
                });
            }
            dataList[dataList.length - 1].showBottom = true;
            this._sclHistoryStd.bindData(dataList);
        }
        private _updateSclHistoryFog(): void {
            const userId    = this._getOpenData().userId;
            let index       = 0;
            const dataList  : DataForHistoryRenderer[] = [{
                index       : index++,
                userId,
                warType     : WarType.MrwFog,
                playersCount: 2,
            }];
            for (let playersCount = 2; playersCount <= CommonConstants.WarMaxPlayerIndex; ++playersCount) {
                dataList.push({
                    index       : index++,
                    userId,
                    warType     : WarType.McwFog,
                    playersCount,
                });
            }
            dataList[dataList.length - 1].showBottom = true;
            this._sclHistoryFog.bindData(dataList);
        }
        private async _updateLabelOnlineTime(): Promise<void> {
            const info                  = await UserModel.getUserPublicInfo(this._getOpenData().userId);
            const onlineTime            = info ? info.onlineTime : null;
            this._labelOnlineTime.text  = onlineTime == null ? CommonConstants.ErrorTextForUndefined : Helpers.getTimeDurationText2(onlineTime);
        }
    }

    type DataForHistoryRenderer = {
        index       : number;
        userId      : number;
        warType     : WarType;
        playersCount: number;
        showBottom? : boolean;
    };
    class HistoryRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForHistoryRenderer> {
        private readonly _imgBg!        : TwnsUiImage.UiImage;
        private readonly _labelType!    : TwnsUiLabel.UiLabel;
        private readonly _labelWin!     : TwnsUiLabel.UiLabel;
        private readonly _labelLose!    : TwnsUiLabel.UiLabel;
        private readonly _labelDraw!    : TwnsUiLabel.UiLabel;
        private readonly _labelRatio!   : TwnsUiLabel.UiLabel;
        private readonly _imgBottom!    : TwnsUiImage.UiImage;

        protected async _onDataChanged(): Promise<void> {
            const data              = this._getData();
            this._imgBg.alpha       = data.index % 2 === 0 ? 0.2 : 0.5;
            this._imgBottom.visible = !!data.showBottom;

            const warType       = data.warType;
            const playersCount  = data.playersCount;
            const labelType     = this._labelType;
            if ((warType === WarType.MrwFog) || (warType === WarType.MrwStd)) {
                labelType.text = Lang.getText(LangTextType.B0554);
            } else {
                labelType.text  = `${playersCount}P`;
            }

            const info              = await UserModel.getUserMpwStatisticsData(data.userId, warType, playersCount);
            const winCount          = info ? info.wins || 0 : 0;
            const loseCount         = info ? info.loses || 0 : 0;
            const drawCount         = info ? info.draws || 0 : 0;
            const totalCount        = winCount + loseCount + drawCount;
            this._labelWin.text     = `${winCount}`;
            this._labelLose.text    = `${loseCount}`;
            this._labelDraw.text    = `${drawCount}`;
            this._labelRatio.text   = totalCount ? Helpers.formatString(`%.2f`, winCount / totalCount * 100) : `--`;
        }
    }
}

// export default TwnsUserPanel;
