
namespace TinyWars.User {
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;
    import WarType          = Types.WarType;

    type OpenDataForUserPanel = {
        userId  : number;
    }
    export class UserPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserPanel;

        private readonly _imgMask           : GameUi.UiImage;
        private readonly _group             : eui.Group;
        private readonly _labelTitle        : GameUi.UiLabel;

        private readonly _groupButtons      : GameUi.UiButton;
        private readonly _btnChat           : GameUi.UiButton;
        private readonly _btnClose          : GameUi.UiButton;

        private readonly _labelStdRankScoreTitle    : GameUi.UiLabel;
        private readonly _labelStdRankScore         : GameUi.UiLabel;
        private readonly _labelStdRankRankTitle     : GameUi.UiLabel;
        private readonly _labelStdRankRank          : GameUi.UiLabel;
        private readonly _labelStdRankRankSuffix    : GameUi.UiLabel;
        private readonly _labelFogRankScoreTitle    : GameUi.UiLabel;
        private readonly _labelFogRankScore         : GameUi.UiLabel;
        private readonly _labelFogRankRankTitle     : GameUi.UiLabel;
        private readonly _labelFogRankRank          : GameUi.UiLabel;
        private readonly _labelFogRankRankSuffix    : GameUi.UiLabel;

        private readonly _labelRegisterTimeTitle    : GameUi.UiLabel;
        private readonly _labelRegisterTime1        : GameUi.UiLabel;
        private readonly _labelRegisterTime2        : GameUi.UiLabel;
        private readonly _labelLastLoginTimeTitle   : GameUi.UiLabel;
        private readonly _labelLastLoginTime1       : GameUi.UiLabel;
        private readonly _labelLastLoginTime2       : GameUi.UiLabel;
        private readonly _labelOnlineTimeTitle      : GameUi.UiLabel;
        private readonly _labelOnlineTime           : GameUi.UiLabel;
        private readonly _labelLoginCountTitle      : GameUi.UiLabel;
        private readonly _labelLoginCount           : GameUi.UiLabel;
        private readonly _labelUserId               : GameUi.UiLabel;
        private readonly _labelDiscordId            : GameUi.UiLabel;

        private readonly _labelHistoryStd           : GameUi.UiLabel;
        private readonly _labelHistoryStdWin        : GameUi.UiLabel;
        private readonly _labelHistoryStdLose       : GameUi.UiLabel;
        private readonly _labelHistoryStdDraw       : GameUi.UiLabel;
        private readonly _labelHistoryStdRatio      : GameUi.UiLabel;
        private readonly _labelHistoryFog           : GameUi.UiLabel;
        private readonly _labelHistoryFogWin        : GameUi.UiLabel;
        private readonly _labelHistoryFogLose       : GameUi.UiLabel;
        private readonly _labelHistoryFogDraw       : GameUi.UiLabel;
        private readonly _labelHistoryFogRatio      : GameUi.UiLabel;

        private readonly _sclHistoryStd             : GameUi.UiScrollList;
        private readonly _sclHistoryFog             : GameUi.UiScrollList;

        private _userId: number;

