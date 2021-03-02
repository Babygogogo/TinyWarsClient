
namespace TinyWars.MultiPlayerWar {
    export class MpwTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return MpwTile;
        }
    }
}
