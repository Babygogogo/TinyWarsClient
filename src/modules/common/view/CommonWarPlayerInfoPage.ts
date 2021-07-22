
import TwnsChatPanel            from "../../chat/view/ChatPanel";
import McrModel                 from "../../multiCustomRoom/model/McrModel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
import UserModel                from "../../user/model/UserModel";
import TwnsUserPanel            from "../../user/view/UserPanel";
import WarMapModel              from "../../warMap/model/WarMapModel";
import TwnsCommonCoInfoPanel    from "./CommonCoInfoPanel";
import TwnsCommonConfirmPanel   from "./CommonConfirmPanel";

namespace TwnsCommonWarPlayerInfoPage {
    import CommonConfirmPanel   = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import CommonCoInfoPanel    = TwnsCommonCoInfoPanel.CommonCoInfoPanel;
    import UserPanel            = TwnsUserPanel.UserPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import IWarRule             = ProtoTypes.WarRule.IWarRule;

    export type PlayerInfo = {
        playerIndex         : number;
        userId              : number | undefined;
        coId                : number | undefined;
        unitAndTileSkinId   : number | undefined;
        isReady             : boolean | undefined;
    };
    export type OpenDataForCommonWarPlayerInfoPage = {
        configVersion           : string;
        warRule                 : IWarRule;
        roomOwnerPlayerIndex    : number | undefined;           // undefined == not a room
        callbackOnExitRoom      : (() => void) | undefined;
        callbackOnDeletePlayer  : ((playerIndex: number) => void) | undefined;
        playerInfoArray         : PlayerInfo[];
    };
    export class CommonWarPlayerInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForCommonWarPlayerInfoPage> {
        private readonly _groupInfo     : eui.Group;
        private readonly _listPlayer    : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonWarPlayerInfoPage.exml";
        }

        protected _onOpened(): void {
            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateListPlayer();
        }

