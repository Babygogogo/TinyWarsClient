
namespace TinyWars.SingleCustomWar {
    import Types            = Utility.Types;
    import TileType         = Types.TileType;

    export class ScwTile extends BaseWar.BwTile {
        protected _getViewClass(): new () => BaseWar.BwTileView {
            return ScwTileView;
        }

        public serialize(): Types.SerializedTile | null {
            const data: Types.SerializedTile = {
                gridX         : this.getGridX(),
                gridY         : this.getGridY(),
                baseViewId    : this.getBaseViewId(),
                objectViewId  : this.getObjectViewId(),
            };

            const currentHp = this.getCurrentHp();
            (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

            const buildPoint = this.getCurrentBuildPoint();
            (buildPoint !== this.getMaxBuildPoint()) && (data.currentBuildPoint = buildPoint);

            const capturePoint = this.getCurrentCapturePoint();
            (capturePoint !== this.getMaxCapturePoint()) && (data.currentCapturePoint = capturePoint);

            return ScwHelpers.checkShouldSerializeTile(data, this._getWar().getTileMap().getMapRawData())
                ? data
                : null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for fog.
        ////////////////////////////////////////////////////////////////////////////////
        public setFogEnabled(): void {
            if (!this.getIsFogEnabled()) {
                this._setIsFogEnabled(true);

                const currentHp = this.getCurrentHp();
                this.init({
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    objectViewId: this.getType() === TileType.Headquarters ? this.getObjectViewId() : this.getNeutralObjectViewId(),
                    baseViewId  : this.getBaseViewId(),
                }, this.getConfigVersion());

                this.startRunning(this._getWar());
                this.setCurrentBuildPoint(this.getMaxBuildPoint());
                this.setCurrentCapturePoint(this.getMaxCapturePoint());
                this.setCurrentHp(currentHp);
            }
        }

        public setFogDisabled(data?: Types.SerializedTile): void {
            if (this.getIsFogEnabled()) {
                this._setIsFogEnabled(false);

                const war           = this._getWar();
                const configVersion = this.getConfigVersion();
                if (data) {
                    this.init(data, configVersion);
                } else {
                    const tileMap   = war.getTileMap();
                    const mapData   = tileMap.getMapRawData();
                    const gridX     = this.getGridX();
                    const gridY     = this.getGridY();
                    const index     = gridX + gridY * tileMap.getMapSize().width;
                    this.init({
                        objectViewId: mapData.tileObjects[index],
                        baseViewId  : mapData.tileBases[index],
                        gridX,
                        gridY,
                        currentHp           : this.getCurrentHp(),
                        currentBuildPoint   : this.getCurrentBuildPoint(),
                        currentCapturePoint : this.getCurrentCapturePoint(),
                    }, configVersion);
                }

                this.startRunning(war);
            }
        }
    }
}
