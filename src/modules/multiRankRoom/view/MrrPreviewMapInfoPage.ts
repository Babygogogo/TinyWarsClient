
namespace TinyWars.MultiRankRoom {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;

    export type OpenDataForMrrPreviewMapInfoPage = {
        mapId: number;
    }
    export class MrrPreviewMapInfoPage extends GameUi.UiTabPage<OpenDataForMrrPreviewMapInfoPage> {
        private readonly _zoomMap       : GameUi.UiZoomableMap;
        private readonly _uiMapInfo     : GameUi.UiMapInfo;
        private readonly _labelLoading  : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrPreviewMapInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMapGetRawData,   callback: this._onNotifyMsgMapGetRawData },
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
            this._labelLoading.text = Lang.getText(Lang.Type.A0150);
        }
        private async _updateComponentsForMapInfo(): Promise<void> {
            const mapRawData    = await WarMap.WarMapModel.getRawData(this._getOpenData().mapId);
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
