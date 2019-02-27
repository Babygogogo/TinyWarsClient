
namespace TinyWars.MultiCustomWar.McwProxy {
    import NetManager       = Network.Manager;
    import NetMessageCodes  = Network.Codes;
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;

    export function init(): void {
        NetManager.addListeners([
            { actionCode: NetMessageCodes.S_McwBeginTurn,   callback: _onSMcwBeginTurn, },
            { actionCode: NetMessageCodes.S_McwEndTurn,     callback: _onSMcwEndTurn, },
        ], McwProxy);
    }

    export function reqMcwBeginTurn(warId: number): void {
        NetManager.send({
            C_McwBeginTurn: {
                warId,
            },
        });
    }
    function _onSMcwBeginTurn(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwBeginTurn;
        if (!data.errorCode) {
            McwModel.updateOnBeginTurn(data);
        }
    }

    export function reqMcwEndTurn(warId: number): void {
        NetManager.send({
            C_McwEndTurn: {
                warId,
            },
        });
    }
    function _onSMcwEndTurn(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwEndTurn;
        if (!data.errorCode) {
            McwModel.updateOnEndTurn(data);
        }
    }
}
