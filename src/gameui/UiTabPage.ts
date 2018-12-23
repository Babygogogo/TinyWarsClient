
namespace TinyWars.GameUi {
    type UiListener = {
        ui         : egret.DisplayObject,
        callback   : (e: egret.Event) => void,
        eventType ?: string,
        thisObject?: any,
    }

    export abstract class UiTabPage extends eui.Component {
        protected _uiListeners    : UiListener[];
        protected _notifyListeners: Utility.Notify.Listener[];
        protected _notifyPriority = 0;

        private _isChildrenCreated   = false;
        private _isAllSkinPartsAdded = false;
        private _isCalledOpen        = false;

        private _isEverOpened        = false;
        private _isOpening           = false;

        protected _dataForOpen: any;

        protected constructor() {
            super();

            this.touchEnabled = false;
            this.addEventListener(egret.Event.COMPLETE, this._onAllSkinPartsAdded, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this._isChildrenCreated = true;
            this._doOpen();
        }

        private _onAllSkinPartsAdded(): void {
            this.removeEventListener(egret.Event.COMPLETE, this._onAllSkinPartsAdded, this);

            this._isAllSkinPartsAdded = true;
            this._doOpen();
        }

        private _onAddedToStage(): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            this._doOpen();
        }

        private _onRemovedFromStage(): void {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for open self.
        ////////////////////////////////////////////////////////////////////////////////
        public open(data: any): void {
            this._isCalledOpen = true;
            this._dataForOpen  = data;
            this._doOpen();
        }

        private _doOpen(): void {
            if (this._checkIsReadyForOpen()) {
                this._isCalledOpen = false;

                if (!this._isEverOpened) {
                    this._isEverOpened = true;
                    this._onFirstOpened();
                }

                if (!this._isOpening) {
                    this._isOpening = true;
                    this._registerListeners();
                }

                this._onOpened();
            }
        }

        protected _onFirstOpened(): void {
        }

        protected _onOpened(): void {
        }

        private _checkIsReadyForOpen(): boolean {
            return (this.stage != null)
                && (this._isChildrenCreated)
                && (this._isAllSkinPartsAdded)
                && (this._isCalledOpen);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for close self.
        ////////////////////////////////////////////////////////////////////////////////
        public close(): void {
            this._doClose();
        }

        private _doClose(): void {
            if (this._isOpening) {
                this._isOpening = false;
                this._unregisterListeners();
            }

            this._onClosed();
        }

        protected _onClosed(): void {
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _registerListeners(): void {
            if (this._notifyListeners) {
                Utility.Notify.addEventListeners(this._notifyListeners, this);
            }
            if (this._uiListeners) {
                for (const l of this._uiListeners) {
                    l.ui.addEventListener(l.eventType || egret.TouchEvent.TOUCH_TAP, l.callback, l.thisObject || this);
                }
            }
        }

        private _unregisterListeners(): void {
            if (this._notifyListeners) {
                Utility.Notify.removeEventListeners(this._notifyListeners, this);
            }
            if (this._uiListeners) {
                for (const l of this._uiListeners) {
                    l.ui.removeEventListener(l.eventType || egret.TouchEvent.TOUCH_TAP, l.callback, l.thisObject || this);
                }
            }
        }
    }
}
