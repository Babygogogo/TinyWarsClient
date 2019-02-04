
namespace TinyWars.MultiCustomWar {
    import Types            = Utility.Types;
    import MapIndexKey      = Types.MapIndexKey;
    import Action           = Types.SerializedMcwAction;
    import SerializedMcWar  = Types.SerializedMcwWar;

    export class McwWar {
        private _warId                  : number;
        private _warName                : string;
        private _warPassword            : string;
        private _warComment             : string;
        private _configVersion          : number;
        private _mapIndexKey            : MapIndexKey;
        private _executedActions        : Action[];
        private _enterTurnTime          : number;
        private _remainingVotesForDraw  : number;
        private _timeLimit              : number;
        private _hasFogByDefault        : boolean;
        private _incomeModifier         : number;
        private _energyGrowthModifier   : number;
        private _attackPowerModifier    : number;
        private _moveRangeModifier      : number;
        private _visionRangeModifier    : number;
        private _initialFund            : number;
        private _initialEnergy          : number;

        private _isEnded        = false;

        private _playerManager  : McPlayerManager;
        private _field          : McwField;
        private _turnManager    : McwTurnManager;

        public constructor() {
        }

        public async init(data: SerializedMcWar): Promise<McwWar> {
            this._warId                 = data.warId;
            this._warName               = data.warName;
            this._warPassword           = data.warPassword;
            this._warComment            = data.warComment;
            this._configVersion         = data.configVersion;
            this._executedActions       = data.executedActions;
            this._remainingVotesForDraw = data.remainingVotesForDraw;
            this._timeLimit             = data.timeLimit;
            this._hasFogByDefault       = data.hasFogByDefault;
            this._incomeModifier        = data.incomeModifier;
            this._energyGrowthModifier  = data.energyGrowthModifier;
            this._attackPowerModifier   = data.attackPowerModifier;
            this._moveRangeModifier     = data.moveRangeModifier;
            this._visionRangeModifier   = data.visionRangeModifier;
            this._initialFund           = data.initialFund;
            this._initialEnergy         = data.initialEnergy;
            this._setMapIndexKey(data);
            this.setEnterTurnTime(data.enterTurnTime);
            this._setPlayerManager(new McPlayerManager().init(data.players));
            this._setField(await new McwField().init(data.field, this._configVersion, this.getMapIndexKey()));
            this._setTurnManager(new McwTurnManager().init(data.turn));

            return this;
        }

        public startRunning(): McwWar {
            this.getTurnManager().startRunning(this);
            this.getPlayerManager().startRunning(this);
            this.getField().startRunning(this);

            return this;
        }

