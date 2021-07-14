
import Notify      from "../notify/Notify";
import Types       from "../helpers/Types";

namespace TwnsUiListItemRenderer {
    import UiListener      = Types.UiListener;

    export class UiListItemRenderer<DataForRenderer> extends eui.ItemRenderer {
        private _isChildrenCreated  = false;
        private _isSkinLoaded       = false;
        private _isOpening          = false;

        private _notifyListenerArray: Notify.Listener[] | undefined;
        private _uiListenerArray    : UiListener[] | undefined;

        // @ts-ignore
        public data                         : DataForRenderer;
        private _isDataChangedBeforeOpen    = false;

        public constructor() {
            super();

            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
            this.once(egret.Event.COMPLETE, this._onSkinLoaded, this);
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        public onItemTapEvent(e: eui.ItemTapEvent): void {
            // to be overridden
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this._isChildrenCreated = true;
            this._doOpen();
        }

        private _onSkinLoaded(): void {
            this._isSkinLoaded = true;

            this._doOpen();
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

        private _doOpen(): void {
            if (!this._checkIsReadyForOpen()) {
                return;
            }

            if (!this._getIsOpening()) {
                this._setIsOpening(true);

                this._onOpened();
                this._registerListeners();

                if (this._getIsDataChangedBeforeOpen()) {
                    this._setIsDataChangedBeforeOpen(false);
                    this._onDataChanged();
                }
            }
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

        protected _onOpened(): void {
            // to be overridden
        }
        protected _onClosed(): void {
            // to be overridden
        }

        private _checkIsReadyForOpen(): boolean {
            return (this.stage != null)
                && (this._isChildrenCreated)
                && (this._isSkinLoaded);
        }
        protected _getIsOpening(): boolean {
            return this._isOpening;
        }
        private _setIsOpening(opening: boolean): void {
            this._isOpening = opening;
        }

        protected _onDataChanged(): void {
            // to be overridden
        }
        protected dataChanged(): void {
            super.dataChanged();

            if (this._getIsOpening()) {
                this._onDataChanged();
            } else {
                this._setIsDataChangedBeforeOpen(true);
            }
        }
        private _getIsDataChangedBeforeOpen(): boolean {
            return this._isDataChangedBeforeOpen;
        }
        private _setIsDataChangedBeforeOpen(isChanged: boolean): void {
            this._isDataChangedBeforeOpen = isChanged;
        }

        protected _setNotifyListenerArray(array: Notify.Listener[] | undefined): void {
            this._notifyListenerArray = array;
        }
        protected _getNotifyListenerArray(): Notify.Listener[] | undefined {
            return this._notifyListenerArray;
        }
        protected _setUiListenerArray(array: UiListener[] | undefined): void {
            this._uiListenerArray = array;
        }
        protected _getUiListenerArray(): UiListener[] | undefined {
            return this._uiListenerArray;
        }

        private _registerListeners(): void {
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

        private _unregisterListeners(): void {
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

export default TwnsUiListItemRenderer;
