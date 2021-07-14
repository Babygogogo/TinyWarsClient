
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiZoomableMap                from "../../tools/ui/UiZoomableMap";
import TwnsUiTabPage                    from "../../tools/ui/UiTabPage";
import TwnsUiMapInfo                    from "../../tools/ui/UiMapInfo";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
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
