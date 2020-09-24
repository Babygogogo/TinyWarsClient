
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonConstants  = Utility.ConfigManager.COMMON_CONSTANTS;

    export class McrJoinAdvancedSettingsPage extends GameUi.UiTabPage {
        private _labelTips          : GameUi.UiLabel;
        private _btnMapNameTitle    : GameUi.UiButton;
        private _labelMapName       : GameUi.UiLabel;
        private _listInfo           : GameUi.UiScrollList;
        private _btnBuildings       : GameUi.UiButton;

        private _mapRawData : ProtoTypes.Map.IMapRawData;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinAdvancedSettingsPage.exml";
        }

        public _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBuildings,   callback: this._onTouchedBtnBuildings },
            ];
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected async _onOpened(): Promise<void> {
            this._mapRawData = await McrModel.getJoinWarMapExtraData();

            this._updateComponentsForLanguage();
        }

        protected _onClosed(): void {
            this._listInfo.clear();
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const settingsForCommon = McrModel.getJoinWarRoomInfo().settingsForCommon;
            McrBuildingListPanel.show({
                configVersion   : settingsForCommon.configVersion,
                mapRawData      : await WarMapModel.getRawData(settingsForCommon.mapId),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelTips.text        = Lang.getText(Lang.Type.A0065);
            this._btnMapNameTitle.label = Lang.getText(Lang.Type.B0225);
            this._btnBuildings.label    = Lang.getText(Lang.Type.B0333);
            this._updateLabelMapName();
            this._updateListInfo();
        }

        private _updateListInfo(): void {
            const playerRuleList        = McrModel.getJoinWarRoomInfo().settingsForCommon.warRule.ruleForPlayers;
            const initialFund           = playerRuleList.initialFund;
            const incomeModifier        = playerRuleList.incomeModifier;
            const initialEnergy         = playerRuleList.initialEnergy;
            const energyGrowthModifier  = playerRuleList.energyGrowthModifier;
            const luckLowerLimit        = playerRuleList.luckLowerLimit;
            const luckUpperLimit        = playerRuleList.luckUpperLimit;
            const moveRangeModifier     = playerRuleList.moveRangeModifier;
            const attackPowerModifier   = playerRuleList.attackPowerModifier;
            const visionRangeModifier   = playerRuleList.visionRangeModifier;
            const dataList              : DataForInfoRenderer[] = [
                {
                    titleText   : Lang.getText(Lang.Type.B0178),
                    infoText    : `${initialFund}`,
                    infoColor   : getTextColor(initialFund, CommonConstants.WarRuleInitialFundDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0179),
                    infoText    : `${incomeModifier}`,
                    infoColor   : getTextColor(incomeModifier, CommonConstants.WarRuleIncomeMultiplierDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0180),
                    infoText    : `${initialEnergy}`,
                    infoColor   : getTextColor(initialEnergy, CommonConstants.WarRuleInitialEnergyDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0181),
                    infoText    : `${energyGrowthModifier}%`,
                    infoColor   : getTextColor(energyGrowthModifier, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0182),
                    infoText    : `${moveRangeModifier}`,
                    infoColor   : getTextColor(moveRangeModifier, CommonConstants.WarRuleMoveRangeModifierDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0183),
                    infoText    : `${attackPowerModifier}%`,
                    infoColor   : getTextColor(attackPowerModifier, CommonConstants.WarRuleOffenseBonusDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0184),
                    infoText    : `${visionRangeModifier}`,
                    infoColor   : getTextColor(visionRangeModifier, CommonConstants.WarRuleVisionRangeModifierDefault),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0189),
                    infoText    : `${luckLowerLimit}%`,
                    infoColor   : getTextColor(luckLowerLimit, CommonConstants.WarRuleLuckDefaultLowerLimit),
                },
                {
                    titleText   : Lang.getText(Lang.Type.B0190),
                    infoText    : `${luckUpperLimit}%`,
                    infoColor   : getTextColor(luckUpperLimit, CommonConstants.WarRuleLuckDefaultUpperLimit),
                },
            ];
            this._listInfo.bindData(dataList);
        }

        private async _updateLabelMapName(): Promise<void> {
            const mapId             = this._mapRawData.mapId;
            this._labelMapName.text = `${await WarMapModel.getMapNameInCurrentLanguage(mapId) || "----"} (${Lang.getText(Lang.Type.B0163)}: ${await WarMapModel.getDesignerName(mapId) || "----"})`;
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

    type DataForInfoRenderer = {
        titleText   : string;
        infoText    : string;
        infoColor   : number;
    }

    class InfoRenderer extends eui.ItemRenderer {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForInfoRenderer;
            this._btnTitle.label        = data.titleText;
            this._labelValue.text       = data.infoText;
            this._labelValue.textColor  = data.infoColor;
        }
    }
}
