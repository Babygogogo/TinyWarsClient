
namespace TinyWars.WarMap {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import ProtoTypes       = Utility.ProtoTypes;
    import LocalStorage     = Utility.LocalStorage;
    import Notify           = Utility.Notify;
    import MapDynamicInfo   = ProtoTypes.IMapDynamicInfo;
    import MapIndexKey      = Types.MapIndexKey;

    export namespace WarMapModel {
        const _ALL_DYNAMIC_INFOS    = new Map<string, MapDynamicInfo>();
        const _ALL_DATAS            = new Map<string, Types.TemplateMap>();

        let _newestMapDynamicInfos: ProtoTypes.IS_GetNewestMapDynamicInfos;

        export function init(): void {
        }

        export function getMapData(key: MapIndexKey): Promise<Types.TemplateMap | undefined> {
            const mapUrl    = Helpers.getMapUrl(key);
            const localData = getLocalMapData(mapUrl);
            if (localData) {
                return new Promise<Types.TemplateMap>((resolve, reject) => resolve(localData));
            } else {
                return new Promise<Types.TemplateMap | undefined>((resolve, reject) => {
                    RES.getResByUrl(
                        mapUrl,
                        (data: Types.TemplateMap, reqUrl: string) => {
                            if (reqUrl === mapUrl) {
                                if (!data) {
                                    reject(data);
                                } else {
                                    LocalStorage.setMapData(mapUrl, JSON.stringify(data));
                                    _ALL_DATAS.set(mapUrl, data);
                                    resolve(data);
                                }
                            }
                        },
                        undefined,
                        RES.ResourceItem.TYPE_JSON
                    );
                });
            }
        }

        export function setNewestMapInfos(infos: ProtoTypes.IS_GetNewestMapDynamicInfos): void {
            _newestMapDynamicInfos = infos;
            updateMapDynamicInfos(infos.mapInfos);
        }
        export function getNewestMapInfos(): ProtoTypes.IS_GetNewestMapDynamicInfos {
            return _newestMapDynamicInfos;
        }

        export function updateMapDynamicInfos(infos: MapDynamicInfo[] | undefined): void {
            for (const info of infos || []) {
                updateMapDynamicInfo(info);
            }
        }
        export function updateMapDynamicInfo(info: MapDynamicInfo): void {
            _ALL_DYNAMIC_INFOS.set(Helpers.getMapUrl(info as MapIndexKey), info);
        }

        export function getMapDynamicInfoSync(key: MapIndexKey): MapDynamicInfo | undefined {
            return _ALL_DYNAMIC_INFOS.get(Helpers.getMapUrl(key));
        }
        export function getMapDynamicInfoAsync(key: MapIndexKey): Promise<MapDynamicInfo | undefined> {
            const info = getMapDynamicInfoSync(key);
            if (info) {
                return new Promise<MapDynamicInfo>((resolve) => resolve(info));
            } else {
                return new Promise<MapDynamicInfo>((resolve, reject) => {
                    function callbackOnSucceed(e: egret.Event): void {
                        const data = e.data as ProtoTypes.IS_GetMapDynamicInfo;
                        if (checkIsSameMapIndexKey(key, data as MapIndexKey)) {
                            Notify.removeEventListener(Notify.Type.SGetMapDynamicInfo,          callbackOnSucceed);
                            Notify.removeEventListener(Notify.Type.SGetMapDynamicInfoFailed,    callbackOnFailed);
                            resolve(getMapDynamicInfoSync(key));
                        }
                    }
                    function callbackOnFailed(e: egret.Event): void {
                        const data = e.data as ProtoTypes.IS_GetMapDynamicInfo;
                        if (checkIsSameMapIndexKey(key, data as MapIndexKey)) {
                            Notify.removeEventListener(Notify.Type.SGetMapDynamicInfo,          callbackOnSucceed);
                            Notify.removeEventListener(Notify.Type.SGetMapDynamicInfoFailed,    callbackOnFailed);
                            reject(undefined);
                        }
                    }
                    Notify.addEventListener(Notify.Type.SGetMapDynamicInfo,         callbackOnSucceed);
                    Notify.addEventListener(Notify.Type.SGetMapDynamicInfoFailed,   callbackOnFailed);

                    WarMapProxy.reqGetMapDynamicInfo(key);
                });
            }
        }

        function getLocalMapData(mapUrl: string): Types.TemplateMap | undefined {
            if (!_ALL_DATAS.has(mapUrl)) {
                const data = LocalStorage.getMapData(mapUrl);
                (data) && (_ALL_DATAS.set(mapUrl, JSON.parse(data)));
            }
            return _ALL_DATAS.get(mapUrl);
        }

        function checkIsSameMapIndexKey(k1: MapIndexKey, k2: MapIndexKey): boolean {
            return (k1.mapDesigner  === k2.mapDesigner)
                && (k1.mapName      === k2.mapName)
                && (k1.mapVersion   === k2.mapVersion);
        }
    }
}
