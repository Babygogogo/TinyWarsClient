
namespace TinyWars.TestWar {
    export class TwTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return TwTile;
        }
    }
}
