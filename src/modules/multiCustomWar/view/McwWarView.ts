
namespace TinyWars.MultiCustomWar {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import StageManager = Utility.StageManager;
    import Helpers      = Utility.Helpers;

    export class McwWarView extends eui.Group {
        private _fieldContainer     = new GameUi.UiZoomableComponent();
        private _war                : McwWar;
        private _currentTouchPoints : Types.TouchPoints = {};
        private _previousTouchPoints: Types.TouchPoints = {};

        private _notifyListeners = [
            { type: Notify.Type.MouseWheel, callback: this._onNotifyMouseWheel },
        ];
        private _uiListeners = [
            { ui: this._fieldContainer, callback: this._onTouchBeginFieldContainer, eventType: egret.TouchEvent.TOUCH_BEGIN },
            { ui: this._fieldContainer, callback: this._onTouchEndFieldContainer,   eventType: egret.TouchEvent.TOUCH_END },
        ];

        public constructor() {
            super();

            this.top    = 0;
            this.bottom = 0;
            this.left   = 0;
            this.right  = 0;

            this._fieldContainer.top       = 0;
            this._fieldContainer.bottom    = 0;
            this._fieldContainer.left      = 0;
            this._fieldContainer.right     = 0;
            this._fieldContainer.setBoundarySpacings(50, 50, 50, 50);
            this.addChild(this._fieldContainer);
        }

        public init(war: McwWar): void {
            this._war = war;

            const gridSize  = ConfigManager.getGridSize();
            const mapSize   = war.getTileMap().getMapSize();
            this._fieldContainer.removeAllContents();
            this._fieldContainer.setContentWidth(mapSize.width * gridSize.width);
            this._fieldContainer.setContentHeight(mapSize.height * gridSize.height);
            this._fieldContainer.addContent(war.getField().getView());
            this._fieldContainer.setContentScale(0, true);
        }

        public startRunning(): void {
            Notify.addEventListeners(this._notifyListeners, this);
            for (const listener of this._uiListeners) {
                listener.ui.addEventListener(listener.eventType, listener.callback, this);
            }
        }
        public stopRunning(): void {
            Notify.removeEventListeners(this._notifyListeners, this);
            for (const listener of this._uiListeners) {
                listener.ui.removeEventListener(listener.eventType, listener.callback, this);
            }
        }

        private _onNotifyMouseWheel(e: egret.Event): void {
            this._fieldContainer.setZoomByScroll(StageManager.getMouseX(), StageManager.getMouseY(), e.data);
        }
        private _onTouchBeginFieldContainer(e: egret.TouchEvent): void {
            const touchesCount = Helpers.getObjectKeysCount(this._currentTouchPoints);
            if (touchesCount <= 0) {
                this._fieldContainer.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMoveFieldContainer, this);
            }

            const touchId = e.touchPointID;
            if (touchesCount <= 1) {
                this._currentTouchPoints[touchId]  = { x: e.stageX, y: e.stageY };
                this._previousTouchPoints[touchId] = { x: e.stageX, y: e.stageY };
            }
        }
        private _onTouchEndFieldContainer(e: egret.TouchEvent): void {
            delete this._currentTouchPoints[e.touchPointID];
            delete this._previousTouchPoints[e.touchPointID];

            if (Helpers.checkIsEmptyObject(this._currentTouchPoints)) {
                this._fieldContainer.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._onTouchMoveFieldContainer, this);
            }
        }
        private _onTouchMoveFieldContainer(e: egret.TouchEvent): void {
            // const touchId = e.touchPointID;
            // this._currentTouchPoints[touchId] = { x: e.stageX, y: e.stageY };

            // if (Helpers.getObjectKeysCount(this._currentTouchPoints) > 1) {
            //     this._fieldContainer.setZoomByTouches(this._currentTouchPoints, this._previousTouchPoints);
            // } else {
            //     const zoomMap = this._fieldContainer;
            //     zoomMap.setContentX(zoomMap.getContentX() + e.stageX - this._previousTouchPoints[touchId].x, true);
            //     zoomMap.setContentY(zoomMap.getContentY() + e.stageY - this._previousTouchPoints[touchId].y, true);
            // }

            // this._previousTouchPoints[touchId] = { x: e.stageX, y: e.stageY };
        }
    }
}
