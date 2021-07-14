
import TwnsBwWar                        from "../../baseWar/model/BwWar";
import BwFogMap = TwnsBwFogMap.BwFogMap;import TwnsBwFogMap                     from "../../baseWar/model/BwFogMap";
import { MeField }                      from "./MeField";
import Logger                       from "../../tools/helpers/Logger";
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import BwHelpers                    from "../../baseWar/model/BwHelpers";
import WarSerialization                 = ProtoTypes.WarSerialization;
import ISerialFogMap                    = WarSerialization.ISerialFogMap;
import IDataForFogMapFromPath           = WarSerialization.IDataForFogMapFromPath;
import BwWar            = TwnsBwWar.BwWar;

export class MeFogMap extends BwFogMap {
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

            const visibilityArray = BwHelpers.getVisibilityArrayWithMapFromPath(map, mapSize);
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

    public startRunning(war: BwWar): void {
        this._setWar(war);

        for (const tile of war.getTileMap().getAllTiles()) {
            tile.setHasFog(false);
        }
    }
}
