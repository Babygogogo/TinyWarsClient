
namespace TinyWars.SingleCustomWar {
    export class ScwTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return ScwTile;
        }
    }
}
