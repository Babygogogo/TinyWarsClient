
namespace TinyWars.BaseWar {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import Helpers          = Utility.Helpers;
    import SerializedBwTile = Types.SerializedTile;
    import TileType         = Types.TileType;
    import TileObjectType   = Types.TileObjectType;

    export abstract class BwTile {
        private _configVersion  : string;
        private _templateCfg    : Types.TileTemplateCfg;
        private _moveCostCfg    : { [moveType: number]: Types.MoveCostCfg };
        private _gridX          : number;
        private _gridY          : number;
        private _baseViewId     : number;
        private _objectViewId   : number;
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

        public init(data: SerializedBwTile, configVersion: string): BwTile {
            const t = ConfigManager.getTileObjectTypeAndPlayerIndex(data.objectViewId!);
            Logger.assert(t, "TileModel.init() invalid SerializedTile! ", data);

            this._configVersion = configVersion;
            this._setGridX(data.gridX);
            this._setGridY(data.gridY);
            this._setBaseViewId(data.baseViewId);
            this._setObjectViewId(data.objectViewId);
            this._baseType      = ConfigManager.getTileBaseType(data.baseViewId);
            this._objectType    = t.tileObjectType;
            this._setPlayerIndex(t.playerIndex);
            this._templateCfg   = ConfigManager.getTileTemplateCfg(configVersion, this._baseType, this._objectType);
            this._moveCostCfg   = ConfigManager.getMoveCostCfg(configVersion, this._baseType, this._objectType);
            this.setCurrentHp(          data.currentHp           != null ? data.currentHp           : this.getMaxHp());
            this.setCurrentBuildPoint(  data.currentBuildPoint   != null ? data.currentBuildPoint   : this.getMaxBuildPoint());
            this.setCurrentCapturePoint(data.currentCapturePoint != null ? data.currentCapturePoint : this.getMaxCapturePoint());

            this._view = this._view || new (this._getViewClass())();
            this._view.init(this);

            return this;
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
        protected _getWar(): BwWar {
            return this._war;
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

        private _setBaseViewId(id: number): void {
            this._baseViewId = id;
        }
        public getBaseViewId(): number {
            return this._baseViewId;
        }
        public getInitialBaseViewId(): number | null {
            const war       = this._getWar();
            const tileMap   = war ? war.getTileMap() : null;
            return tileMap ? tileMap.getInitialBaseViewId(this.getGridIndex()) : null;
        }

        private _setObjectViewId(id: number): void {
            this._objectViewId = id;
        }
        public getObjectViewId(): number {
            return this._objectViewId;
        }
        public getInitialObjectViewId(): number | null {
            const war       = this._getWar();
            const tileMap   = war ? war.getTileMap() : null;
            return tileMap ? tileMap.getInitialObjectViewId(this.getGridIndex()) : null;
        }
        public getNeutralObjectViewId(): number {
            return this.getObjectViewId() - this.getPlayerIndex();
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
            return ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), this.getDefenseUnitCategory());
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

        public resetByObjectViewIdAndBaseViewId(objectViewId: number, baseViewId = this.getBaseViewId()): void {
            this.init({
                gridX       : this.getGridX(),
                gridY       : this.getGridY(),
                objectViewId: objectViewId,
                baseViewId  : baseViewId,
            }, this._configVersion);

            this.startRunning(this._war);
        }

        public resetByPlayerIndex(playerIndex: number): void {
            if (this.getType() === TileType.Headquarters) {
                this.init({
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    objectViewId: ConfigManager.getTileObjectViewId(TileObjectType.City, playerIndex)!,
                    baseViewId  : this.getBaseViewId(),
                }, this._configVersion);
            } else {
                this.init({
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    objectViewId: this.getNeutralObjectViewId() + playerIndex,
                    baseViewId  : this.getBaseViewId(),
                }, this._configVersion);
            }

            this.startRunning(this._war);
        }

        public destroyTileObject(): void {
            this.resetByObjectViewIdAndBaseViewId(0);
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
                return Math.floor(baseIncome * this._war.getSettingsIncomeModifier() / 100);
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

        public getTeamIndex(): number {
            return this._war.getPlayer(this.getPlayerIndex())!.getTeamIndex();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move cost.
        ////////////////////////////////////////////////////////////////////////////////
        public getMoveCosts(): { [moveType: number]: Types.MoveCostCfg } {
            return this._moveCostCfg;
        }

        public getMoveCostByMoveType(moveType: Types.MoveType): number | undefined | null {
            return this.getMoveCosts()[moveType].cost;
        }
        public getMoveCostByUnit(unit: BwUnit): number | undefined | null {
            const tileType = this.getType();
            if (((tileType === TileType.Seaport) || (tileType === TileType.TempSeaport))    &&
                (this.getTeamIndex() !== unit.getTeamIndex())                               &&
                (ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), Types.UnitCategory.LargeNaval))) {
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
                && (ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), category));
        }
        public checkCanSupplyUnit(unit: BwUnit): boolean {
            const category = this.getRepairUnitCategory();
            return (category != null)
                && (unit.checkCanBeSupplied())
                && (unit.getTeamIndex() === this.getTeamIndex())
                && (ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), category));
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
                    hp  : (normalizedRepairHp + normalizedCurrentHp) * ConfigManager.UNIT_HP_NORMALIZER - currentHp,
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
                : ConfigManager.getUnitTypesByCategory(this._configVersion, category).indexOf(unitType) >= 0;
        }

        public checkIsUnitHider(): boolean {
            const category = this._templateCfg.hideUnitCategory;
            return (category != null) && (category != Types.UnitCategory.None);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getProduceUnitCategory(): Types.UnitCategory | undefined {
            return this._templateCfg.produceUnitCategory;
        }
        public checkIsUnitProducer(): boolean {
            const category = this.getProduceUnitCategory();
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
                return Math.max(0, this.getCfgVisionRange() + this._getWar().getSettingsVisionRangeModifier());
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
        public abstract setFogDisabled(data?: SerializedBwTile): void;

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
