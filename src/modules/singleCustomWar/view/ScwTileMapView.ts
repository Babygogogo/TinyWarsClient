
namespace TinyWars.SingleCustomWar {
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import VisibilityHelpers    = Utility.VisibilityHelpers;

    export class ScwTileMapView extends BaseWar.BwTileMapView {
        public updateCoZone(): void {
            const tileMap                               = this._getTileMap();
            const war                                   = tileMap.getWar();
            const coZoneImages                          = this._getCoZoneImages();
            const teamIndexes                           = (war.getPlayerManager() as ScwPlayerManager).getWatcherTeamIndexesForScw();
            const { mapWidth, mapHeight, playersCount } = tileMap.getMapRawData();

            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                const matrix    = coZoneImages.get(playerIndex);
                const player    = war.getPlayer(playerIndex);
                const gridIndex = player.getCoGridIndexOnMap();
                const radius    = player.getCoZoneRadius();
                const unit      = gridIndex ? war.getUnitMap().getUnitOnMap(gridIndex) : null;
                const canShow   = (!!unit)
                    && (radius != null)
                    && (player.checkHasZoneSkillForCurrentSkills())
                    && (VisibilityHelpers.checkIsUnitOnMapVisibleToTeams(war, gridIndex, unit.getType(), unit.getIsDiving(), playerIndex, teamIndexes));

                for (let x = 0; x < mapWidth; ++x) {
                    for (let y = 0; y < mapHeight; ++y) {
                        matrix[x][y].visible = (canShow) && (radius >= GridIndexHelpers.getDistance({ x, y }, gridIndex));
                    }
                }
            }
        }
    }
}
