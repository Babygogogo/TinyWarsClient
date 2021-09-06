
import CommonConstants      from "../../tools/helpers/CommonConstants";
import ConfigManager        from "../../tools/helpers/ConfigManager";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import Notify               from "../../tools/notify/Notify";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
import TwnsBwUnitMap        from "../model/BwUnitMap";
import TwnsBwUnitView       from "./BwUnitView";

namespace TwnsBwUnitMapView {
    import NotifyType           = TwnsNotifyType.NotifyType;
    import BwUnitView           = TwnsBwUnitView.BwUnitView;
    import UnitCategory         = Types.UnitCategory;
    import ActionPlannerState   = Types.ActionPlannerState;
    import BwUnitMap            = TwnsBwUnitMap.BwUnitMap;

    const { width: _GRID_WIDTH, height: _GRID_HEIGHT } = CommonConstants.GridSize;

    export class BwUnitMapView extends egret.DisplayObjectContainer {
        private readonly _layerForNaval     = new egret.DisplayObjectContainer();
        private readonly _layerForGround    = new egret.DisplayObjectContainer();
        private readonly _layerForAir       = new egret.DisplayObjectContainer();
        private readonly _notifyListeners   = [
            { type: NotifyType.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
            { type: NotifyType.BwActionPlannerStateChanged,    callback: this._onNotifyBwActionPlannerStateChanged },
        ];

        private _unitMap    : BwUnitMap | null = null;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public constructor() {
            super();

            this.addChild(this._layerForNaval);
            this.addChild(this._layerForGround);
            this.addChild(this._layerForAir);
        }

        public init(unitMap: BwUnitMap): void {
            this._setUnitMap(unitMap);

            this._clearAllUnits();
            this._resetZOrderForAllLayers();
        }

        public startRunningView(): void {
            this._clearAllUnits();
            for (const unit of this._getUnitMap().getAllUnits()) {
                this.addUnit(unit.getView(), false);
            }

            Notify.addEventListeners(this._notifyListeners, this);
        }
        public stopRunningView(): void {
            Notify.removeEventListeners(this._notifyListeners, this);
        }

        private _getUnitMap(): BwUnitMap {
            return Helpers.getExisted(this._unitMap);
        }
        private _setUnitMap(unitMap: BwUnitMap): void {
            this._unitMap = unitMap;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public addUnit(view: BwUnitView, needResetZOrder: boolean): void {
            const model = Helpers.getExisted(view.getUnit());

            view.x = _GRID_WIDTH * model.getGridX();
            view.y = _GRID_HEIGHT * model.getGridY();
            (model.getLoaderUnitId() != null) && (view.visible = false);

            const layer = this._getLayerByUnitType(model.getUnitType());
            layer.addChild(view);
            (needResetZOrder) && (this._resetZOrderForLayer(layer));
        }

        public removeUnit(view: BwUnitView): void {
            view.parent.removeChild(view);
        }

        public resetZOrder(unitType: Types.UnitType): void {
            this._resetZOrderForLayer(this._getLayerByUnitType(unitType));
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyUnitAnimationTick(): void {
            this._updateAnimationsOnTick(this._layerForAir);
            this._updateAnimationsOnTick(this._layerForGround);
            this._updateAnimationsOnTick(this._layerForNaval);
        }

        private _onNotifyBwActionPlannerStateChanged(): void {
            const actionPlanner = this._getUnitMap().getWar().getActionPlanner();
            const state         = actionPlanner.getState();

            if (state === ActionPlannerState.Idle) {
                this._resetVisibleForAllUnitsOnMap();

            } else if (state === ActionPlannerState.ExecutingAction) {
                this._resetVisibleForAllUnitsOnMap();

            } else if (state === ActionPlannerState.MakingMovePath) {
                this._resetVisibleForAllUnitsOnMap();
                Helpers.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
                const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
                (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

            } else if (state === ActionPlannerState.ChoosingAction) {
                this._resetVisibleForAllUnitsOnMap();
                Helpers.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
                const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
                (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

            } else if (state === ActionPlannerState.ChoosingAttackTarget) {
                this._resetVisibleForAllUnitsOnMap();
                Helpers.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
                const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
                (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

            } else if (state === ActionPlannerState.ChoosingDropDestination) {
                this._resetVisibleForAllUnitsOnMap();
                Helpers.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
                const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
                (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

            } else if (state === ActionPlannerState.ChoosingFlareDestination) {
                this._resetVisibleForAllUnitsOnMap();
                Helpers.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
                const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
                (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

            } else if (state === ActionPlannerState.ChoosingSiloDestination) {
                this._resetVisibleForAllUnitsOnMap();
                Helpers.getExisted(actionPlanner.getFocusUnitOnMap()).setViewVisible(false);
                const focusUnitLoaded = actionPlanner.getFocusUnitLoaded();
                (focusUnitLoaded) && (focusUnitLoaded.setViewVisible(false));

            } else if (state === ActionPlannerState.ChoosingProductionTarget) {
                this._resetVisibleForAllUnitsOnMap();

            } else if (state === ActionPlannerState.PreviewingAttackableArea) {
                this._resetVisibleForAllUnitsOnMap();
                for (const [, unit] of actionPlanner.getUnitsForPreviewingAttackableArea()) {
                    unit.setViewVisible(false);
                }

            } else if (state === ActionPlannerState.PreviewingMovableArea) {
                this._resetVisibleForAllUnitsOnMap();
                Helpers.getExisted(actionPlanner.getUnitForPreviewingMovableArea()).setViewVisible(false);

            } else {
                // Nothing to do.
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other private functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _clearAllUnits(): void {
            this._layerForAir.removeChildren();
            this._layerForGround.removeChildren();
            this._layerForNaval.removeChildren();
        }

        private _resetZOrderForLayer(layer: egret.DisplayObjectContainer): void {
            const viewsCount    = layer.numChildren;
            const views         = new Array<BwUnitView>(viewsCount);
            for (let i = 0; i < viewsCount; ++i) {
                views[i] = layer.getChildAt(i) as any;
            }
            views.sort((v1, v2) => Helpers.getExisted(v1.getUnit()).getGridY() - Helpers.getExisted(v2.getUnit()).getGridY());
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
                const view = layer.getChildAt(i) as BwUnitView;
                view.tickStateAnimationFrame();
                view.tickUnitAnimationFrame();
            }
        }

        private _getLayerByUnitType(unitType: Types.UnitType): egret.DisplayObjectContainer {
            const version = this._getUnitMap().getWar().getConfigVersion();
            if (ConfigManager.checkIsUnitTypeInCategory(version, unitType, UnitCategory.Air)) {
                return this._layerForAir;
            } else if (ConfigManager.checkIsUnitTypeInCategory(version, unitType, UnitCategory.Ground)) {
                return this._layerForGround;
            } else if (ConfigManager.checkIsUnitTypeInCategory(version, unitType, UnitCategory.Naval)) {
                return this._layerForNaval;
            } else {
                throw new Error(`Invalid unitType: ${unitType}`);
            }
        }

        private _resetVisibleForAllUnitsOnMap(): void {
            const unitMap       = this._getUnitMap();
            const war           = unitMap.getWar();
            const visibleUnits  = WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getAliveWatcherTeamIndexesForSelf());
            for (const unit of unitMap.getAllUnitsOnMap()) {
                unit.setViewVisible(visibleUnits.has(unit));
            }
        }
    }
}

export default TwnsBwUnitMapView;
