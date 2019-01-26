
namespace TinyWars.Time {
    export namespace TimeProxy {
        import Notify     = Utility.Notify;
        import NotifyType = Utility.Notify.Type;
        import ProtoTypes = Utility.ProtoTypes;
        import NetManager = Network.Manager;
        import ActionCode = Network.Codes;

        export function init(): void {
            NetManager.addListeners([
                { actionCode: ActionCode.S_Heartbeat, callback: _onSHeartbeat },
            ], TimeProxy);
        }

        export function reqHeartbeat(counter: number): void {
            NetManager.send({
                C_Heartbeat: {
                    counter   : counter,
                },
            });
        }
        function _onSHeartbeat(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_Heartbeat;
            if (!data.errorCode) {
                Notify.dispatch(NotifyType.SHeartbeat, data);
            }
        }
    }
}
