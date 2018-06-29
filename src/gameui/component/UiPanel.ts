
namespace GameUi {
    export class UiPanel extends eui.Component {
        private _isChildrenCreated  : boolean;
        private _isAllSkinPartsAdded: boolean;
        private _isEverOpened       : boolean;

        protected _argForOpen: any;
        private _panelName   : string;

        private _isAutoAdjustHeight       : boolean = false;
        private _isCloseOnTouchedOutside  : boolean;
        private _isSwallowOnTouchedOutside: boolean;

        protected _uiListeners    : { btn: egret.DisplayObject, callback: ((e: egret.TouchEvent) => void), thisObject?: any }[];
        protected _notifyListeners: Utility.Notify.Listener[];
        protected _notifyPriority = 0;

        private _touchMask: eui.Group;

        protected constructor() {
            super();

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
        public open(params?: any): void {
            this.close();

            this._argForOpen = params;
            this._doOpen();
        }

        private _doOpen(): void {
            if (this._checkIsReadyForOpen()) {
                if ((this._isCloseOnTouchedOutside) || (this._isSwallowOnTouchedOutside)) {
                    this.addChildAt(this._touchMask, 0);
                }
                if (this._isAutoAdjustHeight) {
                    this.height = StageManager.getStage().stageHeight;
                }

                if (!this._isEverOpened) {
                    this._isEverOpened = true;
                    this._onFirstOpened();
                }

                if (this._notifyListeners) {
                    Utility.Notify.addEventListeners(this._notifyListeners, this);
                }
                if (this._uiListeners) {
                    for (const event of this._uiListeners) {
                        event.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, event.callback, event.thisObject || this);
                    }
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
                && (this._isAllSkinPartsAdded);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for close self.
        ////////////////////////////////////////////////////////////////////////////////
        public close(): void {
            this._argForOpen = undefined;

            this._doClose();
        }

        private _doClose(): void {
            if (this._notifyListeners) {
                Utility.Notify.removeEventListeners(this._notifyListeners, this);
            }
            if (this._uiListeners) {
                for (const event of this._uiListeners) {
                    event.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, event.callback, event.thisObject || this);
                }
            }

            this._onClosed();
        }

        protected _onClosed(): void {
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Other functions.
        ////////////////////////////////////////////////////////////////////////////////
        public setPanelName(panelName: string): void {
            this._panelName = panelName;
        }

        public getPanelName(): string {
            return this._panelName;
        }

        public checkIsAutoAdjustHeight(): boolean {
            return this._isAutoAdjustHeight;
        }

        protected enableCloseOnTouchedOutside(isEnabled: boolean = true): void {
            if (this._isCloseOnTouchedOutside !== isEnabled) {
                this._isCloseOnTouchedOutside = isEnabled;

                if (!isEnabled) {
                    if ((!this._isSwallowOnTouchedOutside) && (this._touchMask) && (this._touchMask.parent)) {
                        this.removeChild(this._touchMask);
                    }
                } else {
                    this._touchMask = this._touchMask || this._createTouchMask();
                    if (!this._touchMask.parent) {
                        this.addChildAt(this._touchMask, 0);
                    }
                }
            }
        }

        protected enableSwallowOnTouchedOutside(isEnabled: boolean = true): void {
            if (this._isSwallowOnTouchedOutside !== isEnabled) {
                this._isSwallowOnTouchedOutside = isEnabled;

                if (!isEnabled) {
                    if ((!this._isCloseOnTouchedOutside) && (this._touchMask) && (this._touchMask.parent)) {
                        this.removeChild(this._touchMask);
                    }
                } else {
                    this._touchMask = this._touchMask || this._createTouchMask();
                    if (!this._touchMask.parent) {
                        this.addChildAt(this._touchMask, 0);
                    }
                }
            }
        }

        protected enableAutoAdjustHeight(isEnabled: boolean = true): void {
            if (this._isAutoAdjustHeight !== isEnabled) {
                this._isAutoAdjustHeight = isEnabled;

                if (isEnabled) {
                    this.height = StageManager.getStage().stageHeight;
                }
            }
        }

        private _createTouchMask(): eui.Group {
            const mask        = new eui.Group();
            mask.width        = StageManager.DESIGN_WIDTH;
            mask.height       = StageManager.DESIGN_MAX_HEIGHT;
            mask.touchEnabled = true;
            mask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedTouchMask, this);

            return mask;
        }

        private _onTouchedTouchMask(e: egret.TouchEvent): void {
            if (this._isCloseOnTouchedOutside) {
                this.close();
            }
        }
    }
}
