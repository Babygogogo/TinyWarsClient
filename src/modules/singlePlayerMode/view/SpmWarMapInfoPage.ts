
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiZoomableMap }                from "../../../gameui/UiZoomableMap";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { UiMapInfo }                    from "../../../gameui/UiMapInfo";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as BwHelpers                   from "../../baseWar/model/BwHelpers";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";
import * as SpmModel                    from "../model/SpmModel";

export type OpenDataForSpmWarMapInfoPage = {
    slotIndex   : number;
};
export class SpmWarMapInfoPage extends UiTabPage<OpenDataForSpmWarMapInfoPage> {
    private readonly _zoomMap       : UiZoomableMap;
    private readonly _uiMapInfo     : UiMapInfo;
    private readonly _labelLoading  : UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/singlePlayerMode/SpmWarMapInfoPage.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgSpmGetWarSaveSlotFullDataArray,  callback: this._onNotifyMsgSpmGetWarSaveSlotFullDataArray },
        ]);

        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        this._updateComponentsForLanguage();
        this._updateComponentsForWarInfo();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgSpmGetWarSaveSlotFullDataArray(e: egret.Event): void {
        this._updateComponentsForWarInfo();
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text = Lang.getText(LangTextType.A0150);
    }
    private async _updateComponentsForWarInfo(): Promise<void> {
        const slotData      = SpmModel.SaveSlot.getSlotDict().get(this._getOpenData().slotIndex);
        const warData       = slotData ? slotData.warData : null;
        const zoomMap       = this._zoomMap;
        const uiMapInfo     = this._uiMapInfo;
        if (warData == null) {
            zoomMap.clearMap();
            uiMapInfo.setData(null);
            return;
        }

        const mapId = BwHelpers.getMapId(warData);
        if (mapId != null) {
            const mapRawData = await WarMapModel.getRawData(mapId);
            if (mapRawData == null) {
                zoomMap.clearMap();
                uiMapInfo.setData(null);
            } else {
                zoomMap.showMapByMapData(mapRawData);
                uiMapInfo.setData({
                    mapInfo: {
                        mapId           : mapRawData.mapId,
                        configVersion   : warData.settingsForCommon.configVersion,
                    },
                });
            }
            return;
        }

        const settingsForSfw = warData.settingsForSfw;
        const initialWarData = settingsForSfw ? settingsForSfw.initialWarData : null;
        if (initialWarData == null) {
            zoomMap.clearMap();
            uiMapInfo.setData(null);
        } else {
            zoomMap.showMapByWarData(initialWarData, warData.playerManager.players);
            uiMapInfo.setData({
                warData: initialWarData,
            });
        }
    }
}
