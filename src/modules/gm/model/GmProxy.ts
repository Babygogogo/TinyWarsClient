
// import Helpers              from "../../tools/helpers/Helpers";
// import Sha1Generator        from "../../tools/helpers/Sha1Generator";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import UserModel            from "../../user/model/UserModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Gm.GmProxy {
    import NotifyType       = Notify.NotifyType;
    import NetMessageCodes  = Net.NetMessageCodes;

    export function init(): void {
        Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgGmSetUserPrivilege,               callback: _onMsgGmSetUserPrivilege, },
            { msgCode: NetMessageCodes.MsgGmDeleteSpmAllScoreAndReplay,     callback: _onMsgGmDeleteSpmAllScoreAndReplay },
        ]);
    }

    export function reqGmSetUserPrivilege(userId: number, userPrivilege: CommonProto.User.IUserPrivilege): void {
        Net.NetManager.send({ MsgGmSetUserPrivilege: { c: {
            userId,
            userPrivilege,
        } } });
    }
    async function _onMsgGmSetUserPrivilege(e: egret.Event): Promise<void> {
        const data = e.data as CommonProto.NetMessage.MsgGmSetUserPrivilege.IS;
        if (!data.errorCode) {
            User.UserModel.updateOnMsgGmSetUserPrivilege(data);
            Notify.dispatch(NotifyType.MsgGmSetUserPrivilege, data);
        }
    }

    export function reqGmDeleteSpmAllScoreAndReplay(): void {
        Net.NetManager.send({
            MsgGmDeleteSpmAllScoreAndReplay: { c: {
            } },
        });
    }
    function _onMsgGmDeleteSpmAllScoreAndReplay(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgGmDeleteSpmAllScoreAndReplay.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgGmDeleteSpmAllScoreAndReplay, data);
        }
    }
}

// export default UserProxy;
