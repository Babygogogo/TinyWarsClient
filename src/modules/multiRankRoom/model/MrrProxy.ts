
namespace TinyWars.MultiRankRoom.MrrProxy {
    import NetManager   = Network.NetManager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgMrrGetMaxConcurrentCount,      callback: _onMsgMrrGetMaxConcurrentCount },
            { msgCode: ActionCode.MsgMrrGetRoomPublicInfo,          callback: _onMsgMrrGetRoomPublicInfo },
            { msgCode: ActionCode.MsgMrrGetMyRoomPublicInfoList,    callback: _onMsgMrrGetMyRoomPublicInfoList },
            { msgCode: ActionCode.MsgMrrSetBannedCoIdList,          callback: _onMsgMrrSetBannedCoIdList },
            { msgCode: ActionCode.MsgMrrSetMaxConcurrentCount,      callback: _onMsgMrrSetMaxConcurrentCount },
            { msgCode: ActionCode.MsgMrrSetSelfSettings,            callback: _onMsgMrrSetSelfSettings },
            { msgCode: ActionCode.MsgMrrDeleteRoomByServer,         callback: _onMsgMrrDeleteRoomByServer },
        ], MrrProxy);
    }

    export function reqMrrGetMaxConcurrentCount(): void {
        NetManager.send({ MsgMrrGetMaxConcurrentCount: { c: {} } });
    }
    function _onMsgMrrGetMaxConcurrentCount(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrGetMaxConcurrentCount.IS;
        if (!data.errorCode) {
            MrrModel.setMaxConcurrentCount(false, data.maxCountForStd);
            MrrModel.setMaxConcurrentCount(true, data.maxCountForFog);
            Notify.dispatch(Notify.Type.MsgMrrGetMaxConcurrentCount, data);
        }
    }

    export function reqMrrGetRoomPublicInfo(roomId: number): void {
        NetManager.send({ MsgMrrGetRoomPublicInfo: { c: {
            roomId,
        } }, });
    }
    function _onMsgMrrGetRoomPublicInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMrrGetRoomPublicInfoFailed, data);
        } else {
            MrrModel.setRoomInfo(data.roomInfo, true);
            Notify.dispatch(Notify.Type.MsgMrrGetRoomPublicInfo, data);
        }
    }

    export function reqMrrGetMyRoomPublicInfoList(): void {
        NetManager.send({ MsgMrrGetMyRoomPublicInfoList: { c: {
        }, }, });
    }
    function _onMsgMrrGetMyRoomPublicInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrGetMyRoomPublicInfoList.IS;
        if (!data.errorCode) {
            MrrModel.updateWithMyRoomInfoList(data.roomInfoList);
            Notify.dispatch(Notify.Type.MsgMrrGetMyRoomPublicInfoList, data);
        }
    }

    export function reqMrrSetBannedCoIdList(roomId: number, bannedCoIdList: number[]): void {
        NetManager.send({ MsgMrrSetBannedCoIdList: { c: {
            roomId,
            bannedCoIdList,
        } }, });
    }
    async function _onMsgMrrSetBannedCoIdList(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMrrSetBannedCoIdList.IS;
        if (!data.errorCode) {
            await MrrModel.updateOnMsgMrrSetBannedCoIdList(data);
            Notify.dispatch(Notify.Type.MsgMrrSetBannedCoIdList, data);
        }
    }

    export function reqMrrSetMaxConcurrentCount(maxCountForStd: number, maxCountForFog: number): void {
        NetManager.send({ MsgMrrSetMaxConcurrentCount: { c: {
            maxCountForStd,
            maxCountForFog,
        } }, });
    }
    function _onMsgMrrSetMaxConcurrentCount(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrSetMaxConcurrentCount.IS;
        if (!data.errorCode) {
            MrrModel.setMaxConcurrentCount(false, data.maxCountForStd);
            MrrModel.setMaxConcurrentCount(true, data.maxCountForFog);
            Notify.dispatch(Notify.Type.MsgMrrSetMaxConcurrentCount, data);
        }
    }

    export function reqMrrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
        NetManager.send({ MsgMrrSetSelfSettings: { c: {
            roomId,
            coId,
            unitAndTileSkinId,
        }, }, });
    }
    async function _onMsgMrrSetSelfSettings(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMrrSetSelfSettings.IS;
        if (!data.errorCode) {
            await MrrModel.updateOnMsgMrrSetSelfSettings(data);
            Notify.dispatch(Notify.Type.MsgMrrSetSelfSettings, data);
        }
    }

    function _onMsgMrrDeleteRoomByServer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrDeleteRoomByServer.IS;
        MrrModel.deleteRoomInfo(data.roomId);
        Notify.dispatch(Notify.Type.MsgMrrDeleteRoomByServer, data);
    }
}
