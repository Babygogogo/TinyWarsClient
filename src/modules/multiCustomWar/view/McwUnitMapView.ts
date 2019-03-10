
namespace TinyWars.MultiCustomWar {
    import Notify               = Utility.Notify;
    import Types                = Utility.Types;
    import UnitCategory         = Types.UnitCategory;
    import ActionPlannerState   = Types.ActionPlannerState;

    const _GRID_SIZE = ConfigManager.getGridSize();

    export class McwUnitMapView extends egret.DisplayObjectContainer {
        private _layerForNaval  = new egret.DisplayObjectContainer();
        private _layerForGround = new egret.DisplayObjectContainer();
        private _layerForAir    = new egret.DisplayObjectContainer();

        private _unitMap        : McwUnitMap;
        private _actionPlanner  : McwActionPlanner;

        private _notifyListeners = [
            { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
            { type: Notify.Type.McwActionPlannerStateChanged,   callback: this._onNotifyMcwActionPlannerStateChanged },
        ];

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public constructor() {
            super();

            this.addChild(this._layerForNaval);
            this.addChild(this._layerForGround);
            this.addChild(this._layerForAir);
        }

        public init(unitMap: McwUnitMap): void {
            this._unitMap = unitMap;

            unitMap.forEachUnit(unit => this.addUnit(unit.getView(), false));
            this._resetZOrderForAllLayers();
        }

        public startRunning(): void {
            this._actionPlanner = this._unitMap.getWar().getField().getActionPlanner();
            Notify.addEventListeners(this._notifyListeners, this);
        }
        public stopRunning(): void {
            Notify.removeEventListeners(this._notifyListeners, this);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public addUnit(view: McwUnitView, needResetZOrder: boolean): void {
            const model = view.getUnit();

            view.x = _GRID_SIZE.width * model.getGridX();
            view.y = _GRID_SIZE.height * model.getGridY();
            (model.getLoaderUnitId() != null) && (view.visible = false);

            const layer = this._getLayerByUnitType(model.getType());
            layer.addChild(view);
            (needResetZOrder) && (this._resetZOrderForLayer(layer));
        }

        public removeUnit(view: McwUnitView): void {
            view.parent.removeChild(view);
        }

        public resetZOrder(unitType: Types.UnitType): void {
            this._resetZOrderForLayer(this._getLayerByUnitType(unitType));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            this._updateAnimationsOnTick(this._layerForAir);
            this._updateAnimationsOnTick(this._layerForGround);
            this._updateAnimationsOnTick(this._layerForNaval);
        }

        private _onNotifyMcwActionPlannerStateChanged(e: egret.Event): void {
            const actionPlanner = this._actionPlanner;
            const state         = actionPlanner.getState();
            this._setAllUnitsOnMapVisible(true);

            if (state === ActionPlannerState.Idle) {
                // Do nothing.

            } else if (state === ActionPlannerState.ChoosingProductionTarget) {
                // Do nothing.

            } else if (state === ActionPlannerState.MakingMovePathForUnitOnMap) {
                actionPlanner.getFocusUnitOnMap().getView().visible = false;

            } else if (state === ActionPlannerState.PreviewingAttackableArea) {
                for (const [, unit] of actionPlanner.getUnitsForPreviewingAttackableArea()) {
                    unit.getView().visible = false;
                }

            } else if (state === ActionPlannerState.PreviewingMovableArea) {
                // TODO

            } else {
                // TODO
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other private functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _resetZOrderForLayer(layer: egret.DisplayObjectContainer): void {
            const viewsCount    = layer.numChildren;
            const views         = new Array<McwUnitView>(viewsCount);
            for (let i = 0; i < viewsCount; ++i) {
                views[i] = layer.getChildAt(i) as any;
            }
            views.sort((v1, v2) => v1.getUnit().getGridY() - v2.getUnit().getGridY());
            for (let i = 0; i < viewsCount; ++i) {
                layer.setChildIndex(views[i], i);
            }
        }
        private _resetZOrderForAllLayers(): void {
            this._resetZOrderForLayer(this._layerForAir);
            this._resetZOrderForLayer(this._layerForGround);
            this._resetZOrderForLayer(this._layerForNaval);
        }

        private _updateAnimationsOnTick(layer: egret.DisplayObjectContainer): void {
            const viewsCount = layer.numChildren;
            for (let i = 0; i < viewsCount; ++i) {
                const view = layer.getChildAt(i) as McwUnitView;
                view.tickStateAnimationFrame();
                view.tickUnitAnimationFrame();
            }
        }

        private _getLayerByUnitType(unitType: Types.UnitType): egret.DisplayObjectContainer | undefined {
            const version = this._unitMap.getConfigVersion();
            if (ConfigManager.checkIsUnitTypeInCategory(version, unitType, UnitCategory.Air)) {
                return this._layerForAir;
            } else if (ConfigManager.checkIsUnitTypeInCategory(version, unitType, UnitCategory.Ground)) {
                return this._layerForGround;
            } else if (ConfigManager.checkIsUnitTypeInCategory(version, unitType, UnitCategory.Naval)) {
                return this._layerForNaval;
            } else {
                return undefined;
            }
        }

        private _setAllUnitsOnMapVisible(visible: boolean): void {
            this._unitMap.forEachUnitOnMap(unit => unit.getView().visible = visible);
        }
    }
}
