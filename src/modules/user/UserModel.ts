
namespace TinyWars.User {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import LocalStorage = Utility.LocalStorage;
    import ProtoTypes   = Utility.ProtoTypes;

    export namespace UserModel {
        let _isLoggedIn   : boolean = false;
        let _userId       : number;
        let _userPrivilege: number;
        let _userAccount  : string;
        let _userPassword : string;
        let _userNickname : string;

        export function init(): void {
            Notify.addEventListeners([
                { type: Notify.Type.SLogout,             callback: _onNotifySLogout, },
                { type: Notify.Type.NetworkDisconnected, callback: _onNotifyNetworkDisconnected, },
            ], UserModel);
        }

        export function updateOnLogin(data: ProtoTypes.IS_Login): void {
            _isLoggedIn    = true;
            _userId        = data.userId;
            _userPrivilege = data.privilege;
            _userAccount   = data.account;
            _userPassword  = data.password;
            _userNickname  = data.nickname;

            LocalStorage.setAccount(data.account);
        }

        export function clearLoginInfo(): void {
            _isLoggedIn     = false;
            _userId         = undefined;
            _userPrivilege  = undefined;
            _userPassword   = undefined;
            _userNickname   = undefined;
        }

        export function checkIsLoggedIn(): boolean {
            return _isLoggedIn;
        }
        export function getUserId(): number {
            return _userId;
        }
        export function getUserPrivilege(): number {
            return _userPrivilege;
        }
        export function getUserAccount(): string {
            return _userAccount;
        }
        export function getUserPassword(): string {
            return _userPassword;
        }
        export function getUserNickname(): string {
            return _userNickname;
        }

        function _onNotifyNetworkDisconnected(e: egret.Event): void {
            _isLoggedIn = false;
        }

        function _onNotifySLogout(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_Logout;
            if (data.reason === Types.LogoutType.SelfRequest) {
                Utility.FloatText.show(Lang.getText(Lang.Type.A0005));
            } else if (data.reason === Types.LogoutType.LoginCollision) {
                Utility.FloatText.show(Lang.getText(Lang.Type.A0006));
            } else if (data.reason === Types.LogoutType.NetworkFailure) {
                Utility.FloatText.show(Lang.getText(Lang.Type.A0013));
            }

            _isLoggedIn   = false;
            _userPassword = undefined;
        }
    }
}
