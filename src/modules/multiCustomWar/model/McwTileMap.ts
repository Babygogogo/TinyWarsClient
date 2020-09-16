
namespace TinyWars.MultiCustomWar {

    export class McwTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return McwTile;
        }
        protected _getViewClass(): new () => BaseWar.BwTileMapView {
            return McwTileMapView;
        }
    }
}
