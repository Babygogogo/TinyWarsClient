
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarMapProxy          from "./WarMapProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WarMapModel {
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import WarType              = Types.WarType;
    import IMapRawData          = ProtoTypes.Map.IMapRawData;
    import IMapBriefData        = ProtoTypes.Map.IMapBriefData;
    import IMapEditorData       = ProtoTypes.Map.IMapEditorData;

    let _reviewingMaps          : IMapEditorData[];
    const _enabledMapIdArray    : number[] = [];
    const _rawDataDict          = new Map<number, IMapRawData | null>();
    const _rawDataGetter        = Helpers.createCachedDataGetter({
        dataDict                : _rawDataDict,
        dataExpireTime          : 5,
        reqData                 : (mapId: number) => WarMapProxy.reqGetMapRawData(mapId),
    });
    const _briefDataDict        = new Map<number, IMapBriefData | null>();
    const _briefDataGetter      = Helpers.createCachedDataGetter({
        dataDict                : _briefDataDict,
        reqData                 : (mapId: number) => WarMapProxy.reqGetMapBriefData(mapId),
    });

    export function init(): void {
        // nothing to do.
    }

    export function resetEnabledMapIdArray(mapIdArray: number[]): void {
        _enabledMapIdArray.length = 0;
        _enabledMapIdArray.push(...mapIdArray);
    }
    export function getEnabledMapIdArray(): number[] {
        return _enabledMapIdArray;
    }

    export function setBriefData(mapId: number, data: IMapBriefData | null): void {
        _briefDataDict.set(mapId, data);
        _briefDataGetter.dataUpdated(mapId);
    }
    export function getBriefData(mapId: number): Promise<IMapBriefData | null> {
        return _briefDataGetter.getData(mapId);
    }

    export async function updateOnSetMapName(data: ProtoTypes.NetMessage.MsgMmSetMapName.IS): Promise<void> {
        const mapId         = Helpers.getExisted(data.mapId, ClientErrorCode.WarMapModel_UpdateOnSetMapName_00);
        const mapNameArray  = Helpers.getExisted(data.mapNameArray, ClientErrorCode.WarMapModel_UpdateOnSetMapName_01);
        const mapBriefData  = await getBriefData(mapId);
        (mapBriefData) && (mapBriefData.mapNameArray = mapNameArray);

        const mapRawData = await getRawData(mapId);
        (mapRawData) && (mapRawData.mapNameArray = mapNameArray);
    }
    export async function updateOnAddWarRule(data: ProtoTypes.NetMessage.MsgMmAddWarRule.IS): Promise<void> {
        const mapId     = Helpers.getExisted(data.mapId);
        const warRule   = Helpers.getExisted(data.warRule);
        Helpers.getExisted((await getRawData(mapId))?.warRuleArray).push(warRule);
    }
    export async function updateOnDeleteWarRule(data: ProtoTypes.NetMessage.MsgMmDeleteWarRule.IS): Promise<void> {
        const mapId         = Helpers.getExisted(data.mapId);
        const ruleId        = Helpers.getExisted(data.ruleId);
        const warRuleArray  = Helpers.getExisted((await getRawData(mapId))?.warRuleArray);
        const index         = warRuleArray.findIndex(v => v.ruleId === ruleId);
        (index >= 0) && (warRuleArray.splice(index, 1));
    }
    export async function updateOnSetWarRuleAvailability(data: ProtoTypes.NetMessage.MsgMmSetWarRuleAvailability.IS): Promise<void> {
        const warRule               = Helpers.getExisted((await getRawData(Helpers.getExisted(data.mapId)))?.warRuleArray?.find(v => v.ruleId === data.ruleId));
        warRule.ruleAvailability    = data.availability;
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
        return _rawDataGetter.getData(mapId);
    }
    export function setRawData(mapId: number, mapRawData: IMapRawData | null): void {
        // LocalStorage的地图版本可能比服务器上的旧，因此暂时禁用
        // LocalStorage.setMapRawData(mapId, mapRawData);

        _rawDataDict.set(mapId, mapRawData);
        _rawDataGetter.dataUpdated(mapId);
    }

    // function getLocalMapRawData(mapId: number): IMapRawData | null {
    //     // LocalStorage的地图版本可能比服务器上的旧，因此暂时禁用
    //     // if (!_RAW_DATA_DICT.has(mapId)) {
    //     //     const data = LocalStorage.getMapRawData(mapId);
    //     //     (data) && (_RAW_DATA_DICT.set(mapId, data));
    //     // }

    //     return _rawDataDict.get(mapId) ?? null;
    // }

    export function setMmReviewingMaps(maps: IMapEditorData[]): void {
        _reviewingMaps = maps;
    }
    export function getMmReviewingMaps(): IMapEditorData[] {
        return _reviewingMaps;
    }

    export function getMapSize(mapRawData: IMapRawData): Types.MapSize | null {
        const { mapWidth, mapHeight } = mapRawData;
        return (mapWidth == null) || (mapHeight == null)
             ? null
             : { width: mapWidth, height: mapHeight };
    }
}

// export default WarMapModel;
