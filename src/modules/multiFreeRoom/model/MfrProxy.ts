
import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import NetManager           from "../../tools/network/NetManager";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import { MfrModel }             from "../../multiFreeRoom/model/MfrModel";

namespace MfrProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMfrCreateRoom,                 callback: _onMsgMfrCreateRoom },
            { msgCode: NetMessageCodes.MsgMfrJoinRoom,                   callback: _onMsgMfrJoinRoom },
            { msgCode: NetMessageCodes.MsgMfrDeleteRoomByPlayer,         callback: _onMsgMfrDeleteRoomByPlayer },
            { msgCode: NetMessageCodes.MsgMfrDeleteRoomByServer,         callback: _onMsgMfrDeleteRoomByServer },
            { msgCode: NetMessageCodes.MsgMfrExitRoom,                   callback: _onMsgMfrExitRoom },
            { msgCode: NetMessageCodes.MsgMfrDeletePlayer,               callback: _onMsgMfrDeletePlayer },
            { msgCode: NetMessageCodes.MsgMfrSetReady,                   callback: _onMsgMfrSetReady },
            { msgCode: NetMessageCodes.MsgMfrSetSelfSettings,            callback: _onMsgMfrSetSelfSettings },
            { msgCode: NetMessageCodes.MsgMfrGetOwnerPlayerIndex,        callback: _onMsgMfrGetOwnerPlayerIndex },
            { msgCode: NetMessageCodes.MsgMfrGetRoomInfo,                callback: _onMsgMfrGetRoomInfo },
            { msgCode: NetMessageCodes.MsgMfrGetJoinableRoomInfoList,    callback: _onMsgMfrGetJoinableRoomInfoList },
            { msgCode: NetMessageCodes.MsgMfrGetJoinedRoomInfoList,      callback: _onMsgMfrGetJoinedRoomInfoList },
            { msgCode: NetMessageCodes.MsgMfrStartWar,                   callback: _onMsgMfrStartWar },
        ], undefined);
    }

    export function reqCreateRoom(param: ProtoTypes.NetMessage.MsgMfrCreateRoom.IC): void {
        NetManager.send({
            MsgMfrCreateRoom: { c: param },
        });
    }
    function _onMsgMfrCreateRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrCreateRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMfrCreateRoom, data);
        }
    }

    export function reqMfrJoinRoom(param: ProtoTypes.NetMessage.MsgMfrJoinRoom.IC): void {
        NetManager.send({
            MsgMfrJoinRoom: { c: param },
        });
    }
    async function _onMsgMfrJoinRoom(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMfrJoinRoom.IS;
        if (!data.errorCode) {
            await MfrModel.updateOnMsgMfrJoinRoom(data);
            Notify.dispatch(NotifyType.MsgMfrJoinRoom, data);
        }
    }

    export function reqMfrDeleteRoomByPlayer(roomId: number): void {
        NetManager.send({
            MsgMfrDeleteRoomByPlayer: { c: {
                roomId,
            } },
        });
    }
    function _onMsgMfrDeleteRoomByPlayer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrDeleteRoomByPlayer.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMfrDeleteRoomByPlayer, data);
        }
    }

    function _onMsgMfrDeleteRoomByServer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrDeleteRoomByServer.IS;
        if (!data.errorCode) {
            MfrModel.deleteRoomInfo(data.roomId);
            Notify.dispatch(NotifyType.MsgMfrDeleteRoomByServer, data);
        }
    }

    export function reqMfrExitRoom(roomId: number): void {
        NetManager.send({
            MsgMfrExitRoom: { c: {
                roomId,
            }, },
        });
    }
    async function _onMsgMfrExitRoom(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMfrExitRoom.IS;
        if (!data.errorCode) {
            await MfrModel.updateOnMsgMfrExitRoom(data);
            Notify.dispatch(NotifyType.MsgMfrExitRoom, data);
        }
    }

    export function reqMfrDeletePlayer(roomId: number, playerIndex: number): void {
        NetManager.send({
            MsgMfrDeletePlayer: { c: {
                roomId,
                playerIndex,
            }, },
        });
    }
    async function _onMsgMfrDeletePlayer(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMfrDeletePlayer.IS;
        if (!data.errorCode) {
            await MfrModel.updateOnMsgMfrDeletePlayer(data);
            Notify.dispatch(NotifyType.MsgMfrDeletePlayer, data);
        }
    }

    export function reqMfrSetReady(roomId: number, isReady: boolean): void {
        NetManager.send({
            MsgMfrSetReady: { c: {
                roomId,
                isReady,
            }, },
        });
    }
    async function _onMsgMfrSetReady(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMfrSetReady.IS;
        if (!data.errorCode) {
            await MfrModel.updateOnMsgMfrSetReady(data);
            Notify.dispatch(NotifyType.MsgMfrSetReady, data);
        }
    }

    export function reqMfrSetSelfSettings(data: NetMessage.MsgMfrSetSelfSettings.IC): void {
        NetManager.send({
            MsgMfrSetSelfSettings: { c: data },
        });
    }
    async function _onMsgMfrSetSelfSettings(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMfrSetSelfSettings.IS;
        if (!data.errorCode) {
            await MfrModel.updateOnMsgMfrSetSelfSettings(data);
            Notify.dispatch(NotifyType.MsgMfrSetSelfSettings, data);
        }
    }

    async function _onMsgMfrGetOwnerPlayerIndex(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMfrGetOwnerPlayerIndex.IS;
        if (!data.errorCode) {
            await MfrModel.updateOnMsgMfrGetOwnerPlayerIndex(data);
            Notify.dispatch(NotifyType.MsgMfrGetOwnerPlayerIndex, data);
        }
    }

    export function reqMfrGetRoomInfo(roomId: number): void {
        NetManager.send({
            MsgMfrGetRoomInfo: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMfrGetRoomInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrGetRoomInfo.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgMfrGetRoomInfoFailed, data);
        } else {
            const roomInfo  = data.roomInfo;
            const roomId    = data.roomId;
            if (roomInfo) {
                MfrModel.setRoomInfo(roomInfo);
            } else {
                MfrModel.deleteRoomInfo(roomId);
            }

            Notify.dispatch(NotifyType.MsgMfrGetRoomInfo, data);
        }
    }

    export function reqMfrGetJoinableRoomInfoList(): void {
        NetManager.send({
            MsgMfrGetJoinableRoomInfoList: { c: {
            }, },
        });
    }
    function _onMsgMfrGetJoinableRoomInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrGetJoinableRoomInfoList.IS;
        if (!data.errorCode) {
            MfrModel.setJoinableRoomInfoList(data.roomInfoList);
            Notify.dispatch(NotifyType.MsgMfrGetJoinableRoomInfoList, data);
        }
    }

    export function reqMfrGetJoinedRoomInfoList(): void {
        NetManager.send({
            MsgMfrGetJoinedRoomInfoList: { c: {
            }, }
        });
    }
    function _onMsgMfrGetJoinedRoomInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrGetJoinedRoomInfoList.IS;
        if (!data.errorCode) {
            MfrModel.setJoinedRoomInfoList(data.roomInfoList);
            Notify.dispatch(NotifyType.MsgMfrGetJoinedRoomInfoList, data);
        }
    }

    export function reqMfrStartWar(roomId: number): void {
        NetManager.send({
            MsgMfrStartWar: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMfrStartWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrStartWar.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMfrStartWar, data);
        }
    }
}

export default MfrProxy;
