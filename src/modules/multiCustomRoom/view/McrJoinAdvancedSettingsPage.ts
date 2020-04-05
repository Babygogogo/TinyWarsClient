
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export class McrJoinAdvancedSettingsPage extends GameUi.UiTabPage {
        private _labelTips                      : GameUi.UiLabel;
        private _btnMapNameTitle                : GameUi.UiButton;
        private _labelMapName                   : GameUi.UiLabel;
        private _btnInitialFund                 : GameUi.UiButton;
        private _labelInitialFund               : GameUi.UiLabel;
        private _btnIncomeModifierTitle         : GameUi.UiButton;
        private _labelIncomeModifier            : GameUi.UiLabel;
        private _btnEnergyGrowthModifierTitle   : GameUi.UiButton;
        private _labelEnergyGrowthModifier      : GameUi.UiLabel;
        private _btnInitialEnergyTitle          : GameUi.UiButton;
        private _labelInitialEnergy             : GameUi.UiLabel;
        private _btnMoveRangeModifierTitle      : GameUi.UiButton;
        private _labelMoveRangeModifier         : GameUi.UiLabel;
        private _btnAttackPowerModifierTitle    : GameUi.UiButton;
        private _labelAttackPowerModifier       : GameUi.UiLabel;
        private _btnVisionRangeModifierTitle    : GameUi.UiButton;
        private _labelVisionRangeModifier       : GameUi.UiLabel;
        private _btnLuckLowerLimitTitle         : GameUi.UiButton;
        private _labelLuckLowerLimit            : GameUi.UiLabel;
        private _btnLuckUpperLimitTitle         : GameUi.UiButton;
        private _labelLuckUpperLimit            : GameUi.UiLabel;
        private _btnBuildings                   : GameUi.UiButton;

        protected _mapExtraData: ProtoTypes.IMapExtraData;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinAdvancedSettingsPage.exml";
        }

        public _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBuildings,   callback: this._onTouchedBtnBuildings },
            ];
        }

        protected async _onOpened(): Promise<void> {
            this._mapExtraData = await McrModel.getJoinWarMapExtraData();

            this._updateComponentsForLanguage();
            this._updateLabelMapName();
            this._updateLabelInitialFund();
            this._updateLabelIncomeModifier();
            this._updateLabelInitialEnergy();
            this._updateLabelEnergyGrowthModifier();
            this._updateLabelLuckLowerLimit();
            this._updateLabelLuckUpperLimit();
            this._updateLabelMoveRangeModifier();
            this._updateLabelAttackPowerModifier();
            this._updateLabelVisionRangeModifier();
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const info = McrModel.getJoinWarRoomInfo();
            McrBuildingListPanel.show({
                configVersion   : info.configVersion,
                mapRawData      : await WarMapModel.getMapRawData(info.mapFileName) as Types.MapRawData,
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelTips.text                        = Lang.getText(Lang.Type.A0065);
            this._btnMapNameTitle.label                 = Lang.getText(Lang.Type.B0225);
            this._btnInitialFund.label                  = Lang.getText(Lang.Type.B0178);
            this._btnIncomeModifierTitle.label          = Lang.getText(Lang.Type.B0179);
            this._btnInitialEnergyTitle.label           = Lang.getText(Lang.Type.B0180);
            this._btnEnergyGrowthModifierTitle.label    = Lang.getText(Lang.Type.B0181);
            this._btnMoveRangeModifierTitle.label       = Lang.getText(Lang.Type.B0182);
            this._btnAttackPowerModifierTitle.label     = Lang.getText(Lang.Type.B0183);
            this._btnVisionRangeModifierTitle.label     = Lang.getText(Lang.Type.B0184);
            this._btnLuckLowerLimitTitle.label          = Lang.getText(Lang.Type.B0189);
            this._btnLuckUpperLimitTitle.label          = Lang.getText(Lang.Type.B0190);
            this._btnBuildings.label                    = Lang.getText(Lang.Type.B0333);
        }

        private _updateLabelInitialFund(): void {
            const initialFund                   = McrModel.getJoinWarRoomInfo().initialFund;
            this._labelInitialFund.text         = `${initialFund}`;
            this._labelInitialFund.textColor    = getTextColor(initialFund, CommonConstants.WarRuleInitialFundDefault);
        }

        private _updateLabelIncomeModifier(): void {
            const incomeModifier                = McrModel.getJoinWarRoomInfo().incomeModifier;
            this._labelIncomeModifier.text      = `${incomeModifier}%`;
            this._labelIncomeModifier.textColor = getTextColor(incomeModifier, CommonConstants.WarRuleIncomeMultiplierDefault);
        }

        private _updateLabelInitialEnergy(): void {
            const initialEnergy                 = McrModel.getJoinWarRoomInfo().initialEnergy;
            this._labelInitialEnergy.text       = `${initialEnergy}%`;
            this._labelInitialEnergy.textColor  = getTextColor(initialEnergy, CommonConstants.WarRuleInitialEnergyDefault);
        }

        private _updateLabelEnergyGrowthModifier(): void {
            const energyGrowthModifier                  = McrModel.getJoinWarRoomInfo().energyGrowthModifier;
            this._labelEnergyGrowthModifier.text        = `${energyGrowthModifier}%`;
            this._labelEnergyGrowthModifier.textColor   = getTextColor(energyGrowthModifier, CommonConstants.WarRuleEnergyGrowthMultiplierDefault);
        }

        private _updateLabelLuckLowerLimit(): void {
            const luckLowerLimit                = McrModel.getJoinWarRoomInfo().luckLowerLimit;
            this._labelLuckLowerLimit.text      = `${luckLowerLimit}%`;
            this._labelLuckLowerLimit.textColor = getTextColor(luckLowerLimit, CommonConstants.WarRuleLuckDefaultLowerLimit);
        }

        private _updateLabelLuckUpperLimit(): void {
            const luckUpperLimit                = McrModel.getJoinWarRoomInfo().luckUpperLimit;
            this._labelLuckUpperLimit.text      = `${luckUpperLimit}%`;
            this._labelLuckUpperLimit.textColor = getTextColor(luckUpperLimit, CommonConstants.WarRuleLuckDefaultUpperLimit);
        }

        private async _updateLabelMapName(): Promise<void> {
            const mapFileName       = this._mapExtraData.mapFileName;
            this._labelMapName.text = `${await WarMapModel.getMapNameInLanguage(mapFileName) || "----"} (${Lang.getText(Lang.Type.B0163)}: ${await WarMapModel.getMapDesigner(mapFileName) || "----"})`;
        }

        private _updateLabelMoveRangeModifier(): void {
            const moveRangeModifier                 = McrModel.getJoinWarRoomInfo().moveRangeModifier;
            this._labelMoveRangeModifier.text       = `${moveRangeModifier}`;
            this._labelMoveRangeModifier.textColor  = getTextColor(moveRangeModifier, CommonConstants.WarRuleMoveRangeModifierDefault);
        }

        private _updateLabelAttackPowerModifier(): void {
            const attackPowerModifier                   = McrModel.getJoinWarRoomInfo().attackPowerModifier;
            this._labelAttackPowerModifier.text         = `${attackPowerModifier}%`;
            this._labelAttackPowerModifier.textColor    = getTextColor(attackPowerModifier, CommonConstants.WarRuleOffenseBonusDefault);
        }

        private _updateLabelVisionRangeModifier(): void {
            const visionRangeModifier                   = McrModel.getJoinWarRoomInfo().visionRangeModifier;
            this._labelVisionRangeModifier.text         = `${visionRangeModifier}`;
            this._labelVisionRangeModifier.textColor    = getTextColor(visionRangeModifier, CommonConstants.WarRuleVisionRangeModifierDefault);
        }
    }

    function getTextColor(value: number, defaultValue: number): number {
        if (value > defaultValue) {
            return 0x00FF00;
        } else if (value < defaultValue) {
            return 0xFF0000;
        } else {
            return 0xFFFFFF;
        }
    }
}
