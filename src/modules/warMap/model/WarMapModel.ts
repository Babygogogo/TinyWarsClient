
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarMapProxy          from "./WarMapProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WarMapModel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import WarType              = Types.WarType;
    import MsgMapGetRawDataIs   = NetMessage.MsgMapGetRawData.IS;
    import MsgMapGetBriefDataIs = NetMessage.MsgMapGetBriefData.IS;
    import NetMessage           = ProtoTypes.NetMessage;
    import IMapRawData          = ProtoTypes.Map.IMapRawData;
    import IMapBriefData        = ProtoTypes.Map.IMapBriefData;
    import IMapEditorData       = ProtoTypes.Map.IMapEditorData;

    const _RAW_DATA_DICT        = new Map<number, IMapRawData>();
    const _BRIEF_DATA_DICT      = new Map<number, IMapBriefData>();

    let _reviewingMaps          : IMapEditorData[];
    const _rawDataRequests      = new Map<number, ((info: MsgMapGetRawDataIs) => void)[]>();
    const _briefDataRequests    = new Map<number, ((info: MsgMapGetBriefDataIs) => void)[]>();

    export function init(): void {
        // nothing to do.
    }

    export function resetBriefDataDict(dataList: IMapBriefData[]): void {
        _BRIEF_DATA_DICT.clear();
        for (const data of dataList || []) {
            _BRIEF_DATA_DICT.set(Helpers.getExisted(data.mapExtraData?.mapId), data);
        }
    }
    export function getBriefDataDict(): typeof _BRIEF_DATA_DICT {
        return _BRIEF_DATA_DICT;
    }

    export function setBriefData(data: IMapBriefData): void {
        _BRIEF_DATA_DICT.set(Helpers.getExisted(data.mapExtraData?.mapId), data);
    }
    export function getBriefData(mapId: number): Promise<IMapBriefData | null> {
        if (mapId == null) {
            return new Promise<IMapBriefData | null>(resolve => resolve(null));
        }

        const localData = _BRIEF_DATA_DICT.get(mapId);
        if (localData) {
            return new Promise<IMapBriefData>(resolve => resolve(localData));
        }

        if (_briefDataRequests.has(mapId)) {
            return new Promise<IMapBriefData | null>((resolve) => {
                Helpers.getExisted(_briefDataRequests.get(mapId)).push(info => resolve(info.mapBriefData ?? null));
            });
        }

        new Promise<void>((resolve) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as MsgMapGetBriefDataIs;
                if (data.mapId === mapId) {
                    Notify.removeEventListener(NotifyType.MsgMapGetBriefData,        callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMapGetBriefDataFailed,  callbackOnFailed);

                    for (const cb of Helpers.getExisted(_briefDataRequests.get(mapId))) {
                        cb(data);
                    }
                    _briefDataRequests.delete(mapId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as MsgMapGetBriefDataIs;
                if (data.mapId === mapId) {
                    Notify.removeEventListener(NotifyType.MsgMapGetBriefData,        callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMapGetBriefDataFailed,  callbackOnFailed);

                    for (const cb of Helpers.getExisted(_briefDataRequests.get(mapId))) {
                        cb(data);
                    }
                    _briefDataRequests.delete(mapId);

                    resolve();
                }
            };

            Notify.addEventListener(NotifyType.MsgMapGetBriefData,       callbackOnSucceed);
            Notify.addEventListener(NotifyType.MsgMapGetBriefDataFailed, callbackOnFailed);

            WarMapProxy.reqGetMapBriefData(mapId);
        });

        return new Promise((resolve) => {
            _briefDataRequests.set(mapId, [info => resolve(info.mapBriefData ?? null)]);
        });
    }

    export function updateOnSetMapEnabled(data: ProtoTypes.NetMessage.MsgMmSetMapEnabled.IS): void {
        if (!data.isEnabled) {
            _BRIEF_DATA_DICT.delete(Helpers.getExisted(data.mapId));
        }
    }
    export async function updateOnSetMapName(data: ProtoTypes.NetMessage.MsgMmSetMapName.IS): Promise<void> {
        const mapId         = Helpers.getExisted(data.mapId, ClientErrorCode.WarMapModel_UpdateOnSetMapName_00);
        const mapNameArray  = Helpers.getExisted(data.mapNameArray, ClientErrorCode.WarMapModel_UpdateOnSetMapName_01);
        const mapBriefData  = await getBriefData(mapId);
        (mapBriefData) && (mapBriefData.mapNameArray = mapNameArray);

        const mapRawData = await getRawData(mapId);
        (mapRawData) && (mapRawData.mapNameArray = mapNameArray);
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
        return (await getRawData(mapId))?.designerName ?? null;
    }
    export async function getMultiPlayerTotalPlayedTimes(mapId: number): Promise<number> {
        const mapBriefData  = Helpers.getExisted(await getBriefData(mapId));
        const complexInfo   = mapBriefData.mapExtraData?.mapComplexInfo;
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
    export async function getAverageRating(mapId: number): Promise<number | null> {
        const mapBriefData = await getBriefData(mapId);
        const mapExtraData = mapBriefData ? mapBriefData.mapExtraData : null;
        const totalRaters  = mapExtraData ? mapExtraData.totalRaters : null;
        return totalRaters
            ? (Helpers.getExisted(mapExtraData?.totalRating) / totalRaters)
            : null;
    }
    export async function getTotalRatersCount(mapId: number): Promise<number | null> {
        const mapBriefData = await getBriefData(mapId);
        return mapBriefData ? mapBriefData.mapExtraData?.totalRaters ?? 0 : null;
    }

    export function updateRawDataDict(dataList: IMapRawData[]): void {
        for (const data of dataList || []) {
            setRawData(Helpers.getExisted(data.mapId), data);
        }
    }
    export function getRawData(mapId: number): Promise<IMapRawData | null> {
        if (mapId == null) {
            return new Promise<IMapRawData | null>((resolve) => resolve(null));
        }

        const localData = getLocalMapRawData(mapId);
        if (localData) {
            return new Promise<IMapRawData>((resolve) => resolve(localData));
        }

        if (_rawDataRequests.has(mapId)) {
            return new Promise<IMapRawData | null>((resolve) => {
                Helpers.getExisted(_rawDataRequests.get(mapId)).push(info => resolve(info.mapRawData ?? null));
            });
        }

        new Promise<void>((resolve) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as MsgMapGetRawDataIs;
                if (data.mapId === mapId) {
                    Notify.removeEventListener(NotifyType.MsgMapGetRawData,        callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMapGetRawDataFailed,  callbackOnFailed);

                    for (const cb of Helpers.getExisted(_rawDataRequests.get(mapId))) {
                        cb(data);
                    }
                    _rawDataRequests.delete(mapId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as MsgMapGetRawDataIs;
                if (data.mapId === mapId) {
                    Notify.removeEventListener(NotifyType.MsgMapGetRawData,        callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgMapGetRawDataFailed,  callbackOnFailed);

                    for (const cb of Helpers.getExisted(_rawDataRequests.get(mapId))) {
                        cb(data);
                    }
                    _rawDataRequests.delete(mapId);

                    resolve();
                }
            };

            Notify.addEventListener(NotifyType.MsgMapGetRawData,       callbackOnSucceed);
            Notify.addEventListener(NotifyType.MsgMapGetRawDataFailed, callbackOnFailed);

            WarMapProxy.reqGetMapRawData(mapId);
        });

        return new Promise((resolve) => {
            _rawDataRequests.set(mapId, [info => resolve(info.mapRawData ?? null)]);
        });
    }
    export function setRawData(mapId: number, mapRawData: IMapRawData): void {
        // LocalStorage的地图版本可能比服务器上的旧，因此暂时禁用
        // LocalStorage.setMapRawData(mapId, mapRawData);

        _RAW_DATA_DICT.set(mapId, mapRawData);
    }

    function getLocalMapRawData(mapId: number): IMapRawData | null {
        // LocalStorage的地图版本可能比服务器上的旧，因此暂时禁用
        // if (!_RAW_DATA_DICT.has(mapId)) {
        //     const data = LocalStorage.getMapRawData(mapId);
        //     (data) && (_RAW_DATA_DICT.set(mapId, data));
        // }

        return _RAW_DATA_DICT.get(mapId) ?? null;
    }

    export function setMmReviewingMaps(maps: IMapEditorData[]): void {
        _reviewingMaps = maps;
    }
    export function getMmReviewingMaps(): IMapEditorData[] {
        return _reviewingMaps;
    }
}

// export default WarMapModel;
