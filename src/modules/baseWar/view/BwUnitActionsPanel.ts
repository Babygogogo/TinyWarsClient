
namespace TinyWars.BaseWar {
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import StageManager     = Utility.StageManager;
    import Types            = Utility.Types;
    import UnitActionType   = Types.UnitActionType;

    const _LEFT_X       = 0;
    const _RIGHT_X      = 860;

    export type OpenDataForBwUnitActionsPanel = {
        war         : BwWar;
        destination : Types.GridIndex;
        actionList  : DataForUnitAction[];
    }
    export class BwUnitActionsPanel extends GameUi.UiPanel<OpenDataForBwUnitActionsPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwUnitActionsPanel;

        private _group      : eui.Group;
        private _listAction : GameUi.UiScrollList<DataForUnitActionRenderer, UnitActionRenderer>;

        public static show(openData: OpenDataForBwUnitActionsPanel): void {
            if (!BwUnitActionsPanel._instance) {
                BwUnitActionsPanel._instance = new BwUnitActionsPanel();
            }
            BwUnitActionsPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (BwUnitActionsPanel._instance) {
                await BwUnitActionsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = `resource/skins/baseWar/BwUnitActionsPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                // { type: Notify.Type.GlobalTouchBegin,           callback: this._onNotifyGlobalTouchBegin },
                // { type: Notify.Type.GlobalTouchMove,            callback: this._onNotifyGlobalTouchMove },
                // { type: Notify.Type.TileAnimationTick,          callback: this._onNotifyTileAnimationTick },
                { type: Notify.Type.ZoomableContentsMoved,      callback: this._onNotifyZoomableContentsMoved },
                { type: Notify.Type.UnitAnimationTick,          callback: this._onNotifyUnitAnimationTick },
            ]);
            this._listAction.setItemRenderer(UnitActionRenderer);

            this._showOpenAnimation();
            this._updateView();
            this._updatePosition();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
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
        private _onNotifyZoomableContentsMoved(e: egret.Event): void {
            this._updatePosition();
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
            const openData  = this._getOpenData();
            const war       = openData.war;
            const dataArray : DataForUnitActionRenderer[] = [];
            for (const data of openData.actionList) {
                const produceUnitType = data.produceUnitType;
                if (produceUnitType == null) {
                    dataArray.push({
                        actionType      : data.actionType,
                        callback        : data.callback,
                        unit            : data.unitForDrop || data.unitForLaunch,
                        canProduceUnit  : data.canProduceUnit,
                    });
                } else {
                    const unitForProduce = new BaseWar.BwUnit();
                    unitForProduce.init({
                        gridIndex   : { x: -1, y: -1 },
                        unitId      : -1,
                        unitType    : produceUnitType,
                        playerIndex : war.getPlayerIndexInTurn(),
                    }, war.getConfigVersion());
                    unitForProduce.startRunning(war);

                    dataArray.push({
                        actionType      : data.actionType,
                        callback        : data.callback,
                        unit            : unitForProduce,
                        canProduceUnit  : data.canProduceUnit,
                    });
                }
            }

            this._listAction.bindData(dataArray);
            this._group.height = Math.min(300, (dataArray.length || 1) * 60);
        }

        private _updatePosition(): void {
            const openData  = this._getOpenData();
            const container = openData.war.getView().getFieldContainer();
            const contents  = container.getContents();
            const gridIndex = openData.destination;
            const gridSize  = Utility.CommonConstants.GridSize;
            const stage     = Utility.StageManager.getStage();
            const group     = this._group;
            const point     = contents.localToGlobal(
                (gridIndex.x + 1) * gridSize.width,
                (gridIndex.y + 1) * gridSize.height,
            );

            group.x         = Math.max(0, Math.min(point.x, stage.stageWidth - 130));
            group.y         = Math.max(40, Math.min(point.y, stage.stageHeight - group.height));
        }

        private _adjustPositionOnTouch(e: egret.TouchEvent): void {
            if (e.target !== this._group) {
                this._group.x = (e.stageX >= StageManager.getStage().stageWidth / 2) ? _LEFT_X : _RIGHT_X;
            }
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { scaleX: 0, scaleY: 0 },
                endProps    : { scaleX: 1, scaleY: 1 },
                tweenTime   : 100,
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { scaleX: 1, scaleY: 1 },
                    endProps    : { scaleX: 0, scaleY: 0 },
                    tweenTime   : 100,
                    callback    : resolve,
                });
            });
        }
    }

    type DataForUnitActionRenderer = {
        actionType      : UnitActionType;
        callback        : () => void;
        unit?           : BaseWar.BwUnit;
        canProduceUnit? : boolean;
    }

    class UnitActionRenderer extends GameUi.UiListItemRenderer<DataForUnitActionRenderer> {
        private _labelAction: GameUi.UiLabel;
        private _labelCost  : GameUi.UiLabel;
        private _conUnitView: eui.Group;

        private _unitView   : BaseWar.BwUnitView;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._unitView = new BaseWar.BwUnitView();
            this._conUnitView.addChild(this._unitView);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data;
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
            this.data.callback();
        }

        public updateOnUnitAnimationTick(): void {
            if (this.data.unit) {
                this._unitView.tickUnitAnimationFrame();
                this._unitView.tickStateAnimationFrame();
            }
        }
    }
}
