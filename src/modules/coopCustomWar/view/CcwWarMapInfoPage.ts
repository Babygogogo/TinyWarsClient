
import MpwModel             from "../../multiPlayerWar/model/MpwModel";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiMapInfo        from "../../tools/ui/UiMapInfo";
import TwnsUiTabPage        from "../../tools/ui/UiTabPage";
import TwnsUiZoomableMap    from "../../tools/ui/UiZoomableMap";
import WarMapModel          from "../../warMap/model/WarMapModel";

namespace TwnsCcwWarMapInfoPage {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export type OpenDataForCcwWarMapInfoPage = {
        warId   : number | null | undefined;
    };
    export class CcwWarMapInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForCcwWarMapInfoPage> {
        // @ts-ignore
        private readonly _zoomMap       : TwnsUiZoomableMap.UiZoomableMap;
        // @ts-ignore
        private readonly _uiMapInfo     : TwnsUiMapInfo.UiMapInfo;
        // @ts-ignore
        private readonly _labelLoading  : TwnsUiLabel.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/coopCustomWar/CcwWarMapInfoPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMpwCommonGetMyWarInfoList,   callback: this._onNotifyMsgMpwCommonGetMyWarInfoList },
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
            this._labelLoading.text = Lang.getText(LangTextType.A0150);
        }
        private async _updateComponentsForWarInfo(): Promise<void> {
            const warId             = this._getOpenData().warId;
            const warInfo           = warId != null ? MpwModel.getMyWarInfo(warId) : undefined;
            const settingsForCcw    = warInfo ? warInfo.settingsForCcw : undefined;
            const settingsForCommon = warInfo ? warInfo.settingsForCommon : undefined;
            const configVersion     = settingsForCommon ? settingsForCommon.configVersion : undefined;
            const mapId             = settingsForCcw ? settingsForCcw.mapId : undefined;
            const mapRawData        = mapId != null ? await WarMapModel.getRawData(mapId) : undefined;
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

export default TwnsCcwWarMapInfoPage;
