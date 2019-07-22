
namespace TinyWars.MultiCustomRoom {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import WarMapModel  = WarMap.WarMapModel;

    export class McrCreateMapListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrCreateMapListPanel;

        private _listMap   : GameUi.UiScrollList;
        private _zoomMap   : GameUi.UiZoomableComponent;
        private _btnSearch : GameUi.UiButton;
        private _btnBack   : GameUi.UiButton;

        private _groupInfo          : eui.Group;
        private _labelMapName       : GameUi.UiLabel;
        private _labelDesigner      : GameUi.UiLabel;
        private _labelRating        : GameUi.UiLabel;
        private _labelPlayedTimes   : GameUi.UiLabel;
        private _labelPlayersCount  : GameUi.UiLabel;

        private _dataForList        : DataForMapNameRenderer[] = [];
        private _selectedIndex      : number;

        public static show(): void {
            if (!McrCreateMapListPanel._instance) {
                McrCreateMapListPanel._instance = new McrCreateMapListPanel();
            }
            McrCreateMapListPanel._instance.open();
        }
        public static hide(): void {
            if (McrCreateMapListPanel._instance) {
                McrCreateMapListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrCreateMapListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.SGetNewestMapInfos, callback: this._onNotifySGetNewestMapInfos },
            ];
            this._uiListeners = [
                { ui: this._btnSearch, callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listMap.setItemRenderer(MapNameRenderer);
        }
        protected _onOpened(): void {
            this._groupInfo.visible = false;
            this._zoomMap.setMouseWheelListenerEnabled(true);
            this._zoomMap.setTouchListenerEnabled(true);
            this._listMap.bindData(this._dataForList);
            this.setSelectedIndex(this._selectedIndex);
        }
        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._zoomMap.setMouseWheelListenerEnabled(false);
            this._zoomMap.setTouchListenerEnabled(false);
            this._listMap.clear();
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const datas = this._dataForList;
            if (datas.length <= 0) {
                this._selectedIndex = undefined;
            } else if (datas[newIndex]) {
                const oldIndex      = this._selectedIndex;
                this._selectedIndex = newIndex;
                (datas[oldIndex])       && (this._listMap.updateSingleData(oldIndex, datas[oldIndex]));
                (oldIndex !== newIndex) && (this._listMap.updateSingleData(newIndex, datas[newIndex]));

                await this._showMap(datas[newIndex]);
            }
        }
        public getSelectedIndex(): number {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifySGetNewestMapInfos(e: egret.Event): void {
            const newData = this._createDataForListMap();
            if (newData.length > 0) {
                this._dataForList = newData;
                this._listMap.bindData(newData);
                this.setSelectedIndex(Math.floor(Math.random() * newData.length));
            }
        }

        private _onTouchTapBtnSearch(e: egret.TouchEvent): void {
            WarMap.WarMapSearchPanel.show();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrCreateMapListPanel.hide();
            McrMainMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListMap(): DataForMapNameRenderer[] {
            const data: DataForMapNameRenderer[] = [];
            const infos = WarMapModel.getNewestMapInfos();
            if (infos.mapInfos) {
                for (let i = 0; i < infos.mapInfos.length; ++i) {
                    const info = infos.mapInfos[i];
                    data.push({
                        mapName     : info.mapName,
                        mapDesigner : info.mapDesigner,
                        mapVersion  : info.mapVersion,
                        index       : i,
                        panel       : this,
                    });
                }
            }
            return data;
        }

        private _createUnitViewDatas(unitViewIds: number[], mapWidth: number, mapHeight: number): Types.UnitViewData[] {
            const configVersion = ConfigManager.getNewestConfigVersion();
            const datas: Types.UnitViewData[] = [];

            let index  = 0;
            for (let y = 0; y < mapHeight; ++y) {
                for (let x = 0; x < mapWidth; ++x) {
                    const viewId = unitViewIds[index];
                    ++index;
                    if (viewId > 0) {
                        datas.push({
                            configVersion: configVersion,
                            gridX        : x,
                            gridY        : y,
                            viewId       : viewId,
                        });
                    }
                }
            }
            return datas;
        }

        private async _showMap(key: Types.MapIndexKey): Promise<void> {
            const [mapData, mapInfo]        = await Promise.all([WarMapModel.getMapData(key), WarMapModel.getMapDynamicInfoAsync(key)]);
            this._labelMapName.text         = Lang.getFormatedText(Lang.Type.F0000, mapData.mapName);
            this._labelDesigner.text        = Lang.getFormatedText(Lang.Type.F0001, mapData.mapDesigner);
            this._labelPlayersCount.text    = Lang.getFormatedText(Lang.Type.F0002, mapData.playersCount);
            this._labelRating.text          = Lang.getFormatedText(Lang.Type.F0003, mapInfo.rating != null ? mapInfo.rating.toFixed(2) : Lang.getText(Lang.Type.B0001));
            this._labelPlayedTimes.text     = Lang.getFormatedText(Lang.Type.F0004, mapInfo.mcwPlayedTimes + mapInfo.rankPlayedTimes);
            this._groupInfo.visible         = true;
            this._groupInfo.alpha           = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(5000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new WarMap.WarMapTileMapView();
            tileMapView.init(mapData.mapWidth, mapData.mapHeight);
            tileMapView.updateWithBaseViewIdArray(mapData.tileBases);
            tileMapView.updateWithObjectViewIdArray(mapData.tileObjects);

            const unitMapView = new WarMap.WarMapUnitMapView();
            unitMapView.initWithDatas(this._createUnitViewDatas(mapData.units, mapData.mapWidth, mapData.mapHeight));

            const gridSize = ConfigManager.getGridSize();
            this._zoomMap.removeAllContents();
            this._zoomMap.setContentWidth(mapData.mapWidth * gridSize.width);
            this._zoomMap.setContentHeight(mapData.mapHeight * gridSize.height);
            this._zoomMap.addContent(tileMapView);
            this._zoomMap.addContent(unitMapView);
            this._zoomMap.setContentScale(0, true);
        }
    }

    type DataForMapNameRenderer = {
        mapName     : string;
        mapDesigner : string;
        mapVersion  : number;
        index       : number;
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

            const data = this.data as DataForMapNameRenderer;
            this.currentState    = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text = data.mapName;
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            McrCreateMapListPanel.hide();

            McrModel.resetCreateWarData(this.data as DataForMapNameRenderer);
            McrCreateSettingsPanel.show();
        }
    }
}
