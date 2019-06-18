
namespace TinyWars.BaseWar {
    import Types            = Utility.Types;
    import MapIndexKey      = Types.MapIndexKey;
    import SerializedBwWar  = Types.SerializedBwWar;

    export class BwWar {
        private _warId                  : number;
        private _warName                : string;
        private _warPassword            : string;
        private _warComment             : string;
        private _configVersion          : number;
        private _mapIndexKey            : MapIndexKey;
        private _timeLimit              : number;
        private _hasFogByDefault        : boolean;
        private _incomeModifier         : number;
        private _energyGrowthModifier   : number;
        private _attackPowerModifier    : number;
        private _moveRangeModifier      : number;
        private _visionRangeModifier    : number;
        private _initialFund            : number;
        private _initialEnergy          : number;

        private _remainingVotesForDraw  : number;

        protected async init(data: SerializedBwWar): Promise<BwWar> {
            this._setWarId(data.warId);
            this._setWarName(data.warName);
            this._setWarPassword(data.warPassword);
            this._setWarComment(data.warComment);
            this._setConfigVersion(data.configVersion);
            this._setMapIndexKey(data);
            this._setSettingsTimeLimit(data.timeLimit);
            this._setSettingsHasFog(data.hasFogByDefault);
            this._setSettingsIncomeModifier(data.incomeModifier);
            this._setSettingsEnergyGrowthModifier(data.energyGrowthModifier);
            this._setSettingsAttackPowerModifier(data.attackPowerModifier);
            this._setSettingsMoveRangeModifier(data.moveRangeModifier);
            this._setSettingsVisionRangeModifier(data.visionRangeModifier);
            this._setSettingsInitialFund(data.initialFund);
            this._setSettingsInitialEnergy(data.initialEnergy);

            this.setRemainingVotesForDraw(data.remainingVotesForDraw);

            return this;
        }

        private _setWarId(warId: number): void {
            this._warId = warId;
        }
        public getWarId(): number {
            return this._warId;
        }

        private _setWarName(warName: string): void {
            this._warName = warName;
        }
        public getWarName(): string {
            return this._warName;
        }

        private _setWarPassword(warPassword: string): void {
            this._warPassword = warPassword;
        }
        public getWarPassword(): string {
            return this._warPassword;
        }

        private _setWarComment(warComment: string): void {
            this._warComment = warComment;
        }
        public getWarComment(): string {
            return this._warComment;
        }

        private _setConfigVersion(configVersion: number): void {
            this._configVersion = configVersion;
        }
        public getConfigVersion(): number {
            return this._configVersion;
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

        private _setSettingsTimeLimit(timeLimit: number): void {
            this._timeLimit = timeLimit;
        }
        public getSettingsTimeLimit(): number {
            return this._timeLimit;
        }

        private _setSettingsHasFog(hasFog: boolean): void {
            this._hasFogByDefault = hasFog;
        }
        public getSettingsHasFog(): boolean {
            return this._hasFogByDefault;
        }

        private _setSettingsIncomeModifier(incomeModifier: number): void {
            this._incomeModifier = incomeModifier;
        }
        public getSettingsIncomeModifier(): number {
            return this._incomeModifier;
        }

        private _setSettingsEnergyGrowthModifier(energyGrowthModifier: number): void {
            this._energyGrowthModifier = energyGrowthModifier;
        }
        public getSettingsEnergyGrowthModifier(): number {
            return this._energyGrowthModifier;
        }

        private _setSettingsAttackPowerModifier(attackPowerModifier: number): void {
            this._attackPowerModifier = attackPowerModifier;
        }
        public getSettingsAttackPowerModifier(): number {
            return this._attackPowerModifier;
        }

        private _setSettingsMoveRangeModifier(moveRangeModifier: number): void {
            this._moveRangeModifier = moveRangeModifier;
        }
        public getSettingsMoveRangeModifier(): number {
            return this._moveRangeModifier;
        }

        private _setSettingsVisionRangeModifier(visionRangeModifier: number): void {
            this._visionRangeModifier = visionRangeModifier;
        }
        public getSettingsVisionRangeModifier(): number {
            return this._visionRangeModifier;
        }

        private _setSettingsInitialFund(initialFund: number): void {
            this._initialFund = initialFund;
        }
        public getSettingsInitialFund(): number {
            return this._initialFund;
        }

        private _setSettingsInitialEnergy(initialEnergy: number): void {
            this._initialEnergy = initialEnergy;
        }
        public getSettingsInitialEnergy(): number {
            return this._initialEnergy;
        }

        public setRemainingVotesForDraw(votes: number | undefined): void {
            this._remainingVotesForDraw = votes;
        }
        public getRemainingVotesForDraw(): number | undefined {
            return this._remainingVotesForDraw;
        }
    }
}
