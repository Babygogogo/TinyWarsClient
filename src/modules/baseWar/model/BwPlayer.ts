
namespace TinyWars.BaseWar {
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import GridIndex        = Types.GridIndex;
    import GridIndexHelpers = Utility.GridIndexHelpers;

    export abstract class BwPlayer {
        private _fund               : number;
        private _hasVotedForDraw    : boolean;
        private _isAlive            : boolean;
        private _playerIndex        : number;
        private _teamIndex          : number;
        private _userId?            : number;
        private _nickname           : string;

        private _coId               : number | null | undefined;
        private _coUnitId           : number | null | undefined;
        private _coCurrentEnergy    : number;
        private _coUsingSkillType   : Types.CoSkillType;
        private _coIsDestroyedInTurn: boolean;

        private _war                : BwWar;

        public init(data: Types.SerializedBwPlayer): BwPlayer {
            this.setFund(data.fund!);
            this.setHasVotedForDraw(data.hasVotedForDraw!);
            this.setIsAlive(data.isAlive!);
            this._setPlayerIndex(data.playerIndex!);
            this._setTeamIndex(data.teamIndex!);
            this._setUserId(data.userId);
            this._setNickname(data.nickname || Lang.getText(Lang.Type.B0111));
            this._setCoId(data.coId);
            this.setCoUnitId(data.coUnitId);
            this.setCoCurrentEnergy(data.coCurrentEnergy);
            this.setCoUsingSkillType(data.coUsingSkillType);
            this.setCoIsDestroyedInTurn(data.coIsDestroyedInTurn);

            return this;
        }

        public startRunning(war: BwWar): void {
            this._war = war;
        }

        public setFund(fund: number): void {
            if (this._fund !== fund) {
                this._fund = fund;
                Notify.dispatch(Notify.Type.BwPlayerFundChanged, this);
            }
        }
        public getFund(): number {
            return this._fund;
        }

        public setHasVotedForDraw(voted: boolean): void {
            this._hasVotedForDraw = voted;
        }
        public getHasVotedForDraw(): boolean {
            return this._hasVotedForDraw;
        }

        public setIsAlive(alive: boolean): void {
            this._isAlive = alive;
        }
        public getIsAlive(): boolean {
            return this._isAlive;
        }

        private _setPlayerIndex(index: number): void {
            this._playerIndex = index;
        }
        public getPlayerIndex(): number {
            return this._playerIndex;
        }

        private _setTeamIndex(index: number): void {
            this._teamIndex = index;
        }
        public getTeamIndex(): number {
            return this._teamIndex;
        }

        private _setUserId(id: number | undefined): void {
            this._userId = id;
        }
        public getUserId(): number | undefined {
            return this._userId;
        }

        private _setNickname(nickname: string): void {
            this._nickname = nickname;
        }
        public getNickname(): string {
            return this._nickname;
        }

        private _setCoId(coId: number | null | undefined): void {
            this._coId = coId;
        }
        public getCoId(): number | null | undefined {
            return this._coId;
        }

        public setCoUnitId(coUnitId: number | null | undefined): void {
            this._coUnitId = coUnitId;
        }
        public getCoUnitId(): number | null | undefined {
            return this._coUnitId;
        }

