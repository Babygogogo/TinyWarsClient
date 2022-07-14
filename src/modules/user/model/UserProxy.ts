
// import Helpers              from "../../tools/helpers/Helpers";
// import Sha1Generator        from "../../tools/helpers/Sha1Generator";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import UserModel            from "../../user/model/UserModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User.UserProxy {
    import NotifyType       = Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = Net.NetMessageCodes;

    export function init(): void {
        Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgUserLogin,                    callback: _onMsgUserLogin, },
            { msgCode: NetMessageCodes.MsgUserLoginAsGuest,             callback: _onMsgUserLoginAsGuest },
            { msgCode: NetMessageCodes.MsgUserRegister,                 callback: _onMsgUserRegister, },
            { msgCode: NetMessageCodes.MsgUserLogout,                   callback: _onMsgUserLogout, },
            { msgCode: NetMessageCodes.MsgUserGetPublicInfo,            callback: _onMsgUserGetPublicInfo, },
            { msgCode: NetMessageCodes.MsgUserGetBriefInfo,             callback: _onMsgUserGetBriefInfo, },
            { msgCode: NetMessageCodes.MsgUserGetOnlineState,           callback: _onMsgUserGetOnlineState },
            { msgCode: NetMessageCodes.MsgUserSetNickname,              callback: _onMsgUserSetNickname, },
            { msgCode: NetMessageCodes.MsgUserSetDiscordInfo,           callback: _onMsgUserSetDiscordInfo, },
            { msgCode: NetMessageCodes.MsgUserGetOnlineUserIdArray,     callback: _onMsgUserGetOnlineUserIdArray, },
            { msgCode: NetMessageCodes.MsgUserSetPassword,              callback: _onMsgUserSetPassword, },
            { msgCode: NetMessageCodes.MsgUserSetSettings,              callback: _onMsgUserSetSettings, },
            { msgCode: NetMessageCodes.MsgUserSetMapRating,             callback: _onMsgUserSetMapRating },
            { msgCode: NetMessageCodes.MsgUserSetAvatarId,              callback: _onMsgUserSetAvatarId },
            { msgCode: NetMessageCodes.MsgUserSetMapEditorAutoSaveTime, callback: _onMsgUserSetMapEditorAutoSaveTime },
            { msgCode: NetMessageCodes.MsgUserSetCoBgmSettings,         callback: _onMsgUserSetCoBgmSettings },
        ]);
    }

    export function reqLogin(account: string, rawPassword: string, isAutoRelogin: boolean): void {
        Net.NetManager.send({
            MsgUserLogin: { c: {
                account,
                password    : Sha1Generator.b64_sha1(rawPassword),
                isAutoRelogin,
            } },
        });
    }
    export function reqRawLogin(account: string, password: string): void {
        Net.NetManager.send({
            MsgUserLogin: { c: {
                account,
                password,
                isAutoRelogin   : false,
            } },
        });
    }
    function _onMsgUserLogin(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserLogin.IS;
        if (!data.errorCode) {
            User.UserModel.updateOnMsgUserLogin(data);
            Notify.dispatch(NotifyType.MsgUserLogin, data);
        }
    }

    export function reqUserLoginAsGuest(userId: number | null, isAutoRelogin: boolean): void {
        Net.NetManager.send({
            MsgUserLoginAsGuest: { c: {
                userId,
                isAutoRelogin,
            } },
        });
    }
    function _onMsgUserLoginAsGuest(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserLoginAsGuest.IS;
        if (!data.errorCode) {
            User.UserModel.updateOnMsgUserLoginAsGuest(data);
            Notify.dispatch(NotifyType.MsgUserLoginAsGuest, data);
        }
    }

    export function reqUserRegister(account: string, rawPassword: string, nickname: string): void {
        Net.NetManager.send({
            MsgUserRegister: { c: {
                account,
                password: Sha1Generator.b64_sha1(rawPassword),
                nickname,
            } },
        });
    }
    function _onMsgUserRegister(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserRegister.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserRegister, data);
        }
    }

    export function reqLogout(): void {
        Net.NetManager.send({
            MsgUserLogout: { c: {
            } },
        });
    }
    function _onMsgUserLogout(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserLogout.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserLogout, data);
        }
    }

    export function reqUserGetPublicInfo(userId: number): void {
        Net.NetManager.send({
            MsgUserGetPublicInfo: { c: {
                userId,
            } },
        });
    }
    function _onMsgUserGetPublicInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserGetPublicInfo.IS;
        if (!data.errorCode) {
            User.UserModel.setUserPublicInfo(Helpers.getExisted(data.userId), data.userPublicInfo ?? null);
            Notify.dispatch(NotifyType.MsgUserGetPublicInfo, data);
        }
    }

    export function reqUserGetBriefInfo(userId: number): void {
        Net.NetManager.send({
            MsgUserGetBriefInfo: { c: {
                userId,
            } },
        });
    }
    function _onMsgUserGetBriefInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserGetBriefInfo.IS;
        if (!data.errorCode) {
            User.UserModel.setUserBriefInfo(Helpers.getExisted(data.userId), data.userBriefInfo ?? null);
            Notify.dispatch(NotifyType.MsgUserGetBriefInfo, data);
        }
    }

    export function reqUserGetOnlineState(userId: number): void {
        Net.NetManager.send({
            MsgUserGetOnlineState: { c: {
                userId,
            } },
        });
    }
    function _onMsgUserGetOnlineState(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserGetOnlineState.IS;
        if (!data.errorCode) {
            User.UserModel.updateOnMsgUserGetOnlineState(data);
            Notify.dispatch(NotifyType.MsgUserGetOnlineState, data);
        }
    }

    export function reqSetNickname(nickname: string): void {
        Net.NetManager.send({
            MsgUserSetNickname: { c: {
                nickname,
            }, },
        });
    }
    async function _onMsgUserSetNickname(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgUserSetNickname.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserSetNicknameFailed, data);
        } else {
            User.UserModel.updateOnMsgUserSetNickname(data);
            Notify.dispatch(NotifyType.MsgUserSetNickname, data);
        }
    }

    export function reqSetDiscordInfo(discordInfo: CommonProto.User.IUserDiscordInfo): void {
        Net.NetManager.send({
            MsgUserSetDiscordInfo: { c: {
                discordInfo,
            }, },
        });
    }
    async function _onMsgUserSetDiscordInfo(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgUserSetDiscordInfo.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserSetDiscordInfoFailed, data);
        } else {
            User.UserModel.updateOnMsgUserSetDiscordInfo(data);
            Notify.dispatch(NotifyType.MsgUserSetDiscordInfo, data);
        }
    }

    export function reqUserGetOnlineUserIdArray(): void {
        Net.NetManager.send({
            MsgUserGetOnlineUserIdArray: { c: {} },
        });
    }
    function _onMsgUserGetOnlineUserIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserGetOnlineUserIdArray.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserGetOnlineUserIdArray, data);
        }
    }

    export function reqUserSetPassword(oldRawPassword: string, newRawPassword: string): void {
        Net.NetManager.send({ MsgUserSetPassword: { c: {
            oldPassword : Sha1Generator.b64_sha1(oldRawPassword),
            newPassword : Sha1Generator.b64_sha1(newRawPassword),
        } } });
    }
    function _onMsgUserSetPassword(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgUserSetPassword.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserSetPassword, data);
        }
    }

    export function reqUserSetSettings(userSettings: CommonProto.User.IUserSettings): void {
        Net.NetManager.send({ MsgUserSetSettings: { c: {
            userSettings,
        } } });
    }
    function _onMsgUserSetSettings(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgUserSetSettings.IS;
        if (!data.errorCode) {
            User.UserModel.updateOnMsgUserSetSettings(data);
            Notify.dispatch(NotifyType.MsgUserSetSettings, data);
        }
    }

    export function reqUserSetMapRating(mapId: number, rating: number): void {
        Net.NetManager.send({ MsgUserSetMapRating: { c: {
            mapId,
            rating,
        } } });
    }
    function _onMsgUserSetMapRating(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgUserSetMapRating.IS;
        if (!data.errorCode) {
            User.UserModel.updateOnMsgUserSetMapRating(data);
            Notify.dispatch(NotifyType.MsgUserSetMapRating, data);
        }
    }

    export function reqSetAvatarId(avatarId: number): void {
        Net.NetManager.send({
            MsgUserSetAvatarId: { c: {
                avatarId,
            }, },
        });
    }
    async function _onMsgUserSetAvatarId(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgUserSetAvatarId.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserSetAvatarIdFailed, data);
        } else {
            User.UserModel.updateOnMsgUserSetAvatarId(data);
            Notify.dispatch(NotifyType.MsgUserSetAvatarId, data);
        }
    }

    export function reqSetMapEditorAutoSaveTime(time: number | null): void {
        Net.NetManager.send({
            MsgUserSetMapEditorAutoSaveTime: { c: {
                time,
            }, },
        });
    }
    function _onMsgUserSetMapEditorAutoSaveTime(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserSetMapEditorAutoSaveTime.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserSetMapEditorAutoSaveTimeFailed, data);
        } else {
            User.UserModel.updateOnMsgUserSetMapEditorAutoSaveTime(data);
            Notify.dispatch(NotifyType.MsgUserSetMapEditorAutoSaveTime, data);
        }
    }

    export function reqUserSetCoBgmSettings(coCategoryId: number, bgmCodeArray: number[] | null): void {
        Net.NetManager.send({
            MsgUserSetCoBgmSettings: { c: {
                coCategoryId,
                bgmCodeArray,
            } }
        });
    }
    function _onMsgUserSetCoBgmSettings(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserSetCoBgmSettings.IS;
        if (!data.errorCode) {
            UserModel.updateOnMsgUserSetCoBgmSettings(data);
            Notify.dispatch(NotifyType.MsgUserSetCoBgmSettings, data);
        }
    }
}

// export default UserProxy;
