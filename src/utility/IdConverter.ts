
namespace Utility {
    import TileBaseType   = Types.TileBaseType;
    import TileObjectType = Types.TileObjectType;

    type TileObjectTypeAndPlayerIndex = {
        tileObjectType: TileObjectType;
        playerIndex   : number;
    }

    export namespace IdConverter {
        export function getTileBaseType(tileBaseViewId: number): TileBaseType {
            // TODO
            return TileBaseType.Plain;
        }

        export function getTileObjectTypeAndPlayerIndex(tileObjectViewId: number): TileObjectTypeAndPlayerIndex {
            // TODO
            return {
                tileObjectType: TileObjectType.Empty,
                playerIndex   : 0,
            };
        }
    }
}
