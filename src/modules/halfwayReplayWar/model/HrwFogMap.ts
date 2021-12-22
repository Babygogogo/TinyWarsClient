
// import TwnsBwFogMap         from "../../baseWar/model/BwFogMap";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
// import TwnsRwWar            from "./RwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsHrwFogMap {
    export class HrwFogMap extends TwnsBwFogMap.BwFogMap {
        public startRunning(war: TwnsBwWar.BwWar): void {
            this._setWar(war);

            const visibleTiles = WarVisibilityHelpers.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
            }
        }
    }
}

// export default TwnsHrwFogMap;
