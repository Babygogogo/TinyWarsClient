
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import FloatText        = Utility.FloatText;
    import ConfigManager    = Utility.ConfigManager;
    import BwSettingsHelper = BaseWar.BwSettingsHelper;
    import CommonHelpPanel  = Common.CommonHelpPanel;
    import BwHelpers        = BaseWar.BwHelpers;
    import WarMapModel      = WarMap.WarMapModel;
    import UserModel        = User.UserModel;
    import NetMessage       = ProtoTypes.NetMessage;

    export type OpenParamForRoomBasicSettingsPage = {
        roomId  : number;
    }

    export class McrRoomBasicSettingsPage extends GameUi.UiTabPage {
        private _btnMapNameTitle        : TinyWars.GameUi.UiButton;
        private _labelMapName           : TinyWars.GameUi.UiLabel;
        private _btnBuildings           : TinyWars.GameUi.UiButton;

        private _btnModifyWarName       : TinyWars.GameUi.UiButton;
        private _labelWarName           : TinyWars.GameUi.UiLabel;

        private _btnModifyWarPassword   : TinyWars.GameUi.UiButton;
        private _labelWarPassword       : TinyWars.GameUi.UiLabel;

        private _btnModifyWarComment    : TinyWars.GameUi.UiButton;
        private _labelWarComment        : TinyWars.GameUi.UiLabel;

        private _btnModifyWarRule       : TinyWars.GameUi.UiButton;
        private _labelWarRule           : TinyWars.GameUi.UiLabel;

        private _btnModifyHasFog        : TinyWars.GameUi.UiButton;
        private _imgHasFog              : TinyWars.GameUi.UiImage;
        private _btnHelpHasFog          : TinyWars.GameUi.UiButton;

        private _btnModifyTimeLimit     : TinyWars.GameUi.UiButton;
        private _labelTimeLimit         : TinyWars.GameUi.UiLabel;
        private _btnHelpTimeLimit       : TinyWars.GameUi.UiButton;

        private _btnModifyPlayerIndex   : TinyWars.GameUi.UiButton;
        private _labelPlayerIndex       : TinyWars.GameUi.UiLabel;
        private _btnHelpPlayerIndex     : TinyWars.GameUi.UiButton;

        private _btnChangeCo            : TinyWars.GameUi.UiButton;
        private _labelCoName            : TinyWars.GameUi.UiLabel;

        private _btnModifySkinId        : TinyWars.GameUi.UiButton;
        private _labelSkinId            : TinyWars.GameUi.UiLabel;
        private _btnHelpSkinId          : TinyWars.GameUi.UiButton;

        private _btnModifyReady         : TinyWars.GameUi.UiButton;
        private _labelReady             : TinyWars.GameUi.UiLabel;

        private _labelPlayersTitle      : TinyWars.GameUi.UiLabel;
        private _listPlayer             : TinyWars.GameUi.UiScrollList;

        protected _dataForOpen  : OpenParamForRoomBasicSettingsPage;
        private _roomInfo       : ProtoTypes.MultiCustomRoom.IMcrRoomInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrRoomBasicSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBuildings,           callback: this._onTouchedBtnBuildings },
                { ui: this._btnHelpHasFog,          callback: this._onTouchedBtnHelpHasFog },
                { ui: this._btnModifyPlayerIndex,   callback: this._onTouchedBtnModifyPlayerIndex, },
                { ui: this._btnHelpPlayerIndex,     callback: this._onTouchedBtnHelpPlayerIndex, },
                { ui: this._btnModifySkinId,        callback: this._onTouchedBtnModifySkinId, },
                { ui: this._btnModifyReady,         callback: this._onTouchedBtnModifyReady, },
                { ui: this._btnHelpSkinId,          callback: this._onTouchedBtnHelpSkinId, },
                { ui: this._btnHelpTimeLimit,       callback: this._onTouchedBtnHelpTimeLimit, },
                { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo, },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMcrGetRoomInfo,    callback: this._onNotifySMcrGetRoomInfo },
            ];

            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._btnModifyPlayerIndex.setTextColor(0x00FF00);
            this._btnModifySkinId.setTextColor(0x00FF00);
            this._btnChangeCo.setTextColor(0x00FF00);
            this._btnModifyReady.setTextColor(0x00FF00);
        }

        protected async _onOpened(): Promise<void> {
            const roomId    = this._dataForOpen.roomId;
            this._roomInfo  = await McrModel.getRoomInfo(roomId);

            this._updateComponentsForLanguage();
            this._updateComponentsForRoomInfo();
        }

        protected _onClosed(): void {
            this._listPlayer.clear();
            this._roomInfo = null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySMcrGetRoomInfo(e: egret.Event): void {
            const data          = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
            const roomId        = data.roomId;
            const currRoomInfo  = this._roomInfo;
            if ((currRoomInfo) && (roomId === currRoomInfo.roomId)) {
                const newRoomInfo   = data.roomInfo;
                const selfUserId    = UserModel.getSelfUserId();
                if (newRoomInfo.playerDataList.some(v => v.userId === selfUserId)) {
                    this._roomInfo = newRoomInfo;
                    this._updateComponentsForRoomInfo();
                } else {
                    FloatText.show(Lang.getText(Lang.Type.A0127));
                    this.close();
                    McrExitMapListPanel.show();
                }
            }
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const settingsForCommon = roomInfo.settingsForCommon;
                McrBuildingListPanel.show({
                    configVersion   : settingsForCommon.configVersion,
                    mapRawData      : await WarMapModel.getRawData(settingsForCommon.mapId),
                });
            }
        }

        private _onTouchedBtnHelpHasFog(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private _onTouchedBtnModifyPlayerIndex(e: egret.TouchEvent): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId = UserModel.getSelfUserId();
                const playerData = roomInfo.playerDataList.find(v => v.userId === selfUserId);
                if ((playerData) && (!playerData.isReady)) {
                    // TODO: open McrRoomSetSelfSettingsPanel
                } else {
                    FloatText.show(Lang.getText(Lang.Type.A0128));
                }
            }
        }

        private _onTouchedBtnHelpPlayerIndex(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0018),
                content: Lang.getRichText(Lang.RichType.R0000),
            });
        }

        private _onTouchedBtnModifySkinId(e: egret.TouchEvent): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId = UserModel.getSelfUserId();
                const playerData = roomInfo.playerDataList.find(v => v.userId === selfUserId);
                if ((playerData) && (!playerData.isReady)) {
                    // TODO: open McrRoomSetSelfSettingsPanel
                } else {
                    FloatText.show(Lang.getText(Lang.Type.A0128));
                }
            }
        }

        private _onTouchedBtnModifyReady(e: egret.TouchEvent): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId = UserModel.getSelfUserId();
                McrProxy.reqMcrSetReady(roomInfo.roomId, !roomInfo.playerDataList.find(v => v.userId === selfUserId).isReady);
            }
        }

        private _onTouchedBtnHelpSkinId(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0397),
                content: Lang.getRichText(Lang.RichType.R0001),
            });
        }

        private _onTouchedBtnHelpTimeLimit(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0021),
                content: Lang.getRichText(Lang.RichType.R0003),
            });
        }

        private _onTouchedBtnChangeCo(e: egret.TouchEvent): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId = UserModel.getSelfUserId();
                const playerData = roomInfo.playerDataList.find(v => v.userId === selfUserId);
                if ((playerData) && (!playerData.isReady)) {
                    // TODO: open McrRoomSetSelfSettingsPanel
                } else {
                    FloatText.show(Lang.getText(Lang.Type.A0128));
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnMapNameTitle.label         = Lang.getText(Lang.Type.B0225);
            this._btnModifyWarName.label        = Lang.getText(Lang.Type.B0185);
            this._btnModifyWarPassword.label    = Lang.getText(Lang.Type.B0186);
            this._btnModifyWarComment.label     = Lang.getText(Lang.Type.B0187);
            this._btnModifyWarRule.label        = Lang.getText(Lang.Type.B0318);
            this._btnModifyPlayerIndex.label    = Lang.getText(Lang.Type.B0018);
            this._btnModifySkinId.label         = Lang.getText(Lang.Type.B0019);
            this._btnModifyReady.label          = Lang.getText(Lang.Type.B0402);
            this._btnModifyHasFog.label         = Lang.getText(Lang.Type.B0020);
            this._btnModifyTimeLimit.label      = Lang.getText(Lang.Type.B0188);
            this._btnBuildings.label            = Lang.getText(Lang.Type.B0333);
            this._labelPlayersTitle.text        = `${Lang.getText(Lang.Type.B0232)}:`;
        }

        private _updateComponentsForRoomInfo(): void {
            this._updateLabelWarName();
            this._updateLabelWarPassword();
            this._updateLabelWarComment();
            this._updateLabelMapName();
            this._updateLabelWarRule();
            this._updateLabelPlayerIndex();
            this._updateImgHasFog();
            this._updateLabelTimeLimit();
            this._updateLabelCoName();
            this._updateLabelSkinId();
            this._updateLabelReady();
            this._updateListPlayer();
        }

        private _updateLabelWarName(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                this._labelWarName.text = roomInfo.settingsForMultiPlayer.warName || "--";
            }
        }

        private _updateLabelWarPassword(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                this._labelWarPassword.text = roomInfo.settingsForMultiPlayer.warPassword || "--";
            }
        }

        private _updateLabelWarComment(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                this._labelWarComment.text = roomInfo.settingsForMultiPlayer.warComment || "--";
            }
        }

        private _updateLabelMapName(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const settingsForCommon = roomInfo.settingsForCommon;
                WarMapModel.getMapNameInCurrentLanguage(settingsForCommon.mapId).then(v =>
                    this._labelMapName.text = `${v} (${BwSettingsHelper.getPlayersCount(settingsForCommon.warRule)}P)`
                );
            }
        }

        private _updateLabelWarRule(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                this._labelWarRule.text = Lang.getWarRuleNameInLanguage(roomInfo.settingsForCommon.warRule);
            }
        }

        private _updateLabelPlayerIndex(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId = UserModel.getSelfUserId();
                const playerData = roomInfo.playerDataList.find(v => v.userId === selfUserId);
                if (playerData) {
                    const playerIndex           = playerData.playerIndex;
                    const playerRule            = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
                    this._labelPlayerIndex.text = `${Lang.getPlayerForceName(playerIndex)} (${Lang.getPlayerTeamName(playerRule.teamIndex)})`;
                }
            }
        }

        private _updateImgHasFog(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                this._imgHasFog.visible = roomInfo.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
            }
        }

        private _updateLabelTimeLimit(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                this._labelTimeLimit.text = Lang.getBootTimerDesc(roomInfo.settingsForMultiPlayer.bootTimerParams);
            }
        }

        private _updateLabelCoName(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId    = UserModel.getSelfUserId();
                const playerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
                const coId          = playerData ? playerData.coId : null;
                if (coId != null) {
                    const cfg               = ConfigManager.getCoBasicCfg(ConfigManager.getLatestConfigVersion(), coId);
                    this._labelCoName.text  = `${cfg.name} (T${cfg.tier})`;
                }
            }
        }

        private _updateLabelSkinId(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId    = UserModel.getSelfUserId();
                const playerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
                const skinId        = playerData ? playerData.unitAndTileSkinId : null;
                if (skinId != null) {
                    this._labelSkinId.text = Lang.getUnitAndTileSkinName(skinId);
                }
            }
        }

        private _updateLabelReady(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId        = UserModel.getSelfUserId();
                this._labelReady.text   = roomInfo.playerDataList.find(v => v.userId === selfUserId).isReady
                    ? Lang.getText(Lang.Type.B0012)
                    : Lang.getText(Lang.Type.B0013);
            }
        }

        private async _updateListPlayer(): Promise<void> {
            this._listPlayer.bindData(await this._getDataForListPlayer());
        }

        private async _getDataForListPlayer(): Promise<DataForPlayerRenderer[]> {
            const dataList  : DataForPlayerRenderer[] = [];
            const roomInfo  = this._roomInfo;
            if (roomInfo) {
                const settingsForCommon = roomInfo.settingsForCommon;
                const playerDataList    = roomInfo.playerDataList;
                const playerRules       = settingsForCommon.warRule.ruleForPlayers;
                const configVersion     = settingsForCommon.configVersion;
                const playersCount      = (await WarMapModel.getRawData(settingsForCommon.mapId)).playersCount;
                for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                    dataList.push({
                        configVersion,
                        playerIndex,
                        teamIndex   : BwHelpers.getTeamIndexByRuleForPlayers(playerRules, playerIndex),
                        playerData  : playerDataList.find(v => v.playerIndex === playerIndex),
                    });
                }
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        configVersion   : string;
        playerIndex     : number;
        teamIndex       : number;
        playerData      : ProtoTypes.Structure.IDataForPlayerInRoom;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelNickname  : GameUi.UiLabel;
        private _labelIndex     : GameUi.UiLabel;
        private _labelTeam      : GameUi.UiLabel;
        private _labelCoName    : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            this._labelIndex.text   = Lang.getPlayerForceName(data.playerIndex);
            this._labelTeam.text    = Lang.getPlayerTeamName(data.teamIndex);

            const playerData    = data.playerData;
            const lbCoName      = this._labelCoName;
            const lbNickname    = this._labelNickname;
            if (playerData) {
                lbCoName.text = ConfigManager.getCoNameAndTierText(data.configVersion, playerData.coId);
                User.UserModel.getUserNickname(playerData.userId).then(name => lbNickname.text = name);
            } else {
                lbCoName.text   = "----";
                lbNickname.text = "----";
            }
        }
    }
}
