
namespace TinyWars.MultiCustomWar {
    export class McWar {
        private _playerManager  : McPlayerManager;
        private _unitMap        : McUnitMap;
        private _tileMap        : McTileMap;
        private _fogMap         : McFogMap;

        private _isEnded        = false;

        public constructor() {
        }

        public getSettingsHasFog(): boolean {
            return false;
        }
        public getSettingsIncomeModifier(): number {
            return 0;
        }

        public setIsEnded(ended: boolean): void {
            this._isEnded = ended;
        }
        public getIsEnded(): boolean {
            return this._isEnded;
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
        public getFogMap(): McFogMap {
            return this._fogMap;
        }
    }
}
