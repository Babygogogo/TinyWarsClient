
import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
import ConfigManager                from "../../tools/helpers/ConfigManager";
import Helpers                      from "../../tools/helpers/Helpers";
import Types                        from "../../tools/helpers/Types";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType             from "../../tools/lang/LangTextType";
import TwnsNotifyType               from "../../tools/notify/NotifyType";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import TwnsUiButton                 from "../../tools/ui/UiButton";
import TwnsUiLabel                  from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
import TwnsUiMapInfo                from "../../tools/ui/UiMapInfo";
import TwnsUiPanel                  from "../../tools/ui/UiPanel";
import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
import TwnsUiZoomableMap            from "../../tools/ui/UiZoomableMap";
import WarMapModel                  from "../../warMap/model/WarMapModel";
import CcrCreateModel               from "../model/CcrCreateModel";
import TwnsCcrCreateSearchMapPanel  from "./CcrCreateSearchMapPanel";
import TwnsCcrCreateSettingsPanel   from "./CcrCreateSettingsPanel";
import TwnsCcrMainMenuPanel         from "./CcrMainMenuPanel";

namespace TwnsCcrCreateMapListPanel {
    import CcrCreateSearchMapPanel  = TwnsCcrCreateSearchMapPanel.CcrCreateSearchMapPanel;
    import CcrCreateSettingsPanel   = TwnsCcrCreateSettingsPanel.CcrCreateSettingsPanel;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IDataForMapTag           = ProtoTypes.Map.IDataForMapTag;

    type FiltersForMapList = {
        mapName?        : string;
        mapDesigner?    : string;
        playersCount?   : number;
        playedTimes?    : number;
        minRating?      : number;
        mapTag?         : IDataForMapTag;
    };
    export class CcrCreateMapListPanel extends TwnsUiPanel.UiPanel<FiltersForMapList> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CcrCreateMapListPanel;

        private readonly _groupMapView          : eui.Group;
        private readonly _zoomMap               : TwnsUiZoomableMap.UiZoomableMap;
        private readonly _labelLoading          : TwnsUiLabel.UiLabel;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : TwnsUiLabel.UiLabel;
        private readonly _labelCreateRoom       : TwnsUiLabel.UiLabel;
        private readonly _labelChooseMap        : TwnsUiLabel.UiLabel;

        private readonly _btnBack               : TwnsUiButton.UiButton;
        private readonly _btnSearch             : TwnsUiButton.UiButton;
        private readonly _btnMapInfo            : TwnsUiButton.UiButton;
        private readonly _btnNextStep           : TwnsUiButton.UiButton;

        private readonly _groupMapList          : eui.Group;
        private readonly _listMap               : TwnsUiScrollList.UiScrollList<DataForMapNameRenderer>;
        private readonly _labelNoMap            : TwnsUiLabel.UiLabel;

        private readonly _uiMapInfo             : TwnsUiMapInfo.UiMapInfo;

        private _mapFilters         : FiltersForMapList = {};
        private _dataForList        : DataForMapNameRenderer[] = [];
        private _selectedMapId      : number;

