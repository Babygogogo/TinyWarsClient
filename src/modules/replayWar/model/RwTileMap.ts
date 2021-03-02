
namespace TinyWars.ReplayWar {

    export class RwTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return RwTile;
        }
    }
}
