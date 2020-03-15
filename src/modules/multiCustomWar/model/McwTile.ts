
namespace TinyWars.MultiCustomWar {
    import Types                = Utility.Types;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import SerializedBwTile     = Types.SerializedTile;
    import TileType             = Types.TileType;
    import BwHelpers            = BaseWar.BwHelpers;

    export class McwTile extends BaseWar.BwTile {
        protected _getViewClass(): new () => BaseWar.BwTileView {
            return McwTileView;
        }

        private _serialize(): SerializedBwTile | null {
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

            return BwHelpers.checkShouldSerializeTile(data, this.getInitialBaseViewId(), this.getInitialObjectViewId())
                ? data
                : null;
        }
        public serializeForSimulation(): SerializedBwTile | null {
            const userId = User.UserModel.getSelfUserId();
            if (VisibilityHelpers.checkIsTileVisibleToUser(this._getWar(), this.getGridIndex(), userId)) {
                return this._serialize();
            } else {
                if (this.getType() === TileType.Headquarters) {
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
