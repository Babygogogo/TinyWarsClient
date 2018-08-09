
namespace Utility {
    export namespace MapManager {
        type MapListType = { [fileName: string]: Types.TemplateMapBasicInfo };

        const ALL_MAP_LIST_PATH = "resource/config/MapList.json";

        let allMapList: MapListType;

        export async function init(): Promise<void> {
            return new Promise<any>((resolve, reject) => {
                RES.getResByUrl(ALL_MAP_LIST_PATH, (data: MapListType, url: string) => {
                    if (url === ALL_MAP_LIST_PATH) {
                        initAllMapList(data);
                        resolve();
                    } else {
                        reject();
                    }
                }, MapManager, RES.ResourceItem.TYPE_JSON);
            });
        }

        export function getAllMapList(): MapListType {
            return allMapList;
        }

        export function getMapData(fileName: string, callback: (data: Types.TemplateMap, url: string) => void): void {
            RES.getResByUrl("resource/assets/map/" + fileName + ".json", callback, undefined, RES.ResourceItem.TYPE_JSON);
        }

        function initAllMapList(rawList: MapListType): void {
            allMapList = rawList;
            for (const fileName in allMapList) {
                const index1 = fileName.indexOf("_");
                const index2 = fileName.lastIndexOf("_");
                const v      = allMapList[fileName];
                v.mapName    = fileName.substr(0, index1);
                v.designer   = fileName.substr(index1 + 1, index2 - index1 - 1);
            }
        }
    }
}
