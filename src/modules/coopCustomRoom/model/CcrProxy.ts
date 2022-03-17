
// import CcrModel             from "../../coopCustomRoom/model/CcrModel";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace CcrProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgCcrCreateRoom,                callback: _onMsgCcrCreateRoom },
            { msgCode: NetMessageCodes.MsgCcrJoinRoom,                  callback: _onMsgCcrJoinRoom },
            { msgCode: NetMessageCodes.MsgCcrDeleteRoom,                callback: _onMsgCcrDeleteRoom },
            { msgCode: NetMessageCodes.MsgCcrExitRoom,                  callback: _onMsgCcrExitRoom },
            { msgCode: NetMessageCodes.MsgCcrDeletePlayer,              callback: _onMsgCcrDeletePlayer },
            { msgCode: NetMessageCodes.MsgCcrSetReady,                  callback: _onMsgCcrSetReady },
            { msgCode: NetMessageCodes.MsgCcrSetSelfSettings,           callback: _onMsgCcrSetSelfSettings },
            { msgCode: NetMessageCodes.MsgCcrGetRoomStaticInfo,         callback: _onMsgCcrGetRoomStaticInfo },
            { msgCode: NetMessageCodes.MsgCcrGetRoomPlayerInfo,         callback: _onMsgCcrGetRoomPlayerInfo },
            { msgCode: NetMessageCodes.MsgCcrGetJoinableRoomIdArray,    callback: _onMsgCcrGetJoinableRoomIdArray },
            { msgCode: NetMessageCodes.MsgCcrGetJoinedRoomIdArray,      callback: _onMsgCcrGetJoinedRoomIdArray },
            { msgCode: NetMessageCodes.MsgCcrStartWar,                  callback: _onMsgCcrStartWar },
        ], null);
    }

    export function reqCreateRoom(param: NetMessage.MsgCcrCreateRoom.IC): void {
        NetManager.send({
            MsgCcrCreateRoom: { c: param },
        });
    }
    function _onMsgCcrCreateRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrCreateRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCcrCreateRoom, data);
        }
    }

    export function reqCcrJoinRoom(data: NetMessage.MsgCcrJoinRoom.IC): void {
        NetManager.send({
            MsgCcrJoinRoom: { c: data },
        });
    }
    async function _onMsgCcrJoinRoom(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgCcrJoinRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCcrJoinRoom, data);
        }
    }

    export function reqCcrDeleteRoom(roomId: number): void {
        NetManager.send({
            MsgCcrDeleteRoom: { c: {
                roomId,
            } },
        });
    }
    function _onMsgCcrDeleteRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrDeleteRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCcrDeleteRoom, data);
        }
    }

    export function reqCcrExitRoom(roomId: number): void {
        NetManager.send({
            MsgCcrExitRoom: { c: {
                roomId,
            }, },
        });
    }
    async function _onMsgCcrExitRoom(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgCcrExitRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCcrExitRoom, data);
        }
    }

    export function reqCcrDeletePlayer(roomId: number, playerIndex: number): void {
        NetManager.send({
            MsgCcrDeletePlayer: { c: {
                roomId,
                playerIndex,
            }, },
        });
    }
    async function _onMsgCcrDeletePlayer(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgCcrDeletePlayer.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCcrDeletePlayer, data);
        }
    }

    export function reqCcrSetReady(roomId: number, isReady: boolean): void {
        NetManager.send({
            MsgCcrSetReady: { c: {
                roomId,
                isReady,
            }, },
        });
    }
    async function _onMsgCcrSetReady(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgCcrSetReady.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCcrSetReady, data);
        }
    }

    export function reqCcrSetSelfSettings(data: NetMessage.MsgCcrSetSelfSettings.IC): void {
        NetManager.send({
            MsgCcrSetSelfSettings: { c: data },
        });
    }
    async function _onMsgCcrSetSelfSettings(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgCcrSetSelfSettings.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCcrSetSelfSettings, data);
        }
    }

    export function reqCcrGetRoomStaticInfo(roomId: number): void {
        NetManager.send({
            MsgCcrGetRoomStaticInfo: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgCcrGetRoomStaticInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrGetRoomStaticInfo.IS;
        if (!data.errorCode) {
            CcrModel.setRoomStaticInfo(Helpers.getExisted(data.roomId), data.roomStaticInfo ?? null);
            Notify.dispatch(NotifyType.MsgCcrGetRoomStaticInfo, data);
        }
    }

    export function reqCcrGetRoomPlayerInfo(roomId: number): void {
        NetManager.send({
            MsgCcrGetRoomPlayerInfo: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgCcrGetRoomPlayerInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrGetRoomPlayerInfo.IS;
        if (!data.errorCode) {
            CcrModel.setRoomPlayerInfo(Helpers.getExisted(data.roomId), data.roomPlayerInfo ?? null);
            Notify.dispatch(NotifyType.MsgCcrGetRoomPlayerInfo, data);
        }
    }

    export function reqCcrGetJoinableRoomIdArray(roomFilter: Types.Undefinable<ProtoTypes.CoopCustomRoom.ICcrRoomFilter>): void {
        NetManager.send({
            MsgCcrGetJoinableRoomIdArray: { c: {
                roomFilter,
            }, },
        });
    }
    function _onMsgCcrGetJoinableRoomIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrGetJoinableRoomIdArray.IS;
        if (!data.errorCode) {
            CcrModel.setJoinableRoomIdArray(data.roomIdArray || []);
            Notify.dispatch(NotifyType.MsgCcrGetJoinableRoomIdArray, data);
        }
    }

    export function reqCcrGetJoinedRoomIdArray(): void {
        NetManager.send({
            MsgCcrGetJoinedRoomIdArray: { c: {
            }, }
        });
    }
    function _onMsgCcrGetJoinedRoomIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrGetJoinedRoomIdArray.IS;
        if (!data.errorCode) {
            CcrModel.setJoinedRoomIdArray(data.roomIdArray || []);
            Notify.dispatch(NotifyType.MsgCcrGetJoinedRoomIdArray, data);
        }
    }

    export function reqCcrStartWar(roomId: number): void {
        NetManager.send({
            MsgCcrStartWar: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgCcrStartWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrStartWar.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCcrStartWar, data);
        }
    }
}

// export default CcrProxy;
