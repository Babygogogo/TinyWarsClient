
import { BwTile }               from "../../baseWar/model/BwTile";
import * as CommonConstants     from "../../../utility/CommonConstants";
import { Types }                from "../../../utility/Types";

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
