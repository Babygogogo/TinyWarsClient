
namespace GameUi {
    export namespace StageManager {
        // The game is in landscape mode, which means that its design max height equals its design width, 960.
        export const DESIGN_WIDTH         = 960;
        export const DESIGN_MIN_HEIGHT    = 480;
        export const DESIGN_MAX_HEIGHT    = DESIGN_WIDTH;
        export const RATIO_FOR_MIN_HEIGHT = DESIGN_WIDTH / DESIGN_MIN_HEIGHT;

        let stage: egret.Stage;

        export function init(stg: egret.Stage): void {
            stage = stg;

            egret.sys.screenAdapter = new ScreenAdapter();
            stage.setContentSize(stage.stageWidth, stage.stageHeight);

            stage.addEventListener(egret.Event.RESIZE, _onResize, StageManager);
        }

        export function getStage(): egret.Stage {
            return stage;
        }

        function _onResize(e: egret.Event): void {
            LayerManager.resize();
        }

        class ScreenAdapter implements egret.sys.IScreenAdapter {
            public calculateStageSize(scaleMode: string, screenWidth: number, screenHeight: number, contentWidth: number, contentHeight: number): egret.sys.StageDisplaySize {
                const currRatio = screenWidth / screenHeight;
                if (currRatio > RATIO_FOR_MIN_HEIGHT) {
                    return {
                        stageWidth: DESIGN_WIDTH,
                        stageHeight: DESIGN_MIN_HEIGHT,
                        displayWidth: screenHeight * RATIO_FOR_MIN_HEIGHT,
                        displayHeight: screenHeight,
                    };
                } else {
                    return {
                        stageWidth: DESIGN_WIDTH,
                        stageHeight: screenHeight / screenWidth * DESIGN_WIDTH,
                        displayWidth: screenWidth,
                        displayHeight: screenHeight,
                    };
                }
            }
        }
    }
}
