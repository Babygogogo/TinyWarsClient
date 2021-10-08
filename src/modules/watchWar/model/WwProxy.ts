
// import NetManager               from "../../tools/network/NetManager";
// import TwnsNetMessageCodes      from "../../tools/network/NetMessageCodes";
// import Notify                   from "../../tools/notify/Notify";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import WwModel                  from "./WwModel";

namespace WwProxy {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import NetMessage           = ProtoTypes.NetMessage;
    import NetMessageCodes      = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgMpwWatchGetUnwatchedWarInfos,       callback: _onMsgMpwWatchGetUnwatchedWarInfos },
            { msgCode: NetMessageCodes.MsgMpwWatchGetOngoingWarInfos,         callback: _onMsgMpwWatchGetOngoingWarInfos },
            { msgCode: NetMessageCodes.MsgMpwWatchGetRequestedWarInfos,       callback: _onMsgMpwWatchGetRequestedWarInfos },
            { msgCode: NetMessageCodes.MsgMpwWatchGetWatchedWarInfos,         callback: _onMsgMpwWatchGetWatchedWarInfos },
            { msgCode: NetMessageCodes.MsgMpwWatchMakeRequest,                callback: _onMsgMpwWatchMakeRequest },
            { msgCode: NetMessageCodes.MsgMpwWatchHandleRequest,              callback: _onMsgMpwWatchHandleRequest },
            { msgCode: NetMessageCodes.MsgMpwWatchDeleteWatcher,              callback: _onMsgMpwWatchDeleteWatcher },
            { msgCode: NetMessageCodes.MsgMpwWatchContinueWar,                callback: _onMsgMpwWatchContinueWar },
        ], null);
    }

    export function reqUnwatchedWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetUnwatchedWarInfos: { c: {
            } },
        });
    }
    function _onMsgMpwWatchGetUnwatchedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetUnwatchedWarInfos.IS;
        if (!data.errorCode) {
            WwModel.setUnwatchedWarInfos(data.infos || []);
            Notify.dispatch(NotifyType.MsgMpwWatchGetUnwatchedWarInfos, data);
        }
    }

    export function reqWatchGetOngoingWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetOngoingWarInfos: { c: {
            } },
        });
    }
    function _onMsgMpwWatchGetOngoingWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetOngoingWarInfos.IS;
        if (!data.errorCode) {
            WwModel.setWatchOngoingWarInfos(data.infos || []);
            Notify.dispatch(NotifyType.MsgMpwWatchGetOngoingWarInfos, data);
        }
    }

    export function reqWatchRequestedWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetRequestedWarInfos: { c: {
            }, }
        });
    }
    function _onMsgMpwWatchGetRequestedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetRequestedWarInfos.IS;
        if (!data.errorCode) {
            WwModel.setWatchRequestedWarInfos(data.infos || []);
            Notify.dispatch(NotifyType.MsgMpwWatchGetRequestedWarInfos, data);
        }
    }

    export function reqWatchedWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetWatchedWarInfos: { c: {
            }, }
        });
    }
    function _onMsgMpwWatchGetWatchedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetWatchedWarInfos.IS;
        if (!data.errorCode) {
            WwModel.setWatchedWarInfos(data.infos || []);
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
}

// export default WwProxy;
