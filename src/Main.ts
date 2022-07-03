
// import "./modules/tools/ui/UiScrollList";
// import "./modules/tools/ui/UiButton";
// import "./modules/tools/ui/UiTextInput";
// import "./modules/tools/ui/UiZoomableMap";
// import "./modules/tools/ui/UiTab";
// import "./modules/tools/ui/UiCoInfo";
// import "./modules/tools/ui/UiMapInfo";
// import "./modules/tools/ui/UiRadioButton";
// import FlowManager from "./modules/tools/helpers/FlowManager";

// declare global {
//     interface Window {
//         CLIENT_VERSION      : string;
//         GAME_SERVER_PORT    : number;
//         browser             : any;
//         Main                : typeof egret.DisplayObject;
//         JSONParseClass      : {
//             setData : (data: any) => void;
//         }
//     }
// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare interface Window {
    CLIENT_VERSION      : string;
    GAME_SERVER_PORT    : number;
    RES_HASH_DICT_PATH? : string;
    browser             : any;
    Main                : typeof egret.DisplayObject;
    JSONParseClass      : {
        setData : (data: any) => void;
    };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class Main extends egret.DisplayObjectContainer {
    public constructor() {
        super();

        this.once(egret.Event.ADDED_TO_STAGE, this._onAddedToStage, this);
    }

    private _onAddedToStage(): void {
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

        Twns.FlowManager.startGame(this.stage);
    }
}

window.Main = Main;
