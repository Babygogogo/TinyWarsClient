
namespace Utility {
    export namespace StageManager {
        import LayerType = Types.LayerType;
        // The game is in landscape mode, which means that its design max height equals its design width, 960.
        export const DESIGN_WIDTH         = 960;
        export const DESIGN_MIN_HEIGHT    = 480;
        export const DESIGN_MAX_HEIGHT    = DESIGN_WIDTH;
        export const RATIO_FOR_MIN_HEIGHT = DESIGN_WIDTH / DESIGN_MIN_HEIGHT;

        let   stage : egret.Stage;
        let   mouseX: number;
        let   mouseY: number;
        const layers: { [layerType: number]: UiLayer } = {};

        export function init(stg: egret.Stage): void {
            stage = stg;

            if (!egret.Capabilities.isMobile) {
                mouse.enable(stage);
                mouse.setMouseMoveEnabled(true);
                stage.addEventListener(mouse.MouseEvent.MOUSE_MOVE,  _onMouseMove,  StageManager);
                stage.addEventListener(mouse.MouseEvent.MOUSE_WHEEL, _onMouseWheel, StageManager);
            }

            egret.sys.screenAdapter = new ScreenAdapter();
            stage.setContentSize(stage.stageWidth, stage.stageHeight);

            _addLayer(LayerType.Bottom);
            _addLayer(LayerType.Scene);
            _addLayer(LayerType.Hud0);
            _addLayer(LayerType.Hud1);
            _addLayer(LayerType.Notify);
            _addLayer(LayerType.Top);
        }

        export function getStage(): egret.Stage {
            return stage;
        }

        export function getMouseX(): number {
            return mouseX;
        }

        export function getMouseY(): number {
            return mouseY;
        }

        export function getLayer(layer: LayerType): UiLayer {
            return layers[layer];
        }

        export function gotoLogin(): void {
            _closeAllPanels();
            Login.LoginBackgroundPanel.open();
            Login.LoginPanel.open();
        }
        export function gotoLobby(): void {
            _closeAllPanels();
            Lobby.LobbyPanel.open();
            Lobby.LobbyTopPanel.open();
        }

        function _closeAllPanels(): void {
            for (const t in layers) {
                layers[t].closeAllPanels();
            }
        }

        function _addLayer(layerType: LayerType): void {
            egret.assert(!layers[layerType], "LayerManager.addLayer() duplicated layer: " + layerType);
            layers[layerType] = new UiLayer();
            StageManager.getStage().addChild(layers[layerType]);
        }

        function _onMouseMove(e: egret.TouchEvent): void {
            mouseX = e.stageX;
            mouseY = e.stageY;
        }

        function _onMouseWheel(e: egret.Event): void {
            Notify.dispatch(Notify.Type.MouseWheel, e.data);
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
