
namespace TinyWars.MapEditor {
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import GridIndexHelpers = Utility.GridIndexHelpers;
    import DrawerMode       = Types.MapEditorDrawerMode;
    import GridIndex        = Types.GridIndex;

    export class MeDrawer {
        private _war                        : MeWar;
        private _tileMap                    : MeTileMap;
        private _unitMap                    : MeUnitMap;
        private _configVersion              : string;
        private _mode                       = DrawerMode.Preview;
        private _drawTargetTileObjectViewId : number;
        private _drawTargetTileBaseViewId   : number;
        private _drawTargetUnit             : MeUnit;

        private _notifyListeners: Notify.Listener[] = [
            { type: Notify.Type.BwCursorTapped,     callback: this._onNotifyBwCursorTapped },
            { type: Notify.Type.BwCursorDragged,    callback: this._onNotifyBwCursorDragged },
        ];

        public init(mapRawData: Types.MapRawData): MeDrawer {
            return this;
        }

        public startRunning(war: MeWar): void {
            this._war           = war;
            this._tileMap       = war.getTileMap();
            this._unitMap       = war.getUnitMap();
            this._configVersion = war.getConfigVersion();

            Notify.addEventListeners(this._notifyListeners, this);
        }
        public stopRunning(): void {
            this._war       = null;
            this._tileMap   = null;
            this._unitMap   = null;

            Notify.removeEventListeners(this._notifyListeners, this);
        }

        private _onNotifyBwCursorTapped(e: egret.Event): void {
            const data      = e.data as Notify.Data.BwCursorTapped;
            const gridIndex = data.tappedOn;
            if (GridIndexHelpers.checkIsEqual(gridIndex, data.current)) {
                this._handleAction(gridIndex);
            }
        }
        private _onNotifyBwCursorDragged(e: egret.Event): void {
            const data = e.data as Notify.Data.BwCursorDragged;
            this._handleAction(data.draggedTo);
        }

        private _setMode(mode: DrawerMode): void {
            this._mode = mode;
            Notify.dispatch(Notify.Type.MeDrawerModeChanged);
        }
        public setModeDeleteUnit(): void {
            this._setMode(DrawerMode.DeleteUnit);
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

        public setModeDrawTileObject(objectViewId: number): void {
            this._setDrawTargetTileObjectViewId(objectViewId);
            this._setDrawTargetTileBaseViewId(null);
            this._setMode(DrawerMode.DrawTileObject);
        }
        public setModeDrawTileBase(baseViewId: number): void {
            this._setDrawTargetTileObjectViewId(null);
            this._setDrawTargetTileBaseViewId(baseViewId);
            this._setMode(DrawerMode.DrawTileBase);
        }
        private _setDrawTargetTileObjectViewId(objectViewId: number): void {
            this._drawTargetTileObjectViewId = objectViewId;
        }
        public getDrawTargetTileObjectViewId(): number {
            return this._drawTargetTileObjectViewId;
        }
        private _setDrawTargetTileBaseViewId(baseViewId: number): void {
            this._drawTargetTileBaseViewId = baseViewId;
        }
        public getDrawTargetTileBaseViewId(): number {
            return this._drawTargetTileBaseViewId;
        }

        public setModeDrawUnit(viewId: number): void {
            this._setDrawTargetUnit(new MeUnit().init({
                gridX   : 0,
                gridY   : 0,
                unitId  : 0,
                viewId,
            }, this._war.getConfigVersion()));
            this._setMode(DrawerMode.DrawUnit);
        }
        private _setDrawTargetUnit(unit: MeUnit): void {
            this._drawTargetUnit = unit;
        }
        public getDrawTargetUnit(): MeUnit {
            return this._drawTargetUnit;
        }

        private _handleAction(gridIndex: GridIndex): void {
            const mode = this.getMode();
            if (mode === DrawerMode.DrawTileBase) {
                this._handleDrawTileBase(gridIndex);

            } else if (mode === DrawerMode.DrawTileObject) {
                this._handleDrawTileObject(gridIndex);

            } else if (mode === DrawerMode.DrawUnit) {
                this._handleDrawUnit(gridIndex);

            } else if (mode === DrawerMode.DeleteTileObject) {
                this._handleDeleteTileObject(gridIndex);

            } else if (mode === DrawerMode.DeleteUnit) {
                this._handleDeleteUnit(gridIndex);
            }
        }
        private _handleDrawTileBase(gridIndex: GridIndex): void {
            const tile = this._tileMap.getTile(gridIndex);
            tile.init({
                gridX       : tile.getGridX(),
                gridY       : tile.getGridY(),
                objectViewId: tile.getObjectViewId(),
                baseViewId  : this.getDrawTargetTileBaseViewId(),
            }, this._configVersion);
            tile.startRunning(this._war);
            tile.updateView();

            Notify.dispatch(Notify.Type.MeTileChanged, { gridIndex } as Notify.Data.MeTileChanged);
        }
        private _handleDrawTileObject(gridIndex: GridIndex): void {
            const tile = this._tileMap.getTile(gridIndex);
            tile.init({
                gridX       : tile.getGridX(),
                gridY       : tile.getGridY(),
                objectViewId: this.getDrawTargetTileObjectViewId(),
                baseViewId  : tile.getBaseViewId(),
            }, this._configVersion);
            tile.startRunning(this._war);
            tile.updateView();

            Notify.dispatch(Notify.Type.MeTileChanged, { gridIndex } as Notify.Data.MeTileChanged);
        }
        private _handleDrawUnit(gridIndex: GridIndex): void {
            this._handleDeleteUnit(gridIndex);

            const unitMap   = this._unitMap;
            const unitId    = unitMap.getNextUnitId();
            const unit      = new MeUnit().init({
                unitId,
                viewId  : this._drawTargetUnit.getViewId(),
                gridX   : gridIndex.x,
                gridY   : gridIndex.y,
            }, this._configVersion);
            unit.startRunning(this._war);
            unit.startRunningView();

            unitMap.addUnitOnMap(unit);
            unitMap.setNextUnitId(unitId + 1);

            Notify.dispatch(Notify.Type.MeUnitChanged, { gridIndex } as Notify.Data.MeUnitChanged);
        }
        private _handleDeleteTileObject(gridIndex: GridIndex): void {
            const tile = this._tileMap.getTile(gridIndex);
            tile.init({
                gridX       : tile.getGridX(),
                gridY       : tile.getGridY(),
                objectViewId: 0,
                baseViewId  : tile.getBaseViewId(),
            }, this._configVersion);
            tile.startRunning(this._war);
            tile.updateView();

            Notify.dispatch(Notify.Type.MeTileChanged, { gridIndex } as Notify.Data.MeTileChanged);
        }
        private _handleDeleteUnit(gridIndex: GridIndex): void {
            const unitMap   = this._unitMap;
            const unit      = unitMap.getUnitOnMap(gridIndex);
            if (unit) {
                unitMap.removeUnitOnMap(gridIndex, true);
                for (const u of unitMap.getUnitsLoadedByLoader(unit, true)) {
                    unitMap.removeUnitLoaded(u.getUnitId());
                }

                const gridVisionEffect = this._war.getGridVisionEffect();
                (gridVisionEffect) && (gridVisionEffect.showEffectExplosion(gridIndex));

                Notify.dispatch(Notify.Type.MeUnitChanged, { gridIndex } as Notify.Data.MeUnitChanged);
            }
        }
    }
}
