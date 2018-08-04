
namespace User {
    export namespace UserModel {
        import Notify       = Utility.Notify;
        import Types        = Utility.Types;
        import Lang         = Utility.Lang;
        import LocalStorage = Utility.LocalStorage;

        let userId       : number;
        let userPrivilege: number;
        let userAccount  : string;

        export function init(): void {
            Notify.addEventListeners([
                { name: Notify.Type.SLogout, callback: _onNotifySLogout, thisObject: UserModel },
            ]);
        }

        export function updateOnLogin(data: Network.Proto.IS_Login): void {
            userId        = data.userId;
            userPrivilege = data.privilege;
            userAccount   = data.account;

            LocalStorage.setAccount(data.account);
        }

        export function getUserId(): number {
            return userId;
        }

        export function getUserPrivilege(): number {
            return userPrivilege;
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
