
import { TwnsUiLabel }              from "../../../utility/ui/UiLabel";
import { TwnsUiZoomableMap }        from "../../../utility/ui/UiZoomableMap";
import { TwnsUiTabPage }            from "../../../utility/ui/UiTabPage";
import { TwnsUiMapInfo }            from "../../../utility/ui/UiMapInfo";
import { Lang }                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { MfrModel }             from "../../multiFreeRoom/model/MfrModel";

export type OpenDataForMfrRoomMapInfoPage = {
    roomId  : number;
};
export class MfrRoomMapInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForMfrRoomMapInfoPage> {
    private readonly _zoomMap       : TwnsUiZoomableMap.UiZoomableMap;
    private readonly _uiMapInfo     : TwnsUiMapInfo.UiMapInfo;
    private readonly _labelLoading  : TwnsUiLabel.UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiFreeRoom/MfrRoomMapInfoPage.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMfrGetRoomInfo,  callback: this._onNotifyMsgMfrGetRoomInfo },
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
    private _onNotifyMsgMfrGetRoomInfo(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgMfrGetRoomInfo.IS;
        if (data.roomId === this._getOpenData().roomId) {
            this._updateComponentsForRoomInfo();
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text = Lang.getText(LangTextType.A0150);
    }
    private async _updateComponentsForRoomInfo(): Promise<void> {
        const roomId    = this._getOpenData().roomId;
        const roomInfo  = await MfrModel.getRoomInfo(roomId);
        const warData   = roomInfo ? roomInfo.settingsForMfw.initialWarData : null;
        const zoomMap   = this._zoomMap;
        const uiMapInfo = this._uiMapInfo;
        if (!warData) {
            zoomMap.clearMap();
            uiMapInfo.setData(null);
        } else {
            zoomMap.showMapByWarData(warData);
            uiMapInfo.setData({
                warData,
            });
        }
    }
}
