
// import TwnsClientErrorCode  from "../helpers/ClientErrorCode";
// import Helpers              from "../helpers/Helpers";
// import Logger               from "../helpers/Logger";
// import SoundManager         from "../helpers/SoundManager";
// import StageManager         from "../helpers/StageManager";
// import Types                from "../helpers/Types";
// import TwnsUiButton         from "./UiButton";
// import TwnsUiComponent      from "./UiComponent";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsUiPanel2 {
    const NAMES_FOR_BUTTON_CONFIRM = [
        `_btnConfirm`,
    ];
    const NAMES_FOR_BUTTON_CLOSE = [
        `_btnClose`,
        `_btnCancel`,
        `_btnBack`,
    ];

    export const EVENT_PANEL_SKIN_LOADED            = `EventPanelSkinLoaded`;
    export const EVENT_PANEL_CHILDREN_CREATED       = `EventPanelChildrenCreated`;

    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import UiListener       = Types.UiListener;
    import PanelConfig      = TwnsPanelConfig.PanelConfig;

    export abstract class UiPanel2<OpenData> extends eui.Component {
        private _isChildrenCreated      = false;
        private _isSkinLoaded           = false;
        private _notifyListenerArray    : Notify.Listener[] | null = null;
        private _uiListenerArray        : UiListener[] | null = null;
        private _panelConfig            : PanelConfig<OpenData> | null = null;

        private _isTouchMaskEnabled     = false;
        private _isCloseOnTouchedMask   = false;
        private _callbackOnTouchedMask  : (() => void) | null = null;
        private _touchMask?             : eui.Group;

        private _hasSetOpenData         = false;
        private _openData?              : OpenData;

        public constructor() {
            super();

            this.touchEnabled = false;
            this.once(egret.Event.COMPLETE, this._onSkinLoaded, this);
        }

        protected childrenCreated(): void {
            super.childrenCreated();

            this._setIsChildrenCreated(true);
        }

        private _onSkinLoaded(e: egret.Event): void {
            if (e.target === this) {
                this._setIsSkinLoaded(true);
            }
        }

        public getIsChildrenCreated(): boolean {
            return this._isChildrenCreated;
        }
        private _setIsChildrenCreated(isCreated: boolean): void {
            this._isChildrenCreated = isCreated;

            if (isCreated) {
                this.dispatchEventWith(EVENT_PANEL_CHILDREN_CREATED);
            }
        }

        public getIsSkinLoaded(): boolean {
            return this._isSkinLoaded;
        }
        private _setIsSkinLoaded(isLoaded: boolean): void {
            this._isSkinLoaded = isLoaded;

            if (isLoaded) {
                this.dispatchEventWith(EVENT_PANEL_SKIN_LOADED);
            }
        }

        public setPanelConfig(config: PanelConfig<OpenData>): void {
            this._panelConfig = config;
        }
        public getPanelConfig(): PanelConfig<OpenData> {
            return Helpers.getExisted(this._panelConfig);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for open self.
        ////////////////////////////////////////////////////////////////////////////////
        public async initOnOpening(openData: OpenData): Promise<void> {
            const touchMask = createTouchMask();
            this.addChild(touchMask);

            this._setOpenData(openData);
            if (!this._checkIsReadyForOpen()) {
                throw Helpers.newError(`UiPanel2.initOnOpening() !this._checkIsReadyForOpen().`);
            }

            const stage = StageManager.getStage();
            this.resize(stage.stageWidth, stage.stageHeight);
            this._resetSoundForCommonButtons();

            this._onOpening();
            this._registerListeners();

            await Promise.all([
                this._showOpenAnimation(),
                this._updateOnOpenDataChanged(),
            ]);

            this.removeChild(touchMask);
        }
        protected abstract _onOpening(): void;

        protected async _showOpenAnimation(): Promise<void> {
            // to be overridden
        }

        private _setOpenData(data: OpenData): void {
            this._openData = data;
            this._setHasSetOpenData(true);
        }
        private _deleteOpenData(): void {
            delete this._openData;
            this._setHasSetOpenData(false);
        }
        protected _getOpenData(): OpenData {
            return Helpers.getDefined(this._openData, ClientErrorCode.UiPanel_GetOpenData_00);
        }
        public async updateWithOpenData(openData: OpenData): Promise<void> {
            if (!this._checkIsReadyForOpen()) {
                throw Helpers.newError(`UiPanel2.updateWithOpenData() !this._checkIsReadyForOpen().`);
            }

            this._setOpenData(openData);
            await this._updateOnOpenDataChanged();
        }
        protected abstract _updateOnOpenDataChanged(): Promise<void>;

        private _getHasSetOpenData(): boolean {
            return this._hasSetOpenData;
        }
        private _setHasSetOpenData(hasSet: boolean): void {
            this._hasSetOpenData = hasSet;
        }

        private _checkIsReadyForOpen(): boolean {
            return (this.stage != null)
                && (this.getIsChildrenCreated())
                && (this.getIsSkinLoaded())
                && (this._getHasSetOpenData());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for close self.
        ////////////////////////////////////////////////////////////////////////////////
        public close(): void {
            TwnsPanelManager.close(this.getPanelConfig());
        }

        public async clearOnClosing(): Promise<void> {
            const touchMask = createTouchMask();
            this.addChild(touchMask);

            this._unregisterListeners();
            this._setUiListenerArray(null);
            this._setNotifyListenerArray(null);
            this._setCallbackOnTouchedMask(null);
            this._deleteOpenData();
            this._onClosing();

            await this._showCloseAnimation();

            this.removeChild(touchMask);
        }
        protected abstract _onClosing(): void;

        protected async _showCloseAnimation(): Promise<void> {
            // to be overridden
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Auto resize.
        ////////////////////////////////////////////////////////////////////////////////
        public resize(stageWidth: number, stageHeight: number): void {
            this.width  = stageWidth;
            this.height = stageHeight;

            const mask = this._touchMask;
            if (mask) {
                mask.width  = stageWidth;
                mask.height = stageHeight;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Touch mask.
        ////////////////////////////////////////////////////////////////////////////////
        protected _setIsTouchMaskEnabled(enabled = true): void {
            this._isTouchMaskEnabled = enabled;
            this._resetTouchMask();
        }
        protected _getIsTouchMaskEnabled(): boolean {
            return this._isTouchMaskEnabled;
        }
        private _resetTouchMask(): void {
            if (!this._getIsTouchMaskEnabled()) {
                const mask = this._touchMask;
                if (mask) {
                    mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedTouchMask, this);
                    (mask.parent) && (mask.parent.removeChild(mask));
                }

            } else {
                if (!this._touchMask) {
                    const newMask   = createTouchMask();
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
        protected _setCallbackOnTouchedMask(callback: (() => void) | null): void {
            this._callbackOnTouchedMask = callback;
        }
        protected _getCallbackOnTouchedMask(): (() => void) | null {
            return this._callbackOnTouchedMask;
        }
        private _onTouchedTouchMask(): void {
            const callback = this._getCallbackOnTouchedMask();
            if (callback) {
                callback();
            }

            if (this._getIsCloseOnTouchedMask()) {
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonCancel01);
                this.close();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Utils.
        ////////////////////////////////////////////////////////////////////////////////
        private _resetSoundForCommonButtons(): void {
            for (const name of NAMES_FOR_BUTTON_CLOSE) {
                const btn = (this as any)[name];
                if (btn instanceof TwnsUiButton.UiButton) {
                    btn.setShortSfxCode(Types.ShortSfxCode.ButtonCancel01);
                }
            }
            for (const name of NAMES_FOR_BUTTON_CONFIRM) {
                const btn = (this as any)[name];
                if (btn instanceof TwnsUiButton.UiButton) {
                    btn.setShortSfxCode(Types.ShortSfxCode.ButtonConfirm01);
                }
            }
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

    function createTouchMask(): eui.Group {
        const mask          = new eui.Group();
        const stage         = StageManager.getStage();
        mask.width          = stage.stageWidth;
        mask.height         = stage.stageHeight;
        mask.touchEnabled   = true;

        return mask;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // 以下版本支持用open打断进行中的close，但为避免内存泄漏而难以支持async close
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // const NAMES_FOR_BUTTON_CONFIRM = [
    //     `_btnConfirm`,
    // ];
    // const NAMES_FOR_BUTTON_CLOSE = [
    //     `_btnClose`,
    //     `_btnCancel`,
    //     `_btnBack`,
    // ];

    // export const EVENT_PANEL_SKIN_LOADED            = `EventPanelSkinLoaded`;
    // export const EVENT_PANEL_CHILDREN_CREATED       = `EventPanelChildrenCreated`;
    // export const EVENT_PANEL_CLOSE_ANIMATION_ENDED  = `EventPanelCloseAnimationEnded`;

    // import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    // import UiListener       = Types.UiListener;
    // import PanelConfig      = TwnsPanelConfig.PanelConfig;

    // export abstract class UiPanel2<OpenData> extends eui.Component {
    //     private _isChildrenCreated      = false;
    //     private _isSkinLoaded           = false;
    //     private _notifyListenerArray    : Notify.Listener[] | null = null;
    //     private _uiListenerArray        : UiListener[] | null = null;
    //     private _panelConfig            : PanelConfig<OpenData> | null = null;

    //     private _isTouchMaskEnabled         = false;
    //     private _isTouchMaskCallbackEnabled = false;
    //     private _isCloseOnTouchedMask       = false;
    //     private _callbackOnTouchedMask      : (() => void) | null = null;
    //     private _touchMask?                 : eui.Group;

    //     private _hasSetOpenData         = false;
    //     private _openData?              : OpenData;

    //     protected constructor() {
    //         super();

    //         this.touchEnabled = false;
    //         this.once(egret.Event.COMPLETE, this._onSkinLoaded, this);
    //     }

    //     protected childrenCreated(): void {
    //         super.childrenCreated();

    //         this._setIsChildrenCreated(true);
    //     }

    //     private _onSkinLoaded(e: egret.Event): void {
    //         if (e.target === this) {
    //             this._setIsSkinLoaded(true);
    //         }
    //     }

    //     public getIsChildrenCreated(): boolean {
    //         return this._isChildrenCreated;
    //     }
    //     private _setIsChildrenCreated(isCreated: boolean): void {
    //         this._isChildrenCreated = isCreated;

    //         if (isCreated) {
    //             this.dispatchEventWith(EVENT_PANEL_CHILDREN_CREATED);
    //         }
    //     }

    //     public getIsSkinLoaded(): boolean {
    //         return this._isSkinLoaded;
    //     }
    //     private _setIsSkinLoaded(isLoaded: boolean): void {
    //         this._isSkinLoaded = isLoaded;

    //         if (isLoaded) {
    //             this.dispatchEventWith(EVENT_PANEL_SKIN_LOADED);
    //         }
    //     }

    //     public setPanelConfig(config: PanelConfig<OpenData>): void {
    //         this._panelConfig = config;
    //     }
    //     public getPanelConfig(): PanelConfig<OpenData> {
    //         return Helpers.getExisted(this._panelConfig);
    //     }

    //     ////////////////////////////////////////////////////////////////////////////////
    //     // Functions for open self.
    //     ////////////////////////////////////////////////////////////////////////////////
    //     public async initOnOpening(openData: OpenData): Promise<void> {
    //         this._setOpenData(openData);
    //         if (!this._checkIsReadyForOpen()) {
    //             throw Helpers.newError(`UiPanel2.initOnOpening() !this._checkIsReadyForOpen().`);
    //         }

    //         const stage = StageManager.getStage();
    //         this.resize(stage.stageWidth, stage.stageHeight);
    //         this._resetSoundForCommonButtons();
    //         this._onOpening();
    //         this._registerListeners();
    //         this._resetTouchMask();
    //         this._showOpenAnimation();

    //         await this._updateOnOpenDataChanged();
    //     }
    //     protected _onOpening(): void {
    //         // to be overridden
    //     }

    //     protected _showOpenAnimation(): void {
    //         // to be overridden
    //     }

    //     private _setOpenData(data: OpenData): void {
    //         this._openData = data;
    //         this._setHasSetOpenData(true);
    //     }
    //     private _deleteOpenData(): void {
    //         delete this._openData;
    //         this._setHasSetOpenData(false);
    //     }
    //     protected _getOpenData(): OpenData {
    //         return Helpers.getDefined(this._openData, ClientErrorCode.UiPanel_GetOpenData_00);
    //     }
    //     public async updateWithOpenData(openData: OpenData): Promise<void> {
    //         if (!this._checkIsReadyForOpen()) {
    //             throw Helpers.newError(`UiPanel2.updateWithOpenData() !this._checkIsReadyForOpen().`);
    //         }

    //         this._setOpenData(openData);
    //         await this._updateOnOpenDataChanged();
    //     }
    //     protected async _updateOnOpenDataChanged(): Promise<void> {
    //         // to be overridden
    //     }

    //     private _getHasSetOpenData(): boolean {
    //         return this._hasSetOpenData;
    //     }
    //     private _setHasSetOpenData(hasSet: boolean): void {
    //         this._hasSetOpenData = hasSet;
    //     }

    //     private _checkIsReadyForOpen(): boolean {
    //         return (this.stage != null)
    //             && (this.getIsChildrenCreated())
    //             && (this.getIsSkinLoaded())
    //             && (this._getHasSetOpenData());
    //     }

    //     ////////////////////////////////////////////////////////////////////////////////
    //     // Functions for close self.
    //     ////////////////////////////////////////////////////////////////////////////////
    //     public close(): void {
    //         TwnsPanelManager.close(this.getPanelConfig());
    //     }

    //     public clearOnClosing(): void {
    //         this._unregisterListeners();
    //         this._setUiListenerArray(null);
    //         this._setNotifyListenerArray(null);
    //         this._setCallbackOnTouchedMask(null);
    //         this._setIsTouchMaskCallbackEnabled(false);
    //         this._deleteOpenData();

    //         this._onClosing();
    //         this._showCloseAnimation();
    //     }
    //     protected _onClosing(): void {
    //         // to be overridden
    //     }

    //     /**
    //      * 子类覆盖方法也不能使用promise，否则会有内存泄漏。
    //      * 在动画播放正常结束时必须调用_onCloseAnimationEnded()
    //      */
    //     protected _showCloseAnimation(): void {
    //         this._onCloseAnimationEnded();
    //     }
    //     protected _onCloseAnimationEnded(): void {
    //         this.dispatchEventWith(EVENT_PANEL_CLOSE_ANIMATION_ENDED);
    //     }
    //     public stopCloseAnimation(): void {
    //         // can be overridden
    //         egret.Tween.removeTweens(this);
    //     }

    //     ////////////////////////////////////////////////////////////////////////////////
    //     // Auto resize.
    //     ////////////////////////////////////////////////////////////////////////////////
    //     public resize(stageWidth: number, stageHeight: number): void {
    //         this.width  = stageWidth;
    //         this.height = stageHeight;

    //         const mask = this._touchMask;
    //         if (mask) {
    //             mask.width  = stageWidth;
    //             mask.height = stageHeight;
    //         }
    //     }

    //     ////////////////////////////////////////////////////////////////////////////////
    //     // Touch mask.
    //     ////////////////////////////////////////////////////////////////////////////////
    //     protected _setIsTouchMaskEnabled(enabled = true): void {
    //         this._isTouchMaskEnabled = enabled;
    //         this._resetTouchMask();
    //     }
    //     protected _getIsTouchMaskEnabled(): boolean {
    //         return this._isTouchMaskEnabled;
    //     }
    //     private _resetTouchMask(): void {
    //         if (!this._getIsTouchMaskEnabled()) {
    //             const mask = this._touchMask;
    //             if (mask) {
    //                 mask.removeEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedTouchMask, this);
    //                 (mask.parent) && (mask.parent.removeChild(mask));
    //             }

    //         } else {
    //             if (!this._touchMask) {
    //                 const newMask           = new eui.Group();
    //                 const stage             = StageManager.getStage();
    //                 newMask.width           = stage.stageWidth;
    //                 newMask.height          = stage.stageHeight;
    //                 newMask.touchEnabled    = true;
    //                 newMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedTouchMask, this);
    //                 this._touchMask = newMask;
    //             }
    //             this.addChildAt(this._touchMask, 0);
    //         }

    //         this._setIsTouchMaskCallbackEnabled(true);
    //     }

    //     private _setIsTouchMaskCallbackEnabled(isEnabled: boolean): void {
    //         this._isTouchMaskCallbackEnabled = isEnabled;
    //     }
    //     private _getIsTouchMaskCallbackEnabled(): boolean {
    //         return this._isTouchMaskCallbackEnabled;
    //     }

    //     protected _setIsCloseOnTouchedMask(isClose = true): void {
    //         this._isCloseOnTouchedMask = isClose;
    //     }
    //     protected _getIsCloseOnTouchedMask(): boolean {
    //         return this._isCloseOnTouchedMask;
    //     }
    //     protected _setCallbackOnTouchedMask(callback: (() => void) | null): void {
    //         this._callbackOnTouchedMask = callback;
    //     }
    //     protected _getCallbackOnTouchedMask(): (() => void) | null {
    //         return this._callbackOnTouchedMask;
    //     }
    //     private _onTouchedTouchMask(): void {
    //         if (!this._getIsTouchMaskCallbackEnabled()) {
    //             return;
    //         }

    //         const callback = this._getCallbackOnTouchedMask();
    //         if (callback) {
    //             callback();
    //         }

    //         if (this._getIsCloseOnTouchedMask()) {
    //             SoundManager.playShortSfx(Types.ShortSfxCode.ButtonCancel01);
    //             this.close();
    //         }
    //     }

    //     ////////////////////////////////////////////////////////////////////////////////
    //     // Utils.
    //     ////////////////////////////////////////////////////////////////////////////////
    //     private _resetSoundForCommonButtons(): void {
    //         for (const name of NAMES_FOR_BUTTON_CLOSE) {
    //             const btn = (this as any)[name];
    //             if (btn instanceof TwnsUiButton.UiButton) {
    //                 btn.setShortSfxCode(Types.ShortSfxCode.ButtonCancel01);
    //             }
    //         }
    //         for (const name of NAMES_FOR_BUTTON_CONFIRM) {
    //             const btn = (this as any)[name];
    //             if (btn instanceof TwnsUiButton.UiButton) {
    //                 btn.setShortSfxCode(Types.ShortSfxCode.ButtonConfirm01);
    //             }
    //         }
    //     }

    //     protected _setNotifyListenerArray(array: Notify.Listener[] | null): void {
    //         this._notifyListenerArray = array;
    //     }
    //     protected _getNotifyListenerArray(): Notify.Listener[] | null {
    //         return this._notifyListenerArray;
    //     }
    //     protected _setUiListenerArray(array: UiListener[] | null): void {
    //         this._uiListenerArray = array;
    //     }
    //     protected _getUiListenerArray(): UiListener[] | null {
    //         return this._uiListenerArray;
    //     }

    //     protected _registerListeners(): void {
    //         const notifyListenerArray = this._getNotifyListenerArray();
    //         if (notifyListenerArray) {
    //             Notify.addEventListeners(notifyListenerArray, this);
    //         }

    //         const uiListenerArray = this._getUiListenerArray();
    //         if (uiListenerArray) {
    //             for (const l of uiListenerArray) {
    //                 l.ui.addEventListener(l.eventType || egret.TouchEvent.TOUCH_TAP, l.callback, l.thisObject || this);
    //             }
    //         }
    //     }

    //     protected _unregisterListeners(): void {
    //         const notifyListenerArray = this._getNotifyListenerArray();
    //         if (notifyListenerArray) {
    //             Notify.removeEventListeners(notifyListenerArray, this);
    //         }

    //         const uiListenerArray = this._getUiListenerArray();
    //         if (uiListenerArray) {
    //             for (const l of uiListenerArray) {
    //                 l.ui.removeEventListener(l.eventType || egret.TouchEvent.TOUCH_TAP, l.callback, l.thisObject || this);
    //             }
    //         }
    //     }
    // }
}

// export default TwnsUiPanel2;
