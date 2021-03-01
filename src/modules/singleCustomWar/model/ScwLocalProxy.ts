
namespace TinyWars.SingleCustomWar.ScwLocalProxy {
    import Types        = Utility.Types;
    import GridIndex    = Types.GridIndex;
    import UnitType     = Types.UnitType;

    export function reqPlayerDeleteUnit(war: ScwWar, gridIndex: GridIndex): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionManager().getExecutedActionsCount(),
                PlayerDeleteUnit: {
                    gridIndex,
                },
            }
        ));
    }

    export function reqPlayerEndTurn(war: ScwWar): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionManager().getExecutedActionsCount(),
                PlayerEndTurn   : {},
            }
        ));
    }

    export function reqPlayerProduceUnit(war: ScwWar, gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitAttackUnit(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitAttackTile(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitBeLoaded(war: ScwWar, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitBuildTile(war: ScwWar, path: GridIndex[], launchUnitId?: number): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitCaptureTile(war: ScwWar, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitDive(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitDrop(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined, dropDestinations: Types.DropDestination[]): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitJoin(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitLaunchFlare(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitLaunchSilo(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitLoadCo(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitProduceUnit(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitSupply(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitSurface(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitUseCoSkill(war: ScwWar, skillType: Types.CoSkillType, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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

    export function reqUnitWait(war: ScwWar, path: GridIndex[], launchUnitId?: number): void {
        ScwModel.handlePlayerAction(ScwActionReviser.revise(
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
