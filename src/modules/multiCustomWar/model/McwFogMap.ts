
namespace TinyWars.MultiCustomWar {
    import VisibilityHelpers        = Utility.VisibilityHelpers;

    export class McwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: McwWar): void {
            super.startRunning(war);

            const playerIndex = war.getPlayerIndexLoggedIn();
            war.getTileMap().forEachTile(tile => {
                if (!VisibilityHelpers.checkIsTileVisibleToPlayer(war, tile.getGridIndex(), playerIndex)) {
                    tile.setFogEnabled();
                }
            });
        }
    }
}
