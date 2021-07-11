
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiZoomableMap }                from "../../../gameui/UiZoomableMap";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { UiMapInfo }                    from "../../../gameui/UiMapInfo";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";
import * as RwModel                     from "../model/RwModel";

export type OpenDataForRwReplayMapInfoPage = {
    replayId: number;
};
export class RwReplayMapInfoPage extends UiTabPage<OpenDataForRwReplayMapInfoPage> {
    private readonly _zoomMap       : UiZoomableMap;
    private readonly _uiMapInfo     : UiMapInfo;
    private readonly _labelLoading  : UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/replayWar/RwReplayMapInfoPage.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.MsgReplayGetInfoList,   callback: this._onNotifyMsgReplayGetInfoList },
        ]);

        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        this._updateComponentsForLanguage();
        this._updateComponentsForReplayInfo();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgReplayGetInfoList(e: egret.Event): void {
        const data      = e.data as ProtoTypes.NetMessage.MsgReplayGetInfoList.IS;
        const replayId  = this._getOpenData().replayId;
        if ((replayId != null) && ((data.infos || []).find(v => v.replayBriefInfo.replayId === replayId))) {
            this._updateComponentsForReplayInfo();
        }
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text = Lang.getText(Lang.Type.A0150);
    }
    private async _updateComponentsForReplayInfo(): Promise<void> {
        const replayInfo        = RwModel.getReplayInfo(this._getOpenData().replayId);
        const replayBriefInfo   = replayInfo ? replayInfo.replayBriefInfo : null;
        const mapRawData        = replayBriefInfo ? await WarMapModel.getRawData(replayBriefInfo.mapId) : null;
        const zoomMap           = this._zoomMap;
        const uiMapInfo         = this._uiMapInfo;
        if (!mapRawData) {
            zoomMap.clearMap();
            uiMapInfo.setData(null);
        } else {
            zoomMap.showMapByMapData(mapRawData);
            uiMapInfo.setData({
                mapInfo: {
                    mapId           : mapRawData.mapId,
                    configVersion   : replayBriefInfo.configVersion,
                },
            });
        }
    }
}
