
namespace TinyWars.MultiCustomWar {
    import VisibilityHelpers        = Utility.VisibilityHelpers;

    export class McwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: McwWar): void {
            super.startRunning(war);

            const userId = User.UserModel.getSelfUserId();
            war.getTileMap().forEachTile(tile => {
                if (!VisibilityHelpers.checkIsTileVisibleToUser(war, tile.getGridIndex(), userId)) {
                    tile.setFogEnabled();
                }
            });
        }
    }
}
