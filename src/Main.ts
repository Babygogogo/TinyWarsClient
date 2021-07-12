
import "./utility/ui/UiScrollList";
import "./utility/ui/UiButton";
import "./utility/ui/UiTextInput";
import "./utility/ui/UiZoomableMap";
import "./utility/ui/UiTab";
import "./utility/ui/UiCoInfo";
import "./utility/ui/UiMapInfo";
import "./utility/ui/UiRadioButton";
import { FlowManager }  from "./utility/FlowManager";

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
