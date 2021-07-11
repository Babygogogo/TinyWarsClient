
import { SpwWar }                       from "../../singlePlayerWar/model/SpwWar";
import { SrwWar }                       from "../../singleRankWar/model/SrwWar";
import { NetMessageCodes }              from "../../../network/NetMessageCodes";
import * as NetManager                  from "../../../network/NetManager";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as ScrModel                    from "../../singleCustomRoom/model/ScrModel";
import * as SpmModel                    from "./SpmModel";

export function init(): void {
    NetManager.addListeners([
        { msgCode: NetMessageCodes.MsgSpmCreateScw,                      callback: _onMsgSpmCreateScw },
        { msgCode: NetMessageCodes.MsgSpmCreateSfw,                      callback: _onMsgSpmCreateSfw },
        { msgCode: NetMessageCodes.MsgSpmCreateSrw,                      callback: _onMsgSpmCreateSrw },
        { msgCode: NetMessageCodes.MsgSpmGetWarSaveSlotFullDataArray,    callback: _onMsgSpmGetWarSaveSlotFullDataArray },
        { msgCode: NetMessageCodes.MsgSpmDeleteWarSaveSlot,              callback: _onMsgSpmDeleteWarSaveSlot },
        { msgCode: NetMessageCodes.MsgSpmSaveScw,                        callback: _onMsgSpmSaveScw },
        { msgCode: NetMessageCodes.MsgSpmSaveSfw,                        callback: _onMsgSpmSaveSfw },
        { msgCode: NetMessageCodes.MsgSpmSaveSrw,                        callback: _onMsgSpmSaveSrw },
        { msgCode: NetMessageCodes.MsgSpmGetSrwRankInfo,                 callback: _onMsgSpmGetSrwRankInfo },
        { msgCode: NetMessageCodes.MsgSpmValidateSrw,                    callback: _onMsgSpmValidateSrw },
    ], undefined);
}

export function reqSpmGetWarSaveSlotFullDataArray(): void {
    NetManager.send({
        MsgSpmGetWarSaveSlotFullDataArray: { c: {} },
    });
}
function _onMsgSpmGetWarSaveSlotFullDataArray(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgSpmGetWarSaveSlotFullDataArray.IS;
    if (!data.errorCode) {
        SpmModel.SaveSlot.updateOnMsgSpmGetWarSaveSlotFullDataArray(data);
        Notify.dispatch(NotifyType.MsgSpmGetWarSaveSlotFullDataArray, data);
    }
}

export function reqSpmCreateScw(param: ScrModel.DataForCreateWar): void {
    NetManager.send({
        MsgSpmCreateScw: { c: param },
    });
}
function _onMsgSpmCreateScw(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateScw.IS;
    if (!data.errorCode) {
        SpmModel.SaveSlot.updateOnMsgSpmCreateScw(data);
        Notify.dispatch(NotifyType.MsgSpmCreateScw, data);
    }
}

export function reqSpmCreateSfw({ slotIndex, slotExtraData, warData }: {
    slotIndex       : number;
    slotExtraData   : ProtoTypes.SinglePlayerMode.ISpmWarSaveSlotExtraData;
    warData         : ProtoTypes.WarSerialization.ISerialWar;
}): void {
    NetManager.send({
        MsgSpmCreateSfw: { c: {
            slotIndex,
            slotExtraData,
            warData,
        }, },
    });
}
function _onMsgSpmCreateSfw(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSfw.IS;
    if (!data.errorCode) {
        SpmModel.SaveSlot.updateOnMsgSpmCreateSfw(data);
        Notify.dispatch(NotifyType.MsgSpmCreateSfw, data);
    }
}

export function reqSpmCreateSrw(data: ProtoTypes.NetMessage.MsgSpmCreateSrw.IC): void {
    NetManager.send({
        MsgSpmCreateSrw: { c: data },
    });
}
function _onMsgSpmCreateSrw(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgSpmCreateSrw.IS;
    if (!data.errorCode) {
        SpmModel.SaveSlot.updateOnMsgSpmCreateSrw(data);
        Notify.dispatch(NotifyType.MsgSpmCreateSrw, data);
    }
}

export function reqSpmSaveScw(war: SpwWar): void {
    NetManager.send({
        MsgSpmSaveScw: { c: {
            slotIndex       : war.getSaveSlotIndex(),
            slotExtraData   : war.getSaveSlotExtraData(),
            warData         : war.serialize(),
        }, },
    });
}
function _onMsgSpmSaveScw(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgSpmSaveScw.IS;
    if (!data.errorCode) {
        SpmModel.SaveSlot.updateOnMsgSpmSaveScw(data);
        Notify.dispatch(NotifyType.MsgSpmSaveScw, data);
    }
}

export function reqSpmSaveSfw(war: SpwWar): void {
    NetManager.send({
        MsgSpmSaveSfw: { c: {
            slotIndex       : war.getSaveSlotIndex(),
            slotExtraData   : war.getSaveSlotExtraData(),
            warData         : war.serialize(),
        }, },
    });
}
function _onMsgSpmSaveSfw(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgSpmSaveSfw.IS;
    if (!data.errorCode) {
        SpmModel.SaveSlot.updateOnMsgSpmSaveSfw(data);
        Notify.dispatch(NotifyType.MsgSpmSaveSfw, data);
    }
}

export function reqSpmSaveSrw(war: SpwWar): void {
    NetManager.send({
        MsgSpmSaveSrw: { c: {
            slotIndex       : war.getSaveSlotIndex(),
            slotExtraData   : war.getSaveSlotExtraData(),
            warData         : war.serialize(),
        }, },
    });
}
function _onMsgSpmSaveSrw(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgSpmSaveSrw.IS;
    if (!data.errorCode) {
        SpmModel.SaveSlot.updateOnMsgSpmSaveSrw(data);
        Notify.dispatch(NotifyType.MsgSpmSaveSrw, data);
    }
}

export function reqSpmDeleteWarSaveSlot(slotIndex: number): void {
    NetManager.send({
        MsgSpmDeleteWarSaveSlot: { c: {
            slotIndex,
        } },
    });
}
function _onMsgSpmDeleteWarSaveSlot(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgSpmDeleteWarSaveSlot.IS;
    if (!data.errorCode) {
        SpmModel.SaveSlot.updateOnMsgSpmDeleteWarSaveSlot(data.slotIndex);
        Notify.dispatch(NotifyType.MsgSpmDeleteWarSaveSlot, data);
    }
}

export function reqSpmGetSrwRankInfo(mapId: number): void {
    NetManager.send({
        MsgSpmGetSrwRankInfo: { c: {
            mapId,
        } },
    });
}
function _onMsgSpmGetSrwRankInfo(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgSpmGetSrwRankInfo.IS;
    if (!data.errorCode) {
        SpmModel.SrwRank.updateOnMsgSpmGetSrwRankInfo(data);
        Notify.dispatch(NotifyType.MsgSpmGetSrwRankInfo, data);
    }
}

export function reqSpmValidateSrw(war: SrwWar): void {
    NetManager.send({
        MsgSpmValidateSrw: { c: {
            slotIndex   : war.getSaveSlotIndex(),
            warData     : war.serializeForValidation(),
        } },
    });
}
function _onMsgSpmValidateSrw(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgSpmValidateSrw.IS;
    if (!data.errorCode) {
        SpmModel.SaveSlot.updateOnMsgSpmValidateSrw(data);
        Notify.dispatch(NotifyType.MsgSpmValidateSrw, data);
    }
}
