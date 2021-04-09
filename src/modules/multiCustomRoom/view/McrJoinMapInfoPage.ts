
namespace TinyWars.MultiCustomRoom {
    import Notify   = Utility.Notify;
    import Lang     = Utility.Lang;

    export class McrJoinMapInfoPage extends GameUi.UiTabPage {
        private readonly _zoomMap       : GameUi.UiZoomableMap;
        private readonly _uiMapInfo     : GameUi.UiMapInfo;
        private readonly _labelLoading  : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinMapInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.McrJoinTargetRoomIdChanged, callback: this._onNotifyMcrJoinTargetRoomIdChanged },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._updateComponentsForLanguage();
            this._updateComponentsForTargetRoomInfo();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMcrJoinTargetRoomIdChanged(e: egret.Event): void {
            this._updateComponentsForTargetRoomInfo();
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text = Lang.getText(Lang.Type.A0150);
        }
        private async _updateComponentsForTargetRoomInfo(): Promise<void> {
            const roomInfo      = await McrModel.Join.getTargetRoomInfo();
            const mapRawData    = roomInfo ? await WarMap.WarMapModel.getRawData(roomInfo.settingsForMcw.mapId) : null;
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
                })
            }
        }
    }
}
