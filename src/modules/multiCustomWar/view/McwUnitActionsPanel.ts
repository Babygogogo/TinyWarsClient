
namespace TinyWars.MultiCustomWar {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import StageManager     = Utility.StageManager;
    import Types            = Utility.Types;
    import UnitActionType   = Types.UnitActionType;

    const _LEFT_X       = 0;
    const _RIGHT_X      = 860;

    export class McwUnitActionsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McwUnitActionsPanel;

        private _group      : eui.Group;
        private _listAction : GameUi.UiScrollList;

        private _openData       : OpenDataForMcwUnitActionsPanel;
        private _war            : McwWar;
        private _actionPlanner  : McwActionPlanner;

        public static show(data: OpenDataForMcwUnitActionsPanel): void {
            if (!McwUnitActionsPanel._instance) {
                McwUnitActionsPanel._instance = new McwUnitActionsPanel();
            }
            McwUnitActionsPanel._instance._openData = data;
            McwUnitActionsPanel._instance.open();
        }
        public static hide(): void {
            if (McwUnitActionsPanel._instance) {
                McwUnitActionsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/multiCustomWar/McwUnitActionsPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                // { type: Notify.Type.GlobalTouchBegin,           callback: this._onNotifyGlobalTouchBegin },
                // { type: Notify.Type.GlobalTouchMove,            callback: this._onNotifyGlobalTouchMove },
                // { type: Notify.Type.TileAnimationTick,          callback: this._onNotifyTileAnimationTick },
                { type: Notify.Type.UnitAnimationTick,          callback: this._onNotifyUnitAnimationTick },
            ];

            this._listAction.setItemRenderer(UnitActionRenderer);
        }
        protected _onOpened(): void {
            this._war           = McwModel.getWar();
            this._actionPlanner = this._war.getField().getActionPlanner() as McwActionPlanner;

            this._updateView();
        }
        protected _onClosed(): void {
            delete this._war;
            delete this._actionPlanner;
            this._listAction.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyGlobalTouchBegin(e: egret.Event): void {
            this._adjustPositionOnTouch(e.data);
        }
        private _onNotifyGlobalTouchMove(e: egret.Event): void {
            this._adjustPositionOnTouch(e.data);
        }
        private _onNotifyTileAnimationTick(e: egret.Event): void {
        }
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const viewList = this._listAction.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof UnitActionRenderer) && (child.updateOnUnitAnimationTick());
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const war           = McwModel.getWar();
            const dataForList   = [] as DataForUnitActionRenderer[];
            for (const data of this._openData) {
                const unitForProduce = data.produceUnitType == null
                    ? undefined
                    : new McwUnit().init({
                        gridX   : -1,
                        gridY   : -1,
                        unitId  : -1,
                        viewId  : ConfigManager.getUnitViewId(data.produceUnitType, war.getPlayerIndexLoggedIn()),
                    }, war.getConfigVersion());

                dataForList.push({
                    actionType      : data.actionType,
                    callback        : data.callback,
                    unit            : data.unitForDrop || data.unitForLaunch || unitForProduce,
                    canProduceUnit  : data.canProduceUnit,
                });
            }

            this._listAction.bindData(dataForList);
        }

        private _adjustPositionOnTouch(e: egret.TouchEvent): void {
            if (e.target !== this._group) {
                this._group.x = (e.stageX >= StageManager.getStage().stageWidth / 2) ? _LEFT_X : _RIGHT_X;
            }
        }
    }

    type OpenDataForMcwUnitActionsPanel = BaseWar.OpenDataForBwUnitActionsPanel;
    type DataForUnitActionRenderer      = {
        actionType      : UnitActionType;
        callback        : () => void;
        unit?           : BaseWar.BwUnit;
        canProduceUnit? : boolean;
    }

    class UnitActionRenderer extends eui.ItemRenderer {
        private _labelAction: GameUi.UiLabel;
        private _labelCost  : GameUi.UiLabel;
        private _conUnitView: eui.Group;

        private _unitView   : McwUnitView;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._unitView = new McwUnitView();
            this._conUnitView.addChild(this._unitView);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForUnitActionRenderer;
            this._labelAction.text  = Lang.getUnitActionName(data.actionType);

            const unit = data.unit;
            if (unit == null) {
                this.currentState       = "withoutUnit";
                this._labelCost.text    = "";
            } else {
                this.currentState       = "withUnit";
                this._labelCost.text    = data.actionType !== Types.UnitActionType.ProduceUnit
                    ? ""
                    : `${Lang.getText(Lang.Type.B0079)}: ${unit.getProductionFinalCost()}`;
                this._unitView.init(unit).startRunningView();
            }
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            (this.data as DataForUnitActionRenderer).callback();
        }

        public updateOnUnitAnimationTick(): void {
            if ((this.data as DataForUnitActionRenderer).unit) {
                this._unitView.tickUnitAnimationFrame();
                this._unitView.tickStateAnimationFrame();
            }
        }
    }
}
