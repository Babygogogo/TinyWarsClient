
namespace TinyWars.SingleCustomWar {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import StageManager     = Utility.StageManager;
    import Types            = Utility.Types;
    import UnitActionType   = Types.UnitActionType;

    const _LEFT_X       = 0;
    const _RIGHT_X      = 860;

    export class ScwUnitActionsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ScwUnitActionsPanel;

        private _group      : eui.Group;
        private _listAction : GameUi.UiScrollList;

        private _openData       : OpenDataForScwUnitActionsPanel;
        private _war            : ScwWar;
        private _actionPlanner  : ScwActionPlanner;

        public static show(data: OpenDataForScwUnitActionsPanel): void {
            if (!ScwUnitActionsPanel._instance) {
                ScwUnitActionsPanel._instance = new ScwUnitActionsPanel();
            }
            ScwUnitActionsPanel._instance._openData = data;
            ScwUnitActionsPanel._instance.open();
        }
        public static hide(): void {
            if (ScwUnitActionsPanel._instance) {
                ScwUnitActionsPanel._instance.close();
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
            this._war           = ScwModel.getWar();
            this._actionPlanner = this._war.getField().getActionPlanner() as ScwActionPlanner;

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
            const war           = ScwModel.getWar();
            const dataForList   = [] as DataForUnitActionRenderer[];
            for (const data of this._openData) {
                const unitForProduce = data.produceUnitType == null
                    ? undefined
                    : new ScwUnit().init({
                        gridX   : -1,
                        gridY   : -1,
                        unitId  : -1,
                        viewId  : Utility.ConfigManager.getUnitViewId(data.produceUnitType, war.getPlayerIndexInTurn()),
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

    type OpenDataForScwUnitActionsPanel = BaseWar.OpenDataForBwUnitActionsPanel;
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

        private _unitView   : ScwUnitView;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._unitView = new ScwUnitView();
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
