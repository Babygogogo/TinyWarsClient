
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
        const data = e.data as ProtoTypes.S_McwBeginTurn;
        if (!data.errorCode) {
            McwModel.updateOnBeginTurn(data);
        }
    }
}
