
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Lang         = Utility.Lang;
    import WarMapModel  = WarMap.WarMapModel;

    export class McrJoinAdvancedSettingsPage extends GameUi.UiTabPage {
        private _labelMapNameTitle      : GameUi.UiLabel;
        private _labelMapName           : GameUi.UiLabel;
        private _labelPlayersCountTitle : GameUi.UiLabel;
        private _labelPlayersCount      : GameUi.UiLabel;
        private _labelTips              : GameUi.UiLabel;

        private _labelInitialFundTitle      : GameUi.UiLabel;
        private _labelInitialFund           : GameUi.UiLabel;

        private _labelIncomeModifierTitle   : GameUi.UiLabel;
        private _labelIncomeModifier        : GameUi.UiLabel;

        private _labelInitialEnergyTitle    : GameUi.UiLabel;
        private _labelInitialEnergy         : GameUi.UiLabel;

        private _labelEnergyModifierTitle   : GameUi.UiLabel;
        private _labelEnergyModifier        : GameUi.UiLabel;

        private _labelLuckLowerLimitTitle   : GameUi.UiLabel;
        private _labelLuckLowerLimit        : GameUi.UiLabel;

        private _labelLuckUpperLimitTitle   : GameUi.UiLabel;
        private _labelLuckUpperLimit        : GameUi.UiLabel;

        private _labelMoveRangeTitle: GameUi.UiLabel;
        private _labelMoveRange     : GameUi.UiLabel;

        private _labelAttackTitle   : GameUi.UiLabel;
        private _labelAttack        : GameUi.UiLabel;

        private _labelVisionTitle   : GameUi.UiLabel;
        private _labelVision        : GameUi.UiLabel;

        protected _mapExtraData: ProtoTypes.IMapExtraData;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinAdvancedSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._mapExtraData = await McrModel.getJoinWarMapExtraData();

            this._updateComponentsForLanguage();
            this._updateLabelMapName();
            this._updateLabelPlayersCount();
            this._updateLabelInitialFund();
            this._updateLabelIncomeModifier();
            this._updateLabelInitialEnergy();
            this._updateLabelEnergyModifier();
            this._updateLabelLuckLowerLimit();
            this._updateLabelLuckUpperLimit();
            this._updateLabelMoveRange();
            this._updateLabelAttack();
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
            this._labelIncomeModifierTitle.text         = `${Lang.getText(Lang.Type.B0179)}: `;
            this._labelInitialEnergyTitle.text          = `${Lang.getText(Lang.Type.B0180)}: `;
            this._labelEnergyModifierTitle.text         = `${Lang.getText(Lang.Type.B0181)}: `;
            this._labelMoveRangeTitle.text              = `${Lang.getText(Lang.Type.B0182)}: `;
            this._labelAttackTitle.text                 = `${Lang.getText(Lang.Type.B0183)}: `;
            this._labelVisionTitle.text                 = `${Lang.getText(Lang.Type.B0184)}: `;
            this._labelLuckLowerLimitTitle.text         = `${Lang.getText(Lang.Type.B0189)}: `;
            this._labelLuckUpperLimitTitle.text         = `${Lang.getText(Lang.Type.B0190)}: `;
        }

        private _updateLabelInitialFund(): void {
            this._labelInitialFund.text = "" + McrModel.getJoinWarRoomInfo().initialFund;
        }

        private _updateLabelIncomeModifier(): void {
            this._labelIncomeModifier.text = "" + McrModel.getJoinWarRoomInfo().incomeModifier + "%";
        }

        private _updateLabelInitialEnergy(): void {
            this._labelInitialEnergy.text = "" + McrModel.getJoinWarRoomInfo().initialEnergy + "%";
        }

        private _updateLabelEnergyModifier(): void {
            this._labelEnergyModifier.text = "" + McrModel.getJoinWarRoomInfo().energyGrowthModifier + "%";
        }

        private _updateLabelLuckLowerLimit(): void {
            this._labelLuckLowerLimit.text = "" + McrModel.getJoinWarRoomInfo().luckLowerLimit + "%";
        }

        private _updateLabelLuckUpperLimit(): void {
            this._labelLuckUpperLimit.text = "" + McrModel.getJoinWarRoomInfo().luckUpperLimit + "%";
        }

        private _updateLabelMapName(): void {
            WarMapModel.getMapNameInLanguage(this._mapExtraData.mapFileName).then(v => this._labelMapName.text = v);
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapExtraData.playersCount;
        }

        private _updateLabelMoveRange(): void {
            const modifier = McrModel.getJoinWarRoomInfo().moveRangeModifier;
            if (modifier <= 0) {
                this._labelMoveRange.text = "" + modifier;
            } else {
                this._labelMoveRange.text = "+" + modifier;
            }
        }

        private _updateLabelAttack(): void {
            const modifier = McrModel.getJoinWarRoomInfo().attackPowerModifier;
            if (modifier <= 0) {
                this._labelAttack.text = "" + modifier;
            } else {
                this._labelAttack.text = "+" + modifier;
            }
        }

        private _updateLabelVision(): void {
            const modifier = McrModel.getJoinWarRoomInfo().visionRangeModifier;
            if (modifier <= 0) {
                this._labelVision.text = "" + modifier;
            } else {
                this._labelVision.text = "+" + modifier;
            }
        }
    }
}
