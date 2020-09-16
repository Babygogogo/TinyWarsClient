
namespace TinyWars.SingleCustomWar {
    import ProtoTypes           = Utility.ProtoTypes;
    import Logger               = Utility.Logger;
    import WarSerialization     = ProtoTypes.WarSerialization;
    import ISerialPlayerManager = WarSerialization.ISerialPlayerManager;
    import ISerialPlayer        = WarSerialization.ISerialPlayer;

    export class ScwPlayerManager extends BaseWar.BwPlayerManager {
        public serialize(): ISerialPlayerManager | undefined {
            const players: ISerialPlayer[] = [];
            for (const [, player] of this._getPlayersMap()) {
                const serialPlayer = (player as ScwPlayer).serialize();
                if (serialPlayer == null) {
                    Logger.error(`ScwPlayerManager.serialize() empty serialPlayer.`);
                    return undefined;
                }

                players.push(serialPlayer);
            }

            return { players };
        }
        public serializeForSimulation(): ISerialPlayerManager | undefined {
            const players: ISerialPlayer[] = [];
            for (const [, player] of this._getPlayersMap()) {
                const serialPlayer = (player as ScwPlayer).serializeForSimulation();
                if (serialPlayer == null) {
                    Logger.error(`ScwPlayerManager.serialize() empty serialPlayer.`);
                    return undefined;
                }

                players.push(serialPlayer);
            }

            return { players };
        }

        protected _getPlayerClass(): new () => BaseWar.BwPlayer {
            return ScwPlayer;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getHumanPlayers(): ScwPlayer[] {
            const players: ScwPlayer[] = [];
            for (const [, player] of this._getPlayersMap()) {
                if (player.getUserId() != null) {
                    players.push(player as ScwPlayer);
                }
            }
            return players;
        }

        public getHumanPlayerIndexes(): number[] {
            const playerIndexes: number[] = [];
            for (const player of this.getHumanPlayers()) {
                playerIndexes.push(player.getPlayerIndex());
            }
            return playerIndexes;
        }

        public getWatcherTeamIndexesForSelf(): Set<number> {
            const humanPlayers = this.getHumanPlayers();
            if (!humanPlayers.length) {
                return this.getAliveTeamIndexes(false);
            } else {
                return this.getWatcherTeamIndexes(User.UserModel.getSelfUserId());
                // const player = this.getPlayerInTurn();
                // if (player.getUserId() != null) {
                //     return new Set<number>([player.getTeamIndex()]);
                // } else {
                //     const teamIndexes = new Set<number>();
                //     for (const player of humanPlayers) {
                //         teamIndexes.add(player.getTeamIndex());
                //     }
                //     if (teamIndexes.size <= 1) {
                //         return teamIndexes;
                //     } else {
                //         return new Set<number>();
                //     }
                // }
            }
        }
    }
}
