
namespace TinyWars.User {
    import Lang                         = Utility.Lang;
    import Helpers                      = Utility.Helpers;
    import Notify                       = Utility.Notify;
    import Types                        = Utility.Types;
    import LocalStorage                 = Utility.LocalStorage;
    import ProtoTypes                   = Utility.ProtoTypes;
    import WarType                      = Types.WarType;
    import IDataForUserWarStatistics    = ProtoTypes.User.IDataForUserWarStatistics;

    export class UserPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserPanel;

        private _labelTitle         : GameUi.UiLabel;

        private _labelRankMatchTitle: GameUi.UiLabel;
        private _labelRankScoreTitle: GameUi.UiLabel;
        private _labelRankScore     : GameUi.UiLabel;
        private _labelRankName      : GameUi.UiLabel;
        private _labelRank2pWins    : GameUi.UiLabel;
        private _labelRank2pLoses   : GameUi.UiLabel;
        private _labelRank2pDraws   : GameUi.UiLabel;

        private _labelMcwTitle      : GameUi.UiLabel;
        private _labelMcw2pTitle    : GameUi.UiLabel;
        private _labelMcw3pTitle    : GameUi.UiLabel;
        private _labelMcw4pTitle    : GameUi.UiLabel;
        private _labelMcw2pWins     : GameUi.UiLabel;
        private _labelMcw2pLoses    : GameUi.UiLabel;
        private _labelMcw2pDraws    : GameUi.UiLabel;
        private _labelMcw3pWins     : GameUi.UiLabel;
        private _labelMcw3pLoses    : GameUi.UiLabel;
        private _labelMcw3pDraws    : GameUi.UiLabel;
        private _labelMcw4pWins     : GameUi.UiLabel;
        private _labelMcw4pLoses    : GameUi.UiLabel;
        private _labelMcw4pDraws    : GameUi.UiLabel;

        private _labelRegisterTimeTitle : GameUi.UiLabel;
        private _labelLastLoginTimeTitle: GameUi.UiLabel;
        private _labelOnlineTimeTitle   : GameUi.UiLabel;
        private _labelLoginCountTitle   : GameUi.UiLabel;
        private _labelRegisterTime      : GameUi.UiLabel;
        private _labelLastLoginTime     : GameUi.UiLabel;
        private _labelOnlineTime        : GameUi.UiLabel;
        private _labelLoginCount        : GameUi.UiLabel;
        private _labelUserId            : GameUi.UiLabel;
        private _labelDiscordId         : GameUi.UiLabel;

