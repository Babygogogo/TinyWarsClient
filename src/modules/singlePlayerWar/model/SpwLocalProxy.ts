
namespace TinyWars.SinglePlayerWar.SpwLocalProxy {
    import Types        = Utility.Types;
    import GridIndex    = Types.GridIndex;
    import UnitType     = Types.UnitType;

    export function reqPlayerDeleteUnit(war: SpwWar, gridIndex: GridIndex): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionManager().getExecutedActionsCount(),
                PlayerDeleteUnit: {
                    gridIndex,
                },
            }
        ));
    }

    export function reqPlayerEndTurn(war: SpwWar): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionManager().getExecutedActionsCount(),
                PlayerEndTurn   : {},
            }
        ));
    }

    export function reqPlayerProduceUnit(war: SpwWar, gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId            : war.getExecutedActionManager().getExecutedActionsCount(),
                PlayerProduceUnit   : {
                    gridIndex,
                    unitType,
                    unitHp,
                },
            }
        ));
    }

    export function reqUnitAttackUnit(war: SpwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId    : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitAttackUnit  : {
                    path,
                    launchUnitId,
                    targetGridIndex,
                },
            }
        ));
    }

    export function reqUnitAttackTile(war: SpwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitAttackTile  : {
                    path,
                    launchUnitId,
                    targetGridIndex,
                },
            }
        ));
    }

    export function reqUnitBeLoaded(war: SpwWar, path: GridIndex[], launchUnitId: number | null): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId    : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitBeLoaded: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitBuildTile(war: SpwWar, path: GridIndex[], launchUnitId?: number): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitBuildTile   : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitCaptureTile(war: SpwWar, path: GridIndex[], launchUnitId: number | null): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitCaptureTile : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitDive(war: SpwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId: war.getExecutedActionManager().getExecutedActionsCount(),
                UnitDive: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitDrop(war: SpwWar, path: GridIndex[], launchUnitId: number | undefined, dropDestinations: Types.DropDestination[]): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId: war.getExecutedActionManager().getExecutedActionsCount(),
                UnitDrop: {
                    path,
                    launchUnitId,
                    dropDestinations,
                },
            }
        ));
    }

    export function reqUnitJoin(war: SpwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId: war.getExecutedActionManager().getExecutedActionsCount(),
                UnitJoin: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitLaunchFlare(war: SpwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitLaunchFlare : {
                    path,
                    launchUnitId,
                    targetGridIndex,
                },
            }
        ));
    }

    export function reqUnitLaunchSilo(war: SpwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitLaunchSilo  : {
                    path,
                    launchUnitId,
                    targetGridIndex,
                },
            }
        ));
    }

    export function reqUnitLoadCo(war: SpwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId    : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitLoadCo  : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitProduceUnit(war: SpwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitProduceUnit : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitSupply(war: SpwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId    : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitSupply  : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitSurface(war: SpwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId    : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitSurface : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitUseCoSkill(war: SpwWar, skillType: Types.CoSkillType, path: GridIndex[], launchUnitId: number | null): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionManager().getExecutedActionsCount(),
                UnitUseCoSkill  : {
                    skillType,
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitWait(war: SpwWar, path: GridIndex[], launchUnitId?: number): void {
        SpwModel.handlePlayerAction(SpwActionReviser.revise(
            war,
            {
                actionId: war.getExecutedActionManager().getExecutedActionsCount(),
                UnitWait: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }
}
