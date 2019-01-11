
namespace TinyWars.MultiCustomWarRoom {
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;
    import Helpers    = Utility.Helpers;
    import ProtoTypes = Utility.ProtoTypes;
    import Notify     = Utility.Notify;

    export namespace McwrProxy {
        export function init(): void {
            NetManager.addListeners([
                { actionCode: ActionCode.S_CreateMultiCustomWar,                    callback: _onSCreateCustomOnlineWar },
                { actionCode: ActionCode.S_GetUnjoinedWaitingMultiCustomWarInfos,   callback: _onSGetUnjoinedWaitingCustomOnlineWarInfos, },
                { actionCode: ActionCode.S_JoinMultiCustomWar,                      callback: _onSJoinCustomOnlineWar, },
            ], McwrProxy);
        }

        export function reqCreate(param: DataForCreateWar): void {
            const obj = Helpers.cloneObject(param);
            obj["actionCode"] = ActionCode.C_CreateMultiCustomWar;
            NetManager.send(obj);
        }
        function _onSCreateCustomOnlineWar(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_CreateMultiCustomWar;
            if (!data.errorCode) {
                Notify.dispatch(Notify.Type.SCreateCustomOnlineWar, data);
            }
        }

        export function reqUnjoinedWaitingCustomOnlineWarInfos(): void {
            NetManager.send({
                actionCode: ActionCode.C_GetUnjoinedWaitingMultiCustomWarInfos,
            });
        }
        function _onSGetUnjoinedWaitingCustomOnlineWarInfos(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_GetUnjoinedWaitingMultiCustomWarInfos;
            if (!data.errorCode) {
                WarMap.WarMapModel.addMapInfos(data.mapInfos);
                McwrModel.setUnjoinedWarInfos(data.warInfos);
                Notify.dispatch(Notify.Type.SGetUnjoinedWaitingCustomOnlineWarInfos, data);
            }
        }

        export function reqJoinCustomOnlineWar(waitingWarId: number, playerIndex: number, teamIndex: number): void {
            NetManager.send({
                actionCode : ActionCode.C_JoinMultiCustomWar,
                infoId     : waitingWarId,
                playerIndex: playerIndex,
                teamIndex  : teamIndex,
            });
        }
        function _onSJoinCustomOnlineWar(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_JoinMultiCustomWar;
            if (!data.errorCode) {
                Notify.dispatch(Notify.Type.SJoinCustomOnlineWar, data);
            }
        }
    }
}
