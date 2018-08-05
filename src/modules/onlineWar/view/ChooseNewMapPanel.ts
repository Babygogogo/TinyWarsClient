
namespace OnlineWar {
    import Notify       = Utility.Notify;
    import StageManager = Utility.StageManager;
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
            const tileMapView = new TileMapView();
            const rows = 20;
            const cols = 20;
            const gridSize = Config.getGridSize();
            tileMapView.init(rows, cols);

            this._zoomMap.setContentWidth(cols * gridSize.width);
            this._zoomMap.setContentHeight(rows * gridSize.height);
            this._zoomMap.addContent(tileMapView);
        }

        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
        }

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
    }

    class MapNameRenderer extends eui.ItemRenderer {
        private _labelName: GameUi.UiLabel;
        private _btnNext  : GameUi.UiButton;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            FloatText.show("下一步？不存在的");
        }
    }
}
