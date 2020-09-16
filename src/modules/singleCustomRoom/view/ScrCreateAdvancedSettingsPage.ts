
namespace TinyWars.SingleCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonConstants  = Utility.ConfigManager.COMMON_CONSTANTS;

    export class ScrCreateAdvancedSettingsPage extends GameUi.UiTabPage {
        private _labelMapNameTitle      : GameUi.UiLabel;
        private _labelMapName           : GameUi.UiLabel;
        private _labelPlayersCountTitle : GameUi.UiLabel;
        private _labelPlayersCount      : GameUi.UiLabel;
        private _labelTips              : GameUi.UiLabel;

        private _groupInitialFund                   : eui.Group;
        private _labelInitialFund                   : TinyWars.GameUi.UiLabel;
        private _btnModifyInitialFund               : TinyWars.GameUi.UiButton;
        private _groupIncomeMultiplier              : eui.Group;
        private _labelIncomeMultiplier              : TinyWars.GameUi.UiLabel;
        private _btnModifyIncomeMultiplier          : TinyWars.GameUi.UiButton;
        private _groupInitialEnergy                 : eui.Group;
        private _labelInitialEnergy                 : TinyWars.GameUi.UiLabel;
        private _btnModifyInitialEnergy             : TinyWars.GameUi.UiButton;
        private _groupEnergyGrowthMultiplier        : eui.Group;
        private _labelEnergyGrowthMultiplier        : TinyWars.GameUi.UiLabel;
        private _btnModifyEnergyGrowthMultiplier    : TinyWars.GameUi.UiButton;
        private _groupLuckLowerLimit                : eui.Group;
        private _labelLuckLowerLimit                : TinyWars.GameUi.UiLabel;
        private _btnModifyLuckLowerLimit            : TinyWars.GameUi.UiButton;
        private _groupLuckUpperLimit                : eui.Group;
        private _labelLuckUpperLimit                : TinyWars.GameUi.UiLabel;
        private _btnModifyLuckUpperLimit            : TinyWars.GameUi.UiButton;
        private _groupMoveRange                     : eui.Group;
        private _labelMoveRange                     : TinyWars.GameUi.UiLabel;
        private _btnModifyMoveRange                 : TinyWars.GameUi.UiButton;
        private _groupAttackPower                   : eui.Group;
        private _labelAttackPower                   : TinyWars.GameUi.UiLabel;
        private _btnModifyAttackPower               : TinyWars.GameUi.UiButton;
        private _groupVisionRange                   : eui.Group;
        private _labelVisionRange                   : TinyWars.GameUi.UiLabel;
        private _btnModifyVisionRange               : TinyWars.GameUi.UiButton;

        protected _mapRawData   : ProtoTypes.Map.IMapRawData;

        public constructor() {
            super();

            this.skinName = "resource/skins/singleCustomRoom/ScrCreateAdvancedSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnModifyAttackPower,               callback: this._onTouchedBtnModifyAttackPower },
                { ui: this._btnModifyEnergyGrowthMultiplier,    callback: this._onTouchedBtnModifyEnergyGrowthMultiplier },
                { ui: this._btnModifyIncomeMultiplier,          callback: this._onTouchedBtnModifyIncomeMultiplier },
                { ui: this._btnModifyInitialEnergy,             callback: this._onTouchedBtnModifyInitialEnergy },
                { ui: this._btnModifyInitialFund,               callback: this._onTouchedBtnModifyInitialFund },
                { ui: this._btnModifyLuckLowerLimit,            callback: this._onTouchedBtnModifyLuckLowerLimit },
                { ui: this._btnModifyLuckUpperLimit,            callback: this._onTouchedBtnModifyLuckUpperLimit },
                { ui: this._btnModifyMoveRange,                 callback: this._onTouchedBtnModifyMoveRange },
                { ui: this._btnModifyVisionRange,               callback: this._onTouchedBtnModifyVisionRange },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
        }

        protected async _onOpened(): Promise<void> {
            this._mapRawData = await ScrModel.getCreateWarMapRawData();

            this._updateComponentsForLanguage();
            this._updateLabelMapName();
            this._updateLabelPlayersCount();
            this._updateLabelInitialFund();
            this._updateLabelIncomeMultiplier();
            this._updateLabelInitialEnergy();
            this._updateLabelEnergyGrowthMultiplier();
            this._updateLabelLuckLowerLimit();
            this._updateLabelLuckUpperLimit();
            this._updateLabelMoveRange();
            this._updateLabelAttackPower();
            this._updateLabelVisionRange();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModifyInitialFund(e: egret.TouchEvent): void {
            const maxValue = CommonConstants.WarRuleInitialFundMaxLimit;
            const minValue = CommonConstants.WarRuleInitialFundMinLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0178),
                currentValue    : "" + ScrModel.getCreateWarInitialFund(),
                maxChars        : 7,
                charRestrict    : null,
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = Number(panel.getInputText());
                    if (isNaN(value)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        ScrModel.setCreateWarInitialFund(Math.min(maxValue, Math.max(minValue, value)));
                        this._updateLabelInitialFund();
                    }
                },
            });
        }

        private _onTouchedBtnModifyIncomeMultiplier(e: egret.TouchEvent): void {
            const maxValue = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
            const minValue = CommonConstants.WarRuleIncomeMultiplierMinLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0179),
                currentValue    : "" + ScrModel.getCreateWarIncomeMultiplier(),
                maxChars        : 5,
                charRestrict    : null,
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = Number(panel.getInputText());
                    if (isNaN(value)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        ScrModel.setCreateWarIncomeMultiplier(Math.min(maxValue, Math.max(minValue, value)));
                        this._updateLabelIncomeMultiplier();
                    }
                },
            });
        }

        private _onTouchedBtnModifyInitialEnergy(e: egret.TouchEvent): void {
            const maxValue = CommonConstants.WarRuleInitialEnergyMaxLimit;
            const minValue = CommonConstants.WarRuleInitialEnergyMinLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0180),
                currentValue    : "" + ScrModel.getCreateWarInitialEnergy(),
                maxChars        : 5,
                charRestrict    : null,
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = Number(panel.getInputText());
                    if (isNaN(value)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        ScrModel.setCreateWarInitialEnergy(Math.min(maxValue, Math.max(minValue, value)));
                        this._updateLabelInitialEnergy();
                    }
                },
            });
        }

        private _onTouchedBtnModifyEnergyGrowthMultiplier(e: egret.TouchEvent): void {
            const maxValue = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
            const minValue = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0181),
                currentValue    : "" + ScrModel.getCreateWarEnergyGrowthMultiplier(),
                maxChars        : 5,
                charRestrict    : null,
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = Number(panel.getInputText());
                    if (isNaN(value)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        ScrModel.setCreateWarEnergyGrowthMultiplier(Math.min(maxValue, Math.max(minValue, value)));
                        this._updateLabelEnergyGrowthMultiplier();
                    }
                },
            });
        }

        private _onTouchedBtnModifyLuckLowerLimit(e: egret.TouchEvent): void {
            const maxValue = CommonConstants.WarRuleLuckMaxLimit;
            const minValue = CommonConstants.WarRuleLuckMinLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0189),
                currentValue    : "" + ScrModel.getCreateWarLuckLowerLimit(),
                maxChars        : 5,
                charRestrict    : null,
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = Number(panel.getInputText());
                    if (isNaN(value)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        ScrModel.setCreateWarLuckLowerLimit(Math.min(maxValue, Math.max(minValue, value)));
                        this._updateLabelLuckLowerLimit();
                    }
                },
            });
        }

        private _onTouchedBtnModifyLuckUpperLimit(e: egret.TouchEvent): void {
            const maxValue = CommonConstants.WarRuleLuckMaxLimit;
            const minValue = CommonConstants.WarRuleLuckMinLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0189),
                currentValue    : "" + ScrModel.getCreateWarLuckUpperLimit(),
                maxChars        : 5,
                charRestrict    : null,
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = Number(panel.getInputText());
                    if (isNaN(value)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        ScrModel.setCreateWarLuckUpperLimit(Math.min(maxValue, Math.max(minValue, value)));
                        this._updateLabelLuckUpperLimit();
                    }
                },
            });
        }

        private _onTouchedBtnModifyMoveRange(e: egret.TouchEvent): void {
            const maxValue = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
            const minValue = CommonConstants.WarRuleMoveRangeModifierMinLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0182),
                currentValue    : "" + ScrModel.getCreateWarMoveRangeModifier(),
                maxChars        : 5,
                charRestrict    : null,
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = Number(panel.getInputText());
                    if (isNaN(value)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        ScrModel.setCreateWarMoveRangeModifier(Math.min(maxValue, Math.max(minValue, value)));
                        this._updateLabelMoveRange();
                    }
                },
            });
        }

        private _onTouchedBtnModifyAttackPower(e: egret.TouchEvent): void {
            const maxValue = CommonConstants.WarRuleOffenseBonusMaxLimit;
            const minValue = CommonConstants.WarRuleOffenseBonusMinLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0183),
                currentValue    : "" + ScrModel.getCreateWarAttackPowerModifier(),
                maxChars        : 5,
                charRestrict    : null,
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = Number(panel.getInputText());
                    if (isNaN(value)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        ScrModel.setCreateWarAttackPowerModifier(Math.min(maxValue, Math.max(minValue, value)));
                        this._updateLabelAttackPower();
                    }
                },
            });
        }

        private _onTouchedBtnModifyVisionRange(e: egret.TouchEvent): void {
            const maxValue = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
            const minValue = CommonConstants.WarRuleVisionRangeModifierMinLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0184),
                currentValue    : "" + ScrModel.getCreateWarVisionRangeModifier(),
                maxChars        : 5,
                charRestrict    : null,
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                callback        : panel => {
                    const value = Number(panel.getInputText());
                    if (isNaN(value)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        ScrModel.setCreateWarVisionRangeModifier(Math.min(maxValue, Math.max(minValue, value)));
                        this._updateLabelVisionRange();
                    }
                },
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMapNameTitle.text                = `${Lang.getText(Lang.Type.B0225)}:`;
            this._labelPlayersCountTitle.text           = `${Lang.getText(Lang.Type.B0229)}:`;
            this._labelTips.text                        = Lang.getText(Lang.Type.A0065);
            this._btnModifyInitialFund.label            = Lang.getText(Lang.Type.B0178);
            this._btnModifyIncomeMultiplier.label       = Lang.getText(Lang.Type.B0179);
            this._btnModifyInitialEnergy.label          = Lang.getText(Lang.Type.B0180);
            this._btnModifyEnergyGrowthMultiplier.label = Lang.getText(Lang.Type.B0181);
            this._btnModifyMoveRange.label              = Lang.getText(Lang.Type.B0182);
            this._btnModifyAttackPower.label            = Lang.getText(Lang.Type.B0183);
            this._btnModifyVisionRange.label            = Lang.getText(Lang.Type.B0184);
            this._btnModifyLuckLowerLimit.label         = Lang.getText(Lang.Type.B0189);
            this._btnModifyLuckUpperLimit.label         = Lang.getText(Lang.Type.B0190);
        }

        private _updateLabelInitialFund(): void {
            this._labelInitialFund.text = "" + ScrModel.getCreateWarInitialFund();
        }

        private _updateLabelIncomeMultiplier(): void {
            this._labelIncomeMultiplier.text = `${ScrModel.getCreateWarIncomeMultiplier()}%`;
        }

        private _updateLabelInitialEnergy(): void {
            this._labelInitialEnergy.text = `${ScrModel.getCreateWarInitialEnergy()}%`;
        }

        private _updateLabelEnergyGrowthMultiplier(): void {
            this._labelEnergyGrowthMultiplier.text = `${ScrModel.getCreateWarEnergyGrowthMultiplier()}%`;
        }

        private _updateLabelLuckLowerLimit(): void {
            this._labelLuckLowerLimit.text = "" + ScrModel.getCreateWarLuckLowerLimit();
        }

        private _updateLabelLuckUpperLimit(): void {
            this._labelLuckUpperLimit.text = "" + ScrModel.getCreateWarLuckUpperLimit();
        }

        private _updateLabelMapName(): void {
            WarMapModel.getMapNameInCurrentLanguage(this._mapRawData.mapId).then(v => this._labelMapName.text = v);
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapRawData.playersCount;
        }

        private _updateLabelMoveRange(): void {
            const modifier = ScrModel.getCreateWarMoveRangeModifier();
            if (modifier <= 0) {
                this._labelMoveRange.text = "" + modifier;
            } else {
                this._labelMoveRange.text = "+" + modifier;
            }
        }

        private _updateLabelAttackPower(): void {
            const modifier              = ScrModel.getCreateWarAttackPowerModifier();
            this._labelAttackPower.text = modifier <= 0 ? `${modifier}%` : `+${modifier}%`;
        }

        private _updateLabelVisionRange(): void {
            const modifier              = ScrModel.getCreateWarVisionRangeModifier();
            this._labelVisionRange.text = modifier <= 0
                ? "" + modifier
                : "+" + modifier;
        }
    }
}
