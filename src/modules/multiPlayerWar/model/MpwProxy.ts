
namespace TinyWars.MultiPlayerWar.MpwProxy {
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
            { msgCode: Codes.MsgMpwCommonBroadcastGameStart,    callback: _onMsgMpwCommonBroadcastGameStart     },
            { msgCode: Codes.MsgMpwCommonHandleBoot,            callback: _onMsgMpwCommonHandleBoot             },
            { msgCode: Codes.MsgMpwCommonContinueWar,           callback: _onMsgMpwCommonContinueWar            },
            { msgCode: Codes.MsgMpwCommonGetMyWarInfoList,      callback: _onMsgMpwCommonGetMyWarInfoList       },
            { msgCode: Codes.MsgMpwCommonSyncWar,               callback: _onMsgMpwCommonSyncWar,               },

            { msgCode: Codes.MsgMpwWatchGetUnwatchedWarInfos,   callback: _onMsgMpwWatchGetUnwatchedWarInfos    },
            { msgCode: Codes.MsgMpwWatchGetOngoingWarInfos,     callback: _onMsgMpwWatchGetOngoingWarInfos      },
            { msgCode: Codes.MsgMpwWatchGetRequestedWarInfos,   callback: _onMsgMpwWatchGetRequestedWarInfos    },
            { msgCode: Codes.MsgMpwWatchGetWatchedWarInfos,     callback: _onMsgMpwWatchGetWatchedWarInfos      },
            { msgCode: Codes.MsgMpwWatchMakeRequest,            callback: _onMsgMpwWatchMakeRequest             },
            { msgCode: Codes.MsgMpwWatchHandleRequest,          callback: _onMsgMpwWatchHandleRequest           },
            { msgCode: Codes.MsgMpwWatchDeleteWatcher,          callback: _onMsgMpwWatchDeleteWatcher           },
            { msgCode: Codes.MsgMpwWatchContinueWar,            callback: _onMsgMpwWatchContinueWar             },

            { msgCode: Codes.MsgMpwActionPlayerBeginTurn,       callback: _onMsgMpwActionPlayerBeginTurn        },
            { msgCode: Codes.MsgMpwActionPlayerDeleteUnit,      callback: _onMsgMpwActionPlayerDeleteUnit       },
            { msgCode: Codes.MsgMpwActionPlayerEndTurn,         callback: _onMsgMpwActionPlayerEndTurn          },
            { msgCode: Codes.MsgMpwActionPlayerProduceUnit,     callback: _onMsgMpwActionPlayerProduceUnit      },
            { msgCode: Codes.MsgMpwActionPlayerSurrender,       callback: _onMsgMpwActionPlayerSurrender        },
            { msgCode: Codes.MsgMpwActionPlayerVoteForDraw,     callback: _onMsgMpwActionPlayerVoteForDraw      },

