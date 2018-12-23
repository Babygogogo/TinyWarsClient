
namespace TinyWars.Utility {
    export namespace FloatText {
        const SHOW_TIME_MS = 3000;
        const LOCK_TIME_MS = 480;
        const START_Y      = 120;
        const END_Y        = 0;

        const dataList        : string[] = [];
        let   timeoutIdForLock: number;

        export function show(text: string): void {
            dataList.push(text);
            if (timeoutIdForLock == null) {
                showFloatText();
            }
        }

        function showFloatText(): void {
            if ((dataList.length > 0) && (timeoutIdForLock == null)) {
                timeoutIdForLock = egret.setTimeout(onTimerComplete, FloatText, LOCK_TIME_MS);

                const floatText = new UiFloatText(dataList.splice(0, 1)[0]);
                StageManager.getLayer(Types.LayerType.Notify).addChild(floatText);
                floatText.y      = START_Y;
                floatText.scaleX = 0.5;
                floatText.scaleY = 0.5;
                egret.Tween.get(floatText)
                    .to({ scaleX: 1, scaleY: 1 }, 100)
                    .wait(SHOW_TIME_MS - 100 - 100)
                    .to({ alpha: 0}, 100);
                egret.Tween.get(floatText)
                    .to({ y: END_Y }, SHOW_TIME_MS)
                    .call(() => {
                        (floatText.parent) && (floatText.parent.removeChild(floatText));
                    });
            }
        }

        function onTimerComplete(e: egret.TimerEvent): void {
            timeoutIdForLock = undefined;
            showFloatText();
        }

        class UiFloatText extends eui.Component {
            public constructor(text: string) {
                super();

                const label = new GameUi.UiLabel(text);
                label.textColor = 0xFFFFFF;
                label.stroke    = 2;
                label.size      = 20;
                this.addChild(label);

                this.horizontalCenter = 0;
                this.touchEnabled     = false;
                this.touchChildren    = false;
                this.width            = label.width;
                this.height           = label.height;
            }
        }
    }
}
