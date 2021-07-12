
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiZoomableMap }                from "../../../utility/ui/UiZoomableMap";
import { UiTabPage }                    from "../../../utility/ui/UiTabPage";
import { UiMapInfo }                    from "../../../utility/ui/UiMapInfo";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { MpwModel }                     from "../../multiPlayerWar/model/MpwModel";
import { WarMapModel }                  from "../../warMap/model/WarMapModel";

export type OpenDataForCcwWarMapInfoPage = {
    warId   : number | null | undefined;
};
export class CcwWarMapInfoPage extends UiTabPage<OpenDataForCcwWarMapInfoPage> {
    // @ts-ignore
    private readonly _zoomMap       : UiZoomableMap;
    // @ts-ignore
    private readonly _uiMapInfo     : UiMapInfo;
    // @ts-ignore
    private readonly _labelLoading  : UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/coopCustomWar/CcwWarMapInfoPage.exml";
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
        this._labelLoading.text = Lang.getText(LangTextType.A0150);
    }
    private async _updateComponentsForWarInfo(): Promise<void> {
        const warId             = this._getOpenData().warId;
        const warInfo           = warId != null ? MpwModel.getMyWarInfo(warId) : undefined;
        const settingsForCcw    = warInfo ? warInfo.settingsForCcw : undefined;
        const settingsForCommon = warInfo ? warInfo.settingsForCommon : undefined;
        const configVersion     = settingsForCommon ? settingsForCommon.configVersion : undefined;
        const mapId             = settingsForCcw ? settingsForCcw.mapId : undefined;
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
