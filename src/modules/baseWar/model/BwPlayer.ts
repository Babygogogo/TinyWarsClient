
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
import UserModel            from "../../user/model/UserModel";
import TwnsBwWar            from "./BwWar";

namespace TwnsBwPlayer {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import GridIndex        = Types.GridIndex;
    import PlayerAliveState = Types.PlayerAliveState;
    import CoSkillType      = Types.CoSkillType;
    import CoType           = Types.CoType;
    import ISerialPlayer    = ProtoTypes.WarSerialization.ISerialPlayer;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import BwWar            = TwnsBwWar.BwWar;

    export class BwPlayer {
        private _playerIndex?               : number;
        private _fund?                      : number;
        private _hasVotedForDraw?           : boolean;
        private _aliveState?                : Types.PlayerAliveState;
        private _restTimeToBoot?            : number;
        private _userId?                    : number | null;
        private _unitAndTileSkinId?         : number;
        private _coId?                      : number;
        private _coCurrentEnergy?           : number;
        private _coUsingSkillType?          : Types.CoSkillType;
        private _coIsDestroyedInTurn?       : boolean;
        private _watchOngoingSrcUserIds?    : Set<number>;
        private _watchRequestSrcUserIds?    : Set<number>;

        private _war?                       : BwWar;

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

            if (((coUsingSkillType === CoSkillType.Power)       && (!(coConfig.powerSkills || []).length))      ||
                ((coUsingSkillType === CoSkillType.SuperPower)  && (!(coConfig.superPowerSkills || []).length))
            ) {
                return ClientErrorCode.BwPlayerInit10;
            }

            const coCurrentEnergy = data.coCurrentEnergy || 0;
            if (coCurrentEnergy > WarCommonHelpers.getCoMaxEnergy(coConfig)) {
                return ClientErrorCode.BwPlayerInit11;
            }

            if ((playerIndex === CommonConstants.WarNeutralPlayerIndex) &&
                (aliveState !== PlayerAliveState.Alive)
            ) {
                return ClientErrorCode.BwPlayerInit12;
            }

            this.setFund(fund);
            this.setHasVotedForDraw(hasVotedForDraw);
            this.setAliveState(aliveState);
            this._setPlayerIndex(playerIndex);
            this.setRestTimeToBoot(restTimeToBoot);
            this.setCoUsingSkillType(coUsingSkillType);
            this.setCoIsDestroyedInTurn(coIsDestroyedInTurn);
            this.setUserId(data.userId ?? null);
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

