
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
        private _nextActionId           : number;
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

        private _view               : McwWarView;
        private _isRunningAction    = false;
        private _isRunningWar       = false;

        public constructor() {
        }

        public async init(data: SerializedMcWar): Promise<McwWar> {
            this._warId                 = data.warId;
            this._warName               = data.warName;
            this._warPassword           = data.warPassword;
            this._warComment            = data.warComment;
            this._configVersion         = data.configVersion;
            this.setNextActionId(data.nextActionId);
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
            this._setPlayerManager(new McPlayerManager().init(data.players));
            this._setField(await new McwField().init(data.field, this._configVersion, this.getMapIndexKey()));
            this._setTurnManager(new McwTurnManager().init(data.turn));

            this._view = this._view || new McwWarView();
            this._view.init(this);

            return this;
        }

        public startRunning(): McwWar {
            this.getTurnManager().startRunning(this);
            this.getPlayerManager().startRunning(this);
            this.getField().startRunning(this);

            this._isRunningWar = true;

            return this;
        }
        public startRunningView(): McwWar {
            this.getView().startRunning();
            this.getField().startRunningView();

            return this;
        }
        public stopRunning(): McwWar {
            this.getField().stopRunning();
            this.getView().stopRunning();

            this._isRunningWar = false;

            return this;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // The other functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public getView(): McwWarView {
            return this._view;
        }

        public getIsRunningAction(): boolean {
            return this._isRunningAction;
        }
        public setIsRunningAction(isRunning: boolean): void {
            this._isRunningAction = isRunning;
        }

        public getIsRunningWar(): boolean {
            return this._isRunningWar;
        }

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

        public getNextActionId(): number {
            return this._nextActionId;
        }
        public setNextActionId(actionId: number): void {
            this._nextActionId = actionId;
        }

        public getEnterTurnTime(): number {
            return this.getTurnManager().getEnterTurnTime();
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
        public getPlayerIndexLoggedIn(): number | undefined {
            return this.getPlayerManager().getPlayerIndexLoggedIn();
        }
        public getPlayerInTurn(): McwPlayer {
            return this.getPlayerManager().getPlayerInTurn();
        }
        public getPlayerLoggedIn(): McwPlayer {
            return this.getPlayerManager().getPlayerLoggedIn();
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

        public getActionPlanner(): McwActionPlanner {
            return this.getField().getActionPlanner();
        }

        public getGridVisionEffect(): McwGridVisionEffect {
            return this.getField().getGridVisionEffect();
        }

        private _setTurnManager(manager: McwTurnManager): void {
            this._turnManager = manager;
        }
        public getTurnManager(): McwTurnManager {
            return this._turnManager;
        }
    }
}
