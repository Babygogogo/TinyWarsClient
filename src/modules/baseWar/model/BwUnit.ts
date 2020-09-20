
namespace TinyWars.BaseWar {
    import Types                = Utility.Types;
    import Logger               = Utility.Logger;
    import GridIndexHelpers     = Utility.GridIndexHelpers;
    import ProtoTypes           = Utility.ProtoTypes;
    import ConfigManager        = Utility.ConfigManager;
    import UnitActionState      = Types.UnitActionState;
    import ArmorType            = Types.ArmorType;
    import TileType             = Types.TileType;
    import TileObjectType       = Types.TileObjectType;
    import TileBaseType         = Types.TileBaseType;
    import UnitType             = Types.UnitType;
    import MoveType             = Types.MoveType;
    import GridIndex            = Types.GridIndex;
    import MovePathNode         = Types.MovePathNode;
    import ISerialUnit          = ProtoTypes.WarSerialization.ISerialUnit;
    import IWarUnitRepairData   = ProtoTypes.Structure.IDataForModifyUnit;
    import CommonConstants      = ConfigManager.COMMON_CONSTANTS;

    export abstract class BwUnit {
        private _configVersion      : string;
        private _templateCfg        : Types.UnitTemplateCfg;
        private _damageChartCfg     : { [armorType: number]: { [weaponType: number]: Types.DamageChartCfg } };
        private _buildableTileCfg   : { [srcBaseType: number]: { [srcObjectType: number]: Types.BuildableTileCfg } };
        private _visionBonusCfg     : { [tileType: number]: Types.VisionBonusCfg };
        private _playerIndex        : number;

        private _gridX                      : number;
        private _gridY                      : number;
        private _unitId                     : number;
        private _actionState                : UnitActionState;
        private _currentHp                  : number;
        private _currentFuel                : number;
        private _currentPromotion           : number;
        private _currentBuildMaterial       : number;
        private _currentProduceMaterial     : number;
        private _flareCurrentAmmo           : number;
        private _isBuildingTile             : boolean;
        private _isCapturingTile            : boolean;
        private _isDiving                   : boolean;
        private _hasLoadedCo                : boolean;
        private _loaderUnitId               : number;
        private _primaryWeaponCurrentAmmo   : number;

        private _war    : BwWar;
        private _view   : BwUnitView;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers and serializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        protected abstract _getViewClass(): new () => BwUnitView;

        public init(data: ISerialUnit, configVersion: string): BwUnit {
            const playerIndex = data.playerIndex;
            if (playerIndex == null) {
                Logger.error(`BwUnit.init() empty playerIndex.`);
                return undefined;
            }

            const unitType = data.unitType as UnitType;
            if (unitType == null) {
                Logger.error(`BwUnit.init() empty unitType.`);
                return undefined;
            }

            const unitId = data.unitId;
            if (unitId == null) {
                Logger.error(`BwUnit.init() empty unitId.`);
                return undefined;
            }

            const gridIndex = BwHelpers.convertGridIndex(data.gridIndex);
            if (gridIndex == null) {
                Logger.error(`BwUnit.init() empty gridIndex.`);
                return undefined;
            }

            const unitTemplateCfg = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
            if (!unitTemplateCfg) {
                Logger.error(`BwUnit.init() failed to get the unit template cfg! configVersion: ${configVersion}, unitType: ${unitType}`);
                return undefined;
            }

            const damageChartCfg = ConfigManager.getDamageChartCfgs(configVersion, unitType);
            if (!damageChartCfg) {
                Logger.error(`BwUnit.init() failed to get the unit damage cfg! configVersion: ${configVersion}, unitType: ${unitType}`);
                return undefined;
            }

            this._setConfigVersion(configVersion);
            this.setGridIndex(gridIndex);
            this._setTemplateCfg(unitTemplateCfg);
            this._setDamageChartCfg(damageChartCfg);
            this._setBuildableTileCfg(ConfigManager.getBuildableTileCfgs(configVersion, unitType));
            this._setVisionBonusCfg(ConfigManager.getVisionBonusCfg(configVersion, unitType));
            this._setUnitId(unitId);
            this._setPlayerIndex(playerIndex);
            this._setWar(undefined);
            this.setIsDiving(data.isDiving || ConfigManager.checkIsUnitDivingByDefaultWithTemplateCfg(unitTemplateCfg));
            this.setHasLoadedCo(data.hasLoadedCo || false);
            this.setLoaderUnitId(data.loaderUnitId);
            this.setActionState(             data.actionState              != null ? data.actionState              : UnitActionState.Idle);
            this.setCurrentHp(               data.currentHp                != null ? data.currentHp                : unitTemplateCfg.maxHp);
            this.setPrimaryWeaponCurrentAmmo(data.primaryWeaponCurrentAmmo != null ? data.primaryWeaponCurrentAmmo : this.getPrimaryWeaponMaxAmmo());
            this.setIsCapturingTile(         data.isCapturingTile          != null ? data.isCapturingTile          : false);
            this.setCurrentFuel(             data.currentFuel              != null ? data.currentFuel              : unitTemplateCfg.maxFuel);
            this.setFlareCurrentAmmo(        data.flareCurrentAmmo         != null ? data.flareCurrentAmmo         : this.getFlareMaxAmmo());
            this.setCurrentProduceMaterial(  data.currentProduceMaterial   != null ? data.currentProduceMaterial   : this.getMaxProduceMaterial());
            this.setCurrentPromotion(        data.currentPromotion         != null ? data.currentPromotion         : 0);
            this.setIsBuildingTile(          data.isBuildingTile           != null ? data.isBuildingTile           : false);
            this.setCurrentBuildMaterial(    data.currentBuildMaterial     != null ? data.currentBuildMaterial     : this.getMaxBuildMaterial());

            const view = this.getView() || new (this._getViewClass())();
            view.init(this);
            this._setView(view);

            return this;
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
        }

