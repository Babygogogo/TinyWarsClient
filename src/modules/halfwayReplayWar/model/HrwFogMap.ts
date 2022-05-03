
// import TwnsBwFogMap         from "../../baseWar/model/BwFogMap";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
// import TwnsRwWar            from "./RwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.HalfwayReplayWar {
    export class HrwFogMap extends Twns.BaseWar.BwFogMap {
        public startRunning(war: Twns.BaseWar.BwWar): void {
            this._setWar(war);

            const visibleTiles = WarVisibilityHelpers.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
            }
        }
    }
}

// export default TwnsHrwFogMap;
