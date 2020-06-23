
namespace TinyWars.MultiCustomRoom.McrProxy {
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;
    import Types        = Utility.Types;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;

    type DataForReqReplayInfos = {
        replayId?           : number;
        mapName?            : string;
        minMyRating?        : number;
        minGlobalRating?    : number;
    }

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.S_McrCreateWar,                   callback: _onSMcrCreateWar },
            { msgCode: ActionCode.S_McrGetUnjoinedWaitingInfos,     callback: _onSMcrGetUnjoinedWaitingInfos, },
            { msgCode: ActionCode.S_McrJoinWar,                     callback: _onSMcrJoinWar, },
            { msgCode: ActionCode.S_McrGetJoinedWaitingInfos,       callback: _onSMcrGetJoinedWaitingInfos, },
            { msgCode: ActionCode.S_McrExitWar,                     callback: _onSMcrExitWar, },
            { msgCode: ActionCode.S_McrGetJoinedOngoingInfos,       callback: _onSMcrGetJoinedOngoingInfos, },
            { msgCode: ActionCode.S_McrContinueWar,                 callback: _onSMcrContinueWar, },
            { msgCode: ActionCode.S_McrGetReplayInfos,              callback: _onSMcrGetReplayInfos, },
            { msgCode: ActionCode.S_McrGetReplayData,               callback: _onSMcrGetReplayData, },
            { msgCode: ActionCode.S_McwWatchGetUnwatchedWarInfos,   callback: _onSMcwWatchGetUnwatchedWarInfos, },
            { msgCode: ActionCode.S_McwWatchGetOngoingWarInfos,     callback: _onSMcwWatchGetOngoingWarInfos },
            { msgCode: ActionCode.S_McwWatchGetRequestedWarInfos,   callback: _onSMcwWatchGetRequestedWarInfos, },
            { msgCode: ActionCode.S_McwWatchGetWatchedWarInfos,     callback: _onSMcwWatchGetWatchedWarInfos },
            { msgCode: ActionCode.S_McwWatchMakeRequest,            callback: _onSMcwWatchMakeRequest },
            { msgCode: ActionCode.S_McwWatchHandleRequest,          callback: _onSMcwWatchHandleRequest },
            { msgCode: ActionCode.S_McwWatchDeleteWatcher,          callback: _onSMcwWatchDeleteWatcher },
            { msgCode: ActionCode.S_McwWatchContinueWar,            callback: _onSMcwWatchContinueWar },
        ], McrProxy);
    }

    export function reqCreate(param: DataForCreateWar): void {
        NetManager.send({
            C_McrCreateWar: param,
        });
    }
    function _onSMcrCreateWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McrCreateWar;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrCreateWar, data);
        }
    }

    export function reqUnjoinedWarInfos(): void {
        NetManager.send({
            C_McrGetUnjoinedWaitingInfos: {
            },
        });
    }
    function _onSMcrGetUnjoinedWaitingInfos(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McrGetUnjoinedWaitingInfos;
        if (!data.errorCode) {
            McrModel.setUnjoinedWaitingInfos(data.warInfos);
            Notify.dispatch(Notify.Type.SMcrGetUnjoinedWaitingInfos, data);
        }
    }

    export function reqJoin(data: DataForJoinWar): void {
        NetManager.send({
            C_McrJoinWar: data,
        });
    }
    function _onSMcrJoinWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McrJoinWar;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrJoinWar, data);
        }
    }

    export function reqJoinedWaitingCustomOnlineWarInfos(): void {
        NetManager.send({
            C_McrGetJoinedWaitingInfos: {
            },
        });
    }
    function _onSMcrGetJoinedWaitingInfos(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McrGetJoinedWaitingInfos;
        if (!data.errorCode) {
            McrModel.setJoinedWaitingInfos(data.warInfos);
            Notify.dispatch(Notify.Type.SMcrGetJoinedWaitingInfos, data);
        }
    }

    export function reqExitCustomOnlineWar(waitingWarId: number): void {
        NetManager.send({
            C_McrExitWar: {
                infoId    : waitingWarId,
            },
        });
    }
    function _onSMcrExitWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McrExitWar;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrExitWar, data);
        }
    }

    export function reqGetJoinedOngoingInfos(): void {
        NetManager.send({
            C_McrGetJoinedOngoingInfos: {},
        });
    }
    function _onSMcrGetJoinedOngoingInfos(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McrGetJoinedOngoingInfos;
        McrModel.setJoinedOngoingInfos(data.infos);
        Notify.dispatch(Notify.Type.SMcrGetJoinedOngoingInfos, data);
    }

    export function reqContinueWar(warId: number): void {
        NetManager.send({
            C_McrContinueWar: {
                warId: warId,
            },
        });
    }
    function _onSMcrContinueWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McrContinueWar;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrContinueWarFailed, data);
        } else {
            Utility.FlowManager.gotoMultiCustomWar((e.data as ProtoTypes.IS_McrContinueWar).war as Types.SerializedWar);
            Notify.dispatch(Notify.Type.SMcrContinueWar, data);
        }
    }

    export function reqReplayInfos(params?: DataForReqReplayInfos): void {
        NetManager.send({
            C_McrGetReplayInfos: params || {},
        });
    }
    function _onSMcrGetReplayInfos(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McrGetReplayInfos;
        if (!data.errorCode) {
            McrModel.setReplayInfos(data.infos);
            Notify.dispatch(Notify.Type.SMcrGetReplayInfos);
        }
    }

    export function reqReplayData(replayId: number): void {
        NetManager.send({
            C_McrGetReplayData: {
                replayId,
            },
        });
    }
    function _onSMcrGetReplayData(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McrGetReplayData;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrGetReplayDataFailed);
        } else {
            McrModel.setReplayData(data as ProtoTypes.S_McrGetReplayData);
            Notify.dispatch(Notify.Type.SMcrGetReplayData);
        }
    }

    export function reqUnwatchedWarInfos(): void {
        NetManager.send({
            C_McwWatchGetUnwatchedWarInfos: {
            },
        });
    }
    function _onSMcwWatchGetUnwatchedWarInfos(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwWatchGetUnwatchedWarInfos;
        if (!data.errorCode) {
            McrModel.setUnwatchedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.SMcwWatchGetUnwatchedWarInfos, data);
        }
    }

    export function reqWatchGetOngoingWarInfos(): void {
        NetManager.send({
            C_McwWatchGetOngoingWarInfos: {
            },
        })
    }
    function _onSMcwWatchGetOngoingWarInfos(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwWatchGetOngoingWarInfos;
        if (!data.errorCode) {
            McrModel.setWatchOngoingWarInfos(data.infos);
            Notify.dispatch(Notify.Type.SMcwWatchGetOngoingWarInfos, data);
        }
    }

    export function reqWatchRequestedWarInfos(): void {
        NetManager.send({
            C_McwWatchGetRequestedWarInfos: {
            },
        });
    }
    function _onSMcwWatchGetRequestedWarInfos(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwWatchGetRequestedWarInfos;
        if (!data.errorCode) {
            McrModel.setWatchRequestedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.SMcwWatchGetRequestedWarInfos, data);
        }
    }

    export function reqWatchedWarInfos(): void {
        NetManager.send({
            C_McwWatchGetWatchedWarInfos: {
            },
        });
    }
    function _onSMcwWatchGetWatchedWarInfos(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwWatchGetWatchedWarInfos;
        if (!data.errorCode) {
            McrModel.setWatchedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.SMcwWatchGetWatchedWarInfos, data);
        }
    }

    export function reqWatchMakeRequest(warId: number, dstUserIds: number[]): void {
        NetManager.send({
            C_McwWatchMakeRequest: {
                warId,
                dstUserIds,
            },
        });
    }
    function _onSMcwWatchMakeRequest(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwWatchMakeRequest;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcwWatchMakeRequest, data);
        }
    }

    export function reqWatchHandleRequest(warId: number, acceptSrcUserIds: number[], declineSrcUserIds: number[]): void {
        NetManager.send({
            C_McwWatchHandleRequest: {
                warId,
                acceptSrcUserIds,
                declineSrcUserIds,
            },
        });
    }
    function _onSMcwWatchHandleRequest(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwWatchHandleRequest;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcwWatchHandleRequest, data);
        }
    }

    export function reqWatchDeleteWatcher(warId: number, watcherUserIds: number[]): void {
        NetManager.send({
            C_McwWatchDeleteWatcher: {
                warId,
                watcherUserIds,
            },
        });
    }
    function _onSMcwWatchDeleteWatcher(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwWatchDeleteWatcher;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcwWatchDeleteWatcher, data);
        }
    }

    export function reqWatchContinueWar(warId: number): void {
        NetManager.send({
            C_McwWatchContinueWar: {
                warId,
            },
        });
    }
    function _onSMcwWatchContinueWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwWatchContinueWar;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SMcwWatchContinueWarFailed, data);
        } else {
            Notify.dispatch(Notify.Type.SMcwWatchContinueWar, data);
        }
    }
}
