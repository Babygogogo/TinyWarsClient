
namespace TinyWars.BaseWar {
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import Logger           = Utility.Logger;
    import ConfigManager    = Utility.ConfigManager;
    import ClientErrorCode  = Utility.ClientErrorCode;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import ProtoTypes       = Utility.ProtoTypes;
    import CommonConstants  = Utility.CommonConstants;
    import GridIndex        = Types.GridIndex;
    import PlayerAliveState = Types.PlayerAliveState;
    import CoSkillType      = Types.CoSkillType;
    import ISerialPlayer    = ProtoTypes.WarSerialization.ISerialPlayer;

    export class BwPlayer {
        private _playerIndex            : number;
        private _fund                   : number;
        private _hasVotedForDraw        : boolean;
        private _aliveState             : Types.PlayerAliveState;
        private _restTimeToBoot         : number;
        private _userId                 : number;
        private _unitAndTileSkinId      : number;
        private _coId                   : number;
        private _coCurrentEnergy        : number;
        private _coUsingSkillType       : Types.CoSkillType;
        private _coIsDestroyedInTurn    : boolean;
        private _watchOngoingSrcUserIds : Set<number>;
        private _watchRequestSrcUserIds : Set<number>;

        private _war                    : BwWar;

        public init(data: ISerialPlayer, configVersion: string): ClientErrorCode {
            const fund = data.fund;
            if (fund == null) {
                return ClientErrorCode.BwPlayerInit00;
            }

            const hasVotedForDraw = data.hasVotedForDraw;
            if (hasVotedForDraw == null) {
                return ClientErrorCode.BwPlayerInit01;
            }

            const aliveState = data.aliveState as PlayerAliveState;
            if ((aliveState !== PlayerAliveState.Alive) &&
                (aliveState !== PlayerAliveState.Dead)  &&
                (aliveState !== PlayerAliveState.Dying)
            ) {
                return ClientErrorCode.BwPlayerInit02;
            }

            const playerIndex = data.playerIndex;
            if ((playerIndex == null)                               ||
                (playerIndex > CommonConstants.WarMaxPlayerIndex)   ||
                (playerIndex < CommonConstants.WarNeutralPlayerIndex)
            ) {
                return ClientErrorCode.BwPlayerInit03;
            }

            const restTimeToBoot = data.restTimeToBoot;
            if (restTimeToBoot == null) {
                return ClientErrorCode.BwPlayerInit04;
            }

            const coIsDestroyedInTurn = data.coIsDestroyedInTurn;
            if (coIsDestroyedInTurn == null) {
                return ClientErrorCode.BwPlayerInit05;
            }

            const unitAndTileSkinId = data.unitAndTileSkinId;
            if ((unitAndTileSkinId == null)                                                             ||
                ((unitAndTileSkinId === 0) && (playerIndex !== CommonConstants.WarNeutralPlayerIndex))  ||
                ((unitAndTileSkinId !== 0) && (playerIndex === CommonConstants.WarNeutralPlayerIndex))
            ) {
                return ClientErrorCode.BwPlayerInit06;
            }

            const coId = data.coId;
            if (coId == null) {
                return ClientErrorCode.BwPlayerInit07;
            }

            const coConfig = ConfigManager.getCoBasicCfg(configVersion, coId);
            if (coConfig == null) {
                return ClientErrorCode.BwPlayerInit08;
            }

            const coUsingSkillType = data.coUsingSkillType as CoSkillType;
            if ((coUsingSkillType !== CoSkillType.Passive)  &&
                (coUsingSkillType !== CoSkillType.Power)    &&
                (coUsingSkillType !== CoSkillType.SuperPower)
            ) {
                return ClientErrorCode.BwPlayerInit09;
            }

            if (((coUsingSkillType === CoSkillType.Power)       && (!coConfig.powerSkills?.length))     ||
                ((coUsingSkillType === CoSkillType.SuperPower)  && (!coConfig.superPowerSkills?.length))
            ) {
                return ClientErrorCode.BwPlayerInit10;
            }

            const coCurrentEnergy = data.coCurrentEnergy;
            if ((coCurrentEnergy != null) && (coCurrentEnergy > BwHelpers.getCoMaxEnergy(coConfig))) {
                return ClientErrorCode.BwPlayerInit11;
            }

            if (playerIndex === CommonConstants.WarNeutralPlayerIndex) {
                if ((aliveState !== PlayerAliveState.Alive) ||
                    (coCurrentEnergy != null)
                ) {
                    return ClientErrorCode.BwPlayerInit12;
                }
            }

            this.setFund(fund);
            this.setHasVotedForDraw(hasVotedForDraw);
            this.setAliveState(aliveState);
            this._setPlayerIndex(playerIndex);
            this.setRestTimeToBoot(restTimeToBoot);
            this.setCoUsingSkillType(coUsingSkillType);
            this.setCoIsDestroyedInTurn(coIsDestroyedInTurn);
            this.setUserId(data.userId);
            this._setUnitAndTileSkinId(unitAndTileSkinId);
            this.setCoId(coId);
            this.setCoCurrentEnergy(coCurrentEnergy);
            this._setWatchOngoingSrcUserIds(data.watchOngoingSrcUserIdArray || []);
            this._setWatchRequestSrcUserIds(data.watchRequestSrcUserIdArray || []);

            return ClientErrorCode.NoError;
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }

