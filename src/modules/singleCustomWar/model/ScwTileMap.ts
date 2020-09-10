
namespace TinyWars.SingleCustomWar {
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import WarSerialization = ProtoTypes.WarSerialization;
    import ISerialTileMap   = WarSerialization.ISerialTileMap;
    import ISerialTile      = WarSerialization.ISerialTile;

    export class ScwTileMap extends BaseWar.BwTileMap {
        protected _getBwTileClass(): new () => BaseWar.BwTile {
            return ScwTile;
        }
        protected _getViewClass(): new () => BaseWar.BwTileMapView {
            return ScwTileMapView;
        }

        public serialize(): ISerialTileMap | undefined {
            const mapSize = this.getMapSize();
            if (mapSize == null) {
                Logger.error(`ScwTileMap.serialize() empty mapSize.`);
                return undefined;
            }

            const map = this._getMap() as ScwTile[][];
            if (map == null) {
                Logger.error(`ScwTileMap.serialize() empty map.`);
                return undefined;
            }

            const { width, height } = mapSize;
            const tilesData         : ISerialTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = map[x][y].serialize();
                    if (tileData == null) {
                        Logger.error(`ScwTileMap.serialize() empty tileData.`);
                        return undefined;
                    }

                    tilesData.push(tileData);
                }
            }
            return { tiles: tilesData };
        }

        public serializeForSimulation(): ISerialTileMap | undefined {
            const mapSize = this.getMapSize();
            if (mapSize == null) {
                Logger.error(`ScwTileMap.serializeForSimulation() empty mapSize.`);
                return undefined;
            }

            const map = this._getMap() as ScwTile[][];
            if (map == null) {
                Logger.error(`ScwTileMap.serializeForSimulation() empty map.`);
                return undefined;
            }

            const { width, height } = mapSize;
            const tilesData         : ISerialTile[] = [];
            for (let x = 0; x < width; ++x) {
                for (let y = 0; y < height; ++y) {
                    const tileData = map[x][y].serializeForSimulation();
                    if (tileData == null) {
                        Logger.error(`ScwTileMap.serializeForSimulation() empty tileData.`);
                        return undefined;
                    }

                    tilesData.push(tileData);
                }
            }
            return { tiles: tilesData };
        }
    }
}
