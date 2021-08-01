
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
import Logger               from "../../tools/helpers/Logger";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsBwUnitView       from "../view/BwUnitView";
import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
import TwnsBwPlayer         from "./BwPlayer";
import TwnsBwTile           from "./BwTile";
import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
import TwnsBwWar            from "./BwWar";

namespace TwnsBwUnit {
    import UnitActionState      = Types.UnitActionState;
    import ArmorType            = Types.ArmorType;
    import TileType             = Types.TileType;
    import TileObjectType       = Types.TileObjectType;
    import TileBaseType         = Types.TileBaseType;
    import UnitType             = Types.UnitType;
    import MoveType             = Types.MoveType;
    import GridIndex            = Types.GridIndex;
    import UnitTemplateCfg      = Types.UnitTemplateCfg;
    import ISerialUnit          = ProtoTypes.WarSerialization.ISerialUnit;
    import IWarUnitRepairData   = ProtoTypes.Structure.IDataForModifyUnit;
    import Config               = ProtoTypes.Config;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import BwWar                = TwnsBwWar.BwWar;
    import BwTile               = TwnsBwTile.BwTile;
    import BwUnitView           = TwnsBwUnitView.BwUnitView;

    export class BwUnit {
        private _templateCfg                : UnitTemplateCfg;
        private _playerIndex                : number;
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

        private _war                        : BwWar;
        private readonly _view              = new BwUnitView();

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers and serializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public init(unitData: ISerialUnit, configVersion: string): ClientErrorCode {
            const validationError = WarCommonHelpers.getErrorCodeForUnitDataIgnoringUnitId({
                unitData,
                configVersion,
                mapSize                 : undefined,
                playersCountUnneutral   : undefined,
            });
            if (validationError) {
                return validationError;
            }

            const playerIndex = unitData.playerIndex;
            if (playerIndex == null) {
                return ClientErrorCode.BwUnitInit00;
            }

            const unitType = unitData.unitType as UnitType;
            if (unitType == null) {
                return ClientErrorCode.BwUnitInit01;
            }

            const unitId = unitData.unitId;
            if (unitId == null) {
                return ClientErrorCode.BwUnitInit02;
            }

            const gridIndex = GridIndexHelpers.convertGridIndex(unitData.gridIndex);
            if (gridIndex == null) {
                return ClientErrorCode.BwUnitInit03;
            }

            const unitTemplateCfg = ConfigManager.getUnitTemplateCfg(configVersion, unitType);
            if (!unitTemplateCfg) {
                return ClientErrorCode.BwUnitInit04;
            }

            if (!ConfigManager.getDamageChartCfgs(configVersion, unitType)) {
                return ClientErrorCode.BwUnitInit05;
            }

            this.setGridIndex(gridIndex);
            this.setUnitId(unitId);
            this._setTemplateCfg(unitTemplateCfg);
            this._setPlayerIndex(playerIndex);

            this._setWar(undefined);
            this.setLoaderUnitId(unitData.loaderUnitId);
            this.setHasLoadedCo(getRevisedHasLoadedCo(unitData.hasLoadedCo));
            this.setIsCapturingTile(getRevisedIsCapturingTile(unitData.isCapturingTile));
            this.setCurrentPromotion(getRevisedCurrentPromotion(unitData.currentPromotion));
            this.setIsBuildingTile(getRevisedIsBuildingTile(unitData.isBuildingTile));
            this.setActionState(getRevisedActionState(unitData.actionState));
            this.setIsDiving(getRevisedIsDiving(unitData.isDiving, unitTemplateCfg));
            this.setCurrentHp(getRevisedCurrentHp(unitData.currentHp, unitTemplateCfg));
            this.setPrimaryWeaponCurrentAmmo(getRevisedPrimaryAmmo(unitData.primaryWeaponCurrentAmmo, unitTemplateCfg));
            this.setCurrentFuel(getRevisedCurrentFuel(unitData.currentFuel, unitTemplateCfg));
            this.setFlareCurrentAmmo(getRevisedFlareAmmo(unitData.flareCurrentAmmo, unitTemplateCfg));
            this.setCurrentProduceMaterial(getRevisedProduceMaterial(unitData.currentProduceMaterial, unitTemplateCfg));
            this.setCurrentBuildMaterial(getRevisedBuildMaterial(unitData.currentBuildMaterial, unitTemplateCfg));

            this.getView().init(this);

            return ClientErrorCode.NoError;
        }

