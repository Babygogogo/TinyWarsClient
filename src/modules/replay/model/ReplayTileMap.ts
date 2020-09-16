
namespace TinyWars.Replay {

    export class ReplayTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return ReplayTile;
        }
        protected _getViewClass(): new () => BaseWar.BwTileMapView {
            return ReplayTileMapView;
        }
    }
}
