
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
    import NetMessage   = ProtoTypes.NetMessage;

    export function init(): void {
        NetManager.addListeners([
            { msgCode: Codes.MsgMcwCommonBroadcastGameStart,    callback: _onMsgMcwCommonBroadcastGameStart     },
            { msgCode: Codes.MsgMcwCommonHandleBoot,            callback: _onMsgMcwCommonHandleBoot             },
            { msgCode: Codes.MsgMcwCommonContinueWar,           callback: _onMsgMcwCommonContinueWar            },
            { msgCode: Codes.MsgMcwCommonGetWarInfoList,        callback: _onMsgMcwCommonGetWarInfoList         },
            { msgCode: Codes.MsgMcwCommonSyncWar,               callback: _onMsgMcwCommonSyncWar,               },

            { msgCode: Codes.MsgMcwWatchGetUnwatchedWarInfos,   callback: _onMsgMcwWatchGetUnwatchedWarInfos    },
            { msgCode: Codes.MsgMcwWatchGetOngoingWarInfos,     callback: _onMsgMcwWatchGetOngoingWarInfos      },
            { msgCode: Codes.MsgMcwWatchGetRequestedWarInfos,   callback: _onMsgMcwWatchGetRequestedWarInfos    },
            { msgCode: Codes.MsgMcwWatchGetWatchedWarInfos,     callback: _onMsgMcwWatchGetWatchedWarInfos      },
            { msgCode: Codes.MsgMcwWatchMakeRequest,            callback: _onMsgMcwWatchMakeRequest             },
            { msgCode: Codes.MsgMcwWatchHandleRequest,          callback: _onMsgMcwWatchHandleRequest           },
            { msgCode: Codes.MsgMcwWatchDeleteWatcher,          callback: _onMsgMcwWatchDeleteWatcher           },
            { msgCode: Codes.MsgMcwWatchContinueWar,            callback: _onMsgMcwWatchContinueWar             },

            { msgCode: Codes.MsgMcwActionPlayerBeginTurn,       callback: _onMsgMcwActionPlayerBeginTurn        },
            { msgCode: Codes.MsgMcwActionPlayerDeleteUnit,      callback: _onMsgMcwActionPlayerDeleteUnit       },
            { msgCode: Codes.MsgMcwActionPlayerEndTurn,         callback: _onMsgMcwActionPlayerEndTurn          },
            { msgCode: Codes.MsgMcwActionPlayerProduceUnit,     callback: _onMsgMcwActionPlayerProduceUnit      },
            { msgCode: Codes.MsgMcwActionPlayerSurrender,       callback: _onMsgMcwActionPlayerSurrender        },
            { msgCode: Codes.MsgMcwActionPlayerVoteForDraw,     callback: _onMsgMcwActionPlayerVoteForDraw      },

            { msgCode: Codes.MsgMcwActionUnitAttackUnit,        callback: _onMsgMcwActionUnitAttackUnit         },
            { msgCode: Codes.MsgMcwActionUnitAttackTile,        callback: _onMsgMcwActionUnitAttackTile         },
            { msgCode: Codes.MsgMcwActionUnitBeLoaded,          callback: _onMsgMcwActionUnitBeLoaded           },
            { msgCode: Codes.MsgMcwActionUnitBuildTile,         callback: _onMsgMcwActionUnitBuildTile          },
            { msgCode: Codes.MsgMcwActionUnitCaptureTile,       callback: _onMsgMcwActionUnitCaptureTile        },
            { msgCode: Codes.MsgMcwActionUnitDive,              callback: _onMsgMcwActionUnitDive               },
            { msgCode: Codes.MsgMcwActionUnitDropUnit,          callback: _onMsgMcwActionUnitDropUnit           },
            { msgCode: Codes.MsgMcwActionUnitJoinUnit,          callback: _onMsgMcwActionUnitJoinUnit           },
            { msgCode: Codes.MsgMcwActionUnitLaunchFlare,       callback: _onMsgMcwActionUnitLaunchFlare        },
            { msgCode: Codes.MsgMcwActionUnitLaunchSilo,        callback: _onMsgMcwActionUnitLaunchSilo         },
            { msgCode: Codes.MsgMcwActionUnitLoadCo,            callback: _onMsgMcwActionUnitLoadCo             },
            { msgCode: Codes.MsgMcwActionUnitProduceUnit,       callback: _onMsgMcwActionUnitProduceUnit        },
            { msgCode: Codes.MsgMcwActionUnitSupplyUnit,        callback: _onMsgMcwActionUnitSupplyUnit         },
            { msgCode: Codes.MsgMcwActionUnitSurface,           callback: _onMsgMcwActionUnitSurface            },
            { msgCode: Codes.MsgMcwActionUnitUseCoSkill,        callback: _onMsgMcwActionUnitUseCoSkill         },
            { msgCode: Codes.MsgMcwActionUnitWait,              callback: _onMsgMcwActionUnitWait               },
        ], McwProxy);
    }

    function _onMsgMcwCommonBroadcastGameStart(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwCommonBroadcastGameStart.IS;
        Lang.getGameStartDesc(data).then(desc => {
            Common.CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0392),
                content : desc,
                callback: () => {
                    reqMcwCommonContinueWar(data.warId);
                },
            });
        });
    }

    export function reqMcwCommonContinueWar(warId: number): void {
        NetManager.send({
            MsgMcwCommonContinueWar: { c: {
                warId,
            }, },
        });
    }
    function _onMsgMcwCommonContinueWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwCommonContinueWar.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcwCommonContinueWarFailed, data);
        } else {
            Utility.FlowManager.gotoMultiCustomWar(data.war);
            Notify.dispatch(Notify.Type.MsgMcwCommonContinueWar, data);
        }
    }

    export function reqMcwCommonGetWarInfoList(): void {
        NetManager.send({
            MsgMcwCommonGetWarInfoList: { c: {} },
        });
    }
    function _onMsgMcwCommonGetWarInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwCommonGetWarInfoList.IS;
        McwModel.setOngoingWarInfoList(data.infos);
        Notify.dispatch(Notify.Type.MsgMcwCommonGetWarInfoList, data);
    }

    export function reqMcwCommonSyncWar(war: BwWar, requestType: Types.SyncWarRequestType): void {
        NetManager.send({
            MsgMcwCommonSyncWar: { c: {
                warId               : war.getWarId(),
                executedActionsCount: war.getExecutedActionsCount(),
                requestType,
            }, }
        });
    }
    function _onMsgMcwCommonSyncWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwCommonSyncWar.IS;
        if (!data.errorCode) {
            McwModel.updateOnPlayerSyncWar(data);
            Notify.dispatch(Notify.Type.MsgMcwCommonSyncWar);
        }
    }

    export function reqUnwatchedWarInfos(): void {
        NetManager.send({
            MsgMcwWatchGetUnwatchedWarInfos: { c: {
            } },
        });
    }
    function _onMsgMcwWatchGetUnwatchedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwWatchGetUnwatchedWarInfos.IS;
        if (!data.errorCode) {
            McwModel.setUnwatchedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMcwWatchGetUnwatchedWarInfos, data);
        }
    }

    export function reqWatchGetOngoingWarInfos(): void {
        NetManager.send({
            MsgMcwWatchGetOngoingWarInfos: { c: {
            } },
        })
    }
    function _onMsgMcwWatchGetOngoingWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwWatchGetOngoingWarInfos.IS;
        if (!data.errorCode) {
            McwModel.setWatchOngoingWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMcwWatchGetOngoingWarInfos, data);
        }
    }

    export function reqWatchRequestedWarInfos(): void {
        NetManager.send({
            MsgMcwWatchGetRequestedWarInfos: { c: {
            }, }
        });
    }
    function _onMsgMcwWatchGetRequestedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwWatchGetRequestedWarInfos.IS;
        if (!data.errorCode) {
            McwModel.setWatchRequestedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMcwWatchGetRequestedWarInfos, data);
        }
    }

    export function reqWatchedWarInfos(): void {
        NetManager.send({
            MsgMcwWatchGetWatchedWarInfos: { c: {
            }, }
        });
    }
    function _onMsgMcwWatchGetWatchedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwWatchGetWatchedWarInfos.IS;
        if (!data.errorCode) {
            McwModel.setWatchedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMcwWatchGetWatchedWarInfos, data);
        }
    }

    export function reqWatchMakeRequest(warId: number, dstUserIds: number[]): void {
        NetManager.send({
            MsgMcwWatchMakeRequest: { c: {
                warId,
                dstUserIds,
            }, }
        });
    }
    function _onMsgMcwWatchMakeRequest(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwWatchMakeRequest.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcwWatchMakeRequest, data);
        }
    }

    export function reqWatchHandleRequest(warId: number, acceptSrcUserIds: number[], declineSrcUserIds: number[]): void {
        NetManager.send({
            MsgMcwWatchHandleRequest: { c: {
                warId,
                acceptSrcUserIds,
                declineSrcUserIds,
            }, }
        });
    }
    function _onMsgMcwWatchHandleRequest(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwWatchHandleRequest.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcwWatchHandleRequest, data);
        }
    }

    export function reqWatchDeleteWatcher(warId: number, watcherUserIds: number[]): void {
        NetManager.send({
            MsgMcwWatchDeleteWatcher: { c: {
                warId,
                watcherUserIds,
            }, }
        });
    }
    function _onMsgMcwWatchDeleteWatcher(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwWatchDeleteWatcher.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcwWatchDeleteWatcher, data);
        }
    }

    export function reqWatchContinueWar(warId: number): void {
        NetManager.send({
            MsgMcwWatchContinueWar: { c: {
                warId,
            }, }
        });
    }
    function _onMsgMcwWatchContinueWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwWatchContinueWar.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcwWatchContinueWarFailed, data);
        } else {
            Notify.dispatch(Notify.Type.MsgMcwWatchContinueWar, data);
        }
    }

    export function reqMcwCommonHandleBoot(warId: number): void {
        NetManager.send({
            MsgMcwCommonHandleBoot: { c: {
                warId,
            }, },
        });
    }
    function _onMsgMcwCommonHandleBoot(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwCommonHandleBoot.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMcwCommonHandleBoot, data);
        }
    }

    export function reqMcwPlayerBeginTurn(war: BwWar): void {
        NetManager.send({
            MsgMcwActionPlayerBeginTurn: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
            }, }
        });
    }
    function _onMsgMcwActionPlayerBeginTurn(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionPlayerBeginTurn.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionPlayerBeginTurn, data);
        }
    }

    export function reqMcwPlayerDeleteUnit(war: BwWar, gridIndex: GridIndex): void {
        NetManager.send({
            MsgMcwActionPlayerDeleteUnit: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
                gridIndex,
            }, }
        });
    }
    function _onMsgMcwActionPlayerDeleteUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionPlayerDeleteUnit.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionPlayerDeleteUnit);
        }
    }

    export function reqMcwPlayerEndTurn(war: BwWar): void {
        NetManager.send({
            MsgMcwActionPlayerEndTurn: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
            }, }
        });
    }
    function _onMsgMcwActionPlayerEndTurn(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionPlayerEndTurn.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionPlayerEndTurn, data);
        }
    }

    export function reqMcwPlayerProduceUnit(war: BwWar, gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
        NetManager.send({
            MsgMcwActionPlayerProduceUnit: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
                gridIndex,
                unitType,
                unitHp,
            }, }
        });
    }
    function _onMsgMcwActionPlayerProduceUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionPlayerProduceUnit.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionPlayerProduceUnit);
        }
    }

    export function reqMcwPlayerSurrender(war: BwWar): void {
        NetManager.send({
            MsgMcwActionPlayerSurrender: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
                isBoot  : false,
            }, }
        })
    }
    function _onMsgMcwActionPlayerSurrender(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionPlayerSurrender.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionPlayerSurrender);
        }
    }

    export function reqMcwPlayerVoteForDraw(war: BwWar, isAgree: boolean): void {
        NetManager.send({
            MsgMcwActionPlayerVoteForDraw: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
                isAgree,
            }, }
        });
    }
    function _onMsgMcwActionPlayerVoteForDraw(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionPlayerVoteForDraw.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionPlayerVoteForDraw);
        }
    }

    export function reqMcwUnitAttack(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        NetManager.send({
            MsgMcwActionUnitAttackUnit: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
                targetGridIndex,
            }, }
        });
    }
    function _onMsgMcwActionUnitAttackUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitAttackUnit.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitAttackUnit);
        }
    }

    export function reqMcwUnitAttackTile(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        NetManager.send({
            MsgMcwActionUnitAttackTile: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
                targetGridIndex,
            }, }
        });
    }
    function _onMsgMcwActionUnitAttackTile(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitAttackTile.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitAttackTile);
        }
    }

    export function reqMcwUnitBeLoaded(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            MsgMcwActionUnitBeLoaded: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMcwActionUnitBeLoaded(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitBeLoaded.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitBeLoaded);
        }
    }

    export function reqMcwUnitBuildTile(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            MsgMcwActionUnitBuildTile: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMcwActionUnitBuildTile(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitBuildTile.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitBuildTile);
        }
    }

    export function reqMcwUnitCaptureTile(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            MsgMcwActionUnitCaptureTile: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMcwActionUnitCaptureTile(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitCaptureTile.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitCaptureTile);
        }
    }

    export function reqMcwUnitDive(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMcwActionUnitDive: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMcwActionUnitDive(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitDive.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitDive);
        }
    }

    export function reqMcwUnitDrop(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, dropDestinations: Types.DropDestination[]): void {
        NetManager.send({
            MsgMcwActionUnitDropUnit: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
                path,
                launchUnitId,
                dropDestinations,
            }, }
        });
    }
    function _onMsgMcwActionUnitDropUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitDropUnit.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitDropUnit);
        }
    }

    export function reqMcwUnitJoin(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMcwActionUnitJoinUnit: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMcwActionUnitJoinUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitJoinUnit.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitJoinUnit);
        }
    }

    export function reqMcwUnitLaunchFlare(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        NetManager.send({
            MsgMcwActionUnitLaunchFlare: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
                targetGridIndex,
            }, }
        });
    }
    function _onMsgMcwActionUnitLaunchFlare(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitLaunchFlare.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitLaunchFlare);
        }
    }

    export function reqMcwUnitLaunchSilo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        NetManager.send({
            MsgMcwActionUnitLaunchSilo: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
                targetGridIndex,
            }, }
        });
    }
    function _onMsgMcwActionUnitLaunchSilo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitLaunchSilo.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitLaunchSilo);
        }
    }

    export function reqMcwUnitLoadCo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMcwActionUnitLoadCo: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMcwActionUnitLoadCo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitLoadCo.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitLoadCo);
        }
    }

    export function reqMcwUnitProduceUnit(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMcwActionUnitProduceUnit: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMcwActionUnitProduceUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitProduceUnit.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitProduceUnit);
        }
    }

    export function reqMcwUnitSupply(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMcwActionUnitSupplyUnit: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMcwActionUnitSupplyUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitSupplyUnit.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitSupplyUnit);
        }
    }

    export function reqMcwUnitSurface(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMcwActionUnitSurface: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMcwActionUnitSurface(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitSurface.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitSurface);
        }
    }

    export function reqMcwUnitUseCoSkill(war: BwWar, skillType: Types.CoSkillType, path: GridIndex[], launchUnitId: number | null): void {
        NetManager.send({
            MsgMcwActionUnitUseCoSkill: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                skillType,
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMcwActionUnitUseCoSkill(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitUseCoSkill.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitUseCoSkill);
        }
    }

    export function reqMcwUnitWait(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            MsgMcwActionUnitWait: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMcwActionUnitWait(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMcwActionUnitWait.IS;
        if (!data.errorCode) {
            McwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMcwActionUnitWait, data);
        }
    }
}
