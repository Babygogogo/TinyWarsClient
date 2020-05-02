
namespace TinyWars.User {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import LocalStorage = Utility.LocalStorage;
    import ProtoTypes   = Utility.ProtoTypes;

    export namespace UserModel {
        let _isLoggedIn             = false;
        let _selfUserId             : number;
        let _selfIsAdmin            : number;
        let _selfIsMapCommittee     : number;
        let _selfIsCoCommittee      : number;
        let _selfAccount            : string;
        let _selfPassword           : string;
        let _selfNickname           : string;
        let _selfDiscordId          : string;
        let _selfRankScore          : number = 0;
        const _userPublicInfoDict   = new Map<number, ProtoTypes.IS_GetUserPublicInfo>();

        export function init(): void {
            Notify.addEventListeners([
                { type: Notify.Type.SLogout,             callback: _onNotifySLogout, },
                { type: Notify.Type.NetworkDisconnected, callback: _onNotifyNetworkDisconnected, },
            ], UserModel);
        }

        export function updateOnLogin(data: ProtoTypes.IS_Login): void {
            _isLoggedIn         = true;
            _selfUserId         = data.userId;
            _selfIsAdmin        = data.isAdmin;
            _selfIsCoCommittee  = data.isCoCommitee;
            _selfIsMapCommittee = data.isMapCommitee;
            _selfAccount        = data.account;
            _selfPassword       = data.password;
            setSelfNickname(data.nickname);
            setSelfDiscordId(data.discordId);
            _selfRankScore = data.rank2pScore;

            LocalStorage.setAccount(data.account);
            LocalStorage.setPassword(data.password);
        }

        export function clearLoginInfo(): void {
            _isLoggedIn         = false;
            _selfUserId         = null;
            _selfIsAdmin        = null;
            _selfIsCoCommittee   = null;
            _selfIsMapCommittee  = null;
            _selfPassword       = null;
            setSelfNickname(null);
            setSelfDiscordId(null);
            _selfRankScore  = 0;
        }

        export function checkIsLoggedIn(): boolean {
            return _isLoggedIn;
        }
        export function getSelfUserId(): number {
            return _selfUserId;
        }
        export function checkIsAdmin(): boolean {
            return !!_selfIsAdmin;
        }
        export function checkIsMapCommittee(): boolean {
            return !!_selfIsMapCommittee;
        }
        export function checkIsCoCommitee(): boolean {
            return !!_selfIsCoCommittee;
        }
        export function getSelfAccount(): string {
            return _selfAccount;
        }
        export function getSelfPassword(): string {
            return _selfPassword;
        }
        export function setSelfNickname(nickname: string): void {
            _selfNickname = nickname;
        }
        export function getSelfNickname(): string {
            return _selfNickname;
        }
        export function setSelfDiscordId(discordId: string | null): void {
            _selfDiscordId = discordId;
        }
        export function getSelfDiscordId(): string | null {
            return _selfDiscordId;
        }
        export function getSelfRankScore(): number {
            return _selfRankScore;
        }

        export function getUserPublicInfo(userId: number): Promise<ProtoTypes.IS_GetUserPublicInfo | undefined | null> {
            if (userId == null) {
                return null;
            } else {
                const localData = _userPublicInfoDict.get(userId);
                if (localData) {
                    return new Promise(resolve => resolve(localData));
                } else {
                    return new Promise((resolve, reject) => {
                        const callbackOnSucceed = (e: egret.Event): void => {
                            const data = e.data as ProtoTypes.IS_GetUserPublicInfo;
                            if (data.id === userId) {
                                Notify.removeEventListener(Notify.Type.SGetUserPublicInfo,        callbackOnSucceed);
                                Notify.removeEventListener(Notify.Type.SGetUserPublicInfoFailed,  callbackOnFailed);

                                resolve(data);
                            }
                        };
                        const callbackOnFailed = (e: egret.Event): void => {
                            const data = e.data as ProtoTypes.IS_GetUserPublicInfo;
                            if (data.id === userId) {
                                Notify.removeEventListener(Notify.Type.SGetUserPublicInfo,        callbackOnSucceed);
                                Notify.removeEventListener(Notify.Type.SGetUserPublicInfoFailed,  callbackOnFailed);

                                resolve(null);
                            }
                        };

                        Notify.addEventListener(Notify.Type.SGetUserPublicInfo,       callbackOnSucceed);
                        Notify.addEventListener(Notify.Type.SGetUserPublicInfoFailed, callbackOnFailed);

                        UserProxy.reqGetUserPublicInfo(userId);
                    });
                }
            }
        }
        export function setUserPublicInfo(info: ProtoTypes.IS_GetUserPublicInfo): void {
            _userPublicInfoDict.set(info.id, info);
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
