
namespace TinyWars.MapEditor {
    import Types        = Utility.Types;
    import Notify       = Utility.Notify;
    import DrawerMode   = Types.MapEditorDrawerMode;

    export class MeDrawer {
        private _war            : MeWar;
        private _mode           = DrawerMode.Preview;
        private _drawTargetTile : MeTile;
        private _drawTargetUnit : MeUnit;

        private _notifyListeners: Notify.Listener[] = [
        ];

        public init(mapRawData: Types.MapRawData): MeDrawer {
            return this;
        }

        public startRunning(war: MeWar): void {
            this._war = war;

            Notify.addEventListeners(this._notifyListeners, this);
        }
        public stopRunning(): void {
            Notify.removeEventListeners(this._notifyListeners, this);
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

        public setModeDrawTargetTileObjectViewId(objectViewId: number): void {
            this._setDrawTargetTile(new MeTile().init({
                gridX       : 0,
                gridY       : 0,
                objectViewId,
                baseViewId  : 0,
            }, this._war.getConfigVersion()));
            this._setMode(DrawerMode.DrawTileObject);
        }
        public setModeDrawTargetTileBaseViewId(baseViewId: number): void {
            this._setDrawTargetTile(new MeTile().init({
                gridX       : 0,
                gridY       : 0,
                objectViewId: 0,
                baseViewId,
            }, this._war.getConfigVersion()));
            this._setMode(DrawerMode.DrawTileBase);
        }
        private _setDrawTargetTile(tile: MeTile): void {
            this._drawTargetTile = tile;
        }
        public getDrawTargetTile(): MeTile {
            return this._drawTargetTile;
        }

        public setDrawTargetUnitViewId(viewId: number): void {
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
    }
}
