
namespace TinyWars.MapEditor {
    import Types            = Utility.Types;
    import Logger           = Utility.Logger;
    import ProtoTypes       = Utility.ProtoTypes;
    import ISerialTile      = ProtoTypes.WarSerialization.ISerialTile;
    import TileType         = Types.TileType;
    import TileObjectType   = Types.TileObjectType;

    export class MeTile {
        private _configVersion  : string;
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

        private _war            : MeWar;
        private _view           : MeTileView;
        private _isFogEnabled   : boolean;

        public init(data: ISerialTile, configVersion: string): MeTile {
            const t = Utility.ConfigManager.getTileObjectTypeAndPlayerIndex(data.objectViewId!);
            Logger.assert(t, "TileModel.init() invalid SerializedTile! ", data);

            this._configVersion = configVersion;
            this._setGridX(data.gridX);
            this._setGridY(data.gridY);
            this._setBaseViewId(data.baseViewId);
            this._setObjectViewId(data.objectViewId);
            this._baseType      = Utility.ConfigManager.getTileBaseType(data.baseViewId);
            this._objectType    = t.tileObjectType;
            this._setPlayerIndex(t.playerIndex);
            this._templateCfg   = Utility.ConfigManager.getTileTemplateCfg(configVersion, this._baseType, this._objectType);
            this._moveCostCfg   = Utility.ConfigManager.getMoveCostCfg(configVersion, this._baseType, this._objectType);
            this.setCurrentHp(          data.currentHp           != null ? data.currentHp           : this.getMaxHp());
            this.setCurrentBuildPoint(  data.currentBuildPoint   != null ? data.currentBuildPoint   : this.getMaxBuildPoint());
            this.setCurrentCapturePoint(data.currentCapturePoint != null ? data.currentCapturePoint : this.getMaxCapturePoint());

            this._view = this._view || new MeTileView();
            this._view.init(this);

            return this;
        }

        public startRunning(war: MeWar): void {
            this._war = war;
        }
        public startRunningView(): void {
            this.getView().startRunningView();
        }

        public serialize(): Types.SerializedTile | null {
            const data: Types.SerializedTile = {
                gridX         : this.getGridX(),
                gridY         : this.getGridY(),
                baseViewId    : this.getBaseViewId(),
                objectViewId  : this.getObjectViewId(),
            };

            let needSerialize   = false;
            const currentHp     = this.getCurrentHp();
            if (currentHp !== this.getMaxHp()) {
                needSerialize   = true;
                data.currentHp  = currentHp;
            }

            const buildPoint = this.getCurrentBuildPoint();
            if (buildPoint !== this.getMaxBuildPoint()) {
                needSerialize           = true;
                data.currentBuildPoint  = buildPoint;
            }

            const capturePoint = this.getCurrentCapturePoint();
            if (capturePoint !== this.getMaxCapturePoint()) {
                needSerialize               = true;
                data.currentCapturePoint    = capturePoint;
            }

            return needSerialize ? data : null;
        }

        public serializeForSimulation(): ISerialTile {
            const data: Types.SerializedTile = {
                gridX         : this.getGridX(),
                gridY         : this.getGridY(),
                baseViewId    : this.getBaseViewId(),
                objectViewId  : this.getObjectViewId(),
            };

            const currentHp = this.getCurrentHp();
            if (currentHp !== this.getMaxHp()) {
                data.currentHp = currentHp;
            }

            const buildPoint = this.getCurrentBuildPoint();
            if (buildPoint !== this.getMaxBuildPoint()) {
                data.currentBuildPoint = buildPoint;
            }

            const capturePoint = this.getCurrentCapturePoint();
            if (capturePoint !== this.getMaxCapturePoint()) {
                data.currentCapturePoint = capturePoint;
            }

            return data;
        }

        public getConfigVersion(): string {
            return this._configVersion;
        }
        public getWar(): MeWar {
            return this._war;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////
        public getView(): MeTileView {
            return this._view;
        }

        public updateView(): void {
            this.getView().updateView();
        }

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
        public getDefenseAmountForUnit(unit: MeUnit): number {
            return this.checkCanDefendUnit(unit) ? this.getDefenseAmount() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp() : 0;
        }

        public getDefenseUnitCategory(): Types.UnitCategory {
            return this._templateCfg.defenseUnitCategory;
        }
        public checkCanDefendUnit(unit: MeUnit): boolean {
            return Utility.ConfigManager.checkIsUnitTypeInCategory(this._configVersion, unit.getType(), this.getDefenseUnitCategory());
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
                    objectViewId: Utility.ConfigManager.getTileObjectViewId(TileObjectType.City, playerIndex)!,
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

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for move cost.
        ////////////////////////////////////////////////////////////////////////////////
        public getMoveCosts(): { [moveType: number]: Types.MoveCostCfg } {
            return this._moveCostCfg;
        }

        public getMoveCostByMoveType(moveType: Types.MoveType): number | undefined | null {
            return this.getMoveCosts()[moveType].cost;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for repair/supply unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getRepairUnitCategory(): Types.UnitCategory | undefined {
            return this._templateCfg.repairUnitCategory;
        }

        public getNormalizedRepairHp(): number | undefined | null {
            return this._templateCfg.repairAmount;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for hide unit.
        ////////////////////////////////////////////////////////////////////////////////
        public checkCanHideUnit(unitType: Types.UnitType): boolean {
            const category = this._templateCfg.hideUnitCategory;
            return category == null
                ? false
                : Utility.ConfigManager.getUnitTypesByCategory(this._configVersion, category).indexOf(unitType) >= 0;
        }

        public checkIsUnitHider(): boolean {
            const category = this._templateCfg.hideUnitCategory;
            return (category != null) && (category != Types.UnitCategory.None);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for produce unit.
        ////////////////////////////////////////////////////////////////////////////////
        public getProduceUnitCategory(): Types.UnitCategory | undefined {
            return this._templateCfg.produceUnitCategory;
        }
        public checkIsUnitProducer(): boolean {
            const category = this.getProduceUnitCategory();
            return (category != null) && (category !== Types.UnitCategory.None);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for vision.
        ////////////////////////////////////////////////////////////////////////////////
        public getCfgVisionRange(): number {
            return this._templateCfg.visionRange!;
        }
        public checkIsVisionEnabledForAllPlayers(): boolean {
            return this._templateCfg.isVisionEnabledForAllPlayers === 1;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for global attack/defense bonus.
        ////////////////////////////////////////////////////////////////////////////////
        public getGlobalAttackBonus(): number {
            return this._templateCfg.globalAttackBonus || 0;
        }
        public getGlobalDefenseBonus(): number {
            return this._templateCfg.globalDefenseBonus || 0;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for fog.
        ////////////////////////////////////////////////////////////////////////////////
        protected _setIsFogEnabled(isEnabled: boolean): void {
            this._isFogEnabled = isEnabled;
        }
        public getIsFogEnabled(): boolean {
            return this._isFogEnabled;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Functions for load co.
        ////////////////////////////////////////////////////////////////////////////////
        public getLoadCoUnitCategory(): Types.UnitCategory | null {
            return this._templateCfg.loadCoUnitCategory;
        }
    }
}
