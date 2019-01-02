
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
                { type: Notify.Type.SLogout,             callback: _onNotifySLogout,             thisObject: UserModel },
                { type: Notify.Type.NetworkConnected,    callback: _onNotifyNetworkConnected,    thisObject: UserModel },
                { type: Notify.Type.NetworkDisconnected, callback: _onNotifyNetworkDisconnected, thisObject: UserModel },
            ]);
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

        export function getUserId(): number {
            return _userId;
        }
        export function getUserPrivilege(): number {
            return _userPrivilege;
        }
        export function getUserNickname(): string {
            return _userNickname;
        }
        export function checkIsLoggedIn(): boolean {
            return _isLoggedIn;
        }

        function _onNotifyNetworkConnected(e: egret.Event): void {
            if ((!_isLoggedIn) && (_userAccount != null) && (_userPassword != null)) {
                Login.LoginProxy.reqLogin(_userAccount, _userPassword);
            }
        }

        function _onNotifyNetworkDisconnected(e: egret.Event): void {
            _isLoggedIn = false;
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

            _isLoggedIn   = false;
            _userPassword = undefined;
        }
    }
}
