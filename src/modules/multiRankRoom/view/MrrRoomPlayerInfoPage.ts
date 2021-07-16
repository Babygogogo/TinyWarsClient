
import TwnsCommonCoInfoPanel    from "../../common/view/CommonCoInfoPanel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
import UserModel                from "../../user/model/UserModel";
import WarMapModel              from "../../warMap/model/WarMapModel";
import MrrModel                 from "../model/MrrModel";

namespace TwnsMrrRoomPlayerInfoPage {
    import CommonCoInfoPanel    = TwnsCommonCoInfoPanel.CommonCoInfoPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export type OpenDataForMrrRoomPlayerInfoPage = {
        roomId  : number;
    };
    export class MrrRoomPlayerInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForMrrRoomPlayerInfoPage> {
        private readonly _groupInfo     : eui.Group;
        private readonly _listPlayer    : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrRoomPlayerInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMrrGetRoomPublicInfo,    callback: this._onNotifyMsgMrrGetRoomPublicInfo },
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
            // nothing to do
        }
        private async _updateComponentsForRoomInfo(): Promise<void> {
            const roomInfo      = await MrrModel.getRoomInfo(this._getOpenData().roomId);
            const mapRawData    = roomInfo ? await WarMapModel.getRawData(roomInfo.settingsForMrw.mapId) : null;
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
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo           : eui.Group;
        private readonly _imgSkin           : TwnsUiImage.UiImage;
        private readonly _imgCoInfo         : TwnsUiImage.UiImage;
        private readonly _imgCoHead         : TwnsUiImage.UiImage;
        private readonly _labelNickname     : TwnsUiLabel.UiLabel;
        private readonly _labelCo           : TwnsUiLabel.UiLabel;
        private readonly _labelIsReady      : TwnsUiLabel.UiLabel;

        private readonly _labelPlayerIndex  : TwnsUiLabel.UiLabel;
        private readonly _labelTeamIndex    : TwnsUiLabel.UiLabel;
        private readonly _labelRankStdTitle : TwnsUiLabel.UiLabel;
        private readonly _labelRankStd      : TwnsUiLabel.UiLabel;
        private readonly _labelRankFogTitle : TwnsUiLabel.UiLabel;
        private readonly _labelRankFog      : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,    callback: this._onTouchedGroupCo },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMrrSetSelfSettings,      callback: this._onNotifyMsgMrrSetSelfSettings },
                { type: NotifyType.MsgMrrSetBannedCoIdList,    callback: this._onNotifyMsgMrrSetBannedCoIdList },
            ]);

            this._updateComponentsForLanguage();
        }

        private async _onTouchedGroupCo(e: egret.TouchEvent): Promise<void> {
            const data          = this.data;
            const roomInfo      = await MrrModel.getRoomInfo(data.roomId);
            const playerData    = roomInfo ? (roomInfo.playerDataList || []).find(v => v.playerIndex === data.playerIndex) : null;
            const coId          = playerData ? playerData.coId : null;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                CommonCoInfoPanel.show({
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
            this._labelRankStdTitle.text    = Lang.getText(LangTextType.B0546);
            this._labelRankFogTitle.text    = Lang.getText(LangTextType.B0547);
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
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(WarCommonHelpers.getTeamIndexByRuleForPlayers(settingsForCommon.warRule.ruleForPlayers, playerIndex));

            const playerDataList        = roomInfo.playerDataList || [];
            const playerData            = playerDataList.find(v => v.playerIndex === playerIndex);
            this._imgSkin.source        = getSourceForImgSkin(playerData ? playerData.unitAndTileSkinId : null);

            const coId                  = playerData ? playerData.coId : null;
            const coCfg                 = ConfigManager.getCoBasicCfg(settingsForCommon.configVersion, coId);
            this._labelCo.text          = coCfg ? coCfg.name : `??`;
            this._imgCoHead.source      = ConfigManager.getCoHeadImageSource(coId);
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);

            const userId                = playerData ? playerData.userId : null;
            const userInfo              = userId == null ? null : await UserModel.getUserPublicInfo(userId);
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

export default TwnsMrrRoomPlayerInfoPage;
