
namespace TinyWars.Replay {
    import VisibilityHelpers = Utility.VisibilityHelpers;

    export class ReplayFogMap extends BaseWar.BwFogMap {
        public startRunning(war: ReplayWar): void {
            this._setWar(war);

            const visibleTiles = VisibilityHelpers.getAllTilesVisibleToTeam(war, war.getPlayerInTurn().getTeamIndex());
            war.getTileMap().forEachTile(tile => {
                tile.setHasFog(!visibleTiles.has(tile));
            });
        }
    }
}
