
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

        private _openData       : DataForUnitActionRenderer[];
        private _war            : McwWar;
        private _actionPlanner  : McwActionPlanner;

        public static show(data: DataForUnitActionRenderer[]): void {
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
                { type: Notify.Type.TileAnimationTick,          callback: this._onNotifyTileAnimationTick },
            ];

            this._listAction.setItemRenderer(UnitActionRenderer);
        }
        protected _onOpened(): void {
            this._war           = McwModel.getWar();
            this._actionPlanner = this._war.getField().getActionPlanner();

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

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._listAction.bindData(this._openData);
        }

        private _adjustPositionOnTouch(e: egret.TouchEvent): void {
            if (e.target !== this._group) {
                this._group.x = (e.stageX >= StageManager.getStage().stageWidth / 2) ? _LEFT_X : _RIGHT_X;
            }
        }
    }

    export type DataForUnitActionRenderer = {
        actionType  : UnitActionType;
        callback    : () => void;
    }

    class UnitActionRenderer extends eui.ItemRenderer {
        private _labelAction: GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForUnitActionRenderer;
            this._labelAction.text  = Lang.getUnitActionName(data.actionType);
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            (this.data as DataForUnitActionRenderer).callback();
        }
    }
}
