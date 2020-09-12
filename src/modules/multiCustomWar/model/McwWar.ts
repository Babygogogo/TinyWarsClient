
namespace TinyWars.MultiCustomWar {
    import Types    = Utility.Types;
    import Logger   = Utility.Logger;

    export class McwWar extends BaseWar.BwWar {
        private _isEnded = false;

        public async init(data: Types.SerializedWar): Promise<McwWar> {
            this._baseInit(data);

            const dataForPlayerManager = data.playerManager;
            if (dataForPlayerManager == null) {
                Logger.error(`McwWar.init() empty dataForPlayerManager.`);
                return undefined;
            }

            const playerManager = (this.getPlayerManager() || new (this._getPlayerManagerClass())()).init(dataForPlayerManager);
            if (playerManager == null) {
                Logger.error(`McwWar.init() empty playerManager.`);
                return undefined;
            }

            await this._initField(
                data.field,
                data.configVersion,
                data.mapFileName,
                await BaseWar.BwHelpers.getMapSizeAndMaxPlayerIndex(data)
            );
            this._initTurnManager(data.turn);

            this._setPlayerManager(playerManager);

            this._initView();

            return this;
        }

        protected _getViewClass(): new () => McwWarView {
            return McwWarView;
        }
        protected _getFieldClass(): new () => McwField {
            return McwField;
        }
        protected _getPlayerManagerClass(): new () => McwPlayerManager {
            return McwPlayerManager;
        }
        protected _getTurnManagerClass(): new () => McwTurnManager {
            return McwTurnManager;
        }

        public serializeForSimulation(): Types.SerializedWar {
            const playerDataList    = (this.getPlayerManager() as McwPlayerManager).serializeForSimulation();
            const fieldData         = (this.getField() as McwField).serializeForSimulation();
            // const unitMapData       = fieldData ? fieldData.unitMap : null;
            // const unitDataList      = unitMapData ? unitMapData.units || []: [];
            // for (const playerData of playerDataList || []) {
            //     const unitId = playerData.coUnitId;
            //     if ((unitId != null) && (unitDataList.every(u => u.unitId !== unitId))) {
            //         playerData.coUnitId = null;
            //     }
            // }

            return {
                warId                   : this.getWarId(),
                warName                 : this.getWarName(),
                warPassword             : this.getWarPassword(),
                warComment              : this.getWarComment(),
                configVersion           : this.getConfigVersion(),
                executedActions         : [],
                nextActionId            : this.getExecutedActionsCount(),
                remainingVotesForDraw   : this.getRemainingVotesForDraw(),
                warRuleIndex            : this.getWarRuleIndex(),
                bootTimerParams         : this.getSettingsBootTimerParams(),
                hasFogByDefault         : this.getSettingsHasFogByDefault(),
                incomeModifier          : this.getSettingsIncomeMultiplier(),
                energyGrowthModifier    : this.getSettingsEnergyGrowthMultiplier(),
                attackPowerModifier     : this.getSettingsAttackPowerModifier(),
                moveRangeModifier       : this.getSettingsMoveRangeModifier(),
                visionRangeModifier     : this.getSettingsVisionRangeModifier(),
                initialFund             : this.getSettingsInitialFund(),
                initialEnergy           : this.getSettingsInitialEnergyPercentage(),
                bannedCoIdList          : this.getSettingsBannedCoIdList(),
                luckLowerLimit          : this.getSettingsLuckLowerLimit(),
                luckUpperLimit          : this.getSettingsLuckUpperLimit(),
                singlePlayerWarType     : Types.SinglePlayerWarType.Custom,
                isSinglePlayerCheating  : true,
                mapFileName             : this.getMapId(),
                players                 : playerDataList,
                field                   : fieldData,
                turn                    : (this.getTurnManager() as McwTurnManager).serializeForSimulation(),
                seedRandomState         : null,
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public setIsEnded(ended: boolean): void {
            this._isEnded = ended;
        }
        public getIsEnded(): boolean {
            return this._isEnded;
        }

        public checkIsBoot(): boolean {
            if (this.getIsEnded()) {
                return false;
            } else {
                const player = this.getPlayerInTurn();
                return (player.getIsAlive())
                    && (!player.checkIsNeutral())
                    && (Time.TimeModel.getServerTimestamp() > this.getEnterTurnTime() + player.getRestTimeToBoot());
            }
        }

        public getPlayerIndexLoggedIn(): number | undefined {
            return (this.getPlayerManager() as McwPlayerManager).getPlayerIndexLoggedIn();
        }
        public getPlayerLoggedIn(): McwPlayer {
            return (this.getPlayerManager() as McwPlayerManager).getPlayerLoggedIn();
        }
    }
}
