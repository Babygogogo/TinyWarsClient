
namespace TinyWars.WarMap {
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import LocalStorage         = Utility.LocalStorage;
    import Notify               = Utility.Notify;
    import Lang                 = Utility.Lang;
    import MapRawData           = ProtoTypes.IMapRawData;
    import MapExtraData         = ProtoTypes.IMapExtraData;

    export namespace WarMapModel {
        const _RAW_DATA_DICT        = new Map<string, MapRawData>();
        const _EXTRA_DATA_DICT      = new Map<string, MapExtraData>();

        let _reviewingMaps  : ProtoTypes.IMapEditorData[];

        export function init(): void {
        }

        export function resetExtraDataDict(dataList: MapExtraData[]): void {
            _EXTRA_DATA_DICT.clear();
            for (const data of dataList) {
                _EXTRA_DATA_DICT.set(data.mapFileName, data);
            }
        }
        export function getExtraDataDict(): Map<string, MapExtraData> {
            return _EXTRA_DATA_DICT;
        }

        export function setExtraData(data: MapExtraData): void {
            _EXTRA_DATA_DICT.set(data.mapFileName, data);
        }
        export function getExtraData(mapFileName: string): Promise<MapExtraData | undefined> {
            const localData = _EXTRA_DATA_DICT.get(mapFileName);
            if (localData) {
                return new Promise(resolve => resolve(localData));
            } else {
                return new Promise((resolve, reject) => {
                    const callbackOnSucceed = (e: egret.Event): void => {
                        const data = e.data as ProtoTypes.IS_MapGetExtraData;
                        if (data.mapFileName === mapFileName) {
                            Notify.removeEventListener(Notify.Type.SMapGetExtraData,        callbackOnSucceed);
                            Notify.removeEventListener(Notify.Type.SMapGetExtraDataFailed,  callbackOnFailed);

                            resolve(data.mapExtraData);
                        }
                    };
                    const callbackOnFailed = (e: egret.Event): void => {
                        const data = e.data as ProtoTypes.IS_MapGetExtraData;
                        if (data.mapFileName === mapFileName) {
                            Notify.removeEventListener(Notify.Type.SMapGetExtraData,        callbackOnSucceed);
                            Notify.removeEventListener(Notify.Type.SMapGetExtraDataFailed,  callbackOnFailed);

                            reject(null);
                        }
                    };

                    Notify.addEventListener(Notify.Type.SMapGetExtraData,       callbackOnSucceed);
                    Notify.addEventListener(Notify.Type.SMapGetExtraDataFailed, callbackOnFailed);

                    WarMapProxy.reqGetMapExtraData(mapFileName);
                });
            }
        }
        export function deleteExtraData(mapFileName: string): void {
            _EXTRA_DATA_DICT.delete(mapFileName);
        }

        export async function getMapNameInLanguage(mapFileName: string): Promise<string | null> {
            const extraData = await getExtraData(mapFileName);
            if (extraData) {
                return Lang.getLanguageType() === Types.LanguageType.Chinese
                    ? extraData.mapName
                    : extraData.mapNameEnglish;
            } else {
                return null;
            }
        }

        export function getMapRawData(mapFileName: string): Promise<MapRawData | undefined> {
            const localData = getLocalMapRawData(mapFileName);
            if (localData) {
                return new Promise<MapRawData>((resolve, reject) => resolve(localData));
            } else {
                return new Promise<MapRawData | undefined>((resolve, reject) => {
                    const callbackOnSucceed = (e: egret.Event): void => {
                        const data = e.data as ProtoTypes.IS_MapGetRawData;
                        if (data.mapFileName === mapFileName) {
                            Notify.removeEventListener(Notify.Type.SMapGetRawData,          callbackOnSucceed);
                            Notify.removeEventListener(Notify.Type.SMapGetRawDataFailed,    callbackOnFailed);

                            resolve(data.mapRawData);
                        }
                    }
                    const callbackOnFailed = (e: egret.Event): void => {
                        const data = e.data as ProtoTypes.IS_MapGetRawData;
                        if (data.mapFileName === mapFileName) {
                            Notify.removeEventListener(Notify.Type.SMapGetRawData,          callbackOnSucceed);
                            Notify.removeEventListener(Notify.Type.SMapGetRawDataFailed,    callbackOnFailed);

                            reject(undefined);
                        }
                    }

                    Notify.addEventListener(Notify.Type.SMapGetRawData,         callbackOnSucceed);
                    Notify.addEventListener(Notify.Type.SMapGetRawDataFailed,   callbackOnFailed);

                    WarMapProxy.reqGetMapRawData(mapFileName);
                });
            }
        }
        export function setMapRawData(mapFileName: string, mapRawData: MapRawData): void {
            LocalStorage.setMapRawData(mapFileName, mapRawData);
            _RAW_DATA_DICT.set(mapFileName, mapRawData);
        }

        function getLocalMapRawData(mapFileName: string): MapRawData | undefined {
            if (!_RAW_DATA_DICT.has(mapFileName)) {
                const data = LocalStorage.getMapRawData(mapFileName);
                (data) && (_RAW_DATA_DICT.set(mapFileName, data));
            }
            return _RAW_DATA_DICT.get(mapFileName);
        }

        export function setMmReviewingMaps(maps: ProtoTypes.IMapEditorData[]): void {
            _reviewingMaps = maps;
        }
        export function getMmReviewingMaps(): ProtoTypes.IMapEditorData[] {
            return _reviewingMaps;
        }
    }
}
