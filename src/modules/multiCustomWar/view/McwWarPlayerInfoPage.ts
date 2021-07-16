
import TwnsChatPanel            from "../../chat/view/ChatPanel";
import TwnsCommonCoInfoPanel    from "../../common/view/CommonCoInfoPanel";
import MpwModel                 from "../../multiPlayerWar/model/MpwModel";
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

namespace TwnsMcwWarPlayerInfoPage {
    import CommonCoInfoPanel    = TwnsCommonCoInfoPanel.CommonCoInfoPanel;
    import UserPanel            = TwnsUserPanel.UserPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export type OpenDataForMcwWarPlayerInfoPage = {
        warId   : number | null | undefined;
    };
    export class McwWarPlayerInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForMcwWarPlayerInfoPage> {
        // @ts-ignore
        private readonly _groupInfo     : eui.Group;
        // @ts-ignore
        private readonly _listPlayer    : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomWar/McwWarPlayerInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMpwCommonGetMyWarInfoList,   callback: this._onNotifyMsgMpwCommonGetMyWarInfoList },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();
            this._updateComponentsForWarInfo();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMsgMpwCommonGetMyWarInfoList(): void {
            this._updateComponentsForWarInfo();
        }

        private _updateComponentsForLanguage(): void {
            // nothing to do.
        }
        private async _updateComponentsForWarInfo(): Promise<void> {
            const warId                 = this._getOpenData().warId;
            const warInfo               = warId != null ? MpwModel.getMyWarInfo(warId) : undefined;
            const settingsForMcw        = warInfo ? warInfo.settingsForMcw : undefined;
            const mapId                 = settingsForMcw ? settingsForMcw.mapId : undefined;
            const mapRawData            = mapId != null ? await WarMapModel.getRawData(mapId) : null;
            const playersCountUnneutral = mapRawData ? mapRawData.playersCountUnneutral : undefined;
            const listPlayer            = this._listPlayer;
            if ((warId != null) && (playersCountUnneutral != null)) {
                listPlayer.bindData(this._createDataForListPlayer(warId, playersCountUnneutral));
            } else {
                listPlayer.clear();
            }
        }

        private _createDataForListPlayer(warId: number, playersCountUnneutral: number): DataForPlayerRenderer[] {
            const dataArray: DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataArray.push({
                    warId,
                    playerIndex,
                });
            }

