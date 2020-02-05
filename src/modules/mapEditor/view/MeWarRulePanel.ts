
namespace TinyWars.MapEditor {
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export class MeWarRulePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeWarRulePanel;

        private _listWarRule: GameUi.UiScrollList;
        private _btnBack    : GameUi.UiButton;
        private _btnDelete  : GameUi.UiButton;

        private _labelMenuTitle                 : TinyWars.GameUi.UiLabel;
        private _groupRuleName                  : eui.Group;
        private _labelRuleNameTitle             : TinyWars.GameUi.UiLabel;
        private _labelRuleName                  : TinyWars.GameUi.UiLabel;
        private _btnModifyRuleName              : TinyWars.GameUi.UiButton;
        private _groupRuleNameEnglish           : eui.Group;
        private _labelRuleNameEnglishTitle      : TinyWars.GameUi.UiLabel;
        private _labelRuleNameEnglish           : TinyWars.GameUi.UiLabel;
        private _btnModifyRuleNameEnglish       : TinyWars.GameUi.UiButton;
        private _groupInitialFund               : eui.Group;
        private _labelInitialFundTitle          : TinyWars.GameUi.UiLabel;
        private _labelInitialFund               : TinyWars.GameUi.UiLabel;
        private _btnModifyInitialFund           : TinyWars.GameUi.UiButton;
        private _groupIncomeMultiplier          : eui.Group;
        private _labelIncomeMultiplierTitle     : TinyWars.GameUi.UiLabel;
        private _labelIncomeMultiplier          : TinyWars.GameUi.UiLabel;
        private _btnModifyIncomeMultiplier      : TinyWars.GameUi.UiButton;
        private _groupInitialEnergy             : eui.Group;
        private _labelInitialEnergyTitle        : TinyWars.GameUi.UiLabel;
        private _labelInitialEnergy             : TinyWars.GameUi.UiLabel;
        private _btnModifyInitialEnergy         : TinyWars.GameUi.UiButton;
        private _groupEnergyGrowthModifier      : eui.Group;
        private _labelEnergyGrowthModifierTitle : TinyWars.GameUi.UiLabel;
        private _labelEnergyGrowthModifier      : TinyWars.GameUi.UiLabel;
        private _btnModifyEnergyGrowthModifier  : TinyWars.GameUi.UiButton;
        private _groupLuckLowerLimit            : eui.Group;
        private _labelLuckLowerLimitTitle       : TinyWars.GameUi.UiLabel;
        private _labelLuckLowerLimit            : TinyWars.GameUi.UiLabel;
        private _btnModifyLuckLowerLimit        : TinyWars.GameUi.UiButton;
        private _groupLuckUpperLimit            : eui.Group;
        private _labelLuckUpperLimitTitle       : TinyWars.GameUi.UiLabel;
        private _labelLuckUpperLimit            : TinyWars.GameUi.UiLabel;
        private _btnModifyLuckUpperLimit        : TinyWars.GameUi.UiButton;
        private _groupMoveRange                 : eui.Group;
        private _labelMoveRangeTitle            : TinyWars.GameUi.UiLabel;
        private _labelMoveRange                 : TinyWars.GameUi.UiLabel;
        private _btnModifyMoveRange             : TinyWars.GameUi.UiButton;
        private _groupAttackPower               : eui.Group;
        private _labelAttackPowerTitle          : TinyWars.GameUi.UiLabel;
        private _labelAttackPower               : TinyWars.GameUi.UiLabel;
        private _btnModifyAttackPower           : TinyWars.GameUi.UiButton;
        private _groupVisionRange               : eui.Group;
        private _labelVisionRangeTitle          : TinyWars.GameUi.UiLabel;
        private _labelVisionRange               : TinyWars.GameUi.UiLabel;
        private _btnModifyVisionRange           : TinyWars.GameUi.UiButton;
        private _groupHasFog                    : eui.Group;
        private _labelHasFogTitle               : TinyWars.GameUi.UiLabel;
        private _groupHasFogBox                 : eui.Group;
        private _imgHasFog                      : TinyWars.GameUi.UiImage;
        private _listPlayerRule                 : GameUi.UiScrollList;

        private _war                : MeWar;
        private _dataForListWarRule : DataForWarRuleNameRenderer[] = [];
        private _selectedIndex      : number;
        private _selectedRule       : MeWarRule;

