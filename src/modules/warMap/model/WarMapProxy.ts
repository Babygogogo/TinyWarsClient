
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarMapModel          from "./WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarMap.WarMapProxy {
    import NotifyType       = Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = Net.NetMessageCodes;

    export function init(): void {
        Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMapGetEnabledMapIdArray,      callback: _onMsgMapGetEnabledMapIdArray },
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
            { msgCode: NetMessageCodes.MsgMmSetWarRuleName,             callback: _onMsgMmSetWarRuleName },
        ], null);
    }

    function _onMsgMapGetEnabledMapIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetEnabledMapIdArray.IS;
        if (!data.errorCode) {
            WarMap.WarMapModel.resetEnabledMapIdArray(data.mapIdArray || []);
            Notify.dispatch(NotifyType.MsgMapGetEnabledMapIdArray, data);
        }
    }

    export function reqGetMapBriefData(mapId: number): void {
        Net.NetManager.send({
            MsgMapGetBriefData: { c: {
                mapId,
            }, },
        });
    }
    function _onMsgMapGetBriefData(e: egret.Event): void {
        const data  = e.data as NetMessage.MsgMapGetBriefData.IS;
        WarMap.WarMapModel.setBriefData(Helpers.getExisted(data.mapId), data.mapBriefData ?? null);
        Notify.dispatch(NotifyType.MsgMapGetBriefData, data);
    }

    export function reqGetMapRawData(mapId: number): void {
        Net.NetManager.send({
            MsgMapGetRawData: { c: {
                mapId,
            }, },
        });
    }
    function _onMsgMapGetRawData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetRawData.IS;
        WarMap.WarMapModel.setRawData(Helpers.getExisted(data.mapId), data.mapRawData ?? null);
        Notify.dispatch(NotifyType.MsgMapGetRawData, data);
    }

    export function reqMmSetWarRuleAvailability({ mapId, ruleId, availability }: {
        mapId       : number;
        ruleId      : number;
        availability: CommonProto.WarRule.IRuleAvailability;
    }): void {
        Net.NetManager.send({
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
            await WarMap.WarMapModel.updateOnSetWarRuleAvailability(data);
            Notify.dispatch(NotifyType.MsgMmSetWarRuleAvailability, data);
        }
    }

    export function reqMmSetMapEnabled(mapId: number, isEnabled: boolean): void {
        Net.NetManager.send({
            MsgMmSetMapEnabled: { c: {
                mapId,
                isEnabled,
            }, }
        });
    }
    function _onMsgMmSetMapEnabled(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmSetMapEnabled.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMmSetMapEnabled, data);
        }
    }

    export function reqMmGetReviewingMaps(): void {
        Net.NetManager.send({
            MsgMmGetReviewingMaps: { c: {} },
        });
    }
    function _onMsgMmGetReviewingMaps(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmGetReviewingMaps.IS;
        if (!data.errorCode) {
            WarMap.WarMapModel.setMmReviewingMaps(data.maps || []);
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
        Net.NetManager.send({
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

    export function reqMmSetMapTag(mapId: number, mapTag: CommonProto.Map.IDataForMapTag | null): void {
        Net.NetManager.send({ MsgMmSetMapTag: { c: {
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

    export function reqMmSetMapName(mapId: number, mapNameArray: CommonProto.Structure.ILanguageText[]): void {
        Net.NetManager.send({ MsgMmSetMapName: { c: {
            mapId,
            mapNameArray,
        } } });
    }
    async function _onMsgMmSetMapName(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMmSetMapName.IS;
        if (!data.errorCode) {
            await WarMap.WarMapModel.updateOnSetMapName(data);
            Notify.dispatch(NotifyType.MsgMmSetMapName, data);
        }
    }

    export function reqMmAddWarRule(mapId: number, templateWarRule: CommonProto.WarRule.ITemplateWarRule): void {
        Net.NetManager.send({
            MsgMmAddWarRule: { c: {
                mapId,
                templateWarRule,
            } },
        });
    }
    async function _onMsgMmAddWarRule(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMmAddWarRule.IS;
        if (!data.errorCode) {
            await WarMap.WarMapModel.updateOnAddWarRule(data);
            Notify.dispatch(NotifyType.MsgMmAddWarRule, data);
        }
    }

    export function reqMmDeleteWarRule(mapId: number, ruleId: number): void {
        Net.NetManager.send({
            MsgMmDeleteWarRule: { c: {
                mapId,
                ruleId,
            } },
        });
    }
    async function _onMsgMmDeleteWarRule(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMmDeleteWarRule.IS;
        if (!data.errorCode) {
            await WarMap.WarMapModel.updateOnDeleteWarRule(data);
            Notify.dispatch(NotifyType.MsgMmDeleteWarRule, data);
        }
    }

    export function reqMmSetWarRuleName(mapId: number, ruleId: number, ruleNameArray: CommonProto.Structure.ILanguageText[]): void {
        Net.NetManager.send({
            MsgMmSetWarRuleName : { c: {
                mapId,
                ruleId,
                ruleNameArray,
            } },
        });
    }
    async function _onMsgMmSetWarRuleName(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMmSetWarRuleName.IS;
        if (!data.errorCode) {
            await WarMap.WarMapModel.updateOnMsgMmSetWarRuleName(data);
            Notify.dispatch(NotifyType.MsgMmSetWarRuleName, data);
        }
    }
}

// export default WarMapProxy;
