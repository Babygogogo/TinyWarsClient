
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiZoomableMap        from "../../tools/ui/UiZoomableMap";
import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
import TwnsUiMapInfo            from "../../tools/ui/UiMapInfo";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import MfrCreateModel       from "../model/MfrCreateModel";
import LangTextType             = TwnsLangTextType.LangTextType;
import NotifyType               = TwnsNotifyType.NotifyType;

export class MfrCreateMapInfoPage extends TwnsUiTabPage.UiTabPage<void> {
    private readonly _zoomMap       : TwnsUiZoomableMap.UiZoomableMap;
    private readonly _uiMapInfo     : TwnsUiMapInfo.UiMapInfo;
    private readonly _labelLoading  : TwnsUiLabel.UiLabel;

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
