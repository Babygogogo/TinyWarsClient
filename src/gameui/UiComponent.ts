
namespace TinyWars.GameUi {
    import Notify   = Utility.Notify;

    type UiListener = {
        ui          : egret.DisplayObject,
        callback    : (e: egret.Event) => void,
        eventType?  : string,
        thisObject? : any,
    }

    export class UiComponent extends eui.Component {
        private _isChildrenCreated  = false;
        private _isSkinLoaded       = false;
        private _isOpening          = false;

        private _notifyListenerArray: Notify.Listener[];
        private _uiListenerArray    : UiListener[];

        protected constructor() {
            super();

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
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            this._doClose();
        }

        protected _doOpen(): void {
            if (!this._checkIsReadyForOpen()) {
                return;
            }

            if (!this.getIsOpening()) {
                this._setIsOpening(true);

                this._onOpened();
                this._registerListeners();
            }
        }
        protected async _doClose(): Promise<void> {
            if (this.getIsOpening()) {
                this._setIsOpening(false);

                this._unregisterListeners();
                this._setUiListenerArray(undefined);
                this._setNotifyListenerArray(undefined);
                await this._onClosed();
            }
        }

        protected _onOpened(): void {}
        protected async _onClosed(): Promise<void> {}

        protected _checkIsReadyForOpen(): boolean {
            return (this.stage != null)
                && (this._isChildrenCreated)
                && (this._isSkinLoaded);
        }
        public getIsOpening(): boolean {
            return this._isOpening;
        }
        protected _setIsOpening(opening: boolean): void {
            this._isOpening = opening;
        }

        protected _setNotifyListenerArray(array: Notify.Listener[]): void {
            this._notifyListenerArray = array;
        }
        protected _getNotifyListenerArray(): Notify.Listener[] | undefined {
            return this._notifyListenerArray;
        }
        protected _setUiListenerArray(array: UiListener[]): void {
            this._uiListenerArray = array;
        }
        protected _getUiListenerArray(): UiListener[] | undefined {
            return this._uiListenerArray;
        }

        protected _registerListeners(): void {
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

        protected _unregisterListeners(): void {
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