
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

    export function revise(war: BwWar, container: Types.RawWarActionContainer): WarAction {
        if      (container.PlayerBeginTurn)     { return revisePlayerBeginTurn(war, container.PlayerBeginTurn); }
        else if (container.PlayerDeleteUnit)    { return revisePlayerDeleteUnit(war, container.PlayerDeleteUnit); }
        else if (container.PlayerEndTurn)       { return revisePlayerEndTurn(war, container.PlayerEndTurn); }
        else if (container.PlayerProduceUnit)   { return revisePlayerProduceUnit(war, container.PlayerProduceUnit); }
        else if (container.UnitAttack)          { return reviseUnitAttack(war, container.UnitAttack); }
        else if (container.UnitBeLoaded)        { return reviseUnitBeLoaded(war, container.UnitBeLoaded); }
        else if (container.UnitBuildTile)       { return reviseUnitBuildTile(war, container.UnitBuildTile); }
        else if (container.UnitCaptureTile)     { return reviseUnitCaptureTile(war, container.UnitCaptureTile); }
        else if (container.UnitDive)            { return reviseUnitDive(war, container.UnitDive); }
        else if (container.UnitDrop)            { return reviseUnitDrop(war, container.UnitDrop); }
        else if (container.UnitJoin)            { return reviseUnitJoin(war, container.UnitJoin); }
        else if (container.UnitLaunchFlare)     { return reviseUnitLaunchFlare(war, container.UnitLaunchFlare); }
        else if (container.UnitLaunchSilo)      { return reviseUnitLaunchSilo(war, container.UnitLaunchSilo); }
        else if (container.UnitLoadCo)          { return reviseUnitLoadCo(war, container.UnitLoadCo); }
        else if (container.UnitProduceUnit)     { return reviseUnitProduceUnit(war, container.UnitProduceUnit); }
        else if (container.UnitSupply)          { return reviseUnitSupply(war, container.UnitSupply); }
        else if (container.UnitSurface)         { return reviseUnitSurface(war, container.UnitSurface); }
        else if (container.UnitUseCoSkill)      { return reviseUnitUseCoSkill(war, container.UnitUseCoSkill); }
        else if (container.UnitWait)            { return reviseUnitWait(war, container.UnitWait); }
        else                                    { return null; }
    }

    export function revisePlayerBeginTurn(war: BwWar, rawAction: Types.RawWarActionPlayerBeginTurn): WarAction {
        // TODO
        return null;
    }

    export function revisePlayerDeleteUnit(war: BwWar, rawAction: Types.RawWarActionPlayerDeleteUnit): WarAction {
        // TODO
        return null;
    }

    export function revisePlayerEndTurn(war: BwWar, rawAction: Types.RawWarActionPlayerEndTurn): WarAction { // DONE
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

    export function revisePlayerProduceUnit(war: BwWar, rawAction: Types.RawWarActionPlayerProduceUnit): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitAttack(war: BwWar, rawAction: Types.RawWarActionUnitAttack): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitBeLoaded(war: BwWar, rawAction: Types.RawWarActionUnitBeLoaded): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitBuildTile(war: BwWar, rawAction: Types.RawWarActionUnitBuildTile): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitCaptureTile(war: BwWar, rawAction: Types.RawWarActionUnitCaptureTile): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitDive(war: BwWar, rawAction: Types.RawWarActionUnitDive): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitDrop(war: BwWar, rawAction: Types.RawWarActionUnitDrop): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitJoin(war: BwWar, rawAction: Types.RawWarActionUnitJoin): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitLaunchFlare(war: BwWar, rawAction: Types.RawWarActionUnitLaunchFlare): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitLaunchSilo(war: BwWar, rawAction: Types.RawWarActionUnitLaunchSilo): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitLoadCo(war: BwWar, rawAction: Types.RawWarActionUnitLoadCo): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitProduceUnit(war: BwWar, rawAction: Types.RawWarActionUnitProduceUnit): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitSupply(war: BwWar, rawAction: Types.RawWarActionUnitSupply): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitSurface(war: BwWar, rawAction: Types.RawWarActionUnitSurface): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitUseCoSkill(war: BwWar, rawAction: Types.RawWarActionUnitUseCoSkill): WarAction {
        // TODO
        return null;
    }

    export function reviseUnitWait(war: BwWar, rawAction: Types.RawWarActionUnitWait): WarAction {
        // TODO
        return null;
    }
}
