
// import McrModel             from "../../multiCustomRoom/model/McrModel";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import McrJoinModel         from "./McrJoinModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiCustomRoom.McrProxy {
    import NotifyType       = Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = Net.NetMessageCodes;

    export function init(): void {
        Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMcrCreateRoom,                callback: _onMsgMcrCreateRoom },
            { msgCode: NetMessageCodes.MsgMcrJoinRoom,                  callback: _onMsgMcrJoinRoom },
            { msgCode: NetMessageCodes.MsgMcrDeleteRoom,                callback: _onMsgMcrDeleteRoom },
            { msgCode: NetMessageCodes.MsgMcrExitRoom,                  callback: _onMsgMcrExitRoom },
            { msgCode: NetMessageCodes.MsgMcrDeletePlayer,              callback: _onMsgMcrDeletePlayer },
            { msgCode: NetMessageCodes.MsgMcrSetReady,                  callback: _onMsgMcrSetReady },
            { msgCode: NetMessageCodes.MsgMcrSetSelfSettings,           callback: _onMsgMcrSetSelfSettings },
            { msgCode: NetMessageCodes.MsgMcrGetRoomStaticInfo,         callback: _onMsgMcrGetRoomStaticInfo },
            { msgCode: NetMessageCodes.MsgMcrGetRoomPlayerInfo,         callback: _onMsgMcrGetRoomPlayerInfo },
            { msgCode: NetMessageCodes.MsgMcrStartWar,                  callback: _onMsgMcrStartWar },
        ], null);
    }

    export function reqCreateRoom(param: NetMessage.MsgMcrCreateRoom.IC): void {
        Net.NetManager.send({
            MsgMcrCreateRoom: { c: param },
        });
    }
    function _onMsgMcrCreateRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrCreateRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrCreateRoom, data);
        } else {
            Notify.dispatch(NotifyType.MsgMcrCreateRoomFailed, data);
        }
    }

    export function reqMcrJoinRoom(data: NetMessage.MsgMcrJoinRoom.IC): void {
        Net.NetManager.send({
            MsgMcrJoinRoom: { c: data },
        });
    }
    async function _onMsgMcrJoinRoom(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMcrJoinRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrJoinRoom, data);
        }
    }

    export function reqMcrDeleteRoom(roomId: number): void {
        Net.NetManager.send({
            MsgMcrDeleteRoom: { c: {
                roomId,
            } },
        });
    }
    function _onMsgMcrDeleteRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrDeleteRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrDeleteRoom, data);
        }
    }

    export function reqMcrExitRoom(roomId: number): void {
        Net.NetManager.send({
            MsgMcrExitRoom: { c: {
                roomId,
            }, },
        });
    }
    async function _onMsgMcrExitRoom(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMcrExitRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrExitRoom, data);
        }
    }

    // export function reqMcrSetWarRule(data: NetMessage.MsgMcrSetWarRule.IC): void {
    //     NetManager.send({
    //         MsgMcrSetWarRule: { c: data },
    //     });
    // }
    // function _onMsgMcrSetWarRule(e: egret.Event): void {
    //     const data = e.data as NetMessage.MsgMcrSetWarRule.IS;
    //     if (!data.errorCode) {
    //         Notify.dispatch(Notify.Type.MsgMcrSetWarRule, data);
    //     }
    // }

    export function reqMcrDeletePlayer(roomId: number, playerIndex: number, forbidReentrance: boolean): void {
        Net.NetManager.send({
            MsgMcrDeletePlayer: { c: {
                roomId,
                playerIndex,
                forbidReentrance
            }, },
        });
    }
    async function _onMsgMcrDeletePlayer(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMcrDeletePlayer.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrDeletePlayer, data);
        }
    }

    export function reqMcrSetReady(roomId: number, isReady: boolean): void {
        Net.NetManager.send({
            MsgMcrSetReady: { c: {
                roomId,
                isReady,
            }, },
        });
    }
    async function _onMsgMcrSetReady(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMcrSetReady.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrSetReady, data);
        }
    }

    export function reqMcrSetSelfSettings(data: NetMessage.MsgMcrSetSelfSettings.IC): void {
        Net.NetManager.send({
            MsgMcrSetSelfSettings: { c: data },
        });
    }
    async function _onMsgMcrSetSelfSettings(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMcrSetSelfSettings.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrSetSelfSettings, data);
        }
    }

    export function reqMcrGetRoomStaticInfo(roomId: number): void {
        Net.NetManager.send({
            MsgMcrGetRoomStaticInfo: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMcrGetRoomStaticInfo(e: egret.Event): void {
        const data      = e.data as NetMessage.MsgMcrGetRoomStaticInfo.IS;
        const roomId    = data.roomId;
        if (!data.errorCode) {
            McrModel.setRoomStaticInfo(Helpers.getExisted(roomId), data.roomStaticInfo ?? null);
            Notify.dispatch(NotifyType.MsgMcrGetRoomStaticInfo, data);
        } else {
            if (roomId != null) {
                McrModel.setRoomStaticInfo(roomId, data.roomStaticInfo ?? null);
            }
            Notify.dispatch(NotifyType.MsgMcrGetRoomStaticInfoFailed, data);
        }
    }

    export function reqMcrGetRoomPlayerInfo(roomId: number): void {
        Net.NetManager.send({
            MsgMcrGetRoomPlayerInfo: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMcrGetRoomPlayerInfo(e: egret.Event): void {
        const data      = e.data as NetMessage.MsgMcrGetRoomPlayerInfo.IS;
        const roomId    = data.roomId;
        if (!data.errorCode) {
            McrModel.setRoomPlayerInfo(Helpers.getExisted(roomId), data.roomPlayerInfo ?? null);
            Notify.dispatch(NotifyType.MsgMcrGetRoomPlayerInfo, data);
        } else {
            if (roomId != null) {
                McrModel.setRoomPlayerInfo(roomId, data.roomPlayerInfo ?? null);
            }
            Notify.dispatch(NotifyType.MsgMcrGetRoomPlayerInfoFailed, data);
        }
    }

    export function reqMcrStartWar(roomId: number): void {
        Net.NetManager.send({
            MsgMcrStartWar: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMcrStartWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrStartWar.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMcrStartWar, data);
        }
    }
}

// export default McrProxy;
