
namespace TinyWars.SingleCustomRoom {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import WarMapModel  = WarMap.WarMapModel;

    type FiltersForMapList = {
        mapName?        : string;
        mapDesigner?    : string;
        playersCount?   : number;
        playedTimes?    : number;
        minRating?      : number;
    }

    export class ScrCreateMapListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ScrCreateMapListPanel;

        private _listMap   : GameUi.UiScrollList;
        private _zoomMap   : GameUi.UiZoomableComponent;
        private _btnSearch : GameUi.UiButton;
        private _btnBack   : GameUi.UiButton;
        private _labelNoMap: GameUi.UiLabel;

        private _groupInfo          : eui.Group;
        private _labelMenuTitle     : GameUi.UiLabel;
        private _labelMapName       : GameUi.UiLabel;
        private _labelDesigner      : GameUi.UiLabel;
        private _labelRating        : GameUi.UiLabel;
        private _labelPlayedTimes   : GameUi.UiLabel;
        private _labelPlayersCount  : GameUi.UiLabel;

        private _mapFilters         : FiltersForMapList = {};
        private _dataForList        : DataForMapNameRenderer[] = [];
        private _selectedMapId      : number;

        public static show(mapFilters?: FiltersForMapList): void {
            if (!ScrCreateMapListPanel._instance) {
                ScrCreateMapListPanel._instance = new ScrCreateMapListPanel();
            }

            (mapFilters) && (ScrCreateMapListPanel._instance.setMapFilters(mapFilters));
            ScrCreateMapListPanel._instance.open();
        }
        public static hide(): void {
            if (ScrCreateMapListPanel._instance) {
                ScrCreateMapListPanel._instance.close();
            }
        }
        public static getInstance(): ScrCreateMapListPanel {
            return ScrCreateMapListPanel._instance;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/singleCustomRoom/ScrCreateMapListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnSearch, callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];
            this._listMap.setItemRenderer(MapNameRenderer);
        }
        protected _onOpened(): void {
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
            this._dataForList           = await this._createDataForListMap();

            const length                = this._dataForList.length;
            this._labelNoMap.visible    = length <= 0;
            this._listMap.bindData(this._dataForList);
            this.setSelectedMapId(this._selectedMapId);

            if (length) {
                for (let index = 0; index < length; ++index) {
                    if (this._dataForList[index].mapId === this._selectedMapId) {
                        this._listMap.scrollVerticalTo((index + 1) / length * 100);
                        break;
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchTapBtnSearch(e: egret.TouchEvent): void {
            ScrCreateSearchMapPanel.show();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            SinglePlayerLobby.SinglePlayerLobbyPanel.show();
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
            let { mapName, mapDesigner, playersCount, playedTimes, minRating } = this._mapFilters;
            (mapName)       && (mapName     = mapName.toLowerCase());
            (mapDesigner)   && (mapDesigner = mapDesigner.toLowerCase());

            for (const [mapId, extraData] of WarMapModel.getExtraDataDict()) {
                const rawData       = await WarMapModel.getRawData(mapId);
                const mapNameList   = rawData.mapNameList;
                const mapName       = mapNameList[Lang.getLanguageType() === Types.LanguageType.Chinese ? 0 : 1] || mapNameList[0];
                if ((!extraData.mapComplexInfo.availability.canScw)                                                     ||
                    ((mapName) && (mapName.toLowerCase().indexOf(mapName) < 0))                                         ||
                    ((mapDesigner) && (rawData.designerName.toLowerCase().indexOf(mapDesigner) < 0))                    ||
                    ((playersCount) && (rawData.playersCount !== playersCount))                                         ||
                    ((playedTimes != null) && (await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId) < playedTimes))  ||
                    ((minRating != null) && (!(await WarMapModel.getAverageRating(mapId) >= minRating)))
                ) {
                    continue;
                } else {
                    data.push({
                        mapId: mapId,
                        mapName : mapName,
                        panel   : this,
                    });
                }
            }

            data.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
            return data;
        }

        private async _showMap(mapId: number): Promise<void> {
            const mapRawData                = await WarMapModel.getRawData(mapId);
            const mapExtraData              = await WarMapModel.getExtraData(mapId);
            const averageRating             = await WarMapModel.getAverageRating(mapId);
            this._labelMapName.text         = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
            this._labelDesigner.text        = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
            this._labelPlayersCount.text    = Lang.getFormattedText(Lang.Type.F0002, mapRawData.playersCount);
            this._labelRating.text          = Lang.getFormattedText(Lang.Type.F0003, averageRating != null ? averageRating.toFixed(2) : Lang.getText(Lang.Type.B0001));
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
        mapId       : number;
        mapName     : string;
        panel       : ScrCreateMapListPanel;
    }

    class MapNameRenderer extends eui.ItemRenderer {
        private _btnChoose: GameUi.UiButton;
        private _btnNext  : GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data          = this.data as DataForMapNameRenderer;
            this.currentState   = data.mapId === data.panel.getSelectedMapId() ? Types.UiState.Down : Types.UiState.Up;
            WarMapModel.getMapNameInCurrentLanguage(data.mapId).then(v => this._labelName.text = v);
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            data.panel.setSelectedMapId(data.mapId);
        }

        private async _onTouchTapBtnNext(e: egret.TouchEvent): Promise<void> {
            ScrCreateMapListPanel.hide();

            await ScrModel.resetCreateWarData((this.data as DataForMapNameRenderer).mapId);
            ScrCreateSettingsPanel.show();
        }
    }
}
