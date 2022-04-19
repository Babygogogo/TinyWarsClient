
// import TwnsBwFogMap     from "../../baseWar/model/BwFogMap";
// import TwnsBwWar        from "../../baseWar/model/BwWar";
// import ProtoTypes       from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers from "../../tools/warHelpers/WarCommonHelpers";
// import TwnsMeField      from "./MeField";

namespace TwnsMeFogMap {
    import WarSerialization         = CommonProto.WarSerialization;
    import ISerialFogMap            = WarSerialization.ISerialFogMap;
    import IDataForFogMapFromPath   = WarSerialization.IDataForFogMapFromPath;

    export class MeFogMap extends Twns.BaseWar.BwFogMap {
        public serializeForCreateSfw(): ISerialFogMap {
            const mapSize           = this.getMapSize();
            const maxPlayerIndex    = (this._getWar().getField() as TwnsMeField.MeField).getMaxPlayerIndex();
            const serialMapsFromPath: IDataForFogMapFromPath[] = [];
            for (const [playerIndex, map] of this._getAllMapsFromPath()) {
                if (playerIndex > maxPlayerIndex) {
                    continue;
                }

                const visibilityArray = Twns.WarHelpers.WarCommonHelpers.getVisibilityArrayWithMapFromPath(map, mapSize);
                if (visibilityArray != null) {
                    serialMapsFromPath.push({
                        playerIndex,
                        visibilityArray,
                    });
                }
            }

            return {
                forceFogCode            : this.getForceFogCode(),
                forceExpirePlayerIndex  : this.getForceExpirePlayerIndex(),
                forceExpireTurnIndex    : this.getForceExpireTurnIndex(),
                mapsFromPath            : serialMapsFromPath,
            };
        }

        public startRunning(war: Twns.BaseWar.BwWar): void {
            this._setWar(war);

            for (const tile of war.getTileMap().getAllTiles()) {
                tile.setHasFog(false);
            }
        }
    }
}

// export default TwnsMeFogMap;
