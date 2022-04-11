
// import TwnsLobbyBottomPanel         from "../../lobby/view/LobbyBottomPanel";
// import TwnsLobbyTopPanel            from "../../lobby/view/LobbyTopPanel";
// import TwnsSpmMainMenuPanel         from "../../singlePlayerMode/view/SpmMainMenuPanel";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer       from "../../tools/ui/UiListItemRenderer";
// import TwnsUiMapInfo                from "../../tools/ui/UiMapInfo";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiScrollList             from "../../tools/ui/UiScrollList";
// import TwnsUiZoomableMap            from "../../tools/ui/UiZoomableMap";
// import WarMapModel                  from "../../warMap/model/WarMapModel";
// import ScrCreateModel               from "../model/ScrCreateModel";
// import TwnsScrCreateSearchMapPanel  from "./ScrCreateSearchMapPanel";
// import TwnsScrCreateSettingsPanel   from "./ScrCreateSettingsPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsScrCreateMapListPanel {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IDataForMapTag           = CommonProto.Map.IDataForMapTag;

    type FiltersForMapList = {
        mapName?        : string | null;
        mapDesigner?    : string | null;
        playersCount?   : number | null;
        minRating?      : number | null;
        mapTag?         : IDataForMapTag | null;
    };
    export type OpenData = FiltersForMapList | null;
    export class ScrCreateMapListPanel extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _groupMapView!         : eui.Group;
        private readonly _zoomMap!              : TwnsUiZoomableMap.UiZoomableMap;
        private readonly _labelLoading!         : TwnsUiLabel.UiLabel;

        private readonly _groupNavigator!       : eui.Group;
        private readonly _labelSinglePlayer!    : TwnsUiLabel.UiLabel;
        private readonly _labelCustomMode!      : TwnsUiLabel.UiLabel;
        private readonly _labelChooseMap!       : TwnsUiLabel.UiLabel;

        private readonly _btnBack!              : TwnsUiButton.UiButton;
        private readonly _btnSearch!            : TwnsUiButton.UiButton;
        private readonly _btnMapInfo!           : TwnsUiButton.UiButton;
        private readonly _btnNextStep!          : TwnsUiButton.UiButton;

        private readonly _groupMapList!         : eui.Group;
        private readonly _listMap!              : TwnsUiScrollList.UiScrollList<DataForMapNameRenderer>;
        private readonly _labelNoMap!           : TwnsUiLabel.UiLabel;

        private readonly _uiMapInfo!            : TwnsUiMapInfo.UiMapInfo;

        private _mapFilters         : FiltersForMapList = {};
        private _dataForList        : DataForMapNameRenderer[] = [];
        private _selectedMapId      : number | null = null;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnSearch,      callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listMap.setItemRenderer(MapNameRenderer);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            this.setMapFilters(this._getOpenData() || this._mapFilters);
        }
        protected _onClosing(): void {
            // nothing to do
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
            const dataArray             = await this._createDataForListMap();
            this._dataForList           = dataArray;

            const length                = dataArray.length;
            const listMap               = this._listMap;
            this._labelNoMap.visible    = length <= 0;
            listMap.bindData(dataArray);
            this.setAndReviseSelectedMapId(this._selectedMapId);

            if (length > 1) {
                const index = dataArray.findIndex(v => v.mapId === this._selectedMapId);
                (index >= 0) && (listMap.scrollVerticalTo(index / (length - 1) * 100));
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchTapBtnSearch(): void {
            TwnsPanelManager.open(TwnsPanelConfig.Dict.ScrCreateSearchMapPanel, void 0);
        }

        private _onTouchTapBtnBack(): void {
            this.close();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.SpmMainMenuPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyTopPanel, void 0);
            TwnsPanelManager.open(TwnsPanelConfig.Dict.LobbyBottomPanel, void 0);
        }

        private async _onTouchedBtnNextStep(): Promise<void> {
            const selectedMapId = this.getSelectedMapId();
            if (selectedMapId != null) {
                this.close();
                await ScrCreateModel.resetDataByMapId(selectedMapId);
                TwnsPanelManager.open(TwnsPanelConfig.Dict.ScrCreateSettingsPanel, void 0);
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelCustomMode.text          = Lang.getText(LangTextType.B0603);
            this._labelSinglePlayer.text        = Lang.getText(LangTextType.B0138);
            this._labelChooseMap.text           = Lang.getText(LangTextType.B0227);
            this._labelLoading.text             = Lang.getText(LangTextType.A0150);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._btnSearch.label               = Lang.getText(LangTextType.B0228);
            this._btnMapInfo.label              = Lang.getText(LangTextType.B0298);
            this._btnNextStep.label             = Lang.getText(LangTextType.B0566);
        }

        private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
            const data                          : DataForMapNameRenderer[] = [];
            const mapFilters                    = this._mapFilters;
            const { playersCount, minRating }   = mapFilters;
            const filterTag                     = mapFilters.mapTag || {};
            let { mapName, mapDesigner }        = mapFilters;
            (mapName)       && (mapName     = mapName.toLowerCase());
            (mapDesigner)   && (mapDesigner = mapDesigner.toLowerCase());

            const promiseArray: Promise<void>[] = [];
            for (const mapId of WarMapModel.getEnabledMapIdArray()) {
                promiseArray.push((async () => {
                    const mapBriefData = await WarMapModel.getBriefData(mapId);
                    if (mapBriefData == null) {
                        return;
                    }

                    const mapExtraData  = Helpers.getExisted(mapBriefData.mapExtraData);
                    const mapTag        = mapBriefData.mapTag || {};
                    const realMapName   = Helpers.getExisted(await WarMapModel.getMapNameInCurrentLanguage(mapId));
                    const rating        = await WarMapModel.getAverageRating(mapId);
                    if ((!mapBriefData.ruleAvailability?.canScw)                                                ||
                        (!mapExtraData.isEnabled)                                                               ||
                        ((mapName) && (realMapName.toLowerCase().indexOf(mapName) < 0))                         ||
                        ((mapDesigner) && (!mapBriefData.designerName?.toLowerCase().includes(mapDesigner)))    ||
                        ((playersCount) && (mapBriefData.playersCountUnneutral !== playersCount))               ||
                        ((minRating != null) && ((rating == null) || (rating < minRating)))                     ||
                        ((filterTag.fog != null) && ((!!mapTag.fog) !== filterTag.fog))
                    ) {
                        return;
                    } else {
                        data.push({
                            mapId,
                            mapName : realMapName,
                            panel   : this,
                        });
                    }
                })());
            }

            await Promise.all(promiseArray);
            return data.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
        }

        private async _showMap(mapId: number): Promise<void> {
            this._zoomMap.showMapByMapData(
                Helpers.getExisted(await WarMapModel.getRawData(mapId)),
                await Twns.Config.ConfigManager.getLatestGameConfig()
            );
            this._uiMapInfo.setData({
                mapInfo: {
                    mapId,
                },
            });
        }

        protected async _showOpenAnimation(): Promise<void> {
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._groupMapView,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    type DataForMapNameRenderer = {
        mapId   : number;
        mapName : string;
        panel   : ScrCreateMapListPanel;
    };

    class MapNameRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForMapNameRenderer> {
        private readonly _btnChoose!    : TwnsUiButton.UiButton;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.None);
        }

        protected _onDataChanged(): void {
            const data          = this._getData();
            WarMapModel.getMapNameInCurrentLanguage(data.mapId).then(v => this._labelName.text = v || CommonConstants.ErrorTextForUndefined);
        }

        private _onTouchTapBtnChoose(): void {
            const data = this._getData();
            data.panel.setAndReviseSelectedMapId(data.mapId);
        }
    }
}

// export default TwnsScrCreateMapListPanel;
