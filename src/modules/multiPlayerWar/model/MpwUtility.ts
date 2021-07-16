
import TwnsBwTile       from "../../baseWar/model/BwTile";
import CommonConstants  from "../../tools/helpers/CommonConstants";
import Types            from "../../tools/helpers/Types";

namespace MpwUtility {
    import BwTile = TwnsBwTile.BwTile;

    export function resetTileDataAsHasFog(tile: BwTile): void {
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

export default MpwUtility;
