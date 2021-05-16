
namespace TinyWars.ReplayWar {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import Types            = Utility.Types;
    import CommonConstants  = Utility.CommonConstants;
    import BwHelpers        = BaseWar.BwHelpers;

    export type OpenDataForRwReplayPlayerInfoPage = {
        replayId: number;
    }
    export class RwReplayPlayerInfoPage extends GameUi.UiTabPage<OpenDataForRwReplayPlayerInfoPage> {
        private readonly _groupInfo     : eui.Group;
        private readonly _listPlayer    : GameUi.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/replayWar/RwReplayPlayerInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgReplayGetInfoList,   callback: this._onNotifyMsgReplayGetInfoList },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();
            this._updateComponentsForReplayInfo();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMsgReplayGetInfoList(e: egret.Event): void {
            const data      = e.data as ProtoTypes.NetMessage.MsgReplayGetInfoList.IS;
            const replayId  = this._getOpenData().replayId;
            if ((replayId != null) && ((data.infos || []).find(v => v.replayBriefInfo.replayId === replayId))) {
                this._updateComponentsForReplayInfo();
            }
        }

        private _updateComponentsForLanguage(): void {
        }
        private async _updateComponentsForReplayInfo(): Promise<void> {
            const replayInfo    = RwModel.getReplayInfo(this._getOpenData().replayId);
            const mapRawData    = replayInfo ? await WarMap.WarMapModel.getRawData(replayInfo.replayBriefInfo.mapId) : null;
            const listPlayer    = this._listPlayer;
            if (mapRawData) {
                listPlayer.bindData(this._createDataForListPlayer(replayInfo, mapRawData.playersCountUnneutral));
            } else {
                listPlayer.clear();
            }
        }

        private _createDataForListPlayer(replayInfo: ProtoTypes.Replay.IReplayInfo, mapPlayersCount: number): DataForPlayerRenderer[] {
            const replayId  = replayInfo.replayBriefInfo.replayId;
            const dataArray : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= mapPlayersCount; ++playerIndex) {
                dataArray.push({
                    replayId,
                    playerIndex,
                });
            }

            return dataArray;
        }
    }

    type DataForPlayerRenderer = {
        replayId        : number;
        playerIndex     : number;
    }
    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo           : eui.Group;
        private readonly _imgSkin           : GameUi.UiImage;
        private readonly _imgCoInfo         : GameUi.UiImage;
        private readonly _imgCoHead         : GameUi.UiImage;
        private readonly _labelNickname     : GameUi.UiLabel;
        private readonly _labelCo           : GameUi.UiLabel;
        private readonly _labelStatus       : GameUi.UiLabel;

        private readonly _labelPlayerIndex  : GameUi.UiLabel;
        private readonly _labelTeamIndex    : GameUi.UiLabel;
        private readonly _labelRankStdTitle : GameUi.UiLabel;
        private readonly _labelRankStd      : GameUi.UiLabel;
        private readonly _labelRankFogTitle : GameUi.UiLabel;
        private readonly _labelRankFog      : GameUi.UiLabel;

        private readonly _groupButton       : eui.Group;
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
            const data              = this.data;
            const replayInfo        = RwModel.getReplayInfo(data.replayId);
            const replayBriefInfo   = replayInfo ? replayInfo.replayBriefInfo : null;
            const playerData        = replayBriefInfo ? (replayBriefInfo.playerInfoList || []).find(v => v.playerIndex === data.playerIndex) : null;
            const coId              = playerData ? playerData.coId : null;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                Common.CommonCoInfoPanel.show({
                    configVersion   : replayBriefInfo.configVersion,
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

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateComponentsForSettings();
            this._updateLabelStatus();
        }

        private _updateComponentsForLanguage(): void {
            this._labelRankStdTitle.text    = Lang.getText(Lang.Type.B0546);
            this._labelRankFogTitle.text    = Lang.getText(Lang.Type.B0547);
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const data              = this.data;
            const replayInfo        = RwModel.getReplayInfo(data.replayId);
            const replayBriefInfo   = replayInfo ? replayInfo.replayBriefInfo : null;
            if (!replayBriefInfo) {
                return;
            }

            const playerIndex           = data.playerIndex;
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);

            const playerInfoList        = replayBriefInfo.playerInfoList || [];
            const playerInfo            = playerInfoList.find(v => v.playerIndex === playerIndex);
            this._labelTeamIndex.text   = playerInfo ? Lang.getPlayerTeamName(playerInfo.teamIndex) : `??`;
            this._imgSkin.source        = getSourceForImgSkin(playerInfo ? playerInfo.unitAndTileSkinId : null);

            const coId                  = playerInfo ? playerInfo.coId : null;
            const coCfg                 = ConfigManager.getCoBasicCfg(replayBriefInfo.configVersion, coId);
            this._labelCo.text          = coCfg ? coCfg.name : `??`;
            this._imgCoHead.source      = ConfigManager.getCoHeadImageSource(coId);
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);

            const userId                = playerInfo ? playerInfo.userId : null;
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

        private _updateLabelStatus(): void {
            const playerData    = this._getPlayerData();
            const label         = this._labelStatus;
            if (!playerData) {
                label.text = null;
            } else {
                label.text = playerData.isAlive ? Lang.getText(Lang.Type.B0471) : null;
            }
        }

        private _getPlayerData(): ProtoTypes.Structure.IWarPlayerInfo {
            const data          = this.data;
            const replayInfo    = RwModel.getReplayInfo(data.replayId);
            return replayInfo
                ? (replayInfo.replayBriefInfo.playerInfoList || []).find(v => v.playerIndex === data.playerIndex)
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