        public serialize(): ISerialUnit | undefined {
            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwHelpers.serializeUnit() empty gridIndex.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwHelpers.serializeUnit() empty playerIndex.`);
                return undefined;
            }

            const unitType = this.getType();
            if (unitType == null) {
                Logger.error(`BwHelpers.serializeUnit() empty unitType.`);
                return undefined;
            }

            const unitId = this.getUnitId();
            if (unitId == null) {
                Logger.error(`BwHelpers.serializeUnit() unitId is empty.`);
                return undefined;
            }

            const data: ISerialUnit = {
                gridIndex,
                playerIndex,
                unitType,
                unitId,
            };

            const actionState = this.getActionState();
            (actionState != UnitActionState.Idle) && (data.actionState = actionState);

            const currentHp = this.getCurrentHp();
            (currentHp != this.getMaxHp()) && (data.currentHp = currentHp);

            const currentAmmo = this.getPrimaryWeaponCurrentAmmo();
            (currentAmmo != this.getPrimaryWeaponMaxAmmo()) && (data.primaryWeaponCurrentAmmo = currentAmmo);

            const isCapturing = this.getIsCapturingTile();
            (isCapturing) && (data.isCapturingTile = isCapturing);

            const currentFuel = this.getCurrentFuel();
            (currentFuel != this.getMaxFuel()) && (data.currentFuel = currentFuel);

            const flareAmmo = this.getFlareCurrentAmmo();
            (flareAmmo != this.getFlareMaxAmmo()) && (data.flareCurrentAmmo = flareAmmo);

            const produceMaterial = this.getCurrentProduceMaterial();
            (produceMaterial != this.getMaxProduceMaterial()) && (data.currentProduceMaterial = produceMaterial);

            const currentPromotion = this.getCurrentPromotion();
            (currentPromotion != 0) && (data.currentPromotion = currentPromotion);

            const isBuildingTile = this.getIsBuildingTile();
            (isBuildingTile) && (data.isBuildingTile = isBuildingTile);

            const buildMaterial = this.getCurrentBuildMaterial();
            (buildMaterial != this.getMaxBuildMaterial()) && (data.currentBuildMaterial = buildMaterial);

            const isDiving = this.getIsDiving();
            (isDiving != this.checkIsDivingByDefault()) && (data.isDiving = isDiving);

            const hasLoadedCo = this.getHasLoadedCo();
            (hasLoadedCo) && (data.hasLoadedCo = hasLoadedCo);

            const loaderUnitId = this.getLoaderUnitId();
            (loaderUnitId != null) && (data.loaderUnitId = loaderUnitId);

            return data;
        }
        public serializeForSimulation(): ISerialUnit | undefined {
            const data = this.serialize();
            if (data == null) {
                Logger.error(`BwUnit.serializeForSimulation() empty data.`);
                return undefined;
            }

            return data;
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        public getWar(): BwWar | undefined {
            return this._war;
        }

        private _setConfigVersion(version: string): void {
            this._configVersion = version;
        }
        public getConfigVersion(): string {
            return this._configVersion;
        }

        public getPlayer(): BwPlayer {
            const war = this.getWar();
            return war ? war.getPlayer(this.getPlayerIndex()) : null;
        }

        private _setTemplateCfg(templateCfg: Types.UnitTemplateCfg): void {
            this._templateCfg = templateCfg;
        }
        private _getTemplateCfg(): Types.UnitTemplateCfg | undefined {
            return this._templateCfg;
        }

        private _setBuildableTileCfg(buildableTileCfg: { [srcBaseType: number]: { [srcObjectType: number]: Types.BuildableTileCfg } } | undefined): void {
            this._buildableTileCfg = buildableTileCfg;
        }
        private _getBuildableTileCfg(): { [srcBaseType: number]: { [srcObjectType: number]: Types.BuildableTileCfg } } | undefined {
            return this._buildableTileCfg;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        private _setView(view: BwUnitView): void {
            this._view = view;
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

        public moveViewAlongPath(pathNodes: GridIndex[], isDiving: boolean, isBlocked: boolean, aiming?: GridIndex): Promise<void> {
            return this.getView().moveAlongPath(pathNodes, isDiving, isBlocked, aiming);
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

        public getSkinId(): number | undefined {
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit.getSkinId() empty player.`);
                return undefined;
            }

