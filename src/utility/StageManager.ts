
namespace TinyWars.Utility {
    export namespace StageManager {
        import LayerType = Types.LayerType;
        // The game is in landscape mode, which means that its design max height equals its design width, 960.
        export const DESIGN_WIDTH         = 960;
        export const DESIGN_MIN_HEIGHT    = 400;
        export const DESIGN_MAX_HEIGHT    = DESIGN_WIDTH;
        export const RATIO_FOR_MIN_HEIGHT = DESIGN_WIDTH / DESIGN_MIN_HEIGHT;

        let   _stage    : egret.Stage;
        let   _mouseX   : number;
        let   _mouseY   : number;
        const _LAYERS   = new Map<LayerType, UiLayer>();

        export function init(stg: egret.Stage): void {
            _stage = stg;

            if (!egret.Capabilities.isMobile) {
                mouse.enable(_stage);
                mouse.setMouseMoveEnabled(true);
                _stage.addEventListener(mouse.MouseEvent.MOUSE_MOVE,  _onMouseMove,  StageManager);
                _stage.addEventListener(mouse.MouseEvent.MOUSE_WHEEL, _onMouseWheel, StageManager);
            }
            stg.addEventListener(egret.TouchEvent.TOUCH_BEGIN,  _onTouchBegin,  StageManager);
            stg.addEventListener(egret.TouchEvent.TOUCH_MOVE,   _onTouchMove,   StageManager);

            egret.sys.screenAdapter = new ScreenAdapter();
            _stage.setContentSize(_stage.stageWidth, _stage.stageHeight);

            _addLayer(LayerType.Bottom);
            _addLayer(LayerType.Scene);
            _addLayer(LayerType.Hud0);
            _addLayer(LayerType.Hud1);
            _addLayer(LayerType.Hud2);
            _addLayer(LayerType.Hud3);
            _addLayer(LayerType.Notify);
            _addLayer(LayerType.Top);
        }

        export function getStage(): egret.Stage {
            return _stage;
        }

        export function getMouseX(): number {
            return _mouseX;
        }

        export function getMouseY(): number {
            return _mouseY;
        }

        export function getLayer(layer: LayerType): UiLayer {
            return _LAYERS.get(layer);
        }

        export function closeAllPanels(): void {
            for (const [, layer] of _LAYERS) {
                layer.closeAllPanels();
            }
        }

        function _addLayer(layerType: LayerType): void {
            egret.assert(!_LAYERS.has(layerType), "LayerManager.addLayer() duplicated layer: " + layerType);
            _LAYERS.set(layerType, new UiLayer());
            StageManager.getStage().addChild(_LAYERS.get(layerType));
        }

        function _onMouseMove(e: egret.TouchEvent): void {
            _mouseX = e.stageX;
            _mouseY = e.stageY;
        }
        function _onMouseWheel(e: egret.Event): void {
            Notify.dispatch(Notify.Type.MouseWheel, e.data);
        }

        function _onTouchBegin(e: egret.TouchEvent): void {
            Notify.dispatch(Notify.Type.GlobalTouchBegin, e);
        }
        function _onTouchMove(e: egret.TouchEvent): void {
            Notify.dispatch(Notify.Type.GlobalTouchMove, e);
        }
    }

    class UiLayer extends eui.UILayer {
        public constructor() {
            super();

            this.touchEnabled = false;
            this.addEventListener(egret.Event.RESIZE, this._onResize, this);
        }

        public closeAllPanels(execpt?: GameUi.UiPanel): void {
            for (let i = this.numChildren - 1; i >= 0; --i) {
                const child = this.getChildAt(i);
                if ((child instanceof GameUi.UiPanel) && (child !== execpt)) {
                    child.close();
                }
            }
        }

        private _onResize(e: egret.Event): void {
            const height = this.height;
            for (let i = 0; i < this.numChildren; ++i) {
                const child = this.getChildAt(i);
                if ((child instanceof GameUi.UiPanel) && (child.checkIsAutoAdjustHeight())) {
                    child.height = height;
                }
            }
        }
    }

    class ScreenAdapter implements egret.sys.IScreenAdapter {
        public calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): egret.sys.StageDisplaySize {
            const currRatio = screenWidth / screenHeight;
            if (currRatio > StageManager.RATIO_FOR_MIN_HEIGHT) {
                return {
                    stageWidth   : StageManager.DESIGN_WIDTH,
                    stageHeight  : StageManager.DESIGN_MIN_HEIGHT,
                    displayWidth : screenHeight * StageManager.RATIO_FOR_MIN_HEIGHT,
                    displayHeight: screenHeight,
                };
            } else {
                return {
                    stageWidth   : StageManager.DESIGN_WIDTH,
                    stageHeight  : screenHeight / screenWidth * StageManager.DESIGN_WIDTH,
                    displayWidth : screenWidth,
                    displayHeight: screenHeight,
                };
            }
        }
    }
}
