
import { BwPlayer }         from "../../modules/baseWar/model/BwPlayer";
import { Types }            from "../Types";

export namespace NotifyData {
    import GridIndex        = Types.GridIndex;
    import TouchPoints      = Types.TouchPoints;

    export type ConfigLoaded                = number;
    export type McwPlayerIndexInTurnChanged = number;
    export type McwPlayerFundChanged        = BwPlayer;
    export type McwPlayerEnergyChanged      = BwPlayer;
    export type BwCursorTapped              = { current: GridIndex, tappedOn: GridIndex };
    export type BwCursorDragged             = { current: GridIndex, draggedTo: GridIndex };
    export type BwFieldZoomed               = { previous: TouchPoints, current: TouchPoints };
    export type BwFieldDragged              = { previous: Types.Point, current: Types.Point };
    export type MeUnitChanged               = { gridIndex: GridIndex };
    export type MeTileChanged               = { gridIndex: GridIndex };
    export type ScrCreatePlayerInfoChanged  = { playerIndex: number };
}
