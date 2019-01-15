
namespace TinyWars.MultiCustomWar {
    import Types            = Utility.Types;
    import IdConverter      = Utility.IdConverter;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import Logger           = Utility.Logger;
    import Visibility       = Utility.VisibilityCalculator;
    import SerializedMcTile = Types.SerializedMcTile;
    import TileType         = Types.TileType;
    import TileObjectType   = Types.TileObjectType;

    export class McTile {
        private _configVersion  : number;
        private _templateCfg    : Types.TileTemplateCfg;
        private _moveCostCfg    : { [moveType: number]: Types.MoveCostCfg };
        private _gridX          : number;
        private _gridY          : number;
        private _baseViewId     : number;
        private _objectViewId   : number;
        private _baseType       : Types.TileBaseType;
        private _objectType     : TileObjectType;
        private _playerIndex    : number;

        private _currentHp          : number | undefined;
        private _currentBuildPoint  : number | undefined;
        private _currentCapturePoint: number | undefined;

        private _war    : McWar;

        public constructor() {
        }

        public init(data: SerializedMcTile, configVersion: number): McTile {
            const t = IdConverter.getTileObjectTypeAndPlayerIndex(data.objectViewId!);
            Logger.assert(t, "TileModel.deserialize() invalid SerializedTile! ", data);

            this._configVersion = configVersion;
            this._setGridX(data.gridX);
            this._setGridY(data.gridY);
            this._setBaseViewId(data.baseViewId);
            this._setObjectViewId(data.objectViewId);
            this._baseType      = IdConverter.getTileBaseType(data.baseViewId);
            this._objectType    = t.tileObjectType;
            this._setPlayerIndex(t.playerIndex);
            this._templateCfg   = ConfigManager.getTileTemplateCfg(configVersion, this._baseType, this._objectType);
            this._moveCostCfg   = ConfigManager.getMoveCostCfg(configVersion, this._baseType, this._objectType);
            this.setCurrentHp(          data.currentHp           != null ? data.currentHp           : this.getMaxHp());
            this.setCurrentBuildPoint(  data.currentBuildPoint   != null ? data.currentBuildPoint   : this.getMaxBuildPoint());
            this.setCurrentCapturePoint(data.currentCapturePoint != null ? data.currentCapturePoint : this.getMaxCapturePoint());

            return this;
        }

        public startRunning(war: McWar): void {
            this._war = war;
        }

