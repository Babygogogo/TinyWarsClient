
namespace TinyWars.MultiPlayerWar {
    import Types            = Utility.Types;
    import CommonConstants  = Utility.CommonConstants;
    import TileType         = Types.TileType;

    export class MpwTile extends BaseWar.BwTile {
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
