
namespace TinyWars.SingleCustomWar {
    import Types                = Utility.Types;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import BwHelpers            = BaseWar.BwHelpers;
    import SerializedBwTile     = Types.SerializedTile;

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

            return BwHelpers.checkShouldSerializeTile(data, this.getInitialBaseViewId(), this.getInitialObjectViewId())
                ? data
                : null;
        }

        public serializeForSimulation(): SerializedBwTile | null {
            const userId = User.UserModel.getSelfUserId();
            if (VisibilityHelpers.checkIsTileVisibleToUser(this.getWar(), this.getGridIndex(), userId)) {
                return this.serialize();
            } else {
                if (this.getType() === Types.TileType.Headquarters) {
                    const data: SerializedBwTile = {
                        gridX       : this.getGridX(),
                        gridY       : this.getGridY(),
                        baseViewId  : this.getBaseViewId(),
                        objectViewId: this.getObjectViewId(),
                    };
                    return BwHelpers.checkShouldSerializeTile(data, this.getInitialBaseViewId(), this.getInitialObjectViewId())
                        ? data
                        : null;

                } else {
                    if (this.getPlayerIndex() !== 0) {
                        const data: SerializedBwTile = {
                            gridX       : this.getGridX(),
                            gridY       : this.getGridY(),
                            baseViewId  : this.getBaseViewId(),
                            objectViewId: this.getNeutralObjectViewId(),
                        };
                        return BwHelpers.checkShouldSerializeTile(data, this.getInitialBaseViewId(), this.getInitialObjectViewId())
                            ? data
                            : null;

                    } else {
                        const currentHp = this.getCurrentHp();
                        const data      : SerializedBwTile = {
                            gridX       : this.getGridX(),
                            gridY       : this.getGridY(),
                            baseViewId  : this.getBaseViewId(),
                            objectViewId: this.getObjectViewId(),
                            currentHp   : currentHp == this.getMaxHp() ? undefined : currentHp,
                        };
                        return BwHelpers.checkShouldSerializeTile(data, this.getInitialBaseViewId(), this.getInitialObjectViewId())
                            ? data
                            : null;
                    }
                }
            }
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
