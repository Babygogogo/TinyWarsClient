
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarMapModel          from "./WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WarMapProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMapGetEnabledBriefDataList,   callback: _onMsgMapGetEnabledBriefDataList },
            { msgCode: NetMessageCodes.MsgMapGetEnabledRawDataList,     callback: _onMsgMapGetEnabledRawDataList },
            { msgCode: NetMessageCodes.MsgMapGetBriefData,              callback: _onMsgMapGetBriefData },
            { msgCode: NetMessageCodes.MsgMapGetRawData,                callback: _onMsgMapGetRawData },
            { msgCode: NetMessageCodes.MsgMmSetWarRuleAvailability,     callback: _onMsgMmSetWarRuleAvailability },
            { msgCode: NetMessageCodes.MsgMmSetMapEnabled,              callback: _onMsgMmSetMapEnabled },
            { msgCode: NetMessageCodes.MsgMmGetReviewingMaps,           callback: _onMsgMmGetReviewingMaps },
            { msgCode: NetMessageCodes.MsgMmReviewMap,                  callback: _onMsgMmReviewMap },
            { msgCode: NetMessageCodes.MsgMmSetMapTag,                  callback: _onMsgMmSetMapTag },
            { msgCode: NetMessageCodes.MsgMmSetMapName,                 callback: _onMsgMmSetMapName },
            { msgCode: NetMessageCodes.MsgMmAddWarRule,                 callback: _onMsgMmAddWarRule },
            { msgCode: NetMessageCodes.MsgMmDeleteWarRule,              callback: _onMsgMmDeleteWarRule },
        ], null);
    }

    function _onMsgMapGetEnabledBriefDataList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetEnabledBriefDataList.IS;
        if (!data.errorCode) {
            WarMapModel.resetBriefDataDict(data.dataList || []);
            Notify.dispatch(NotifyType.MsgMapGetEnabledBriefDataList, data);
        }
    }

    function _onMsgMapGetEnabledRawDataList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetEnabledRawDataList.IS;
        if (!data.errorCode) {
            WarMapModel.updateRawDataDict(data.dataList || []);
            Notify.dispatch(NotifyType.MsgMapGetEnabledRawDataList, data);
        }
    }

    export function reqGetMapBriefData(mapId: number): void {
        NetManager.send({
            MsgMapGetBriefData: { c: {
                mapId,
            }, },
        });
    }
    function _onMsgMapGetBriefData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetBriefData.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgMapGetBriefDataFailed, data);
        } else {
            WarMapModel.setBriefData(Helpers.getExisted(data.mapBriefData));
            Notify.dispatch(NotifyType.MsgMapGetBriefData, data);
        }
    }

    export function reqGetMapRawData(mapId: number): void {
        NetManager.send({
            MsgMapGetRawData: { c: {
                mapId,
            }, },
        });
    }
    function _onMsgMapGetRawData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetRawData.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgMapGetRawDataFailed, data);
        } else {
            WarMapModel.setRawData(Helpers.getExisted(data.mapId), Helpers.getExisted(data.mapRawData));
            Notify.dispatch(NotifyType.MsgMapGetRawData, data);
        }
    }

    export function reqMmSetWarRuleAvailability({ mapId, ruleId, availability }: {
        mapId       : number;
        ruleId      : number;
        availability: ProtoTypes.WarRule.IRuleAvailability;
    }): void {
        NetManager.send({
            MsgMmSetWarRuleAvailability: { c: {
                mapId,
                ruleId,
                availability,
            }, },
        });
    }
    async function _onMsgMmSetWarRuleAvailability(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMmSetWarRuleAvailability.IS;
        if (!data.errorCode) {
            await WarMapModel.updateOnSetWarRuleAvailability(data);
            Notify.dispatch(NotifyType.MsgMmSetWarRuleAvailability, data);
        }
    }

    export function reqMmSetMapEnabled(mapId: number, isEnabled: boolean): void {
        NetManager.send({
            MsgMmSetMapEnabled: { c: {
                mapId,
                isEnabled,
            }, }
        });
    }
    function _onMsgMmSetMapEnabled(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmSetMapEnabled.IS;
        if (!data.errorCode) {
            WarMapModel.updateOnSetMapEnabled(data);
            Notify.dispatch(NotifyType.MsgMmSetMapEnabled, data);
        }
    }

    export function reqMmGetReviewingMaps(): void {
        NetManager.send({
            MsgMmGetReviewingMaps: { c: {} },
        });
    }
    function _onMsgMmGetReviewingMaps(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmGetReviewingMaps.IS;
        if (!data.errorCode) {
            WarMapModel.setMmReviewingMaps(data.maps || []);
            Notify.dispatch(NotifyType.MsgMmGetReviewingMaps, data);
        }
    }

    export function reqMmReviewMap({ designerUserId, slotIndex, modifiedTime, isAccept, reviewComment }: {
        designerUserId  : number;
        slotIndex       : number;
        modifiedTime    : number;
        isAccept        : boolean;
        reviewComment   : string | null;
    }): void {
        NetManager.send({
            MsgMmReviewMap: { c: {
                designerUserId,
                slotIndex,
                modifiedTime,
                isAccept,
                reviewComment,
            }, },
        });
    }
    function _onMsgMmReviewMap(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmReviewMap.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMmReviewMap, data);
        }
    }

    export function reqMmSetMapTag(mapId: number, mapTag: ProtoTypes.Map.IDataForMapTag | null): void {
        NetManager.send({ MsgMmSetMapTag: { c: {
            mapId,
            mapTag,
        } } });
    }
    function _onMsgMmSetMapTag(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmSetMapTag.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMmSetMapTag, data);
        }
    }

    export function reqMmSetMapName(mapId: number, mapNameArray: ProtoTypes.Structure.ILanguageText[]): void {
        NetManager.send({ MsgMmSetMapName: { c: {
            mapId,
            mapNameArray,
        } } });
    }
    async function _onMsgMmSetMapName(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMmSetMapName.IS;
        if (!data.errorCode) {
            await WarMapModel.updateOnSetMapName(data);
            Notify.dispatch(NotifyType.MsgMmSetMapName, data);
        }
    }

    export function reqMmAddWarRule(mapId: number, warRule: ProtoTypes.WarRule.IWarRule): void {
        NetManager.send({
            MsgMmAddWarRule: { c: {
                mapId,
                warRule,
            } },
        });
    }
    async function _onMsgMmAddWarRule(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMmAddWarRule.IS;
        if (!data.errorCode) {
            await WarMapModel.updateOnAddWarRule(data);
            Notify.dispatch(NotifyType.MsgMmAddWarRule, data);
        }
    }

    export function reqMmDeleteWarRule(mapId: number, ruleId: number): void {
        NetManager.send({
            MsgMmDeleteWarRule: { c: {
                mapId,
                ruleId,
            } },
        });
    }
    async function _onMsgMmDeleteWarRule(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMmDeleteWarRule.IS;
        if (!data.errorCode) {
            await WarMapModel.updateOnDeleteWarRule(data);
            Notify.dispatch(NotifyType.MsgMmDeleteWarRule, data);
        }
    }
}

// export default WarMapProxy;
