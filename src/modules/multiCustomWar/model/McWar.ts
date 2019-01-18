
namespace TinyWars.MultiCustomWar {
    export class McWar {
        private _playerManager  : McPlayerManager;
        private _unitMap        : McUnitMap;
        private _tileMap        : McTileMap;

        public constructor() {
        }

        public getPlayerManager(): McPlayerManager {
            return this._playerManager;
        }
        public getPlayer(playerIndex: number): McPlayer | undefined {
            return this.getPlayerManager().getPlayer(playerIndex);
        }

        public getUnitMap(): McUnitMap {
            return this._unitMap;
        }
        public getTileMap(): McTileMap {
            return this._tileMap;
        }
    }
}
