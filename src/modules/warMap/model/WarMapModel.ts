
namespace TinyWars.WarMap {
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import LocalStorage         = Utility.LocalStorage;
    import Notify               = Utility.Notify;
    import Lang                 = Utility.Lang;
    import MapList              = ProtoTypes.IMapList;
    import MapRawData           = ProtoTypes.IMapRawData;
    import MapMetaData          = ProtoTypes.IMapMetaData;
    import MapStatisticsData    = ProtoTypes.IMapStatisticsData;

    export namespace WarMapModel {
        const _STATISTICS_DATA_DICT = new Map<string, MapStatisticsData>();
        const _RAW_DATA_DICT        = new Map<string, MapRawData>();
        const _MAP_DICT             = new Map<string, MapMetaData>();

        export function init(): void {
        }

        export function resetMapDict(mapList: MapList): void {
            _MAP_DICT.clear();
            for (const data of mapList.fullList) {
                _MAP_DICT.set(data.mapFileName, data);
            }
        }
        export function getMapDict(): Map<string, MapMetaData> {
            return _MAP_DICT;
        }

        export function getMapMetaData(mapFileName: string): MapMetaData | undefined {
            return _MAP_DICT.get(mapFileName);
        }
        export function getMapNameInLanguage(mapFileName: string): string | null {
            const metaData = getMapMetaData(mapFileName);
            if (!metaData) {
                return null;
            } else {
                return Lang.getLanguageType() === Types.LanguageType.Chinese
                    ? metaData.mapName
                    : metaData.mapNameEnglish;
            }
        }

        export function getMapRawData(mapFileName: string): Promise<MapRawData | undefined> {
            const localData = getLocalMapRawData(mapFileName);
            if (localData) {
                return new Promise<MapRawData>((resolve, reject) => resolve(localData));
            } else {
                return new Promise<MapRawData | undefined>((resolve, reject) => {
                    const callbackOnSucceed = (e: egret.Event): void => {
                        const data = e.data as ProtoTypes.IS_GetMapRawData;
                        if (data.mapFileName === mapFileName) {
                            Notify.removeEventListener(Notify.Type.SGetMapRawData,          callbackOnSucceed);
                            Notify.removeEventListener(Notify.Type.SGetMapRawDataFailed,    callbackOnFailed);

                            resolve(data.mapRawData);
                        }
                    }
                    const callbackOnFailed = (e: egret.Event): void => {
                        const data = e.data as ProtoTypes.IS_GetMapRawData;
                        if (data.mapFileName === mapFileName) {
                            Notify.removeEventListener(Notify.Type.SGetMapRawData,          callbackOnSucceed);
                            Notify.removeEventListener(Notify.Type.SGetMapRawDataFailed,    callbackOnFailed);

                            reject(undefined);
                        }
                    }

                    Notify.addEventListener(Notify.Type.SGetMapRawData,         callbackOnSucceed);
                    Notify.addEventListener(Notify.Type.SGetMapRawDataFailed,   callbackOnFailed);

                    WarMapProxy.reqGetMapRawData(mapFileName);
                });
            }
        }
        export function setMapRawData(mapFileName: string, mapRawData: MapRawData): void {
            LocalStorage.setMapRawData(mapFileName, mapRawData);
            _RAW_DATA_DICT.set(mapFileName, mapRawData);
        }

        export function setMapStatisticsData(data: MapStatisticsData): void {
            _STATISTICS_DATA_DICT.set(data.mapFileName, data);
        }
        export function getMapStatisticsData(mapFileName: string): Promise<MapStatisticsData | undefined> {
            const existingData = _STATISTICS_DATA_DICT.get(mapFileName);
            if (existingData) {
                return new Promise<MapStatisticsData>((resolve) => resolve(existingData));
            } else {
                return new Promise<MapStatisticsData>((resolve, reject) => {
                    const callbackOnSucceed = (e: egret.Event): void => {
                        const data = e.data as ProtoTypes.IS_GetMapStatisticsData;
                        if (data.mapFileName === mapFileName) {
                            Notify.removeEventListener(Notify.Type.SGetMapStatisticsData,          callbackOnSucceed);
                            Notify.removeEventListener(Notify.Type.SGetMapStatisticsDataFailed,    callbackOnFailed);

                            setMapStatisticsData(data.mapStatisticsData);
                            resolve(data.mapStatisticsData);
                        }
                    }
                    const callbackOnFailed = (e: egret.Event): void => {
                        const data = e.data as ProtoTypes.IS_GetMapStatisticsData;
                        if (data.mapFileName === mapFileName) {
                            Notify.removeEventListener(Notify.Type.SGetMapStatisticsData,          callbackOnSucceed);
                            Notify.removeEventListener(Notify.Type.SGetMapStatisticsDataFailed,    callbackOnFailed);

                            reject(undefined);
                        }
                    }

                    Notify.addEventListener(Notify.Type.SGetMapStatisticsData,         callbackOnSucceed);
                    Notify.addEventListener(Notify.Type.SGetMapStatisticsDataFailed,   callbackOnFailed);

                    WarMapProxy.reqGetMapStatisticsData(mapFileName);
                });
            }
        }

        function getLocalMapRawData(mapFileName: string): MapRawData | undefined {
            if (!_RAW_DATA_DICT.has(mapFileName)) {
                const data = LocalStorage.getMapRawData(mapFileName);
                (data) && (_RAW_DATA_DICT.set(mapFileName, data));
            }
            return _RAW_DATA_DICT.get(mapFileName);
        }
    }
}
