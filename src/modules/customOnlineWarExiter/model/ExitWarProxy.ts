
namespace CustomOnlineWarExiter {
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;
    import Helpers    = Utility.Helpers;
    import ProtoTypes = Utility.ProtoTypes;
    import Notify     = Utility.Notify;

    export namespace ExitWarProxy {
        export function init(): void {
            NetManager.addListeners(
                { actionCode: ActionCode.S_GetJoinedWaitingCustomOnlineWarInfos, callback: _onSGetJoinedWaitingCustomOnlineWarInfos, thisObject: ExitWarProxy },
                { actionCode: ActionCode.S_ExitCustomOnlineWar,                  callback: _onSExitCustomOnlineWar,                  thisObject: ExitWarProxy },
            );
        }

        export function reqJoinedWaitingCustomOnlineWarInfos(): void {
            NetManager.send({
                actionCode: ActionCode.C_GetJoinedWaitingCustomOnlineWarInfos,
            });
        }
        function _onSGetJoinedWaitingCustomOnlineWarInfos(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_GetJoinedWaitingCustomOnlineWarInfos;
            if (!data.errorCode) {
                TemplateMap.TemplateMapModel.addMapInfos(data.mapInfos);
                ExitWarModel.setWarInfos(data.warInfos);
                Notify.dispatch(Notify.Type.SGetJoinedWaitingCustomOnlineWarInfos, data);
            }
        }

        export function reqExitCustomOnlineWar(waitingWarId: number): void {
            NetManager.send({
                actionCode: ActionCode.C_ExitCustomOnlineWar,
                infoId    : waitingWarId,
            });
        }
        function _onSExitCustomOnlineWar(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_ExitCustomOnlineWar;
            if (!data.errorCode) {
                Notify.dispatch(Notify.Type.SExitCustomOnlineWar, data);
            }
        }
    }
}
