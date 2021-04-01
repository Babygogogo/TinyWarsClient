
namespace TinyWars.MultiFreeRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import CommonConstants  = Utility.CommonConstants;
    import Notify           = Utility.Notify;
    import WarMapModel      = WarMap.WarMapModel;

    export class MfrCreateAdvancedSettingsPage extends GameUi.UiTabPage {
        private _labelPlayersCountTitle : GameUi.UiLabel;
        private _labelPlayersCount      : GameUi.UiLabel;
        private _labelPlayerList        : GameUi.UiLabel;
        private _listPlayer             : GameUi.UiScrollList<DataForPlayerRenderer, PlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrCreateAdvancedSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();
            this._updateLabelPlayersCount();
            this._updateListPlayer();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelPlayersCountTitle.text   = `${Lang.getText(Lang.Type.B0229)}:`;
            this._labelPlayerList.text          = Lang.getText(Lang.Type.B0395);
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = `${MfrModel.Create.getInitialWarData().playerManager.players.length - 1}`;
        }

        private _updateListPlayer(): void {
            const playersCount  = MfrModel.Create.getInitialWarData().playerManager.players.length - 1;
            const dataArray     : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                dataArray.push({ playerIndex });
            }
            this._listPlayer.bindData(dataArray);
        }
    }

    type DataForPlayerRenderer = {
        playerIndex : number;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private _listInfo   : GameUi.UiScrollList<DataForInfoRenderer, InfoRenderer>;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _updateView(): void {
            this._listInfo.visible  = true;
            this._listInfo.bindData(this._createDataForListInfo());
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this.data;
            const playerIndex   = data.playerIndex;
            return [
                this._createDataTeamIndex(playerIndex),
                this._createDataAvailableCoIdList(playerIndex),
                this._createDataInitialFund(playerIndex),
                this._createDataIncomeMultiplier(playerIndex),
                this._createDataInitialEnergyPercentage(playerIndex),
                this._createDataEnergyGrowthMultiplier(playerIndex),
                this._createDataMoveRangeModifier(playerIndex),
                this._createDataAttackPowerModifier(playerIndex),
                this._createDataVisionRangeModifier(playerIndex),
                this._createDataLuckLowerLimit(playerIndex),
                this._createDataLuckUpperLimit(playerIndex),
            ];
        }
        private _createDataTeamIndex(playerIndex: number): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(Lang.Type.B0019),
                infoText                : Lang.getPlayerTeamName(MfrModel.Create.getTeamIndex(playerIndex)),
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataAvailableCoIdList(playerIndex: number): DataForInfoRenderer {
            return {
                titleText               : Lang.getText(Lang.Type.B0403),
                infoText                : `${MfrModel.Create.getAvailableCoIdList(playerIndex).length}`,
                infoColor               : 0xFFFFFF,
            };
        }
        private _createDataInitialFund(playerIndex: number): DataForInfoRenderer {
            const currValue = MfrModel.Create.getInitialFund(playerIndex);
            return {
                titleText               : Lang.getText(Lang.Type.B0178),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            };
        }
        private _createDataIncomeMultiplier(playerIndex: number): DataForInfoRenderer {
            const currValue = MfrModel.Create.getIncomeMultiplier(playerIndex);
            const maxValue  = CommonConstants.WarRuleIncomeMultiplierMaxLimit;
            const minValue  = CommonConstants.WarRuleIncomeMultiplierMinLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0179),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            };
        }
        private _createDataInitialEnergyPercentage(playerIndex: number): DataForInfoRenderer {
            const currValue     = MfrModel.Create.getInitialEnergyPercentage(playerIndex);
            const minValue      = CommonConstants.WarRuleInitialEnergyPercentageMinLimit;
            const maxValue      = CommonConstants.WarRuleInitialEnergyPercentageMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0180),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleInitialEnergyPercentageDefault),
            };
        }
        private _createDataEnergyGrowthMultiplier(playerIndex: number): DataForInfoRenderer {
            const currValue     = MfrModel.Create.getEnergyGrowthMultiplier(playerIndex);
            const minValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMinLimit;
            const maxValue      = CommonConstants.WarRuleEnergyGrowthMultiplierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0181),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            };
        }
        private _createDataMoveRangeModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = MfrModel.Create.getMoveRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleMoveRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleMoveRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0182),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            };
        }
        private _createDataAttackPowerModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = MfrModel.Create.getAttackPowerModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleOffenseBonusMinLimit;
            const maxValue      = CommonConstants.WarRuleOffenseBonusMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0183),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            };
        }
        private _createDataVisionRangeModifier(playerIndex: number): DataForInfoRenderer {
            const currValue     = MfrModel.Create.getVisionRangeModifier(playerIndex);
            const minValue      = CommonConstants.WarRuleVisionRangeModifierMinLimit;
            const maxValue      = CommonConstants.WarRuleVisionRangeModifierMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0184),
                infoText                : `${currValue}`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            };
        }
        private _createDataLuckLowerLimit(playerIndex: number): DataForInfoRenderer {
            const currValue     = MfrModel.Create.getLuckLowerLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0189),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            };
        }
        private _createDataLuckUpperLimit(playerIndex: number): DataForInfoRenderer {
            const currValue     = MfrModel.Create.getLuckUpperLimit(playerIndex);
            const minValue      = CommonConstants.WarRuleLuckMinLimit;
            const maxValue      = CommonConstants.WarRuleLuckMaxLimit;
            return {
                titleText               : Lang.getText(Lang.Type.B0190),
                infoText                : `${currValue}%`,
                infoColor               : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
            };
        }
    }

    type DataForInfoRenderer = {
        titleText               : string;
        infoText                : string;
        infoColor               : number;
    }

    class InfoRenderer extends GameUi.UiListItemRenderer<DataForInfoRenderer> {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data;
            this._labelValue.text       = data.infoText;
            this._labelValue.textColor  = data.infoColor;
            this._btnTitle.label        = data.titleText;
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
