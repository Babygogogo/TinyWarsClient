
namespace TinyWars.ReplayWar {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import BwHelpers        = BaseWar.BwHelpers;
    import UnitType         = Types.UnitType;
    import GridIndex        = Types.GridIndex;
    import CommonConstants  = Utility.CommonConstants;

    type OpenDataForRwProduceUnitPanel = {
        gridIndex: GridIndex;
    }
    export class RwProduceUnitPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: RwProduceUnitPanel;

        private _group      : eui.Group;
        private _listUnit   : GameUi.UiScrollList;
        private _btnCancel  : GameUi.UiButton;
        private _btnDetail  : GameUi.UiButton;

        private _war        : RwWar;
        private _gridIndex  : GridIndex;
        private _dataForList: DataForUnitRenderer[];

        public static show(openData: OpenDataForRwProduceUnitPanel): void {
            if (!RwProduceUnitPanel._instance) {
                RwProduceUnitPanel._instance = new RwProduceUnitPanel();
            }
            RwProduceUnitPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (RwProduceUnitPanel._instance) {
                await RwProduceUnitPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = RwProduceUnitPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = `resource/skins/replayWar/RwProduceUnitPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.BwActionPlannerStateChanged,   callback: this._onNotifyMcwPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
                { ui: this._btnDetail, callback: this._onTouchedBtnDetail },
            ]);
            this._listUnit.setItemRenderer(UnitRenderer);

            this._war = RwModel.getWar();
            this._updateView();

            Notify.dispatch(Notify.Type.McwProduceUnitPanelOpened);
        }
        protected async _onClosed(): Promise<void> {
            this._war           = null;
            this._dataForList   = null;
            this._listUnit.clear();

            Notify.dispatch(Notify.Type.McwProduceUnitPanelClosed);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyUnitAnimationTick(e: egret.Event): void {
            const viewList = this._listUnit.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof UnitRenderer) && (child.updateOnUnitAnimationTick());
            }
        }
        private _onNotifyMcwPlannerStateChanged(e: egret.Event): void {
            this.close();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this._war.getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnDetail(e: egret.TouchEvent): void {
            const selectedIndex = this._listUnit.getViewList().selectedIndex;
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
            this._updateComponentsForLanguage();

            this._dataForList = this._createDataForList();
            this._listUnit.bindData(this._dataForList);
        }

        private _updateComponentsForLanguage(): void {
            this._btnCancel.label = Lang.getText(Lang.Type.B0154);
            this._btnDetail.label = Lang.getText(Lang.Type.B0267);

            const viewList = this._listUnit.getViewList();
            for (let i = 0; i < viewList.numChildren; ++i) {
                const child = viewList.getChildAt(i);
                (child instanceof UnitRenderer) && (child.updateOnLanguageChanged());
            }
        }

        private _createDataForList(): DataForUnitRenderer[] {
            const dataList          = [] as DataForUnitRenderer[];
            const war               = this._war;
            const player            = war.getPlayerInTurn();
            const currentFund       = player.getFund();
            const playerIndex       = player.getPlayerIndex();
            const configVersion     = war.getConfigVersion();
            const actionPlanner     = war.getActionPlanner() as RwActionPlanner;
            const unitMap           = war.getUnitMap();
            const gridIndex         = this._getOpenData<OpenDataForRwProduceUnitPanel>().gridIndex;
            const tile              = war.getTileMap().getTile(gridIndex);
            const skillCfg          = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
            const unitCategory      = skillCfg ? skillCfg[1] : tile.getCfgProduceUnitCategory();
            const minNormalizedHp   = skillCfg ? BwHelpers.getNormalizedHp(skillCfg[3]) : BwHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);

            for (const unitType of Utility.ConfigManager.getUnitTypesByCategory(configVersion, unitCategory)) {
                const unit = new BaseWar.BwUnit();
                unit.init({
                    gridIndex   : { x: -1, y: -1 },
                    unitId      : -1,
                    unitType,
                    playerIndex,
                }, configVersion);
                unit.startRunning(war);
                const cfgCost = Utility.ConfigManager.getUnitTemplateCfg(configVersion, unitType).productionCost;
                dataList.push({
                    unitType,
                    currentFund,
                    actionPlanner,
                    gridIndex,
                    unit,
                    cfgCost,
                    unitProductionSkillCfg  : skillCfg,
                    minCost                 : skillCfg
                        ? Math.floor(cfgCost * minNormalizedHp * skillCfg[5] / CommonConstants.UnitMaxHp / 100)
                        : cfgCost,
                });
            }

            return dataList.sort(sorterForDataForList);
        }
    }

    function sorterForDataForList(a: DataForUnitRenderer, b: DataForUnitRenderer): number {
        return a.unitType - b.unitType;
    }

    type DataForUnitRenderer = {
        unitType                : UnitType;
        unit                    : BaseWar.BwUnit;
        cfgCost                 : number;
        minCost                 : number;
        currentFund             : number;
        actionPlanner           : RwActionPlanner;
        gridIndex               : GridIndex;
        unitProductionSkillCfg  : number[];
    }

    class UnitRenderer extends GameUi.UiListItemRenderer {
        private _group          : eui.Group;
        private _imgBg          : GameUi.UiImage;
        private _conUnitView    : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _labelCost      : GameUi.UiLabel;
        private _labelProduce   : GameUi.UiLabel;
        private _unitView       : BaseWar.BwUnitView;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._imgBg.touchEnabled = true;
            this._imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedImgBg, this);

            this._unitView = new BaseWar.BwUnitView();
            this._conUnitView.addChild(this._unitView);
        }

        public updateOnUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.tickUnitAnimationFrame();
                this._unitView.tickStateAnimationFrame();
            }
        }

        public updateOnLanguageChanged(): void {
            (this.data) && (this._updateView());
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _onTouchedImgBg(e: egret.TouchEvent): void {
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data = this.data as DataForUnitRenderer;

            const unitType                  = data.unitType;
            const isFundEnough              = data.currentFund >= data.minCost;
            this._labelCost.text            = `${Lang.getText(Lang.Type.B0079)}: ${data.minCost}`;
            this._labelCost.textColor       = isFundEnough ? 0x00FF00 : 0xFF0000;
            this._labelName.text            = Lang.getUnitName(unitType);
            this._labelProduce.textColor    = isFundEnough ? 0x00FF00 : 0xFF0000;

            this._unitView.init(data.unit).startRunningView();
        }
    }
}
