
namespace OnlineWar {
    import Types          = Utility.Types;
    import IdConverter    = Utility.IdConverter;
    import Helpers        = Utility.Helpers;
    import Logger         = Utility.Logger;
    import SerializedUnit = Types.SerializedUnit;
    import InstantialUnit = Types.InstantialUnit;
    import UnitState      = Types.UnitState;
    import ArmorType      = Types.ArmorType;
    import TileType       = Types.TileType;
    import UnitType       = Types.UnitType;
    import MoveType       = Types.MoveType;

    export class UnitModel {
        private _isInitialized: boolean = false;

        private _configVersion: number;
        private _template     : Types.TemplateUnit;
        private _gridX        : number;
        private _gridY        : number;
        private _viewId       : number;
        private _unitId       : number;
        private _unitType     : UnitType;
        private _playerIndex  : number;

        private _state           : UnitState;
        private _currentHp       : number;
        private _currentFuel     : number;
        private _currentPromotion: number;

        private _currentBuildMaterial    : number    | undefined;
        private _currentProduceMaterial  : number    | undefined;
        private _flareCurrentAmmo        : number    | undefined;
        private _isBuildingTile          : boolean   | undefined;
        private _isCapturingTile         : boolean   | undefined;
        private _isDiving                : boolean   | undefined;
        private _loadedUnitIds           : number[]  | undefined;
        private _primaryWeaponCurrentAmmo: number    | undefined;

        public constructor(data?: SerializedUnit) {
            if (data) {
                this.deserialize(data);
            }
        }

        public deserialize(data: SerializedUnit): void {
            const t = IdConverter.getUnitTypeAndPlayerIndex(data.viewId);
            Logger.assert(t, "UnitModel.deserialize() invalid SerializedUnit! ", data);

            this._isInitialized = true;
            this._configVersion = data.configVersion;
            this._gridX         = data.gridX;
            this._gridY         = data.gridY;
            this._viewId        = data.viewId;
            this._unitId        = data.unitId;
            this._unitType      = t!.unitType;
            this._playerIndex   = t!.playerIndex;
            this._template      = Config.getTemplateUnit(this._configVersion, this._unitType);
            this._loadInstantialData(data.instantialData);
        }

