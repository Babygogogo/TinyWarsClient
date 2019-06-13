
namespace TinyWars.MultiCustomWar.McwProxy {
    import NetManager       = Network.Manager;
    import NetMessageCodes  = Network.Codes;
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import GridIndex        = Types.GridIndex;
    import UnitType         = Types.UnitType;

    export function init(): void {
        NetManager.addListeners([
            { actionCode: NetMessageCodes.S_McwPlayerSyncWar,       callback: _onSMcwPlayerSyncWar, },
            { actionCode: NetMessageCodes.S_McwPlayerBeginTurn,     callback: _onSMcwPlayerBeginTurn, },
            { actionCode: NetMessageCodes.S_McwPlayerDeleteUnit,    callback: _onSMcwPlayerDeleteUnit },
            { actionCode: NetMessageCodes.S_McwPlayerEndTurn,       callback: _onSMcwPlayerEndTurn, },
            { actionCode: NetMessageCodes.S_McwPlayerProduceUnit,   callback: _onSMcwPlayerProduceUnit },
            { actionCode: NetMessageCodes.S_McwPlayerSurrender,     callback: _onSMcwPlayerSurrender },
            { actionCode: NetMessageCodes.S_McwPlayerVoteForDraw,   callback: _onSMcwPlayerVoteForDraw },
            { actionCode: NetMessageCodes.S_McwUnitAttack,          callback: _onSMcwUnitAttack },
            { actionCode: NetMessageCodes.S_McwUnitBeLoaded,        callback: _onSMcwUnitBeLoaded },
            { actionCode: NetMessageCodes.S_McwUnitBuildTile,       callback: _onSMcwUnitBuildTile },
            { actionCode: NetMessageCodes.S_McwUnitCaptureTile,     callback: _onSMcwUnitCaptureTile },
            { actionCode: NetMessageCodes.S_McwUnitDive,            callback: _onSMcwUnitDive },
            { actionCode: NetMessageCodes.S_McwUnitDrop,            callback: _onSMcwUnitDrop },
            { actionCode: NetMessageCodes.S_McwUnitJoin,            callback: _onSMcwUnitJoin },
            { actionCode: NetMessageCodes.S_McwUnitLaunchFlare,     callback: _onSMcwUnitLaunchFlare },
            { actionCode: NetMessageCodes.S_McwUnitLaunchSilo,      callback: _onSMcwUnitLaunchSilo },
            { actionCode: NetMessageCodes.S_McwUnitProduceUnit,     callback: _onSMcwUnitProduceUnit },
            { actionCode: NetMessageCodes.S_McwUnitSupply,          callback: _onSMcwUnitSupply },
            { actionCode: NetMessageCodes.S_McwUnitSurface,         callback: _onSMcwUnitSurface },
            { actionCode: NetMessageCodes.S_McwUnitWait,            callback: _onSMcwUnitWait },
        ], McwProxy);
    }

