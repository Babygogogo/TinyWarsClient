
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes = Utility.ProtoTypes;

    export class McrJoinAdvancedSettingsPage extends GameUi.UiTabPage {
        private _labelMapName       : GameUi.UiLabel;
        private _labelPlayersCount  : GameUi.UiLabel;

        private _labelInitialFund   : GameUi.UiLabel;
        private _labelIncomeModifier: GameUi.UiLabel;
        private _labelInitialEnergy : GameUi.UiLabel;
        private _labelEnergyModifier: GameUi.UiLabel;

        private _labelMoveRange : GameUi.UiLabel;
        private _labelAttack    : GameUi.UiLabel;
        private _labelVision    : GameUi.UiLabel;

        protected _mapInfo: ProtoTypes.IMapDynamicInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinAdvancedSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._mapInfo = McrModel.getJoinWarMapInfo();

            this._updateLabelMapName();
            this._updateLabelPlayersCount();
            this._updateLabelInitialFund();
            this._updateLabelIncomeModifier();
            this._updateLabelInitialEnergy();
            this._updateLabelEnergyModifier();
            this._updateLabelMoveRange();
            this._updateLabelAttack();
            this._updateLabelVision();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
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

        private _updateLabelMapName(): void {
            this._labelMapName.text = this._mapInfo.mapName;
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapInfo.playersCount;
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
