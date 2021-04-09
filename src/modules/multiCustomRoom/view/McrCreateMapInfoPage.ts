
namespace TinyWars.MultiCustomRoom {
    import ConfigManager = Utility.ConfigManager;

    export class McrCreateMapInfoPage extends GameUi.UiTabPage {
        private readonly _zoomMap               : GameUi.UiZoomableMap;
        private readonly _uiMapInfo             : GameUi.UiMapInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateMapInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
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
        }
    }
}
