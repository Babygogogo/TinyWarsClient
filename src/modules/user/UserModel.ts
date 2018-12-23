
namespace TinyWars.User {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import LocalStorage = Utility.LocalStorage;
    import ProtoTypes   = Utility.ProtoTypes;

    export namespace UserModel {
        let isLoggedIn   : boolean = false;
        let userId       : number;
        let userPrivilege: number;
        let userAccount  : string;
        let userPassword : string;
        let userNickname : string;

        export function init(): void {
            Notify.addEventListeners([
                { name: Notify.Type.SLogout,             callback: _onNotifySLogout,             thisObject: UserModel },
                { name: Notify.Type.NetworkConnected,    callback: _onNotifyNetworkConnected,    thisObject: UserModel },
                { name: Notify.Type.NetworkDisconnected, callback: _onNotifyNetworkDisconnected, thisObject: UserModel },
            ]);
        }

        export function updateOnLogin(data: ProtoTypes.IS_Login): void {
            isLoggedIn    = true;
            userId        = data.userId;
            userPrivilege = data.privilege;
            userAccount   = data.account;
            userPassword  = data.password;
            userNickname  = data.nickname;

            LocalStorage.setAccount(data.account);
        }

        export function getUserId(): number {
            return userId;
        }
        export function getUserPrivilege(): number {
            return userPrivilege;
        }
        export function getUserNickname(): string {
            return userNickname;
        }

        function _onNotifyNetworkConnected(e: egret.Event): void {
            if ((!isLoggedIn) && (userAccount != null) && (userPassword != null)) {
                Login.LoginProxy.reqLogin(userAccount, userPassword);
            }
        }

        function _onNotifyNetworkDisconnected(e: egret.Event): void {
            isLoggedIn = false;
        }

        function _onNotifySLogout(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_Logout;
            if (data.reason === Types.LogoutType.SelfRequest) {
                Utility.FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S05));
            } else if (data.reason === Types.LogoutType.LoginCollision) {
                Utility.FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S06));
            } else if (data.reason === Types.LogoutType.NetworkFailure) {
                Utility.FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S13));
            }

            isLoggedIn   = false;
            userPassword = undefined;
            Utility.StageManager.gotoLogin();
        }
    }
}
