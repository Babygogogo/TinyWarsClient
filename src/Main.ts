
declare interface Window {
    CLIENT_VERSION  : string;
    GAME_SERVER_PORT: number;
    browser         : any;
    Main            : typeof egret.DisplayObject;
}

class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();

        this.once(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
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

window.Main = Main;
