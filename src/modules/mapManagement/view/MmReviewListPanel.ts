
namespace TinyWars.MapManagement {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import FloatText    = Utility.FloatText;
    import Helpers      = Utility.Helpers;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import WarMapModel  = WarMap.WarMapModel;
    import WarMapProxy  = WarMap.WarMapProxy;

    export class MmReviewListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmReviewListPanel;

        private _zoomMap        : GameUi.UiZoomableComponent;
        private _labelNoData    : GameUi.UiLabel;
        private _labelMenuTitle : GameUi.UiLabel;
        private _labelLoading   : GameUi.UiLabel;
        private _listMap        : GameUi.UiScrollList;
        private _btnBack        : GameUi.UiButton;

        private _dataForListMap     : DataForMapRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!MmReviewListPanel._instance) {
                MmReviewListPanel._instance = new MmReviewListPanel();
            }
            MmReviewListPanel._instance.open();
        }
        public static hide(): void {
            if (MmReviewListPanel._instance) {
                MmReviewListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/mapManagement/MmReviewListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.SMmGetReviewingMaps,    callback: this._onNotifySMmGetReviewingMaps },
            ];
            this._uiListeners = [
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listMap.setItemRenderer(MapRenderer);
        }

        protected _onOpened(): void {
            this._zoomMap.setMouseWheelListenerEnabled(true);
            this._zoomMap.setTouchListenerEnabled(true);

            this._updateComponentsForLanguage();
            this._labelLoading.visible  = true;
            this._labelNoData.visible   = false;

            WarMapProxy.reqMmGetReviewingMaps();
        }

        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._zoomMap.setMouseWheelListenerEnabled(false);
            this._zoomMap.setTouchListenerEnabled(false);

            this._listMap.clear();
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const oldIndex         = this._selectedWarIndex;
            const dataList         = this._dataForListMap;
            this._selectedWarIndex = dataList[newIndex] ? newIndex : undefined;

            if (dataList[oldIndex]) {
                this._listMap.updateSingleData(oldIndex, dataList[oldIndex])
            };

            if (dataList[newIndex]) {
                this._listMap.updateSingleData(newIndex, dataList[newIndex]);
                await this._showMap(newIndex);
            } else {
                this._zoomMap.removeAllContents();
            }
        }
        public getSelectedIndex(): number {
            return this._selectedWarIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifySMmGetReviewingMaps(e: egret.Event): void {
            const newData               = this._createDataForListMap(WarMapModel.getMmReviewingMaps());
            this._dataForListMap        = newData;
            this._labelLoading.visible  = false;

            if (newData.length > 0) {
                this._labelNoData.visible = false;
                this._listMap.bindData(newData);
            } else {
                this._labelNoData.visible = true;
                this._listMap.clear();
            }
            this.setSelectedIndex(0);
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            MmMainMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelNoData.text      = Lang.getText(Lang.Type.B0278);
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0272);
            this._labelLoading.text     = Lang.getText(Lang.Type.A0078);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
        }

        private _createDataForListMap(rawDataList: ProtoTypes.IMapEditorData[] | null): DataForMapRenderer[] {
            const dataList: DataForMapRenderer[] = [];

            let index = 0;
            for (const data of rawDataList || []) {
                dataList.push({
                    index,
                    panel   : this,
                    mapData : data,
                });
                ++index;
            }

            return dataList;
        }

        private async _showMap(index: number): Promise<void> {
            const mapData = this._dataForListMap[index].mapData.mapRawData;
            if (!mapData) {
                this._zoomMap.removeAllContents();

            } else {
                const tileMapView = new WarMap.WarMapTileMapView();
                tileMapView.init(mapData.mapWidth, mapData.mapHeight);
                tileMapView.updateWithBaseViewIdArray(mapData.tileBases);
                tileMapView.updateWithObjectViewIdArray(mapData.tileObjects);

                const unitMapView = new WarMap.WarMapUnitMapView();
                unitMapView.initWithMapRawData(mapData);

                const gridSize = ConfigManager.getGridSize();
                this._zoomMap.removeAllContents();
                this._zoomMap.setContentWidth(mapData.mapWidth * gridSize.width);
                this._zoomMap.setContentHeight(mapData.mapHeight * gridSize.height);
                this._zoomMap.addContent(tileMapView);
                this._zoomMap.addContent(unitMapView);
                this._zoomMap.setContentScale(0, true);
            }
        }
    }

    type DataForMapRenderer = {
        index   : number;
        mapData : ProtoTypes.IMapEditorData;
        panel   : MmReviewListPanel;
    }

    class MapRenderer extends eui.ItemRenderer {
        private _btnChoose      : GameUi.UiButton;
        private _labelName      : GameUi.UiLabel;
        private _labelStatus    : GameUi.UiLabel;
        private _btnNext        : GameUi.UiButton;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForMapRenderer;
            const mapData               = data.mapData;
            const mapRawData            = mapData.mapRawData;
            const status                = mapData.reviewStatus;
            this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelStatus.text      = Lang.getMapReviewStatusText(status);
            this._labelStatus.textColor = getReviewStatusTextColor(status);
            this._labelName.text        = (mapRawData ? mapRawData.mapName : null) || `(${Lang.getText(Lang.Type.B0277)})`;
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForMapRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data = (this.data as DataForMapRenderer).mapData;
            Utility.FlowManager.gotoMapEditor(data.mapRawData as Types.MapRawData, data.slotIndex, true);
        }
    }

    function getReviewStatusTextColor(status: Types.MapReviewStatus): number {
        switch (status) {
            case Types.MapReviewStatus.None     : return 0xffffff;
            case Types.MapReviewStatus.Reviewing: return 0xffff00;
            case Types.MapReviewStatus.Rejected : return 0xff0000;
            case Types.MapReviewStatus.Accepted : return 0x00ff00;
            default                             : return 0xffffff;
        }
    }
}
