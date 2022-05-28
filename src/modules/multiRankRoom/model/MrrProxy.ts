
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import MrrModel             from "./MrrModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiRankRoom.MrrProxy {
    import NotifyType       = Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = Net.NetMessageCodes;

    export function init(): void {
        Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMrrGetMaxConcurrentCount,         callback: _onMsgMrrGetMaxConcurrentCount },
            { msgCode: NetMessageCodes.MsgMrrGetRoomPublicInfo,             callback: _onMsgMrrGetRoomPublicInfo },
            { msgCode: NetMessageCodes.MsgMrrGetJoinedRoomIdArray,          callback: _onMsgMrrGetJoinedRoomIdArray },
            { msgCode: NetMessageCodes.MsgMrrSetBannedCoCategoryIdArray,    callback: _onMsgMrrSetBannedCoCategoryIdArray },
            { msgCode: NetMessageCodes.MsgMrrSetMaxConcurrentCount,         callback: _onMsgMrrSetMaxConcurrentCount },
            { msgCode: NetMessageCodes.MsgMrrSetSelfSettings,               callback: _onMsgMrrSetSelfSettings },
            { msgCode: NetMessageCodes.MsgMrrDeleteRoomByServer,            callback: _onMsgMrrDeleteRoomByServer },
        ]);
    }

    export function reqMrrGetMaxConcurrentCount(): void {
        Net.NetManager.send({ MsgMrrGetMaxConcurrentCount: { c: {} } });
    }
    function _onMsgMrrGetMaxConcurrentCount(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrGetMaxConcurrentCount.IS;
        if (!data.errorCode) {
            MultiRankRoom.MrrModel.setMaxConcurrentCount(false, Helpers.getExisted(data.maxCountForStd));
            MultiRankRoom.MrrModel.setMaxConcurrentCount(true, Helpers.getExisted(data.maxCountForFog));
            Notify.dispatch(NotifyType.MsgMrrGetMaxConcurrentCount, data);
        }
    }

    export function reqMrrGetRoomPublicInfo(roomId: number): void {
        Net.NetManager.send({ MsgMrrGetRoomPublicInfo: { c: {
            roomId,
        } }, });
    }
    async function _onMsgMrrGetRoomPublicInfo(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMrrGetRoomPublicInfo.IS;
        await MultiRankRoom.MrrModel.updateOnMsgMrrGetRoomPublicInfo(data);
        Notify.dispatch(NotifyType.MsgMrrGetRoomPublicInfo, data);
    }

    export function reqMrrGetJoinedRoomIdArray(): void {
        Net.NetManager.send({ MsgMrrGetJoinedRoomIdArray: { c: {
        }, }, });
    }
    function _onMsgMrrGetJoinedRoomIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrGetJoinedRoomIdArray.IS;
        MultiRankRoom.MrrModel.setJoinedRoomIdArray(data.roomIdArray || []);
        Notify.dispatch(NotifyType.MsgMrrGetJoinedRoomIdArray, data);
    }

    export function reqMrrSetBannedCoCategoryIdArray(roomId: number, bannedCoCategoryIdArray: number[]): void {
        Net.NetManager.send({ MsgMrrSetBannedCoCategoryIdArray: { c: {
            roomId,
            bannedCoCategoryIdArray,
        } }, });
    }
    async function _onMsgMrrSetBannedCoCategoryIdArray(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMrrSetBannedCoCategoryIdArray.IS;
        if (!data.errorCode) {
            await MultiRankRoom.MrrModel.updateOnMsgMrrSetBannedCoCategoryIdArray(data);
            Notify.dispatch(NotifyType.MsgMrrSetBannedCoCategoryIdArray, data);
        }
    }

    export function reqMrrSetMaxConcurrentCount(maxCountForStd: number, maxCountForFog: number): void {
        Net.NetManager.send({ MsgMrrSetMaxConcurrentCount: { c: {
            maxCountForStd,
            maxCountForFog,
        } }, });
    }
    function _onMsgMrrSetMaxConcurrentCount(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrSetMaxConcurrentCount.IS;
        if (!data.errorCode) {
            MultiRankRoom.MrrModel.setMaxConcurrentCount(false, Helpers.getExisted(data.maxCountForStd));
            MultiRankRoom.MrrModel.setMaxConcurrentCount(true, Helpers.getExisted(data.maxCountForFog));
            Notify.dispatch(NotifyType.MsgMrrSetMaxConcurrentCount, data);
        }
    }

    export function reqMrrSetSelfSettings(roomId: number, coId: number, unitAndTileSkinId: number): void {
        Net.NetManager.send({ MsgMrrSetSelfSettings: { c: {
            roomId,
            coId,
            unitAndTileSkinId,
        }, }, });
    }
    async function _onMsgMrrSetSelfSettings(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgMrrSetSelfSettings.IS;
        if (!data.errorCode) {
            await MultiRankRoom.MrrModel.updateOnMsgMrrSetSelfSettings(data);
            Notify.dispatch(NotifyType.MsgMrrSetSelfSettings, data);
        }
    }

    function _onMsgMrrDeleteRoomByServer(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMrrDeleteRoomByServer.IS;
        MultiRankRoom.MrrModel.updateOnMsgMrrDeleteRoomByServer(data);
        Notify.dispatch(NotifyType.MsgMrrDeleteRoomByServer, data);
    }
}

// export default MrrProxy;
