
namespace Utility {
    export namespace ResManager {
        export function init(): void {
            egret.registerImplementation("eui.IAssetAdapter", new AssetAdapter());
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
}
