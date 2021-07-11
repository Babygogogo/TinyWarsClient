
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiZoomableMap }                from "../../../gameui/UiZoomableMap";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { UiMapInfo }                    from "../../../gameui/UiMapInfo";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as MpwModel                    from "../../multiPlayerWar/model/MpwModel";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";

export type OpenDataForMcwWarMapInfoPage = {
    warId   : number | null | undefined;
};
export class McwWarMapInfoPage extends UiTabPage<OpenDataForMcwWarMapInfoPage> {
    // @ts-ignore
    private readonly _zoomMap       : UiZoomableMap;
    // @ts-ignore
    private readonly _uiMapInfo     : UiMapInfo;
    // @ts-ignore
    private readonly _labelLoading  : UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiCustomWar/McwWarMapInfoPage.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.MsgMpwCommonGetMyWarInfoList,   callback: this._onNotifyMsgMpwCommonGetMyWarInfoList },
        ]);

        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        this._updateComponentsForLanguage();
        this._updateComponentsForWarInfo();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
        const data  = e.data as ProtoTypes.NetMessage.MsgMpwCommonGetMyWarInfoList.IS;
        const warId = this._getOpenData().warId;
        if ((warId != null) && ((data.infos || []).find(v => v.warId === warId))) {
            this._updateComponentsForWarInfo();
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text = Lang.getText(Lang.Type.A0150);
    }
    private async _updateComponentsForWarInfo(): Promise<void> {
        const warId             = this._getOpenData().warId;
        const warInfo           = warId != null ? MpwModel.getMyWarInfo(warId) : undefined;
        const settingsForMcw    = warInfo ? warInfo.settingsForMcw : undefined;
        const settingsForCommon = warInfo ? warInfo.settingsForCommon : undefined;
        const configVersion     = settingsForCommon ? settingsForCommon.configVersion : undefined;
        const mapId             = settingsForMcw ? settingsForMcw.mapId : undefined;
        const mapRawData        = mapId != null ? await WarMapModel.getRawData(mapId) : undefined;
        const zoomMap           = this._zoomMap;
        const uiMapInfo         = this._uiMapInfo;
        if ((mapId == null) || (mapRawData == null) || (configVersion == null)) {
            zoomMap.clearMap();
            uiMapInfo.setData(null);
        } else {
            zoomMap.showMapByMapData(mapRawData);
            uiMapInfo.setData({
                mapInfo: {
                    mapId,
                    configVersion,
                },
            });
        }
    }
}
