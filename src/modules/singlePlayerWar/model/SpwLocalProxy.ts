
// import TwnsBwWar    from "../../baseWar/model/BwWar";
// import Types        from "../../tools/helpers/Types";
// import ProtoTypes   from "../../tools/proto/ProtoTypes";
// import SpwModel     from "./SpwModel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.SinglePlayerWar.SpwLocalProxy {
    import GridIndex    = Types.GridIndex;
    import IMovePath    = CommonProto.Structure.IMovePath;
    import BwWar        = BaseWar.BwWar;

    export function reqPlayerDeleteUnit(war: BwWar, gridIndex: GridIndex): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionPlayerDeleteUnit   : {
                gridIndex,
            },
        });
    }

    export function reqPlayerEndTurn(war: BwWar): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionPlayerEndTurn  : {},
        });
    }

    export function reqPlayerProduceUnit({ war, gridIndex, unitType, unitHp }: {
        war         : BwWar;
        gridIndex   : GridIndex;
        unitType    : number;
        unitHp      : number;
    }): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionPlayerProduceUnit  : {
                gridIndex,
                unitType,
                unitHp,
            },
        });
    }

    export function reqPlayerUseCoSkill(war: BwWar, skillType: Types.CoSkillType): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionPlayerUseCoSkill   : {
                skillType,
            },
        });
    }

    export function reqPlayerVoteForDraw(war: BwWar, isAgree: boolean): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionPlayerVoteForDraw  : {
                isAgree,
            },
        });
    }

    export function reqPlayerSurrender(war: BwWar): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionPlayerSurrender    : {
            },
        });
    }

    export function reqUnitAttackUnit({ war, path, launchUnitId, targetGridIndex }: {
        war             : BwWar;
        path            : IMovePath;
        launchUnitId    : number | null;
        targetGridIndex : GridIndex;
    }): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitAttackUnit : {
                path,
                launchUnitId,
                targetGridIndex,
            },
        });
    }

    export function reqUnitAttackTile({ war, path, launchUnitId, targetGridIndex }: {
        war             : BwWar;
        path            : IMovePath;
        launchUnitId    : number | null;
        targetGridIndex : GridIndex;
    }): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitAttackTile : {
                path,
                launchUnitId,
                targetGridIndex,
            },
        });
    }

    export function reqUnitBeLoaded(war: BwWar, path: IMovePath, launchUnitId: number | null): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitBeLoaded   : {
                path,
                launchUnitId,
            },
        });
    }

    export function reqUnitBuildTile(war: BwWar, path: IMovePath, launchUnitId: number | null): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitBuildTile  : {
                path,
                launchUnitId,
            },
        });
    }

    export function reqUnitCaptureTile(war: BwWar, path: IMovePath, launchUnitId: number | null): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitCaptureTile: {
                path,
                launchUnitId,
            },
        });
    }

    export function reqUnitDive(war: BwWar, path: IMovePath, launchUnitId: number | null): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId            : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitDive   : {
                path,
                launchUnitId,
            },
        });
    }

    export function reqUnitDrop({ war, path, launchUnitId, dropDestinations }: {
        war             : BwWar;
        path            : IMovePath;
        launchUnitId    : number | null;
        dropDestinations: Types.DropDestination[];
    }): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitDropUnit   : {
                path,
                launchUnitId,
                dropDestinations,
            },
        });
    }

    export function reqUnitJoin(war: BwWar, path: IMovePath, launchUnitId: number | null): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitJoinUnit   : {
                path,
                launchUnitId,
            },
        });
    }

    export function reqUnitLaunchFlare({ war, path, launchUnitId, targetGridIndex }: {
        war             : BwWar;
        path            : IMovePath;
        launchUnitId    : number | null;
        targetGridIndex : GridIndex;
    }): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitLaunchFlare    : {
                path,
                launchUnitId,
                targetGridIndex,
            },
        });
    }

    export function reqUnitLaunchSilo({ war, path, launchUnitId, targetGridIndex }: {
        war             : BwWar;
        path            : IMovePath;
        launchUnitId    : number | null;
        targetGridIndex : GridIndex;
    }): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitLaunchSilo : {
                path,
                launchUnitId,
                targetGridIndex,
            },
        });
    }

    export function reqUnitLoadCo(war: BwWar, path: IMovePath, launchUnitId: number | null): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId            : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitLoadCo : {
                path,
                launchUnitId,
            },
        });
    }

    export function reqUnitProduceUnit(war: BwWar, path: IMovePath, launchUnitId: number | null): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                    : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitProduceUnit    : {
                path,
                launchUnitId,
            },
        });
    }

    export function reqUnitSupply(war: BwWar, path: IMovePath, launchUnitId: number | null): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitSupplyUnit : {
                path,
                launchUnitId,
            },
        });
    }

    export function reqUnitSurface(war: BwWar, path: IMovePath, launchUnitId: number | null): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitSurface    : {
                path,
                launchUnitId,
            },
        });
    }

    export function reqUnitUseCoSkill({ war, skillType, path, launchUnitId }: {
        war             : BwWar;
        skillType       : Types.CoSkillType;
        path            : IMovePath;
        launchUnitId    : number | null;
    }): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId                : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitUseCoSkill : {
                skillType,
                path,
                launchUnitId,
            },
        });
    }

    export function reqUnitWait(war: BwWar, path: IMovePath, launchUnitId: number | null): void {
        SinglePlayerWar.SpwModel.handlePlayerActionAndAutoActions(war, {
            actionId            : war.getExecutedActionManager().getExecutedActionsCount(),
            WarActionUnitWait   : {
                path,
                launchUnitId,
            },
        });
    }
}

// export default SpwLocalProxy;
