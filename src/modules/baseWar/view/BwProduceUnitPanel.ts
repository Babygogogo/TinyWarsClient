

// import TwnsCommonInputPanel     from "../../common/view/CommonInputPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import FloatText                from "../../tools/helpers/FloatText";
// import Helpers                  from "../../tools/helpers/Helpers";
// import SoundManager             from "../../tools/helpers/SoundManager";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify                   from "../../tools/notify/Notify";
// import Notify           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiImage              from "../../tools/ui/UiImage";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiPanel              from "../../tools/ui/UiPanel";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import WarCommonHelpers         from "../../tools/warHelpers/WarCommonHelpers";
// import TwnsBwActionPlanner      from "../model/BwActionPlanner";
// import TwnsBwUnit               from "../model/BwUnit";
// import TwnsBwWar                from "../model/BwWar";
// import TwnsBwUnitDetailPanel    from "./BwUnitDetailPanel";
// import TwnsBwUnitView           from "./BwUnitView";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.BaseWar {
    import NotifyType           = Notify.NotifyType;
    import LangTextType         = Lang.LangTextType;
    import GridIndex            = Types.GridIndex;
    import BwWar                = BaseWar.BwWar;

    export type OpenDataForBwProduceUnitPanel = {
        gridIndex   : GridIndex;
        war         : BwWar;
    };
    export class BwProduceUnitPanel extends TwnsUiPanel.UiPanel<OpenDataForBwProduceUnitPanel> {
        private readonly _imgMask!          : TwnsUiImage.UiImage;
        private readonly _group!            : eui.Group;
        private readonly _listUnit!         : TwnsUiScrollList.UiScrollList<DataForUnitRenderer>;
        private readonly _labelNoUnit!      : TwnsUiLabel.UiLabel;
        private readonly _labelFundTitle!   : TwnsUiLabel.UiLabel;
        private readonly _labelFund!        : TwnsUiLabel.UiLabel;
        private readonly _btnCancel!        : TwnsUiButton.UiButton;
        private readonly _btnDetail!        : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.BwActionPlannerStateSet,     callback: this._onNotifyBwPlannerStateChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel, callback: this._onTouchedBtnCancel },
                { ui: this._btnDetail, callback: this._onTouchedBtnDetail },
            ]);
            this._setIsTouchMaskEnabled();
            this._setCallbackOnTouchedMask(() => {
                this._getOpenData().war.getActionPlanner().setStateIdle();
            });

            this._listUnit.setItemRenderer(UnitRenderer);
            this._btnCancel.setShortSfxCode(Types.ShortSfxCode.None);

            Notify.dispatch(NotifyType.BwProduceUnitPanelOpened);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateComponentsForLanguage();

            const dataArray     = this._createDataForList();
            const labelNoUnit   = this._labelNoUnit;
            const listUnit      = this._listUnit;
            if (dataArray.length) {
                labelNoUnit.visible = false;
                listUnit.bindData(dataArray);
                this.setAndReviseSelectedUnitType(dataArray[0].unitType, true);
            } else {
                labelNoUnit.visible = true;
                listUnit.clear();
                this.setAndReviseSelectedUnitType(null, true);
            }
            this._labelNoUnit.visible   = !dataArray.length;
            this._listUnit.bindData(dataArray);
            this.setAndReviseSelectedUnitType(dataArray[0].unitType ?? null, true);
        }
        protected _onClosing(): void {
            Notify.dispatch(NotifyType.BwProduceUnitPanelClosed);
        }

        public async setAndReviseSelectedUnitType(newUnitType: number | null, needScroll: boolean): Promise<void> {
            const listUnit  = this._listUnit;
            const index     = listUnit.getRandomIndex(v => v.unitType === newUnitType);
            if (index != null) {
                listUnit.setSelectedIndex(index);

                if (needScroll) {
                    listUnit.scrollVerticalToIndex(index);
                }
            }

            this._updateLabelFund();
        }
        public getSelectedUnitType(): number | null {
            return this._listUnit.getSelectedData()?.unitType ?? null;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyBwPlannerStateChanged(): void {
            this.close();
        }

        private _onTouchedBtnCancel(): void {
            this._getOpenData().war.getActionPlanner().setStateIdle();
        }
        private _onTouchedBtnDetail(): void {
            const data = this._listUnit.getSelectedData();
            if (data) {
                PanelHelpers.open(PanelHelpers.PanelDict.BwUnitDetailPanel, {
                    unit        : data.unit,
                    canDelete   : false,
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelNoUnit.text      = Lang.getText(LangTextType.B0896);
            this._labelFundTitle.text   = `${Lang.getFormattedText(LangTextType.F0138, Lang.getText(LangTextType.B0032))}:`;
            this._btnCancel.label       = Lang.getText(LangTextType.B0154);
            this._btnDetail.label       = Lang.getText(LangTextType.B0267);
        }

        private _updateLabelFund(): void {
            const minCost   = this._listUnit.getSelectedData()?.minCost;
            const labelFund = this._labelFund;
            if (minCost == null) {
                labelFund.text = `--`;
            } else {
                const fund = this._getOpenData().war.getPlayerInTurn().getFund();
                labelFund.text = `${fund} - ${minCost} = ${fund - minCost}`;
            }
        }

        private _createDataForList(): DataForUnitRenderer[] {
            const dataList              : DataForUnitRenderer[] = [];
            const openData              = this._getOpenData();
            const war                   = openData.war;
            const gridIndex             = openData.gridIndex;
            const gameConfig            = war.getGameConfig();
            const tile                  = war.getTileMap().getTile(gridIndex);
            const player                = tile.getPlayer();
            const currentFund           = player.getFund();
            const playerIndex           = player.getPlayerIndex();
            const actionPlanner         = war.getActionPlanner();
            const bannedUnitTypeArray   = war.getCommonSettingManager().getSettingsBannedUnitTypeArray(playerIndex) ?? [];
            const warEventManager       = war.getWarEventManager();
            const skillCfg              = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndex) ?? null;
            const unitCategory          = Helpers.getExisted(skillCfg ? skillCfg[1] : tile.getCfgProduceUnitCategory());
            const minNormalizedHp       = skillCfg ? WarHelpers.WarCommonHelpers.getNormalizedHp(skillCfg[3]) : WarHelpers.WarCommonHelpers.getNormalizedHp(CommonConstants.UnitMaxHp);

            for (const unitType of gameConfig.getUnitTypesByCategory(unitCategory) ?? []) {
                if ((bannedUnitTypeArray.indexOf(unitType) >= 0)                                        ||
                    (warEventManager.checkOngoingPersistentActionBannedUnitType(playerIndex, unitType))
                ) {
                    continue;
                }

                const unit = new BaseWar.BwUnit();
                unit.init({
                    gridIndex,
                    unitId      : -1,
                    unitType,
                    playerIndex,
                }, gameConfig);
                unit.startRunning(war);

                const costModifier  = player.getUnitCostModifier(gridIndex, false, unitType);
                const cfgCost       = Helpers.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.productionCost);
                dataList.push({
                    unitType,
                    currentFund,
                    actionPlanner,
                    gridIndex,
                    unit,
                    cfgCost,
                    costModifier,
                    unitProductionSkillCfg  : skillCfg,
                    minCost                 : skillCfg
                        ? Math.floor(cfgCost * costModifier * minNormalizedHp * skillCfg[5] / CommonConstants.UnitHpNormalizer / 100)
                        : Math.floor(cfgCost * costModifier),
                    panel   : this,
                });
            }

            return dataList.sort(sorterForDataForList);
        }

        protected async _showOpenAnimation(): Promise<void> {
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

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
        protected async _showCloseAnimation(): Promise<void> {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });

            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
            });

            await Helpers.wait(CommonConstants.DefaultTweenTime);
        }
    }

    function sorterForDataForList(a: DataForUnitRenderer, b: DataForUnitRenderer): number {
        return a.unitType - b.unitType;
    }

    type DataForUnitRenderer = {
        unitType                : number;
        unit                    : BaseWar.BwUnit;
        minCost                 : number;
        cfgCost                 : number;
        costModifier            : number;
        currentFund             : number;
        actionPlanner           : BaseWar.BwActionPlanner;
        gridIndex               : GridIndex;
        unitProductionSkillCfg  : number[] | null;
        panel                   : BwProduceUnitPanel;
    };
    class UnitRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForUnitRenderer> {
        private readonly _group!        : eui.Group;
        private readonly _imgBg!        : TwnsUiImage.UiImage;
        private readonly _conUnitView!  : eui.Group;
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _labelCost!    : TwnsUiLabel.UiLabel;

        private readonly _groupProduce! : eui.Group;
        private readonly _imgProduce!   : TwnsUiImage.UiImage;
        private readonly _labelProduce! : TwnsUiLabel.UiLabel;

        private readonly _unitView      = new BaseWar.BwUnitView();

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.UnitAnimationTick,       callback: this._onNotifyUnitAnimationTick },
                { type: NotifyType.UnitStateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
            ]);
            this._setUiListenerArray([
                { ui: this._imgBg,                          callback: this._onTouchedImgBg,         eventType: egret.TouchEvent.TOUCH_END },
                { ui: this._groupProduce,                   callback: this._onTouchedGroupProduce,  eventType: egret.TouchEvent.TOUCH_END },
            ]);

            this._imgBg.touchEnabled = true;
            this._setShortSfxCode(Types.ShortSfxCode.None);
            this._conUnitView.addChild(this._unitView);
        }

        private _onNotifyUnitAnimationTick(): void {
            if (this.data) {
                this._unitView.tickUnitAnimationFrame();
            }
        }

        private _onNotifyUnitStateIndicatorTick(): void {
            if (this.data) {
                this._unitView.tickStateAnimationFrame();
            }
        }

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _onTouchedImgBg(): void {
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);

            const data = this._getData();
            data.panel.setAndReviseSelectedUnitType(data.unitType, false);
        }

        private _onTouchedGroupProduce(): void {
            const data = this._getData();
            if (data.unitType !== data.panel.getSelectedUnitType()) {
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonNeutral01);
                data.panel.setAndReviseSelectedUnitType(data.unitType, false);

                return;
            }

            if (data.currentFund < data.minCost) {
                FloatText.show(Lang.getText(LangTextType.B0053));
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonForbidden01);
                return;
            }

            if (!PanelHelpers.getRunningPanel(PanelHelpers.PanelDict.BwProduceUnitPanel)) {
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonForbidden01);
                return;
            }

            const actionPlanner = data.actionPlanner;
            if (actionPlanner.checkIsStateRequesting()) {
                SoundManager.playShortSfx(Types.ShortSfxCode.ButtonForbidden01);
                return;
            }

            const skillCfg  = data.unitProductionSkillCfg;
            const unitType  = data.unitType;
            const gridIndex = data.gridIndex;
            SoundManager.playShortSfx(Types.ShortSfxCode.ButtonConfirm01);
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
                        Math.floor(data.currentFund * CommonConstants.UnitMaxHp / (data.cfgCost * data.costModifier * skillCfg[5] / 100) / normalizer) * normalizer
                    );
                    PanelHelpers.open(PanelHelpers.PanelDict.CommonInputIntegerPanel, {
                        title           : Lang.getText(LangTextType.B0339),
                        currentValue    : maxHp,
                        maxValue        : maxHp,
                        minValue        : minHp,
                        tips            : `${Lang.getText(LangTextType.B0319)}: [${minHp}, ${maxHp}]`,
                        callback        : panel => {
                            actionPlanner.setStateRequestingPlayerProduceUnit(gridIndex, unitType, panel.getInputValue());
                        },
                    });
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const data              = this._getData();
            const unitType          = data.unitType;
            const isFundEnough      = data.currentFund >= data.minCost;
            const labelCost         = this._labelCost;
            const labelName         = this._labelName;
            const labelProduce      = this._labelProduce;
            const unit              = data.unit;
            labelCost.text          = `${data.minCost}G`;
            labelCost.textColor     = isFundEnough ? 0xFFFFFF : 0x667A85;
            labelName.text          = Lang.getUnitName(unitType, unit.getGameConfig()) ?? CommonConstants.ErrorTextForUndefined;
            labelName.textColor     = isFundEnough ? 0xFFFFFF : 0x667A85;
            labelProduce.textColor  = isFundEnough ? 0x000000 : 0xFFFFFF;
            labelProduce.text       = Lang.getText(LangTextType.B0691);
            this._imgProduce.source = isFundEnough ? `uncompressedColorYellow0001` : `uncompressedColorGrey0002`;
            this._unitView.init(unit).startRunningView();
        }
    }
}

// export default TwnsBwProduceUnitPanel;
