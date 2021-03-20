
namespace TinyWars.MultiFreeRoom.MfrProxy {
    import NetManager   = Network.NetManager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgMfrCreateRoom,                 callback: _onMsgMfrCreateRoom },
            { msgCode: ActionCode.MsgMfrJoinRoom,                   callback: _onMsgMfrJoinRoom },
            { msgCode: ActionCode.MsgMfrDeleteRoom,                 callback: _onMsgMfrDeleteRoom },
            { msgCode: ActionCode.MsgMfrExitRoom,                   callback: _onMsgMfrExitRoom },
            { msgCode: ActionCode.MsgMfrDeletePlayer,               callback: _onMsgMfrDeletePlayer },
            { msgCode: ActionCode.MsgMfrSetReady,                   callback: _onMsgMfrSetReady },
            { msgCode: ActionCode.MsgMfrSetSelfSettings,            callback: _onMsgMfrSetSelfSettings },
            { msgCode: ActionCode.MsgMfrGetRoomInfo,                callback: _onMsgMfrGetRoomInfo },
            { msgCode: ActionCode.MsgMfrGetJoinableRoomInfoList,    callback: _onMsgMfrGetJoinableRoomInfoList },
            { msgCode: ActionCode.MsgMfrGetJoinedRoomInfoList,      callback: _onMsgMfrGetJoinedRoomInfoList },
            { msgCode: ActionCode.MsgMfrStartWar,                   callback: _onMsgMfrStartWar },
        ], MfrProxy);
    }

    export function reqCreateRoom(param: ProtoTypes.NetMessage.MsgMfrCreateRoom.IC): void {
        NetManager.send({
            MsgMfrCreateRoom: { c: param },
        });
    }
    function _onMsgMfrCreateRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrCreateRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMfrCreateRoom, data);
        }
    }

    export function reqMfrJoinRoom(param: ProtoTypes.NetMessage.MsgMfrJoinRoom.IC): void {
        NetManager.send({
            MsgMfrJoinRoom: { c: param },
        });
    }
    function _onMsgMfrJoinRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrJoinRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMfrJoinRoom, data);
        }
    }

    export function reqMfrDestroyRoom(roomId: number): void {
        NetManager.send({
            MsgMfrDeleteRoom: { c: {
                roomId,
            } },
        });
    }
    function _onMsgMfrDeleteRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrDeleteRoom.IS;
        if (!data.errorCode) {
            const roomId = data.roomId;
            MfrModel.deleteRoomInfo(roomId);
            if (MfrModel.Join.getRoomId() === roomId) {
                MfrModel.Join.clearData();
            }
            Notify.dispatch(Notify.Type.MsgMfrDeleteRoom, data);
        }
    }

    export function reqMfrExitRoom(roomId: number): void {
        NetManager.send({
            MsgMfrExitRoom: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMfrExitRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrExitRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMfrExitRoom, data);
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
    function _onMsgMfrDeletePlayer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrDeletePlayer.IS;
        if (!data.errorCode) {
            MfrModel.updateOnDeletePlayer(data);
            Notify.dispatch(Notify.Type.MsgMfrDeletePlayer, data);
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
    function _onMsgMfrSetReady(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrSetReady.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMfrSetReady, data);
        }
    }

    export function reqMfrSetSelfSettings(data: NetMessage.MsgMfrSetSelfSettings.IC): void {
        NetManager.send({
            MsgMfrSetSelfSettings: { c: data },
        });
    }
    function _onMsgMfrSetSelfSettings(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMfrSetSelfSettings.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMfrSetSelfSettings, data);
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
            Notify.dispatch(Notify.Type.MsgMfrGetRoomInfoFailed, data);
        } else {
            const roomInfo  = data.roomInfo;
            const roomId    = data.roomId;
            if (roomInfo) {
                MfrModel.setRoomInfo(roomInfo);
                if (MfrModel.Join.getRoomId() === roomId) {
                    MfrModel.Join.resetData(roomInfo);
                }
            } else {
                MfrModel.deleteRoomInfo(roomId);
            }

            Notify.dispatch(Notify.Type.MsgMfrGetRoomInfo, data);
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
            Notify.dispatch(Notify.Type.MsgMfrGetJoinableRoomInfoList, data);
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
            Notify.dispatch(Notify.Type.MsgMfrGetJoinedRoomInfoList, data);
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
            MfrModel.deleteRoomInfo(data.roomId);
            Notify.dispatch(Notify.Type.MsgMfrStartWar, data);
        }
    }
}