        public serialize(): ISerialPlayer | undefined {
            const fund = this.getFund();
            if (fund == null) {
                Logger.error(`BwPlayer.serialize() empty fund.`);
                return undefined;
            }

            const hasVotedForDraw = this.getHasVotedForDraw();
            if (hasVotedForDraw == null) {
                Logger.error(`BwPlayer.serialize() empty hasVotedForDraw.`);
                return undefined;
            }

            const aliveState = this.getAliveState();
            if (aliveState == null) {
                Logger.error(`BwPlayer.serialize() empty aliveState.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwPlayer.serialize() empty playerIndex.`);
                return undefined;
            }

            const restTimeToBoot = this.getRestTimeToBoot();
            if (restTimeToBoot == null) {
                Logger.error(`BwPlayer.serialize() empty restTimeToBoo.`);
                return undefined;
            }

            const coUsingSkillType = this.getCoUsingSkillType();
            if (coUsingSkillType == null) {
                Logger.error(`BwPlayer.serialize() empty coUsingSkillType.`);
                return undefined;
            }

            const coIsDestroyedInTurn = this.getCoIsDestroyedInTurn();
            if (coIsDestroyedInTurn == null) {
                Logger.error(`BwPlayer.serialize() empty coIsDestroyedInTurn.`);
                return undefined;
            }

            const unitAndTileSkinId = this.getUnitAndTileSkinId();
            if (unitAndTileSkinId == null) {
                Logger.error(`BwPlayer.serialize() empty unitAndTileSkinId.`);
                return undefined;
            }

            const coId = this.getCoId();
            if (coId == null) {
                Logger.error(`BwPlayer.serialize() empty coId.`);
                return undefined;
            }

            return {
                playerIndex,
                fund,
                hasVotedForDraw,
                aliveState,
                restTimeToBoot,
                coUsingSkillType,
                coIsDestroyedInTurn,
                unitAndTileSkinId,
                userId                      : this.getUserId(),
                coId,
                coCurrentEnergy             : this.getCoCurrentEnergy(),
                watchRequestSrcUserIdArray  : [...(this.getWatchRequestSrcUserIds() || [])],
                watchOngoingSrcUserIdArray  : [...(this.getWatchOngoingSrcUserIds() || [])],
            };
        }
        public serializeForSimulation(): ISerialPlayer {
            const fund = this.getFund();
            if (fund == null) {
                Logger.error(`BwPlayer.serializeForSimulation() empty fund.`);
                return undefined;
            }

            const hasVotedForDraw = this.getHasVotedForDraw();
            if (hasVotedForDraw == null) {
                Logger.error(`BwPlayer.serializeForSimulation() empty hasVotedForDraw.`);
                return undefined;
            }

            const aliveState = this.getAliveState();
            if (aliveState == null) {
                Logger.error(`BwPlayer.serializeForSimulation() empty aliveState.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwPlayer.serializeForSimulation() empty playerIndex.`);
                return undefined;
            }

            const restTimeToBoot = this.getRestTimeToBoot();
            if (restTimeToBoot == null) {
                Logger.error(`BwPlayer.serializeForSimulation() empty restTimeToBoo.`);
                return undefined;
            }

            const coUsingSkillType = this.getCoUsingSkillType();
            if (coUsingSkillType == null) {
                Logger.error(`BwPlayer.serializeForSimulation() empty coUsingSkillType.`);
                return undefined;
            }

            const coIsDestroyedInTurn = this.getCoIsDestroyedInTurn();
            if (coIsDestroyedInTurn == null) {
                Logger.error(`BwPlayer.serializeForSimulation() empty coIsDestroyedInTurn.`);
                return undefined;
            }

            const unitAndTileSkinId = this.getUnitAndTileSkinId();
            if (unitAndTileSkinId == null) {
                Logger.error(`BwPlayer.serializeForSimulation() empty unitAndTileSkinId.`);
                return undefined;
            }

            const coId = this.getCoId();
            if (coId == null) {
                Logger.error(`BwPlayer.serializeForSimulation() empty coId.`);
                return undefined;
            }

            const war               = this._getWar();
            const shouldShowFund    = (!war.getFogMap().checkHasFogCurrently()) || (war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(this.getTeamIndex()));
            return {
                playerIndex,
                fund                        : shouldShowFund ? fund : 0,
                hasVotedForDraw,
                aliveState,
                restTimeToBoot,
                coUsingSkillType,
                coIsDestroyedInTurn,
                unitAndTileSkinId,
                userId                      : playerIndex > 0 ? User.UserModel.getSelfUserId() : null,
                coId,
                coCurrentEnergy             : this.getCoCurrentEnergy(),
                watchRequestSrcUserIdArray  : [],
                watchOngoingSrcUserIdArray  : []
            };
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        protected _getWar(): BwWar {
            return this._war;
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
        public checkCanVoteForDraw(): boolean {
            return BwHelpers.checkCanVoteForDraw({
                playerIndex : this.getPlayerIndex(),
                aliveState  : this.getAliveState(),
            });
        }

        public setAliveState(alive: Types.PlayerAliveState): void {
            this._aliveState = alive;
        }
        public getAliveState(): Types.PlayerAliveState {
            return this._aliveState;
        }

        private _setPlayerIndex(index: number): void {
            this._playerIndex = index;
        }
        public getPlayerIndex(): number {
            return this._playerIndex;
        }
        public checkIsNeutral(): boolean {
            return this.getPlayerIndex() === 0;
        }

        public getTeamIndex(): number {
            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwPlayer.getTeamIndex() empty playerIndex.`);
                return undefined;
            }

            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwPlayer.getTeamIndex() empty war.`);
                return undefined;
            }

            return war.getCommonSettingManager().getTeamIndex(playerIndex);
        }

