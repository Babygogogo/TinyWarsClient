
namespace User {
    export namespace UserModel {
        import Notify = Utility.Notify;
        import Types  = Utility.Types;
        import Lang   = Utility.Lang;

        let userId       : number;
        let userPrivilege: number;

        export function init(): void {
            Notify.addEventListeners([
                { name: Notify.Type.NetworkConnected,    callback: _onNotifyNetworkConnected,    thisObject: UserModel },
                { name: Notify.Type.NetworkDisconnected, callback: _onNotifyNetworkDisconnected, thisObject: UserModel },
                { name: Notify.Type.SLogout,             callback: _onNotifySLogout,             thisObject: UserModel },
            ]);
        }

        export function updateOnLogin(data: Network.Proto.IS_Login): void {
            userId        = data.userId;
            userPrivilege = data.privilege;
        }

        export function getUserId(): number {
            return userId;
        }

        export function getUserPrivilege(): number {
            return userPrivilege;
        }

        function _onNotifyNetworkConnected(e: egret.Event): void {
            // TODO
            Utility.FloatText.show("AAAAAAAAAA");
        }

        function _onNotifyNetworkDisconnected(e: egret.Event): void {
            // TODO
            Utility.FloatText.show("BBBBBBBBBBBB");
        }

        function _onNotifySLogout(e: egret.Event): void {
            const data = e.data as Network.Proto.IS_Logout;
            if (data.reason === Types.LogoutType.SelfRequest) {
                Utility.FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S05));
            } else if (data.reason === Types.LogoutType.LoginCollision) {
                Utility.FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S06));
            }
            Login.LoginBackgroundPanel.create();
            Login.LoginPanel.create();
        }
    }
}
