
namespace TinyWars.MapEditor {
    import ProtoTypes   = Utility.ProtoTypes;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;

    export class MeWarRule {
        private _ruleName               = Lang.getText(Lang.Type.B0277);
        private _ruleNameEnglish        = Lang.getText(Lang.Type.B0277);
        private _hasFog                 = false;
        private _initialFund            = 0;
        private _incomeModifier         = 100;
        private _initialEnergy          = 0;
        private _energyGrowthModifier   = 100;
        private _moveRangeModifier      = 0;
        private _attackPowerModifier    = 0;
        private _visionRangeModifier    = 0;
        private _luckLowerLimit         = ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultLowerLimit;
        private _luckUpperLimit         = ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultUpperLimit;
        // private _bannedCoIdList         : number[] = []; // TODO

        private _playerRuleList : ProtoTypes.IRuleForPlayer[] = [];

        public serialize(): ProtoTypes.IRuleForWar {
            return {
                ruleName            : this.getRuleName(),
                ruleNameEnglish     : this.getRuleNameEnglish(),
                hasFog              : this.getHasFog() ? 1 : 0,
                initialFund         : this.getInitialFund(),
                incomeModifier      : this.getIncomeMultiplier(),
                initialEnergy       : this.getInitialEnergy(),
                energyGrowthModifier: this.getEnergyGrowthModifier(),
                moveRangeModifier   : this.getMoveRangeModifier(),
                attackPowerModifier : this.getAttackPowerModifier(),
                visionRangeModifier : this.getVisionRangeModifier(),
                luckLowerLimit      : this.getLuckLowerLimit(),
                luckUpperLimit      : this.getLuckUpperLimit(),
                playerRuleList      : this.getPlayerRuleList(),
                // bannedCoIdList      : ,
            };
        }

        public getRuleName(): string {
            return this._ruleName;
        }
        public setRuleName(name: string): void {
            this._ruleName = name;
        }

        public getRuleNameEnglish(): string {
            return this._ruleNameEnglish;
        }
        public setRuleNameEnglish(name: string): void {
            this._ruleNameEnglish = name;
        }

        public getRuleNameForCurrentLanguage(): string {
            return Lang.getLanguageType() === Types.LanguageType.Chinese
                ? this.getRuleName()
                : this.getRuleNameEnglish();
        }

        public getHasFog(): boolean {
            return this._hasFog;
        }
        public setHasFog(hasFog: boolean): void {
            this._hasFog = hasFog;
        }

        public getInitialFund(): number {
            return this._initialFund;
        }
        public setInitialFund(fund: number): void {
            this._initialFund = fund;
        }

        public getIncomeMultiplier(): number {
            return this._incomeModifier;
        }
        public setIncomeMultiplier(modifier: number): void {
            this._incomeModifier = modifier;
        }

        public getInitialEnergy(): number {
            return this._initialEnergy;
        }
        public setInitialEnergy(energy: number): void {
            this._initialEnergy = energy;
        }

        public getEnergyGrowthModifier(): number {
            return this._energyGrowthModifier;
        }
        public setEnergyGrowthModifier(modifier: number): void {
            this._energyGrowthModifier = modifier;
        }

        public getMoveRangeModifier(): number {
            return this._moveRangeModifier;
        }
        public setMoveRangeModifier(modifier: number): void {
            this._moveRangeModifier = modifier;
        }

        public getAttackPowerModifier(): number {
            return this._attackPowerModifier;
        }
        public setAttackPowerModifier(modifier: number): void {
            this._attackPowerModifier = modifier;
        }

        public getVisionRangeModifier(): number {
            return this._visionRangeModifier;
        }
        public setVisionRangeModifier(modifier: number): void {
            this._visionRangeModifier = modifier;
        }

        public getLuckLowerLimit(): number {
            return this._luckLowerLimit;
        }
        public setLuckLowerLimit(limit: number): void {
            this._luckLowerLimit = limit;
        }

        public getLuckUpperLimit(): number {
            return this._luckUpperLimit;
        }
        public setLuckUpperLimit(limit: number): void {
            this._luckUpperLimit = limit;
        }

        public reviseForPlayersCount(playersCount: number): void {
            const list = this._playerRuleList;
            if (list.length > playersCount) {
                list.length = playersCount;
            }

            for (let i = 0; i < playersCount; ++i) {
                const playerIndex = i + 1;
                if (list[i]) {
                    list[i].teamIndex = Math.min(list[i].teamIndex, playersCount);
                } else {
                    list[i] = {
                        playerIndex,
                        teamIndex: playerIndex,
                    };
                }
            }
        }
        public getPlayerRuleList(): ProtoTypes.IRuleForPlayer[] {
            return this._playerRuleList;
        }
        public updatePlayerRule(playerIndex: number, teamIndex: number): void {
            for (const rule of this.getPlayerRuleList()) {
                if (rule.playerIndex === playerIndex) {
                    rule.teamIndex = teamIndex;
                }
            }
        }
    }
}