        public setRestTimeToBoot(seconds: number): void {
            this._restTimeToBoot = seconds;
        }
        public getRestTimeToBoot(): number {
            return this._restTimeToBoot;
        }

        private _setWatchOngoingSrcUserIds(list: number[]): void {
            this._watchOngoingSrcUserIds = new Set(list);
        }
        public getWatchOngoingSrcUserIds(): Set<number> {
            return this._watchOngoingSrcUserIds;
        }
        public addWatchOngoingSrcUserId(userId: number): void {
            this.getWatchOngoingSrcUserIds().add(userId);
        }
        public removeWatchOngoingSrcUserId(userId: number): void {
            this.getWatchOngoingSrcUserIds().delete(userId);
        }

        private _setWatchRequestSrcUserIds(list: number[]): void {
            this._watchRequestSrcUserIds = new Set(list);
        }
        public getWatchRequestSrcUserIds(): Set<number> {
            return this._watchRequestSrcUserIds;
        }
        public addWatchRequestSrcUserId(userId: number): void {
            this.getWatchRequestSrcUserIds().add(userId);
        }
        public removeWatchRequestSrcUserId(userId: number): void {
            this.getWatchRequestSrcUserIds().delete(userId);
        }
        public checkCanAddWatchRequestSrcUserId(userId: number): boolean {
            return (this.getAliveState() === Types.PlayerAliveState.Alive)
                && (this.getUserId() !== userId)
                && (!this.getWatchRequestSrcUserIds().has(userId))
                && (!this.getWatchOngoingSrcUserIds().has(userId));
        }

