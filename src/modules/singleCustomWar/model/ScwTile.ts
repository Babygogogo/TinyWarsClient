
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
            }
        }

        public setFogDisabled(data?: Types.SerializedTile): void {
            if (this.getIsFogEnabled()) {
                this._setIsFogEnabled(false);
            }
        }
    }
}
