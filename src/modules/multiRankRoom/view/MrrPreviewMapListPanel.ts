
import { UiListItemRenderer }                                                           from "../../../gameui/UiListItemRenderer";
import { UiPanel }                                                                      from "../../../gameui/UiPanel";
import { UiButton }                                                                     from "../../../gameui/UiButton";
import { UiLabel }                                                                      from "../../../gameui/UiLabel";
import { UiScrollList }                                                                 from "../../../gameui/UiScrollList";
import { UiTab }                                                                        from "../../../gameui/UiTab";
import { UiTabItemRenderer }                                                            from "../../../gameui/UiTabItemRenderer";
import { LobbyBottomPanel }                                                             from "../../lobby/view/LobbyBottomPanel";
import { LobbyTopPanel }                                                                from "../../lobby/view/LobbyTopPanel";
import { MrrMainMenuPanel }                                                             from "./MrrMainMenuPanel";
import { OpenDataForMrrPreviewAdvancedSettingsPage, MrrPreviewAdvancedSettingsPage }    from "./MrrPreviewAdvancedSettingsPage";
import { OpenDataForMrrPreviewBasicSettingsPage, MrrPreviewBasicSettingsPage }          from "./MrrPreviewBasicSettingsPage";
import { OpenDataForMrrPreviewMapInfoPage, MrrPreviewMapInfoPage }                      from "./MrrPreviewMapInfoPage";
import * as Helpers                                                                     from "../../../utility/Helpers";
import * as Lang                                                                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                                                                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                                                                  from "../../../utility/ProtoTypes";
import * as Types                                                                       from "../../../utility/Types";
import * as WarMapModel                                                                 from "../../warMap/model/WarMapModel";
import * as MrrModel                                                                    from "../model/MrrModel";

