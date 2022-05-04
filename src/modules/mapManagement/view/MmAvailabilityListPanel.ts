
// import CommonConstants                  from "../../tools/helpers/CommonConstants";
// import FloatText                        from "../../tools/helpers/FloatText";
// import Helpers                          from "../../tools/helpers/Helpers";
// import Types                            from "../../tools/helpers/Types";
// import Lang                             from "../../tools/lang/Lang";
// import TwnsLangTextType                 from "../../tools/lang/LangTextType";
// import Twns.Notify                   from "../../tools/notify/NotifyType";
// import TwnsUiButton                     from "../../tools/ui/UiButton";
// import TwnsUiLabel                      from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer           from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel                      from "../../tools/ui/UiPanel";
// import TwnsUiScrollList                 from "../../tools/ui/UiScrollList";
// import TwnsUiZoomableMap                from "../../tools/ui/UiZoomableMap";
// import WarMapModel                      from "../../warMap/model/WarMapModel";
// import TwnsMmAvailabilityChangePanel    from "./MmAvailabilityChangePanel";
// import TwnsMmAvailabilitySearchPanel    from "./MmAvailabilitySearchPanel";
// import TwnsMmMainMenuPanel              from "./MmMainMenuPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapManagement {
    import LangTextType     = Twns.Lang.LangTextType;
    import NotifyType       = Twns.Notify.NotifyType;

    export type FiltersForMapList = {
        mapName?        : string | null;
        mapDesigner?    : string | null;
        playersCount?   : number | null;
        playedTimes?    : number | null;
        minRating?      : number | null;
    };
    export type OpenDataForMmAvailabilityListPanel = FiltersForMapList | null;
    export class MmAvailabilityListPanel extends TwnsUiPanel.UiPanel<OpenDataForMmAvailabilityListPanel> {
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
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMmSetMapEnabled,          callback: this._onNotifyMsgMmSetMapEnabled },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSearch, callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
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
                const oldMapId      = this.getSelectedMapId();
                const oldIndex      = dataList.findIndex(data => data.mapId === oldMapId);
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
            const dataArray             = await this._createDataForListMap();
            this._dataForList           = dataArray;

            const length                = dataArray.length;
            const listMap               = this._listMap;
            this._labelNoMap.visible    = length <= 0;
            this._listMap.bindData(dataArray);
            this.setAndReviseSelectedMapId(this.getSelectedMapId());

            if (length > 1) {
                const selectedMapId = this.getSelectedMapId();
                const index         = dataArray.findIndex(v => v.mapId === selectedMapId);
                (index >= 0) && (listMap.scrollVerticalTo(index / (length - 1) * 100));
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMsgMmSetMapEnabled(): void {
            FloatText.show(Lang.getText(LangTextType.A0081));
            this.setMapFilters(this._mapFilters);
        }

        private _onTouchTapBtnSearch(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MmAvailabilitySearchPanel, void 0);
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MmMainMenuPanel, void 0);
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
            const dataArray                                 : DataForMapNameRenderer[] = [];
            const mapFilters                                = this._mapFilters;
            const { playersCount, playedTimes, minRating }  = mapFilters;
            let { mapName: mapNameForFilter, mapDesigner }  = mapFilters;
            (mapNameForFilter)  && (mapNameForFilter = mapNameForFilter.toLowerCase());
            (mapDesigner)       && (mapDesigner = mapDesigner.toLowerCase());

            const promiseArray: Promise<void>[] = [];
            for (const mapId of Twns.WarMap.WarMapModel.getEnabledMapIdArray()) {
                promiseArray.push((async () => {
                    const mapBriefData = await Twns.WarMap.WarMapModel.getBriefData(mapId);
                    if (mapBriefData == null) {
                        return;
                    }

                    const mapName           = Twns.Helpers.getExisted(Lang.getLanguageText({ textArray: mapBriefData.mapNameArray }));
                    const averageRating     = await Twns.WarMap.WarMapModel.getAverageRating(mapId);
                    const actualPlayedTimes = await Twns.WarMap.WarMapModel.getTotalPlayedTimes(mapId);
                    if ((!mapBriefData.mapExtraData?.isEnabled)                                                                 ||
                        ((mapNameForFilter) && (!mapName.toLowerCase().includes(mapNameForFilter)))                             ||
                        ((mapDesigner) && (!mapBriefData.designerName?.toLowerCase().includes(mapDesigner)))                    ||
                        ((playersCount) && (mapBriefData.playersCountUnneutral !== playersCount))                               ||
                        ((playedTimes != null) && (actualPlayedTimes < playedTimes))                                            ||
                        ((minRating != null) && ((averageRating == null) || (averageRating < minRating)))
                    ) {
                        return;
                    } else {
                        dataArray.push({
                            mapId,
                            mapName,
                            panel   : this,
                        });
                    }
                })());
            }

            await Promise.all(promiseArray);
            return dataArray.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
        }

        private async _showMap(mapId: number): Promise<void> {
            const mapRawData                = Twns.Helpers.getExisted(await Twns.WarMap.WarMapModel.getRawData(mapId));
            const rating                    = await Twns.WarMap.WarMapModel.getAverageRating(mapId);
            this._labelMapName.text         = Lang.getFormattedText(LangTextType.F0000, await Twns.WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId));
            this._labelDesigner.text        = Lang.getFormattedText(LangTextType.F0001, mapRawData.designerName);
            this._labelPlayersCount.text    = Lang.getFormattedText(LangTextType.F0002, mapRawData.playersCountUnneutral);
            this._labelRating.text          = Lang.getFormattedText(LangTextType.F0003, rating != null ? rating.toFixed(2) : Lang.getText(LangTextType.B0001));
            this._labelPlayedTimes.text     = Lang.getFormattedText(LangTextType.F0004, await Twns.WarMap.WarMapModel.getTotalPlayedTimes(mapId));
            this._groupInfo.visible         = true;
            this._groupInfo.alpha           = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(5000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1;});
            this._zoomMap.showMapByMapData(mapRawData, await Twns.Config.ConfigManager.getLatestGameConfig());
        }
    }

    type DataForMapNameRenderer = {
        mapId   : number;
        mapName : string;
        panel   : MmAvailabilityListPanel;
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
            this._setNotifyListenerArray([
                { type: NotifyType.MsgMmSetMapName, callback: this._onNotifyMsgMmSetMapName },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchTapBtnChoose(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedMapId(data.mapId);
        }

        private _onTouchTapBtnNext(): void {
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.MmCommandPanel, { mapId: this._getData().mapId });
        }

        private _onNotifyMsgMmSetMapName(e: egret.Event): void {
            const data = e.data as CommonProto.NetMessage.MsgMmSetMapName.IS;
            if (data.mapId === this._getData().mapId) {
                this._updateView();
            }
        }

        private _updateView(): void {
            const data          = this._getData();
            const mapId         = data.mapId;
            const labelName     = this._labelName;
            this.currentState   = mapId === data.panel.getSelectedMapId() ? Twns.Types.UiState.Down : Twns.Types.UiState.Up;
            this._labelId.text  = `ID: ${mapId}`;
            labelName.text      = ``;
            Twns.WarMap.WarMapModel.getMapNameInCurrentLanguage(mapId).then(v => labelName.text = v ?? CommonConstants.ErrorTextForUndefined);
        }
    }
}

// export default TwnsMmAvailabilityListPanel;
