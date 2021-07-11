
import * as CommonModel     from "./CommonModel";
import { Notify }           from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes      from "../../../utility/ProtoTypes";
import * as ConfigManager   from "../../../utility/ConfigManager";
import * as NetManager      from "../../../network/NetManager";
import { NetMessageCodes }  from "../../../network/NetMessageCodes";
import NetMessage           = ProtoTypes.NetMessage;

export function init(): void {
    NetManager.addListeners([
        { msgCode: NetMessageCodes.MsgCommonHeartbeat,           callback: _onMsgCommonHeartbeat },
        { msgCode: NetMessageCodes.MsgCommonError,               callback: _onMsgCommonError, },
        { msgCode: NetMessageCodes.MsgCommonLatestConfigVersion, callback: _onMsgCommonLatestConfigVersion },
        { msgCode: NetMessageCodes.MsgCommonGetServerStatus,     callback: _onMsgCommonGetServerStatus, },
        { msgCode: NetMessageCodes.MsgCommonGetRankList,         callback: _onMsgCommonGetRankList },
    ], undefined);
}

export function reqCommonHeartbeat(counter: number): void {
    NetManager.send({
        MsgCommonHeartbeat: { c: {
            counter,
        } },
    });
}
function _onMsgCommonHeartbeat(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgCommonHeartbeat.IS;
    if (!data.errorCode) {
        Notify.dispatch(NotifyType.MsgCommonHeartbeat, data);
    }
}

function _onMsgCommonError(e: egret.Event): void {
    const data = e.data as ProtoTypes.NetMessage.MsgCommonError.IS;
}

function _onMsgCommonLatestConfigVersion(e: egret.Event): void {
    const data      = e.data as ProtoTypes.NetMessage.MsgCommonLatestConfigVersion.IS;
    const version   = data.version;
    ConfigManager.setLatestFormalVersion(version);
    ConfigManager.loadConfig(version);
    Notify.dispatch(NotifyType.MsgCommonLatestConfigVersion, data);
}

export function reqCommonGetServerStatus(): void {
    NetManager.send({ MsgCommonGetServerStatus: { c: {} }, });
}
function _onMsgCommonGetServerStatus(e: egret.Event): void {
    const data = e.data as NetMessage.MsgCommonGetServerStatus.IS;
    if (!data.errorCode) {
        Notify.dispatch(NotifyType.MsgCommonGetServerStatus, data);
    }
}

export function reqGetRankList(): void {
    NetManager.send({ MsgCommonGetRankList: { c: {} } });
}
function _onMsgCommonGetRankList(e: egret.Event): void {
    const data = e.data as NetMessage.MsgCommonGetRankList.IS;
    if (!data.errorCode) {
        CommonModel.setRankList(data.rankDataList);
        Notify.dispatch(NotifyType.MsgCommonGetRankList, data);
    }
}
