
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import FloatText                    from "../../tools/helpers/FloatText";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import TwnsUiZoomableMap            from "../../tools/ui/UiZoomableMap";
// import WarMapModel                  from "../../warMap/model/WarMapModel";
// import TwnsMmAvailabilityListPanel  from "./MmAvailabilityListPanel";
// import TwnsMmMainMenuPanel          from "./MmMainMenuPanel";
// import TwnsMmTagChangePanel         from "./MmTagChangePanel";
// import TwnsMmTagSearchPanel         from "./MmTagSearchPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsMmAddRuleMapListPanel {
    import FiltersForMapList    = TwnsMmAvailabilityListPanel.FiltersForMapList;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;

    export type OpenData = FiltersForMapList | null;
    export class MmAddRuleMapListPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _listMap!              : TwnsUiScrollList.UiScrollList<DataForMapNameRenderer>;
        private readonly _zoomMap!              : TwnsUiZoomableMap.UiZoomableMap;
        private readonly _labelMenuTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnSearch!            : TwnsUiButton.UiButton;
        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _labelNoMap!           : TwnsUiLabel.UiLabel;

        private readonly _groupInfo!            : eui.Group;
        private readonly _labelMapName!         : TwnsUiLabel.UiLabel;
        private readonly _labelDesigner!        : TwnsUiLabel.UiLabel;
        private readonly _labelRating!          : TwnsUiLabel.UiLabel;
        private readonly _labelPlayedTimes!     : TwnsUiLabel.UiLabel;
        private readonly _labelPlayersCount!    : TwnsUiLabel.UiLabel;

        private _mapFilters         : FiltersForMapList = {};
        private _dataForList        : DataForMapNameRenderer[] = [];
        private _selectedMapId      : number | null = null;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSearch,      callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
            ]);
            this._listMap.setItemRenderer(MapNameRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._groupInfo.visible = false;
            this._updateComponentsForLanguage();

            this.setMapFilters(this._getOpenData() || this._mapFilters);
        }
        protected _onClosing(): void {
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setAndReviseSelectedMapId(newMapId: number | null): Promise<void> {
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

                this._listMap.setSelectedIndex(newIndex);
                await this._showMap(dataList[newIndex].mapId);
            }
        }
        public getSelectedMapId(): number | null {
            return this._selectedMapId;
        }

        public async setMapFilters(mapFilters: FiltersForMapList): Promise<void> {
            this._mapFilters            = mapFilters;
            this._dataForList           = await this._createDataForListMap();

            const length                = this._dataForList.length;
            this._labelNoMap.visible    = length <= 0;
            this._listMap.bindData(this._dataForList);
            this.setAndReviseSelectedMapId(this._selectedMapId);
            (length) && (this._listMap.scrollVerticalTo((this._dataForList.findIndex(data => data.mapId === this._selectedMapId) + 1) / length * 100));
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchTapBtnSearch(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MmAddRuleSearchPanel, void 0);
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MmMainMenuPanel, void 0);
        }

        private _onNotifyLanguageChanged(): void {
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
            const data                                      : DataForMapNameRenderer[] = [];
            const mapFilters                                = this._mapFilters;
            const { playersCount, playedTimes, minRating }  = mapFilters;
            let { mapName: mapNameForFilter, mapDesigner }  = mapFilters;
            (mapNameForFilter)  && (mapNameForFilter = mapNameForFilter.toLowerCase());
            (mapDesigner)       && (mapDesigner = mapDesigner.toLowerCase());

            for (const [mapId, mapBriefData] of WarMapModel.getBriefDataDict()) {
                const mapName           = Helpers.getExisted(Lang.getLanguageText({ textArray: mapBriefData.mapNameArray }));
                const averageRating     = await WarMapModel.getAverageRating(mapId);
                const actualPlayedTimes = await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId);
                if ((!mapBriefData.mapExtraData?.isEnabled)                                                                 ||
                    ((mapNameForFilter) && (mapName.toLowerCase().indexOf(mapNameForFilter) < 0))                           ||
                    ((mapDesigner) && (!mapBriefData.designerName?.toLowerCase().includes(mapDesigner)))                    ||
                    ((playersCount) && (mapBriefData.playersCountUnneutral !== playersCount))                               ||
                    ((playedTimes != null) && (actualPlayedTimes < playedTimes))                                            ||
                    ((minRating != null) && ((averageRating == null) || (averageRating < minRating)))
                ) {
                    continue;
                } else {
                    data.push({
                        mapId,
                        mapName,
                        panel   : this,
                    });
                }
            }
            return data.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
        }

        private async _showMap(mapId: number): Promise<void> {
            const mapRawData                = Helpers.getExisted(await WarMapModel.getRawData(mapId));
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
        panel   : MmAddRuleMapListPanel;
    };
    class MapNameRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMapNameRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _btnNext!      : TwnsUiButton.UiButton;
        private readonly _labelId!      : TwnsUiLabel.UiLabel;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
        }

        protected _onDataChanged(): void {
            const data          = this._getData();
            const mapId         = data.mapId;
            const labelName     = this._labelName;
            this.currentState   = mapId === data.panel.getSelectedMapId() ? Types.UiState.Down : Types.UiState.Up;
            this._labelId.text  = `ID: ${mapId}`;
            labelName.text      = ``;
            WarMapModel.getMapNameInCurrentLanguage(mapId).then(v => labelName.text = v ?? CommonConstants.ErrorTextForUndefined);
        }

        private _onTouchTapBtnChoose(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedMapId(data.mapId);
        }

        private async _onTouchTapBtnNext(): Promise<void> {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.MmWarRulePanel, {
                mapRawData      : await WarMapModel.getRawData(this._getData().mapId),
            });
        }
    }
}

// export default TwnsMmAddRuleMapListPanel;
