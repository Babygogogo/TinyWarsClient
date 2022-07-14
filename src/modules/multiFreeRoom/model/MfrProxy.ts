
// import MfrModel             from "../../multiFreeRoom/model/MfrModel";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiFreeRoom.MfrProxy {
    import NotifyType       = Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = Net.NetMessageCodes;

    export function init(): void {
        Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMfrCreateRoom,                callback: _onMsgMfrCreateRoom },
            { msgCode: NetMessageCodes.MsgMfrJoinRoom,                  callback: _onMsgMfrJoinRoom },
            { msgCode: NetMessageCodes.MsgMfrDeleteRoom,                callback: _onMsgMfrDeleteRoom },
            { msgCode: NetMessageCodes.MsgMfrExitRoom,                  callback: _onMsgMfrExitRoom },
            { msgCode: NetMessageCodes.MsgMfrDeletePlayer,              callback: _onMsgMfrDeletePlayer },
            { msgCode: NetMessageCodes.MsgMfrSetReady,                  callback: _onMsgMfrSetReady },
            { msgCode: NetMessageCodes.MsgMfrSetSelfSettings,           callback: _onMsgMfrSetSelfSettings },
            { msgCode: NetMessageCodes.MsgMfrGetRoomStaticInfo,         callback: _onMsgMfrGetRoomStaticInfo },
            { msgCode: NetMessageCodes.MsgMfrGetRoomPlayerInfo,         callback: _onMsgMfrGetRoomPlayerInfo },
            { msgCode: NetMessageCodes.MsgMfrStartWar,                  callback: _onMsgMfrStartWar },
        ], null);
    }

    export function reqCreateRoom(param: CommonProto.NetMessage.MsgMfrCreateRoom.IC): void {
        Net.NetManager.send({
            MsgMfrCreateRoom: { c: param },
        });
    }
    function _onMsgMfrCreateRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrCreateRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMfrCreateRoom, data);
        }
    }

    export function reqMfrJoinRoom(param: CommonProto.NetMessage.MsgMfrJoinRoom.IC): void {
        Net.NetManager.send({
            MsgMfrJoinRoom: { c: param },
        });
    }
    async function _onMsgMfrJoinRoom(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMfrJoinRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMfrJoinRoom, data);
        }
    }

    export function reqMfrDeleteRoom(roomId: number): void {
        Net.NetManager.send({
            MsgMfrDeleteRoom: { c: {
                roomId,
            } },
        });
    }
    function _onMsgMfrDeleteRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrDeleteRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMfrDeleteRoom, data);
        }
    }

    export function reqMfrExitRoom(roomId: number): void {
        Net.NetManager.send({
            MsgMfrExitRoom: { c: {
                roomId,
            }, },
        });
    }
    async function _onMsgMfrExitRoom(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMfrExitRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMfrExitRoom, data);
        }
    }

    export function reqMfrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
        Net.NetManager.send({
            MsgMfrDeletePlayer: { c: {
                roomId,
                playerIndex,
                forbidReentrance
            }, },
        });
    }
    async function _onMsgMfrDeletePlayer(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMfrDeletePlayer.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMfrDeletePlayer, data);
        }
    }

    export function reqMfrSetReady(roomId: number, isReady: boolean): void {
        Net.NetManager.send({
            MsgMfrSetReady: { c: {
                roomId,
                isReady,
            }, },
        });
    }
    async function _onMsgMfrSetReady(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMfrSetReady.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMfrSetReady, data);
        }
    }

    export function reqMfrSetSelfSettings(data: NetMessage.MsgMfrSetSelfSettings.IC): void {
        Net.NetManager.send({
            MsgMfrSetSelfSettings: { c: data },
        });
    }
    async function _onMsgMfrSetSelfSettings(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMfrSetSelfSettings.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMfrSetSelfSettings, data);
        }
    }

    export function reqMfrGetRoomStaticInfo(roomId: number): void {
        Net.NetManager.send({
            MsgMfrGetRoomStaticInfo: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMfrGetRoomStaticInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrGetRoomStaticInfo.IS;
        if (!data.errorCode) {
            MfrModel.setRoomStaticInfo(Helpers.getExisted(data.roomId), data.roomStaticInfo ?? null);
            Notify.dispatch(NotifyType.MsgMfrGetRoomStaticInfo, data);
        }
    }

    export function reqMfrGetRoomPlayerInfo(roomId: number): void {
        Net.NetManager.send({
            MsgMfrGetRoomPlayerInfo: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMfrGetRoomPlayerInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrGetRoomPlayerInfo.IS;
        if (!data.errorCode) {
            MfrModel.setRoomPlayerInfo(Helpers.getExisted(data.roomId), data.roomPlayerInfo ?? null);
            Notify.dispatch(NotifyType.MsgMfrGetRoomPlayerInfo, data);
        }
    }

    export function reqMfrStartWar(roomId: number): void {
        Net.NetManager.send({
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

// export default MfrProxy;
