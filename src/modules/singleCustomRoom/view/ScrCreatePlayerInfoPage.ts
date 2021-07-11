
import { UiImage }                      from "../../../gameui/UiImage";
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { CommonCoInfoPanel }            from "../../common/view/CommonCoInfoPanel";
import { ScrCreateChooseCoPanel }       from "./ScrCreateChooseCoPanel";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as BwHelpers                   from "../../baseWar/model/BwHelpers";
import * as ScrModel                    from "../model/ScrModel";

export class ScrCreatePlayerInfoPage extends UiTabPage<void> {
    private readonly _groupInfo     : eui.Group;
    private readonly _listPlayer    : UiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        this.skinName = "resource/skins/singleCustomRoom/ScrCreatePlayerInfoPage.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        this._listPlayer.setItemRenderer(PlayerRenderer);

        this._updateComponentsForLanguage();
        this._updateComponentsForPlayerInfo();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        // nothing to do
    }
    private async _updateComponentsForPlayerInfo(): Promise<void> {
        const mapRawData    = await ScrModel.Create.getMapRawData();
        const listPlayer    = this._listPlayer;
        if (mapRawData) {
            listPlayer.bindData(this._createDataForListPlayer(mapRawData.playersCountUnneutral));
        } else {
            listPlayer.clear();
        }
    }

    private _createDataForListPlayer(playersCountUnneutral: number): DataForPlayerRenderer[] {
        const dataList: DataForPlayerRenderer[] = [];
        for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataList.push({
                playerIndex,
            });
        }

        return dataList;
    }
}

type DataForPlayerRenderer = {
    playerIndex     : number;
};
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo               : eui.Group;
    private readonly _imgSkin               : UiImage;
    private readonly _imgCoInfo             : UiImage;
    private readonly _imgCoHead             : UiImage;
    private readonly _labelCo               : UiLabel;
    private readonly _labelPlayerType       : UiLabel;

    private readonly _labelPlayerIndex      : UiLabel;
    private readonly _labelTeamIndex        : UiLabel;

    private readonly _btnChangeCo           : UiButton;
    private readonly _btnChangeController   : UiButton;
    private readonly _btnChangeSkinId       : UiButton;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,                callback: this._onTouchedGroupCo },
            { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo },
            { ui: this._btnChangeController,    callback: this._onTouchedBtnChangeController },
            { ui: this._btnChangeSkinId,        callback: this._onTouchedBtnChangeSkinId },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotifyType.ScrCreatePlayerInfoChanged,     callback: this._onNotifyScrCreatePlayerInfoChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private async _onTouchedGroupCo(e: egret.TouchEvent): Promise<void> {
        const playerData    = this._getPlayerData();
        const coId          = playerData ? playerData.coId : null;
        if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
            CommonCoInfoPanel.show({
                configVersion   : ScrModel.Create.getConfigVersion(),
                coId,
            });
        }
    }

    private async _onTouchedBtnChangeController(e: egret.TouchEvent): Promise<void> {
        ScrModel.Create.tickUserId(this.data.playerIndex);
    }

    private async _onTouchedBtnChangeSkinId(e: egret.TouchEvent): Promise<void> {
        ScrModel.Create.tickUnitAndTileSkinId(this.data.playerIndex);
    }

    private async _onTouchedBtnChangeCo(e: egret.TouchEvent): Promise<void> {
        ScrCreateChooseCoPanel.show({ playerIndex: this.data.playerIndex });
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyScrCreatePlayerInfoChanged(e: egret.Event): void {
        const eventData = e.data as Notify.Data.ScrCreatePlayerInfoChanged;
        if (eventData.playerIndex === this.data.playerIndex) {
            this._updateComponentsForSettings();
        }
    }

    protected _onDataChanged(): void {
        this._updateComponentsForSettings();
    }

    private _updateComponentsForLanguage(): void {
        this._btnChangeCo.label         = Lang.getText(LangTextType.B0230);
        this._btnChangeController.label = Lang.getText(LangTextType.B0608);
        this._btnChangeSkinId.label     = Lang.getText(LangTextType.B0609);
    }

    private async _updateComponentsForSettings(): Promise<void> {
        const roomInfo  = ScrModel.Create.getData();
        if (!roomInfo) {
            return;
        }

        const playerIndex           = this.data.playerIndex;
        const settingsForCommon     = roomInfo.settingsForCommon;
        this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
        this._labelTeamIndex.text   = Lang.getPlayerTeamName(BwHelpers.getTeamIndexByRuleForPlayers(settingsForCommon.warRule.ruleForPlayers, playerIndex));

        const playerData            = this._getPlayerData();
        this._imgSkin.source        = getSourceForImgSkin(playerData ? playerData.unitAndTileSkinId : null);
        this._labelPlayerType.text  = playerData.userId == null
            ? Lang.getText(LangTextType.B0607)
            : Lang.getText(LangTextType.B0031);

        const coId                  = playerData ? playerData.coId : null;
        const coCfg                 = ConfigManager.getCoBasicCfg(settingsForCommon.configVersion, coId);
        this._labelCo.text          = coCfg ? coCfg.name : `??`;
        this._imgCoHead.source      = ConfigManager.getCoHeadImageSource(coId);
        this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);
    }

    private _getPlayerData(): ProtoTypes.Structure.IDataForPlayerInRoom {
        return ScrModel.Create.getPlayerInfo(this.data.playerIndex);
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
