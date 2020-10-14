
namespace TinyWars.MultiPlayerWar {
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import TileType         = Types.TileType;
    import ISerialTile      = ProtoTypes.WarSerialization.ISerialTile;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export class MpwTile extends BaseWar.BwTile {
        protected _getViewClass(): new () => BaseWar.BwTileView {
            return McwTileView;
        }

        public serializeForSimulation(): ISerialTile | null {
            return this.serialize();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for fog.
        ////////////////////////////////////////////////////////////////////////////////
        public resetDataAsHasFog(): void {
            this.setHasFog(true);

            this.deserialize({
                gridIndex       : this.getGridIndex(),
                baseType        : this.getBaseType(),
                objectType      : this.getObjectType(),
                playerIndex     : this.getType() === TileType.Headquarters ? this.getPlayerIndex() : CommonConstants.WarNeutralPlayerIndex,
                baseShapeId     : this.getBaseShapeId(),
                objectShapeId   : this.getObjectShapeId(),
                currentHp       : this.getCurrentHp(),
            }, this.getConfigVersion());
        }
    }
}
