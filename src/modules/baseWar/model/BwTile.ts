
import TwnsClientErrorCode  from "../../tools/helpers/ClientErrorCode";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import GridIndexHelpers     from "../../tools/helpers/GridIndexHelpers";
import Logger               from "../../tools/helpers/Logger";
import Types                from "../../tools/helpers/Types";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import WarCommonHelpers     from "../../tools/warHelpers/WarCommonHelpers";
import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
import TwnsBwTileView       from "../view/BwTileView";
import TwnsBwPlayer         from "./BwPlayer";
import TwnsBwUnit           from "./BwUnit";
import TwnsBwWar            from "./BwWar";

namespace TwnsBwTile {
    import TileType         = Types.TileType;
    import TileObjectType   = Types.TileObjectType;
    import TileBaseType     = Types.TileBaseType;
    import TileTemplateCfg  = Types.TileTemplateCfg;
    import UnitCategory     = Types.UnitCategory;
    import ISerialTile      = ProtoTypes.WarSerialization.ISerialTile;
    import ClientErrorCode  = TwnsClientErrorCode.ClientErrorCode;
    import BwUnit           = TwnsBwUnit.BwUnit;
    import BwTileView       = TwnsBwTileView.BwTileView;
    import BwWar            = TwnsBwWar.BwWar;

    export class BwTile {
        private _templateCfg?           : TileTemplateCfg;
        private _gridX?                 : number;
        private _gridY?                 : number;
        private _playerIndex?           : number;
        private _baseType?              : Types.TileBaseType;
        private _objectType?            : TileObjectType;

        private _baseShapeId?           : number | null;
        private _objectShapeId?         : number | null;
        private _currentHp?             : number;
        private _currentBuildPoint?     : number;
        private _currentCapturePoint?   : number;

        private readonly _view  = new BwTileView();
        private _hasFog         = false;
        private _war?           : BwWar;

        public init(data: ISerialTile, configVersion: string): ClientErrorCode {
            const deserializeError = this.deserialize(data, configVersion);
            if (deserializeError) {
                return deserializeError;
            }

            this.setHasFog(false);

            return ClientErrorCode.NoError;
        }
        public fastInit(data: ISerialTile, configVersion: string): ClientErrorCode {
            return this.init(data, configVersion);
        }

        public startRunning(war: BwWar): void {
            this._setWar(war);
        }
        public startRunningView(): void {
            this.flushDataToView();
        }

