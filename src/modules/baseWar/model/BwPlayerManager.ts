
import TwnsBwPlayer             from "./BwPlayer";
import TwnsBwWar                from "./BwWar";
import TwnsClientErrorCode      from "../../tools/helpers/ClientErrorCode";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import Logger               from "../../tools/helpers/Logger";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import Types                from "../../tools/helpers/Types";
import WarSerialization         = ProtoTypes.WarSerialization;
import ISerialPlayerManager     = WarSerialization.ISerialPlayerManager;
import ISerialPlayer            = WarSerialization.ISerialPlayer;
import PlayerAliveState         = Types.PlayerAliveState;
import ClientErrorCode = TwnsClientErrorCode.ClientErrorCode;
import BwWar            = TwnsBwWar.BwWar;

export abstract class BwPlayerManager {
    private _players        = new Map<number, TwnsBwPlayer.BwPlayer>();
    private _war            : BwWar | undefined;

    public abstract getAliveWatcherTeamIndexesForSelf(): Set<number>;

    public init(data: ISerialPlayerManager | null | undefined, configVersion: string): ClientErrorCode {
        if (data == null) {
            return ClientErrorCode.BwPlayerManagerInit00;
        }

        const playerArray = data.players;
        if ((!playerArray)                                              ||
            (playerArray.length < 3)                                    ||
            (playerArray.length > CommonConstants.WarMaxPlayerIndex + 1)
        ) {
            return ClientErrorCode.BwPlayerManagerInit01;
        }

        const newPlayerMap  = new Map<number, TwnsBwPlayer.BwPlayer>();
        const skinIdSet     = new Set<number>();
        for (const playerData of playerArray) {
            const playerIndex = playerData.playerIndex;
            if ((playerIndex == null) || (newPlayerMap.has(playerIndex))) {
                return ClientErrorCode.BwPlayerManagerInit02;
            }

            const skinId = playerData.unitAndTileSkinId;
            if ((skinId == null) || (skinIdSet.has(skinId))) {
                return ClientErrorCode.BwPlayerManagerInit03;
            }
            skinIdSet.add(skinId);

            const player        = new TwnsBwPlayer.BwPlayer();
            const playerError   = player.init(playerData, configVersion);
            if (playerError) {
                return playerError;
            }

            newPlayerMap.set(playerIndex, player);
        }

        if (!newPlayerMap.has(CommonConstants.WarNeutralPlayerIndex)) {
            return ClientErrorCode.BwPlayerManagerInit04;
        }
        for (const [playerIndex] of newPlayerMap) {
            if ((playerIndex > CommonConstants.WarNeutralPlayerIndex) && (!newPlayerMap.has(playerIndex - 1))) {
                return ClientErrorCode.BwPlayerManagerInit05;
            }
        }
        if ((newPlayerMap.size < 3) || (newPlayerMap.size > CommonConstants.WarMaxPlayerIndex + 1)) {
            return ClientErrorCode.BwPlayerManagerInit06;
        }

        const playerMap = this.getAllPlayersDict();
        playerMap.clear();
        for (const [playerIndex, player] of newPlayerMap) {
            playerMap.set(playerIndex, player);
        }

        return ClientErrorCode.NoError;
    }
    public fastInit(data: ISerialPlayerManager, configVersion: string): ClientErrorCode {
        for (const playerData of data ? data.players || [] : []) {
            const playerIndex = playerData.playerIndex;
            if (playerIndex == null) {
                return ClientErrorCode.BwPlayerManager_FastInit_00;
            }

            const player = this.getPlayer(playerIndex);
            if (player == null) {
                return ClientErrorCode.BwPlayerManager_FastInit_01;
            }

            const errorCode = player.init(playerData, configVersion);
            if (errorCode) {
                return errorCode;
            }
        }

        return ClientErrorCode.NoError;
    }

    public startRunning(war: BwWar): void {
        this._setWar(war);
        for (const [, player] of this._players) {
            player.startRunning(war);
        }
    }

    public serialize(): ISerialPlayerManager | undefined {
        const players: ISerialPlayer[] = [];
        for (const [, player] of this.getAllPlayersDict()) {
            const serialPlayer = player.serialize();
            if (serialPlayer == null) {
                Logger.error(`BwPlayerManager.serialize() empty serialPlayer.`);
                return undefined;
            }

            players.push(serialPlayer);
        }

        return { players };
    }
    public serializeForCreateSfw(): ISerialPlayerManager | undefined {
        const players: ISerialPlayer[] = [];
        for (const [, player] of this.getAllPlayersDict()) {
            const serialPlayer = player.serializeForCreateSfw();
            if (serialPlayer == null) {
                Logger.error(`BwPlayerManager.serializeForCreateSfw() empty serialPlayer.`);
                return undefined;
            }

            players.push(serialPlayer);
        }

        return { players };
    }
    public serializeForCreateMfr(): ISerialPlayerManager | undefined {
        const players: ISerialPlayer[] = [];
        for (const [, player] of this.getAllPlayersDict()) {
            const serialPlayer = player.serializeForCreateMfr();
            if (serialPlayer == null) {
                Logger.error(`BwPlayerManager.serializeForCreateMfr() empty serialPlayer.`);
                return undefined;
            }

            players.push(serialPlayer);
        }

        return { players };
    }

    private _setWar(war: BwWar): void {
        this._war = war;
    }
    protected _getWar(): BwWar | undefined {
        return this._war;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // The other public functions.
    ////////////////////////////////////////////////////////////////////////////////
    public getPlayer(playerIndex: number): TwnsBwPlayer.BwPlayer | undefined {
        return this._players.get(playerIndex);
    }
    public getAllPlayersDict(): Map<number, TwnsBwPlayer.BwPlayer> {
        return this._players;
    }
    public getAllPlayers(): TwnsBwPlayer.BwPlayer[] {
        const players: TwnsBwPlayer.BwPlayer[] = [];
        for (const [, player] of this.getAllPlayersDict()) {
            players.push(player);
        }
        return players;
    }

    public getPlayerByUserId(userId: number): TwnsBwPlayer.BwPlayer | undefined {
        for (const [, player] of this._players) {
            if (player.getUserId() === userId) {
                return player;
            }
        }
        return undefined;
    }

    public getPlayerInTurn(): TwnsBwPlayer.BwPlayer | undefined {
        const war = this._getWar();
        if (war == null) {
            return undefined;
        }

        const playerIndex = war.getPlayerIndexInTurn();
        return playerIndex == null
            ? undefined
            : this.getPlayer(playerIndex);
    }

    public getTeamIndex(playerIndex: number): number | undefined {
        const player = this.getPlayer(playerIndex);
        return player ? player.getTeamIndex() : undefined;
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
                    Logger.error(`BwPlayerManager.getAliveTeamIndexes() empty teamIndex.`);
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

    public forEachPlayer(includeNeutral: boolean, func: (p: TwnsBwPlayer.BwPlayer) => void): void {
        for (const [playerIndex, player] of this._players) {
            ((includeNeutral) || (playerIndex !== 0)) && (func(player));
        }
    }

    public getAliveWatcherTeamIndexes(watcherUserId: number): Set<number> {
        const indexes = new Set<number>();
        this.forEachPlayer(false, player => {
            if (player.getAliveState() !== PlayerAliveState.Dead) {
                if ((player.getUserId() === watcherUserId)                  ||
                    (player.getWatchOngoingSrcUserIds().has(watcherUserId))
                ) {
                    indexes.add(player.getTeamIndex());
                }
            }
        });
        return indexes;
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
