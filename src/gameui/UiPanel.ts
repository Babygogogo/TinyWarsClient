
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

        private _isRunningClose         = false;
        private _cachedOpenFunc         : (() => void) | undefined;

        private _uiListenerArray        : UiListener[];
        private _notifyListenerArray    : Utility.Notify.Listener[];

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
            if (this.getIsOpening()) {
                Logger.warn(`%cUiPanel.open() it is opening already: ${this.skinName}`, `background:#FFDDDD;`);
                this.close();
            }

            if (this._getIsRunningClose()) {
                Logger.warn(`%cUiPanel.open() it is running close: ${this.skinName}`, `background:#FFDDDD;`);
                this._setCachedOpenFunc(() => this.open(openData));
                return;
            }

            this._setOpenData(openData);

            const layer = Utility.StageManager.getLayer(this._LAYER_TYPE);
            (this._IS_EXCLUSIVE) && (layer.closeAllPanels(this));
            (!this.parent) && (layer.addChild(this));

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
                this.width = Utility.StageManager.getDesignWidth();
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

        private _setCachedOpenFunc(func: (() => void) | undefined): void {
            this._cachedOpenFunc = func;
        }
        private _getCachedOpenFunc(): (() => void) | undefined {
            return this._cachedOpenFunc;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for close self.
        ////////////////////////////////////////////////////////////////////////////////
        public async close(): Promise<void> {
            if (!this.getIsOpening()) {
                return;
            }

            this._setCachedOpenFunc(undefined);

            if (this._getIsRunningClose()) {
                return;
            }
            this._setIsRunningClose(true);

            await this._doClose();
            (this.parent) && (this.parent.removeChild(this));
            this._setOpenData(undefined);

            this._setIsRunningClose(false);

            const func = this._getCachedOpenFunc();
            if (func) {
                this._setCachedOpenFunc(undefined);

                Logger.warn(`%cUiPanel.close() calling cached open func: ${this.skinName}`, `background:#FFDDDD;`);
                func();
            }
        }

        private async _doClose(): Promise<void> {
            if (this.getIsOpening()) {
                this._setIsOpening(false);

                this._unregisterListeners();
                this._setUiListenerArray(undefined);
                this._setNotifyListenerArray(undefined);
                this._setCallbackOnTouchedMask(undefined);
                await this._onClosed();
            }
        }

        protected async _onClosed(): Promise<void> {}

        private _getIsRunningClose(): boolean {
            return this._isRunningClose;
        }
        private _setIsRunningClose(isRunning: boolean): void {
            this._isRunningClose = isRunning;
        }

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
                    newMask.width        = Utility.StageManager.getDesignWidth();
                    newMask.height       = Utility.StageManager.getDesignMaxHeight();
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
