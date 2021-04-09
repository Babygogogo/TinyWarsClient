
namespace TinyWars.MultiCustomRoom {
    import ConfigManager    = Utility.ConfigManager;
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;

    export class McrCreateMapInfoPage extends GameUi.UiTabPage {
        private readonly _zoomMap       : GameUi.UiZoomableMap;
        private readonly _uiMapInfo     : GameUi.UiMapInfo;
        private readonly _labelLoading  : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateMapInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            const mapRawData = await McrModel.Create.getMapRawData();
            this._zoomMap.showMapByMapData(mapRawData);
            this._uiMapInfo.setData({
                mapInfo: {
                    mapId           : mapRawData.mapId,
                    configVersion   : ConfigManager.getLatestFormalVersion(),
                },
            });

            this._updateComponentsForLanguage();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text = Lang.getText(Lang.Type.A0150);
        }
    }
}
