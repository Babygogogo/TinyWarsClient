
namespace TinyWars.SingleCustomWar {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import FloatText    = Utility.FloatText;
    import UnitType     = Types.UnitType;
    import GridIndex    = Types.GridIndex;

    export class ScwProduceUnitPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ScwProduceUnitPanel;

        private _group      : eui.Group;
        private _listUnit   : GameUi.UiScrollList;
        private _btnCancel  : GameUi.UiButton;
        private _btnDetail  : GameUi.UiButton;

        private _war        : ScwWar;
        private _gridIndex  : GridIndex;
        private _dataForList: DataForUnitRenderer[];

        public static show(gridIndex: GridIndex): void {
            if (!ScwProduceUnitPanel._instance) {
                ScwProduceUnitPanel._instance = new ScwProduceUnitPanel();
            }
            ScwProduceUnitPanel._instance._gridIndex = gridIndex;
            ScwProduceUnitPanel._instance.open();
        }
        public static hide(): void {
            if (ScwProduceUnitPanel._instance) {
                ScwProduceUnitPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = ScwProduceUnitPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/multiCustomWar/McwProduceUnitPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyScwPlannerStateChanged },
            ];
            this._uiListeners = [
                { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
                { ui: this._btnDetail, callback: this._onTouchedBtnDetail },
            ];
            this._listUnit.setItemRenderer(UnitRenderer);
        }
        protected _onOpened(): void {
            this._war = ScwModel.getWar();
            this._updateView();

            Notify.dispatch(Notify.Type.McwProduceUnitPanelOpened);
        }
        protected _onClosed(): void {
            delete this._war;
            delete this._dataForList;
            this._listUnit.clear();

            Notify.dispatch(Notify.Type.McwProduceUnitPanelClosed);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const viewList = this._listUnit.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof UnitRenderer) && (child.updateOnUnitAnimationTick());
            }
        }
        private _onNotifyScwPlannerStateChanged(e: egret.Event): void {
            this.close();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this._war.getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnDetail(e: egret.TouchEvent): void {
            const selectedIndex = (this._listUnit.viewport as eui.List).selectedIndex;
            const data          = selectedIndex != null ? this._dataForList[selectedIndex] : null;
            if (data) {
                BaseWar.BwUnitDetailPanel.show({
                    unit  : data.unit,
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._dataForList = this._createDataForList();
            this._listUnit.bindData(this._dataForList);
        }

        private _createDataForList(): DataForUnitRenderer[] {
            const datas         = [] as DataForUnitRenderer[];
            const war           = this._war;
            const player        = war.getPlayerLoggedIn();
            const currentFund   = player.getFund();
            const playerIndex   = player.getPlayerIndex();
            const configVersion = war.getConfigVersion();
            const actionPlanner = war.getActionPlanner() as ScwActionPlanner;
            const gridIndex     = this._gridIndex;

            for (const unitType of ConfigManager.getUnitTypesByCategory(war.getConfigVersion(), war.getTileMap().getTile(this._gridIndex).getProduceUnitCategory())) {
                const unit = new ScwUnit().init({
                    gridX   : -1,
                    gridY   : -1,
                    unitId  : -1,
                    viewId  : ConfigManager.getUnitViewId(unitType, playerIndex),
                }, configVersion) as ScwUnit;
                datas.push({
                    unitType,
                    currentFund,
                    actionPlanner,
                    gridIndex,
                    unit,
                    cost    : ScwHelpers.getUnitProductionCost(war, unitType),
                });
            }

            return datas.sort(sorterForDataForList);
        }
    }

    function sorterForDataForList(a: DataForUnitRenderer, b: DataForUnitRenderer): number {
        return a.unitType - b.unitType;
    }

    type DataForUnitRenderer = {
        unitType        : UnitType;
        unit            : ScwUnit;
        cost            : number;
        currentFund     : number;
        actionPlanner   : ScwActionPlanner;
        gridIndex       : GridIndex;
    }

    class UnitRenderer extends eui.ItemRenderer {
        private _group          : eui.Group;
        private _imgBg          : GameUi.UiImage;
        private _conUnitView    : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _labelCost      : GameUi.UiLabel;
        private _labelProduce   : GameUi.UiLabel;
        private _unitView       : ScwUnitView;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._imgBg.touchEnabled = true;
            this._imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedImgBg, this);

            this._unitView = new ScwUnitView();
            this._conUnitView.addChild(this._unitView);
        }

        public updateOnUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.tickUnitAnimationFrame();
                this._unitView.tickStateAnimationFrame();
            }
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _onTouchedImgBg(e: egret.TouchEvent): void {
            const data = this.data as DataForUnitRenderer;
            if (data.currentFund < data.cost) {
                FloatText.show(Lang.getText(Lang.Type.B0053));
            } else {
                data.actionPlanner.setStateRequestingPlayerProduceUnit(data.gridIndex, data.unitType);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data = this.data as DataForUnitRenderer;

            const unitType                  = data.unitType;
            const isFundEnough              = data.currentFund >= data.cost;
            this._labelCost.text            = `${Lang.getText(Lang.Type.B0079)}: ${data.cost}`;
            this._labelCost.textColor       = isFundEnough ? 0x00FF00 : 0xFF0000;
            this._labelName.text            = Lang.getUnitName(unitType);
            this._labelProduce.textColor    = isFundEnough ? 0x00FF00 : 0xFF0000;

            this._unitView.init(data.unit).startRunningView();
        }
    }
}
