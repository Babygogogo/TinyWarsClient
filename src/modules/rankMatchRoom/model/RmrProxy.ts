
namespace TinyWars.RankMatchRoom.RmrProxy {
    import NetManager   = Network.NetManager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgRmrGetMaxConcurrentCount,      callback: _onMsgRmrGetMaxConcurrentCount },
            { msgCode: ActionCode.MsgRmrGetRoomPublicInfo,          callback: _onMsgRmrGetRoomPublicInfo },
            { msgCode: ActionCode.MsgRmrGetMyRoomPublicInfoList,    callback: _onMsgRmrGetMyRoomPublicInfoList },
            { msgCode: ActionCode.MsgRmrSetBannedCoIdList,          callback: _onMsgRmrSetBannedCoIdList },
            { msgCode: ActionCode.MsgRmrSetMaxConcurrentCount,      callback: _onMsgRmrSetMaxConcurrentCount },
            { msgCode: ActionCode.MsgRmrSetSelfSettings,            callback: _onMsgRmrSetSelfSettings },
            { msgCode: ActionCode.MsgRmrDeleteRoom,                 callback: _onMsgRmrDeleteRoom },
        ], RmrProxy);
    }

    export function reqRmrGetMaxConcurrentCount(hasFog: boolean): void {
        NetManager.send({ MsgRmrGetMaxConcurrentCount: { c: {
            hasFog,
        } }, });
    }
    function _onMsgRmrGetMaxConcurrentCount(e: egret.Event): void {
        const data = e.data as NetMessage.MsgRmrGetMaxConcurrentCount.IS;
        if (!data.errorCode) {
            RmrModel.setMaxConcurrentCount(data.hasFog, data.maxCount);
            Notify.dispatch(Notify.Type.MsgRmrGetMaxConcurrentCount, data);
        }
    }

    export function reqRmrGetRoomPublicInfo(roomId: number): void {
        NetManager.send({ MsgRmrGetRoomPublicInfo: { c: {
            roomId,
        } }, });
    }
    function _onMsgRmrGetRoomPublicInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgRmrGetRoomPublicInfo.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgRmrGetRoomPublicInfoFailed, data);
        } else {
            RmrModel.setRoomInfo(data.roomInfo, true);
            Notify.dispatch(Notify.Type.MsgRmrGetRoomPublicInfo, data);
        }
    }

    export function reqRmrGetMyRoomPublicInfoList(): void {
        NetManager.send({ MsgRmrGetMyRoomPublicInfoList: { c: {
        }, }, });
    }
    function _onMsgRmrGetMyRoomPublicInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgRmrGetMyRoomPublicInfoList.IS;
        if (!data.errorCode) {
            RmrModel.updateWithMyRoomInfoList(data.roomInfoList);
            Notify.dispatch(Notify.Type.MsgRmrGetMyRoomPublicInfoList, data);
        }
    }

    export function reqRmrSetBannedCoIdList(roomId: number, bannedCoIdList: number[]): void {
        NetManager.send({ MsgRmrSetBannedCoIdList: { c: {
            roomId,
            bannedCoIdList,
        } }, });
    }
    function _onMsgRmrSetBannedCoIdList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgRmrSetBannedCoIdList.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgRmrSetBannedCoIdList, data);
        }
    }

    export function reqRmrSetMaxConcurrentCount(hasFog: boolean, maxCount: number): void {
        NetManager.send({ MsgRmrSetMaxConcurrentCount: { c: {
            hasFog,
            maxCount,
        } }, });
    }
    function _onMsgRmrSetMaxConcurrentCount(e: egret.Event): void {
        const data = e.data as NetMessage.MsgRmrSetMaxConcurrentCount.IS;
        if (!data.errorCode) {
            RmrModel.setMaxConcurrentCount(data.hasFog, data.maxCount);
            Notify.dispatch(Notify.Type.MsgRmrSetMaxConcurrentCount, data);
        }
    }

    export function reqRmrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
        NetManager.send({ MsgRmrSetSelfSettings: { c: {
            roomId,
            coId,
            unitAndTileSkinId,
        }, }, });
    }
    function _onMsgRmrSetSelfSettings(e: egret.Event): void {
        const data = e.data as NetMessage.MsgRmrSetSelfSettings.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgRmrSetSelfSettings, data);
        }
    }

    function _onMsgRmrDeleteRoom(e: egret.Event): void {
        const data = e.data as NetMessage.MsgRmrDeleteRoom.IS;
        RmrModel.deleteRoomInfo(data.roomId);
        Notify.dispatch(Notify.Type.MsgRmrDeleteRoom, data);
    }
}
