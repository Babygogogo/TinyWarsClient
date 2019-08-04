
namespace TinyWars.BaseWar {
    import Types            = Utility.Types;
    import Helpers          = Utility.Helpers;
    import Logger           = Utility.Logger;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import SerializedBwUnit = Types.SerializedBwUnit;
    import UnitState        = Types.UnitState;
    import ArmorType        = Types.ArmorType;
    import TileType         = Types.TileType;
    import UnitType         = Types.UnitType;
    import MoveType         = Types.MoveType;
    import GridIndex        = Types.GridIndex;
    import MovePathNode     = Types.MovePathNode;

    export abstract class BwUnit {
        private _configVersion      : number;
        private _templateCfg        : Types.UnitTemplateCfg;
        private _damageChartCfg     : { [armorType: number]: { [weaponType: number]: Types.DamageChartCfg } };
        private _buildableTileCfg   : { [srcTileType: number]: Types.BuildableTileCfg };
        private _visionBonusCfg     : { [tileType: number]: Types.VisionBonusCfg };
        private _gridX              : number;
        private _gridY              : number;
        private _viewId             : number;
        private _unitId             : number;
        private _playerIndex        : number;
        private _teamIndex          : number;

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

        private _war    : BwWar;
        private _view   : BwUnitView;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers and serializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected abstract _getViewClass(): new () => BwUnitView;

        public init(data: SerializedBwUnit, configVersion: number): BwUnit {
            const t = ConfigManager.getUnitTypeAndPlayerIndex(data.viewId);
            Logger.assert(t, "UnitModel.deserialize() invalid SerializedUnit! ", data);

            const unitType          = t.unitType;
            this._configVersion     = configVersion;
            this.setGridX(data.gridX);
            this.setGridY(data.gridY);
            this._setViewId(data.viewId);
            this._setUnitId(data.unitId);
            this._setPlayerIndex(t.playerIndex);
            this._setTeamIndex(undefined);
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

            this._view = this._view || new (this._getViewClass())();
            this._view.init(this);

            return this;
        }

        public startRunning(war: BwWar): void {
            this._war = war;
            this._setTeamIndex(war.getPlayer(this.getPlayerIndex())!.getTeamIndex());
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
        }

        public getWar(): BwWar | undefined {
            return this._war;
        }
        public getConfigVersion(): number {
            return this._configVersion;
        }
        public getPlayer(): BwPlayer {
            const war = this.getWar();
            return war ? war.getPlayer(this.getPlayerIndex()) : null;
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

        public getView(): BwUnitView {
            return this._view;
        }
        public updateView(): void {
            this.getView().resetAllViews();
        }
        public setViewVisible(visible: boolean): void {
            this.getView().visible = visible;
        }

        public moveViewAlongPath(pathNodes: GridIndex[], isDiving: boolean, isBlocked: boolean, callback: () => void, aiming?: GridIndex): void {
            this.getView().moveAlongPath(pathNodes, isDiving, isBlocked, callback, aiming);
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

        private _setTeamIndex(index: number | undefined): void {
            this._teamIndex = index;
        }
        public getTeamIndex(): number | undefined {
            return this._teamIndex;
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

        public updateOnRepaired(repairHp: number): void {
            this.setCurrentHp(this.getCurrentHp() + repairHp);
            this.setCurrentFuel(this.getMaxFuel());
            this.setPrimaryWeaponCurrentAmmo(this.getPrimaryWeaponMaxAmmo());
            this.setFlareCurrentAmmo(this.getFlareMaxAmmo());
        }
        public updateOnSupplied(): void {
            this.setCurrentFuel(this.getMaxFuel());
            this.setPrimaryWeaponCurrentAmmo(this.getPrimaryWeaponMaxAmmo());
            this.setFlareCurrentAmmo(this.getFlareMaxAmmo());
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

        public getAttackModifierByCo(selfGridIndex: GridIndex): number {
            if (!this.checkIsAffectedByCo(selfGridIndex)) {
                return 0;
            } else {
                const configVersion = this.getWar().getConfigVersion();
                const unitType      = this.getType();
                let modifier        = 0;
                for (const skillId of this.getPlayer().getCoCurrentSkills() || []) {
                    const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).attackBonus;
                    if ((cfg) && (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[0]))) {
                        modifier += cfg[1];
                    }
                }
                return modifier;
            }
        }
        public getDefenseModifierByCo(selfGridIndex: GridIndex): number {
            if (!this.checkIsAffectedByCo(selfGridIndex)) {
                return 0;
            } else {
                const configVersion = this.getWar().getConfigVersion();
                const unitType      = this.getType();
                let modifier        = 0;
                for (const skillId of this.getPlayer().getCoCurrentSkills() || []) {
                    const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).defenseBonus;
                    if ((cfg) && (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[0]))) {
                        modifier += cfg[1];
                    }
                }
                return modifier;
            }
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
        public getFinalMaxAttackRange(): number | undefined {
            const cfgRange = this.getCfgMaxAttackRange();
            return cfgRange == null
                ? cfgRange
                : cfgRange + this._getMaxAttackRangeModifierByCo();
        }
        private _getMaxAttackRangeModifierByCo(): number {
            if (!this.checkIsAffectedByCo()) {
                return 0;
            } else {
                const configVersion = this.getWar().getConfigVersion();
                const unitType      = this.getType();
                let modifier        = 0;
                for (const skillId of this.getPlayer().getCoCurrentSkills() || []) {
                    const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).maxAttackRangeBonus;
                    if ((cfg) && (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[0]))) {
                        modifier += cfg[1];
                    }
                }
                return modifier;
            }
        }

