
namespace TinyWars.SinglePlayerWar.SpwActionReviser {
    import Types                    = Utility.Types;
    import Logger                   = Utility.Logger;
    import ProtoTypes               = Utility.ProtoTypes;
    import GridIndexHelpers         = Utility.GridIndexHelpers;
    import VisibilityHelpers        = Utility.VisibilityHelpers;
    import BwWar                    = BaseWar.BwWar;
    import TurnPhaseCode            = Types.TurnPhaseCode;
    import RawWarAction             = Types.RawWarActionContainer;
    import GridIndex                = Types.GridIndex;
    import UnitActionState          = Types.UnitActionState;
    import DropDestination          = Types.DropDestination;
    import IWarActionContainer      = ProtoTypes.WarAction.IWarActionContainer;
    import Structure                = ProtoTypes.Structure;
    import IGridIndex               = Structure.IGridIndex;

    export function revise(war: SpwWar, container: RawWarAction): IWarActionContainer {
        if      (container.PlayerDeleteUnit)    { return revisePlayerDeleteUnit(war, container); }
        else if (container.PlayerEndTurn)       { return revisePlayerEndTurn(war, container); }
        else if (container.PlayerProduceUnit)   { return revisePlayerProduceUnit(war, container); }
        else if (container.UnitAttackUnit)      { return reviseUnitAttackUnit(war, container); }
        else if (container.UnitAttackTile)      { return reviseUnitAttackTile(war, container); }
        else if (container.UnitBeLoaded)        { return reviseUnitBeLoaded(war, container); }
        else if (container.UnitBuildTile)       { return reviseUnitBuildTile(war, container); }
        else if (container.UnitCaptureTile)     { return reviseUnitCaptureTile(war, container); }
        else if (container.UnitDive)            { return reviseUnitDive(war, container); }
        else if (container.UnitDrop)            { return reviseUnitDrop(war, container); }
        else if (container.UnitJoin)            { return reviseUnitJoin(war, container); }
        else if (container.UnitLaunchFlare)     { return reviseUnitLaunchFlare(war, container); }
        else if (container.UnitLaunchSilo)      { return reviseUnitLaunchSilo(war, container); }
        else if (container.UnitLoadCo)          { return reviseUnitLoadCo(war, container); }
        else if (container.UnitProduceUnit)     { return reviseUnitProduceUnit(war, container); }
        else if (container.UnitSupply)          { return reviseUnitSupply(war, container); }
        else if (container.UnitSurface)         { return reviseUnitSurface(war, container); }
        else if (container.UnitUseCoSkill)      { return reviseUnitUseCoSkill(war, container); }
        else if (container.UnitWait)            { return reviseUnitWait(war, container); }
        else                                    { return reviseUnknownAction(war, container); }
    }

