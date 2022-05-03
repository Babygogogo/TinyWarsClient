
// import TwnsBwTile       from "../../baseWar/model/BwTile";
// import CommonConstants  from "../../tools/helpers/CommonConstants";
// import Types            from "../../tools/helpers/Types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MultiPlayerWar.MpwUtility {
    import BwTile = Twns.BaseWar.BwTile;

    export function resetTileDataAsHasFog(tile: BwTile): void {
        tile.setHasFog(true);

        tile.deserialize({
            gridIndex       : tile.getGridIndex(),
            baseType        : tile.getBaseType(),
            decoratorType   : tile.getDecoratorType(),
            objectType      : tile.getObjectType(),
            playerIndex     : tile.getType() === Types.TileType.Headquarters ? tile.getPlayerIndex() : CommonConstants.WarNeutralPlayerIndex,
            baseShapeId     : tile.getBaseShapeId(),
            decoratorShapeId: tile.getDecoratorShapeId(),
            objectShapeId   : tile.getObjectShapeId(),
            currentHp       : tile.getCurrentHp(),
            locationFlags   : tile.getLocationFlags(),
            isHighlighted   : tile.getIsHighlighted(),
        }, tile.getGameConfig());
    }
}

// export default MpwUtility;
