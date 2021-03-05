
namespace TinyWars.SingleCustomWar {
    import Logger               = Utility.Logger;
    import Types                = Utility.Types;
    import VisibilityHelpers    = Utility.VisibilityHelpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import ConfigManager        = Utility.ConfigManager;
    import ISerialTile          = ProtoTypes.WarSerialization.ISerialTile;
    import CommonConstants      = Utility.CommonConstants;

    export class ScwTile extends BaseWar.BwTile {
        public serializeForSimulation(): ISerialTile | null {
            const war = this.getWar();
            if (VisibilityHelpers.checkIsTileVisibleToTeams(war, this.getGridIndex(), war.getPlayerManager().getAliveWatcherTeamIndexesForSelf())) {
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

                const playerIndex = this.getPlayerIndex();
                if (playerIndex == null) {
                    Logger.error(`ScwTile.serializeForSimulation() empty playerIndex.`);
                    return undefined;
                }

                const data: ISerialTile = {
                    gridIndex,
                    baseType,
                    objectType,
                    playerIndex : objectType === Types.TileObjectType.Headquarters ? playerIndex : CommonConstants.WarNeutralPlayerIndex,
                };

                const currentHp = this.getCurrentHp();
                (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

                const baseShapeId = this.getBaseShapeId();
                (baseShapeId !== 0) && (data.baseShapeId = baseShapeId);

                const objectShapeId = this.getObjectShapeId();
                (objectShapeId !== 0) && (data.objectShapeId = objectShapeId);

                return data;
            }
        }
    }
}