    function revisePlayerDeleteUnit(war: BwWar, container: RawWarAction): IWarActionContainer {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.revisePlayerDeleteUnit() invalid turn phase code: ${currPhaseCode}`
        );

        return {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionPlayerDeleteUnit   : {
                gridIndex: container.PlayerDeleteUnit.gridIndex,
            },
        }
    }

    function revisePlayerEndTurn(war: BwWar, container: RawWarAction): IWarActionContainer { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.revisePlayerEndTurn() invalid turn phase code: ${currPhaseCode}`
        );

        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionPlayerEndTurn  : {}
        };
    }

    function revisePlayerProduceUnit(war: BwWar, container: RawWarAction): IWarActionContainer {  // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.revisePlayerProduceUnit() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = container.PlayerProduceUnit;
        const unitType      = action.unitType;
        const gridIndex     = action.gridIndex;
        const unitHp        = action.unitHp;
        return {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionPlayerProduceUnit  : {
                gridIndex,
                unitHp,
                unitType,
            },
        };
    }

    function reviseUnitAttackUnit(war: SpwWar, container: RawWarAction): IWarActionContainer { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitAttackUnit() invalid turn phase code: ${currPhaseCode}`
        );

        const action                        = container.UnitAttackUnit;
        const rawPath                       = action.path;
        const launchUnitId                  = action.launchUnitId;
        const targetGridIndex               = action.targetGridIndex;
        const revisedPath                   = getRevisedPath(war, rawPath, launchUnitId);
        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitAttackUnit : {
                path    : revisedPath,
                launchUnitId,
                targetGridIndex,
            },
        };
    }

    function reviseUnitAttackTile(war: SpwWar, container: RawWarAction): IWarActionContainer { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitAttackTile() invalid turn phase code: ${currPhaseCode}`
        );

        const action                        = container.UnitAttackTile;
        const rawPath                       = action.path;
        const launchUnitId                  = action.launchUnitId;
        const targetGridIndex               = action.targetGridIndex;
        const revisedPath                   = getRevisedPath(war, rawPath, launchUnitId);
        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitAttackTile : {
                path    : revisedPath,
                launchUnitId,
                targetGridIndex,
            },
        };
    }

    function reviseUnitBeLoaded(war: BwWar, rawAction: RawWarAction): IWarActionContainer {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitBeLoaded() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitBeLoaded;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitBeLoaded   : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitBuildTile(war: BwWar, rawAction: RawWarAction): IWarActionContainer {  // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitBuildTile() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitBuildTile;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitBuildTile  : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitCaptureTile(war: BwWar, rawAction: RawWarAction): IWarActionContainer {    // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitCaptureTile() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitCaptureTile;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitCaptureTile: {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitDive(war: BwWar, rawAction: RawWarAction): IWarActionContainer {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitDive() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitDive;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId            : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitDive   : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitDrop(war: BwWar, rawAction: RawWarAction): IWarActionContainer {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitDrop() invalid turn phase code: ${currPhaseCode}`
        );

        const action                    = rawAction.UnitDrop;
        const launchUnitId              = action.launchUnitId;
        const revisedPath               = getRevisedPath(war, action.path, launchUnitId);
        const revisedDropDestinations   = getRevisedDropDestinations(war, action, revisedPath);
        const isDropBlocked             =  (!revisedPath.isBlocked) && (revisedDropDestinations.length < action.dropDestinations!.length);
        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitDropUnit   : {
                path            : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
                dropDestinations: revisedDropDestinations,
                isDropBlocked,
            },
        };
    }

    function reviseUnitJoin(war: BwWar, rawAction: RawWarAction): IWarActionContainer {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitJoin() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitJoin;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitJoinUnit   : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitLaunchFlare(war: BwWar, rawAction: RawWarAction): IWarActionContainer {    // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitLaunchFlare() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitLaunchFlare;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitLaunchFlare: {
                path            : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
                targetGridIndex : action.targetGridIndex,
            },
        };
    }

    function reviseUnitLaunchSilo(war: BwWar, rawAction: RawWarAction): IWarActionContainer { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitLaunchSilo() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitLaunchSilo;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitLaunchSilo : {
                path            : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
                targetGridIndex : action.targetGridIndex,
            },
        };
    }

    function reviseUnitLoadCo(war: BwWar, rawAction: RawWarAction): IWarActionContainer { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitLoadCo() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitLoadCo;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId            : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitLoadCo : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitProduceUnit(war: BwWar, rawAction: RawWarAction): IWarActionContainer {    // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitProduceUnit() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitProduceUnit;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitProduceUnit    : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitSupply(war: BwWar, rawAction: RawWarAction): IWarActionContainer { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitSupply() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitSupply;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitSupplyUnit : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitSurface(war: BwWar, rawAction: RawWarAction): IWarActionContainer {    // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitSurface() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitSurface;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId            : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitSurface: {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnitUseCoSkill(war: SpwWar, rawAction: RawWarAction): IWarActionContainer { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitUseCoSkill() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitUseCoSkill;
        const launchUnitId  = action.launchUnitId;
        const skillType     = action.skillType;
        const revisedPath   = getRevisedPath(war, action.path, launchUnitId);
        return {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitUseCoSkill : {
                path        : revisedPath,
                launchUnitId,
                skillType,
            },
        };
    }

    function reviseUnitWait(war: BwWar, rawAction: RawWarAction): IWarActionContainer {   // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `SpwActionReviser.reviseUnitWait() invalid turn phase code: ${currPhaseCode}`
        );

        const action        = rawAction.UnitWait;
        const launchUnitId  = action.launchUnitId;
        return {
            actionId            : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitWait   : {
                path    : getRevisedPath(war, action.path, launchUnitId),
                launchUnitId,
            },
        };
    }

    function reviseUnknownAction(war: BwWar, rawAction: RawWarAction): IWarActionContainer {
        Logger.error(`SpwActionReviser.reviseUnknownAction() invalid rawAction: ${JSON.stringify(rawAction)}`);
        return null;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    function convertGridIndex(raw: IGridIndex | undefined | null): GridIndex | undefined {
        return ((!raw) || (raw.x == null) || (raw.y == null))
            ? undefined
            : raw as GridIndex;
    }

    function getRevisedPath(war: BwWar, rawPath: IGridIndex[] | undefined | null, launchUnitId: number | null | undefined): Types.MovePath | undefined {
        const beginningGridIndex = convertGridIndex(rawPath ? rawPath[0] : undefined);
        if ((!rawPath) || (!beginningGridIndex)) {
            return undefined;
        } else {
            const unitMap           = war.getUnitMap();
            const playerInTurn      = war.getPlayerManager().getPlayerInTurn();
            const playerIndexInTurn = playerInTurn.getPlayerIndex();
            const isLaunch          = launchUnitId != null;
            const focusUnit         = isLaunch ? unitMap.getUnitLoadedById(launchUnitId!) : unitMap.getUnitOnMap(beginningGridIndex);
            if ((!focusUnit)                                                                                    ||
                (focusUnit.getPlayerIndex() !== playerIndexInTurn)                                              ||
                (focusUnit.getActionState() !== UnitActionState.Idle)                                                 ||
                (war.getTurnManager().getPhaseCode() !== TurnPhaseCode.Main)                                    ||
                ((isLaunch) && (!GridIndexHelpers.checkIsEqual(focusUnit.getGridIndex(), beginningGridIndex)))
            ) {
                return undefined;
            } else {
                const teamIndexInTurn           = playerInTurn.getTeamIndex();
                const tileMap                   = war.getTileMap();
                const revisedNodes              = [GridIndexHelpers.clone(beginningGridIndex)];
                const maxFuelConsumption        = Math.min(focusUnit.getCurrentFuel(), focusUnit.getFinalMoveRange());
                const mapSize                   = tileMap.getMapSize();
                let revisedTotalFuelConsumption = 0;
                let rawTotalFuelConsumption     = 0;
                let isBlocked                   = false;
                for (let i = 1; i < rawPath.length; ++i) {
                    const gridIndex = convertGridIndex(rawPath[i]);
                    if ((!gridIndex)                                                                ||
                        (!GridIndexHelpers.checkIsAdjacent(gridIndex, rawPath[i - 1] as GridIndex)) ||
                        (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize))                    ||
                        (revisedNodes.some(g => GridIndexHelpers.checkIsEqual(g, gridIndex)))
                    ) {
                        return undefined;
                    } else {
                        const fuelConsumption = tileMap.getTile(gridIndex).getMoveCostByUnit(focusUnit);
                        if (fuelConsumption == null) {
                            return undefined;
                        }
                        rawTotalFuelConsumption += fuelConsumption;
                        if (rawTotalFuelConsumption > maxFuelConsumption) {
                            return undefined;
                        }

                        const existingUnit = unitMap.getUnitOnMap(gridIndex);
                        if ((existingUnit) && (existingUnit.getTeamIndex() !== teamIndexInTurn)) {
                            if (VisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                                war,
                                gridIndex,
                                unitType            : existingUnit.getUnitType(),
                                isDiving            : existingUnit.getIsDiving(),
                                unitPlayerIndex     : existingUnit.getPlayerIndex(),
                                observerTeamIndex   : teamIndexInTurn,
                            })) {
                                return undefined;
                            } else {
                                isBlocked = true;
                            }
                        }

                        if (!isBlocked) {
                            revisedTotalFuelConsumption = rawTotalFuelConsumption;
                            revisedNodes.push(GridIndexHelpers.clone(gridIndex));
                        }
                    }
                }

                return {
                    nodes           : revisedNodes,
                    isBlocked       : isBlocked,
                    fuelConsumption : revisedTotalFuelConsumption,
                };
            }
        }
    }

    function getRevisedDropDestinations(war: BwWar, action: ProtoTypes.NetMessage.MsgMpwActionUnitDropUnit.IC, revisedPath: Types.MovePath): DropDestination[] {
        const destinations: DropDestination[] = [];
        if (!revisedPath.isBlocked) {
            const unitMap       = war.getUnitMap();
            const loaderUnit    = unitMap.getUnit(revisedPath.nodes[0], action.launchUnitId);
            for (const raw of action.dropDestinations as DropDestination[]) {
                const existingUnit = unitMap.getUnitOnMap(raw.gridIndex);
                if ((existingUnit) && (existingUnit !== loaderUnit)) {
                    break;
                } else {
                    destinations.push(raw);
                }
            }
        }
        return destinations;
    }
}
