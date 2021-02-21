
namespace TinyWars.MultiRankRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import FloatText        = Utility.FloatText;
    import ConfigManager    = Utility.ConfigManager;
    import Types            = Utility.Types;
    import BwSettingsHelper = BaseWar.BwSettingsHelper;
    import CommonHelpPanel  = Common.CommonHelpPanel;
    import BwHelpers        = BaseWar.BwHelpers;
    import WarMapModel      = WarMap.WarMapModel;
    import UserModel        = User.UserModel;
    import NetMessage       = ProtoTypes.NetMessage;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export type OpenDataForMrrRoomBasicSettingsPage = {
        roomId  : number;
    }

    export class MrrRoomBasicSettingsPage extends GameUi.UiTabPage {
        private _btnMapNameTitle        : TinyWars.GameUi.UiButton;
        private _labelMapName           : TinyWars.GameUi.UiLabel;
        private _btnBuildings           : TinyWars.GameUi.UiButton;

        private _btnModifyRoomStatus    : TinyWars.GameUi.UiButton;
        private _labelRoomStatus        : TinyWars.GameUi.UiLabel;

        private _btnModifyWarRule       : TinyWars.GameUi.UiButton;
        private _labelWarRule           : TinyWars.GameUi.UiLabel;

        private _btnModifyHasFog        : TinyWars.GameUi.UiButton;
        private _imgHasFog              : TinyWars.GameUi.UiImage;
        private _btnHelpHasFog          : TinyWars.GameUi.UiButton;

        private _btnModifyTimeLimit     : TinyWars.GameUi.UiButton;
        private _labelTimeLimit         : TinyWars.GameUi.UiLabel;
        private _btnHelpTimeLimit       : TinyWars.GameUi.UiButton;

        private _groupSelfInfo          : eui.Group;
        private _groupPlayerIndex       : eui.Group;
        private _btnModifyPlayerIndex   : TinyWars.GameUi.UiButton;
        private _labelPlayerIndex       : TinyWars.GameUi.UiLabel;
        private _btnHelpPlayerIndex     : TinyWars.GameUi.UiButton;

        private _groupBanCo             : eui.Group;
        private _btnBanCo               : TinyWars.GameUi.UiButton;
        private _labelBanCo             : TinyWars.GameUi.UiLabel;

        private _groupCo                : eui.Group;
        private _btnChangeCo            : TinyWars.GameUi.UiButton;
        private _labelCoName            : TinyWars.GameUi.UiLabel;

        private _groupSkinId            : eui.Group;
        private _btnModifySkinId        : TinyWars.GameUi.UiButton;
        private _labelSkinId            : TinyWars.GameUi.UiLabel;
        private _btnHelpSkinId          : TinyWars.GameUi.UiButton;

        private _groupReady             : eui.Group;
        private _btnModifyReady         : TinyWars.GameUi.UiButton;
        private _labelReady             : TinyWars.GameUi.UiLabel;

        private _labelPlayersTitle      : TinyWars.GameUi.UiLabel;
        private _listPlayer             : TinyWars.GameUi.UiScrollList;

        private _roomInfo               : ProtoTypes.MultiRankRoom.IMrrRoomInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrRoomBasicSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnBuildings,           callback: this._onTouchedBtnBuildings },
                { ui: this._btnHelpHasFog,          callback: this._onTouchedBtnHelpHasFog },
                { ui: this._btnHelpPlayerIndex,     callback: this._onTouchedBtnHelpPlayerIndex, },
                { ui: this._btnModifySkinId,        callback: this._onTouchedBtnModifySkinId, },
                { ui: this._btnModifyReady,         callback: this._onTouchedBtnModifyReady, },
                { ui: this._btnHelpSkinId,          callback: this._onTouchedBtnHelpSkinId, },
                { ui: this._btnHelpTimeLimit,       callback: this._onTouchedBtnHelpTimeLimit, },
                { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo, },
                { ui: this._btnBanCo,               callback: this._onTouchedBtnBanCo },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMrrGetRoomPublicInfo,    callback: this._onMsgMrrGetRoomPublicInfo },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            const roomId    = this._getOpenData<OpenDataForMrrRoomBasicSettingsPage>().roomId;
            this._roomInfo  = await MrrModel.getRoomInfo(roomId);

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

        private _onMsgMrrGetRoomPublicInfo(e: egret.Event): void {
            const data          = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
            const currRoomInfo  = this._roomInfo;
            const newRoomInfo   = data.roomInfo;
            if ((currRoomInfo) && (newRoomInfo.roomId === currRoomInfo.roomId)) {
                MrrModel.SelfSettings.resetData(newRoomInfo)
                this._roomInfo = newRoomInfo;
                this._updateComponentsForRoomInfo();
            }
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                WarMap.WarMapBuildingListPanel.show({
                    configVersion   : roomInfo.settingsForCommon.configVersion,
                    mapRawData      : await WarMapModel.getRawData(roomInfo.settingsForMrw.mapId),
                });
            }
        }

        private _onTouchedBtnHelpHasFog(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private _onTouchedBtnHelpPlayerIndex(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0018),
                content: Lang.getRichText(Lang.RichType.R0000),
            });
        }

        private _onTouchedBtnChangeCo(e: egret.TouchEvent): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId        = UserModel.getSelfUserId();
                const playerDataList    = roomInfo.playerDataList;
                const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
                if ((selfPlayerData != null) && (!selfPlayerData.isReady)) {
                    MrrRoomChooseCoPanel.show({
                        roomInfo,
                        playerIndex: selfPlayerData.playerIndex,
                    });
                    MrrRoomInfoPanel.hide();
                }
            }
        }

        private _onTouchedBtnModifySkinId(e: egret.TouchEvent): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId        = UserModel.getSelfUserId();
                const playerDataList    = roomInfo.playerDataList;
                const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
                if ((selfPlayerData != null) && (!selfPlayerData.isReady)) {
                    const currSkinId = MrrModel.SelfSettings.getUnitAndTileSkinId();
                    MrrModel.SelfSettings.tickUnitAndTileSkinId(roomInfo);
                    if (currSkinId === MrrModel.SelfSettings.getUnitAndTileSkinId()) {
                        FloatText.show(Lang.getText(Lang.Type.B0332));
                    } else {
                        this._updateGroupSkinId();
                    }
                }
            }
        }

        private _onTouchedBtnModifyReady(e: egret.TouchEvent): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId        = UserModel.getSelfUserId();
                const playerDataList    = roomInfo.playerDataList;
                const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
                if ((selfPlayerData != null) && (!selfPlayerData.isReady)) {
                    Common.CommonConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0137),
                        callback: () => {
                            MrrProxy.reqMrrSetSelfSettings(
                                roomInfo.roomId,
                                MrrModel.SelfSettings.getCoId(),
                                MrrModel.SelfSettings.getUnitAndTileSkinId(),
                            );
                        }
                    });
                }
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

        private _onTouchedBtnBanCo(e: egret.TouchEvent): void {
            const roomInfo = this._roomInfo;
            if ((roomInfo != null) && (roomInfo.timeForStartSetSelfSettings == null)) {
                const selfUserId        = User.UserModel.getSelfUserId();
                const selfPlayerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
                if ((selfPlayerData != null)                                                                                            &&
                    ((roomInfo.settingsForMrw.dataArrayForBanCo || []).find(v => v.srcPlayerIndex === selfPlayerData.playerIndex) == null)
                ) {
                    MrrRoomAvailableCoPanel.show({ roomInfo, srcPlayerIndex: selfPlayerData.playerIndex });
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnMapNameTitle.label         = Lang.getText(Lang.Type.B0225);
            this._btnModifyRoomStatus.label     = Lang.getText(Lang.Type.B0414);
            this._btnModifyWarRule.label        = Lang.getText(Lang.Type.B0318);
            this._btnModifyPlayerIndex.label    = Lang.getText(Lang.Type.B0018);
            this._btnModifySkinId.label         = Lang.getText(Lang.Type.B0397);
            this._btnModifyReady.label          = Lang.getText(Lang.Type.B0402);
            this._btnModifyHasFog.label         = Lang.getText(Lang.Type.B0020);
            this._btnModifyTimeLimit.label      = Lang.getText(Lang.Type.B0188);
            this._btnBuildings.label            = Lang.getText(Lang.Type.B0333);
            this._labelPlayersTitle.text        = `${Lang.getText(Lang.Type.B0395)}:`;
        }

        private _updateComponentsForRoomInfo(): void {
            this._updateLabelRoomStatus();
            this._updateLabelMapName();
            this._updateLabelWarRule();
            this._updateGroupPlayerIndex();
            this._updateImgHasFog();
            this._updateLabelTimeLimit();
            this._updateGroupBanCo();
            this._updateGroupCo();
            this._updateGroupSkinId();
            this._updateGroupReady();
            this._updateListPlayer();
        }

        private _updateLabelRoomStatus(): void {
            const roomInfo  = this._roomInfo;
            const label     = this._labelRoomStatus;
            if (roomInfo == null) {
                label.text = `???`;
            } else {
                label.text = roomInfo.timeForStartSetSelfSettings == null
                    ? Lang.getText(Lang.Type.A0133)
                    : Lang.getText(Lang.Type.A0134);
            }
        }

        private _updateLabelMapName(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForMrw.mapId).then(v =>
                    this._labelMapName.text = `${v} (${BwSettingsHelper.getPlayersCount(roomInfo.settingsForCommon.warRule)}P)`
                );
            }
        }

        private _updateLabelWarRule(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                this._labelWarRule.text = Lang.getWarRuleNameInLanguage(roomInfo.settingsForCommon.warRule);
            }
        }

        private _updateGroupPlayerIndex(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId    = UserModel.getSelfUserId();
                const playerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
                const group         = this._groupPlayerIndex;
                if (playerData == null) {
                    group.visible = false;
                } else {
                    group.visible               = true;
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
            this._labelTimeLimit.text = Lang.getBootTimerDesc([Types.BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        }

        private _updateGroupBanCo(): void {
            const roomInfo  = this._roomInfo;
            const group     = this._groupBanCo;
            if ((roomInfo == null) || (roomInfo.timeForStartSetSelfSettings != null)) {
                (group.parent) && (group.parent.removeChild(group));
                return;
            }

            const selfUserId        = User.UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
            if (selfPlayerData == null) {
                (group.parent) && (group.parent.removeChild(group));
                return;
            }

            (!group.parent) && (this._groupSelfInfo.addChild(group));

            const dataForBanCo  = (roomInfo.settingsForMrw.dataArrayForBanCo || []).find(v => v.srcPlayerIndex === selfPlayerData.playerIndex);
            const label         = this._labelBanCo;
            const btn           = this._btnBanCo;
            if (dataForBanCo) {
                label.text = generateTextForBanCo(roomInfo.settingsForCommon.configVersion, dataForBanCo.bannedCoIdList);
                btn.setTextColor(0xFFFFFF);
                btn.setRedVisible(false);
            } else {
                label.text = Lang.getText(Lang.Type.A0135);
                btn.setTextColor(0x00FF00);
                btn.setRedVisible(true);
            }
        }

        private _updateGroupCo(): void {
            const roomInfo  = this._roomInfo;
            const group     = this._groupCo;
            if ((roomInfo == null) || (roomInfo.timeForStartSetSelfSettings == null)) {
                (group.parent) && (group.parent.removeChild(group));
                return;
            }

            const selfUserId        = User.UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
            if (selfPlayerData == null) {
                (group.parent) && (group.parent.removeChild(group));
                return;
            }

            (!group.parent) && (this._groupSelfInfo.addChild(group));

            const btn               = this._btnChangeCo;
            this._labelCoName.text  = ConfigManager.getCoNameAndTierText(roomInfo.settingsForCommon.configVersion, MrrModel.SelfSettings.getCoId());
            if (selfPlayerData.isReady) {
                btn.setTextColor(0xFFFFFF);
                btn.setRedVisible(false);
            } else {
                btn.setTextColor(0x00FF00);
                btn.setRedVisible(true);
            }
        }

        private _updateGroupSkinId(): void {
            const roomInfo  = this._roomInfo;
            const group     = this._groupSkinId;
            if ((roomInfo == null) || (roomInfo.timeForStartSetSelfSettings == null)) {
                (group.parent) && (group.parent.removeChild(group));
                return;
            }

            const selfUserId        = User.UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
            if (selfPlayerData == null) {
                (group.parent) && (group.parent.removeChild(group));
                return;
            }

            (!group.parent) && (this._groupSelfInfo.addChild(group));

            const btn               = this._btnModifySkinId;
            this._labelSkinId.text  = Lang.getUnitAndTileSkinName(MrrModel.SelfSettings.getUnitAndTileSkinId());
            if (selfPlayerData.isReady) {
                btn.setTextColor(0xFFFFFF);
                btn.setRedVisible(false);
            } else {
                btn.setTextColor(0x00FF00);
                btn.setRedVisible(true);
            }
        }

        private _updateGroupReady(): void {
            const roomInfo  = this._roomInfo;
            const group     = this._groupReady;
            if ((roomInfo == null) || (roomInfo.timeForStartSetSelfSettings == null)) {
                (group.parent) && (group.parent.removeChild(group));
                return;
            }

            const selfUserId        = User.UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
            if (selfPlayerData == null) {
                (group.parent) && (group.parent.removeChild(group));
                return;
            }

            (!group.parent) && (this._groupSelfInfo.addChild(group));

            const label     = this._labelReady;
            const btn       = this._btnModifyReady;
            if (selfPlayerData.isReady) {
                label.text = Lang.getText(Lang.Type.B0012);
                btn.setRedVisible(false);
                btn.setTextColor(0xFFFFFF);
            } else {
                label.text = Lang.getText(Lang.Type.B0013);
                btn.setRedVisible(true);
                btn.setTextColor(0x00FF00);
            }
        }

        private async _updateListPlayer(): Promise<void> {
            this._listPlayer.bindData(await this._getDataForListPlayer());
        }

        private async _getDataForListPlayer(): Promise<DataForPlayerRenderer[]> {
            const dataList  : DataForPlayerRenderer[] = [];
            const roomInfo  = this._roomInfo;
            if (roomInfo) {
                const playerDataList    = roomInfo.playerDataList;
                const playerRules       = roomInfo.settingsForCommon.warRule.ruleForPlayers;
                const playersCount      = (await WarMapModel.getRawData(roomInfo.settingsForMrw.mapId)).playersCountUnneutral;
                for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                    dataList.push({
                        roomInfo,
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
        roomInfo        : ProtoTypes.MultiRankRoom.IMrrRoomInfo;
        playerIndex     : number;
        teamIndex       : number;
        playerData      : ProtoTypes.Structure.IDataForPlayerInRoom;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer {
        private _labelNickname  : GameUi.UiLabel;
        private _labelIndex     : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            const playerData        = data.playerData;
            const labelIndex        = this._labelIndex;
            const playerIndex       = data.playerIndex;
            labelIndex.text         = `${Lang.getPlayerForceName(playerIndex)}(${Lang.getPlayerTeamName(data.teamIndex)})`;
            labelIndex.textColor    = (playerData && playerData.isReady) ? 0x00FF00 : 0xFFFFFF;

            const lbNickname        = this._labelNickname;
            if (playerData == null) {
                lbNickname.text = "----";
            } else {
                if (playerData.userId !== User.UserModel.getSelfUserId()) {
                    lbNickname.text = `???`;
                } else {
                    lbNickname.text = "";
                    UserModel.getUserNickname(playerData.userId).then(name => {
                        lbNickname.text = name;
                    });
                }
            }
        }
    }

    function generateTextForBanCo(configVersion: string, bannedCoIdList: number[]): string {
        if ((bannedCoIdList == null) || (bannedCoIdList.length <= 0)) {
            return Lang.getText(Lang.Type.A0136)
        } else {
            const coNameList: string[] = [];
            for (const coId of bannedCoIdList) {
                coNameList.push(ConfigManager.getCoNameAndTierText(configVersion, coId));
            }
            return coNameList.join();
        }
    }
}
