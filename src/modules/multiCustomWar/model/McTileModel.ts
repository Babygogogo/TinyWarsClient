
namespace TinyWars.MultiCustomWar {
    import Types            = Utility.Types;
    import IdConverter      = Utility.IdConverter;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import Logger           = Utility.Logger;
    import SerializedMcTile = Types.SerializedMcTile;

    export class McTileModel {
        private _isInitialized: boolean = false;

        private _configVersion  : number;
        private _templateCfg    : Types.TileTemplateCfg;
        private _moveCostCfg    : { [moveType: number]: Types.MoveCostCfg };
        private _gridX          : number;
        private _gridY          : number;
        private _baseViewId     : number;
        private _objectViewId   : number;
        private _baseType       : Types.TileBaseType;
        private _objectType     : Types.TileObjectType;
        private _playerIndex    : number;

        private _currentHp          : number | undefined;
        private _currentBuildPoint  : number | undefined;
        private _currentCapturePoint: number | undefined;

        public constructor(data?: SerializedMcTile, configVersion?: number) {
            if ((data) && (configVersion != null)) {
                this.init(data, configVersion);
            }
        }

        public init(data: SerializedMcTile, configVersion: number): void {
            const t = IdConverter.getTileObjectTypeAndPlayerIndex(data.objectViewId);
            Logger.assert(t, "TileModel.deserialize() invalid SerializedTile! ", data);

            this._isInitialized = true;
            this._configVersion = configVersion;
            this._gridX         = data.gridX;
            this._gridY         = data.gridY;
            this._baseViewId    = data.baseViewId;
            this._objectViewId  = data.baseViewId;
            this._baseType      = IdConverter.getTileBaseType(data.baseViewId);
            this._objectType    = t.tileObjectType;
            this._playerIndex   = t.playerIndex;
            this._templateCfg   = ConfigManager.getTileTemplateCfg(this._configVersion, this._baseType, this._objectType);
            this._moveCostCfg   = ConfigManager.getMoveCostCfg(this._configVersion, this._baseType, this._objectType);
            this.setCurrentHp(          data.currentHp           != null ? data.currentHp           : this.getMaxHp());
            this.setCurrentBuildPoint(  data.currentBuildPoint   != null ? data.currentBuildPoint   : this.getMaxBuildPoint());
            this.setCurrentCapturePoint(data.currentCapturePoint != null ? data.currentCapturePoint : this.getMaxCapturePoint());
        }

        public serialize(): SerializedMcTile {
            Logger.assert(this._isInitialized, "TileModel.serialize() the tile hasn't been initialized!");

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

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        public getBaseViewId(): number {
            return this._baseViewId;
        }
        public getBaseViewIdForPlayer(playerIndex: number): number {
            // TODO
            return this.getBaseViewId();
        }

        public getObjectViewId(): number {
            return this._objectViewId;
        }
        public getObjectViewIdForPlayer(playerIndex: number): number {
            // TODO
            return this.getObjectViewId();
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

        public getDefenseUnitCategory(): Types.UnitCategory {
            return this._templateCfg.defenseUnitCategory;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for grid position.
        ////////////////////////////////////////////////////////////////////////////////
        public getGridX(): number {
            return this._gridX;
        }

        public getGridY(): number {
            return this._gridY;
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
        public getPlayerIndex(): number {
            return this._playerIndex;
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
