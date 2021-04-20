
namespace TinyWars.MultiFreeRoom {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;

    export type OpenDataForMfrRoomMapInfoPage = {
        roomId  : number;
    }
    export class MfrRoomMapInfoPage extends GameUi.UiTabPage {
        private readonly _zoomMap       : GameUi.UiZoomableMap;
        private readonly _uiMapInfo     : GameUi.UiMapInfo;
        private readonly _labelLoading  : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrRoomMapInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMfrGetRoomInfo,  callback: this._onNotifyMsgMfrGetRoomInfo },
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
            if (data.roomId === this._getOpenData<OpenDataForMfrRoomMapInfoPage>().roomId) {
                this._updateComponentsForRoomInfo();
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text = Lang.getText(Lang.Type.A0150);
        }
        private async _updateComponentsForRoomInfo(): Promise<void> {
            const roomId    = this._getOpenData<OpenDataForMfrRoomMapInfoPage>().roomId;
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
}
