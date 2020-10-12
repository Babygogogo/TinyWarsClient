
namespace TinyWars.Time.TimeProxy {
    import Notify     = Utility.Notify;
    import NotifyType = Utility.Notify.Type;
    import ProtoTypes = Utility.ProtoTypes;
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgCommonHeartbeat, callback: _onMsgCommonHeartbeat },
        ], TimeProxy);
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
}
