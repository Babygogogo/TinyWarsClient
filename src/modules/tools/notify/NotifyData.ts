
// import TwnsBwCursor     from "../../baseWar/model/BwCursor";
// import TwnsBwPlayer     from "../../baseWar/model/BwPlayer";
// import Types            from "../helpers/Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Notify.NotifyData {
    import GridIndex        = Twns.Types.GridIndex;
    import TouchPoints      = Twns.Types.TouchPoints;

    export type McwPlayerIndexInTurnChanged = number;
    export type BwPlayerFundChanged         = BaseWar.BwPlayer;
    export type McwPlayerEnergyChanged      = BaseWar.BwPlayer;
    export type BwCoIdChanged               = BaseWar.BwPlayer;
    export type BwCursorGridIndexChanged    = BaseWar.BwCursor;
    export type BwTileLocationFlagSet       = BaseWar.BwTile;
    export type BwTileIsHighlightChanged    = BaseWar.BwTile;
    export type BwCursorTapped              = { current: GridIndex, tappedOn: GridIndex };
    export type BwCursorDragged             = { current: GridIndex, draggedTo: GridIndex };
    export type BwFieldZoomed               = { previous: TouchPoints, current: TouchPoints };
    export type BwFieldDragged              = { previous: Twns.Types.Point, current: Twns.Types.Point };
    export type BwUnitChanged               = { gridIndex: GridIndex };
    export type MeTileChanged               = { gridIndex: GridIndex };
    export type ScrCreatePlayerInfoChanged  = { playerIndex: number };
    export type SrrCreatePlayerInfoChanged  = { playerIndex: number };
}

// export default NotifyData;
