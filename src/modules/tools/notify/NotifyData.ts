
// import TwnsBwCursor     from "../../baseWar/model/BwCursor";
// import TwnsBwPlayer     from "../../baseWar/model/BwPlayer";
// import Types            from "../helpers/Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace NotifyData {
    import GridIndex        = Types.GridIndex;
    import TouchPoints      = Types.TouchPoints;

    export type ConfigLoaded                = number;
    export type McwPlayerIndexInTurnChanged = number;
    export type BwPlayerFundChanged         = TwnsBwPlayer.BwPlayer;
    export type McwPlayerEnergyChanged      = TwnsBwPlayer.BwPlayer;
    export type BwCoIdChanged               = TwnsBwPlayer.BwPlayer;
    export type BwCursorGridIndexChanged    = TwnsBwCursor.BwCursor;
    export type BwTileLocationFlagSet       = TwnsBwTile.BwTile;
    export type BwCursorTapped              = { current: GridIndex, tappedOn: GridIndex };
    export type BwCursorDragged             = { current: GridIndex, draggedTo: GridIndex };
    export type BwFieldZoomed               = { previous: TouchPoints, current: TouchPoints };
    export type BwFieldDragged              = { previous: Types.Point, current: Types.Point };
    export type MeUnitChanged               = { gridIndex: GridIndex };
    export type MeTileChanged               = { gridIndex: GridIndex };
    export type ScrCreatePlayerInfoChanged  = { playerIndex: number };
}

// export default NotifyData;
