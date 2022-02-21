
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
            { msgCode: NetMessageCodes.MsgCcrCreateRoom,                 callback: _onMsgCcrCreateRoom },
            { msgCode: NetMessageCodes.MsgCcrJoinRoom,                   callback: _onMsgCcrJoinRoom },
            { msgCode: NetMessageCodes.MsgCcrDeleteRoomByPlayer,         callback: _onMsgCcrDeleteRoomByPlayer },
            { msgCode: NetMessageCodes.MsgCcrDeleteRoomByServer,         callback: _onMsgCcrDeleteRoomByServer },
            { msgCode: NetMessageCodes.MsgCcrExitRoom,                   callback: _onMsgCcrExitRoom },
            { msgCode: NetMessageCodes.MsgCcrDeletePlayer,               callback: _onMsgCcrDeletePlayer },
            { msgCode: NetMessageCodes.MsgCcrSetReady,                   callback: _onMsgCcrSetReady },
            { msgCode: NetMessageCodes.MsgCcrSetSelfSettings,            callback: _onMsgCcrSetSelfSettings },
            { msgCode: NetMessageCodes.MsgCcrGetOwnerPlayerIndex,        callback: _onMsgCcrGetOwnerPlayerIndex },
            { msgCode: NetMessageCodes.MsgCcrGetRoomInfo,                callback: _onMsgCcrGetRoomInfo },
            { msgCode: NetMessageCodes.MsgCcrGetJoinableRoomInfoList,    callback: _onMsgCcrGetJoinableRoomInfoList },
            { msgCode: NetMessageCodes.MsgCcrGetJoinedRoomInfoList,      callback: _onMsgCcrGetJoinedRoomInfoList },
            { msgCode: NetMessageCodes.MsgCcrStartWar,                   callback: _onMsgCcrStartWar },
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
            await CcrModel.updateOnMsgCcrJoinRoom(data);
            Notify.dispatch(NotifyType.MsgCcrJoinRoom, data);
        }
    }

    export function reqCcrDeleteRoomByPlayer(roomId: number): void {
        NetManager.send({
            MsgCcrDeleteRoomByPlayer: { c: {
                roomId,
            } },
        });
    }
    function _onMsgCcrDeleteRoomByPlayer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrDeleteRoomByPlayer.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCcrDeleteRoomByPlayer, data);
        }
    }

    function _onMsgCcrDeleteRoomByServer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrDeleteRoomByServer.IS;
        if (!data.errorCode) {
            CcrModel.updateOnMsgCcrDeleteRoomByServer(data);
            Notify.dispatch(NotifyType.MsgCcrDeleteRoomByServer, data);
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
            await CcrModel.updateOnMsgCcrExitRoom(data);
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
            await CcrModel.updateOnMsgCcrDeletePlayer(data);
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
            await CcrModel.updateOnMsgCcrSetReady(data);
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
            await CcrModel.updateOnMsgCcrSetSelfSettings(data);
            Notify.dispatch(NotifyType.MsgCcrSetSelfSettings, data);
        }
    }

    async function _onMsgCcrGetOwnerPlayerIndex(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgCcrGetOwnerPlayerIndex.IS;
        if (!data.errorCode) {
            await CcrModel.updateOnMsgCcrGetOwnerPlayerIndex(data);
            Notify.dispatch(NotifyType.MsgCcrGetOwnerPlayerIndex, data);
        }
    }

    export function reqCcrGetRoomInfo(roomId: number): void {
        NetManager.send({
            MsgCcrGetRoomInfo: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgCcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrGetRoomInfo.IS;
        CcrModel.updateOnMsgCcrGetRoomInfo(data);
        Notify.dispatch(NotifyType.MsgCcrGetRoomInfo, data);
    }

    export function reqCcrGetJoinableRoomInfoList(roomFilter: Types.Undefinable<ProtoTypes.CoopCustomRoom.IRoomFilter>): void {
        NetManager.send({
            MsgCcrGetJoinableRoomInfoList: { c: {
                roomFilter,
            }, },
        });
    }
    function _onMsgCcrGetJoinableRoomInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrGetJoinableRoomInfoList.IS;
        if (!data.errorCode) {
            CcrModel.setJoinableRoomInfoList(data.roomInfoList || []);
            Notify.dispatch(NotifyType.MsgCcrGetJoinableRoomInfoList, data);
        }
    }

    export function reqCcrGetJoinedRoomInfoList(): void {
        NetManager.send({
            MsgCcrGetJoinedRoomInfoList: { c: {
            }, }
        });
    }
    function _onMsgCcrGetJoinedRoomInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrGetJoinedRoomInfoList.IS;
        if (!data.errorCode) {
            CcrModel.setJoinedRoomInfoList(data.roomInfoList || []);
            Notify.dispatch(NotifyType.MsgCcrGetJoinedRoomInfoList, data);
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
