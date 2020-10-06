
namespace TinyWars.MapEditor {
    export class MeTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return MeTile;
        }
        protected _getViewClass(): new () => BaseWar.BwTileMapView {
            return MeTileMapView;
        }
    }
}