type OpenDataForMrrPreviewMapListPanel = {
    hasFog: boolean;
};
export class MrrPreviewMapListPanel extends UiPanel<OpenDataForMrrPreviewMapListPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MrrPreviewMapListPanel;

    private readonly _groupTab              : eui.Group;
    private readonly _tabSettings           : UiTab<DataForTabItemRenderer, OpenDataForMrrPreviewMapInfoPage | OpenDataForMrrPreviewBasicSettingsPage | OpenDataForMrrPreviewAdvancedSettingsPage>;

    private readonly _groupNavigator        : eui.Group;
    private readonly _labelRankMatch        : UiLabel;
    private readonly _labelPreviewMap       : UiLabel;
    private readonly _labelMapType          : UiLabel;

    private readonly _btnBack               : UiButton;
    private readonly _btnSwitch             : UiButton;

    private readonly _groupMapList          : eui.Group;
    private readonly _listMap               : UiScrollList<DataForMapNameRenderer>;
    private readonly _labelNoMap            : UiLabel;
    private readonly _labelLoading          : UiLabel;

    public static show(openData: OpenDataForMrrPreviewMapListPanel): void {
        if (!MrrPreviewMapListPanel._instance) {
            MrrPreviewMapListPanel._instance = new MrrPreviewMapListPanel();
        }
        MrrPreviewMapListPanel._instance.open(openData);
    }
    public static async hide(): Promise<void> {
        if (MrrPreviewMapListPanel._instance) {
            await MrrPreviewMapListPanel._instance.close();
        }
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/multiRankRoom/MrrPreviewMapListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MrrPreviewingMapIdChanged,  callback: this._onNotifyMrrPreviewingMapIdChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            { ui: this._btnSwitch,      callback: this._onTouchedBtnSwitch },
        ]);
        this._tabSettings.setBarItemRenderer(TabItemRenderer);
        this._listMap.setItemRenderer(MapNameRenderer);

        this._showOpenAnimation();

        this._initTabSettings();
        this._updateComponentsForLanguage();
        this._updateGroupMapList();
        this._updateComponentsForTargetMapInfo();
    }

    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMrrPreviewingMapIdChanged(): void {
        this._updateComponentsForTargetMapInfo();
    }

    private _onTouchedBtnBack(e: egret.TouchEvent): void {
        this.close();
        MrrMainMenuPanel.show();
        LobbyTopPanel.show();
        LobbyBottomPanel.show();
    }

    private async _onTouchedBtnSwitch(e: egret.TouchEvent): Promise<void> {
        const hasFog = this._getOpenData().hasFog;
        this.close();
        MrrPreviewMapListPanel.show({ hasFog: !hasFog });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _initTabSettings(): void {
        const hasFog = this._getOpenData().hasFog;
        this._tabSettings.bindData([
            {
                tabItemData : { name: Lang.getText(LangTextType.B0298) },
                pageClass   : MrrPreviewMapInfoPage,
                pageData    : { mapId: null } as OpenDataForMrrPreviewMapInfoPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0002) },
                pageClass   : MrrPreviewBasicSettingsPage,
                pageData    : { hasFog, mapId: null } as OpenDataForMrrPreviewBasicSettingsPage,
            },
            {
                tabItemData : { name: Lang.getText(LangTextType.B0003) },
                pageClass   : MrrPreviewAdvancedSettingsPage,
                pageData    : { hasFog, mapId: null } as OpenDataForMrrPreviewAdvancedSettingsPage,
            },
        ]);
    }

    private _updateComponentsForLanguage(): void {
        this._labelLoading.text     = Lang.getText(LangTextType.A0040);
        this._labelRankMatch.text   = Lang.getText(LangTextType.B0404);
        this._labelPreviewMap.text  = Lang.getText(LangTextType.B0594);
        this._labelMapType.text     = Lang.getText(this._getOpenData().hasFog ? LangTextType.B0596 : LangTextType.B0595);
        this._btnBack.label         = Lang.getText(LangTextType.B0146);
        this._labelNoMap.text       = Lang.getText(LangTextType.B0582);
        this._btnSwitch.label       = Lang.getText(LangTextType.B0597);
    }

    private async _updateGroupMapList(): Promise<void> {
        const labelLoading      = this._labelLoading;
        const labelNoMap        = this._labelNoMap;
        const listMap           = this._listMap;
        labelNoMap.visible      = false;

        const dataArray         = await this._createDataForListMap();
        labelLoading.visible    = false;
        labelNoMap.visible      = !dataArray.length;
        listMap.bindData(dataArray);

        const mapId = MrrModel.PreviewMap.getPreviewingMapId();
        if (dataArray.every(v => v.mapId != mapId)) {
            MrrModel.PreviewMap.setPreviewingMapId(dataArray.length ? dataArray[0].mapId : null);
        }
    }

    private async _updateComponentsForTargetMapInfo(): Promise<void> {
        const groupTab      = this._groupTab;
        const mapId         = MrrModel.PreviewMap.getPreviewingMapId();
        if (mapId == null) {
            groupTab.visible    = false;
        } else {
            groupTab.visible    = true;

            const tab       = this._tabSettings;
            const hasFog    = this._getOpenData().hasFog;
            tab.updatePageData(0, { mapId } as OpenDataForMrrPreviewMapInfoPage);
            tab.updatePageData(1, { hasFog, mapId } as OpenDataForMrrPreviewBasicSettingsPage);
            tab.updatePageData(2, { hasFog, mapId } as OpenDataForMrrPreviewAdvancedSettingsPage);
        }
    }

    private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
        const hasFog        = this._getOpenData().hasFog;
        const promiseArray  : Promise<ProtoTypes.Map.IMapRawData>[] = [];
        for (const [mapId, mapBriefData] of WarMapModel.getBriefDataDict()) {
            const mapExtraData = mapBriefData.mapExtraData;
            if (!mapExtraData.isEnabled) {
                continue;
            }

            const mapAvailability = mapExtraData.mapComplexInfo.mapAvailability;
            if (((hasFog) && (mapAvailability.canMrwFog))   ||
                ((!hasFog) && (mapAvailability.canMrwStd))
            ) {
                promiseArray.push(WarMapModel.getRawData(mapId));
            }
        }

        const dataArray : DataForMapNameRenderer[] = [];
        for (const mapRawData of await Promise.all(promiseArray)) {
            if ((mapRawData) &&
                (mapRawData.warRuleArray.some(v => {
                    return (v.ruleAvailability.canMrw)
                        && (hasFog === v.ruleForGlobalParams.hasFogByDefault);
                }))
            ) {
                const mapId = mapRawData.mapId;
                dataArray.push({
                    mapId,
                    mapName : Lang.getLanguageText({ textArray: mapRawData.mapNameArray }),
                });
            }
        }

        return dataArray.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
    }

    private _showOpenAnimation(): void {
        Helpers.resetTween({
            obj         : this._btnBack,
            beginProps  : { alpha: 0, y: -20 },
            endProps    : { alpha: 1, y: 20 },
        });
        Helpers.resetTween({
            obj         : this._groupNavigator,
            beginProps  : { alpha: 0, y: -20 },
            endProps    : { alpha: 1, y: 20 },
        });
        Helpers.resetTween({
            obj         : this._groupMapList,
            beginProps  : { alpha: 0, left: -20 },
            endProps    : { alpha: 1, left: 20 },
        });
        Helpers.resetTween({
            obj         : this._btnSwitch,
            beginProps  : { alpha: 0, left: -20 },
            endProps    : { alpha: 1, left: 20 },
        });
        Helpers.resetTween({
            obj         : this._groupTab,
            beginProps  : { alpha: 0, },
            endProps    : { alpha: 1, },
        });
    }
    private async _showCloseAnimation(): Promise<void> {
        return new Promise<void>(resolve => {
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
                callback    : resolve,
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 1, y: 20 },
                endProps    : { alpha: 0, y: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupMapList,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Helpers.resetTween({
                obj         : this._btnSwitch,
                beginProps  : { alpha: 1, left: 20 },
                endProps    : { alpha: 0, left: -20 },
            });
            Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 1, },
                endProps    : { alpha: 0, },
            });
        });
    }
}

type DataForTabItemRenderer = {
    name: string;
};
class TabItemRenderer extends UiTabItemRenderer<DataForTabItemRenderer> {
    private _labelName: UiLabel;

    protected _onDataChanged(): void {
        this._labelName.text = this.data.name;
    }
}

type DataForMapNameRenderer = {
    mapId   : number;
    mapName : string;
};
class MapNameRenderer extends UiListItemRenderer<DataForMapNameRenderer> {
    private readonly _btnChoose     : UiButton;
    private readonly _labelName     : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.MrrPreviewingMapIdChanged, callback: this._onNotifyMrrPreviewingMapIdChanged },
        ]);
    }

    protected async _onDataChanged(): Promise<void> {
        this._updateState();

        this._labelName.text = (await WarMapModel.getMapNameInCurrentLanguage(this.data.mapId)) || `??`;
    }

    private _onNotifyMrrPreviewingMapIdChanged(e: egret.Event): void {
        this._updateState();
    }

    private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
        MrrModel.PreviewMap.setPreviewingMapId(this.data.mapId);
    }

    private _updateState(): void {
        this.currentState = this.data.mapId === MrrModel.PreviewMap.getPreviewingMapId() ? Types.UiState.Down : Types.UiState.Up;
    }
}
