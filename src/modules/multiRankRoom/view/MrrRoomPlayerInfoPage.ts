
namespace TinyWars.MultiRankRoom {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import CommonConstants  = Utility.CommonConstants;
    import BwHelpers        = BaseWar.BwHelpers;

    export type OpenDataForMrrRoomPlayerInfoPage = {
        roomId  : number;
    }
    export class MrrRoomPlayerInfoPage extends GameUi.UiTabPage<OpenDataForMrrRoomPlayerInfoPage> {
        private readonly _groupInfo     : eui.Group;
        private readonly _listPlayer    : GameUi.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrRoomPlayerInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMrrGetRoomPublicInfo,    callback: this._onNotifyMsgMrrGetRoomPublicInfo },
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
        private _onNotifyMsgMrrGetRoomPublicInfo(e: egret.Event): void {
            this._updateComponentsForRoomInfo();
        }

        private _updateComponentsForLanguage(): void {
        }
        private async _updateComponentsForRoomInfo(): Promise<void> {
            const roomInfo      = await MrrModel.getRoomInfo(this._getOpenData().roomId);
            const mapRawData    = roomInfo ? await WarMap.WarMapModel.getRawData(roomInfo.settingsForMrw.mapId) : null;
            const listPlayer    = this._listPlayer;
            if (mapRawData) {
                listPlayer.bindData(this._createDataForListPlayer(roomInfo, mapRawData.playersCountUnneutral));
            } else {
                listPlayer.clear();
            }
        }

        private _createDataForListPlayer(roomInfo: ProtoTypes.MultiRankRoom.IMrrRoomInfo, mapPlayersCount: number): DataForPlayerRenderer[] {
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
        private readonly _imgCoInfo         : GameUi.UiImage;
        private readonly _imgCoHead         : GameUi.UiImage;
        private readonly _labelNickname     : GameUi.UiLabel;
        private readonly _labelCo           : GameUi.UiLabel;
        private readonly _labelIsReady      : GameUi.UiLabel;

        private readonly _labelPlayerIndex  : GameUi.UiLabel;
        private readonly _labelTeamIndex    : GameUi.UiLabel;
        private readonly _labelRankStdTitle : GameUi.UiLabel;
        private readonly _labelRankStd      : GameUi.UiLabel;
        private readonly _labelRankFogTitle : GameUi.UiLabel;
        private readonly _labelRankFog      : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,    callback: this._onTouchedGroupCo },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMrrSetSelfSettings,      callback: this._onNotifyMsgMrrSetSelfSettings },
                { type: Notify.Type.MsgMrrSetBannedCoIdList,    callback: this._onNotifyMsgMrrSetBannedCoIdList },
            ]);

            this._updateComponentsForLanguage();
        }

        private async _onTouchedGroupCo(e: egret.TouchEvent): Promise<void> {
            const data          = this.data;
            const roomInfo      = await MrrModel.getRoomInfo(data.roomId);
            const playerData    = roomInfo ? (roomInfo.playerDataList || []).find(v => v.playerIndex === data.playerIndex) : null;
            const coId          = playerData ? playerData.coId : null;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                Common.CommonCoInfoPanel.show({
                    configVersion   : roomInfo.settingsForCommon.configVersion,
                    coId,
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMrrSetSelfSettings(e: egret.Event): void {
            const eventData     = e.data as ProtoTypes.NetMessage.MsgMrrSetSelfSettings.IS;
            const data          = this.data;
            if ((eventData.roomId === data.roomId) && (eventData.playerIndex === data.playerIndex)) {
                this._updateLabelReady();
                this._updateComponentsForSettings();
            }
        }

        private _onNotifyMsgMrrSetBannedCoIdList(e: egret.Event): void {
            const eventData = e.data as ProtoTypes.NetMessage.MsgMrrSetBannedCoIdList.IS;
            const data      = this.data;
            if ((eventData.roomId === data.roomId)          &&
                (eventData.playerIndex === data.playerIndex)
            ) {
                this._updateLabelReady();
            }
        }

        protected _onDataChanged(): void {
            this._updateComponentsForSettings();
            this._updateLabelReady();
        }

        private _updateComponentsForLanguage(): void {
            this._labelRankStdTitle.text    = Lang.getText(Lang.Type.B0546);
            this._labelRankFogTitle.text    = Lang.getText(Lang.Type.B0547);
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const data      = this.data;
            const roomInfo  = await MrrModel.getRoomInfo(data.roomId);
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

            const rankScoreArray        = userInfo ? userInfo.userMrwRankInfoArray : undefined;
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
            const roomInfo  = await MrrModel.getRoomInfo(data.roomId);
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
