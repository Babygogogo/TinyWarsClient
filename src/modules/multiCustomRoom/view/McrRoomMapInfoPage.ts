
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiZoomableMap                from "../../tools/ui/UiZoomableMap";
import TwnsUiTabPage                    from "../../tools/ui/UiTabPage";
import TwnsUiMapInfo                from "../../tools/ui/UiMapInfo";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import { McrModel }                     from "../../multiCustomRoom/model/McrModel";
import WarMapModel                  from "../../warMap/model/WarMapModel";

export type OpenDataForMcrRoomMapInfoPage = {
    roomId  : number;
};
export class McrRoomMapInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForMcrRoomMapInfoPage> {
    private readonly _zoomMap       : TwnsUiZoomableMap.UiZoomableMap;
    private readonly _uiMapInfo     : TwnsUiMapInfo.UiMapInfo;
    private readonly _labelLoading  : TwnsUiLabel.UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiCustomRoom/McrRoomMapInfoPage.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMcrGetRoomInfo,  callback: this._onNotifyMsgMcrGetRoomInfo },
        ]);

        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        this._updateComponentsForLanguage();
        this._updateComponentsForRoomInfo();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMcrGetRoomInfo.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateComponentsForRoomInfo();
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text = Lang.getText(LangTextType.A0150);
    }
    private async _updateComponentsForRoomInfo(): Promise<void> {
        const roomId        = this._getOpenData().roomId;
        const roomInfo      = await McrModel.getRoomInfo(roomId);
        const mapRawData    = roomInfo ? await WarMapModel.getRawData(roomInfo.settingsForMcw.mapId) : null;
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
