
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import MrrModel             from "./MrrModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace MrrProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMrrGetMaxConcurrentCount,     callback: _onMsgMrrGetMaxConcurrentCount },
            { msgCode: NetMessageCodes.MsgMrrGetRoomPublicInfo,         callback: _onMsgMrrGetRoomPublicInfo },
            { msgCode: NetMessageCodes.MsgMrrGetJoinedRoomIdArray,      callback: _onMsgMrrGetJoinedRoomIdArray },
            { msgCode: NetMessageCodes.MsgMrrSetBannedCoIdList,         callback: _onMsgMrrSetBannedCoIdList },
            { msgCode: NetMessageCodes.MsgMrrSetMaxConcurrentCount,     callback: _onMsgMrrSetMaxConcurrentCount },
            { msgCode: NetMessageCodes.MsgMrrSetSelfSettings,           callback: _onMsgMrrSetSelfSettings },
            { msgCode: NetMessageCodes.MsgMrrDeleteRoomByServer,        callback: _onMsgMrrDeleteRoomByServer },
        ]);
    }

    export function reqMrrGetMaxConcurrentCount(): void {
        NetManager.send({ MsgMrrGetMaxConcurrentCount: { c: {} } });
    }
    function _onMsgMrrGetMaxConcurrentCount(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrGetMaxConcurrentCount.IS;
        if (!data.errorCode) {
            MrrModel.setMaxConcurrentCount(false, Helpers.getExisted(data.maxCountForStd));
            MrrModel.setMaxConcurrentCount(true, Helpers.getExisted(data.maxCountForFog));
            Notify.dispatch(NotifyType.MsgMrrGetMaxConcurrentCount, data);
        }
    }

    export function reqMrrGetRoomPublicInfo(roomId: number): void {
        NetManager.send({ MsgMrrGetRoomPublicInfo: { c: {
            roomId,
        } }, });
    }
    async function _onMsgMrrGetRoomPublicInfo(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
        await MrrModel.updateOnMsgMrrGetRoomPublicInfo(data);
        Notify.dispatch(NotifyType.MsgMrrGetRoomPublicInfo, data);
    }

    export function reqMrrGetJoinedRoomIdArray(): void {
        NetManager.send({ MsgMrrGetJoinedRoomIdArray: { c: {
        }, }, });
    }
    function _onMsgMrrGetJoinedRoomIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrGetJoinedRoomIdArray.IS;
        MrrModel.setJoinedRoomIdArray(data.roomIdArray || []);
        Notify.dispatch(NotifyType.MsgMrrGetJoinedRoomIdArray, data);
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
            Notify.dispatch(NotifyType.MsgMrrSetBannedCoIdList, data);
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
            MrrModel.setMaxConcurrentCount(false, Helpers.getExisted(data.maxCountForStd));
            MrrModel.setMaxConcurrentCount(true, Helpers.getExisted(data.maxCountForFog));
            Notify.dispatch(NotifyType.MsgMrrSetMaxConcurrentCount, data);
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
            Notify.dispatch(NotifyType.MsgMrrSetSelfSettings, data);
        }
    }

    function _onMsgMrrDeleteRoomByServer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrDeleteRoomByServer.IS;
        MrrModel.updateOnMsgMrrDeleteRoomByServer(data);
        Notify.dispatch(NotifyType.MsgMrrDeleteRoomByServer, data);
    }
}

// export default MrrProxy;
