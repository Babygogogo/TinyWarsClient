
namespace TinyWars.Common.CommonProxy {
    import Notify           = Utility.Notify;
    import NotifyType       = Utility.Notify.Type;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetManager       = Network.NetManager;
    import ActionCode       = Network.Codes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgCommonHeartbeat,           callback: _onMsgCommonHeartbeat },
            { msgCode: ActionCode.MsgCommonError,               callback: _onMsgCommonError, },
            { msgCode: ActionCode.MsgCommonLatestConfigVersion, callback: _onMsgCommonLatestConfigVersion },
            { msgCode: ActionCode.MsgCommonGetServerStatus,     callback: _onMsgCommonGetServerStatus, },
            { msgCode: ActionCode.MsgCommonGetRankList,         callback: _onMsgCommonGetRankList },
        ], CommonProxy);
    }

    export function reqCommonHeartbeat(counter: number): void {
        NetManager.send({
            MsgCommonHeartbeat: { c: {
                counter,
            } },
        });
    }
    function _onMsgCommonHeartbeat(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgCommonHeartbeat.IS;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.MsgCommonHeartbeat, data);
        }
    }

    function _onMsgCommonError(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgCommonError.IS;
    }

    function _onMsgCommonLatestConfigVersion(e: egret.Event): void {
        const data      = e.data as ProtoTypes.NetMessage.MsgCommonLatestConfigVersion.IS;
        const version   = data.version;
        ConfigManager.setLatestFormalVersion(version);
        ConfigManager.loadConfig(version);
        Notify.dispatch(Notify.Type.MsgCommonLatestConfigVersion, data);
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
            CommonModel.setRankList(data.rankDataList);
            Notify.dispatch(Notify.Type.MsgCommonGetRankList, data);
        }
    }
}
