
namespace TinyWars.MultiRankWar {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import MpwModel     = MultiPlayerWar.MpwModel;

    export type OpenDataForMrwWarMapInfoPage = {
        warId   : number;
    }
    export class MrwWarMapInfoPage extends GameUi.UiTabPage {
        private readonly _zoomMap       : GameUi.UiZoomableMap;
        private readonly _uiMapInfo     : GameUi.UiMapInfo;
        private readonly _labelLoading  : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankWar/MrwWarMapInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMpwCommonGetMyWarInfoList,   callback: this._onNotifyMsgMpwCommonGetMyWarInfoList },
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

        private _onNotifyMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
            const data  = e.data as ProtoTypes.NetMessage.MsgMpwCommonGetMyWarInfoList.IS;
            const warId = this._getOpenData<OpenDataForMrwWarMapInfoPage>().warId;
            if ((warId != null) && ((data.infos || []).find(v => v.warId === warId))) {
                this._updateComponentsForWarInfo();
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text = Lang.getText(Lang.Type.A0150);
        }
        private async _updateComponentsForWarInfo(): Promise<void> {
            const warInfo       = MpwModel.getMyWarInfo(this._getOpenData<OpenDataForMrwWarMapInfoPage>().warId);
            const mapRawData    = warInfo ? await WarMap.WarMapModel.getRawData(warInfo.settingsForMrw.mapId) : null;
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
                        configVersion   : warInfo.settingsForCommon.configVersion,
                    },
                });
            }
        }
    }
}
