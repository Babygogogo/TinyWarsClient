
namespace TinyWars.BaseWar {
    import Notify               = Utility.Notify;
    import Types                = Utility.Types;
    import GridIndex            = Types.GridIndex;
    import Point                = Types.Point;
    const PADDING_HORIZONTAL    = 150;
    const PADDING_VERTICAL      = 50;

    export class BwWarView extends eui.Group {
        private _fieldContainer     = new GameUi.UiZoomableComponent();
        private _war                : BwWar;

        private _isShowingVibration = false;
        private _vibrationMaxOffset = 4;
        private _vibrationTimeoutId : number;

        private _notifyListeners: Notify.Listener[] = [
            { type: Notify.Type.BwFieldZoomed,  callback: this._onNotifyBwFieldZoomed },
            { type: Notify.Type.BwFieldDragged, callback: this._onNotifyBwFieldDragged },
        ];
        private _uiListeners: Utility.Types.UiListener[] = [
            { ui: this,     callback: this._onEnterFrame,   eventType: egret.Event.ENTER_FRAME },
        ];

        public constructor() {
            super();

            this.percentWidth           = 100;
            this.percentHeight          = 100;

            this._fieldContainer.top    = 0;
            this._fieldContainer.bottom = 0;
            this._fieldContainer.left   = 0;
            this._fieldContainer.right  = 0;
            this._fieldContainer.setBoundarySpacings(PADDING_HORIZONTAL, PADDING_HORIZONTAL, PADDING_VERTICAL, PADDING_VERTICAL);
            this.addChild(this._fieldContainer);
        }

        public init(war: BwWar): void {
            this._war = war;

            const gridSize  = Utility.CommonConstants.GridSize;
            const mapSize   = war.getTileMap().getMapSize();
            this._fieldContainer.removeAllContents();
            this._fieldContainer.setContentWidth(mapSize.width * gridSize.width);
            this._fieldContainer.setContentHeight(mapSize.height * gridSize.height);
            this._fieldContainer.addContent(war.getField().getView());
            this._fieldContainer.setContentScale(0, true);
        }
        public fastInit(war: BwWar): void {
            this._war = war;
        }

        public startRunningView(): void {
            Notify.addEventListeners(this._notifyListeners, this);
            for (const listener of this._uiListeners) {
                listener.ui.addEventListener(listener.eventType, listener.callback, this);
            }

            this._fieldContainer.setMouseWheelListenerEnabled(true);
        }
        public stopRunning(): void {
            Notify.removeEventListeners(this._notifyListeners, this);
            for (const listener of this._uiListeners) {
                listener.ui.removeEventListener(listener.eventType, listener.callback, this);
            }

            this._fieldContainer.setMouseWheelListenerEnabled(false);
        }

        public getFieldContainer(): GameUi.UiZoomableComponent {
            return this._fieldContainer;
        }

        public tweenGridToCentralArea(gridIndex: GridIndex): void {
            const stage     = Utility.StageManager.getStage();
            const gridSize  = Utility.CommonConstants.GridSize;
            const container = this._fieldContainer;
            const currPoint = container.getContents().localToGlobal(
                (gridIndex.x + 0.5) * gridSize.width,
                (gridIndex.y + 0.5) * gridSize.height,
            );
            const newX      = Math.min(
                Math.max(currPoint.x, 120),
                stage.stageWidth - 120,
            );
            const newY      = Math.min(
                Math.max(currPoint.y, 120),
                stage.stageHeight - 120,
            );
            const newPoint  = this._getRevisedContentPointForMoveGrid(gridIndex, newX, newY);
            container.tweenContentToPoint(newPoint.x, newPoint.y, false);
        }
        public moveGridToCenter(gridIndex: GridIndex): void {
            const stage = Utility.StageManager.getStage();
            this._moveGridToPoint(gridIndex, stage.stageWidth / 2, stage.stageHeight / 2);
        }
        private _moveGridToPoint(gridIndex: GridIndex, x: number, y: number): void {
            const point     = this._getRevisedContentPointForMoveGrid(gridIndex, x, y);
            const container = this._fieldContainer;
            container.setContentX(point.x, false);
            container.setContentY(point.y, false);
        }
        private _getRevisedContentPointForMoveGrid(gridIndex: GridIndex, x: number, y: number): Point {
            const gridSize  = Utility.CommonConstants.GridSize;
            const container = this._fieldContainer;
            const contents  = container.getContents();
            const point1    = contents.localToGlobal(
                (gridIndex.x + 0.5) * gridSize.width,
                (gridIndex.y + 0.5) * gridSize.height,
            );
            const point2    = contents.localToGlobal(0, 0);
            return {
                x   : container.getRevisedContentX(- point1.x + point2.x + x),
                y   : container.getRevisedContentY(- point1.y + point2.y + y),
            };
        }

        public showVibration(duration = 450, maxOffset = 5): void {
            this.stopVibration();

            this._isShowingVibration    = true;
            this._vibrationMaxOffset    = maxOffset;
            this._vibrationTimeoutId    = egret.setTimeout(() => {
                this.stopVibration();
            }, this, duration);
        }
        public stopVibration(): void {
            this._isShowingVibration    = false;
            this.x                      = 0;
            this.y                      = 0;

            if (this._vibrationTimeoutId != null) {
                egret.clearTimeout(this._vibrationTimeoutId);
                this._vibrationTimeoutId = null;
            }
        }
        private _checkAndVibrate(): void {
            if (this._isShowingVibration) {
                const maxOffset = this._vibrationMaxOffset;
                this.x          = Math.random() * maxOffset * (Math.random() > 0.5 ? 1 : -1);
                this.y          = Math.random() * maxOffset * (Math.random() > 0.5 ? 1 : -1);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyBwFieldZoomed(e: egret.Event): void {
            const data = e.data as Notify.Data.BwFieldZoomed;
            this._fieldContainer.setZoomByTouches(data.current, data.previous);
        }
        private _onNotifyBwFieldDragged(e: egret.Event): void {
            const data = e.data as Notify.Data.BwFieldDragged;
            this._fieldContainer.setDragByTouches(data.current, data.previous);
        }

        private _onEnterFrame(e: egret.Event): void {
            this._checkAndVibrate();
        }
    }
}