        public checkCanAttackAfterMove(): boolean {
            return this._templateCfg.canAttackAfterMove === 1;
        }
        public checkCanAttackDivingUnits(): boolean {
            return this._templateCfg.canAttackDivingUnits === 1;
        }

        public checkCanAttackTargetAfterMovePath(movePath: MovePathNode[], targetGridIndex: GridIndex): boolean {
            const pathLength    = movePath.length;
            const destination   = movePath[pathLength - 1];
            const distance      = GridIndexHelpers.getDistance(destination, targetGridIndex);
            const primaryAmmo   = this.getPrimaryWeaponCurrentAmmo();
            const unitMap       = this._war.getUnitMap();
            if (((!this.checkCanAttackAfterMove()) && (pathLength > 1))                             ||
                ((this.getLoaderUnitId() != null) && (pathLength <= 1))                             ||
                ((pathLength > 1) && (unitMap.getUnitOnMap(destination)))                           ||
                ((!primaryAmmo) && (!this.checkHasSecondaryWeapon()))                               ||
                (!((distance <= this.getFinalMaxAttackRange()!) && (distance >= this.getMinAttackRange()!)))
            ) {
                return false;
            } else {
                const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
                if (targetUnit) {
                    const armorType = targetUnit.getArmorType();
                    return (targetUnit.getTeamIndex() !== this.getTeamIndex())
                        && ((!targetUnit.getIsDiving()) || (this.checkCanAttackDivingUnits()))
                        && (this.getBaseDamage(armorType) != null);
                } else {
                    const armorType = this._war.getTileMap().getTile(targetGridIndex).getArmorType();
                    return (armorType != null) && (this.getBaseDamage(armorType) != null);
                }
            }
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
        public checkCanCaptureTile(tile: BwTile): boolean {
            return (this.checkCanCapture())
                && (this.getTeamIndex() !== tile.getTeamIndex())
                && (tile.getMaxCapturePoint() != null);
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
                    Math.min(this.getCfgMoveRange(), currentFuel)
                        + this.getWar().getSettingsMoveRangeModifier()
                        + this._getMoveRangeModifierByCo(),
                );
            }
        }
        private _getMoveRangeModifierByCo(): number {
            if (!this.checkIsAffectedByCo()) {
                return 0;
            } else {
                const configVersion = this.getWar().getConfigVersion();
                const unitType      = this.getType();
                let modifier        = 0;
                for (const skillId of this.getPlayer().getCoCurrentSkills() || []) {
                    const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).moveRangeBonus;
                    if ((cfg) && (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[0]))) {
                        modifier += cfg[1];
                    }
                }
                return modifier;
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

        public getPromotionAttackBonus(): number {
            return ConfigManager.getUnitPromotionAttackBonus(this._configVersion, this.getCurrentPromotion());
        }

        public getPromotionDefenseBonus(): number {
            return ConfigManager.getUnitPromotionDefenseBonus(this._configVersion, this.getCurrentPromotion());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for launch silo.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanLaunchSiloOnTile(tile: BwTile): boolean {
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
        public checkCanBuildOnTile(tile: BwTile): boolean {
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
        public getLoadedUnits(): BwUnit[] {
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

        public checkCanLoadUnit(unit: BwUnit): boolean {
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
        private _checkCanRepairLoadedUnit(unit: BwUnit): boolean {
            return (this.getNormalizedRepairHpForLoadedUnit() != null)
                && (unit.getLoaderUnitId() === this.getUnitId())
                && ((unit.getCurrentHp() < unit.getMaxHp()) || (unit.checkCanBeSupplied()));
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
        public getLoaderUnit(): BwUnit | undefined {
            const id = this.getLoaderUnitId();
            if (id == null) {
                return undefined;
            } else {
                const unitMap = this._war.getUnitMap();
                return unitMap.getUnitLoadedById(id) || unitMap.getUnitOnMap(this.getGridIndex());
            }
        }

        public getRepairHpAndCostForLoadedUnit(unit: BwUnit): Types.RepairHpAndCost | undefined {
            if (!this._checkCanRepairLoadedUnit(unit)) {
                return undefined;
            } else {
                const normalizedMaxHp       = unit.getNormalizedMaxHp();
                const productionCost        = unit.getProductionFinalCost();
                const normalizedCurrentHp   = unit.getNormalizedCurrentHp();
                const normalizedRepairHp    = Math.min(
                    normalizedMaxHp - normalizedCurrentHp,
                    this.getNormalizedRepairHpForLoadedUnit()!,
                    Math.floor(this._war.getPlayer(unit.getPlayerIndex())!.getFund() * normalizedMaxHp / productionCost)
                );
                return {
                    hp  : (normalizedRepairHp + normalizedCurrentHp) * ConfigManager.UNIT_HP_NORMALIZER - unit.getCurrentHp(),
                    cost: Math.floor(normalizedRepairHp * productionCost / normalizedMaxHp),
                };
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for supply unit.
        ////////////////////////////////////////////////////////////////////////////////
        public checkIsAdjacentUnitSupplier(): boolean {
            return this._templateCfg.canSupplyAdjacentUnits === 1;
        }
        public checkCanSupplyAdjacentUnit(unit: BwUnit): boolean {
            return (this.checkIsAdjacentUnitSupplier())
                && (this.getLoaderUnitId() == null)
                && (unit.getLoaderUnitId() == null)
                && (this.getPlayerIndex() === unit.getPlayerIndex())
                && (GridIndexHelpers.getDistance(this.getGridIndex(), unit.getGridIndex()) === 1)
                && (unit.checkCanBeSupplied());
        }

        public checkCanBeSuppliedWithFuel(): boolean {
            return this.getCurrentFuel() < this.getMaxFuel();
        }
        public checkCanBeSuppliedWithPrimaryWeaponAmmo(): boolean {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            return (maxAmmo != null) && (this.getPrimaryWeaponCurrentAmmo()! < maxAmmo);
        }
        public checkCanBeSuppliedWithFlareAmmo(): boolean {
            const maxAmmo = this.getFlareMaxAmmo();
            return (maxAmmo != null) && (this.getFlareCurrentAmmo()! < maxAmmo);
        }
        public checkCanBeSupplied(): boolean {
            return (this.checkCanBeSuppliedWithFuel())
                || (this.checkCanBeSuppliedWithPrimaryWeaponAmmo())
                || (this.checkCanBeSuppliedWithFlareAmmo());
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

        public getVisionRangeForPlayer(playerIndex: number, gridIndex: GridIndex): number | undefined {
            const war = this._war;
            if (this.getTeamIndex() !== war.getPlayer(playerIndex)!.getTeamIndex()) {
                return undefined;
            } else {
                return Math.max(
                    1,
                    this.getCfgVisionRange() + this.getVisionRangeBonusOnTile(war.getTileMap().getTile(gridIndex).getType()) + war.getSettingsVisionRangeModifier()
                );
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for join.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanJoinUnit(unit: BwUnit): boolean {
            return (this !== unit)
                && (this.getViewId() === unit.getViewId())
                && (unit.getNormalizedCurrentHp() < unit.getNormalizedMaxHp())
                && (this.getLoadedUnitsCount() === 0)
                && (unit.getLoadedUnitsCount() === 0);
        }

        public getJoinIncome(unit: BwUnit): number | undefined {
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

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for load co.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanLoadCoAfterMovePath(movePath: GridIndex[]): boolean {
            if ((movePath.length !== 1) || (this.getLoaderUnitId() != null)) {
                return false;
            } else {
                const war           = this.getWar();
                const playerIndex   = this.getPlayerIndex();
                const player        = war.getPlayer(playerIndex);
                if ((player.getCoId() == null)                  ||
                    (player.getCoUnitId() != null)              ||
                    (player.getCoIsDestroyedInTurn())           ||
                    (this.getLoadCoCost() > player.getFund())
                ) {
                    return false;
                } else {
                    const tile = war.getTileMap().getTile(movePath[0]);
                    if (tile.getPlayerIndex() !== playerIndex) {
                        return false;
                    } else {
                        const category = tile.getLoadCoUnitCategory();
                        return (category != null)
                            && (ConfigManager.checkIsUnitTypeInCategory(this.getConfigVersion(), this.getType(), category));
                    }
                }
            }
        }

        public checkCanUseCoSkill(): boolean {
            const player = this.getPlayer();
            return (player.getCoUnitId() === this.getUnitId())
                && (!player.getCoIsUsingSkill())
                && (player.getCoCurrentEnergy() >= player.getCoMaxEnergy());
        }

        public getLoadCoCost(): number | null {
            const coId = this.getWar().getPlayer(this.getPlayerIndex()).getCoId();
            return coId == null
                ? null
                : Math.floor(ConfigManager.getCoBasicCfg(this.getConfigVersion(), coId).boardCostPercentage * this.getProductionBaseCost() / 100);
        }

        public checkIsAffectedByCo(selfGridIndex = this.getGridIndex()): boolean {
            const player = this.getPlayer();
            return (player.getCoIsUsingSkill())
                || (this.getUnitId() === player.getCoUnitId())
                || (player.checkIsInCoZone(selfGridIndex));
        }
    }
}
