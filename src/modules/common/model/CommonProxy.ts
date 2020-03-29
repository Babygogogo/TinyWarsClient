
namespace TinyWars.Common.CommonProxy {
    import Notify     = Utility.Notify;
    import NotifyType = Utility.Notify.Type;
    import ProtoTypes = Utility.ProtoTypes;
    import NetManager = Network.Manager;
    import ActionCode = Network.Codes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.S_CommonGetServerStatus,    callback: _onSCommonGetServerStatus,    },
        ], CommonProxy);
    }

    export function reqCommonGetServerStatus(): void {
        NetManager.send({ C_CommonGetServerStatus: {}, });
    }
    function _onSCommonGetServerStatus(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_CommonGetServerStatus;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.SCommonGetServerStatus, data);
        }
    }
}
