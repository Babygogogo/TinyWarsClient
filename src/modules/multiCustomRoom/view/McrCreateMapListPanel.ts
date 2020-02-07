
namespace TinyWars.MultiCustomRoom {
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

    export class McrCreateMapListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrCreateMapListPanel;

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
        private _selectedMapFileName: string;

        public static show(mapFilters?: FiltersForMapList): void {
            if (!McrCreateMapListPanel._instance) {
                McrCreateMapListPanel._instance = new McrCreateMapListPanel();
            }

            (mapFilters) && (McrCreateMapListPanel._instance._mapFilters = mapFilters);
            McrCreateMapListPanel._instance.open();
        }
        public static hide(): void {
            if (McrCreateMapListPanel._instance) {
                McrCreateMapListPanel._instance.close();
            }
        }
        public static getInstance(): McrCreateMapListPanel {
            return McrCreateMapListPanel._instance;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrCreateMapListPanel.exml";
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

        public async setSelectedMapFileName(newMapFileName: string): Promise<void> {
            const dataList = this._dataForList;
            if (dataList.length <= 0) {
                this._selectedMapFileName = null;
            } else {
                const index                 = dataList.findIndex(data => data.mapFileName === newMapFileName);
                const newIndex              = index >= 0 ? index : Math.floor(Math.random() * dataList.length);
                const oldIndex              = dataList.findIndex(data => data.mapFileName === this._selectedMapFileName);
                this._selectedMapFileName   = dataList[newIndex].mapFileName;
                (dataList[oldIndex])    && (this._listMap.updateSingleData(oldIndex, dataList[oldIndex]));
                (oldIndex !== newIndex) && (this._listMap.updateSingleData(newIndex, dataList[newIndex]));

                await this._showMap(dataList[newIndex].mapFileName);
            }
        }
        public getSelectedMapFileName(): string {
            return this._selectedMapFileName;
        }

        public setMapFilters(mapFilters: FiltersForMapList): void {
            this._mapFilters            = mapFilters;
            this._dataForList           = this._createDataForListMap();

            const length                = this._dataForList.length;
            this._labelNoMap.visible    = length <= 0;
            this._listMap.bindData(this._dataForList);
            this.setSelectedMapFileName(this._selectedMapFileName);

            if (length) {
                for (let index = 0; index < length; ++index) {
                    if (this._dataForList[index].mapFileName === this._selectedMapFileName) {
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
            McrCreateSearchMapPanel.show();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrCreateMapListPanel.hide();
            McrMainMenuPanel.show();
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

        private _createDataForListMap(): DataForMapNameRenderer[] {
            const data: DataForMapNameRenderer[] = [];
            let { mapName, mapDesigner, playersCount, playedTimes, minRating } = this._mapFilters;
            (mapName)       && (mapName     = mapName.toLowerCase());
            (mapDesigner)   && (mapDesigner = mapDesigner.toLowerCase());

            for (const [mapFileName, extraData] of WarMapModel.getExtraDataDict()) {
                const name = Lang.getLanguageType() === Types.LanguageType.Chinese ? extraData.mapName : extraData.mapNameEnglish;
                if ((extraData.isDeleted)                                                               ||
                    (!extraData.canMcw)                                                                 ||
                    ((mapName) && (name.toLowerCase().indexOf(mapName) < 0))                            ||
                    ((mapDesigner) && (extraData.mapDesigner.toLowerCase().indexOf(mapDesigner) < 0))   ||
                    ((playersCount) && (extraData.playersCount !== playersCount))                       ||
                    ((playedTimes != null) && (extraData.mcwPlayedTimes < playedTimes))                 ||
                    ((minRating != null) && (extraData.rating < minRating))
                ) {
                    continue;
                } else {
                    data.push({
                        mapFileName,
                        mapName : name,
                        panel   : this,
                    });
                }
            }

            data.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
            return data;
        }

        private async _showMap(mapFileName: string): Promise<void> {
            const mapRawData                = await WarMapModel.getMapRawData(mapFileName);
            const mapExtraData              = await WarMapModel.getExtraData(mapFileName);
            this._labelMapName.text         = Lang.getFormatedText(Lang.Type.F0000, await WarMapModel.getMapNameInLanguage(mapFileName));
            this._labelDesigner.text        = Lang.getFormatedText(Lang.Type.F0001, mapRawData.mapDesigner);
            this._labelPlayersCount.text    = Lang.getFormatedText(Lang.Type.F0002, mapRawData.playersCount);
            this._labelRating.text          = Lang.getFormatedText(Lang.Type.F0003, mapExtraData.rating != null ? mapExtraData.rating.toFixed(2) : Lang.getText(Lang.Type.B0001));
            this._labelPlayedTimes.text     = Lang.getFormatedText(Lang.Type.F0004, mapExtraData.mcwPlayedTimes + mapExtraData.rankPlayedTimes);
            this._groupInfo.visible         = true;
            this._groupInfo.alpha           = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(5000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new WarMap.WarMapTileMapView();
            tileMapView.init(mapRawData.mapWidth, mapRawData.mapHeight);
            tileMapView.updateWithBaseViewIdArray(mapRawData.tileBases);
            tileMapView.updateWithObjectViewIdArray(mapRawData.tileObjects);

            const unitMapView = new WarMap.WarMapUnitMapView();
            unitMapView.initWithMapRawData(mapRawData);

            const gridSize = ConfigManager.getGridSize();
            this._zoomMap.removeAllContents();
            this._zoomMap.setContentWidth(mapRawData.mapWidth * gridSize.width);
            this._zoomMap.setContentHeight(mapRawData.mapHeight * gridSize.height);
            this._zoomMap.addContent(tileMapView);
            this._zoomMap.addContent(unitMapView);
            this._zoomMap.setContentScale(0, true);
        }
    }

    type DataForMapNameRenderer = {
        mapFileName : string;
        mapName     : string;
        panel       : McrCreateMapListPanel;
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
            this.currentState   = data.mapFileName === data.panel.getSelectedMapFileName() ? Types.UiState.Down : Types.UiState.Up;
            WarMapModel.getMapNameInLanguage(data.mapFileName).then(v => this._labelName.text = v);
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            data.panel.setSelectedMapFileName(data.mapFileName);
        }

        private async _onTouchTapBtnNext(e: egret.TouchEvent): Promise<void> {
            McrCreateMapListPanel.hide();

            await McrModel.resetCreateWarData((this.data as DataForMapNameRenderer).mapFileName);
            McrCreateSettingsPanel.show();
        }
    }
}
