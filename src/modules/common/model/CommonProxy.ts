
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import Twns.Notify       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import CommonModel          from "./CommonModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common.CommonProxy {
    import NotifyType       = Twns.Notify.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = Twns.Net.NetMessageCodes;

    export function init(): void {
        Twns.Net.NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgCommonHeartbeat,           callback: _onMsgCommonHeartbeat },
            { msgCode: NetMessageCodes.MsgCommonError,               callback: _onMsgCommonError, },
            { msgCode: NetMessageCodes.MsgCommonLatestConfigVersion, callback: _onMsgCommonLatestConfigVersion },
            { msgCode: NetMessageCodes.MsgCommonGetServerStatus,     callback: _onMsgCommonGetServerStatus, },
            { msgCode: NetMessageCodes.MsgCommonGetRankList,         callback: _onMsgCommonGetRankList },
        ], null);
    }

    export function reqCommonHeartbeat(counter: number): void {
        Twns.Net.NetManager.send({
            MsgCommonHeartbeat: { c: {
                counter,
            } },
        });
    }
    function _onMsgCommonHeartbeat(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgCommonHeartbeat.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgCommonHeartbeat, data);
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function _onMsgCommonError(e: egret.Event): void {
        // const data = e.data as CommonProto.NetMessage.MsgCommonError.IS;
    }

    function _onMsgCommonLatestConfigVersion(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgCommonLatestConfigVersion.IS;
        Twns.Config.ConfigManager.setLatestConfigVersion(Twns.Helpers.getExisted(data.version));

        Twns.Notify.dispatch(NotifyType.MsgCommonLatestConfigVersion, data);
    }

    export function reqCommonGetServerStatus(): void {
        Twns.Net.NetManager.send({ MsgCommonGetServerStatus: { c: {} }, });
    }
    function _onMsgCommonGetServerStatus(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCommonGetServerStatus.IS;
        if (!data.errorCode) {
            Twns.Notify.dispatch(NotifyType.MsgCommonGetServerStatus, data);
        }
    }

    export function reqGetRankList(): void {
        Twns.Net.NetManager.send({ MsgCommonGetRankList: { c: {} } });
    }
    function _onMsgCommonGetRankList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCommonGetRankList.IS;
        if (!data.errorCode) {
            Twns.Common.CommonModel.setMrwRankArray(data.mrwRankDataArray || []);
            Twns.Notify.dispatch(NotifyType.MsgCommonGetRankList, data);
        }
    }
}

// export default CommonProxy;
