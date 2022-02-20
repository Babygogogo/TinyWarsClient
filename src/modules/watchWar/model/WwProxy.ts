
// import NetManager               from "../../tools/network/NetManager";
// import TwnsNetMessageCodes      from "../../tools/network/NetMessageCodes";
// import Notify                   from "../../tools/notify/Notify";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import WwModel                  from "./WwModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace WwProxy {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import NetMessage           = ProtoTypes.NetMessage;
    import NetMessageCodes      = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMpwWatchGetRequestableWarIdArray,     callback: _onMsgMpwWatchGetRequestableWarIdArray },
            { msgCode: NetMessageCodes.MsgMpwWatchGetOngoingWarIdArray,         callback: _onMsgMpwWatchGetOngoingWarIdArray },
            { msgCode: NetMessageCodes.MsgMpwWatchGetRequestedWarIdArray,       callback: _onMsgMpwWatchGetRequestedWarIdArray },
            { msgCode: NetMessageCodes.MsgMpwWatchGetWatchedWarIdArray,         callback: _onMsgMpwWatchGetWatchedWarIdArray },
            { msgCode: NetMessageCodes.MsgMpwWatchMakeRequest,                  callback: _onMsgMpwWatchMakeRequest },
            { msgCode: NetMessageCodes.MsgMpwWatchHandleRequest,                callback: _onMsgMpwWatchHandleRequest },
            { msgCode: NetMessageCodes.MsgMpwWatchDeleteWatcher,                callback: _onMsgMpwWatchDeleteWatcher },
            { msgCode: NetMessageCodes.MsgMpwWatchContinueWar,                  callback: _onMsgMpwWatchContinueWar },
            { msgCode: NetMessageCodes.MsgMpwWatchGetIncomingInfo,              callback: _onMsgMpwWatchGetIncomingInfo },
            { msgCode: NetMessageCodes.MsgMpwWatchGetOutgoingInfo,              callback: _onMsgMpwWatchGetOutgoingInfo },
        ], null);
    }

    export function reqMpwWatchGetRequestableWarIdArray({ warId, coName, mapName, userNickname, playersCountUnneutral }: {
        warId?                  : number | null;
        coName?                 : string | null;
        mapName?                : string | null;
        userNickname?           : string | null;
        playersCountUnneutral?  : number | null;
    }): void {
        NetManager.send({
            MsgMpwWatchGetRequestableWarIdArray: { c: {
                warId,
                coName,
                mapName,
                userNickname,
                playersCountUnneutral,
            } },
        });
    }
    function _onMsgMpwWatchGetRequestableWarIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetRequestableWarIdArray.IS;
        if (!data.errorCode) {
            WwModel.setRequestableWarIdArray(data.warIdArray || []);
            Notify.dispatch(NotifyType.MsgMpwWatchGetUnwatchedWarInfos, data);
        }
    }

    export function reqMpwWatchGetOngoingWarIdArray(): void {
        NetManager.send({
            MsgMpwWatchGetOngoingWarIdArray: { c: {
            } },
        });
    }
    function _onMsgMpwWatchGetOngoingWarIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetOngoingWarIdArray.IS;
        if (!data.errorCode) {
            WwModel.setOngoingWarIdArray(data.warIdArray || []);
            Notify.dispatch(NotifyType.MsgMpwWatchGetOngoingWarInfos, data);
        }
    }

    export function reqMpwWatchRequestedWarIdArray(): void {
        NetManager.send({
            MsgMpwWatchGetRequestedWarIdArray: { c: {
            }, }
        });
    }
    function _onMsgMpwWatchGetRequestedWarIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetRequestedWarIdArray.IS;
        if (!data.errorCode) {
            WwModel.setRequestedWarIdArray(data.warIdArray || []);
            Notify.dispatch(NotifyType.MsgMpwWatchGetRequestedWarIdArray, data);
        }
    }

    export function reqMpwWatchWatchedWarIdArray(): void {
        NetManager.send({
            MsgMpwWatchGetWatchedWarIdArray: { c: {
            }, }
        });
    }
    function _onMsgMpwWatchGetWatchedWarIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetWatchedWarIdArray.IS;
        if (!data.errorCode) {
            WwModel.setWatchedWarIdArray(data.warIdArray || []);
            Notify.dispatch(NotifyType.MsgMpwWatchGetWatchedWarInfos, data);
        }
    }

    export function reqWatchMakeRequest(warId: number, dstUserIds: number[]): void {
        NetManager.send({
            MsgMpwWatchMakeRequest: { c: {
                warId,
                dstUserIds,
            }, }
        });
    }
    function _onMsgMpwWatchMakeRequest(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchMakeRequest.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwWatchMakeRequest, data);
        }
    }

    export function reqWatchHandleRequest(warId: number, acceptSrcUserIds: number[], declineSrcUserIds: number[]): void {
        NetManager.send({
            MsgMpwWatchHandleRequest: { c: {
                warId,
                acceptSrcUserIds,
                declineSrcUserIds,
            }, }
        });
    }
    function _onMsgMpwWatchHandleRequest(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchHandleRequest.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwWatchHandleRequest, data);
        }
    }

    export function reqWatchDeleteWatcher(warId: number, watcherUserIds: number[]): void {
        NetManager.send({
            MsgMpwWatchDeleteWatcher: { c: {
                warId,
                watcherUserIds,
            }, }
        });
    }
    function _onMsgMpwWatchDeleteWatcher(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchDeleteWatcher.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwWatchDeleteWatcher, data);
        }
    }

    export function reqWatchContinueWar(warId: number): void {
        NetManager.send({
            MsgMpwWatchContinueWar: { c: {
                warId,
            }, }
        });
    }
    function _onMsgMpwWatchContinueWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchContinueWar.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwWatchContinueWarFailed, data);
        } else {
            Notify.dispatch(NotifyType.MsgMpwWatchContinueWar, data);
        }
    }

    export function reqMpwWatchGetIncomingInfo(warId: number): void {
        NetManager.send({
            MsgMpwWatchGetIncomingInfo: { c: {
                warId,
            } },
        });
    }
    function _onMsgMpwWatchGetIncomingInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetIncomingInfo.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwWatchGetIncomingInfoFailed, data);
        } else {
            WwModel.updateOnMsgMpwWatchGetIncomingInfo(data);
            Notify.dispatch(NotifyType.MsgMpwWatchGetIncomingInfo, data);
        }
    }

    export function reqMpwWatchGetOutgoingInfo(warId: number): void {
        NetManager.send({
            MsgMpwWatchGetOutgoingInfo: { c: {
                warId,
            } },
        });
    }
    function _onMsgMpwWatchGetOutgoingInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetOutgoingInfo.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgMpwWatchGetOutgoingInfoFailed, data);
        } else {
            WwModel.updateOnMsgMpwWatchGetOutgoingInfo(data);
            Notify.dispatch(NotifyType.MsgMpwWatchGetOutgoingInfo, data);
        }
    }
}

// export default WwProxy;
