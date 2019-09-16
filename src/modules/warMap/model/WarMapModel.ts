
namespace TinyWars.WarMap {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import ProtoTypes       = Utility.ProtoTypes;
    import LocalStorage     = Utility.LocalStorage;
    import Notify           = Utility.Notify;
    import MapMetaData      = Types.MapMetaData;

    export namespace WarMapModel {
        const _META_DATA_DICT   = new Map<string, MapMetaData>();
        const _RAW_DATA_DICT    = new Map<string, Types.MapRawData>();

        let _newestMapDynamicInfos: ProtoTypes.IS_GetNewestMapDynamicInfos;

        export function init(): void {
        }

        export function getMapRawData(mapFileName: string): Promise<Types.MapRawData | undefined> {
            const localData = getLocalMapRawData(mapFileName);
            if (localData) {
                return new Promise<Types.MapRawData>((resolve, reject) => resolve(localData));
            } else {
                return new Promise<Types.MapRawData | undefined>((resolve, reject) => {
                    RES.getResByUrl(
                        mapUrl,
                        (data: Types.MapRawData, reqMapFileName: string) => {
                            if (reqMapFileName === mapFileName) {
                                if (!data) {
                                    reject(data);
                                } else {
                                    LocalStorage.setMapRawData(mapFileName, data);
                                    _RAW_DATA_DICT.set(mapFileName, data);
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

        export function updateMapDynamicInfos(infos: MapMetaData[] | undefined): void {
            for (const info of infos || []) {
                updateMapDynamicInfo(info);
            }
        }
        export function updateMapDynamicInfo(info: MapMetaData): void {
            _META_DATA_DICT.set(Helpers.getMapUrl(info as MapIndexKey), info);
        }

        export function getMapDynamicInfoSync(key: MapIndexKey): MapMetaData | undefined {
            return _META_DATA_DICT.get(Helpers.getMapUrl(key));
        }
        export function getMapDynamicInfoAsync(key: MapIndexKey): Promise<MapMetaData | undefined> {
            const info = getMapDynamicInfoSync(key);
            if (info) {
                return new Promise<MapMetaData>((resolve) => resolve(info));
            } else {
                return new Promise<MapMetaData>((resolve, reject) => {
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

        function getLocalMapRawData(mapFileName: string): Types.MapRawData | undefined {
            if (!_RAW_DATA_DICT.has(mapFileName)) {
                const data = LocalStorage.getMapRawData(mapFileName);
                (data) && (_RAW_DATA_DICT.set(mapFileName, data));
            }
            return _RAW_DATA_DICT.get(mapFileName);
        }
    }
}
