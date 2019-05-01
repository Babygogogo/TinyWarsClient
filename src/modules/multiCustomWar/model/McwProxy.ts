
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
            { actionCode: NetMessageCodes.S_McwPlayerBeginTurn,     callback: _onSMcwPlayerBeginTurn, },
            { actionCode: NetMessageCodes.S_McwPlayerEndTurn,       callback: _onSMcwPlayerEndTurn, },
            { actionCode: NetMessageCodes.S_McwPlayerSurrender,     callback: _onSMcwPlayerSurrender },
            { actionCode: NetMessageCodes.S_McwUnitAttack,          callback: _onSMcwUnitAttack },
            { actionCode: NetMessageCodes.S_McwUnitBeLoaded,        callback: _onSMcwUnitBeLoaded },
            { actionCode: NetMessageCodes.S_McwUnitCaptureTile,     callback: _onSMcwUnitCaptureTile },
            { actionCode: NetMessageCodes.S_McwUnitWait,            callback: _onSMcwUnitWait, },
        ], McwProxy);
    }

    export function reqMcwPlayerBeginTurn(war: McwWar): void {
        NetManager.send({
            C_McwPlayerBeginTurn: {
                warId   : war.getWarId(),
                actionId: war.getNextActionId(),
            },
        });
    }
    function _onSMcwPlayerBeginTurn(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwPlayerBeginTurn;
        if (!data.errorCode) {
            McwModel.updateOnBeginTurn(data);
            Notify.dispatch(Notify.Type.SMcwPlayerBeginTurn, data);
        }
    }

    export function reqMcwPlayerEndTurn(war: McwWar): void {
        NetManager.send({
            C_McwPlayerEndTurn: {
                warId   : war.getWarId(),
                actionId: war.getNextActionId(),
            },
        });
    }
    function _onSMcwPlayerEndTurn(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwPlayerEndTurn;
        if (!data.errorCode) {
            McwModel.updateOnEndTurn(data);
            Notify.dispatch(Notify.Type.SMcwPlayerEndTurn, data);
        }
    }

    export function reqMcwPlayerSurrender(war: McwWar): void {
        NetManager.send({
            C_McwPlayerSurrender: {
                warId   : war.getWarId(),
                actionId: war.getNextActionId(),
            },
        })
    }
    function _onSMcwPlayerSurrender(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwPlayerSurrender;
        if (!data.errorCode) {
            McwModel.updateOnPlayerSurrender(data);
            Notify.dispatch(Notify.Type.SMcwPlayerSurrender);
        }
    }

    export function reqMcwUnitAttack(war: McwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        NetManager.send({
            C_McwUnitAttack: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
                targetGridIndex,
            },
        });
    }
    function _onSMcwUnitAttack(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitAttack;
        if (!data.errorCode) {
            McwModel.updateOnUnitAttack(data);
            Notify.dispatch(Notify.Type.SMcwUnitAttack);
        }
    }

    export function reqMcwUnitBeLoaded(war: McwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            C_McwUnitBeLoaded: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
            },
        });
    }
    function _onSMcwUnitBeLoaded(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitBeLoaded;
        if (!data.errorCode) {
            McwModel.updateOnUnitBeLoaded(data);
            Notify.dispatch(Notify.Type.SMcwUnitBeLoaded);
        }
    }

    export function reqMcwUnitCaptureTile(war: McwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            C_McwUnitCaptureTile: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
            },
        });
    }
    function _onSMcwUnitCaptureTile(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitCaptureTile;
        if (!data.errorCode) {
            McwModel.updateOnUnitCaptureTile(data);
            Notify.dispatch(Notify.Type.SMcwUnitCaptureTile);
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
