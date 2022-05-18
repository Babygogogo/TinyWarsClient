
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
namespace Twns.BaseWar {
    import TileType                     = Types.TileType;
    import TileObjectType               = Types.TileObjectType;
    import TileDecoratorType            = Types.TileDecoratorType;
    import TileBaseType                 = Types.TileBaseType;
    import TileTemplateCfg              = Types.TileTemplateCfg;
    import ITileCustomCrystalData       = CommonProto.WarSerialization.ITileCustomCrystalData;
    import ITileCustomCannonData        = CommonProto.WarSerialization.ITileCustomCannonData;
    import ITileCustomLaserTurretData   = CommonProto.WarSerialization.ITileCustomLaserTurretData;
    import ISerialTile                  = CommonProto.WarSerialization.ISerialTile;
    import GameConfig                   = Config.GameConfig;

    export class BwTile {
        private _gameConfig?            : GameConfig;
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
        private _locationFlags?         : number;
        private _isHighlighted?         : boolean;

        private _customCrystalData?     : ITileCustomCrystalData | null;
        private _customCannonData?      : ITileCustomCannonData | null;
        private _customLaserTurretData? : ITileCustomLaserTurretData | null;

        private readonly _view  = new BaseWar.BwTileView();
        private _hasFog         = false;
        private _war?           : BwWar;

        public init(data: ISerialTile, gameConfig: GameConfig): void {
            this.deserialize(data, gameConfig);
            this.setHasFog(false);
        }
        public fastInit(data: ISerialTile, gameConfig: GameConfig): void {
            this.init(data, gameConfig);
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }
        public startRunningView(): void {
            this.flushDataToView();
        }

        public getErrorCodeForTileData(data: ISerialTile, playersCountUnneutral: number, gameConfig: GameConfig): ClientErrorCode {
            const playerIndex = data.playerIndex;
            if ((playerIndex != null) && (playerIndex > playersCountUnneutral)) {
                return ClientErrorCode.BwTile_GetErrorCodeForTileData_00;
            }

            try {
                this.init(data, gameConfig);
            } catch (e) {
                return (e as Types.CustomError).errorCode ?? ClientErrorCode.BwTile_GetErrorCodeForTileData_01;
            }

            return ClientErrorCode.NoError;
        }
        public deserialize(data: ISerialTile, gameConfig: GameConfig): void {
            this._setGameConfig(gameConfig);

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
                (!Config.ConfigManager.checkIsValidPlayerIndexForTile(playerIndex, baseType, objectType))
            ) {
                throw Helpers.newError(`Invalid playerIndex: ${playerIndex}`, ClientErrorCode.BwTile_Deserialize_04);
            }

            const templateCfg       = Helpers.getExisted(gameConfig.getTileTemplateCfgByType(Config.ConfigManager.getTileType(baseType, objectType)));
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
            if (!Config.ConfigManager.checkIsValidTileBaseShapeId(baseType, baseShapeId)) {
                throw Helpers.newError(`Invalid baseShapeId: ${baseShapeId}`, ClientErrorCode.BwTile_Deserialize_11);
            }

            const objectShapeId = data.objectShapeId;
            if (!Config.ConfigManager.checkIsValidTileObjectShapeId(objectType, objectShapeId)) {
                throw Helpers.newError(`Invalid objectShapeId: ${objectShapeId}`, ClientErrorCode.BwTile_Deserialize_12);
            }

            const decoratorType     = data.decoratorType ?? null;
            const decoratorShapeId  = data.decoratorShapeId ?? null;
            if (!Config.ConfigManager.checkIsValidTileDecoratorShapeId(decoratorType, decoratorShapeId)) {
                throw Helpers.newError(`Invalid decoratorType/shapeId: ${decoratorType}, ${decoratorShapeId}`, ClientErrorCode.BwTile_Deserialize_13);
            }

            const tileType          = templateCfg.type;
            const customCrystalData = data.customCrystalData ?? null;
            if ((customCrystalData != null) && (tileType !== TileType.CustomCrystal)) {
                throw Helpers.newError(`CustomCrystalData is present while the tile is not CustomCrystal.`, ClientErrorCode.BwTile_Deserialize_14);
            }
            if ((customCrystalData != null) && (!Config.ConfigManager.checkIsValidCustomCrystalData(customCrystalData))) {
                throw Helpers.newError(`Invalid customCrystalData.`, ClientErrorCode.BwTile_Deserialize_15);
            }

            const customCannonData = data.customCannonData ?? null;
            if ((customCannonData != null) && (tileType !== TileType.CustomCannon)) {
                throw Helpers.newError(`CustomCannonData is present while the tile is not CustomCannon.`, ClientErrorCode.BwTile_Deserialize_16);
            }
            if ((customCannonData != null) && (!Config.ConfigManager.checkIsValidCustomCannonData(customCannonData))) {
                throw Helpers.newError(`Invalid customCannonData.`, ClientErrorCode.BwTile_Deserialize_17);
            }

