
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.ReplayWar {
    import VisibilityHelpers = Utility.VisibilityHelpers;

    export class RwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: RwWar): void {
            this._setWar(war);

            const visibleTiles = VisibilityHelpers.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(!visibleTiles.has(tile));
            }
        }
    }
}
