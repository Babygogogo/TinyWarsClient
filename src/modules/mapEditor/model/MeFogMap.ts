
namespace TinyWars.MapEditor {
    export class MeFogMap extends BaseWar.BwFogMap {
        public startRunning(war: MeWar): void {
            this._setWar(war);

            war.getTileMap().forEachTile(tile => {
                tile.setHasFog(false);
            });
        }
    }
}