        public setUserId(id: number | undefined | null): void {
            this._userId = id;
        }
        public getUserId(): number | undefined | null {
            return this._userId;
        }

        private _setUnitAndTileSkinId(unitAndTileSkinId: number): void {
            this._unitAndTileSkinId = unitAndTileSkinId;
        }
        public getUnitAndTileSkinId(): number | undefined {
            return this._unitAndTileSkinId;
        }

        public async getNickname(): Promise<string> {
            const userId = this.getUserId();
            return (userId == null)
                ?  `A.I.`
                : await User.UserModel.getUserNickname(userId) || `??`;
        }

        public setCoId(coId: number | null | undefined): void {
            if (this._coId != coId) {
                this._coId = coId;
                Notify.dispatch(Notify.Type.BwCoIdChanged);
            }
        }
        public getCoId(): number | null | undefined {
            return this._coId;
        }

        public setCoCurrentEnergy(energy: number): void {
            this._coCurrentEnergy = energy;
            Notify.dispatch(Notify.Type.BwCoEnergyChanged);
        }
        public getCoCurrentEnergy(): number {
            return this._coCurrentEnergy;
        }
        public getCoMaxEnergy(): number | null | undefined {
            const config = this._getCoBasicCfg();
            return config ? BwHelpers.getCoMaxEnergy(config) : 0;
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
        public getCoGridIndexListOnMap(): GridIndex[] | undefined {
            const war = this._getWar();
            if (war == null) {
                Logger.error(`BwPlayer.getCoGridIndexListOnMap() empty war.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwPlayer.getCoGridIndexListOnMap() empty playerIndex.`);
                return undefined;
            }

            const unitMap = war.getUnitMap();
            if (unitMap == null) {
                Logger.error(`BwPlayer.getCoGridIndexListOnMap() empty unitMap.`);
                return undefined;
            }

            return unitMap.getCoGridIndexListOnMap(playerIndex);
        }

        public checkIsInCoZone(targetGridIndex: GridIndex, coGridIndexOnMap: GridIndex[]): boolean {
            const radius = this.getCoZoneRadius();
            if (radius == null) {
                Logger.error(`BwPlayer.checkIsInCoZone() empty radius.`);
                return false;
            }

            const distance = GridIndexHelpers.getMinDistance(targetGridIndex, coGridIndexOnMap);
            return (distance != null) && (distance <= radius);
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
        public checkHasZoneSkillForCurrentSkills(): boolean {
            const currentSkills = this.getCoCurrentSkills();
            if ((!currentSkills) || (!currentSkills.length)) {
                return true;
            } else {
                const version = this._war.getConfigVersion();
                for (const skillId of currentSkills) {
                    if (Utility.ConfigManager.getCoSkillCfg(version, skillId).showZone) {
                        return true;
                    }
                }
                return false;
            }
        }

        public getCoIsDestroyedInTurn(): boolean {
            return this._coIsDestroyedInTurn;
        }
        public setCoIsDestroyedInTurn(isDestroyed: boolean): void {
            this._coIsDestroyedInTurn = isDestroyed;
        }

        public getCoMaxLoadCount(): number | undefined {
            const cfg = this._getCoBasicCfg();
            if (cfg == null) {
                Logger.error(`BwPlayer.getCoMaxLoadCount() empty cfg.`);
                return undefined;
            }

            return cfg.maxLoadCount;
        }

        private _getCoBasicCfg(): ProtoTypes.Config.ICoBasicCfg | null {
            const coId = this.getCoId();
            return coId == null
                ? null
                : Utility.ConfigManager.getCoBasicCfg(this._war.getConfigVersion(), coId);
        }
    }
}