        private _groupButtons       : eui.Group;
        private _btnChangeDiscordId : GameUi.UiButton;
        private _btnChangeNickname  : GameUi.UiButton;
        private _btnShowOnlineUsers : GameUi.UiButton;
        private _btnChangeLanguage  : GameUi.UiButton;
        private _btnServerStatus    : GameUi.UiButton;
        private _btnChat            : GameUi.UiButton;
        private _btnSwitchTexture   : GameUi.UiButton;
        private _btnClose           : GameUi.UiButton;

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
                { type: Notify.Type.MsgUserGetPublicInfo,                 callback: this._onNotifySGetUserPublicInfo },
                { type: Notify.Type.MsgUserSetNickname,                callback: this._onNotifySUserChangeNickname },
                { type: Notify.Type.MsgUserSetDiscordId,               callback: this._onNotifySUserChangeDiscordId },
                { type: Notify.Type.UnitAndTileTextureVersionChanged,   callback: this._onNotifyUnitAndTileTextureVersionChanged },
            ];
            this._uiListeners = [
                { ui: this._btnChangeNickname,  callback: this._onTouchedBtnChangeNickname },
                { ui: this._btnChangeDiscordId, callback: this._onTouchedBtnChangeDiscordId },
                { ui: this._btnShowOnlineUsers, callback: this._onTouchedBtnShowOnlineUsers },
                { ui: this._btnChangeLanguage,  callback: this._onTouchedBtnChangeLanguage },
                { ui: this._btnServerStatus,    callback: this._onTouchedBtnServerStatus },
                { ui: this._btnChat,            callback: this._onTouchedBtnChat },
                { ui: this._btnSwitchTexture,   callback: this._onTouchedBtnSwitchTexture },
                { ui: this._btnClose,           callback: this.close },
            ];
        }
        protected _onOpened(): void {
            UserProxy.reqUserGetPublicInfo(this._userId);

            this._updateView();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyUnitAndTileTextureVersionChanged(e: egret.Event): void {
            this._updateBtnSwitchTexture();
        }
        private _onNotifySGetUserPublicInfo(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifySUserChangeNickname(e: egret.Event): void {
            const userId = this._userId;
            if (userId === UserModel.getSelfUserId()) {
                UserProxy.reqUserGetPublicInfo(this._userId);
            }
        }
        private _onNotifySUserChangeDiscordId(e: egret.Event): void {
            const userId = this._userId;
            if (userId === UserModel.getSelfUserId()) {
                UserProxy.reqUserGetPublicInfo(this._userId);
            }
        }
        private _onTouchedBtnChangeNickname(e: egret.TouchEvent): void {
            UserChangeNicknamePanel.show();
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

        private async _updateView(): Promise<void> {
            const userId    = this._userId;
            const info      = userId != null ? await UserModel.getUserPublicInfo(userId) : undefined;
            if (info) {
                this._labelRankScore.text       = "";   // `${info.rank2pScore}`; // TODO
                this._labelRegisterTime.text    = Helpers.getTimestampShortText(info.registerTime);
                this._labelLastLoginTime.text   = Helpers.getTimestampShortText(info.lastLoginTime);
                this._labelLoginCount.text      = `${info.loginCount}`;
                this._labelUserId.text          = `${userId}`;
                this._labelDiscordId.text       = info.discordId || "--";
            }

            this._updateComponentsForLanguage();
            this._updateGroupButtons();
        }

        private _updateGroupButtons(): void {
            const group = this._groupButtons;
            group.removeChildren();
            if (this._userId === UserModel.getSelfUserId()) {
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
            this._labelRankMatchTitle.text      = `${Lang.getText(Lang.Type.B0198)}:`;
            this._labelRankScoreTitle.text      = `${Lang.getText(Lang.Type.B0199)}:`;
            this._labelRegisterTimeTitle.text   = `${Lang.getText(Lang.Type.B0194)}:`;
            this._labelLastLoginTimeTitle.text  = `${Lang.getText(Lang.Type.B0195)}:`;
            this._labelOnlineTimeTitle.text     = `${Lang.getText(Lang.Type.B0196)}:`;
            this._labelLoginCountTitle.text     = `${Lang.getText(Lang.Type.B0197)}:`;
            this._labelMcwTitle.text            = `${Lang.getText(Lang.Type.B0200)}:`;
            this._labelMcw2pTitle.text          = `${Lang.getText(Lang.Type.B0201)}:`;
            this._labelMcw3pTitle.text          = `${Lang.getText(Lang.Type.B0202)}:`;
            this._labelMcw4pTitle.text          = `${Lang.getText(Lang.Type.B0203)}:`;
            this._btnClose.label                = `${Lang.getText(Lang.Type.B0204)}`;

            this._updateLabelsForLanguage();
            this._updateBtnChangeNickname();
            this._updateBtnChangeDiscordId();
            this._updateBtnShowOnlineUsers();
            this._updateBtnChangeLanguage();
            this._updateBtnSwitchTexture();
            this._updateBtnServerStatus();
            this._updateBtnChat();
        }
        private async _updateLabelsForLanguage(): Promise<void> {
            const userId    = this._userId;
            const info      = userId != null ? await UserModel.getUserPublicInfo(userId) : undefined;
            if (info) {
                this._labelTitle.text       = Lang.getFormattedText(Lang.Type.F0009, info.nickname);
                this._labelOnlineTime.text  = Helpers.getTimeDurationText2(info.onlineTime);

                const warStatisticsList     = info.warStatisticsList || [];
                const rankNormal            = warStatisticsList.filter(v => v.warType === WarType.RmwStd) || [];
                const rankFog               = warStatisticsList.filter(v => v.warType === WarType.RmwFog) || [];
                this._labelRankName.text    = ""; // Utility.ConfigManager.getRankName(Utility.ConfigManager.getNewestConfigVersion(), info.rank2pScore);   // TODO
                updateLabelsForStatistics(this._labelRank2pWins, this._labelRank2pLoses, this._labelRank2pDraws, rankNormal.find(v => v.playersCount === 2), rankFog.find(v => v.playersCount === 2));

                const mcwNormal = warStatisticsList.filter(v => v.warType === WarType.McwStd) || [];
                const mcwFog    = warStatisticsList.filter(v => v.warType === WarType.McwStd) || [];
                updateLabelsForStatistics(this._labelMcw2pWins, this._labelMcw2pLoses, this._labelMcw2pDraws, mcwNormal.find(v => v.playersCount === 2), mcwFog.find(v => v.playersCount === 2));
                updateLabelsForStatistics(this._labelMcw3pWins, this._labelMcw3pLoses, this._labelMcw3pDraws, mcwNormal.find(v => v.playersCount === 3), mcwFog.find(v => v.playersCount === 3));
                updateLabelsForStatistics(this._labelMcw4pWins, this._labelMcw4pLoses, this._labelMcw4pDraws, mcwNormal.find(v => v.playersCount === 4), mcwFog.find(v => v.playersCount === 4));
            }
        }
        private _updateBtnChangeNickname(): void {
            this._btnChangeNickname.label = Lang.getText(Lang.Type.B0149);
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

    function updateLabelsForStatistics(
        lbWin           : GameUi.UiLabel,
        lbLose          : GameUi.UiLabel,
        lbDraw          : GameUi.UiLabel,
        dataForNormal   : IDataForUserWarStatistics,
        dataForFog      : IDataForUserWarStatistics
    ): void {
        lbWin.text  = `${dataForNormal ? dataForNormal.wins || 0 : 0} / ${dataForFog ? dataForFog.wins || 0 : 0}`;
        lbLose.text = `${dataForNormal ? dataForNormal.loses || 0 : 0} / ${dataForFog ? dataForFog.loses || 0 : 0}`;
        lbDraw.text = `${dataForNormal ? dataForNormal.draws || 0 : 0} / ${dataForFog ? dataForFog.draws || 0 : 0}`;
    }
}
