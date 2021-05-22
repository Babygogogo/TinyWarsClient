
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import Helpers          = Utility.Helpers;
    import WarMapModel      = WarMap.WarMapModel;
    import IDataForMapTag   = ProtoTypes.Map.IDataForMapTag;

    type FiltersForMapList = {
        mapName?        : string;
        mapDesigner?    : string;
        playersCount?   : number;
        playedTimes?    : number;
        minRating?      : number;
        mapTag?         : IDataForMapTag;
    }

    export class McrCreateMapListPanel extends GameUi.UiPanel<FiltersForMapList> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrCreateMapListPanel;

        private readonly _groupMapView          : eui.Group;
        private readonly _zoomMap               : GameUi.UiZoomableMap;
        private readonly _labelLoading          : GameUi.UiLabel;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : GameUi.UiLabel;
        private readonly _labelCreateRoom       : GameUi.UiLabel;
        private readonly _labelChooseMap        : GameUi.UiLabel;

        private readonly _btnBack               : GameUi.UiButton;
        private readonly _btnSearch             : GameUi.UiButton;
        private readonly _btnMapInfo            : GameUi.UiButton;
        private readonly _btnNextStep           : GameUi.UiButton;

        private readonly _groupMapList          : eui.Group;
        private readonly _listMap               : GameUi.UiScrollList<DataForMapNameRenderer>;
        private readonly _labelNoMap            : GameUi.UiLabel;

        private readonly _uiMapInfo             : GameUi.UiMapInfo;

        private _mapFilters         : FiltersForMapList = {};
        private _dataForList        : DataForMapNameRenderer[] = [];
        private _selectedMapId      : number;

        public static show(mapFilters?: FiltersForMapList): void {
            if (!McrCreateMapListPanel._instance) {
                McrCreateMapListPanel._instance = new McrCreateMapListPanel();
            }

            McrCreateMapListPanel._instance.open(mapFilters);
        }
        public static async hide(): Promise<void> {
            if (McrCreateMapListPanel._instance) {
                await McrCreateMapListPanel._instance.close();
            }
        }
        public static getInstance(): McrCreateMapListPanel {
            return McrCreateMapListPanel._instance;
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateMapListPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnSearch,      callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            McrCreateSearchMapPanel.show();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            McrMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
        }

        private async _onTouchedBtnNextStep(e: egret.TouchEvent): Promise<void> {
            const selectedMapId = this.getSelectedMapId();
            if (selectedMapId != null) {
                this.close();
                await McrModel.Create.resetDataByMapId(selectedMapId);
                McrCreateSettingsPanel.show();
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelCreateRoom.text          = Lang.getText(Lang.Type.B0000);
            this._labelMultiPlayer.text         = Lang.getText(Lang.Type.B0137);
            this._labelChooseMap.text           = Lang.getText(Lang.Type.B0227);
            this._labelLoading.text             = Lang.getText(Lang.Type.A0150);
            this._btnBack.label                 = Lang.getText(Lang.Type.B0146);
            this._btnSearch.label               = Lang.getText(Lang.Type.B0228);
            this._btnMapInfo.label              = Lang.getText(Lang.Type.B0298);
            this._btnNextStep.label             = Lang.getText(Lang.Type.B0566);
        }

        private async _createDataForListMap(): Promise<DataForMapNameRenderer[]> {
            const data: DataForMapNameRenderer[] = [];
            let { mapName, mapDesigner, playersCount, playedTimes, minRating } = this._mapFilters;
            const filterTag = this._mapFilters.mapTag || {};
            (mapName)       && (mapName     = mapName.toLowerCase());
            (mapDesigner)   && (mapDesigner = mapDesigner.toLowerCase());

            for (const [mapId, mapBriefData] of WarMapModel.getBriefDataDict()) {
                const mapExtraData  = mapBriefData.mapExtraData;
                const mapTag        = mapBriefData.mapTag || {};
                const realMapName   = await WarMapModel.getMapNameInCurrentLanguage(mapId);
                const rating        = await WarMapModel.getAverageRating(mapId);
                if ((!mapExtraData.isEnabled)                                                                           ||
                    (!mapExtraData.mapComplexInfo.availability.canMcw)                                                  ||
                    ((mapName) && (realMapName.toLowerCase().indexOf(mapName) < 0))                                     ||
                    ((mapDesigner) && (mapBriefData.designerName.toLowerCase().indexOf(mapDesigner) < 0))               ||
                    ((playersCount) && (mapBriefData.playersCountUnneutral !== playersCount))                           ||
                    ((playedTimes != null) && (await WarMapModel.getMultiPlayerTotalPlayedTimes(mapId) < playedTimes))  ||
                    ((minRating != null) && ((rating == null) || (rating < minRating)))                                 ||
                    ((filterTag.fog != null) && ((!!mapTag.fog) !== filterTag.fog))
                ) {
                    continue;
                } else {
                    data.push({
                        mapId,
                        mapName : realMapName,
                        panel   : this,
                    });
                }
            }

            return data.sort((a, b) => a.mapName.localeCompare(b.mapName, "zh"));
        }

        private async _showMap(mapId: number): Promise<void> {
            const mapRawData = await WarMapModel.getRawData(mapId);
            this._zoomMap.showMapByMapData(mapRawData);
            this._uiMapInfo.setData({
                mapInfo: {
                    mapId,
                    configVersion   : ConfigManager.getLatestFormalVersion(),
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
        panel   : McrCreateMapListPanel;
    }

    class MapNameRenderer extends GameUi.UiListItemRenderer<DataForMapNameRenderer> {
        private _btnChoose: GameUi.UiButton;
        private _btnNext  : GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

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

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data;
            data.panel.setSelectedMapId(data.mapId);
        }

        private async _onTouchTapBtnNext(e: egret.TouchEvent): Promise<void> {
            const data = this.data;
            data.panel.close();
            await McrModel.Create.resetDataByMapId(data.mapId);
            McrCreateSettingsPanel.show();
        }
    }
}
