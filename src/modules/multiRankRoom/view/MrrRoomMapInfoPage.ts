
namespace TinyWars.MultiRankRoom {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;

    export type OpenDataForMrrRoomMapInfoPage = {
        roomId  : number;
    }
    export class MrrRoomMapInfoPage extends GameUi.UiTabPage<OpenDataForMrrRoomMapInfoPage> {
        private readonly _zoomMap       : GameUi.UiZoomableMap;
        private readonly _uiMapInfo     : GameUi.UiMapInfo;
        private readonly _labelLoading  : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrRoomMapInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMrrGetRoomPublicInfo,    callback: this._onNotifyMsgMrrGetRoomPublicInfo },
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
        private _onNotifyMsgMrrGetRoomPublicInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMrrGetRoomPublicInfo.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateComponentsForRoomInfo();
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text = Lang.getText(Lang.Type.A0150);
        }
        private async _updateComponentsForRoomInfo(): Promise<void> {
            const roomId        = this._getOpenData().roomId;
            const roomInfo      = await MrrModel.getRoomInfo(roomId);
            const mapRawData    = roomInfo ? await WarMap.WarMapModel.getRawData(roomInfo.settingsForMrw.mapId) : null;
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
