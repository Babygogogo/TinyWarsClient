
import * as UserProxy           from "./UserProxy";
import * as CommonModel         from "../../common/model/CommonModel";
import * as FloatText           from "../../../utility/FloatText";
import { Notify }               from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import { Types }                from "../../../utility/Types";
import * as Lang                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import NetMessage               = ProtoTypes.NetMessage;
import IUserPublicInfo          = ProtoTypes.User.IUserPublicInfo;
import IUserSettings            = ProtoTypes.User.IUserSettings;
import IUserSelfInfo            = ProtoTypes.User.IUserSelfInfo;
import IUserPrivilege           = ProtoTypes.User.IUserPrivilege;

let _isLoggedIn                 = false;
let _selfInfo                   : IUserSelfInfo;
let _selfAccount                : string;
let _selfPassword               : string;
const _userPublicInfoDict       = new Map<number, IUserPublicInfo>();
const _userPublicInfoRequests   = new Map<number, ((info: NetMessage.MsgUserGetPublicInfo.IS | undefined | null) => void)[]>();

export function init(): void {
    Notify.addEventListeners([
        { type: NotifyType.NetworkDisconnected,    callback: _onNotifyNetworkDisconnected, },
        { type: NotifyType.MsgUserLogout,          callback: _onNotifyMsgUserLogout, },
    ], undefined);
}

export function clearLoginInfo(): void {
    setIsLoggedIn(false);
    setSelfInfo(undefined);
    setSelfPassword(undefined);
}

function setIsLoggedIn(isLoggedIn: boolean): void {
    _isLoggedIn = isLoggedIn;
}
export function getIsLoggedIn(): boolean {
    return _isLoggedIn;
}

function setSelfInfo(selfInfo: IUserSelfInfo): void {
    _selfInfo = selfInfo;
}
export function getSelfInfo(): IUserSelfInfo | null {
    return _selfInfo;
}
function getSelfUserComplexInfo(): ProtoTypes.User.IUserComplexInfo | null {
    const selfInfo = getSelfInfo();
    return selfInfo ? selfInfo.userComplexInfo : null;
}

export function getSelfUserId(): number | undefined {
    const selfInfo = getSelfInfo();
    return selfInfo ? selfInfo.userId : null;
}

export function setSelfAccount(account: string): void {
    _selfAccount = account;
}
export function getSelfAccount(): string {
    return _selfAccount;
}

export function setSelfPassword(password: string): void {
    _selfPassword = password;
}
export function getSelfPassword(): string {
    return _selfPassword;
}

function getSelfUserPrivilege(): IUserPrivilege | null {
    const userComplexInfo = getSelfUserComplexInfo();
    return userComplexInfo ? userComplexInfo.userPrivilege : null;
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
        && ((privilege.isAdmin) || (privilege.isChangeLogEditor));
}

export function getSelfNickname(): string | null {
    const info = getSelfInfo();
    return info ? info.nickname : null;
}
function setSelfNickname(nickname: string): void {
    const info = getSelfInfo();
    (info) && (info.nickname = nickname);
}

export function getSelfDiscordId(): string {
    const info = getSelfInfo();
    return info ? info.discordId : null;
}
function setSelfDiscordId(discordId: string): void {
    const info = getSelfInfo();
    (info) && (info.discordId = discordId);
}

