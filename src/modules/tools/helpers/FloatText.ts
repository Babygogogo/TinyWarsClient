
// import TwnsUiLabel  from "../ui/UiLabel";
// import Helpers      from "./Helpers";
// import StageManager from "./StageManager";
// import Types        from "./Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.FloatText {
    const SHOW_TIME_MS      = 3000;
    const LOCK_TIME_MS      = 480;
    const START_Y           = 120;
    const END_Y             = 0;
    const MAX_CACHE_COUNT   = 4;

    const _dataArray        : string[] = [];
    let   _timeoutIdForLock : number | null = null;

    export function show(text: string): void {
        _dataArray.push(text);
        const exceedCount = _dataArray.length - MAX_CACHE_COUNT;
        (exceedCount > 0) && (_dataArray.splice(0, exceedCount));

        if (_timeoutIdForLock == null) {
            showFloatText();
        }
    }

    function showFloatText(): void {
        if ((_dataArray.length > 0) && (_timeoutIdForLock == null)) {
            _timeoutIdForLock = egret.setTimeout(onTimerComplete, null, LOCK_TIME_MS);

            const layer     = Twns.StageManager.getLayer(Types.LayerType.Notify2);
            const floatText = new UiFloatText(_dataArray.splice(0, 1)[0]);
            layer.addChild(floatText);
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

    function onTimerComplete(): void {
        _timeoutIdForLock = null;
        showFloatText();
    }

    class UiFloatText extends eui.Component {
        public constructor(text: string) {
            super();

            const label     = new TwnsUiLabel.UiLabel();
            label.textColor = 0xFFFFFF;
            label.stroke    = 2;
            label.size      = 20;
            label.setRichText(text);
            this.addChild(label);

            this.horizontalCenter = 0;
            this.touchEnabled     = false;
            this.touchChildren    = false;
            this.width            = label.width;
            this.height           = label.height;
        }
    }
}

// export default FloatText;
