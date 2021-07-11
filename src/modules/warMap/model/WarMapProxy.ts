
import * as WarMapModel     from "./WarMapModel";
import * as ProtoTypes      from "../../../utility/ProtoTypes";
import * as Notify          from "../../../utility/Notify";
import * as NetManager      from "../../../network/NetManager";
import { NetMessageCodes }  from "../../../network/NetMessageCodes";
import NetMessage           = ProtoTypes.NetMessage;

export function init(): void {
    NetManager.addListeners([
        { msgCode: NetMessageCodes.MsgMapGetEnabledBriefDataList,   callback: _onMsgMapGetEnabledBriefDataList },
        { msgCode: NetMessageCodes.MsgMapGetEnabledRawDataList,     callback: _onMsgMapGetEnabledRawDataList },
        { msgCode: NetMessageCodes.MsgMapGetBriefData,              callback: _onMsgMapGetBriefData },
        { msgCode: NetMessageCodes.MsgMapGetRawData,                callback: _onMsgMapGetRawData },
        { msgCode: NetMessageCodes.MsgMmSetMapAvailability,         callback: _onMsgMmSetMapAvailability },
        { msgCode: NetMessageCodes.MsgMmSetMapEnabled,              callback: _onMsgMmSetMapEnabled },
        { msgCode: NetMessageCodes.MsgMmGetReviewingMaps,           callback: _onMsgMmGetReviewingMaps },
        { msgCode: NetMessageCodes.MsgMmReviewMap,                  callback: _onMsgMmReviewMap },
        { msgCode: NetMessageCodes.MsgMmSetMapTag,                  callback: _onMsgMmSetMapTag },
    ], undefined);
}

function _onMsgMapGetEnabledBriefDataList(e: egret.Event): void {
    const data = e.data as NetMessage.MsgMapGetEnabledBriefDataList.IS;
    if (!data.errorCode) {
        WarMapModel.resetBriefDataDict(data.dataList);
        Notify.dispatch(Notify.Type.MsgMapGetEnabledBriefDataList, data);
    }
}

function _onMsgMapGetEnabledRawDataList(e: egret.Event): void {
    const data = e.data as NetMessage.MsgMapGetEnabledRawDataList.IS;
    if (!data.errorCode) {
        WarMapModel.updateRawDataDict(data.dataList);
        Notify.dispatch(Notify.Type.MsgMapGetEnabledRawDataList, data);
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
        Notify.dispatch(Notify.Type.MsgMapGetBriefDataFailed, data);
    } else {
        WarMapModel.setBriefData(data.mapBriefData);
        Notify.dispatch(Notify.Type.MsgMapGetBriefData, data);
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
        Notify.dispatch(Notify.Type.MsgMapGetRawDataFailed, data);
    } else {
        WarMapModel.setRawData(data.mapId, data.mapRawData);
        Notify.dispatch(Notify.Type.MsgMapGetRawData, data);
    }
}

export function reqMmSetMapAvailability(mapId: number, availability: ProtoTypes.Map.IMapAvailability): void {
    NetManager.send({
        MsgMmSetMapAvailability: { c: {
            mapId,
            availability,
        }, },
    });
}
function _onMsgMmSetMapAvailability(e: egret.Event): void {
    const data = e.data as NetMessage.MsgMmSetMapAvailability.IS;
    if (!data.errorCode) {
        Notify.dispatch(Notify.Type.MsgMmSetMapAvailability);
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
        Notify.dispatch(Notify.Type.MsgMmSetMapEnabled, data);
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
        WarMapModel.setMmReviewingMaps(data.maps);
        Notify.dispatch(Notify.Type.MsgMmGetReviewingMaps, data);
    }
}

export function reqMmReviewMap(
    { designerUserId, slotIndex, modifiedTime, isAccept, reviewComment, availability }: {
        designerUserId  : number;
        slotIndex       : number;
        modifiedTime    : number;
        isAccept        : boolean;
        reviewComment   : string | null;
        availability    : ProtoTypes.Map.IMapAvailability;
    }
): void {
    NetManager.send({
        MsgMmReviewMap: { c: {
            designerUserId,
            slotIndex,
            modifiedTime,
            isAccept,
            reviewComment,
            availability,
        }, },
    });
}
function _onMsgMmReviewMap(e: egret.Event): void {
    const data = e.data as NetMessage.MsgMmReviewMap.IS;
    if (!data.errorCode) {
        Notify.dispatch(Notify.Type.MsgMmReviewMap, data);
    }
}

export function reqMmSetMapTag(mapId: number, mapTag: ProtoTypes.Map.IDataForMapTag | null | undefined): void {
    NetManager.send({ MsgMmSetMapTag: { c: {
        mapId,
        mapTag,
    } } });
}
function _onMsgMmSetMapTag(e: egret.Event): void {
    const data = e.data as NetMessage.MsgMmSetMapTag.IS;
    if (!data.errorCode) {
        Notify.dispatch(Notify.Type.MsgMmSetMapTag, data);
    }
}