        public setCoCurrentEnergy(energy: number): void {
            this._coCurrentEnergy = energy;
            Notify.dispatch(Notify.Type.BwCoEnergyChanged);
        }
        public getCoCurrentEnergy(): number {
            return this._coCurrentEnergy;
        }
        public getCoMaxEnergy(): number | null | undefined {
            const energyList = this.getCoZoneExpansionEnergyList();
            return Math.max(
                energyList ? energyList[energyList.length - 1] : 0,
                this.getCoSuperPowerEnergy() || 0,
            );
        }
        public getCoZoneExpansionEnergyList(): number[] | null | undefined {
            const cfg = this._getCoBasicCfg();
            return cfg ? cfg.zoneExpansionEnergyList : null;
        }
        public getCoPowerEnergy(): number | null {
            const coBasicCfg    = this._getCoBasicCfg();
            const energyList    = coBasicCfg ? coBasicCfg.powerEnergyList : null;
            const energy        = energyList ? energyList[0] : null;
            return energy! >= 0 ? energy : null;
        }
        public getCoSuperPowerEnergy(): number | null {
            const coBasicCfg    = this._getCoBasicCfg();
            const energyList    = coBasicCfg ? coBasicCfg.powerEnergyList : null;
            const energy        = energyList ? energyList[1] : null;
            return energy! >= 0 ? energy : null;
        }

        public getCoZoneBaseRadius(): number | null {
            const cfg = this._getCoBasicCfg();
            return cfg ? cfg.zoneRadius : null;
        }
        public getCoZoneRadius(): number | null {
            if (this.checkCoIsUsingActiveSkill()) {
                return Number.MAX_VALUE;
            } else {
                const cfg = this._getCoBasicCfg();
                if (!cfg) {
                    return null;
                } else {
                    const energy    = this.getCoCurrentEnergy();
                    let radius      = cfg.zoneRadius;
                    for (const e of cfg.zoneExpansionEnergyList || []) {
                        if (energy >= e) {
                            ++radius;
                        }
                    }
                    return radius;
                }
            }
        }
        public getCoGridIndexOnMap(): GridIndex | null {
            const unitId = this.getCoUnitId();
            if (unitId == null) {
                return null;
            } else {
                const unit = this._war.getUnitMap().getUnitById(unitId);
                return (!unit) || (unit.getLoaderUnitId() != null)
                    ? null
                    : unit.getGridIndex();
            }
        }

        public checkIsInCoZone(targetGridIndex: GridIndex, coGridIndexOnMap = this.getCoGridIndexOnMap()): boolean {
            if (this.checkCoIsUsingActiveSkill()) {
                return true;
            } else {
                const radius = this.getCoZoneRadius();
                return (coGridIndexOnMap == null) || (radius == null)
                    ? false
                    : GridIndexHelpers.getDistance(targetGridIndex, coGridIndexOnMap) <= radius;
            }
        }

        public getCoUsingSkillType(): Types.CoSkillType {
            return this._coUsingSkillType;
        }
        public setCoUsingSkillType(skillType: Types.CoSkillType): void {
            this._coUsingSkillType = skillType;
            Notify.dispatch(Notify.Type.BwCoUsingSkillTypeChanged);
        }
        public getCoCurrentSkills(): number[] | null {
            return this.getCoSkills(this.getCoUsingSkillType());
        }
        public getCoSkills(skillType: Types.CoSkillType): number[] | null {
            const cfg = this._getCoBasicCfg();
            if (!cfg) {
                return null;
            } else {
                switch (skillType) {
                    case Types.CoSkillType.Passive      : return cfg.passiveSkills;
                    case Types.CoSkillType.Power        : return cfg.powerSkills;
                    case Types.CoSkillType.SuperPower   : return cfg.superPowerSkills;
                    default                             : return null;
                }
            }
        }
        public checkCoIsUsingActiveSkill(): boolean {
            const t = this.getCoUsingSkillType();
            return (t === Types.CoSkillType.Power) || (t === Types.CoSkillType.SuperPower);
        }

        public getCoIsDestroyedInTurn(): boolean {
            return this._coIsDestroyedInTurn;
        }
        public setCoIsDestroyedInTurn(isDestroyed: boolean): void {
            this._coIsDestroyedInTurn = isDestroyed;
        }

        private _getCoBasicCfg(): Types.CoBasicCfg | null {
            const coId = this.getCoId();
            return coId == null
                ? null
                : ConfigManager.getCoBasicCfg(this._war.getConfigVersion(), coId);
        }
    }
}
