
namespace TinyWars.SingleCustomWar.ScwActionReviser {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import BwWar            = BaseWar.BwWar;
    import TurnPhaseCode    = Types.TurnPhaseCode;
    import WarAction        = Types.WarActionContainer;
    import GridIndex        = Types.GridIndex;
    import UnitType         = Types.UnitType;
    import DropDestination  = Types.DropDestination;
    import CoSkillType      = Types.CoSkillType;

    type RawActionPlayerBeginTurn = {};
    export function revisePlayerBeginTurn(war: BwWar, rawAction: RawActionPlayerBeginTurn): WarAction {
        // TODO
        return null;
    }

    type RawActionPlayerDeleteUnit = {
        gridIndex: GridIndex;
    };
    export function revisePlayerDeleteUnit(war: BwWar, rawAction: RawActionPlayerDeleteUnit): WarAction {
        // TODO
        return null;
    }

    type RawActionPlayerEndTurn = {};
    export function revisePlayerEndTurn(war: BwWar, rawAction: RawActionPlayerEndTurn): WarAction { // DONE
        const currPhaseCode = war.getTurnManager().getPhaseCode();
        Logger.assert(
            currPhaseCode === TurnPhaseCode.Main,
            `ScwActionReviser.reviseScwPlayerEndTurn() invalid turn phase code: ${currPhaseCode}`
        );

        return {
            actionId                : war.getNextActionId(),
            WarActionPlayerEndTurn  : {}
        };
    }

    type RawActionPlayerProduceUnit = {
        gridIndex   : GridIndex;
        unitType    : UnitType;
    };
    export function revisePlayerProduceUnit(war: BwWar, rawAction: RawActionPlayerProduceUnit): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitAttack = {
        path            : GridIndex[];
        launchUnitId    : number | null;
        targetGridIndex : GridIndex;
    }
    export function reviseUnitAttack(war: BwWar, rawAction: RawActionUnitAttack): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitBeLoaded = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }
    export function reviseUnitBeLoaded(war: BwWar, rawAction: RawActionUnitBeLoaded): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitBuildTile = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    }
    export function reviseUnitBuildTile(war: BwWar, rawAction: RawActionUnitBuildTile): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitCaptureTile = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    };
    export function reviseUnitCaptureTile(war: BwWar, rawAction: RawActionUnitCaptureTile): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitDive = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    };
    export function reviseUnitDive(war: BwWar, rawAction: RawActionUnitDive): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitDrop = {
        path            : GridIndex[];
        launchUnitId    : number | null;
        dropDestinations: DropDestination[];
    }
    export function reviseUnitDrop(war: BwWar, rawAction: RawActionUnitDrop): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitJoin = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    };
    export function reviseUnitJoin(war: BwWar, rawAction: RawActionUnitJoin): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitLaunchFlare = {
        path            : GridIndex[];
        launchUnitId    : number | null;
        targetGridIndex : GridIndex;
    };
    export function reviseUnitLaunchFlare(war: BwWar, rawAction: RawActionUnitLaunchFlare): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitLaunchSilo = {
        path            : GridIndex[];
        launchUnitId    : number | null;
        targetGridIndex : GridIndex;
    };
    export function reviseUnitLaunchSilo(war: BwWar, rawAction: RawActionUnitLaunchSilo): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitLoadCo = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    };
    export function reviseUnitLoadCo(war: BwWar, rawAction: RawActionUnitLoadCo): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitProduceUnit = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    };
    export function reviseUnitProduceUnit(war: BwWar, rawAction: RawActionUnitProduceUnit): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitSupply = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    };
    export function reviseUnitSupply(war: BwWar, rawAction: RawActionUnitSupply): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitSurface = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    };
    export function reviseUnitSurface(war: BwWar, rawAction: RawActionUnitSurface): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitUseCoSkill = {
        path            : GridIndex[];
        launchUnitId    : number | null;
        skillType       : CoSkillType;
    };
    export function reviseUnitUseCoSkill(war: BwWar, rawAction: RawActionUnitUseCoSkill): WarAction {
        // TODO
        return null;
    }

    type RawActionUnitWait = {
        path            : GridIndex[];
        launchUnitId    : number | null;
    };
    export function reviseUnitWait(war: BwWar, rawAction: RawActionUnitWait): WarAction {
        // TODO
        return null;
    }
}
