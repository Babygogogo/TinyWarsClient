
// import CommonModel          from "../../common/model/CommonModel";
// import FloatText            from "../../tools/helpers/FloatText";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import UserProxy            from "./UserProxy";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace UserModel {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NetMessage           = ProtoTypes.NetMessage;
    import IUserPublicInfo      = ProtoTypes.User.IUserPublicInfo;
    import IUserSettings        = ProtoTypes.User.IUserSettings;
    import IUserSelfInfo        = ProtoTypes.User.IUserSelfInfo;
    import IUserPrivilege       = ProtoTypes.User.IUserPrivilege;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;

    let _isLoggedIn                 = false;
    let _selfInfo                   : IUserSelfInfo | null = null;
    let _selfAccount                : string;
    let _selfPassword               : string | null = null;
    const _userPublicInfoDict       = new Map<number, IUserPublicInfo | null>();
    const _userPublicInfoRequests   = new Map<number, ((info: NetMessage.MsgUserGetPublicInfo.IS) => void)[]>();

    export function init(): void {
        Notify.addEventListeners([
            { type: NotifyType.NetworkDisconnected,    callback: _onNotifyNetworkDisconnected, },
            { type: NotifyType.MsgUserLogout,          callback: _onNotifyMsgUserLogout, },
        ], null);
    }

    export function clearLoginInfo(): void {
        setIsLoggedIn(false);
        setSelfInfo(null);
        setSelfPassword(null);
    }

    function setIsLoggedIn(isLoggedIn: boolean): void {
        _isLoggedIn = isLoggedIn;
    }
    export function getIsLoggedIn(): boolean {
        return _isLoggedIn;
    }

    function setSelfInfo(selfInfo: IUserSelfInfo | null): void {
        _selfInfo = selfInfo;
    }
    export function getSelfInfo(): IUserSelfInfo | null {
        return _selfInfo;
    }
    function getSelfUserComplexInfo(): ProtoTypes.User.IUserComplexInfo | null {
        const selfInfo = getSelfInfo();
        return selfInfo ? selfInfo.userComplexInfo ?? null : null;
    }

    export function getSelfUserId(): number | null {
        const selfInfo = getSelfInfo();
        return selfInfo ? selfInfo.userId ?? null : null;
    }

    export function setSelfAccount(account: string): void {
        _selfAccount = account;
    }
    export function getSelfAccount(): string {
        return _selfAccount;
    }

    export function setSelfPassword(password: string | null): void {
        _selfPassword = password;
    }
    export function getSelfPassword(): string | null {
        return _selfPassword;
    }

    function getSelfUserPrivilege(): IUserPrivilege | null {
        const userComplexInfo = getSelfUserComplexInfo();
        return userComplexInfo ? userComplexInfo.userPrivilege ?? null : null;
    }
    function setSelfUserPrivilege(userPrivilege: IUserPrivilege): void {
        const userComplexInfo = getSelfUserComplexInfo();
        (userComplexInfo) && (userComplexInfo.userPrivilege = userPrivilege);
    }
    export function getIsSelfAdmin(): boolean {
        const privilege = getSelfUserPrivilege();
        return privilege ? (!!privilege.isAdmin) : false;
    }
    export function getIsSelfMapCommittee(): boolean {
        const privilege = getSelfUserPrivilege();
        return privilege ? (!!privilege.isMapCommittee) : false;
    }
    export function checkCanSelfEditChangeLog(): boolean {
        const privilege = getSelfUserPrivilege();
        return (!!privilege)
            && ((!!privilege.isAdmin) || (!!privilege.isChangeLogEditor));
    }

    export function getSelfNickname(): string | null {
        const info = getSelfInfo();
        return info ? info.nickname ?? null : null;
    }
    function setSelfNickname(nickname: string): void {
        const info = getSelfInfo();
        (info) && (info.nickname = nickname);
    }

    export function getSelfAvatarId(): number | null {
        return getSelfInfo()?.userComplexInfo?.avatarId ?? null;
    }
    export function setSelfAvatarId(avatarId: number): void {
        const userComplexInfo = getSelfInfo()?.userComplexInfo;
        (userComplexInfo) && (userComplexInfo.avatarId = avatarId);
    }

    export function getSelfDiscordId(): string | null {
        const info = getSelfInfo();
        return info ? info.discordId ?? null : null;
    }
    function setSelfDiscordId(discordId: string | null): void {
        const info = getSelfInfo();
        (info) && (info.discordId = discordId);
    }

    export function getUserPublicInfo(userId: number): Promise<IUserPublicInfo | null> {
        if (userId == null) {
            return new Promise((resolve) => resolve(null));
        }

        const localData = _userPublicInfoDict.get(userId);
        if (localData) {
            return new Promise(resolve => resolve(localData));
        }

        if (_userPublicInfoRequests.has(userId)) {
            return new Promise((resolve) => {
                Helpers.getExisted(_userPublicInfoRequests.get(userId)).push(info => resolve(info.userPublicInfo ?? null));
            });
        }

        new Promise<void>((resolve) => {
            const callbackOnSucceed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgUserGetPublicInfo.IS;
                if (data.userId === userId) {
                    Notify.removeEventListener(NotifyType.MsgUserGetPublicInfo,        callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgUserGetPublicInfoFailed,  callbackOnFailed);

                    for (const cb of Helpers.getExisted(_userPublicInfoRequests.get(userId))) {
                        cb(data);
                    }
                    _userPublicInfoRequests.delete(userId);

                    resolve();
                }
            };
            const callbackOnFailed = (e: egret.Event): void => {
                const data = e.data as NetMessage.MsgUserGetPublicInfo.IS;
                if (data.userId === userId) {
                    Notify.removeEventListener(NotifyType.MsgUserGetPublicInfo,        callbackOnSucceed);
                    Notify.removeEventListener(NotifyType.MsgUserGetPublicInfoFailed,  callbackOnFailed);

                    for (const cb of Helpers.getExisted(_userPublicInfoRequests.get(userId))) {
                        cb(data);
                    }
                    _userPublicInfoRequests.delete(userId);

                    resolve();
                }
            };

            Notify.addEventListener(NotifyType.MsgUserGetPublicInfo,       callbackOnSucceed);
            Notify.addEventListener(NotifyType.MsgUserGetPublicInfoFailed, callbackOnFailed);

            UserProxy.reqUserGetPublicInfo(userId);
        });

        return new Promise((resolve) => {
            _userPublicInfoRequests.set(userId, [info => resolve(info.userPublicInfo ?? null)]);
        });
    }
    export function setUserPublicInfo(info: IUserPublicInfo): void {
        _userPublicInfoDict.set(Helpers.getExisted(info.userId), info);
    }

    export async function getUserNickname(userId: number): Promise<string | null> {
        const info = await getUserPublicInfo(userId);
        return info ? info.nickname ?? null : null;
    }
    export async function getUserMrwRankScoreInfo(userId: number, warType: Types.WarType, playersCount: number): Promise<ProtoTypes.User.UserRankInfo.IUserMrwRankInfo | null> {
        return (await getUserPublicInfo(userId))?.userMrwRankInfoArray?.find(v => (v.warType === warType) && (v.playersCountUnneutral === playersCount)) ?? null;
    }
    export async function getUserMpwStatisticsData(userId: number, warType: Types.WarType, playersCount: number): Promise<ProtoTypes.User.UserWarStatistics.IUserMpwStatistics | null> {
        return (await getUserPublicInfo(userId))?.userMpwStatisticsArray?.find(v => (v.warType === warType) && (v.playersCountUnneutral === playersCount)) ?? null;
    }
    export function getMapRating(mapId: number): number | null {
        return getSelfUserComplexInfo()?.userMapRatingArray?.find(v => v.mapId === mapId)?.rating ?? null;
    }

    function getSelfSettings(): IUserSettings | null {
        return getSelfUserComplexInfo()?.userSettings ?? null;
    }
    export function getSelfSettingsTextureVersion(): Types.UnitAndTileTextureVersion {
        return getSelfSettings()?.unitAndTileTextureVersion ?? Types.UnitAndTileTextureVersion.V0;
    }
    export function getSelfSettingsIsSetPathMode(): boolean {
        return getSelfSettings()?.isSetPathMode ?? false;
    }
    export function getSelfSettingsIsShowGridBorder(): boolean {
        return getSelfSettings()?.isShowGridBorder ?? false;
    }
    export function getSelfSettingsUnitOpacity(): number {
        return getSelfSettings()?.unitOpacity ?? 100;
    }

    export function updateOnMsgUserLogin(data: NetMessage.MsgUserLogin.IS): void {
        setIsLoggedIn(true);

        const userSelfInfo = data.userSelfInfo;
        (userSelfInfo) && (setSelfInfo(userSelfInfo));
    }
    export async function updateOnMsgUserGetOnlineState(data: NetMessage.MsgUserGetOnlineState.IS): Promise<void> {
        const userPublicInfo = await getUserPublicInfo(Helpers.getExisted(data.userId));
        if (userPublicInfo) {
            userPublicInfo.isOnline         = data.isOnline;
            userPublicInfo.lastActivityTime = data.lastActivityTime;
        }
    }
    export function updateOnMsgUserSetNickname(data: NetMessage.MsgUserSetNickname.IS): void {
        setSelfNickname(Helpers.getExisted(data.nickname));
    }
    export function updateOnMsgUserSetDiscordId(data: NetMessage.MsgUserSetDiscordId.IS): void {
        setSelfDiscordId(data.discordId ?? null);
    }
    export function updateOnMsgUserSetPrivilege(data: NetMessage.MsgUserSetPrivilege.IS): void {
        if (data.userId === getSelfUserId()) {
            setSelfUserPrivilege(Helpers.getExisted(data.userPrivilege));
        }
    }
    export function updateOnMsgUserSetSettings(data: NetMessage.MsgUserSetSettings.IS): void {
        const selfSettings  = getSelfSettings();
        const newSettings   = data.userSettings;
        if ((selfSettings == null) || (newSettings == null)) {
            return;
        }

        const oldVersion            = getSelfSettingsTextureVersion();
        const oldIsShowGridBorder   = getSelfSettingsIsShowGridBorder();
        const oldUnitOpacity        = getSelfSettingsUnitOpacity();
        (newSettings.isSetPathMode != null)             && (selfSettings.isSetPathMode = newSettings.isSetPathMode);
        (newSettings.isShowGridBorder != null)          && (selfSettings.isShowGridBorder = newSettings.isShowGridBorder);
        (newSettings.unitAndTileTextureVersion != null) && (selfSettings.unitAndTileTextureVersion = newSettings.unitAndTileTextureVersion);
        (newSettings.unitOpacity != null)               && (selfSettings.unitOpacity = newSettings.unitOpacity);

        if (oldVersion !== getSelfSettingsTextureVersion()) {
            CommonModel.updateOnUnitAndTileTextureVersionChanged();
            Notify.dispatch(NotifyType.UnitAndTileTextureVersionChanged);
        }
        if (oldIsShowGridBorder !== getSelfSettingsIsShowGridBorder()) {
            Notify.dispatch(NotifyType.UserSettingsIsShowGridBorderChanged);
        }
        if (oldUnitOpacity !== getSelfSettingsUnitOpacity()) {
            Notify.dispatch(NotifyType.UserSettingsUnitOpacityChanged);
        }
    }
    export function updateOnMsgUserSetMapRating(data: NetMessage.MsgUserSetMapRating.IS): void {
        const complexInfo       = Helpers.getExisted(getSelfUserComplexInfo());
        const { mapId, rating } = data;
        if (complexInfo.userMapRatingArray == null) {
            complexInfo.userMapRatingArray = [{
                mapId,
                rating,
            }];
        } else {
            const array = complexInfo.userMapRatingArray;
            const info  = array.find(v => v.mapId === mapId);
            if (info) {
                info.rating = rating;
            } else {
                array.push({
                    mapId,
                    rating,
                });
            }
        }
    }
    export function updateOnMsgUserSetAvatarId(data: NetMessage.MsgUserSetAvatarId.IS): void {
        setSelfAvatarId(Helpers.getExisted(data.avatarId, ClientErrorCode.UserModel_UpdateOnMsgUserSetAvatarId_00));
    }

    function _onNotifyNetworkDisconnected(): void {
        setIsLoggedIn(false);
    }
    function _onNotifyMsgUserLogout(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserLogout.IS;
        if (data.reason === Types.LogoutType.SelfRequest) {
            FloatText.show(Lang.getText(LangTextType.A0005));
        } else if (data.reason === Types.LogoutType.LoginCollision) {
            FloatText.show(Lang.getText(LangTextType.A0006));
        } else if (data.reason === Types.LogoutType.NetworkFailure) {
            FloatText.show(Lang.getText(LangTextType.A0013));
        }

        setIsLoggedIn(false);
    }
}

// export default UserModel;
