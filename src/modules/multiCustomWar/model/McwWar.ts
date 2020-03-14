
namespace TinyWars.MultiCustomWar {
    import Types    = Utility.Types;
    import Logger   = Utility.Logger;

    export class McwWar extends BaseWar.BwWar {
        private _isEnded = false;

        public async init(data: Types.SerializedWar): Promise<McwWar> {
            this._baseInit(data);

            this._initPlayerManager(data.players);
            await this._initField(
                data.field,
                data.configVersion,
                data.mapFileName,
                await BaseWar.BwHelpers.getMapSizeAndMaxPlayerIndex(data)
            );
            this._initTurnManager(data.turn);

            this.setNextActionId(data.nextActionId);

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
            return {
                warId                   : this.getWarId(),
                warName                 : this.getWarName(),
                warPassword             : this.getWarPassword(),
                warComment              : this.getWarComment(),
                configVersion           : this.getConfigVersion(),
                executedActions         : [],
                nextActionId            : this.getNextActionId(),
                remainingVotesForDraw   : this.getRemainingVotesForDraw(),
                warRuleIndex            : this.getWarRuleIndex(),
                timeLimit               : this.getSettingsTimeLimit(),
                hasFogByDefault         : this.getSettingsHasFog(),
                incomeModifier          : this.getSettingsIncomeModifier(),
                energyGrowthModifier    : this.getSettingsEnergyGrowthModifier(),
                attackPowerModifier     : this.getSettingsAttackPowerModifier(),
                moveRangeModifier       : this.getSettingsMoveRangeModifier(),
                visionRangeModifier     : this.getSettingsVisionRangeModifier(),
                initialFund             : this.getSettingsInitialFund(),
                initialEnergy           : this.getSettingsInitialEnergy(),
                bannedCoIdList          : this.getSettingsBannedCoIdList(),
                luckLowerLimit          : this.getSettingsLuckLowerLimit(),
                luckUpperLimit          : this.getSettingsLuckUpperLimit(),
                singlePlayerWarType     : Types.SinglePlayerWarType.Custom,
                isSinglePlayerCheating  : true,
                mapFileName             : this.getMapFileName(),
                players                 : (this.getPlayerManager() as McwPlayerManager).serializeForSimulation(),
                field                   : (this.getField() as McwField).serializeForSimulation(),
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

        public getPlayerIndexLoggedIn(): number | undefined {
            return (this.getPlayerManager() as McwPlayerManager).getPlayerIndexLoggedIn();
        }
        public getPlayerLoggedIn(): McwPlayer {
            return (this.getPlayerManager() as McwPlayerManager).getPlayerLoggedIn();
        }
    }
}
