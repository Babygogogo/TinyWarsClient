
import Helpers          from "../helpers/Helpers";
import Logger           from "../helpers/Logger";
import SoundManager     from "../helpers/SoundManager";
import StageManager     from "../helpers/StageManager";
import Types            from "../helpers/Types";
import TwnsUiButton     from "./UiButton";
import TwnsUiComponent  from "./UiComponent";

namespace TwnsUiPanel {
    const NAMES_FOR_BUTTON_CONFIRM = [
        `_btnConfirm`,
    ];
    const NAMES_FOR_BUTTON_CLOSE = [
        `_btnClose`,
        `_btnCancel`,
        `_btnBack`,
    ];

    export abstract class UiPanel<OpenData> extends TwnsUiComponent.UiComponent {
        protected abstract readonly _LAYER_TYPE  : Types.LayerType;
        protected abstract readonly _IS_EXCLUSIVE: boolean;

        private _isRunningClose         = false;
        private _cachedOpenFunc         : (() => void) | null = null;

        private _isTouchMaskEnabled     = false;
        private _isCloseOnTouchedMask   = false;
        private _callbackOnTouchedMask  : (() => void) | null = null;
        private _touchMask?             : eui.Group;

        private _openData               : OpenData | null = null;

        protected constructor() {
            super();

            this.touchEnabled = false;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for open self.
        ////////////////////////////////////////////////////////////////////////////////
        public open(openData: OpenData): void {
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

            const layer = StageManager.getLayer(this._LAYER_TYPE);
            (this._IS_EXCLUSIVE) && (layer.closeAllPanels(this));
            (!this.parent) && (layer.addChild(this));

            this._doOpen();
        }

        protected _doOpen(): void {
            if (!this._checkIsReadyForOpen()) {
                return;
            }

            if (!this.getIsOpening()) {
                Logger.warn("Panel opened: " + this.skinName);
                this._setIsOpening(true);
                this._resetSoundForCommonButtons();

                const stage = StageManager.getStage();
                this._onOpened();
                this._registerListeners();
                this.resize(stage.stageWidth, stage.stageHeight);
                this._handleTouchMask();
            }
        }

        private _setOpenData(data: OpenData | null): void {
            this._openData = data;
        }
        protected _getOpenData(): OpenData {
            return Helpers.getExisted(this._openData);
        }

        private _setCachedOpenFunc(func: (() => void) | null): void {
            this._cachedOpenFunc = func;
        }
        private _getCachedOpenFunc(): (() => void) | null {
            return this._cachedOpenFunc;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for close self.
        ////////////////////////////////////////////////////////////////////////////////
        public async close(): Promise<void> {
            if (!this.getIsOpening()) {
                return;
            }

            this._setCachedOpenFunc(null);

            if (this._getIsRunningClose()) {
                return;
            }
            this._setIsRunningClose(true);

            await this._doClose();
            (this.parent) && (this.parent.removeChild(this));
            this._setOpenData(null);

            this._setIsRunningClose(false);

            const func = this._getCachedOpenFunc();
            if (func) {
                this._setCachedOpenFunc(null);

                Logger.warn(`%cUiPanel.close() calling cached open func: ${this.skinName}`, `background:#FFDDDD;`);
                func();
            }
        }

        protected async _doClose(): Promise<void> {
            if (this.getIsOpening()) {
                this._setIsOpening(false);

                this._unregisterListeners();
                this._setUiListenerArray(null);
                this._setNotifyListenerArray(null);
                this._setCallbackOnTouchedMask(null);
                await this._onClosed();
            }
        }

        private _getIsRunningClose(): boolean {
            return this._isRunningClose;
        }
        private _setIsRunningClose(isRunning: boolean): void {
            this._isRunningClose = isRunning;
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
                    const newMask           = new eui.Group();
                    const stage             = StageManager.getStage();
                    newMask.width           = stage.stageWidth;
                    newMask.height          = stage.stageHeight;
                    newMask.touchEnabled    = true;
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
    }
}

export default TwnsUiPanel;
