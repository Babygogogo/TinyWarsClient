
// import TwnsBwUnit               from "../../baseWar/model/BwUnit";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import FloatText                from "../../tools/helpers/FloatText";
// import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import NotifyData               from "../../tools/notify/NotifyData";
// import Notify           from "../../tools/notify/NotifyType";
// import WarDestructionHelpers    from "../../tools/warHelpers/WarDestructionHelpers";
// import MeUtility                from "./MeUtility";
// import TwnsMeWar                from "./MeWar";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.MapEditor {
    import LangTextType         = Lang.LangTextType;
    import NotifyType           = Notify.NotifyType;
    import DrawerMode           = Types.MapEditorDrawerMode;
    import GridIndex            = Types.GridIndex;
    import SymmetryType         = Types.SymmetryType;

    export type DataForDrawTileObject = {
        objectType  : number;
        shapeId     : number;
        playerIndex : number;
    };
    export type DataForDrawTileBase = {
        baseType    : number;
        shapeId     : number;
    };
    export type DataForDrawTileDecoration = {
        decoratorType   : number;
        shapeId         : number;
    };
    export type DataForDrawUnit = {
        unitType    : number;
        playerIndex : number;
    };
    export type DataForAddTileToLocation = {
        locationIdArray: number[];
    };
    export type DataForDeleteTileFromLocation = {
        locationIdArray: number[];
    };

    export class MeDrawer {
        private _war?                           : MapEditor.MeWar;
        private _mode                           = DrawerMode.Preview;
        private _drawTargetTileObjectData       : DataForDrawTileObject | null = null;
        private _drawTargetTileBaseData         : DataForDrawTileBase | null = null;
        private _drawTargetTileDecoratorData    : DataForDrawTileDecoration | null = null;
        private _drawTargetUnit                 : BaseWar.BwUnit | null = null;
        private _dataForAddTileToLocation       : DataForAddTileToLocation | null = null;
        private _dataForDeleteTileFromLocation  : DataForDeleteTileFromLocation | null = null;
        private _symmetricalDrawType            = SymmetryType.None;

        private _notifyListeners: Notify.Listener[] = [
            { type: NotifyType.BwCursorTapped,     callback: this._onNotifyBwCursorTapped },
            { type: NotifyType.BwCursorDragged,    callback: this._onNotifyBwCursorDragged },
        ];

        public init(): MeDrawer {
            return this;
        }

        public startRunning(war: MapEditor.MeWar): void {
            this._setWar(war);
            Notify.addEventListeners(this._notifyListeners, this);
        }
        public stopRunning(): void {
            delete this._war;

            Notify.removeEventListeners(this._notifyListeners, this);
        }

        private _onNotifyBwCursorTapped(e: egret.Event): void {
            const data      = e.data as Notify.NotifyData.BwCursorTapped;
            const gridIndex = data.tappedOn;
            this._handleAction(gridIndex);
        }
        private _onNotifyBwCursorDragged(e: egret.Event): void {
            const data = e.data as Notify.NotifyData.BwCursorDragged;
            this._handleAction(data.draggedTo);
        }

        private _setWar(war: MapEditor.MeWar): void {
            this._war = war;
        }
        private _getWar(): MapEditor.MeWar {
            return Helpers.getExisted(this._war);
        }

        private _setMode(mode: DrawerMode): void {
            this._mode = mode;
            Notify.dispatch(NotifyType.MeDrawerModeChanged);
        }
        public setModeDeleteUnit(): void {
            this._setMode(DrawerMode.DeleteUnit);
        }
        public setModeDeleteTileDecorator(): void {
            this._setMode(DrawerMode.DeleteTileDecorator);
        }
        public setModeDeleteTileObject(): void {
            this._setMode(DrawerMode.DeleteTileObject);
        }
        public setModePreview(): void {
            this._setMode(DrawerMode.Preview);
        }
        public getMode(): DrawerMode {
            return this._mode;
        }

        public setModeDrawTileObject(data: DataForDrawTileObject): void {
            this._setDrawTargetTileObjectData(data);
            this._setDrawTargetTileBaseData(null);
            this._setDrawTargetTileDecoratorData(null);
            this._setMode(DrawerMode.DrawTileObject);
        }
        public setModeDrawTileBase(data: DataForDrawTileBase): void {
            this._setDrawTargetTileObjectData(null);
            this._setDrawTargetTileBaseData(data);
            this._setDrawTargetTileDecoratorData(null);
            this._setMode(DrawerMode.DrawTileBase);
        }
        public setModeDrawTileDecorator(data: DataForDrawTileDecoration): void {
            this._setDrawTargetTileObjectData(null);
            this._setDrawTargetTileBaseData(null);
            this._setDrawTargetTileDecoratorData(data);
            this._setMode(DrawerMode.DrawTileDecorator);
        }
        private _setDrawTargetTileObjectData(data: DataForDrawTileObject | null): void {
            this._drawTargetTileObjectData = data;
        }
        public getDrawTargetTileObjectData(): DataForDrawTileObject | null {
            return this._drawTargetTileObjectData;
        }
        private _setDrawTargetTileBaseData(data: DataForDrawTileBase | null): void {
            this._drawTargetTileBaseData = data;
        }
        public getDrawTargetTileBaseData(): DataForDrawTileBase | null {
            return this._drawTargetTileBaseData;
        }
        private _setDrawTargetTileDecoratorData(data: DataForDrawTileDecoration | null): void {
            this._drawTargetTileDecoratorData = data;
        }
        public getDrawTargetTileDecoratorData(): DataForDrawTileDecoration | null {
            return this._drawTargetTileDecoratorData;
        }

        public setModeDrawUnit(data: DataForDrawUnit): void {
            const war   = this._getWar();
            const unit  = new BaseWar.BwUnit();
            unit.init({
                gridIndex   : { x: 0, y: 0 },
                unitId      : 0,
                unitType    : data.unitType,
                playerIndex : data.playerIndex,
            }, war.getGameConfig());
            unit.startRunning(war);

            this._setDrawTargetUnit(unit);
            this._setMode(DrawerMode.DrawUnit);
        }
        private _setDrawTargetUnit(unit: BaseWar.BwUnit): void {
            this._drawTargetUnit = unit;
        }
        public getDrawTargetUnit(): BaseWar.BwUnit | null {
            return this._drawTargetUnit;
        }

        public setModeAddTileToLocation(data: DataForAddTileToLocation): void {
            this._setDataForAddTileToLocation(data);
            this._setMode(DrawerMode.AddTileToLocation);
        }
        private _setDataForAddTileToLocation(data: DataForAddTileToLocation): void {
            this._dataForAddTileToLocation = data;
        }
        public getDataForAddTileToLocation(): DataForAddTileToLocation | null {
            return this._dataForAddTileToLocation;
        }

        public setModeDeleteTileFromLocation(data: DataForDeleteTileFromLocation): void {
            this._setDataForDeleteTileFromLocation(data);
            this._setMode(DrawerMode.DeleteTileFromLocation);
        }
        private _setDataForDeleteTileFromLocation(data: DataForDeleteTileFromLocation): void {
            this._dataForDeleteTileFromLocation = data;
        }
        public getDataForDeleteTileFromLocation(): DataForDeleteTileFromLocation | null {
            return this._dataForDeleteTileFromLocation;
        }

        public getSymmetricalDrawType(): SymmetryType {
            return this._symmetricalDrawType;
        }
        public setSymmetricalDrawType(type: SymmetryType): void {
            this._symmetricalDrawType = type;
        }

        public autoAdjustRoads(): void {
            const war           = this._getWar();
            const tileMap       = war.getTileMap();
            const gameConfig    = war.getGameConfig();
            for (const tile of tileMap.getAllTiles()) {
                if (tile.getObjectType() !== CommonConstants.TileObjectType.Road) {
                    continue;
                }

                const gridIndex = tile.getGridIndex();
                const shapeId   = MapEditor.MeHelpers.getAutoRoadShapeId(tileMap, gridIndex);
                if (shapeId !== tile.getObjectShapeId()) {
                    tile.init({
                        gridIndex       : tile.getGridIndex(),
                        playerIndex     : tile.getPlayerIndex(),
                        objectType      : tile.getObjectType(),
                        objectShapeId   : shapeId,
                        baseType        : tile.getBaseType(),
                        baseShapeId     : tile.getBaseShapeId(),
                        locationFlags   : tile.getLocationFlags(),
                        isHighlighted   : tile.getIsHighlighted(),
                    }, gameConfig);
                    tile.startRunning(war);
                    tile.flushDataToView();

                    Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as Notify.NotifyData.MeTileChanged);
                }
            }
        }
        public autoAdjustBridges(): void {
            const war           = this._getWar();
            const tileMap       = war.getTileMap();
            const gameConfig    = war.getGameConfig();
            for (const tile of tileMap.getAllTiles()) {
                if (tile.getObjectType() !== CommonConstants.TileObjectType.Bridge) {
                    continue;
                }

                const gridIndex = tile.getGridIndex();
                const shapeId   = MapEditor.MeHelpers.getAutoBridgeShapeId(tileMap, gridIndex);
                if (shapeId !== tile.getObjectShapeId()) {
                    tile.init({
                        gridIndex       : tile.getGridIndex(),
                        playerIndex     : tile.getPlayerIndex(),
                        objectType      : tile.getObjectType(),
                        objectShapeId   : shapeId,
                        baseType        : tile.getBaseType(),
                        baseShapeId     : tile.getBaseShapeId(),
                        locationFlags   : tile.getLocationFlags(),
                        isHighlighted   : tile.getIsHighlighted(),
                    }, gameConfig);
                    tile.startRunning(war);
                    tile.flushDataToView();

                    Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as Notify.NotifyData.MeTileChanged);
                }
            }
        }
        public autoAdjustPlasmas(): void {
            const war           = this._getWar();
            const tileMap       = war.getTileMap();
            const gameConfig    = war.getGameConfig();
            for (const tile of tileMap.getAllTiles()) {
                if (tile.getObjectType() !== CommonConstants.TileObjectType.Plasma) {
                    continue;
                }

                const gridIndex = tile.getGridIndex();
                const shapeId   = MapEditor.MeHelpers.getAutoPlasmaShapeId(tileMap, gridIndex);
                if (shapeId !== tile.getObjectShapeId()) {
                    tile.init({
                        gridIndex       : tile.getGridIndex(),
                        playerIndex     : tile.getPlayerIndex(),
                        objectType      : tile.getObjectType(),
                        objectShapeId   : shapeId,
                        baseType        : tile.getBaseType(),
                        baseShapeId     : tile.getBaseShapeId(),
                        locationFlags   : tile.getLocationFlags(),
                        isHighlighted   : tile.getIsHighlighted(),
                    }, gameConfig);
                    tile.startRunning(war);
                    tile.flushDataToView();

                    Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as Notify.NotifyData.MeTileChanged);
                }
            }
        }
        public autoAdjustPipes(): void {
            const war           = this._getWar();
            const tileMap       = war.getTileMap();
            const gameConfig    = war.getGameConfig();
            for (const tile of tileMap.getAllTiles()) {
                if (tile.getObjectType() !== CommonConstants.TileObjectType.Pipe) {
                    continue;
                }

                const gridIndex = tile.getGridIndex();
                const shapeId   = MapEditor.MeHelpers.getAutoPipeShapeId(tileMap, gridIndex);
                if (shapeId !== tile.getObjectShapeId()) {
                    tile.init({
                        gridIndex       : tile.getGridIndex(),
                        playerIndex     : tile.getPlayerIndex(),
                        objectType      : tile.getObjectType(),
                        objectShapeId   : shapeId,
                        baseType        : tile.getBaseType(),
                        baseShapeId     : tile.getBaseShapeId(),
                        locationFlags   : tile.getLocationFlags(),
                        isHighlighted   : tile.getIsHighlighted(),
                    }, gameConfig);
                    tile.startRunning(war);
                    tile.flushDataToView();

                    Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as Notify.NotifyData.MeTileChanged);
                }
            }
        }
        public autoFillTileDecorators(): void {
            const war           = this._getWar();
            const tileMap       = war.getTileMap();
            const gameConfig    = war.getGameConfig();
            for (const tile of tileMap.getAllTiles()) {
                const gridIndex         = tile.getGridIndex();
                const targetBaseData    = MapEditor.MeHelpers.getAutoTileDecoratorTypeAndShapeId(tileMap, gridIndex);
                const decoratorType     = targetBaseData.decoratorType;
                const decoratorShapeId  = targetBaseData.shapeId;
                tile.init({
                    gridIndex       : tile.getGridIndex(),
                    playerIndex     : tile.getPlayerIndex(),
                    objectType      : tile.getObjectType(),
                    objectShapeId   : tile.getObjectShapeId(),
                    baseType        : tile.getBaseType(),
                    baseShapeId     : tile.getBaseShapeId(),
                    decoratorType,
                    decoratorShapeId,
                    locationFlags   : tile.getLocationFlags(),
                    isHighlighted   : tile.getIsHighlighted(),
                }, gameConfig);
                tile.startRunning(war);
                tile.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as Notify.NotifyData.MeTileChanged);
            }
        }

        private _handleAction(gridIndex: GridIndex): void {
            const mode = this.getMode();
            if (mode === DrawerMode.DrawTileBase) {
                this._handleDrawTileBase(gridIndex);

            } else if (mode === DrawerMode.DrawTileDecorator) {
                this._handleDrawTileDecorator(gridIndex);

            } else if (mode === DrawerMode.DrawTileObject) {
                this._handleDrawTileObject(gridIndex);

            } else if (mode === DrawerMode.DrawUnit) {
                this._handleDrawUnit(gridIndex);

            } else if (mode === DrawerMode.DeleteTileDecorator) {
                this._handleDeleteTileDecorator(gridIndex);

            } else if (mode === DrawerMode.DeleteTileObject) {
                this._handleDeleteTileObject(gridIndex);

            } else if (mode === DrawerMode.DeleteUnit) {
                this._handleDeleteUnit(gridIndex);

            } else if (mode === DrawerMode.AddTileToLocation) {
                this._handleAddTileToLocation(gridIndex);

            } else if (mode === DrawerMode.DeleteTileFromLocation) {
                this._handleDeleteTileFromLocation(gridIndex);

            } else if (mode === DrawerMode.Preview) {
                // nothing to do

            } else {
                throw Helpers.newError(`MeDrawer._handleAction() invalid mode.`);
            }

            this._getWar().setIsMapModified(true);
        }
        private _handleDrawTileBase(gridIndex: GridIndex): void {
            const war               = this._getWar();
            const tileMap           = war.getTileMap();
            const tile              = tileMap.getTile(gridIndex);
            const targetBaseData    = Helpers.getExisted(this.getDrawTargetTileBaseData());
            const baseType          = targetBaseData.baseType;
            const baseShapeId       = targetBaseData.shapeId;
            const gameConfig        = war.getGameConfig();
            tile.init({
                gridIndex       : tile.getGridIndex(),
                playerIndex     : tile.getPlayerIndex(),
                objectType      : tile.getObjectType(),
                objectShapeId   : tile.getObjectShapeId(),
                decoratorType   : tile.getDecorationType(),
                decoratorShapeId: tile.getDecoratorShapeId(),
                baseType,
                baseShapeId,
                locationFlags   : tile.getLocationFlags(),
                isHighlighted   : tile.getIsHighlighted(),
            }, gameConfig);
            tile.startRunning(war);
            tile.flushDataToView();

            Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as Notify.NotifyData.MeTileChanged);

            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MapEditor.MeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!GridIndexHelpers.checkIsEqual(symGridIndex, gridIndex))) {
                const t2 = tileMap.getTile(symGridIndex);
                t2.init({
                    gridIndex       : t2.getGridIndex(),
                    playerIndex     : t2.getPlayerIndex(),
                    objectType      : t2.getObjectType(),
                    objectShapeId   : t2.getObjectShapeId(),
                    decoratorType   : t2.getDecorationType(),
                    decoratorShapeId: t2.getDecoratorShapeId(),
                    baseType        : baseType,
                    baseShapeId     : gameConfig.getSymmetricalTileBaseShapeId(baseType, baseShapeId, symmetryType),
                    locationFlags   : t2.getLocationFlags(),
                    isHighlighted   : t2.getIsHighlighted(),
                }, gameConfig);
                t2.startRunning(war);
                t2.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: symGridIndex } as Notify.NotifyData.MeTileChanged);
            }
        }
        private _handleDrawTileDecorator(gridIndex: GridIndex): void {
            const war               = this._getWar();
            const tileMap           = war.getTileMap();
            const gameConfig        = war.getGameConfig();
            const tile              = tileMap.getTile(gridIndex);
            const targetBaseData    = Helpers.getExisted(this.getDrawTargetTileDecoratorData());
            const decoratorType     = targetBaseData.decoratorType;
            const decoratorShapeId  = targetBaseData.shapeId;
            tile.init({
                gridIndex       : tile.getGridIndex(),
                playerIndex     : tile.getPlayerIndex(),
                objectType      : tile.getObjectType(),
                objectShapeId   : tile.getObjectShapeId(),
                baseType        : tile.getBaseType(),
                baseShapeId     : tile.getBaseShapeId(),
                decoratorType,
                decoratorShapeId,
                locationFlags   : tile.getLocationFlags(),
                isHighlighted   : tile.getIsHighlighted(),
            }, gameConfig);
            tile.startRunning(war);
            tile.flushDataToView();

            Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as Notify.NotifyData.MeTileChanged);

            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MapEditor.MeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!GridIndexHelpers.checkIsEqual(symGridIndex, gridIndex))) {
                const t2 = tileMap.getTile(symGridIndex);
                t2.init({
                    gridIndex       : t2.getGridIndex(),
                    playerIndex     : t2.getPlayerIndex(),
                    objectType      : t2.getObjectType(),
                    objectShapeId   : t2.getObjectShapeId(),
                    baseType        : t2.getBaseType(),
                    baseShapeId     : t2.getBaseShapeId(),
                    decoratorType,
                    decoratorShapeId: gameConfig.getSymmetricalTileDecoratorShapeId(decoratorType, decoratorShapeId, symmetryType),
                    locationFlags   : t2.getLocationFlags(),
                    isHighlighted   : t2.getIsHighlighted(),
                }, gameConfig);
                t2.startRunning(war);
                t2.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: symGridIndex } as Notify.NotifyData.MeTileChanged);
            }
        }
        private _handleDrawTileObject(gridIndex: GridIndex): void {
            const war               = this._getWar();
            const gameConfig        = war.getGameConfig();
            const tileMap           = war.getTileMap();
            const unitMap           = war.getUnitMap();
            const tile              = tileMap.getTile(gridIndex);
            const targetObjectData  = Helpers.getExisted(this.getDrawTargetTileObjectData());
            const baseType          = tile.getBaseType();
            const objectType        = targetObjectData.objectType;
            const isAttackableTile  = !!gameConfig.getTileTemplateCfg(Helpers.getExisted(gameConfig.getTileType(baseType, objectType)))?.maxHp;
            if ((isAttackableTile) && (unitMap.getUnitOnMap(gridIndex))) {
                FloatText.show(Lang.getText(LangTextType.A0269));
                return;
            }

            const objectShapeId     = targetObjectData.shapeId;
            const playerIndex       = targetObjectData.playerIndex;
            tile.init({
                gridIndex       : tile.getGridIndex(),
                baseType,
                baseShapeId     : tile.getBaseShapeId(),
                decoratorType   : tile.getDecorationType(),
                decoratorShapeId: tile.getDecoratorShapeId(),
                playerIndex,
                objectType,
                objectShapeId,
                locationFlags   : tile.getLocationFlags(),
                isHighlighted   : tile.getIsHighlighted(),
            }, gameConfig);
            tile.startRunning(war);
            tile.flushDataToView();

            Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as Notify.NotifyData.MeTileChanged);

            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MapEditor.MeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!GridIndexHelpers.checkIsEqual(symGridIndex, gridIndex))) {
                if ((isAttackableTile) && (unitMap.getUnitOnMap(symGridIndex))) {
                    return;
                }

                const t2 = tileMap.getTile(symGridIndex);
                t2.init({
                    gridIndex       : t2.getGridIndex(),
                    baseType        : t2.getBaseType(),
                    baseShapeId     : t2.getBaseShapeId(),
                    decoratorType   : t2.getDecorationType(),
                    decoratorShapeId: t2.getDecoratorShapeId(),
                    playerIndex,
                    objectType,
                    objectShapeId   : gameConfig.getSymmetricalTileObjectShapeId(objectType, objectShapeId, symmetryType),
                    locationFlags   : t2.getLocationFlags(),
                    isHighlighted   : t2.getIsHighlighted(),
                }, gameConfig);
                t2.startRunning(war);
                t2.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: symGridIndex } as Notify.NotifyData.MeTileChanged);
            }
        }
        private _handleDrawUnit(gridIndex: GridIndex): void {
            this._handleDeleteUnit(gridIndex);

            const war           = this._getWar();
            const gameConfig    = war.getGameConfig();
            const tile          = war.getTileMap().getTile(gridIndex);
            if (tile.getMaxHp() != null) {
                FloatText.show(Lang.getFormattedText(LangTextType.F0067, Lang.getTileName(tile.getType(), gameConfig)));
                return;
            }

            const unitMap       = war.getUnitMap();
            const unitId        = unitMap.getNextUnitId();
            const targetUnit    = Helpers.getExisted(this.getDrawTargetUnit());
            const unit          = new BaseWar.BwUnit();
            unit.init({
                gridIndex,
                playerIndex : targetUnit.getPlayerIndex(),
                unitType    : targetUnit.getUnitType(),
                unitId,
            }, gameConfig);
            unit.startRunning(this._getWar());
            unit.startRunningView();

            unitMap.setUnitOnMap(unit);
            unitMap.setNextUnitId(unitId + 1);

            Notify.dispatch(NotifyType.BwUnitChanged, { gridIndex } as Notify.NotifyData.BwUnitChanged);
        }
        private _handleDeleteTileDecorator(gridIndex: GridIndex): void {
            const tileMap   = this._getWar().getTileMap();
            const tile      = tileMap.getTile(gridIndex);
            tile.deleteTileDecorator();
            tile.flushDataToView();

            Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as Notify.NotifyData.MeTileChanged);

            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MapEditor.MeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!GridIndexHelpers.checkIsEqual(symGridIndex, gridIndex))) {
                const t2 = tileMap.getTile(symGridIndex);
                t2.deleteTileDecorator();
                t2.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: symGridIndex } as Notify.NotifyData.MeTileChanged);
            }
        }
        private _handleDeleteTileObject(gridIndex: GridIndex): void {
            const tileMap   = this._getWar().getTileMap();
            const tile      = tileMap.getTile(gridIndex);
            tile.deleteTileObject();
            tile.flushDataToView();

            Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as Notify.NotifyData.MeTileChanged);

            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MapEditor.MeHelpers.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!GridIndexHelpers.checkIsEqual(symGridIndex, gridIndex))) {
                const t2 = tileMap.getTile(symGridIndex);
                t2.deleteTileObject();
                t2.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: symGridIndex } as Notify.NotifyData.MeTileChanged);
            }
        }
        private _handleDeleteUnit(gridIndex: GridIndex): void {
            const unit = this._getWar().getUnitMap().getUnitOnMap(gridIndex);
            if (unit) {
                const war = this._getWar();
                WarHelpers.WarDestructionHelpers.destroyUnitOnMap(war, gridIndex, true);
                if (unit.getHasLoadedCo()) {
                    war.getTileMap().getView().updateCoZone();
                }

                Notify.dispatch(NotifyType.BwUnitChanged, { gridIndex } as Notify.NotifyData.BwUnitChanged);
            }
        }
        private _handleAddTileToLocation(gridIndex: GridIndex): void {
            this._getWar().getTileMap().getTile(gridIndex).setHasLocationFlagArray(this.getDataForAddTileToLocation()?.locationIdArray ?? [], true);
        }
        private _handleDeleteTileFromLocation(gridIndex: GridIndex): void {
            this._getWar().getTileMap().getTile(gridIndex).setHasLocationFlagArray(this.getDataForDeleteTileFromLocation()?.locationIdArray ?? [], false);
        }
    }
}

// export default TwnsMeDrawer;
