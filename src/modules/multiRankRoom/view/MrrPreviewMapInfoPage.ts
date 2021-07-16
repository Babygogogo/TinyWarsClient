
import ConfigManager        from "../../tools/helpers/ConfigManager";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiMapInfo        from "../../tools/ui/UiMapInfo";
import TwnsUiTabPage        from "../../tools/ui/UiTabPage";
import TwnsUiZoomableMap    from "../../tools/ui/UiZoomableMap";
import WarMapModel          from "../../warMap/model/WarMapModel";

namespace TwnsMrrPreviewMapInfoPage {
    import LangTextType = TwnsLangTextType.LangTextType;
    import NotifyType   = TwnsNotifyType.NotifyType;

    export type OpenDataForMrrPreviewMapInfoPage = {
        mapId: number;
    };
    export class MrrPreviewMapInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForMrrPreviewMapInfoPage> {
        private readonly _zoomMap       : TwnsUiZoomableMap.UiZoomableMap;
        private readonly _uiMapInfo     : TwnsUiMapInfo.UiMapInfo;
        private readonly _labelLoading  : TwnsUiLabel.UiLabel;

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
}

export default TwnsMrrPreviewMapInfoPage;
