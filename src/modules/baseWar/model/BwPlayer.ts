
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Notify               from "../../tools/notify/Notify";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
// import UserModel            from "../../user/model/UserModel";
// import TwnsBwWar            from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import GridIndex        = Types.GridIndex;
    import PlayerAliveState = Types.PlayerAliveState;
    import CoSkillType      = Types.CoSkillType;
    import CoType           = Types.CoType;
    import GameConfig       = Config.GameConfig;
    import ISerialPlayer    = CommonProto.WarSerialization.ISerialPlayer;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;

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
        private _coPowerActivatedCount?     : number;
        private _hasTakenManualAction?      : boolean;
        private _watchOngoingSrcUserIds?    : Set<number>;
        private _watchRequestSrcUserIds?    : Set<number>;

        private _war?                       : BwWar;

        public init(data: ISerialPlayer, gameConfig: GameConfig): void {
            const fund              = Helpers.getExisted(data.fund, ClientErrorCode.BwPlayer_Init_00);
            const hasVotedForDraw   = Helpers.getExisted(data.hasVotedForDraw, ClientErrorCode.BwPlayer_Init_01);
            const aliveState        = data.aliveState as PlayerAliveState;
            if ((aliveState !== PlayerAliveState.Alive) &&
                (aliveState !== PlayerAliveState.Dead)  &&
                (aliveState !== PlayerAliveState.Dying)
            ) {
                throw Helpers.newError(`Invalid aliveState: ${aliveState}`, ClientErrorCode.BwPlayer_Init_02);
            }

            const playerIndex = data.playerIndex;
            if ((playerIndex == null)                               ||
                (playerIndex > CommonConstants.WarMaxPlayerIndex)   ||
                (playerIndex < CommonConstants.WarNeutralPlayerIndex)
            ) {
                throw Helpers.newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwPlayer_Init_03);
            }

            const restTimeToBoot        = Helpers.getExisted(data.restTimeToBoot, ClientErrorCode.BwPlayer_Init_04);
            const coIsDestroyedInTurn   = Helpers.getExisted(data.coIsDestroyedInTurn, ClientErrorCode.BwPlayer_Init_05);
            const unitAndTileSkinId     = data.unitAndTileSkinId;
            if ((unitAndTileSkinId == null)                                                             ||
                ((unitAndTileSkinId === 0) && (playerIndex !== CommonConstants.WarNeutralPlayerIndex))  ||
                ((unitAndTileSkinId !== 0) && (playerIndex === CommonConstants.WarNeutralPlayerIndex))
            ) {
                throw Helpers.newError(`Invalid unitAndTileSkinId: ${unitAndTileSkinId}`, ClientErrorCode.BwPlayer_Init_06);
            }

            const coId              = Helpers.getExisted(data.coId, ClientErrorCode.BwPlayer_Init_07);
            const coConfig          = gameConfig.getCoBasicCfg(coId);
            const coUsingSkillType  = data.coUsingSkillType as CoSkillType;
            if ((coUsingSkillType !== CoSkillType.Passive)  &&
                (coUsingSkillType !== CoSkillType.Power)    &&
                (coUsingSkillType !== CoSkillType.SuperPower)
            ) {
                throw Helpers.newError(`Invalid coUsingSkillType: ${coUsingSkillType}`, ClientErrorCode.BwPlayer_Init_08);
            }

            // if (((coUsingSkillType === CoSkillType.Power)       && (!(coConfig.powerSkills || []).length))      ||
            //     ((coUsingSkillType === CoSkillType.SuperPower)  && (!(coConfig.superPowerSkills || []).length))
            // ) {
            //     throw Helpers.newError(`Invalid coUsingSkillType: ${coUsingSkillType}`, ClientErrorCode.BwPlayer_Init_09);
            // }

            const coCurrentEnergy = data.coCurrentEnergy || 0;
            // if (coCurrentEnergy > WarCommonHelpers.getCoMaxEnergy(coConfig)) {
            //     throw Helpers.newError(`Invalid coCurrentEnergy: ${coCurrentEnergy}`, ClientErrorCode.BwPlayer_Init_10);
            // }

            // if ((playerIndex === CommonConstants.WarNeutralPlayerIndex) &&
            //     (aliveState !== PlayerAliveState.Alive)
            // ) {
            //     throw Helpers.newError(`The neutral player is not alive.`, ClientErrorCode.BwPlayer_Init_11);
            // }

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
            this._setCoPowerActivatedCount(data.coPowerActivatedCount ?? 0);
            this.setHasTakenManualAction(data.hasTakenManualAction ?? false);
            this.setWatchOngoingSrcUserIds(data.watchOngoingSrcUserIdArray || []);
            this.setWatchRequestSrcUserIds(data.watchRequestSrcUserIdArray || []);
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
                coPowerActivatedCount       : this.getCoPowerActivatedCount(),
                hasTakenManualAction        : this.getHasTakenManualAction(),
                watchRequestSrcUserIdArray  : [...(this.getWatchRequestSrcUserIds() || [])],
                watchOngoingSrcUserIdArray  : [...(this.getWatchOngoingSrcUserIds() || [])],
            };
        }
        public serializeForCreateSfw(): ISerialPlayer {
            const war                   = this._getWar();
            const playerIndex           = this.getPlayerIndex();
            const shouldShowFund        = (!war.getFogMap().checkHasFogCurrently()) || (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(this.getTeamIndex()));
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
                coPowerActivatedCount       : this.getCoPowerActivatedCount(),
                hasTakenManualAction        : this.getHasTakenManualAction(),
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
            return Helpers.getExisted(this._war);
        }

        public setFund(fund: number): void {
            if (this._fund !== fund) {
                this._fund = fund;
                Notify.dispatch(NotifyType.BwPlayerFundChanged, this);
            }
        }
        public getFund(): number {
            return Helpers.getExisted(this._fund);
        }

        public setHasVotedForDraw(voted: boolean): void {
            this._hasVotedForDraw = voted;
        }
        public getHasVotedForDraw(): boolean {
            return Helpers.getExisted(this._hasVotedForDraw);
        }

        public setAliveState(alive: Types.PlayerAliveState): void {
            this._aliveState = alive;
        }
        public getAliveState(): Types.PlayerAliveState {
            return Helpers.getExisted(this._aliveState);
        }

        private _setPlayerIndex(index: number): void {
            this._playerIndex = index;
        }
        public getPlayerIndex(): number {
            return Helpers.getExisted(this._playerIndex);
        }
        public checkIsNeutral(): boolean {
            return this.getPlayerIndex() === CommonConstants.WarNeutralPlayerIndex;
        }

        public getTeamIndex(): number {
            return this._getWar().getCommonSettingManager().getTeamIndex(this.getPlayerIndex());
        }

        public setRestTimeToBoot(seconds: number): void {
            this._restTimeToBoot = seconds;
        }
        public getRestTimeToBoot(): number {
            return Helpers.getExisted(this._restTimeToBoot);
        }

        public setWatchOngoingSrcUserIds(list: number[]): void {
            this._watchOngoingSrcUserIds = new Set(list);
        }
        public getWatchOngoingSrcUserIds(): Set<number> {
            return Helpers.getExisted(this._watchOngoingSrcUserIds);
        }
        public addWatchOngoingSrcUserId(userId: number): void {
            this.getWatchOngoingSrcUserIds().add(userId);
        }
        public removeWatchOngoingSrcUserId(userId: number): void {
            this.getWatchOngoingSrcUserIds().delete(userId);
        }

        public setWatchRequestSrcUserIds(list: number[]): void {
            this._watchRequestSrcUserIds = new Set(list);
        }
        public getWatchRequestSrcUserIds(): Set<number> {
            return Helpers.getExisted(this._watchRequestSrcUserIds);
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
            return Helpers.getDefined(this._userId, ClientErrorCode.BwPlayer_GetUserId_00);
        }

        private _setUnitAndTileSkinId(unitAndTileSkinId: number): void {
            this._unitAndTileSkinId = unitAndTileSkinId;
        }
        public getUnitAndTileSkinId(): number {
            return Helpers.getExisted(this._unitAndTileSkinId);
        }

        public async getNickname(): Promise<string> {
            const userId = this.getUserId();
            return (userId == null)
                ?  `A.I.`
                : await UserModel.getUserNickname(userId) || `??`;
        }

        public setCoId(coId: number): void {
            if (this._coId !== coId) {
                this._coId = coId;
                Notify.dispatch(NotifyType.BwCoIdChanged, this);
            }
        }
        public getCoId(): number {
            return Helpers.getExisted(this._coId);
        }

        public setCoCurrentEnergy(energy: number): void {
            this._coCurrentEnergy = energy;
            Notify.dispatch(NotifyType.BwCoEnergyChanged);
        }
        public getCoCurrentEnergy(): number {
            return Helpers.getExisted(this._coCurrentEnergy);
        }
        public getCoMaxEnergy(): number {
            return this._getRevisedEnergy(WarHelpers.WarCommonHelpers.getCoMaxEnergy(this._getCoBasicCfg()));
        }
        public getCoZoneExpansionEnergyList(): number[] | null {
            const cfg = this._getCoBasicCfg();
            return cfg ? cfg.zoneExpansionEnergyList ?? null : null;
        }
        public getCoPowerEnergy(): number | null {
            const energyList    = this._getCoBasicCfg().powerEnergyList;
            const energy        = energyList ? energyList[0] : null;
            if ((energy == null) || (energy < 0)) {
                return null;
            } else {
                return this._getRevisedEnergy(energy);
            }
        }
        public getCoSuperPowerEnergy(): number | null {
            const energyList    = this._getCoBasicCfg().powerEnergyList;
            const energy        = energyList ? energyList[1] : null;
            if ((energy == null) || (energy < 0)) {
                return null;
            } else {
                return this._getRevisedEnergy(energy);
            }
        }
        private _getRevisedEnergy(energy: number): number {
            const energyType = this.getCoEnergyType();
            if (energyType === Types.CoEnergyType.Dor) {
                return energy;
            } else if (energyType === Types.CoEnergyType.Trilogy) {
                const cfg = Helpers.getExisted(this.getGlobalCoEnergyParameters(), ClientErrorCode.BwPlayer_GetRevisedEnergy_00);
                return Math.floor(energy * (Math.min(cfg[1], this.getCoPowerActivatedCount()) * cfg[0] + 100) / 100);
            } else {
                throw Helpers.newError(`Invalid energyType: ${energyType}`, ClientErrorCode.BwPlayer_GetRevisedEnergy_01);
            }
        }

        public getGlobalCoEnergyParameters(): Types.Undefinable<number[]> {
            return this._getCoBasicCfg().globalCoEnergyParameters;
        }
        public getCoEnergyType(): Types.CoEnergyType {
            return Helpers.getExisted(this._getCoBasicCfg().energyType, ClientErrorCode.BwPlayer_GetCoEnergyType_00);
        }
        public getCoPowerActivatedCount(): number {
            return Helpers.getExisted(this._coPowerActivatedCount, ClientErrorCode.BwPlayer_GetCoPowerActivatedCount_00);
        }
        private _setCoPowerActivatedCount(count: number): void {
            this._coPowerActivatedCount = count;
        }

        public getHasTakenManualAction(): boolean {
            return Helpers.getExisted(this._hasTakenManualAction);
        }
        public setHasTakenManualAction(hasTaken: boolean): void {
            this._hasTakenManualAction = hasTaken;
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
            return Helpers.getExisted(this._coUsingSkillType);
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
                const gameConfig = this._getWar().getGameConfig();
                for (const skillId of currentSkills) {
                    if (gameConfig.getCoSkillCfg(skillId)?.showZone) {
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
        public checkCanGetEnergyWithBattle(): boolean {
            return (!!this._getCoBasicCfg().canGetEnergyWithBattleOnPowerSkills)
                || (!this.checkCoIsUsingActiveSkill());
        }

        public updateOnUseCoSkill(skillType: Types.CoSkillType): void {
            const currentEnergy = this.getCoCurrentEnergy();
            if (skillType === Types.CoSkillType.Power) {
                const powerEnergy = Helpers.getExisted(this.getCoPowerEnergy(), ClientErrorCode.BwPlayer_UpdateOnUseCoSkill_00);
                this.setCoCurrentEnergy(currentEnergy - powerEnergy);

            } else if (skillType === Types.CoSkillType.SuperPower) {
                const superPowerEnergy = Helpers.getExisted(this.getCoSuperPowerEnergy(), ClientErrorCode.BwPlayer_UpdateOnUseCoSkill_01);
                this.setCoCurrentEnergy(currentEnergy - superPowerEnergy);

            } else {
                throw Helpers.newError(`Invalid skillType: ${skillType}`, ClientErrorCode.BwPlayer_UpdateOnUseCoSkill_02);
            }

            this._setCoPowerActivatedCount(this.getCoPowerActivatedCount() + 1);
            this.setCoUsingSkillType(skillType);
        }

        public getCoIsDestroyedInTurn(): boolean {
            return Helpers.getExisted(this._coIsDestroyedInTurn);
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
            const gameConfig                = this._getWar().getGameConfig();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => this.getCoGridIndexListOnMap());
            let modifier                    = 1;
            for (const skillId of this.getCoCurrentSkills() || []) {
                const cfg = gameConfig.getCoSkillCfg(skillId)?.selfUnitCost;
                if ((cfg)                                                                   &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                    ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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

        private _getCoBasicCfg(): CommonProto.Config.ICoBasicCfg {
            return Helpers.getExisted(this._getWar().getGameConfig().getCoBasicCfg(this.getCoId()));
        }
    }
}

// export default TwnsBwPlayer;
