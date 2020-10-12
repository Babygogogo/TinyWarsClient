
namespace TinyWars.User.UserProxy {
    import NetManager       = Network.Manager;
    import NetMessageCodes  = Network.Codes;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import NotifyType       = Notify.Type;
    import NetMessage       = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgUserLogin,            callback: _onMsgUserLogin,              },
            { msgCode: NetMessageCodes.MsgUserRegister,         callback: _onMsgUserRegister,           },
            { msgCode: NetMessageCodes.MsgUserLogout,           callback: _onMsgUserLogout,             },
            { msgCode: NetMessageCodes.MsgUserGetPublicInfo,    callback: _onMsgUserGetPublicInfo,      },
            { msgCode: NetMessageCodes.MsgUserChangeNickname,   callback: _onMsgUserChangeNickname,     },
            { msgCode: NetMessageCodes.MsgUserChangeDiscordId,  callback: _onMsgUserChangeDiscordId,    },
            { msgCode: NetMessageCodes.MsgUserGetOnlineUsers,   callback: _onMsgUserGetOnlineUsers,     },
        ]);
    }

    export function reqLogin(account: string, password: string, isAutoRelogin: boolean): void {
        NetManager.send({
            MsgUserLogin: { c: {
                account,
                password,
                isAutoRelogin,
            } },
        });
    }
    function _onMsgUserLogin(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserLogin.IS;
        if (!data.errorCode) {
            User.UserModel.updateOnLogin(data);
            Notify.dispatch(NotifyType.SLogin, data);
        }
    }

    export function reqUserRegister(account: string, password: string, nickname: string): void {
        NetManager.send({
            MsgUserRegister: { c: {
                account,
                password,
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
            Notify.dispatch(NotifyType.SLogout, data);
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

    export function reqChangeNickname(nickname: string): void {
        NetManager.send({
            MsgUserChangeNickname: { c: {
                nickname,
            }, },
        });
    }
    function _onMsgUserChangeNickname(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserChangeNickname.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgUserChangeNicknameFailed, data);
        } else {
            Notify.dispatch(Notify.Type.MsgUserChangeNickname, data);
        }
    }

    export function reqChangeDiscordId(discordId: string): void {
        NetManager.send({
            MsgUserChangeDiscordId: { c: {
                discordId,
            }, },
        });
    }
    function _onMsgUserChangeDiscordId(e: egret.Event): void {
        const data = e.data as NetMessage.MsgUserChangeDiscordId.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgUserChangeDiscordIdFailed, data);
        } else {
            Notify.dispatch(Notify.Type.MsgUserChangeDiscordId, data);
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
            Notify.dispatch(Notify.Type.SUserGetOnlineUsers, data);
        }
    }
}
