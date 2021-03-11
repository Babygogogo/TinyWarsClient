
namespace TinyWars.User {
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import LocalStorage     = Utility.LocalStorage;
    import ConfigManager    = Utility.ConfigManager;
    import WarType          = Types.WarType;
    import CommonConstants  = Utility.CommonConstants;

    type OpenDataForUserPanel = {
        userId  : number;
    }
    export class UserPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserPanel;

        private _group                      : eui.Group;
        private _labelTitle                 : GameUi.UiLabel;
        private _btnClose                   : GameUi.UiButton;

        private _scroller                   : eui.Scroller;
        private _labelStdRankTitle          : GameUi.UiLabel;
        private _labelStdRankScore          : GameUi.UiLabel;
        private _labelFogRankTitle          : GameUi.UiLabel;
        private _labelFogRankScore          : GameUi.UiLabel;

        private _labelRegisterTimeTitle     : GameUi.UiLabel;
        private _labelRegisterTime          : GameUi.UiLabel;
        private _labelLastLoginTimeTitle    : GameUi.UiLabel;
        private _labelLastLoginTime         : GameUi.UiLabel;
        private _labelOnlineTimeTitle       : GameUi.UiLabel;
        private _labelOnlineTime            : GameUi.UiLabel;
        private _labelLoginCountTitle       : GameUi.UiLabel;
        private _labelLoginCount            : GameUi.UiLabel;
        private _labelUserId                : GameUi.UiLabel;
        private _labelDiscordId             : GameUi.UiLabel;

        private _labelHistoryTitle          : GameUi.UiLabel;
        private _sclHistory                 : GameUi.UiScrollList;

