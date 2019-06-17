
namespace TinyWars.User {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import LocalStorage = Utility.LocalStorage;
    import ProtoTypes   = Utility.ProtoTypes;

    export namespace UserModel {
        let _isLoggedIn     : boolean = false;
        let _selfUserId     : number;
        let _selfPrivilege  : number;
        let _selfAccount    : string;
        let _selfPassword   : string;
        let _selfNickname   : string;
        let _selfRankScore  : number = 0;
        const _userInfos    = new Map<number, ProtoTypes.IS_GetUserPublicInfo>();

        export function init(): void {
            Notify.addEventListeners([
                { type: Notify.Type.SLogout,             callback: _onNotifySLogout, },
                { type: Notify.Type.NetworkDisconnected, callback: _onNotifyNetworkDisconnected, },
            ], UserModel);
        }

        export function updateOnLogin(data: ProtoTypes.IS_Login): void {
            _isLoggedIn    = true;
            _selfUserId    = data.userId;
            _selfPrivilege = data.privilege;
            _selfAccount   = data.account;
            _selfPassword  = data.password;
            _selfNickname  = data.nickname;
            _selfRankScore = data.rank2pScore;

            LocalStorage.setAccount(data.account);
            LocalStorage.setPassword(data.password);
        }

        export function clearLoginInfo(): void {
            _isLoggedIn     = false;
            _selfUserId     = undefined;
            _selfPrivilege  = undefined;
            _selfPassword   = undefined;
            _selfNickname   = undefined;
            _selfRankScore  = 0;
        }

        export function checkIsLoggedIn(): boolean {
            return _isLoggedIn;
        }
        export function getSelfUserId(): number {
            return _selfUserId;
        }
        export function getSelfPrivilege(): number {
            return _selfPrivilege;
        }
        export function getSelfAccount(): string {
            return _selfAccount;
        }
        export function getSelfPassword(): string {
            return _selfPassword;
        }
        export function getSelfNickname(): string {
            return _selfNickname;
        }
        export function getSelfRankScore(): number {
            return _selfRankScore;
        }

        export function getUserInfo(userId: number): ProtoTypes.IS_GetUserPublicInfo | undefined {
            return _userInfos.get(userId);
        }
        export function setUserInfo(info: ProtoTypes.IS_GetUserPublicInfo): void {
            _userInfos.set(info.id, info);
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
            _selfPassword = undefined;
        }
    }
}
