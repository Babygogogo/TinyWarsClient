
import CommonConstants          from "../../tools/helpers/CommonConstants";
import Helpers                  from "../../tools/helpers/Helpers";
import StageManager             from "../../tools/helpers/StageManager";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiPanel              from "../../tools/ui/UiPanel";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsBwActionPlanner      from "../model/BwActionPlanner";
import TwnsBwUnit               from "../model/BwUnit";
import TwnsBwWar                from "../model/BwWar";
import TwnsBwUnitView           from "./BwUnitView";

namespace TwnsBwUnitActionsPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import UnitActionType   = Types.UnitActionType;
    import BwWar            = TwnsBwWar.BwWar;
    import BwUnitView       = TwnsBwUnitView.BwUnitView;

    export type OpenDataForBwUnitActionsPanel = {
        war         : BwWar;
        destination : Types.GridIndex;
        actionList  : TwnsBwActionPlanner.DataForUnitAction[];
    };
    export class BwUnitActionsPanel extends TwnsUiPanel.UiPanel<OpenDataForBwUnitActionsPanel> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwUnitActionsPanel;

        private _group      : eui.Group;
        private _listAction : TwnsUiScrollList.UiScrollList<DataForUnitActionRenderer>;

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
                { type: NotifyType.ZoomableContentsMoved,      callback: this._onNotifyZoomableContentsMoved },
            ]);
            this._listAction.setItemRenderer(UnitActionRenderer);

            this._showOpenAnimation();
            this._updateView();
            this._updatePosition();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyZoomableContentsMoved(): void {
            this._updatePosition();
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
                        war,
                        actionType      : data.actionType,
                        callback        : data.callback,
                        unit            : data.unitForDrop || data.unitForLaunch,
                        canProduceUnit  : data.canProduceUnit,
                    });
                } else {
                    const unitForProduce = new TwnsBwUnit.BwUnit();
                    unitForProduce.init({
                        gridIndex   : { x: -1, y: -1 },
                        unitId      : -1,
                        unitType    : produceUnitType,
                        playerIndex : war.getPlayerIndexInTurn(),
                    }, war.getConfigVersion());
                    unitForProduce.startRunning(war);

                    dataArray.push({
                        war,
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
            const gridSize  = CommonConstants.GridSize;
            const stage     = StageManager.getStage();
            const group     = this._group;
            const point     = contents.localToGlobal(
                (gridIndex.x + 1) * gridSize.width,
                (gridIndex.y + 1) * gridSize.height,
            );

            group.x         = Math.max(0, Math.min(point.x, stage.stageWidth - 130));
            group.y         = Math.max(40, Math.min(point.y, stage.stageHeight - group.height));
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
        war             : BwWar;
        actionType      : UnitActionType;
        callback        : () => void;
        unit?           : TwnsBwUnit.BwUnit;
        canProduceUnit? : boolean;
    };

    class UnitActionRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitActionRenderer> {
        private _labelAction: TwnsUiLabel.UiLabel;
        private _labelCost  : TwnsUiLabel.UiLabel;
        private _conUnitView: eui.Group;

        private _unitView   : BwUnitView;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ]);

            this._unitView = new BwUnitView();
            this._conUnitView.addChild(this._unitView);
        }

        protected _onDataChanged(): void {
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
                    : `${Lang.getText(LangTextType.B0079)}: ${unit.getProductionFinalCost()}`;
                this._unitView.init(unit).startRunningView();
            }
        }

        public onItemTapEvent(): void {
            const data = this.data;
            if (!data.war.getActionPlanner().checkIsStateRequesting()) {
                data.callback();
            }
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data.unit) {
                this._unitView.tickUnitAnimationFrame();
                this._unitView.tickStateAnimationFrame();
            }
        }
    }
}

export default TwnsBwUnitActionsPanel;
