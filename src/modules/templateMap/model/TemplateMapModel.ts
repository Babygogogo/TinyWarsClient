
namespace TemplateMap {
    import Types        = Utility.Types;
    import Helpers      = Utility.Helpers;
    import ProtoTypes   = Utility.ProtoTypes;

    export namespace TemplateMapModel {
        const allMapInfos: { [fileName: string]: ProtoTypes.IMapInfo } = {};
        let newestMapInfos: ProtoTypes.IS_GetNewestMapInfos;

        export function init(): void {
        }

        export async function getMapData(keys: Types.MapIndexKey): Promise<Types.TemplateMap | undefined> {
            return new Promise<Types.TemplateMap | undefined>((resolve, reject) => {
                const url = Helpers.formatString("resource/assets/map/%s_%s_%s%d.json", keys.mapName, keys.mapDesigner, keys.mapVersion < 10 ? "0" : "", keys.mapVersion);
                RES.getResByUrl(
                    url,
                    (data: Types.TemplateMap, u: string) => {
                        if (u === url) {
                            resolve(data);
                        }
                    },
                    undefined,
                    RES.ResourceItem.TYPE_JSON
                );
            });
        }

        export function setNewestMapInfos(infos: ProtoTypes.IS_GetNewestMapInfos): void {
            newestMapInfos = infos;
            addMapInfos(infos.mapInfos);
        }
        export function getNewestMapInfos(): ProtoTypes.IS_GetNewestMapInfos {
            return newestMapInfos;
        }

        export function addMapInfos(infos: ProtoTypes.IMapInfo[]): void {
            if (infos) {
                for (const info of infos) {
                    allMapInfos[Helpers.getMapFileName(info as Types.MapIndexKey)] = info;
                }
            }
        }
        export function getMapInfo(keys: Types.MapIndexKey): ProtoTypes.IMapInfo | undefined {
            return allMapInfos[Helpers.getMapFileName(keys)];
        }
    }
}
