
namespace TinyWars.SingleCustomWar {
    import GridIndexHelpers = Utility.GridIndexHelpers;

    export class ScwTileMapView extends BaseWar.BwTileMapView {
        public updateCoZone(): void {
            const tileMap                               = this._getTileMap();
            const war                                   = tileMap.getWar();
            const coZoneImages                          = this._getCoZoneImages();
            const { mapWidth, mapHeight, playersCount } = tileMap.getMapRawData();

            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                const matrix        = coZoneImages.get(playerIndex);
                const player        = war.getPlayer(playerIndex);
                const gridIndex     = player.getCoGridIndexOnMap();
                const radius        = player.getCoZoneRadius();
                const canShow       = (!!gridIndex) && (radius != null) && (player.checkHasZoneSkillForCurrentSkills());

                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        matrix[x][y].visible = (canShow) && (radius >= GridIndexHelpers.getDistance({ x, y }, gridIndex));
                    }
                }
            }
        }
    }
}