    export function reqMcwPlayerSyncWar(war: McwWar, requestType: Types.SyncWarRequestType): void {
        NetManager.send({
            C_McwPlayerSyncWar: {
                warId       : war.getWarId(),
                nextActionId: war.getNextActionId(),
                requestType,
            },
        });
    }
    function _onSMcwPlayerSyncWar(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwPlayerSyncWar;
        if (!data.errorCode) {
            McwModel.updateOnPlayerSyncWar(data);
            Notify.dispatch(Notify.Type.SMcwPlayerSyncWar);
        }
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
            McwModel.updateOnPlayerBeginTurn(data);
            Notify.dispatch(Notify.Type.SMcwPlayerBeginTurn, data);
        }
    }

    export function reqMcwPlayerDeleteUnit(war: McwWar, gridIndex: GridIndex): void {
        NetManager.send({
            C_McwPlayerDeleteUnit: {
                warId   : war.getWarId(),
                actionId: war.getNextActionId(),
                gridIndex,
            },
        });
    }
    function _onSMcwPlayerDeleteUnit(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwPlayerDeleteUnit;
        if (!data.errorCode) {
            McwModel.updateOnPlayerDeleteUnit(data);
            Notify.dispatch(Notify.Type.SMcwPlayerDeleteUnit);
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
            McwModel.updateOnPlayerEndTurn(data);
            Notify.dispatch(Notify.Type.SMcwPlayerEndTurn, data);
        }
    }

    export function reqMcwPlayerProduceUnit(war: McwWar, gridIndex: GridIndex, unitType: UnitType): void {
        NetManager.send({
            C_McwPlayerProduceUnit: {
                warId   : war.getWarId(),
                actionId: war.getNextActionId(),
                gridIndex,
                unitType,
            },
        });
    }
    function _onSMcwPlayerProduceUnit(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwPlayerProduceUnit;
        if (!data.errorCode) {
            McwModel.updateOnPlayerProduceUnit(data);
            Notify.dispatch(Notify.Type.SMcwPlayerProduceUnit);
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

    export function reqMcwPlayerVoteForDraw(war: McwWar, isAgree: boolean): void {
        NetManager.send({
            C_McwPlayerVoteForDraw: {
                warId   : war.getWarId(),
                actionId: war.getNextActionId(),
                isAgree,
            },
        });
    }
    function _onSMcwPlayerVoteForDraw(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwPlayerVoteForDraw;
        if (!data.errorCode) {
            McwModel.updateOnPlayerVoteForDraw(data);
            Notify.dispatch(Notify.Type.SMcwPlayerVoteForDraw);
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

    export function reqMcwUnitBuildTile(war: McwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            C_McwUnitBuildTile: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
            },
        });
    }
    function _onSMcwUnitBuildTile(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitBuildTile;
        if (!data.errorCode) {
            McwModel.updateOnUnitBuildTile(data);
            Notify.dispatch(Notify.Type.SMcwUnitBuildTile);
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

    export function reqMcwUnitDive(war: McwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            C_McwUnitDive: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
            },
        });
    }
    function _onSMcwUnitDive(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitDive;
        if (!data.errorCode) {
            McwModel.updateOnUnitDive(data);
            Notify.dispatch(Notify.Type.SMcwUnitDive);
        }
    }

    export function reqMcwUnitDrop(war: McwWar, path: GridIndex[], launchUnitId: number | undefined, dropDestinations: Types.DropDestination[]): void {
        NetManager.send({
            C_McwUnitDrop: {
                warId   : war.getWarId(),
                actionId: war.getNextActionId(),
                path,
                launchUnitId,
                dropDestinations,
            },
        });
    }
    function _onSMcwUnitDrop(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitDrop;
        if (!data.errorCode) {
            McwModel.updateOnUnitDrop(data);
            Notify.dispatch(Notify.Type.SMcwUnitDrop);
        }
    }

    export function reqMcwUnitJoin(war: McwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            C_McwUnitJoin: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
            },
        });
    }
    function _onSMcwUnitJoin(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitJoin;
        if (!data.errorCode) {
            McwModel.updateOnUnitJoin(data);
            Notify.dispatch(Notify.Type.SMcwUnitJoin);
        }
    }

    export function reqMcwUnitLaunchFlare(war: McwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        NetManager.send({
            C_McwUnitLaunchFlare: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
                targetGridIndex,
            },
        });
    }
    function _onSMcwUnitLaunchFlare(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitLaunchFlare;
        if (!data.errorCode) {
            McwModel.updateOnUnitLaunchFlare(data);
            Notify.dispatch(Notify.Type.SMcwUnitLaunchFlare);
        }
    }

    export function reqMcwUnitLaunchSilo(war: McwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        NetManager.send({
            C_McwUnitLaunchSilo: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
                targetGridIndex,
            },
        });
    }
    function _onSMcwUnitLaunchSilo(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitLaunchSilo;
        if (!data.errorCode) {
            McwModel.updateOnUnitLaunchSilo(data);
            Notify.dispatch(Notify.Type.SMcwUnitLaunchSilo);
        }
    }

    export function reqMcwUnitProduceUnit(war: McwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            C_McwUnitProduceUnit: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
            },
        });
    }
    function _onSMcwUnitProduceUnit(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitProduceUnit;
        if (!data.errorCode) {
            McwModel.updateOnUnitProduceUnit(data);
            Notify.dispatch(Notify.Type.SMcwUnitProduceUnit);
        }
    }

    export function reqMcwUnitSupply(war: McwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            C_McwUnitSupply: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
            },
        });
    }
    function _onSMcwUnitSupply(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitSupply;
        if (!data.errorCode) {
            McwModel.updateOnUnitSupply(data);
            Notify.dispatch(Notify.Type.SMcwUnitSupply);
        }
    }

    export function reqMcwUnitSurface(war: McwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            C_McwUnitSurface: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
            },
        });
    }
    function _onSMcwUnitSurface(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitSurface;
        if (!data.errorCode) {
            McwModel.updateOnUnitSurface(data);
            Notify.dispatch(Notify.Type.SMcwUnitSurface);
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
