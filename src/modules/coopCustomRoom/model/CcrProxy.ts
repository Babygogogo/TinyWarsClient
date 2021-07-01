
/* eslint-disable @typescript-eslint/no-unused-vars */
namespace TinyWars.CoopCustomRoom.CcrProxy {
    import NetManager   = Network.NetManager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgCcrCreateRoom,                 callback: _onMsgCcrCreateRoom },
            { msgCode: ActionCode.MsgCcrJoinRoom,                   callback: _onMsgCcrJoinRoom },
            { msgCode: ActionCode.MsgCcrDeleteRoomByPlayer,         callback: _onMsgCcrDeleteRoomByPlayer },
            { msgCode: ActionCode.MsgCcrDeleteRoomByServer,         callback: _onMsgCcrDeleteRoomByServer },
            { msgCode: ActionCode.MsgCcrExitRoom,                   callback: _onMsgCcrExitRoom },
            { msgCode: ActionCode.MsgCcrDeletePlayer,               callback: _onMsgCcrDeletePlayer },
            { msgCode: ActionCode.MsgCcrSetReady,                   callback: _onMsgCcrSetReady },
            { msgCode: ActionCode.MsgCcrSetSelfSettings,            callback: _onMsgCcrSetSelfSettings },
            { msgCode: ActionCode.MsgCcrGetOwnerPlayerIndex,        callback: _onMsgCcrGetOwnerPlayerIndex },
            { msgCode: ActionCode.MsgCcrGetRoomInfo,                callback: _onMsgCcrGetRoomInfo },
            { msgCode: ActionCode.MsgCcrGetJoinableRoomInfoList,    callback: _onMsgCcrGetJoinableRoomInfoList },
            { msgCode: ActionCode.MsgCcrGetJoinedRoomInfoList,      callback: _onMsgCcrGetJoinedRoomInfoList },
            { msgCode: ActionCode.MsgCcrStartWar,                   callback: _onMsgCcrStartWar },
        ], CcrProxy);
    }

    export function reqCreateRoom(param: NetMessage.MsgCcrCreateRoom.IC): void {
        NetManager.send({
            MsgCcrCreateRoom: { c: param },
        });
    }
    function _onMsgCcrCreateRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrCreateRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgCcrCreateRoom, data);
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
            Notify.dispatch(Notify.Type.MsgCcrJoinRoom, data);
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
            Notify.dispatch(Notify.Type.MsgCcrDeleteRoomByPlayer, data);
        }
    }

    function _onMsgCcrDeleteRoomByServer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrDeleteRoomByServer.IS;
        if (!data.errorCode) {
            CcrModel.deleteRoomInfo(data.roomId);
            Notify.dispatch(Notify.Type.MsgCcrDeleteRoomByServer, data);
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
            Notify.dispatch(Notify.Type.MsgCcrExitRoom, data);
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
            Notify.dispatch(Notify.Type.MsgCcrDeletePlayer, data);
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
            Notify.dispatch(Notify.Type.MsgCcrSetReady, data);
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
            Notify.dispatch(Notify.Type.MsgCcrSetSelfSettings, data);
        }
    }

    async function _onMsgCcrGetOwnerPlayerIndex(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgCcrGetOwnerPlayerIndex.IS;
        if (!data.errorCode) {
            await CcrModel.updateOnMsgCcrGetOwnerPlayerIndex(data);
            Notify.dispatch(Notify.Type.MsgCcrGetOwnerPlayerIndex, data);
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
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgCcrGetRoomInfoFailed, data);
        } else {
            const roomInfo  = data.roomInfo;
            const roomId    = data.roomId;
            if (roomInfo) {
                CcrModel.setRoomInfo(roomInfo);
            } else {
                CcrModel.deleteRoomInfo(roomId);
            }

            Notify.dispatch(Notify.Type.MsgCcrGetRoomInfo, data);
        }
    }

    export function reqCcrGetJoinableRoomInfoList(): void {
        NetManager.send({
            MsgCcrGetJoinableRoomInfoList: { c: {
            }, },
        });
    }
    function _onMsgCcrGetJoinableRoomInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCcrGetJoinableRoomInfoList.IS;
        if (!data.errorCode) {
            CcrModel.setJoinableRoomInfoList(data.roomInfoList);
            Notify.dispatch(Notify.Type.MsgCcrGetJoinableRoomInfoList, data);
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
            CcrModel.setJoinedRoomInfoList(data.roomInfoList);
            Notify.dispatch(Notify.Type.MsgCcrGetJoinedRoomInfoList, data);
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
            Notify.dispatch(Notify.Type.MsgCcrStartWar, data);
        }
    }
}