        public serialize(): ISerialPlayer {
            return {
                playerIndex                 : this.getPlayerIndex(),
                fund                        : this.getFund(),
                hasVotedForDraw             : this.getHasVotedForDraw(),
                aliveState                  : this.getAliveState(),
                restTimeToBoot              : this.getRestTimeToBoot(),
                coUsingSkillType            : this.getCoUsingSkillType(),
                coIsDestroyedInTurn         : this.getCoIsDestroyedInTurn(),
                unitAndTileSkinId           : this.getUnitAndTileSkinId(),
                userId                      : this.getUserId(),
                coId                        : this.getCoId(),
                coCurrentEnergy             : this.getCoCurrentEnergy(),
                watchRequestSrcUserIdArray  : [...(this.getWatchRequestSrcUserIds() || [])],
                watchOngoingSrcUserIdArray  : [...(this.getWatchOngoingSrcUserIds() || [])],
            };
        }
        public serializeForCreateSfw(): ISerialPlayer {
            const war                   = this._getWar();
            const playerIndex           = this.getPlayerIndex();
            const shouldShowFund        = (!war.getFogMap().checkHasFogCurrently()) || (war.getPlayerManager().getAliveWatcherTeamIndexesForSelf().has(this.getTeamIndex()));
            return {
                playerIndex,
                fund                        : shouldShowFund ? this.getFund() : 0,
                hasVotedForDraw             : this.getHasVotedForDraw(),
                aliveState                  : this.getAliveState(),
                restTimeToBoot              : this.getRestTimeToBoot(),
                coUsingSkillType            : this.getCoUsingSkillType(),
                coIsDestroyedInTurn         : this.getCoIsDestroyedInTurn(),
                unitAndTileSkinId           : this.getUnitAndTileSkinId(),
                userId                      : playerIndex > 0 ? UserModel.getSelfUserId() : null,
                coId                        : this.getCoId(),
                coCurrentEnergy             : this.getCoCurrentEnergy(),
                watchRequestSrcUserIdArray  : [],
                watchOngoingSrcUserIdArray  : []
            };
        }
        public serializeForCreateMfr(): ISerialPlayer {
            return this.serializeForCreateSfw();
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        private _getWar(): BwWar {
            return Helpers.getDefined(this._war);
        }

        public setFund(fund: number): void {
            if (this._fund !== fund) {
                this._fund = fund;
                Notify.dispatch(NotifyType.BwPlayerFundChanged, this);
            }
        }
        public getFund(): number {
            return Helpers.getDefined(this._fund);
        }

        public setHasVotedForDraw(voted: boolean): void {
            this._hasVotedForDraw = voted;
        }
        public getHasVotedForDraw(): boolean {
            return Helpers.getDefined(this._hasVotedForDraw);
        }
        public checkCanVoteForDraw(): boolean {
            return WarCommonHelpers.checkCanVoteForDraw({
                playerIndex : this.getPlayerIndex(),
                aliveState  : this.getAliveState(),
            });
        }

        public setAliveState(alive: Types.PlayerAliveState): void {
            this._aliveState = alive;
        }
        public getAliveState(): Types.PlayerAliveState {
            return Helpers.getDefined(this._aliveState);
        }

        private _setPlayerIndex(index: number): void {
            this._playerIndex = index;
        }
        public getPlayerIndex(): number {
            return Helpers.getDefined(this._playerIndex);
        }
        public checkIsNeutral(): boolean {
            return this.getPlayerIndex() === 0;
        }

        public getTeamIndex(): number {
            return this._getWar().getCommonSettingManager().getTeamIndex(this.getPlayerIndex());
        }

        public setRestTimeToBoot(seconds: number): void {
            this._restTimeToBoot = seconds;
        }
        public getRestTimeToBoot(): number {
            return Helpers.getDefined(this._restTimeToBoot);
        }

        private _setWatchOngoingSrcUserIds(list: number[]): void {
            this._watchOngoingSrcUserIds = new Set(list);
        }
        public getWatchOngoingSrcUserIds(): Set<number> {
            return Helpers.getDefined(this._watchOngoingSrcUserIds);
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
            return Helpers.getDefined(this._watchRequestSrcUserIds);
        }
        public addWatchRequestSrcUserId(userId: number): void {
            this.getWatchRequestSrcUserIds().add(userId);
        }
        public removeWatchRequestSrcUserId(userId: number): void {
            this.getWatchRequestSrcUserIds().delete(userId);
        }

        public setUserId(id: number | null): void {
            this._userId = id;
        }
        public getUserId(): number | null {
            return Helpers.getDefined(this._userId);
        }

        private _setUnitAndTileSkinId(unitAndTileSkinId: number): void {
            this._unitAndTileSkinId = unitAndTileSkinId;
        }
        public getUnitAndTileSkinId(): number {
            return Helpers.getDefined(this._unitAndTileSkinId);
        }

        public async getNickname(): Promise<string> {
            const userId = this.getUserId();
            return (userId == null)
                ?  `A.I.`
                : await UserModel.getUserNickname(userId).catch(err => { CompatibilityHelpers.showError(err); throw err; }) || `??`;
        }

        public setCoId(coId: number): void {
            if (this._coId !== coId) {
                this._coId = coId;
                Notify.dispatch(NotifyType.BwCoIdChanged, this);
            }
        }
        public getCoId(): number {
            return Helpers.getDefined(this._coId);
        }

        public setCoCurrentEnergy(energy: number): void {
            this._coCurrentEnergy = energy;
            Notify.dispatch(NotifyType.BwCoEnergyChanged);
        }
        public getCoCurrentEnergy(): number {
            return Helpers.getDefined(this._coCurrentEnergy);
        }
        public getCoMaxEnergy(): number {
            const config = this._getCoBasicCfg();
            return config ? WarCommonHelpers.getCoMaxEnergy(config) : 0;
        }
        public getCoZoneExpansionEnergyList(): number[] | null {
            const cfg = this._getCoBasicCfg();
            return cfg ? cfg.zoneExpansionEnergyList ?? null : null;
        }
        public getCoPowerEnergy(): number | null {
            const energyList    = this._getCoBasicCfg().powerEnergyList;
            const energy        = energyList ? energyList[0] : null;
            return (energy != null) && (energy >= 0) ? energy : null;
        }
        public getCoSuperPowerEnergy(): number | null {
            const energyList    = this._getCoBasicCfg().powerEnergyList;
            const energy        = energyList ? energyList[1] : null;
            return (energy != null) && (energy >= 0) ? energy : null;
        }

        public getCoZoneRadius(): number {
            const cfg       = this._getCoBasicCfg();
            const energy    = this.getCoCurrentEnergy();
            let radius      = Helpers.getExisted(cfg.zoneRadius);
            for (const e of cfg.zoneExpansionEnergyList || []) {
                if (energy >= e) {
                    ++radius;
                }
            }

            return radius;
        }
        public getCoGridIndexListOnMap(): GridIndex[] {
            return this._getWar().getUnitMap().getCoGridIndexListOnMap(this.getPlayerIndex());
        }

        public checkIsInCoZone(targetGridIndex: GridIndex, coGridIndexOnMap: GridIndex[]): boolean {
            return GridIndexHelpers.getMinDistance(targetGridIndex, coGridIndexOnMap) <= this.getCoZoneRadius();
        }

        public getCoUsingSkillType(): Types.CoSkillType {
            return Helpers.getDefined(this._coUsingSkillType);
        }
        public setCoUsingSkillType(skillType: Types.CoSkillType): void {
            if (this._coUsingSkillType !== skillType) {
                this._coUsingSkillType = skillType;
                Notify.dispatch(NotifyType.BwCoUsingSkillTypeChanged);
            }
        }
        public getCoCurrentSkills(): number[] {
            return this.getCoSkills(this.getCoUsingSkillType());
        }
        public getCoSkills(skillType: Types.CoSkillType): number[] {
            const cfg = this._getCoBasicCfg();
            switch (skillType) {
                case Types.CoSkillType.Passive      : return cfg.passiveSkills || [];
                case Types.CoSkillType.Power        : return cfg.powerSkills || [];
                case Types.CoSkillType.SuperPower   : return cfg.superPowerSkills || [];
                default                             : throw Helpers.newError(`Invalid skillType: ${skillType}`);
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
                const version = this._getWar().getConfigVersion();
                for (const skillId of currentSkills) {
                    if (ConfigManager.getCoSkillCfg(version, skillId).showZone) {
                        return true;
                    }
                }
                return false;
            }
        }
        public checkCanUseCoSkill(skillType: Types.CoSkillType): boolean {
            if (this.getCoType() !== CoType.Global) {
                return false;
            }

            if ((this.checkCoIsUsingActiveSkill())  ||
                (!this.getCoSkills(skillType))
            ) {
                return false;
            }

            const energy = this.getCoCurrentEnergy();
            if (skillType === Types.CoSkillType.Power) {
                const powerEnergy = this.getCoPowerEnergy();
                return (powerEnergy != null) && (energy >= powerEnergy);

            } else if (skillType === Types.CoSkillType.SuperPower) {
                const superPowerEnergy = this.getCoSuperPowerEnergy();
                return (superPowerEnergy != null) && (energy >= superPowerEnergy);

            } else {
                return false;
            }
        }

        public getCoIsDestroyedInTurn(): boolean {
            return Helpers.getDefined(this._coIsDestroyedInTurn);
        }
        public setCoIsDestroyedInTurn(isDestroyed: boolean): void {
            this._coIsDestroyedInTurn = isDestroyed;
        }

        public getCoMaxLoadCount(): number {
            return Helpers.getExisted(this._getCoBasicCfg().maxLoadCount);
        }
        public getCoType(): CoType {
            const maxLoadCount = this.getCoMaxLoadCount();
            if (maxLoadCount == null) {
                return CoType.Undefined;
            } else {
                return maxLoadCount > 0 ? CoType.Zoned : CoType.Global;
            }
        }

        public getUnitCostModifier(gridIndex: GridIndex, hasLoadedCo: boolean, unitType: Types.UnitType): number {
            if (this.getCoId() === CommonConstants.CoEmptyId) {
                return 1;
            }

            const coZoneRadius              = this.getCoZoneRadius();
            const configVersion             = this._getWar()?.getConfigVersion();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => this.getCoGridIndexListOnMap());
            let modifier                    = 1;
            for (const skillId of this.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.selfUnitCost;
                if ((cfg)                                                                           &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))      &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                        coZoneRadius,
                    })))
                ) {
                    modifier *= cfg[2] / 100;
                }
            }

            return modifier;
        }

        private _getCoBasicCfg(): ProtoTypes.Config.ICoBasicCfg {
            return ConfigManager.getCoBasicCfg(this._getWar().getConfigVersion(), this.getCoId());
        }
    }
}

export default TwnsBwPlayer;
