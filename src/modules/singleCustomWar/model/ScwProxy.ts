
namespace TinyWars.SingleCustomWar.ScwProxy {
    import NetManager       = Network.Manager;
    import NetMessageCodes  = Network.Codes;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import Notify           = Utility.Notify;
    import GridIndex        = Types.GridIndex;
    import UnitType         = Types.UnitType;
    import BwWar            = BaseWar.BwWar;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: NetMessageCodes.S_McwPlayerBeginTurn,    callback: _onSMcwPlayerBeginTurn, },
            { msgCode: NetMessageCodes.S_McwPlayerDeleteUnit,   callback: _onSMcwPlayerDeleteUnit },
            { msgCode: NetMessageCodes.S_McwPlayerEndTurn,      callback: _onSMcwPlayerEndTurn, },
            { msgCode: NetMessageCodes.S_McwPlayerProduceUnit,  callback: _onSMcwPlayerProduceUnit },
            { msgCode: NetMessageCodes.S_McwPlayerSurrender,    callback: _onSMcwPlayerSurrender },
            { msgCode: NetMessageCodes.S_McwPlayerVoteForDraw,  callback: _onSMcwPlayerVoteForDraw },
            { msgCode: NetMessageCodes.S_McwUnitAttack,         callback: _onSMcwUnitAttack },
            { msgCode: NetMessageCodes.S_McwUnitBeLoaded,       callback: _onSMcwUnitBeLoaded },
            { msgCode: NetMessageCodes.S_McwUnitBuildTile,      callback: _onSMcwUnitBuildTile },
            { msgCode: NetMessageCodes.S_McwUnitCaptureTile,    callback: _onSMcwUnitCaptureTile },
            { msgCode: NetMessageCodes.S_McwUnitDive,           callback: _onSMcwUnitDive },
            { msgCode: NetMessageCodes.S_McwUnitDrop,           callback: _onSMcwUnitDrop },
            { msgCode: NetMessageCodes.S_McwUnitJoin,           callback: _onSMcwUnitJoin },
            { msgCode: NetMessageCodes.S_McwUnitLaunchFlare,    callback: _onSMcwUnitLaunchFlare },
            { msgCode: NetMessageCodes.S_McwUnitLaunchSilo,     callback: _onSMcwUnitLaunchSilo },
            { msgCode: NetMessageCodes.S_McwUnitLoadCo,         callback: _onSMcwUnitLoadCo },
            { msgCode: NetMessageCodes.S_McwUnitProduceUnit,    callback: _onSMcwUnitProduceUnit },
            { msgCode: NetMessageCodes.S_McwUnitSupply,         callback: _onSMcwUnitSupply },
            { msgCode: NetMessageCodes.S_McwUnitSurface,        callback: _onSMcwUnitSurface },
            { msgCode: NetMessageCodes.S_McwUnitUseCoSkill,     callback: _onSMcwUnitUseCoSkill },
            { msgCode: NetMessageCodes.S_McwUnitWait,           callback: _onSMcwUnitWait },
        ], ScwProxy);
    }

    export function reqScwPlayerBeginTurn(war: BwWar): void {
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
            ScwModel.updateOnPlayerBeginTurn(data);
            Notify.dispatch(Notify.Type.SMcwPlayerBeginTurn, data);
        }
    }

    export function reqScwPlayerDeleteUnit(war: BwWar, gridIndex: GridIndex): void {
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
            ScwModel.updateOnPlayerDeleteUnit(data);
            Notify.dispatch(Notify.Type.SMcwPlayerDeleteUnit);
        }
    }

    export function reqScwPlayerEndTurn(war: BwWar): void {
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
            ScwModel.updateOnPlayerEndTurn(data);
            Notify.dispatch(Notify.Type.SMcwPlayerEndTurn, data);
        }
    }

    export function reqScwPlayerProduceUnit(war: BwWar, gridIndex: GridIndex, unitType: UnitType): void {
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
            ScwModel.updateOnPlayerProduceUnit(data);
            Notify.dispatch(Notify.Type.SMcwPlayerProduceUnit);
        }
    }

    export function reqScwPlayerSurrender(war: BwWar): void {
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
            ScwModel.updateOnPlayerSurrender(data);
            Notify.dispatch(Notify.Type.SMcwPlayerSurrender);
        }
    }

    export function reqScwPlayerVoteForDraw(war: BwWar, isAgree: boolean): void {
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
            ScwModel.updateOnPlayerVoteForDraw(data);
            Notify.dispatch(Notify.Type.SMcwPlayerVoteForDraw);
        }
    }

    export function reqScwUnitAttack(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
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
            ScwModel.updateOnUnitAttack(data);
            Notify.dispatch(Notify.Type.SMcwUnitAttack);
        }
    }

    export function reqScwUnitBeLoaded(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
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
            ScwModel.updateOnUnitBeLoaded(data);
            Notify.dispatch(Notify.Type.SMcwUnitBeLoaded);
        }
    }

    export function reqScwUnitBuildTile(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
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
            ScwModel.updateOnUnitBuildTile(data);
            Notify.dispatch(Notify.Type.SMcwUnitBuildTile);
        }
    }

    export function reqScwUnitCaptureTile(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
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
            ScwModel.updateOnUnitCaptureTile(data);
            Notify.dispatch(Notify.Type.SMcwUnitCaptureTile);
        }
    }

    export function reqScwUnitDive(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
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
            ScwModel.updateOnUnitDive(data);
            Notify.dispatch(Notify.Type.SMcwUnitDive);
        }
    }

    export function reqScwUnitDrop(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, dropDestinations: Types.DropDestination[]): void {
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
            ScwModel.updateOnUnitDrop(data);
            Notify.dispatch(Notify.Type.SMcwUnitDrop);
        }
    }

    export function reqScwUnitJoin(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
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
            ScwModel.updateOnUnitJoin(data);
            Notify.dispatch(Notify.Type.SMcwUnitJoin);
        }
    }

    export function reqScwUnitLaunchFlare(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
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
            ScwModel.updateOnUnitLaunchFlare(data);
            Notify.dispatch(Notify.Type.SMcwUnitLaunchFlare);
        }
    }

    export function reqScwUnitLaunchSilo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
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
            ScwModel.updateOnUnitLaunchSilo(data);
            Notify.dispatch(Notify.Type.SMcwUnitLaunchSilo);
        }
    }

    export function reqScwUnitLoadCo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
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
            ScwModel.updateOnUnitLoadCo(data);
            Notify.dispatch(Notify.Type.SMcwUnitLoadCo);
        }
    }

    export function reqScwUnitProduceUnit(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
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
            ScwModel.updateOnUnitProduceUnit(data);
            Notify.dispatch(Notify.Type.SMcwUnitProduceUnit);
        }
    }

    export function reqScwUnitSupply(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
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
            ScwModel.updateOnUnitSupply(data);
            Notify.dispatch(Notify.Type.SMcwUnitSupply);
        }
    }

    export function reqScwUnitSurface(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
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
            ScwModel.updateOnUnitSurface(data);
            Notify.dispatch(Notify.Type.SMcwUnitSurface);
        }
    }

    export function reqScwUnitUseCoSkill(war: BwWar, skillType: Types.CoSkillType, path: GridIndex[], launchUnitId: number | null): void {
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
            ScwModel.updateOnUnitUseCoSkill(data);
            Notify.dispatch(Notify.Type.SMcwUnitUseCoSkill);
        }
    }

    export function reqScwUnitWait(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
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
            ScwModel.updateOnUnitWait(data);
            Notify.dispatch(Notify.Type.SMcwUnitWait, data);
        }
    }
}
