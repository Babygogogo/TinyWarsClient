
namespace TinyWars.MultiCustomWar {
    import VisibilityHelpers        = Utility.VisibilityHelpers;

    export class McwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: McwWar): void {
            super.startRunning(war);

            const teamIndex = war.getPlayerLoggedIn().getTeamIndex();
            war.getTileMap().forEachTile(tile => {
                if (!VisibilityHelpers.checkIsTileVisibleToTeam(war, tile.getGridIndex(), teamIndex)) {
                    tile.setFogEnabled();
                }
            });
        }
    }
}
