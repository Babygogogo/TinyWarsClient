
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiZoomableMap }                from "../../../gameui/UiZoomableMap";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { UiMapInfo }                    from "../../../gameui/UiMapInfo";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";

export type OpenDataForMrrPreviewMapInfoPage = {
    mapId: number;
};
export class MrrPreviewMapInfoPage extends UiTabPage<OpenDataForMrrPreviewMapInfoPage> {
    private readonly _zoomMap       : UiZoomableMap;
    private readonly _uiMapInfo     : UiMapInfo;
    private readonly _labelLoading  : UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiRankRoom/MrrPreviewMapInfoPage.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMapGetRawData,   callback: this._onNotifyMsgMapGetRawData },
        ]);

        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        this._updateComponentsForLanguage();
        this._updateComponentsForMapInfo();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMapGetRawData(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMapGetRawData.IS;
        if (data.mapId === this._getOpenData().mapId) {
            this._updateComponentsForMapInfo();
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text = Lang.getText(LangTextType.A0150);
    }
    private async _updateComponentsForMapInfo(): Promise<void> {
        const mapRawData    = await WarMapModel.getRawData(this._getOpenData().mapId);
        const zoomMap       = this._zoomMap;
        const uiMapInfo     = this._uiMapInfo;
        if (!mapRawData) {
            zoomMap.clearMap();
            uiMapInfo.setData(null);
        } else {
            zoomMap.showMapByMapData(mapRawData);
            uiMapInfo.setData({
                mapInfo: {
                    mapId           : mapRawData.mapId,
                    configVersion   : ConfigManager.getLatestFormalVersion(),
                },
            });
        }
    }
}
