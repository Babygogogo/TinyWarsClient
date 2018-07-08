
namespace Utility {
    export namespace ResManager {
        export async function init(): Promise<void> {
            egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());

            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, LoadingUiPanel.create());
            LoadingUiPanel.destroy();
        }
    }

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

    class LoadingUiPanel extends GameUi.UiPanel implements RES.PromiseTaskReporter {
        protected readonly _isAlone   = true;
        protected readonly _layerType = Types.LayerType.Top;

        private static _instance: LoadingUiPanel;

        private _labelProgress: GameUi.UiLabel;

        public static create(): LoadingUiPanel {
            egret.assert(!LoadingUiPanel._instance);
            LoadingUiPanel._instance = new LoadingUiPanel();
            LoadingUiPanel._instance.open();

            return LoadingUiPanel._instance;
        }

        public static destroy(): void {
            LoadingUiPanel._instance.close();
            delete LoadingUiPanel._instance;
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/utility/LoadingUiPanel.exml";
        }

        public onProgress(current: number, total: number): void {
            this._labelProgress.text = `Loading...${current}/${total}`;
        }
    }
}
