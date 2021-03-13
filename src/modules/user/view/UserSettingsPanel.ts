
namespace TinyWars.User {
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import Types            = Utility.Types;
    import LocalStorage     = Utility.LocalStorage;
    import CommonConstants  = Utility.CommonConstants;

    export class UserSettingsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: UserSettingsPanel;

        private readonly _imgMask               : GameUi.UiImage;
        private readonly _group                 : eui.Group;
        private readonly _scroller              : eui.Scroller;

        private readonly _groupButtons          : eui.Group;
        private readonly _btnChangeNickname     : GameUi.UiButton;
        private readonly _btnChangePassword     : GameUi.UiButton;
        private readonly _btnChangeDiscordId    : GameUi.UiButton;
        private readonly _btnRankList           : GameUi.UiButton;
        private readonly _btnShowOnlineUsers    : GameUi.UiButton;
        private readonly _btnChangeLanguage     : GameUi.UiButton;
        private readonly _btnSetSound           : GameUi.UiButton;
        private readonly _btnServerStatus       : GameUi.UiButton;
        private readonly _btnComplaint          : GameUi.UiButton;
        private readonly _btnSwitchTexture      : GameUi.UiButton;
        private readonly _btnUnitsInfo          : GameUi.UiButton;
        private readonly _btnChangeLog          : GameUi.UiButton;
        private readonly _btnSetPrivilege       : GameUi.UiButton;
        private readonly _btnMapManagement      : GameUi.UiButton;

        public static show(): void {
            if (!UserSettingsPanel._instance) {
                UserSettingsPanel._instance = new UserSettingsPanel();
            }
            UserSettingsPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (UserSettingsPanel._instance) {
                await UserSettingsPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/user/UserSettingsPanel.exml";
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
                { ui: this._btnComplaint,       callback: this._onTouchedBtnComplaint },
                { ui: this._btnSwitchTexture,   callback: this._onTouchedBtnSwitchTexture },
                { ui: this._btnUnitsInfo,       callback: this._onTouchedBtnUnitsInfo },
                { ui: this._btnChangeLog,       callback: this._onTouchedBtnChangeLog },
                { ui: this._btnSetPrivilege,    callback: this._onTouchedBtnSetPrivilege },
                { ui: this._btnMapManagement,   callback: this._onTouchedBtnMapManagement },
            ]);

            this._showOpenAnimation();

            UserProxy.reqUserGetPublicInfo(UserModel.getSelfUserId());

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
            UserProxy.reqUserGetPublicInfo(UserModel.getSelfUserId());
        }
        private _onMsgUserSetDiscordId(e: egret.Event): void {
            UserProxy.reqUserGetPublicInfo(UserModel.getSelfUserId());
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
            UserSetPrivilegePanel.show({ userId: UserModel.getSelfUserId() });
        }
        private _onTouchedBtnMapManagement(e: egret.TouchEvent): void {
            Utility.StageManager.closeAllPanels();
            Lobby.LobbyBackgroundPanel.show();
            MapManagement.MmMainMenuPanel.show();
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
            this._updateComponentsForLanguage();
            this._updateGroupButtons();
        }

        private async _updateGroupButtons(): Promise<void> {
            const group = this._groupButtons;
            group.removeChildren();
            group.addChild(this._btnChangePassword);
            group.addChild(this._btnChangeNickname);
            group.addChild(this._btnChangeDiscordId);
            group.addChild(this._btnComplaint);
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
            this._updateBtnComplaint();
            this._updateBtnMapManagement();
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
        private _updateBtnComplaint(): void {
            this._btnComplaint.label = Lang.getText(Lang.Type.B0453);
        }
        private _updateBtnMapManagement(): void {
            this._btnMapManagement.label = Lang.getText(Lang.Type.B0192);
        }
    }
}
