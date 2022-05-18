
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
// import TwnsBwUnitView       from "../view/BwUnitView";
// import TwnsBwPlayer         from "./BwPlayer";
// import TwnsBwTile           from "./BwTile";
// import TwnsBwWar            from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import UnitActionState      = Types.UnitActionState;
    import TileType             = Types.TileType;
    import TileObjectType       = Types.TileObjectType;
    import TileBaseType         = Types.TileBaseType;
    import UnitAiMode           = Types.UnitAiMode;
    import GridIndex            = Types.GridIndex;
    import UnitTemplateCfg      = Types.UnitTemplateCfg;
    import ISerialUnit          = CommonProto.WarSerialization.ISerialUnit;
    import GameConfig           = Config.GameConfig;

    export class BwUnit {
        private _gameConfig?                : GameConfig;
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
        private _aiMode?                    : UnitAiMode | null;

        private readonly _view              = new BaseWar.BwUnitView();
        private _war?                       : BwWar;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers and serializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public init(unitData: ISerialUnit, gameConfig: GameConfig): void {
            const validationError = WarHelpers.WarCommonHelpers.getErrorCodeForUnitDataIgnoringUnitId({
                unitData,
                gameConfig,
                mapSize                 : null,
                playersCountUnneutral   : null,
            });
            if (validationError) {
                throw Helpers.newError(`ValidationError: ${validationError}`, validationError);
            }

            const playerIndex       = Helpers.getExisted(unitData.playerIndex, ClientErrorCode.BwUnit_Init_00);
            const unitType          = Helpers.getExisted(unitData.unitType, ClientErrorCode.BwUnit_Init_01);
            const unitId            = Helpers.getExisted(unitData.unitId, ClientErrorCode.BwUnit_Init_02);
            const gridIndex         = Helpers.getExisted(GridIndexHelpers.convertGridIndex(unitData.gridIndex), ClientErrorCode.BwUnit_Init_03);
            const unitTemplateCfg   = Helpers.getExisted(gameConfig.getUnitTemplateCfg(unitType), ClientErrorCode.BwUnit_Init_04);
            this.setGridIndex(gridIndex);
            this.setUnitId(unitId);
            this._setGameConfig(gameConfig);
            this._setTemplateCfg(unitTemplateCfg);
            this._setPlayerIndex(playerIndex);

            this.setLoaderUnitId(unitData.loaderUnitId ?? null);
            this.setHasLoadedCo(unitData.hasLoadedCo ?? false);
            this.setIsCapturingTile(unitData.isCapturingTile ?? false);
            this.setCurrentPromotion(unitData.currentPromotion ?? 0);
            this.setIsBuildingTile(unitData.isBuildingTile ?? false);
            this.setActionState(unitData.actionState ?? UnitActionState.Idle);
            this.setIsDiving(getRevisedIsDiving(unitData.isDiving, unitTemplateCfg));
            this.setCurrentHp(unitData.currentHp ?? unitTemplateCfg.maxHp);
            this.setPrimaryWeaponCurrentAmmo(unitData.primaryWeaponCurrentAmmo ?? (unitTemplateCfg.primaryWeaponMaxAmmo ?? null));
            this.setCurrentFuel(unitData.currentFuel ?? unitTemplateCfg.maxFuel);
            this.setFlareCurrentAmmo(unitData.flareCurrentAmmo ?? (unitTemplateCfg.flareMaxAmmo ?? null));
            this.setCurrentProduceMaterial(unitData.currentProduceMaterial ?? (unitTemplateCfg.maxProduceMaterial ?? null));
            this.setCurrentBuildMaterial(unitData.currentBuildMaterial ?? (unitTemplateCfg.maxBuildMaterial ?? null));
            this.setAiMode(unitData.aiMode ?? UnitAiMode.Normal);

            this.getView().init(this);
        }

        public startRunning(war: BwWar): void {
            if (war.getGameConfig() !== this.getGameConfig()) {
                throw Helpers.newError(`BwUnit.startRunning() invalid gameConfig.`);
            }

            this._setWar(war);
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }
        public stopRunning(): void {
            // nothing to do.
        }

        public serialize(): ISerialUnit {
            const data: ISerialUnit = {
                gridIndex   : this.getGridIndex(),
                playerIndex : this.getPlayerIndex(),
                unitType    : this.getUnitType(),
                unitId      : this.getUnitId(),
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

            const aiMode = this.getAiMode();
            (aiMode != UnitAiMode.Normal) && (data.aiMode = aiMode);

            return data;
        }
        public serializeForCreateSfw(): ISerialUnit {
            return this.serialize();
        }
        public serializeForCreateMfr(): ISerialUnit {
            return this.serializeForCreateSfw();
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        public getWar(): BwWar {
            return Helpers.getExisted(this._war);
        }

        public getGameConfig(): GameConfig {
            return Helpers.getExisted(this._gameConfig);
        }
        private _setGameConfig(config: GameConfig): void {
            this._gameConfig = config;
        }

        private _setTemplateCfg(cfg: UnitTemplateCfg): void {
            this._templateCfg = cfg;
        }
        public getTemplateCfg(): UnitTemplateCfg {
            return Helpers.getExisted(this._templateCfg);
        }

        public getUnitType(): number {
            return Helpers.getExisted(this.getTemplateCfg().type);
        }
        private _getDamageChartCfg(): { [armorType: number]: { [weaponType: number]: Types.DamageChartCfg } } {
            return Helpers.getExisted(this.getGameConfig().getDamageChartCfgs(this.getUnitType()));
        }
        private _getBuildableTileCfg(): { [srcBaseType: number]: { [srcObjectType: number]: Types.BuildableTileCfg } } | null {
            return this.getGameConfig().getBuildableTileCfgs(this.getUnitType());
        }
        private _getVisionBonusCfg(): { [tileType: number]: Types.VisionBonusCfg } | null {
            return this.getGameConfig().getVisionBonusCfg(this.getUnitType());
        }

        public getPlayer(): BwPlayer {
            return this.getWar().getPlayer(this.getPlayerIndex());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        public getView(): BaseWar.BwUnitView {
            return this._view;
        }

        public updateView(): void {
            this.getView().resetAllViews();
        }
        public setViewVisible(visible: boolean): void {
            this.getView().visible = visible;
        }

        public moveViewAlongPath({ pathNodes, isDiving, isBlocked, aiming }: {
            pathNodes   : GridIndex[];
            isDiving    : boolean;
            isBlocked   : boolean;
            aiming      : GridIndex | null;
        }): Promise<void> {
            return this.getView().moveAlongPath({ path: pathNodes, isDiving, isBlocked, aiming });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for unit id.
        ////////////////////////////////////////////////////////////////////////////////
        public getUnitId(): number {
            return Helpers.getExisted(this._unitId);
        }
        public setUnitId(id: number): void {
            this._unitId = id;
        }

        public getSkinId(): number {
            const player = this.getPlayer();
            return player.getUnitAndTileSkinId();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for state.
        ////////////////////////////////////////////////////////////////////////////////
        public getActionState(): UnitActionState {
            return Helpers.getExisted(this._actionState);
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
            return Helpers.getExisted(this._playerIndex);
        }

        public getTeamIndex(): number {
            return this.getPlayer().getTeamIndex();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hp and armor.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxHp(): number {
            return this.getTemplateCfg().maxHp;
        }
        public getNormalizedMaxHp(): number {
            return WarHelpers.WarCommonHelpers.getNormalizedHp(this.getMaxHp());
        }

        public getNormalizedCurrentHp(): number {
            return WarHelpers.WarCommonHelpers.getNormalizedHp(this.getCurrentHp());
        }
        public getCurrentHp(): number {
            return Helpers.getExisted(this._currentHp);
        }
        public setCurrentHp(hp: number): void {
            const maxHp = this.getMaxHp();
            if (((maxHp == null) && (hp != null))               ||
                ((maxHp != null) && ((hp < 0) || (hp > maxHp)))
            ) {
                throw Helpers.newError(`BwUnit.setCurrentHp() invalid hp: ${hp}, maxHp: ${maxHp}`);
            }
            this._currentHp = hp;
        }

        public checkIsFullHp(): boolean {
            const currentHp = this.getCurrentHp();
            return (currentHp != null) && (currentHp == this.getMaxHp());
        }

        public getArmorType(): number {
            return Helpers.getExisted(this.getTemplateCfg()?.armorType);
        }

        public checkIsArmorAffectByLuck(): boolean {
            return this.getTemplateCfg()?.isAffectedByLuck === 1;
        }

        public updateByRepairData(data: CommonProto.Structure.IDataForModifyUnit): void {
            if (data.deltaHp) {
                const hp = this.getCurrentHp();
                if (hp == null) {
                    throw Helpers.newError(`BwUnit.updateByRepairData() invalid currentHp: ${hp}`);
                } else {
                    this.setCurrentHp(hp + data.deltaHp);
                }
            }
            if (data.deltaFuel) {
                const fuel = this.getCurrentFuel();
                if (fuel == null) {
                    throw Helpers.newError(`BwUnit.updateByRepairData() invalid currentFuel: ${fuel}`);
                } else {
                    this.setCurrentFuel(fuel + data.deltaFuel);
                }
            }
            if (data.deltaPrimaryWeaponAmmo) {
                const ammo = this.getPrimaryWeaponCurrentAmmo();
                if (ammo == null) {
                    throw Helpers.newError(`BwUnit.updateByRepairData() invalid primary current ammo: ${ammo}`);
                } else {
                    this.setPrimaryWeaponCurrentAmmo(ammo + data.deltaPrimaryWeaponAmmo);
                }
            }
            if (data.deltaFlareAmmo) {
                const ammo = this.getFlareCurrentAmmo();
                if (ammo == null) {
                    throw Helpers.newError(`BwUnit.updateByRepairData() invalid flare ammo: ${ammo}`);
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
            return this.getTemplateCfg().primaryWeaponMaxAmmo ?? null;
        }

        public getPrimaryWeaponCurrentAmmo(): number | null {
            return Helpers.getDefined(this._primaryWeaponCurrentAmmo, ClientErrorCode.BwUnit_GetPrimaryWeaponCurrentAmmo_00);
        }
        public setPrimaryWeaponCurrentAmmo(ammo: number | null): void {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            if (((maxAmmo == null) && (ammo != null))                                   ||
                ((maxAmmo != null) && ((ammo == null) || (ammo < 0) || (ammo > maxAmmo)))
            ){
                throw Helpers.newError(`Invalid ammo: ${ammo}`);
            }

            this._primaryWeaponCurrentAmmo = ammo;
        }

        public getPrimaryWeaponUsedAmmo(): number | null {
            const maxAmmo = this.getPrimaryWeaponMaxAmmo();
            if (maxAmmo == null) {
                return null;
            } else {
                const currentAmmo = this.getPrimaryWeaponCurrentAmmo();
                if (currentAmmo == null) {
                    throw Helpers.newError(`Empty currentAmmo.`);
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

        public getPrimaryWeaponBaseDamage(armorType: number): number | null {
            return this.getPrimaryWeaponCurrentAmmo()
                ? this.getCfgBaseDamage(armorType, Types.WeaponType.Primary)
                : null;
        }

        public getAttackModifierByCo({ selfGridIndex, targetUnit, targetGridIndex, isCounter }: {
            selfGridIndex   : GridIndex;
            targetUnit      : BwUnit | null;
            targetGridIndex : GridIndex;
            isCounter       : boolean;
        }): number {
            const player = this.getPlayer();
            if (player.getCoId() === CommonConstants.CoEmptyId) {
                return 0;
            }

            const gameConfig                = this.getGameConfig();
            const unitType                  = this.getUnitType();
            const coZoneRadius              = player.getCoZoneRadius();
            const fund                      = player.getFund();
            const tileMap                   = this.getWar().getTileMap();
            const selfTile                  = tileMap.getTile(selfGridIndex);
            const selfTileType              = selfTile.getType();
            const playerIndex               = this.getPlayerIndex();
            const promotion                 = this.getCurrentPromotion();
            const hasLoadedCo               = this.getHasLoadedCo();
            const tileCountDict             = new Map<number, number>();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let modifier                    = 0;
            for (const skillId of player.getCoCurrentSkills()) {
                const skillCfg = gameConfig.getCoSkillCfg(skillId);
                {
                    const cfg = skillCfg?.selfOffenseBonus;
                    if ((cfg)                                                                   &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                        (gameConfig.checkIsTileTypeInCategory(selfTileType, cfg[2]))            &&
                        ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
                    const cfg = skillCfg?.attackBonusByPromotion;
                    if ((cfg)                                                                   &&
                        (cfg[2] === promotion)                                                  &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                        ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
                    const cfg = skillCfg?.selfOffenseBonusByFund;
                    if ((cfg)                                                                   &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                        ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
                    const cfg = skillCfg?.selfOffenseBonusByTileCount;
                    if ((cfg)                                                                   &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                        ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex               : selfGridIndex,
                            coSkillAreaType         : cfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius,
                        })))
                    ) {
                        const tileCategory      = cfg[2];
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

                                if (gameConfig.checkIsTileTypeInCategory(tile.getType(), tileCategory)) {
                                    ++tileCount;
                                }
                            }

                            tileCountDict.set(tileCategory, tileCount);
                            modifier += modifierPerTile * tileCount;
                        }
                    }
                }

                {
                    const cfg = skillCfg?.selfOffenseBonusByTileDefense;
                    if ((cfg)                                                                   &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                        ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex               : selfGridIndex,
                            coSkillAreaType         : cfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius,
                        })))
                    ) {
                        modifier += cfg[2] / 100 * selfTile.getDefenseAmount();
                    }
                }

                {
                    const cfg = skillCfg?.selfOffenseBonusByEnemyTileDefense;
                    if ((cfg)                                                                   &&
                        (targetUnit)                                                            &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                        ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex               : selfGridIndex,
                            coSkillAreaType         : cfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius,
                        })))
                    ) {
                        modifier += cfg[2] / 100 * tileMap.getTile(targetGridIndex).getDefenseAmountForUnit(targetUnit);
                    }
                }

                {
                    const cfg = skillCfg?.selfOffenseBonusByCounter;
                    if ((cfg)                                                                   &&
                        (isCounter)                                                             &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                        ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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

            return modifier;
        }
        public getAttackModifierByWeather(selfGridIndex: GridIndex): number {
            const war               = this.getWar();
            const weatherManager    = war.getWeatherManager();
            const offenseBonusCfg   = weatherManager.getCurrentWeatherCfg().offenseBonus;
            if (offenseBonusCfg == null) {
                return 0;
            }

            const gameConfig    = war.getGameConfig();
            const unitType      = this.getUnitType();
            const selfTileType  = war.getTileMap().getTile(selfGridIndex).getType();
            const modifier      = offenseBonusCfg[2];
            if ((!modifier)                                                                 ||
                (!gameConfig.checkIsUnitTypeInCategory(unitType, offenseBonusCfg[0]))       ||
                (!gameConfig.checkIsTileTypeInCategory(selfTileType, offenseBonusCfg[1]))
            ) {
                return 0;
            }

            const weatherType               = weatherManager.getCurrentWeatherType();
            const hasLoadedCo               = this.getHasLoadedCo();
            const player                    = this.getPlayer();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            for (const skillId of this.getPlayer().getCoCurrentSkills()) {
                const cfg = gameConfig.getCoSkillCfg(skillId)?.selfUnitIgnoreWeather;
                if ((cfg)                                                                   &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                    (gameConfig.checkIsTileTypeInCategory(selfTileType, cfg[2]))            &&
                    (gameConfig.checkIsWeatherTypeInCategory(weatherType, cfg[3]))          &&
                    ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex               : selfGridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                        coZoneRadius,
                    })))
                ) {
                    return 0;
                }
            }

            return modifier;
        }
        public getDefenseModifierByCo(selfGridIndex: GridIndex): number {
            const player = this.getPlayer();
            if (!player.getCoId()) {
                return 0;
            }

            const gameConfig                = this.getGameConfig();
            const unitType                  = this.getUnitType();
            const coZoneRadius              = player.getCoZoneRadius();
            const selfTile                  = this.getWar().getTileMap().getTile(selfGridIndex);
            const selfTileType              = selfTile.getType();
            const promotion                 = this.getCurrentPromotion();
            const hasLoadedCo               = this.getHasLoadedCo();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let modifier = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = gameConfig.getCoSkillCfg(skillId);
                {
                    const cfg = skillCfg?.selfDefenseBonus;
                    if ((cfg)                                                                   &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                        (gameConfig.checkIsTileTypeInCategory(selfTileType, cfg[2]))            &&
                        ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
                    const cfg = skillCfg?.defenseBonusByPromotion;
                    if ((cfg)                                                                   &&
                        (cfg[2] === promotion)                                                  &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                        ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
                    const cfg = skillCfg?.selfDefenseBonusByTileDefense;
                    if ((cfg)                                                                   &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                        ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex               : selfGridIndex,
                            coSkillAreaType         : cfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius,
                        })))
                    ) {
                        modifier += cfg[2] / 100 * selfTile.getDefenseAmount();
                    }
                }
            }
            return modifier;
        }

        public getLuckLimitModifierByCo(selfGridIndex: GridIndex): { lower: number, upper: number } {
            const player                    = this.getPlayer();
            const gameConfig                = this.getGameConfig();
            const unitType                  = this.getUnitType();
            const coZoneRadius              = player.getCoZoneRadius();
            const hasLoadedCo               = this.getHasLoadedCo();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let lowerModifier               = 0;
            let upperModifier               = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = gameConfig.getCoSkillCfg(skillId);
                if (skillCfg == null) {
                    throw Helpers.newError(`Empty skillCfg.`);
                }

                const bonusCfg = skillCfg.selfLuckRangeBonus;
                if ((bonusCfg)                                                                  &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, bonusCfg[1]))               &&
                    ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
            return this.getGameConfig().checkHasSecondaryWeapon(this.getUnitType());
        }

        public getCfgSecondaryWeaponBaseDamage(armorType: number): number | null {
            return this.getCfgBaseDamage(armorType, Types.WeaponType.Secondary);
        }
        public getSecondaryWeaponBaseDamage(armorType: number): number | null {
            return this.checkHasSecondaryWeapon()
                ? this.getCfgSecondaryWeaponBaseDamage(armorType)
                : null;
        }

        public getCfgBaseDamage(targetArmorType: number, weaponType: Types.WeaponType): number | null {
            const cfgs  = this._getDamageChartCfg();
            const cfg   = cfgs ? cfgs[targetArmorType] : null;
            return cfg ? (cfg[weaponType]?.damage ?? null) : null;
        }
        public getBaseDamage(armorType: number): number | null {
            return this.getPrimaryWeaponBaseDamage(armorType) ?? this.getSecondaryWeaponBaseDamage(armorType);
        }

        public getMinAttackRange(): number | null {
            return this.getTemplateCfg().minAttackRange ?? null;
        }
        public getCfgMaxAttackRange(): number | null {
            return this.getTemplateCfg().maxAttackRange ?? null;
        }
        public getFinalMaxAttackRange(): number | null {
            const cfgRange = this.getCfgMaxAttackRange();
            if (cfgRange == null) {
                return null;
            }

            return cfgRange + this._getMaxAttackRangeModifierByCo();
        }
        private _getMaxAttackRangeModifierByCo(): number {
            const player = this.getPlayer();
            if (player.getCoId() === CommonConstants.CoEmptyId) {
                return 0;
            }

            const gameConfig                = this.getGameConfig();
            const unitType                  = this.getUnitType();
            const selfGridIndex             = this.getGridIndex();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            const hasLoadedCo               = this.getHasLoadedCo();
            let modifier                    = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = gameConfig.getCoSkillCfg(skillId)?.maxAttackRangeBonus;
                if ((cfg)                                                                   &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                    ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
            return this.getTemplateCfg()?.canAttackAfterMove === 1;
        }
        public checkCanAttackDivingUnits(): boolean {
            return this.getTemplateCfg()?.canAttackDivingUnits === 1;
        }

        public checkCanAttackTargetAfterMovePath(movePath: GridIndex[], targetGridIndex: GridIndex): boolean {
            const war           = this.getWar();
            const unitMap       = war.getUnitMap();
            const pathLength    = movePath.length;
            const destination   = movePath[pathLength - 1];
            const primaryAmmo   = this.getPrimaryWeaponCurrentAmmo();
            if (((!this.checkCanAttackAfterMove()) && (pathLength > 1))     ||
                ((this.getLoaderUnitId() != null) && (pathLength <= 1))     ||
                ((!primaryAmmo) && (!this.checkHasSecondaryWeapon()))
            ) {
                return false;
            }

            const teamIndex         = this.getTeamIndex();
            const unitOnDestination = unitMap.getUnitOnMap(destination);
            if ((pathLength > 1) && (unitOnDestination)) {
                if (WarHelpers.WarVisibilityHelpers.checkIsUnitOnMapVisibleToTeam({
                    war,
                    observerTeamIndex   : teamIndex,
                    gridIndex           : destination,
                    unitType            : unitOnDestination.getUnitType(),
                    unitPlayerIndex     : unitOnDestination.getPlayerIndex(),
                    isDiving            : unitOnDestination.getIsDiving(),
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
                return (targetUnit.getTeamIndex() !== teamIndex)
                    && ((!targetUnit.getIsDiving()) || (this.checkCanAttackDivingUnits()))
                    && (this.getBaseDamage(armorType) != null);
            } else {
                const targetTile    = war.getTileMap().getTile(targetGridIndex);
                const armorType     = targetTile.getArmorType();
                if ((armorType == null) || (targetTile.getTeamIndex() === teamIndex)) {
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
                throw Helpers.newError(`UnitModel.setIsCapturingTile() error, isCapturing: ${isCapturing}`);
            }
            this._isCapturingTile = isCapturing;
        }

        public checkIsCapturer(): boolean {
            return this.getTemplateCfg()?.canCaptureTile === 1;
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

            const gameConfig                = this.getGameConfig();
            const unitType                  = this.getUnitType();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            const hasLoadedCo               = this.getHasLoadedCo();
            let modifier                    = 100;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = gameConfig.getCoSkillCfg(skillId);
                if (skillCfg == null) {
                    throw Helpers.newError(`Empty skillCfg.`);
                }

                {
                    const cfg = skillCfg.selfCaptureAmount;
                    if ((cfg)                                                                   &&
                        (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                        ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
        private _getCfgCaptureAmount(): number | null {
            return this.checkIsCapturer() ? this.getNormalizedCurrentHp() : null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for dive.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsDiving(): boolean {
            return Helpers.getExisted(this._isDiving);
        }
        public setIsDiving(isDiving: boolean): void {
            this._isDiving = isDiving;
        }

        public checkIsDivingByDefault(): boolean {
            return Config.ConfigManager.checkIsUnitDivingByDefaultWithTemplateCfg(this.getTemplateCfg());
        }

        public checkIsDiver(): boolean {
            return !!this.getTemplateCfg().diveCfgs;
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
            return Helpers.getExisted(this._currentFuel);
        }
        public setCurrentFuel(fuel: number): void {
            if ((fuel < 0) || (fuel > this.getMaxFuel())) {
                throw Helpers.newError(`Invalid fuel: ${fuel}`);
            }

            this._currentFuel = fuel;
        }

        public getMaxFuel(): number {
            return this.getTemplateCfg().maxFuel;
        }

        public getUsedFuel(): number {
            return this.getMaxFuel() - this.getCurrentFuel();
        }

        public getFuelConsumptionPerTurn(): number {
            return this._getCfgFuelConsumptionPerTurn() + this._getFuelConsumptionModifierByCo();
        }
        private _getCfgFuelConsumptionPerTurn(): number {
            const templateCfg = this.getTemplateCfg();
            if (!this.getIsDiving()) {
                return templateCfg.fuelConsumptionPerTurn;
            } else {
                const cfg = templateCfg.diveCfgs;
                if (cfg == null) {
                    throw Helpers.newError(`Empty cfg.`);
                }
                return cfg[0];
            }
        }
        private _getFuelConsumptionModifierByCo(): number {
            const player                    = this.getPlayer();
            const gameConfig                = this.getGameConfig();
            const unitType                  = this.getUnitType();
            const selfGridIndex             = this.getGridIndex();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            const hasLoadedCo               = this.getHasLoadedCo();
            let modifier                    = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = gameConfig.getCoSkillCfg(skillId)?.selfFuelConsumption;
                if ((cfg)                                                                   &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                    ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
            return this.getTemplateCfg()?.isDestroyedOnOutOfFuel === 1;
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
            return this.getTemplateCfg().flareRadius ?? null;
        }

        public getFlareMaxRange(): number | null {
            return this.getTemplateCfg().flareMaxRange ?? null;
        }

        public getFlareMaxAmmo(): number | null {
            return this.getTemplateCfg().flareMaxAmmo ?? null;
        }

        public getFlareCurrentAmmo(): number | null {
            return Helpers.getDefined(this._flareCurrentAmmo, ClientErrorCode.BwUnit_GetFlareCurrentAmmo_00);
        }
        public setFlareCurrentAmmo(ammo: number | null): void {
            const maxAmmo = this.getFlareMaxAmmo();
            if (((maxAmmo == null) && (ammo != null))                                   ||
                ((maxAmmo != null) && ((ammo == null) || (ammo < 0) || (ammo > maxAmmo)))
            ) {
                throw Helpers.newError(`Invalid ammo: ${ammo}`);
            }

            this._flareCurrentAmmo = ammo;
        }

        public getFlareUsedAmmo(): number | null {
            const maxAmmo = this.getFlareMaxAmmo();
            if (maxAmmo == null) {
                return null;
            } else {
                const currentAmmo = this.getFlareCurrentAmmo();
                if (currentAmmo == null) {
                    throw Helpers.newError(`Empty currentAmmo.`);
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
                    throw Helpers.newError(`Empty currentAmmo.`);
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
        public getProduceUnitType(): number | null {
            return this.getTemplateCfg().produceUnitType ?? null;
        }

        public getProduceUnitCost(): number {
            const produceUnitType = this.getProduceUnitType();
            if (produceUnitType == null) {
                throw Helpers.newError(`Empty produceUnitType.`);
            }

            const cfgCost   = Helpers.getExisted(this.getGameConfig().getUnitTemplateCfg(produceUnitType)?.productionCost);
            const modifier  = this.getPlayer().getUnitCostModifier(this.getGridIndex(), this.getHasLoadedCo(), produceUnitType);
            return Math.floor(cfgCost * modifier);
        }

        public getMaxProduceMaterial(): number | null {
            return this.getTemplateCfg().maxProduceMaterial ?? null;
        }

        public getCurrentProduceMaterial(): number | null {
            return Helpers.getDefined(this._currentProduceMaterial, ClientErrorCode.BwUnit_GetCurrentProduceMaterial_00);
        }
        public setCurrentProduceMaterial(material: number | null): void {
            const maxMaterial = this.getMaxProduceMaterial();
            if (((maxMaterial == null) && (material != null))                                               ||
                ((maxMaterial != null) && ((material == null) || (material < 0) || (material > maxMaterial)))
            ) {
                throw Helpers.newError(`Invalid material: ${material}`);
            }

            this._currentProduceMaterial = material;
        }

        public checkIsProduceMaterialInShort(): boolean {
            const maxMaterial = this.getMaxProduceMaterial();
            if (maxMaterial == null) {
                return false;
            } else {
                const currentMaterial = this.getCurrentProduceMaterial();
                if (currentMaterial == null) {
                    throw Helpers.newError(`BwUnit.checkIsProduceMaterialInShort() empty currentMaterial.`);
                    return false;
                }

                return currentMaterial / maxMaterial <= 0.4;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgMoveRange(): number {
            return this.getTemplateCfg().moveRange;
        }
        public getFinalMoveRange(): number {
            const currentFuel = this.getCurrentFuel();
            if (currentFuel <= 0) {
                return 0;
            } else {
                return Math.max(
                    0,
                    Math.min(
                        currentFuel,
                        this.getCfgMoveRange()
                            + this.getWar().getCommonSettingManager().getSettingsMoveRangeModifier(this.getPlayerIndex())
                            + this._getMoveRangeModifierByCo()
                            + this._getMoveRangeModifierByWeather(),
                    ),
                );
            }
        }
        private _getMoveRangeModifierByCo(): number {
            const player = this.getPlayer();
            if (player.getCoId() === CommonConstants.CoEmptyId) {
                return 0;
            }

            const gameConfig                = this.getGameConfig();
            const unitType                  = this.getUnitType();
            const selfGridIndex             = this.getGridIndex();
            const coZoneRadius              = player.getCoZoneRadius();
            const tileType                  = this.getWar().getTileMap().getTile(selfGridIndex).getType();
            const hasLoadedCo               = this.getHasLoadedCo();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let modifier                    = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = gameConfig.getCoSkillCfg(skillId)?.selfMoveRangeBonus;
                if ((cfg)                                                                   &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                    (gameConfig.checkIsTileTypeInCategory(tileType, cfg[2]))                &&
                    ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
        private _getMoveRangeModifierByWeather(): number {
            const war               = this.getWar();
            const weatherManager    = war.getWeatherManager();
            const moveRangeBonus    = weatherManager.getCurrentWeatherCfg().movementBonus;
            if (moveRangeBonus == null) {
                return 0;
            }

            const gameConfig    = war.getGameConfig();
            const selfGridIndex = this.getGridIndex();
            const unitType      = this.getUnitType();
            const selfTileType  = war.getTileMap().getTile(selfGridIndex).getType();
            const modifier      = moveRangeBonus[2];
            if ((!modifier)                                                                 ||
                (!gameConfig.checkIsUnitTypeInCategory(unitType, moveRangeBonus[0]))        ||
                (!gameConfig.checkIsTileTypeInCategory(selfTileType, moveRangeBonus[1]))
            ) {
                return 0;
            }

            const weatherType               = weatherManager.getCurrentWeatherType();
            const hasLoadedCo               = this.getHasLoadedCo();
            const player                    = this.getPlayer();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            for (const skillId of this.getPlayer().getCoCurrentSkills()) {
                const cfg = gameConfig.getCoSkillCfg(skillId)?.selfUnitIgnoreWeather;
                if ((cfg)                                                                   &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                    (gameConfig.checkIsTileTypeInCategory(selfTileType, cfg[2]))            &&
                    (gameConfig.checkIsWeatherTypeInCategory(weatherType, cfg[3]))          &&
                    ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex               : selfGridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                        coZoneRadius,
                    })))
                ) {
                    return 0;
                }
            }

            return modifier;
        }

        public getMoveType(): number {
            return this.getTemplateCfg().moveType;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce self.
        ////////////////////////////////////////////////////////////////////////////////
        public getProductionCfgCost(): number {
            return this.getTemplateCfg().productionCost;
        }
        public getProductionFinalCost(): number {
            return Math.floor(this.getProductionCfgCost() * this.getPlayer().getUnitCostModifier(this.getGridIndex(), this.getHasLoadedCo(), this.getUnitType()));
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for promotion.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxPromotion(): number {
            return this.getGameConfig().getUnitMaxPromotion();
        }

        public getCurrentPromotion(): number {
            return Helpers.getExisted(this._currentPromotion);
        }
        public setCurrentPromotion(promotion: number): void {
            const maxPromotion = this.getMaxPromotion();
            if ((maxPromotion == null) || (promotion < 0) || (promotion > maxPromotion)) {
                throw Helpers.newError(`BwUnit.setCurrentPromotion() invalid promotion: ${promotion}, maxPromotion: ${maxPromotion}`);
            }
            this._currentPromotion = promotion;
        }
        public addPromotion(): void {
            const currPromotion = this.getCurrentPromotion();
            const maxPromotion  = this.getMaxPromotion();
            if ((currPromotion == null) || (maxPromotion == null)) {
                throw Helpers.newError(`BwUnit.addPromotion() invalid promotion: ${currPromotion}, maxPromotion: ${maxPromotion}`);
            } else {
                this.setCurrentPromotion(Math.min(maxPromotion, currPromotion + 1));
            }
        }

        public getPromotionAttackBonus(): number {
            return this.getGameConfig().getUnitPromotionAttackBonus(this.getCurrentPromotion());
        }

        public getPromotionDefenseBonus(): number {
            return this.getGameConfig().getUnitPromotionDefenseBonus(this.getCurrentPromotion());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for launch silo.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanLaunchSiloOnTile(tile: BwTile): boolean {
            return (this.getTemplateCfg()?.canLaunchSilo === 1) && (tile.getType() === TileType.Silo);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for build tile.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsBuildingTile(): boolean {
            return this._isBuildingTile || false;
        }
        public setIsBuildingTile(isBuilding: boolean): void {
            if ((!this.checkIsTileBuilder()) && (isBuilding)) {
                throw Helpers.newError(`UnitModel.setIsBuildingTile() error, isBuilding: ${isBuilding}`);
            }
            this._isBuildingTile = isBuilding;
        }

        public checkIsTileBuilder(): boolean {
            return this._getBuildableTileCfg() != null;
        }
        public checkCanBuildOnTile(tile: BwTile): boolean {
            const tileObjectType = tile.getObjectType();
            if (tileObjectType == null) {
                throw Helpers.newError(`BwUnit.checkCanBuildOnTile() tileObjectType is empty.`);
            }

            const tileBaseType = tile.getBaseType();
            if (tileBaseType == null) {
                throw Helpers.newError(`BwUnit.checkCanBuildOnTile() empty tileBaseType.`);
            }

            const material = this.getCurrentBuildMaterial();
            return (material != null)
                && (material > 0)
                && (this.getBuildTargetTileCfg(tileBaseType, tileObjectType) != null);
        }

        public getBuildTargetTileCfg(baseType: TileBaseType, objectType: TileObjectType): Types.BuildableTileCfg | null {
            const buildableCfgs = this._getBuildableTileCfg();
            const cfgs          = buildableCfgs ? buildableCfgs[baseType] : null;
            return cfgs ? (cfgs[objectType] ?? null) : null;
        }

        public getBuildAmount(): number | null {
            return this.checkIsTileBuilder() ? this.getNormalizedCurrentHp() : null;
        }

        public getMaxBuildMaterial(): number | null {
            return this.getTemplateCfg().maxBuildMaterial ?? null;
        }

        public getCurrentBuildMaterial(): number | null {
            return Helpers.getDefined(this._currentBuildMaterial, ClientErrorCode.BwUnit_GetCurrentBuildMaterial_00);
        }
        public setCurrentBuildMaterial(material: number | null): void {
            const maxMaterial = this.getMaxBuildMaterial();
            if (((maxMaterial == null) && (material != null))                                               ||
                ((maxMaterial != null) && ((material == null) || (material < 0) || (material > maxMaterial)))
            ) {
                throw Helpers.newError(`Invalid material: ${material}`);
            }

            this._currentBuildMaterial = material;
        }

        public checkIsBuildMaterialInShort(): boolean {
            const maxMaterial = this.getMaxBuildMaterial();
            if (maxMaterial == null) {
                return false;
            } else {
                const currentMaterial = this.getCurrentBuildMaterial();
                if (currentMaterial == null) {
                    throw Helpers.newError(`BwUnit.checkIsBuildMaterialInShort() empty currentMaterial.`);
                    return false;
                }

                return currentMaterial / maxMaterial <= 0.4;
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for load unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxLoadUnitsCount(): number | null {
            return this.getTemplateCfg().maxLoadUnitsCount ?? null;
        }
        public getLoadedUnitsCount(): number {
            return this.getLoadedUnits().length;
        }
        public getLoadedUnits(): BwUnit[] {
            return this.getWar()?.getUnitMap()?.getUnitsLoadedByLoader(this, false) || [];
        }

        public getLoadUnitCategory(): Types.UnitCategory | null {
            return this.getTemplateCfg().loadUnitCategory ?? null;
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
            const cfg                   = this.getTemplateCfg();
            const gameConfig            = this.getGameConfig();
            const maxLoadUnitsCount     = this.getMaxLoadUnitsCount();
            const loadableTileCategory  = cfg.loadableTileCategory;
            const loadUnitCategory      = cfg.loadUnitCategory;
            return (maxLoadUnitsCount != null)
                && (loadableTileCategory != null)
                && (loadUnitCategory != null)
                && (gameConfig.checkIsTileTypeInCategory(this.getWar().getTileMap().getTile(this.getGridIndex()).getType(), loadableTileCategory))
                && (gameConfig.checkIsUnitTypeInCategory(unit.getUnitType(), loadUnitCategory))
                && (this.getPlayerIndex() === unit.getPlayerIndex())
                && (this.getLoadedUnitsCount() < maxLoadUnitsCount);
        }

        public checkCanDropLoadedUnit(tileType: TileType): boolean {
            const cfg                   = this.getTemplateCfg();
            const loadableTileCategory  = cfg.loadableTileCategory;
            return (cfg.canDropLoadedUnits === 1)
                && (loadableTileCategory != null)
                && (this.getGameConfig().checkIsTileTypeInCategory(tileType, loadableTileCategory));
        }
        public getCfgCanDropLoadedUnit(): boolean {
            return this.getTemplateCfg().loadableTileCategory != null;
        }

        public checkCanLaunchLoadedUnit(): boolean {
            return this.getTemplateCfg()?.canLaunchLoadedUnits === 1;
        }
        public checkCanSupplyLoadedUnit(): boolean {
            return this.getTemplateCfg()?.canSupplyLoadedUnits === 1;
        }
        private _checkCanRepairLoadedUnit(unit: BwUnit): boolean {
            return (this.getNormalizedRepairHpForLoadedUnit() != null)
                && (unit.getLoaderUnitId() === this.getUnitId())
                && ((!unit.checkIsFullHp()) || (unit.checkCanBeSupplied()));
        }
        public getNormalizedRepairHpForLoadedUnit(): number | null {
            return this.getTemplateCfg().repairAmountForLoadedUnits ?? null;
        }

        public getNormalizedRepairAmountAndCostModifier(): { amountModifier: number, costMultiplierPct: number } {
            const player                    = this.getPlayer();
            const gameConfig                = this.getGameConfig();
            const gridIndex                 = this.getGridIndex();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let amountModifier              = 0;
            let costMultiplierPct           = 100;
            for (const skillId of player.getCoCurrentSkills()) {
                const cfg = gameConfig.getCoSkillCfg(skillId)?.selfRepairAmountBonus;
                if ((cfg)                                               &&
                    (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                        coZoneRadius,
                    }))
                ) {
                    amountModifier      += cfg[2];
                    costMultiplierPct   = costMultiplierPct * cfg[3] / 100;
                }
            }

            return { amountModifier, costMultiplierPct };
        }

        public setLoaderUnitId(loaderUnitId: number | null): void {
            this._loaderUnitId = loaderUnitId;
        }
        public getLoaderUnitId(): number | null {
            return Helpers.getDefined(this._loaderUnitId, ClientErrorCode.BwUnit_GetLoaderUnitId_00);
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

        public getRepairHpAndCostForLoadedUnit(unit: BwUnit): Types.RepairHpAndCost | null {
            if (!this._checkCanRepairLoadedUnit(unit)) {
                return null;
            }

            const repairAmount = this.getNormalizedRepairHpForLoadedUnit();
            if (repairAmount == null) {
                return null;
            } else {
                const normalizedMaxHp       = unit.getNormalizedMaxHp();
                const modifier              = this.getNormalizedRepairAmountAndCostModifier();
                const productionCost        = Math.floor(unit.getProductionFinalCost() * modifier.costMultiplierPct / 100);
                const normalizedCurrentHp   = unit.getNormalizedCurrentHp();
                const normalizedRepairHp    = Math.min(
                    normalizedMaxHp - normalizedCurrentHp,
                    repairAmount + modifier.amountModifier,
                    productionCost > 0
                        ? Math.floor(Math.max(0, unit.getPlayer().getFund()) * normalizedMaxHp / productionCost)
                        : Number.MAX_SAFE_INTEGER,
                );
                return {
                    hp  : (normalizedRepairHp + normalizedCurrentHp) * CommonConstants.UnitHpNormalizer - unit.getCurrentHp(),
                    cost: Math.floor(normalizedRepairHp * productionCost / normalizedMaxHp),
                };
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for supply unit.
        ////////////////////////////////////////////////////////////////////////////////
        public checkIsAdjacentUnitSupplier(): boolean {
            return this.getTemplateCfg()?.canSupplyAdjacentUnits === 1;
        }
        public checkCanSupplyAdjacentUnit(unit: BwUnit): boolean {
            const thisGridIndex = this.getGridIndex();
            if (thisGridIndex == null) {
                throw Helpers.newError(`BwUnit.checkCanSupplyAdjacentUnit() thisGridIndex is empty.`);
                return false;
            }

            const unitGridIndex = unit.getGridIndex();
            if (unitGridIndex == null) {
                throw Helpers.newError(`BwUnit.checkCanSupplyAdjacentUnit() unitGridIndex is empty.`);
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
                throw Helpers.newError(`BwUnit.checkCanBeSuppliedWithFuel() empty maxFuel.`);
                return false;
            }

            const currentFuel = this.getCurrentFuel();
            if (currentFuel == null) {
                throw Helpers.newError(`BwUnit.checkCanBeSuppliedWithFuel() empty currentFuel.`);
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
                    throw Helpers.newError(`BwUnit.checkCanBeSuppliedWithPrimaryWeaponAmmo() empty currentAmmo.`);
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
                    throw Helpers.newError(`BwUnit.checkCanBeSuppliedWithFlareAmmo() empty currentAmmo.`);
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
        public getCfgVisionRange(): number {
            return this.getTemplateCfg().visionRange;
        }
        public getVisionRangeBonusOnTile(tileType: TileType): number {
            const cfgs  = this._getVisionBonusCfg();
            const cfg   = cfgs ? cfgs[tileType] : null;
            return cfg ? cfg.visionBonus || 0 : 0;
        }

        public getVisionRangeForPlayer(playerIndex: number, gridIndex: GridIndex): number | null {
            if (this.getPlayerIndex() !== playerIndex) {
                return null;
            }

            const war                   = this.getWar();
            const tileType              = war.getTileMap().getTile(gridIndex).getType();
            const weatherManager        = war.getWeatherManager();
            const unitVisionFixedCfg    = weatherManager.getCurrentWeatherCfg().unitVisionFixed;
            if (unitVisionFixedCfg != null) {
                const gameConfig    = war.getGameConfig();
                const unitType      = this.getUnitType();
                const weatherType   = weatherManager.getCurrentWeatherType();
                if ((gameConfig.checkIsUnitTypeInCategory(unitType, unitVisionFixedCfg[0])) &&
                    (gameConfig.checkIsTileTypeInCategory(tileType, unitVisionFixedCfg[1]))
                ) {
                    const player                    = this.getPlayer();
                    const coZoneRadius              = player.getCoZoneRadius();
                    const hasLoadedCo               = this.getHasLoadedCo();
                    const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
                    if (!player.getCoCurrentSkills().some(skillId => {
                        const skillCfg = gameConfig.getCoSkillCfg(skillId)?.selfUnitIgnoreWeather;
                        return (skillCfg != null)
                            && (gameConfig.checkIsUnitTypeInCategory(unitType, skillCfg[1]))
                            && (gameConfig.checkIsTileTypeInCategory(tileType, skillCfg[2]))
                            && (gameConfig.checkIsWeatherTypeInCategory(weatherType, skillCfg[3]))
                            && ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                                coZoneRadius,
                                gridIndex,
                                coSkillAreaType         : skillCfg[0],
                                getCoGridIndexArrayOnMap,
                            })));
                    })) {
                        return unitVisionFixedCfg[2];
                    }
                }
            }

            const modifierByCo          = this._getVisionRangeModifierByCo(gridIndex);
            const modifierByTile        = this.getVisionRangeBonusOnTile(tileType);
            const modifierBySettings    = war.getCommonSettingManager().getSettingsVisionRangeModifier(playerIndex);
            return Math.max(
                1,
                this.getCfgVisionRange() + modifierByCo + modifierByTile + modifierBySettings,
            );
        }
        public getVisionRangeForTeamIndexes(teamIndexes: Set<number>, gridIndex: GridIndex): number | null {
            let vision: number | null = null;
            for (const playerIndex of this.getWar().getPlayerManager().getPlayerIndexesInTeams(teamIndexes)) {
                const v = this.getVisionRangeForPlayer(playerIndex, gridIndex);
                if (v != null) {
                    if ((vision == null) || (v > vision)) {
                        vision = v;
                    }
                }
            }
            return vision;
        }
        private _getVisionRangeModifierByCo(selfGridIndex: GridIndex): number {
            const player = this.getPlayer();
            if (player.getCoId() === CommonConstants.CoEmptyId) {
                return 0;
            }

            const gameConfig             = this.getGameConfig();
            const unitType                  = this.getUnitType();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            const hasLoadedCo               = this.getHasLoadedCo();
            let modifier                    = 0;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = gameConfig.getCoSkillCfg(skillId)?.unitVisionRangeBonus;
                if ((cfg)                                                                   &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                    ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
            const gameConfig    = this.getGameConfig();
            const unitType      = this.getUnitType();
            const player        = this.getPlayer();
            if (!player.getCoId()) {
                return false;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                throw Helpers.newError(`BwUnit.checkIsTrueVision() empty coZoneRadius.`);
            }

            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            const hasLoadedCo               = this.getHasLoadedCo();
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = gameConfig.getCoSkillCfg(skillId)?.unitTrueVision;
                if ((cfg)                                                                   &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))                &&
                    ((hasLoadedCo) || (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
                throw Helpers.newError(`BwUnit.checkCanJoinUnit() empty hp1.`);
                return false;
            }

            const hp2 = unit.getNormalizedMaxHp();
            if (hp2 == null) {
                throw Helpers.newError(`BwUnit.checkCanJoinUnit() empty hp2.`);
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
                throw Helpers.newError(`Can not join.`);
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
            return Helpers.getExisted(this._hasLoadedCo);
        }

        public checkCanLoadCoAfterMovePath(movePath: GridIndex[]): boolean {
            const war           = this.getWar();
            const playerIndex   = this.getPlayerIndex();
            const player        = war.getPlayer(playerIndex);
            const maxLoadCount  = player.getCoMaxLoadCount();
            if ((maxLoadCount <= 0)                                                     ||
                (movePath.length !== 1)                                                 ||
                (this.getLoaderUnitId() != null)                                        ||
                (player.getCoId() == CommonConstants.CoEmptyId)                         ||
                (war.getUnitMap().getAllCoUnits(playerIndex).length >= maxLoadCount)    ||
                (player.getCoIsDestroyedInTurn())                                       ||
                (this.getHasLoadedCo())                                                 ||
                (this.getLoadCoCost() > player.getFund())
            ) {
                return false;
            }

            const tile = war.getTileMap().getTile(movePath[0]);
            if (tile.getPlayerIndex() !== playerIndex) {
                return false;
            } else {
                const category = tile.getLoadCoUnitCategory();
                return category == null
                    ? false
                    : this.getGameConfig().checkIsUnitTypeInCategory(this.getUnitType(), category);
            }
        }

        public checkCanUseCoSkill(skillType: Types.CoSkillType): boolean {
            const player        = this.getPlayer();
            const war           = this.getWar();
            const playerIndex   = this.getPlayerIndex();
            if ((!player)                                                                               ||
                (!this.getHasLoadedCo())                                                                ||
                (player.checkCoIsUsingActiveSkill())                                                    ||
                (!player.getCoSkills(skillType))                                                        ||
                (player.getCoType() !== Types.CoType.Zoned)                                             ||
                (!war.getCommonSettingManager().getSettingsCanActivateCoSkill(playerIndex))             ||
                (!war.getWarEventManager().checkOngoingPersistentActionCanActivateCoSkill(playerIndex))
            ) {
                return false;
            }

            const energy = player.getCoCurrentEnergy();
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
            return Math.floor(Helpers.getExisted(this.getGameConfig().getCoBasicCfg(this.getPlayer().getCoId())?.boardCostPercentage) * this.getProductionCfgCost() / 100);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for ai mode.
        ////////////////////////////////////////////////////////////////////////////////
        public setAiMode(aiMode: UnitAiMode): void {
            if (!Config.ConfigManager.checkIsValidUnitAiMode(aiMode)) {
                throw Helpers.newError(`Invalid aiMode: ${aiMode}`, ClientErrorCode.BwUnit_SetAiMode_00);
            }

            this._aiMode = aiMode;
        }
        public getAiMode(): UnitAiMode {
            return Helpers.getExisted(this._aiMode, ClientErrorCode.BwUnit_GetAiMode_00);
        }

        /**
         * @returns indicates the ai mode is modified or not
         */
        public checkAndUpdateAiMode(): boolean {
            if (this.getPlayer().getUserId() != null) {
                return false;
            }

            const currentMode = this.getAiMode();
            if (currentMode === UnitAiMode.Normal) {
                // nothing to do
                return false;

            } else if (currentMode === UnitAiMode.WaitUntilCanAttack) {
                const minAttackRange    = this.getMinAttackRange();
                const maxAttackRange    = this.getFinalMaxAttackRange();
                if ((minAttackRange == null) || (maxAttackRange == null)) {
                    return false;
                }

                const war           = this.getWar();
                const unitMap       = war.getUnitMap();
                const tileMap       = war.getTileMap();
                const mapSize       = unitMap.getMapSize();
                const selfTeamIndex = this.getTeamIndex();
                const selfGridIndex = this.getGridIndex();
                const movableArea   = WarHelpers.WarCommonHelpers.createMovableArea({
                    origin          : selfGridIndex,
                    maxMoveCost     : this.getFinalMoveRange(),
                    mapSize,
                    moveCostGetter  : gridIndex => {
                        if (!GridIndexHelpers.checkIsInsideMap(gridIndex, mapSize)) {
                            return null;
                        } else {
                            const existingUnit = unitMap.getUnitOnMap(gridIndex);
                            if ((existingUnit) && (existingUnit.getTeamIndex() != selfTeamIndex)) {
                                return null;
                            } else {
                                return tileMap.getTile(gridIndex).getMoveCostByUnit(this);
                            }
                        }
                    },
                });
                const attackableArea = WarHelpers.WarCommonHelpers.createAttackableAreaForUnit({
                    movableArea,
                    mapSize,
                    minAttackRange,
                    maxAttackRange,
                    checkCanAttack: (moveGridIndex: GridIndex, targetGridIndex: GridIndex): boolean => {
                        const hasMoved = !GridIndexHelpers.checkIsEqual(moveGridIndex, selfGridIndex);
                        if (((this.getLoaderUnitId() == null) || (hasMoved))    &&
                            ((this.checkCanAttackAfterMove()) || (!hasMoved))
                        ) {
                            const targetUnit = unitMap.getUnitOnMap(targetGridIndex);
                            if (targetUnit == null) {
                                return false;
                            } else {
                                const armorType = targetUnit.getArmorType();
                                return (targetUnit.getTeamIndex() !== selfTeamIndex)
                                    && ((!targetUnit.getIsDiving()) || (this.checkCanAttackDivingUnits()))
                                    && (this.getBaseDamage(armorType) != null);
                            }
                        } else {
                            return false;
                        }
                    }
                });

                if (!attackableArea.length) {
                    return false;
                } else {
                    this.setAiMode(UnitAiMode.Normal);
                    return true;
                }

            } else if (currentMode === UnitAiMode.NoMove) {
                // nothing to do
                return false;

            } else {
                throw Helpers.newError(`Invalid currentMode: ${currentMode}`, ClientErrorCode.BwUnit_CheckAndUpdateAiMode_00);
            }
        }

        public checkCanAiDoAction(): boolean {
            return this.getAiMode() !== UnitAiMode.WaitUntilCanAttack;
        }
    }

    function getRevisedIsDiving(isDiving: Types.Undefinable<boolean>, unitTemplateCfg: UnitTemplateCfg): boolean {
        return isDiving != null
            ? isDiving
            : Config.ConfigManager.checkIsUnitDivingByDefaultWithTemplateCfg(unitTemplateCfg);
    }
}

// export default TwnsBwUnit;