            { msgCode: Codes.MsgMpwActionUnitAttackUnit,        callback: _onMsgMpwActionUnitAttackUnit         },
            { msgCode: Codes.MsgMpwActionUnitAttackTile,        callback: _onMsgMpwActionUnitAttackTile         },
            { msgCode: Codes.MsgMpwActionUnitBeLoaded,          callback: _onMsgMpwActionUnitBeLoaded           },
            { msgCode: Codes.MsgMpwActionUnitBuildTile,         callback: _onMsgMpwActionUnitBuildTile          },
            { msgCode: Codes.MsgMpwActionUnitCaptureTile,       callback: _onMsgMpwActionUnitCaptureTile        },
            { msgCode: Codes.MsgMpwActionUnitDive,              callback: _onMsgMpwActionUnitDive               },
            { msgCode: Codes.MsgMpwActionUnitDropUnit,          callback: _onMsgMpwActionUnitDropUnit           },
            { msgCode: Codes.MsgMpwActionUnitJoinUnit,          callback: _onMsgMpwActionUnitJoinUnit           },
            { msgCode: Codes.MsgMpwActionUnitLaunchFlare,       callback: _onMsgMpwActionUnitLaunchFlare        },
            { msgCode: Codes.MsgMpwActionUnitLaunchSilo,        callback: _onMsgMpwActionUnitLaunchSilo         },
            { msgCode: Codes.MsgMpwActionUnitLoadCo,            callback: _onMsgMpwActionUnitLoadCo             },
            { msgCode: Codes.MsgMpwActionUnitProduceUnit,       callback: _onMsgMpwActionUnitProduceUnit        },
            { msgCode: Codes.MsgMpwActionUnitSupplyUnit,        callback: _onMsgMpwActionUnitSupplyUnit         },
            { msgCode: Codes.MsgMpwActionUnitSurface,           callback: _onMsgMpwActionUnitSurface            },
            { msgCode: Codes.MsgMpwActionUnitUseCoSkill,        callback: _onMsgMpwActionUnitUseCoSkill         },
            { msgCode: Codes.MsgMpwActionUnitWait,              callback: _onMsgMpwActionUnitWait               },
        ], MpwProxy);
    }

    function _onMsgMpwCommonBroadcastGameStart(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonBroadcastGameStart.IS;
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
            MsgMpwCommonContinueWar: { c: {
                warId,
            }, },
        });
    }
    function _onMsgMpwCommonContinueWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonContinueWar.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMpwCommonContinueWarFailed, data);
        } else {
            Notify.dispatch(Notify.Type.MsgMpwCommonContinueWar, data);
        }
    }

    export function reqMpwCommonGetMyWarInfoList(): void {
        NetManager.send({
            MsgMpwCommonGetMyWarInfoList: { c: {} },
        });
    }
    function _onMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonGetMyWarInfoList.IS;
        MpwModel.setAllMyWarInfoList(data.infos);
        Notify.dispatch(Notify.Type.MsgMpwCommonGetMyWarInfoList, data);
    }

    export function reqMcwCommonSyncWar(war: BwWar, requestType: Types.SyncWarRequestType): void {
        NetManager.send({
            MsgMpwCommonSyncWar: { c: {
                warId               : war.getWarId(),
                executedActionsCount: war.getExecutedActionsCount(),
                requestType,
            }, }
        });
    }
    function _onMsgMpwCommonSyncWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonSyncWar.IS;
        if (!data.errorCode) {
            MpwModel.updateOnPlayerSyncWar(data);
            Notify.dispatch(Notify.Type.MsgMpwCommonSyncWar);
        }
    }

    export function reqUnwatchedWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetUnwatchedWarInfos: { c: {
            } },
        });
    }
    function _onMsgMpwWatchGetUnwatchedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetUnwatchedWarInfos.IS;
        if (!data.errorCode) {
            MpwModel.setUnwatchedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMpwWatchGetUnwatchedWarInfos, data);
        }
    }

    export function reqWatchGetOngoingWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetOngoingWarInfos: { c: {
            } },
        })
    }
    function _onMsgMpwWatchGetOngoingWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetOngoingWarInfos.IS;
        if (!data.errorCode) {
            MpwModel.setWatchOngoingWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMpwWatchGetOngoingWarInfos, data);
        }
    }

    export function reqWatchRequestedWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetRequestedWarInfos: { c: {
            }, }
        });
    }
    function _onMsgMpwWatchGetRequestedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetRequestedWarInfos.IS;
        if (!data.errorCode) {
            MpwModel.setWatchRequestedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMpwWatchGetRequestedWarInfos, data);
        }
    }

    export function reqWatchedWarInfos(): void {
        NetManager.send({
            MsgMpwWatchGetWatchedWarInfos: { c: {
            }, }
        });
    }
    function _onMsgMpwWatchGetWatchedWarInfos(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchGetWatchedWarInfos.IS;
        if (!data.errorCode) {
            MpwModel.setWatchedWarInfos(data.infos);
            Notify.dispatch(Notify.Type.MsgMpwWatchGetWatchedWarInfos, data);
        }
    }

    export function reqWatchMakeRequest(warId: number, dstUserIds: number[]): void {
        NetManager.send({
            MsgMpwWatchMakeRequest: { c: {
                warId,
                dstUserIds,
            }, }
        });
    }
    function _onMsgMpwWatchMakeRequest(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchMakeRequest.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMpwWatchMakeRequest, data);
        }
    }

    export function reqWatchHandleRequest(warId: number, acceptSrcUserIds: number[], declineSrcUserIds: number[]): void {
        NetManager.send({
            MsgMpwWatchHandleRequest: { c: {
                warId,
                acceptSrcUserIds,
                declineSrcUserIds,
            }, }
        });
    }
    function _onMsgMpwWatchHandleRequest(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchHandleRequest.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMpwWatchHandleRequest, data);
        }
    }

    export function reqWatchDeleteWatcher(warId: number, watcherUserIds: number[]): void {
        NetManager.send({
            MsgMpwWatchDeleteWatcher: { c: {
                warId,
                watcherUserIds,
            }, }
        });
    }
    function _onMsgMpwWatchDeleteWatcher(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchDeleteWatcher.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMpwWatchDeleteWatcher, data);
        }
    }

    export function reqWatchContinueWar(warId: number): void {
        NetManager.send({
            MsgMpwWatchContinueWar: { c: {
                warId,
            }, }
        });
    }
    function _onMsgMpwWatchContinueWar(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwWatchContinueWar.IS;
        if (data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMpwWatchContinueWarFailed, data);
        } else {
            Notify.dispatch(Notify.Type.MsgMpwWatchContinueWar, data);
        }
    }

    export function reqMcwCommonHandleBoot(warId: number): void {
        NetManager.send({
            MsgMpwCommonHandleBoot: { c: {
                warId,
            }, },
        });
    }
    function _onMsgMpwCommonHandleBoot(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwCommonHandleBoot.IS;
        if (!data.errorCode) {
            Notify.dispatch(Notify.Type.MsgMpwCommonHandleBoot, data);
        }
    }

    export function reqMcwPlayerBeginTurn(war: BwWar): void {
        NetManager.send({
            MsgMpwActionPlayerBeginTurn: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
            }, }
        });
    }
    function _onMsgMpwActionPlayerBeginTurn(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionPlayerBeginTurn.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionPlayerBeginTurn, data);
        }
    }

    export function reqMcwPlayerDeleteUnit(war: BwWar, gridIndex: GridIndex): void {
        NetManager.send({
            MsgMpwActionPlayerDeleteUnit: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
                gridIndex,
            }, }
        });
    }
    function _onMsgMpwActionPlayerDeleteUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionPlayerDeleteUnit.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionPlayerDeleteUnit);
        }
    }

    export function reqMcwPlayerEndTurn(war: BwWar): void {
        NetManager.send({
            MsgMpwActionPlayerEndTurn: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
            }, }
        });
    }
    function _onMsgMpwActionPlayerEndTurn(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionPlayerEndTurn.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionPlayerEndTurn, data);
        }
    }

    export function reqMcwPlayerProduceUnit(war: BwWar, gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
        NetManager.send({
            MsgMpwActionPlayerProduceUnit: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
                gridIndex,
                unitType,
                unitHp,
            }, }
        });
    }
    function _onMsgMpwActionPlayerProduceUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionPlayerProduceUnit.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionPlayerProduceUnit);
        }
    }

    export function reqMcwPlayerSurrender(war: BwWar): void {
        NetManager.send({
            MsgMpwActionPlayerSurrender: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
                isBoot  : false,
            }, }
        })
    }
    function _onMsgMpwActionPlayerSurrender(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionPlayerSurrender.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionPlayerSurrender);
        }
    }

    export function reqMcwPlayerVoteForDraw(war: BwWar, isAgree: boolean): void {
        NetManager.send({
            MsgMpwActionPlayerVoteForDraw: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
                isAgree,
            }, }
        });
    }
    function _onMsgMpwActionPlayerVoteForDraw(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionPlayerVoteForDraw.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionPlayerVoteForDraw);
        }
    }

    export function reqMcwUnitAttack(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        NetManager.send({
            MsgMpwActionUnitAttackUnit: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
                targetGridIndex,
            }, }
        });
    }
    function _onMsgMpwActionUnitAttackUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitAttackUnit.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitAttackUnit);
        }
    }

    export function reqMcwUnitAttackTile(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        NetManager.send({
            MsgMpwActionUnitAttackTile: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
                targetGridIndex,
            }, }
        });
    }
    function _onMsgMpwActionUnitAttackTile(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitAttackTile.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitAttackTile);
        }
    }

    export function reqMcwUnitBeLoaded(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            MsgMpwActionUnitBeLoaded: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMpwActionUnitBeLoaded(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitBeLoaded.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitBeLoaded);
        }
    }

    export function reqMcwUnitBuildTile(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            MsgMpwActionUnitBuildTile: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMpwActionUnitBuildTile(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitBuildTile.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitBuildTile);
        }
    }

    export function reqMcwUnitCaptureTile(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            MsgMpwActionUnitCaptureTile: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMpwActionUnitCaptureTile(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitCaptureTile.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitCaptureTile);
        }
    }

    export function reqMcwUnitDive(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMpwActionUnitDive: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMpwActionUnitDive(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitDive.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitDive);
        }
    }

    export function reqMcwUnitDrop(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, dropDestinations: Types.DropDestination[]): void {
        NetManager.send({
            MsgMpwActionUnitDropUnit: { c: {
                warId   : war.getWarId(),
                actionId: war.getExecutedActionsCount(),
                path,
                launchUnitId,
                dropDestinations,
            }, }
        });
    }
    function _onMsgMpwActionUnitDropUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitDropUnit.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitDropUnit);
        }
    }

    export function reqMcwUnitJoin(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMpwActionUnitJoinUnit: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMpwActionUnitJoinUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitJoinUnit.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitJoinUnit);
        }
    }

    export function reqMcwUnitLaunchFlare(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        NetManager.send({
            MsgMpwActionUnitLaunchFlare: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
                targetGridIndex,
            }, }
        });
    }
    function _onMsgMpwActionUnitLaunchFlare(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitLaunchFlare.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitLaunchFlare);
        }
    }

    export function reqMcwUnitLaunchSilo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        NetManager.send({
            MsgMpwActionUnitLaunchSilo: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
                targetGridIndex,
            }, }
        });
    }
    function _onMsgMpwActionUnitLaunchSilo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitLaunchSilo.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitLaunchSilo);
        }
    }

    export function reqMcwUnitLoadCo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMpwActionUnitLoadCo: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMpwActionUnitLoadCo(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitLoadCo.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitLoadCo);
        }
    }

    export function reqMcwUnitProduceUnit(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMpwActionUnitProduceUnit: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMpwActionUnitProduceUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitProduceUnit.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitProduceUnit);
        }
    }

    export function reqMcwUnitSupply(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMpwActionUnitSupplyUnit: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMpwActionUnitSupplyUnit(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitSupplyUnit.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitSupplyUnit);
        }
    }

    export function reqMcwUnitSurface(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        NetManager.send({
            MsgMpwActionUnitSurface: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMpwActionUnitSurface(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitSurface.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitSurface);
        }
    }

    export function reqMcwUnitUseCoSkill(war: BwWar, skillType: Types.CoSkillType, path: GridIndex[], launchUnitId: number | null): void {
        NetManager.send({
            MsgMpwActionUnitUseCoSkill: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                skillType,
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMpwActionUnitUseCoSkill(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitUseCoSkill.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitUseCoSkill);
        }
    }

    export function reqMcwUnitWait(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        NetManager.send({
            MsgMpwActionUnitWait: { c: {
                warId       : war.getWarId(),
                actionId    : war.getExecutedActionsCount(),
                path,
                launchUnitId,
            }, }
        });
    }
    function _onMsgMpwActionUnitWait(e: egret.Event): void {
        const data = e.data as NetMessage.MsgMpwActionUnitWait.IS;
        if (!data.errorCode) {
            MpwModel.updateByActionContainer(data.actionContainer, data.warId);
            Notify.dispatch(Notify.Type.MsgMpwActionUnitWait, data);
        }
    }
}
