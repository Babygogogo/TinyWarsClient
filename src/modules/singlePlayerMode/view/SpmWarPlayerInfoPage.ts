
import { UiImage }                      from "../../../gameui/UiImage";
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { CommonCoInfoPanel }            from "../../common/view/CommonCoInfoPanel";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as BwHelpers                   from "../../baseWar/model/BwHelpers";
import * as SpmModel                    from "../model/SpmModel";

export type OpenDataForSpmWarPlayerInfoPage = {
    slotIndex   : number;
};
export class SpmWarPlayerInfoPage extends UiTabPage<OpenDataForSpmWarPlayerInfoPage> {
    private readonly _groupInfo     : eui.Group;
    private readonly _listPlayer    : UiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        this.skinName = "resource/skins/singlePlayerMode/SpmWarPlayerInfoPage.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.MsgSpmGetWarSaveSlotFullDataArray,  callback: this._onNotifyMsgSpmGetWarSaveSlotFullDataArray },
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
    private _onNotifyMsgSpmGetWarSaveSlotFullDataArray(e: egret.Event): void {
        this._updateComponentsForPlayerInfo();
    }

    private _updateComponentsForLanguage(): void {
        // nothing to do
    }
    private _updateComponentsForPlayerInfo(): void {
        this._listPlayer.bindData(this._createDataForListPlayer());
    }

    private _createDataForListPlayer(): DataForPlayerRenderer[] {
        const slotIndex             = this._getOpenData().slotIndex;
        const slotData              = SpmModel.SaveSlot.getSlotDict().get(slotIndex);
        const playersCountUnneutral = slotData ? slotData.warData.playerManager.players.length - 1 : null;
        const dataList              : DataForPlayerRenderer[] = [];
        for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
            dataList.push({
                slotIndex,
                playerIndex,
            });
        }

        return dataList;
    }
}

type DataForPlayerRenderer = {
    slotIndex   : number;
    playerIndex : number;
};

class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private readonly _groupCo               : eui.Group;
    private readonly _imgSkin               : UiImage;
    private readonly _imgCoHead             : UiImage;
    private readonly _imgCoInfo             : UiImage;
    private readonly _labelCo               : UiLabel;
    private readonly _labelPlayerType       : UiLabel;

    private readonly _labelPlayerIndex      : UiLabel;
    private readonly _labelTeamIndex        : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._groupCo,    callback: this._onTouchedGroupCo },
        ]);
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this._updateComponentsForLanguage();
    }

    private async _onTouchedGroupCo(e: egret.TouchEvent): Promise<void> {
        const playerData    = this._getPlayerData();
        const coId          = playerData ? playerData.coId : null;
        if ((coId != null) && (coId !== CommonConstants.CoEmptyId)) {
            CommonCoInfoPanel.show({
                configVersion   : SpmModel.SaveSlot.getSlotDict().get(this.data.slotIndex).warData.settingsForCommon.configVersion,
                coId,
            });
        }
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    protected _onDataChanged(): void {
        this._updateComponentsForSettings();
    }

    private _updateComponentsForLanguage(): void {
        // nothing to do
    }

    private async _updateComponentsForSettings(): Promise<void> {
        const data      = this.data;
        const slotData  = SpmModel.SaveSlot.getSlotDict().get(data.slotIndex);
        if (!slotData) {
            return;
        }

        const playerIndex           = this.data.playerIndex;
        const settingsForCommon     = slotData.warData.settingsForCommon;
        this._labelPlayerIndex.text = Lang.getPlayerForceName(playerIndex);
        this._labelTeamIndex.text   = Lang.getPlayerTeamName(BwHelpers.getTeamIndexByRuleForPlayers(settingsForCommon.warRule.ruleForPlayers, playerIndex));

        const playerData            = this._getPlayerData();
        this._imgSkin.source        = getSourceForImgSkin(playerData ? playerData.unitAndTileSkinId : null);
        this._labelPlayerType.text  = playerData.userId == null
            ? Lang.getText(Lang.Type.B0607)
            : Lang.getText(Lang.Type.B0031);

        const coId                  = playerData ? playerData.coId : null;
        const coCfg                 = ConfigManager.getCoBasicCfg(settingsForCommon.configVersion, coId);
        this._imgCoHead.source      = ConfigManager.getCoHeadImageSource(coId);
        this._labelCo.text          = coCfg ? coCfg.name : `??`;
        this._imgCoInfo.visible     = (coId !== CommonConstants.CoEmptyId) && (!!coCfg);
    }

    private _getPlayerData(): ProtoTypes.WarSerialization.ISerialPlayer {
        const data      = this.data;
        const slotData  = SpmModel.SaveSlot.getSlotDict().get(data.slotIndex);
        return slotData ? slotData.warData.playerManager.players.find(v => v.playerIndex === data.playerIndex) : null;
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
