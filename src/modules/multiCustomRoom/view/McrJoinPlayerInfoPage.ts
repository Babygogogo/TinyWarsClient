
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import CommonConstants  = Utility.CommonConstants;
    import BwHelpers        = BaseWar.BwHelpers;

    export class McrJoinPlayerInfoPage extends GameUi.UiTabPage {
        private readonly _groupInfo     : eui.Group;
        private readonly _listPlayer    : GameUi.UiScrollList<DataForPlayerRenderer, PlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinPlayerInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.McrJoinTargetRoomIdChanged, callback: this._onNotifyMcrJoinTargetRoomIdChanged },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();
            this._updateComponentsForTargetRoomInfo();
        }

        protected async _onClosed(): Promise<void> {
            this._listPlayer.clear();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMcrJoinTargetRoomIdChanged(e: egret.Event): void {
            this._updateComponentsForTargetRoomInfo();
        }

        private _updateComponentsForLanguage(): void {
        }
        private async _updateComponentsForTargetRoomInfo(): Promise<void> {
            const roomInfo      = await McrModel.Join.getTargetRoomInfo();
            const mapRawData    = roomInfo ? await WarMap.WarMapModel.getRawData(roomInfo.settingsForMcw.mapId) : null;
            const listPlayer    = this._listPlayer;
            if (mapRawData) {
                listPlayer.bindData(this._createDataForListPlayer(roomInfo, mapRawData.playersCountUnneutral));
            } else {
                listPlayer.clear();
            }
        }

        private _createDataForListPlayer(roomInfo: ProtoTypes.MultiCustomRoom.IMcrRoomInfo, mapPlayersCount: number): DataForPlayerRenderer[] {
            const playerInfoList    = roomInfo.playerDataList;
            const configVersion     = roomInfo.settingsForCommon.configVersion;
            const playerRuleList    = roomInfo.settingsForCommon.warRule.ruleForPlayers;
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= mapPlayersCount; ++playerIndex) {
                dataList.push({
                    configVersion,
                    playerIndex,
                    teamIndex   : BwHelpers.getTeamIndexByRuleForPlayers(playerRuleList, playerIndex),
                    playerData  : playerInfoList.find(v => v.playerIndex === playerIndex),
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        configVersion   : string;
        playerIndex     : number;
        teamIndex       : number;
        playerData      : ProtoTypes.Structure.IDataForPlayerInRoom | null;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo           : eui.Group;
        private readonly _imgSkin           : GameUi.UiImage;
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
        private readonly _btnChat           : GameUi.UiButton;
        private readonly _btnInfo           : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,    callback: this._onTouchedGroupCo },
                { ui: this._btnChat,    callback: this._onTouchedBtnChat },
                { ui: this._btnInfo,    callback: this._onTouchedBtnInfo },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private _onTouchedGroupCo(e: egret.TouchEvent): void {
            const data          = this.data;
            const playerData    = data.playerData;
            const coId          = playerData ? playerData.coId : null;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                Common.CommonCoInfoPanel.show({
                    configVersion   : data.configVersion,
                    coId,
                });
            }
        }

        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            const playerData    = this.data.playerData;
            const userId        = playerData ? playerData.userId : undefined;
            if (userId != null) {
                Chat.ChatPanel.show({ toUserId: userId });
            }
        }

        private _onTouchedBtnInfo(e: egret.TouchEvent): void {
            const playerData    = this.data.playerData;
            const userId        = playerData ? playerData.userId : undefined;
            if (userId != null) {
                User.UserPanel.show({ userId });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            const data                  = this.data;
            this._labelPlayerIndex.text = Lang.getPlayerForceName(data.playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(data.teamIndex);

            const playerData            = data.playerData;
            this._labelIsReady.visible  = (!!playerData) && (!!playerData.isReady);
            this._imgSkin.source        = getSourceForImgSkin(playerData ? playerData.unitAndTileSkinId : null);

            const coId                  = playerData ? playerData.coId : null;
            const coCfg                 = ConfigManager.getCoBasicCfg(data.configVersion, coId);
            this._labelCo.text          = coCfg ? coCfg.name : `??`;
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);

            const userId                = playerData ? playerData.userId : null;
            const userInfo              = userId == null ? null : await User.UserModel.getUserPublicInfo(userId);
            this._btnChat.visible       = !!userInfo;
            this._btnInfo.visible       = !!userInfo;
            this._labelNickname.text    = userInfo ? userInfo.nickname : `??`;

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

        private _updateComponentsForLanguage(): void {
            this._labelRankStdTitle.text    = Lang.getText(Lang.Type.B0546);
            this._labelRankFogTitle.text    = Lang.getText(Lang.Type.B0547);
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
