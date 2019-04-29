
namespace TinyWars.MultiCustomWar {
    import Types                = Utility.Types;
    import Notify               = Utility.Notify;
    import Helpers              = Utility.Helpers;
    import Logger               = Utility.Logger;
    // import VisibilityHelpers    = Utility.VisibilityHelpers;
    import SerializedMcwTile    = Types.SerializedMcwTile;
    import TileType             = Types.TileType;
    import TileObjectType       = Types.TileObjectType;

    export class McwTile {
        private _configVersion  : number;
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

        private _war            : McwWar;
        private _view           : McwTileView;
        private _isFogEnabled   : boolean;

        public constructor() {
        }

        public init(data: SerializedMcwTile, configVersion: number): McwTile {
            const t = ConfigManager.getTileObjectTypeAndPlayerIndex(data.objectViewId!);
            Logger.assert(t, "TileModel.deserialize() invalid SerializedTile! ", data);

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

            this._view = this._view || new McwTileView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: McwWar): void {
            this._war = war;
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }

        public serialize(): SerializedMcwTile {
            const data: SerializedMcwTile = {
                gridX         : this._gridX,
                gridY         : this._gridY,
                baseViewId    : this._baseViewId,
                objectViewId  : this._objectViewId,
            };

            const currentHp = this.getCurrentHp();
            (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

            const buildPoint = this.getCurrentBuildPoint();
            (buildPoint !== this.getMaxBuildPoint()) && (data.currentBuildPoint = buildPoint);

            const capturePoint = this.getCurrentCapturePoint();
            (capturePoint !== this.getMaxCapturePoint()) && (data.currentCapturePoint = capturePoint);

            return data;
        }

        public serializeForPlayer(playerIndex: number): SerializedMcwTile {
            if (Utility.VisibilityHelpers.checkIsTileVisibleToPlayer(this._war, this.getGridIndex(), playerIndex)) {
                return this.serialize();
            } else if (this.getType() === TileType.Headquarters) {
                return {
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    baseViewId  : this.getBaseViewId(),
                    objectViewId: this.getObjectViewId(),
                }
            } else if (this.getPlayerIndex() !== 0) {
                return {
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    baseViewId  : this.getBaseViewId(),
                    objectViewId: this.getNeutralObjectViewId(),
                }
            } else {
                const currentHp = this.getCurrentHp();
                return {
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    baseViewId  : this.getBaseViewId(),
                    objectViewId: this.getObjectViewId(),
                    currentHp   : currentHp == this.getMaxHp() ? undefined : currentHp,
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        public getView(): McwTileView {
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

        private _setObjectViewId(id: number): void {
            this._objectViewId = id;
        }
        public getObjectViewId(): number {
            return this._objectViewId;
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
        public getDefenseAmountForUnit(unit: McwUnit): number {
            return this.checkCanDefendUnit(unit) ? this.getDefenseAmount() : 0;
        }

        public getDefenseUnitCategory(): Types.UnitCategory {
            return this._templateCfg.defenseUnitCategory;
        }
        public checkCanDefendUnit(unit: McwUnit): boolean {
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

        public getTeamIndex(): number | undefined {
            const playerIndex = this.getPlayerIndex();
            return playerIndex === 0
                ? undefined
                : this._war.getPlayer(playerIndex)!.getTeamIndex();
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
        public getMoveCostByUnit(unit: McwUnit): number | undefined | null {
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

        private _checkCanRepairUnit(unit: McwUnit): boolean {
            const category = this.getRepairUnitCategory();
            return (category != null)
                && ((unit.getCurrentHp() < unit.getMaxHp()) || (unit.checkCanBeSupplied()))
                && (unit.getTeamIndex() === this.getTeamIndex())
                && (ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), category));
        }
        public checkCanSupplyUnit(unit: McwUnit): boolean {
            const category = this.getRepairUnitCategory();
            return (category != null)
                && (unit.checkCanBeSupplied())
                && (unit.getTeamIndex() === this.getTeamIndex())
                && (ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), category));
        }

        public getRepairHpAndCostForUnit(unit: McwUnit): Types.RepairHpAndCost | undefined {
            if (!this._checkCanRepairUnit(unit)) {
                return undefined;
            } else {
                const maxNormalizedHp       = ConfigManager.MAX_UNIT_NORMALIZED_HP;
                const productionCost        = unit.getProductionFinalCost();
                const normalizedCurrentHp   = unit.getNormalizedCurrentHp();
                const normalizedRepairHp    = Math.min(
                    maxNormalizedHp - normalizedCurrentHp,
                    this.getNormalizedRepairHp()!,
                    Math.floor(this._war.getPlayer(unit.getPlayerIndex())!.getFund() * maxNormalizedHp / productionCost)
                );
                return {
                    hp  : (normalizedRepairHp + normalizedCurrentHp) * ConfigManager.UNIT_HP_NORMALIZER - unit.getCurrentHp(),
                    cost: Math.floor(normalizedRepairHp * productionCost / maxNormalizedHp),
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
        public getCfgVisionRange(): number | undefined {
            return this._templateCfg.visionRange;
        }
        public checkIsVisionEnabledForAllPlayers(): boolean {
            return this._templateCfg.isVisionEnabledForAllPlayers === 1;
        }

        public getVisionRangeForPlayer(playerIndex: number): number | null | undefined {
            const cfgVision = this.getCfgVisionRange();
            if (cfgVision == null) {
                return undefined;
            } else {
                const war = this._war;
                // TODO: take co skills into account.
                if ((!this.checkIsVisionEnabledForAllPlayers()) && (this.getTeamIndex() !== war.getPlayer(playerIndex).getTeamIndex())) {
                    return undefined;
                } else {
                    return Math.max(0, cfgVision + war.getSettingsVisionRangeModifier());
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for fog.
        ////////////////////////////////////////////////////////////////////////////////
        public setFogEnabled(): void {
            if (!this.getIsFogEnabled()) {
                this._isFogEnabled = true;

                const currentHp = this.getCurrentHp();
                this.init({
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    objectViewId: this.getType() === TileType.Headquarters ? this.getObjectViewId() : this.getNeutralObjectViewId(),
                    baseViewId  : this.getBaseViewId(),
                }, this._configVersion);

                this.startRunning(this._war);
                this.setCurrentBuildPoint(this.getMaxBuildPoint());
                this.setCurrentCapturePoint(this.getMaxCapturePoint());
                this.setCurrentHp(currentHp);
            }
        }

        public setFogDisabled(data?: SerializedMcwTile): void {
            if (this.getIsFogEnabled()) {
                this._isFogEnabled = false;

                if (data) {
                    this.init(data, this._configVersion);
                } else {
                    const tileMap   = this._war.getTileMap();
                    const mapData   = tileMap.getTemplateMap();
                    const gridX     = this.getGridX();
                    const gridY     = this.getGridY();
                    const index     = gridX + gridY * tileMap.getMapSize().width;
                    this.init({
                        objectViewId: mapData.tileObjects[index],
                        baseViewId  : mapData.tileBases[index],
                        gridX,
                        gridY,
                        currentHp           : this.getCurrentHp(),
                        currentBuildPoint   : this.getCurrentBuildPoint(),
                        currentCapturePoint : this.getCurrentCapturePoint(),
                    }, this._configVersion);
                }

                this.startRunning(this._war);
            }
        }

        public getIsFogEnabled(): boolean {
            return this._isFogEnabled;
        }
    }
}
