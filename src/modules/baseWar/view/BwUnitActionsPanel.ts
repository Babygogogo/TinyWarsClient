
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import StageManager             from "../../tools/helpers/StageManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Twns.Notify           from "../../tools/notify/NotifyType";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsBwActionPlanner      from "../model/BwActionPlanner";
// import TwnsBwUnit               from "../model/BwUnit";
// import TwnsBwWar                from "../model/BwWar";
// import TwnsBwUnitView           from "./BwUnitView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import NotifyType       = Twns.Notify.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import UnitActionType   = Types.UnitActionType;
    import BwWar            = BaseWar.BwWar;

    export type OpenDataForBwUnitActionsPanel = {
        war         : BwWar;
        destination : Types.GridIndex;
        actionList  : Twns.BaseWar.DataForUnitAction[];
    };
    export class BwUnitActionsPanel extends TwnsUiPanel.UiPanel<OpenDataForBwUnitActionsPanel> {
        private readonly _group!        : eui.Group;
        private readonly _listAction!   : TwnsUiScrollList.UiScrollList<DataForUnitActionRenderer>;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                // { type: Notify.Type.GlobalTouchBegin,           callback: this._onNotifyGlobalTouchBegin },
                // { type: Notify.Type.GlobalTouchMove,            callback: this._onNotifyGlobalTouchMove },
                // { type: Notify.Type.TileAnimationTick,          callback: this._onNotifyTileAnimationTick },
                { type: NotifyType.ZoomableContentsMoved,      callback: this._onNotifyZoomableContentsMoved },
            ]);
            this._listAction.setItemRenderer(UnitActionRenderer);

            this._updatePosition();
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
            this._updatePosition();
        }
        protected _onClosing(): void {
            // nothing to do
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
            const openData = this._getOpenData();
            if (openData == null) {
                throw Helpers.newError(`BwUnitActionsPanel._updateView() empty openData.`);
            }

            const war       = openData.war;
            const dataArray : DataForUnitActionRenderer[] = [];
            for (const data of openData.actionList) {
                const produceUnitType = data.produceUnitType;
                if (produceUnitType == null) {
                    dataArray.push({
                        war,
                        actionType          : data.actionType,
                        callback            : data.callback,
                        unit                : data.unitForDrop || data.unitForLaunch,
                        costForProduceUnit  : data.costForProduceUnit ?? null,
                    });
                } else {
                    const unitForProduce = new BaseWar.BwUnit();
                    unitForProduce.init({
                        gridIndex   : { x: -1, y: -1 },
                        unitId      : -1,
                        unitType    : produceUnitType,
                        playerIndex : war.getPlayerIndexInTurn(),
                    }, war.getGameConfig());
                    unitForProduce.startRunning(war);

                    dataArray.push({
                        war,
                        actionType          : data.actionType,
                        callback            : data.callback,
                        unit                : unitForProduce,
                        costForProduceUnit  : data.costForProduceUnit ?? null,
                    });
                }
            }

            dataArray[dataArray.length - 1].isLastAction = true;
            this._listAction.bindData(dataArray);
            this._group.height = Math.min(300, dataArray.length * 60);
        }

        private _updatePosition(): void {
            const openData = this._getOpenData();
            if (openData == null) {
                throw Helpers.newError(`BwUnitActionsPanel._updatePosition() empty openData.`);
            }

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

            group.x         = Math.max(0, Math.min(point.x, stage.stageWidth - 140));
            group.y         = Math.max(40, Math.min(point.y, stage.stageHeight - group.height));
        }

        protected async _showOpenAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { scaleX: 0, scaleY: 0 },
                endProps    : { scaleX: 1, scaleY: 1 },
                tweenTime   : 100,
            });

            await Helpers.wait(100);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { scaleX: 1, scaleY: 1 },
                endProps    : { scaleX: 0, scaleY: 0 },
                tweenTime   : 100,
            });

            await Helpers.wait(100);
        }
    }

    type DataForUnitActionRenderer = {
        war                 : BwWar;
        actionType          : UnitActionType;
        callback            : () => void;
        unit?               : BaseWar.BwUnit;
        costForProduceUnit  : number | null;
        isLastAction?       : boolean;
    };
    class UnitActionRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitActionRenderer> {
        private readonly _labelAction!      : TwnsUiLabel.UiLabel;
        private readonly _labelCost!        : TwnsUiLabel.UiLabel;
        private readonly _conUnitView!      : eui.Group;
        private readonly _imgBottomLine!    : TwnsUiImage.UiImage;

        private readonly _unitView      = new BaseWar.BwUnitView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
            ]);
            this._setShortSfxCode(Types.ShortSfxCode.CursorConfirm01);

            this._conUnitView.addChild(this._unitView);
        }

        protected _onDataChanged(): void {
            const data                  = this._getData();
            this._labelAction.text      = Lang.getUnitActionName(data.actionType) || CommonConstants.ErrorTextForUndefined;
            this._imgBottomLine.visible = !data.isLastAction;

            const unit      = data.unit;
            const unitView  = this._unitView;
            const labelCost = this._labelCost;
            if (unit == null) {
                labelCost.text      = "";
                unitView.visible    = false;
            } else {
                if (data.actionType !== Types.UnitActionType.ProduceUnit) {
                    labelCost.text = ``;
                } else {
                    const cost      = data.costForProduceUnit;
                    labelCost.text  = `${Lang.getText(LangTextType.B0079)}: ${cost != null ? cost : CommonConstants.ErrorTextForUndefined}`;
                }
                unitView.visible = true;
                unitView.init(unit).startRunningView();
            }
        }

        public onItemTapEvent(): void {
            const data = this._getData();
            if (!data.war.getActionPlanner().checkIsStateRequesting()) {
                data.callback();
            }
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data?.unit) {
                this._unitView.tickUnitAnimationFrame();
            }
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            if (this.data?.unit) {
                this._unitView.tickStateAnimationFrame();
            }
        }
    }
}

// export default TwnsBwUnitActionsPanel;
