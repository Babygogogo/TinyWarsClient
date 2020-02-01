
namespace TinyWars.Replay {
    import Types                = Utility.Types;
    import SerializedBwTile     = Types.SerializedTile;

    export class ReplayTile extends BaseWar.BwTile {
        protected _getViewClass(): new () => BaseWar.BwTileView {
            return ReplayTileView;
        }

        public serialize(): SerializedBwTile | null {
            const data: SerializedBwTile = {
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

            return ReplayHelpers.checkShouldSerializeTile(data, this._getWar().getTileMap().getMapRawData())
                ? data
                : null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for fog.
        ////////////////////////////////////////////////////////////////////////////////
        public setFogEnabled(): void {
            if (!this.getIsFogEnabled()) {
                this._setIsFogEnabled(true);

                this.startRunning(this._getWar());
            }
        }

        public setFogDisabled(data?: SerializedBwTile): void {
            if (this.getIsFogEnabled()) {
                this._setIsFogEnabled(false);

                if (data) {
                    this.init(data, this.getConfigVersion());
                }

                this.startRunning(this._getWar());
            }
        }
    }
}
