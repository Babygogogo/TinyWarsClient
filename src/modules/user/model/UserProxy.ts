
namespace TinyWars.User.UserProxy {
    import NetManager       = Network.Manager;
    import NetMessageCodes  = Network.Codes;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import NotifyType       = Notify.Type;
    import NetMessage       = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgUserLogin,            callback: _onMsgUserLogin,              },
            { msgCode: NetMessageCodes.MsgUserRegister,         callback: _onMsgUserRegister,           },
            { msgCode: NetMessageCodes.MsgUserLogout,           callback: _onMsgUserLogout,             },
            { msgCode: NetMessageCodes.MsgUserGetPublicInfo,    callback: _onMsgUserGetPublicInfo,      },
            { msgCode: NetMessageCodes.MsgUserSetNickname,      callback: _onMsgUserSetNickname,        },
            { msgCode: NetMessageCodes.MsgUserSetDiscordId,     callback: _onMsgUserSetDiscordId,       },
            { msgCode: NetMessageCodes.MsgUserGetOnlineUsers,   callback: _onMsgUserGetOnlineUsers,     },
        ]);
    }

    export function reqLogin(account: string, rawPassword: string, isAutoRelogin: boolean): void {
        NetManager.send({
            MsgUserLogin: { c: {
                account,
                password    : Helpers.Sha1Generator.b64_sha1(rawPassword),
                isAutoRelogin,
            } },
        });
    }
    function _onMsgUserLogin(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserLogin.IS;
        if (!data.errorCode) {
            User.UserModel.updateOnLogin(data);
            Notify.dispatch(NotifyType.MsgUserLogin, data);
        }
    }

    export function reqUserRegister(account: string, rawPassword: string, nickname: string): void {
        NetManager.send({
            MsgUserRegister: { c: {
                account,
                password: Helpers.Sha1Generator.b64_sha1(rawPassword),
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
            Notify.dispatch(Notify.Type.MsgUserGetPublicInfoFailed, data);
        } else {
            UserModel.setUserPublicInfo(data.userPublicInfo);
            Notify.dispatch(Notify.Type.MsgUserGetPublicInfo, data);
        }
    }

    export function reqSetNickname(nickname: string): void {
        NetManager.send({
            MsgUserSetNickname: { c: {
                nickname,
            }, },
        });
    }
    function _onMsgUserSetNickname(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserSetNickname.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgUserSetNicknameFailed, data);
        } else {
            Notify.dispatch(Notify.Type.MsgUserSetNickname, data);
        }
    }

    export function reqSetDiscordId(discordId: string): void {
        NetManager.send({
            MsgUserSetDiscordId: { c: {
                discordId,
            }, },
        });
    }
    function _onMsgUserSetDiscordId(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserSetDiscordId.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgUserSetDiscordIdFailed, data);
        } else {
            Notify.dispatch(Notify.Type.MsgUserSetDiscordId, data);
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
            Notify.dispatch(Notify.Type.MsgUserGetOnlineUsers, data);
        }
    }
}
