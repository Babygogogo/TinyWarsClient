
namespace TinyWars.SingleCustomRoom {
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfirmPanel     = Common.ConfirmPanel;
    import HelpPanel        = Common.HelpPanel;
    import WarMapModel      = WarMap.WarMapModel;

    export class ScrCreateAdvancedSettingsPage extends GameUi.UiTabPage {
        private _labelMapNameTitle      : GameUi.UiLabel;
        private _labelMapName           : GameUi.UiLabel;
        private _labelPlayersCountTitle : GameUi.UiLabel;
        private _labelPlayersCount      : GameUi.UiLabel;
        private _labelTips              : GameUi.UiLabel;

        private _labelInitialFundTitle  : GameUi.UiLabel;
        private _labelInitialFundTips   : GameUi.UiLabel;
        private _inputInitialFund       : GameUi.UiTextInput;

        private _labelIncomeMultiplierTitle : GameUi.UiLabel;
        private _labelIncomeMultiplierTips  : GameUi.UiLabel;
        private _inputIncomeModifier        : GameUi.UiTextInput;

        private _labelInitialEnergyTitle    : GameUi.UiLabel;
        private _labelInitialEnergyTips     : GameUi.UiLabel;
        private _inputInitialEnergy         : GameUi.UiTextInput;

        private _labelEnergyGrowthModifierTitle : GameUi.UiLabel;
        private _labelEnergyGrowthModifierTips  : GameUi.UiLabel;
        private _inputEnergyModifier            : GameUi.UiTextInput;

        private _labelLuckLowerLimitTitle   : GameUi.UiLabel;
        private _inputLuckLowerLimit        : GameUi.UiTextInput;

        private _labelLuckUpperLimitTitle   : GameUi.UiLabel;
        private _inputLuckUpperLimit        : GameUi.UiTextInput;

        private _labelMoveRangeTitle    : GameUi.UiLabel;
        private _btnPrevMoveRange       : GameUi.UiButton;
        private _btnNextMoveRange       : GameUi.UiButton;
        private _labelMoveRange         : GameUi.UiLabel;

        private _labelAttackTitle   : GameUi.UiLabel;
        private _btnPrevAttack      : GameUi.UiButton;
        private _btnNextAttack      : GameUi.UiButton;
        private _labelAttack        : GameUi.UiLabel;

        private _labelVisionTitle   : GameUi.UiLabel;
        private _btnPrevVision      : GameUi.UiButton;
        private _btnNextVision      : GameUi.UiButton;
        private _labelVision        : GameUi.UiLabel;

        protected _mapExtraData: ProtoTypes.IMapExtraData;

        public constructor() {
            super();

            this.skinName = "resource/skins/singleCustomRoom/ScrCreateAdvancedSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._inputInitialFund,       callback: this._onFocusOutInputInitialFund,     eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputIncomeModifier,    callback: this._onFocusOutInputIncomeModifier,  eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputInitialEnergy,     callback: this._onFocusOutInputInitialEnergy,   eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputEnergyModifier,    callback: this._onFocusOutInputEnergyModifier,  eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputLuckLowerLimit,    callback: this._onFocusOutInputLuckLowerLimit,  eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputLuckUpperLimit,    callback: this._onFocusOutInputLuckUpperLimit,  eventType: egret.Event.FOCUS_OUT, },
                { ui: this._btnPrevMoveRange,       callback: this._onTouchedBtnPrevMoveRange, },
                { ui: this._btnNextMoveRange,       callback: this._onTouchedBtnNextMoveRange, },
                { ui: this._btnPrevAttack,          callback: this._onTouchedBtnPrevAttack, },
                { ui: this._btnNextAttack,          callback: this._onTouchedBtnNextAttack, },
                { ui: this._btnPrevVision,          callback: this._onTouchedBtnPrevVision, },
                { ui: this._btnNextVision,          callback: this._onTouchedBtnNextVision, },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
        }

