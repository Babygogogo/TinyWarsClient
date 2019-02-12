
namespace TinyWars.MultiCustomRoom {
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;
    import Helpers    = Utility.Helpers;
    import ProtoTypes = Utility.ProtoTypes;
    import Notify     = Utility.Notify;

    export namespace McrProxy {
        export function init(): void {
            NetManager.addListeners([
                { actionCode: ActionCode.S_McrCreateWar,                callback: _onSMcrCreateWar },
                { actionCode: ActionCode.S_McrGetUnjoinedWaitingInfos,  callback: _onSMcrGetUnjoinedWaitingInfos, },
                { actionCode: ActionCode.S_McrJoinWar,                  callback: _onSMcrJoinWar, },
                { actionCode: ActionCode.S_McrGetJoinedWaitingInfos,    callback: _onSMcrGetJoinedWaitingInfos, },
                { actionCode: ActionCode.S_McrExitWar,                  callback: _onSMcrExitWar, },
            ], McrProxy);
        }

        export function reqCreate(param: DataForCreateWar): void {
            // const obj = Helpers.cloneObject(param) as Utility.Types.Action;
            // obj.actionCode = ActionCode.C_McrCreateWar;
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
                McrModel.setUnjoinedWarInfos(data.warInfos);
                Notify.dispatch(Notify.Type.SMcrGetUnjoinedWaitingInfos, data);
            }
        }

        export function reqJoin(waitingWarId: number, playerIndex: number, teamIndex: number): void {
            NetManager.send({
                C_McrJoinWar: {
                    infoId     : waitingWarId,
                    playerIndex: playerIndex,
                    teamIndex  : teamIndex,
                },
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
                McrModel.setJoinedWarInfos(data.warInfos);
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

        export function reqGetJoinedOngoingWarInfos(): void {
            NetManager.send({
                C_McrGetJoinedOngoingInfos: {},
            });
        }
        function _onSMcrGetJoinedOngoingInfos(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_McrGetJoinedOngoingInfos;
            // TODO
        }
    }
}
