
namespace TinyWars.MultiCustomWar.McwProxy {
    import NetManager       = Network.Manager;
    import NetMessageCodes  = Network.Codes;
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import GridIndex        = Types.GridIndex;

    export function init(): void {
        NetManager.addListeners([
            { actionCode: NetMessageCodes.S_McwBeginTurn,   callback: _onSMcwBeginTurn, },
            { actionCode: NetMessageCodes.S_McwEndTurn,     callback: _onSMcwEndTurn, },
            { actionCode: NetMessageCodes.S_McwUnitWait,    callback: _onSMcwUnitWait, },
        ], McwProxy);
    }

    export function reqMcwBeginTurn(war: McwWar): void {
        NetManager.send({
            C_McwBeginTurn: {
                warId   : war.getWarId(),
                actionId: war.getNextActionId(),
            },
        });
    }
    function _onSMcwBeginTurn(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwBeginTurn;
        if (!data.errorCode) {
            McwModel.updateOnBeginTurn(data);
            Notify.dispatch(Notify.Type.SMcwBeginTurn, data);
        }
    }

    export function reqMcwEndTurn(war: McwWar): void {
        NetManager.send({
            C_McwEndTurn: {
                warId   : war.getWarId(),
                actionId: war.getNextActionId(),
            },
        });
    }
    function _onSMcwEndTurn(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwEndTurn;
        if (!data.errorCode) {
            McwModel.updateOnEndTurn(data);
            Notify.dispatch(Notify.Type.SMcwEndTurn, data);
        }
    }

    export function reqMcwUnitWait(war: McwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            C_McwUnitWait: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
            },
        });
    }
    function _onSMcwUnitWait(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitWait;
        if (!data.errorCode) {
            McwModel.updateOnUnitWait(data);
            Notify.dispatch(Notify.Type.SMcwUnitWait, data);
        }
    }
}
