
namespace TinyWars.BaseWar {
    import Notify   = Utility.Notify;

    export abstract class BwWarView extends eui.Group {
        private _fieldContainer     = new GameUi.UiZoomableComponent();
        private _war                : BwWar;

        private _notifyListeners: Notify.Listener[] = [
            { type: Notify.Type.BwFieldZoomed,  callback: this._onNotifyBwFieldZoomed },
            { type: Notify.Type.BwFieldDragged, callback: this._onNotifyBwFieldDragged },
        ];
        private _uiListeners = [
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
            this._fieldContainer.setBoundarySpacings(150, 150, 50, 50);
            this.addChild(this._fieldContainer);
        }

        public init(war: BwWar): void {
            this._war = war;

            const gridSize  = ConfigManager.getGridSize();
            const mapSize   = war.getTileMap().getMapSize();
            this._fieldContainer.removeAllContents();
            this._fieldContainer.setContentWidth(mapSize.width * gridSize.width);
            this._fieldContainer.setContentHeight(mapSize.height * gridSize.height);
            this._fieldContainer.addContent(war.getField().getView());
            this._fieldContainer.setContentScale(0, true);
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
    }
}
