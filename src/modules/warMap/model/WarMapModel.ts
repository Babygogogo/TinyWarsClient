
namespace TinyWars.WarMap {
    import Types                = Utility.Types;
    import ProtoTypes           = Utility.ProtoTypes;
    import Notify               = Utility.Notify;
    import Lang                 = Utility.Lang;
    import WarType              = Types.WarType;
    import MsgMapGetRawDataIs   = NetMessage.MsgMapGetRawData.IS;
    import MsgMapGetBriefDataIs = NetMessage.MsgMapGetBriefData.IS;
    import NetMessage           = ProtoTypes.NetMessage;
    import IMapRawData          = ProtoTypes.Map.IMapRawData;
    import IMapBriefData        = ProtoTypes.Map.IMapBriefData;
    import IMapEditorData       = ProtoTypes.Map.IMapEditorData;

    export namespace WarMapModel {
        const _RAW_DATA_DICT        = new Map<number, IMapRawData>();
        const _BRIEF_DATA_DICT      = new Map<number, IMapBriefData>();

        let _reviewingMaps          : IMapEditorData[];
        const _rawDataRequests      = new Map<number, ((info: MsgMapGetRawDataIs | undefined | null) => void)[]>();
        const _briefDataRequests    = new Map<number, ((info: MsgMapGetBriefDataIs | undefined | null) => void)[]>();

        export function init(): void {
            // nothing to do.
        }

        export function resetBriefDataDict(dataList: IMapBriefData[]): void {
            _BRIEF_DATA_DICT.clear();
            for (const data of dataList || []) {
                _BRIEF_DATA_DICT.set(data.mapExtraData.mapId, data);
            }
        }
        export function getBriefDataDict(): typeof _BRIEF_DATA_DICT {
            return _BRIEF_DATA_DICT;
        }

        export function setBriefData(data: IMapBriefData): void {
            _BRIEF_DATA_DICT.set(data.mapExtraData.mapId, data);
        }
        export function getBriefData(mapId: number): Promise<IMapBriefData | undefined | null> {
            if (mapId == null) {
                return new Promise<IMapBriefData>(resolve => resolve(undefined));
            }

            const localData = _BRIEF_DATA_DICT.get(mapId);
            if (localData) {
                return new Promise<IMapBriefData>(resolve => resolve(localData));
            }

            if (_briefDataRequests.has(mapId)) {
                return new Promise<IMapBriefData>((resolve, reject) => {
                    _briefDataRequests.get(mapId).push(info => resolve(info.mapBriefData));
                });
            }

            new Promise<void>((resolve, reject) => {
                const callbackOnSucceed = (e: egret.Event): void => {
                    const data = e.data as MsgMapGetBriefDataIs;
                    if (data.mapId === mapId) {
                        Notify.removeEventListener(Notify.Type.MsgMapGetBriefData,        callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.MsgMapGetBriefDataFailed,  callbackOnFailed);

                        for (const cb of _briefDataRequests.get(mapId)) {
                            cb(data);
                        }
                        _briefDataRequests.delete(mapId);

                        resolve();
                    }
                };
                const callbackOnFailed = (e: egret.Event): void => {
                    const data = e.data as MsgMapGetBriefDataIs;
                    if (data.mapId === mapId) {
                        Notify.removeEventListener(Notify.Type.MsgMapGetBriefData,        callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.MsgMapGetBriefDataFailed,  callbackOnFailed);

                        for (const cb of _briefDataRequests.get(mapId)) {
                            cb(data);
                        }
                        _briefDataRequests.delete(mapId);

                        resolve();
                    }
                };

                Notify.addEventListener(Notify.Type.MsgMapGetBriefData,       callbackOnSucceed);
                Notify.addEventListener(Notify.Type.MsgMapGetBriefDataFailed, callbackOnFailed);

                WarMapProxy.reqGetMapBriefData(mapId);
            });

            return new Promise((resolve, reject) => {
                _briefDataRequests.set(mapId, [info => resolve(info.mapBriefData)]);
            });
        }
        export function updateOnSetMapEnabled(data: ProtoTypes.NetMessage.MsgMmSetMapEnabled.IS): void {
            if (!data.isEnabled) {
                _BRIEF_DATA_DICT.delete(data.mapId);
            }
        }

        export async function getMapNameInCurrentLanguage(mapId: number): Promise<string | null> {
            const mapBriefData = await getBriefData(mapId);
            if (!mapBriefData) {
                return null;
            } else {
                return Lang.getLanguageText({ textArray: mapBriefData.mapNameArray });
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

            const warRule = (mapRawData.warRuleArray || []).find(v => v.ruleId === warRuleId);
            if (warRuleId == null) {
                return undefined;
            }

            const ruleForPlayers = warRule.ruleForPlayers;
            if (ruleForPlayers == null) {
                return undefined;
            }

            return (ruleForPlayers.playerRuleDataArray || []).find(v => v.playerIndex === playerIndex);
        }
        export async function getMultiPlayerTotalPlayedTimes(mapId: number): Promise<number> {
            const mapBriefData = await getBriefData(mapId);
            if (!mapBriefData) {
                return undefined;
            }

            const complexInfo   = mapBriefData.mapExtraData.mapComplexInfo;
            let totalTimes      = 0;
            for (const info of complexInfo ? complexInfo.warStatisticsArray || [] : []) {
                if ((info.warType === WarType.McwFog) ||
                    (info.warType === WarType.McwStd) ||
                    (info.warType === WarType.MrwFog) ||
                    (info.warType === WarType.MrwStd)
                ) {
                    totalTimes += info.totalPlayedTimes || 0;
                }
            }

            return totalTimes;
        }
        export async function getAverageRating(mapId: number): Promise<number> {
            const mapBriefData = await getBriefData(mapId);
            const mapExtraData = mapBriefData ? mapBriefData.mapExtraData : null;
            const totalRaters   = mapExtraData ? mapExtraData.totalRaters : null;
            return totalRaters ? mapExtraData.totalRating / totalRaters : undefined;
        }

        export function updateRawDataDict(dataList: IMapRawData[]): void {
            for (const data of dataList || []) {
                setRawData(data.mapId, data);
            }
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

            new Promise<void>((resolve, reject) => {
                const callbackOnSucceed = (e: egret.Event): void => {
                    const data = e.data as MsgMapGetRawDataIs;
                    if (data.mapId === mapId) {
                        Notify.removeEventListener(Notify.Type.MsgMapGetRawData,        callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.MsgMapGetRawDataFailed,  callbackOnFailed);

                        for (const cb of _rawDataRequests.get(mapId)) {
                            cb(data);
                        }
                        _rawDataRequests.delete(mapId);

                        resolve();
                    }
                };
                const callbackOnFailed = (e: egret.Event): void => {
                    const data = e.data as MsgMapGetRawDataIs;
                    if (data.mapId === mapId) {
                        Notify.removeEventListener(Notify.Type.MsgMapGetRawData,        callbackOnSucceed);
                        Notify.removeEventListener(Notify.Type.MsgMapGetRawDataFailed,  callbackOnFailed);

                        for (const cb of _rawDataRequests.get(mapId)) {
                            cb(data);
                        }
                        _rawDataRequests.delete(mapId);

                        resolve();
                    }
                };

                Notify.addEventListener(Notify.Type.MsgMapGetRawData,       callbackOnSucceed);
                Notify.addEventListener(Notify.Type.MsgMapGetRawDataFailed, callbackOnFailed);

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
