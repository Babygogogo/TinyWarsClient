
namespace TinyWars.GameUi {
    type UiListener = {
        ui         : egret.DisplayObject,
        callback   : (e: egret.Event) => void,
        eventType ?: string,
        thisObject?: any,
    }

    export abstract class UiTabPage extends eui.Component {
        private _isChildrenCreated      = false;
        private _isSkinLoaded           = false;
        private _isOpening              = false;

        private _uiListenerArray        : UiListener[];
        private _notifyListenerArray    : Utility.Notify.Listener[];
        private _notifyPriority         = 0;

        protected _openData             : any;

        protected constructor() {
            super();

            this.touchEnabled = false;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.once(egret.Event.COMPLETE, this._onAllSkinPartsAdded, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this._isChildrenCreated = true;
            this._doOpen();
        }

        private _onAllSkinPartsAdded(): void {
            this._isSkinLoaded = true;

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

            this._doClose();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for open self.
        ////////////////////////////////////////////////////////////////////////////////
        public open(parent: egret.DisplayObjectContainer, data: any): void {
            this._openData  = data;
            parent.addChild(this);

            this._doOpen();
        }

        private _doOpen(): void {
            if (!this._checkIsReadyForOpen()) {
                return;
            }

            if (!this._getIsOpening()) {
                this._setIsOpening(true);

                this._onOpened();
                this._registerListeners();
            }
        }

        protected _onOpened(): void {}

        private _checkIsReadyForOpen(): boolean {
            return (this.stage != null)
                && (this._isChildrenCreated)
                && (this._isSkinLoaded);
        }

        private _getIsOpening(): boolean {
            return this._isOpening;
        }
        private _setIsOpening(isOpening: boolean): void {
            this._isOpening = isOpening;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for close self.
        ////////////////////////////////////////////////////////////////////////////////
        public close(): void {
            (this.parent) && (this.parent.removeChild(this));

            this._doClose();
        }

        private _doClose(): void {
            if (this._getIsOpening()) {
                this._setIsOpening(false);

                this._unregisterListeners();
                this._setUiListenerArray(undefined);
                this._setNotifyListenerArray(undefined);
                this._onClosed();
            }
        }

        protected _onClosed(): void {}

        ////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////
        protected _setUiListenerArray(array: UiListener[]): void {
            this._uiListenerArray = array;
        }
        protected _getUiListenerArray(): UiListener[] | undefined {
            return this._uiListenerArray;
        }
        protected _setNotifyListenerArray(array: Utility.Notify.Listener[]): void {
            this._notifyListenerArray = array;
        }
        protected _getNotifyListenerArray(): Utility.Notify.Listener[] | undefined {
            return this._notifyListenerArray;
        }

        private _registerListeners(): void {
            if (this._notifyListenerArray) {
                Utility.Notify.addEventListeners(this._notifyListenerArray, this);
            }
            if (this._uiListenerArray) {
                for (const l of this._uiListenerArray) {
                    l.ui.addEventListener(l.eventType || egret.TouchEvent.TOUCH_TAP, l.callback, l.thisObject || this);
                }
            }
        }

        private _unregisterListeners(): void {
            if (this._notifyListenerArray) {
                Utility.Notify.removeEventListeners(this._notifyListenerArray, this);
            }
            if (this._uiListenerArray) {
                for (const l of this._uiListenerArray) {
                    l.ui.removeEventListener(l.eventType || egret.TouchEvent.TOUCH_TAP, l.callback, l.thisObject || this);
                }
            }
        }
    }
}
