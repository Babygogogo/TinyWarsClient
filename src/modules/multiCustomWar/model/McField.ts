

namespace TinyWars.MultiCustomWar {
    import Types                = Utility.Types;
    import SerializedMcField    = Types.SerializedMcField;

    export class McField {
        private _unitMap: McUnitMap;
        private _tileMap: McTileMap;
        private _fogMap : McFogMap;

        public constructor() {
        }

        public async init(data: SerializedMcField, configVersion: number, mapIndexKey: Types.MapIndexKey): Promise<McField> {
            this._setFogMap(await new McFogMap().init(data.fogMap, mapIndexKey));
            this._setTileMap(await new McTileMap().init(configVersion, mapIndexKey, data.tileMap));
            this._setUnitMap(await new McUnitMap().init(configVersion, mapIndexKey, data.unitMap));

            return this;
        }

        public startRunning(war: McWar): void {
            this.getTileMap().startRunning(war);
            this.getUnitMap().startRunning(war);
            this.getFogMap().startRunning(war);
        }

        public serialize(): SerializedMcField {
            return {
                fogMap  : this.getFogMap().serialize(),
                unitMap : this.getUnitMap().serialize(),
                tileMap : this.getTileMap().serialize(),
            };
        }
        public serializeForPlayer(playerIndex: number): SerializedMcField {
            return {
                fogMap  : this.getFogMap().serializeForPlayer(playerIndex),
                unitMap : this.getUnitMap().serializeForPlayer(playerIndex),
                tileMap : this.getTileMap().serializeForPlayer(playerIndex),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _setFogMap(map: McFogMap): void {
            this._fogMap = map;
        }
        public getFogMap(): McFogMap {
            return this._fogMap;
        }

        private _setTileMap(map: McTileMap): void {
            this._tileMap = map;
        }
        public getTileMap(): McTileMap {
            return this._tileMap;
        }

        private _setUnitMap(map: McUnitMap): void {
            this._unitMap = map;
        }
        public getUnitMap(): McUnitMap {
            return this._unitMap;
        }
    }
}

