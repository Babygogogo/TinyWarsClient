
// import CommonConstants      from "../../tools/helpers/CommonConstants";
// import ConfigManager        from "../../tools/helpers/ConfigManager";
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Notify               from "../../tools/notify/Notify";
// import Notify       from "../../tools/notify/NotifyType";
// import WarVisibilityHelpers from "../../tools/warHelpers/WarVisibilityHelpers";
// import UserModel            from "../../user/model/UserModel";
// import TwnsBwUnitMap        from "../model/BwUnitMap";
// import TwnsBwUnitView       from "./BwUnitView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import NotifyType           = Notify.NotifyType;
    import ActionPlannerState   = Types.ActionPlannerState;

    const { width: _GRID_WIDTH, height: _GRID_HEIGHT } = CommonConstants.GridSize;

    export class BwUnitMapView extends egret.DisplayObjectContainer {
        private readonly _layerForNaval     = new egret.DisplayObjectContainer();
        private readonly _layerForGround    = new egret.DisplayObjectContainer();
        private readonly _layerForAir       = new egret.DisplayObjectContainer();
        private readonly _notifyListeners   = [
            { type: NotifyType.UnitAnimationTick,                   callback: this._onNotifyUnitAnimationTick },
            { type: NotifyType.UnitStateIndicatorTick,              callback: this._onNotifyUnitStateIndicatorTick },
            { type: NotifyType.BwActionPlannerStateSet,             callback: this._onNotifyBwActionPlannerStateChanged },
            { type: NotifyType.UserSettingsOpacitySettingsChanged,  callback: this._onNotifyUserSettingsOpacitySettingsChanged },
        ];

        private _unitMap    : BaseWar.BwUnitMap | null = null;

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Initializers.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public constructor() {
            super();

            this.addChild(this._layerForNaval);
            this.addChild(this._layerForGround);
            this.addChild(this._layerForAir);
            this._updateOpacityForAllLayers();
        }

        public init(unitMap: BaseWar.BwUnitMap): void {
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

        private _getUnitMap(): BaseWar.BwUnitMap {
            return Helpers.getExisted(this._unitMap);
        }
        private _setUnitMap(unitMap: BaseWar.BwUnitMap): void {
            this._unitMap = unitMap;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Other public functions.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        public addUnit(view: BaseWar.BwUnitView, needResetZOrder: boolean): void {
            const model = Helpers.getExisted(view.getUnit());

            view.x = _GRID_WIDTH * model.getGridX();
            view.y = _GRID_HEIGHT * model.getGridY();
            (model.getLoaderUnitId() != null) && (view.visible = false);

            const layer = this._getLayerByUnitType(model.getUnitType());
            layer.addChild(view);
            (needResetZOrder) && (this._resetZOrderForLayer(layer));
        }

        public removeUnit(view: BaseWar.BwUnitView): void {
            (view.parent) && (view.parent.removeChild(view));
        }

        public resetZOrder(unitType: number): void {
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

        private _onNotifyUnitStateIndicatorTick(): void {
            this._updateIndicatorOnTick(this._layerForAir);
            this._updateIndicatorOnTick(this._layerForGround);
            this._updateIndicatorOnTick(this._layerForNaval);
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

            } else if (state === ActionPlannerState.PreviewingUnitAttackableArea) {
                this._resetVisibleForAllUnitsOnMap();
                for (const [, unit] of actionPlanner.getUnitsForPreviewingAttackableArea()) {
                    unit.setViewVisible(false);
                }

            } else if (state === ActionPlannerState.PreviewingUnitMovableArea) {
                this._resetVisibleForAllUnitsOnMap();
                Helpers.getExisted(actionPlanner.getUnitForPreviewingMovableArea()).setViewVisible(false);

            } else if (state === ActionPlannerState.PreviewingUnitVisibleArea) {
                this._resetVisibleForAllUnitsOnMap();
                Helpers.getExisted(actionPlanner.getUnitForPreviewingVisibleArea()).setViewVisible(false);

            } else if (state === ActionPlannerState.PreviewingTileAttackableArea) {
                this._resetVisibleForAllUnitsOnMap();

            } else {
                // Nothing to do.
            }
        }

        private _onNotifyUserSettingsOpacitySettingsChanged(): void {
            this._updateOpacityForAllLayers();
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
            const views         = new Array<BaseWar.BwUnitView>(viewsCount);
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
                const view = layer.getChildAt(i) as BaseWar.BwUnitView;
                view.tickUnitAnimationFrame();
            }
        }

        private _updateIndicatorOnTick(layer: egret.DisplayObjectContainer): void {
            const viewsCount = layer.numChildren;
            for (let i = 0; i < viewsCount; ++i) {
                const view = layer.getChildAt(i) as BaseWar.BwUnitView;
                view.tickStateAnimationFrame();
            }
        }

        private _getLayerByUnitType(unitType: number): egret.DisplayObjectContainer {
            switch (this._getUnitMap().getWar().getGameConfig().getUnitTemplateCfg(unitType)?.layer) {
                case CommonConstants.UnitDisplayLayer.Air       : return this._layerForAir;
                case CommonConstants.UnitDisplayLayer.Ground    : return this._layerForGround;
                case CommonConstants.UnitDisplayLayer.Sea       : return this._layerForNaval;
                default                                         : throw Helpers.newError(`Invalid layer.`, ClientErrorCode.BwUnitMapView_GetLayerByUnitType_00);
            }
        }

        private _resetVisibleForAllUnitsOnMap(): void {
            const unitMap       = this._getUnitMap();
            const war           = unitMap.getWar();
            const visibleUnits  = WarHelpers.WarVisibilityHelpers.getAllUnitsOnMapVisibleToTeams(war, war.getPlayerManager().getWatcherTeamIndexesForSelf());
            for (const unit of unitMap.getAllUnitsOnMap()) {
                unit.setViewVisible(visibleUnits.has(unit));
            }
        }

        private _updateOpacityForAllLayers(): void {
            const opacity               = (User.UserModel.getSelfSettingsOpacitySettings()?.unitOpacity ?? 100) / 100;
            this._layerForAir.alpha     = opacity;
            this._layerForGround.alpha  = opacity;
            this._layerForNaval.alpha   = opacity;
        }
    }
}

// export default TwnsBwUnitMapView;