        protected _onOpened(): void {
            this._mapExtraData = ScrModel.getCreateWarMapExtraData();

            this._updateComponentsForLanguage();
            this._updateLabelMapName();
            this._updateLabelPlayersCount();
            this._updateInputInitialFund();
            this._updateInputIncomeModifier();
            this._updateInputInitialEnergy();
            this._updateInputEnergyModifier();
            this._updateInputLuckLowerLimit();
            this._updateInputLuckUpperLimit();
            this._updateLabelMoveRange();
            this._updateLabelAttack();
            this._updateLabelVision();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onFocusOutInputInitialFund(e: egret.Event): void {
            let fund = Number(this._inputInitialFund.text);
            if (isNaN(fund)) {
                fund = DEFAULT_INITIAL_FUND;
            } else {
                fund = Math.min(fund, MAX_INITIAL_FUND);
                fund = Math.max(fund, MIN_INITIAL_FUND);
            }
            ScrModel.setCreateWarInitialFund(fund);
            this._updateInputInitialFund();
        }

        private _onFocusOutInputIncomeModifier(e: egret.Event): void {
            let modifier = Number(this._inputIncomeModifier.text);
            if (isNaN(modifier)) {
                modifier = DEFAULT_INCOME_MODIFIER;
            } else {
                modifier = Math.min(modifier, MAX_INCOME_MODIFIER);
                modifier = Math.max(modifier, MIN_INCOME_MODIFIER);
            }
            ScrModel.setCreateWarIncomeModifier(modifier);
            this._updateInputIncomeModifier();
        }

        private _onFocusOutInputInitialEnergy(e: egret.Event): void {
            let energy = Number(this._inputInitialEnergy.text);
            if (isNaN(energy)) {
                energy = DEFAULT_INITIAL_ENERGY;
            } else {
                energy = Math.min(energy, MAX_INITIAL_ENERGY);
                energy = Math.max(energy, MIN_INITIAL_ENERGY);
            }
            ScrModel.setCreateWarInitialEnergy(energy);
            this._updateInputInitialEnergy();
        }

        private _onFocusOutInputEnergyModifier(e: egret.Event): void {
            let modifier = Number(this._inputEnergyModifier.text);
            if (isNaN(modifier)) {
                modifier = DEFAULT_ENERGY_MODIFIER;
            } else {
                modifier = Math.min(modifier, MAX_ENERGY_MODIFIER);
                modifier = Math.max(modifier, MIN_ENERGY_MODIFIER);
            }
            ScrModel.setCreateWarEnergyGrowthModifier(modifier);
            this._updateInputEnergyModifier();
        }

        private _onFocusOutInputLuckLowerLimit(e: egret.Event): void {
            let limit = Number(this._inputLuckLowerLimit.text);
            if (isNaN(limit)) {
                limit = ConfigManager.DEFAULT_LUCK_LOWER_LIMIT;
            } else {
                limit = Math.min(limit, ConfigManager.MAX_LUCK_LIMIT);
                limit = Math.max(limit, ConfigManager.MIN_LUCK_LIMIT);
            }
            ScrModel.setCreateWarLuckLowerLimit(limit);
            this._updateInputLuckLowerLimit();
        }

        private _onFocusOutInputLuckUpperLimit(e: egret.Event): void {
            let limit = Number(this._inputLuckUpperLimit.text);
            if (isNaN(limit)) {
                limit = ConfigManager.DEFAULT_LUCK_UPPER_LIMIT;
            } else {
                limit = Math.min(limit, ConfigManager.MAX_LUCK_LIMIT);
                limit = Math.max(limit, ConfigManager.MIN_LUCK_LIMIT);
            }
            ScrModel.setCreateWarLuckUpperLimit(limit);
            this._updateInputLuckUpperLimit();
        }

        private _onTouchedBtnPrevMoveRange(e: egret.TouchEvent): void {
            ScrModel.setCreateWarPrevMoveRangeModifier();
            this._updateLabelMoveRange();
        }

        private _onTouchedBtnNextMoveRange(e: egret.TouchEvent): void {
            ScrModel.setCreateWarNextMoveRangeModifier();
            this._updateLabelMoveRange();
        }

        private _onTouchedBtnPrevAttack(e: egret.TouchEvent): void {
            ScrModel.setCreateWarPrevAttackPowerModifier();
            this._updateLabelAttack();
        }

        private _onTouchedBtnNextAttack(e: egret.TouchEvent): void {
            ScrModel.setCreateWarNextAttackPowerModifier();
            this._updateLabelAttack();
        }

        private _onTouchedBtnPrevVision(e: egret.TouchEvent): void {
            ScrModel.setCreateWarPrevVisionRangeModifier();
            this._updateLabelVision();
        }

        private _onTouchedBtnNextVision(e: egret.TouchEvent): void {
            ScrModel.setNextVisionRangeModifier();
            this._updateLabelVision();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMapNameTitle.text                = `${Lang.getText(Lang.Type.B0225)}:`;
            this._labelPlayersCountTitle.text           = `${Lang.getText(Lang.Type.B0229)}:`;
            this._labelTips.text                        = Lang.getText(Lang.Type.A0065);
            this._labelInitialFundTitle.text            = `${Lang.getText(Lang.Type.B0178)}: `;
            this._labelInitialFundTips.text             = `(${Lang.getText(Lang.Type.B0239)} 1000000)`;
            this._labelIncomeMultiplierTitle.text       = `${Lang.getText(Lang.Type.B0179)}: `;
            this._labelIncomeMultiplierTips.text        = `(${Lang.getText(Lang.Type.B0239)} 1000%)`;
            this._labelInitialEnergyTitle.text          = `${Lang.getText(Lang.Type.B0180)}: `;
            this._labelInitialEnergyTips.text           = `(${Lang.getText(Lang.Type.B0239)} 100%)`;
            this._labelEnergyGrowthModifierTitle.text   = `${Lang.getText(Lang.Type.B0181)}: `;
            this._labelEnergyGrowthModifierTips.text    = `(${Lang.getText(Lang.Type.B0239)} 1000%)`;
            this._labelMoveRangeTitle.text              = `${Lang.getText(Lang.Type.B0182)}: `;
            this._labelAttackTitle.text                 = `${Lang.getText(Lang.Type.B0183)}: `;
            this._labelVisionTitle.text                 = `${Lang.getText(Lang.Type.B0184)}: `;
            this._labelLuckLowerLimitTitle.text         = `${Lang.getText(Lang.Type.B0189)}: `;
            this._labelLuckUpperLimitTitle.text         = `${Lang.getText(Lang.Type.B0190)}: `;
        }

        private _updateInputInitialFund(): void {
            this._inputInitialFund.text = "" + ScrModel.getCreateWarInitialFund();
        }

        private _updateInputIncomeModifier(): void {
            this._inputIncomeModifier.text = "" + ScrModel.getCreateWarIncomeModifier();
        }

        private _updateInputInitialEnergy(): void {
            this._inputInitialEnergy.text = "" + ScrModel.getCreateWarInitialEnergy();
        }

        private _updateInputEnergyModifier(): void {
            this._inputEnergyModifier.text = "" + ScrModel.getCreateWarEnergyGrowthModifier();
        }

        private _updateInputLuckLowerLimit(): void {
            this._inputLuckLowerLimit.text = "" + ScrModel.getCreateWarLuckLowerLimit();
        }

        private _updateInputLuckUpperLimit(): void {
            this._inputLuckUpperLimit.text = "" + ScrModel.getCreateWarLuckUpperLimit();
        }

        private _updateLabelMapName(): void {
            this._labelMapName.text = WarMapModel.getMapNameInLanguage(this._mapExtraData.mapFileName);
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapExtraData.playersCount;
        }

        private _updateLabelMoveRange(): void {
            const modifier = ScrModel.getCreateWarMoveRangeModifier();
            if (modifier <= 0) {
                this._labelMoveRange.text = "" + modifier;
            } else {
                this._labelMoveRange.text = "+" + modifier;
            }
        }

        private _updateLabelAttack(): void {
            const modifier = ScrModel.getCreateWarAttackPowerModifier();
            if (modifier <= 0) {
                this._labelAttack.text = "" + modifier;
            } else {
                this._labelAttack.text = "+" + modifier;
            }
        }

        private _updateLabelVision(): void {
            const modifier = ScrModel.getCreateWarVisionRangeModifier();
            if (modifier <= 0) {
                this._labelVision.text = "" + modifier;
            } else {
                this._labelVision.text = "+" + modifier;
            }
        }
    }
}
