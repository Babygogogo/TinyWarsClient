
import { TwnsNetMessageCodes }  from "../../../utility/network/NetMessageCodes";
import { TwnsNotifyType }   from "../../../utility/notify/NotifyType";
import { Notify }           from "../../../utility/notify/Notify";
import { UserModel }        from "../../user/model/UserModel";
import { NetManager }       from "../../../utility/network/NetManager";
import { ProtoTypes }       from "../../../utility/proto/ProtoTypes";
import { Sha1Generator }    from "../../../utility/Sha1Generator";

export namespace UserProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgUserLogin,            callback: _onMsgUserLogin, },
            { msgCode: NetMessageCodes.MsgUserRegister,         callback: _onMsgUserRegister, },
            { msgCode: NetMessageCodes.MsgUserLogout,           callback: _onMsgUserLogout, },
            { msgCode: NetMessageCodes.MsgUserGetPublicInfo,    callback: _onMsgUserGetPublicInfo, },
            { msgCode: NetMessageCodes.MsgUserSetNickname,      callback: _onMsgUserSetNickname, },
            { msgCode: NetMessageCodes.MsgUserSetDiscordId,     callback: _onMsgUserSetDiscordId, },
            { msgCode: NetMessageCodes.MsgUserGetOnlineUsers,   callback: _onMsgUserGetOnlineUsers, },
            { msgCode: NetMessageCodes.MsgUserSetPrivilege,     callback: _onMsgUserSetPrivilege, },
            { msgCode: NetMessageCodes.MsgUserSetPassword,      callback: _onMsgUserSetPassword, },
            { msgCode: NetMessageCodes.MsgUserSetSettings,      callback: _onMsgUserSetSettings, },
        ]);
    }

    export function reqLogin(account: string, rawPassword: string, isAutoRelogin: boolean): void {
        NetManager.send({
            MsgUserLogin: { c: {
                account,
                password    : Sha1Generator.b64_sha1(rawPassword),
                isAutoRelogin,
            } },
        });
    }
    function _onMsgUserLogin(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserLogin.IS;
        if (!data.errorCode) {
            UserModel.updateOnMsgUserLogin(data);
            Notify.dispatch(NotifyType.MsgUserLogin, data);
        }
    }

    export function reqUserRegister(account: string, rawPassword: string, nickname: string): void {
        NetManager.send({
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
        NetManager.send({
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
        NetManager.send({
            MsgUserGetPublicInfo: { c: {
                userId,
            } },
        });
    }
    function _onMsgUserGetPublicInfo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserGetPublicInfo.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserGetPublicInfoFailed, data);
        } else {
            UserModel.setUserPublicInfo(data.userPublicInfo);
            Notify.dispatch(NotifyType.MsgUserGetPublicInfo, data);
        }
    }

    export function reqSetNickname(nickname: string): void {
        NetManager.send({
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
            await UserModel.updateOnMsgUserSetNickname(data);
            Notify.dispatch(NotifyType.MsgUserSetNickname, data);
        }
    }

    export function reqSetDiscordId(discordId: string): void {
        NetManager.send({
            MsgUserSetDiscordId: { c: {
                discordId,
            }, },
        });
    }
    async function _onMsgUserSetDiscordId(e: egret.Event): Promise<void> {
        const data = e.data as NetMessage.MsgUserSetDiscordId.IS;
        if (data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserSetDiscordIdFailed, data);
        } else {
            await UserModel.updateOnMsgUserSetDiscordId(data);
            Notify.dispatch(NotifyType.MsgUserSetDiscordId, data);
        }
    }

    export function reqUserGetOnlineUsers(): void {
        NetManager.send({
            MsgUserGetOnlineUsers: { c: {} },
        });
    }
    function _onMsgUserGetOnlineUsers(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserGetOnlineUsers.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserGetOnlineUsers, data);
        }
    }

    export function reqUserSetPrivilege(userId: number, userPrivilege: ProtoTypes.User.IUserPrivilege): void {
        NetManager.send({ MsgUserSetPrivilege: { c: {
            userId,
            userPrivilege,
        } } });
    }
    async function _onMsgUserSetPrivilege(e: egret.Event): Promise<void> {
        const data = e.data as ProtoTypes.NetMessage.MsgUserSetPrivilege.IS;
        if (!data.errorCode) {
            await UserModel.updateOnMsgUserSetPrivilege(data);
            Notify.dispatch(NotifyType.MsgUserSetPrivilege, data);
        }
    }

    export function reqUserSetPassword(oldRawPassword: string, newRawPassword: string): void {
        NetManager.send({ MsgUserSetPassword: { c: {
            oldPassword : Sha1Generator.b64_sha1(oldRawPassword),
            newPassword : Sha1Generator.b64_sha1(newRawPassword),
        } } });
    }
    function _onMsgUserSetPassword(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgUserSetPassword.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgUserSetPassword, data);
        }
    }

    export function reqUserSetSettings(userSettings: ProtoTypes.User.IUserSettings): void {
        NetManager.send({ MsgUserSetSettings: { c: {
            userSettings,
        } } });
    }
    function _onMsgUserSetSettings(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgUserSetSettings.IS;
        if (!data.errorCode) {
            UserModel.updateOnMsgUserSetSettings(data);
            Notify.dispatch(NotifyType.MsgUserSetSettings, data);
        }
    }
}
