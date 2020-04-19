
namespace TinyWars.SingleCustomWar {
    import Types        = Utility.Types;
    import ProtoTypes   = Utility.ProtoTypes;
    import Logger       = Utility.Logger;

    export class ScwWar extends BaseWar.BwWar {
        private _isEnded                = false;
        private _warType                : Types.SinglePlayerWarType;
        private _saveSlotIndex          : number;
        private _seedRandomInitState    : ProtoTypes.ISeedRandomState;
        private _isSinglePlayerCheating : boolean;
        private _executedActions        : Types.WarActionContainer[];

        public async init(data: Types.SerializedWar): Promise<ScwWar> {
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
            this._setSaveSlotIndex(data.saveSlotIndex);
            this._setWarType(data.singlePlayerWarType);
            this._setSeedRandomInitState(data.seedRandomInitState);
            this._setExecutedActions(data.executedActions);
            this.setIsSinglePlayerCheating(data.isSinglePlayerCheating);

            this._initView();

            return this;
        }

        public serialize(): Types.SerializedWar {
            return {
                warId                   : this.getWarId(),
                warName                 : this.getWarName(),
                warPassword             : this.getWarPassword(),
                warComment              : this.getWarComment(),
                configVersion           : this.getConfigVersion(),
                executedActions         : this._getExecutedActions(),
                nextActionId            : this.getNextActionId(),
                remainingVotesForDraw   : this.getRemainingVotesForDraw(),
                warRuleIndex            : this.getWarRuleIndex(),
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
                mapFileName             : this.getMapFileName(),
                saveSlotIndex           : this.getSaveSlotIndex(),
                singlePlayerWarType     : this.getWarType(),
                isSinglePlayerCheating  : this.getIsSinglePlayerCheating(),
                seedRandomInitState     : this._getSeedRandomInitState(),
                seedRandomState         : this.getRandomNumberGenerator().state(),
                players                 : (this.getPlayerManager() as ScwPlayerManager).serialize(),
                field                   : (this.getField() as ScwField).serialize(),
                turn                    : (this.getTurnManager() as ScwTurnManager).serialize(),
            };
        }

        public serializeForSimulation(): Types.SerializedWar {
            const playerDataList    = (this.getPlayerManager() as ScwPlayerManager).serializeForSimulation();
            const fieldData         = (this.getField() as ScwField).serializeForSimulation();
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
                players                 : playerDataList,
                field                   : fieldData,
                turn                    : (this.getTurnManager() as ScwTurnManager).serializeForSimulation(),
                seedRandomState         : null,
            };
        }

        protected _getViewClass(): new () => ScwWarView {
            return ScwWarView;
        }
        protected _getFieldClass(): new () => ScwField {
            return ScwField;
        }
        protected _getPlayerManagerClass(): new () => ScwPlayerManager {
            return ScwPlayerManager;
        }
        protected _getTurnManagerClass(): new () => ScwTurnManager {
            return ScwTurnManager;
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

        private _setSaveSlotIndex(index: number): void {
            this._saveSlotIndex = index;
        }
        public getSaveSlotIndex(): number {
            return this._saveSlotIndex;
        }

        private _setWarType(type: Types.SinglePlayerWarType): void {
            this._warType = type;
        }
        public getWarType(): Types.SinglePlayerWarType {
            return this._warType;
        }

        private _setSeedRandomInitState(state: ProtoTypes.ISeedRandomState): void {
            this._seedRandomInitState = state;
        }
        private _getSeedRandomInitState(): ProtoTypes.ISeedRandomState {
            return this._seedRandomInitState;
        }

        public setIsSinglePlayerCheating(isCheating: boolean): void {
            this._isSinglePlayerCheating = isCheating;
        }
        public getIsSinglePlayerCheating(): boolean {
            return this._isSinglePlayerCheating;
        }

        private _setExecutedActions(actions: Types.WarActionContainer[]): void {
            this._executedActions = actions;
        }
        private _getExecutedActions(): Types.WarActionContainer[] | null {
            return this._executedActions;
        }
        public pushExecutedAction(action: Types.WarActionContainer): void {
            this._executedActions.push(action);
        }

        public getHumanPlayerIndexes(): number[] {
            return (this.getPlayerManager() as ScwPlayerManager).getHumanPlayerIndexes();
        }
        public getHumanPlayers(): ScwPlayer[] {
            return (this.getPlayerManager() as ScwPlayerManager).getHumanPlayers();
        }
        public checkIsHumanInTurn(): boolean {
            return this.getHumanPlayerIndexes().indexOf(this.getPlayerIndexInTurn()) >= 0;
        }
    }
}