        private _groupButtons               : eui.Group;
        private _btnChangeNickname          : GameUi.UiButton;
        private _btnChangePassword          : GameUi.UiButton;
        private _btnChangeDiscordId         : GameUi.UiButton;
        private _btnRankList                : GameUi.UiButton;
        private _btnShowOnlineUsers         : GameUi.UiButton;
        private _btnChangeLanguage          : GameUi.UiButton;
        private _btnSetSound                : GameUi.UiButton;
        private _btnServerStatus            : GameUi.UiButton;
        private _btnChat                    : GameUi.UiButton;
        private _btnComplaint               : GameUi.UiButton;
        private _btnSwitchTexture           : GameUi.UiButton;
        private _btnUnitsInfo               : GameUi.UiButton;
        private _btnChangeLog               : GameUi.UiButton;
        private _btnSetPrivilege            : GameUi.UiButton;
        private _btnMapManagement           : GameUi.UiButton;

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
                { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAndTileTextureVersionChanged,   callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: Notify.Type.MsgUserGetPublicInfo,               callback: this._onMsgUserGetPublicInfo },
                { type: Notify.Type.MsgUserSetNickname,                 callback: this._onMsgUserSetNickname },
                { type: Notify.Type.MsgUserSetDiscordId,                callback: this._onMsgUserSetDiscordId },
            ]);
            this._setUiListenerArray([
                { ui: this._btnChangeNickname,  callback: this._onTouchedBtnChangeNickname },
                { ui: this._btnChangePassword,  callback: this._onTouchedBtnChangePassword },
                { ui: this._btnChangeDiscordId, callback: this._onTouchedBtnChangeDiscordId },
                { ui: this._btnRankList,        callback: this._onTouchedBtnRankList },
                { ui: this._btnShowOnlineUsers, callback: this._onTouchedBtnShowOnlineUsers },
                { ui: this._btnChangeLanguage,  callback: this._onTouchedBtnChangeLanguage },
                { ui: this._btnSetSound,        callback: this._onTouchedBtnSetSound },
                { ui: this._btnServerStatus,    callback: this._onTouchedBtnServerStatus },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnComplaint,       callback: this._onTouchedBtnComplaint },
                { ui: this._btnSwitchTexture,   callback: this._onTouchedBtnSwitchTexture },
                { ui: this._btnUnitsInfo,       callback: this._onTouchedBtnUnitsInfo },
                { ui: this._btnChangeLog,       callback: this._onTouchedBtnChangeLog },
                { ui: this._btnSetPrivilege,    callback: this._onTouchedBtnSetPrivilege },
                { ui: this._btnMapManagement,   callback: this._onTouchedBtnMapManagement },
                { ui: this._btnClose,           callback: this.close },
            ]);
            this._sclHistory.setItemRenderer(HistoryRenderer);

            this._showOpenAnimation();

            const userId    = this._getOpenData<OpenDataForUserPanel>().userId;
            this._userId    = userId;
            UserProxy.reqUserGetPublicInfo(userId);

            this._scroller.viewport.scrollV = 0;
            this._updateView();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyUnitAndTileTextureVersionChanged(e: egret.Event): void {
            this._updateBtnSwitchTexture();
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
        private _onTouchedBtnChangeNickname(e: egret.TouchEvent): void {
            UserChangeNicknamePanel.show();
        }
        private _onTouchedBtnChangePassword(e: egret.TouchEvent): void {
            UserSetPasswordPanel.show();
        }
        private _onTouchedBtnChangeDiscordId(e: egret.TouchEvent): void {
            UserChangeDiscordIdPanel.show();
        }
        private _onTouchedBtnRankList(e: egret.TouchEvent): void {
            Common.CommonRankListPanel.show();
        }
        private _onTouchedBtnShowOnlineUsers(e: egret.TouchEvent): void {
            UserOnlineUsersPanel.show();
        }
        private _onTouchedBtnChangeLanguage(e: egret.TouchEvent): void {
            const languageType = Lang.getCurrentLanguageType() === Types.LanguageType.Chinese
                ? Types.LanguageType.English
                : Types.LanguageType.Chinese;
            Lang.setLanguageType(languageType);
            LocalStorage.setLanguageType(languageType);

            Notify.dispatch(Notify.Type.LanguageChanged);
        }
        private _onTouchedBtnSetSound(e: egret.TouchEvent): void {
            UserSetSoundPanel.show();
        }
        private _onTouchedBtnServerStatus(e: egret.TouchEvent): void {
            Common.CommonServerStatusPanel.show();
        }
        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            const userId = this._userId;
            this.close();
            Chat.ChatPanel.show({ toUserId: userId });
        }
        private _onTouchedBtnComplaint(e: egret.TouchEvent): void {
            this.close();
            Chat.ChatPanel.show({ toUserId: CommonConstants.AdminUserId });
        }
        private _onTouchedBtnSwitchTexture(e: egret.TouchEvent): void {
            User.UserProxy.reqUserSetSettings({
                unitAndTileTextureVersion   : User.UserModel.getSelfSettingsTextureVersion() === Types.UnitAndTileTextureVersion.V0
                    ? Types.UnitAndTileTextureVersion.V1
                    : Types.UnitAndTileTextureVersion.V0,
            });
        }
        private _onTouchedBtnUnitsInfo(e: egret.TouchEvent): void {
            Common.CommonDamageChartPanel.show();
        }
        private _onTouchedBtnChangeLog(e: egret.TouchEvent): void {
            ChangeLog.ChangeLogPanel.show();
        }
        private _onTouchedBtnSetPrivilege(e: egret.TouchEvent): void {
            UserSetPrivilegePanel.show({ userId: this._userId });
        }
        private _onTouchedBtnMapManagement(e: egret.TouchEvent): void {
            Utility.StageManager.closeAllPanels();
            Lobby.LobbyBackgroundPanel.show();
            MapManagement.MmMainMenuPanel.show();
        }

        private _showOpenAnimation(): void {
            const group = this._group;
            egret.Tween.removeTweens(group);
            egret.Tween.get(group)
                .set({ alpha: 0, y: 40 })
                .to({ alpha: 1, y: 0 }, 200);
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
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
                this._labelRegisterTime.text    = Helpers.getTimestampShortText(info.registerTime);
                this._labelLastLoginTime.text   = Helpers.getTimestampShortText(info.lastLoginTime);
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
            if (this._userId === UserModel.getSelfUserId()) {
                group.addChild(this._btnChangePassword);
                group.addChild(this._btnChangeNickname);
                group.addChild(this._btnChangeDiscordId);
                group.addChild(this._btnComplaint);
            } else {
                group.addChild(this._btnChat);
            }
            group.addChild(this._btnRankList);
            group.addChild(this._btnShowOnlineUsers);
            group.addChild(this._btnChangeLanguage);
            group.addChild(this._btnSetSound);
            group.addChild(this._btnSwitchTexture);
            group.addChild(this._btnUnitsInfo);
            group.addChild(this._btnChangeLog);
            group.addChild(this._btnServerStatus);
            if (await UserModel.getIsSelfAdmin()) {
                group.addChild(this._btnSetPrivilege);
            }
            if ((await UserModel.getIsSelfAdmin()) || (await UserModel.getIsSelfMapCommittee())) {
                group.addChild(this._btnMapManagement);
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelStdRankTitle.text        = `${Lang.getText(Lang.Type.B0198)}:`;
            this._labelFogRankTitle.text        = `${Lang.getText(Lang.Type.B0199)}:`;
            this._labelRegisterTimeTitle.text   = `${Lang.getText(Lang.Type.B0194)}:`;
            this._labelLastLoginTimeTitle.text  = `${Lang.getText(Lang.Type.B0195)}:`;
            this._labelOnlineTimeTitle.text     = `${Lang.getText(Lang.Type.B0196)}:`;
            this._labelLoginCountTitle.text     = `${Lang.getText(Lang.Type.B0197)}:`;
            this._labelHistoryTitle.text        = `${Lang.getText(Lang.Type.B0201)}:`;
            this._btnClose.label                = `${Lang.getText(Lang.Type.B0204)}`;
            this._updateLabelTitle();
            this._updateLabelStdRankScore();
            this._updateLabelFogRankScore();
            this._updateSclHistory();

            this._updateBtnChangeNickname();
            this._updateBtnChangePassword();
            this._updateBtnChangeDiscordId();
            this._updateBtnRankList();
            this._updateBtnShowOnlineUsers();
            this._updateBtnChangeLanguage();
            this._updateBtnSetSound();
            this._updateBtnSwitchTexture();
            this._updateBtnUnitsInfo();
            this._updateBtnChangeLog();
            this._updateBtnSetPrivilege();
            this._updateBtnServerStatus();
            this._updateBtnChat();
            this._updateBtnComplaint();
            this._updateBtnMapManagement();
        }

        private async _updateLabelTitle(): Promise<void> {
            const nickname          = await UserModel.getUserNickname(this._userId);
            this._labelTitle.text   = Lang.getFormattedText(Lang.Type.F0009, nickname);
        }
        private async _updateLabelStdRankScore(): Promise<void> {
            const data                      = await UserModel.getRankScoreData(this._userId, WarType.MrwStd, 2);
            const rawScore                  = data ? data.currentScore : null;
            const score                     = rawScore != null ? rawScore : CommonConstants.RankInitialScore;
            const rank                      = data ? data.currentRank : null;
            const rankText                  = `(${rank == null ? Lang.getText(Lang.Type.B0435) : `No.${rank}`})`;
            const rankName                  = `(${ConfigManager.getRankName(ConfigManager.getLatestFormalVersion(), score)})`;
            this._labelStdRankScore.text    = `${score} ${rankText} ${rankName}`;
        }
        private async _updateLabelFogRankScore(): Promise<void> {
            const data                      = await UserModel.getRankScoreData(this._userId, WarType.MrwFog, 2);
            const rawScore                  = data ? data.currentScore : null;
            const score                     = rawScore != null ? rawScore : CommonConstants.RankInitialScore;
            const rank                      = data ? data.currentRank : null;
            const rankText                  = `(${rank == null ? Lang.getText(Lang.Type.B0435) : `No.${rank}`})`;
            const rankName                  = `(${ConfigManager.getRankName(ConfigManager.getLatestFormalVersion(), score)})`;
            this._labelFogRankScore.text    = `${score} ${rankText} ${rankName}`;
        }
        private async _updateSclHistory(): Promise<void> {
            const userId    = this._userId;
            const dataList  : DataForHistoryRenderer[] = [
                {
                    userId,
                    warType     : WarType.MrwStd,
                    playersCount: 2,
                },
                {
                    userId,
                    warType     : WarType.MrwFog,
                    playersCount: 2,
                },
            ];
            for (let playersCount = 2; playersCount <= CommonConstants.WarMaxPlayerIndex; ++playersCount) {
                dataList.push({
                    userId,
                    warType     : WarType.McwStd,
                    playersCount,
                }, {
                    userId,
                    warType     : WarType.McwFog,
                    playersCount,
                });
            }
            this._sclHistory.bindData(dataList);
        }
        private async _updateLabelOnlineTime(): Promise<void> {
            const info                  = await UserModel.getUserPublicInfo(this._userId);
            this._labelOnlineTime.text  = info ? Helpers.getTimeDurationText2(info.onlineTime) : `???`;
        }
        private _updateBtnChangeNickname(): void {
            this._btnChangeNickname.label = Lang.getText(Lang.Type.B0149);
        }
        private _updateBtnChangePassword(): void {
            this._btnChangePassword.label = Lang.getText(Lang.Type.B0426);
        }
        private _updateBtnChangeDiscordId(): void {
            this._btnChangeDiscordId.label = Lang.getText(Lang.Type.B0150);
        }
        private _updateBtnRankList(): void {
            this._btnRankList.label = Lang.getText(Lang.Type.B0436);
        }
        private _updateBtnShowOnlineUsers(): void {
            this._btnShowOnlineUsers.label = Lang.getText(Lang.Type.B0151);
        }
        private _updateBtnChangeLanguage(): void {
            this._btnChangeLanguage.label = Lang.getCurrentLanguageType() === Types.LanguageType.Chinese
                ? Lang.getText(Lang.Type.B0148, Types.LanguageType.English)
                : Lang.getText(Lang.Type.B0148, Types.LanguageType.Chinese);
        }
        private _updateBtnSetSound(): void {
            this._btnSetSound.label = Lang.getText(Lang.Type.B0540);
        }
        private _updateBtnSwitchTexture(): void {
            this._btnSwitchTexture.label = User.UserModel.getSelfSettingsTextureVersion() === Types.UnitAndTileTextureVersion.V0
                ? Lang.getText(Lang.Type.B0386)
                : Lang.getText(Lang.Type.B0385);
        }
        private _updateBtnUnitsInfo(): void {
            this._btnUnitsInfo.label = Lang.getText(Lang.Type.B0440);
        }
        private _updateBtnChangeLog(): void {
            this._btnChangeLog.label = Lang.getText(Lang.Type.B0457);
        }
        private _updateBtnSetPrivilege(): void {
            this._btnSetPrivilege.label = Lang.getText(Lang.Type.B0460);
        }
        private _updateBtnServerStatus(): void {
            this._btnServerStatus.label = Lang.getText(Lang.Type.B0327);
        }
        private _updateBtnChat(): void {
            this._btnChat.label = Lang.getText(Lang.Type.B0383);
        }
        private _updateBtnComplaint(): void {
            this._btnComplaint.label = Lang.getText(Lang.Type.B0453);
        }
        private _updateBtnMapManagement(): void {
            this._btnMapManagement.label = Lang.getText(Lang.Type.B0192);
        }
    }

    type DataForHistoryRenderer = {
        userId      : number;
        warType     : WarType;
        playersCount: number;
    }

    class HistoryRenderer extends GameUi.UiListItemRenderer {
        private _labelType  : TinyWars.GameUi.UiLabel;
        private _labelCount : TinyWars.GameUi.UiLabel;

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            const data              = this.data as DataForHistoryRenderer;
            const warType           = data.warType;
            const playersCount      = data.playersCount;
            this._labelType.text    = `${playersCount}P ${Lang.getWarTypeName(warType)}`

            const info              = await UserModel.getUserWarStatisticsData(data.userId, warType, playersCount);
            this._labelCount.text   = info
                ? `${info.wins} / ${info.loses} / ${info.draws}`
                : `0 / 0 / 0`;
        }
    }
}
