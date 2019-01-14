
namespace TinyWars.MultiCustomWar {
    export class McWar {
        private _playerManager  : McPlayerManager;

        public constructor() {
        }

        public getPlayerManager(): McPlayerManager {
            return this._playerManager;
        }
        public getPlayer(playerIndex: number): McPlayer | undefined {
            return this.getPlayerManager().getPlayer(playerIndex);
        }
    }
}