        public startRunning(war: BwWar): void {
            if (war.getConfigVersion() !== this.getConfigVersion()) {
                Logger.error(`BwUnit.startRunning() invalid configVersion.`);
                return;
            }

            this._setWar(war);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            // nothing to do.
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

            const unitType = this.getUnitType();
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
        public serializeForCreateSfw(): ISerialUnit | undefined {
            return this.serialize();
        }
        public serializeForCreateMfr(): ISerialUnit | undefined {
            return this.serializeForCreateSfw();
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        public getWar(): BwWar | undefined {
            return this._war;
        }

        private _setTemplateCfg(cfg: UnitTemplateCfg): void {
            this._templateCfg = cfg;
        }
        private _getTemplateCfg(): UnitTemplateCfg | undefined {
            return this._templateCfg;
        }

        public getConfigVersion(): string | null | undefined {
            const cfg = this._getTemplateCfg();
            return cfg ? cfg.version : undefined;
        }
        public getUnitType(): UnitType {
            const cfg = this._getTemplateCfg();
            return cfg ? cfg.type : undefined;
        }
        private _getDamageChartCfg(): { [armorType: number]: { [weaponType: number]: Types.DamageChartCfg } } | undefined {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit._getDamageChartCfg() empty configVersion.`);
                return undefined;
            }

            const unitType = this.getUnitType();
            if (unitType == null) {
                Logger.error(`BwUnit._getDamageChartCfg() empty unitType.`);
                return undefined;
            }

            return ConfigManager.getDamageChartCfgs(configVersion, unitType);
        }
        private _getBuildableTileCfg(): { [srcBaseType: number]: { [srcObjectType: number]: Types.BuildableTileCfg } } | undefined {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit._getBuildableTileCfg() empty configVersion.`);
                return undefined;
            }

            const unitType = this.getUnitType();
            if (unitType == null) {
                Logger.error(`BwUnit._getBuildableTileCfg() empty unitType.`);
                return undefined;
            }

            return ConfigManager.getBuildableTileCfgs(configVersion, unitType);
        }
        private _getVisionBonusCfg(): { [tileType: number]: Types.VisionBonusCfg } | undefined {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit._getVisionBonusCfg() empty configVersion.`);
                return undefined;
            }

            const unitType = this.getUnitType();
            if (unitType == null) {
                Logger.error(`BwUnit._getVisionBonusCfg() empty unitType.`);
                return undefined;
            }

            return ConfigManager.getVisionBonusCfg(configVersion, unitType);
        }

        public getPlayer(): TwnsBwPlayer.BwPlayer {
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwUnit.getPlayer() empty war.`);
                return undefined;
            }
            return war.getPlayer(this.getPlayerIndex());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
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
        public setUnitId(id: number): void {
            this._unitId = id;
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
            return this._getTemplateCfg().maxHp;
        }
        public getNormalizedMaxHp(): number {
            return WarCommonHelpers.getNormalizedHp(this.getMaxHp());
        }

        public getNormalizedCurrentHp(): number {
            return WarCommonHelpers.getNormalizedHp(this.getCurrentHp());
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
            return this._getTemplateCfg().armorType;
        }

        public checkIsArmorAffectByLuck(): boolean {
            return this._getTemplateCfg().isAffectedByLuck === 1;
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
            return this._getTemplateCfg().primaryWeaponMaxAmmo != null;
        }

