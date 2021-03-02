
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import FloatText        = Utility.FloatText;
    import ConfigManager    = Utility.ConfigManager;
    import BwSettingsHelper = BaseWar.BwWarRuleHelper;
    import CommonHelpPanel  = Common.CommonHelpPanel;
    import BwHelpers        = BaseWar.BwHelpers;
    import WarMapModel      = WarMap.WarMapModel;
    import UserModel        = User.UserModel;
    import NetMessage       = ProtoTypes.NetMessage;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export type OpenDataForMcrRoomBasicSettingsPage = {
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

        private _groupPlayerIndex       : eui.Group;
        private _btnModifyPlayerIndex   : TinyWars.GameUi.UiButton;
        private _labelPlayerIndex       : TinyWars.GameUi.UiLabel;
        private _btnHelpPlayerIndex     : TinyWars.GameUi.UiButton;

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

        private _roomInfo               : ProtoTypes.MultiCustomRoom.IMcrRoomInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrRoomBasicSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnBuildings,           callback: this._onTouchedBtnBuildings },
                { ui: this._btnHelpHasFog,          callback: this._onTouchedBtnHelpHasFog },
                { ui: this._btnModifyPlayerIndex,   callback: this._onTouchedBtnModifyPlayerIndex, },
                { ui: this._btnHelpPlayerIndex,     callback: this._onTouchedBtnHelpPlayerIndex, },
                { ui: this._btnModifySkinId,        callback: this._onTouchedBtnModifySkinId, },
                { ui: this._btnModifyReady,         callback: this._onTouchedBtnModifyReady, },
                { ui: this._btnHelpSkinId,          callback: this._onTouchedBtnHelpSkinId, },
                { ui: this._btnHelpTimeLimit,       callback: this._onTouchedBtnHelpTimeLimit, },
                { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo, },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMcrGetRoomInfo,  callback: this._onMsgMcrGetRoomInfo },
            ]);

            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._btnModifyPlayerIndex.setTextColor(0x00FF00);
            this._btnModifySkinId.setTextColor(0x00FF00);
            this._btnChangeCo.setTextColor(0x00FF00);
            this._btnModifyReady.setTextColor(0x00FF00);

            const roomId    = this._getOpenData<OpenDataForMcrRoomBasicSettingsPage>().roomId;
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

        private _onMsgMcrGetRoomInfo(e: egret.Event): void {
            const data          = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
            const roomId        = data.roomId;
            const currRoomInfo  = this._roomInfo;
            if ((currRoomInfo) && (roomId === currRoomInfo.roomId)) {
                const newRoomInfo   = data.roomInfo;
                const selfUserId    = UserModel.getSelfUserId();
                if (newRoomInfo.playerDataList.some(v => v.userId === selfUserId)) {
                    this._roomInfo = newRoomInfo;
                    this._updateComponentsForRoomInfo();
                }
            }
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                WarMap.WarMapBuildingListPanel.show({
                    configVersion   : roomInfo.settingsForCommon.configVersion,
                    mapRawData      : await WarMapModel.getRawData(roomInfo.settingsForMcw.mapId),
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
                const selfUserId        = UserModel.getSelfUserId();
                const playerDataList    = roomInfo.playerDataList;
                const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
                if (selfPlayerData != null) {
                    if (selfPlayerData.isReady) {
                        FloatText.show(Lang.getText(Lang.Type.A0128));
                    } else {
                        const playersCount          = BwSettingsHelper.getPlayersCount(roomInfo.settingsForCommon.warRule);
                        const selfPlayerIndex       = selfPlayerData.playerIndex;
                        const availablePlayerIndexes: number[] = [];
                        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCount; ++playerIndex) {
                            if ((playerIndex === selfPlayerIndex) || (playerDataList.every(v => v.userId == null || v.playerIndex !== playerIndex))) {
                                availablePlayerIndexes.push(playerIndex);
                            }
                        }

                        if (availablePlayerIndexes.length <= 1) {
                            FloatText.show(Lang.getText(Lang.Type.B0332));
                        } else {
                            const newPlayerIndex = availablePlayerIndexes[(availablePlayerIndexes.indexOf(selfPlayerIndex) + 1) % availablePlayerIndexes.length]
                            McrProxy.reqMcrSetSelfSettings({
                                roomId              : roomInfo.roomId,
                                playerIndex         : newPlayerIndex,
                                unitAndTileSkinId   : selfPlayerData.unitAndTileSkinId,
                                coId                : BwSettingsHelper.getRandomCoIdWithSettingsForCommon(roomInfo.settingsForCommon, newPlayerIndex),
                            });
                        }
                    }
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
                const selfUserId        = UserModel.getSelfUserId();
                const playerDataList    = roomInfo.playerDataList;
                const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
                if (selfPlayerData != null) {
                    if (selfPlayerData.isReady) {
                        FloatText.show(Lang.getText(Lang.Type.A0128));
                    } else {
                        const selfSkinId        = selfPlayerData.unitAndTileSkinId;
                        const availableSkinIds  : number[] = [];
                        for (let skinId = CommonConstants.UnitAndTileMinSkinId; skinId <= CommonConstants.UnitAndTileMaxSkinId; ++skinId) {
                            if ((skinId === selfSkinId) || (playerDataList.every(v => v.userId == null || v.unitAndTileSkinId !== skinId))) {
                                availableSkinIds.push(skinId);
                            }
                        }

                        if (availableSkinIds.length <= 1) {
                            FloatText.show(Lang.getText(Lang.Type.B0332));
                        } else {
                            const newSkinId = availableSkinIds[(availableSkinIds.indexOf(selfSkinId) + 1) % availableSkinIds.length]
                            McrProxy.reqMcrSetSelfSettings({
                                roomId              : roomInfo.roomId,
                                playerIndex         : selfPlayerData.playerIndex,
                                unitAndTileSkinId   : newSkinId,
                                coId                : selfPlayerData.coId,
                            });
                        }
                    }
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
                const selfUserId        = UserModel.getSelfUserId();
                const playerDataList    = roomInfo.playerDataList;
                const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
                if (selfPlayerData != null) {
                    if (selfPlayerData.isReady) {
                        FloatText.show(Lang.getText(Lang.Type.A0128));
                    } else {
                        McrRoomChooseCoPanel.show({
                            roomInfo,
                            selfPlayerData,
                        });
                        McrRoomInfoPanel.hide();
                    }
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
            this._btnModifySkinId.label         = Lang.getText(Lang.Type.B0397);
            this._btnModifyReady.label          = Lang.getText(Lang.Type.B0402);
            this._btnModifyHasFog.label         = Lang.getText(Lang.Type.B0020);
            this._btnModifyTimeLimit.label      = Lang.getText(Lang.Type.B0188);
            this._btnBuildings.label            = Lang.getText(Lang.Type.B0333);
            this._labelPlayersTitle.text        = `${Lang.getText(Lang.Type.B0395)}:`;
        }

        private _updateComponentsForRoomInfo(): void {
            this._updateLabelWarName();
            this._updateLabelWarPassword();
            this._updateLabelWarComment();
            this._updateLabelMapName();
            this._updateLabelWarRule();
            this._updateGroupPlayerIndex();
            this._updateImgHasFog();
            this._updateLabelTimeLimit();
            this._updateGroupCo();
            this._updateGroupSkinId();
            this._updateGroupReady();
            this._updateListPlayer();
        }

        private _updateLabelWarName(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                this._labelWarName.text = roomInfo.settingsForMcw.warName || "--";
            }
        }

        private _updateLabelWarPassword(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                this._labelWarPassword.text = roomInfo.settingsForMcw.warPassword || "--";
            }
        }

        private _updateLabelWarComment(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                this._labelWarComment.text = roomInfo.settingsForMcw.warComment || "--";
            }
        }

        private _updateLabelMapName(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForMcw.mapId).then(v =>
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
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                this._labelTimeLimit.text = Lang.getBootTimerDesc(roomInfo.settingsForMcw.bootTimerParams);
            }
        }

        private _updateGroupCo(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId    = UserModel.getSelfUserId();
                const playerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
                const group         = this._groupCo;
                if (playerData == null) {
                    group.visible   = false;
                } else {
                    group.visible   = true;
                    const coId      = playerData ? playerData.coId : null;
                    if (coId != null) {
                        this._labelCoName.text = ConfigManager.getCoNameAndTierText(ConfigManager.getLatestFormalVersion(), coId);
                    }
                }
            }
        }

        private _updateGroupSkinId(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId    = UserModel.getSelfUserId();
                const playerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
                const group         = this._groupSkinId;
                if (playerData == null) {
                    group.visible   = false;
                } else {
                    group.visible   = true;
                    const skinId    = playerData ? playerData.unitAndTileSkinId : null;
                    if (skinId != null) {
                        this._labelSkinId.text = Lang.getUnitAndTileSkinName(skinId);
                    }
                }
            }
        }

        private _updateGroupReady(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const selfUserId    = UserModel.getSelfUserId();
                const playerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
                const group         = this._groupReady;
                if (playerData == null) {
                    group.visible   = false;
                } else {
                    group.visible           = true;
                    const isReady           = playerData.isReady;
                    this._labelReady.text   = isReady
                        ? Lang.getText(Lang.Type.B0012)
                        : Lang.getText(Lang.Type.B0013);
                    this._btnModifyReady.setRedVisible(!isReady);
                }
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
                const playersCount      = (await WarMapModel.getRawData(roomInfo.settingsForMcw.mapId)).playersCountUnneutral;
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
        roomInfo        : ProtoTypes.MultiCustomRoom.IMcrRoomInfo;
        playerIndex     : number;
        teamIndex       : number;
        playerData      : ProtoTypes.Structure.IDataForPlayerInRoom;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer {
        private _labelNickname  : GameUi.UiLabel;
        private _labelIndex     : GameUi.UiLabel;
        private _btnDelete      : GameUi.UiButton;

        protected childrenCreated(): void {
            super.childrenCreated();

            const btnDelete = this._btnDelete;
            btnDelete.label = Lang.getText(Lang.Type.B0411);
            btnDelete.setTextColor(0xFF0000);
            btnDelete.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedBtnDelete, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            const roomInfo          = data.roomInfo;
            const selfUserId        = UserModel.getSelfUserId();
            const selfPlayerData    = roomInfo.playerDataList.find(v => v.userId === selfUserId);
            const selfPlayerIndex   = selfPlayerData ? selfPlayerData.playerIndex : null;
            const playerData        = data.playerData;
            const labelIndex        = this._labelIndex;
            const playerIndex       = data.playerIndex;
            labelIndex.text         = `${Lang.getPlayerForceName(playerIndex)}(${Lang.getPlayerTeamName(data.teamIndex)})`;
            labelIndex.textColor    = (playerData && playerData.isReady) ? 0x00FF00 : 0xFFFFFF;
            this._btnDelete.visible = (selfPlayerIndex != null)
                && (roomInfo.ownerPlayerIndex === selfPlayerIndex)
                && (data.playerIndex !== selfPlayerIndex)
                && (playerData != null);

            const lbNickname        = this._labelNickname;
            lbNickname.textColor    = roomInfo.ownerPlayerIndex === playerIndex ? 0x00FF00 : 0xFFFFFF;
            if (playerData == null) {
                lbNickname.text = "----";
            } else {
                lbNickname.text = "";
                UserModel.getUserNickname(playerData.userId).then(name => {
                    lbNickname.text = `${name} ${ConfigManager.getCoNameAndTierText(roomInfo.settingsForCommon.configVersion, playerData.coId)}`;
                });
            }
        }

        private async _onTouchedBtnDelete(e: egret.TouchEvent): Promise<void> {
            const data          = this.data as DataForPlayerRenderer;
            const playerData    = data ? data.playerData : null;
            if (playerData) {
                const userId = playerData.userId;
                Common.CommonConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getFormattedText(Lang.Type.F0029, await User.UserModel.getUserNickname(userId)),
                    callback: () => {
                        McrProxy.reqMcrDeletePlayer(data.roomInfo.roomId, playerData.playerIndex);
                    },
                });
            }
        }
    }
}
