
namespace TinyWars.SingleCustomWar {
    import Logger               = Utility.Logger;
    import Types                = Utility.Types;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import BwHelpers            = BaseWar.BwHelpers;
    import ISerialTile          = ProtoTypes.WarSerialization.ISerialTile;

    export class ScwTile extends BaseWar.BwTile {
        protected _getViewClass(): new () => BaseWar.BwTileView {
            return ScwTileView;
        }

        public serialize(): ISerialTile | undefined {
            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`ScwTile.serialize() empty gridIndex.`);
                return undefined;
            }

            const baseType = this.getBaseType();
            if (baseType == null) {
                Logger.error(`ScwTile.serialize() empty baseType.`);
                return undefined;
            }

            const objectType = this.getObjectType();
            if (objectType == null) {
                Logger.error(`ScwTile.serialize() empty objectType.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`ScwTile.serialize() empty playerIndex.`);
                return undefined;
            }

            const data: ISerialTile = {
                gridIndex,
                baseType,
                objectType,
                playerIndex,
            };

            const currentHp = this.getCurrentHp();
            (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

            const buildPoint = this.getCurrentBuildPoint();
            (buildPoint !== this.getMaxBuildPoint()) && (data.currentBuildPoint = buildPoint);

            const capturePoint = this.getCurrentCapturePoint();
            (capturePoint !== this.getMaxCapturePoint()) && (data.currentCapturePoint = capturePoint);

            const baseShapeId = this.getBaseShapeId();
            (baseShapeId !== 0) && (data.baseShapeId = baseShapeId);

            const objectShapeId = this.getObjectShapeId();
            (objectShapeId !== 0) && (data.objectShapeId = objectShapeId);

            return data;
        }

        public serializeForSimulation(): ISerialTile | null {
            const userId = User.UserModel.getSelfUserId();
            if (VisibilityHelpers.checkIsTileVisibleToUser(this.getWar(), this.getGridIndex(), userId)) {
                const data = this.serialize();
                if (data == null) {
                    Logger.error(`ScwTile.serializeForSimulation() empty data.`);
                    return undefined;
                }
                return data;

            } else {
                const gridIndex = this.getGridIndex();
                if (gridIndex == null) {
                    Logger.error(`ScwTile.serializeForSimulation() empty gridIndex.`);
                    return undefined;
                }

                const baseType = this.getBaseType();
                if (baseType == null) {
                    Logger.error(`ScwTile.serializeForSimulation() empty baseType.`);
                    return undefined;
                }

                const objectType = this.getObjectType();
                if (objectType == null) {
                    Logger.error(`ScwTile.serializeForSimulation() empty objectType.`);
                    return undefined;
                }

                if (this.getType() === Types.TileType.Headquarters) {
                    const data: ISerialTile = {
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
                        const data: ISerialTile = {
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
                        const data      : ISerialTile = {
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

        public setFogDisabled(data?: ISerialTile): void {
            if (this.getIsFogEnabled()) {
                this._setIsFogEnabled(false);
            }
        }
    }
}
