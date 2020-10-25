
namespace TinyWars.BaseWar {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import ConfigManager    = Utility.ConfigManager;
    import TileType         = Types.TileType;
    import TileObjectType   = Types.TileObjectType;
    import TileBaseType     = Types.TileBaseType;
    import ISerialTile      = ProtoTypes.WarSerialization.ISerialTile;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export abstract class BwTile {
        private _configVersion  : string;
        private _templateCfg    : ProtoTypes.Config.ITileTemplateCfg;
        private _moveCostCfg    : { [moveType: number]: ProtoTypes.Config.IMoveCostCfg };

        private _gridX          : number;
        private _gridY          : number;
        private _playerIndex    : number;
        private _baseType       : Types.TileBaseType;
        private _objectType     : TileObjectType;

        private _baseShapeId        : number | null;
        private _objectShapeId      : number | null;
        private _currentHp          : number | undefined;
        private _currentBuildPoint  : number | undefined;
        private _currentCapturePoint: number | undefined;

        private _war        : BwWar;
        private _view       : BwTileView;
        private _hasFog     = false;

        protected abstract _getViewClass(): new () => BwTileView;
        public abstract serializeForSimulation(): ISerialTile;

        public init(data: ISerialTile, configVersion: string): BwTile | undefined {
            if (!this.deserialize(data, configVersion)) {
                Logger.error(`BwTile.init() fail deserialize!`);
                return undefined;
            }
            this.setHasFog(false);

            this._setView(this.getView() || new (this._getViewClass())());

            return this;
        }
        public fastInit(data: ISerialTile, configVersion: string): BwTile {
            return this.init(data, configVersion);
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }
        public startRunningView(): void {
            this.flushDataToView();
        }

        public deserialize(data: ISerialTile, configVersion: string): BwTile | undefined {
            const gridIndex = BwHelpers.convertGridIndex(data.gridIndex);
            if (gridIndex == null) {
                Logger.error(`BwTile.deserialize() empty gridIndex.`);
                return undefined;
            }

            const objectType = data.objectType as TileObjectType;
            if (objectType == null) {
                Logger.error(`BwTile.deserialize() empty objectType.`);
                return undefined;
            }

            const baseType = data.baseType as TileBaseType;
            if (baseType == null) {
                Logger.error(`BwTile.deserialize() empty baseType.`);
                return undefined;
            }

            const playerIndex = data.playerIndex;
            if (playerIndex == null) {
                Logger.error(`BwTile.deserialize() empty playerIndex.`);
                return undefined;
            }

            const templateCfg = ConfigManager.getTileTemplateCfg(configVersion, baseType, objectType);
            if (templateCfg == null) {
                Logger.error(`BwTile.deserialize() no templateCfg.`);
                return undefined;
            }

            const moveCostCfg = ConfigManager.getMoveCostCfg(configVersion, baseType, objectType);
            if (moveCostCfg == null) {
                Logger.error(`BwTile.deserialize() no moveCostCfg.`)
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

            return this;
        }
        public serialize(): ISerialTile | undefined {
            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwTile.serialize() empty gridIndex.`);
                return undefined;
            }

            const baseType = this.getBaseType();
            if (baseType == null) {
                Logger.error(`BwTile.serialize() empty baseType.`);
                return undefined;
            }

            const objectType = this.getObjectType();
            if (objectType == null) {
                Logger.error(`BwTile.serialize() empty objectType.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwTile.serialize() empty playerIndex.`);
                return undefined;
            }

            const data: ISerialTile = {
                gridIndex,
                baseType,
                objectType,
                playerIndex,
            };

            const currentHp = this.getCurrentHp();
            (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

            const buildPoint = this.getCurrentBuildPoint();
            (buildPoint !== this.getMaxBuildPoint()) && (data.currentBuildPoint = buildPoint);

            const capturePoint = this.getCurrentCapturePoint();
            (capturePoint !== this.getMaxCapturePoint()) && (data.currentCapturePoint = capturePoint);

            const baseShapeId = this.getBaseShapeId();
            (baseShapeId !== 0) && (data.baseShapeId = baseShapeId);

            const objectShapeId = this.getObjectShapeId();
            (objectShapeId !== 0) && (data.objectShapeId = objectShapeId);

            return data;
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        public getWar(): BwWar {
            return this._war;
        }

        private _setConfigVersion(configVersion: string): void {
            this._configVersion = configVersion;
        }
        public getConfigVersion(): string | undefined {
            return this._configVersion;
        }

        private _setTemplateCfg(cfg: ProtoTypes.Config.ITileTemplateCfg): void {
            this._templateCfg = cfg;
        }
        private _getTemplateCfg(): ProtoTypes.Config.ITileTemplateCfg | undefined {
            return this._templateCfg;
        }

        public updateOnUnitLeave(): void {
            this.setCurrentBuildPoint(this.getMaxBuildPoint());
            this.setCurrentCapturePoint(this.getMaxCapturePoint());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        private _setView(view: BwTileView): void {
            this._view = view;
        }
        public getView(): BwTileView {
            return this._view;
        }
        public flushDataToView(): void {
            const view = this.getView();
            view.setData({
                tileData    : this.serialize(),
                hasFog      : this.getHasFog(),
                skinId      : this.getSkinId(),
            });
            view.updateView();
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

        public resetByTypeAndPlayerIndex({ baseType, objectType, playerIndex }: {
            baseType        : TileBaseType;
            objectType      : TileObjectType;
            playerIndex     : number;
        }): void {
            const configVersion = this.getConfigVersion();
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
                baseShapeId     : baseType === this.getBaseType() ? this.getBaseShapeId() : null,
                objectShapeId   : objectType === this.getObjectType() ? this.getObjectShapeId() : null,
            }, configVersion)) {
                Logger.error(`BwTile.resetByTypeAndPlayerIndex() failed to init!`);
                return undefined;
            }
            this.startRunning(war);
        }

        public destroyTileObject(): void {
            this.resetByTypeAndPlayerIndex({
                baseType        : this.getBaseType(),
                objectType      : TileObjectType.Empty,
                playerIndex     : CommonConstants.WarNeutralPlayerIndex,
            });
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
                return Math.floor(baseIncome * this.getWar().getSettingsIncomeMultiplier(playerIndex) / 100);
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
            return this.getWar().getPlayer(this.getPlayerIndex())!.getTeamIndex();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move cost.
        ////////////////////////////////////////////////////////////////////////////////
        private _setMoveCosts(cfg: { [moveType: number]: ProtoTypes.Config.IMoveCostCfg }): void {
            this._moveCostCfg = cfg;
        }
        public getMoveCosts(): { [moveType: number]: ProtoTypes.Config.IMoveCostCfg } | undefined {
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

        public getCfgNormalizedRepairHp(): number | undefined | null {
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
            fund        = this.getWar().getPlayer(unit.getPlayerIndex())!.getFund(),
            attributes  = unit.getAttributes()
        ): Types.RepairHpAndCost | undefined {
            if (!this.checkCanRepairUnit(unit, attributes)) {
                return undefined;
            } else {
                const currentHp             = attributes.hp;
                const normalizedMaxHp       = unit.getNormalizedMaxHp();
                const productionCost        = unit.getProductionFinalCost();
                const normalizedCurrentHp   = BwHelpers.getNormalizedHp(currentHp);
                const normalizedRepairHp    = Math.min(
                    normalizedMaxHp - normalizedCurrentHp,
                    this.getCfgNormalizedRepairHp()!,
                    Math.floor(fund * normalizedMaxHp / productionCost)
                );
                return {
                    hp  : (normalizedRepairHp + normalizedCurrentHp) * CommonConstants.UnitHpNormalizer - currentHp,
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
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() war is empty.`);
                return undefined;
            }

            const playerManager = war.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() empty playerManager.`);
                return undefined;
            }

            const player = playerManager.getPlayer(playerIndex);
            if (player == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() player is empty.`);
                return undefined;
            }

            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() gridIndex is empty.`);
                return undefined;
            }

            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() configVersion is empty.`);
                return undefined;
            }

            const tileType = this.getType();
            if (tileType == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() tileType is empty.`);
                return undefined;
            }

            const unitMap = war.getUnitMap();
            if (unitMap == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() empty unitMap.`);
                return undefined;
            }

            if ((!player.getCoId()) || (this.getPlayerIndex() !== playerIndex)) {
                return undefined;
            }

            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() empty coGridIndexListOnMap.`);
                return undefined;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() empty coZoneRadius.`);
                return undefined;
            }

            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId).selfUnitProduction;
                if (skillCfg) {
                    const tileCategory = skillCfg[2];
                    if ((tileCategory != null)                                                                                  &&
                        (ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, tileCategory))                        &&
                        (BwHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, skillCfg[0], coGridIndexListOnMap, coZoneRadius))
                    ) {
                        return skillCfg;
                    }
                }
            }

            return undefined;
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
                return Math.max(0, this.getCfgVisionRange() + this.getWar().getSettingsVisionRangeModifier(playerIndex));
            }
        }
        public getVisionRangeForTeamIndexes(teamIndexes: Set<number>): number | null {
            if (this.checkIsVisionEnabledForAllPlayers()) {
                let maxModifier = Number.MIN_VALUE;
                const war       = this.getWar();
                war.getPlayerManager().forEachPlayer(false, player => {
                    if ((player.getIsAlive()) && (teamIndexes.has(player.getTeamIndex()))) {
                        maxModifier = Math.max(maxModifier, war.getSettingsVisionRangeModifier(player.getPlayerIndex()));
                    }
                });

                return Math.max(0, this.getCfgVisionRange() + maxModifier);
            }

            if (teamIndexes.has(this.getTeamIndex())) {
                return Math.max(0, this.getCfgVisionRange() + this.getWar().getSettingsVisionRangeModifier(this.getPlayerIndex()));
            }

            return null;
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
        public setHasFog(hasFog: boolean): void {
            this._hasFog = hasFog;
        }
        public getHasFog(): boolean {
            return this._hasFog;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for load co.
        ////////////////////////////////////////////////////////////////////////////////
        public getLoadCoUnitCategory(): Types.UnitCategory | null {
            return this._templateCfg.loadCoUnitCategory;
        }
    }
}
