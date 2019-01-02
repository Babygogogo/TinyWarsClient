
class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();

        this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
    }

    private _onAddedToStage(event: egret.Event): void {
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {
            }
        })
        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        }
        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
        }

        TinyWars.Utility.FlowManager.startGame(this.stage);
    }
}