        public static show(mapFilters?: FiltersForMapList): void {
            if (!CcrCreateMapListPanel._instance) {
                CcrCreateMapListPanel._instance = new CcrCreateMapListPanel();
            }

            CcrCreateMapListPanel._instance.open(mapFilters);
        }
        public static async hide(): Promise<void> {
            if (CcrCreateMapListPanel._instance) {
                await CcrCreateMapListPanel._instance.close();
            }
        }
        public static getInstance(): CcrCreateMapListPanel {
            return CcrCreateMapListPanel._instance;
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/coopCustomRoom/CcrCreateMapListPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnSearch,      callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listMap.setItemRenderer(MapNameRenderer);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();

            this.setMapFilters(this._getOpenData() || this._mapFilters);
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        public async setSelectedMapId(newMapId: number): Promise<void> {
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
            const dataArray             = await this._createDataForListMap();
            this._dataForList           = dataArray;

            const length                = dataArray.length;
            const listMap               = this._listMap;
            this._labelNoMap.visible    = length <= 0;
            listMap.bindData(dataArray);
            this.setSelectedMapId(this._selectedMapId);

            if (length > 1) {
                const index = dataArray.findIndex(v => v.mapId === this._selectedMapId);
                (index >= 0) && (listMap.scrollVerticalTo(index / (length - 1) * 100));
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchTapBtnSearch(): void {
            CcrCreateSearchMapPanel.show();
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsCcrMainMenuPanel.CcrMainMenuPanel.show();
            TwnsLobbyTopPanel.LobbyTopPanel.show();
            TwnsLobbyBottomPanel.LobbyBottomPanel.show();
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const selectedMapId = this.getSelectedMapId();
            if (selectedMapId != null) {
                this.close();
                await CcrCreateModel.resetDataByMapId(selectedMapId);
                CcrCreateSettingsPanel.show();
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelCreateRoom.text          = Lang.getText(LangTextType.B0000);
            this._labelMultiPlayer.text         = Lang.getText(LangTextType.B0646);
            this._labelChooseMap.text           = Lang.getText(LangTextType.B0227);
            this._labelLoading.text             = Lang.getText(LangTextType.A0150);
            this._labelNoMap.text               = Lang.getText(LangTextType.A0010);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._btnSearch.label               = Lang.getText(LangTextType.B0228);
            this._btnMapInfo.label              = Lang.getText(LangTextType.B0298);
            this._btnNextStep.label             = Lang.getText(LangTextType.B0566);
        }

        private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
            const dataArray                                 : DataForMapNameRenderer[] = [];
            const mapFilters                                = this._mapFilters;
            const filterTag                                 = mapFilters.mapTag || {};
            const mapName                                   = (mapFilters.mapName || "").toLowerCase();
            const mapDesigner                               = (mapFilters.mapDesigner || "").toLowerCase();
            const { playersCount, playedTimes, minRating }  = mapFilters;

            for (const [mapId, mapBriefData] of WarMapModel.getBriefDataDict()) {
                const mapExtraData  = mapBriefData.mapExtraData;
                const mapTag        = mapBriefData.mapTag || {};
                const realMapName   = await WarMapModel.getMapNameInCurrentLanguage(mapId);
                const rating        = await WarMapModel.getAverageRating(mapId);
                if ((!mapBriefData.ruleAvailability.canCcw)                                                             ||
                    (!mapExtraData.isEnabled)                                                                           ||
                    (!mapExtraData.mapComplexInfo.mapAvailability.canCcw)                                               ||
                    ((mapName) && (realMapName.toLowerCase().indexOf(mapName) < 0))                                     ||
                    ((mapDesigner) && (mapBriefData.designerName.toLowerCase().indexOf(mapDesigner) < 0))               ||
                    ((playersCount) && (mapBriefData.playersCountUnneutral !== playersCount))                           ||
                    ((playedTimes != null) && (await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId) < playedTimes))  ||
                    ((minRating != null) && ((rating == null) || (rating < minRating)))                                 ||
                    ((filterTag.fog != null) && ((!!mapTag.fog) !== filterTag.fog))
                ) {
                    continue;
                } else {
                    dataArray.push({
                        mapId,
                        mapName : realMapName,
                        panel   : this,
                    });
                }
            }

            return dataArray.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
        }

        private async _showMap(mapId: number): Promise<void> {
            const mapRawData = await WarMapModel.getRawData(mapId);
            this._zoomMap.showMapByMapData(mapRawData);
            this._uiMapInfo.setData({
                mapInfo: {
                    mapId,
                },
            });
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._groupMapView,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnSearch,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 80 },
            });
            Helpers.resetTween({
                obj         : this._btnMapInfo,
                beginProps  : { alpha: 0, y: 40 },
                endProps    : { alpha: 1, y: 80 },
            });
            Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupMapList,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._uiMapInfo,
                beginProps  : { alpha: 0, right: -40 },
                endProps    : { alpha: 1, right: 0 },
            });
        }
        private async _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._groupMapView,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    callback    : resolve,
                });
                Helpers.resetTween({
                    obj         : this._groupNavigator,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
                });
                Helpers.resetTween({
                    obj         : this._btnBack,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
                });
                Helpers.resetTween({
                    obj         : this._btnSearch,
                    beginProps  : { alpha: 1, y: 80 },
                    endProps    : { alpha: 0, y: 40 },
                });
                Helpers.resetTween({
                    obj         : this._btnMapInfo,
                    beginProps  : { alpha: 1, y: 80 },
                    endProps    : { alpha: 0, y: 40 },
                });
                Helpers.resetTween({
                    obj         : this._btnNextStep,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._groupMapList,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._uiMapInfo,
                    beginProps  : { alpha: 1, right: 0 },
                    endProps    : { alpha: 0, right: -40 },
                });
            });
        }
    }

    type DataForMapNameRenderer = {
        mapId   : number;
        mapName : string;
        panel   : CcrCreateMapListPanel;
    };
    class MapNameRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMapNameRenderer> {
        private _btnChoose: TwnsUiButton.UiButton;
        private _btnNext  : TwnsUiButton.UiButton;
        private _labelName: TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
        }

        protected _onDataChanged(): void {
            const data          = this.data;
            this.currentState   = data.mapId === data.panel.getSelectedMapId() ? Types.UiState.Down : Types.UiState.Up;
            WarMapModel.getMapNameInCurrentLanguage(data.mapId).then(v => this._labelName.text = v);
        }

        private _onTouchTapBtnChoose(): void {
            const data = this.data;
            data.panel.setSelectedMapId(data.mapId);
        }

        private async _onTouchTapBtnNext(): Promise<void> {
            const data = this.data;
            data.panel.close();
            await CcrCreateModel.resetDataByMapId(data.mapId);
            CcrCreateSettingsPanel.show();
        }
    }
}

export default TwnsCcrCreateMapListPanel;
