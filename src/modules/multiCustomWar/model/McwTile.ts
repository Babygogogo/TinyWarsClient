
namespace TinyWars.MultiCustomWar {
    import Types            = Utility.Types;
    import SerializedBwTile = Types.SerializedTile;
    import TileType         = Types.TileType;

    export class McwTile extends BaseWar.BwTile {
        protected _getViewClass(): new () => BaseWar.BwTileView {
            return McwTileView;
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

        public setFogDisabled(data?: SerializedBwTile): void {
            if (this.getIsFogEnabled()) {
                this._setIsFogEnabled(false);

                const war           = this._getWar();
                const configVersion = this.getConfigVersion();
                if (data) {
                    this.init(data, configVersion);
                } else {
                    const tileMap   = war.getTileMap();
                    const gridIndex = this.getGridIndex();
                    this.init({
                        objectViewId        : tileMap.getInitialObjectViewId(gridIndex),
                        baseViewId          : tileMap.getInitialBaseViewId(gridIndex),
                        gridX               : gridIndex.x,
                        gridY               : gridIndex.y,
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
