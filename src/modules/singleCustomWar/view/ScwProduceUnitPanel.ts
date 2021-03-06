
namespace TinyWars.SingleCustomWar {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import ConfigManager    = Utility.ConfigManager;
    import BwHelpers        = BaseWar.BwHelpers;
    import UnitType         = Types.UnitType;
    import GridIndex        = Types.GridIndex;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    type OpenDataForScwProduceUnitPanel = {
        gridIndex   : GridIndex;
    }
    export class ScwProduceUnitPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ScwProduceUnitPanel;

        private _group      : eui.Group;
        private _listUnit   : GameUi.UiScrollList;
        private _btnCancel  : GameUi.UiButton;
        private _btnDetail  : GameUi.UiButton;

        private _war        : ScwWar;
        private _dataForList: DataForUnitRenderer[];

        public static show(openData: OpenDataForScwProduceUnitPanel): void {
            if (!ScwProduceUnitPanel._instance) {
                ScwProduceUnitPanel._instance = new ScwProduceUnitPanel();
            }
            ScwProduceUnitPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (ScwProduceUnitPanel._instance) {
                await ScwProduceUnitPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = ScwProduceUnitPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = `resource/skins/multiCustomWar/McwProduceUnitPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyScwPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
                { ui: this._btnDetail, callback: this._onTouchedBtnDetail },
            ]);
            this._listUnit.setItemRenderer(UnitRenderer);

            this._war = ScwModel.getWar();
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
            this._dataForList = this._createDataForList();
            this._listUnit.bindData(this._dataForList);
        }

        private _createDataForList(): DataForUnitRenderer[] {
            const dataList          = [] as DataForUnitRenderer[];
            const war               = this._war;
            const player            = war.getPlayerInTurn();
            const currentFund       = player.getFund();
            const playerIndex       = player.getPlayerIndex();
            const configVersion     = war.getConfigVersion();
            const actionPlanner     = war.getActionPlanner() as ScwActionPlanner;
            const unitMap           = war.getUnitMap();
            const gridIndex         = this._getOpenData<OpenDataForScwProduceUnitPanel>().gridIndex;
            const tile              = war.getTileMap().getTile(gridIndex);
            const skillCfg          = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
            const unitCategory      = skillCfg ? skillCfg[1] : tile.getCfgProduceUnitCategory();
            const minNormalizedHp   = skillCfg ? BwHelpers.getNormalizedHp(skillCfg[3]) : BwHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);

            for (const unitType of Utility.ConfigManager.getUnitTypesByCategory(configVersion, unitCategory)) {
                const unit = (new (unitMap.getUnitClass())).init({
                    gridIndex   : { x: -1, y: -1 },
                    unitId      : -1,
                    unitType,
                    playerIndex,
                }, configVersion) as ScwUnit;
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
                        ? Math.floor(cfgCost * minNormalizedHp * skillCfg[5] / CommonConstants.UnitHpNormalizer / 100)
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
        unit                    : ScwUnit;
        cfgCost                 : number;
        minCost                 : number;
        currentFund             : number;
        actionPlanner           : ScwActionPlanner;
        gridIndex               : GridIndex;
        unitProductionSkillCfg  : number[] | null;
    }

    class UnitRenderer extends GameUi.UiListItemRenderer {
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
            if (data.currentFund < data.minCost) {
                FloatText.show(Lang.getText(Lang.Type.B0053));
            } else {
                const skillCfg      = data.unitProductionSkillCfg;
                const unitType      = data.unitType;
                const gridIndex     = data.gridIndex;
                const actionPlanner = data.actionPlanner;
                if (!skillCfg) {
                    actionPlanner.setStateRequestingPlayerProduceUnit(gridIndex, unitType, CommonConstants.UnitMaxHp);
                } else {
                    const rawMinHp = skillCfg[3];
                    const rawMaxHp = skillCfg[4];
                    if (rawMinHp === rawMaxHp) {
                        actionPlanner.setStateRequestingPlayerProduceUnit(gridIndex, unitType, rawMinHp);
                    } else {
                        const normalizer    = CommonConstants.UnitHpNormalizer;
                        const minHp         = rawMinHp;
                        const maxHp         = Math.min(
                            rawMaxHp,
                            Math.floor(data.currentFund * CommonConstants.UnitMaxHp / (data.cfgCost * skillCfg[5] / 100) / normalizer) * normalizer
                        );
                        Common.CommonInputPanel.show({
                            title           : `${Lang.getUnitName(unitType)} HP`,
                            currentValue    : "" + maxHp,
                            maxChars        : 3,
                            charRestrict    : "0-9",
                            tips            : `${Lang.getText(Lang.Type.B0319)}: [${minHp}, ${maxHp}]`,
                            callback        : panel => {
                                const value = Number(panel.getInputText());
                                if ((isNaN(value)) || (value > maxHp) || (value < minHp)) {
                                    FloatText.show(Lang.getText(Lang.Type.A0098));
                                } else {
                                    actionPlanner.setStateRequestingPlayerProduceUnit(gridIndex, unitType, value);
                                }
                            },
                        });
                    }
                }
            }
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
