
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import CommonConstants  = Utility.CommonConstants;
    import BwHelpers        = BaseWar.BwHelpers;

    export type OpenDataForMcrRoomPlayerInfoPage = {
        roomId  : number;
    }
    export class McrRoomPlayerInfoPage extends GameUi.UiTabPage<OpenDataForMcrRoomPlayerInfoPage> {
        private readonly _groupInfo     : eui.Group;
        private readonly _listPlayer    : GameUi.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrRoomPlayerInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMcrGetRoomInfo,  callback: this._onNotifyMsgMcrGetRoomInfo },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();
            this._updateComponentsForRoomInfo();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMsgMcrGetRoomInfo(e: egret.Event): void {
            this._updateComponentsForRoomInfo();
        }

        private _updateComponentsForLanguage(): void {
        }
        private async _updateComponentsForRoomInfo(): Promise<void> {
            const roomInfo      = await McrModel.getRoomInfo(this._getOpenData().roomId);
            const mapRawData    = roomInfo ? await WarMap.WarMapModel.getRawData(roomInfo.settingsForMcw.mapId) : null;
            const listPlayer    = this._listPlayer;
            if (mapRawData) {
                listPlayer.bindData(this._createDataForListPlayer(roomInfo, mapRawData.playersCountUnneutral));
            } else {
                listPlayer.clear();
            }
        }

        private _createDataForListPlayer(roomInfo: ProtoTypes.MultiCustomRoom.IMcrRoomInfo, mapPlayersCount: number): DataForPlayerRenderer[] {
            const dataList: DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= mapPlayersCount; ++playerIndex) {
                dataList.push({
                    roomId      : roomInfo.roomId,
                    playerIndex,
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        roomId          : number;
        playerIndex     : number;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo           : eui.Group;
        private readonly _imgSkin           : GameUi.UiImage;
        private readonly _imgCoHead         : GameUi.UiImage;
        private readonly _imgCoInfo         : GameUi.UiImage;
        private readonly _labelNickname     : GameUi.UiLabel;
        private readonly _labelCo           : GameUi.UiLabel;
        private readonly _labelIsReady      : GameUi.UiLabel;

        private readonly _labelPlayerIndex  : GameUi.UiLabel;
        private readonly _labelTeamIndex    : GameUi.UiLabel;
        private readonly _labelRankStdTitle : GameUi.UiLabel;
        private readonly _labelRankStd      : GameUi.UiLabel;
        private readonly _labelRankFogTitle : GameUi.UiLabel;
        private readonly _labelRankFog      : GameUi.UiLabel;

        private readonly _groupButton       : eui.Group;
        private readonly _btnChat           : GameUi.UiButton;
        private readonly _btnInfo           : GameUi.UiButton;
        private readonly _btnDelete         : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,    callback: this._onTouchedGroupCo },
                { ui: this._btnChat,    callback: this._onTouchedBtnChat },
                { ui: this._btnInfo,    callback: this._onTouchedBtnInfo },
                { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMcrSetSelfSettings,      callback: this._onNotifyMsgMcrSetSelfSettings },
                { type: Notify.Type.MsgMcrSetReady,             callback: this._onNotifyMsgMcrSetReady },
                { type: Notify.Type.MsgMcrJoinRoom,             callback: this._onNotifyMsgMcrJoinRoom },
                { type: Notify.Type.MsgMcrExitRoom,             callback: this._onNotifyMsgMcrExitRoom },
                { type: Notify.Type.MsgMcrDeletePlayer,         callback: this._onNotifyMsgMcrDeletePlayer },
                { type: Notify.Type.MsgMcrGetOwnerPlayerIndex,  callback: this._onNotifyMsgMcrGetOwnerPlayerIndex },
            ]);

            this._updateComponentsForLanguage();
        }

        private async _onTouchedGroupCo(e: egret.TouchEvent): Promise<void> {
            const data          = this.data;
            const roomInfo      = await McrModel.getRoomInfo(data.roomId);
            const playerData    = roomInfo ? (roomInfo.playerDataList || []).find(v => v.playerIndex === data.playerIndex) : null;
            const coId          = playerData ? playerData.coId : null;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                Common.CommonCoInfoPanel.show({
                    configVersion   : roomInfo.settingsForCommon.configVersion,
                    coId,
                });
            }
        }

        private async _onTouchedBtnChat(e: egret.TouchEvent): Promise<void> {
            const playerData    = await this._getPlayerData();
            const userId        = playerData ? playerData.userId : undefined;
            if (userId != null) {
                Chat.ChatPanel.show({ toUserId: userId });
            }
        }

        private async _onTouchedBtnInfo(e: egret.TouchEvent): Promise<void> {
            const playerData    = await this._getPlayerData();
            const userId        = playerData ? playerData.userId : undefined;
            if (userId != null) {
                User.UserPanel.show({ userId });
            }
        }

        private async _onTouchedBtnDelete(e: egret.TouchEvent): Promise<void> {
            const data          = this.data;
            const roomId        = data.roomId;
            const playerData    = await this._getPlayerData();
            if (playerData) {
                const userId = playerData.userId;
                if (userId === User.UserModel.getSelfUserId()) {
                    Common.CommonConfirmPanel.show({
                        content : Lang.getText(Lang.Type.A0126),
                        callback: () => {
                            McrProxy.reqMcrExitRoom(roomId);
                        },
                    });
                } else {
                    Common.CommonConfirmPanel.show({
                        content : Lang.getFormattedText(Lang.Type.F0029, await User.UserModel.getUserNickname(userId)),
                        callback: () => {
                            McrProxy.reqMcrDeletePlayer(roomId, data.playerIndex);
                        },
                    });
                }
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMcrSetSelfSettings(e: egret.Event): void {
            const eventData     = e.data as ProtoTypes.NetMessage.MsgMcrSetSelfSettings.IS;
            const data          = this.data;
            const playerIndex   = data.playerIndex;
            if ((eventData.roomId === data.roomId)                                                      &&
                ((eventData.newPlayerIndex === playerIndex) || (eventData.oldPlayerIndex === playerIndex))
            ) {
                this._updateLabelReady();
                this._updateComponentsForSettings();
            }
        }

        private _onNotifyMsgMcrSetReady(e: egret.Event): void {
            const eventData = e.data as ProtoTypes.NetMessage.MsgMcrSetReady.IS;
            const data      = this.data;
            if ((eventData.roomId === data.roomId)          &&
                (eventData.playerIndex === data.playerIndex)
            ) {
                this._updateLabelReady();
            }
        }

        private _onNotifyMsgMcrJoinRoom(e: egret.Event): void {
            const eventData = e.data as ProtoTypes.NetMessage.MsgMcrJoinRoom.IS;
            const data      = this.data;
            if ((eventData.roomId === data.roomId)          &&
                (eventData.playerIndex === data.playerIndex)
            ) {
                this._updateLabelReady();
                this._updateComponentsForSettings();
            }
        }

        private _onNotifyMsgMcrExitRoom(e: egret.Event): void {
            const eventData = e.data as ProtoTypes.NetMessage.MsgMcrExitRoom.IS;
            const data      = this.data;
            if ((eventData.roomId === data.roomId)          &&
                (eventData.playerIndex === data.playerIndex)
            ) {
                this._updateLabelReady();
                this._updateComponentsForSettings();
            }
        }

        private _onNotifyMsgMcrDeletePlayer(e: egret.Event): void {
            const eventData = e.data as ProtoTypes.NetMessage.MsgMcrDeletePlayer.IS;
            const data      = this.data;
            if ((eventData.roomId === data.roomId)                  &&
                (eventData.targetPlayerIndex === data.playerIndex)
            ) {
                this._updateLabelReady();
                this._updateComponentsForSettings();
            }
        }

        private _onNotifyMsgMcrGetOwnerPlayerIndex(e: egret.Event): void {
            const eventData = e.data as ProtoTypes.NetMessage.MsgMcrGetOwnerPlayerIndex.IS;
            const data      = this.data;
            if (eventData.roomId === data.roomId) {
                this._updateComponentsForSettings();
            }
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateComponentsForSettings();
            this._updateLabelReady();
        }

        private _updateComponentsForLanguage(): void {
            this._labelRankStdTitle.text    = Lang.getText(Lang.Type.B0546);
            this._labelRankFogTitle.text    = Lang.getText(Lang.Type.B0547);
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const data      = this.data;
            const roomInfo  = await McrModel.getRoomInfo(data.roomId);
            if (!roomInfo) {
                return;
            }

            const playerIndex           = data.playerIndex;
            const settingsForCommon     = roomInfo.settingsForCommon;
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(BwHelpers.getTeamIndexByRuleForPlayers(settingsForCommon.warRule.ruleForPlayers, playerIndex));

            const playerDataList        = roomInfo.playerDataList || [];
            const playerData            = playerDataList.find(v => v.playerIndex === playerIndex);
            this._imgSkin.source        = getSourceForImgSkin(playerData ? playerData.unitAndTileSkinId : null);

            const coId                  = playerData ? playerData.coId : null;
            const coCfg                 = ConfigManager.getCoBasicCfg(settingsForCommon.configVersion, coId);
            this._labelCo.text          = coCfg ? coCfg.name : `??`;
            this._imgCoHead.source      = ConfigManager.getCoHeadImageSource(coId);
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);

            const userId                = playerData ? playerData.userId : null;
            const userInfo              = userId == null ? null : await User.UserModel.getUserPublicInfo(userId);
            this._labelNickname.text    = userInfo ? userInfo.nickname : `??`;

            const groupButton           = this._groupButton;
            groupButton.removeChildren();
            if (userInfo) {
                groupButton.addChild(this._btnInfo);

                const selfUserId = User.UserModel.getSelfUserId();
                if (userId !== selfUserId) {
                    groupButton.addChild(this._btnChat);
                }

                const selfPlayerData    = playerDataList.find(v => v.userId === selfUserId);
                const selfPlayerIndex   = selfPlayerData ? selfPlayerData.playerIndex : null;
                if ((playerIndex === selfPlayerIndex) || (roomInfo.ownerPlayerIndex === selfPlayerIndex)) {
                    groupButton.addChild(this._btnDelete);
                }
            }

            const rankScoreArray        = userInfo ? userInfo.userRankScore.dataList : undefined;
            const stdRankInfo           = rankScoreArray ? rankScoreArray.find(v => v.warType === Types.WarType.MrwStd) : null;
            const fogRankInfo           = rankScoreArray ? rankScoreArray.find(v => v.warType === Types.WarType.MrwFog) : null;
            const stdScore              = stdRankInfo ? stdRankInfo.currentScore : null;
            const fogScore              = fogRankInfo ? fogRankInfo.currentScore : null;
            const stdRank               = stdRankInfo ? stdRankInfo.currentRank : null;
            const fogRank               = fogRankInfo ? fogRankInfo.currentRank : null;
            this._labelRankStd.text     = stdRankInfo
                ? `${stdScore == null ? CommonConstants.RankInitialScore : stdScore} (${stdRank == null ? `--` : `${stdRank}${Helpers.getSuffixForRank(stdRank)}`})`
                : `??`;
            this._labelRankFog.text     = fogRankInfo
                ? `${fogScore == null ? CommonConstants.RankInitialScore : fogScore} (${fogRank == null ? `--` : `${fogRank}${Helpers.getSuffixForRank(fogRank)}`})`
                : `??`;
        }

        private async _updateLabelReady(): Promise<void> {
            const playerData            = await this._getPlayerData();
            this._labelIsReady.visible  = (!!playerData) && (!!playerData.isReady);
        }

        private async _getPlayerData(): Promise<ProtoTypes.Structure.IDataForPlayerInRoom> {
            const data      = this.data;
            const roomInfo  = await McrModel.getRoomInfo(data.roomId);
            return roomInfo
                ? (roomInfo.playerDataList || []).find(v => v.playerIndex === data.playerIndex)
                : null;
        }
    }

    function getSourceForImgSkin(skinId: number): string {
        switch (skinId) {
            case 1  : return `commonRectangle0002`;
            case 2  : return `commonRectangle0003`;
            case 3  : return `commonRectangle0004`;
            case 4  : return `commonRectangle0005`;
            default : return `commonRectangle0006`;
        }
    }
}
