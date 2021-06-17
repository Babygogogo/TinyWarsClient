
namespace TinyWars.MapEditor {
    import Logger                   = Utility.Logger;
    import ProtoTypes               = Utility.ProtoTypes;
    import WarSerialization         = ProtoTypes.WarSerialization;
    import ISerialFogMap            = WarSerialization.ISerialFogMap;
    import IDataForFogMapFromPath   = WarSerialization.IDataForFogMapFromPath;

    export class MeFogMap extends BaseWar.BwFogMap {
        public serializeForCreateSfw(): ISerialFogMap | undefined {
            const mapSize = this.getMapSize();
            if (mapSize == null) {
                Logger.error(`MeFogMap.serializeForCreateSfw() empty mapSize.`);
                return undefined;
            }

            const allMapsFromPath = this._getAllMapsFromPath();
            if (allMapsFromPath == null) {
                Logger.error(`MeFogMap.serializeForCreateSfw() empty allMapsFromPath.`);
                return undefined;
            }

            const forceFogCode = this.getForceFogCode();
            if (forceFogCode == null) {
                Logger.error(`MeFogMap.serializeForCreateSfw() empty forceFogCode.`);
                return undefined;
            }

            const maxPlayerIndex    = (this._getWar().getField() as MeField).getMaxPlayerIndex();
            const serialMapsFromPath: IDataForFogMapFromPath[] = [];
            for (const [playerIndex, map] of allMapsFromPath) {
                if (playerIndex > maxPlayerIndex) {
                    continue;
                }

                const visibilityArray = BaseWar.BwHelpers.getVisibilityArrayWithMapFromPath(map, mapSize);
                if (visibilityArray != null) {
                    serialMapsFromPath.push({
                        playerIndex,
                        visibilityArray,
                    });
                }
            }

            return {
                forceFogCode,
                forceExpirePlayerIndex  : this.getForceExpirePlayerIndex(),
                forceExpireTurnIndex    : this.getForceExpireTurnIndex(),
                mapsFromPath            : serialMapsFromPath,
            };
        }

        public startRunning(war: BaseWar.BwWar): void {
            this._setWar(war);

            war.getTileMap().forEachTile(tile => {
                tile.setHasFog(false);
            });
        }
    }
}
