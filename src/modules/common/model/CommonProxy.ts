
namespace TinyWars.Common.CommonProxy {
    import Notify           = Utility.Notify;
    import NotifyType       = Utility.Notify.Type;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import NetMessage       = ProtoTypes.NetMessage;
    import NetManager       = Network.Manager;
    import ActionCode       = Network.Codes;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: ActionCode.MsgCommonHeartbeat,               callback: _onMsgCommonHeartbeat             },
            { msgCode: ActionCode.MsgCommonError,                   callback: _onMsgCommonError,                },
            { msgCode: ActionCode.MsgCommonLatestConfigVersion,     callback: _onMsgCommonLatestConfigVersion   },
            { msgCode: ActionCode.S_CommonGetServerStatus,          callback: _onSCommonGetServerStatus,        },
            { msgCode: ActionCode.S_CommonRateMultiPlayerReplay,    callback: _onSCommonRateMultiPlayerReplay   },
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
        // TODO: show error messages.
    }

    function _onMsgCommonLatestConfigVersion(e: egret.Event): void {
        const data      = e.data as ProtoTypes.NetMessage.MsgCommonLatestConfigVersion.IS;
        const version   = data.version;
        ConfigManager.setLatestConfigVersion(version);
        ConfigManager.loadConfig(version);
        Notify.dispatch(Notify.Type.MsgCommonLatestConfigVersion, data);
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
