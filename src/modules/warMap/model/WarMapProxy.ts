
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarMapModel          from "./WarMapModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarMap.WarMapProxy {
    import NotifyType       = Twns.Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = Twns.Net.NetMessageCodes;

    export function init(): void {
        Twns.Net.NetManager.addListeners([
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
        ], null);
    }

    function _onMsgMapGetEnabledMapIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetEnabledMapIdArray.IS;
        if (!data.errorCode) {
            Twns.WarMap.WarMapModel.resetEnabledMapIdArray(data.mapIdArray || []);
            Twns.Notify.dispatch(NotifyType.MsgMapGetEnabledMapIdArray, data);
        }
    }

    export function reqGetMapBriefData(mapId: number): void {
        Twns.Net.NetManager.send({
            MsgMapGetBriefData: { c: {
                mapId,
            }, },
        });
    }
    function _onMsgMapGetBriefData(e: egret.Event): void {
        const data  = e.data as NetMessage.MsgMapGetBriefData.IS;
        Twns.WarMap.WarMapModel.setBriefData(Twns.Helpers.getExisted(data.mapId), data.mapBriefData ?? null);
        Twns.Notify.dispatch(NotifyType.MsgMapGetBriefData, data);
    }

    export function reqGetMapRawData(mapId: number): void {
        Twns.Net.NetManager.send({
            MsgMapGetRawData: { c: {
                mapId,
            }, },
        });
    }
    function _onMsgMapGetRawData(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMapGetRawData.IS;
        Twns.WarMap.WarMapModel.setRawData(Twns.Helpers.getExisted(data.mapId), data.mapRawData ?? null);
        Twns.Notify.dispatch(NotifyType.MsgMapGetRawData, data);
    }

    export function reqMmSetWarRuleAvailability({ mapId, ruleId, availability }: {
        mapId       : number;
        ruleId      : number;
        availability: CommonProto.WarRule.IRuleAvailability;
    }): void {
        Twns.Net.NetManager.send({
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
            await Twns.WarMap.WarMapModel.updateOnSetWarRuleAvailability(data);
            Twns.Notify.dispatch(NotifyType.MsgMmSetWarRuleAvailability, data);
        }
    }

    export function reqMmSetMapEnabled(mapId: number, isEnabled: boolean): void {
        Twns.Net.NetManager.send({
            MsgMmSetMapEnabled: { c: {
                mapId,
                isEnabled,
            }, }
        });
    }
    function _onMsgMmSetMapEnabled(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmSetMapEnabled.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgMmSetMapEnabled, data);
        }
    }

    export function reqMmGetReviewingMaps(): void {
        Twns.Net.NetManager.send({
            MsgMmGetReviewingMaps: { c: {} },
        });
    }
    function _onMsgMmGetReviewingMaps(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmGetReviewingMaps.IS;
        if (!data.errorCode) {
            Twns.WarMap.WarMapModel.setMmReviewingMaps(data.maps || []);
            Twns.Notify.dispatch(NotifyType.MsgMmGetReviewingMaps, data);
        }
    }

    export function reqMmReviewMap({ designerUserId, slotIndex, modifiedTime, isAccept, reviewComment }: {
        designerUserId  : number;
        slotIndex       : number;
        modifiedTime    : number;
        isAccept        : boolean;
        reviewComment   : string | null;
    }): void {
        Twns.Net.NetManager.send({
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
            Twns.Notify.dispatch(NotifyType.MsgMmReviewMap, data);
        }
    }

    export function reqMmSetMapTag(mapId: number, mapTag: CommonProto.Map.IDataForMapTag | null): void {
        Twns.Net.NetManager.send({ MsgMmSetMapTag: { c: {
            mapId,
            mapTag,
        } } });
    }
    function _onMsgMmSetMapTag(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMmSetMapTag.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgMmSetMapTag, data);
        }
    }

    export function reqMmSetMapName(mapId: number, mapNameArray: CommonProto.Structure.ILanguageText[]): void {
        Twns.Net.NetManager.send({ MsgMmSetMapName: { c: {
            mapId,
            mapNameArray,
        } } });
    }
    async function _onMsgMmSetMapName(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMmSetMapName.IS;
        if (!data.errorCode) {
            await Twns.WarMap.WarMapModel.updateOnSetMapName(data);
            Twns.Notify.dispatch(NotifyType.MsgMmSetMapName, data);
        }
    }

    export function reqMmAddWarRule(mapId: number, templateWarRule: CommonProto.WarRule.ITemplateWarRule): void {
        Twns.Net.NetManager.send({
            MsgMmAddWarRule: { c: {
                mapId,
                templateWarRule,
            } },
        });
    }
    async function _onMsgMmAddWarRule(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMmAddWarRule.IS;
        if (!data.errorCode) {
            await Twns.WarMap.WarMapModel.updateOnAddWarRule(data);
            Twns.Notify.dispatch(NotifyType.MsgMmAddWarRule, data);
        }
    }

    export function reqMmDeleteWarRule(mapId: number, ruleId: number): void {
        Twns.Net.NetManager.send({
            MsgMmDeleteWarRule: { c: {
                mapId,
                ruleId,
            } },
        });
    }
    async function _onMsgMmDeleteWarRule(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMmDeleteWarRule.IS;
        if (!data.errorCode) {
            await Twns.WarMap.WarMapModel.updateOnDeleteWarRule(data);
            Twns.Notify.dispatch(NotifyType.MsgMmDeleteWarRule, data);
        }
    }
}

// export default WarMapProxy;
