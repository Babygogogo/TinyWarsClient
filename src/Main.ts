
import "./gameui/UiScrollList";
import "./gameui/UiButton";
import "./gameui/UiTextInput";
import "./gameui/UiZoomableMap";
import "./gameui/UiTab";
import "./gameui/UiCoInfo";
import "./gameui/UiMapInfo";
import "./gameui/UiRadioButton";
import * as FlowManager from "./utility/FlowManager";

// export declare interface Window {
//     CLIENT_VERSION      : string;
//     GAME_SERVER_PORT    : number;
//     browser             : any;
//     Main                : typeof egret.DisplayObject;
//     JSONParseClass      : {
//         setData : (data: any) => void;
//     };
// }

declare global {
    interface Window {
        CLIENT_VERSION      : string;
        GAME_SERVER_PORT    : number;
        browser             : any;
        Main                : typeof egret.DisplayObject;
        JSONParseClass      : {
            setData : (data: any) => void;
        }
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();

        this.once(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
    }

    private _onAddedToStage(event: egret.Event): void {
        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {
                // nothing to do
            };
        });
        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        };
        egret.lifecycle.onResume = () => {
            // egret.ticker.resume();
        };

        FlowManager.startGame(this.stage);
    }
}
