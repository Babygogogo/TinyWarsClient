
namespace TinyWars.SingleCustomWar.ScwLocalProxy {
    import Types        = Utility.Types;
    import GridIndex    = Types.GridIndex;
    import UnitType     = Types.UnitType;
    import BwWar        = BaseWar.BwWar;

    export function reqPlayerBeginTurn(war: BwWar): void {
        ScwModel.updateByWarAction(ScwActionReviser.revisePlayerBeginTurn(war, {}));
    }

    export function reqPlayerDeleteUnit(war: BwWar, gridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.revisePlayerDeleteUnit(war, {
            gridIndex,
        }));
    }

    export function reqPlayerEndTurn(war: BwWar): void {
        ScwModel.updateByWarAction(ScwActionReviser.revisePlayerEndTurn(war, {}));
    }

    export function reqPlayerProduceUnit(war: BwWar, gridIndex: GridIndex, unitType: UnitType): void {
        ScwModel.updateByWarAction(ScwActionReviser.revisePlayerProduceUnit(war, {
            gridIndex,
            unitType,
        }));
    }

    export function reqUnitAttack(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitAttack(war, {
            path,
            launchUnitId,
            targetGridIndex,
        }));
    }

    export function reqUnitBeLoaded(war: BwWar, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitBeLoaded(war, {
            path,
            launchUnitId,
        }));
    }

    export function reqUnitBuildTile(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitBuildTile(war, {
            path,
            launchUnitId,
        }));
    }

    export function reqUnitCaptureTile(war: BwWar, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitCaptureTile(war, {
            path,
            launchUnitId,
        }));
    }

    export function reqUnitDive(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitDive(war, {
            path,
            launchUnitId,
        }));
    }

    export function reqUnitDrop(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, dropDestinations: Types.DropDestination[]): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitDrop(war, {
            path,
            launchUnitId,
            dropDestinations,
        }));
    }

    export function reqUnitJoin(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitJoin(war, {
            path,
            launchUnitId,
        }));
    }

    export function reqUnitLaunchFlare(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitLaunchFlare(war, {
            path,
            launchUnitId,
            targetGridIndex,
        }));
    }

    export function reqUnitLaunchSilo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined, targetGridIndex: GridIndex): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitLaunchSilo(war, {
            path,
            launchUnitId,
            targetGridIndex,
        }));
    }

    export function reqUnitLoadCo(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitLoadCo(war, {
            path,
            launchUnitId,
        }));
    }

    export function reqUnitProduceUnit(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitProduceUnit(war, {
            path,
            launchUnitId,
        }));
    }

    export function reqUnitSupply(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitSupply(war, {
            path,
            launchUnitId,
        }));
    }

    export function reqUnitSurface(war: BwWar, path: GridIndex[], launchUnitId: number | undefined): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitSurface(war, {
            path,
            launchUnitId,
        }));
    }

    export function reqUnitUseCoSkill(war: BwWar, skillType: Types.CoSkillType, path: GridIndex[], launchUnitId: number | null): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitUseCoSkill(war, {
            skillType,
            path,
            launchUnitId,
        }));
    }

    export function reqUnitWait(war: BwWar, path: GridIndex[], launchUnitId?: number): void {
        ScwModel.updateByWarAction(ScwActionReviser.reviseUnitWait(war, {
            path,
            launchUnitId,
        }));
    }
}
