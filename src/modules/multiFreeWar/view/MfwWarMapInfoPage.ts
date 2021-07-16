
import MpwModel             from "../../multiPlayerWar/model/MpwModel";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiMapInfo        from "../../tools/ui/UiMapInfo";
import TwnsUiTabPage        from "../../tools/ui/UiTabPage";
import TwnsUiZoomableMap    from "../../tools/ui/UiZoomableMap";

namespace TwnsMfwWarMapInfoPage {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export type OpenDataForMfwWarMapInfoPage = {
        warId   : number;
    };
    export class MfwWarMapInfoPage extends TwnsUiTabPage.UiTabPage<OpenDataForMfwWarMapInfoPage> {
        private readonly _zoomMap       : TwnsUiZoomableMap.UiZoomableMap;
        private readonly _uiMapInfo     : TwnsUiMapInfo.UiMapInfo;
        private readonly _labelLoading  : TwnsUiLabel.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeWar/MfwWarMapInfoPage.exml";
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

        private _onNotifyLanguageChanged(e: egret.Event): void {
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
            const warInfo       = MpwModel.getMyWarInfo(this._getOpenData().warId);
            const warData       = warInfo ? warInfo.settingsForMfw.initialWarData : null;
            const zoomMap       = this._zoomMap;
            const uiMapInfo     = this._uiMapInfo;
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

export default TwnsMfwWarMapInfoPage;
