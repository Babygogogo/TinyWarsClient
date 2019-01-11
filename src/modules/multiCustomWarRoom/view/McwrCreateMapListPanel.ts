
namespace TinyWars.MultiCustomWarRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import StageManager     = Utility.StageManager;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import TemplateMapModel = WarMap.WarMapModel;
    import TemplateMapProxy = WarMap.WarMapProxy;

    export class McwrCreateMapListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McwrCreateMapListPanel;

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

        private _currentTouchPoints : Types.TouchPoints = {};
        private _previousTouchPoints: Types.TouchPoints = {};
        private _dataForList        : DataForMapNameRenderer[] = [];
        private _selectedIndex      : number;

        public static show(): void {
            if (!McwrCreateMapListPanel._instance) {
                McwrCreateMapListPanel._instance = new McwrCreateMapListPanel();
            }
            McwrCreateMapListPanel._instance.open();
        }
        public static hide(): void {
            if (McwrCreateMapListPanel._instance) {
                McwrCreateMapListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomWarRoom/McwrCreateMapListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.MouseWheel,         callback: this._onNotifyMouseWheel },
                { type: Notify.Type.SGetNewestMapInfos, callback: this._onNotifySGetNewestMapInfos },
            ];
            this._uiListeners = [
                { ui: this._zoomMap,   callback: this._onTouchBeginZoomMap, eventType: egret.TouchEvent.TOUCH_BEGIN },
                { ui: this._zoomMap,   callback: this._onTouchEndZoomMap,   eventType: egret.TouchEvent.TOUCH_END },
                { ui: this._btnSearch, callback: this._onTouchTapBtnSearch },
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ];
            this._listMap.setItemRenderer(MapNameRenderer);
        }
        protected _onOpened(): void {
            this._groupInfo.visible = false;
            this._listMap.bindData(this._dataForList);
            this.setSelectedIndex(this._selectedIndex);
        }
        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
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
        private _onNotifyMouseWheel(e: egret.Event): void {
            this._zoomMap.setZoomByScroll(StageManager.getMouseX(), StageManager.getMouseY(), e.data);
        }

        private _onNotifySGetNewestMapInfos(e: egret.Event): void {
            const newData = this._createDataForListMap();
            if (newData.length > 0) {
                this._dataForList = newData;
                this._listMap.bindData(newData);
                this.setSelectedIndex(Math.floor(Math.random() * newData.length));
            }
        }

        private _onTouchBeginZoomMap(e: egret.TouchEvent): void {
            const touchesCount = Helpers.getObjectKeysCount(this._currentTouchPoints);
            if (touchesCount <= 0) {
                this._zoomMap.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMoveZoomMap, this);
            }

            const touchId = e.touchPointID;
            if (touchesCount <= 1) {
                this._currentTouchPoints[touchId]  = { x: e.stageX, y: e.stageY };
                this._previousTouchPoints[touchId] = { x: e.stageX, y: e.stageY };
            }
        }

        private _onTouchEndZoomMap(e: egret.TouchEvent): void {
            delete this._currentTouchPoints[e.touchPointID];
            delete this._previousTouchPoints[e.touchPointID];

            if (Helpers.checkIsEmptyObject(this._currentTouchPoints)) {
                this._zoomMap.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMoveZoomMap, this);
            }
        }

        private _onTouchMoveZoomMap(e: egret.TouchEvent): void {
            const touchId = e.touchPointID;
            this._currentTouchPoints[touchId] = { x: e.stageX, y: e.stageY };

            if (Helpers.getObjectKeysCount(this._currentTouchPoints) > 1) {
                this._zoomMap.setZoomByTouches(this._currentTouchPoints, this._previousTouchPoints);
            } else {
                const zoomMap = this._zoomMap;
                zoomMap.setContentX(zoomMap.getContentX() + e.stageX - this._previousTouchPoints[touchId].x, true);
                zoomMap.setContentY(zoomMap.getContentY() + e.stageY - this._previousTouchPoints[touchId].y, true);
            }

            this._previousTouchPoints[touchId] = { x: e.stageX, y: e.stageY };
        }

        private _onTouchTapBtnSearch(e: egret.TouchEvent): void {
            WarMap.WarMapSearchPanel.show();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McwrCreateMapListPanel.hide();
            Lobby.LobbyPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListMap(): DataForMapNameRenderer[] {
            const data: DataForMapNameRenderer[] = [];
            const infos = TemplateMapModel.getNewestMapInfos();
            if (infos.mapInfos) {
                for (let i = 0; i < infos.mapInfos.length; ++i) {
                    const info = infos.mapInfos[i];
                    data.push({
                        mapName     : info.mapName,
                        mapDesigner : info.mapDesigner,
                        mapVersion     : info.mapVersion,
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
            let unitId = 0;
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
                            unitId       : unitId,
                        });
                        ++unitId;
                    }
                }
            }
            return datas;
        }

        private async _showMap(key: Types.MapIndexKey): Promise<void> {
            const data    = await TemplateMapModel.getMapData(key);
            const mapInfo = TemplateMapModel.getMapInfo(key);
            this._labelMapName.text      = Lang.getFormatedText(Lang.FormatType.F000, mapInfo.mapName);
            this._labelDesigner.text     = Lang.getFormatedText(Lang.FormatType.F001, mapInfo.mapDesigner);
            this._labelPlayersCount.text = Lang.getFormatedText(Lang.FormatType.F002, mapInfo.playersCount);
            this._labelRating.text       = Lang.getFormatedText(Lang.FormatType.F003, mapInfo.rating != null ? mapInfo.rating.toFixed(2) : Lang.getText(Lang.BigType.B01, Lang.SubType.S01));
            this._labelPlayedTimes.text  = Lang.getFormatedText(Lang.FormatType.F004, mapInfo.playedTimes);
            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(5000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new MultiCustomWar.TileMapView();
            tileMapView.init(data.mapWidth, data.mapHeight);
            tileMapView.updateWithBaseViewIdArray(data.tileBases);
            tileMapView.updateWithObjectViewIdArray(data.tileObjects);

            const unitMapView = new MultiCustomWar.UnitMapView();
            unitMapView.initWithDatas(this._createUnitViewDatas(data.units, data.mapWidth, data.mapHeight));

            const gridSize = ConfigManager.getGridSize();
            this._zoomMap.removeAllContents();
            this._zoomMap.setContentWidth(data.mapWidth * gridSize.width);
            this._zoomMap.setContentHeight(data.mapHeight * gridSize.height);
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
        panel       : McwrCreateMapListPanel;
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
            McwrCreateMapListPanel.hide();

            McwrModel.resetCreateWarData(this.data as DataForMapNameRenderer);
            McwrCreateSettingsPanel.show();
        }
    }
}