        public static show(): void {
            if (!MeWarRulePanel._instance) {
                MeWarRulePanel._instance = new MeWarRulePanel();
            }
            MeWarRulePanel._instance.open();
        }
        public static hide(): void {
            if (MeWarRulePanel._instance) {
                MeWarRulePanel._instance.close();
            }
        }
        public static getIsOpening(): boolean {
            const instance = MeWarRulePanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this.skinName = "resource/skins/mapEditor/MeWarRulePanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnBack,                        callback: this._onTouchTapBtnBack },
                { ui: this._btnDelete,                      callback: this._onTouchedBtnDelete },
                { ui: this._btnModifyAttackPower,           callback: this._onTouchedBtnModifyAttackPower },
                { ui: this._btnModifyEnergyGrowthModifier,  callback: this._onTouchedBtnModifyEnergyGrowthModifier },
                { ui: this._btnModifyIncomeMultiplier,      callback: this._onTouchedBtnModifyIncomeMultiplier },
                { ui: this._groupHasFogBox,                 callback: this._onTouchedGroupHasFogBox },
            ];
            this._listWarRule.setItemRenderer(WarRuleNameRenderer);
            this._listPlayerRule.setItemRenderer(PlayerRuleRenderer);
        }
        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._war = MeManager.getWar();
            this._resetView();
        }
        protected _onClosed(): void {
            this._war = null;
            this._listWarRule.clear();
            this._listPlayerRule.clear();

            Notify.dispatch(Notify.Type.BwCoListPanelClosed);
        }

        public setSelectedIndex(newIndex: number): void {
            const dataList = this._dataForListWarRule;
            if (!dataList[newIndex]) {
                this._selectedIndex = null;
                this._selectedRule  = null;
                this._updateComponentsForRule();

            } else {
                const oldIndex      = this._selectedIndex;
                this._selectedIndex = newIndex;
                this._selectedRule  = dataList[newIndex].rule;
                (dataList[oldIndex])    && (this._listWarRule.updateSingleData(oldIndex, dataList[oldIndex]));
                (oldIndex !== newIndex) && (this._listWarRule.updateSingleData(newIndex, dataList[newIndex]));

                this._updateComponentsForRule();
            }
        }
        public getSelectedIndex(): number {
            return this._selectedIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            MeWarMenuPanel.show();
        }

        private _onTouchedBtnDelete(e: egret.TouchEvent): void {
            const selectedIndex = this._selectedIndex;
            if (selectedIndex != null) {
                const field = this._war.getField();
                if (field.getWarRuleList().length <= 1) {
                    FloatText.show(Lang.getText(Lang.Type.A0096));
                } else {
                    Common.ConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0097),
                        callback: () => {
                            field.deleteWarRule(selectedIndex);
                            this._resetView();
                        },
                    });
                }
            }
        }

        private _onTouchedBtnModifyAttackPower(e: egret.TouchEvent): void {
            const rule = this._selectedRule;
            if (rule) {
                const maxValue = CommonConstants.WarRuleOffenseBonusMaxLimit;
                const minValue = CommonConstants.WarRuleOffenseBonusMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0183),
                    currentValue    : "" + rule.getAttackPowerModifier(),
                    maxChars        : 4,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            rule.setAttackPowerModifier(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelAttackPower(rule);
                        }
                    },
                });
            }
        }

        private _onTouchedBtnModifyEnergyGrowthModifier(e: egret.TouchEvent): void {
            const rule = this._selectedRule;
            if (rule) {
                const maxValue = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
                const minValue = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0181),
                    currentValue    : "" + rule.getEnergyGrowthModifier(),
                    maxChars        : 5,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            rule.setEnergyGrowthModifier(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelEnergyGrowthModifier(rule);
                        }
                    },
                });
            }
        }

        private _onTouchedBtnModifyIncomeMultiplier(e: egret.TouchEvent): void {
            const rule = this._selectedRule;
            if (rule) {
                const maxValue = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
                const minValue = CommonConstants.WarRuleIncomeMultiplierMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0179),
                    currentValue    : "" + rule.getIncomeMultiplier(),
                    maxChars        : 5,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            rule.setIncomeMultiplier(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelIncomeMultiplier(rule);
                        }
                    },
                });
            }
        }

        private _onTouchedGroupHasFogBox(e: egret.TouchEvent): void {
            const rule = this._selectedRule;
            if (rule) {
                rule.setHasFog(!rule.getHasFog());
                this._updateImgHasFog(rule);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _resetView(): void {
            this._dataForListWarRule = this._createDataForListWarRule();
            this._listWarRule.bindData(this._dataForListWarRule);
            this.setSelectedIndex(0);
        }

        private _updateComponentsForLanguage(): void {
            this._labelRuleNameTitle.text               = Lang.getText(Lang.Type.B0315);
            this._labelRuleNameEnglishTitle.text        = Lang.getText(Lang.Type.B0316);
            this._labelMenuTitle.text                   = Lang.getText(Lang.Type.B0314);
            this._labelInitialFundTitle.text            = Lang.getText(Lang.Type.B0178);
            this._labelIncomeMultiplierTitle.text       = Lang.getText(Lang.Type.B0179);
            this._labelInitialEnergyTitle.text          = Lang.getText(Lang.Type.B0180);
            this._labelEnergyGrowthModifierTitle.text   = Lang.getText(Lang.Type.B0181);
            this._labelMoveRangeTitle.text              = Lang.getText(Lang.Type.B0182);
            this._labelAttackPowerTitle.text            = Lang.getText(Lang.Type.B0183);
            this._labelVisionRangeTitle.text            = Lang.getText(Lang.Type.B0184);
            this._labelLuckLowerLimitTitle.text         = Lang.getText(Lang.Type.B0189);
            this._labelLuckUpperLimitTitle.text         = Lang.getText(Lang.Type.B0190);
            this._labelHasFogTitle.text                 = Lang.getText(Lang.Type.B0020);
            this._btnBack.label                         = Lang.getText(Lang.Type.B0146);
            this._btnDelete.label                       = Lang.getText(Lang.Type.B0220);
            this._btnModifyAttackPower.label            = Lang.getText(Lang.Type.B0317);
            this._btnModifyEnergyGrowthModifier.label   = Lang.getText(Lang.Type.B0317);
            this._btnModifyIncomeMultiplier.label       = Lang.getText(Lang.Type.B0317);
            this._btnModifyInitialEnergy.label          = Lang.getText(Lang.Type.B0317);
            this._btnModifyInitialFund.label            = Lang.getText(Lang.Type.B0317);
            this._btnModifyLuckLowerLimit.label         = Lang.getText(Lang.Type.B0317);
            this._btnModifyLuckUpperLimit.label         = Lang.getText(Lang.Type.B0317);
            this._btnModifyMoveRange.label              = Lang.getText(Lang.Type.B0317);
            this._btnModifyRuleName.label               = Lang.getText(Lang.Type.B0317);
            this._btnModifyRuleNameEnglish.label        = Lang.getText(Lang.Type.B0317);
            this._btnModifyVisionRange.label            = Lang.getText(Lang.Type.B0317);
        }

        private _createDataForListWarRule(): DataForWarRuleNameRenderer[] {
            const data  : DataForWarRuleNameRenderer[] = [];
            let index   = 0;
            for (const rule of this._war.getField().getWarRuleList()) {
                data.push({
                    index,
                    rule,
                    panel   : this,
                });
                ++index;
            }

            return data;
        }

        private _updateComponentsForRule(): void {
            const rule = this._selectedRule;
            this._updateLabelRuleName(rule);
            this._updateLabelRuleNameEnglish(rule);
            this._updateLabelAttackPower(rule);
            this._updateLabelEnergyGrowthModifier(rule);
            this._updateLabelIncomeMultiplier(rule);
            this._updateLabelInitialEnergy(rule);
            this._updateLabelInitialFund(rule);
            this._updateLabelLuckLowerLimit(rule);
            this._updateLabelLuckUpperLimit(rule);
            this._updateLabelMoveRange(rule);
            this._updateLabelVisionRange(rule);
            this._updateImgHasFog(rule);
            this.updateListPlayerRule(rule);
        }

        private _updateLabelRuleName(rule: MeWarRule): void {
            this._labelRuleName.text = rule ? rule.getRuleName() : null;
        }
        private _updateLabelRuleNameEnglish(rule: MeWarRule): void {
            this._labelRuleNameEnglish.text = rule ? rule.getRuleNameEnglish() : null;
        }
        private _updateLabelAttackPower(rule: MeWarRule): void {
            this._labelAttackPower.text = rule ? `${rule.getAttackPowerModifier()}%` : null;
        }
        private _updateLabelEnergyGrowthModifier(rule: MeWarRule): void {
            this._labelEnergyGrowthModifier.text = rule ? `${rule.getEnergyGrowthModifier()}%` : null;
        }
        private _updateLabelIncomeMultiplier(rule: MeWarRule): void {
            this._labelIncomeMultiplier.text = rule ? `${rule.getIncomeMultiplier()}%` : null;
        }
        private _updateLabelInitialEnergy(rule: MeWarRule): void {
            this._labelInitialEnergy.text = rule ? `${rule.getInitialEnergy()}%` : null;
        }
        private _updateLabelInitialFund(rule: MeWarRule): void {
            this._labelInitialFund.text = rule ? `${rule.getInitialFund()}` : null;
        }
        private _updateLabelLuckLowerLimit(rule: MeWarRule): void {
            this._labelLuckLowerLimit.text = rule ? `${rule.getLuckLowerLimit()}` : null;
        }
        private _updateLabelLuckUpperLimit(rule: MeWarRule): void {
            this._labelLuckUpperLimit.text = rule ? `${rule.getLuckUpperLimit()}` : null;
        }
        private _updateLabelMoveRange(rule: MeWarRule): void {
            this._labelMoveRange.text = rule ? `${rule.getMoveRangeModifier()}` : null;
        }
        private _updateLabelVisionRange(rule: MeWarRule): void {
            this._labelVisionRange.text = rule ? `${rule.getVisionRangeModifier()}` : null;
        }
        private _updateImgHasFog(rule: MeWarRule): void {
            this._imgHasFog.visible = rule ? rule.getHasFog() : false;
        }
        public updateListPlayerRule(rule: MeWarRule): void {
            const playerRuleList = rule ? rule.getPlayerRuleList() : null;
            if (!playerRuleList) {
                this._listPlayerRule.clear();
            } else {
                const dataList  : DataForPlayerRuleRenderer[] = [];
                let index       = 0;
                for (const playerRule of playerRuleList) {
                    dataList.push({
                        index,
                        playerRule,
                        panel       : this,
                        warRule     : rule,
                    });
                    ++index;
                }
                this._listPlayerRule.bindData(dataList);
            }
        }
    }

    type DataForWarRuleNameRenderer = {
        index   : number;
        rule    : MeWarRule;
        panel   : MeWarRulePanel;
    }

    class WarRuleNameRenderer extends eui.ItemRenderer {
        private _btnChoose: GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForWarRuleNameRenderer;
            const index             = data.index;
            this.currentState       = index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelName.text    = `${Lang.getText(Lang.Type.B0318)} ${index}`;
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRuleNameRenderer;
            data.panel.setSelectedIndex(data.index);
        }
    }

    type DataForPlayerRuleRenderer = {
        index       : number;
        warRule     : MeWarRule;
        playerRule  : ProtoTypes.IRuleForPlayer;
        panel       : MeWarRulePanel;
    }

    class PlayerRuleRenderer extends eui.ItemRenderer {
        private _labelForce : GameUi.UiLabel;
        private _labelTeam  : GameUi.UiLabel;
        private _btnModify  : GameUi.UiButton;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnModify.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedBtnModify, this);
            this._btnModify.label = Lang.getText(Lang.Type.B0317);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRuleRenderer;
            const rule              = data.playerRule;
            this._labelForce.text   = Lang.getPlayerForceName(rule.playerIndex);
            this._labelTeam.text    = Lang.getPlayerTeamName(rule.teamIndex);
        }

        private _onTouchedBtnModify(): void {
            const data = this.data as DataForPlayerRuleRenderer;
            if (data) {
                const warRule       = data.warRule;
                const playerRule    = data.playerRule;
                warRule.updatePlayerRule(playerRule.playerIndex, playerRule.teamIndex % warRule.getPlayerRuleList().length + 1);
                data.panel.updateListPlayerRule(warRule);
            }
        }
    }
}
