
namespace TinyWars.User {
    import Lang                         = Utility.Lang;
    import Helpers                      = Utility.Helpers;
    import Notify                       = Utility.Notify;
    import Types                        = Utility.Types;
    import LocalStorage                 = Utility.LocalStorage;
    import ProtoTypes                   = Utility.ProtoTypes;
    import ConfigManager                = Utility.ConfigManager;
    import WarType                      = Types.WarType;
    import IDataForUserWarStatistics    = ProtoTypes.User.IDataForUserWarStatistics;
    import CommonConstants              = ConfigManager.COMMON_CONSTANTS;

    export class UserPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserPanel;

        private _group                      : eui.Group;
        private _labelTitle                 : TinyWars.GameUi.UiLabel;
        private _btnClose                   : TinyWars.GameUi.UiButton;

        private _labelStdRankTitle          : TinyWars.GameUi.UiLabel;
        private _labelStdRankScore          : TinyWars.GameUi.UiLabel;
        private _labelFogRankTitle          : TinyWars.GameUi.UiLabel;
        private _labelFogRankScore          : TinyWars.GameUi.UiLabel;

        private _labelRegisterTimeTitle     : TinyWars.GameUi.UiLabel;
        private _labelRegisterTime          : TinyWars.GameUi.UiLabel;
        private _labelLastLoginTimeTitle    : TinyWars.GameUi.UiLabel;
        private _labelLastLoginTime         : TinyWars.GameUi.UiLabel;
        private _labelOnlineTimeTitle       : TinyWars.GameUi.UiLabel;
        private _labelOnlineTime            : TinyWars.GameUi.UiLabel;
        private _labelLoginCountTitle       : TinyWars.GameUi.UiLabel;
        private _labelLoginCount            : TinyWars.GameUi.UiLabel;
        private _labelUserId                : TinyWars.GameUi.UiLabel;
        private _labelDiscordId             : TinyWars.GameUi.UiLabel;

        private _labelHistoryTitle          : TinyWars.GameUi.UiLabel;
        private _sclHistory                 : TinyWars.GameUi.UiScrollList;

        private _groupButtons               : eui.Group;
        private _btnChangeNickname          : TinyWars.GameUi.UiButton;
        private _btnChangePassword          : TinyWars.GameUi.UiButton;
        private _btnChangeDiscordId         : TinyWars.GameUi.UiButton;
        private _btnShowOnlineUsers         : TinyWars.GameUi.UiButton;
        private _btnChangeLanguage          : TinyWars.GameUi.UiButton;
        private _btnServerStatus            : TinyWars.GameUi.UiButton;
        private _btnChat                    : TinyWars.GameUi.UiButton;
        private _btnSwitchTexture           : TinyWars.GameUi.UiButton;

        private _userId: number;

        public static show(userId: number): void {
            if (!UserPanel._instance) {
                UserPanel._instance = new UserPanel();
            }
            UserPanel._instance._userId = userId;
            UserPanel._instance.open();
        }

