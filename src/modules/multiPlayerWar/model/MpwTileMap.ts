
namespace TinyWars.MultiPlayerWar {
    export class MpwTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return MpwTile;
        }
        protected _getViewClass(): new () => BaseWar.BwTileMapView {
            return McwTileMapView;
        }
    }
}
