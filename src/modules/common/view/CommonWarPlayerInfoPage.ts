
import TwnsChatPanel            from "../../chat/view/ChatPanel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers     from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import Helpers                  from "../../tools/helpers/Helpers";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiImage              from "../../tools/ui/UiImage";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
import UserModel                from "../../user/model/UserModel";
import TwnsUserPanel            from "../../user/view/UserPanel";
import TwnsCommonCoInfoPanel    from "./CommonCoInfoPanel";
import TwnsCommonConfirmPanel   from "./CommonConfirmPanel";

namespace TwnsCommonWarPlayerInfoPage {
    import CommonConfirmPanel   = TwnsCommonConfirmPanel.CommonConfirmPanel;
    import CommonCoInfoPanel    = TwnsCommonCoInfoPanel.CommonCoInfoPanel;
    import UserPanel            = TwnsUserPanel.UserPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export type PlayerInfo = {
        playerIndex         : number;
        teamIndex           : number;
        isAi                : boolean;
        userId              : number | null;
        coId                : number | null;
        unitAndTileSkinId   : number | null;
        isReady             : boolean | null;
        isInTurn            : boolean | null;
        isDefeat            : boolean | null;
    };
    export type OpenDataForCommonWarPlayerInfoPage = {
        configVersion           : string;
        playersCountUnneutral   : number;
        roomOwnerPlayerIndex    : number | null;
        callbackOnExitRoom      : (() => void) | null;
        callbackOnDeletePlayer  : ((playerIndex: number) => void) | null;
        playerInfoArray         : PlayerInfo[];
    } | null;
    export class CommonWarPlayerInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForCommonWarPlayerInfoPage> {
        private readonly _groupInfo!    : eui.Group;
        private readonly _listPlayer!   : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

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

        private _updateListPlayer(): void {
            const openData      = this._getOpenData();
            const listPlayer    = this._listPlayer;
            if (openData == null) {
                listPlayer.clear();
                return;
            }

            const {
                configVersion,
                callbackOnExitRoom,
                callbackOnDeletePlayer,
                roomOwnerPlayerIndex,
                playersCountUnneutral,
                playerInfoArray,
            } = openData;
            const isRoomOwnedBySelf = playerInfoArray.find(v => v.playerIndex === roomOwnerPlayerIndex)?.userId === UserModel.getSelfUserId();
            const dataArray         : DataForPlayerRenderer[] = [];
            for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playersCountUnneutral; ++playerIndex) {
                const playerInfo = playerInfoArray.find(v => v.playerIndex === playerIndex);
                if (playerInfo == null) {
                    throw Helpers.newError(`CommonWarPlayerInfoPage._updateListPlayer() empty playerInfo.`);
                }

                dataArray.push({
                    configVersion,
                    isRoomOwnedBySelf,
                    callbackOnExitRoom,
                    callbackOnDeletePlayer,
                    playerInfo,
                });
            }

            listPlayer.bindData(dataArray);
        }
    }

    type DataForPlayerRenderer = {
        configVersion           : string;
        isRoomOwnedBySelf       : boolean;
        callbackOnExitRoom      : (() => void) | null;
        callbackOnDeletePlayer  : ((playerIndex: number) => void) | null;
        playerInfo              : PlayerInfo;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _groupCo!              : eui.Group;
        private readonly _imgSkin!              : TwnsUiImage.UiImage;
        private readonly _imgCoHead!            : TwnsUiImage.UiImage;
        private readonly _imgCoInfo!            : TwnsUiImage.UiImage;
        private readonly _labelNickname!        : TwnsUiLabel.UiLabel;
        private readonly _labelCo!              : TwnsUiLabel.UiLabel;
        private readonly _labelStatus!          : TwnsUiLabel.UiLabel;

        private readonly _labelPlayerIndex!     : TwnsUiLabel.UiLabel;
        private readonly _labelTeamIndex!       : TwnsUiLabel.UiLabel;
        private readonly _labelRankStdTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelRankStd!         : TwnsUiLabel.UiLabel;
        private readonly _labelRankFogTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelRankFog!         : TwnsUiLabel.UiLabel;

        private readonly _groupButton!          : eui.Group;
        private readonly _btnChat!              : TwnsUiButton.UiButton;
        private readonly _btnInfo!              : TwnsUiButton.UiButton;
        private readonly _btnDelete!            : TwnsUiButton.UiButton;

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
            const data  = this._getData();
            const coId  = data.playerInfo.coId;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
                CommonCoInfoPanel.show({
                    configVersion   : data.configVersion,
                    coId,
                });
            }
        }

        private _onTouchedBtnChat(): void {
            const userId = this._getData().playerInfo.userId;
            if (userId != null) {
                TwnsChatPanel.ChatPanel.show({ toUserId: userId });
            }
        }

        private _onTouchedBtnInfo(): void {
            const userId = this._getData().playerInfo.userId;
            if (userId != null) {
                UserPanel.show({ userId });
            }
        }

        private async _onTouchedBtnDelete(): Promise<void> {
            const data          = this._getData();
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

            const data                  = this._getData();
            const playerInfo            = data.playerInfo;
            const playerIndex           = playerInfo.playerIndex;
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
            this._labelTeamIndex.text   = Lang.getPlayerTeamName(playerInfo.teamIndex) || CommonConstants.ErrorTextForUndefined;
            this._imgSkin.source        = getSourceForImgSkin(playerInfo.unitAndTileSkinId);

            const coId              = playerInfo.coId;
            const labelCo           = this._labelCo;
            const imgCoHead         = this._imgCoHead;
            const imgCoInfo         = this._imgCoInfo;
            if (coId == null) {
                labelCo.text        = `??`;
                imgCoHead.source    = ``;
                imgCoInfo.visible   = false;
            } else {
                const coCfg         = ConfigManager.getCoBasicCfg(data.configVersion, coId);
                labelCo.text        = coCfg.name;
                imgCoHead.source    = ConfigManager.getCoHeadImageSource(coId);
                imgCoInfo.visible   = (coId !== CommonConstants.CoEmptyId);
            }

            const userId        = playerInfo.userId;
            const userInfo      = userId == null ? null : await UserModel.getUserPublicInfo(userId);
            const labelNickname = this._labelNickname;
            if (userInfo) {
                labelNickname.text = userInfo.nickname || CommonConstants.ErrorTextForUndefined;
            } else {
                labelNickname.text = playerInfo.isAi ? Lang.getText(LangTextType.B0607) : `??`;
            }

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
            const playerInfo    = this._getData().playerInfo;
            const label         = this._labelStatus;
            if (playerInfo.isReady) {
                label.text = Lang.getText(LangTextType.B0402);
            } else if (playerInfo.isInTurn) {
                label.text = Lang.getText(LangTextType.B0086);
            } else if (playerInfo.isDefeat != null) {
                label.text = Lang.getText(playerInfo.isDefeat ? LangTextType.B0472 : LangTextType.B0471);
            } else {
                // TODO
                label.text = ``;
            }
        }

        private async _updateComponentsForRankInfo(): Promise<void> {
            const userId                = this._getData().playerInfo.userId;
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

    function getSourceForImgSkin(skinId: Types.Undefinable<number>): string {
        switch (skinId) {
            case 1  : return `uncompressedRectangle0002`;
            case 2  : return `uncompressedRectangle0003`;
            case 3  : return `uncompressedRectangle0004`;
            case 4  : return `uncompressedRectangle0005`;
            default : return `uncompressedRectangle0006`;
        }
    }
}

export default TwnsCommonWarPlayerInfoPage;