export function getUserPublicInfo(userId: number): Promise<IUserPublicInfo | undefined | null> {
    if (userId == null) {
        return new Promise((resolve) => resolve(null));
    }

    const localData = _userPublicInfoDict.get(userId);
    if (localData) {
        return new Promise(resolve => resolve(localData));
    }

    if (_userPublicInfoRequests.has(userId)) {
        return new Promise((resolve) => {
            _userPublicInfoRequests.get(userId).push(info => resolve(info.userPublicInfo));
        });
    }

    new Promise<void>((resolve) => {
        const callbackOnSucceed = (e: egret.Event): void => {
            const data = e.data as NetMessage.MsgUserGetPublicInfo.IS;
            if (data.userId === userId) {
                Notify.removeEventListener(NotifyType.MsgUserGetPublicInfo,        callbackOnSucceed);
                Notify.removeEventListener(NotifyType.MsgUserGetPublicInfoFailed,  callbackOnFailed);

                for (const cb of _userPublicInfoRequests.get(userId)) {
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

                for (const cb of _userPublicInfoRequests.get(userId)) {
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
        _userPublicInfoRequests.set(userId, [info => resolve(info.userPublicInfo)]);
    });
}
export function setUserPublicInfo(info: IUserPublicInfo): void {
    _userPublicInfoDict.set(info.userId, info);
}

export async function getUserNickname(userId: number): Promise<string> {
    const info = await getUserPublicInfo(userId);
    return info ? info.nickname : undefined;
}
export async function getUserMrwRankScoreInfo(userId: number, warType: Types.WarType, playersCount: number): Promise<ProtoTypes.User.UserRankInfo.IUserMrwRankInfo> {
    const info = await getUserPublicInfo(userId);
    return (info ? info.userMrwRankInfoArray || [] : []).find(v => (v.warType === warType) && (v.playersCountUnneutral === playersCount));
}
export async function getUserMpwStatisticsData(userId: number, warType: Types.WarType, playersCount: number): Promise<ProtoTypes.User.UserWarStatistics.IUserMpwStatistics> {
    const info = await getUserPublicInfo(userId);
    return (info ? info.userMpwStatisticsArray || [] : []).find(v => (v.warType === warType) && (v.playersCountUnneutral === playersCount));
}

function getSelfSettings(): IUserSettings | null {
    const userComplexInfo = getSelfUserComplexInfo();
    return userComplexInfo ? userComplexInfo.userSettings : null;
}
export function getSelfSettingsTextureVersion(): Types.UnitAndTileTextureVersion {
    const selfSettings = getSelfSettings();
    return selfSettings
        ? selfSettings.unitAndTileTextureVersion || Types.UnitAndTileTextureVersion.V0
        : Types.UnitAndTileTextureVersion.V0;
}
export function getSelfSettingsIsSetPathMode(): boolean {
    const selfSettings = getSelfSettings();
    return selfSettings
        ? !!selfSettings.isSetPathMode
        : false;
}
export function getSelfSettingsIsShowGridBorder(): boolean {
    const selfSettings = getSelfSettings();
    return selfSettings
        ? selfSettings.isShowGridBorder || false
        : false;
}

export function updateOnMsgUserLogin(data: NetMessage.MsgUserLogin.IS): void {
    setIsLoggedIn(true);

    const userSelfInfo = data.userSelfInfo;
    (userSelfInfo) && (setSelfInfo(userSelfInfo));
}
export function updateOnMsgUserSetNickname(data: NetMessage.MsgUserSetNickname.IS): void {
    setSelfNickname(data.nickname);
}
export function updateOnMsgUserSetDiscordId(data: NetMessage.MsgUserSetDiscordId.IS): void {
    setSelfDiscordId(data.discordId);
}
export function updateOnMsgUserSetPrivilege(data: NetMessage.MsgUserSetPrivilege.IS): void {
    if (data.userId === getSelfUserId()) {
        setSelfUserPrivilege(data.userPrivilege);
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
    (newSettings.isSetPathMode != null)             && (selfSettings.isSetPathMode = newSettings.isSetPathMode);
    (newSettings.isShowGridBorder != null)          && (selfSettings.isShowGridBorder = newSettings.isShowGridBorder);
    (newSettings.unitAndTileTextureVersion != null) && (selfSettings.unitAndTileTextureVersion = newSettings.unitAndTileTextureVersion);

    if (oldVersion !== getSelfSettingsTextureVersion()) {
        CommonModel.updateOnUnitAndTileTextureVersionChanged();
        Notify.dispatch(NotifyType.UnitAndTileTextureVersionChanged);
    }
    if (oldIsShowGridBorder !== getSelfSettingsIsShowGridBorder()) {
        Notify.dispatch(NotifyType.IsShowGridBorderChanged);
    }
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
