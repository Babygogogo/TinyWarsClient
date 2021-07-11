
import { UiListItemRenderer }           from "../../../gameui/UiListItemRenderer";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiScrollList }                 from "../../../gameui/UiScrollList";
import { UiZoomableMap }                from "../../../gameui/UiZoomableMap";
import { MmAvailabilitySearchPanel }    from "./MmAvailabilitySearchPanel";
import { MmMainMenuPanel }              from "./MmMainMenuPanel";
import { MmAvailabilityChangePanel }    from "./MmAvailabilityChangePanel";
import * as FloatText                   from "../../../utility/FloatText";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as Types                       from "../../../utility/Types";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";

export type FiltersForMapList = {
    mapName?        : string;
    mapDesigner?    : string;
    playersCount?   : number;
    playedTimes?    : number;
    minRating?      : number;
};
export class MmAvailabilityListPanel extends UiPanel<FiltersForMapList> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
    protected readonly _IS_EXCLUSIVE = true;

    private static _instance: MmAvailabilityListPanel;

    private _listMap        : UiScrollList<DataForMapNameRenderer>;
    private _zoomMap        : UiZoomableMap;
    private _labelMenuTitle : UiLabel;
    private _btnSearch      : UiButton;
    private _btnBack        : UiButton;
    private _labelNoMap     : UiLabel;

    private _groupInfo          : eui.Group;
    private _labelMapName       : UiLabel;
    private _labelDesigner      : UiLabel;
    private _labelRating        : UiLabel;
    private _labelPlayedTimes   : UiLabel;
    private _labelPlayersCount  : UiLabel;

    private _mapFilters         : FiltersForMapList = {};
    private _dataForList        : DataForMapNameRenderer[] = [];
    private _selectedMapId      : number;

    public static show(mapFilters?: FiltersForMapList): void {
        if (!MmAvailabilityListPanel._instance) {
            MmAvailabilityListPanel._instance = new MmAvailabilityListPanel();
        }

        MmAvailabilityListPanel._instance.open(mapFilters);
    }
    public static async hide(): Promise<void> {
        if (MmAvailabilityListPanel._instance) {
            await MmAvailabilityListPanel._instance.close();
        }
    }
    public static getInstance(): MmAvailabilityListPanel {
        return MmAvailabilityListPanel._instance;
    }

    public constructor() {
        super();

        this.skinName = "resource/skins/mapManagement/MmAvailabilityListPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMmSetMapAvailability,    callback: this._onNotifyMsgMmSetMapAvailability },
            { type: NotifyType.MsgMmSetMapEnabled,         callback: this._onNotifyMsgMmSetMapEnabled },
        ]);
        this._setUiListenerArray([
            { ui: this._btnSearch, callback: this._onTouchTapBtnSearch },
            { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
        ]);
        this._listMap.setItemRenderer(MapNameRenderer);

        this._groupInfo.visible = false;
        this._updateComponentsForLanguage();

        this.setMapFilters(this._getOpenData() || this._mapFilters);
    }
    protected async _onClosed(): Promise<void> {
        egret.Tween.removeTweens(this._groupInfo);
    }

    public async setSelectedMapFileName(newMapId: number): Promise<void> {
        const dataList = this._dataForList;
        if (dataList.length <= 0) {
            this._selectedMapId = null;
        } else {
            const index         = dataList.findIndex(data => data.mapId === newMapId);
            const newIndex      = index >= 0 ? index : Math.floor(Math.random() * dataList.length);
            const oldIndex      = dataList.findIndex(data => data.mapId === this._selectedMapId);
            this._selectedMapId = dataList[newIndex].mapId;
            (dataList[oldIndex])    && (this._listMap.updateSingleData(oldIndex, dataList[oldIndex]));
            (oldIndex !== newIndex) && (this._listMap.updateSingleData(newIndex, dataList[newIndex]));

            await this._showMap(dataList[newIndex].mapId);
        }
    }
    public getSelectedMapId(): number {
        return this._selectedMapId;
    }

    public async setMapFilters(mapFilters: FiltersForMapList): Promise<void> {
        this._mapFilters            = mapFilters;
        this._dataForList           = await this._createDataForListMap();

        const length                = this._dataForList.length;
        this._labelNoMap.visible    = length <= 0;
        this._listMap.bindData(this._dataForList);
        this.setSelectedMapFileName(this._selectedMapId);
        (length) && (this._listMap.scrollVerticalTo((this._dataForList.findIndex(data => data.mapId === this._selectedMapId) + 1) / length * 100));
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyMsgMmSetMapAvailability(e: egret.Event): void {
        FloatText.show(Lang.getText(LangTextType.A0059));
    }

    private _onNotifyMsgMmSetMapEnabled(e: egret.Event): void {
        FloatText.show(Lang.getText(LangTextType.A0081));
        this.setMapFilters(this._mapFilters);
    }

    private _onTouchTapBtnSearch(e: egret.TouchEvent): void {
        MmAvailabilitySearchPanel.show();
    }

    private _onTouchTapBtnBack(e: egret.TouchEvent): void {
        this.close();
        MmMainMenuPanel.show();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMenuTitle.text   = Lang.getText(LangTextType.B0227);
        this._btnBack.label         = Lang.getText(LangTextType.B0146);
        this._btnSearch.label       = Lang.getText(LangTextType.B0228);
    }

    private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
        const dataArray                                 : DataForMapNameRenderer[] = [];
        const mapFilters                                = this._mapFilters;
        const { playersCount, playedTimes, minRating }  = mapFilters;
        let { mapName: mapNameForFilter, mapDesigner }  = mapFilters;
        (mapNameForFilter)  && (mapNameForFilter = mapNameForFilter.toLowerCase());
        (mapDesigner)       && (mapDesigner = mapDesigner.toLowerCase());

        for (const [mapId, mapBriefData] of WarMapModel.getBriefDataDict()) {
            const mapName = Lang.getLanguageText({ textArray: mapBriefData.mapNameArray });
            if ((!mapBriefData.mapExtraData.isEnabled)                                                                  ||
                ((mapNameForFilter) && (mapName.toLowerCase().indexOf(mapNameForFilter) < 0))                           ||
                ((mapDesigner) && (mapBriefData.designerName.toLowerCase().indexOf(mapDesigner) < 0))                   ||
                ((playersCount) && (mapBriefData.playersCountUnneutral !== playersCount))                               ||
                ((playedTimes != null) && ((await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId)) < playedTimes))    ||
                ((minRating != null) && ((await WarMapModel.getAverageRating(mapId)) < minRating))
            ) {
                continue;
            } else {
                dataArray.push({
                    mapId,
                    mapName,
                    panel   : this,
                });
            }
        }
        return dataArray.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
    }

    private async _showMap(mapId: number): Promise<void> {
        const mapRawData                = await WarMapModel.getRawData(mapId);
        const rating                    = await WarMapModel.getAverageRating(mapId);
        this._labelMapName.text         = Lang.getFormattedText(LangTextType.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
        this._labelDesigner.text        = Lang.getFormattedText(LangTextType.F0001, mapRawData.designerName);
        this._labelPlayersCount.text    = Lang.getFormattedText(LangTextType.F0002, mapRawData.playersCountUnneutral);
        this._labelRating.text          = Lang.getFormattedText(LangTextType.F0003, rating != null ? rating.toFixed(2) : Lang.getText(LangTextType.B0001));
        this._labelPlayedTimes.text     = Lang.getFormattedText(LangTextType.F0004, await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId));
        this._groupInfo.visible         = true;
        this._groupInfo.alpha           = 1;
        egret.Tween.removeTweens(this._groupInfo);
        egret.Tween.get(this._groupInfo).wait(5000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1;});
        this._zoomMap.showMapByMapData(mapRawData);
    }
}

type DataForMapNameRenderer = {
    mapId   : number;
    mapName : string;
    panel   : MmAvailabilityListPanel;
};

class MapNameRenderer extends UiListItemRenderer<DataForMapNameRenderer> {
    private _btnChoose  : UiButton;
    private _btnNext    : UiButton;
    private _labelId    : UiLabel;
    private _labelName  : UiLabel;

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
        ]);
    }

    protected _onDataChanged(): void {
        const data          = this.data;
        const mapId         = data.mapId;
        const labelName     = this._labelName;
        this.currentState   = mapId === data.panel.getSelectedMapId() ? Types.UiState.Down : Types.UiState.Up;
        this._labelId.text  = `ID: ${mapId}`;
        labelName.text      = ``;
        WarMapModel.getMapNameInCurrentLanguage(mapId).then(v => labelName.text = v);
    }

    private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
        const data = this.data;
        data.panel.setSelectedMapFileName(data.mapId);
    }

    private _onTouchTapBtnNext(e: egret.TouchEvent): void {
        MmAvailabilityChangePanel.show({ mapId: this.data.mapId });
    }
}