            const customLaserTurretData = data.customLaserTurretData ?? null;
            if ((customLaserTurretData != null) && (tileType !== TileType.CustomLaserTurret)) {
                throw Helpers.newError(`CustomLaserTurretData is present while the tile is not CustomLaserTurret.`, ClientErrorCode.BwTile_Deserialize_18);
            }
            if ((customLaserTurretData != null) && (!Config.ConfigManager.checkIsValidCustomLaserTurretData(customLaserTurretData))) {
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
            this._setLocationFlags(data.locationFlags ?? 0);
            this.setIsHighlighted(data.isHighlighted ?? false);

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

            const locationFlags = this.getLocationFlags();
            (locationFlags !== 0) && (data.locationFlags = locationFlags);

            const isHighlighted = this.getIsHighlighted();
            (isHighlighted) && (data.isHighlighted = isHighlighted);

            return data;
        }
        public serializeForCreateSfw(): ISerialTile {
            const war       = this.getWar();
            const gridIndex = this.getGridIndex();
            if (WarHelpers.WarVisibilityHelpers.checkIsTileVisibleToTeams(war, gridIndex, war.getPlayerManager().getWatcherTeamIndexesForSelf())) {
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

                const locationFlags = this.getLocationFlags();
                (locationFlags !== 0) && (data.locationFlags = locationFlags);

                const isHighlighted = this.getIsHighlighted();
                (isHighlighted) && (data.isHighlighted = isHighlighted);

                return data;
            }
        }
        public serializeForCreateMfr(): ISerialTile {
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
        public getView(): BaseWar.BwTileView {
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
        // Functions for location flags.
        ////////////////////////////////////////////////////////////////////////////////
        private _setLocationFlags(flags: number): void {
            this._locationFlags = flags;
        }
        public getLocationFlags(): number {
            return Helpers.getExisted(this._locationFlags, ClientErrorCode.BwTile_GetLocationFlags_00);
        }

        /** @param locationId range: [1-30] */
        public getHasLocationFlag(locationId: number): boolean {
            return !!((this.getLocationFlags() >> (locationId - 1)) & 1);
        }
        /** @param locationId range: [1-30] */
        public setHasLocationFlag(locationId: number, hasFlag: boolean): void {
            if (hasFlag) {
                this._setLocationFlags(this.getLocationFlags() | (1 << (locationId - 1)));
            } else {
                this._setLocationFlags(this.getLocationFlags() & ~(1 << (locationId - 1)));
            }
            Notify.dispatch(Notify.NotifyType.BwTileLocationFlagSet, this as Notify.NotifyData.BwTileLocationFlagSet);
        }
        public setHasLocationFlagArray(locationIdArray: number[], hasFlag: boolean): void {
            for (const locationId of locationIdArray) {
                if (hasFlag) {
                    this._setLocationFlags(this.getLocationFlags() | (1 << (locationId - 1)));
                } else {
                    this._setLocationFlags(this.getLocationFlags() & ~(1 << (locationId - 1)));
                }
            }
            Notify.dispatch(Notify.NotifyType.BwTileLocationFlagSet, this as Notify.NotifyData.BwTileLocationFlagSet);
        }
        public getHasLocationFlagArray(): number[] {
            const locationIdArray: number[] = [];
            for (let locationId = CommonConstants.MapMinLocationId; locationId <= CommonConstants.MapMaxLocationId; ++locationId) {
                if (this.getHasLocationFlag(locationId)) {
                    locationIdArray.push(locationId);
                }
            }
            return locationIdArray;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for highlight.
        ////////////////////////////////////////////////////////////////////////////////
        public getIsHighlighted(): boolean {
            return Helpers.getExisted(this._isHighlighted);
        }
        public setIsHighlighted(isHighlighted: boolean): void {
            if (this._isHighlighted !== isHighlighted) {
                this._isHighlighted = isHighlighted;
                Notify.dispatch(Notify.NotifyType.BwTileIsHighlightedChanged, this as Notify.NotifyData.BwTileIsHighlightChanged);
            }
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
        public getDefenseAmountForUnit(unit: BwUnit): number {
            return this.checkCanDefendUnit(unit)
                ? this.getDefenseAmount() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp()
                : 0;
        }

        public getDefenseUnitCategory(): Types.UnitCategory {
            return this._getTemplateCfg().defenseUnitCategory;
        }
        public checkCanDefendUnit(unit: BwUnit): boolean {
            return this.getGameConfig().checkIsUnitTypeInCategory(unit.getUnitType(), this.getDefenseUnitCategory());
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
            if (!Config.ConfigManager.checkIsValidPlayerIndexForTile(playerIndex, baseType, objectType)) {
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
                locationFlags   : this.getLocationFlags(),
                isHighlighted   : this.getIsHighlighted(),
            }, this.getGameConfig());
            this.startRunning(this.getWar());
        }

        public resetOnTileObjectDestroyed(): void {
            this.init({
                gridIndex       : this.getGridIndex(),
                playerIndex     : CommonConstants.WarNeutralPlayerIndex,
                baseType        : this.getBaseType(),
                baseShapeId     : this.getBaseShapeId(),
                objectType      : TileObjectType.Empty,
                objectShapeId   : getNewObjectShapeIdOnObjectDestroyed(this.getObjectType(), this.getObjectShapeId()),
                decoratorType   : this.getDecoratorType(),
                decoratorShapeId: this.getDecoratorShapeId(),
                locationFlags   : this.getLocationFlags(),
                isHighlighted   : this.getIsHighlighted(),
            }, this.getGameConfig());
            this.startRunning(this.getWar());
        }

        public deleteTileDecorator(): void {
            this._setDecoratorType(null);
            this._setDecoratorShapeId(null);
        }
        public deleteTileObject(): void {
            this.init({
                gridIndex       : this.getGridIndex(),
                playerIndex     : CommonConstants.WarNeutralPlayerIndex,
                baseType        : this.getBaseType(),
                baseShapeId     : this.getBaseShapeId(),
                objectType      : TileObjectType.Empty,
                objectShapeId   : null,
                decoratorType   : this.getDecoratorType(),
                decoratorShapeId: this.getDecoratorShapeId(),
                locationFlags   : this.getLocationFlags(),
                isHighlighted   : this.getIsHighlighted(),
            }, this.getGameConfig());
            this.startRunning(this.getWar());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for income.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgIncome(): number {
            return this._getTemplateCfg().incomePerTurn ?? 0;
        }
        public getIncomeForPlayer(playerIndex: number): number {
            if (this.getPlayerIndex() !== playerIndex) {
                return 0;
            }

            const war                       = this.getWar();
            const gameConfig                = war.getGameConfig();
            const player                    = this.getPlayer();
            const tileType                  = this.getType();
            const gridIndex                 = this.getGridIndex();
            const coZoneRadius              = player.getCoZoneRadius();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            let modifierForSkill            = 1;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = gameConfig.getCoSkillCfg(skillId)?.selfTileIncome;
                if ((cfg)                                                       &&
                    (gameConfig.checkIsTileTypeInCategory(tileType, cfg[1]))    &&
                    (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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

        public getPlayer(): BwPlayer {
            return this.getWar().getPlayer(this.getPlayerIndex());
        }

        public getTeamIndex(): number {
            return this.getWar().getPlayer(this.getPlayerIndex()).getTeamIndex();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move cost.
        ////////////////////////////////////////////////////////////////////////////////
        private _getMoveCostCfg(): { [moveType: number]: Types.MoveCostCfg } {
            return Helpers.getExisted(this.getGameConfig().getMoveCostCfg(Config.ConfigManager.getTileType(this.getBaseType(), this.getObjectType())));
        }

        public getMoveCostByMoveType(moveType: Types.MoveType): number | null {
            return this._getMoveCostCfg()[moveType]?.cost ?? null;
        }
        public getMoveCostByUnit(unit: BwUnit): number | null {
            const tileType      = this.getType();
            const unitType      = unit.getUnitType();
            const war           = this.getWar();
            const gameConfig = war.getGameConfig();
            if (((tileType === TileType.Seaport) || (tileType === TileType.TempSeaport))        &&
                (this.getTeamIndex() !== unit.getTeamIndex())                                   &&
                (gameConfig.checkIsUnitTypeInCategory(unitType, Types.UnitCategory.LargeNaval))
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
                const cfg = gameConfig.getCoSkillCfg(skillId)?.selfUnitMoveCost;
                if ((cfg)                                                       &&
                    (gameConfig.checkIsUnitTypeInCategory(unitType, cfg[1]))    &&
                    (gameConfig.checkIsTileTypeInCategory(tileType, cfg[2]))    &&
                    (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
                    amountModifier      += cfg[1];
                    costMultiplierPct   = costMultiplierPct * cfg[3] / 100;
                }
            }

            return { amountModifier, costMultiplierPct };
        }

        public checkCanRepairUnit(unit: BwUnit): boolean {
            const category = this.getRepairUnitCategory();
            return (category != null)
                && ((unit.getCurrentHp() < unit.getMaxHp()) || (unit.checkCanBeSupplied()))
                && (unit.getTeamIndex() === this.getTeamIndex())
                && (this.getGameConfig().checkIsUnitTypeInCategory(unit.getUnitType(), category));
        }
        public checkCanSupplyUnit(unit: BwUnit): boolean {
            const category = this.getRepairUnitCategory();
            return (category != null)
                && (unit.checkCanBeSupplied())
                && (unit.getTeamIndex() === this.getTeamIndex())
                && (this.getGameConfig().checkIsUnitTypeInCategory(unit.getUnitType(), category));
        }

        public getRepairHpAndCostForUnit(unit: BwUnit): Types.RepairHpAndCost | null {
            if (!this.checkCanRepairUnit(unit)) {
                return null;
            }

            const cfgNormalizedRepairHp = this.getCfgNormalizedRepairHp();
            if (cfgNormalizedRepairHp == null) {
                throw Helpers.newError(`Empty cfgNormalizedRepairHp`);
            }

            const modifier              = this.getNormalizedRepairAmountAndCostModifier();
            const productionCost        = Math.floor(unit.getProductionFinalCost() * modifier.costMultiplierPct / 100);
            const currentHp             = unit.getCurrentHp();
            const normalizedMaxHp       = unit.getNormalizedMaxHp();
            const normalizedCurrentHp   = WarHelpers.WarCommonHelpers.getNormalizedHp(currentHp);
            const normalizedRepairHp    = Math.min(
                normalizedMaxHp - normalizedCurrentHp,
                cfgNormalizedRepairHp + modifier.amountModifier,
                productionCost > 0
                    ? Math.floor(Math.max(0, unit.getPlayer().getFund()) * normalizedMaxHp / productionCost)
                    : Number.MAX_SAFE_INTEGER,
            );
            return {
                hp  : (normalizedRepairHp + normalizedCurrentHp) * CommonConstants.UnitHpNormalizer - currentHp,
                cost: Math.floor(normalizedRepairHp * productionCost / normalizedMaxHp),
            };
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hide unit.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanHideUnit(unitType: number): boolean {
            const category = this.getCfgHideUnitCategory();
            return category == null
                ? false
                : this.getGameConfig().checkIsUnitTypeInCategory(unitType, category);
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

            const gameConfig                = war.getGameConfig();
            const tileType                  = this.getType();
            const coZoneRadius              = player.getCoZoneRadius();
            const gridIndex                 = this.getGridIndex();
            const getCoGridIndexArrayOnMap  = Helpers.createLazyFunc(() => player.getCoGridIndexListOnMap());
            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = gameConfig.getCoSkillCfg(skillId)?.selfUnitProduction;
                if (skillCfg) {
                    const tileCategory = skillCfg[2];
                    if ((tileCategory != null)                                          &&
                        (gameConfig.checkIsTileTypeInCategory(tileType, tileCategory))  &&
                        (WarHelpers.WarCommonHelpers.checkIsGridIndexInsideCoSkillArea({
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
                if (war.getGameConfig().checkIsTileTypeInCategory(this.getType(), tileVisionFixedCfg[0])) {
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
            const gameConfig            = war.getGameConfig();
            if (this.checkIsVisionEnabledForAllPlayers()) {
                if (tileVisionFixedCfg) {
                    if (gameConfig.checkIsTileTypeInCategory(this.getType(), tileVisionFixedCfg[0])) {
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
                    if (gameConfig.checkIsTileTypeInCategory(this.getType(), tileVisionFixedCfg[0])) {
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

    function getNewObjectShapeIdOnObjectDestroyed(oldType: TileObjectType, oldShapeId: number): number {
        if ((oldType === TileObjectType.CannonDown)         ||
            (oldType === TileObjectType.CannonLeft)         ||
            (oldType === TileObjectType.CannonRight)        ||
            (oldType === TileObjectType.CannonUp)           ||
            (oldType === TileObjectType.CustomCannon)       ||
            (oldType === TileObjectType.CustomCrystal)      ||
            (oldType === TileObjectType.CustomLaserTurret)  ||
            (oldType === TileObjectType.Meteor)             ||
            (oldType === TileObjectType.Crystal)            ||
            (oldType === TileObjectType.LaserTurret)
        ) {
            return 3;
        } else if (oldType === TileObjectType.PipeJoint) {
            if (oldShapeId === 0) {
                return 1;
            } else if (oldShapeId === 1) {
                return 2;
            } else {
                // throw Helpers.newError(`Invalid oldType and oldShapeId: ${oldType}, ${oldShapeId}`, ServerErrorCode.BwTile_GetNewObjectShapeIdOnObjectDestroyed_0000);
                return 0;
            }
        } else {
            return 0;
        }
    }
}

// export default TwnsBwTile;
