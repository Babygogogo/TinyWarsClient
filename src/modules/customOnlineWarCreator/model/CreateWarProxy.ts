
namespace CustomOnlineWarCreator {
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;

    export namespace CreateWarProxy {
        export function init(): void {
            NetManager.addListeners(
                // { actionCode: ActionCode.S_Heartbeat, callback: _onSHeartbeat, thisObject: TimeProxy },
            );
        }
    }
}