        public serialize(): SerializedMcTile {
            const data: SerializedMcTile = {
                gridX         : this._gridX,
                gridY         : this._gridY,
                baseViewId    : this._baseViewId,
                objectViewId  : this._objectViewId,
            };

            const currentHp = this.getCurrentHp();
            (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

            const buildPoint = this.getCurrentBuildPoint();
            (buildPoint !== this.getMaxBuildPoint()) && (data.currentBuildPoint = buildPoint);

            const capturePoint = this.getCurrentCapturePoint();
            (capturePoint !== this.getMaxCapturePoint()) && (data.currentCapturePoint = capturePoint);

            return data;
        }

        public serializeForPlayer(playerIndex: number): SerializedMcTile {
            if (Visibility.checkIsTileVisibleToPlayer(this._war, this.getGridIndex(), playerIndex)) {
                return this.serialize();
            } else if (this.getType() === TileType.Headquarters) {
                return {
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    baseViewId  : this.getBaseViewId(),
                    objectViewId: this.getObjectViewId(),
                }
            } else if (this.getPlayerIndex() !== 0) {
                return {
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    baseViewId  : this.getBaseViewId(),
                    objectViewId: this.getNeutralObjectViewId(),
                }
            } else {
                const currentHp = this.getCurrentHp();
                return {
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    baseViewId  : this.getBaseViewId(),
                    objectViewId: this.getObjectViewId(),
                    currentHp   : currentHp == this.getMaxHp() ? undefined : currentHp,
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        private _setBaseViewId(id: number): void {
            this._baseViewId = id;
        }
        public getBaseViewId(): number {
            return this._baseViewId;
        }

        private _setObjectViewId(id: number): void {
            this._objectViewId = id;
        }
        public getObjectViewId(): number {
            return this._objectViewId;
        }
        public getNeutralObjectViewId(): number {
            return this.getObjectViewId() - this.getPlayerIndex();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hp and armor.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxHp(): number | undefined {
            return this._templateCfg.maxHp;
        }

        public getNormalizedCurrentHp(): number | undefined {
            const currentHp = this.getCurrentHp();
            return currentHp != null ? Helpers.getNormalizedHp(currentHp) : undefined;
        }
        public getCurrentHp(): number | undefined {
            return this._currentHp;
        }
        public setCurrentHp(hp: number | undefined): void {
            const maxHp = this.getMaxHp();
            if (maxHp == null) {
                Logger.assert(hp == null, "TileModel.setCurrentHp() error, hp: ", hp);
            } else {
                Logger.assert((hp != null) && (hp >= 0) && (hp <= maxHp), "TileModel.setCurrentHp() error, hp: ", hp);
            }

            this._currentHp = hp;
        }

        public getArmorType(): Types.ArmorType | undefined {
            return this._templateCfg.armorType;
        }

        public checkIsArmorAffectByLuck(): boolean {
            return this._templateCfg.isAffectedByLuck === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for build.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxBuildPoint(): number | undefined {
            return this._templateCfg.maxBuildPoint;
        }

        public getCurrentBuildPoint(): number | undefined {
            return this._currentBuildPoint;
        }
        public setCurrentBuildPoint(point: number | undefined): void {
            const maxPoint = this.getMaxBuildPoint();
            if (maxPoint == null) {
                Logger.assert(point == null, "TileModel.setCurrentBuildPoint() error, point: ", point);
            } else {
                Logger.assert((point != null) && (point >= 0) && (point <= maxPoint), "TileModel.setCurrentBuildPoint() error, point: ", point);
            }

            this._currentBuildPoint = point;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for capture.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxCapturePoint(): number | undefined {
            return this._templateCfg.maxCapturePoint;
        }

        public getCurrentCapturePoint(): number | undefined {
            return this._currentCapturePoint;
        }
        public setCurrentCapturePoint(point: number | undefined): void {
            const maxPoint = this.getMaxCapturePoint();
            if (maxPoint == null) {
                Logger.assert(point == null, "TileModel.setCurrentCapturePoint() error, point: ", point);
            } else {
                Logger.assert((point != null) && (point >= 0) && (point <= maxPoint), "TileModel.setCurrentCapturePoint() error, point: ", point);
            }

            this._currentCapturePoint = point;
        }

        public checkIsDefeatOnCapture(): boolean {
            return this._templateCfg.isDefeatedOnCapture === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for defense amount for units.
        ////////////////////////////////////////////////////////////////////////////////
        public getNormalizedDefenseAmount(): number {
            return Math.floor(this.getDefenseAmount() / 10);
        }
        public getDefenseAmount(): number {
            return this._templateCfg.defenseAmount;
        }
        public getDefenseAmountForUnit(unit: McUnit): number {
            return this.checkCanDefendUnit(unit) ? this.getDefenseAmount() : 0;
        }

        public getDefenseUnitCategory(): Types.UnitCategory {
            return this._templateCfg.defenseUnitCategory;
        }
        public checkCanDefendUnit(unit: McUnit): boolean {
            const cfg = ConfigManager.getUnitTypesByCategory(this._configVersion, this.getDefenseUnitCategory());
            return (cfg != null) && (cfg.indexOf(unit.getType()) >= 0);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for grid position.
        ////////////////////////////////////////////////////////////////////////////////
        private _setGridX(x: number): void {
            this._gridX = x;
        }
        public getGridX(): number {
            return this._gridX;
        }

        private _setGridY(y: number): void {
            this._gridY = y;
        }
        public getGridY(): number {
            return this._gridY;
        }

        public getGridIndex(): Types.GridIndex {
            return { x: this.getGridX(), y: this.getGridY() };
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for type.
        ////////////////////////////////////////////////////////////////////////////////
        public getType(): TileType {
            return this._templateCfg.type;
        }

        public resetByObjectViewIdAndBaseViewId(objectViewId: number, baseViewId = this.getBaseViewId()): void {
            this.init({
                gridX       : this.getGridX(),
                gridY       : this.getGridY(),
                objectViewId: objectViewId,
                baseViewId  : baseViewId,
            }, this._configVersion);

            this.startRunning(this._war);
        }

        public resetByPlayerIndex(playerIndex: number): void {
            if (this.getType() === TileType.Headquarters) {
                this.init({
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    objectViewId: IdConverter.getTileObjectViewId(TileObjectType.City, playerIndex)!,
                    baseViewId  : this.getBaseViewId(),
                }, this._configVersion);
            } else {
                this.init({
                    gridX       : this.getGridX(),
                    gridY       : this.getGridY(),
                    objectViewId: this.getNeutralObjectViewId() + playerIndex,
                    baseViewId  : this.getBaseViewId(),
                }, this._configVersion);
            }

            this.startRunning(this._war);
        }

        public destroyTileObject(): void {
            this.resetByObjectViewIdAndBaseViewId(0);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for income.
        ////////////////////////////////////////////////////////////////////////////////
        public getIncomeAmountPerTurn(): number | undefined {
            return this._templateCfg.incomePerTurn;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for player index.
        ////////////////////////////////////////////////////////////////////////////////
        private _setPlayerIndex(index: number): void {
            this._playerIndex = index;
        }
        public getPlayerIndex(): number {
            return this._playerIndex;
        }

        public getTeamIndex(): number | undefined {
            const playerIndex = this.getPlayerIndex();
            return playerIndex === 0
                ? undefined
                : this._war.getPlayer(playerIndex)!.getTeamIndex();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move cost.
        ////////////////////////////////////////////////////////////////////////////////
        public getMoveCosts(): { [moveType: number]: Types.MoveCostCfg } {
            return this._moveCostCfg;
        }

        public getMoveCost(moveType: Types.MoveType): number | undefined {
            return this.getMoveCosts()[moveType].cost;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for repair unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getRepairUnitCategory(): Types.UnitCategory | undefined {
            return this._templateCfg.repairUnitCategory;
        }

        public getRepairAmount(): number | undefined {
            return this._templateCfg.repairAmount;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hide unit.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanHideUnit(unitType: Types.UnitType): boolean {
            const category = this._templateCfg.hideUnitCategory;
            return category == null
                ? false
                : ConfigManager.getUnitTypesByCategory(this._configVersion, category).indexOf(unitType) >= 0;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getProduceUnitCategory(): Types.UnitCategory | undefined {
            return this._templateCfg.produceUnitCategory;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for vision.
        ////////////////////////////////////////////////////////////////////////////////
        public getVisionRange(): number | undefined {
            return this._templateCfg.visionRange;
        }

        public checkIsVisionEnabledForAllPlayers(): boolean {
            return this._templateCfg.isVisionEnabledForAllPlayers === 1;
        }
    }
}
