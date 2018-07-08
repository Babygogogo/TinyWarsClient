
namespace Login {
    export namespace LoginProxy {
        import NotifyType = Utility.Notify.Type;
        import NetManager = Network.Manager;
        import ActionCode = Network.Codes;

        export function init(): void {
            NetManager.addListeners(
                { actionCode: Network.Codes.S_Login, callback: _onSLogin, thisObject: LoginProxy },
            );
        }

        export function reqLogin(account: string, password: string): void {
            NetManager.send({
                actionCode: ActionCode.C_Login,
                account   : account,
                password  : password,
            });
        }
        function _onSLogin(e: egret.Event): void {
            const data = e.data as Network.Proto.IS_Login;
            if (data.status === Utility.ProtoEnums.S_Login_Status.Succeed) {
                User.UserModel.updateOnLogin(data);
            }
            Utility.Notify.dispatch(NotifyType.SLogin, data);
        }
    }
}
