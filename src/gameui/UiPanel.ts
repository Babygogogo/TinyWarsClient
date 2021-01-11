
namespace TinyWars.GameUi {
    import Logger = Utility.Logger;

    type UiListener = {
        ui         : egret.DisplayObject,
        callback   : (e: egret.Event) => void,
        eventType ?: string,
        thisObject?: any,
    }

    export abstract class UiPanel extends eui.Component {
        protected abstract readonly _LAYER_TYPE  : Utility.Types.LayerType;
        protected abstract readonly _IS_EXCLUSIVE: boolean;

        private _isChildrenCreated      = false;
        private _isSkinLoaded           = false;
        private _isOpening              = false;

        private _uiListenerArray        : UiListener[];
        private _notifyListenerArray    : Utility.Notify.Listener[];
        private _notifyPriority         = 0;

        private _isAutoAdjustHeight     = false;
        private _isTouchMaskEnabled     = false;
        private _isCloseOnTouchedMask   = false;
        private _callbackOnTouchedMask  : () => void;
        private _touchMask              : eui.Group;

        private _openData               : any;

        protected constructor() {
            super();

            this.touchEnabled = false;
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.once(egret.Event.COMPLETE, this._onSkinLoaded, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this._isChildrenCreated = true;
            this._doOpen();
        }

        private _onSkinLoaded(e: egret.Event): void {
            this._isSkinLoaded = true;

            this._doOpen();
        }

        private _onAddedToStage(e: egret.Event): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            this._doOpen();
        }

        private _onRemovedFromStage(e: egret.Event): void {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);

            this._doClose();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for open self.
        ////////////////////////////////////////////////////////////////////////////////
        public open(openData: any): void {
            const layer = Utility.StageManager.getLayer(this._LAYER_TYPE);
            (this._IS_EXCLUSIVE) && (layer.closeAllPanels(this));
            (!this.parent) && (layer.addChild(this));

            this._setOpenData(openData);

            this._doOpen();
        }

        private _doOpen(): void {
            if (!this._checkIsReadyForOpen()) {
                return;
            }

            if (!this.getIsOpening()) {
                this._setIsOpening(true);
                Logger.warn("Panel opened: " + this.skinName);

                this._onOpened();
                this._registerListeners();
                this._handleAutoAdjustHeight();
                this._handleTouchMask();
            }
        }

        protected _onOpened(): void {}

        private _checkIsReadyForOpen(): boolean {
            return (this.stage != null)
                && (this._isChildrenCreated)
                && (this._isSkinLoaded);
        }

        private _setOpenData(data: any): void {
            this._openData = data;
        }
        protected _getOpenData<T>(): T {
            return this._openData;
        }

        public getIsOpening(): boolean {
            return this._isOpening;
        }
        private _setIsOpening(opening: boolean): void {
            this._isOpening = opening;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for close self.
        ////////////////////////////////////////////////////////////////////////////////
        public close(): void {
            (this.parent) && (this.parent.removeChild(this));

            this._setOpenData(undefined);

            this._doClose();
        }

        private _doClose(): void {
            if (this.getIsOpening()) {
                this._setIsOpening(false);

                this._unregisterListeners();
                this._setUiListenerArray(undefined);
                this._setNotifyListenerArray(undefined);
                this._setCallbackOnTouchedMask(undefined);
                this._onClosed();
            }
        }

        protected _onClosed(): void {}

        ////////////////////////////////////////////////////////////////////////////////
        // Auto adjust height.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsAutoAdjustHeight(): boolean {
            return this._isAutoAdjustHeight;
        }
        protected _setIsAutoAdjustHeight(enabled = true): void {
            this._isAutoAdjustHeight = enabled;
            this._handleAutoAdjustHeight();
        }
        private _handleAutoAdjustHeight(): void {
            if (this.getIsAutoAdjustHeight()) {
                this.height = Utility.StageManager.getStage().stageHeight;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Touch mask.
        ////////////////////////////////////////////////////////////////////////////////
        protected _setIsTouchMaskEnabled(enabled = true): void {
            this._isTouchMaskEnabled = enabled;
            this._handleTouchMask();
        }
        protected _getIsTouchMaskEnabled(): boolean {
            return this._isTouchMaskEnabled;
        }
        private _handleTouchMask(): void {
            if (!this._getIsTouchMaskEnabled()) {
                const mask = this._touchMask;
                if (mask) {
                    mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedTouchMask, this);
                    (mask.parent) && (mask.parent.removeChild(mask));
                }

            } else {
                if (!this._touchMask) {
                    const newMask        = new eui.Group();
                    newMask.width        = Utility.StageManager.DESIGN_WIDTH;
                    newMask.height       = Utility.StageManager.DESIGN_MAX_HEIGHT;
                    newMask.touchEnabled = true;
                    newMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedTouchMask, this);
                    this._touchMask = newMask;
                }
                this.addChildAt(this._touchMask, 0);
            }
        }

        protected _setIsCloseOnTouchedMask(isClose = true): void {
            this._isCloseOnTouchedMask = isClose;
        }
        protected _getIsCloseOnTouchedMask(): boolean {
            return this._isCloseOnTouchedMask;
        }
        protected _setCallbackOnTouchedMask(callback: (() => void) | undefined): void {
            this._callbackOnTouchedMask = callback;
        }
        protected _getCallbackOnTouchedMask(): (() => void) | undefined {
            return this._callbackOnTouchedMask;
        }
        private _onTouchedTouchMask(e: egret.TouchEvent): void {
            const callback = this._getCallbackOnTouchedMask();
            if (callback) {
                callback();
            }

            if (this._getIsCloseOnTouchedMask()) {
                this.close();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // UI / notify listeners.
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
            const notifyListenerArray = this._getNotifyListenerArray();
            if (notifyListenerArray) {
                Utility.Notify.addEventListeners(notifyListenerArray, this);
            }

            const uiListenerArray = this._getUiListenerArray();
            if (uiListenerArray) {
                for (const l of uiListenerArray) {
                    l.ui.addEventListener(l.eventType || egret.TouchEvent.TOUCH_TAP, l.callback, l.thisObject || this);
                }
            }
        }
        private _unregisterListeners(): void {
            const notifyListenerArray = this._getNotifyListenerArray();
            if (notifyListenerArray) {
                Utility.Notify.removeEventListeners(notifyListenerArray, this);
            }

            const uiListenerArray = this._getUiListenerArray();
            if (uiListenerArray) {
                for (const l of uiListenerArray) {
                    l.ui.removeEventListener(l.eventType || egret.TouchEvent.TOUCH_TAP, l.callback, l.thisObject || this);
                }
            }
        }
    }
}
