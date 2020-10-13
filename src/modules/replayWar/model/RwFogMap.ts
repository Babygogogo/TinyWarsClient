
namespace TinyWars.ReplayWar {
    import VisibilityHelpers = Utility.VisibilityHelpers;

    export class RwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: RwWar): void {
            this._setWar(war);

            const visibleTiles = VisibilityHelpers.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            war.getTileMap().forEachTile(tile => {
                tile.setHasFog(!visibleTiles.has(tile));
            });
        }
    }
}
