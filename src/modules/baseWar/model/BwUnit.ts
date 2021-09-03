
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Logger               from "../../tools/helpers/Logger";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
import TwnsBwUnitView       from "../view/BwUnitView";
import TwnsBwPlayer         from "./BwPlayer";
import TwnsBwTile           from "./BwTile";
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
    import Config               = ProtoTypes.Config;
    import ClientErrorCode      = TwnsClientErrorCode.ClientErrorCode;
    import BwWar                = TwnsBwWar.BwWar;
    import BwTile               = TwnsBwTile.BwTile;
    import BwUnitView           = TwnsBwUnitView.BwUnitView;

    export class BwUnit {
        private _templateCfg?               : UnitTemplateCfg;
        private _playerIndex?               : number;
        private _gridX?                     : number;
        private _gridY?                     : number;
        private _unitId?                    : number;

        private _actionState?               : UnitActionState;
        private _currentHp?                 : number;
        private _currentFuel?               : number;
        private _currentPromotion?          : number;
        private _currentBuildMaterial?      : number | null;
        private _currentProduceMaterial?    : number | null;
        private _flareCurrentAmmo?          : number | null;
        private _isBuildingTile?            : boolean;
        private _isCapturingTile?           : boolean;
        private _isDiving?                  : boolean;
        private _hasLoadedCo?               : boolean;
        private _loaderUnitId?              : number | null;
        private _primaryWeaponCurrentAmmo?  : number | null;

        private readonly _view              = new BwUnitView();
        private _war?                       : BwWar;

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

        private _setWar(war: BwWar | undefined): void {
            this._war = war;
        }
        public getWar(): BwWar {
            return Helpers.getDefined(this._war);
        }

        private _setTemplateCfg(cfg: UnitTemplateCfg): void {
            this._templateCfg = cfg;
        }
        private _getTemplateCfg(): UnitTemplateCfg {
            return Helpers.getDefined(this._templateCfg);
        }

        public getConfigVersion(): string {
            return this._getTemplateCfg().version;
        }
        public getUnitType(): UnitType {
            return Helpers.getExisted(this._getTemplateCfg().type);
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
            return this.getWar().getPlayer(this.getPlayerIndex());
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
            return Helpers.getDefined(this._unitId);
        }
        public setUnitId(id: number): void {
            this._unitId = id;
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
        public getActionState(): UnitActionState | undefined {
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
            return Helpers.getDefined(this._playerIndex);
        }

        public getTeamIndex(): number {
            return this.getPlayer().getTeamIndex();
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
            return Helpers.getDefined(this._currentHp);
        }
        public setCurrentHp(hp: number): void {
            const maxHp = this.getMaxHp();
            if (((maxHp == null) && (hp != null))               ||
                ((maxHp != null) && ((hp < 0) || (hp > maxHp)))
            ) {
                Logger.error(`BwUnit.setCurrentHp() invalid hp: ${hp}, maxHp: ${maxHp}`);
            }
            this._currentHp = hp;
        }

        public checkIsFullHp(): boolean {
            const currentHp = this.getCurrentHp();
            return (currentHp != null) && (currentHp == this.getMaxHp());
        }

        public getArmorType(): ArmorType | undefined {
            return this._getTemplateCfg()?.armorType;
        }

        public checkIsArmorAffectByLuck(): boolean {
            return this._getTemplateCfg()?.isAffectedByLuck === 1;
        }

        public updateByRepairData(data: ProtoTypes.Structure.IDataForModifyUnit): void {
            if (data.deltaHp) {
                const hp = this.getCurrentHp();
                if (hp == null) {
                    Logger.error(`BwUnit.updateByRepairData() invalid currentHp: ${hp}`);
                } else {
                    this.setCurrentHp(hp + data.deltaHp);
                }
            }
            if (data.deltaFuel) {
                const fuel = this.getCurrentFuel();
                if (fuel == null) {
                    Logger.error(`BwUnit.updateByRepairData() invalid currentFuel: ${fuel}`);
                } else {
                    this.setCurrentFuel(fuel + data.deltaFuel);
                }
            }
            if (data.deltaPrimaryWeaponAmmo) {
                const ammo = this.getPrimaryWeaponCurrentAmmo();
                if (ammo == null) {
                    Logger.error(`BwUnit.updateByRepairData() invalid primary current ammo: ${ammo}`);
                } else {
                    this.setPrimaryWeaponCurrentAmmo(ammo + data.deltaPrimaryWeaponAmmo);
                }
            }
            if (data.deltaFlareAmmo) {
                const ammo = this.getFlareCurrentAmmo();
                if (ammo == null) {
                    Logger.error(`BwUnit.updateByRepairData() invalid flare ammo: ${ammo}`);
                } else {
                    this.setFlareCurrentAmmo(ammo + data.deltaFlareAmmo);
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for weapon.
        ////////////////////////////////////////////////////////////////////////////////
        public checkHasWeapon(): boolean {
            return this.checkHasPrimaryWeapon() || this.checkHasSecondaryWeapon();
        }

        public checkHasPrimaryWeapon(): boolean {
            return this.getPrimaryWeaponMaxAmmo() != null;
        }

        public getPrimaryWeaponMaxAmmo(): number | null {
            return this._getTemplateCfg().primaryWeaponMaxAmmo ?? null;
        }

        public getPrimaryWeaponCurrentAmmo(): number | null {
            return Helpers.getDefined(this._primaryWeaponCurrentAmmo);
        }
        public setPrimaryWeaponCurrentAmmo(ammo: number | undefined | null): void {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            if (((maxAmmo == null) && (ammo != null))                                   ||
                ((maxAmmo != null) && ((ammo == null) || (ammo < 0) || (ammo > maxAmmo)))
            ){
                Logger.error(`BwUnit.setPrimaryWeaponCurrentAmmo() error, maxAmmo: ${maxAmmo}, ammo: ${ammo}`);
            }

            this._primaryWeaponCurrentAmmo = ammo == null ? undefined : ammo;
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
            const maxAmmo       = this.getPrimaryWeaponMaxAmmo();
            const currentAmmo   = this.getPrimaryWeaponCurrentAmmo();
            return (maxAmmo != null)
                && (currentAmmo != null)
                && (currentAmmo <= maxAmmo * 0.4);
        }

        public getPrimaryWeaponBaseDamage(armorType: ArmorType): number | undefined | null {
            return this.getPrimaryWeaponCurrentAmmo()
                ? this.getCfgBaseDamage(armorType, Types.WeaponType.Primary)
                : undefined;
        }

        public getAttackModifierByCo(selfGridIndex: GridIndex): number | undefined {
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwUnit.getAttackModifierByCo() no player.`);
                return undefined;
            }

            if (player.getCoId() === CommonConstants.CoEmptyId) {
                return 0;
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

            const tileMap = this.getWar()?.getTileMap();
            if (tileMap == null) {
                Logger.error(`BwUnit.getAttackModifierByCo() empty tileMap.`);
                return undefined;
            }

            const selfTileType = tileMap.getTile(selfGridIndex)?.getType();
            if (selfTileType == null) {
                Logger.error(`BwUnit.getAttackModifierByCo() empty selfTileType.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwUnit.getAttackModifierByCo() empty playerIndex.`);
                return undefined;
            }

            const promotion                 = this.getCurrentPromotion();
            const hasLoadedCo               = this.getHasLoadedCo();
            const tileCountDict             = new Map<Types.TileCategory, number>();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let modifier                    = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
                if (!skillCfg) {
                    Logger.error(`BwUnit.getAttackModifierByCo() failed getCoSkillCfg()! configVersion: ${configVersion}, skillId: ${skillId}`);
                    return undefined;
                }

                {
                    const cfg = skillCfg.selfOffenseBonus;
                    if ((cfg)                                                                           &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))      &&
                        (ConfigManager.checkIsTileTypeInCategory(configVersion, selfTileType, cfg[2]))  &&
                        ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex               : selfGridIndex,
                            coSkillAreaType         : cfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius,
                        })))
                    ) {
                        modifier += cfg[3];
                    }
                }

                {
                    const cfg = skillCfg.attackBonusByPromotion;
                    if ((cfg)                                                                                                                     &&
                        (cfg[2] === promotion)                                                                                                    &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                                &&
                        ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex               : selfGridIndex,
                            coSkillAreaType         : cfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius,
                        })))
                    ) {
                        modifier += cfg[3];
                    }
                }

                {
                    const cfg = skillCfg.selfOffenseBonusByFund;
                    if ((cfg)                                                                                                                             &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                                        &&
                        ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex               : selfGridIndex,
                            coSkillAreaType         : cfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius,
                        })))
                    ) {
                        modifier += cfg[2] * fund / 10000;
                    }
                }

                {
                    const cfg = skillCfg.selfOffenseBonusByTileCount;
                    if ((cfg)                                                                                                                           &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                                      &&
                        ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex               : selfGridIndex,
                            coSkillAreaType         : cfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius,
                        })))
                    ) {
                        const tileCategory      : Types.TileCategory = cfg[2];
                        const modifierPerTile   = cfg[3];
                        const currentTileCount  = tileCountDict.get(tileCategory);
                        if (currentTileCount != null) {
                            modifier += modifierPerTile * currentTileCount;
                        } else {
                            let tileCount = 0;
                            for (const tile of tileMap.getAllTiles()) {
                                if (tile.getPlayerIndex() !== playerIndex) {
                                    continue;
                                }

                                const tileType = tile.getType();
                                if (tileType == null) {
                                    Logger.error(`BwUnit.getAttackModifierByCo() empty tileType.`);
                                    return undefined;
                                }

                                if (ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, tileCategory)) {
                                    ++tileCount;
                                }
                            }

                            tileCountDict.set(tileCategory, tileCount);
                            modifier += modifierPerTile * tileCount;
                        }
                    }
                }
            }

            return modifier;
        }
        public getDefenseModifierByCo(selfGridIndex: GridIndex): number | undefined {
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

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit.getDefenseModifierByCo() empty coZoneRadius.`);
                return undefined;
            }

            const selfTileType = this.getWar()?.getTileMap().getTile(selfGridIndex)?.getType();
            if (selfTileType == null) {
                Logger.error(`BwUnit.getDefenseModifierByCo() empty selfTileType.`);
                return undefined;
            }

            const promotion                 = this.getCurrentPromotion();
            const hasLoadedCo               = this.getHasLoadedCo();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let modifier = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
                if (!skillCfg) {
                    Logger.error(`BwUnit.getDefenseModifierByCo() failed getCoSkillCfg()! configVersion: ${configVersion}, skillId: ${skillId}`);
                    return undefined;
                }

                {
                    const cfg = skillCfg.selfDefenseBonus;
                    if ((cfg)                                                                           &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))      &&
                        (ConfigManager.checkIsTileTypeInCategory(configVersion, selfTileType, cfg[2]))  &&
                        ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex               : selfGridIndex,
                            coSkillAreaType         : cfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius
                        })))
                    ) {
                        modifier += cfg[3];
                    }
                }

                {
                    const cfg = skillCfg.defenseBonusByPromotion;
                    if ((cfg)                                                                       &&
                        (cfg[2] === promotion)                                                      &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))  &&
                        ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex               : selfGridIndex,
                            coSkillAreaType         : cfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius,
                        })))
                    ) {
                        modifier += cfg[3];
                    }
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

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit.getLuckLimitModifierByCo() empty coZoneRadius.`);
                return undefined;
            }

            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            const hasLoadedCo               = this.getHasLoadedCo();
            let lowerModifier               = 0;
            let upperModifier               = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
                if (!skillCfg) {
                    Logger.error(`BwUnit.getLuckLimitModifierByCo() failed getCoSkillCfg()! configVersion: ${configVersion}, skillId: ${skillId}`);
                    return undefined;
                }

                const bonusCfg = skillCfg.selfLuckRangeBonus;
                if ((bonusCfg)                                                                                                                        &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, bonusCfg[1]))                                                   &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex               : selfGridIndex,
                        coSkillAreaType         : bonusCfg[0],
                        getCoGridIndexArrayOnMap,
                        coZoneRadius,
                    })))
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
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit.checkHasSecondaryWeapon() configVersion is null.`);
                return false;
            }

            const unitType = this.getUnitType();
            if (unitType == null) {
                Logger.error(`BwUnit.checkHasSecondaryWeapon() unitType is null.`);
                return false;
            }

            return ConfigManager.checkHasSecondaryWeapon(configVersion, unitType);
        }

        public getCfgSecondaryWeaponBaseDamage(armorType: ArmorType): number | undefined | null {
            return this.getCfgBaseDamage(armorType, Types.WeaponType.Secondary);
        }
        public getSecondaryWeaponBaseDamage(armorType: ArmorType): number | undefined | null {
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

        public getMinAttackRange(): number | undefined | null {
            return this._getTemplateCfg()?.minAttackRange;
        }
        public getCfgMaxAttackRange(): number | undefined | null {
            return this._getTemplateCfg()?.maxAttackRange;
        }
        public getFinalMaxAttackRange(): number | undefined {
            const cfgRange = this.getCfgMaxAttackRange();
            if (cfgRange == null) {
                return undefined;
            }

            const modifier = this._getMaxAttackRangeModifierByCo();
            if (modifier == null) {
                Logger.error(`BwUnit.getFinalMaxAttackRange() modifier is empty.`);
                return undefined;
            }

            return cfgRange + modifier;
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

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit._getMaxAttackRangeModifierByCo() empty coZoneRadius.`);
                return undefined;
            }

            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            const hasLoadedCo               = this.getHasLoadedCo();
            let modifier                    = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.maxAttackRangeBonus;
                if ((cfg)                                                                                                                       &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                                  &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex               : selfGridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                        coZoneRadius,
                    })))
                ) {
                    modifier += cfg[2];
                }
            }
            return modifier;
        }

        public checkCanAttackAfterMove(): boolean {
            return this._getTemplateCfg()?.canAttackAfterMove === 1;
        }
        public checkCanAttackDivingUnits(): boolean {
            return this._getTemplateCfg()?.canAttackDivingUnits === 1;
        }

        public checkCanAttackTargetAfterMovePath(movePath: GridIndex[], targetGridIndex: GridIndex): boolean | undefined {
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwUnit.checkCanAttackTargetAfterMovePath() empty war.`);
                return undefined;
            }

            const unitMap = war.getUnitMap();
            if (unitMap == null) {
                Logger.error(`BwUnit.checkCanAttackTargetAfterMovePath() empty unitMap.`);
                return undefined;
            }

            const pathLength    = movePath.length;
            const destination   = movePath[pathLength - 1];
            const primaryAmmo   = this.getPrimaryWeaponCurrentAmmo();
            if (((!this.checkCanAttackAfterMove()) && (pathLength > 1))     ||
                ((this.getLoaderUnitId() != null) && (pathLength <= 1))     ||
                ((!primaryAmmo) && (!this.checkHasSecondaryWeapon()))
            ) {
                return false;
            }

            const teamIndex = this.getTeamIndex();
            if (teamIndex == null) {
                Logger.error(`BwUnit.checkCanAttackTargetAfterMovePath() empty teamIndex.`);
                return undefined;
            }

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

            const maxAttackRange = this.getFinalMaxAttackRange();
            if (maxAttackRange == null) {
                return false;
            }

            const minAttackRange = this.getMinAttackRange();
            if (minAttackRange == null) {
                return false;
            }

            const distance = GridIndexHelpers.getDistance(destination, targetGridIndex);
            if ((distance > maxAttackRange) || (distance < minAttackRange)) {
                return false;
            }

            const targetUnit = unitMap.getVisibleUnitOnMap(targetGridIndex);
            if (targetUnit) {
                const armorType = targetUnit.getArmorType();
                if (armorType == null) {
                    Logger.error(`BwUnit.checkCanAttackTargetAfterMovePath() the targetUnit has no armorType! unit: ${JSON.stringify(targetUnit.serialize())}`);
                    return false;
                } else {
                    return (targetUnit.getTeamIndex() !== teamIndex)
                        && ((!targetUnit.getIsDiving()) || (this.checkCanAttackDivingUnits()))
                        && (this.getBaseDamage(armorType) != null);
                }
            } else {
                const tileMap = war.getTileMap();
                if (tileMap == null) {
                    Logger.error(`BwUnit.checkCanAttackTargetAfterMovePath() empty tileMap.`);
                    return undefined;
                }

                const targetTile = tileMap.getTile(targetGridIndex);
                if (targetTile == null) {
                    Logger.error(`BwUnit.checkCanAttackTargetAfterMovePath() empty targetTile.`);
                    return undefined;
                }

                const armorType = targetTile.getArmorType();
                if (armorType == null) {
                    return false;
                } else {
                    return this.getBaseDamage(armorType) != null;
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
            if ((!this.checkIsCapturer()) && (isCapturing)) {
                Logger.error("UnitModel.setIsCapturingTile() error, isCapturing: ", isCapturing);
            }
            this._isCapturingTile = isCapturing;
        }

        public checkIsCapturer(): boolean {
            return this._getTemplateCfg()?.canCaptureTile === 1;
        }
        public checkCanCaptureTile(tile: BwTile): boolean {
            return (this.checkIsCapturer())
                && (this.getTeamIndex() !== tile.getTeamIndex())
                && (tile.getMaxCapturePoint() != null);
        }

        public getCaptureAmount(selfGridIndex: GridIndex): number | null {
            const cfgAmount = this._getCfgCaptureAmount();
            if (cfgAmount == null) {
                return null;
            }

            const player = this.getPlayer();
            if (player.getCoId() === CommonConstants.CoEmptyId) {
                return cfgAmount;
            }

            const configVersion             = this.getConfigVersion();
            const unitType                  = this.getUnitType();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            const hasLoadedCo               = this.getHasLoadedCo();
            let modifier                    = 100;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId);
                if (skillCfg == null) {
                    throw new Error(`Empty skillCfg.`);
                }

                {
                    const cfg = skillCfg.selfCaptureAmount;
                    if ((cfg)                                                                       &&
                        (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))  &&
                        ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex               : selfGridIndex,
                            coSkillAreaType         : cfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius,
                        })))
                    ) {
                        modifier += cfg[2];
                    }
                }
            }

            return Math.floor(cfgAmount * modifier / 100);
        }
        private _getCfgCaptureAmount(): number | undefined {
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
        public checkCanDive(): boolean | undefined {
            const isDiver = this.checkIsDiver();
            if (isDiver == null) {
                Logger.error(`BwUnit.checkCanDive() empty isDiver.`);
                return undefined;
            }

            return (isDiver) && (!this.getIsDiving());
        }
        public checkCanSurface(): boolean | undefined {
            const isDiver = this.checkIsDiver();
            if (isDiver == null) {
                Logger.error(`BwUnit.checkCanSurface() empty isDiver.`);
                return undefined;
            }

            return (isDiver) && (!!this.getIsDiving());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for fuel.
        ////////////////////////////////////////////////////////////////////////////////
        public getCurrentFuel(): number {
            return Helpers.getDefined(this._currentFuel);
        }
        public setCurrentFuel(fuel: number): void {
            if ((fuel < 0) || (fuel > this.getMaxFuel())) {
                throw new Error(`Invalid fuel: ${fuel}`);
            }

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

            const hasLoadedCo               = this.getHasLoadedCo();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let modifier                    = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.selfFuelConsumption;
                if ((cfg)                                                                                                                       &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                                  &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex               : selfGridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                        coZoneRadius,
                    })))
                ) {
                    modifier += cfg[2];
                }
            }
            return modifier;
        }

        public checkIsDestroyedOnOutOfFuel(): boolean {
            return this._getTemplateCfg()?.isDestroyedOnOutOfFuel === 1;
        }

        public checkIsFuelInShort(): boolean {
            const currentFuel   = this.getCurrentFuel();
            const maxFuel       = this.getMaxFuel();
            return (currentFuel != null)
                && (maxFuel != null)
                && (currentFuel <= maxFuel * 0.4);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for flare.
        ////////////////////////////////////////////////////////////////////////////////
        public getFlareRadius(): number | null {
            return this._getTemplateCfg().flareRadius ?? null;
        }

        public getFlareMaxRange(): number | undefined | null {
            return this._getTemplateCfg()?.flareMaxRange;
        }

        public getFlareMaxAmmo(): number | undefined | null {
            return this._getTemplateCfg()?.flareMaxAmmo;
        }

        public getFlareCurrentAmmo(): number | null {
            return Helpers.getDefined(this._flareCurrentAmmo);
        }
        public setFlareCurrentAmmo(ammo: number | undefined | null): void {
            const maxAmmo = this.getFlareMaxAmmo();
            if (((maxAmmo == null) && (ammo != null))                                   ||
                ((maxAmmo != null) && ((ammo == null) || (ammo < 0) || (ammo > maxAmmo)))
            ) {
                Logger.error(ammo == null, `BwUnit.setFlareCurrentAmmo() error, maxAmmo: ${maxAmmo} ammo: ${ammo}`);
            }

            this._flareCurrentAmmo = ammo == null ? undefined : ammo;
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
            if (maxAmmo == null) {
                return false;
            } else {
                const currentAmmo = this.getFlareCurrentAmmo();
                if (currentAmmo == null) {
                    Logger.error(`BwUnit.checkIsFlareAmmoInShort() empty currentAmmo.`);
                    return false;
                }

                return currentAmmo <= maxAmmo * 0.4;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for grid position.
        ////////////////////////////////////////////////////////////////////////////////
        public getGridX(): number {
            return Helpers.getExisted(this._gridX);
        }
        public setGridX(x: number): void {
            this._gridX = x;
        }

        public getGridY(): number {
            return Helpers.getExisted(this._gridY);
        }
        public setGridY(y: number): void {
            this._gridY = y;
        }

        public getGridIndex(): GridIndex {
            return {
                x   : this.getGridX(),
                y   : this.getGridY(),
            };
        }
        public setGridIndex(gridIndex: GridIndex): void {
            this.setGridX(gridIndex.x);
            this.setGridY(gridIndex.y);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getProduceUnitType(): UnitType | undefined | null {
            return this._getTemplateCfg()?.produceUnitType;
        }

        public getProduceUnitCost(): number {
            const produceUnitType = this.getProduceUnitType();
            if (produceUnitType == null) {
                throw new Error(`Empty produceUnitType.`);
            }

            const cfgCost   = ConfigManager.getUnitTemplateCfg(this.getConfigVersion(), produceUnitType).productionCost;
            const modifier  = this.getPlayer().getUnitCostModifier(this.getGridIndex(), this.getHasLoadedCo(), produceUnitType);
            return Math.floor(cfgCost * modifier);
        }

        public getMaxProduceMaterial(): number | undefined | null {
            return this._getTemplateCfg()?.maxProduceMaterial;
        }

        public getCurrentProduceMaterial(): number | null {
            return Helpers.getDefined(this._currentProduceMaterial);
        }
        public setCurrentProduceMaterial(material: number | undefined | null): void {
            const maxMaterial = this.getMaxProduceMaterial();
            if (((maxMaterial == null) && (material != null))                                               ||
                ((maxMaterial != null) && ((material == null) || (material < 0) || (material > maxMaterial)))
            ) {
                Logger.error(`BwUnit.setCurrentProduceMaterial() error, maxMaterial: ${maxMaterial}, material: ${material}`);
            }

            this._currentProduceMaterial = material == null ? undefined : material;
        }

        public checkIsProduceMaterialInShort(): boolean {
            const maxMaterial = this.getMaxProduceMaterial();
            if (maxMaterial == null) {
                return false;
            } else {
                const currentMaterial = this.getCurrentProduceMaterial();
                if (currentMaterial == null) {
                    Logger.error(`BwUnit.checkIsProduceMaterialInShort() empty currentMaterial.`);
                    return false;
                }

                return currentMaterial / maxMaterial <= 0.4;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgMoveRange(): number | undefined {
            return this._getTemplateCfg()?.moveRange;
        }
        public getFinalMoveRange(): number | undefined {
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

            const tileType = this.getWar()?.getTileMap().getTile(selfGridIndex)?.getType();
            if (tileType == null) {
                Logger.error(`BwUnit._getMoveRangeModifierByCo() empty tileType.`);
                return undefined;
            }

            const hasLoadedCo               = this.getHasLoadedCo();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let modifier                    = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.selfMoveRangeBonus;
                if ((cfg)                                                                           &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))      &&
                    (ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, cfg[2]))      &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex               : selfGridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                        coZoneRadius,
                    })))
                ) {
                    modifier += cfg[3];
                }
            }
            return modifier;
        }

        public getMoveType(): MoveType | undefined {
            return this._getTemplateCfg()?.moveType;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce self.
        ////////////////////////////////////////////////////////////////////////////////
        public getProductionCfgCost(): number {
            return this._getTemplateCfg().productionCost;
        }
        public getProductionFinalCost(): number {
            return Math.floor(this.getProductionCfgCost() * this.getPlayer().getUnitCostModifier(this.getGridIndex(), this.getHasLoadedCo(), this.getUnitType()));
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for promotion.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxPromotion(): number {
            return ConfigManager.getUnitMaxPromotion(this.getConfigVersion());
        }

        public getCurrentPromotion(): number {
            return Helpers.getDefined(this._currentPromotion);
        }
        public setCurrentPromotion(promotion: number): void {
            const maxPromotion = this.getMaxPromotion();
            if ((maxPromotion == null) || (promotion < 0) || (promotion > maxPromotion)) {
                Logger.error(`BwUnit.setCurrentPromotion() invalid promotion: ${promotion}, maxPromotion: ${maxPromotion}`);
            }
            this._currentPromotion = promotion;
        }
        public addPromotion(): void {
            const currPromotion = this.getCurrentPromotion();
            const maxPromotion  = this.getMaxPromotion();
            if ((currPromotion == null) || (maxPromotion == null)) {
                Logger.error(`BwUnit.addPromotion() invalid promotion: ${currPromotion}, maxPromotion: ${maxPromotion}`);
            } else {
                this.setCurrentPromotion(Math.min(maxPromotion, currPromotion + 1));
            }
        }

        public getPromotionAttackBonus(): number | undefined {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit.getPromotionAttackBonus() configVersion is empty.`);
                return undefined;
            }

            const promotion = this.getCurrentPromotion();
            if (promotion == null) {
                Logger.error(`BwUnit.getPromotionAttackBonus() promotion is empty.`);
                return undefined;
            }

            return ConfigManager.getUnitPromotionAttackBonus(configVersion, promotion);
        }

        public getPromotionDefenseBonus(): number | undefined {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit.getPromotionDefenseBonus() configVersion is empty.`);
                return undefined;
            }

            const promotion = this.getCurrentPromotion();
            if (promotion == null) {
                Logger.error(`BwUnit.getPromotionDefenseBonus() promotion is empty.`);
                return undefined;
            }

            return ConfigManager.getUnitPromotionDefenseBonus(configVersion, promotion);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for launch silo.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanLaunchSiloOnTile(tile: BwTile): boolean {
            return (this._getTemplateCfg()?.canLaunchSilo === 1) && (tile.getType() === TileType.Silo);
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

        public getBuildAmount(): number | null {
            return this.checkIsTileBuilder() ? this.getNormalizedCurrentHp() : null;
        }

        public getMaxBuildMaterial(): number | undefined | null {
            return this._getTemplateCfg()?.maxBuildMaterial;
        }

        public getCurrentBuildMaterial(): number | null {
            return Helpers.getDefined(this._currentBuildMaterial);
        }
        public setCurrentBuildMaterial(material: number | undefined | null): void {
            const maxMaterial = this.getMaxBuildMaterial();
            if (((maxMaterial == null) && (material != null))                                               ||
                ((maxMaterial != null) && ((material == null) || (material < 0) || (material > maxMaterial)))
            ) {
                Logger.error(`BwUnit.setCurrentBuildMaterial() error, maxMaterial: ${maxMaterial}, material: ${material}`);
            }

            this._currentBuildMaterial = material == null ? undefined : material;
        }

        public checkIsBuildMaterialInShort(): boolean {
            const maxMaterial = this.getMaxBuildMaterial();
            if (maxMaterial == null) {
                return false;
            } else {
                const currentMaterial = this.getCurrentBuildMaterial();
                if (currentMaterial == null) {
                    Logger.error(`BwUnit.checkIsBuildMaterialInShort() empty currentMaterial.`);
                    return false;
                }

                return currentMaterial / maxMaterial <= 0.4;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for load unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxLoadUnitsCount(): number | undefined | null {
            return this._getTemplateCfg()?.maxLoadUnitsCount;
        }
        public getLoadedUnitsCount(): number {
            return this.getLoadedUnits().length;
        }
        public getLoadedUnits(): BwUnit[] {
            return this.getWar()?.getUnitMap()?.getUnitsLoadedByLoader(this, false) || [];
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

        public checkCanLoadUnit(unit: BwUnit): boolean | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwUnit.checkCanLoadUnit() cfg is empty.`);
                return false;
            }

            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit.checkCanLoadUnit() configVersion is empty.`);
                return false;
            }

            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwUnit.checkCanLoadUnit() war is empty.`);
                return false;
            }

            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwUnit.checkCanLoadUnit() gridIndex is empty.`);
                return false;
            }

            const tileMap = war.getTileMap();
            if (tileMap == null) {
                Logger.error(`BwUnit.checkCanLoadUnit() empty tileMap.`);
                return undefined;
            }

            const tile = tileMap.getTile(gridIndex);
            if (tile == null) {
                Logger.error(`BwUnit.checkCanLoadUnit() tile is empty.`);
                return false;
            }

            const tileType = tile.getType();
            if (tileType == null) {
                Logger.error(`BwUnit.checkCanLoadUnit() tileType is empty.`);
                return false;
            }

            const unitType = unit.getUnitType();
            if (unitType == null) {
                Logger.error(`BwUnit.checkCanLoadUnit() unitType is empty.`);
                return false;
            }

            const maxLoadUnitsCount     = this.getMaxLoadUnitsCount();
            const loadableTileCategory  = cfg.loadableTileCategory;
            const loadUnitCategory      = cfg.loadUnitCategory;
            return (maxLoadUnitsCount != null)
                && (loadableTileCategory != null)
                && (loadUnitCategory != null)
                && (ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, loadableTileCategory))
                && (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, loadUnitCategory))
                && (this.getPlayerIndex() === unit.getPlayerIndex())
                && (this.getLoadedUnitsCount() < maxLoadUnitsCount);
        }
        public checkCanDropLoadedUnit(tileType: TileType): boolean {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwUnit.checkCanDropLoadedUnit() configVersion is empty.`);
                return false;
            }

            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwUnit.checkCanDropLoadedUnit() cfg is empty.`);
                return false;
            }

            const loadableTileCategory = cfg.loadableTileCategory;
            return (cfg.canDropLoadedUnits === 1)
                && (loadableTileCategory != null)
                && (ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, loadableTileCategory));
        }
        public checkCanLaunchLoadedUnit(): boolean {
            return this._getTemplateCfg()?.canLaunchLoadedUnits === 1;
        }
        public checkCanSupplyLoadedUnit(): boolean {
            return this._getTemplateCfg()?.canSupplyLoadedUnits === 1;
        }
        private _checkCanRepairLoadedUnit(unit: BwUnit): boolean {
            return (this.getNormalizedRepairHpForLoadedUnit() != null)
                && (unit.getLoaderUnitId() === this.getUnitId())
                && ((!unit.checkIsFullHp()) || (unit.checkCanBeSupplied()));
        }
        public getNormalizedRepairHpForLoadedUnit(): number | undefined | null {
            return this._getTemplateCfg()?.repairAmountForLoadedUnits;
        }

        public setLoaderUnitId(loaderUnitId: number | null | undefined): void {
            this._loaderUnitId = loaderUnitId == null ? undefined : loaderUnitId;
        }
        public getLoaderUnitId(): number | null {
            return Helpers.getDefined(this._loaderUnitId);
        }
        public getLoaderUnit(): BwUnit | null {
            const unitId = this.getLoaderUnitId();
            if (unitId == null) {
                return null;
            } else {
                const unitMap = this.getWar().getUnitMap();
                return (unitMap.getUnitLoadedById(unitId)) || (unitMap.getUnitOnMap(this.getGridIndex()));
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
            return this._getTemplateCfg()?.canSupplyAdjacentUnits === 1;
        }
        public checkCanSupplyAdjacentUnit(unit: BwUnit): boolean {
            const thisGridIndex = this.getGridIndex();
            if (thisGridIndex == null) {
                Logger.error(`BwUnit.checkCanSupplyAdjacentUnit() thisGridIndex is empty.`);
                return false;
            }

            const unitGridIndex = unit.getGridIndex();
            if (unitGridIndex == null) {
                Logger.error(`BwUnit.checkCanSupplyAdjacentUnit() unitGridIndex is empty.`);
                return false;
            }

            return (this.checkIsAdjacentUnitSupplier())
                && (this.getLoaderUnitId() == null)
                && (unit.getLoaderUnitId() == null)
                && (this.getPlayerIndex() === unit.getPlayerIndex())
                && (GridIndexHelpers.getDistance(thisGridIndex, unitGridIndex) === 1)
                && (unit.checkCanBeSupplied());
        }

        public checkCanBeSuppliedWithFuel(): boolean {
            const maxFuel = this.getMaxFuel();
            if (maxFuel == null) {
                Logger.error(`BwUnit.checkCanBeSuppliedWithFuel() empty maxFuel.`);
                return false;
            }

            const currentFuel = this.getCurrentFuel();
            if (currentFuel == null) {
                Logger.error(`BwUnit.checkCanBeSuppliedWithFuel() empty currentFuel.`);
                return false;
            }

            return currentFuel < maxFuel;
        }
        public checkCanBeSuppliedWithPrimaryWeaponAmmo(): boolean {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            if (maxAmmo == null) {
                return false;
            } else {
                const currentAmmo = this.getPrimaryWeaponCurrentAmmo();
                if (currentAmmo == null) {
                    Logger.error(`BwUnit.checkCanBeSuppliedWithPrimaryWeaponAmmo() empty currentAmmo.`);
                    return false;
                }

                return currentAmmo < maxAmmo;
            }
        }
        public checkCanBeSuppliedWithFlareAmmo(): boolean {
            const maxAmmo = this.getFlareMaxAmmo();
            if (maxAmmo == null) {
                return false;
            } else {
                const currentAmmo = this.getFlareCurrentAmmo();
                if (currentAmmo == null) {
                    Logger.error(`BwUnit.checkCanBeSuppliedWithFlareAmmo() empty currentAmmo.`);
                    return false;
                }

                return currentAmmo < maxAmmo;
            }
        }
        public checkCanBeSupplied(): boolean {
            return (this.checkCanBeSuppliedWithFuel())
                || (this.checkCanBeSuppliedWithPrimaryWeaponAmmo())
                || (this.checkCanBeSuppliedWithFlareAmmo());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for vision.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgVisionRange(): number | undefined {
            return this._getTemplateCfg()?.visionRange;
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
        public getVisionRangeForTeamIndexes(teamIndexes: Set<number>, gridIndex: GridIndex): number | undefined | null {
            const playerIndexes = this.getWar()?.getPlayerManager().getPlayerIndexesInTeams(teamIndexes);
            if (playerIndexes == null) {
                Logger.error(`BwUnit.getVisionRangeForTeamIndexes() empty playerIndexes.`);
                return undefined;
            }

            let vision: number | null = null;
            for (const playerIndex of playerIndexes) {
                const v = this.getVisionRangeForPlayer(playerIndex, gridIndex);
                if (v != null) {
                    if ((vision == null) || (v > vision)) {
                        vision = v;
                    }
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

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit.getVisionRangeForPlayer() empty coZoneRadius.`);
                return undefined;
            }

            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            const hasLoadedCo               = this.getHasLoadedCo();
            let modifier                    = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.unitVisionRangeBonus;
                if ((cfg)                                                                                                                   &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                              &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        coZoneRadius,
                        gridIndex               : selfGridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                    })))
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

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwUnit.checkIsTrueVision() empty coZoneRadius.`);
                return false;
            }

            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            const hasLoadedCo               = this.getHasLoadedCo();
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.unitTrueVision;
                if ((cfg)                                                                                                                   &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))                                              &&
                    ((hasLoadedCo) || (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coZoneRadius,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                    })))
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
            const hp1 = unit.getNormalizedCurrentHp();
            if (hp1 == null) {
                Logger.error(`BwUnit.checkCanJoinUnit() empty hp1.`);
                return false;
            }

            const hp2 = unit.getNormalizedMaxHp();
            if (hp2 == null) {
                Logger.error(`BwUnit.checkCanJoinUnit() empty hp2.`);
                return false;
            }

            return (this !== unit)
                && (this.getUnitType() === unit.getUnitType())
                && (this.getPlayerIndex() === unit.getPlayerIndex())
                && (hp1 < hp2)
                && (this.getLoadedUnitsCount() === 0)
                && (unit.getLoadedUnitsCount() === 0);
        }

        public getJoinIncome(unit: BwUnit): number {
            if (!this.checkCanJoinUnit(unit)) {
                throw new Error(`Can not join.`);
            }

            const maxHp         = this.getNormalizedMaxHp();
            const normalizedHp1 = this.getNormalizedCurrentHp();
            const normalizedHp2 = unit.getNormalizedCurrentHp();
            const cost          = this.getProductionFinalCost();
            const joinedHp      = normalizedHp1 + normalizedHp2;
            return joinedHp <= maxHp
                ? 0
                : Math.floor((joinedHp - maxHp) * cost / 10);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for co.
        ////////////////////////////////////////////////////////////////////////////////
        public setHasLoadedCo(isCoOnBoard: boolean): void {
            this._hasLoadedCo = isCoOnBoard;
        }
        public getHasLoadedCo(): boolean {
            return Helpers.getDefined(this._hasLoadedCo);
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

        public getLoadCoCost(): number {
            return Math.floor(ConfigManager.getCoBasicCfg(this.getConfigVersion(), this.getPlayer().getCoId()).boardCostPercentage * this.getProductionCfgCost() / 100);
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
