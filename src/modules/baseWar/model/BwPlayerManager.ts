
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import TwnsBwPlayer         from "./BwPlayer";
// import TwnsBwWar            from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import WarSerialization         = CommonProto.WarSerialization;
    import ISerialPlayerManager     = WarSerialization.ISerialPlayerManager;
    import ISerialPlayer            = WarSerialization.ISerialPlayer;
    import PlayerAliveState         = Types.PlayerAliveState;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import BwWar                    = BaseWar.BwWar;
    import GameConfig               = Config.GameConfig;

    export abstract class BwPlayerManager {
        private _players        = new Map<number, BaseWar.BwPlayer>();
        private _war?           : BwWar;

        public abstract getWatcherTeamIndexesForSelf(): Set<number>;

        public init(data: Types.Undefinable<ISerialPlayerManager>, gameConfig: GameConfig): void {
            if (data == null) {
                throw Helpers.newError(`Empty data.`, ClientErrorCode.BwPlayerManager_Init_00);
            }

            const playerArray = data.players;
            if ((!playerArray)                                              ||
                (playerArray.length < 3)                                    ||
                (playerArray.length > CommonConstants.WarMaxPlayerIndex + 1)
            ) {
                throw Helpers.newError(`Invalid playerArray.`, ClientErrorCode.BwPlayerManager_Init_01);
            }

            const newPlayerMap  = new Map<number, BaseWar.BwPlayer>();
            const skinIdSet     = new Set<number>();
            for (const playerData of playerArray) {
                const playerIndex = playerData.playerIndex;
                if ((playerIndex == null) || (newPlayerMap.has(playerIndex))) {
                    throw Helpers.newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwPlayerManager_Init_02);
                }

                const skinId = playerData.unitAndTileSkinId;
                if ((skinId == null) || (skinIdSet.has(skinId))) {
                    throw Helpers.newError(`Invalid skinId: ${skinId}`, ClientErrorCode.BwPlayerManager_Init_03);
                }
                skinIdSet.add(skinId);

                const player = new BaseWar.BwPlayer();
                player.init(playerData, gameConfig);

                newPlayerMap.set(playerIndex, player);
            }

            if (!newPlayerMap.has(CommonConstants.WarNeutralPlayerIndex)) {
                throw Helpers.newError(`No WarNeutralPlayerIndex.`, ClientErrorCode.BwPlayerManager_Init_04);
            }

            for (const [playerIndex] of newPlayerMap) {
                if ((playerIndex > CommonConstants.WarNeutralPlayerIndex) && (!newPlayerMap.has(playerIndex - 1))) {
                    throw Helpers.newError(`Non-continuous`, ClientErrorCode.BwPlayerManager_Init_05);
                }
            }

            if ((newPlayerMap.size < 3) || (newPlayerMap.size > CommonConstants.WarMaxPlayerIndex + 1)) {
                throw Helpers.newError(`Invalid playersCount: ${newPlayerMap.size}`, ClientErrorCode.BwPlayerManager_Init_06);
            }

            const playerMap = this.getAllPlayersDict();
            playerMap.clear();
            for (const [playerIndex, player] of newPlayerMap) {
                playerMap.set(playerIndex, player);
            }
        }
        public fastInit(data: ISerialPlayerManager, gameConfig: GameConfig): void {
            for (const playerData of data ? data.players || [] : []) {
                const playerIndex   = Helpers.getExisted(playerData.playerIndex, ClientErrorCode.BwPlayerManager_FastInit_00);
                const player        = Helpers.getExisted(this.getPlayer(playerIndex), ClientErrorCode.BwPlayerManager_FastInit_01);
                player.init(playerData, gameConfig);
            }
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
            for (const [, player] of this._players) {
                player.startRunning(war);
            }
        }

        public serialize(): ISerialPlayerManager {
            const players: ISerialPlayer[] = [];
            for (const [, player] of this.getAllPlayersDict()) {
                players.push(player.serialize());
            }

            return { players };
        }
        public serializeForCreateSfw(): ISerialPlayerManager {
            const players: ISerialPlayer[] = [];
            for (const [, player] of this.getAllPlayersDict()) {
                players.push(player.serializeForCreateSfw());
            }

            return { players };
        }
        public serializeForCreateMfr(): ISerialPlayerManager {
            const players: ISerialPlayer[] = [];
            for (const [, player] of this.getAllPlayersDict()) {
                players.push(player.serializeForCreateMfr());
            }

            return { players };
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        protected _getWar(): BwWar {
            return Helpers.getExisted(this._war);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // The other public functions.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayer(playerIndex: number): BaseWar.BwPlayer {
            return Helpers.getExisted(this._players.get(playerIndex));
        }
        public getAllPlayersDict(): Map<number, BaseWar.BwPlayer> {
            return this._players;
        }
        public getAllPlayers(): BaseWar.BwPlayer[] {
            const players: BaseWar.BwPlayer[] = [];
            for (const [, player] of this.getAllPlayersDict()) {
                players.push(player);
            }
            return players;
        }

        public getPlayerByUserId(userId: number): BaseWar.BwPlayer | null {
            for (const [, player] of this._players) {
                if (player.getUserId() === userId) {
                    return player;
                }
            }
            return null;
        }

        public getPlayerInTurn(): BaseWar.BwPlayer {
            return this.getPlayer(this._getWar().getPlayerIndexInTurn());
        }

        public getTeamIndex(playerIndex: number): number {
            return this.getPlayer(playerIndex).getTeamIndex();
        }

        public getPlayerIndexesInTeam(teamIndex: number): number[] {
            const playerIndexes: number[] = [];
            for (const [playerIndex, player] of this._players) {
                if (player.getTeamIndex() === teamIndex) {
                    playerIndexes.push(playerIndex);
                }
            }
            return playerIndexes;
        }
        public getPlayerIndexesInTeams(teamIndexes: Set<number>): Set<number> {
            const playerIndexes = new Set<number>();
            for (const [playerIndex, player] of this._players) {
                if (teamIndexes.has(player.getTeamIndex())) {
                    playerIndexes.add(playerIndex);
                }
            }
            return playerIndexes;
        }

        public getTotalPlayersCount(includeNeutral: boolean): number {
            return includeNeutral ? this._players.size : this._players.size - 1;
        }

        public getAlivePlayersCount(includeNeutral: boolean): number {
            let count = 0;
            for (const [playerIndex, player] of this._players) {
                if ((player.getAliveState() !== PlayerAliveState.Dead)                          &&
                    ((includeNeutral) || (playerIndex !== CommonConstants.WarNeutralPlayerIndex))
                ) {
                    ++count;
                }
            }
            return count;
        }

        public getAliveOrDyingTeamsCount(includeNeutral: boolean): number {
            const teamIndexes = new Set<number>();
            for (const [playerIndex, player] of this._players) {
                const aliveState = player.getAliveState();
                if (((aliveState === PlayerAliveState.Alive) || (aliveState === PlayerAliveState.Dying))   &&
                    ((includeNeutral) || (playerIndex !== CommonConstants.WarNeutralPlayerIndex))
                ) {
                    teamIndexes.add(player.getTeamIndex());
                }
            }
            return teamIndexes.size;
        }

        public getAliveTeamIndexes(includeNeutral: boolean, ignoredPlayerIndex?: number): Set<number> {
            const indexes = new Set<number>();
            for (const [playerIndex, player] of this._players) {
                if ((player.getAliveState() !== PlayerAliveState.Dead)  &&
                    (playerIndex !== ignoredPlayerIndex)                &&
                    ((includeNeutral) || (playerIndex !== 0))
                ) {
                    const teamIndex = player.getTeamIndex();
                    if (teamIndex == null) {
                        throw Helpers.newError(`BwPlayerManager.getAliveTeamIndexes() empty teamIndex.`);
                    } else {
                        indexes.add(teamIndex);
                    }
                }
            }
            return indexes;
        }

        public checkIsSameTeam(playerIndex1: number, playerIndex2: number): boolean {
            const p1 = this._players.get(playerIndex1);
            const p2 = this._players.get(playerIndex2);
            return (p1 != null) && (p2 != null) && (p1.getTeamIndex() === p2.getTeamIndex());
        }

        public forEachPlayer(includeNeutral: boolean, func: (p: BaseWar.BwPlayer) => void): void {
            for (const [playerIndex, player] of this._players) {
                ((includeNeutral) || (playerIndex !== 0)) && (func(player));
            }
        }

        public checkHasAliveWatcherTeam(watcherUserId: number): boolean {
            for (const [playerIndex, player] of this._players) {
                if ((playerIndex !== CommonConstants.WarNeutralPlayerIndex) &&
                    (player.getAliveState() !== PlayerAliveState.Dead)
                ) {
                    if ((player.getUserId() === watcherUserId) || (player.getWatchOngoingSrcUserIds().has(watcherUserId))) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
}

// export default TwnsBwPlayerManager;
