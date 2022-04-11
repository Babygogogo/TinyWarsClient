
// import TwnsBwCursor     from "../../baseWar/model/BwCursor";
// import TwnsBwPlayer     from "../../baseWar/model/BwPlayer";
// import Types            from "../helpers/Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace NotifyData {
    import GridIndex        = Types.GridIndex;
    import TouchPoints      = Types.TouchPoints;

    export type McwPlayerIndexInTurnChanged = number;
    export type BwPlayerFundChanged         = Twns.BaseWar.BwPlayer;
    export type McwPlayerEnergyChanged      = Twns.BaseWar.BwPlayer;
    export type BwCoIdChanged               = Twns.BaseWar.BwPlayer;
    export type BwCursorGridIndexChanged    = TwnsBwCursor.BwCursor;
    export type BwTileLocationFlagSet       = Twns.BaseWar.BwTile;
    export type BwTileIsHighlightChanged    = Twns.BaseWar.BwTile;
    export type BwCursorTapped              = { current: GridIndex, tappedOn: GridIndex };
    export type BwCursorDragged             = { current: GridIndex, draggedTo: GridIndex };
    export type BwFieldZoomed               = { previous: TouchPoints, current: TouchPoints };
    export type BwFieldDragged              = { previous: Types.Point, current: Types.Point };
    export type BwUnitChanged               = { gridIndex: GridIndex };
    export type MeTileChanged               = { gridIndex: GridIndex };
    export type ScrCreatePlayerInfoChanged  = { playerIndex: number };
    export type SrrCreatePlayerInfoChanged  = { playerIndex: number };
}

// export default NotifyData;
