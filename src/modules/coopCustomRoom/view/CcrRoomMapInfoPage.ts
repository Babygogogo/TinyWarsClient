
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
import { CcrModel }                     from "../../coopCustomRoom/model/CcrModel";
import { WarMapModel }                  from "../../warMap/model/WarMapModel";

export type OpenDataForCcrRoomMapInfoPage = {
    roomId  : number;
};
export class CcrRoomMapInfoPage extends UiTabPage<OpenDataForCcrRoomMapInfoPage> {
    private readonly _zoomMap       : UiZoomableMap;
    private readonly _uiMapInfo     : UiMapInfo;
    private readonly _labelLoading  : UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/coopCustomRoom/CcrRoomMapInfoPage.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgCcrGetRoomInfo,  callback: this._onNotifyMsgCcrGetRoomInfo },
        ]);

        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        this._updateComponentsForLanguage();
        this._updateComponentsForRoomInfo();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgCcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgCcrGetRoomInfo.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateComponentsForRoomInfo();
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text = Lang.getText(LangTextType.A0150);
    }
    private async _updateComponentsForRoomInfo(): Promise<void> {
        const roomId        = this._getOpenData().roomId;
        const roomInfo      = await CcrModel.getRoomInfo(roomId);
        const mapRawData    = roomInfo ? await WarMapModel.getRawData(roomInfo.settingsForCcw.mapId) : null;
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
                    configVersion   : roomInfo.settingsForCommon.configVersion,
                },
            });
        }
    }
}
