
import Logger           from "../helpers/Logger";
import ResAutoRelease   from "./ResAutoRelease";
import FloatText        from "../helpers/FloatText";
import StageManager     from "../helpers/StageManager";

namespace ResManager {
    let _isLoadedMainResource = false;

    export async function init(): Promise<void> {
        egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

        await RES.loadConfig("resource/default.res.json", "resource/");
        await _initTheme();
        // await RES.loadGroup("preload", 0, LoadingUiPanel.create());
        // LoadingUiPanel.destroy();
        ResAutoRelease.startAutoRelease();
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
        return new Promise<void>((resolve): void => {
            new eui.Theme("resource/default.thm.json", StageManager.getStage())
                .once(eui.UIEvent.COMPLETE, resolve, undefined);
        });
    }

    declare const generateEUI : { paths: string[], skins: any };
    declare const generateEUI2: { paths: string[], skins: any };

    class AssetAdapter implements eui.IAssetAdapter {
        // @ts-ignore
        public getAsset(source: string, callback: (data: any, s?: string) => void, thisObject: any): void {
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
        public getTheme(url: string, onSuccess: (data: any) => void, onError: () => void, thisObject: any): void {
            if (typeof generateEUI != "undefined") {
                egret.callLater(() => {
                    onSuccess.call(thisObject, generateEUI);
                }, this);
            } else {
                const onResGet = function (e: string): void {
                    onSuccess.call(thisObject, e);
                };
                const onResError = function (e: egret.Event): void {
                    const resItem = (e as RES.ResourceEvent).resItem;
                    if ((resItem) && (resItem.url == url)) {
                        RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, onResError, null);
                        onError.call(thisObject);
                    }
                };

                if (typeof generateEUI2 != "undefined") {
                    RES.getResByUrl("resource/gameEui.json", (data: string) => {
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

    // class LoadingUiPanel extends TwnsUiPanel.UiPanel implements RES.PromiseTaskReporter {
    //     protected readonly _IS_EXCLUSIVE = true;
    //     protected readonly _LAYER_TYPE   = Types.LayerType.Top;

    //     private static _instance: LoadingUiPanel;

    //     private _labelProgress: TwnsUiLabel.UiLabel;

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

    /*

    美术风格参考老三代。需要注意不同种类的地形的区分度。

    当前游戏内每个格子分辨率是72*72。具体我会把原版的碎图全部发出以供参考。

    所有地形在游戏内都有正常状态和压暗状态（雾战用），但是压暗不需要单独手绘，我直接用ps批量压暗正常状态的图片即可。

    地形分两大类，分别是基底和上层物件（比如建筑、山脉等）。游戏中的地图格子都必定有且只有1层基底，有0或1个上层物件，叠加在一起显示。

    所有基底的宽和高都是一个格子，不能改变。
    输出图片是严格的72*72，不能有空白像素。

    所有上层物件的宽度都是一个格子；大多数高度也是一个格子，少数会超出一个格子的高度（不能超出2个格子高），但可以由美术自行按需调整。
    输出图片需要保证宽高是72*144（也就是一个格子宽两个格子高），程序会以下面的格子为准做对齐。
    宽高方向都可能有留白（比如建筑，可能不是直接贴着底部，而是有几个像素的距离），美术自行按需调整即可。

    许多地形都有无限循环的帧动画，下面会详述，但毕竟有成本，比较吃紧的话可以暂不考虑。相反地，如果帧动画成本不高，可以考虑给原本没有动画的地形加上动画，具体可以商量。
    部分地形需要考虑临近拼接所以需要多种造型，下面也会详述。这个最好要有，否则效果比较不好看，成本方面可以商量。
    部分上层物件需要同一造型区分多种颜色（表示所属势力，分别为白色（中立），红，蓝，黄，绿），下面会详述。具体颜色参考老三代。

    基底如下：
    - 草地（1种造型（因不需要考虑拼接，下同），1帧（也就是不需要动画，下同），1种颜色（因为不区分势力，下同））
    - 河流（16种造型，1帧，1种颜色）
    - 海洋（47种造型，4帧（游戏中按123432来循环成6帧），1种颜色）
    - 沙滩（36种造型，4帧（游戏中按123432来循环成6帧），1种颜色）

    上层物件如下：
    - 道路（11种造型，1帧，1种颜色）
    - 桥梁（11种造型，1帧，1种颜色）
    - 森林（1种造型，1帧，1种颜色）
    - 山脉（1种造型，1帧，1种颜色）
    - 荒地（1种造型，1帧，1种颜色）
    - 废墟（1种造型，1帧，1种颜色）
    - 火焰（1种造型，4帧左右（首尾相接，和海洋沙滩不同），1种颜色）
    - 海洋上的巨浪（1种造型，4帧左右（首尾相接），1种颜色；由于是叠加在海洋上面显示，所以可以只做出白色浪花的效果）
    - 大雾（1种造型，1帧，1种颜色）
    - 礁石（1种造型，4帧左右（首尾相接），1种颜色）
    - 等离子1（16种造型，3帧（首尾相接），1种颜色）
    - 等离子2（16种造型，3帧（首尾相接），1种颜色；与等离子1的区别是，等离子2在游戏中无法摧毁，而1可以摧毁；等离子1和2的颜色都可以与原版颜色不同，美术可以自行决定）
    - 陨石（1种造型，1帧，1种颜色）
    - 导弹发射台（1种造型，1帧，1种颜色）
    - 空的导弹发射台（1种造型，1帧，1种颜色）
    - 基地（1种造型，2帧，5种颜色；被占领就判负所以长得比较高大显眼）
    - 城市大厦（1种造型，2帧，5种颜色）
    - 指挥塔（1种造型，2帧，5种颜色）
    - 雷达（1种造型，2帧，5种颜色）
    - 工厂（1种造型，2帧，5种颜色）
    - 机场（1种造型，2帧，5种颜色）
    - 海港（1种造型，2帧，5种颜色）
    - 小型临时机场（1种造型，2帧，5种颜色）
    - 小型临时海港（1种造型，2帧，5种颜色）

    */
}

export default ResManager;
