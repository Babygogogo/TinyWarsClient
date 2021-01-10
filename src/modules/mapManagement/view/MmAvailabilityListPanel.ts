
namespace TinyWars.MapManagement {
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;
    import WarMapModel  = WarMap.WarMapModel;

    export type FiltersForMapList = {
        mapName?        : string;
        mapDesigner?    : string;
        playersCount?   : number;
        playedTimes?    : number;
        minRating?      : number;
    }

    export class MmAvailabilityListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmAvailabilityListPanel;

        private _listMap        : GameUi.UiScrollList;
        private _zoomMap        : GameUi.UiZoomableComponent;
        private _labelMenuTitle : GameUi.UiLabel;
        private _btnSearch      : GameUi.UiButton;
        private _btnBack        : GameUi.UiButton;
        private _labelNoMap     : GameUi.UiLabel;

        private _groupInfo          : eui.Group;
        private _labelMapName       : GameUi.UiLabel;
        private _labelDesigner      : GameUi.UiLabel;
        private _labelRating        : GameUi.UiLabel;
        private _labelPlayedTimes   : GameUi.UiLabel;
        private _labelPlayersCount  : GameUi.UiLabel;

        private _mapFilters         : FiltersForMapList = {};
        private _dataForList        : DataForMapNameRenderer[] = [];
        private _selectedMapId      : number;

        public static show(mapFilters?: FiltersForMapList): void {
            if (!MmAvailabilityListPanel._instance) {
                MmAvailabilityListPanel._instance = new MmAvailabilityListPanel();
            }

            (mapFilters) && (MmAvailabilityListPanel._instance._mapFilters = mapFilters);
            MmAvailabilityListPanel._instance.open();
        }
        public static hide(): void {
            if (MmAvailabilityListPanel._instance) {
                MmAvailabilityListPanel._instance.close();
            }
        }
        public static getInstance(): MmAvailabilityListPanel {
            return MmAvailabilityListPanel._instance;
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/mapManagement/MmAvailabilityListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMmSetMapAvailability,  callback: this._onNotifySMmChangeAvailability },
                { type: Notify.Type.MsgMmDeleteMap,           callback: this._onNotifySMmDeleteMap },
            ]);
            this._setUiListenerArray([
                { ui: this._btnSearch, callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listMap.setItemRenderer(MapNameRenderer);

            this._groupInfo.visible = false;
            this._zoomMap.setMouseWheelListenerEnabled(true);
            this._zoomMap.setTouchListenerEnabled(true);
            this._updateComponentsForLanguage();

            this.setMapFilters(this._mapFilters);
        }
        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._zoomMap.setMouseWheelListenerEnabled(false);
            this._zoomMap.setTouchListenerEnabled(false);
            this._listMap.clear();
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
        private _onNotifySMmChangeAvailability(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0059));
        }

        private _onNotifySMmDeleteMap(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0081));
            this.setMapFilters(this._mapFilters);
        }

        private _onTouchTapBtnSearch(e: egret.TouchEvent): void {
            MmAvailabilitySearchPanel.show();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            MmAvailabilityListPanel.hide();
            MmMainMenuPanel.show();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0227);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
            this._btnSearch.label       = Lang.getText(Lang.Type.B0228);
        }

        private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
            const data: DataForMapNameRenderer[] = [];
            let { mapName: mapNameForFilter, mapDesigner, playersCount, playedTimes, minRating } = this._mapFilters;
            (mapNameForFilter)  && (mapNameForFilter = mapNameForFilter.toLowerCase());
            (mapDesigner)       && (mapDesigner = mapDesigner.toLowerCase());

            for (const [mapId, mapBriefData] of WarMapModel.getBriefDataDict()) {
                const mapName = Lang.getTextInLanguage(mapBriefData.mapNameList);
                if ((!mapBriefData.mapExtraData.isEnabled)                                                                  ||
                    ((mapNameForFilter) && (mapName.toLowerCase().indexOf(mapNameForFilter) < 0))                           ||
                    ((mapDesigner) && (mapBriefData.designerName.toLowerCase().indexOf(mapDesigner) < 0))                   ||
                    ((playersCount) && (mapBriefData.playersCountUnneutral !== playersCount))                               ||
                    ((playedTimes != null) && ((await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId)) < playedTimes))    ||
                    ((minRating != null) && ((await WarMapModel.getAverageRating(mapId)) < minRating))
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
            const mapRawData                = await WarMapModel.getRawData(mapId);
            const rating                    = await WarMapModel.getAverageRating(mapId);
            this._labelMapName.text         = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
            this._labelDesigner.text        = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
            this._labelPlayersCount.text    = Lang.getFormattedText(Lang.Type.F0002, mapRawData.playersCountUnneutral);
            this._labelRating.text          = Lang.getFormattedText(Lang.Type.F0003, rating != null ? rating.toFixed(2) : Lang.getText(Lang.Type.B0001));
            this._labelPlayedTimes.text     = Lang.getFormattedText(Lang.Type.F0004, await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId));
            this._groupInfo.visible         = true;
            this._groupInfo.alpha           = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(5000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new WarMap.WarMapTileMapView();
            tileMapView.init(mapRawData.mapWidth, mapRawData.mapHeight);
            tileMapView.updateWithTileDataList(mapRawData.tileDataList);

            const unitMapView = new WarMap.WarMapUnitMapView();
            unitMapView.initWithMapRawData(mapRawData);

            const gridSize = Utility.ConfigManager.getGridSize();
            this._zoomMap.removeAllContents();
            this._zoomMap.setContentWidth(mapRawData.mapWidth * gridSize.width);
            this._zoomMap.setContentHeight(mapRawData.mapHeight * gridSize.height);
            this._zoomMap.addContent(tileMapView);
            this._zoomMap.addContent(unitMapView);
            this._zoomMap.setContentScale(0, true);
        }
    }

    type DataForMapNameRenderer = {
        mapId   : number;
        mapName : string;
        panel   : MmAvailabilityListPanel;
    }

    class MapNameRenderer extends GameUi.UiListItemRenderer {
        private _btnChoose  : GameUi.UiButton;
        private _btnNext    : GameUi.UiButton;
        private _labelId    : GameUi.UiLabel;
        private _labelName  : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data          = this.data as DataForMapNameRenderer;
            const mapId         = data.mapId;
            const labelName     = this._labelName;
            this.currentState   = mapId === data.panel.getSelectedMapId() ? Types.UiState.Down : Types.UiState.Up;
            this._labelId.text  = `ID: ${mapId}`;
            labelName.text      = ``;
            WarMapModel.getMapNameInCurrentLanguage(mapId).then(v => labelName.text = v);
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            data.panel.setSelectedMapFileName(data.mapId);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            MmAvailabilityChangePanel.show((this.data as DataForMapNameRenderer).mapId);
        }
    }
}
