
// import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import ProtoTypes           from "../../tools/proto/ProtoTypes";
// import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
// import TwnsBwTileView       from "../view/BwTileView";
// import TwnsBwPlayer         from "./BwPlayer";
// import TwnsBwUnit           from "./BwUnit";
// import TwnsBwWar            from "./BwWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsBwTile {
    import TileType                     = Types.TileType;
    import TileObjectType               = Types.TileObjectType;
    import TileDecoratorType            = Types.TileDecoratorType;
    import TileBaseType                 = Types.TileBaseType;
    import TileTemplateCfg              = Types.TileTemplateCfg;
    import ITileCustomCrystalData       = ProtoTypes.WarSerialization.ITileCustomCrystalData;
    import ITileCustomCannonData        = ProtoTypes.WarSerialization.ITileCustomCannonData;
    import ITileCustomLaserTurretData   = ProtoTypes.WarSerialization.ITileCustomLaserTurretData;
    import ISerialTile                  = ProtoTypes.WarSerialization.ISerialTile;
    import ClientErrorCode              = TwnsClientErrorCode.ClientErrorCode;

    export class BwTile {
        private _templateCfg?           : TileTemplateCfg;
        private _gridX?                 : number;
        private _gridY?                 : number;
        private _playerIndex?           : number;
        private _baseType?              : TileBaseType;
        private _decoratorType?         : TileDecoratorType | null;
        private _objectType?            : TileObjectType;

        private _baseShapeId?           : number;
        private _decoratorShapeId?      : number | null;
        private _objectShapeId?         : number;
        private _currentHp?             : number | null;
        private _currentBuildPoint?     : number | null;
        private _currentCapturePoint?   : number | null;
        private _customCrystalData?     : ITileCustomCrystalData | null;
        private _customCannonData?      : ITileCustomCannonData | null;
        private _customLaserTurretData? : ITileCustomLaserTurretData | null;

        private readonly _view  = new TwnsBwTileView.BwTileView();
        private _hasFog         = false;
        private _war?           : TwnsBwWar.BwWar;

        public init(data: ISerialTile, configVersion: string): void {
            this.deserialize(data, configVersion);
            this.setHasFog(false);
        }
        public fastInit(data: ISerialTile, configVersion: string): void {
            this.init(data, configVersion);
        }

        public startRunning(war: TwnsBwWar.BwWar): void {
            this._setWar(war);
        }
        public startRunningView(): void {
            this.flushDataToView();
        }

        public deserialize(data: ISerialTile, configVersion: string): void {
            const gridIndex = Helpers.getExisted(GridIndexHelpers.convertGridIndex(data.gridIndex), ClientErrorCode.BwTile_Deserialize_00);
            const gridX     = gridIndex.x;
            const gridY     = gridIndex.y;
            if ((gridX < 0)                                                 ||
                (gridY < 0)                                                 ||
                ((gridX + 1) * (gridY + 1) > CommonConstants.MapMaxGridsCount)
            ) {
                throw Helpers.newError(`Invalid gridX and/or gridY: ${gridX}, ${gridY}`, ClientErrorCode.BwTile_Deserialize_01);
            }

            const objectType    = Helpers.getExisted(data.objectType, ClientErrorCode.BwTile_Deserialize_02) as TileObjectType;
            const baseType      = Helpers.getExisted(data.baseType, ClientErrorCode.BwTile_Deserialize_03) as TileBaseType;
            const playerIndex   = data.playerIndex;
            if ((playerIndex == null)                                                           ||
                (!ConfigManager.checkIsValidPlayerIndexForTile(playerIndex, baseType, objectType))
            ) {
                throw Helpers.newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwTile_Deserialize_04);
            }

            const templateCfg       = ConfigManager.getTileTemplateCfg(configVersion, baseType, objectType);
            const maxBuildPoint     = templateCfg.maxBuildPoint;
            const currentBuildPoint = data.currentBuildPoint;
            if (maxBuildPoint == null) {
                if (currentBuildPoint != null) {
                    throw Helpers.newError(`Invalid currentBuildPoint: ${currentBuildPoint}`, ClientErrorCode.BwTile_Deserialize_05);
                }
            } else {
                if ((currentBuildPoint != null)                                     &&
                    ((currentBuildPoint > maxBuildPoint) || (currentBuildPoint < 0))
                ) {
                    throw Helpers.newError(`Invalid currentBuildPoint: ${currentBuildPoint}`, ClientErrorCode.BwTile_Deserialize_06);
                }
            }

            const maxCapturePoint       = templateCfg.maxCapturePoint;
            const currentCapturePoint   = data.currentCapturePoint;
            if (maxCapturePoint == null) {
                if (currentCapturePoint != null) {
                    throw Helpers.newError(`Invalid currentCapturePoint: ${currentCapturePoint}`, ClientErrorCode.BwTile_Deserialize_07);
                }
            } else {
                if ((currentCapturePoint != null)                                       &&
                    ((currentCapturePoint > maxCapturePoint) || (currentCapturePoint < 0))
                ) {
                    throw Helpers.newError(`Invalid currentCapturePoint: ${currentCapturePoint}`, ClientErrorCode.BwTile_Deserialize_08);
                }
            }

            const maxHp     = templateCfg.maxHp;
            const currentHp = data.currentHp;
            if (maxHp == null) {
                if (currentHp != null) {
                    throw Helpers.newError(`Invalid currentHp: ${currentHp}`, ClientErrorCode.BwTile_Deserialize_09);
                }
            } else {
                if ((currentHp != null)                     &&
                    ((currentHp > maxHp) || (currentHp < 0))
                ) {
                    throw Helpers.newError(`Invalid currentHp: ${currentHp}`, ClientErrorCode.BwTile_Deserialize_10);
                }
            }

            // 处理海岸独立的残留数据
            if ((baseType === Types.TileBaseType.Sea) && (data.baseShapeId)) {
                data.decoratorType      = Types.TileDecoratorType.Shore;
                data.decoratorShapeId   = data.baseShapeId;
                data.baseShapeId        = 0;
            }

            const baseShapeId = data.baseShapeId;
            if (!ConfigManager.checkIsValidTileBaseShapeId(baseType, baseShapeId)) {
                throw Helpers.newError(`Invalid baseShapeId: ${baseShapeId}`, ClientErrorCode.BwTile_Deserialize_11);
            }

            const objectShapeId = data.objectShapeId;
            if (!ConfigManager.checkIsValidTileObjectShapeId(objectType, objectShapeId)) {
                throw Helpers.newError(`Invalid objectShapeId: ${objectShapeId}`, ClientErrorCode.BwTile_Deserialize_12);
            }

            const decoratorType     = data.decoratorType ?? null;
            const decoratorShapeId  = data.decoratorShapeId ?? null;
            if (!ConfigManager.checkIsValidTileDecoratorShapeId(decoratorType, decoratorShapeId)) {
                throw Helpers.newError(`Invalid decoratorType/shapeId: ${decoratorType}, ${decoratorShapeId}`, ClientErrorCode.BwTile_Deserialize_13);
            }

            const tileType          = templateCfg.type;
            const customCrystalData = data.customCrystalData ?? null;
            if ((customCrystalData != null) && (tileType !== TileType.CustomCrystal)) {
                throw Helpers.newError(`CustomCrystalData is present while the tile is not CustomCrystal.`, ClientErrorCode.BwTile_Deserialize_14);
            }
            if ((customCrystalData != null) && (!ConfigManager.checkIsValidCustomCrystalData(customCrystalData))) {
                throw Helpers.newError(`Invalid customCrystalData.`, ClientErrorCode.BwTile_Deserialize_15);
            }

            const customCannonData = data.customCannonData ?? null;
            if ((customCannonData != null) && (tileType !== TileType.CustomCannon)) {
                throw Helpers.newError(`CustomCannonData is present while the tile is not CustomCannon.`, ClientErrorCode.BwTile_Deserialize_16);
            }
            if ((customCannonData != null) && (!ConfigManager.checkIsValidCustomCannonData(customCannonData))) {
                throw Helpers.newError(`Invalid customCannonData.`, ClientErrorCode.BwTile_Deserialize_17);
            }

            const customLaserTurretData = data.customLaserTurretData ?? null;
            if ((customLaserTurretData != null) && (tileType !== TileType.CustomLaserTurret)) {
                throw Helpers.newError(`CustomLaserTurretData is present while the tile is not CustomLaserTurret.`, ClientErrorCode.BwTile_Deserialize_18);
            }
            if ((customLaserTurretData != null) && (!ConfigManager.checkIsValidCustomLaserTurretData(customLaserTurretData))) {
                throw Helpers.newError(`Invalid customLaserTurretData.`, ClientErrorCode.BwTile_Deserialize_19);
            }

            this._setTemplateCfg(templateCfg);
            this._setGridX(gridX);
            this._setGridY(gridY);
            this._setBaseType(baseType);
            this._setDecoratorType(decoratorType);
            this._setObjectType(objectType);
            this._setPlayerIndex(playerIndex);

            this._setBaseShapeId(baseShapeId ?? 0);
            this._setDecoratorShapeId(decoratorShapeId ?? null);
            this._setObjectShapeId(objectShapeId ?? 0);
            this.setCurrentHp(currentHp ?? (templateCfg.maxHp ?? null));
            this.setCurrentBuildPoint(currentBuildPoint ?? (templateCfg.maxBuildPoint ?? null));
            this.setCurrentCapturePoint(currentCapturePoint ?? (templateCfg.maxCapturePoint ?? null));
            this._setCustomCrystalData(customCrystalData);
            this._setCustomCannonData(customCannonData);
            this._setCustomLaserTurretData(customLaserTurretData);
        }
        public serialize(): ISerialTile {
            const data: ISerialTile = {
                gridIndex               : this.getGridIndex(),
                baseType                : this.getBaseType(),
                objectType              : this.getObjectType(),
                playerIndex             : this.getPlayerIndex(),

                customCrystalData       : this._customCrystalData,
                customCannonData        : this._customCannonData,
                customLaserTurretData   : this._customLaserTurretData,
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

            const decoratorType = this.getDecoratorType();
            (decoratorType !== TileDecoratorType.Empty) && (data.decoratorType = decoratorType);

            const decoratorShapeId = this.getDecoratorShapeId();
            (decoratorShapeId !== 0) && (data.decoratorShapeId = decoratorShapeId);

            return data;
        }
        public serializeForCreateSfw(): ISerialTile {
            const war       = this.getWar();
            const gridIndex = this.getGridIndex();
            if (WarVisibilityHelpers.checkIsTileVisibleToTeams(war, gridIndex, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf())) {
                return this.serialize();

            } else {
                const baseType      = this.getBaseType();
                const objectType    = this.getObjectType();
                const playerIndex   = this.getPlayerIndex();
                const data          : ISerialTile = {
                    gridIndex,
                    baseType,
                    objectType,
                    playerIndex             : objectType === Types.TileObjectType.Headquarters ? playerIndex : CommonConstants.WarNeutralPlayerIndex,

                    customCrystalData       : this._customCrystalData,
                    customCannonData        : this._customCannonData,
                    customLaserTurretData   : this._customLaserTurretData,
                };

                const currentHp = this.getCurrentHp();
                (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

                const baseShapeId = this.getBaseShapeId();
                (baseShapeId !== 0) && (data.baseShapeId = baseShapeId);

                const objectShapeId = this.getObjectShapeId();
                (objectShapeId !== 0) && (data.objectShapeId = objectShapeId);

                const decoratorType = this.getDecoratorType();
                (decoratorType !== TileDecoratorType.Empty) && (data.decoratorType = decoratorType);

                const decoratorShapeId = this.getDecoratorShapeId();
                (decoratorShapeId !== 0) && (data.decoratorShapeId = decoratorShapeId);

                return data;
            }
        }
        public serializeForCreateMfr(): ISerialTile {
            return this.serializeForCreateSfw();
        }

        private _setWar(war: TwnsBwWar.BwWar): void {
            this._war = war;
        }
        public getWar(): TwnsBwWar.BwWar {
            return Helpers.getExisted(this._war);
        }

        public getConfigVersion(): string {
            return this._getTemplateCfg().version;
        }

        private _setTemplateCfg(cfg: TileTemplateCfg): void {
            this._templateCfg = cfg;
        }
        private _getTemplateCfg(): Types.TileTemplateCfg {
            return Helpers.getExisted(this._templateCfg);
        }

        public updateOnUnitLeave(): void {
            this.setCurrentBuildPoint(this.getMaxBuildPoint());
            this.setCurrentCapturePoint(this.getMaxCapturePoint());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        public getView(): TwnsBwTileView.BwTileView {
            return this._view;
        }
        public flushDataToView(): void {
            const view = this.getView();
            view.setData({
                tileData    : this.serialize(),
                hasFog      : this.getHasFog(),
                skinId      : this.getSkinId(),
                themeType   : this.getTileThemeType(),
            });
            view.updateView();
        }

        private _setBaseType(baseType: TileBaseType): void {
            this._baseType = baseType;
        }
        public getBaseType(): TileBaseType {
            return Helpers.getExisted(this._baseType);
        }

        private _setObjectType(objectType: TileObjectType): void {
            this._objectType = objectType;
        }
        public getObjectType(): TileObjectType {
            return Helpers.getExisted(this._objectType);
        }

        private _setDecoratorType(decoratorType: TileDecoratorType | null): void {
            this._decoratorType = decoratorType;
        }
        public getDecoratorType(): TileDecoratorType | null {
            return Helpers.getDefined(this._decoratorType, ClientErrorCode.BwTile_GetDecoratorType_00);
        }

        private _setBaseShapeId(id: number): void {
            this._baseShapeId = id;
        }
        public getBaseShapeId(): number {
            return Helpers.getExisted(this._baseShapeId);
        }

        private _setObjectShapeId(id: number): void {
            this._objectShapeId = id;
        }
        public getObjectShapeId(): number {
            return Helpers.getExisted(this._objectShapeId);
        }

        private _setDecoratorShapeId(id: number | null): void {
            this._decoratorShapeId = id;
        }
        public getDecoratorShapeId(): number | null {
            return Helpers.getDefined(this._decoratorShapeId, ClientErrorCode.BwTile_GetDecoratorShapeId_00);
        }

        public getSkinId(): number {
            return this.getPlayer().getUnitAndTileSkinId();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hp and armor.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxHp(): number | null {
            return this._getTemplateCfg().maxHp ?? null;
        }

        public getCurrentHp(): number | null {
            return Helpers.getDefined(this._currentHp, ClientErrorCode.BwTile_GetCurrentHp_00);
        }
        public setCurrentHp(hp: number | null): void {
            const maxHp = this.getMaxHp();
            if (maxHp == null) {
                if (hp != null) {
                    throw Helpers.newError(`Non null hp: ${hp}.`);
                }
            } else {
                if ((hp == null) || (hp < 0) || (hp > maxHp)) {
                    throw Helpers.newError(`Invalid hp: ${hp}`);
                }
            }

            this._currentHp = hp;
        }

        public getArmorType(): Types.ArmorType | null {
            return this._getTemplateCfg().armorType ?? null;
        }

        public checkIsArmorAffectByLuck(): boolean {
            return this._getTemplateCfg().isAffectedByLuck === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for build.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxBuildPoint(): number | null {
            return this._getTemplateCfg().maxBuildPoint ?? null;
        }

        public getCurrentBuildPoint(): number | null {
            return Helpers.getDefined(this._currentBuildPoint, ClientErrorCode.BwTile_GetCurrentBuildPoint_00);
        }
        public setCurrentBuildPoint(point: number | null): void {
            const maxPoint = this.getMaxBuildPoint();
            if (maxPoint == null) {
                if (point != null) {
                    throw Helpers.newError(`Non null point: ${point}`);
                }
            } else {
                if ((point == null) || (point < 0) || (point > maxPoint)) {
                    throw Helpers.newError(`Invalid point: ${point}`);
                }
            }

            this._currentBuildPoint = point;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for capture.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxCapturePoint(): number | null {
            return this._getTemplateCfg().maxCapturePoint ?? null;
        }

        public getCurrentCapturePoint(): number | null {
            return Helpers.getDefined(this._currentCapturePoint, ClientErrorCode.BwTile_GetCurrentCapturePoint_00);
        }
        public setCurrentCapturePoint(point: number | null): void {
            const maxPoint = this.getMaxCapturePoint();
            if (maxPoint == null) {
                if (point != null) {
                    throw Helpers.newError(`Non null point: ${point}`);
                }
            } else {
                if ((point == null) || (point < 0) || (point > maxPoint)) {
                    throw Helpers.newError(`Invalid point: ${point}`);
                }
            }

            this._currentCapturePoint = point;
        }

        public checkIsDefeatOnCapture(): boolean {
            const cfg = this._getTemplateCfg();
            return cfg.isDefeatedOnCapture === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for defense amount for units.
        ////////////////////////////////////////////////////////////////////////////////
        public getNormalizedDefenseAmount(): number {
            return Math.floor(this.getDefenseAmount() / 10);
        }
        public getDefenseAmount(): number {
            return this._getTemplateCfg().defenseAmount;
        }
        public getDefenseAmountForUnit(unit: TwnsBwUnit.BwUnit): number {
            return this.checkCanDefendUnit(unit)
                ? this.getDefenseAmount() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp()
                : 0;
        }

        public getDefenseUnitCategory(): Types.UnitCategory {
            return this._getTemplateCfg().defenseUnitCategory;
        }
        public checkCanDefendUnit(unit: TwnsBwUnit.BwUnit): boolean {
            return ConfigManager.checkIsUnitTypeInCategory(this.getConfigVersion(), unit.getUnitType(), this.getDefenseUnitCategory());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for grid position.
        ////////////////////////////////////////////////////////////////////////////////
        private _setGridX(x: number): void {
            this._gridX = x;
        }
        public getGridX(): number {
            return Helpers.getExisted(this._gridX);
        }

        private _setGridY(y: number): void {
            this._gridY = y;
        }
        public getGridY(): number {
            return Helpers.getExisted(this._gridY);
        }

        public getGridIndex(): Types.GridIndex {
            return {
                x   : this.getGridX(),
                y   : this.getGridY(),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for type.
        ////////////////////////////////////////////////////////////////////////////////
        public getType(): TileType {
            return this._getTemplateCfg().type;
        }

        public resetByTypeAndPlayerIndex({ baseType, objectType, playerIndex }: {
            baseType        : TileBaseType;
            objectType      : TileObjectType;
            playerIndex     : number;
        }): void {
            if (!ConfigManager.checkIsValidPlayerIndexForTile(playerIndex, baseType, objectType)) {
                throw Helpers.newError(`Invalid playerIndex: ${playerIndex}, baseType: ${baseType}, objectType: ${objectType}`);
            }

            this.init({
                gridIndex       : this.getGridIndex(),
                objectType,
                baseType,
                playerIndex,
                baseShapeId     : baseType === this.getBaseType() ? this.getBaseShapeId() : null,
                objectShapeId   : objectType === this.getObjectType() ? this.getObjectShapeId() : null,
                decoratorType   : this.getDecoratorType(),
                decoratorShapeId: this.getDecoratorShapeId(),
            }, this.getConfigVersion());
            this.startRunning(this.getWar());
        }
        public deleteTileDecorator(): void {
            this._setDecoratorType(null);
            this._setDecoratorShapeId(null);
        }
        public destroyTileObject(): void {
            this.resetByTypeAndPlayerIndex({
                baseType    : this.getBaseType(),
                objectType  : TileObjectType.Empty,
                playerIndex : CommonConstants.WarNeutralPlayerIndex
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for income.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgIncome(): number {
            return this._getTemplateCfg().incomePerTurn ?? 0;
        }
        public getIncomeForPlayer(playerIndex: number): number {
            if ((this.getPlayerIndex() !== playerIndex)                 ||
                (playerIndex === CommonConstants.WarNeutralPlayerIndex)
            ) {
                return 0;
            }

            const war                       = this.getWar();
            const configVersion             = war.getConfigVersion();
            const player                    = this.getPlayer();
            const tileType                  = this.getType();
            const gridIndex                 = this.getGridIndex();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let modifierForSkill            = 1;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.selfTileIncome;
                if ((cfg)                                                                       &&
                    (ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, cfg[1]))  &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                        coZoneRadius,
                    }))
                ) {
                    modifierForSkill *= cfg[2] / 100;
                }
            }

            return Math.floor(
                this.getCfgIncome()
                * war.getCommonSettingManager().getSettingsIncomeMultiplier(playerIndex)
                / 100
                * modifierForSkill
            );
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for player index.
        ////////////////////////////////////////////////////////////////////////////////
        private _setPlayerIndex(index: number): void {
            this._playerIndex = index;
        }
        public getPlayerIndex(): number {
            return Helpers.getExisted(this._playerIndex);
        }

        public getPlayer(): TwnsBwPlayer.BwPlayer {
            return this.getWar().getPlayer(this.getPlayerIndex());
        }

        public getTeamIndex(): number {
            return this.getWar().getPlayer(this.getPlayerIndex()).getTeamIndex();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move cost.
        ////////////////////////////////////////////////////////////////////////////////
        private _getMoveCostCfg(): { [moveType: number]: Types.MoveCostCfg } {
            return ConfigManager.getMoveCostCfg(this.getConfigVersion(), this.getBaseType(), this.getObjectType());
        }

        public getMoveCostByMoveType(moveType: Types.MoveType): number | null {
            return this._getMoveCostCfg()[moveType]?.cost ?? null;
        }
        public getMoveCostByUnit(unit: TwnsBwUnit.BwUnit): number | null {
            const tileType      = this.getType();
            const unitType      = unit.getUnitType();
            const war           = this.getWar();
            const configVersion = war.getConfigVersion();
            if (((tileType === TileType.Seaport) || (tileType === TileType.TempSeaport))                            &&
                (this.getTeamIndex() !== unit.getTeamIndex())                                                       &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, Types.UnitCategory.LargeNaval))
            ) {
                return null;
            }

            const rawCost = this.getMoveCostByMoveType(unit.getMoveType());
            if (rawCost == null) {
                return null;
            }

            const player                    = unit.getPlayer();
            const gridIndex                 = this.getGridIndex();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.selfUnitMoveCost;
                if ((cfg)                                                                       &&
                    (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, cfg[1]))  &&
                    (ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, cfg[2]))  &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                        coZoneRadius,
                    }))
                ) {
                    return cfg[3];
                }
            }

            return rawCost;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for repair/supply unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getRepairUnitCategory(): Types.UnitCategory | null {
            return this._getTemplateCfg().repairUnitCategory ?? null;
        }

        public getCfgNormalizedRepairHp(): number | null {
            return this._getTemplateCfg().repairAmount ?? null;
        }

        public getNormalizedRepairHpModifier(): number {
            const player                    = this.getPlayer();
            const configVersion             = this.getConfigVersion();
            const gridIndex                 = this.getGridIndex();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let totalModifier               = 0;
            for (const skillId of player.getCoCurrentSkills()) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.selfRepairAmountBonus;
                if ((cfg)                                               &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                        gridIndex,
                        coSkillAreaType         : cfg[0],
                        getCoGridIndexArrayOnMap,
                        coZoneRadius,
                    }))
                ) {
                    totalModifier += cfg[1];
                }
            }

            return totalModifier;
        }

        public checkCanRepairUnit(unit: TwnsBwUnit.BwUnit): boolean {
            const category = this.getRepairUnitCategory();
            return (category != null)
                && ((unit.getCurrentHp() < unit.getMaxHp()) || (unit.checkCanBeSupplied()))
                && (unit.getTeamIndex() === this.getTeamIndex())
                && (ConfigManager.checkIsUnitTypeInCategory(this.getConfigVersion(), unit.getUnitType(), category));
        }
        public checkCanSupplyUnit(unit: TwnsBwUnit.BwUnit): boolean {
            const category = this.getRepairUnitCategory();
            return (category != null)
                && (unit.checkCanBeSupplied())
                && (unit.getTeamIndex() === this.getTeamIndex())
                && (ConfigManager.checkIsUnitTypeInCategory(this.getConfigVersion(), unit.getUnitType(), category));
        }

        public getRepairHpAndCostForUnit(unit: TwnsBwUnit.BwUnit): Types.RepairHpAndCost | null {
            if (!this.checkCanRepairUnit(unit)) {
                return null;
            }

            const cfgNormalizedRepairHp = this.getCfgNormalizedRepairHp();
            if (cfgNormalizedRepairHp == null) {
                throw Helpers.newError(`Empty cfgNormalizedRepairHp`);
            }

            const unitPlayer            = unit.getPlayer();
            const fund                  = unitPlayer.getFund();
            const productionCost        = unit.getProductionFinalCost();
            const currentHp             = unit.getCurrentHp();
            const normalizedMaxHp       = unit.getNormalizedMaxHp();
            const normalizedCurrentHp   = WarCommonHelpers.getNormalizedHp(currentHp);
            const normalizedRepairHp    = Math.min(
                normalizedMaxHp - normalizedCurrentHp,
                cfgNormalizedRepairHp + this.getNormalizedRepairHpModifier(),
                Math.floor(fund * normalizedMaxHp / productionCost)
            );
            return {
                hp  : (normalizedRepairHp + normalizedCurrentHp) * CommonConstants.UnitHpNormalizer - currentHp,
                cost: Math.floor(normalizedRepairHp * productionCost / normalizedMaxHp),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hide unit.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanHideUnit(unitType: Types.UnitType): boolean {
            const configVersion = this.getConfigVersion();
            const category      = this.getCfgHideUnitCategory();
            return category == null
                ? false
                : ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category);
        }

        public checkIsUnitHider(): boolean {
            const category = this.getCfgHideUnitCategory();
            return (category != null) && (category != Types.UnitCategory.None);
        }

        public getCfgHideUnitCategory(): Types.UnitCategory | null {
            return this._getTemplateCfg().hideUnitCategory ?? null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgProduceUnitCategory(): Types.UnitCategory | null {
            return this._getTemplateCfg().produceUnitCategory ?? null;
        }
        public getProduceUnitCategoryForPlayer(playerIndex: number): Types.UnitCategory | null {
            if (this.getPlayerIndex() !== playerIndex) {
                return null;
            } else {
                const skillCfg = this.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
                return skillCfg ? skillCfg[1] : this.getCfgProduceUnitCategory();
            }
        }

        public getEffectiveSelfUnitProductionSkillCfg(playerIndex: number): number[] | null {
            const war       = this.getWar();
            const player    = war.getPlayerManager().getPlayer(playerIndex);
            if ((!player.getCoId()) || (this.getPlayerIndex() !== playerIndex)) {
                return null;
            }

            const configVersion             = war.getConfigVersion();
            const tileType                  = this.getType();
            const coZoneRadius              = player.getCoZoneRadius();
            const gridIndex                 = this.getGridIndex();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.selfUnitProduction;
                if (skillCfg) {
                    const tileCategory = skillCfg[2];
                    if ((tileCategory != null)                                                              &&
                        (ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, tileCategory))    &&
                        (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
                            gridIndex,
                            coSkillAreaType         : skillCfg[0],
                            getCoGridIndexArrayOnMap,
                            coZoneRadius,
                        }))
                    ) {
                        return skillCfg;
                    }
                }
            }

            return null;
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
            return this._getTemplateCfg().visionRange;
        }
        public checkIsVisionEnabledForAllPlayers(): boolean {
            return this._getTemplateCfg().isVisionEnabledForAllPlayers === 1;
        }

        public getVisionRangeForPlayer(playerIndex: number): number | null {
            if ((!this.checkIsVisionEnabledForAllPlayers()) && (this.getPlayerIndex() !== playerIndex)) {
                return null;
            }

            const war                   = this.getWar();
            const tileVisionFixedCfg    = war.getWeatherManager().getCurrentWeatherCfg().tileVisionFixed;
            if (tileVisionFixedCfg) {
                if (ConfigManager.checkIsTileTypeInCategory(war.getConfigVersion(), this.getType(), tileVisionFixedCfg[0])) {
                    return tileVisionFixedCfg[1];
                }
            }

            return Math.max(
                0,
                this.getCfgVisionRange() + war.getCommonSettingManager().getSettingsVisionRangeModifier(playerIndex),
            );
        }
        public getVisionRangeForTeamIndexes(teamIndexes: Set<number>): number | null {
            const war                   = this.getWar();
            const cfgVisionRange        = this.getCfgVisionRange();
            const tileVisionFixedCfg    = war.getWeatherManager().getCurrentWeatherCfg().tileVisionFixed;

            if (this.checkIsVisionEnabledForAllPlayers()) {
                if (tileVisionFixedCfg) {
                    if (ConfigManager.checkIsTileTypeInCategory(war.getConfigVersion(), this.getType(), tileVisionFixedCfg[0])) {
                        return tileVisionFixedCfg[1];
                    }
                }

                let maxModifier = Number.MIN_VALUE;
                war.getPlayerManager().forEachPlayer(false, player => {
                    if ((player.getAliveState() !== Types.PlayerAliveState.Dead) &&
                        (teamIndexes.has(player.getTeamIndex()))
                    ) {
                        maxModifier = Math.max(maxModifier, war.getCommonSettingManager().getSettingsVisionRangeModifier(player.getPlayerIndex()));
                    }
                });

                return Math.max(0, cfgVisionRange + maxModifier);
            }

            if (teamIndexes.has(this.getTeamIndex())) {
                if (tileVisionFixedCfg) {
                    if (ConfigManager.checkIsTileTypeInCategory(war.getConfigVersion(), this.getType(), tileVisionFixedCfg[0])) {
                        return tileVisionFixedCfg[1];
                    }
                }

                return Math.max(0, cfgVisionRange + war.getCommonSettingManager().getSettingsVisionRangeModifier(this.getPlayerIndex()));
            }

            return null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for global attack/defense bonus.
        ////////////////////////////////////////////////////////////////////////////////
        public getGlobalAttackBonus(): number | null {
            return this._getTemplateCfg().globalAttackBonus ?? null;
        }
        public getGlobalDefenseBonus(): number | null {
            return this._getTemplateCfg().globalDefenseBonus ?? null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for load co.
        ////////////////////////////////////////////////////////////////////////////////
        public getLoadCoUnitCategory(): Types.UnitCategory | null {
            return this._getTemplateCfg().loadCoUnitCategory ?? null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for map weapon.
        ////////////////////////////////////////////////////////////////////////////////
        public checkIsMapWeapon(): boolean {
            const type = this.getType();
            // TODO
            return (type === TileType.Crystal)
                || (type === TileType.CustomCrystal)
                || (type === TileType.CannonDown)
                || (type === TileType.CannonLeft)
                || (type === TileType.CannonRight)
                || (type === TileType.CannonUp)
                || (type === TileType.CustomCannon)
                || (type === TileType.LaserTurret)
                || (type === TileType.CustomLaserTurret);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for crystal data.
        ////////////////////////////////////////////////////////////////////////////////
        public getCustomCrystalData(): ITileCustomCrystalData | null {
            const tileType = this.getType();
            if (tileType === TileType.Crystal) {
                return CommonConstants.TileDefaultCrystalData;
            } else if (tileType === TileType.CustomCrystal) {
                return this._customCrystalData ?? CommonConstants.TileDefaultCrystalData;
            } else {
                return null;
            }
        }
        private _setCustomCrystalData(data: ITileCustomCrystalData | null): void {
            this._customCrystalData = data;
        }

        private _initCustomCrystalData(): void {
            if (this._customCrystalData == null) {
                this._customCrystalData = Helpers.deepClone(CommonConstants.TileDefaultCrystalData);
            }
        }
        public setCustomCrystalRadius(radius: number): void {
            this._initCustomCrystalData();
            Helpers.getExisted(this.getCustomCrystalData()).radius = radius;
        }
        public setCustomCrystalPriority(priority: number): void {
            this._initCustomCrystalData();
            Helpers.getExisted(this.getCustomCrystalData()).priority = priority;
        }
        public setCustomCrystalCanAffectSelf(canAffect: boolean): void {
            this._initCustomCrystalData();
            Helpers.getExisted(this.getCustomCrystalData()).canAffectSelf = canAffect;
        }
        public setCustomCrystalCanAffectAlly(canAffect: boolean): void {
            this._initCustomCrystalData();
            Helpers.getExisted(this.getCustomCrystalData()).canAffectAlly = canAffect;
        }
        public setCustomCrystalCanAffectEnemy(canAffect: boolean): void {
            this._initCustomCrystalData();
            Helpers.getExisted(this.getCustomCrystalData()).canAffectEnemy = canAffect;
        }
        public setCustomCrystalDeltaFund(deltaFund: number): void {
            this._initCustomCrystalData();
            Helpers.getExisted(this.getCustomCrystalData()).deltaFund = deltaFund;
        }
        public setCustomCrystalDeltaEnergyPercentage(percentage: number): void {
            this._initCustomCrystalData();
            Helpers.getExisted(this.getCustomCrystalData()).deltaEnergyPercentage = percentage;
        }
        public setCustomCrystalDeltaHp(deltaHp: number): void {
            this._initCustomCrystalData();
            Helpers.getExisted(this.getCustomCrystalData()).deltaHp = deltaHp;
        }
        public setCustomCrystalDeltaPrimaryAmmoPercentage(percentage: number): void {
            this._initCustomCrystalData();
            Helpers.getExisted(this.getCustomCrystalData()).deltaPrimaryAmmoPercentage = percentage;
        }
        public setCustomCrystalDeltaFuelPercentage(percentage: number): void {
            this._initCustomCrystalData();
            Helpers.getExisted(this.getCustomCrystalData()).deltaFuelPercentage = percentage;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for cannon data.
        ////////////////////////////////////////////////////////////////////////////////
        public getCustomCannonData(): ITileCustomCannonData | null {
            const tileType = this.getType();
            if (tileType === TileType.CannonDown) {
                return CommonConstants.TileDefaultCannonDownData;
            } else if (tileType === TileType.CannonLeft) {
                return CommonConstants.TileDefaultCannonLeftData;
            } else if (tileType === TileType.CannonUp) {
                return CommonConstants.TileDefaultCannonUpData;
            } else if (tileType === TileType.CannonRight) {
                return CommonConstants.TileDefaultCannonRightData;
            } else if (tileType === TileType.CustomCannon) {
                return this._customCannonData ?? CommonConstants.TileDefaultCustomCannonData;
            } else {
                return null;
            }
        }
        private _setCustomCannonData(data: ITileCustomCannonData | null): void {
            this._customCannonData = data;
        }

        public checkIsNormalCannon(): boolean {
            const tileType = this.getType();
            return (tileType === TileType.CannonRight)
                || (tileType === TileType.CannonUp)
                || (tileType === TileType.CannonLeft)
                || (tileType === TileType.CannonDown);
        }
        private _initCustomCannonData(): void {
            if (this._customCannonData == null) {
                this._customCannonData = Helpers.deepClone(CommonConstants.TileDefaultCustomCannonData);
            }
        }

        public setCustomCannonRangeForUp(radius: number): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonRangeForUp_00).rangeForUp = radius;
        }
        public setCustomCannonRangeForDown(radius: number): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonRangeForDown_00).rangeForDown = radius;
        }
        public setCustomCannonRangeForLeft(radius: number): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonRangeForLeft_00).rangeForLeft = radius;
        }
        public setCustomCannonRangeForRight(radius: number): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonRangeForRight_00).rangeForRight = radius;
        }

        public setCustomCannonPriority(priority: number): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonPriority_00).priority = priority;
        }
        public setCustomCannonMaxTargetCount(count: number): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonMaxTargetCount_00).maxTargetCount = count;
        }

        public setCustomCannonCanAffectSelf(canAffect: boolean): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonCanAffectSelf_00).canAffectSelf = canAffect;
        }
        public setCustomCannonCanAffectAlly(canAffect: boolean): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonCanAffectAlly_00).canAffectAlly = canAffect;
        }
        public setCustomCannonCanAffectEnemy(canAffect: boolean): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonCanAffectEnemy_00).canAffectEnemy = canAffect;
        }

        public setCustomCannonDeltaHp(deltaHp: number): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonDeltaHp_00).deltaHp = deltaHp;
        }
        public setCustomCannonDeltaPrimaryAmmoPercentage(percentage: number): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonDeltaPrimaryAmmoPercentage_00).deltaPrimaryAmmoPercentage = percentage;
        }
        public setCustomCannonDeltaFuelPercentage(percentage: number): void {
            this._initCustomCannonData();
            Helpers.getExisted(this.getCustomCannonData(), ClientErrorCode.BwTile_SetCustomCannonDeltaFuelPercentage_00).deltaFuelPercentage = percentage;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for cannon data.
        ////////////////////////////////////////////////////////////////////////////////
        public getCustomLaserTurretData(): ITileCustomLaserTurretData | null {
            const tileType = this.getType();
            if (tileType === TileType.LaserTurret) {
                return CommonConstants.TileDefaultCustomLaserTurretData;
            } else if (tileType === TileType.CustomLaserTurret) {
                return this._customLaserTurretData ?? CommonConstants.TileDefaultCustomLaserTurretData;
            } else {
                return null;
            }
        }
        private _setCustomLaserTurretData(data: ITileCustomLaserTurretData | null): void {
            this._customLaserTurretData = data;
        }

        private _initCustomLaserTurretData(): void {
            if (this._customLaserTurretData == null) {
                this._customLaserTurretData = Helpers.deepClone(CommonConstants.TileDefaultCustomLaserTurretData);
            }
        }

        public setCustomLaserTurretRangeForUp(radius: number): void {
            this._initCustomLaserTurretData();
            Helpers.getExisted(this.getCustomLaserTurretData(), ClientErrorCode.BwTile_SetCustomLaserTurretRangeForUp_00).rangeForUp = radius;
        }
        public setCustomLaserTurretRangeForDown(radius: number): void {
            this._initCustomLaserTurretData();
            Helpers.getExisted(this.getCustomLaserTurretData(), ClientErrorCode.BwTile_SetCustomLaserTurretRangeForDown_00).rangeForDown = radius;
        }
        public setCustomLaserTurretRangeForLeft(radius: number): void {
            this._initCustomLaserTurretData();
            Helpers.getExisted(this.getCustomLaserTurretData(), ClientErrorCode.BwTile_SetCustomLaserTurretRangeForLeft_00).rangeForLeft = radius;
        }
        public setCustomLaserTurretRangeForRight(radius: number): void {
            this._initCustomLaserTurretData();
            Helpers.getExisted(this.getCustomLaserTurretData(), ClientErrorCode.BwTile_SetCustomLaserTurretRangeForRight_00).rangeForRight = radius;
        }

        public setCustomLaserTurretPriority(priority: number): void {
            this._initCustomLaserTurretData();
            Helpers.getExisted(this.getCustomLaserTurretData(), ClientErrorCode.BwTile_SetCustomLaserTurretPriority_00).priority = priority;
        }

        public setCustomLaserTurretCanAffectSelf(canAffect: boolean): void {
            this._initCustomLaserTurretData();
            Helpers.getExisted(this.getCustomLaserTurretData(), ClientErrorCode.BwTile_SetCustomLaserTurretCanAffectSelf_00).canAffectSelf = canAffect;
        }
        public setCustomLaserTurretCanAffectAlly(canAffect: boolean): void {
            this._initCustomLaserTurretData();
            Helpers.getExisted(this.getCustomLaserTurretData(), ClientErrorCode.BwTile_SetCustomLaserTurretCanAffectAlly_00).canAffectAlly = canAffect;
        }
        public setCustomLaserTurretCanAffectEnemy(canAffect: boolean): void {
            this._initCustomLaserTurretData();
            Helpers.getExisted(this.getCustomLaserTurretData(), ClientErrorCode.BwTile_SetCustomLaserTurretCanAffectEnemy_00).canAffectEnemy = canAffect;
        }

        public setCustomLaserTurretDeltaHp(deltaHp: number): void {
            this._initCustomLaserTurretData();
            Helpers.getExisted(this.getCustomLaserTurretData(), ClientErrorCode.BwTile_SetCustomLaserTurretDeltaHp_00).deltaHp = deltaHp;
        }
        public setCustomLaserTurretDeltaPrimaryAmmoPercentage(percentage: number): void {
            this._initCustomLaserTurretData();
            Helpers.getExisted(this.getCustomLaserTurretData(), ClientErrorCode.BwTile_SetCustomLaserTurretDeltaPrimaryAmmoPercentage_00).deltaPrimaryAmmoPercentage = percentage;
        }
        public setCustomLaserTurretDeltaFuelPercentage(percentage: number): void {
            this._initCustomLaserTurretData();
            Helpers.getExisted(this.getCustomLaserTurretData(), ClientErrorCode.BwTile_SetCustomLaserTurretDeltaFuelPercentage_00).deltaFuelPercentage = percentage;
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

        public getTileThemeType(): Types.TileThemeType {
            const war           = this.getWar();
            const weatherType   = war.getWeatherManager().getCurrentWeatherType();
            if (weatherType === Types.WeatherType.Rainy) {
                return Types.TileThemeType.Rainy;
            } else if (weatherType === Types.WeatherType.Sandstorm) {
                return Types.TileThemeType.Sandstorm;
            } else if (weatherType === Types.WeatherType.Snowy) {
                return Types.TileThemeType.Snowy;
            } else {
                return Types.TileThemeType.Clear;
            }
        }
    }
}

// export default TwnsBwTile;