        public deserialize(data: ISerialTile, configVersion: string): ClientErrorCode {
            const gridIndex = GridIndexHelpers.convertGridIndex(data.gridIndex);
            if (gridIndex == null) {
                return ClientErrorCode.BwTileDeserialize00;
            }

            const gridX = gridIndex.x;
            const gridY = gridIndex.y;
            if ((gridX < 0)                                                 ||
                (gridY < 0)                                                 ||
                ((gridX + 1) * (gridY + 1) > CommonConstants.MapMaxGridsCount)
            ) {
                return ClientErrorCode.BwTileDeserialize01;
            }

            const objectType = data.objectType as TileObjectType;
            if (objectType == null) {
                return ClientErrorCode.BwTileDeserialize02;
            }

            const baseType = data.baseType as TileBaseType;
            if (baseType == null) {
                return ClientErrorCode.BwTileDeserialize03;
            }

            const playerIndex = data.playerIndex;
            if ((playerIndex == null)                                                           ||
                (!ConfigManager.checkIsValidPlayerIndexForTile(playerIndex, baseType, objectType))
            ) {
                return ClientErrorCode.BwTileDeserialize04;
            }

            const templateCfg = ConfigManager.getTileTemplateCfg(configVersion, baseType, objectType);
            if (templateCfg == null) {
                return ClientErrorCode.BwTileDeserialize05;
            }

            if (ConfigManager.getMoveCostCfg(configVersion, baseType, objectType) == null) {
                return ClientErrorCode.BwTileDeserialize06;
            }

            const maxBuildPoint     = templateCfg.maxBuildPoint;
            const currentBuildPoint = data.currentBuildPoint;
            if (maxBuildPoint == null) {
                if (currentBuildPoint != null) {
                    return ClientErrorCode.BwTileDeserialize07;
                }
            } else {
                if ((currentBuildPoint != null)                                     &&
                    ((currentBuildPoint > maxBuildPoint) || (currentBuildPoint < 0))
                ) {
                    return ClientErrorCode.BwTileDeserialize08;
                }
            }

            const maxCapturePoint       = templateCfg.maxCapturePoint;
            const currentCapturePoint   = data.currentCapturePoint;
            if (maxCapturePoint == null) {
                if (currentCapturePoint != null) {
                    return ClientErrorCode.BwTileDeserialize09;
                }
            } else {
                if ((currentCapturePoint != null)                                       &&
                    ((currentCapturePoint > maxCapturePoint) || (currentCapturePoint < 0))
                ) {
                    return ClientErrorCode.BwTileDeserialize10;
                }
            }

            const maxHp     = templateCfg.maxHp;
            const currentHp = data.currentHp;
            if (maxHp == null) {
                if (currentHp != null) {
                    return ClientErrorCode.BwTileDeserialize11;
                }
            } else {
                if ((currentHp != null)                     &&
                    ((currentHp > maxHp) || (currentHp < 0))
                ) {
                    return ClientErrorCode.BwTileDeserialize12;
                }
            }

            const baseShapeId = data.baseShapeId;
            if (!ConfigManager.checkIsValidTileBaseShapeId(baseType, baseShapeId)) {
                return ClientErrorCode.BwTileDeserialize13;
            }

            const objectShapeId = data.objectShapeId;
            if (!ConfigManager.checkIsValidTileObjectShapeId(objectType, objectShapeId)) {
                return ClientErrorCode.BwTileDeserialize14;
            }

            this._setTemplateCfg(templateCfg);
            this._setGridX(gridX);
            this._setGridY(gridY);
            this._setBaseType(baseType);
            this._setObjectType(objectType);
            this._setPlayerIndex(playerIndex);

            this._setBaseShapeId(baseShapeId);
            this._setObjectShapeId(objectShapeId);
            this.setCurrentHp(getRevisedCurrentHp(currentHp, templateCfg));
            this.setCurrentBuildPoint(getRevisedCurrentBuildPoint(currentBuildPoint, templateCfg));
            this.setCurrentCapturePoint(getRevisedCurrentCapturePoint(currentCapturePoint, templateCfg));

            return ClientErrorCode.NoError;
        }
        public serialize(): ISerialTile | undefined {
            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwTile.serialize() empty gridIndex.`);
                return undefined;
            }

            const baseType = this.getBaseType();
            if (baseType == null) {
                Logger.error(`BwTile.serialize() empty baseType.`);
                return undefined;
            }

            const objectType = this.getObjectType();
            if (objectType == null) {
                Logger.error(`BwTile.serialize() empty objectType.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwTile.serialize() empty playerIndex.`);
                return undefined;
            }

            const data: ISerialTile = {
                gridIndex,
                baseType,
                objectType,
                playerIndex,
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

            return data;
        }
        public serializeForCreateSfw(): ISerialTile | undefined {
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.serializeForCreateSfw() empty war.`);
                return undefined;
            }

            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwTile.serializeForCreateSfw() empty gridIndex.`);
                return undefined;
            }

            if (WarVisibilityHelpers.checkIsTileVisibleToTeams(war, gridIndex, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf())) {
                const data = this.serialize();
                if (data == null) {
                    Logger.error(`BwTile.serializeForCreateSfw() empty data.`);
                    return undefined;
                }
                return data;

            } else {
                const baseType = this.getBaseType();
                if (baseType == null) {
                    Logger.error(`BwTile.serializeForCreateSfw() empty baseType.`);
                    return undefined;
                }

                const objectType = this.getObjectType();
                if (objectType == null) {
                    Logger.error(`BwTile.serializeForCreateSfw() empty objectType.`);
                    return undefined;
                }

                const playerIndex = this.getPlayerIndex();
                if (playerIndex == null) {
                    Logger.error(`BwTile.serializeForCreateSfw() empty playerIndex.`);
                    return undefined;
                }

                const data: ISerialTile = {
                    gridIndex,
                    baseType,
                    objectType,
                    playerIndex : objectType === Types.TileObjectType.Headquarters ? playerIndex : CommonConstants.WarNeutralPlayerIndex,
                };

                const currentHp = this.getCurrentHp();
                (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

                const baseShapeId = this.getBaseShapeId();
                (baseShapeId !== 0) && (data.baseShapeId = baseShapeId);

                const objectShapeId = this.getObjectShapeId();
                (objectShapeId !== 0) && (data.objectShapeId = objectShapeId);

                return data;
            }
        }
        public serializeForCreateMfr(): ISerialTile | undefined {
            return this.serializeForCreateSfw();
        }

        private _setWar(war: BwWar): void {
            this._war = war;
        }
        public getWar(): BwWar | undefined {
            return this._war;
        }

        public getConfigVersion(): string | undefined {
            const cfg = this._getTemplateCfg();
            return cfg ? cfg.version : undefined;
        }

        private _setTemplateCfg(cfg: TileTemplateCfg): void {
            this._templateCfg = cfg;
        }
        private _getTemplateCfg(): TileTemplateCfg | undefined {
            return this._templateCfg;
        }

        public updateOnUnitLeave(): void {
            this.setCurrentBuildPoint(this.getMaxBuildPoint());
            this.setCurrentCapturePoint(this.getMaxCapturePoint());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        public getView(): BwTileView {
            return this._view;
        }
        public flushDataToView(): void {
            const tileData = this.serialize();
            if (tileData == null) {
                Logger.error(`BwTile.flushDataToView() empty tileData.`);
                return;
            }

            const skinId = this.getSkinId();
            if (skinId == null) {
                Logger.error(`BwTile.flushDataToView() empty skinId.`);
                return;
            }

            const view = this.getView();
            view.setData({
                tileData,
                hasFog      : this.getHasFog(),
                skinId,
            });
            view.updateView();
        }

        private _setBaseType(baseType: TileBaseType): void {
            this._baseType = baseType;
        }
        public getBaseType(): TileBaseType | undefined {
            return this._baseType;
        }

        private _setObjectType(objectType: TileObjectType): void {
            this._objectType = objectType;
        }
        public getObjectType(): TileObjectType | undefined {
            return this._objectType;
        }

        private _setBaseShapeId(id: number | null | undefined): void {
            this._baseShapeId = id;
        }
        public getBaseShapeId(): number {
            return this._baseShapeId || 0;
        }

        private _setObjectShapeId(id: number | null | undefined): void {
            this._objectShapeId = id;
        }
        public getObjectShapeId(): number {
            return this._objectShapeId || 0;
        }

        public getSkinId(): number | undefined {
            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwTile.getSkinId() empty player.`);
                return undefined;
            }

            return player.getUnitAndTileSkinId();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hp and armor.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxHp(): number | null | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getMaxHp() templateCfg is empty.`);
                return undefined;
            }

            return cfg.maxHp;
        }

        public getCurrentHp(): number | undefined {
            return this._currentHp;
        }
        public setCurrentHp(hp: number | null | undefined): void {
            const maxHp = this.getMaxHp();
            if (maxHp == null) {
                Logger.assert(hp == null, "TileModel.setCurrentHp() error, hp: ", hp);
            } else {
                Logger.assert((hp != null) && (hp >= 0) && (hp <= maxHp), "TileModel.setCurrentHp() error, hp: ", hp);
            }

            this._currentHp = hp == null ? undefined : hp;
        }

        public getArmorType(): Types.ArmorType | null | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getArmorType() templateCfg is empty.`);
                return undefined;
            }

            return cfg.armorType;
        }

        public checkIsArmorAffectByLuck(): boolean {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.checkIsArmorAffectByLuck() templateCfg is empty.`);
                return false;
            }

            return cfg.isAffectedByLuck === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for build.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxBuildPoint(): number | null | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getMaxBuildPoint() templateCfg is empty.`);
                return undefined;
            }

            return cfg.maxBuildPoint;
        }

        public getCurrentBuildPoint(): number | undefined {
            return this._currentBuildPoint;
        }
        public setCurrentBuildPoint(point: number | null | undefined): void {
            const maxPoint = this.getMaxBuildPoint();
            if (maxPoint == null) {
                Logger.assert(point == null, "BwTile.setCurrentBuildPoint() error, point: ", point);
            } else {
                Logger.assert((point != null) && (point >= 0) && (point <= maxPoint), "BwTile.setCurrentBuildPoint() error, point: ", point);
            }

            this._currentBuildPoint = point == null ? undefined : point;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for capture.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxCapturePoint(): number | null | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getMaxCapturePoint() templateCfg is empty.`);
                return undefined;
            }

            return cfg.maxCapturePoint;
        }

        public getCurrentCapturePoint(): number | undefined {
            return this._currentCapturePoint;
        }
        public setCurrentCapturePoint(point: number | null | undefined): void {
            const maxPoint = this.getMaxCapturePoint();
            if (maxPoint == null) {
                Logger.assert(point == null, "BwTile.setCurrentCapturePoint() error, point: ", point);
            } else {
                Logger.assert((point != null) && (point >= 0) && (point <= maxPoint), "BwTile.setCurrentCapturePoint() error, point: ", point);
            }

            this._currentCapturePoint = point == null ? undefined : point;
        }

        public checkIsDefeatOnCapture(): boolean {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.checkIsDefeatOnCapture() templateCfg is empty.`);
                return false;
            }

            return cfg.isDefeatedOnCapture === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for defense amount for units.
        ////////////////////////////////////////////////////////////////////////////////
        public getNormalizedDefenseAmount(): number | undefined {
            const amount = this.getDefenseAmount();
            if (amount == null) {
                Logger.error(`BwTile.getNormalizedDefenseAmount() the amount is empty.`);
                return undefined;
            }

            return Math.floor(amount / 10);
        }
        public getDefenseAmount(): number | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getDefenseAmount() templateCfg is empty.`);
                return undefined;
            }

            return cfg.defenseAmount;
        }
        public getDefenseAmountForUnit(unit: BwUnit): number | undefined {
            const defenseAmount = this.getDefenseAmount();
            if (defenseAmount == null) {
                Logger.error(`BwTile.getDefenseAmountForUnit() the defenseAmount is empty.`);
                return undefined;
            }

            const normalizedCurrentHp = unit.getNormalizedCurrentHp();
            if (normalizedCurrentHp == null) {
                Logger.error(`BwTile.getDefenseAmountForUnit() the normalizedCurrentHp is empty.`);
                return undefined;
            }

            const normalizedMaxHp = unit.getNormalizedMaxHp();
            if (normalizedMaxHp == null) {
                Logger.error(`BwTile.getDefenseAmountForUnit() the normalizedMaxHp is empty.`);
                return undefined;
            }

            return this.checkCanDefendUnit(unit)
                ? defenseAmount * normalizedCurrentHp / normalizedMaxHp
                : 0;
        }

        public getDefenseUnitCategory(): UnitCategory | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getDefenseUnitCategory() templateCfg is empty.`);
                return undefined;
            }

            return cfg.defenseUnitCategory;
        }
        public checkCanDefendUnit(unit: BwUnit): boolean {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwTile.checkCanDefendUnit() configVersion is empty.`);
                return false;
            }

            const unitType = unit.getUnitType();
            if (unitType == null) {
                Logger.error(`BwTile.checkCanDefendUnit() unitType is empty.`);
                return false;
            }

            const unitCategory = this.getDefenseUnitCategory();
            if (unitCategory == null) {
                Logger.error(`BwTile.checkCanDefendUnit() unitCategory is empty.`);
                return false;
            }

            return ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, unitCategory);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for grid position.
        ////////////////////////////////////////////////////////////////////////////////
        private _setGridX(x: number): void {
            this._gridX = x;
        }
        public getGridX(): number | undefined {
            return this._gridX;
        }

        private _setGridY(y: number): void {
            this._gridY = y;
        }
        public getGridY(): number | undefined {
            return this._gridY;
        }

        public getGridIndex(): Types.GridIndex | undefined {
            const x = this.getGridX();
            const y = this.getGridY();
            if ((x == null) || (y == null)) {
                Logger.error(`BwTile.getGridIndex() empty gridX/gridY.`);
                return undefined;
            }

            return { x, y };
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for type.
        ////////////////////////////////////////////////////////////////////////////////
        public getType(): TileType | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getType() templateCfg is empty.`);
                return undefined;
            }

            return cfg.type;
        }

        public resetByTypeAndPlayerIndex({ baseType, objectType, playerIndex }: {
            baseType        : TileBaseType;
            objectType      : TileObjectType;
            playerIndex     : number;
        }): void {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwTile.resetByTypeAndPlayerIndex() configVersion is empty.`);
                return;
            }

            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.resetByTypeAndPlayerIndex() war is empty.`);
                return;
            }

            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwTile.resetByTypeAndPlayerIndex() empty gridIndex.`);
                return undefined;
            }

            if (!ConfigManager.checkIsValidPlayerIndexForTile(playerIndex, baseType, objectType)) {
                Logger.error(`BwTile.resetByTypeAndPlayerIndex() invalid params`);
                return undefined;
            }

            if (this.init({
                gridIndex,
                objectType,
                baseType,
                playerIndex,
                baseShapeId     : baseType === this.getBaseType() ? this.getBaseShapeId() : null,
                objectShapeId   : objectType === this.getObjectType() ? this.getObjectShapeId() : null,
            }, configVersion)) {
                Logger.error(`BwTile.resetByTypeAndPlayerIndex() failed to init!`);
                return undefined;
            }
            this.startRunning(war);
        }

        public destroyTileObject(): void {
            const tileBaseType = this.getBaseType();
            if (tileBaseType == null) {
                Logger.error(`BwTile.destroyTileObject() empty tileBaseType.`);
                return undefined;
            }

            this.resetByTypeAndPlayerIndex(
                { baseType: tileBaseType, objectType: TileObjectType.Empty, playerIndex: CommonConstants.WarNeutralPlayerIndex },
            );
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for income.
        ////////////////////////////////////////////////////////////////////////////////
        private _getCfgIncome(): number | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile._getCfgIncome() templateCfg is empty.`);
                return undefined;
            }

            return cfg.incomePerTurn || 0;
        }
        public getIncomeForPlayer(playerIndex: number): number | undefined {
            if ((this.getPlayerIndex() !== playerIndex) || (playerIndex === CommonConstants.WarNeutralPlayerIndex)) {
                return 0;
            }

            const cfgIncome = this._getCfgIncome();
            if (cfgIncome == null) {
                Logger.error(`BwTile.getIncomeForPlayer() empty cfgIncome.`);
                return undefined;
            }

            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.getIncomeForPlayer() war is empty.`);
                return undefined;
            }

            const multiplierForSettings = war.getCommonSettingManager().getSettingsIncomeMultiplier(playerIndex);
            if (multiplierForSettings == null) {
                Logger.error(`BwTile.getIncomeForPlayer() empty multiplierForSettings.`);
                return undefined;
            }

            const configVersion = war.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwTile.getIncomeForPlayer() empty configVersion.`);
                return undefined;
            }

            const player = this.getPlayer();
            if (player == null) {
                Logger.error(`BwTile.getIncomeForPlayer() empty player.`);
                return undefined;
            }

            const tileType = this.getType();
            if (tileType == null) {
                Logger.error(`BwTile.getIncomeForPlayer() empty tileType.`);
                return undefined;
            }

            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwTile.getIncomeForPlayer() empty gridIndex.`);
                return undefined;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwTile.getIncomeForPlayer() empty coZoneRadius.`);
                return undefined;
            }

            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                Logger.error(`BwTile.getIncomeForPlayer() empty coGridIndexListOnMap.`);
                return undefined;
            }

            let modifierForSkill = 1;
            for (const skillId of player.getCoCurrentSkills() || []) {
                const cfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.selfTileIncome;
                if ((cfg)                                                                                                       &&
                    (ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, cfg[1]))                                  &&
                    (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, cfg[0], coGridIndexListOnMap, coZoneRadius))
                ) {
                    modifierForSkill *= cfg[2] / 100;
                }
            }

            return Math.floor(cfgIncome * multiplierForSettings / 100 * modifierForSkill);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for player index.
        ////////////////////////////////////////////////////////////////////////////////
        private _setPlayerIndex(index: number): void {
            this._playerIndex = index;
        }
        public getPlayerIndex(): number | undefined {
            return this._playerIndex;
        }

        public getPlayer(): TwnsBwPlayer.BwPlayer | undefined {
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.getPlayer() empty war.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwTile.getPlayer() empty playerIndex.`);
                return undefined;
            }

            return war.getPlayer(playerIndex);
        }

        public getTeamIndex(): number | undefined {
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.getTeamIndex() war is empty.`);
                return undefined;
            }

            const playerIndex = this.getPlayerIndex();
            if (playerIndex == null) {
                Logger.error(`BwTile.getTeamIndex() playerIndex is empty.`);
                return undefined;
            }

            const player = war.getPlayer(playerIndex);
            if (player == null) {
                Logger.error(`BwTile.getTeamIndex() player is empty.`);
                return undefined;
            }

            return player.getTeamIndex();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move cost.
        ////////////////////////////////////////////////////////////////////////////////
        private _getMoveCostCfg(): { [moveType: number]: ProtoTypes.Config.IMoveCostCfg } | undefined {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwTile._getMoveCostCfg() empty configVersion.`);
                return undefined;
            }

            const baseType = this.getBaseType();
            if (baseType == null) {
                Logger.error(`BwTile._getMoveCostCfg() empty baseType.`);
                return undefined;
            }

            const objectType = this.getObjectType();
            if (objectType == null) {
                Logger.error(`BwTile._getMoveCostCfg() empty objectType.`);
                return undefined;
            }

            return ConfigManager.getMoveCostCfg(configVersion, baseType, objectType);
        }

        public getMoveCostByMoveType(moveType: Types.MoveType): number | undefined | null {
            const cfg = this._getMoveCostCfg();
            if (!cfg) {
                Logger.error(`BwTile.getMoveCostByMoveType() cfg is empty.`);
                return undefined;
            }

            return cfg[moveType]?.cost;
        }
        public getMoveCostByUnit(unit: BwUnit): number | undefined | null {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwTile.getMoveCostByUnit() configVersion is empty.`);
                return undefined;
            }

            const unitType = unit.getUnitType();
            if (unitType == null) {
                Logger.error(`BwTile.getMoveCostByUnit() unitType is empty.`);
                return undefined;
            }

            const moveType = unit.getMoveType();
            if (moveType == null) {
                Logger.error(`BwTile.getMoveCostByUnit() moveType is empty.`);
                return undefined;
            }

            const tileType = this.getType();
            if (((tileType === TileType.Seaport) || (tileType === TileType.TempSeaport))                        &&
                (this.getTeamIndex() !== unit.getTeamIndex())                                                   &&
                (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, Types.UnitCategory.LargeNaval))
            ) {
                return undefined;
            } else {
                return this.getMoveCostByMoveType(moveType);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for repair/supply unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getRepairUnitCategory(): Types.UnitCategory | undefined | null {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getRepairUnitCategory() templateCfg is empty.`);
                return undefined;
            }

            return cfg.repairUnitCategory;
        }

        public getCfgNormalizedRepairHp(): number | undefined | null {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getNormalizedRepairHp() templateCfg is empty.`);
                return undefined;
            }

            return cfg.repairAmount;
        }

        public checkCanRepairUnit(unit: BwUnit): boolean {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwTile.checkCanRepairUnit() configVersion is empty.`);
                return false;
            }

            const unitType = unit.getUnitType();
            if (unitType == null) {
                Logger.error(`BwTile.checkCanRepairUnit() unitType is empty.`);
                return false;
            }

            const currentHp = unit.getCurrentHp();
            const maxHp     = unit.getMaxHp();
            if ((currentHp == null) || (maxHp == null)) {
                Logger.error(`BwTile.checkCanRepairUnit() unit maxHp/currentHp is empty.`);
                return false;
            }

            const category = this.getRepairUnitCategory();
            return (category != null)
                && ((currentHp < maxHp) || (unit.checkCanBeSupplied()))
                && (unit.getTeamIndex() === this.getTeamIndex())
                && (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category));
        }
        public checkCanSupplyUnit(unit: BwUnit): boolean {
            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwTile.checkCanSupplyUnit() configVersion is empty.`);
                return false;
            }

            const unitType = unit.getUnitType();
            if (unitType == null) {
                Logger.error(`BwTile.checkCanSupplyUnit() unitType is empty.`);
                return false;
            }

            const category = this.getRepairUnitCategory();
            return (category != null)
                && (unit.checkCanBeSupplied())
                && (unit.getTeamIndex() === this.getTeamIndex())
                && (ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category));
        }

        public getRepairHpAndCostForUnit(unit: BwUnit): Types.RepairHpAndCost | undefined {
            if (!this.checkCanRepairUnit(unit)) {
                return undefined;
            }

            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.getRepairHpAndCostForUnit() war is empty.`);
                return undefined;
            }

            const unitPlayer = unit.getPlayer();
            if (unitPlayer == null) {
                Logger.error(`BwTile.getRepairHpAndCostForUnit() unitPlayer is empty.`);
                return undefined;
            }

            const fund = unitPlayer.getFund();
            if (fund == null) {
                Logger.error(`BwTile.getRepairHpAndCostForUnit() fund is empty.`);
                return undefined;
            }

            const productionCost = unit.getProductionFinalCost();
            if (productionCost == null) {
                Logger.error(`BwTile.getRepairHpAndCostForUnit() productionCost is empty.`);
                return undefined;
            }

            const currentHp             = unit.getCurrentHp();
            const normalizedMaxHp       = unit.getNormalizedMaxHp();
            if ((normalizedMaxHp == null) || (currentHp == null)) {
                Logger.error(`BwTile.getRepairHpAndCostForUnit() normalizedMaxHp/currentHp is empty.`);
                return undefined;
            }

            const cfgNormalizedRepairHp = this.getCfgNormalizedRepairHp();
            if (cfgNormalizedRepairHp == null) {
                Logger.error(`BwTile.getRepairHpAndCostForUnit() cfgNormalizedRepairHp is empty.`);
                return undefined;
            }

            const normalizedCurrentHp   = WarCommonHelpers.getNormalizedHp(currentHp);
            const normalizedRepairHp    = Math.min(
                normalizedMaxHp - normalizedCurrentHp,
                cfgNormalizedRepairHp,
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
            if (configVersion == null) {
                Logger.error(`BwTile.checkCanHideUnit() configVersion is empty.`);
                return false;
            }

            const category = this._getCfgHideUnitCategory();
            return category == null
                ? false
                : ConfigManager.checkIsUnitTypeInCategory(configVersion, unitType, category);
        }

        public checkIsUnitHider(): boolean {
            const category = this._getCfgHideUnitCategory();
            return (category != null) && (category != Types.UnitCategory.None);
        }

        private _getCfgHideUnitCategory(): Types.UnitCategory | null | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile._getCfgHideUnitCategory() templateCfg is empty.`);
                return undefined;
            }

            return cfg.hideUnitCategory;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgProduceUnitCategory(): Types.UnitCategory | undefined | null {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getCfgProduceUnitCategory() templateCfg is empty.`);
                return undefined;
            }

            return cfg.produceUnitCategory;
        }
        public getProduceUnitCategoryForPlayer(playerIndex: number): Types.UnitCategory | undefined | null {
            if (this.getPlayerIndex() !== playerIndex) {
                return null;
            } else {
                const skillCfg = this.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
                return skillCfg ? skillCfg[1] : this.getCfgProduceUnitCategory();
            }
        }

        public getEffectiveSelfUnitProductionSkillCfg(playerIndex: number): number[] | undefined {
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() war is empty.`);
                return undefined;
            }

            const playerManager = war.getPlayerManager();
            if (playerManager == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() empty playerManager.`);
                return undefined;
            }

            const player = playerManager.getPlayer(playerIndex);
            if (player == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() player is empty.`);
                return undefined;
            }

            const gridIndex = this.getGridIndex();
            if (gridIndex == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() gridIndex is empty.`);
                return undefined;
            }

            const configVersion = this.getConfigVersion();
            if (configVersion == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() configVersion is empty.`);
                return undefined;
            }

            const tileType = this.getType();
            if (tileType == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() tileType is empty.`);
                return undefined;
            }

            const unitMap = war.getUnitMap();
            if (unitMap == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() empty unitMap.`);
                return undefined;
            }

            if ((!player.getCoId()) || (this.getPlayerIndex() !== playerIndex)) {
                return undefined;
            }

            const coGridIndexListOnMap = player.getCoGridIndexListOnMap();
            if (coGridIndexListOnMap == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() empty coGridIndexListOnMap.`);
                return undefined;
            }

            const coZoneRadius = player.getCoZoneRadius();
            if (coZoneRadius == null) {
                Logger.error(`BwTile.getEffectiveSelfUnitProductionSkillCfg() empty coZoneRadius.`);
                return undefined;
            }

            for (const skillId of player.getCoCurrentSkills() || []) {
                const skillCfg = ConfigManager.getCoSkillCfg(configVersion, skillId)?.selfUnitProduction;
                if (skillCfg) {
                    const tileCategory = skillCfg[2];
                    if ((tileCategory != null)                                                                                  &&
                        (ConfigManager.checkIsTileTypeInCategory(configVersion, tileType, tileCategory))                        &&
                        (WarCommonHelpers.checkIsGridIndexInsideCoSkillArea(gridIndex, skillCfg[0], coGridIndexListOnMap, coZoneRadius))
                    ) {
                        return skillCfg;
                    }
                }
            }

            return undefined;
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
        public getCfgVisionRange(): number | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getCfgVisionRange() templateCfg is empty.`);
                return undefined;
            }

            return cfg.visionRange;
        }
        public checkIsVisionEnabledForAllPlayers(): boolean {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.checkIsVisionEnabledForAllPlayers() templateCfg is empty.`);
                return false;
            }

            return cfg.isVisionEnabledForAllPlayers === 1;
        }

        public getVisionRangeForPlayer(playerIndex: number): number | undefined {
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.getVisionRangeForPlayer() war is empty.`);
                return undefined;
            }

            const cfgVisionRange = this.getCfgVisionRange();
            if (cfgVisionRange == null) {
                Logger.error(`BwTile.getVisionRangeForPlayer() cfgVisionRange is empty.`);
                return undefined;
            }

            if ((!this.checkIsVisionEnabledForAllPlayers()) && (this.getPlayerIndex() !== playerIndex)) {
                return undefined;
            } else {
                const modifierBySettings = war.getCommonSettingManager().getSettingsVisionRangeModifier(playerIndex);
                if (modifierBySettings == null) {
                    Logger.error(`BwTile.getVisionRangeForPlayer() empty modifierBySettings.`);
                    return undefined;
                }

                return Math.max(0, cfgVisionRange + modifierBySettings);
            }
        }
        public getVisionRangeForTeamIndexes(teamIndexes: Set<number>): number | null | undefined {
            const war = this.getWar();
            if (war == null) {
                Logger.error(`BwTile.getVisionRangeForTeamIndexes() empty war.`);
                return undefined;
            }

            const cfgVisionRange = this.getCfgVisionRange();
            if (cfgVisionRange == null) {
                Logger.error(`BwTile.getVisionRangeForTeamIndexes() empty cfgVisionRange.`);
                return undefined;
            }

            if (this.checkIsVisionEnabledForAllPlayers()) {
                let maxModifier = Number.MIN_VALUE;
                war.getPlayerManager().forEachPlayer(false, player => {
                    const teamIndex = player.getTeamIndex();
                    if (teamIndex == null) {
                        Logger.error(`BwTile.getVisionRangeForTeamIndexes() empty player.teamIndex.`);
                        return undefined;
                    }

                    if ((player.getAliveState() !== Types.PlayerAliveState.Dead) &&
                        (teamIndexes.has(teamIndex))
                    ) {
                        const playerIndex = player.getPlayerIndex();
                        if (playerIndex == null) {
                            Logger.error(`BwTile.getVisionRangeForTeamIndexes() empty player.playerIndex.`);
                            return undefined;
                        }

                        const modifier = war.getCommonSettingManager().getSettingsVisionRangeModifier(playerIndex);
                        if (modifier == null) {
                            Logger.error(`BwTile.getVisionRangeForTeamIndexes() empty modifier.`);
                            return undefined;
                        }

                        maxModifier = Math.max(maxModifier, modifier);
                    }
                });

                return Math.max(0, cfgVisionRange + maxModifier);
            }

            const selfTeamIndex = this.getTeamIndex();
            if (selfTeamIndex == null) {
                Logger.error(`BwTile.getVisionRangeForTeamIndexes() empty selfTeamIndex.`);
                return undefined;
            }

            if (teamIndexes.has(selfTeamIndex)) {
                const selfPlayerIndex = this.getPlayerIndex();
                if (selfPlayerIndex == null) {
                    Logger.error(`BwTile.getVisionRangeForTeamIndexes() empty selfPlayerIndex.`);
                    return undefined;
                }

                const selfModifier = war.getCommonSettingManager().getSettingsVisionRangeModifier(selfPlayerIndex);
                if (selfModifier == null) {
                    Logger.error(`BwTile.getVisionRangeForTeamIndexes() empty selfModifier.`);
                    return undefined;
                }

                return Math.max(0, cfgVisionRange + selfModifier);
            }

            return null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for global attack/defense bonus.
        ////////////////////////////////////////////////////////////////////////////////
        public getGlobalAttackBonus(): number | null | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getGlobalAttackBonus() templateCfg is empty.`);
                return undefined;
            }

            return cfg.globalAttackBonus;
        }
        public getGlobalDefenseBonus(): number | null | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getGlobalDefenseBonus() templateCfg is empty.`);
                return undefined;
            }

            return cfg.globalDefenseBonus;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for load co.
        ////////////////////////////////////////////////////////////////////////////////
        public getLoadCoUnitCategory(): Types.UnitCategory | null | undefined {
            const cfg = this._getTemplateCfg();
            if (cfg == null) {
                Logger.error(`BwTile.getLoadCoUnitCategory() templateCfg is empty.`);
                return undefined;
            }

            return cfg.loadCoUnitCategory;
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
    }

    function getRevisedCurrentHp(currentHp: number | null | undefined, templateCfg: TileTemplateCfg): number | null | undefined {
        return currentHp != null
            ? currentHp
            : templateCfg.maxHp;
    }
    function getRevisedCurrentBuildPoint(currentBuildPoint: number | null | undefined, templateCfg: TileTemplateCfg): number | null | undefined {
        return currentBuildPoint != null
            ? currentBuildPoint
            : templateCfg.maxBuildPoint;
    }
    function getRevisedCurrentCapturePoint(currentCapturePoint: number | null | undefined, templateCfg: TileTemplateCfg): number | null | undefined {
        return currentCapturePoint != null
            ? currentCapturePoint
            : templateCfg.maxCapturePoint;
    }
}

export default TwnsBwTile;
