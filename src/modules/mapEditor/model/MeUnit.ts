
namespace TinyWars.MapEditor {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import Logger           = Utility.Logger;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import ProtoTypes       = Utility.ProtoTypes;
    import SerializedBwUnit = Types.SerializedUnit;
    import UnitState        = Types.UnitActionState;
    import ArmorType        = Types.ArmorType;
    import TileType         = Types.TileType;
    import UnitType         = Types.UnitType;
    import MoveType         = Types.MoveType;
    import GridIndex        = Types.GridIndex;
    import MovePathNode     = Types.MovePathNode;

    export class MeUnit {
        private _configVersion      : string;
        private _templateCfg        : Types.UnitTemplateCfg;
        private _damageChartCfg     : { [armorType: number]: { [weaponType: number]: Types.DamageChartCfg } };
        private _buildableTileCfg   : { [srcTileType: number]: Types.BuildableTileCfg };
        private _visionBonusCfg     : { [tileType: number]: Types.VisionBonusCfg };
        private _gridX              : number;
        private _gridY              : number;
        private _viewId             : number;
        private _unitId             : number;
        private _playerIndex        : number;

        private _state                      : UnitState;
        private _currentHp                  : number;
        private _currentFuel                : number;
        private _currentPromotion           : number;
        private _currentBuildMaterial       : number   | undefined;
        private _currentProduceMaterial     : number   | undefined;
        private _flareCurrentAmmo           : number   | undefined;
        private _isBuildingTile             : boolean  | undefined;
        private _isCapturingTile            : boolean  | undefined;
        private _isDiving                   : boolean  | undefined;
        private _loaderUnitId               : number   | undefined;
        private _primaryWeaponCurrentAmmo   : number   | undefined;

        private _war    : MeWar;
        private _view   : MeUnitView;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers and serializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public init(data: SerializedBwUnit, configVersion: string): MeUnit {
            const t                 = ConfigManager.getUnitTypeAndPlayerIndex(data.viewId);
            const unitType          = t.unitType;
            this._configVersion     = configVersion;
            this.setGridX(data.gridX);
            this.setGridY(data.gridY);
            this._setViewId(data.viewId);
            this._setUnitId(data.unitId);
            this._setPlayerIndex(t.playerIndex);
            this._templateCfg       = ConfigManager.getUnitTemplateCfg(this._configVersion, unitType);
            this._damageChartCfg    = ConfigManager.getDamageChartCfgs(this._configVersion, unitType);
            this._buildableTileCfg  = ConfigManager.getBuildableTileCfgs(this._configVersion, unitType);
            this._visionBonusCfg    = ConfigManager.getVisionBonusCfg(this._configVersion, unitType);
            this.setState(                   data.state                    != null ? data.state                    : UnitState.Idle);
            this.setCurrentHp(               data.currentHp                != null ? data.currentHp                : this.getMaxHp());
            this.setPrimaryWeaponCurrentAmmo(data.primaryWeaponCurrentAmmo != null ? data.primaryWeaponCurrentAmmo : this.getPrimaryWeaponMaxAmmo());
            this.setIsCapturingTile(         data.isCapturingTile          != null ? data.isCapturingTile          : false);
            this.setIsDiving(                data.isDiving                 != null ? data.isDiving                 : unitType === UnitType.Submarine);
            this.setCurrentFuel(             data.currentFuel              != null ? data.currentFuel              : this.getMaxFuel());
            this.setFlareCurrentAmmo(        data.flareCurrentAmmo         != null ? data.flareCurrentAmmo         : this.getFlareMaxAmmo());
            this.setCurrentProduceMaterial(  data.currentProduceMaterial   != null ? data.currentProduceMaterial   : this.getMaxProduceMaterial());
            this.setCurrentPromotion(        data.currentPromotion         != null ? data.currentPromotion         : 0);
            this.setIsBuildingTile(          data.isBuildingTile           != null ? data.isBuildingTile           : false);
            this.setCurrentBuildMaterial(    data.currentBuildMaterial     != null ? data.currentBuildMaterial     : this.getMaxBuildMaterial());
            this.setLoaderUnitId(            data.loaderUnitId             != null ? data.loaderUnitId             : undefined);

            this._view = this._view || new MeUnitView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: MeWar): void {
            this._war = war;
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
        }

