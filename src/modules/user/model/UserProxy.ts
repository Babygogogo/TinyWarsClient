
// import Helpers              from "../../tools/helpers/Helpers";
// import Sha1Generator        from "../../tools/helpers/Sha1Generator";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import UserModel            from "../../user/model/UserModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.User.UserProxy {
    import NotifyType       = Twns.Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = Twns.Net.NetMessageCodes;

    export function init(): void {
        Twns.Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgUserLogin,                    callback: _onMsgUserLogin, },
            { msgCode: NetMessageCodes.MsgUserRegister,                 callback: _onMsgUserRegister, },
            { msgCode: NetMessageCodes.MsgUserLogout,                   callback: _onMsgUserLogout, },
            { msgCode: NetMessageCodes.MsgUserGetPublicInfo,            callback: _onMsgUserGetPublicInfo, },
            { msgCode: NetMessageCodes.MsgUserGetBriefInfo,             callback: _onMsgUserGetBriefInfo, },
            { msgCode: NetMessageCodes.MsgUserGetOnlineState,           callback: _onMsgUserGetOnlineState },
            { msgCode: NetMessageCodes.MsgUserSetNickname,              callback: _onMsgUserSetNickname, },
            { msgCode: NetMessageCodes.MsgUserSetDiscordId,             callback: _onMsgUserSetDiscordId, },
            { msgCode: NetMessageCodes.MsgUserGetOnlineUserIdArray,     callback: _onMsgUserGetOnlineUserIdArray, },
            { msgCode: NetMessageCodes.MsgUserSetPrivilege,             callback: _onMsgUserSetPrivilege, },
            { msgCode: NetMessageCodes.MsgUserSetPassword,              callback: _onMsgUserSetPassword, },
            { msgCode: NetMessageCodes.MsgUserSetSettings,              callback: _onMsgUserSetSettings, },
            { msgCode: NetMessageCodes.MsgUserSetMapRating,             callback: _onMsgUserSetMapRating },
            { msgCode: NetMessageCodes.MsgUserSetAvatarId,              callback: _onMsgUserSetAvatarId },
            { msgCode: NetMessageCodes.MsgUserSetMapEditorAutoSaveTime, callback: _onMsgUserSetMapEditorAutoSaveTime },
        ]);
    }

    export function reqLogin(account: string, rawPassword: string, isAutoRelogin: boolean): void {
        Twns.Net.NetManager.send({
            MsgUserLogin: { c: {
                account,
                password    : Sha1Generator.b64_sha1(rawPassword),
                isAutoRelogin,
            } },
        });
    }
    export function reqRawLogin(account: string, password: string): void {
        Twns.Net.NetManager.send({
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
            Twns.User.UserModel.updateOnMsgUserLogin(data);
            Twns.Notify.dispatch(NotifyType.MsgUserLogin, data);
        }
    }

    export function reqUserRegister(account: string, rawPassword: string, nickname: string): void {
        Twns.Net.NetManager.send({
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
            Twns.Notify.dispatch(NotifyType.MsgUserRegister, data);
        }
    }

    export function reqLogout(): void {
        Twns.Net.NetManager.send({
            MsgUserLogout: { c: {
            } },
        });
    }
    function _onMsgUserLogout(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserLogout.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgUserLogout, data);
        }
    }

    export function reqUserGetPublicInfo(userId: number): void {
        Twns.Net.NetManager.send({
            MsgUserGetPublicInfo: { c: {
                userId,
            } },
        });
    }
    function _onMsgUserGetPublicInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserGetPublicInfo.IS;
        if (!data.errorCode) {
            Twns.User.UserModel.setUserPublicInfo(Twns.Helpers.getExisted(data.userId), data.userPublicInfo ?? null);
            Twns.Notify.dispatch(NotifyType.MsgUserGetPublicInfo, data);
        }
    }

    export function reqUserGetBriefInfo(userId: number): void {
        Twns.Net.NetManager.send({
            MsgUserGetBriefInfo: { c: {
                userId,
            } },
        });
    }
    function _onMsgUserGetBriefInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserGetBriefInfo.IS;
        if (!data.errorCode) {
            Twns.User.UserModel.setUserBriefInfo(Twns.Helpers.getExisted(data.userId), data.userBriefInfo ?? null);
            Twns.Notify.dispatch(NotifyType.MsgUserGetBriefInfo, data);
        }
    }

    export function reqUserGetOnlineState(userId: number): void {
        Twns.Net.NetManager.send({
            MsgUserGetOnlineState: { c: {
                userId,
            } },
        });
    }
    function _onMsgUserGetOnlineState(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserGetOnlineState.IS;
        if (!data.errorCode) {
            Twns.User.UserModel.updateOnMsgUserGetOnlineState(data);
            Twns.Notify.dispatch(NotifyType.MsgUserGetOnlineState, data);
        }
    }

    export function reqSetNickname(nickname: string): void {
        Twns.Net.NetManager.send({
            MsgUserSetNickname: { c: {
                nickname,
            }, },
        });
    }
    async function _onMsgUserSetNickname(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgUserSetNickname.IS;
        if (data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgUserSetNicknameFailed, data);
        } else {
            Twns.User.UserModel.updateOnMsgUserSetNickname(data);
            Twns.Notify.dispatch(NotifyType.MsgUserSetNickname, data);
        }
    }

    export function reqSetDiscordId(discordId: string): void {
        Twns.Net.NetManager.send({
            MsgUserSetDiscordId: { c: {
                discordId,
            }, },
        });
    }
    async function _onMsgUserSetDiscordId(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgUserSetDiscordId.IS;
        if (data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgUserSetDiscordIdFailed, data);
        } else {
            Twns.User.UserModel.updateOnMsgUserSetDiscordId(data);
            Twns.Notify.dispatch(NotifyType.MsgUserSetDiscordId, data);
        }
    }

    export function reqUserGetOnlineUserIdArray(): void {
        Twns.Net.NetManager.send({
            MsgUserGetOnlineUserIdArray: { c: {} },
        });
    }
    function _onMsgUserGetOnlineUserIdArray(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserGetOnlineUserIdArray.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgUserGetOnlineUserIdArray, data);
        }
    }

    export function reqUserSetPrivilege(userId: number, userPrivilege: CommonProto.User.IUserPrivilege): void {
        Twns.Net.NetManager.send({ MsgUserSetPrivilege: { c: {
            userId,
            userPrivilege,
        } } });
    }
    async function _onMsgUserSetPrivilege(e: egret.Event): Promise<void> {
        const data = e.data as CommonProto.NetMessage.MsgUserSetPrivilege.IS;
        if (!data.errorCode) {
            Twns.User.UserModel.updateOnMsgUserSetPrivilege(data);
            Twns.Notify.dispatch(NotifyType.MsgUserSetPrivilege, data);
        }
    }

    export function reqUserSetPassword(oldRawPassword: string, newRawPassword: string): void {
        Twns.Net.NetManager.send({ MsgUserSetPassword: { c: {
            oldPassword : Sha1Generator.b64_sha1(oldRawPassword),
            newPassword : Sha1Generator.b64_sha1(newRawPassword),
        } } });
    }
    function _onMsgUserSetPassword(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgUserSetPassword.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgUserSetPassword, data);
        }
    }

    export function reqUserSetSettings(userSettings: CommonProto.User.IUserSettings): void {
        Twns.Net.NetManager.send({ MsgUserSetSettings: { c: {
            userSettings,
        } } });
    }
    function _onMsgUserSetSettings(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgUserSetSettings.IS;
        if (!data.errorCode) {
            Twns.User.UserModel.updateOnMsgUserSetSettings(data);
            Twns.Notify.dispatch(NotifyType.MsgUserSetSettings, data);
        }
    }

    export function reqUserSetMapRating(mapId: number, rating: number): void {
        Twns.Net.NetManager.send({ MsgUserSetMapRating: { c: {
            mapId,
            rating,
        } } });
    }
    function _onMsgUserSetMapRating(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgUserSetMapRating.IS;
        if (!data.errorCode) {
            Twns.User.UserModel.updateOnMsgUserSetMapRating(data);
            Twns.Notify.dispatch(NotifyType.MsgUserSetMapRating, data);
        }
    }

    export function reqSetAvatarId(avatarId: number): void {
        Twns.Net.NetManager.send({
            MsgUserSetAvatarId: { c: {
                avatarId,
            }, },
        });
    }
    async function _onMsgUserSetAvatarId(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgUserSetAvatarId.IS;
        if (data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgUserSetAvatarIdFailed, data);
        } else {
            Twns.User.UserModel.updateOnMsgUserSetAvatarId(data);
            Twns.Notify.dispatch(NotifyType.MsgUserSetAvatarId, data);
        }
    }

    export function reqSetMapEditorAutoSaveTime(time: number | null): void {
        Twns.Net.NetManager.send({
            MsgUserSetMapEditorAutoSaveTime: { c: {
                time,
            }, },
        });
    }
    async function _onMsgUserSetMapEditorAutoSaveTime(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgUserSetMapEditorAutoSaveTime.IS;
        if (data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgUserSetMapEditorAutoSaveTimeFailed, data);
        } else {
            Twns.User.UserModel.updateOnMsgUserSetMapEditorAutoSaveTime(data);
            Twns.Notify.dispatch(NotifyType.MsgUserSetMapEditorAutoSaveTime, data);
        }
    }
}

// export default UserProxy;
