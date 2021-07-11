
import { UiLabel }              from "../../../gameui/UiLabel";
import { UiZoomableMap }        from "../../../gameui/UiZoomableMap";
import { UiTabPage }            from "../../../gameui/UiTabPage";
import { UiMapInfo }            from "../../../gameui/UiMapInfo";
import * as Lang                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify              from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import * as MfrModel            from "../../multiFreeRoom/model/MfrModel";

export type OpenDataForMfrRoomMapInfoPage = {
    roomId  : number;
};
export class MfrRoomMapInfoPage extends UiTabPage<OpenDataForMfrRoomMapInfoPage> {
    private readonly _zoomMap       : UiZoomableMap;
    private readonly _uiMapInfo     : UiMapInfo;
    private readonly _labelLoading  : UiLabel;

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
