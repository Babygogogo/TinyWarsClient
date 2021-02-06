
namespace TinyWars.Utility {
    export namespace ResManager {
        let _isLoadedMainResource = false;

        export async function init(): Promise<void> {
            egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
            egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

            await RES.loadConfig("resource/default.res.json", "resource/");
            await _initTheme();
            // await RES.loadGroup("preload", 0, LoadingUiPanel.create());
            // LoadingUiPanel.destroy();
        }

        export function loadMainRes(): Promise<void> {
            return new Promise<void>((resolve, reject) => {
                RES.loadGroup("main").then(
                    () => {
                        _isLoadedMainResource = true;
                        resolve();
                    },
                    (reason) => {
                        Logger.error("ResManager.loadMainRes() error! ", reason);
                        FloatText.show("Error loading main resource! " + reason);
                        reject();
                    }
                );
            });
        }

        export function checkIsLoadedMainResource(): boolean {
            return _isLoadedMainResource;
        }

        function _initTheme(): Promise<void> {
            return new Promise<void>((resolve, reject): void => {
                new eui.Theme("resource/default.thm.json", StageManager.getStage())
                    .once(eui.UIEvent.COMPLETE, resolve, undefined);
            });
        }
    }

    declare const generateEUI : { paths: string[], skins: any };
    declare const generateEUI2: { paths: string[], skins: any };

    class AssetAdapter implements eui.IAssetAdapter {
        public getAsset(source: string, callback: (data: any, source: string) => void, thisObject: any): void {
            if (!RES.hasRes(source)) {
                RES.getResByUrl(source, callback, this, RES.ResourceItem.TYPE_IMAGE);
            } else {
                const data = RES.getRes(source);
                if (data) {
                    callback(data, source);
                } else {
                    RES.getResAsync(source, callback, thisObject);
                }
            }
        }
    }

    class ThemeAdapter implements eui.IThemeAdapter {
        public getTheme(url: string, onSuccess: Function, onError: Function, thisObject: any): void {
            if (typeof generateEUI != "undefined") {
                egret.callLater(() => {
                    onSuccess.call(thisObject, generateEUI);
                }, this);
            } else {
                const onResGet = function (e: string): void {
                    onSuccess.call(thisObject, e);
                }
                const onResError = function (e: RES.ResourceEvent): void {
                    if (e.resItem.url == url) {
                        RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
                        onError.call(thisObject);
                    }
                }

                if (typeof generateEUI2 != "undefined") {
                    RES.getResByUrl("resource/gameEui.json", (data, url) => {
                        window["JSONParseClass"]["setData"](data);
                        onResGet(data);
                        egret.callLater(() => {
                            onSuccess.call(thisObject, generateEUI2);
                        }, this);
                    }, this, RES.ResourceItem.TYPE_JSON);
                } else {
                    RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
                    RES.getResByUrl(url, onResGet, this, RES.ResourceItem.TYPE_TEXT);
                }
            }
        }
    }

    // class LoadingUiPanel extends GameUi.UiPanel implements RES.PromiseTaskReporter {
    //     protected readonly _IS_EXCLUSIVE = true;
    //     protected readonly _LAYER_TYPE   = Types.LayerType.Top;

    //     private static _instance: LoadingUiPanel;

    //     private _labelProgress: GameUi.UiLabel;

    //     public static create(): LoadingUiPanel {
    //         egret.assert(!LoadingUiPanel._instance);
    //         LoadingUiPanel._instance = new LoadingUiPanel();
    //         LoadingUiPanel._instance.open();

    //         return LoadingUiPanel._instance;
    //     }

    //     public static destroy(): void {
    //         LoadingUiPanel._instance.close();
    //         delete LoadingUiPanel._instance;
    //     }

    //     private constructor() {
    //         super();

    //         this._setIsAutoAdjustHeight();
    //         this.skinName = "resource/skins/utility/LoadingUiPanel.exml";
    //     }

    //     public onProgress(current: number, total: number): void {
    //         this._labelProgress.text = `Loading...${current}/${total}`;
    //     }
    // }
}
