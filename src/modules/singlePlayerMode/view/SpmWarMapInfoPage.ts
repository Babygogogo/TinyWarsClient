
namespace TinyWars.SinglePlayerMode {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import BwHelpers    = BaseWar.BwHelpers;

    export type OpenDataForSpmWarMapInfoPage = {
        slotIndex   : number;
    }
    export class SpmWarMapInfoPage extends GameUi.UiTabPage<OpenDataForSpmWarMapInfoPage> {
        private readonly _zoomMap       : GameUi.UiZoomableMap;
        private readonly _uiMapInfo     : GameUi.UiMapInfo;
        private readonly _labelLoading  : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/singlePlayerMode/SpmWarMapInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgSpmGetWarSaveSlotFullDataArray,  callback: this._onNotifyMsgSpmGetWarSaveSlotFullDataArray },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._updateComponentsForLanguage();
            this._updateComponentsForWarInfo();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgSpmGetWarSaveSlotFullDataArray(e: egret.Event): void {
            this._updateComponentsForWarInfo();
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text = Lang.getText(Lang.Type.A0150);
        }
        private async _updateComponentsForWarInfo(): Promise<void> {
            const slotData      = SpmModel.SaveSlot.getSlotDict().get(this._getOpenData().slotIndex);
            const warData       = slotData ? slotData.warData : null;
            const zoomMap       = this._zoomMap;
            const uiMapInfo     = this._uiMapInfo;
            if (warData == null) {
                zoomMap.clearMap();
                uiMapInfo.setData(null);
                return;
            }

            const mapId = BwHelpers.getMapId(warData);
            if (mapId != null) {
                const mapRawData = await WarMap.WarMapModel.getRawData(mapId);
                if (mapRawData == null) {
                    zoomMap.clearMap();
                    uiMapInfo.setData(null);
                } else {
                    zoomMap.showMapByMapData(mapRawData);
                    uiMapInfo.setData({
                        mapInfo: {
                            mapId           : mapRawData.mapId,
                            configVersion   : warData.settingsForCommon.configVersion,
                        },
                    });
                }
                return;
            }

            const settingsForSfw = warData.settingsForSfw;
            const initialWarData = settingsForSfw ? settingsForSfw.initialWarData : null;
            if (initialWarData == null) {
                zoomMap.clearMap();
                uiMapInfo.setData(null);
            } else {
                zoomMap.showMapByWarData(initialWarData);
                uiMapInfo.setData({
                    warData: initialWarData,
                });
            }
        }
    }
}
