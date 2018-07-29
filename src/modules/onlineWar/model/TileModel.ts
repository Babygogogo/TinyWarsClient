
namespace OnlineWar {
    import Types          = Utility.Types;
    import IdConverter    = Utility.IdConverter;
    import Notify         = Utility.Notify;
    import Helpers        = Utility.Helpers;
    import SerializedTile = Types.SerializedTile;
    import InstantialTile = Types.InstantialTile;

    export class TileModel {
        private _template     : Types.TemplateTile;
        private _isInitialized: boolean;

        private _gridX              : number;
        private _gridY              : number;
        private _baseViewId         : number;
        private _objectViewId       : number;
        private _baseType           : Types.TileBaseType;
        private _objectType         : Types.TileObjectType;
        private _playerIndex        : number;
        private _currentHp          : number;
        private _currentBuildPoint  : number;
        private _currentCapturePoint: number;

        public constructor(data?: SerializedTile) {
            if (data) {
                this.deserialize(data);
            }
        }

        public deserialize(data: SerializedTile): void {
            const t             = IdConverter.getTileObjectTypeAndPlayerIndex(data.objectViewId);
            this._isInitialized = true;
            this._gridX         = data.gridX;
            this._gridY         = data.gridY;
            this._baseViewId    = data.baseViewId;
            this._objectViewId  = data.baseViewId;
            this._baseType      = IdConverter.getTileBaseType(data.baseViewId);
            this._objectType    = t.tileObjectType;
            this._playerIndex   = t.playerIndex;
            this._template      = Config.getTemplateTile(this._baseType, this._objectType);
            this._loadInstantialData(data.instantialData);
        }

        public serialize(): SerializedTile {
            egret.assert(this._isInitialized, "TileModel.serialize() the tile hasn't been initialized!");
            return {
                gridX         : this._gridX,
                gridY         : this._gridY,
                baseViewId    : this._baseViewId,
                objectViewId  : this._objectViewId,
                instantialData: this._createInstantialData(),
            };
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
            egret.assert((hp >= 0) && (hp <= this.getMaxHp()));
            this._currentHp = hp;
        }

        public getArmorType(): Types.ArmorType {
            return this._template.armorType;
        }

        public checkIsArmorAffectByLuck(): boolean | undefined {
            return this._template.isAffectedByLuck;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for build.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxBuildPoint(): number | undefined {
            return this._template.maxBuildPoint;
        }

        public getCurrentBuildPoint(): number {
            return this._currentBuildPoint;
        }
        public setCurrentBuildPoint(point: number): void {
            egret.assert((point >= 0) && (point <= this.getMaxBuildPoint()));
            this._currentBuildPoint = point;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for capture.
        ////////////////////////////////////////////////////////////////////////////////
        public getMaxCapturePoint(): number | undefined {
            return this._template.maxCapturePoint;
        }

        public getCurrentCapturePoint(): number {
            return this._currentCapturePoint;
        }
        public setCurrentCapturePoint(point: number): void {
            egret.assert((point >= 0) && (point <= this.getMaxCapturePoint()));
            this._currentCapturePoint = point;
        }

        public checkIsDefeatOnCapture(): boolean | undefined{
            return this._template.isDefeatOnCapture;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for defense amount for units.
        ////////////////////////////////////////////////////////////////////////////////
        public getNormalizedRawDefenseAmount(): number {
            return Math.floor(this.getRawDefenseAmount() / 10);
        }

        public getRawDefenseAmount(): number {
            return this._template.defenseAmount;
        }

        public getDefenseUnitCategory(): Types.UnitCategory {
            return this._template.defenseUnitCategory;
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
        public getRawIncomeAmountPerTurn(): number | undefined {
            return this._template.incomePerTurn;
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
        public getRawMoveCosts(): Types.MoveCosts {
            return this._template.moveCosts;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for repair unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getRepairUnitCategory(): Types.UnitCategory | undefined {
            return this._template.repairUnitCategory;
        }

        public getRawRepairAmount(): number | undefined {
            return this._template.repairAmount;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hide unit.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanHideUnit(unitType: Types.UnitType): boolean {
            const category = this._template.hideUnitCategory;
            return category == null
                ? false
                : Config.getUnitTypesByCategory(category).indexOf(unitType) >= 0;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getProduceUnitCategory(): Types.UnitCategory | undefined {
            return this._template.produceUnitCategory;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for vision.
        ////////////////////////////////////////////////////////////////////////////////
        public getRawVisionRange(): number | undefined {
            return this._template.visionRange;
        }

        public checkIsVisionEnabledForAllPlayers(): boolean | undefined {
            return this._template.isVisionEnabledForAllPlayers;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createInstantialData(): InstantialTile | undefined {
            const data: InstantialTile = {};

            const currentHp = this.getCurrentHp();
            (currentHp !== this.getMaxHp()) && (data.currentHp = currentHp);

            const buildPoint = this.getCurrentBuildPoint();
            (buildPoint !== this.getMaxBuildPoint()) && (data.currentBuildPoint = buildPoint);

            const capturePoint = this.getCurrentCapturePoint();
            (capturePoint !== this.getMaxCapturePoint()) && (data.currentCapturePoint = capturePoint);

            return Helpers.checkIsEmptyObject(data) ? undefined : data;
        }

        private _loadInstantialData(d: InstantialTile | undefined) {
            this.setCurrentHp(          (d) && (d.currentHp           != null) ? d.currentHp           : this.getMaxHp());
            this.setCurrentBuildPoint(  (d) && (d.currentBuildPoint   != null) ? d.currentBuildPoint   : this.getMaxBuildPoint());
            this.setCurrentCapturePoint((d) && (d.currentCapturePoint != null) ? d.currentCapturePoint : this.getMaxCapturePoint());
        }
    }
}