            return player.getUnitAndTileSkinId();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for state.
        ////////////////////////////////////////////////////////////////////////////////
        public getActionState(): UnitActionState {
            return this._actionState;
        }
        public setActionState(state: UnitActionState): void {
            this._actionState = state;
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

        public getTeamIndex(): number | undefined {
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit.getTeamIndex() empty player.`);
                return undefined;
            }

            return player.getTeamIndex();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hp and armor.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxHp(): number {
            return this._templateCfg.maxHp;
        }
        public getNormalizedMaxHp(): number {
            return BwHelpers.getNormalizedHp(this.getMaxHp());
        }

        public getNormalizedCurrentHp(): number {
            return BwHelpers.getNormalizedHp(this.getCurrentHp());
        }
        public getCurrentHp(): number {
            return this._currentHp;
        }
        public setCurrentHp(hp: number): void {
            Logger.assert((hp >= 0) && (hp <= this.getMaxHp()), "UnitModel.setCurrentHp() error, hp: ", hp);
            this._currentHp = hp;
        }

        public checkIsFullHp(): boolean {
            const currentHp = this.getCurrentHp();
            return (currentHp != null) && (currentHp == this.getMaxHp());
        }

        public getArmorType(): ArmorType {
            return this._templateCfg.armorType;
        }

        public checkIsArmorAffectByLuck(): boolean {
            return this._templateCfg.isAffectedByLuck === 1;
        }

        public updateByRepairData(data: IWarUnitRepairData): void {
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

        public getPrimaryWeaponUsedAmmo(): number | undefined {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            if (maxAmmo == null) {
                return undefined;
            } else {
                const currentAmmo = this.getPrimaryWeaponCurrentAmmo();
                if (currentAmmo == null) {
                    Logger.error(`BwUnit.getPrimaryWeaponUsedAmmo() empty currentAmmo!`);
                    return undefined;
                } else {
                    return maxAmmo - currentAmmo;
                }
            }
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
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit.getAttackModifierByCo() no player.`);
                return undefined;
            }

            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit.getAttackModifierByCo() configVersion is empty.`);
                return undefined;
            }

            const unitType = this.getType();
            if (unitType == null) {
                Logger.error(`BwUnit.getAttackModifierByCo() unitType is empty.`);
                return undefined;
            }

            if (!player.getCoId()) {
                return 0;
            }

            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                Logger.error(`BwUnit.getAttackModifierByCo() empty coGridIndexListOnMap.`);
                return undefined;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit.getAttackModifierByCo() empty coZoneRadius.`);
                return undefined;
            }

            const promotion     = this.getCurrentPromotion();
            const hasLoadedCo   = this.getHasLoadedCo();
            let modifier        = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
                if (!skillCfg) {
                    Logger.error(`BwUnit.getAttackModifierByCo() failed getCoSkillCfg()! configVersion: ${configVersion}, skillId: ${skillId}`);
                    return undefined;
                }

                const attackBonusCfg = skillCfg.attackBonus;
                if ((attackBonusCfg)                                                                                                                        &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, attackBonusCfg[1]))                                                   &&
                    ((hasLoadedCo) || (BwHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, attackBonusCfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += attackBonusCfg[2];
                }

                const attackBonusByPromotionCfg = skillCfg.attackBonusByPromotion;
                if ((attackBonusByPromotionCfg)                                                                                                                     &&
                    (attackBonusByPromotionCfg[2] === promotion)                                                                                                    &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, attackBonusByPromotionCfg[1]))                                                &&
                    ((hasLoadedCo) || (BwHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, attackBonusByPromotionCfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += attackBonusByPromotionCfg[3];
                }
            }

            return modifier;
        }
        public getDefenseModifierByCo(selfGridIndex: GridIndex): number {
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit.getDefenseModifierByCo() no player.`);
                return undefined;
            }

            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit.getDefenseModifierByCo() configVersion is empty.`);
                return undefined;
            }

            const unitType = this.getType();
            if (unitType == null) {
                Logger.error(`BwUnit.getDefenseModifierByCo() unitType is empty.`);
                return undefined;
            }

            if (!player.getCoId()) {
                return 0;
            }

            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                Logger.error(`BwUnit.getDefenseModifierByCo() empty coGridIndexListOnMap.`);
                return undefined;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit.getDefenseModifierByCo() empty coZoneRadius.`);
                return undefined;
            }

            const promotion     = this.getCurrentPromotion();
            const hasLoadedCo   = this.getHasLoadedCo();
            let modifier        = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
                if (!skillCfg) {
                    Logger.error(`BwUnit.getDefenseModifierByCo() failed getCoSkillCfg()! configVersion: ${configVersion}, skillId: ${skillId}`);
                    return undefined;
                }

                const defenseBonusCfg = skillCfg.defenseBonus;
                if ((defenseBonusCfg)                                                                                                                       &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, defenseBonusCfg[1]))                                                  &&
                    ((hasLoadedCo) || (BwHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, defenseBonusCfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += defenseBonusCfg[2];
                }

                const defenseBonusByPromotionCfg = skillCfg.defenseBonusByPromotion;
                if ((defenseBonusByPromotionCfg)                                                                                                                    &&
                    (defenseBonusByPromotionCfg[2] === promotion)                                                                                                   &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, defenseBonusByPromotionCfg[1]))                                               &&
                    ((hasLoadedCo) || (BwHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, defenseBonusByPromotionCfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += defenseBonusByPromotionCfg[3];
                }
            }
            return modifier;
        }

        public checkHasSecondaryWeapon(): boolean {
            return Utility.ConfigManager.checkHasSecondaryWeapon(this.getConfigVersion(), this.getType());
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

        private _setDamageChartCfg(damageChartCfg: { [armorType: number]: { [weaponType: number]: Types.DamageChartCfg } }): void {
            this._damageChartCfg = damageChartCfg;
        }
        private _getDamageChartCfg(): { [armorType: number]: { [weaponType: number]: Types.DamageChartCfg } } | undefined {
            return this._damageChartCfg;
        }
        public getCfgBaseDamage(targetArmorType: Types.ArmorType, weaponType: Types.WeaponType): number | null | undefined {
            const cfgs  = this._getDamageChartCfg();
            const cfg   = cfgs ? cfgs[targetArmorType] : undefined;
            return cfg ? cfg[weaponType]?.damage : undefined;
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
        private _getMaxAttackRangeModifierByCo(): number | undefined {
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit._getMaxAttackRangeModifierByCo() no player.`);
                return undefined;
            }

            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit._getMaxAttackRangeModifierByCo() configVersion is empty.`);
                return undefined;
            }

            const unitType = this.getType();
            if (unitType == null) {
                Logger.error(`BwUnit._getMaxAttackRangeModifierByCo() unitType is empty.`);
                return undefined;
            }

            const selfGridIndex = this.getGridIndex();
            if (selfGridIndex == null) {
                Logger.error(`BwUnit._getMaxAttackRangeModifierByCo() empty selfGridIndex.`);
                return undefined;
            }

            if (!player.getCoId()) {
                return 0;
            }

            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                Logger.error(`BwUnit._getMaxAttackRangeModifierByCo() empty coGridIndexListOnMap.`);
                return undefined;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit._getMaxAttackRangeModifierByCo() empty coZoneRadius.`);
                return undefined;
            }

            const hasLoadedCo   = this.getHasLoadedCo();
            let modifier        = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.maxAttackRangeBonus;
                if ((cfg)                                                                                                                       &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                                  &&
                    ((hasLoadedCo) || (BwHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, cfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += cfg[2];
                }
            }
            return modifier;
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
            const unitMap       = this.getWar().getUnitMap();
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
                    const armorType = this.getWar().getTileMap().getTile(targetGridIndex).getArmorType();
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

        public checkIsDivingByDefault(): boolean | undefined {
            const templateCfg = this._getTemplateCfg();
            if (templateCfg == null) {
                Logger.error(`BwUnit.checkIsDivingByDefault() empty templateCfg.`);
                return undefined;
            }

            return ConfigManager.checkIsUnitDivingByDefaultWithTemplateCfg(templateCfg);
        }

        public checkIsDiver(): boolean | undefined {
            const templateCfg = this._getTemplateCfg();
            if (templateCfg == null) {
                Logger.error(`BwUnit.checkIsDiver() empty templateCfg.`);
                return undefined;
            }

            return !!templateCfg.diveCfgs;
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

        public getUsedFuel(): number | undefined {
            const maxFuel = this.getMaxFuel();
            if (maxFuel == null) {
                Logger.error(`BwUnit.getUsedFuel() empty maxFuel.`);
                return undefined;
            }

            const currentFuel = this.getCurrentFuel();
            if (currentFuel == null) {
                Logger.error(`BwUnit.getUsedFuel() empty currentFuel.`);
                return undefined;
            }

            return maxFuel - currentFuel;
        }

        public getFuelConsumptionPerTurn(): number | null | undefined {
            const templateCfg = this._getTemplateCfg();
            if (templateCfg == null) {
                Logger.error(`BwUnit.getFuelConsumptionPerTurn() empty templateCfg.`);
                return undefined;
            }

            if (!this.getIsDiving()) {
                return templateCfg.fuelConsumptionPerTurn;
            } else {
                const cfg = templateCfg.diveCfgs;
                if (cfg == null) {
                    Logger.error(`BwUnit.getFuelConsumptionPerTurn() empty cfg.`);
                    return undefined;
                }
                return cfg[0];
            }
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

        public getFlareUsedAmmo(): number | undefined {
            const maxAmmo = this.getFlareMaxAmmo();
            if (maxAmmo == null) {
                return undefined;
            } else {
                const currentAmmo = this.getFlareCurrentAmmo();
                if (currentAmmo == null) {
                    Logger.error(`BwUnit.getFlareUsedAmmo() empty currentAmmo!`);
                    return undefined;
                } else {
                    return maxAmmo - currentAmmo;
                }
            }
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
                return Utility.ConfigManager.getUnitTemplateCfg(this.getConfigVersion(), type).productionCost;
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
            const war           = this.getWar();
            const currentFuel   = this.getCurrentFuel();
            const cfgMoveRange  = this.getCfgMoveRange();
            if ((!war) || (currentFuel == null) || (cfgMoveRange == null)) {
                Logger.error(`BwUnit.getFinalMoveRange() war/currentFuel/cfgMoveRange is empty.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwUnit.getFinalMoveRange() empty playerIndex.`);
                return undefined;
            }

            const modifierBySettings = war.getSettingsMoveRangeModifier(playerIndex);
            if (modifierBySettings == null) {
                Logger.error(`BwUnit.getFinalMoveRange() empty modifierBySettings.`);
                return undefined;
            }

            if (currentFuel <= 0) {
                return 0;
            } else {
                const modifierByCo = this._getMoveRangeModifierByCo();
                if (modifierByCo == null) {
                    Logger.error(`BwUnit.getFinalMoveRange() modifier is empty.`);
                    return undefined;
                }

                return Math.max(
                    1,
                    Math.min(
                        currentFuel,
                        cfgMoveRange + modifierBySettings + modifierByCo,
                    ),
                );
            }
        }
        private _getMoveRangeModifierByCo(): number | undefined {
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit._getMoveRangeModifierByCo() no player.`);
                return undefined;
            }

            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit._getMoveRangeModifierByCo() configVersion is empty.`);
                return undefined;
            }

            const unitType = this.getType();
            if (unitType == null) {
                Logger.error(`BwUnit._getMoveRangeModifierByCo() unitType is empty.`);
                return undefined;
            }

            if (!player.getCoId()) {
                return 0;
            }

            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                Logger.error(`BwUnit._getMoveRangeModifierByCo() empty coGridIndexListOnMap.`);
                return undefined;
            }

            const selfGridIndex = this.getGridIndex();
            if (selfGridIndex == null) {
                Logger.error(`BwUnit._getMoveRangeModifierByCo() empty selfGridIndex.`);
                return undefined;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit._getMoveRangeModifierByCo() empty coZoneRadius.`);
                return undefined;
            }

            const hasLoadedCo   = this.getHasLoadedCo();
            let modifier        = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.moveRangeBonus;
                if ((cfg)                                                                                                                       &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                                  &&
                    ((hasLoadedCo) || (BwHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, cfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += cfg[2];
                }
            }
            return modifier;
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
            return Utility.ConfigManager.getUnitMaxPromotion(this.getConfigVersion());
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
            return Utility.ConfigManager.getUnitPromotionAttackBonus(this.getConfigVersion(), this.getCurrentPromotion());
        }

        public getPromotionDefenseBonus(): number {
            return Utility.ConfigManager.getUnitPromotionDefenseBonus(this.getConfigVersion(), this.getCurrentPromotion());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for launch silo.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanLaunchSiloOnTile(tile: BwTile): boolean {
            return (this._templateCfg.canLaunchSilo === 1) && (tile.getType() === TileType.Silo);
        }

        public getTileObjectViewIdAfterLaunchSilo(): number {
            return Utility.ConfigManager.getTileObjectViewId(Types.TileObjectType.EmptySilo, 0);
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
            return this._getBuildableTileCfg() != null;
        }
        public checkCanBuildOnTile(tile: BwTile): boolean {
            const tileObjectType = tile.getObjectType();
            if (tileObjectType == null) {
                Logger.error(`BwUnit.checkCanBuildOnTile() tileObjectType is empty.`);
                return false;
            }

            const tileBaseType = tile.getBaseType();
            if (tileBaseType == null) {
                Logger.error(`BwUnit.checkCanBuildOnTile() empty tileBaseType.`);
                return false;
            }

            const material = this.getCurrentBuildMaterial();
            return (material != null)
                && (material > 0)
                && (this.getBuildTargetTileCfg(tileBaseType, tileObjectType) != null);
        }

        public getBuildTargetTileCfg(baseType: TileBaseType, objectType: TileObjectType): Types.BuildableTileCfg | undefined {
            const buildableCfgs = this._getBuildableTileCfg();
            const cfgs          = buildableCfgs ? buildableCfgs[baseType] : undefined;
            return cfgs ? cfgs[objectType] : undefined;
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
            return this.getWar().getUnitMap().getUnitsLoadedByLoader(this, false);
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
                && (Utility.ConfigManager.checkIsTileTypeInCategory(this.getConfigVersion(), this.getWar().getTileMap().getTile(this.getGridIndex()).getType(), loadableTileCategory))
                && (Utility.ConfigManager.checkIsUnitTypeInCategory(this.getConfigVersion(), unit.getType(), loadUnitCategory))
                && (this.getPlayerIndex() === unit.getPlayerIndex())
                && (this.getLoadedUnitsCount() < maxLoadUnitsCount);
        }
        public checkCanDropLoadedUnit(tileType: TileType): boolean {
            const cfg       = this._templateCfg;
            const category  = cfg.loadableTileCategory;
            return (cfg.canDropLoadedUnits === 1)
                && (category != null)
                && (Utility.ConfigManager.checkIsTileTypeInCategory(this.getConfigVersion(), tileType, category));
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
                && ((!unit.checkIsFullHp()) || (unit.checkCanBeSupplied()));
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
                const unitMap = this.getWar().getUnitMap();
                return unitMap.getUnitLoadedById(id) || unitMap.getUnitOnMap(this.getGridIndex());
            }
        }

        public getRepairHpAndCostForLoadedUnit(unit: BwUnit): Types.RepairHpAndCost | undefined {
            if (!this._checkCanRepairLoadedUnit(unit)) {
                return undefined;
            }

            const unitPlayer = unit.getPlayer();
            if (unitPlayer == null) {
                Logger.error(`BwUnit.getRepairHpAndCostForLoadedUnit() unitPlayer is empty.`);
                return undefined;
            }

            const normalizedMaxHp       = unit.getNormalizedMaxHp();
            const productionCost        = unit.getProductionFinalCost();
            const normalizedCurrentHp   = unit.getNormalizedCurrentHp();
            const currentHp             = unit.getCurrentHp();
            const repairAmount          = this.getNormalizedRepairHpForLoadedUnit();
            const fund                  = unitPlayer.getFund();
            if ((normalizedMaxHp == null)       ||
                (productionCost == null)        ||
                (normalizedCurrentHp == null)   ||
                (currentHp == null)             ||
                (fund == null)                  ||
                (repairAmount == null)
            ) {
                return undefined;
            } else {
                const normalizedRepairHp = Math.min(
                    normalizedMaxHp - normalizedCurrentHp,
                    repairAmount,
                    Math.floor(fund * normalizedMaxHp / productionCost)
                );
                return {
                    hp  : (normalizedRepairHp + normalizedCurrentHp) * CommonConstants.UnitHpNormalizer - currentHp,
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
        public checkCanSupplyAdjacentUnit(unit: BwUnit, attributes = unit.getAttributes()): boolean {
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
        private _setVisionBonusCfg(cfg: { [tileType: number]: Types.VisionBonusCfg } | undefined): void {
            this._visionBonusCfg = cfg;
        }
        private _getVisionBonusCfg(): { [tileType: number]: Types.VisionBonusCfg } | undefined {
            return this._visionBonusCfg;
        }

        public getCfgVisionRange(): number {
            return this._templateCfg.visionRange;
        }
        public getVisionRangeBonusOnTile(tileType: TileType): number {
            const cfgs  = this._getVisionBonusCfg();
            const cfg   = cfgs ? cfgs[tileType] : undefined;
            return cfg ? cfg.visionBonus || 0 : 0;
        }

        public getVisionRangeForPlayer(playerIndex: number, gridIndex: GridIndex): number | undefined {
            const cfgVisionRange    = this.getCfgVisionRange();
            const war               = this.getWar();
            if ((this.getPlayerIndex() !== playerIndex) || (cfgVisionRange == null) || (!war)) {
                return undefined;
            }

            const player = war.getPlayer(playerIndex);
            if (!player) {
                Logger.error(`BwUnit.getVisionRangeForPlayer() invalid playerIndex: ${playerIndex}`);
                return undefined;
            }

            const tileMap = war.getTileMap();
            if (tileMap == null) {
                Logger.error(`BwUnit.getVisionRangeForPlayer() empty tileMap.`);
                return undefined;
            }

            const tile = tileMap.getTile(gridIndex);
            if (tile == null) {
                Logger.error(`BwUnit.getVisionRangeForPlayer() tile is empty.`);
                return undefined;
            }

            const tileType = tile.getType();
            if (tileType == null) {
                Logger.error(`BwUnit.getVisionRangeForPlayer() tileType is empty.`);
                return undefined;
            }

            const modifierByCo = this._getVisionRangeModifierByCo(gridIndex);
            if (modifierByCo == null) {
                Logger.error(`BwUnit.getVisionRangeForPlayer() empty modifierByCo.`);
                return undefined;
            }

            const modifierBySettings = war.getSettingsVisionRangeModifier(playerIndex);
            if (modifierBySettings == null) {
                Logger.error(`BwUnit.getVisionRangeForPlayer() empty modifierBySettings.`);
                return undefined;
            }

            return Math.max(
                1,
                cfgVisionRange + modifierByCo + this.getVisionRangeBonusOnTile(tileType) + modifierBySettings
            );
        }
        public getVisionRangeForTeamIndexes(teamIndexes: Set<number>, gridIndex: GridIndex): number | undefined {
            let vision = null;
            for (const playerIndex of this.getWar().getPlayerManager().getPlayerIndexesInTeams(teamIndexes)) {
                const v = this.getVisionRangeForPlayer(playerIndex, gridIndex);
                if ((vision == null) || (v > vision)) {
                    vision = v;
                }
            }
            return vision;
        }
        private _getVisionRangeModifierByCo(selfGridIndex: GridIndex): number | undefined {
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit._getVisionRangeModifierByCo() empty player.`);
                return undefined;
            }

            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit._getVisionRangeModifierByCo() empty configVersion.`);
                return undefined;
            }

            const unitType = this.getType();
            if (unitType == null) {
                Logger.error(`BwUnit._getVisionRangeModifierByCo() empty unitType.`);
                return undefined;
            }

            if (!player.getCoId()) {
                return 0;
            }

            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                Logger.error(`BwUnit.getVisionRangeForPlayer() empty coGridIndexListOnMap.`);
                return undefined;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit.getVisionRangeForPlayer() empty coZoneRadius.`);
                return undefined;
            }

            let modifier        = 0;
            const hasLoadedCo   = this.getHasLoadedCo();
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.unitVisionRangeBonus;
                if ((cfg)                                                                                                                   &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                              &&
                    ((hasLoadedCo) || (BwHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, cfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += cfg[2];
                }
            }

            return modifier;
        }

        public checkIsTrueVision(gridIndex: GridIndex): boolean {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit.checkIsTrueVision() configVersion is empty.`);
                return false;
            }

            const unitType = this.getType();
            if (unitType == null) {
                Logger.error(`BwUnit.checkIsTrueVision() unitType is empty.`);
                return false;
            }

            const player = this.getPlayer();
            if (!player) {
                Logger.error(`BwUnit.checkIsTrueVision() player is empty.`);
                return false;
            }

            if (!player.getCoId()) {
                return false;
            }

            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                Logger.error(`BwUnit.checkIsTrueVision() empty coGridIndexListOnMap.`);
                return false;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit.checkIsTrueVision() empty coZoneRadius.`);
                return false;
            }

            const hasLoadedCo = this.getHasLoadedCo();
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.unitTrueVision;
                if ((cfg)                                                                                                                   &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                              &&
                    ((hasLoadedCo) || (BwHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    return true;
                }
            }
            return false;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for join.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanJoinUnit(unit: BwUnit): boolean {
            return (this !== unit)
                && (this.getType() === unit.getType())
                && (this.getPlayerIndex() === unit.getPlayerIndex())
                && (unit.getNormalizedCurrentHp()! < unit.getNormalizedMaxHp()!)
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
        // Functions for co.
        ////////////////////////////////////////////////////////////////////////////////
        public setHasLoadedCo(isCoOnBoard: boolean): void {
            this._hasLoadedCo = isCoOnBoard;
        }
        public getHasLoadedCo(): boolean | undefined {
            const hasLoadedCo = this._hasLoadedCo;
            if (hasLoadedCo == null) {
                Logger.error(`BwUnit.getHasLoadedCo() empty hasLoadedCo.`);
                return undefined;
            }

            return hasLoadedCo;
        }

        public checkCanLoadCoAfterMovePath(movePath: GridIndex[]): boolean | undefined {
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwUnit.checkCanLoadCoAfterMovePath() war is empty.`);
                return false;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwUnit.checkCanLoadCoAfterMovePath() playerIndex is empty.`);
                return false;
            }

            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit.checkCanLoadCoAfterMovePath() configVersion is empty.`);
                return false;
            }

            const unitType = this.getType();
            if (unitType == null) {
                Logger.error(`BwUnit.checkCanLoadCoAfterMovePath() unitType is empty.`);
                return false;
            }

            const player = war.getPlayer(playerIndex);
            if (player == null) {
                Logger.error(`BwUnit.checkCanLoadCoAfterMovePath() empty player.`);
                return undefined;
            }

            const fund = player.getFund();
            if (fund == null) {
                Logger.error(`BwUnit.checkCanLoadCoAfterMovePath() empty fund.`);
                return undefined;
            }

            const maxLoadCount = player.getCoMaxLoadCount();
            if (maxLoadCount == null) {
                Logger.error(`BwUnit.checkCanLoadCoAfterMovePath() empty maxLoadCount.`);
                return undefined;
            }

            const unitMap = war.getUnitMap();
            if (unitMap == null) {
                Logger.error(`BwUnit.checkCanLoadCoAfterMovePath() empty unitMap.`);
                return undefined;
            }

            const tileMap = war.getTileMap();
            if (tileMap == null) {
                Logger.error(`BwUnit.checkCanLoadCoAfterMovePath() empty tileMap.`);
                return undefined;
            }

            const allCoUnits = unitMap.getAllCoUnits(playerIndex);
            if (allCoUnits == null) {
                Logger.error(`BwUnit.checkCanLoadCoAfterMovePath() empty allCoUnits.`);
                return undefined;
            }

            if ((movePath.length !== 1) || (this.getLoaderUnitId() != null)) {
                return false;
            }

            const cost = this.getLoadCoCost();
            if ((!player.getCoId())                 ||
                (allCoUnits.length >= maxLoadCount) ||
                (player.getCoIsDestroyedInTurn())   ||
                (cost == null)                      ||
                (cost > fund)
            ) {
                return false;
            } else {
                const tile = tileMap.getTile(movePath[0]);
                if (!tile) {
                    Logger.error(`BwUnit.checkCanLoadCoAfterMovePath() tile is empty.`);
                    return false;
                }

                if (tile.getPlayerIndex() !== playerIndex) {
                    return false;
                } else {
                    const category = tile.getLoadCoUnitCategory();
                    return category == null
                        ? false
                        : ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category);
                }
            }
        }

        public checkCanUseCoSkill(skillType: Types.CoSkillType): boolean | undefined {
            const player = this.getPlayer();
            if ((!player)                               ||
                (!this.getHasLoadedCo())                ||
                (player.checkCoIsUsingActiveSkill())    ||
                (!player.getCoSkills(skillType))
            ) {
                return false;
            }

            const energy = player.getCoCurrentEnergy();
            if (energy == null) {
                Logger.error(`BwUnit.checkCanUseCoSkill() empty energy.`);
                return undefined;
            }

            if (skillType === Types.CoSkillType.Power) {
                const powerEnergy = player.getCoPowerEnergy();
                return (powerEnergy != null) && (energy >= powerEnergy);

            } else if (skillType === Types.CoSkillType.SuperPower) {
                const superPowerEnergy = player.getCoSuperPowerEnergy();
                return (superPowerEnergy != null) && (energy >= superPowerEnergy);

            } else {
                return false;
            }
        }

        public getLoadCoCost(): number | null {
            const coId = this.getWar().getPlayer(this.getPlayerIndex()).getCoId();
            return coId == null
                ? null
                : Math.floor(Utility.ConfigManager.getCoBasicCfg(this.getConfigVersion(), coId).boardCostPercentage * this.getProductionBaseCost() / 100);
        }
    }
}