        private async _updateListPlayer(): Promise<void> {
            const roomInfo      = await McrModel.getRoomInfo(this._getOpenData().roomId);
            const mapRawData    = roomInfo ? await WarMapModel.getRawData(roomInfo.settingsForMcw.mapId) : null;
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
        configVersion           : string;
        warRule                 : IWarRule;
        isRoomOwnedBySelf       : boolean;
        callbackOnExitRoom      : (() => void) | undefined;
        callbackOnDeletePlayer  : ((playerIndex: number) => void) | undefined;
        playerInfo              : PlayerInfo;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo           : eui.Group;
        private readonly _imgSkin           : TwnsUiImage.UiImage;
        private readonly _imgCoHead         : TwnsUiImage.UiImage;
        private readonly _imgCoInfo         : TwnsUiImage.UiImage;
        private readonly _labelNickname     : TwnsUiLabel.UiLabel;
        private readonly _labelCo           : TwnsUiLabel.UiLabel;
        private readonly _labelStatus       : TwnsUiLabel.UiLabel;

        private readonly _labelPlayerIndex  : TwnsUiLabel.UiLabel;
        private readonly _labelTeamIndex    : TwnsUiLabel.UiLabel;
        private readonly _labelRankStdTitle : TwnsUiLabel.UiLabel;
        private readonly _labelRankStd      : TwnsUiLabel.UiLabel;
        private readonly _labelRankFogTitle : TwnsUiLabel.UiLabel;
        private readonly _labelRankFog      : TwnsUiLabel.UiLabel;

        private readonly _groupButton       : eui.Group;
        private readonly _btnChat           : TwnsUiButton.UiButton;
        private readonly _btnInfo           : TwnsUiButton.UiButton;
        private readonly _btnDelete         : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,    callback: this._onTouchedGroupCo },
                { ui: this._btnChat,    callback: this._onTouchedBtnChat },
                { ui: this._btnInfo,    callback: this._onTouchedBtnInfo },
                { ui: this._btnDelete,  callback: this._onTouchedBtnDelete },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private _onTouchedGroupCo(): void {
            const data  = this.data;
            const coId  = data.playerInfo.coId;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                CommonCoInfoPanel.show({
                    configVersion   : data.configVersion,
                    coId,
                });
            }
        }

        private _onTouchedBtnChat(): void {
            const userId = this.data.playerInfo.userId;
            if (userId != null) {
                TwnsChatPanel.ChatPanel.show({ toUserId: userId });
            }
        }

        private _onTouchedBtnInfo(): void {
            const userId = this.data.playerInfo.userId;
            if (userId != null) {
                UserPanel.show({ userId });
            }
        }

        private async _onTouchedBtnDelete(): Promise<void> {
            const data          = this.data;
            const playerInfo    = data.playerInfo;
            const userId        = playerInfo.userId;
            if (userId == null) {
                return;
            }

            if (userId === UserModel.getSelfUserId()) {
                const callback = data.callbackOnExitRoom;
                if (callback) {
                    CommonConfirmPanel.show({
                        content : Lang.getText(LangTextType.A0126),
                        callback,
                    });
                }

            } else {
                const callback = data.callbackOnDeletePlayer;
                if ((callback) && (data.isRoomOwnedBySelf)) {
                    CommonConfirmPanel.show({
                        content : Lang.getFormattedText(LangTextType.F0029, await UserModel.getUserNickname(userId)),
                        callback: () => {
                            callback(playerInfo.playerIndex);
                        },
                    });
                }
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        protected _onDataChanged(): void {
            this._updateComponentsForInfo();
        }

        private _updateComponentsForLanguage(): void {
            this._labelRankStdTitle.text    = Lang.getText(LangTextType.B0546);
            this._labelRankFogTitle.text    = Lang.getText(LangTextType.B0547);
        }

        private async _updateComponentsForInfo(): Promise<void> {
            this._updateLabelStatus();
            this._updateComponentsForRankInfo();

            const data                  = this.data;
            const playerInfo            = data.playerInfo;
            const playerIndex           = playerInfo.playerIndex;
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(WarCommonHelpers.getTeamIndexByRuleForPlayers(data.warRule.ruleForPlayers, playerIndex));
            this._imgSkin.source        = getSourceForImgSkin(playerInfo.unitAndTileSkinId);

            const coId                  = playerInfo.coId;
            const coCfg                 = ConfigManager.getCoBasicCfg(data.configVersion, coId);
            this._labelCo.text          = coCfg ? coCfg.name : `??`;
            this._imgCoHead.source      = ConfigManager.getCoHeadImageSource(coId);
            this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);

            const userId                = playerInfo.userId;
            const isAi                  = (userId == null) && (!!playerInfo.isReady);
            const userInfo              = userId == null ? null : await UserModel.getUserPublicInfo(userId);
            this._labelNickname.text    = isAi ? (Lang.getText(LangTextType.B0607)) : (userInfo ? userInfo.nickname : `??`);

            const groupButton = this._groupButton;
            groupButton.removeChildren();
            if (userInfo) {
                groupButton.addChild(this._btnInfo);

                const selfUserId = UserModel.getSelfUserId();
                if (userId !== selfUserId) {
                    groupButton.addChild(this._btnChat);
                }

                if (((data.callbackOnExitRoom) && (userId === selfUserId))      ||
                    ((data.callbackOnDeletePlayer) && (data.isRoomOwnedBySelf))
                ) {
                    groupButton.addChild(this._btnDelete);
                }
            }
        }

        private _updateLabelStatus(): void {
            const playerInfo    = this.data.playerInfo;
            const label         = this._labelStatus;
            if (playerInfo.isReady) {
                label.text = `Ready!`;
            } else {
                // TODO
                label.text = ``;
            }
        }

        private async _updateComponentsForRankInfo(): Promise<void> {
            const userId                = this.data.playerInfo.userId;
            const userInfo              = userId == null ? null : await UserModel.getUserPublicInfo(userId);
            const rankScoreArray        = userInfo?.userMrwRankInfoArray;
            const stdRankInfo           = rankScoreArray?.find(v => v.warType === Types.WarType.MrwStd);
            const fogRankInfo           = rankScoreArray?.find(v => v.warType === Types.WarType.MrwFog);
            const stdScore              = stdRankInfo?.currentScore;
            const fogScore              = fogRankInfo?.currentScore;
            const stdRank               = stdRankInfo?.currentRank;
            const fogRank               = fogRankInfo?.currentRank;
            this._labelRankStd.text     = stdRankInfo
                ? `${stdScore == null ? CommonConstants.RankInitialScore : stdScore} (${stdRank == null ? `--` : `${stdRank}${Helpers.getSuffixForRank(stdRank)}`})`
                : `??`;
            this._labelRankFog.text     = fogRankInfo
                ? `${fogScore == null ? CommonConstants.RankInitialScore : fogScore} (${fogRank == null ? `--` : `${fogRank}${Helpers.getSuffixForRank(fogRank)}`})`
                : `??`;
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

export default TwnsCommonWarPlayerInfoPage;
