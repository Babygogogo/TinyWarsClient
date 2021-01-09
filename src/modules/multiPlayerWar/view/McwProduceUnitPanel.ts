
namespace TinyWars.MultiPlayerWar {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import ConfigManager    = Utility.ConfigManager;
    import BwHelpers        = BaseWar.BwHelpers;
    import BwUnit           = BaseWar.BwUnit;
    import UnitType         = Types.UnitType;
    import GridIndex        = Types.GridIndex;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export class McwProduceUnitPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: McwProduceUnitPanel;

        private _group      : eui.Group;
        private _listUnit   : GameUi.UiScrollList;
        private _btnCancel  : GameUi.UiButton;
        private _btnDetail  : GameUi.UiButton;

        private _war        : MpwWar;
        private _gridIndex  : GridIndex;
        private _dataForList: DataForUnitRenderer[];

        public static show(gridIndex: GridIndex): void {
            if (!McwProduceUnitPanel._instance) {
                McwProduceUnitPanel._instance = new McwProduceUnitPanel();
            }
            McwProduceUnitPanel._instance._gridIndex = gridIndex;
            McwProduceUnitPanel._instance.open();
        }
        public static hide(): void {
            if (McwProduceUnitPanel._instance) {
                McwProduceUnitPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = McwProduceUnitPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/multiCustomWar/McwProduceUnitPanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAnimationTick,              callback: this._onNotifyUnitAnimationTick },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyMcwPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
                { ui: this._btnDetail, callback: this._onTouchedBtnDetail },
            ]);
            this._listUnit.setItemRenderer(UnitRenderer);
        }
        protected _onOpened(): void {
            this._war = MpwModel.getWar();
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
            const player            = war.getPlayerLoggedIn();
            const currentFund       = player.getFund();
            const playerIndex       = player.getPlayerIndex();
            const configVersion     = war.getConfigVersion();
            const actionPlanner     = war.getActionPlanner() as MpwActionPlanner;
            const gridIndex         = this._gridIndex;
            const unitClass         = war.getUnitMap().getUnitClass();
            const tile              = war.getTileMap().getTile(gridIndex);
            const skillCfg          = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndex);
            const unitCategory      = skillCfg ? skillCfg[1] : tile.getCfgProduceUnitCategory();
            const minNormalizedHp   = skillCfg ? BwHelpers.getNormalizedHp(skillCfg[3]) : BwHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);

            for (const unitType of Utility.ConfigManager.getUnitTypesByCategory(configVersion, unitCategory)) {
                const unit = new unitClass().init({
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
        unit                    : BwUnit;
        minCost                 : number;
        cfgCost                 : number;
        currentFund             : number;
        actionPlanner           : MpwActionPlanner;
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
        private _unitView       : McwUnitView;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._imgBg.touchEnabled = true;
            this._imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedImgBg, this);

            this._unitView = new McwUnitView();
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
            this._labelProduce.text         = Lang.getText(Lang.Type.B0095);

            this._unitView.init(data.unit).startRunningView();
        }
    }
}
