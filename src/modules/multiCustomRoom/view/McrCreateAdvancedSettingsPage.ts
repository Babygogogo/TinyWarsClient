
namespace TinyWars.MultiCustomRoom {
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfirmPanel     = Common.ConfirmPanel;
    import HelpPanel        = Common.HelpPanel;
    import WarMapModel      = WarMap.WarMapModel;

    export class McrCreateAdvancedSettingsPage extends GameUi.UiTabPage {
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

        private _labelAvailableCoTitle  : GameUi.UiLabel;
        private _groupCoTiers           : eui.Group;
        private _groupCoNames           : eui.Group;
        private _renderersForCoTiers    : RendererForCoTier[] = [];
        private _renderersForCoNames    : RendererForCoName[] = [];

        protected _mapExtraData: ProtoTypes.IMapExtraData;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateAdvancedSettingsPage.exml";
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

        protected async _onOpened(): Promise<void> {
            this._mapExtraData = await McrModel.getCreateWarMapExtraData();

            this._updateComponentsForLanguage();
            this._initGroupCoTiers();
            this._initGroupCoNames();
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

        protected _onClosed(): void {
            this._clearGroupCoTiers();
            this._clearGroupCoNames();
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
            McrModel.setCreateWarInitialFund(fund);
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
            McrModel.setCreateWarIncomeModifier(modifier);
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
            McrModel.setCreateWarInitialEnergy(energy);
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
            McrModel.setCreateWarEnergyGrowthModifier(modifier);
            this._updateInputEnergyModifier();
        }

        private _onFocusOutInputLuckLowerLimit(e: egret.Event): void {
            let limit = Number(this._inputLuckLowerLimit.text);
            if (isNaN(limit)) {
                limit = ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultLowerLimit;
            } else {
                limit = Math.min(limit, ConfigManager.COMMON_CONSTANTS.WarRuleLuckMaxLimit);
                limit = Math.max(limit, ConfigManager.COMMON_CONSTANTS.WarRuleLuckMinLimit);
            }
            McrModel.setCreateWarLuckLowerLimit(limit);
            this._updateInputLuckLowerLimit();
        }

        private _onFocusOutInputLuckUpperLimit(e: egret.Event): void {
            let limit = Number(this._inputLuckUpperLimit.text);
            if (isNaN(limit)) {
                limit = ConfigManager.COMMON_CONSTANTS.WarRuleLuckDefaultUpperLimit;
            } else {
                limit = Math.min(limit, ConfigManager.COMMON_CONSTANTS.WarRuleLuckMaxLimit);
                limit = Math.max(limit, ConfigManager.COMMON_CONSTANTS.WarRuleLuckMinLimit);
            }
            McrModel.setCreateWarLuckUpperLimit(limit);
            this._updateInputLuckUpperLimit();
        }

        private _onTouchedBtnPrevMoveRange(e: egret.TouchEvent): void {
            McrModel.setCreateWarPrevMoveRangeModifier();
            this._updateLabelMoveRange();
        }

        private _onTouchedBtnNextMoveRange(e: egret.TouchEvent): void {
            McrModel.setCreateWarNextMoveRangeModifier();
            this._updateLabelMoveRange();
        }

        private _onTouchedBtnPrevAttack(e: egret.TouchEvent): void {
            McrModel.setCreateWarPrevAttackPowerModifier();
            this._updateLabelAttack();
        }

        private _onTouchedBtnNextAttack(e: egret.TouchEvent): void {
            McrModel.setCreateWarNextAttackPowerModifier();
            this._updateLabelAttack();
        }

        private _onTouchedBtnPrevVision(e: egret.TouchEvent): void {
            McrModel.setCreateWarPrevVisionRangeModifier();
            this._updateLabelVision();
        }

        private _onTouchedBtnNextVision(e: egret.TouchEvent): void {
            McrModel.setNextVisionRangeModifier();
            this._updateLabelVision();
        }

        private _onTouchedCoTierRenderer(e: egret.TouchEvent): void {
            const renderer  = e.currentTarget as RendererForCoTier;
            const coIdList  = renderer.getIsCustomSwitch()
                ? ConfigManager.getCustomCoIdList(ConfigManager.getNewestConfigVersion())
                : ConfigManager.getCoIdListInTier(ConfigManager.getNewestConfigVersion(), renderer.getCoTier());

            if (renderer.getState() === CoTierState.Unavailable) {
                for (const coId of coIdList) {
                    McrModel.removeCreateWarBannedCoId(coId);
                }
                this._updateGroupCoTiers();
                this._updateGroupCoNames();

            } else {
                const selfCoId = McrModel.getCreateWarCoId();
                if (coIdList.indexOf(selfCoId) < 0) {
                    for (const coId of coIdList) {
                        McrModel.addCreateWarBannedCoId(coId);
                    }
                    this._updateGroupCoTiers();
                    this._updateGroupCoNames();

                } else {
                    ConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0057),
                        callback: () => {
                            for (const coId of coIdList) {
                                McrModel.addCreateWarBannedCoId(coId);
                            }
                            McrModel.setCreateWarCoId(null);
                            this._updateGroupCoTiers();
                            this._updateGroupCoNames();
                        },
                    });
                }
            }
        }

        private _onTouchedCoNameRenderer(e: egret.TouchEvent): void {
            const renderer  = e.currentTarget as RendererForCoName;
            const coId      = renderer.getCoId();
            if (!renderer.getIsSelected()) {
                McrModel.removeCreateWarBannedCoId(coId);
                this._updateGroupCoTiers();
                this._updateGroupCoNames();

            } else {
                if (McrModel.getCreateWarCoId() !== coId) {
                    McrModel.addCreateWarBannedCoId(coId);
                    this._updateGroupCoTiers();
                    this._updateGroupCoNames();

                } else {
                    ConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0057),
                        callback: () => {
                            McrModel.addCreateWarBannedCoId(coId);
                            McrModel.setCreateWarCoId(null);
                            this._updateGroupCoTiers();
                            this._updateGroupCoNames();
                        },
                    });
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMapNameTitle.text                = `${Lang.getText(Lang.Type.B0225)}:`;
            this._labelPlayersCountTitle.text           = `${Lang.getText(Lang.Type.B0229)}:`;
            this._labelTips.text                        = Lang.getText(Lang.Type.A0065);
            this._labelAvailableCoTitle.text            = `${Lang.getText(Lang.Type.B0238)}:`;
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
            this._inputInitialFund.text = "" + McrModel.getCreateWarInitialFund();
        }

        private _updateInputIncomeModifier(): void {
            this._inputIncomeModifier.text = "" + McrModel.getCreateWarIncomeModifier();
        }

        private _updateInputInitialEnergy(): void {
            this._inputInitialEnergy.text = "" + McrModel.getCreateWarInitialEnergy();
        }

        private _updateInputEnergyModifier(): void {
            this._inputEnergyModifier.text = "" + McrModel.getCreateWarEnergyGrowthModifier();
        }

        private _updateInputLuckLowerLimit(): void {
            this._inputLuckLowerLimit.text = "" + McrModel.getCreateWarLuckLowerLimit();
        }

        private _updateInputLuckUpperLimit(): void {
            this._inputLuckUpperLimit.text = "" + McrModel.getCreateWarLuckUpperLimit();
        }

        private _updateLabelMapName(): void {
            WarMapModel.getMapNameInLanguage(this._mapExtraData.mapFileName).then(v => this._labelMapName.text = v);
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapExtraData.playersCount;
        }

        private _updateLabelMoveRange(): void {
            const modifier = McrModel.getCreateWarMoveRangeModifier();
            if (modifier <= 0) {
                this._labelMoveRange.text = "" + modifier;
            } else {
                this._labelMoveRange.text = "+" + modifier;
            }
        }

        private _updateLabelAttack(): void {
            const modifier = McrModel.getCreateWarAttackPowerModifier();
            if (modifier <= 0) {
                this._labelAttack.text = "" + modifier;
            } else {
                this._labelAttack.text = "+" + modifier;
            }
        }

        private _updateLabelVision(): void {
            const modifier = McrModel.getCreateWarVisionRangeModifier();
            if (modifier <= 0) {
                this._labelVision.text = "" + modifier;
            } else {
                this._labelVision.text = "+" + modifier;
            }
        }

        private _initGroupCoTiers(): void {
            for (const tier of ConfigManager.getCoTiers(ConfigManager.getNewestConfigVersion())) {
                const renderer = new RendererForCoTier();
                renderer.setCoTier(tier);
                renderer.setState(CoTierState.AllAvailable);
                renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoTierRenderer, this);
                this._renderersForCoTiers.push(renderer);
                this._groupCoTiers.addChild(renderer);
            }

            const rendererForCustomCo = new RendererForCoTier();
            rendererForCustomCo.setIsCustomSwitch(true);
            rendererForCustomCo.setState(CoTierState.AllAvailable);
            rendererForCustomCo.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoTierRenderer, this);
            this._renderersForCoTiers.push(rendererForCustomCo);
            this._groupCoTiers.addChild(rendererForCustomCo);

            this._updateGroupCoTiers();
        }

        private _clearGroupCoTiers(): void {
            this._groupCoTiers.removeChildren();
            this._renderersForCoTiers.length = 0;
        }

        private _updateGroupCoTiers(): void {
            const bannedCoIdList = McrModel.getCreateWarBannedCoIdList();
            for (const renderer of this._renderersForCoTiers) {
                const includedCoIdList = renderer.getIsCustomSwitch()
                    ? ConfigManager.getCustomCoIdList(ConfigManager.getNewestConfigVersion())
                    : ConfigManager.getCoIdListInTier(ConfigManager.getNewestConfigVersion(), renderer.getCoTier());
                if (includedCoIdList.every(coId => bannedCoIdList.indexOf(coId) < 0)) {
                    renderer.setState(CoTierState.AllAvailable);
                } else if (includedCoIdList.every(coId => bannedCoIdList.indexOf(coId) >= 0)) {
                    renderer.setState(CoTierState.Unavailable);
                } else {
                    renderer.setState(CoTierState.PartialAvailable);
                }
            }
        }

        private _initGroupCoNames(): void {
            for (const cfg of ConfigManager.getAvailableCoList(ConfigManager.getNewestConfigVersion())) {
                const renderer = new RendererForCoName();
                renderer.setCoId(cfg.coId);
                renderer.setIsSelected(true);

                renderer.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchedCoNameRenderer, this);
                this._renderersForCoNames.push(renderer);
                this._groupCoNames.addChild(renderer);
            }

            this._updateGroupCoNames();
        }

        private _clearGroupCoNames(): void {
            this._groupCoNames.removeChildren();
            this._renderersForCoNames.length = 0;
        }

        private _updateGroupCoNames(): void {
            const bannedCoIdList = McrModel.getCreateWarBannedCoIdList();
            for (const renderer of this._renderersForCoNames) {
                renderer.setIsSelected(bannedCoIdList.indexOf(renderer.getCoId()) < 0);
            }
        }
    }

    const enum CoTierState {
        AllAvailable,
        PartialAvailable,
        Unavailable,
    }

    class RendererForCoTier extends eui.ItemRenderer {
        private _imgSelected: GameUi.UiImage;
        private _labelName  : GameUi.UiLabel;

        private _tier           : number;
        private _isCustomSwitch = false;
        private _state          : CoTierState;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/CheckBox1.exml";
        }

        public setCoTier(tier: number): void {
            this._tier              = tier;
            this._labelName.text    = `Tier ${tier}`;
        }
        public getCoTier(): number {
            return this._tier;
        }

        public setIsCustomSwitch(isCustomSwitch: boolean): void {
            this._isCustomSwitch    = isCustomSwitch;
            this._labelName.text    = "Custom";
        }
        public getIsCustomSwitch(): boolean {
            return this._isCustomSwitch;
        }

        public setState(state: CoTierState): void {
            this._state = state;
            if (state === CoTierState.AllAvailable) {
                this._labelName.textColor = 0x00FF00;
            } else if (state === CoTierState.PartialAvailable) {
                this._labelName.textColor = 0xFFFF00;
            } else {
                this._labelName.textColor = 0xFF0000;
            }
            Helpers.changeColor(this._imgSelected, state === CoTierState.AllAvailable ? Types.ColorType.Origin : Types.ColorType.Gray);
        }
        public getState(): CoTierState {
            return this._state;
        }
    }

    class RendererForCoName extends eui.ItemRenderer {
        private _imgSelected: GameUi.UiImage;
        private _labelName  : GameUi.UiLabel;

        private _coId           : number;
        private _isSelected     : boolean;

        public constructor() {
            super();

            this.skinName = "resource/skins/component/CheckBox1.exml";
        }

        public setCoId(coId: number): void {
            this._coId = coId;

            const cfg               = ConfigManager.getCoBasicCfg(ConfigManager.getNewestConfigVersion(), coId);
            this._labelName.text    = `${cfg.name} (T${cfg.tier})`;
        }
        public getCoId(): number {
            return this._coId;
        }

        public setIsSelected(isSelected: boolean): void {
            this._isSelected            = isSelected;
            this._labelName.textColor   = isSelected ? 0x00ff00 : 0xff0000;
            Helpers.changeColor(this._imgSelected, isSelected ? Types.ColorType.Origin : Types.ColorType.Gray);
        }
        public getIsSelected(): boolean {
            return this._isSelected;
        }
    }
}
