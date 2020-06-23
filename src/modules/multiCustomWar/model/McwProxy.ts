
namespace TinyWars.MultiCustomWar.McwProxy {
    import NetManager   = Network.Manager;
    import Codes        = Network.Codes;
    import Types        = Utility.Types;
    import ProtoTypes   = Utility.ProtoTypes;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import GridIndex    = Types.GridIndex;
    import UnitType     = Types.UnitType;
    import BwWar        = BaseWar.BwWar;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: Codes.S_McwCommonBroadcastGameStart, callback: _onSMcwCommonBroadcastGameStart },
            { msgCode: Codes.S_McwCommonHandleBoot,         callback: _onSMcwCommonHandleBoot },
            { msgCode: Codes.S_McwPlayerSyncWar,            callback: _onSMcwPlayerSyncWar, },
            { msgCode: Codes.S_McwPlayerBeginTurn,          callback: _onSMcwPlayerBeginTurn, },
            { msgCode: Codes.S_McwPlayerDeleteUnit,         callback: _onSMcwPlayerDeleteUnit },
            { msgCode: Codes.S_McwPlayerEndTurn,            callback: _onSMcwPlayerEndTurn, },
            { msgCode: Codes.S_McwPlayerProduceUnit,        callback: _onSMcwPlayerProduceUnit },
            { msgCode: Codes.S_McwPlayerSurrender,          callback: _onSMcwPlayerSurrender },
            { msgCode: Codes.S_McwPlayerVoteForDraw,        callback: _onSMcwPlayerVoteForDraw },
            { msgCode: Codes.S_McwUnitAttack,               callback: _onSMcwUnitAttack },
            { msgCode: Codes.S_McwUnitBeLoaded,             callback: _onSMcwUnitBeLoaded },
            { msgCode: Codes.S_McwUnitBuildTile,            callback: _onSMcwUnitBuildTile },
            { msgCode: Codes.S_McwUnitCaptureTile,          callback: _onSMcwUnitCaptureTile },
            { msgCode: Codes.S_McwUnitDive,                 callback: _onSMcwUnitDive },
            { msgCode: Codes.S_McwUnitDrop,                 callback: _onSMcwUnitDrop },
            { msgCode: Codes.S_McwUnitJoin,                 callback: _onSMcwUnitJoin },
            { msgCode: Codes.S_McwUnitLaunchFlare,          callback: _onSMcwUnitLaunchFlare },
            { msgCode: Codes.S_McwUnitLaunchSilo,           callback: _onSMcwUnitLaunchSilo },
            { msgCode: Codes.S_McwUnitLoadCo,               callback: _onSMcwUnitLoadCo },
            { msgCode: Codes.S_McwUnitProduceUnit,          callback: _onSMcwUnitProduceUnit },
            { msgCode: Codes.S_McwUnitSupply,               callback: _onSMcwUnitSupply },
            { msgCode: Codes.S_McwUnitSurface,              callback: _onSMcwUnitSurface },
            { msgCode: Codes.S_McwUnitUseCoSkill,           callback: _onSMcwUnitUseCoSkill },
            { msgCode: Codes.S_McwUnitWait,                 callback: _onSMcwUnitWait },
        ], McwProxy);
    }

    function _onSMcwCommonBroadcastGameStart(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwCommonBroadcastGameStart;
        Lang.getGameStartDesc(data).then(desc => {
            Common.CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0392),
                content : desc,
                callback: () => {
                    MultiCustomRoom.McrProxy.reqContinueWar(data.warId);
                },
            });
        });
    }

    export function reqMcwCommonHandleBoot(warId: number): void {
        NetManager.send({
            C_McwCommonHandleBoot: {
                warId,
            },
        });
    }
    function _onSMcwCommonHandleBoot(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwCommonHandleBoot;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.SMcwCommonHandleBoot, data);
        }
    }

    export function reqMcwPlayerSyncWar(war: BwWar, requestType: Types.SyncWarRequestType): void {
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

    export function reqMcwPlayerBeginTurn(war: BwWar): void {
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

    export function reqMcwPlayerDeleteUnit(war: BwWar, gridIndex: GridIndex): void {
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

    export function reqMcwPlayerEndTurn(war: BwWar): void {
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

    export function reqMcwPlayerProduceUnit(war: BwWar, gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
        NetManager.send({
            C_McwPlayerProduceUnit: {
                warId   : war.getWarId(),
                actionId: war.getNextActionId(),
                gridIndex,
                unitType,
                unitHp,
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

    export function reqMcwPlayerSurrender(war: BwWar): void {
        NetManager.send({
            C_McwPlayerSurrender: {
                warId   : war.getWarId(),
                actionId: war.getNextActionId(),
                isBoot  : false,
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

    export function reqMcwPlayerVoteForDraw(war: BwWar, isAgree: boolean): void {
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

    export function reqMcwUnitAttack(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
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

    export function reqMcwUnitBeLoaded(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
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

    export function reqMcwUnitBuildTile(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
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

    export function reqMcwUnitCaptureTile(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
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

    export function reqMcwUnitDive(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
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

    export function reqMcwUnitDrop(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, dropDestinations: Types.DropDestination[]): void {
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

    export function reqMcwUnitJoin(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
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

    export function reqMcwUnitLaunchFlare(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
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

    export function reqMcwUnitLaunchSilo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
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

    export function reqMcwUnitLoadCo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            C_McwUnitLoadCo: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                path,
                launchUnitId,
            },
        });
    }
    function _onSMcwUnitLoadCo(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitLoadCo;
        if (!data.errorCode) {
            McwModel.updateOnUnitLoadCo(data);
            Notify.dispatch(Notify.Type.SMcwUnitLoadCo);
        }
    }

    export function reqMcwUnitProduceUnit(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
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

    export function reqMcwUnitSupply(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
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

    export function reqMcwUnitSurface(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
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

    export function reqMcwUnitUseCoSkill(war: BwWar, skillType: Types.CoSkillType, path: GridIndex[], launchUnitId: number | null): void {
        NetManager.send({
            C_McwUnitUseCoSkill: {
                warId       : war.getWarId(),
                actionId    : war.getNextActionId(),
                skillType,
                path,
                launchUnitId,
            },
        });
    }
    function _onSMcwUnitUseCoSkill(e: egret.Event): void {
        const data = e.data as ProtoTypes.IS_McwUnitUseCoSkill;
        if (!data.errorCode) {
            McwModel.updateOnUnitUseCoSkill(data);
            Notify.dispatch(Notify.Type.SMcwUnitUseCoSkill);
        }
    }

    export function reqMcwUnitWait(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
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