        public getWar(): MeWar | undefined {
            return this._war;
        }
        public getConfigVersion(): string {
            return this._configVersion;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        private _setViewId(id: number): void {
            this._viewId = id;
        }
        public getViewId(): number {
            return this._viewId;
        }

        public getView(): MeUnitView {
            return this._view;
        }
        public updateView(): void {
            this.getView().resetAllViews();
        }
        public setViewVisible(visible: boolean): void {
            this.getView().visible = visible;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for unit id.
        ////////////////////////////////////////////////////////////////////////////////
        public getUnitId(): number {
            return this._unitId;
        }
        private _setUnitId(id: number): void {
            this._unitId = id;
        }

        public getType(): UnitType {
            return this._templateCfg.type;
        }

        public getAttributes(): Types.UnitAttributes {
            return {
                hp          : this.getCurrentHp(),
                fuel        : this.getCurrentFuel(),
                primaryAmmo : this.getPrimaryWeaponCurrentAmmo(),
                flareAmmo   : this.getFlareCurrentAmmo(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for state.
        ////////////////////////////////////////////////////////////////////////////////
        public getState(): UnitState {
            return this._state;
        }
        public setState(state: UnitState): void {
            this._state = state;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for player index and team index.
        ////////////////////////////////////////////////////////////////////////////////
        private _setPlayerIndex(index: number): void {
            this._playerIndex = index;
        }
        public getPlayerIndex(): number {
            return this._playerIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hp and armor.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxHp(): number {
            return this._templateCfg.maxHp;
        }
        public getNormalizedMaxHp(): number {
            return Helpers.getNormalizedHp(this.getMaxHp());
        }

        public getNormalizedCurrentHp(): number {
            return Helpers.getNormalizedHp(this.getCurrentHp());
        }
        public getCurrentHp(): number {
            return this._currentHp;
        }
        public setCurrentHp(hp: number): void {
            Logger.assert((hp >= 0) && (hp <= this.getMaxHp()), "UnitModel.setCurrentHp() error, hp: ", hp);
            this._currentHp = hp;
        }

        public getArmorType(): ArmorType {
            return this._templateCfg.armorType;
        }

        public checkIsArmorAffectByLuck(): boolean {
            return this._templateCfg.isAffectedByLuck === 1;
        }

        public updateByRepairData(data: ProtoTypes.IWarUnitRepairData): void {
            if (data.deltaHp) {
                this.setCurrentHp(this.getCurrentHp() + data.deltaHp);
            }
            if (data.deltaFuel) {
                this.setCurrentFuel(this.getCurrentFuel() + data.deltaFuel);
            }
            if (data.deltaPrimaryWeaponAmmo) {
                this.setPrimaryWeaponCurrentAmmo(this.getPrimaryWeaponCurrentAmmo()! + data.deltaPrimaryWeaponAmmo);
            }
            if (data.deltaFlareAmmo) {
                this.setFlareCurrentAmmo(this.getFlareCurrentAmmo()! + data.deltaFlareAmmo);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for weapon.
        ////////////////////////////////////////////////////////////////////////////////
        public checkHasWeapon(): boolean {
            return this.checkHasPrimaryWeapon() || this.checkHasSecondaryWeapon();
        }

        public checkHasPrimaryWeapon(): boolean {
            return this._templateCfg.primaryWeaponMaxAmmo != null;
        }

        public getPrimaryWeaponMaxAmmo(): number | undefined {
            return this._templateCfg.primaryWeaponMaxAmmo;
        }

        public getPrimaryWeaponCurrentAmmo(): number | undefined{
            return this._primaryWeaponCurrentAmmo;
        }
        public setPrimaryWeaponCurrentAmmo(ammo: number | undefined): void {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            if (maxAmmo == null) {
                Logger.assert(ammo == null, "UnitModel.setPrimaryWeaponCurrentAmmo() error, ammo: ", ammo);
            } else {
                Logger.assert((ammo != null) && (ammo >= 0) && (ammo <= maxAmmo), "UnitModel.setPrimaryWeaponCurrentAmmo() error, ammo: ", ammo);
            }

            this._primaryWeaponCurrentAmmo = ammo;
        }

        public checkIsPrimaryWeaponAmmoInShort(): boolean {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            return maxAmmo != null ? this.getPrimaryWeaponCurrentAmmo()! <= maxAmmo * 0.4 : false;
        }

        public getCfgPrimaryWeaponBaseDamage(armorType: ArmorType | null | undefined): number | undefined | null {
            return armorType == null
                ? undefined
                : this._damageChartCfg[armorType][Types.WeaponType.Primary].damage;
        }
        public getPrimaryWeaponBaseDamage(armorType: ArmorType | null | undefined): number | undefined | null {
            return this.getPrimaryWeaponCurrentAmmo()
                ? this.getCfgPrimaryWeaponBaseDamage(armorType)
                : undefined;
        }

        public checkHasSecondaryWeapon(): boolean {
            return ConfigManager.checkHasSecondaryWeapon(this._configVersion, this.getType());
        }

        public getCfgSecondaryWeaponBaseDamage(armorType: ArmorType | null | undefined): number | undefined | null {
            return armorType == null
                ? undefined
                : this._damageChartCfg[armorType][Types.WeaponType.Secondary].damage;
        }
        public getSecondaryWeaponBaseDamage(armorType: ArmorType | null | undefined): number | undefined | null {
            return this.checkHasSecondaryWeapon()
                ? this.getCfgSecondaryWeaponBaseDamage(armorType)
                : undefined;
        }

        public getCfgBaseDamage(armorType: ArmorType): number | undefined | null {
            const primaryDamage = this.getCfgPrimaryWeaponBaseDamage(armorType);
            return primaryDamage != null ? primaryDamage : this.getCfgSecondaryWeaponBaseDamage(armorType);
        }
        public getBaseDamage(armorType: ArmorType): number | undefined | null {
            const primaryDamage = this.getPrimaryWeaponBaseDamage(armorType);
            return primaryDamage != null ? primaryDamage : this.getSecondaryWeaponBaseDamage(armorType);
        }

        public getMinAttackRange(): number | undefined {
            return this._templateCfg.minAttackRange;
        }
        public getCfgMaxAttackRange(): number | undefined {
            return this._templateCfg.maxAttackRange;
        }

        public checkCanAttackAfterMove(): boolean {
            return this._templateCfg.canAttackAfterMove === 1;
        }
        public checkCanAttackDivingUnits(): boolean {
            return this._templateCfg.canAttackDivingUnits === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for capture.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsCapturingTile(): boolean {
            return this._isCapturingTile || false;
        }
        public setIsCapturingTile(isCapturing: boolean): void {
            if (!this.checkCanCapture()) {
                Logger.assert(!isCapturing, "UnitModel.setIsCapturingTile() error, isCapturing: ", isCapturing);
            }
            this._isCapturingTile = isCapturing;
        }

        public checkCanCapture(): boolean {
            return this._templateCfg.canCaptureTile === 1;
        }

        public getCaptureAmount(): number | undefined {
            // TODO: take the skills into account.
            return this.checkCanCapture() ? this.getNormalizedCurrentHp() : undefined;
        }
        public getCfgCaptureAmount(): number | undefined {
            return this.checkCanCapture() ? this.getNormalizedCurrentHp() : undefined;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for dive.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsDiving(): boolean {
            return this._isDiving || false;
        }
        public setIsDiving(isDiving: boolean): void {
            if (!this.checkIsDiver()) {
                Logger.assert(!isDiving, "UnitModel.setIsDiving() error, isDiving: ", isDiving);
            }
            this._isDiving = isDiving;
        }

        public checkIsDiver(): boolean {
            return this._templateCfg.fuelConsumptionInDiving != null;
        }
        public checkCanDive(): boolean {
            return (this.checkIsDiver()) && (!this.getIsDiving());
        }
        public checkCanSurface(): boolean {
            return (this.checkIsDiver()) && (this.getIsDiving());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for fuel.
        ////////////////////////////////////////////////////////////////////////////////
        public getCurrentFuel(): number {
            return this._currentFuel;
        }
        public setCurrentFuel(fuel: number): void {
            Logger.assert((fuel >= 0) && (fuel <= this.getMaxFuel()), "UnitModel.setCurrentFuel() error, fuel: ", fuel);
            this._currentFuel = fuel;
        }

        public getMaxFuel(): number {
            return this._templateCfg.maxFuel;
        }

        public getFuelConsumptionPerTurn(): number {
            return this.getIsDiving() ? this._templateCfg.fuelConsumptionInDiving! : this._templateCfg.fuelConsumptionPerTurn;
        }

        public checkIsDestroyedOnOutOfFuel(): boolean {
            return this._templateCfg.isDestroyedOnOutOfFuel === 1;
        }

        public checkIsFuelInShort(): boolean {
            return this.getCurrentFuel() <= this.getMaxFuel() * 0.4;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for flare.
        ////////////////////////////////////////////////////////////////////////////////
        public getFlareRadius(): number | undefined {
            return this._templateCfg.flareRadius;
        }

        public getFlareMaxRange(): number | undefined {
            return this._templateCfg.flareMaxRange;
        }

        public getFlareMaxAmmo(): number | undefined {
            return this._templateCfg.flareMaxAmmo;
        }

        public getFlareCurrentAmmo(): number | undefined {
            return this._flareCurrentAmmo;
        }
        public setFlareCurrentAmmo(ammo: number | undefined): void {
            const maxAmmo = this.getFlareMaxAmmo();
            if (maxAmmo == null) {
                Logger.assert(ammo == null, "UnitModel.setFlareCurrentAmmo() error, ammo: ", ammo);
            } else {
                Logger.assert((ammo != null) && (ammo >= 0) && (ammo <= maxAmmo), "UnitModel.setFlareCurrentAmmo() error, ammo:", ammo);
            }

            this._flareCurrentAmmo = ammo;
        }

        public checkIsFlareAmmoInShort(): boolean {
            const maxAmmo = this.getFlareMaxAmmo();
            return maxAmmo != null ? this.getFlareCurrentAmmo()! <= maxAmmo * 0.4 : false;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for grid position.
        ////////////////////////////////////////////////////////////////////////////////
        public getGridX(): number {
            return this._gridX;
        }
        public setGridX(x: number): void {
            this._gridX = x;
        }

        public getGridY(): number {
            return this._gridY;
        }
        public setGridY(y: number): void {
            this._gridY = y;
        }

        public getGridIndex(): GridIndex {
            return { x: this.getGridX(), y: this.getGridY() };
        }
        public setGridIndex(gridIndex: GridIndex): void {
            this.setGridX(gridIndex.x);
            this.setGridY(gridIndex.y);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getProduceUnitType(): UnitType | undefined {
            return this._templateCfg.produceUnitType;
        }

        public getProduceUnitCost(): number | undefined {
            // TODO: take skills into account.
            const type = this.getProduceUnitType();
            if (type == null) {
                return undefined;
            } else {
                return ConfigManager.getUnitTemplateCfg(this._configVersion, type).productionCost;
            }
        }

        public getMaxProduceMaterial(): number | undefined {
            return this._templateCfg.maxProduceMaterial;
        }

        public getCurrentProduceMaterial(): number | undefined {
            return this._currentProduceMaterial;
        }
        public setCurrentProduceMaterial(material: number | undefined): void {
            const maxMaterial = this.getMaxProduceMaterial();
            if (maxMaterial == null) {
                Logger.assert(material == null, "UnitModel.setCurrentProduceMaterial() error, material: ", matchMedia);
            } else {
                Logger.assert((material != null) && (material >= 0) && (material <= maxMaterial), "UnitModel.setCurrentProduceMaterial() error, material: ", matchMedia);
            }

            this._currentProduceMaterial = material;
        }

        public checkIsProduceMaterialInShort(): boolean {
            const maxMaterial = this.getMaxProduceMaterial();
            return maxMaterial == null
                ? false
                : this.getCurrentProduceMaterial()! / maxMaterial <= 0.4;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgMoveRange(): number {
            return this._templateCfg.moveRange;
        }
        public getFinalMoveRange(): number {
            const currentFuel = this.getCurrentFuel();
            if (currentFuel <= 0) {
                return 0;
            } else {
                return Math.max(
                    1,
                    Math.min(
                        currentFuel,
                        this.getCfgMoveRange(),
                    )
                );
            }
        }

        public getMoveType(): MoveType {
            return this._templateCfg.moveType;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce self.
        ////////////////////////////////////////////////////////////////////////////////
        public getProductionBaseCost(): number {
            return this._templateCfg.productionCost;
        }
        public getProductionFinalCost(): number {
            return this.getProductionBaseCost();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for promotion.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxPromotion(): number {
            return ConfigManager.getUnitMaxPromotion(this._configVersion);
        }

        public getCurrentPromotion(): number {
            return this._currentPromotion;
        }
        public setCurrentPromotion(promotion: number): void {
            Logger.assert((promotion >= 0) && (promotion <= this.getMaxPromotion()), "UnitModel.setCurrentPromotion() error, promotion: ", promotion);
            this._currentPromotion = promotion;
        }
        public addPromotion(): void {
            this.setCurrentPromotion(Math.min(this.getMaxPromotion(), this.getCurrentPromotion() + 1));
        }

        public getPromotionAttackBonus(): number {
            return ConfigManager.getUnitPromotionAttackBonus(this._configVersion, this.getCurrentPromotion());
        }

        public getPromotionDefenseBonus(): number {
            return ConfigManager.getUnitPromotionDefenseBonus(this._configVersion, this.getCurrentPromotion());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for launch silo.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanLaunchSiloOnTile(tile: MeTile): boolean {
            return (this._templateCfg.canLaunchSilo === 1) && (tile.getType() === TileType.Silo);
        }

        public getTileObjectViewIdAfterLaunchSilo(): number {
            return ConfigManager.getTileObjectViewId(Types.TileObjectType.EmptySilo, 0);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for build tile.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsBuildingTile(): boolean {
            return this._isBuildingTile || false;
        }
        public setIsBuildingTile(isBuilding: boolean): void {
            if (!this.checkIsTileBuilder()) {
                Logger.assert(!isBuilding, "UnitModel.setIsBuildingTile() error, isBuilding: ", isBuilding);
            }
            this._isBuildingTile = isBuilding;
        }

        public checkIsTileBuilder(): boolean {
            return this._buildableTileCfg != null;
        }
        public checkCanBuildOnTile(tile: MeTile): boolean {
            return (this.getBuildTargetTileType(tile.getType()) != null) && (this.getCurrentBuildMaterial() > 0);
        }

        public getBuildTargetTileType(srcType: TileType): TileType | undefined | null {
            const cfgs  = this._buildableTileCfg;
            const cfg   = cfgs ? cfgs[srcType] : undefined;
            return cfg ? cfg.dstTileType : undefined;
        }
        public getBuildTargetTileObjectViewId(srcType: TileType): number | undefined | null {
            const dstType = this.getBuildTargetTileType(srcType);
            return dstType == null
                ? undefined
                : ConfigManager.getTileObjectViewId(ConfigManager.getTileObjectTypeByTileType(dstType), this.getPlayerIndex());
        }

        public getBuildAmount(): number | undefined {
            return this.checkIsTileBuilder() ? this.getNormalizedCurrentHp() : undefined;
        }

        public getMaxBuildMaterial(): number | undefined {
            return this._templateCfg.maxBuildMaterial;
        }

        public getCurrentBuildMaterial(): number | undefined {
            return this._currentBuildMaterial;
        }
        public setCurrentBuildMaterial(material: number | undefined): void {
            const maxMaterial = this.getMaxBuildMaterial();
            if (maxMaterial == null) {
                Logger.assert(material == null, "UnitModel.setCurrentBuildMaterial() error, material: ", material);
            } else {
                Logger.assert((material != null) && (material >= 0) && (material <= maxMaterial), "UnitModel.setCurrentBuildMaterial() error, material: ", material);
            }

            this._currentBuildMaterial = material;
        }

        public checkIsBuildMaterialInShort(): boolean {
            const maxMaterial = this.getMaxBuildMaterial();
            return maxMaterial == null
                ? false
                : this.getCurrentBuildMaterial()! / maxMaterial <= 0.4;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for load unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxLoadUnitsCount(): number | undefined | null {
            return this._templateCfg.maxLoadUnitsCount;
        }
        public getLoadedUnitsCount(): number {
            return this.getLoadedUnits()!.length;
        }
        public getLoadedUnits(): MeUnit[] {
            return this._war.getUnitMap().getUnitsLoadedByLoader(this, false);
        }

        public checkHasLoadUnitId(id: number): boolean {
            for (const unit of this.getLoadedUnits()) {
                if (unit.getUnitId() === id) {
                    return true;
                }
            }
            return false;
        }

        public checkCanLoadUnit(unit: MeUnit): boolean {
            const cfg                   = this._templateCfg;
            const loadUnitCategory      = cfg.loadUnitCategory;
            const loadableTileCategory  = cfg.loadableTileCategory;
            const maxLoadUnitsCount     = this.getMaxLoadUnitsCount();
            return (loadUnitCategory != null)
                && (loadableTileCategory != null)
                && (maxLoadUnitsCount != null)
                && (ConfigManager.checkIsTileTypeInCategory(this._configVersion, this._war.getTileMap().getTile(this.getGridIndex()).getType(), loadableTileCategory))
                && (ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), loadUnitCategory))
                && (this.getPlayerIndex() === unit.getPlayerIndex())
                && (this.getLoadedUnitsCount() < maxLoadUnitsCount);
        }
        public checkCanDropLoadedUnit(tileType: TileType): boolean {
            const cfg       = this._templateCfg;
            const category  = cfg.loadableTileCategory;
            return (cfg.canDropLoadedUnits === 1)
                && (category != null)
                && (ConfigManager.checkIsTileTypeInCategory(this._configVersion, tileType, category));
        }
        public checkCanLaunchLoadedUnit(): boolean {
            return this._templateCfg.canLaunchLoadedUnits === 1;
        }
        public checkCanSupplyLoadedUnit(): boolean {
            return this._templateCfg.canSupplyLoadedUnits === 1;
        }
        private _checkCanRepairLoadedUnit(unit: MeUnit, attributes: Types.UnitAttributes): boolean {
            return (this.getNormalizedRepairHpForLoadedUnit() != null)
                && (unit.getLoaderUnitId() === this.getUnitId())
                && ((attributes.hp < unit.getMaxHp()) || (unit.checkCanBeSupplied(attributes)));
        }
        public getNormalizedRepairHpForLoadedUnit(): number | undefined | null {
            return this._templateCfg.repairAmountForLoadedUnits;
        }

        public setLoaderUnitId(id: number | undefined): void {
            this._loaderUnitId = id;
        }
        public getLoaderUnitId(): number | undefined {
            return this._loaderUnitId;
        }
        public getLoaderUnit(): MeUnit | undefined {
            const id = this.getLoaderUnitId();
            if (id == null) {
                return undefined;
            } else {
                const unitMap = this._war.getUnitMap();
                return unitMap.getUnitLoadedById(id) || unitMap.getUnitOnMap(this.getGridIndex());
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for supply unit.
        ////////////////////////////////////////////////////////////////////////////////
        public checkIsAdjacentUnitSupplier(): boolean {
            return this._templateCfg.canSupplyAdjacentUnits === 1;
        }
        public checkCanSupplyAdjacentUnit(unit: MeUnit, attributes = unit.getAttributes()): boolean {
            return (this.checkIsAdjacentUnitSupplier())
                && (this.getLoaderUnitId() == null)
                && (unit.getLoaderUnitId() == null)
                && (this.getPlayerIndex() === unit.getPlayerIndex())
                && (GridIndexHelpers.getDistance(this.getGridIndex(), unit.getGridIndex()) === 1)
                && (unit.checkCanBeSupplied(attributes));
        }

        public checkCanBeSuppliedWithFuel(attributes = this.getAttributes()): boolean {
            return attributes.fuel < this.getMaxFuel();
        }
        public checkCanBeSuppliedWithPrimaryWeaponAmmo(attributes = this.getAttributes()): boolean {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            return (maxAmmo != null) && (attributes.primaryAmmo < maxAmmo);
        }
        public checkCanBeSuppliedWithFlareAmmo(attributes = this.getAttributes()): boolean {
            const maxAmmo = this.getFlareMaxAmmo();
            return (maxAmmo != null) && (attributes.flareAmmo < maxAmmo);
        }
        public checkCanBeSupplied(attributes = this.getAttributes()): boolean {
            return (this.checkCanBeSuppliedWithFuel(attributes))
                || (this.checkCanBeSuppliedWithPrimaryWeaponAmmo(attributes))
                || (this.checkCanBeSuppliedWithFlareAmmo(attributes));
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for vision.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgVisionRange(): number {
            return this._templateCfg.visionRange;
        }
        public getVisionRangeBonusOnTile(tileType: TileType): number {
            const cfgs  = this._visionBonusCfg;
            const cfg   = cfgs ? cfgs[tileType] : undefined;
            return cfg ? cfg.visionBonus || 0 : 0;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for join.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanJoinUnit(unit: MeUnit): boolean {
            return (this !== unit)
                && (this.getViewId() === unit.getViewId())
                && (unit.getNormalizedCurrentHp() < unit.getNormalizedMaxHp())
                && (this.getLoadedUnitsCount() === 0)
                && (unit.getLoadedUnitsCount() === 0);
        }

        public getJoinIncome(unit: MeUnit): number | undefined {
            if (!this.checkCanJoinUnit(unit)) {
                return undefined;
            } else {
                const maxHp     = this.getNormalizedMaxHp();
                const joinedHp  = this.getNormalizedCurrentHp() + unit.getNormalizedCurrentHp();
                return joinedHp <= maxHp
                    ? 0
                    : Math.floor((joinedHp - maxHp) * this.getProductionFinalCost() / 10);
            }
        }
    }
}
