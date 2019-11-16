
namespace TinyWars.SingleCustomWar {
    import VisibilityHelpers        = Utility.VisibilityHelpers;

    export class ScwFogMap extends BaseWar.BwFogMap {
        public startRunning(war: ScwWar): void {
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
