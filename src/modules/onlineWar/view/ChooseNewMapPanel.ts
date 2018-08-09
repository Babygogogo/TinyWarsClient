
namespace OnlineWar {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import StageManager = Utility.StageManager;
    import MapManager   = Utility.MapManager;
    import FloatText    = Utility.FloatText;

    export class ChooseNewMapPanel extends GameUi.UiPanel {
        protected readonly _layerType   = Utility.Types.LayerType.Scene;
        protected readonly _isExclusive = true;

        private static _instance: ChooseNewMapPanel;

        private _listMap: GameUi.UiScrollList;
        private _zoomMap: GameUi.UiZoomableComponent;
        private _btnBack: GameUi.UiButton;

        private _touchOffsetX: number;
        private _touchOffsetY: number;

        public static open(): void {
            if (!ChooseNewMapPanel._instance) {
                ChooseNewMapPanel._instance = new ChooseNewMapPanel();
            }
            ChooseNewMapPanel._instance.open();
        }

        public static close(): void {
            if (ChooseNewMapPanel._instance) {
                ChooseNewMapPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/onlineWar/ChooseNewMapPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { name: Notify.Type.MouseWheel, callback: this._onNotifyMouseWheel },
            ];
            this._uiListeners = [
                { ui: this._zoomMap, callback: this._onTouchBeginZoomMap, eventType: egret.TouchEvent.TOUCH_BEGIN },
                { ui: this._zoomMap, callback: this._onTouchEndZoomMap,   eventType: egret.TouchEvent.TOUCH_END },
                { ui: this._btnBack, callback: this._onTouchTapBtnBack },
            ];
            this._listMap.setItemRenderer(MapNameRenderer);
        }

        protected _onOpened(): void {
            this._listMap.bindData(this._createDataForListMap());
        }

        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._listMap.clear();
        }

        public showMap(fileName: string): void {
            Utility.FloatText.show(fileName);
            MapManager.getMapData(fileName, (data: Types.TemplateMap, url: string) => {
                Utility.FloatText.show("succeed!");
                const tileMapView = new TileMapView();
                tileMapView.init(data.mapWidth, data.mapHeight);
                tileMapView.updateWithBaseViewIdArray(data.tileBases);
                tileMapView.updateWithObjectViewIdArray(data.tileObjects);

                const gridSize = Config.getGridSize();
                this._zoomMap.removeAllContents();
                this._zoomMap.setContentWidth(data.mapWidth * gridSize.width);
                this._zoomMap.setContentHeight(data.mapHeight * gridSize.height);
                this._zoomMap.addContent(tileMapView);
                this._zoomMap.setContentScale(0, true);
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMouseWheel(e: egret.Event): void {
            this._zoomMap.setZoomByScroll(StageManager.getMouseX(), StageManager.getMouseY(), e.data);
        }

        private _onTouchBeginZoomMap(e: egret.TouchEvent): void {
            this._touchOffsetX = e.stageX - this._zoomMap.getContentX();
            this._touchOffsetY = e.stageY - this._zoomMap.getContentY();

            this._zoomMap.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMoveZoomMap, this);
        }

        private _onTouchEndZoomMap(e: egret.TouchEvent): void {
            this._zoomMap.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMoveZoomMap, this);
        }

        private _onTouchMoveZoomMap(e: egret.TouchEvent): void {
            this._zoomMap.setContentX(e.stageX - this._touchOffsetX, true);
            this._zoomMap.setContentY(e.stageY - this._touchOffsetY, true);
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            ChooseNewMapPanel.close();
            Lobby.LobbyPanel.open();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListMap(): DataForMapNameRenderer[] {
            const mapList = MapManager.getAllMapList();
            const data: DataForMapNameRenderer[] = [];
            for (const fileName in mapList) {
                data.push({
                    fileName: fileName,
                    mapName : mapList[fileName].mapName,
                    panel   : this,
                });
            }
            return data;
        }
    }

    type DataForMapNameRenderer = {
        fileName: string;
        mapName : string;
        panel   : ChooseNewMapPanel;
    }

    class MapNameRenderer extends eui.ItemRenderer {
        private _btnName: GameUi.UiButton;
        private _btnNext: GameUi.UiButton;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnName.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnName, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data as DataForMapNameRenderer;
            this._btnName.label = data.mapName;
        }

        private _onTouchTapBtnName(e: egret.TouchEvent): void {
            const data = this.data as DataForMapNameRenderer;
            data.panel.showMap(data.fileName);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            FloatText.show("下一步？不存在的");
        }
    }
}
