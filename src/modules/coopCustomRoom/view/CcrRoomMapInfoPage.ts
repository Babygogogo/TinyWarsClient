
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.CoopCustomRoom {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;

    export type OpenDataForCcrRoomMapInfoPage = {
        roomId  : number;
    };
    export class CcrRoomMapInfoPage extends GameUi.UiTabPage<OpenDataForCcrRoomMapInfoPage> {
        private readonly _zoomMap       : GameUi.UiZoomableMap;
        private readonly _uiMapInfo     : GameUi.UiMapInfo;
        private readonly _labelLoading  : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/CoopCustomRoom/CcrRoomMapInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgCcrGetRoomInfo,  callback: this._onNotifyMsgCcrGetRoomInfo },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._updateComponentsForLanguage();
            this._updateComponentsForRoomInfo();
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMsgCcrGetRoomInfo(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCcrGetRoomInfo.IS;
            if (data.roomId === this._getOpenData().roomId) {
                this._updateComponentsForRoomInfo();
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text = Lang.getText(Lang.Type.A0150);
        }
        private async _updateComponentsForRoomInfo(): Promise<void> {
            const roomId        = this._getOpenData().roomId;
            const roomInfo      = await CcrModel.getRoomInfo(roomId);
            const mapRawData    = roomInfo ? await WarMap.WarMapModel.getRawData(roomInfo.settingsForCcw.mapId) : null;
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
}
