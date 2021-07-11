
import { UiImage }              from "../../../gameui/UiImage";
import { UiListItemRenderer }   from "../../../gameui/UiListItemRenderer";
import { UiButton }             from "../../../gameui/UiButton";
import { UiLabel }              from "../../../gameui/UiLabel";
import { UiScrollList }         from "../../../gameui/UiScrollList";
import { UiTabPage }            from "../../../gameui/UiTabPage";
import { ChatPanel }            from "../../chat/view/ChatPanel";
import { CommonCoInfoPanel }    from "../../common/view/CommonCoInfoPanel";
import { UserPanel }            from "../../user/view/UserPanel";
import * as CommonConstants     from "../../../utility/CommonConstants";
import * as ConfigManager       from "../../../utility/ConfigManager";
import * as Helpers             from "../../../utility/Helpers";
import * as Lang                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }               from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import { Types }                from "../../../utility/Types";
import * as BwHelpers           from "../../baseWar/model/BwHelpers";
import * as MpwModel            from "../../multiPlayerWar/model/MpwModel";
import * as UserModel           from "../../user/model/UserModel";

export type OpenDataForMfwWarPlayerInfoPage = {
    warId   : number;
};
export class MfwWarPlayerInfoPage extends UiTabPage<OpenDataForMfwWarPlayerInfoPage> {
    private readonly _groupInfo     : eui.Group;
    private readonly _listPlayer    : UiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiFreeWar/MfwWarPlayerInfoPage.exml";
    }

    protected async _onOpened(): Promise<void> {
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

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
        this._updateComponentsForWarInfo();
    }

    private _updateComponentsForLanguage(): void {
        // nothing to do
    }
    private async _updateComponentsForWarInfo(): Promise<void> {
        const warInfo       = await MpwModel.getMyWarInfo(this._getOpenData().warId);
        const warData       = warInfo ? warInfo.settingsForMfw.initialWarData : null;
        const listPlayer    = this._listPlayer;
        if (warData) {
            listPlayer.bindData(this._createDataForListPlayer(warInfo, warData.playerManager.players.length - 1));
        } else {
            listPlayer.clear();
        }
    }

    private _createDataForListPlayer(warInfo: ProtoTypes.MultiPlayerWar.IMpwWarInfo, mapPlayersCount: number): DataForPlayerRenderer[] {
        const dataList: DataForPlayerRenderer[] = [];
        for (let playerIndex = 1; playerIndex <= mapPlayersCount; ++playerIndex) {
            dataList.push({
                warId       : warInfo.warId,
                playerIndex,
            });
        }

        return dataList;
    }
}

type DataForPlayerRenderer = {
    warId           : number;
    playerIndex     : number;
};
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo           : eui.Group;
    private readonly _imgSkin           : UiImage;
    private readonly _imgCoInfo         : UiImage;
    private readonly _imgCoHead         : UiImage;
    private readonly _labelNickname     : UiLabel;
    private readonly _labelCo           : UiLabel;
    private readonly _labelStatus       : UiLabel;

    private readonly _labelPlayerIndex  : UiLabel;
    private readonly _labelTeamIndex    : UiLabel;
    private readonly _labelRankStdTitle : UiLabel;
    private readonly _labelRankStd      : UiLabel;
    private readonly _labelRankFogTitle : UiLabel;
    private readonly _labelRankFog      : UiLabel;

    private readonly _groupButton       : eui.Group;
    private readonly _btnChat           : UiButton;
    private readonly _btnInfo           : UiButton;

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

    private async _onTouchedGroupCo(e: egret.TouchEvent): Promise<void> {
        const data          = this.data;
        const warInfo       = await MpwModel.getMyWarInfo(data.warId);
        const playerData    = warInfo ? (warInfo.playerInfoList || []).find(v => v.playerIndex === data.playerIndex) : null;
        const coId          = playerData ? playerData.coId : null;
        if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
            CommonCoInfoPanel.show({
                configVersion   : warInfo.settingsForCommon.configVersion,
                coId,
            });
        }
    }

    private async _onTouchedBtnChat(e: egret.TouchEvent): Promise<void> {
        const playerData    = await this._getPlayerData();
        const userId        = playerData ? playerData.userId : undefined;
        if (userId != null) {
            ChatPanel.show({ toUserId: userId });
        }
    }

    private async _onTouchedBtnInfo(e: egret.TouchEvent): Promise<void> {
        const playerData    = await this._getPlayerData();
        const userId        = playerData ? playerData.userId : undefined;
        if (userId != null) {
            UserPanel.show({ userId });
        }
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
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
        const warInfo   = await MpwModel.getMyWarInfo(data.warId);
        if (!warInfo) {
            return;
        }

        const playerIndex           = data.playerIndex;
        const settingsForCommon     = warInfo.settingsForCommon;
        this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
        this._labelTeamIndex.text   = Lang.getPlayerTeamName(BwHelpers.getTeamIndexByRuleForPlayers(settingsForCommon.warRule.ruleForPlayers, playerIndex));

        const playerInfoList        = warInfo.playerInfoList || [];
        const playerInfo            = playerInfoList.find(v => v.playerIndex === playerIndex);
        this._imgSkin.source        = getSourceForImgSkin(playerInfo ? playerInfo.unitAndTileSkinId : null);

        const coId                  = playerInfo ? playerInfo.coId : null;
        const coCfg                 = ConfigManager.getCoBasicCfg(settingsForCommon.configVersion, coId);
        this._labelCo.text          = coCfg ? coCfg.name : `??`;
        this._imgCoHead.source      = ConfigManager.getCoHeadImageSource(coId);
        this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);

        const userId                = playerInfo ? playerInfo.userId : null;
        const userInfo              = userId == null ? null : await UserModel.getUserPublicInfo(userId);
        this._labelNickname.text    = userInfo ? userInfo.nickname : `??`;

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
            label.text  = null;
        } else {
            if (!playerData.isAlive) {
                label.textColor = 0xFF0000;
                label.text      = Lang.getText(LangTextType.B0472);
            } else {
                if (playerData.playerIndex === (await MpwModel.getMyWarInfo(this.data.warId)).playerIndexInTurn) {
                    label.textColor = 0xFAD804;
                    label.text      = Lang.getText(LangTextType.B0086);
                } else {
                    label.text      = null;
                }
            }
        }
    }

    private async _getPlayerData(): Promise<ProtoTypes.Structure.IWarPlayerInfo> {
        const data      = this.data;
        const warInfo   = await MpwModel.getMyWarInfo(data.warId);
        return warInfo
            ? (warInfo.playerInfoList || []).find(v => v.playerIndex === data.playerIndex)
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
