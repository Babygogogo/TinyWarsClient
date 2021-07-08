
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.CoopCustomWar {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import MpwModel     = MultiPlayerWar.MpwModel;

    export type OpenDataForCcwWarMapInfoPage = {
        warId   : number | null | undefined;
    }
    export class CcwWarMapInfoPage extends GameUi.UiTabPage<OpenDataForCcwWarMapInfoPage> {
        // @ts-ignore
        private readonly _zoomMap       : GameUi.UiZoomableMap;
        // @ts-ignore
        private readonly _uiMapInfo     : GameUi.UiMapInfo;
        // @ts-ignore
        private readonly _labelLoading  : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/coopCustomWar/CcwWarMapInfoPage.exml";
        }

        protected _onOpened(): void {
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

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
            const data  = e.data as ProtoTypes.NetMessage.MsgMpwCommonGetMyWarInfoList.IS;
            const warId = this._getOpenData().warId;
            if ((warId != null) && ((data.infos || []).find(v => v.warId === warId))) {
                this._updateComponentsForWarInfo();
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text = Lang.getText(Lang.Type.A0150);
        }
        private async _updateComponentsForWarInfo(): Promise<void> {
            const warId             = this._getOpenData().warId;
            const warInfo           = warId != null ? MpwModel.getMyWarInfo(warId) : undefined;
            const settingsForCcw    = warInfo ? warInfo.settingsForCcw : undefined;
            const settingsForCommon = warInfo ? warInfo.settingsForCommon : undefined;
            const configVersion     = settingsForCommon ? settingsForCommon.configVersion : undefined;
            const mapId             = settingsForCcw ? settingsForCcw.mapId : undefined;
            const mapRawData        = mapId != null ? await WarMap.WarMapModel.getRawData(mapId) : undefined;
            const zoomMap           = this._zoomMap;
            const uiMapInfo         = this._uiMapInfo;
            if ((mapId == null) || (mapRawData == null) || (configVersion == null)) {
                zoomMap.clearMap();
                uiMapInfo.setData(null);
            } else {
                zoomMap.showMapByMapData(mapRawData);
                uiMapInfo.setData({
                    mapInfo: {
                        mapId,
                        configVersion,
                    },
                });
            }
        }
    }
}
