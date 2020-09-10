
namespace TinyWars.User.UserProxy {
    import NetManager       = Network.Manager;
    import NetMessageCodes  = Network.Codes;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import NetMessage       = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.S_GetUserPublicInfo,     callback: _onSGetUserPublicInfo, },
            { msgCode: NetMessageCodes.S_UserChangeNickname,    callback: _onSUserChangeNickname, },
            { msgCode: NetMessageCodes.S_UserChangeDiscordId,   callback: _onSUserChangeDiscordId, },
            { msgCode: NetMessageCodes.S_UserGetOnlineUsers,    callback: _onSUserGetOnlineUsers, },
        ]);
    }

    export function reqGetUserPublicInfo(userId: number): void {
        NetManager.send({
            C_GetUserPublicInfo: {
                userId,
            },
        });
    }
    function _onSGetUserPublicInfo(e: egret.Event): void {
        const data = e.data as NetMessage.IS_GetUserPublicInfo;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SGetUserPublicInfoFailed, data);
        } else {
            UserModel.setUserPublicInfo(data);
            Notify.dispatch(Notify.Type.SGetUserPublicInfo, data);
        }
    }

    export function reqChangeNickname(nickname: string): void {
        NetManager.send({
            C_UserChangeNickname: {
                nickname,
            },
        });
    }
    function _onSUserChangeNickname(e: egret.Event): void {
        const data = e.data as NetMessage.IS_UserChangeNickname;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SUserChangeNicknameFailed, data);
        } else {
            Notify.dispatch(Notify.Type.SUserChangeNickname, data);
        }
    }

    export function reqChangeDiscordId(discordId: string): void {
        NetManager.send({
            C_UserChangeDiscordId: {
                discordId,
            },
        });
    }
    function _onSUserChangeDiscordId(e: egret.Event): void {
        const data = e.data as NetMessage.IS_UserChangeDiscordId;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.SUserChangeDiscordIdFailed, data);
        } else {
            Notify.dispatch(Notify.Type.SUserChangeDiscordId, data);
        }
    }

    export function reqUserGetOnlineUsers(): void {
        NetManager.send({
            C_UserGetOnlineUsers: {},
        });
    }
    function _onSUserGetOnlineUsers(e: egret.Event): void {
        const data = e.data as NetMessage.IS_UserGetOnlineUsers;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SUserGetOnlineUsers, data);
        }
    }
}
