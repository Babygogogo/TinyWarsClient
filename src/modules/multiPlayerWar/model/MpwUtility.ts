
namespace TinyWars.MultiPlayerWar.MpwUtility {
    import Types                = Utility.Types;
    import CommonConstants      = Utility.CommonConstants;

    export function resetTileDataAsHasFog(tile: BaseWar.BwTile): void {
        tile.setHasFog(true);

        tile.deserialize({
            gridIndex       : tile.getGridIndex(),
            baseType        : tile.getBaseType(),
            objectType      : tile.getObjectType(),
            playerIndex     : tile.getType() === Types.TileType.Headquarters ? tile.getPlayerIndex() : CommonConstants.WarNeutralPlayerIndex,
            baseShapeId     : tile.getBaseShapeId(),
            objectShapeId   : tile.getObjectShapeId(),
            currentHp       : tile.getCurrentHp(),
        }, tile.getConfigVersion());
    }
}
