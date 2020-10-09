
namespace TinyWars.WarMap {
    import Types                = Utility.Types;
    import Helpers              = Utility.Helpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import LocalStorage         = Utility.LocalStorage;
    import Notify               = Utility.Notify;
    import Lang                 = Utility.Lang;
    import NetMessage           = ProtoTypes.NetMessage;
    import IS_MapGetRawData     = NetMessage.IS_MapGetRawData;
    import IS_MapGetExtraData   = NetMessage.IS_MapGetExtraData;
    import IMapRawData          = ProtoTypes.Map.IMapRawData;
    import IMapExtraData        = ProtoTypes.Map.IMapExtraData;
    import IMapEditorData       = ProtoTypes.Map.IMapEditorData;

    export namespace WarMapModel {
        const _RAW_DATA_DICT        = new Map<number, IMapRawData>();
        const _EXTRA_DATA_DICT      = new Map<number, IMapExtraData>();

        let _reviewingMaps          : IMapEditorData[];
        const _rawDataRequests      = new Map<number, ((info: IS_MapGetRawData | undefined | null) => void)[]>();
        const _extraDataRequests    = new Map<number, ((info: IS_MapGetExtraData | undefined | null) => void)[]>();

        export function init(): void {
        }

        export function resetExtraDataDict(dataList: IMapExtraData[]): void {
            _EXTRA_DATA_DICT.clear();
            for (const data of dataList || []) {
                _EXTRA_DATA_DICT.set(data.mapId, data);
            }
        }
        export function getExtraDataDict(): typeof _EXTRA_DATA_DICT {
            return _EXTRA_DATA_DICT;
        }

        export function setExtraData(data: IMapExtraData): void {
            _EXTRA_DATA_DICT.set(data.mapId, data);
        }
        export function getExtraData(mapId: number): Promise<IMapExtraData | undefined | null> {
            if (mapId == null) {
                return new Promise<IMapExtraData>(resolve => resolve(undefined));
            }

            const localData = _EXTRA_DATA_DICT.get(mapId);
            if (localData) {
                return new Promise<IMapExtraData>(resolve => resolve(localData));
            }

            if (_extraDataRequests.has(mapId)) {
                return new Promise<IMapExtraData>((resolve, reject) => {
                    _extraDataRequests.get(mapId).push(info => resolve(info.mapExtraData));
                });
            }

            new Promise((resolve, reject) => {
                const callbackOnSucceed = (e: egret.Event): void => {
                    const data = e.data as IS_MapGetExtraData;
                    if (data.mapId === mapId) {
                        Notify.removeEventListener(Notify.Type.SMapGetExtraData,        callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.SMapGetExtraDataFailed,  callbackOnFailed);

                        for (const cb of _extraDataRequests.get(mapId)) {
                            cb(data);
                        }
                        _extraDataRequests.delete(mapId);

                        resolve();
                    }
                };
                const callbackOnFailed = (e: egret.Event): void => {
                    const data = e.data as IS_MapGetExtraData;
                    if (data.mapId === mapId) {
                        Notify.removeEventListener(Notify.Type.SMapGetExtraData,        callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.SMapGetExtraDataFailed,  callbackOnFailed);

                        for (const cb of _extraDataRequests.get(mapId)) {
                            cb(data);
                        }
                        _extraDataRequests.delete(mapId);

                        resolve();
                    }
                };

                Notify.addEventListener(Notify.Type.SMapGetExtraData,       callbackOnSucceed);
                Notify.addEventListener(Notify.Type.SMapGetExtraDataFailed, callbackOnFailed);

                WarMapProxy.reqGetMapExtraData(mapId);
            });

            return new Promise((resolve, reject) => {
                _extraDataRequests.set(mapId, [info => resolve(info.mapExtraData)]);
            });
        }
        export function deleteExtraData(mapId: number): void {
            _EXTRA_DATA_DICT.delete(mapId);
        }

