
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import NetManager           from "../../tools/network/NetManager";
// import TwnsNetMessageCodes  from "../../tools/network/NetMessageCodes";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import CommonModel          from "./CommonModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace CommonProxy {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import NetMessage       = CommonProto.NetMessage;
    import NetMessageCodes  = TwnsNetMessageCodes.NetMessageCodes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.MsgCommonHeartbeat,           callback: _onMsgCommonHeartbeat },
            { msgCode: NetMessageCodes.MsgCommonError,               callback: _onMsgCommonError, },
            { msgCode: NetMessageCodes.MsgCommonLatestConfigVersion, callback: _onMsgCommonLatestConfigVersion },
            { msgCode: NetMessageCodes.MsgCommonGetServerStatus,     callback: _onMsgCommonGetServerStatus, },
            { msgCode: NetMessageCodes.MsgCommonGetRankList,         callback: _onMsgCommonGetRankList },
        ], null);
    }

    export function reqCommonHeartbeat(counter: number): void {
        NetManager.send({
            MsgCommonHeartbeat: { c: {
                counter,
            } },
        });
    }
    function _onMsgCommonHeartbeat(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgCommonHeartbeat.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCommonHeartbeat, data);
        }
    }

    function _onMsgCommonError(e: egret.Event): void {
        const data = e.data as CommonProto.NetMessage.MsgCommonError.IS;
    }

    function _onMsgCommonLatestConfigVersion(e: egret.Event): void {
        const data      = e.data as CommonProto.NetMessage.MsgCommonLatestConfigVersion.IS;
        const version   = Helpers.getExisted(data.version);
        ConfigManager.setLatestFormalVersion(version);
        ConfigManager.loadConfig(version);

        // HACK: 处理多version导致游戏内报错的问题。当前的临时做法是事先加载所有配置，正确做法是在游戏内用到的时候才加载
        const versionPrefix = version[0];
        for (let versionNum = Number(version.substring(1)) - 1; versionNum >= 0; --versionNum) {
            ConfigManager.loadConfig(`${versionPrefix}${Helpers.getNumText(versionNum, 7)}`);
        }

        Notify.dispatch(NotifyType.MsgCommonLatestConfigVersion, data);
    }

    export function reqCommonGetServerStatus(): void {
        NetManager.send({ MsgCommonGetServerStatus: { c: {} }, });
    }
    function _onMsgCommonGetServerStatus(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCommonGetServerStatus.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCommonGetServerStatus, data);
        }
    }

    export function reqGetRankList(): void {
        NetManager.send({ MsgCommonGetRankList: { c: {} } });
    }
    function _onMsgCommonGetRankList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgCommonGetRankList.IS;
        if (!data.errorCode) {
            CommonModel.setMrwRankArray(data.mrwRankDataArray || []);
            Notify.dispatch(NotifyType.MsgCommonGetRankList, data);
        }
    }
}

// export default CommonProxy;
