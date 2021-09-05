
import TwnsBwUnit               from "../../baseWar/model/BwUnit";
import ConfigManager            from "../../tools/helpers/ConfigManager";
import FloatText                from "../../tools/helpers/FloatText";
import GridIndexHelpers         from "../../tools/helpers/GridIndexHelpers";
import Helpers                  from "../../tools/helpers/Helpers";
import Logger                   from "../../tools/helpers/Logger";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import Notify                   from "../../tools/notify/Notify";
import NotifyData               from "../../tools/notify/NotifyData";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import WarDestructionHelpers    from "../../tools/warHelpers/WarDestructionHelpers";
import MeUtility                from "./MeUtility";
import TwnsMeWar                from "./MeWar";

namespace TwnsMeDrawer {
    import MeWar                = TwnsMeWar.MeWar;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import DrawerMode           = Types.MapEditorDrawerMode;
    import GridIndex            = Types.GridIndex;
    import SymmetryType         = Types.SymmetryType;
    import UnitType             = Types.UnitType;
    import TileBaseType         = Types.TileBaseType;
    import TileDecoratorType    = Types.TileDecoratorType;
    import TileObjectType       = Types.TileObjectType;
    import BwUnit               = TwnsBwUnit.BwUnit;

    export type DataForDrawTileObject = {
        objectType  : TileObjectType;
        shapeId     : number;
        playerIndex : number;
    };
    export type DataForDrawTileBase = {
        baseType    : TileBaseType;
        shapeId     : number;
    };
    export type DataForDrawTileDecorator = {
        decoratorType   : TileDecoratorType;
        shapeId         : number;
    };
    export type DataForDrawUnit = {
        unitType    : UnitType;
        playerIndex : number;
    };

    export class MeDrawer {
        private _war?                           : MeWar;
        private _mode                           = DrawerMode.Preview;
        private _drawTargetTileObjectData       : DataForDrawTileObject | null = null;
        private _drawTargetTileBaseData         : DataForDrawTileBase | null = null;
        private _drawTargetTileDecoratorData    : DataForDrawTileDecorator | null = null;
        private _drawTargetUnit                 : BwUnit | null = null;
        private _symmetricalDrawType            = SymmetryType.None;

        private _notifyListeners: Notify.Listener[] = [
            { type: NotifyType.BwCursorTapped,     callback: this._onNotifyBwCursorTapped },
            { type: NotifyType.BwCursorDragged,    callback: this._onNotifyBwCursorDragged },
        ];

        public init(): MeDrawer {
            return this;
        }

        public startRunning(war: MeWar): void {
            this._setWar(war);
            Notify.addEventListeners(this._notifyListeners, this);
        }
        public stopRunning(): void {
            delete this._war;

            Notify.removeEventListeners(this._notifyListeners, this);
        }

        private _onNotifyBwCursorTapped(e: egret.Event): void {
            const data      = e.data as NotifyData.BwCursorTapped;
            const gridIndex = data.tappedOn;
            this._handleAction(gridIndex);
        }
        private _onNotifyBwCursorDragged(e: egret.Event): void {
            const data = e.data as NotifyData.BwCursorDragged;
            this._handleAction(data.draggedTo);
        }