        export async function getMapNameInCurrentLanguage(mapId: number): Promise<string | null> {
            const rawData = await getRawData(mapId);
            if (!rawData) {
                return null;
            } else {
                const nameList = rawData.mapNameList;
                if (!nameList) {
                    return undefined;
                } else {
                    return Lang.getLanguageType() === Types.LanguageType.English
                        ? nameList[1] || nameList[0]
                        : nameList[0];
                }
            }
        }
        export async function getDesignerName(mapId: number): Promise<string | null> {
            const rawData = await getRawData(mapId);
            return rawData ? rawData.designerName : null;
        }
        export async function getPlayerRule(mapId: number, warRuleId: number, playerIndex: number): Promise<ProtoTypes.WarRule.IDataForPlayerRule | undefined> {
            const mapRawData = await getRawData(mapId);
            if (mapRawData == null) {
                return undefined;
            }

            const warRule = (mapRawData.warRuleList || []).find(v => v.ruleId === warRuleId);
            if (warRuleId == null) {
                return undefined;
            }

            const ruleForPlayers = warRule.ruleForPlayers;
            if (ruleForPlayers == null) {
                return undefined;
            }

            return (ruleForPlayers.playerRuleDataList || []).find(v => v.playerIndex === playerIndex);
        }
        export async function getMultiPlayerTotalPlayedTimes(mapId: number): Promise<number> {
            const mapExtraData = await getExtraData(mapId);
            if (!mapExtraData) {
                return undefined;
            }

            const complexInfo   = mapExtraData.mapComplexInfo;
            let totalTimes      = 0;
            if (complexInfo) {
                const mcwInfo   = complexInfo.mcwStatistics;
                totalTimes      += mcwInfo ? mcwInfo.totalPlayedTimes : 0;

                const mcwFogInfo    = complexInfo.mcwFogStatistics;
                totalTimes          += mcwFogInfo ? mcwFogInfo.totalPlayedTimes : 0;

                const rankInfo  = complexInfo.rankStatistics;
                totalTimes      += rankInfo ? rankInfo.totalPlayedTimes : 0;

                const rankFogInfo   = complexInfo.rankFogStatistics;
                totalTimes          += rankFogInfo ? rankFogInfo.totalPlayedTimes : 0;
            }
            return totalTimes;
        }
        export async function getAverageRating(mapId: number): Promise<number> {
            const mapExtraData  = await getExtraData(mapId);
            const totalRaters   = mapExtraData ? mapExtraData.totalRaters : null;
            return totalRaters ? mapExtraData.totalRating / totalRaters : undefined;
        }

        export function getRawData(mapId: number): Promise<IMapRawData | undefined> {
            if (mapId == null) {
                return new Promise<IMapRawData>((resolve, reject) => resolve(undefined));
            }

            const localData = getLocalMapRawData(mapId);
            if (localData) {
                return new Promise<IMapRawData>((resolve, reject) => resolve(localData));
            }

            if (_rawDataRequests.has(mapId)) {
                return new Promise<IMapRawData>((resolve, reject) => {
                    _rawDataRequests.get(mapId).push(info => resolve(info.mapRawData));
                });
            }

            new Promise((resolve, reject) => {
                const callbackOnSucceed = (e: egret.Event): void => {
                    const data = e.data as IS_MapGetRawData;
                    if (data.mapId === mapId) {
                        Notify.removeEventListener(Notify.Type.SMapGetRawData,        callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.SMapGetRawDataFailed,  callbackOnFailed);

                        for (const cb of _rawDataRequests.get(mapId)) {
                            cb(data);
                        }
                        _rawDataRequests.delete(mapId);

                        resolve();
                    }
                };
                const callbackOnFailed = (e: egret.Event): void => {
                    const data = e.data as IS_MapGetRawData;
                    if (data.mapId === mapId) {
                        Notify.removeEventListener(Notify.Type.SMapGetRawData,        callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.SMapGetRawDataFailed,  callbackOnFailed);

                        for (const cb of _rawDataRequests.get(mapId)) {
                            cb(data);
                        }
                        _rawDataRequests.delete(mapId);

                        resolve();
                    }
                };

                Notify.addEventListener(Notify.Type.SMapGetRawData,       callbackOnSucceed);
                Notify.addEventListener(Notify.Type.SMapGetRawDataFailed, callbackOnFailed);

                WarMapProxy.reqGetMapRawData(mapId);
            });

            return new Promise((resolve, reject) => {
                _rawDataRequests.set(mapId, [info => resolve(info.mapRawData)]);
            });
        }
        export function setRawData(mapId: number, mapRawData: IMapRawData): void {
            // LocalStorage的地图版本可能比服务器上的旧，因此暂时禁用
            // LocalStorage.setMapRawData(mapId, mapRawData);

            _RAW_DATA_DICT.set(mapId, mapRawData);
        }

        function getLocalMapRawData(mapId: number): IMapRawData | undefined {
            // LocalStorage的地图版本可能比服务器上的旧，因此暂时禁用
            // if (!_RAW_DATA_DICT.has(mapId)) {
            //     const data = LocalStorage.getMapRawData(mapId);
            //     (data) && (_RAW_DATA_DICT.set(mapId, data));
            // }

            return _RAW_DATA_DICT.get(mapId);
        }

        export function setMmReviewingMaps(maps: IMapEditorData[]): void {
            _reviewingMaps = maps;
        }
        export function getMmReviewingMaps(): IMapEditorData[] {
            return _reviewingMaps;
        }
    }
}