            return dataArray;
        }
    }

    type DataForPlayerRenderer = {
        warId           : number;
        playerIndex     : number;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        // @ts-ignore
        private readonly _groupCo           : eui.Group;
        // @ts-ignore
        private readonly _imgSkin           : TwnsUiImage.UiImage;
        // @ts-ignore
        private readonly _imgCoInfo         : TwnsUiImage.UiImage;
        // @ts-ignore
        private readonly _imgCoHead         : TwnsUiImage.UiImage;
        // @ts-ignore
        private readonly _labelNickname     : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _labelCo           : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _labelStatus       : TwnsUiLabel.UiLabel;

        // @ts-ignore
        private readonly _labelPlayerIndex  : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _labelTeamIndex    : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _labelRankStdTitle : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _labelRankStd      : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _labelRankFogTitle : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _labelRankFog      : TwnsUiLabel.UiLabel;

        // @ts-ignore
        private readonly _groupButton       : eui.Group;
        // @ts-ignore
        private readonly _btnChat           : TwnsUiButton.UiButton;
        // @ts-ignore
        private readonly _btnInfo           : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._groupCo,    callback: this._onTouchedGroupCo },
                { ui: this._btnChat,    callback: this._onTouchedBtnChat },
                { ui: this._btnInfo,    callback: this._onTouchedBtnInfo },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this._updateComponentsForLanguage();
        }

        private async _onTouchedGroupCo(): Promise<void> {
            const data              = this.data;
            const warInfo           = MpwModel.getMyWarInfo(data.warId);
            const settingsForCommon = warInfo ? warInfo.settingsForCommon : undefined;
            const configVersion     = settingsForCommon ? settingsForCommon.configVersion : undefined;
            const playerData        = warInfo ? (warInfo.playerInfoList || []).find(v => v.playerIndex === data.playerIndex) : null;
            const coId              = playerData ? playerData.coId : null;
            if ((coId != null) && (coId !== CommonConstants.CoEmptyId) && (configVersion != null)) {
                CommonCoInfoPanel.show({
                    configVersion,
                    coId,
                });
            }
        }

        private async _onTouchedBtnChat(): Promise<void> {
            const playerData    = await this._getPlayerData();
            const userId        = playerData ? playerData.userId : undefined;
            if (userId != null) {
                TwnsChatPanel.ChatPanel.show({ toUserId: userId });
            }
        }

        private async _onTouchedBtnInfo(): Promise<void> {
            const playerData    = await this._getPlayerData();
            const userId        = playerData ? playerData.userId : undefined;
            if (userId != null) {
                UserPanel.show({ userId });
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        protected _onDataChanged(): void {
            this._updateComponentsForSettings();
            this._updateLabelStatus();
        }

        private _updateComponentsForLanguage(): void {
            this._labelRankStdTitle.text    = Lang.getText(LangTextType.B0546);
            this._labelRankFogTitle.text    = Lang.getText(LangTextType.B0547);
        }

        private async _updateComponentsForSettings(): Promise<void> {
            const data      = this.data;
            const warInfo   = MpwModel.getMyWarInfo(data.warId);
            if (!warInfo) {
                return;
            }

            const playerIndex           = data.playerIndex;
            this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);

            const settingsForCommon     = warInfo.settingsForCommon;
            const warRule               = settingsForCommon ? settingsForCommon.warRule : undefined;
            const ruleForPlayers        = warRule ? warRule.ruleForPlayers : undefined;
            const teamIndex             = ruleForPlayers ? WarCommonHelpers.getTeamIndexByRuleForPlayers(ruleForPlayers, playerIndex) : undefined;
            this._labelTeamIndex.text   = (teamIndex != null ? Lang.getPlayerTeamName(teamIndex) : undefined) || CommonConstants.ErrorTextForUndefined;

            const playerInfoList        = warInfo.playerInfoList || [];
            const playerInfo            = playerInfoList.find(v => v.playerIndex === playerIndex);
            this._imgSkin.source        = getSourceForImgSkin(playerInfo ? playerInfo.unitAndTileSkinId : null);

            const coId      = playerInfo ? playerInfo.coId : null;
            const labelCo   = this._labelCo;
            const imgCoHead = this._imgCoHead;
            const imgCoInfo = this._imgCoInfo;
            if (coId == null) {
                labelCo.text        = CommonConstants.ErrorTextForUndefined;
                imgCoHead.source    = ``;
                imgCoInfo.visible   = false;
            } else {
                const configVersion = settingsForCommon ? settingsForCommon.configVersion : undefined;
                const coCfg         = configVersion != null ? ConfigManager.getCoBasicCfg(configVersion, coId) : undefined;
                labelCo.text        = coCfg ? coCfg.name : `??`;
                imgCoHead.source    = ConfigManager.getCoHeadImageSource(coId);
                imgCoInfo.visible   = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);
            }


            const userId                = playerInfo ? playerInfo.userId : null;
            const userInfo              = userId == null ? null : await UserModel.getUserPublicInfo(userId);
            this._labelNickname.text    = (userInfo ? userInfo.nickname : undefined) || CommonConstants.ErrorTextForUndefined;

            const groupButton           = this._groupButton;
            groupButton.removeChildren();
            if (userInfo) {
                groupButton.addChild(this._btnInfo);

                const selfUserId = UserModel.getSelfUserId();
                if (userId !== selfUserId) {
                    groupButton.addChild(this._btnChat);
                }
            }

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

        private async _updateLabelStatus(): Promise<void> {
            const playerData    = await this._getPlayerData();
            const label         = this._labelStatus;
            if (!playerData) {
                label.text  = CommonConstants.ErrorTextForUndefined;
            } else {
                if (!playerData.isAlive) {
                    label.textColor = 0xFF0000;
                    label.text      = Lang.getText(LangTextType.B0472);
                } else {
                    const warId             = this.data.warId;
                    const warInfo           = warId == null ? undefined : MpwModel.getMyWarInfo(warId);
                    const playerIndexInTurn = warInfo ? warInfo.playerIndexInTurn : undefined;
                    if ((playerIndexInTurn != null) && (playerData.playerIndex === playerIndexInTurn)) {
                        label.textColor = 0xFAD804;
                        label.text      = Lang.getText(LangTextType.B0086);
                    } else {
                        label.text      = ``;
                    }
                }
            }
        }

        private _getPlayerData(): ProtoTypes.Structure.IWarPlayerInfo | undefined {
            const data      = this.data;
            const warInfo   = MpwModel.getMyWarInfo(data.warId);
            return warInfo
                ? (warInfo.playerInfoList || []).find(v => v.playerIndex === data.playerIndex)
                : undefined;
        }
    }

    function getSourceForImgSkin(skinId: number | null | undefined): string {
        switch (skinId) {
            case 1  : return `commonRectangle0002`;
            case 2  : return `commonRectangle0003`;
            case 3  : return `commonRectangle0004`;
            case 4  : return `commonRectangle0005`;
            default : return `commonRectangle0006`;
        }
    }
}

export default TwnsMcwWarPlayerInfoPage;
