
namespace TinyWars.MultiCustomRoom {
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import ConfirmPanel     = Common.ConfirmPanel;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export class McrCreateAdvancedSettingsPage extends GameUi.UiTabPage {
        private _btnMapNameTitle    : GameUi.UiButton;
        private _labelMapName       : GameUi.UiLabel;
        private _btnBuildings       : GameUi.UiButton;
        private _labelTips          : GameUi.UiLabel;

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
                { ui: this._btnModifyAttackPower,               callback: this._onTouchedBtnModifyAttackPower },
                { ui: this._btnModifyEnergyGrowthMultiplier,    callback: this._onTouchedBtnModifyEnergyGrowthMultiplier },
                { ui: this._btnModifyIncomeMultiplier,          callback: this._onTouchedBtnModifyIncomeMultiplier },
                { ui: this._btnModifyInitialEnergy,             callback: this._onTouchedBtnModifyInitialEnergy },
                { ui: this._btnModifyInitialFund,               callback: this._onTouchedBtnModifyInitialFund },
                { ui: this._btnModifyLuckLowerLimit,            callback: this._onTouchedBtnModifyLuckLowerLimit },
                { ui: this._btnModifyLuckUpperLimit,            callback: this._onTouchedBtnModifyLuckUpperLimit },
                { ui: this._btnModifyMoveRange,                 callback: this._onTouchedBtnModifyMoveRange },
                { ui: this._btnModifyVisionRange,               callback: this._onTouchedBtnModifyVisionRange },
                { ui: this._btnBuildings,                       callback: this._onTouchedBtnBuildings },
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

        private _onTouchedBtnModifyInitialFund(e: egret.TouchEvent): void {
            if (McrModel.getCreateWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                const maxValue = CommonConstants.WarRuleInitialFundMaxLimit;
                const minValue = CommonConstants.WarRuleInitialFundMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0178),
                    currentValue    : "" + McrModel.getCreateWarInitialFund(),
                    maxChars        : 7,
                    charRestrict    : null,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            McrModel.setCreateWarInitialFund(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelInitialFund();
                        }
                    },
                });
            }
        }

        private _onTouchedBtnModifyIncomeMultiplier(e: egret.TouchEvent): void {
            if (McrModel.getCreateWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                const maxValue = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
                const minValue = CommonConstants.WarRuleIncomeMultiplierMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0179),
                    currentValue    : "" + McrModel.getCreateWarIncomeMultiplier(),
                    maxChars        : 5,
                    charRestrict    : null,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            McrModel.setCreateWarIncomeMultiplier(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelIncomeMultiplier();
                        }
                    },
                });
            }
        }

        private _onTouchedBtnModifyInitialEnergy(e: egret.TouchEvent): void {
            if (McrModel.getCreateWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                const maxValue = CommonConstants.WarRuleInitialEnergyMaxLimit;
                const minValue = CommonConstants.WarRuleInitialEnergyMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0180),
                    currentValue    : "" + McrModel.getCreateWarInitialEnergy(),
                    maxChars        : 5,
                    charRestrict    : null,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            McrModel.setCreateWarInitialEnergy(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelInitialEnergy();
                        }
                    },
                });
            }
        }

        private _onTouchedBtnModifyEnergyGrowthMultiplier(e: egret.TouchEvent): void {
            if (McrModel.getCreateWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                const maxValue = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
                const minValue = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0181),
                    currentValue    : "" + McrModel.getCreateWarEnergyGrowthMultiplier(),
                    maxChars        : 5,
                    charRestrict    : null,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            McrModel.setCreateWarEnergyGrowthMultiplier(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelEnergyGrowthMultiplier();
                        }
                    },
                });
            }
        }

        private _onTouchedBtnModifyLuckLowerLimit(e: egret.TouchEvent): void {
            if (McrModel.getCreateWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                const maxValue = CommonConstants.WarRuleLuckMaxLimit;
                const minValue = CommonConstants.WarRuleLuckMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0189),
                    currentValue    : "" + McrModel.getCreateWarLuckLowerLimit(),
                    maxChars        : 5,
                    charRestrict    : null,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            McrModel.setCreateWarLuckLowerLimit(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelLuckLowerLimit();
                        }
                    },
                });
            }
        }

        private _onTouchedBtnModifyLuckUpperLimit(e: egret.TouchEvent): void {
            if (McrModel.getCreateWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                const maxValue = CommonConstants.WarRuleLuckMaxLimit;
                const minValue = CommonConstants.WarRuleLuckMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0189),
                    currentValue    : "" + McrModel.getCreateWarLuckUpperLimit(),
                    maxChars        : 5,
                    charRestrict    : null,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            McrModel.setCreateWarLuckUpperLimit(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelLuckUpperLimit();
                        }
                    },
                });
            }
        }

        private _onTouchedBtnModifyMoveRange(e: egret.TouchEvent): void {
            if (McrModel.getCreateWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                const maxValue = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
                const minValue = CommonConstants.WarRuleMoveRangeModifierMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0182),
                    currentValue    : "" + McrModel.getCreateWarMoveRangeModifier(),
                    maxChars        : 5,
                    charRestrict    : null,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            McrModel.setCreateWarMoveRangeModifier(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelMoveRange();
                        }
                    },
                });
            }
        }

        private _onTouchedBtnModifyAttackPower(e: egret.TouchEvent): void {
            if (McrModel.getCreateWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                const maxValue = CommonConstants.WarRuleOffenseBonusMaxLimit;
                const minValue = CommonConstants.WarRuleOffenseBonusMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0183),
                    currentValue    : "" + McrModel.getCreateWarAttackPowerModifier(),
                    maxChars        : 5,
                    charRestrict    : null,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            McrModel.setCreateWarAttackPowerModifier(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelAttackPower();
                        }
                    },
                });
            }
        }

        private _onTouchedBtnModifyVisionRange(e: egret.TouchEvent): void {
            if (McrModel.getCreateWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                const maxValue = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
                const minValue = CommonConstants.WarRuleVisionRangeModifierMinLimit;
                Common.InputPanel.show({
                    title           : Lang.getText(Lang.Type.B0184),
                    currentValue    : "" + McrModel.getCreateWarVisionRangeModifier(),
                    maxChars        : 5,
                    charRestrict    : null,
                    tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}]`,
                    callback        : panel => {
                        const value = Number(panel.getInputText());
                        if (isNaN(value)) {
                            FloatText.show(Lang.getText(Lang.Type.A0098));
                        } else {
                            McrModel.setCreateWarVisionRangeModifier(Math.min(maxValue, Math.max(minValue, value)));
                            this._updateLabelVisionRange();
                        }
                    },
                });
            }
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            McrBuildingListPanel.show({
                configVersion   : McrModel.getCreateWarData().configVersion,
                mapRawData      : await WarMapModel.getMapRawData(McrModel.getCreateWarMapFileName()) as Types.MapRawData,
            });
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
            this._btnMapNameTitle.label                 = Lang.getText(Lang.Type.B0225);
            this._labelTips.text                        = Lang.getText(Lang.Type.A0065);
            this._labelAvailableCoTitle.text            = `${Lang.getText(Lang.Type.B0238)}:`;
            this._btnModifyInitialEnergy.label          = Lang.getText(Lang.Type.B0180);
            this._btnModifyEnergyGrowthMultiplier.label = Lang.getText(Lang.Type.B0181);
            this._btnModifyMoveRange.label              = Lang.getText(Lang.Type.B0182);
            this._btnModifyAttackPower.label            = Lang.getText(Lang.Type.B0183);
            this._btnModifyVisionRange.label            = Lang.getText(Lang.Type.B0184);
            this._btnModifyLuckLowerLimit.label         = Lang.getText(Lang.Type.B0189);
            this._btnModifyLuckUpperLimit.label         = Lang.getText(Lang.Type.B0190);
            this._btnModifyIncomeMultiplier.label       = Lang.getText(Lang.Type.B0179);
            this._btnModifyInitialFund.label            = Lang.getText(Lang.Type.B0178);
            this._btnBuildings.label                    = Lang.getText(Lang.Type.B0333);
        }

        private _updateLabelInitialFund(): void {
            this._labelInitialFund.text = "" + McrModel.getCreateWarInitialFund();
        }

        private _updateLabelIncomeMultiplier(): void {
            this._labelIncomeMultiplier.text = `${McrModel.getCreateWarIncomeMultiplier()}%`;
        }

        private _updateLabelInitialEnergy(): void {
            this._labelInitialEnergy.text = `${McrModel.getCreateWarInitialEnergy()}%`;
        }

        private _updateLabelEnergyGrowthMultiplier(): void {
            this._labelEnergyGrowthMultiplier.text = `${McrModel.getCreateWarEnergyGrowthMultiplier()}%`;
        }

        private _updateLabelLuckLowerLimit(): void {
            this._labelLuckLowerLimit.text = `${McrModel.getCreateWarLuckLowerLimit()}%`;
        }

        private _updateLabelLuckUpperLimit(): void {
            this._labelLuckUpperLimit.text = `${McrModel.getCreateWarLuckUpperLimit()}%`;
        }

        private _updateLabelMapName(): void {
            WarMapModel.getMapNameInLanguage(this._mapExtraData.mapFileName).then(v =>
                this._labelMapName.text = `${v} (${this._mapExtraData.playersCount}P)`
            );
        }

        private _updateLabelMoveRange(): void {
            const modifier              = McrModel.getCreateWarMoveRangeModifier();
            this._labelMoveRange.text   = modifier <= 0
                ? "" + modifier
                : "+" + modifier;
        }

        private _updateLabelAttackPower(): void {
            const modifier              = McrModel.getCreateWarAttackPowerModifier();
            this._labelAttackPower.text = modifier <= 0
                ? `${modifier}%`
                : `+${modifier}%`;
        }

        private _updateLabelVisionRange(): void {
            const modifier              = McrModel.getCreateWarVisionRangeModifier();
            this._labelVisionRange.text = modifier <= 0
                ? "" + modifier
                : "+" + modifier;
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