        public static show(openData: OpenDataForUserPanel): void {
            if (!UserPanel._instance) {
                UserPanel._instance = new UserPanel();
            }
            UserPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (UserPanel._instance) {
                await UserPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/user/UserPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserGetPublicInfo,   callback: this._onMsgUserGetPublicInfo },
                { type: Notify.Type.MsgUserSetNickname,     callback: this._onMsgUserSetNickname },
                { type: Notify.Type.MsgUserSetDiscordId,    callback: this._onMsgUserSetDiscordId },
            ]);
            this._setUiListenerArray([
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnClose,           callback: this.close },
            ]);
            this._sclHistoryStd.setItemRenderer(HistoryRenderer);
            this._sclHistoryFog.setItemRenderer(HistoryRenderer);

            this._showOpenAnimation();

            const userId    = this._getOpenData<OpenDataForUserPanel>().userId;
            this._userId    = userId;
            UserProxy.reqUserGetPublicInfo(userId);

            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._sclHistoryStd.clear();
            this._sclHistoryFog.clear();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onMsgUserGetPublicInfo(e: egret.Event): void {
            this._updateView();
        }
        private _onMsgUserSetNickname(e: egret.Event): void {
            const userId = this._userId;
            if (userId === UserModel.getSelfUserId()) {
                UserProxy.reqUserGetPublicInfo(this._userId);
            }
        }
        private _onMsgUserSetDiscordId(e: egret.Event): void {
            const userId = this._userId;
            if (userId === UserModel.getSelfUserId()) {
                UserProxy.reqUserGetPublicInfo(this._userId);
            }
        }
        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            const userId = this._userId;
            this.close();
            Chat.ChatPanel.show({ toUserId: userId });
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
                waitTime    : 0,
                tweenTime   : 200,
            });

            const group = this._group;
            egret.Tween.removeTweens(group);
            egret.Tween.get(group)
                .set({ alpha: 0, y: 40 })
                .to({ alpha: 1, y: 0 }, 200);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    waitTime    : 0,
                    tweenTime   : 200,
                });

                const group = this._group;
                egret.Tween.removeTweens(group);
                egret.Tween.get(group)
                    .set({ alpha: 1, y: 0 })
                    .to({ alpha: 0, y: 40 }, 200)
                    .call(resolve);
            });
        }

        private async _updateView(): Promise<void> {
            const userId    = this._userId;
            const info      = userId != null ? await UserModel.getUserPublicInfo(userId) : undefined;
            if (info) {
                const registerTime              = info.registerTime;
                this._labelRegisterTime1.text   = Helpers.getTimestampShortText(registerTime, { hour: false, minute: false, second: false });
                this._labelRegisterTime2.text   = Helpers.getTimestampShortText(registerTime, { year: false, month: false, date: false });

                const loginTime                 = info.lastLoginTime;
                this._labelLastLoginTime1.text  = Helpers.getTimestampShortText(loginTime, { hour: false, minute: false, second: false });
                this._labelLastLoginTime2.text  = Helpers.getTimestampShortText(loginTime, { year: false, month: false, date: false });
                this._labelLoginCount.text      = `${info.loginCount}`;
                this._labelUserId.text          = `${userId}`;
                this._labelDiscordId.text       = info.discordId || "--";
            }

            this._updateComponentsForLanguage();
            this._updateLabelOnlineTime();
            this._updateGroupButtons();
        }

        private async _updateGroupButtons(): Promise<void> {
            const group = this._groupButtons;
            group.removeChildren();
            if (this._userId !== UserModel.getSelfUserId()) {
                group.addChild(this._btnChat);
            }
            group.addChild(this._btnClose);
        }

        private _updateComponentsForLanguage(): void {
            this._labelStdRankScoreTitle.text   = Lang.getText(Lang.Type.B0198);
            this._labelStdRankRankTitle.text    = Lang.getText(Lang.Type.B0546);
            this._labelFogRankScoreTitle.text   = Lang.getText(Lang.Type.B0199);
            this._labelFogRankRankTitle.text    = Lang.getText(Lang.Type.B0547);
            this._labelRegisterTimeTitle.text   = Lang.getText(Lang.Type.B0194);
            this._labelLastLoginTimeTitle.text  = Lang.getText(Lang.Type.B0195);
            this._labelOnlineTimeTitle.text     = Lang.getText(Lang.Type.B0196);
            this._labelLoginCountTitle.text     = Lang.getText(Lang.Type.B0197);
            this._labelHistoryStd.text          = Lang.getText(Lang.Type.B0548);
            this._labelHistoryStdWin.text       = Lang.getText(Lang.Type.B0550);
            this._labelHistoryStdLose.text      = Lang.getText(Lang.Type.B0551);
            this._labelHistoryStdDraw.text      = Lang.getText(Lang.Type.B0552);
            this._labelHistoryStdRatio.text     = Lang.getText(Lang.Type.B0553);
            this._labelHistoryFog.text          = Lang.getText(Lang.Type.B0549);
            this._labelHistoryFogWin.text       = Lang.getText(Lang.Type.B0550);
            this._labelHistoryFogLose.text      = Lang.getText(Lang.Type.B0551);
            this._labelHistoryFogDraw.text      = Lang.getText(Lang.Type.B0552);
            this._labelHistoryFogRatio.text     = Lang.getText(Lang.Type.B0553);

            this._btnClose.label                = `${Lang.getText(Lang.Type.B0204)}`;
            this._updateLabelTitle();
            this._updateComponentsForStdRank();
            this._updateComponentsForFogRank();
            this._updateSclHistoryStd();
            this._updateSclHistoryFog();
            this._updateBtnChat();
        }

        private async _updateLabelTitle(): Promise<void> {
            const nickname          = await UserModel.getUserNickname(this._userId);
            this._labelTitle.text   = Lang.getFormattedText(Lang.Type.F0009, nickname);
        }
        private async _updateComponentsForStdRank(): Promise<void> {
            const data                      = await UserModel.getRankScoreData(this._userId, WarType.MrwStd, 2);
            const rawScore                  = data ? data.currentScore : null;
            const score                     = rawScore != null ? rawScore : CommonConstants.RankInitialScore;
            const rankName                  = `(${ConfigManager.getRankName(ConfigManager.getLatestFormalVersion(), score)})`;
            this._labelStdRankScore.text    = `${score} ${rankName}`;

            const rank                          = data ? data.currentRank : null;
            this._labelStdRankRank.text         = rank == null ? `--` : `${rank}`;
            this._labelStdRankRankSuffix.text   = getSuffixForRank(rank);
        }
        private async _updateComponentsForFogRank(): Promise<void> {
            const data                      = await UserModel.getRankScoreData(this._userId, WarType.MrwFog, 2);
            const rawScore                  = data ? data.currentScore : null;
            const score                     = rawScore != null ? rawScore : CommonConstants.RankInitialScore;
            const rankName                  = `(${ConfigManager.getRankName(ConfigManager.getLatestFormalVersion(), score)})`;
            this._labelFogRankScore.text    = `${score} ${rankName}`;

            const rank                          = data ? data.currentRank : null;
            this._labelFogRankRank.text         = rank == null ? `--` : `${rank}`;
            this._labelFogRankRankSuffix.text   = getSuffixForRank(rank);
        }
        private _updateSclHistoryStd(): void {
            const userId    = this._userId;
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
            const userId    = this._userId;
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
                    warType     : WarType.McwFog,
                    playersCount,
                });
            }
            dataList[dataList.length - 1].showBottom = true;
            this._sclHistoryFog.bindData(dataList);
        }
        private async _updateLabelOnlineTime(): Promise<void> {
            const info                  = await UserModel.getUserPublicInfo(this._userId);
            this._labelOnlineTime.text  = info ? Helpers.getTimeDurationText2(info.onlineTime) : `???`;
        }
        private _updateBtnChat(): void {
            this._btnChat.label = Lang.getText(Lang.Type.B0383);
        }
    }

    type DataForHistoryRenderer = {
        index       : number;
        userId      : number;
        warType     : WarType;
        playersCount: number;
        showBottom? : boolean;
    }

    class HistoryRenderer extends GameUi.UiListItemRenderer {
        private readonly _imgBg         : TinyWars.GameUi.UiImage;
        private readonly _labelType     : TinyWars.GameUi.UiLabel;
        private readonly _labelWin      : TinyWars.GameUi.UiLabel;
        private readonly _labelLose     : TinyWars.GameUi.UiLabel;
        private readonly _labelDraw     : TinyWars.GameUi.UiLabel;
        private readonly _labelRatio    : TinyWars.GameUi.UiLabel;
        private readonly _imgBottom     : TinyWars.GameUi.UiImage;

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            const data              = this.data as DataForHistoryRenderer;
            this._imgBg.alpha       = data.index % 2 === 0 ? 0.2 : 0.5;
            this._imgBottom.visible = !!data.showBottom;

            const warType       = data.warType;
            const playersCount  = data.playersCount;
            const labelType     = this._labelType;
            if ((warType === WarType.MrwFog) || (warType === WarType.MrwStd)) {
                labelType.text = Lang.getText(Lang.Type.B0554);
            } else {
                labelType.text  = `${playersCount}P`;
            }

            const info              = await UserModel.getUserWarStatisticsData(data.userId, warType, playersCount);
            const winCount          = info ? info.wins : 0;
            const loseCount         = info ? info.loses : 0;
            const drawCount         = info ? info.draws : 0;
            const totalCount        = winCount + loseCount + drawCount;
            this._labelWin.text     = `${winCount}`;
            this._labelLose.text    = `${loseCount}`;
            this._labelDraw.text    = `${drawCount}`;
            this._labelRatio.text   = totalCount ? Helpers.formatString(`%.2f`, winCount / totalCount * 100) : `--`;
        }
    }

    function getSuffixForRank(rank: number): string {
        if (rank == null) {
            return undefined;
        } else {
            if (Math.floor(rank / 10) % 10 === 1) {
                return `th`;
            } else {
                const num = rank % 10;
                if (num === 1) {
                    return `st`;
                } else if (num === 2) {
                    return `nd`;
                } else if (num === 3) {
                    return `rd`;
                } else {
                    return `th`;
                }
            }
        }
    }
}
