
import * as Types           from "./Types";
import * as CommonConstants from "./CommonConstants";
import * as Notify          from "./Notify";
import { NotifyType } from "./NotifyType";
import * as Logger          from "./Logger";
import * as UiPanel         from "../gameui/UiPanel";
import LayerType            = Types.LayerType;

// The game is in landscape mode, which means that its design max height equals its design width, 960.
const DESIGN_WIDTH         = 960;
const DESIGN_MIN_HEIGHT    = 540;
const DESIGN_MAX_HEIGHT    = DESIGN_WIDTH;
const RATIO_FOR_MIN_HEIGHT = DESIGN_WIDTH / DESIGN_MIN_HEIGHT;

let   _stage        : egret.Stage;
let   _mouseX       : number;
let   _mouseY       : number;
let   _stageScale   = CommonConstants.StageMinScale;
const _LAYERS       = new Map<LayerType, UiLayer>();

export function init(stg: egret.Stage): void {
    _stage = stg;

    if (!egret.Capabilities.isMobile) {
        mouse.enable(_stage);
        mouse.setMouseMoveEnabled(true);
        _stage.addEventListener(mouse.MouseEvent.MOUSE_MOVE,  _onMouseMove,  undefined);
        _stage.addEventListener(mouse.MouseEvent.MOUSE_WHEEL, _onMouseWheel, undefined);
    }
    stg.addEventListener(egret.TouchEvent.TOUCH_BEGIN,  _onTouchBegin,  undefined);
    stg.addEventListener(egret.TouchEvent.TOUCH_MOVE,   _onTouchMove,   undefined);

    if (!egret.Capabilities.isMobile) {
        stg.orientation = egret.OrientationMode.AUTO;
    }
    egret.sys.screenAdapter = new ScreenAdapter();
    _stage.setContentSize(_stage.stageWidth, _stage.stageHeight);

    _addLayer(LayerType.Bottom);
    _addLayer(LayerType.Scene);
    _addLayer(LayerType.Hud0);
    _addLayer(LayerType.Hud1);
    _addLayer(LayerType.Hud2);
    _addLayer(LayerType.Hud3);
    _addLayer(LayerType.Notify0);
    _addLayer(LayerType.Notify1);
    _addLayer(LayerType.Notify2);
    _addLayer(LayerType.Top);
}

export function getStage(): egret.Stage {
    return _stage;
}

export function getDesignWidth(): number {
    return DESIGN_WIDTH;
}
export function getDesignMinHeight(): number {
    return DESIGN_MIN_HEIGHT;
}
export function getDesignMaxHeight(): number {
    return DESIGN_MAX_HEIGHT;
}
export function getRatioForMinHeight(): number {
    return RATIO_FOR_MIN_HEIGHT;
}

export function getMouseX(): number {
    return _mouseX;
}
export function getMouseY(): number {
    return _mouseY;
}

export function getLayer(layer: LayerType): UiLayer | undefined {
    return _LAYERS.get(layer);
}

export function setStageScale(scale: number): void {
    const s = Math.min(Math.max(CommonConstants.StageMinScale, scale), CommonConstants.StageMaxScale);
    if (getStageScale() !== s) {
        _stageScale = s;

        egret.updateAllScreens();
    }
}
export function getStageScale(): number {
    return _stageScale;
}

export function closeAllPanels(): void {
    for (const [, layer] of _LAYERS) {
        layer.closeAllPanels();
    }
}

function _addLayer(layerType: LayerType): void {
    if (_LAYERS.has(layerType)) {
        Logger.error(`StageManager._addLayer() duplicated layer: ${layerType}.`);
        return;
    }

    const layer = new UiLayer();
    _LAYERS.set(layerType, layer);
    getStage().addChild(layer);
}

function _onMouseMove(e: egret.TouchEvent): void {
    _mouseX = e.stageX;
    _mouseY = e.stageY;
}
function _onMouseWheel(e: egret.Event): void {
    Notify.dispatch(NotifyType.MouseWheel, e.data);
}

function _onTouchBegin(e: egret.TouchEvent): void {
    Notify.dispatch(NotifyType.GlobalTouchBegin, e);
}
function _onTouchMove(e: egret.TouchEvent): void {
    Notify.dispatch(NotifyType.GlobalTouchMove, e);
}

class UiLayer extends eui.UILayer {
    public constructor() {
        super();

        this.touchEnabled = false;
        this.addEventListener(egret.Event.RESIZE, this._onResize, this);
    }

    public closeAllPanels<T>(except?: UiPanel.UiPanel<T>): void {
        for (let i = this.numChildren - 1; i >= 0; --i) {
            const child = this.getChildAt(i);
            if ((child instanceof UiPanel.UiPanel) && (child !== except)) {
                child.close();
            }
        }
    }

    private _onResize(): void {
        const height    = this.height;
        const width     = this.width;
        for (let i = 0; i < this.numChildren; ++i) {
            const child = this.getChildAt(i);
            if (child instanceof UiPanel.UiPanel) {
                child.resize(width, height);
            }
        }
    }
}

class ScreenAdapter implements egret.sys.IScreenAdapter {
    public calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number): egret.sys.StageDisplaySize {
        // const currRatio = screenWidth / screenHeight;
        // if (currRatio > RATIO_FOR_MIN_HEIGHT) {
        //     return {
        //         stageWidth   : DESIGN_WIDTH,
        //         stageHeight  : DESIGN_MIN_HEIGHT,
        //         displayWidth : screenHeight * RATIO_FOR_MIN_HEIGHT,
        //         displayHeight: screenHeight,
        //     };
        // } else {
        //     return {
        //         stageWidth   : DESIGN_WIDTH,
        //         stageHeight  : screenHeight / screenWidth * DESIGN_WIDTH,
        //         displayWidth : screenWidth,
        //         displayHeight: screenHeight,
        //     };
        // }

        const scaler = getStageScale() / 100;
        if (screenWidth / screenHeight > RATIO_FOR_MIN_HEIGHT) {
            // 屏幕高度不足
            return {
                stageWidth      : reviseStageDisplaySize(DESIGN_MIN_HEIGHT * screenWidth / screenHeight * scaler),
                stageHeight     : reviseStageDisplaySize(DESIGN_MIN_HEIGHT * scaler),
                displayWidth    : reviseStageDisplaySize(screenWidth),
                displayHeight   : reviseStageDisplaySize(screenHeight),
            };
        } else {
            // 屏幕高度充足
            return {
                stageWidth      : reviseStageDisplaySize(DESIGN_WIDTH * scaler),
                stageHeight     : reviseStageDisplaySize(DESIGN_WIDTH * screenHeight / screenWidth * scaler),
                displayWidth    : reviseStageDisplaySize(screenWidth),
                displayHeight   : reviseStageDisplaySize(screenHeight),
            };
        }
    }
}

function reviseStageDisplaySize(num: number): number {
    // 宽高不是2的整数倍会导致图片绘制出现问题
    num = Math.floor(num);
    return (num % 2 === 0) ? num : num + 1;
}
