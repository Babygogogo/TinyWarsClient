
namespace TinyWars.MapEditor {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import IMapEditorData   = ProtoTypes.Map.IMapEditorData;

    export class MeMapListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MeMapListPanel;

        private _zoomMap        : GameUi.UiZoomableComponent;
        private _labelNoData    : GameUi.UiLabel;
        private _labelMenuTitle : GameUi.UiLabel;
        private _labelLoading   : GameUi.UiLabel;
        private _listMap        : GameUi.UiScrollList;
        private _btnBack        : GameUi.UiButton;

        private _dataForListMap     : DataForMapRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!MeMapListPanel._instance) {
                MeMapListPanel._instance = new MeMapListPanel();
            }
            MeMapListPanel._instance.open();
        }
        public static hide(): void {
            if (MeMapListPanel._instance) {
                MeMapListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/mapEditor/MeMapListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMeGetDataList,     callback: this._onNotifySMeGetDataList },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listMap.setItemRenderer(MapRenderer);
        }

        protected _onOpened(): void {
            this._zoomMap.setMouseWheelListenerEnabled(true);
            this._zoomMap.setTouchListenerEnabled(true);

            this._updateComponentsForLanguage();
            this._labelLoading.visible = true;

            MeProxy.reqMeGetMapDataList();
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
        private _onNotifySMeGetDataList(e: egret.Event): void {
            const newData               = this._createDataForListMap(MeModel.getDataDict());
            this._dataForListMap        = newData;
            this._labelLoading.visible  = false;

            if (newData.length > 0) {
                this._listMap.bindData(newData);
            } else {
                this._listMap.clear();
            }
            this.setSelectedIndex(0);
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            Lobby.LobbyPanel.show();
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

        private _createDataForListMap(dict: Map<number, IMapEditorData>): DataForMapRenderer[] {
            const dataList: DataForMapRenderer[] = [];

            let index = 0;
            for (const [slotIndex, info] of dict) {
                dataList.push({
                    index,
                    panel   : this,
                    mapData : info,
                });
                ++index;
            }

            return dataList;
        }

        private async _showMap(index: number): Promise<void> {
            const mapData = this._dataForListMap[index].mapData.mapRawData;
            if (!mapData) {
                this._labelNoData.visible = true;
                this._zoomMap.removeAllContents();

            } else {
                this._labelNoData.visible = false;

                const tileMapView = new WarMap.WarMapTileMapView();
                tileMapView.init(mapData.mapWidth, mapData.mapHeight);
                tileMapView.updateWithTileDataList(mapData.tileDataList);

                const unitMapView = new WarMap.WarMapUnitMapView();
                unitMapView.initWithMapRawData(mapData);

                const gridSize = Utility.ConfigManager.getGridSize();
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
        mapData : IMapEditorData;
        panel   : MeMapListPanel;
    }

    class MapRenderer extends GameUi.UiListItemRenderer {
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
            this._labelName.text        = Lang.getTextInLanguage(mapRawData ? mapRawData.mapNameList : []) || `(${Lang.getText(Lang.Type.B0277)})`;
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForMapRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data          = this.data as DataForMapRenderer;
            const mapData       = data.mapData;
            const reviewStatus  = mapData.reviewStatus;

            if (reviewStatus === Types.MapReviewStatus.Rejected) {
                Common.CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0305),
                    content : mapData.reviewComment || Lang.getText(Lang.Type.B0001),
                    callback: () => {
                        Utility.FlowManager.gotoMapEditor(mapData.mapRawData, mapData.slotIndex, false);
                    },
                });
            } else if (reviewStatus === Types.MapReviewStatus.Accepted) {
                Common.CommonAlertPanel.show({
                    title   : Lang.getText(Lang.Type.B0326),
                    content : mapData.reviewComment || Lang.getText(Lang.Type.B0001),
                    callback: () => {
                        Utility.FlowManager.gotoMapEditor(mapData.mapRawData, mapData.slotIndex, false);
                    },
                });
            } else {
                Utility.FlowManager.gotoMapEditor(mapData.mapRawData, mapData.slotIndex, false);
            }
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
