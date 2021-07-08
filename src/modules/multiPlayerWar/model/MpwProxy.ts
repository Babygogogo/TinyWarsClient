
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MultiPlayerWar.MpwProxy {
    import NetManager   = Network.NetManager;
    import Codes        = Network.Codes;
    import Types        = Utility.Types;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import BwWar        = BaseWar.BwWar;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: Codes.MsgMpwCommonBroadcastGameStart,        callback: _onMsgMpwCommonBroadcastGameStart },
            { msgCode: Codes.MsgMpwCommonHandleBoot,                callback: _onMsgMpwCommonHandleBoot },
            { msgCode: Codes.MsgMpwCommonContinueWar,               callback: _onMsgMpwCommonContinueWar },
            { msgCode: Codes.MsgMpwCommonGetMyWarInfoList,          callback: _onMsgMpwCommonGetMyWarInfoList },
            { msgCode: Codes.MsgMpwCommonSyncWar,                   callback: _onMsgMpwCommonSyncWar },

            { msgCode: Codes.MsgMpwWatchGetUnwatchedWarInfos,       callback: _onMsgMpwWatchGetUnwatchedWarInfos },
            { msgCode: Codes.MsgMpwWatchGetOngoingWarInfos,         callback: _onMsgMpwWatchGetOngoingWarInfos },
            { msgCode: Codes.MsgMpwWatchGetRequestedWarInfos,       callback: _onMsgMpwWatchGetRequestedWarInfos },
            { msgCode: Codes.MsgMpwWatchGetWatchedWarInfos,         callback: _onMsgMpwWatchGetWatchedWarInfos },
            { msgCode: Codes.MsgMpwWatchMakeRequest,                callback: _onMsgMpwWatchMakeRequest },
            { msgCode: Codes.MsgMpwWatchHandleRequest,              callback: _onMsgMpwWatchHandleRequest },
            { msgCode: Codes.MsgMpwWatchDeleteWatcher,              callback: _onMsgMpwWatchDeleteWatcher },
            { msgCode: Codes.MsgMpwWatchContinueWar,                callback: _onMsgMpwWatchContinueWar },

            { msgCode: Codes.MsgMpwExecuteWarAction,                callback: _onMsgMpwExecuteWarAction },
        ], MpwProxy);
    }

    function _onMsgMpwCommonBroadcastGameStart(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonBroadcastGameStart.IS;
        Lang.getGameStartDesc(data).then(desc => {
            Common.CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0392),
                content : desc,
                callback: () => {
                    reqMpwCommonContinueWar(data.warId);
                },
            });
        });
    }

    export function reqMpwCommonContinueWar(warId: number): void {
        NetManager.send({
            MsgMpwCommonContinueWar: { c: {
                warId,
            }, },
        });
    }
    function _onMsgMpwCommonContinueWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonContinueWar.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMpwCommonContinueWarFailed, data);
        } else {
            Notify.dispatch(Notify.Type.MsgMpwCommonContinueWar, data);
        }
    }

    export function reqMpwCommonGetMyWarInfoList(): void {
        NetManager.send({
            MsgMpwCommonGetMyWarInfoList: { c: {} },
        });
    }
    function _onMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonGetMyWarInfoList.IS;
        MpwModel.setAllMyWarInfoList(data.infos);
        Notify.dispatch(Notify.Type.MsgMpwCommonGetMyWarInfoList, data);
    }

    export function reqMpwCommonSyncWar(war: BwWar, requestType: Types.SyncWarRequestType): void {
        NetManager.send({
            MsgMpwCommonSyncWar: { c: {
                warId               : war.getWarId(),
                executedActionsCount: war.getExecutedActionManager().getExecutedActionsCount(),
                requestType,
            }, }
        });
    }
    function _onMsgMpwCommonSyncWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonSyncWar.IS;
        if (!data.errorCode) {
            MpwModel.updateOnPlayerSyncWar(data);
            Notify.dispatch(Notify.Type.MsgMpwCommonSyncWar);
        }
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
            MpwModel.setUnwatchedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMpwWatchGetUnwatchedWarInfos, data);
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
            MpwModel.setWatchOngoingWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMpwWatchGetOngoingWarInfos, data);
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
            MpwModel.setWatchRequestedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMpwWatchGetRequestedWarInfos, data);
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
            MpwModel.setWatchedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMpwWatchGetWatchedWarInfos, data);
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
            Notify.dispatch(Notify.Type.MsgMpwWatchMakeRequest, data);
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
            Notify.dispatch(Notify.Type.MsgMpwWatchHandleRequest, data);
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
            Notify.dispatch(Notify.Type.MsgMpwWatchDeleteWatcher, data);
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
            Notify.dispatch(Notify.Type.MsgMpwWatchContinueWarFailed, data);
        } else {
            Notify.dispatch(Notify.Type.MsgMpwWatchContinueWar, data);
        }
    }

    export function reqMpwCommonHandleBoot(warId: number): void {
        NetManager.send({
            MsgMpwCommonHandleBoot: { c: {
                warId,
            }, },
        });
    }
    function _onMsgMpwCommonHandleBoot(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonHandleBoot.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMpwCommonHandleBoot, data);
        }
    }

    export function reqMpwExecuteWarAction(war: BwWar, actionContainer: ProtoTypes.WarAction.IWarActionContainer): void {
        NetManager.send({
            MsgMpwExecuteWarAction: { c: {
                warId           : war.getWarId(),
                actionContainer,
            }, },
        });
    }
    function _onMsgMpwExecuteWarAction(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwExecuteWarAction.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwExecuteWarAction, data);
        }
    }
}
