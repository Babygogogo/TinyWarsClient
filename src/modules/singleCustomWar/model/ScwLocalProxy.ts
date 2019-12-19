
namespace TinyWars.SingleCustomWar.ScwLocalProxy {
    import Types        = Utility.Types;
    import GridIndex    = Types.GridIndex;
    import UnitType     = Types.UnitType;
    import BwWar        = BaseWar.BwWar;

    export function reqPlayerBeginTurn(war: BwWar): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getNextActionId(),
                PlayerBeginTurn : {},
            }
        ));
    }

    export function reqPlayerDeleteUnit(war: BwWar, gridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getNextActionId(),
                PlayerDeleteUnit: {
                    gridIndex,
                },
            }
        ));
    }

    export function reqPlayerEndTurn(war: BwWar): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getNextActionId(),
                PlayerEndTurn   : {},
            }
        ));
    }

    export function reqPlayerProduceUnit(war: BwWar, gridIndex: GridIndex, unitType: UnitType): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId            : war.getNextActionId(),
                PlayerProduceUnit   : {
                    gridIndex,
                    unitType,
                },
            }
        ));
    }

    export function reqUnitAttack(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId    : war.getNextActionId(),
                UnitAttack  : {
                    path,
                    launchUnitId,
                    targetGridIndex,
                },
            }
        ));
    }

    export function reqUnitBeLoaded(war: BwWar, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId    : war.getNextActionId(),
                UnitBeLoaded: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitBuildTile(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getNextActionId(),
                UnitBuildTile   : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitCaptureTile(war: BwWar, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getNextActionId(),
                UnitBuildTile   : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitDive(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId: war.getNextActionId(),
                UnitDive: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitDrop(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, dropDestinations: Types.DropDestination[]): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId: war.getNextActionId(),
                UnitDrop: {
                    path,
                    launchUnitId,
                    dropDestinations,
                },
            }
        ));
    }

    export function reqUnitJoin(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId: war.getNextActionId(),
                UnitJoin: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitLaunchFlare(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getNextActionId(),
                UnitLaunchFlare : {
                    path,
                    launchUnitId,
                    targetGridIndex,
                },
            }
        ));
    }

    export function reqUnitLaunchSilo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getNextActionId(),
                UnitLaunchSilo  : {
                    path,
                    launchUnitId,
                    targetGridIndex,
                },
            }
        ));
    }

    export function reqUnitLoadCo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId    : war.getNextActionId(),
                UnitLoadCo  : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitProduceUnit(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getNextActionId(),
                UnitProduceUnit : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitSupply(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId    : war.getNextActionId(),
                UnitSupply  : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitSurface(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId    : war.getNextActionId(),
                UnitSurface : {
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitUseCoSkill(war: BwWar, skillType: Types.CoSkillType, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId        : war.getNextActionId(),
                UnitUseCoSkill  : {
                    skillType,
                    path,
                    launchUnitId,
                },
            }
        ));
    }

    export function reqUnitWait(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        ScwModel.updateByWarAction(ScwActionReviser.revise(
            war,
            {
                actionId: war.getNextActionId(),
                UnitWait: {
                    path,
                    launchUnitId,
                },
            }
        ));
    }
}
