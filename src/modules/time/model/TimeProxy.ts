
namespace Time {
    export namespace TimeProxy {
        import Notify     = Utility.Notify;
        import NotifyType = Utility.Notify.Type;
        import NetManager = Network.Manager;
        import ActionCode = Network.Codes;
        import Proto      = Network.Proto;

        export function init(): void {
            NetManager.addListeners(
                { actionCode: ActionCode.S_Heartbeat, callback: _onSHeartbeat, thisObject: TimeProxy },
            );
        }

        export function reqHeartbeat(counter: number): void {
            NetManager.send({
                actionCode: ActionCode.C_Heartbeat,
                counter   : counter,
            });
        }
        function _onSHeartbeat(e: egret.Event): void {
            const data = e.data as Proto.IS_Heartbeat;
            if (!data.errorCode) {
                Notify.dispatch(NotifyType.SHeartbeat, data);
            }
        }
    }
}
