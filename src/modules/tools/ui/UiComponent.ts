
import Notify   from "../notify/Notify";
import Types    from "../helpers/Types";

namespace TwnsUiComponent {
    import UiListener   = Types.UiListener;

    export class UiComponent extends eui.Component {
        private _isChildrenCreated  = false;
        private _isSkinLoaded       = false;
        private _isOpening          = false;

        private _notifyListenerArray    : Notify.Listener[] | null = null;
        private _uiListenerArray        : UiListener[] | null = null;

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
            if (e.target === this) {
                this._isSkinLoaded = true;

                this._doOpen();
            }
        }

        private _onAddedToStage(): void {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemovedFromStage, this);

            this._doOpen();
        }

        private _onRemovedFromStage(): void {
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
                this._setUiListenerArray(null);
                this._setNotifyListenerArray(null);
                await this._onClosed();
            }
        }

        protected _onOpened(): void {
            // to be overridden
        }
        protected async _onClosed(): Promise<void> {
            // to be overridden
        }

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

        protected _setNotifyListenerArray(array: Notify.Listener[] | null): void {
            this._notifyListenerArray = array;
        }
        protected _getNotifyListenerArray(): Notify.Listener[] | null {
            return this._notifyListenerArray;
        }
        protected _setUiListenerArray(array: UiListener[] | null): void {
            this._uiListenerArray = array;
        }
        protected _getUiListenerArray(): UiListener[] | null {
            return this._uiListenerArray;
        }

        protected _registerListeners(): void {
            const notifyListenerArray = this._getNotifyListenerArray();
            if (notifyListenerArray) {
                Notify.addEventListeners(notifyListenerArray, this);
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
                Notify.removeEventListeners(notifyListenerArray, this);
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

export default TwnsUiComponent;
