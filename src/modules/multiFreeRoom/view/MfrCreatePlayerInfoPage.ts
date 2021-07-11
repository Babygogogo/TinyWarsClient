
import { UiImage }              from "../../../gameui/UiImage";
import { UiListItemRenderer }   from "../../../gameui/UiListItemRenderer";
import { UiLabel }              from "../../../gameui/UiLabel";
import { UiScrollList }         from "../../../gameui/UiScrollList";
import { UiTabPage }            from "../../../gameui/UiTabPage";
import { CommonCoInfoPanel }    from "../../common/view/CommonCoInfoPanel";
import * as CommonConstants     from "../../../utility/CommonConstants";
import * as ConfigManager       from "../../../utility/ConfigManager";
import * as Helpers             from "../../../utility/Helpers";
import * as Lang                from "../../../utility/Lang";
import * as Notify              from "../../../utility/Notify";
import * as Types               from "../../../utility/Types";
import * as BwHelpers           from "../../baseWar/model/BwHelpers";
import * as MfrModel            from "../../multiFreeRoom/model/MfrModel";
import * as UserModel           from "../../user/model/UserModel";

export class MfrCreatePlayerInfoPage extends UiTabPage<void> {
    // @ts-ignore
    private readonly _groupInfo     : eui.Group;
    // @ts-ignore
    private readonly _listPlayer    : UiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiFreeRoom/MfrCreatePlayerInfoPage.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        this._listPlayer.setItemRenderer(PlayerRenderer);

        this._updateComponentsForLanguage();
        this._updateComponentsForRoomInfo();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        // nothing to do
    }
    private _updateComponentsForRoomInfo(): void {
        const dataArray         : DataForPlayerRenderer[] = [];
        const maxPlayerIndex    = MfrModel.Create.getInitialWarData().playerManager.players.length - 1;
        for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= maxPlayerIndex; ++playerIndex) {
            dataArray.push({
                playerIndex,
            });
        }
        this._listPlayer.bindData(dataArray);
    }
}

type DataForPlayerRenderer = {
    playerIndex     : number;
};
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    // @ts-ignore
    private readonly _groupCo           : eui.Group;
    // @ts-ignore
    private readonly _imgSkin           : UiImage;
    // @ts-ignore
    private readonly _imgCoHead         : UiImage;
    // @ts-ignore
    private readonly _imgCoInfo         : UiImage;
    // @ts-ignore
    private readonly _labelNickname     : UiLabel;
    // @ts-ignore
    private readonly _labelCo           : UiLabel;

    // @ts-ignore
    private readonly _labelPlayerIndex  : UiLabel;
    // @ts-ignore
    private readonly _labelTeamIndex    : UiLabel;
    // @ts-ignore
    private readonly _labelRankStdTitle : UiLabel;
    // @ts-ignore
    private readonly _labelRankStd      : UiLabel;
    // @ts-ignore
    private readonly _labelRankFogTitle : UiLabel;
    // @ts-ignore
    private readonly _labelRankFog      : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,    callback: this._onTouchedGroupCo },
        ]);
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.MfrCreateSelfPlayerIndexChanged,    callback: this._onNotifyMfrCreateSelfPlayerIndexChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private async _onTouchedGroupCo(): Promise<void> {
        const playerIndex       = this.data.playerIndex;
        const initialWarData    = MfrModel.Create.getInitialWarData();
        const coId              = initialWarData.playerManager.players.find(v => v.playerIndex === playerIndex).coId;
        if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
            CommonCoInfoPanel.show({
                configVersion   : initialWarData.settingsForCommon.configVersion,
                coId,
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMfrCreateSelfPlayerIndexChanged(): void {
        this._updateComponentsForSettings();
    }

    protected _onDataChanged(): void {
        this._updateComponentsForSettings();
    }

    private _updateComponentsForLanguage(): void {
        this._labelRankStdTitle.text    = Lang.getText(Lang.Type.B0546);
        this._labelRankFogTitle.text    = Lang.getText(Lang.Type.B0547);
    }

    private async _updateComponentsForSettings(): Promise<void> {
        const playerIndex           = this.data.playerIndex;
        const initialWarData        = MfrModel.Create.getInitialWarData();
        const settingsForCommon     = initialWarData.settingsForCommon;
        this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
        this._labelTeamIndex.text   = Lang.getPlayerTeamName(BwHelpers.getTeamIndexByRuleForPlayers(settingsForCommon.warRule.ruleForPlayers, playerIndex));

        const playerData            = initialWarData.playerManager.players.find(v => v.playerIndex === playerIndex);
        this._imgSkin.source        = getSourceForImgSkin(playerData.unitAndTileSkinId);

        const coId                  = playerData.coId;
        const coCfg                 = ConfigManager.getCoBasicCfg(settingsForCommon.configVersion, coId);
        this._labelCo.text          = coCfg ? coCfg.name : `??`;
        this._imgCoHead.source      = ConfigManager.getCoHeadImageSource(coId);
        this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);

        const userInfo              = MfrModel.Create.getSelfPlayerIndex() === playerIndex ? await UserModel.getUserPublicInfo(UserModel.getSelfUserId()) : null;
        const labelNickname         = this._labelNickname;
        if (userInfo) {
            labelNickname.text = userInfo.nickname || CommonConstants.ErrorTextForUndefined;
        } else {
            labelNickname.text = playerData.userId == null ? Lang.getText(Lang.Type.B0607) : `??`;
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