        public static hide(): void {
            if (UserPanel._instance) {
                UserPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/user/UserPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAndTileTextureVersionChanged,   callback: this._onNotifyUnitAndTileTextureVersionChanged },
                { type: Notify.Type.MsgUserGetPublicInfo,               callback: this._onMsgUserGetPublicInfo },
                { type: Notify.Type.MsgUserSetNickname,                 callback: this._onMsgUserSetNickname },
                { type: Notify.Type.MsgUserSetDiscordId,                callback: this._onMsgUserSetDiscordId },
            ];
            this._uiListeners = [
                { ui: this._btnChangeNickname,  callback: this._onTouchedBtnChangeNickname },
                { ui: this._btnChangePassword,  callback: this._onTouchedBtnChangePassword },
                { ui: this._btnChangeDiscordId, callback: this._onTouchedBtnChangeDiscordId },
                { ui: this._btnShowOnlineUsers, callback: this._onTouchedBtnShowOnlineUsers },
                { ui: this._btnChangeLanguage,  callback: this._onTouchedBtnChangeLanguage },
                { ui: this._btnServerStatus,    callback: this._onTouchedBtnServerStatus },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnSwitchTexture,   callback: this._onTouchedBtnSwitchTexture },
                { ui: this._btnClose,           callback: this.close },
            ];
            this._sclHistory.setItemRenderer(HistoryRenderer);
        }
        protected _onOpened(): void {
            this._showOpenAnimation();
            UserProxy.reqUserGetPublicInfo(this._userId);

            this._updateView();
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
        private _onTouchedBtnShowOnlineUsers(e: egret.TouchEvent): void {
            UserOnlineUsersPanel.show();
        }
        private _onTouchedBtnChangeLanguage(e: egret.TouchEvent): void {
            const languageType = Lang.getLanguageType() === Types.LanguageType.Chinese
                ? Types.LanguageType.English
                : Types.LanguageType.Chinese;
            Lang.setLanguageType(languageType);
            LocalStorage.setLanguageType(languageType);

            Notify.dispatch(Notify.Type.LanguageChanged);
        }
        private _onTouchedBtnServerStatus(e: egret.TouchEvent): void {
            Common.CommonServerStatusPanel.show();
        }
        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            const userId = this._userId;
            this.close();
            Chat.ChatPanel.show({ toUserId: userId });
        }
        private _onTouchedBtnSwitchTexture(e: egret.TouchEvent): void {
            const model = Common.CommonModel;
            model.setUnitAndTileTextureVersion(model.getUnitAndTileTextureVersion() === Types.UnitAndTileTextureVersion.V0
                ? Types.UnitAndTileTextureVersion.V1
                : Types.UnitAndTileTextureVersion.V0
            );
        }

        private _showOpenAnimation(): void {
            const group = this._group;
            egret.Tween.removeTweens(group);
            egret.Tween.get(group)
                .set({ alpha: 0, y: 40 })
                .to({ alpha: 1, y: 0 }, 200);
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

        private _updateGroupButtons(): void {
            const group = this._groupButtons;
            group.removeChildren();
            if (this._userId === UserModel.getSelfUserId()) {
                group.addChild(this._btnChangePassword);
                group.addChild(this._btnChangeNickname);
                group.addChild(this._btnChangeDiscordId);
            } else {
                group.addChild(this._btnChat);
            }
            group.addChild(this._btnShowOnlineUsers);
            group.addChild(this._btnChangeLanguage);
            group.addChild(this._btnSwitchTexture);
            group.addChild(this._btnServerStatus);
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
            this._updateBtnShowOnlineUsers();
            this._updateBtnChangeLanguage();
            this._updateBtnSwitchTexture();
            this._updateBtnServerStatus();
            this._updateBtnChat();
        }

        private async _updateLabelTitle(): Promise<void> {
            const nickname          = await UserModel.getUserNickname(this._userId);
            this._labelTitle.text   = Lang.getFormattedText(Lang.Type.F0009, nickname);
        }
        private async _updateLabelStdRankScore(): Promise<void> {
            const data                      = await UserModel.getRankScoreData(this._userId, WarType.RmwStd, 2);
            const rawScore                  = data ? data.currentScore : null;
            const score                     = rawScore != null ? rawScore : CommonConstants.RankInitialScore;
            this._labelStdRankScore.text    = `${score} (${ConfigManager.getRankName(ConfigManager.getLatestConfigVersion(), score)})`;
        }
        private async _updateLabelFogRankScore(): Promise<void> {
            const data                      = await UserModel.getRankScoreData(this._userId, WarType.RmwFog, 2);
            const rawScore                  = data ? data.currentScore : null;
            const score                     = rawScore != null ? rawScore : CommonConstants.RankInitialScore;
            this._labelFogRankScore.text    = `${score} (${ConfigManager.getRankName(ConfigManager.getLatestConfigVersion(), score)})`;
        }
        private async _updateSclHistory(): Promise<void> {
            const userId    = this._userId;
            const dataList  : DataForHistoryRenderer[] = [
                {
                    userId,
                    warType     : WarType.RmwStd,
                    playersCount: 2,
                },
                {
                    userId,
                    warType     : WarType.RmwFog,
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
        private _updateBtnShowOnlineUsers(): void {
            this._btnShowOnlineUsers.label = Lang.getText(Lang.Type.B0151);
        }
        private _updateBtnChangeLanguage(): void {
            this._btnChangeLanguage.label = Lang.getLanguageType() === Types.LanguageType.Chinese
                ? Lang.getTextWithLanguage(Lang.Type.B0148, Types.LanguageType.English)
                : Lang.getTextWithLanguage(Lang.Type.B0148, Types.LanguageType.Chinese);
        }
        private _updateBtnSwitchTexture(): void {
            this._btnSwitchTexture.label = Common.CommonModel.getUnitAndTileTextureVersion() === Types.UnitAndTileTextureVersion.V0
                ? Lang.getText(Lang.Type.B0386)
                : Lang.getText(Lang.Type.B0385);
        }
        private _updateBtnServerStatus(): void {
            this._btnServerStatus.label = Lang.getText(Lang.Type.B0327);
        }
        private _updateBtnChat(): void {
            this._btnChat.label = Lang.getText(Lang.Type.B0383);
        }
    }

    type DataForHistoryRenderer = {
        userId      : number;
        warType     : WarType;
        playersCount: number;
    }

    class HistoryRenderer extends eui.ItemRenderer {
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