        private _setWar(war: MeWar): void {
            this._war = war;
        }
        private _getWar(): MeWar {
            return Helpers.getDefined(this._war);
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
        public setModeDrawTileDecorator(data: DataForDrawTileDecorator): void {
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
        private _setDrawTargetTileDecoratorData(data: DataForDrawTileDecorator | null): void {
            this._drawTargetTileDecoratorData = data;
        }
        public getDrawTargetTileDecoratorData(): DataForDrawTileDecorator | null {
            return this._drawTargetTileDecoratorData;
        }

        public setModeDrawUnit(data: DataForDrawUnit): void {
            const war   = this._getWar();
            const unit  = new BwUnit();
            unit.init({
                gridIndex   : { x: 0, y: 0 },
                unitId      : 0,
                unitType    : data.unitType,
                playerIndex : data.playerIndex,
            }, war.getConfigVersion());
            unit.startRunning(war);

            this._setDrawTargetUnit(unit);
            this._setMode(DrawerMode.DrawUnit);
        }
        private _setDrawTargetUnit(unit: BwUnit): void {
            this._drawTargetUnit = unit;
        }
        public getDrawTargetUnit(): BwUnit | null {
            return this._drawTargetUnit;
        }

        public getSymmetricalDrawType(): SymmetryType {
            return this._symmetricalDrawType;
        }
        public setSymmetricalDrawType(type: SymmetryType): void {
            this._symmetricalDrawType = type;
        }

        public autoFillTileDecorators(): void {
            const war           = this._getWar();
            const tileMap       = war.getTileMap();
            const configVersion = war.getConfigVersion();
            for (const tile of tileMap.getAllTiles()) {
                const gridIndex         = tile.getGridIndex();
                const targetBaseData    = MeUtility.getAutoTileDecoratorTypeAndShapeId(tileMap, gridIndex);
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
                }, configVersion);
                tile.startRunning(war);
                tile.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as NotifyData.MeTileChanged);
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

            } else if (mode === DrawerMode.Preview) {
                // nothing to do

            } else {
                Logger.error(`MeDrawer._handleAction() invalid mode.`);
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
            const configVersion     = war.getConfigVersion();
            tile.init({
                gridIndex       : tile.getGridIndex(),
                playerIndex     : tile.getPlayerIndex(),
                objectType      : tile.getObjectType(),
                objectShapeId   : tile.getObjectShapeId(),
                decoratorType   : tile.getDecoratorType(),
                decoratorShapeId: tile.getDecoratorShapeId(),
                baseType,
                baseShapeId,
            }, configVersion);
            tile.startRunning(war);
            tile.flushDataToView();

            Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as NotifyData.MeTileChanged);

            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MeUtility.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!GridIndexHelpers.checkIsEqual(symGridIndex, gridIndex))) {
                const t2 = tileMap.getTile(symGridIndex);
                t2.init({
                    gridIndex       : t2.getGridIndex(),
                    playerIndex     : t2.getPlayerIndex(),
                    objectType      : t2.getObjectType(),
                    objectShapeId   : t2.getObjectShapeId(),
                    decoratorType   : t2.getDecoratorType(),
                    decoratorShapeId: t2.getDecoratorShapeId(),
                    baseType        : baseType,
                    baseShapeId     : ConfigManager.getSymmetricalTileBaseShapeId(baseType, baseShapeId, symmetryType),
                }, configVersion);
                t2.startRunning(war);
                t2.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: symGridIndex } as NotifyData.MeTileChanged);
            }
        }
        private _handleDrawTileDecorator(gridIndex: GridIndex): void {
            const war               = this._getWar();
            const tileMap           = war.getTileMap();
            const configVersion     = war.getConfigVersion();
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
            }, configVersion);
            tile.startRunning(war);
            tile.flushDataToView();

            Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as NotifyData.MeTileChanged);

            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MeUtility.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
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
                    decoratorShapeId: ConfigManager.getSymmetricalTileDecoratorShapeId(decoratorType, decoratorShapeId, symmetryType),
                }, configVersion);
                t2.startRunning(war);
                t2.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: symGridIndex } as NotifyData.MeTileChanged);
            }
        }
        private _handleDrawTileObject(gridIndex: GridIndex): void {
            const war               = this._getWar();
            const configVersion     = war.getConfigVersion();
            const tileMap           = war.getTileMap();
            const tile              = tileMap.getTile(gridIndex);
            const targetObjectData  = Helpers.getExisted(this.getDrawTargetTileObjectData());
            const objectType        = targetObjectData.objectType;
            const objectShapeId     = targetObjectData.shapeId;
            const playerIndex       = targetObjectData.playerIndex;
            tile.init({
                gridIndex       : tile.getGridIndex(),
                baseType        : tile.getBaseType(),
                baseShapeId     : tile.getBaseShapeId(),
                decoratorType   : tile.getDecoratorType(),
                decoratorShapeId: tile.getDecoratorShapeId(),
                playerIndex,
                objectType,
                objectShapeId,
            }, configVersion);
            tile.startRunning(war);
            tile.flushDataToView();

            Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as NotifyData.MeTileChanged);

            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MeUtility.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!GridIndexHelpers.checkIsEqual(symGridIndex, gridIndex))) {
                const t2 = tileMap.getTile(symGridIndex);
                t2.init({
                    gridIndex       : t2.getGridIndex(),
                    baseType        : t2.getBaseType(),
                    baseShapeId     : t2.getBaseShapeId(),
                    decoratorType   : t2.getDecoratorType(),
                    decoratorShapeId: t2.getDecoratorShapeId(),
                    playerIndex,
                    objectType,
                    objectShapeId   : ConfigManager.getSymmetricalTileObjectShapeId(objectType, objectShapeId, symmetryType),
                }, configVersion);
                t2.startRunning(war);
                t2.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: symGridIndex } as NotifyData.MeTileChanged);
            }
        }
        private _handleDrawUnit(gridIndex: GridIndex): void {
            this._handleDeleteUnit(gridIndex);

            const war   = this._getWar();
            const tile  = war.getTileMap().getTile(gridIndex);
            if (tile.getMaxHp() != null) {
                FloatText.show(Lang.getFormattedText(LangTextType.F0067, Lang.getTileName(tile.getType())));
                return;
            }

            const unitMap       = war.getUnitMap();
            const unitId        = unitMap.getNextUnitId();
            const targetUnit    = Helpers.getExisted(this.getDrawTargetUnit());
            const unit          = new BwUnit();
            unit.init({
                gridIndex,
                playerIndex : targetUnit.getPlayerIndex(),
                unitType    : targetUnit.getUnitType(),
                unitId,
            }, war.getConfigVersion());
            unit.startRunning(this._getWar());
            unit.startRunningView();

            unitMap.setUnitOnMap(unit);
            unitMap.setNextUnitId(unitId + 1);

            Notify.dispatch(NotifyType.MeUnitChanged, { gridIndex } as NotifyData.MeUnitChanged);
        }
        private _handleDeleteTileDecorator(gridIndex: GridIndex): void {
            const tileMap   = this._getWar().getTileMap();
            const tile      = tileMap.getTile(gridIndex);
            tile.deleteTileDecorator();
            tile.flushDataToView();

            Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as NotifyData.MeTileChanged);

            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MeUtility.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!GridIndexHelpers.checkIsEqual(symGridIndex, gridIndex))) {
                const t2 = tileMap.getTile(symGridIndex);
                t2.deleteTileDecorator();
                t2.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: symGridIndex } as NotifyData.MeTileChanged);
            }
        }
        private _handleDeleteTileObject(gridIndex: GridIndex): void {
            const tileMap   = this._getWar().getTileMap();
            const tile      = tileMap.getTile(gridIndex);
            tile.destroyTileObject();
            tile.flushDataToView();

            Notify.dispatch(NotifyType.MeTileChanged, { gridIndex } as NotifyData.MeTileChanged);

            const symmetryType = this.getSymmetricalDrawType();
            const symGridIndex = MeUtility.getSymmetricalGridIndex(gridIndex, symmetryType, tileMap.getMapSize());
            if ((symGridIndex) && (!GridIndexHelpers.checkIsEqual(symGridIndex, gridIndex))) {
                const t2 = tileMap.getTile(symGridIndex);
                t2.destroyTileObject();
                t2.flushDataToView();

                Notify.dispatch(NotifyType.MeTileChanged, { gridIndex: symGridIndex } as NotifyData.MeTileChanged);
            }
        }
        private _handleDeleteUnit(gridIndex: GridIndex): void {
            if (this._getWar().getUnitMap().getUnitOnMap(gridIndex)) {
                WarDestructionHelpers.destroyUnitOnMap(this._getWar(), gridIndex, true);
                Notify.dispatch(NotifyType.MeUnitChanged, { gridIndex } as NotifyData.MeUnitChanged);
            }
        }
    }
}

export default TwnsMeDrawer;
