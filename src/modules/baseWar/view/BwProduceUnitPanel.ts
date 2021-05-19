
namespace TinyWars.BaseWar {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import CommonConstants  = Utility.CommonConstants;
    import Helpers          = Utility.Helpers;
    import BwHelpers        = BaseWar.BwHelpers;
    import BwUnit           = BaseWar.BwUnit;
    import UnitType         = Types.UnitType;
    import GridIndex        = Types.GridIndex;

    type OpenDataForBwProduceUnitPanel = {
        gridIndex   : GridIndex;
        war         : BaseWar.BwWar;
    }
    export class BwProduceUnitPanel extends GameUi.UiPanel<OpenDataForBwProduceUnitPanel> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: BwProduceUnitPanel;

        private _imgMask    : GameUi.UiImage;
        private _group      : eui.Group;
        private _listUnit   : GameUi.UiScrollList<DataForUnitRenderer>;
        private _btnCancel  : GameUi.UiButton;
        private _btnDetail  : GameUi.UiButton;

        private _dataForList: DataForUnitRenderer[];

        public static show(openData: OpenDataForBwProduceUnitPanel): void {
            if (!BwProduceUnitPanel._instance) {
                BwProduceUnitPanel._instance = new BwProduceUnitPanel();
            }
            BwProduceUnitPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (BwProduceUnitPanel._instance) {
                await BwProduceUnitPanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = BwProduceUnitPanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = `resource/skins/baseWar/BwProduceUnitPanel.exml`;
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.BwActionPlannerStateChanged,    callback: this._onNotifyBwPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
                { ui: this._btnDetail, callback: this._onTouchedBtnDetail },
            ]);
            this._listUnit.setItemRenderer(UnitRenderer);

            this._showOpenAnimation();

            this._updateView();

            Notify.dispatch(Notify.Type.BwProduceUnitPanelOpened);
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._dataForList = null;

            Notify.dispatch(Notify.Type.BwProduceUnitPanelClosed);
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyBwPlannerStateChanged(e: egret.Event): void {
            this.close();
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this._getOpenData().war.getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnDetail(e: egret.TouchEvent): void {
            const selectedIndex = this._listUnit.getSelectedIndex();
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
        }

        private _createDataForList(): DataForUnitRenderer[] {
            const dataList          : DataForUnitRenderer[] = [];
            const openData          = this._getOpenData();
            const war               = openData.war;
            const gridIndex         = openData.gridIndex;
            const tile              = war.getTileMap().getTile(gridIndex);
            const player            = tile.getPlayer();
            const currentFund       = player.getFund();
            const playerIndex       = player.getPlayerIndex();
            const configVersion     = war.getConfigVersion();
            const actionPlanner     = war.getActionPlanner();
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
                        ? Math.floor(cfgCost * minNormalizedHp * skillCfg[5] / CommonConstants.UnitHpNormalizer / 100)
                        : cfgCost,
                });
            }

            return dataList.sort(sorterForDataForList);
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                });

                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                    callback    : resolve,
                });
            });
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
        actionPlanner           : BaseWar.BwActionPlanner;
        gridIndex               : GridIndex;
        unitProductionSkillCfg  : number[] | null;
    }

    class UnitRenderer extends GameUi.UiListItemRenderer<DataForUnitRenderer> {
        private _group          : eui.Group;
        private _imgBg          : GameUi.UiImage;
        private _conUnitView    : eui.Group;
        private _labelName      : GameUi.UiLabel;
        private _labelCost      : GameUi.UiLabel;
        private _labelProduce   : GameUi.UiLabel;
        private _unitView       : BaseWar.BwUnitView;

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.UnitAnimationTick,  callback: this._onNotifyUnitAnimationTick },
            ]);

            this._imgBg.touchEnabled = true;
            this._imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedImgBg, this);

            this._unitView = new BaseWar.BwUnitView();
            this._conUnitView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.tickUnitAnimationFrame();
                this._unitView.tickStateAnimationFrame();
            }
        }

        private _onNotifyLanguageChanged(): void {
            (this.data) && (this._updateView());
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _onTouchedImgBg(e: egret.TouchEvent): void {
            const data = this.data;
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
            const data = this.data;

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