        public getPrimaryWeaponMaxAmmo(): number | undefined {
            return this._getTemplateCfg().primaryWeaponMaxAmmo;
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
                : this._getDamageChartCfg()[armorType][Types.WeaponType.Primary].damage;
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

            const unitType = this.getUnitType();
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

            const fund = player.getFund();
            if (fund == null) {
                Logger.error(`BwUnit.getAttackModifierByCo() empty fund.`);
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

                {
                    const attackBonusCfg = skillCfg.attackBonus;
                    if ((attackBonusCfg)                                                                                                                        &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, attackBonusCfg[1]))                                                   &&
                        ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, attackBonusCfg[0], coGridIndexListOnMap, coZoneRadius)))
                    ) {
                        modifier += attackBonusCfg[2];
                    }
                }

                {
                    const attackBonusByPromotionCfg = skillCfg.attackBonusByPromotion;
                    if ((attackBonusByPromotionCfg)                                                                                                                     &&
                        (attackBonusByPromotionCfg[2] === promotion)                                                                                                    &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, attackBonusByPromotionCfg[1]))                                                &&
                        ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, attackBonusByPromotionCfg[0], coGridIndexListOnMap, coZoneRadius)))
                    ) {
                        modifier += attackBonusByPromotionCfg[3];
                    }
                }

                {
                    const offenseBonusByFundCfg = skillCfg.selfOffenseBonusByFund;
                    if ((offenseBonusByFundCfg)                                                                                                                             &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, offenseBonusByFundCfg[1]))                                                        &&
                        ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, offenseBonusByFundCfg[0], coGridIndexListOnMap, coZoneRadius)))
                    ) {
                        modifier += offenseBonusByFundCfg[2] * fund / 10000;
                    }
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

            const unitType = this.getUnitType();
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
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, defenseBonusCfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += defenseBonusCfg[2];
                }

                const defenseBonusByPromotionCfg = skillCfg.defenseBonusByPromotion;
                if ((defenseBonusByPromotionCfg)                                                                                                                    &&
                    (defenseBonusByPromotionCfg[2] === promotion)                                                                                                   &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, defenseBonusByPromotionCfg[1]))                                               &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, defenseBonusByPromotionCfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += defenseBonusByPromotionCfg[3];
                }
            }
            return modifier;
        }

        public getLuckLimitModifierByCo(selfGridIndex: GridIndex): { lower: number, upper: number } | undefined {
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit.getLuckLimitModifierByCo() no player.`);
                return undefined;
            }

            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit.getLuckLimitModifierByCo() configVersion is empty.`);
                return undefined;
            }

            const unitType = this.getUnitType();
            if (unitType == null) {
                Logger.error(`BwUnit.getLuckLimitModifierByCo() unitType is empty.`);
                return undefined;
            }

            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                Logger.error(`BwUnit.getLuckLimitModifierByCo() empty coGridIndexListOnMap.`);
                return undefined;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit.getLuckLimitModifierByCo() empty coZoneRadius.`);
                return undefined;
            }

            const hasLoadedCo   = this.getHasLoadedCo();
            let lowerModifier   = 0;
            let upperModifier   = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
                if (!skillCfg) {
                    Logger.error(`BwUnit.getLuckLimitModifierByCo() failed getCoSkillCfg()! configVersion: ${configVersion}, skillId: ${skillId}`);
                    return undefined;
                }

                const bonusCfg = skillCfg.selfLuckRangeBonus;
                if ((bonusCfg)                                                                                                                        &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, bonusCfg[1]))                                                   &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, bonusCfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    lowerModifier += bonusCfg[2];
                    upperModifier += bonusCfg[3];
                }
            }

            return {
                lower   : lowerModifier,
                upper   : upperModifier,
            };
        }

        public checkHasSecondaryWeapon(): boolean {
            return ConfigManager.checkHasSecondaryWeapon(this.getConfigVersion(), this.getUnitType());
        }

        public getCfgSecondaryWeaponBaseDamage(armorType: ArmorType | null | undefined): number | undefined | null {
            return armorType == null
                ? undefined
                : this._getDamageChartCfg()[armorType][Types.WeaponType.Secondary].damage;
        }
        public getSecondaryWeaponBaseDamage(armorType: ArmorType | null | undefined): number | undefined | null {
            return this.checkHasSecondaryWeapon()
                ? this.getCfgSecondaryWeaponBaseDamage(armorType)
                : undefined;
        }

        public getCfgBaseDamage(targetArmorType: Types.ArmorType, weaponType: Types.WeaponType): number | null | undefined {
            const cfgs  = this._getDamageChartCfg();
            const cfg   = cfgs ? cfgs[targetArmorType] : undefined;
            return cfg ? cfg[weaponType].damage : undefined;
        }
        public getBaseDamage(armorType: ArmorType): number | undefined | null {
            const primaryDamage = this.getPrimaryWeaponBaseDamage(armorType);
            return primaryDamage != null ? primaryDamage : this.getSecondaryWeaponBaseDamage(armorType);
        }

        public getMinAttackRange(): number | undefined {
            return this._getTemplateCfg().minAttackRange;
        }
        public getCfgMaxAttackRange(): number | undefined {
            return this._getTemplateCfg().maxAttackRange;
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

            const unitType = this.getUnitType();
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
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).maxAttackRangeBonus;
                if ((cfg)                                                                                                                       &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                                  &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, cfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += cfg[2];
                }
            }
            return modifier;
        }

        public checkCanAttackAfterMove(): boolean {
            return this._getTemplateCfg().canAttackAfterMove === 1;
        }
        public checkCanAttackDivingUnits(): boolean {
            return this._getTemplateCfg().canAttackDivingUnits === 1;
        }

        public checkCanAttackTargetAfterMovePath(movePath: GridIndex[], targetGridIndex: GridIndex): boolean {
            const pathLength    = movePath.length;
            const destination   = movePath[pathLength - 1];
            const distance      = GridIndexHelpers.getDistance(destination, targetGridIndex);
            const primaryAmmo   = this.getPrimaryWeaponCurrentAmmo();
            const war           = this.getWar();
            const unitMap       = war.getUnitMap();
            if (((!this.checkCanAttackAfterMove()) && (pathLength > 1))                             ||
                ((this.getLoaderUnitId() != null) && (pathLength <= 1))                             ||
                ((!primaryAmmo) && (!this.checkHasSecondaryWeapon()))                               ||
                (!((distance <= this.getFinalMaxAttackRange()!) && (distance >= this.getMinAttackRange()!)))
            ) {
                return false;
            }

            const teamIndex         = this.getTeamIndex();
            const unitOnDestination = unitMap.getUnitOnMap(destination);
            if ((pathLength > 1) && (unitOnDestination)) {
                const unitType = unitOnDestination.getUnitType();
                if (unitType == null) {
                    Logger.error(`BwUnit.checkCanAttackTargetAfterMovePath() empty unitType.`);
                    return undefined;
                }

                const unitPlayerIndex = unitOnDestination.getPlayerIndex();
                if (unitPlayerIndex == null) {
                    Logger.error(`BwUnit.checkCanAttackTargetAfterMovePath() empty unitPlayerIndex.`);
                    return undefined;
                }

                const isDiving = unitOnDestination.getIsDiving();
                if (isDiving == null) {
                    Logger.error(`BwUnit.checkCanAttackTargetAfterMovePath() empty isDiving.`);
                    return undefined;
                }

                if (WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                    war,
                    observerTeamIndex   : teamIndex,
                    gridIndex           : destination,
                    unitType,
                    unitPlayerIndex,
                    isDiving,
                })) {
                    return false;
                }
            }

            const targetUnit = unitMap.getVisibleUnitOnMap(targetGridIndex);
            if (targetUnit) {
                const armorType = targetUnit.getArmorType();
                return (targetUnit.getTeamIndex() !== teamIndex)
                    && ((!targetUnit.getIsDiving()) || (this.checkCanAttackDivingUnits()))
                    && (this.getBaseDamage(armorType) != null);
            } else {
                const armorType = war.getTileMap().getTile(targetGridIndex).getArmorType();
                return (armorType != null) && (this.getBaseDamage(armorType) != null);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for capture.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsCapturingTile(): boolean {
            return this._isCapturingTile || false;
        }
        public setIsCapturingTile(isCapturing: boolean): void {
            if ((!this.checkIsCapturer()) && (isCapturing)) {
                Logger.error("UnitModel.setIsCapturingTile() error, isCapturing: ", isCapturing);
            }
            this._isCapturingTile = isCapturing;
        }

        public checkIsCapturer(): boolean {
            return this._getTemplateCfg().canCaptureTile === 1;
        }
        public checkCanCaptureTile(tile: BwTile): boolean {
            return (this.checkIsCapturer())
                && (this.getTeamIndex() !== tile.getTeamIndex())
                && (tile.getMaxCapturePoint() != null);
        }

        public getCaptureAmount(): number | undefined {
            return this.checkIsCapturer() ? this.getNormalizedCurrentHp() : undefined;
        }
        public getCfgCaptureAmount(): number | undefined {
            return this.checkIsCapturer() ? this.getNormalizedCurrentHp() : undefined;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for dive.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsDiving(): boolean {
            return this._isDiving || false;
        }
        public setIsDiving(isDiving: boolean): void {
            if ((!this.checkIsDiver()) && (isDiving)) {
                Logger.error("UnitModel.setIsDiving() error, isDiving: ", isDiving);
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
            return this._getTemplateCfg().maxFuel;
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
            const cfgValue = this._getCfgFuelConsumptionPerTurn();
            if (cfgValue == null) {
                Logger.error(`BwUnit.getFuelConsumptionPerTurn() empty cfgValue.`);
                return undefined;
            }

            const modifier = this._getFuelConsumptionModifierByCo();
            if (modifier == null) {
                Logger.error(`BwUnit.getFuelConsumptionPerTurn() empty modifier.`);
                return undefined;
            }

            return cfgValue + modifier;
        }
        private _getCfgFuelConsumptionPerTurn(): number | null | undefined {
            const templateCfg = this._getTemplateCfg();
            if (templateCfg == null) {
                Logger.error(`BwUnit._getCfgFuelConsumptionPerTurn() empty templateCfg.`);
                return undefined;
            }

            if (!this.getIsDiving()) {
                return templateCfg.fuelConsumptionPerTurn;
            } else {
                const cfg = templateCfg.diveCfgs;
                if (cfg == null) {
                    Logger.error(`BwUnit._getCfgFuelConsumptionPerTurn() empty cfg.`);
                    return undefined;
                }
                return cfg[0];
            }
        }
        private _getFuelConsumptionModifierByCo(): number | undefined {
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit._getFuelConsumptionModifierByCo() no player.`);
                return undefined;
            }

            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit._getFuelConsumptionModifierByCo() configVersion is empty.`);
                return undefined;
            }

            const unitType = this.getUnitType();
            if (unitType == null) {
                Logger.error(`BwUnit._getFuelConsumptionModifierByCo() unitType is empty.`);
                return undefined;
            }

            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                Logger.error(`BwUnit._getFuelConsumptionModifierByCo() empty coGridIndexListOnMap.`);
                return undefined;
            }

            const selfGridIndex = this.getGridIndex();
            if (selfGridIndex == null) {
                Logger.error(`BwUnit._getFuelConsumptionModifierByCo() empty selfGridIndex.`);
                return undefined;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit._getFuelConsumptionModifierByCo() empty coZoneRadius.`);
                return undefined;
            }

            const hasLoadedCo   = this.getHasLoadedCo();
            let modifier        = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.selfFuelConsumption;
                if ((cfg)                                                                                                                       &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                                  &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, cfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += cfg[2];
                }
            }
            return modifier;
        }

        public checkIsDestroyedOnOutOfFuel(): boolean {
            return this._getTemplateCfg().isDestroyedOnOutOfFuel === 1;
        }

        public checkIsFuelInShort(): boolean {
            return this.getCurrentFuel() <= this.getMaxFuel() * 0.4;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for flare.
        ////////////////////////////////////////////////////////////////////////////////
        public getFlareRadius(): number | undefined {
            return this._getTemplateCfg().flareRadius;
        }

        public getFlareMaxRange(): number | undefined {
            return this._getTemplateCfg().flareMaxRange;
        }

        public getFlareMaxAmmo(): number | undefined {
            return this._getTemplateCfg().flareMaxAmmo;
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
            return this._getTemplateCfg().produceUnitType;
        }

        public getProduceUnitCost(): number | undefined {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit.getProduceUnitCost() configVersion is empty.`);
                return undefined;
            }

            const produceUnitType = this.getProduceUnitType();
            if (produceUnitType == null) {
                Logger.error(`BwUnit.getProduceUnitCost() produceUnitType is empty.`);
                return undefined;
            }

            const cfgCost = ConfigManager.getUnitTemplateCfg(configVersion, produceUnitType)?.productionCost;
            if (cfgCost == null) {
                Logger.error(`BwUnit.getProduceUnitCost() empty cfgCost.`);
                return undefined;
            }

            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit.getProduceUnitCost() empty player.`);
                return undefined;
            }

            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwUnit.getProduceUnitCost() empty gridIndex.`);
                return undefined;
            }

            const hasLoadedCo = this.getHasLoadedCo();
            if (hasLoadedCo == null) {
                Logger.error(`BwUnit.getProduceUnitCost() empty hasLoadedCo.`);
                return undefined;
            }

            const modifier = player.getUnitCostModifier(gridIndex, hasLoadedCo, produceUnitType);
            if (modifier == null) {
                Logger.error(`BwUnit.getProduceUnitCost() empty modifier.`);
                return undefined;
            }

            return Math.floor(cfgCost * modifier);
        }

        public getMaxProduceMaterial(): number | undefined {
            return this._getTemplateCfg().maxProduceMaterial;
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
            return this._getTemplateCfg().moveRange;
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

            const modifierBySettings = war.getCommonSettingManager().getSettingsMoveRangeModifier(playerIndex);
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

            const unitType = this.getUnitType();
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
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).moveRangeBonus;
                if ((cfg)                                                                                                                       &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                                  &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, cfg[0], coGridIndexListOnMap, coZoneRadius)))
                ) {
                    modifier += cfg[2];
                }
            }
            return modifier;
        }

        public getMoveType(): MoveType {
            return this._getTemplateCfg().moveType;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce self.
        ////////////////////////////////////////////////////////////////////////////////
        public getProductionCfgCost(): number {
            return this._getTemplateCfg().productionCost;
        }
        public getProductionFinalCost(): number {
            const cfgCost = this.getProductionCfgCost();
            if (cfgCost == null) {
                Logger.error(`BwUnit.getProductionFinalCost() empty cfgCost.`);
                return undefined;
            }

            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit.getProductionFinalCost() empty player.`);
                return undefined;
            }

            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwUnit.getProductionFinalCost() empty gridIndex.`);
                return undefined;
            }

            const hasLoadedCo = this.getHasLoadedCo();
            if (hasLoadedCo == null) {
                Logger.error(`BwUnit.getProductionFinalCost() empty hasLoadedCo.`);
                return undefined;
            }

            const unitType = this.getUnitType();
            if (unitType == null) {
                Logger.error(`BwUnit.getProductionFinalCost() empty unitType.`);
                return undefined;
            }

            const modifier = player.getUnitCostModifier(gridIndex, hasLoadedCo, unitType);
            if (modifier == null) {
                Logger.error(`BwUnit.getProductionFinalCost() empty modifier.`);
                return undefined;
            }

            return Math.floor(cfgCost * modifier);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for promotion.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxPromotion(): number {
            return ConfigManager.getUnitMaxPromotion(this.getConfigVersion());
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
            return ConfigManager.getUnitPromotionAttackBonus(this.getConfigVersion(), this.getCurrentPromotion());
        }

        public getPromotionDefenseBonus(): number {
            return ConfigManager.getUnitPromotionDefenseBonus(this.getConfigVersion(), this.getCurrentPromotion());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for launch silo.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanLaunchSiloOnTile(tile: BwTile): boolean {
            return (this._getTemplateCfg().canLaunchSilo === 1) && (tile.getType() === TileType.Silo);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for build tile.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsBuildingTile(): boolean {
            return this._isBuildingTile || false;
        }
        public setIsBuildingTile(isBuilding: boolean): void {
            if ((!this.checkIsTileBuilder()) && (isBuilding)) {
                Logger.error("UnitModel.setIsBuildingTile() error, isBuilding: ", isBuilding);
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

        public getBuildTargetTileCfg(baseType: TileBaseType, objectType: TileObjectType): Config.IBuildableTileCfg | undefined {
            const buildableCfgs = this._getBuildableTileCfg();
            const cfgs          = buildableCfgs ? buildableCfgs[baseType] : undefined;
            return cfgs ? cfgs[objectType] : undefined;
        }

        public getBuildAmount(): number | undefined {
            return this.checkIsTileBuilder() ? this.getNormalizedCurrentHp() : undefined;
        }

        public getMaxBuildMaterial(): number | undefined {
            return this._getTemplateCfg().maxBuildMaterial;
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
            return this._getTemplateCfg().maxLoadUnitsCount;
        }
        public getLoadedUnitsCount(): number {
            return this.getLoadedUnits()!.length;
        }
        public getLoadedUnits(): BwUnit[] {
            return this.getWar().getUnitMap().getUnitsLoadedByLoader(this, false);
        }

        public getLoadUnitCategory(): Types.UnitCategory | undefined | null {
            const cfg = this._getTemplateCfg();
            return cfg ? cfg.loadUnitCategory : undefined;
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
            const cfg                   = this._getTemplateCfg();
            const loadUnitCategory      = cfg.loadUnitCategory;
            const loadableTileCategory  = cfg.loadableTileCategory;
            const maxLoadUnitsCount     = this.getMaxLoadUnitsCount();
            return (loadUnitCategory != null)
                && (loadableTileCategory != null)
                && (maxLoadUnitsCount != null)
                && (ConfigManager.checkIsTileTypeInCategory(this.getConfigVersion(), this.getWar().getTileMap().getTile(this.getGridIndex()).getType(), loadableTileCategory))
                && (ConfigManager.checkIsUnitTypeInCategory(this.getConfigVersion(), unit.getUnitType(), loadUnitCategory))
                && (this.getPlayerIndex() === unit.getPlayerIndex())
                && (this.getLoadedUnitsCount() < maxLoadUnitsCount);
        }
        public checkCanDropLoadedUnit(tileType: TileType): boolean {
            const cfg       = this._getTemplateCfg();
            const category  = cfg.loadableTileCategory;
            return (cfg.canDropLoadedUnits === 1)
                && (category != null)
                && (ConfigManager.checkIsTileTypeInCategory(this.getConfigVersion(), tileType, category));
        }
        public checkCanLaunchLoadedUnit(): boolean {
            return this._getTemplateCfg().canLaunchLoadedUnits === 1;
        }
        public checkCanSupplyLoadedUnit(): boolean {
            return this._getTemplateCfg().canSupplyLoadedUnits === 1;
        }
        private _checkCanRepairLoadedUnit(unit: BwUnit): boolean {
            return (this.getNormalizedRepairHpForLoadedUnit() != null)
                && (unit.getLoaderUnitId() === this.getUnitId())
                && ((!unit.checkIsFullHp()) || (unit.checkCanBeSupplied()));
        }
        public getNormalizedRepairHpForLoadedUnit(): number | undefined | null {
            return this._getTemplateCfg().repairAmountForLoadedUnits;
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
            return this._getTemplateCfg().canSupplyAdjacentUnits === 1;
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
        public getCfgVisionRange(): number {
            return this._getTemplateCfg().visionRange;
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

            const modifierBySettings = war.getCommonSettingManager().getSettingsVisionRangeModifier(playerIndex);
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

            const unitType = this.getUnitType();
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
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).unitVisionRangeBonus;
                if ((cfg)                                                                                                                   &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                              &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(selfGridIndex, cfg[0], coGridIndexListOnMap, coZoneRadius)))
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

            const unitType = this.getUnitType();
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
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId).unitTrueVision;
                if ((cfg)                                                                                                                   &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                              &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexListOnMap, coZoneRadius)))
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
                && (this.getUnitType() === unit.getUnitType())
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

            const unitType = this.getUnitType();
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
            if (maxLoadCount <= 0) {
                return false;
            }

            const allCoUnits = war.getUnitMap().getAllCoUnits(playerIndex);
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
                (this.getHasLoadedCo())             ||
                (cost == null)                      ||
                (cost > fund)
            ) {
                return false;
            } else {
                const tile = war.getTileMap().getTile(movePath[0]);
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
            if ((!player)                                   ||
                (!this.getHasLoadedCo())                    ||
                (player.checkCoIsUsingActiveSkill())        ||
                (!player.getCoSkills(skillType))            ||
                (player.getCoType() !== Types.CoType.Zoned)
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
                : Math.floor(ConfigManager.getCoBasicCfg(this.getConfigVersion(), coId).boardCostPercentage * this.getProductionCfgCost() / 100);
        }
    }

    function getRevisedHasLoadedCo(hasLoadedCo: boolean | null | undefined): boolean {
        return hasLoadedCo || false;
    }
    function getRevisedIsCapturingTile(isCapturingTile: boolean | null | undefined): boolean {
        return isCapturingTile || false;
    }
    function getRevisedCurrentPromotion(currentPromotion: number | null | undefined): number {
        return currentPromotion || 0;
    }
    function getRevisedIsBuildingTile(isBuildingTile: boolean | null | undefined): boolean {
        return isBuildingTile || false;
    }
    function getRevisedIsDiving(isDiving: boolean | null | undefined, unitTemplateCfg: UnitTemplateCfg): boolean {
        return isDiving != null
            ? isDiving
            : ConfigManager.checkIsUnitDivingByDefaultWithTemplateCfg(unitTemplateCfg);
    }
    function getRevisedActionState(actionState: UnitActionState | null | undefined): UnitActionState {
        return actionState != null
            ? actionState
            : UnitActionState.Idle;
    }
    function getRevisedCurrentHp(currentHp: number | null | undefined, unitTemplateCfg: UnitTemplateCfg): number {
        return currentHp != null
            ? currentHp
            : unitTemplateCfg.maxHp;
    }
    function getRevisedPrimaryAmmo(primaryAmmo: number | null | undefined, unitTemplateCfg: UnitTemplateCfg): number | null | undefined {
        return primaryAmmo != null
            ? primaryAmmo
            : unitTemplateCfg.primaryWeaponMaxAmmo;
    }
    function getRevisedCurrentFuel(currentFuel: number | null | undefined, unitTemplateCfg: UnitTemplateCfg): number {
        return currentFuel != null
            ? currentFuel
            : unitTemplateCfg.maxFuel;
    }
    function getRevisedFlareAmmo(flareAmmo: number | null | undefined, unitTemplateCfg: UnitTemplateCfg): number | null | undefined {
        return flareAmmo != null
            ? flareAmmo
            : unitTemplateCfg.flareMaxAmmo;
    }
    function getRevisedProduceMaterial(produceMaterial: number | null | undefined, unitTemplateCfg: UnitTemplateCfg): number | null | undefined {
        return produceMaterial != null
            ? produceMaterial
            : unitTemplateCfg.maxProduceMaterial;
    }
    function getRevisedBuildMaterial(buildMaterial: number | null | undefined, unitTemplateCfg: UnitTemplateCfg): number | null | undefined {
        return buildMaterial != null
            ? buildMaterial
            : unitTemplateCfg.maxBuildMaterial;
    }
}

export default TwnsBwUnit;
