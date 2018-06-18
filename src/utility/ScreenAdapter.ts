
namespace Utility {
    // The game is in landscape mode, which means that its design max height equals its design width, 960.
    const DESIGN_WIDTH        : number = 960;
    const DESIGN_MIN_HEIGHT   : number = 480;
    const RATIO_FOR_MIN_HEIGHT: number = DESIGN_WIDTH / DESIGN_MIN_HEIGHT;

    export class ScreenAdapter implements egret.sys.IScreenAdapter {
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
