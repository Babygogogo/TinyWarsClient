
namespace NewCustomWarSettings {
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import HelpPanel        = Common.HelpPanel;
    import TemplateMapModel = TemplateMap.TemplateMapModel;

    export class AdvancedSettingsPage extends GameUi.UiTabPage {
        private _labelMapName       : GameUi.UiLabel;
        private _labelPlayersCount  : GameUi.UiLabel;

        private _inputInitialFund   : GameUi.UiTextInput;
        private _inputIncomeModifier: GameUi.UiTextInput;

        private _inputInitialEnergy : GameUi.UiTextInput;
        private _inputEnergyModifier: GameUi.UiTextInput;

        private _btnPrevMoveRange : GameUi.UiButton;
        private _btnNextMoveRange : GameUi.UiButton;
        private _labelMoveRange   : GameUi.UiLabel;

        private _btnPrevAttack    : GameUi.UiButton;
        private _btnNextAttack    : GameUi.UiButton;
        private _labelAttack      : GameUi.UiLabel;

        private _btnPrevVision : GameUi.UiButton;
        private _btnNextVision : GameUi.UiButton;
        private _labelVision   : GameUi.UiLabel;

        protected _mapInfo: ProtoTypes.IMapInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/newCustomWarSettings/AdvancedSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._inputInitialFund,       callback: this._onFocusOutInputInitialFund,     eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputIncomeModifier,    callback: this._onFocusOutInputIncomeModifier,  eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputInitialEnergy,     callback: this._onFocusOutInputInitialEnergy,   eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputEnergyModifier,    callback: this._onFocusOutInputEnergyModifier,  eventType: egret.Event.FOCUS_OUT, },
                { ui: this._btnPrevMoveRange,       callback: this._onTouchedBtnPrevMoveRange, },
                { ui: this._btnNextMoveRange,       callback: this._onTouchedBtnNextMoveRange, },
                { ui: this._btnPrevAttack,          callback: this._onTouchedBtnPrevAttack, },
                { ui: this._btnNextAttack,          callback: this._onTouchedBtnNextAttack, },
                { ui: this._btnPrevVision,          callback: this._onTouchedBtnPrevVision, },
                { ui: this._btnNextVision,          callback: this._onTouchedBtnNextVision, },
            ];
        }

        protected _onOpened(): void {
            this._mapInfo = SettingsModel.getMapInfo();

            this._updateLabelMapName();
            this._updateLabelPlayersCount();
            this._updateInputInitialFund();
            this._updateInputIncomeModifier();
            this._updateInputInitialEnergy();
            this._updateInputEnergyModifier();
            this._updateLabelMoveRange();
            this._updateLabelAttack();
            this._updateLabelVision();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onFocusOutInputInitialFund(e: egret.Event): void {
            let fund = Number(this._inputInitialFund.text);
            if (isNaN(fund)) {
                fund = SettingsModel.DEFAULT_INITIAL_FUND;
            } else {
                fund = Math.min(fund, SettingsModel.MAX_INITIAL_FUND);
                fund = Math.max(fund, SettingsModel.MIN_INITIAL_FUND);
            }
            SettingsModel.setInitialFund(fund);
            this._updateInputInitialFund();
        }

        private _onFocusOutInputIncomeModifier(e: egret.Event): void {
            let modifier = Number(this._inputIncomeModifier.text);
            if (isNaN(modifier)) {
                modifier = SettingsModel.DEFAULT_INCOME_MODIFIER;
            } else {
                modifier = Math.min(modifier, SettingsModel.MAX_INCOME_MODIFIER);
                modifier = Math.max(modifier, SettingsModel.MIN_INCOME_MODIFIER);
            }
            SettingsModel.setIncomeModifier(modifier);
            this._updateInputIncomeModifier();
        }

        private _onFocusOutInputInitialEnergy(e: egret.Event): void {
            let energy = Number(this._inputInitialEnergy.text);
            if (isNaN(energy)) {
                energy = SettingsModel.DEFAULT_INITIAL_ENERGY;
            } else {
                energy = Math.min(energy, SettingsModel.MAX_INITIAL_ENERGY);
                energy = Math.max(energy, SettingsModel.MIN_INITIAL_ENERGY);
            }
            SettingsModel.setInitialEnergy(energy);
            this._updateInputInitialEnergy();
        }

        private _onFocusOutInputEnergyModifier(e: egret.Event): void {
            let modifier = Number(this._inputEnergyModifier.text);
            if (isNaN(modifier)) {
                modifier = SettingsModel.DEFAULT_ENERGY_MODIFIER;
            } else {
                modifier = Math.min(modifier, SettingsModel.MAX_ENERGY_MODIFIER);
                modifier = Math.max(modifier, SettingsModel.MIN_ENERGY_MODIFIER);
            }
            SettingsModel.setEnergyModifier(modifier);
            this._updateInputEnergyModifier();
        }

        private _onTouchedBtnPrevMoveRange(e: egret.TouchEvent): void {
            SettingsModel.setPrevMoveRangeModifier();
            this._updateLabelMoveRange();
        }

        private _onTouchedBtnNextMoveRange(e: egret.TouchEvent): void {
            SettingsModel.setNextMoveRangeModifier();
            this._updateLabelMoveRange();
        }

        private _onTouchedBtnPrevAttack(e: egret.TouchEvent): void {
            SettingsModel.setPrevAttackModifier();
            this._updateLabelAttack();
        }

        private _onTouchedBtnNextAttack(e: egret.TouchEvent): void {
            SettingsModel.setNextAttackModifier();
            this._updateLabelAttack();
        }

        private _onTouchedBtnPrevVision(e: egret.TouchEvent): void {
            SettingsModel.setPrevVisionModifier();
            this._updateLabelVision();
        }

        private _onTouchedBtnNextVision(e: egret.TouchEvent): void {
            SettingsModel.setNextVisionModifier();
            this._updateLabelVision();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateInputInitialFund(): void {
            this._inputInitialFund.text = "" + SettingsModel.getInitialFund();
        }

        private _updateInputIncomeModifier(): void {
            this._inputIncomeModifier.text = "" + SettingsModel.getIncomeModifier();
        }

        private _updateInputInitialEnergy(): void {
            this._inputInitialEnergy.text = "" + SettingsModel.getInitialEnergy();
        }

        private _updateInputEnergyModifier(): void {
            this._inputEnergyModifier.text = "" + SettingsModel.getEnergyModifier();
        }

        private _updateLabelMapName(): void {
            this._labelMapName.text = this._mapInfo.mapName;
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapInfo.playersCount;
        }

        private _updateLabelMoveRange(): void {
            const modifier = SettingsModel.getMoveRangeModifier();
            if (modifier <= 0) {
                this._labelMoveRange.text = "" + modifier;
            } else {
                this._labelMoveRange.text = "+" + modifier;
            }
        }

        private _updateLabelAttack(): void {
            const modifier = SettingsModel.getAttackModifier();
            if (modifier <= 0) {
                this._labelAttack.text = "" + modifier;
            } else {
                this._labelAttack.text = "+" + modifier;
            }
        }

        private _updateLabelVision(): void {
            const modifier = SettingsModel.getVisionModifier();
            if (modifier <= 0) {
                this._labelVision.text = "" + modifier;
            } else {
                this._labelVision.text = "+" + modifier;
            }
        }
    }
}
