

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import IPlayerStatistics            = CommonProto.WarSerialization.SerialWarStatisticsManager.IPlayerStatistics;
    import ISerialWarStatisticsManager  = CommonProto.WarSerialization.ISerialWarStatisticsManager;

    export class BwWarStatisticsManager {
        private _playerStatisticsArray? : IPlayerStatistics[];
        private _war?                   : BwWar;

        public init(data: Types.Undefinable<ISerialWarStatisticsManager>, playersCountUnneutral: number, currentTurnIndex: number): void {
            const playerStatisticsArray = data?.playerStatisticsArray ?? [];
            const playerIndexSet        = new Set<number>();
            for (const playerStatisticsData of playerStatisticsArray) {
                const playerIndex = Helpers.getExisted(playerStatisticsData.playerIndex, ClientErrorCode.BwWarStatisticsManager_Init_00);
                if ((playerIndex < CommonConstants.PlayerIndex.Neutral) || (playerIndex > playersCountUnneutral)) {
                    throw Helpers.newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwWarStatisticsManager_Init_01);
                }

                if (playerIndexSet.has(playerIndex)) {
                    throw Helpers.newError(`Duplicated playerIndex: ${playerIndex}`, ClientErrorCode.BwWarStatisticsManager_Init_02);
                }
                playerIndexSet.add(playerIndex);

                const turnIndexSet = new Set<number>();
                for (const playerTurnStatisticsData of playerStatisticsData.playerTurnStatisticsArray ?? []) {
                    const turnIndex = Helpers.getExisted(playerTurnStatisticsData.turnIndex, ClientErrorCode.BwWarStatisticsManager_Init_03);
                    if ((turnIndex < CommonConstants.WarFirstTurnIndex) || (turnIndex > currentTurnIndex)) {
                        throw Helpers.newError(`Invalid turnIndex: ${turnIndex}`, ClientErrorCode.BwWarStatisticsManager_Init_04);
                    }

                    if (turnIndexSet.has(turnIndex)) {
                        throw Helpers.newError(`Duplicated turnIndex: ${turnIndex}`, ClientErrorCode.BwWarStatisticsManager_Init_05);
                    }
                    turnIndexSet.add(turnIndex);
                }
            }

            this._setPlayerStatisticsArray(playerStatisticsArray);
        }
        public fastInit(data: Types.Undefinable<ISerialWarStatisticsManager>): void {
            this._setPlayerStatisticsArray(data?.playerStatisticsArray ?? []);
        }
        public startRunning(war: BwWar): void {
            this._war = war;
        }

        private _getWar(): BwWar {
            return Helpers.getExisted(this._war, ClientErrorCode.BwWarStatisticsManager_GetWar_00);
        }

        public serialize(): ISerialWarStatisticsManager {
            return {
                playerStatisticsArray   : this._getPlayerStatisticsArray(),
            };
        }
        public serializeForCreateSfw(): ISerialWarStatisticsManager {
            return {
                playerStatisticsArray   : this._getPlayerStatisticsArray(),
            };
        }
        public serializeForCreateMfr(): ISerialWarStatisticsManager {
            return {
                playerStatisticsArray   : this._getPlayerStatisticsArray(),
            };
        }

        public _setPlayerStatisticsArray(actions: IPlayerStatistics[]): void {
            this._playerStatisticsArray = actions;
        }
        private _getPlayerStatisticsArray(): IPlayerStatistics[] {
            return Helpers.getExisted(this._playerStatisticsArray, ClientErrorCode.BwWarStatisticsManager_GetPlayerTurnStatisticsArray_00);
        }

        public tickPlayerManualActionsCount(): void {
            const turnManager           = this._getWar().getTurnManager();
            const turnIndex             = turnManager.getTurnIndex();
            const playerIndex           = turnManager.getPlayerIndexInTurn();
            const playerStatisticsArray = this._getPlayerStatisticsArray();
            const existingDataForPlayer = playerStatisticsArray.find(v => v.playerIndex === playerIndex);
            if (existingDataForPlayer == null) {
                playerStatisticsArray.push({
                    playerIndex,
                    playerTurnStatisticsArray : [{
                        turnIndex,
                        manualActionsCount  : 1,
                    }],
                });
            } else {
                const playerTurnStatisticsArray = (existingDataForPlayer.playerTurnStatisticsArray ??= []);
                const existingData              = playerTurnStatisticsArray.find(v => v.turnIndex === turnIndex);
                if (existingData == null) {
                    playerTurnStatisticsArray.push({
                        turnIndex,
                        manualActionsCount  : 1,
                    });
                } else {
                    existingData.manualActionsCount = (existingData.manualActionsCount ?? 0) + 1;
                }
            }
        }
        public getManualActionsCount(turnIndex: number, playerIndex: number): number {
            return this._getPlayerStatisticsArray().find(v => v.playerIndex === playerIndex)?.playerTurnStatisticsArray?.find(v => v.turnIndex === turnIndex)?.manualActionsCount ?? 0;
        }
        public getManualActionsCountForPlayerInTurn(): number {
            const turnManager = this._getWar().getTurnManager();
            return this.getManualActionsCount(turnManager.getTurnIndex(), turnManager.getPlayerIndexInTurn());
        }
    }
}