        public serialize(): SerializedUnit {
            Logger.assert(this._isInitialized, "UnitModel.serialize() the tile hasn't been initialized!");
            return {
                configVersion : this._configVersion,
                gridX         : this._gridX,
                gridY         : this._gridY,
                viewId        : this._viewId,
                unitId        : this._unitId,
                instantialData: this._createInstantialData(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        public getViewId(): number {
            return this._viewId;
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
        // Functions for player index.
        ////////////////////////////////////////////////////////////////////////////////
        public getPlayerIndex(): number {
            return this._playerIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hp and armor.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxHp(): number {
            return this._template.maxHp;
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
            return this._template.armorType;
        }

        public checkIsArmorAffectByLuck(): boolean | undefined {
            return this._template.isAffectedByLuck;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for weapon.
        ////////////////////////////////////////////////////////////////////////////////
        public checkHasPrimaryWeapon(): boolean {
            return this._template.primaryWeaponDamages != null;
        }

        public getPrimaryWeaponMaxAmmo(): number | undefined {
            return this._template.primaryWeaponMaxAmmo;
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

        public getPrimaryWeaponDamage(armorType: ArmorType): number | undefined {
            const damages = this._template.primaryWeaponDamages;
            return damages ? damages[armorType] : undefined;
        }

        public checkHasSecondaryWeapon(): boolean {
            return this._template.secondaryWeaponDamages != null;
        }

        public getSecondaryWeaponDamage(armorType: ArmorType): number | undefined {
            const damages = this._template.secondaryWeaponDamages;
            return damages ? damages[armorType] : undefined;
        }

        public getDamage(armorType: ArmorType): number | undefined {
            return this.getPrimaryWeaponDamage(armorType) || this.getSecondaryWeaponDamage(armorType);
        }

        public getMinAttackRange(): number | undefined {
            return this._template.minAttackRange;
        }
        public getMaxAttackRange(): number | undefined {
            return this._template.maxAttackRange;
        }

        public checkCanAttackAfterMove(): boolean | undefined {
            return this._template.canAttackAfterMove;
        }
        public checkCanAttackDivingUnits(): boolean | undefined {
            return this._template.canAttackDivingUnits;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for capture.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsCapturingTile(): boolean {
            return this._isCapturingTile || false;
        }
        public setIsCapturingTile(isCapturing: boolean): void {
            if (!this.checkCanCaptureTile()) {
                Logger.assert(!isCapturing, "UnitModel.setIsCapturingTile() error, isCapturing: ", isCapturing);
            }
            this._isCapturingTile = isCapturing;
        }

        public checkCanCaptureTile(): boolean | undefined {
            return this._template.canCaptureTile;
        }

        public getCaptureAmount(): number | undefined {
            return this.checkCanCaptureTile() ? this.getNormalizedCurrentHp() : undefined;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for dive.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsDiving(): boolean {
            return this._isDiving || false;
        }
        public setIsDiving(isDiving: boolean): void {
            if (!this.checkCanDive()) {
                Logger.assert(!isDiving, "UnitModel.setIsDiving() error, isDiving: ", isDiving);
            }
            this._isDiving = isDiving;
        }

        public checkCanDive(): boolean {
            return this._template.fuelConsumptionInDiving != null;
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
            return this._template.maxFuel;
        }

        public getFuelConsumptionPerTurn(): number {
            return this.getIsDiving() ? this._template.fuelConsumptionInDiving! : this._template.fuelConsumptionPerTurn;
        }

        public checkIsDestroyedOnOutOfFuel(): boolean {
            return this._template.isDestroyedOnOutOfFuel;
        }

        public checkIsFuelInShort(): boolean {
            return this.getCurrentFuel() <= this.getMaxFuel() * 0.4;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for flare.
        ////////////////////////////////////////////////////////////////////////////////
        public getFlareRadius(): number | undefined {
            return this._template.flareRadius;
        }

        public getFlareMaxRange(): number | undefined {
            return this._template.flareMaxRange;
        }

        public getFlareMaxAmmo(): number | undefined {
            return this._template.flareMaxAmmo;
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

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getProduceUnitType(): UnitType | undefined {
            return this._template.produceUnitType;
        }

        public getMaxProduceMaterial(): number | undefined {
            return this._template.maxProduceMaterial;
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

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move.
        ////////////////////////////////////////////////////////////////////////////////
        public getMoveRange(): number {
            return this._template.moveRange;
        }

        public getMoveType(): MoveType {
            return this._template.moveType;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce self.
        ////////////////////////////////////////////////////////////////////////////////
        public getProductionCost(): number {
            return this._template.productionCost;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for promotion.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxPromotion(): number {
            return Config.getUnitMaxPromotion(this._configVersion);
        }

        public getCurrentPromotion(): number {
            return this._currentPromotion;
        }
        public setCurrentPromotion(promotion: number): void {
            Logger.assert((promotion >= 0) && (promotion <= this.getMaxPromotion()), "UnitModel.setCurrentPromotion() error, promotion: ", promotion);
            this._currentPromotion = promotion;
        }

        public getPromotionAttackBonus(): number {
            return Config.getUnitPromotionAttackBonus(this._configVersion, this.getCurrentPromotion());
        }

        public getPromotionDefenseBonus(): number {
            return Config.getUnitPromotionDefenseBonus(this._configVersion, this.getCurrentPromotion());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for launch silo.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanLaunchSilo(): boolean | undefined {
            return this._template.canLaunchSilo;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for build tile.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsBuildingTile(): boolean {
            return this._isBuildingTile || false;
        }
        public setIsBuildingTile(isBuilding: boolean): void {
            if (!this.checkCanBuildTile()) {
                Logger.assert(!isBuilding, "UnitModel.setIsBuildingTile() error, isBuilding: ", isBuilding);
            }
            this._isBuildingTile = isBuilding;
        }

        public checkCanBuildTile(): boolean {
            return this._template.buildTiles != null;
        }

        public getBuildTargetTile(srcType: TileType): TileType | undefined {
            const buildTiles = this._template.buildTiles;
            return buildTiles ? buildTiles[srcType] : undefined;
        }

        public getBuildAmount(): number | undefined {
            return this.checkCanBuildTile() ? this.getNormalizedCurrentHp() : undefined;
        }

        public getMaxBuildMaterial(): number | undefined {
            return this._template.maxBuildMaterial;
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

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for load unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxLoadUnitsCount(): number | undefined {
            return this._template.maxLoadUnitsCount;
        }

        public getLoadedUnitsCount(): number | undefined {
            return this._loadedUnitIds ? this._loadedUnitIds.length : undefined;
        }

        public getLoadedUnitIds(): number[] | undefined {
            return this._loadedUnitIds;
        }

        public checkHasLoadUnitId(id: number): boolean {
            const ids = this._loadedUnitIds;
            return ids ? ids.indexOf(id) >= 0 : false;
        }

        public checkCanDropLoadedUnit(): boolean | undefined {
            return this._template.canDropLoadedUnits;
        }

        public checkCanLaunchLoadedUnit(): boolean | undefined {
            return this._template.canLaunchLoadedUnits;
        }

        public checkCanSupplyLoadedUnit(): boolean | undefined {
            return this._template.canSupplyLoadedUnits;
        }

        public getRepairAmountForLoadedUnit(): number | undefined {
            return this._template.repairAmountForLoadedUnits;
        }

        public addLoadUnitId(id: number): void {
            const loadedCount = this.getLoadedUnitsCount();
            const maxCount    = this.getMaxLoadUnitsCount();
            Logger.assert(
                (loadedCount != null) && (maxCount != null) && (loadedCount < maxCount) && (!this.checkHasLoadUnitId(id)),
                "UnitModel.addLoadUnitId() error, id: ", id
            );

            this._loadedUnitIds!.push(id);
        }
        public removeLoadUnitId(id: number): void {
            Logger.assert(this.checkHasLoadUnitId(id), "UnitModel.removeLoadUnitId() error, id: ", id);

            const ids = this._loadedUnitIds!;
            ids.splice(ids.indexOf(id), 1);
        }
        private _setLoadUnitIds(ids: number[] | undefined): void {
            const maxCount = this.getMaxLoadUnitsCount();
            if (maxCount == null) {
                Logger.assert(ids == null, "UnitModel._setLoadUnitIds() error, ids: ", ids);
            } else {
                Logger.assert((ids != null) && (ids.length <= maxCount), "UnitModel._setLoadUnitIds() error, ids: ", ids);
            }

            this._loadedUnitIds = ids;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for supply unit.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanSupplyAdjacentUnit(): boolean | undefined {
            return this._template.canSupplyAdjacentUnits;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for vision.
        ////////////////////////////////////////////////////////////////////////////////
        public getVisionRange(): number {
            return this._template.visionRange;
        }

        public getVisionRangeOnTile(tileType: TileType): number {
            const bonuses = this._template.visionBonusOnTiles;
            return this.getVisionRange() + (bonuses ? bonuses[tileType] || 0 : 0);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createInstantialData(): InstantialUnit | undefined {
            const data: InstantialUnit = {};

            const state = this.getState();
            (state !== UnitState.Idle) && (data.state = state);

            const currentHp = this.getCurrentHp();
            (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

            const currentAmmo = this.getPrimaryWeaponCurrentAmmo();
            (currentAmmo !== this.getPrimaryWeaponMaxAmmo()) && (data.primaryWeaponCurrentAmmo = currentAmmo);

            const isCapturing = this.getIsCapturingTile();
            (isCapturing) && (data.isCapturingTile = isCapturing);

            const isDiving = this.getIsDiving();
            (isDiving) && (data.isDiving = isDiving);

            const currentFuel = this.getCurrentFuel();
            (currentFuel !== this.getMaxFuel()) && (data.currentFuel = currentFuel);

            const flareAmmo = this.getFlareCurrentAmmo();
            (flareAmmo !== this.getFlareMaxAmmo()) && (data.flareCurrentAmmo = flareAmmo);

            const produceMaterial = this.getCurrentProduceMaterial();
            (produceMaterial !== this.getMaxProduceMaterial()) && (data.currentProduceMaterial = produceMaterial);

            const currentPromotion = this.getCurrentPromotion();
            (currentPromotion !== 0) && (data.currentPromotion = currentPromotion);

            const isBuildingTile = this.getIsBuildingTile();
            (isBuildingTile) && (data.isBuildingTile = isBuildingTile);

            const buildMaterial = this.getCurrentBuildMaterial();
            (buildMaterial !== this.getMaxBuildMaterial()) && (data.currentBuildMaterial = buildMaterial);

            const loadedUnitIds = this.getLoadedUnitIds();
            (loadedUnitIds) && (loadedUnitIds.length > 0) && (data.loadedUnitIds = loadedUnitIds);

            return Helpers.checkIsEmptyObject(data) ? undefined : data;
        }

        private _loadInstantialData(d: InstantialUnit | undefined) {
            this.setState(                   (d) && (d.state                    != null) ? d.state                    : UnitState.Idle);
            this.setCurrentHp(               (d) && (d.currentHp                != null) ? d.currentHp                : this.getMaxHp());
            this.setPrimaryWeaponCurrentAmmo((d) && (d.primaryWeaponCurrentAmmo != null) ? d.primaryWeaponCurrentAmmo : this.getPrimaryWeaponMaxAmmo());
            this.setIsCapturingTile(         (d) && (d.isCapturingTile          != null) ? d.isCapturingTile          : false);
            this.setIsDiving(                (d) && (d.isDiving                 != null) ? d.isDiving                 : false);
            this.setCurrentFuel(             (d) && (d.currentFuel              != null) ? d.currentFuel              : this.getMaxFuel());
            this.setFlareCurrentAmmo(        (d) && (d.flareCurrentAmmo         != null) ? d.flareCurrentAmmo         : this.getFlareMaxAmmo());
            this.setCurrentProduceMaterial(  (d) && (d.currentProduceMaterial   != null) ? d.currentProduceMaterial   : this.getMaxProduceMaterial());
            this.setCurrentPromotion(        (d) && (d.currentPromotion         != null) ? d.currentPromotion         : 0);
            this.setIsBuildingTile(          (d) && (d.isBuildingTile           != null) ? d.isBuildingTile           : false);
            this.setCurrentBuildMaterial(    (d) && (d.currentBuildMaterial     != null) ? d.currentBuildMaterial     : this.getMaxBuildMaterial());
            this._setLoadUnitIds(            (d) && (d.loadedUnitIds            != null) ? d.loadedUnitIds            : undefined);
        }
    }
}
