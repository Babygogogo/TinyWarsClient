
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarMapProxy          from "./WarMapProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarMap.WarMapModel {
    import IMapRawData          = CommonProto.Map.IMapRawData;
    import IMapBriefData        = CommonProto.Map.IMapBriefData;
    import IMapEditorData       = CommonProto.Map.IMapEditorData;

    let _reviewingMaps          : IMapEditorData[];
    const _enabledMapIdArray    : number[] = [];
    const _rawDataAccessor      = Helpers.createCachedDataAccessor<number, IMapRawData>({
        reqData                 : (mapId: number) => WarMap.WarMapProxy.reqGetMapRawData(mapId),
    });
    const _briefDataGetter      = Helpers.createCachedDataAccessor<number, IMapBriefData>({
        reqData                 : (mapId: number) => WarMap.WarMapProxy.reqGetMapBriefData(mapId),
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
        _briefDataGetter.setData(mapId, data);
    }
    export function getBriefData(mapId: number): Promise<IMapBriefData | null> {
        return _briefDataGetter.getData(mapId);
    }

    export async function updateOnSetMapName(data: CommonProto.NetMessage.MsgMmSetMapName.IS): Promise<void> {
        const mapId         = Helpers.getExisted(data.mapId, ClientErrorCode.WarMapModel_UpdateOnSetMapName_00);
        const mapNameArray  = Helpers.getExisted(data.mapNameArray, ClientErrorCode.WarMapModel_UpdateOnSetMapName_01);
        const mapBriefData  = await getBriefData(mapId);
        (mapBriefData) && (mapBriefData.mapNameArray = mapNameArray);

        const mapRawData = await getRawData(mapId);
        (mapRawData) && (mapRawData.mapNameArray = mapNameArray);
    }
    export async function updateOnAddWarRule(data: CommonProto.NetMessage.MsgMmAddWarRule.IS): Promise<void> {
        const mapId             = Helpers.getExisted(data.mapId);
        const templateWarRule   = Helpers.getExisted(data.templateWarRule);
        Helpers.getExisted((await getRawData(mapId))?.templateWarRuleArray).push(templateWarRule);
    }
    export async function updateOnDeleteWarRule(data: CommonProto.NetMessage.MsgMmDeleteWarRule.IS): Promise<void> {
        const mapId                 = Helpers.getExisted(data.mapId);
        const ruleId                = Helpers.getExisted(data.ruleId);
        const templateWarRuleArray  = Helpers.getExisted((await getRawData(mapId))?.templateWarRuleArray);
        const index                 = templateWarRuleArray.findIndex(v => v.ruleId === ruleId);
        (index >= 0) && (templateWarRuleArray.splice(index, 1));
    }
    export async function updateOnMsgMmSetWarRuleName(data: CommonProto.NetMessage.MsgMmSetWarRuleName.IS): Promise<void> {
        const ruleId            = Helpers.getExisted(data.ruleId);
        const templateWarRule   = Helpers.getExisted((await getRawData(Helpers.getExisted(data.mapId)))?.templateWarRuleArray?.find(v => v.ruleId === ruleId));
        (templateWarRule) && (templateWarRule.ruleNameArray = data.ruleNameArray);
    }
    export async function updateOnSetWarRuleAvailability(data: CommonProto.NetMessage.MsgMmSetWarRuleAvailability.IS): Promise<void> {
        const templateWarRule               = Helpers.getExisted((await getRawData(Helpers.getExisted(data.mapId)))?.templateWarRuleArray?.find(v => v.ruleId === data.ruleId));
        templateWarRule.ruleAvailability    = data.availability;
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
    export async function getTotalPlayedTimes(mapId: number): Promise<number> {
        const mapBriefData  = Helpers.getExisted(await getBriefData(mapId));
        let totalTimes      = 0;
        for (const statisticsForRule of mapBriefData.mapExtraData?.mapWarStatistics?.statisticsForRuleArray ?? []) {
            for (const info of statisticsForRule.statisticsForTurnArray ?? []) {
                totalTimes += info.totalGames ?? 0;
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
        return _rawDataAccessor.getData(mapId);
    }
    export function setRawData(mapId: number, mapRawData: IMapRawData | null): void {
        // LocalStorage的地图版本可能比服务器上的旧，因此暂时禁用
        // LocalStorage.setMapRawData(mapId, mapRawData);

        _rawDataAccessor.setData(mapId, mapRawData);
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
