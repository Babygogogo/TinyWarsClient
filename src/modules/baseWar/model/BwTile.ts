
namespace TinyWars.BaseWar {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import Helpers          = Utility.Helpers;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import TileType         = Types.TileType;
    import TileObjectType   = Types.TileObjectType;
    import TileBaseType     = Types.TileBaseType;
    import ISerialTile      = ProtoTypes.WarSerialization.ISerialTile;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export abstract class BwTile {
        private _configVersion  : string;
        private _templateCfg    : Types.TileTemplateCfg;
        private _moveCostCfg    : { [moveType: number]: Types.MoveCostCfg };
        private _gridX          : number;
        private _gridY          : number;
        private _baseShapeId    : number | null;
        private _objectShapeId  : number | null;
        private _baseType       : Types.TileBaseType;
        private _objectType     : TileObjectType;
        private _playerIndex    : number;

        private _currentHp          : number | undefined;
        private _currentBuildPoint  : number | undefined;
        private _currentCapturePoint: number | undefined;

        private _war            : BwWar;
        private _view           : BwTileView;
        private _isFogEnabled   : boolean;

        protected abstract _getViewClass(): new () => BwTileView;

        public init(data: ISerialTile, configVersion: string): BwTile {
            const gridIndex = BwHelpers.convertGridIndex(data.gridIndex);
            if (gridIndex == null) {
                Logger.error(`BwTile.init() empty gridIndex.`);
                return undefined;
            }

            const objectType = data.objectType as TileObjectType;
            if (objectType == null) {
                Logger.error(`BwTile.init() empty objectType.`);
                return undefined;
            }

            const baseType = data.baseType as TileBaseType;
            if (baseType == null) {
                Logger.error(`BwTile.init() empty baseType.`);
                return undefined;
            }

            const playerIndex = data.playerIndex;
            if (playerIndex == null) {
                Logger.error(`BwTile.init() empty playerIndex.`);
                return undefined;
            }

            const templateCfg = ConfigManager.getTileTemplateCfg(configVersion, baseType, objectType);
            if (templateCfg == null) {
                Logger.error(`BwTile.init() no templateCfg.`);
                return undefined;
            }

            const moveCostCfg = ConfigManager.getMoveCostCfg(configVersion, baseType, objectType);
            if (moveCostCfg == null) {
                Logger.error(`BwTile.init() no moveCostCfg.`)
                return undefined;
            }

            this._setGridX(gridIndex.x);
            this._setGridY(gridIndex.y);
            this._setBaseType(baseType);
            this._setObjectType(objectType);
            this._setPlayerIndex(playerIndex);

            this._setConfigVersion(configVersion);
            this._setTemplateCfg(templateCfg);
            this._setMoveCosts(moveCostCfg);
            this.setBaseShapeId(data.baseShapeId);
            this.setObjectShapeId(data.objectShapeId);
            this.setCurrentHp(          data.currentHp           != null ? data.currentHp           : this.getMaxHp());
            this.setCurrentBuildPoint(  data.currentBuildPoint   != null ? data.currentBuildPoint   : this.getMaxBuildPoint());
            this.setCurrentCapturePoint(data.currentCapturePoint != null ? data.currentCapturePoint : this.getMaxCapturePoint());

            this._view = this._view || new (this._getViewClass())();
            this._view.init(this);

            return this;
        }
        public fastInit(data: ISerialTile, configVersion: string): BwTile {
            return this.init(data, configVersion);
        }

        public startRunning(war: BwWar): void {
            this._war = war;
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }

        public getConfigVersion(): string {
            return this._configVersion;
        }
        public getWar(): BwWar {
            return this._war;
        }

        private _setConfigVersion(configVersion: string): void {
            this._configVersion = configVersion;
        }
        private _getConfigVersion(): string | undefined {
            return this._configVersion;
        }

        private _setTemplateCfg(cfg: Types.TileTemplateCfg): void {
            this._templateCfg = cfg;
        }
        private _getTemplateCfg(): Types.TileTemplateCfg | undefined {
            return this._templateCfg;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        public getView(): BwTileView {
            return this._view;
        }

        public updateView(): void {
            this.getView().updateView();
        }

        private _setBaseType(baseType: TileBaseType): void {
            this._baseType = baseType;
        }
        public getBaseType(): TileBaseType | undefined {
            return this._baseType;
        }

        private _setObjectType(objectType: TileObjectType): void {
            this._objectType = objectType;
        }
        public getObjectType(): TileObjectType | undefined {
            return this._objectType;
        }

        public setBaseShapeId(id: number | null | undefined): void {
            this._baseShapeId = id;
        }
        public getBaseShapeId(): number {
            return this._baseShapeId || 0;
        }

        public setObjectShapeId(id: number | null | undefined): void {
            this._objectShapeId = id;
        }
        public getObjectShapeId(): number {
            return this._objectShapeId || 0;
        }

        public getSkinId(): number | undefined {
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwTile.getSkinId() empty player.`);
                return undefined;
            }

            return player.getUnitAndTileSkinId();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hp and armor.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxHp(): number | undefined {
            return this._templateCfg.maxHp;
        }

        public getCurrentHp(): number | undefined {
            return this._currentHp;
        }
        public setCurrentHp(hp: number | undefined): void {
            const maxHp = this.getMaxHp();
            if (maxHp == null) {
                Logger.assert(hp == null, "TileModel.setCurrentHp() error, hp: ", hp);
            } else {
                Logger.assert((hp != null) && (hp >= 0) && (hp <= maxHp), "TileModel.setCurrentHp() error, hp: ", hp);
            }

            this._currentHp = hp;
        }

        public getArmorType(): Types.ArmorType | undefined {
            return this._templateCfg.armorType;
        }

        public checkIsArmorAffectByLuck(): boolean {
            return this._templateCfg.isAffectedByLuck === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for build.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxBuildPoint(): number | undefined {
            return this._templateCfg.maxBuildPoint;
        }

        public getCurrentBuildPoint(): number | undefined {
            return this._currentBuildPoint;
        }
        public setCurrentBuildPoint(point: number | undefined): void {
            const maxPoint = this.getMaxBuildPoint();
            if (maxPoint == null) {
                Logger.assert(point == null, "TileModel.setCurrentBuildPoint() error, point: ", point);
            } else {
                Logger.assert((point != null) && (point >= 0) && (point <= maxPoint), "TileModel.setCurrentBuildPoint() error, point: ", point);
            }

            this._currentBuildPoint = point;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for capture.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxCapturePoint(): number | undefined {
            return this._templateCfg.maxCapturePoint;
        }

        public getCurrentCapturePoint(): number | undefined {
            return this._currentCapturePoint;
        }
        public setCurrentCapturePoint(point: number | undefined): void {
            const maxPoint = this.getMaxCapturePoint();
            if (maxPoint == null) {
                Logger.assert(point == null, "TileModel.setCurrentCapturePoint() error, point: ", point);
            } else {
                Logger.assert((point != null) && (point >= 0) && (point <= maxPoint), "TileModel.setCurrentCapturePoint() error, point: ", point);
            }

            this._currentCapturePoint = point;
        }

        public checkIsDefeatOnCapture(): boolean {
            return this._templateCfg.isDefeatedOnCapture === 1;
        }

        public updateOnUnitLeave(): void {
            this.setCurrentBuildPoint(this.getMaxBuildPoint());
            this.setCurrentCapturePoint(this.getMaxCapturePoint());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for defense amount for units.
        ////////////////////////////////////////////////////////////////////////////////
        public getNormalizedDefenseAmount(): number {
            return Math.floor(this.getDefenseAmount() / 10);
        }
        public getDefenseAmount(): number {
            return this._templateCfg.defenseAmount;
        }
        public getDefenseAmountForUnit(unit: BwUnit): number {
            return this.checkCanDefendUnit(unit) ? this.getDefenseAmount() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp() : 0;
        }

        public getDefenseUnitCategory(): Types.UnitCategory {
            return this._templateCfg.defenseUnitCategory;
        }
        public checkCanDefendUnit(unit: BwUnit): boolean {
            return Utility.ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), this.getDefenseUnitCategory());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for grid position.
        ////////////////////////////////////////////////////////////////////////////////
        private _setGridX(x: number): void {
            this._gridX = x;
        }
        public getGridX(): number {
            return this._gridX;
        }

        private _setGridY(y: number): void {
            this._gridY = y;
        }
        public getGridY(): number {
            return this._gridY;
        }

        public getGridIndex(): Types.GridIndex {
            return { x: this.getGridX(), y: this.getGridY() };
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for type.
        ////////////////////////////////////////////////////////////////////////////////
        public getType(): TileType {
            return this._templateCfg.type;
        }

        public resetByTypeAndPlayerIndex(
            baseType    : TileBaseType,
            objectType  : TileObjectType,
            playerIndex : number,
        ): void {
            const configVersion = this._getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwTile.resetByTypeAndPlayerIndex() configVersion is empty.`)
                return;
            }

            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.resetByTypeAndPlayerIndex() war is empty.`);
                return;
            }

            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwTile.resetByTypeAndPlayerIndex() empty gridIndex.`);
                return undefined;
            }

            if (!ConfigManager.checkIsValidPlayerIndexForTile(playerIndex, baseType, objectType)) {
                Logger.error(`BwTile.resetByTypeAndPlayerIndex() invalid params`);
                return undefined;
            }

            if (!this.init({
                gridIndex,
                objectType,
                baseType,
                playerIndex,
            }, configVersion)) {
                Logger.error(`BwTile.resetByTypeAndPlayerIndex() failed to init!`);
                return undefined;
            }
            this.startRunning(war);
        }

        public destroyTileObject(): void {
            this.resetByTypeAndPlayerIndex(
                this.getBaseType(),
                TileObjectType.Empty,
                CommonConstants.WarNeutralPlayerIndex,
            )
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for income.
        ////////////////////////////////////////////////////////////////////////////////
        public getIncomeAmountPerTurn(): number | undefined {
            return this._templateCfg.incomePerTurn;
        }
        public getIncomeForPlayer(playerIndex: number): number {
            const baseIncome = this.getIncomeAmountPerTurn();
            if ((baseIncome == null) || (this.getPlayerIndex() !== playerIndex)) {
                return 0;
            } else {
                return Math.floor(baseIncome * this._war.getSettingsIncomeMultiplier() / 100);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for player index.
        ////////////////////////////////////////////////////////////////////////////////
        private _setPlayerIndex(index: number): void {
            this._playerIndex = index;
        }
        public getPlayerIndex(): number {
            return this._playerIndex;
        }
        public getPlayer(): BwPlayer | undefined {
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.getPlayer() empty war.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwTile.getPlayer() empty playerIndex.`);
                return undefined;
            }

            return war.getPlayer(playerIndex);
        }

        public getTeamIndex(): number {
            return this._war.getPlayer(this.getPlayerIndex())!.getTeamIndex();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move cost.
        ////////////////////////////////////////////////////////////////////////////////
        private _setMoveCosts(cfg: { [moveType: number]: Types.MoveCostCfg }): void {
            this._moveCostCfg = cfg;
        }
        public getMoveCosts(): { [moveType: number]: Types.MoveCostCfg } | undefined {
            return this._moveCostCfg;
        }

        public getMoveCostByMoveType(moveType: Types.MoveType): number | undefined | null {
            return this.getMoveCosts()[moveType].cost;
        }
        public getMoveCostByUnit(unit: BwUnit): number | undefined | null {
            const tileType = this.getType();
            if (((tileType === TileType.Seaport) || (tileType === TileType.TempSeaport))    &&
                (this.getTeamIndex() !== unit.getTeamIndex())                               &&
                (Utility.ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), Types.UnitCategory.LargeNaval))) {
                return undefined;
            } else {
                return this.getMoveCostByMoveType(unit.getMoveType());
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for repair/supply unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getRepairUnitCategory(): Types.UnitCategory | undefined {
            return this._templateCfg.repairUnitCategory;
        }

        public getNormalizedRepairHp(): number | undefined | null {
            return this._templateCfg.repairAmount;
        }

        public checkCanRepairUnit(unit: BwUnit, attributes = unit.getAttributes()): boolean {
            const category = this.getRepairUnitCategory();
            return (category != null)
                && ((attributes.hp < unit.getMaxHp()) || (unit.checkCanBeSupplied(attributes)))
                && (unit.getTeamIndex() === this.getTeamIndex())
                && (Utility.ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), category));
        }
        public checkCanSupplyUnit(unit: BwUnit): boolean {
            const category = this.getRepairUnitCategory();
            return (category != null)
                && (unit.checkCanBeSupplied())
                && (unit.getTeamIndex() === this.getTeamIndex())
                && (Utility.ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), category));
        }

        public getRepairHpAndCostForUnit(
            unit        : BwUnit,
            fund        = this._war.getPlayer(unit.getPlayerIndex())!.getFund(),
            attributes  = unit.getAttributes()
        ): Types.RepairHpAndCost | undefined {
            if (!this.checkCanRepairUnit(unit, attributes)) {
                return undefined;
            } else {
                const currentHp             = attributes.hp;
                const normalizedMaxHp       = unit.getNormalizedMaxHp();
                const productionCost        = unit.getProductionFinalCost();
                const normalizedCurrentHp   = Helpers.getNormalizedHp(currentHp);
                const normalizedRepairHp    = Math.min(
                    normalizedMaxHp - normalizedCurrentHp,
                    this.getNormalizedRepairHp()!,
                    Math.floor(fund * normalizedMaxHp / productionCost)
                );
                return {
                    hp  : (normalizedRepairHp + normalizedCurrentHp) * Utility.ConfigManager.UNIT_HP_NORMALIZER - currentHp,
                    cost: Math.floor(normalizedRepairHp * productionCost / normalizedMaxHp),
                };
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hide unit.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanHideUnit(unitType: Types.UnitType): boolean {
            const category = this._templateCfg.hideUnitCategory;
            return category == null
                ? false
                : Utility.ConfigManager.getUnitTypesByCategory(this._configVersion, category).indexOf(unitType) >= 0;
        }

        public checkIsUnitHider(): boolean {
            const category = this._templateCfg.hideUnitCategory;
            return (category != null) && (category != Types.UnitCategory.None);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgProduceUnitCategory(): Types.UnitCategory | undefined {
            return this._templateCfg.produceUnitCategory;
        }
        public getProduceUnitCategoryForPlayer(playerIndex: number): Types.UnitCategory | undefined | null {
            if (this.getPlayerIndex() !== playerIndex) {
                return null;
            } else {
                const skillCfg = this.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
                return skillCfg ? skillCfg[1] : this.getCfgProduceUnitCategory();
            }
        }

        public getEffectiveSelfUnitProductionSkillCfg(playerIndex: number): number[] | null {
            if (this.getPlayerIndex() === playerIndex) {
                const player        = this.getWar().getPlayerManager().getPlayer(playerIndex);
                const isInCoZone    = player ? player.checkIsInCoZone(this.getGridIndex()) : false;
                const isCoOnMap     = player ? !!player.getCoGridIndexOnMap() : false;
                const tileType      = this.getType();
                const configVersion = this._configVersion;
                for (const skillId of player ? player.getCoCurrentSkills() || [] : []) {
                    const cfg       = Utility.ConfigManager.getCoSkillCfg(configVersion, skillId);
                    const skillCfg  = cfg ? cfg.selfUnitProduction : null;
                    if (skillCfg) {
                        const areaType = skillCfg[0] as Types.CoSkillAreaType;
                        if (((areaType === Types.CoSkillAreaType.Zone) && (isInCoZone)) ||
                            ((areaType === Types.CoSkillAreaType.OnMap) && (isCoOnMap)) ||
                            (areaType === Types.CoSkillAreaType.Halo)
                        ) {
                            const tileCategory = skillCfg[2];
                            if ((tileCategory != null)                                                          &&
                                (Utility.ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, tileCategory))
                            ) {
                                return skillCfg;
                            }
                        }
                    }
                }
            }
            return null;
        }

        public checkIsCfgUnitProducer(): boolean {
            const category = this.getCfgProduceUnitCategory();
            return (category != null) && (category !== Types.UnitCategory.None);
        }
        public checkIsUnitProducerForPlayer(playerIndex: number): boolean {
            const category = this.getProduceUnitCategoryForPlayer(playerIndex);
            return (category != null) && (category !== Types.UnitCategory.None);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for vision.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgVisionRange(): number {
            return this._templateCfg.visionRange!;
        }
        public checkIsVisionEnabledForAllPlayers(): boolean {
            return this._templateCfg.isVisionEnabledForAllPlayers === 1;
        }

        public getVisionRangeForPlayer(playerIndex: number): number | null {
            if ((!this.checkIsVisionEnabledForAllPlayers()) && (this.getPlayerIndex() !== playerIndex)) {
                return null;
            } else {
                return Math.max(0, this.getCfgVisionRange() + this.getWar().getSettingsVisionRangeModifier());
            }
        }
        public getVisionRangeForTeamIndexes(teamIndexes: Set<number>): number | null {
            if ((!this.checkIsVisionEnabledForAllPlayers()) && (!teamIndexes.has(this.getTeamIndex()))) {
                return null;
            } else {
                return Math.max(0, this.getCfgVisionRange() + this.getWar().getSettingsVisionRangeModifier());
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for global attack/defense bonus.
        ////////////////////////////////////////////////////////////////////////////////
        public getGlobalAttackBonus(): number {
            return this._templateCfg.globalAttackBonus || 0;
        }
        public getGlobalDefenseBonus(): number {
            return this._templateCfg.globalDefenseBonus || 0;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for fog.
        ////////////////////////////////////////////////////////////////////////////////
        public abstract setFogEnabled(): void;
        public abstract setFogDisabled(data?: ISerialTile): void;

        protected _setIsFogEnabled(isEnabled: boolean): void {
            this._isFogEnabled = isEnabled;
        }
        public getIsFogEnabled(): boolean {
            return this._isFogEnabled;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for load co.
        ////////////////////////////////////////////////////////////////////////////////
        public getLoadCoUnitCategory(): Types.UnitCategory | null {
            return this._templateCfg.loadCoUnitCategory;
        }
    }
}