        public serialize(): SerializedMcWar {
            const mapIndexKey = this.getMapIndexKey();
            return {
                warId                   : this.getWarId(),
                warName                 : this.getWarName(),
                warPassword             : this.getWarPassword(),
                warComment              : this.getWarComment(),
                configVersion           : this.getConfigVersion(),
                executedActions         : this._executedActions,
                remainingVotesForDraw   : this.getRemainingVotesForDraw(),
                timeLimit               : this.getSettingsTimeLimit(),
                hasFogByDefault         : this.getSettingsHasFog(),
                incomeModifier          : this.getSettingsIncomeModifier(),
                energyGrowthModifier    : this.getSettingsEnergyGrowthModifier(),
                attackPowerModifier     : this.getSettingsAttackPowerModifier(),
                moveRangeModifier       : this.getSettingsMoveRangeModifier(),
                visionRangeModifier     : this.getSettingsVisionRangeModifier(),
                initialFund             : this.getSettingsInitialFund(),
                initialEnergy           : this.getSettingsInitialEnergy(),
                mapName                 : mapIndexKey.mapName,
                mapDesigner             : mapIndexKey.mapDesigner,
                mapVersion              : mapIndexKey.mapVersion,
                enterTurnTime           : this.getEnterTurnTime(),
                players                 : this.getPlayerManager().serialize(),
                field                   : this.getField().serialize(),
                turn                    : this.getTurnManager().serialize(),
            };
        }
        public serializeForPlayer(playerIndex: number): SerializedMcWar {
            const mapIndexKey = this.getMapIndexKey();
            return {
                warId                   : this.getWarId(),
                warName                 : this.getWarName(),
                warPassword             : this.getWarPassword(),
                warComment              : this.getWarComment(),
                configVersion           : this.getConfigVersion(),
                executedActions         : this._executedActions,
                remainingVotesForDraw   : this.getRemainingVotesForDraw(),
                timeLimit               : this.getSettingsTimeLimit(),
                hasFogByDefault         : this.getSettingsHasFog(),
                incomeModifier          : this.getSettingsIncomeModifier(),
                energyGrowthModifier    : this.getSettingsEnergyGrowthModifier(),
                attackPowerModifier     : this.getSettingsAttackPowerModifier(),
                moveRangeModifier       : this.getSettingsMoveRangeModifier(),
                visionRangeModifier     : this.getSettingsVisionRangeModifier(),
                initialFund             : this.getSettingsInitialFund(),
                initialEnergy           : this.getSettingsInitialEnergy(),
                mapName                 : mapIndexKey.mapName,
                mapDesigner             : mapIndexKey.mapDesigner,
                mapVersion              : mapIndexKey.mapVersion,
                enterTurnTime           : this.getEnterTurnTime(),
                players                 : this.getPlayerManager().serialize(),
                field                   : this.getField().serializeForPlayer(playerIndex),
                turn                    : this.getTurnManager().serializeForPlayer(playerIndex),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getWarId(): number {
            return this._warId;
        }
        public getWarName(): string {
            return this._warName;
        }
        public getWarPassword(): string {
            return this._warPassword;
        }
        public getWarComment(): string {
            return this._warComment;
        }
        public getConfigVersion(): number {
            return this._configVersion;
        }

        public getSettingsTimeLimit(): number {
            return this._timeLimit;
        }
        public getSettingsHasFog(): boolean {
            return this._hasFogByDefault;
        }
        public getSettingsIncomeModifier(): number {
            return this._incomeModifier;
        }
        public getSettingsEnergyGrowthModifier(): number {
            return this._energyGrowthModifier;
        }
        public getSettingsAttackPowerModifier(): number {
            return this._attackPowerModifier;
        }
        public getSettingsMoveRangeModifier(): number {
            return this._moveRangeModifier;
        }
        public getSettingsVisionRangeModifier(): number {
            return this._visionRangeModifier;
        }
        public getSettingsInitialFund(): number {
            return this._initialFund;
        }
        public getSettingsInitialEnergy(): number {
            return this._initialEnergy;
        }

        private _setMapIndexKey(key: MapIndexKey): void {
            this._mapIndexKey = {
                mapName     : key.mapName,
                mapDesigner : key.mapDesigner,
                mapVersion  : key.mapVersion,
            };
        }
        public getMapIndexKey(): MapIndexKey {
            return this._mapIndexKey;
        }

        public getExecutedAction(actionId: number): Action {
            return this._executedActions[actionId];
        }
        public addExecutedAction(action: Action): void {
            this._executedActions.push(action);
        }
        public getNextActionId(): number {
            return this._executedActions.length;
        }
        public getCurrentActionId(): number | undefined {
            const id = this.getNextActionId();
            return id > 0 ? id - 1 : undefined;
        }

        public setEnterTurnTime(timestamp: number): void {
            this._enterTurnTime = timestamp;
        }
        public getEnterTurnTime(): number {
            return this._enterTurnTime;
        }

        public setRemainingVotesForDraw(votes: number | undefined): void {
            this._remainingVotesForDraw = votes;
        }
        public getRemainingVotesForDraw(): number | undefined {
            return this._remainingVotesForDraw;
        }

        public setIsEnded(ended: boolean): void {
            this._isEnded = ended;
        }
        public getIsEnded(): boolean {
            return this._isEnded;
        }

        private _setPlayerManager(manager: McPlayerManager): void {
            this._playerManager = manager;
        }
        public getPlayerManager(): McPlayerManager {
            return this._playerManager;
        }
        public getPlayer(playerIndex: number): McwPlayer | undefined {
            return this.getPlayerManager().getPlayer(playerIndex);
        }

        private _setField(field: McwField): void {
            this._field = field;
        }
        public getField(): McwField {
            return this._field;
        }
        public getUnitMap(): McwUnitMap {
            return this.getField().getUnitMap();
        }
        public getTileMap(): McwTileMap {
            return this.getField().getTileMap();
        }
        public getFogMap(): McwFogMap {
            return this.getField().getFogMap();
        }

        private _setTurnManager(manager: McwTurnManager): void {
            this._turnManager = manager;
        }
        public getTurnManager(): McwTurnManager {
            return this._turnManager;
        }
    }
}
