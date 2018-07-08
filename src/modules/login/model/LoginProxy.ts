
namespace Login {
    export namespace LoginProxy {
        export function init(): void {
            Network.Manager.addListeners(
                {actionCode: Network.Codes.S_Login, callback: _onSLogin, thisObject: LoginProxy},
            );
        }

        function _onSLogin(e: egret.Event): void {
            const data = e.data as Network.Proto.IS_Login;
        }
    }
}
