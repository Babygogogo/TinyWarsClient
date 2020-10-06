
namespace TinyWars.Common.CommonProxy {
    import Notify       = Utility.Notify;
    import NotifyType   = Utility.Notify.Type;
    import ProtoTypes   = Utility.ProtoTypes;
    import NetMessage   = ProtoTypes.NetMessage;
    import NetManager   = Network.Manager;
    import ActionCode   = Network.Codes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.S_CommonGetServerStatus,          callback: _onSCommonGetServerStatus,    },
            { msgCode: ActionCode.S_CommonRateMultiPlayerReplay,    callback: _onSCommonRateMultiPlayerReplay },
        ], CommonProxy);
    }

    export function reqCommonGetServerStatus(): void {
        NetManager.send({ C_CommonGetServerStatus: {}, });
    }
    function _onSCommonGetServerStatus(e: egret.Event): void {
        const data = e.data as NetMessage.IS_CommonGetServerStatus;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.SCommonGetServerStatus, data);
        }
    }

    export function reqCommonRateMultiPlayerReplay(replayId: number, rating: number): void {
        NetManager.send({
            C_CommonRateMultiPlayerReplay: {
                replayId,
                rating,
            },
        });
    }
    function _onSCommonRateMultiPlayerReplay(e: egret.Event): void {
        const data = e.data as NetMessage.IS_CommonRateMultiPlayerReplay;
        if (!data.errorCode) {
            Notify.dispatch(NotifyType.SCommonRateMultiPlayerReplay, data);
        }
    }
}
