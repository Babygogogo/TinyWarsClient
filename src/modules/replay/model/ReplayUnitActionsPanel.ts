
namespace TinyWars.Replay {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import StageManager     = Utility.StageManager;
    import Types            = Utility.Types;
    import UnitActionType   = Types.UnitActionType;

    const _LEFT_X       = 0;
    const _RIGHT_X      = 860;

    export class ReplayUnitActionsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ReplayUnitActionsPanel;

        private _group      : eui.Group;
        private _listAction : GameUi.UiScrollList;

        private _openData       : OpenDataForReplayUnitActionsPanel;
        private _war            : ReplayWar;
        private _actionPlanner  : ReplayActionPlanner;

        public static show(data: OpenDataForReplayUnitActionsPanel): void {
            if (!ReplayUnitActionsPanel._instance) {
                ReplayUnitActionsPanel._instance = new ReplayUnitActionsPanel();
            }
            ReplayUnitActionsPanel._instance._openData = data;
            ReplayUnitActionsPanel._instance.open();
        }
        public static hide(): void {
            if (ReplayUnitActionsPanel._instance) {
                ReplayUnitActionsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/replay/ReplayUnitActionsPanel.exml`;
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
            this._war           = ReplayModel.getWar();
            this._actionPlanner = this._war.getField().getActionPlanner() as ReplayActionPlanner;

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
            const war       = ReplayModel.getWar();
            const unitMap   = war.getUnitMap();
            const dataList  : DataForUnitActionRenderer[] = [];
            for (const data of this._openData) {
                const unitForProduce = data.produceUnitType == null
                    ? undefined
                    : (new (unitMap.getUnitClass())).init({
                        gridIndex   : { x: -1, y: -1 },
                        unitId      : -1,
                        unitType    : data.produceUnitType,
                        playerIndex : war.getPlayerIndexInTurn(),
                    }, war.getConfigVersion()) as ReplayUnit;

                dataList.push({
                    actionType      : data.actionType,
                    callback        : data.callback,
                    unit            : data.unitForDrop || data.unitForLaunch || unitForProduce,
                    canProduceUnit  : data.canProduceUnit,
                });
            }

            this._listAction.bindData(dataList);
        }

        private _adjustPositionOnTouch(e: egret.TouchEvent): void {
            if (e.target !== this._group) {
                this._group.x = (e.stageX >= StageManager.getStage().stageWidth / 2) ? _LEFT_X : _RIGHT_X;
            }
        }
    }

    export type OpenDataForReplayUnitActionsPanel   = BaseWar.OpenDataForBwUnitActionsPanel;
    type DataForUnitActionRenderer = {
        actionType      : UnitActionType;
        callback        : () => void;
        unit?           : BaseWar.BwUnit;
        canProduceUnit? : boolean;
    }

    class UnitActionRenderer extends eui.ItemRenderer {
        private _labelAction: GameUi.UiLabel;
        private _labelCost  : GameUi.UiLabel;
        private _conUnitView: eui.Group;

        private _unitView   : ReplayUnitView;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._unitView = new ReplayUnitView();
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
