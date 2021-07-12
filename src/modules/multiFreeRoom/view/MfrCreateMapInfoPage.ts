
import { UiLabel }              from "../../../utility/ui/UiLabel";
import { UiZoomableMap }        from "../../../utility/ui/UiZoomableMap";
import { UiTabPage }            from "../../../utility/ui/UiTabPage";
import { UiMapInfo }            from "../../../utility/ui/UiMapInfo";
import { Lang }                 from "../../../utility/lang/Lang";
import { TwnsLangTextType }     from "../../../utility/lang/LangTextType";
import { TwnsNotifyType }       from "../../../utility/notify/NotifyType";
import { MfrCreateModel }       from "../model/MfrCreateModel";
import LangTextType             = TwnsLangTextType.LangTextType;
import NotifyType               = TwnsNotifyType.NotifyType;

export class MfrCreateMapInfoPage extends UiTabPage<void> {
    private readonly _zoomMap       : UiZoomableMap;
    private readonly _uiMapInfo     : UiMapInfo;
    private readonly _labelLoading  : UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiFreeRoom/MfrCreateMapInfoPage.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        const warData = MfrCreateModel.getInitialWarData();
        this._zoomMap.showMapByWarData(warData);
        this._uiMapInfo.setData({
            warData,
        });

        this._updateComponentsForLanguage();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text = Lang.getText(LangTextType.A0150);
    }
}
