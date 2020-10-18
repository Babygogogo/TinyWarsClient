
namespace TinyWars.SingleCustomWar.ScwLocalProxy {
    import Types        = Utility.Types;
    import GridIndex    = Types.GridIndex;
    import UnitType     = Types.UnitType;

    export function reqPlayerBeginTurn(war: ScwWar): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionsCount(),
                PlayerBeginTurn : {},
            }
        ));
    }

    export function reqPlayerDeleteUnit(war: ScwWar, gridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionsCount(),
                PlayerDeleteUnit: {
                    gridIndex,
                },
            }
        ));
    }

    export function reqPlayerEndTurn(war: ScwWar): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionsCount(),
                PlayerEndTurn   : {},
            }
        ));
    }

    export function reqPlayerProduceUnit(war: ScwWar, gridIndex: GridIndex, unitType: UnitType, unitHp: number): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId            : war.getExecutedActionsCount(),
                PlayerProduceUnit   : {
                    gridIndex,
                    unitType,
                    unitHp,
                },
            }
        ));
    }

    export function reqUnitAttack(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId    : war.getExecutedActionsCount(),
                UnitAttack  : {
                    path,
                    launchUnitId,
                    targetGridIndex,
                },
            }
        ));
    }

    export function reqUnitBeLoaded(war: ScwWar, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId    : war.getExecutedActionsCount(),
                UnitBeLoaded: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitBuildTile(war: ScwWar, path: GridIndex[], launchUnitId?: number): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionsCount(),
                UnitBuildTile   : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitCaptureTile(war: ScwWar, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionsCount(),
                UnitCaptureTile : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitDive(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId: war.getExecutedActionsCount(),
                UnitDive: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitDrop(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined, dropDestinations: Types.DropDestination[]): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId: war.getExecutedActionsCount(),
                UnitDrop: {
                    path,
                    launchUnitId,
                    dropDestinations,
                },
            }
        ));
    }

    export function reqUnitJoin(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId: war.getExecutedActionsCount(),
                UnitJoin: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitLaunchFlare(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionsCount(),
                UnitLaunchFlare : {
                    path,
                    launchUnitId,
                    targetGridIndex,
                },
            }
        ));
    }

    export function reqUnitLaunchSilo(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionsCount(),
                UnitLaunchSilo  : {
                    path,
                    launchUnitId,
                    targetGridIndex,
                },
            }
        ));
    }

    export function reqUnitLoadCo(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId    : war.getExecutedActionsCount(),
                UnitLoadCo  : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitProduceUnit(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionsCount(),
                UnitProduceUnit : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitSupply(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId    : war.getExecutedActionsCount(),
                UnitSupply  : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitSurface(war: ScwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId    : war.getExecutedActionsCount(),
                UnitSurface : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitUseCoSkill(war: ScwWar, skillType: Types.CoSkillType, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getExecutedActionsCount(),
                UnitUseCoSkill  : {
                    skillType,
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitWait(war: ScwWar, path: GridIndex[], launchUnitId?: number): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId: war.getExecutedActionsCount(),
                UnitWait: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }
}
