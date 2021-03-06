
namespace TinyWars.MultiCustomRoom.McrProxy {
    import NetManager   = Network.NetManager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgMcrCreateRoom,                 callback: _onMsgMcrCreateRoom },
            { msgCode: ActionCode.MsgMcrJoinRoom,                   callback: _onMsgMcrJoinRoom },
            { msgCode: ActionCode.MsgMcrDeleteRoom,                 callback: _onMsgMcrDeleteRoom },
            { msgCode: ActionCode.MsgMcrExitRoom,                   callback: _onMsgMcrExitRoom },
            { msgCode: ActionCode.MsgMcrSetWarRule,                 callback: _onMsgMcrSetWarRule },
            { msgCode: ActionCode.MsgMcrDeletePlayer,               callback: _onMsgMcrDeletePlayer },
            { msgCode: ActionCode.MsgMcrSetReady,                   callback: _onMsgMcrSetReady },
            { msgCode: ActionCode.MsgMcrSetSelfSettings,            callback: _onMsgMcrSetSelfSettings },
            { msgCode: ActionCode.MsgMcrGetRoomInfo,                callback: _onMsgMcrGetRoomInfo },
            { msgCode: ActionCode.MsgMcrGetJoinableRoomInfoList,    callback: _onMsgMcrGetJoinableRoomInfoList },
            { msgCode: ActionCode.MsgMcrGetJoinedRoomInfoList,      callback: _onMsgMcrGetJoinedRoomInfoList },
            { msgCode: ActionCode.MsgMcrStartWar,                   callback: _onMsgMcrStartWar },
        ], McrProxy);
    }

    export function reqCreateRoom(param: DataForCreateRoom): void {
        NetManager.send({
            MsgMcrCreateRoom: { c: param },
        });
    }
    function _onMsgMcrCreateRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrCreateRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcrCreateRoom, data);
        }
    }

    export function reqMcrJoinRoom(data: DataForJoinRoom): void {
        NetManager.send({
            MsgMcrJoinRoom: { c: data },
        });
    }
    function _onMsgMcrJoinRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrJoinRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcrJoinRoom, data);
        }
    }

    export function reqMcrDestroyRoom(roomId: number): void {
        NetManager.send({
            MsgMcrDeleteRoom: { c: {
                roomId,
            } },
        });
    }
    function _onMsgMcrDeleteRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrDeleteRoom.IS;
        if (!data.errorCode) {
            const roomId = data.roomId;
            McrModel.deleteRoomInfo(roomId);
            if (McrModel.Join.getRoomId() === roomId) {
                McrModel.Join.clearData();
            }
            Notify.dispatch(Notify.Type.MsgMcrDeleteRoom, data);
        }
    }

    export function reqMcrExitRoom(roomId: number): void {
        NetManager.send({
            MsgMcrExitRoom: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMcrExitRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrExitRoom.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcrExitRoom, data);
        }
    }

    export function reqMcrSetWarRule(data: NetMessage.MsgMcrSetWarRule.IC): void {
        NetManager.send({
            MsgMcrSetWarRule: { c: data },
        });
    }
    function _onMsgMcrSetWarRule(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrSetWarRule.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcrSetWarRule, data);
        }
    }

    export function reqMcrDeletePlayer(roomId: number, playerIndex: number): void {
        NetManager.send({
            MsgMcrDeletePlayer: { c: {
                roomId,
                playerIndex,
            }, },
        });
    }
    function _onMsgMcrDeletePlayer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrDeletePlayer.IS;
        if (!data.errorCode) {
            McrModel.updateOnDeletePlayer(data);
            Notify.dispatch(Notify.Type.MsgMcrDeletePlayer, data);
        }
    }

    export function reqMcrSetReady(roomId: number, isReady: boolean): void {
        NetManager.send({
            MsgMcrSetReady: { c: {
                roomId,
                isReady,
            }, },
        });
    }
    function _onMsgMcrSetReady(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrSetReady.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcrSetReady, data);
        }
    }

    export function reqMcrSetSelfSettings(data: NetMessage.MsgMcrSetSelfSettings.IC): void {
        NetManager.send({
            MsgMcrSetSelfSettings: { c: data },
        });
    }
    function _onMsgMcrSetSelfSettings(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrSetSelfSettings.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcrSetSelfSettings, data);
        }
    }

    export function reqMcrGetRoomInfo(roomId: number): void {
        NetManager.send({
            MsgMcrGetRoomInfo: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcrGetRoomInfoFailed, data);
        } else {
            const roomInfo  = data.roomInfo;
            const roomId    = data.roomId;
            if (roomInfo) {
                McrModel.setRoomInfo(roomInfo);
                if (McrModel.Join.getRoomId() === roomId) {
                    McrModel.Join.resetData(roomInfo);
                }
            } else {
                McrModel.deleteRoomInfo(roomId);
            }

            Notify.dispatch(Notify.Type.MsgMcrGetRoomInfo, data);
        }
    }

    export function reqMcrGetJoinableRoomInfoList(): void {
        NetManager.send({
            MsgMcrGetJoinableRoomInfoList: { c: {
            }, },
        });
    }
    function _onMsgMcrGetJoinableRoomInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrGetJoinableRoomInfoList.IS;
        if (!data.errorCode) {
            McrModel.setJoinableRoomInfoList(data.roomInfoList);
            Notify.dispatch(Notify.Type.MsgMcrGetJoinableRoomInfoList, data);
        }
    }

    export function reqMcrGetJoinedRoomInfoList(): void {
        NetManager.send({
            MsgMcrGetJoinedRoomInfoList: { c: {
            }, }
        });
    }
    function _onMsgMcrGetJoinedRoomInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrGetJoinedRoomInfoList.IS;
        if (!data.errorCode) {
            McrModel.setJoinedRoomInfoList(data.roomInfoList);
            Notify.dispatch(Notify.Type.MsgMcrGetJoinedRoomInfoList, data);
        }
    }

    export function reqMcrStartWar(roomId: number): void {
        NetManager.send({
            MsgMcrStartWar: { c: {
                roomId,
            }, },
        });
    }
    function _onMsgMcrStartWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcrStartWar.IS;
        if (!data.errorCode) {
            McrModel.deleteRoomInfo(data.roomId);
            Notify.dispatch(Notify.Type.MsgMcrStartWar, data);
        }
    }
}
