
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiZoomableMap }                from "../../../gameui/UiZoomableMap";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { UiMapInfo }                    from "../../../gameui/UiMapInfo";
import * as ConfigManager               from "../../../utility/ConfigManager";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as McrModel                    from "../../multiCustomRoom/model/McrModel";

export class McrCreateMapInfoPage extends UiTabPage<void> {
    private readonly _zoomMap       : UiZoomableMap;
    private readonly _uiMapInfo     : UiMapInfo;
    private readonly _labelLoading  : UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiCustomRoom/McrCreateMapInfoPage.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this.left   = 0;
        this.right  = 0;
        this.top    = 0;
        this.bottom = 0;

        const mapRawData = await McrModel.Create.getMapRawData();
        this._zoomMap.showMapByMapData(mapRawData);
        this._uiMapInfo.setData({
            mapInfo: {
                mapId           : mapRawData.mapId,
                configVersion   : ConfigManager.getLatestFormalVersion(),
            },
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
