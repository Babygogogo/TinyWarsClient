
import TwnsUiLabel                      from "../../../utility/ui/UiLabel";
import TwnsUiZoomableMap                from "../../../utility/ui/UiZoomableMap";
import TwnsUiTabPage                    from "../../../utility/ui/UiTabPage";
import TwnsUiMapInfo                    from "../../../utility/ui/UiMapInfo";
import { ConfigManager }                from "../../../utility/ConfigManager";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType }             from "../../../utility/lang/LangTextType";
import { TwnsNotifyType }               from "../../../utility/notify/NotifyType";
import { CcrCreateModel }               from "../model/CcrCreateModel";
import LangTextType                     = TwnsLangTextType.LangTextType;
import NotifyType                       = TwnsNotifyType.NotifyType;

export class CcrCreateMapInfoPage extends TwnsUiTabPage.UiTabPage<void> {
    private readonly _zoomMap       : TwnsUiZoomableMap.UiZoomableMap;
    private readonly _uiMapInfo     : TwnsUiMapInfo.UiMapInfo;
    private readonly _labelLoading  : TwnsUiLabel.UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/coopCustomRoom/CcrCreateMapInfoPage.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        const mapRawData = await CcrCreateModel.getMapRawData();
        this._zoomMap.showMapByMapData(mapRawData);
        this._uiMapInfo.setData({
            mapInfo: {
                mapId           : mapRawData.mapId,
                configVersion   : ConfigManager.getLatestFormalVersion(),
            },
        });

        this._updateComponentsForLanguage();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text = Lang.getText(LangTextType.A0150);
    }
}
