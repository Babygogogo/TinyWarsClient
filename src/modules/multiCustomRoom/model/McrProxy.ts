
namespace TinyWars.MultiCustomRoom.McrProxy {
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.S_McrCreateRoom,                  callback: _onSMcrCreateRoom },
            { msgCode: ActionCode.S_McrJoinRoom,                    callback: _onSMcrJoinRoom, },
            { msgCode: ActionCode.S_McrDestroyRoom,                 callback: _onSMcrDestroyRoom },
            { msgCode: ActionCode.S_McrExitRoom,                    callback: _onSMcrExitRoom, },
            { msgCode: ActionCode.S_McrSetWarRule,                  callback: _onSMcrSetWarRule },
            { msgCode: ActionCode.S_McrRemovePlayer,                callback: _onSMcrRemovePlayer },
            { msgCode: ActionCode.S_McrSetReady,                    callback: _onSMcrSetReady },
            { msgCode: ActionCode.S_McrSetSelfSettings,             callback: _onSMcrSetSelfSettings },
            { msgCode: ActionCode.S_McrGetRoomInfo,                 callback: _onSMcrGetRoomInfo },
            { msgCode: ActionCode.S_McrGetUnjoinedRoomInfoList,     callback: _onSMcrGetUnjoinedRoomInfoList, },
            { msgCode: ActionCode.S_McrGetJoinedRoomInfoList,       callback: _onSMcrGetJoinedRoomInfoList, },
            { msgCode: ActionCode.S_McrStartWar,                    callback: _onSMcrStartWar },
            { msgCode: ActionCode.S_McwCommonGetWarInfoList,        callback: _onSMcwCommonGetWarInfoList, },
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

    export function reqCreateRoom(param: DataForCreateRoom): void {
        NetManager.send({
            C_McrCreateRoom: param,
        });
    }
    function _onSMcrCreateRoom(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrCreateRoom;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrCreateRoom, data);
        }
    }

    export function reqMcrJoinRoom(data: DataForJoinRoom): void {
        NetManager.send({
            C_McrJoinRoom: data,
        });
    }
    function _onSMcrJoinRoom(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrJoinRoom;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrJoinRoom, data);
        }
    }

    export function reqMcrDestroyRoom(roomId: number): void {
        NetManager.send({
            C_McrDestroyRoom: {
                roomId,
            },
        });
    }
    function _onSMcrDestroyRoom(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrDestroyRoom;
        if (!data.errorCode) {
            McrModel.removeRoomInfo(data.roomId);
            Notify.dispatch(Notify.Type.SMcrDestroyRoom, data);
        }
    }

    export function reqMcrExitRoom(roomId: number): void {
        NetManager.send({
            C_McrExitRoom: {
                roomId,
            },
        });
    }
    function _onSMcrExitRoom(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrExitRoom;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrExitRoom, data);
        }
    }

    export function reqMcrSetWarRule(data: NetMessage.IC_McrSetWarRule): void {
        NetManager.send({
            C_McrSetWarRule: data,
        });
    }
    function _onSMcrSetWarRule(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrSetWarRule;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrSetWarRule, data);
        }
    }

    export function reqMcrRemovePlayer(roomId: number, playerIndex: number): void {
        NetManager.send({
            C_McrRemovePlayer: {
                roomId,
                playerIndex,
            },
        });
    }
    function _onSMcrRemovePlayer(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrRemovePlayer;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrRemovePlayer, data);
        }
    }

    export function reqMcrSetReady(roomId: number, isReady: boolean): void {
        NetManager.send({
            C_McrSetReady: {
                roomId,
                isReady,
            },
        });
    }
    function _onSMcrSetReady(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrSetReady;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrSetReady, data);
        }
    }

    export function reqMcrSetSelfSettings(data: NetMessage.IC_McrSetSelfSettings): void {
        NetManager.send({
            C_McrSetSelfSettings: data,
        });
    }
    function _onSMcrSetSelfSettings(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrSetSelfSettings;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrSetSelfSettings, data);
        }
    }

    export function reqMcrGetRoomInfo(roomId: number): void {
        NetManager.send({
            C_McrGetRoomInfo: {
                roomId,
            },
        });
    }
    function _onSMcrGetRoomInfo(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrGetRoomInfo;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrGetRoomInfoFailed, data);
        } else {
            McrModel.setRoomInfo(data.roomInfo);
            Notify.dispatch(Notify.Type.SMcrGetRoomInfo, data);
        }
    }

    export function reqMcrGetUnjoinedRoomInfoList(): void {
        NetManager.send({
            C_McrGetUnjoinedRoomInfoList: {
            },
        });
    }
    function _onSMcrGetUnjoinedRoomInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrGetUnjoinedRoomInfoList;
        if (!data.errorCode) {
            McrModel.setUnjoinedRoomInfoList(data.roomInfoList);
            Notify.dispatch(Notify.Type.SMcrGetUnjoinedRoomInfoList, data);
        }
    }

    export function reqMcrGetJoinedRoomInfoList(): void {
        NetManager.send({
            C_McrGetJoinedRoomInfoList: {
            },
        });
    }
    function _onSMcrGetJoinedRoomInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrGetJoinedRoomInfoList;
        if (!data.errorCode) {
            McrModel.setJoinedRoomInfoList(data.roomInfoList);
            Notify.dispatch(Notify.Type.SMcrGetJoinedRoomInfoList, data);
        }
    }

    export function reqMcrStartWar(roomId: number): void {
        NetManager.send({
            C_McrStartWar: {
                roomId,
            },
        });
    }
    function _onSMcrStartWar(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrStartWar;
        if (!data.errorCode) {
            McrModel.removeRoomInfo(data.roomId);
            Notify.dispatch(Notify.Type.SMcrStartWar, data);
        }
    }

    export function reqMcwCommonGetWarInfoList(): void {
        NetManager.send({
            C_McwCommonGetWarInfoList: {},
        });
    }
    function _onSMcwCommonGetWarInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McwCommonGetWarInfoList;
        McrModel.setOngoingWarInfoList(data.infos);
        Notify.dispatch(Notify.Type.SMcwCommonGetWarInfoList, data);
    }

    export function reqReplayInfos(params?: NetMessage.IC_McrGetReplayInfos): void {
        NetManager.send({
            C_McrGetReplayInfos: params || {},
        });
    }
    function _onSMcrGetReplayInfos(e: egret.Event): void {
        const data = e.data as NetMessage.IS_McrGetReplayInfos;
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
        const data = e.data as NetMessage.IS_McrGetReplayData;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SMcrGetReplayDataFailed);
        } else {
            McrModel.setReplayData(data);
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
        const data = e.data as NetMessage.IS_McwWatchGetUnwatchedWarInfos;
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
        const data = e.data as NetMessage.IS_McwWatchGetOngoingWarInfos;
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
        const data = e.data as NetMessage.IS_McwWatchGetRequestedWarInfos;
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
        const data = e.data as NetMessage.IS_McwWatchGetWatchedWarInfos;
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
        const data = e.data as NetMessage.IS_McwWatchMakeRequest;
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
        const data = e.data as NetMessage.IS_McwWatchHandleRequest;
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
        const data = e.data as NetMessage.IS_McwWatchDeleteWatcher;
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
        const data = e.data as NetMessage.IS_McwWatchContinueWar;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SMcwWatchContinueWarFailed, data);
        } else {
            Notify.dispatch(Notify.Type.SMcwWatchContinueWar, data);
        }
    }
}
