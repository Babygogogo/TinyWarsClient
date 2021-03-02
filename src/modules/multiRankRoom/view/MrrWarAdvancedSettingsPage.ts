
namespace TinyWars.MultiRankRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import Notify           = Utility.Notify;
    import WarMapModel      = WarMap.WarMapModel;
    import BwSettingsHelper = BaseWar.BwWarRuleHelper;
    import IMpwWarInfo      = ProtoTypes.MultiPlayerWar.IMpwWarInfo;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export type OpenDataForWarAdvancedSettingsPage = {
        warInfo : IMpwWarInfo;
    }

    export class MrrWarAdvancedSettingsPage extends GameUi.UiTabPage {
        private _btnMapNameTitle    : TinyWars.GameUi.UiButton;
        private _labelMapName       : TinyWars.GameUi.UiLabel;
        private _btnBuildings       : TinyWars.GameUi.UiButton;
        private _labelPlayerList    : TinyWars.GameUi.UiLabel;
        private _listPlayer         : TinyWars.GameUi.UiScrollList;

        private _warInfo        : IMpwWarInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrWarAdvancedSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnBuildings,   callback: this._onTouchedBtnBuildings },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._warInfo = this._getOpenData<OpenDataForWarAdvancedSettingsPage>().warInfo;

            this._updateComponentsForLanguage();
        }

        protected _onClosed(): void {
            this._listPlayer.clear();
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const warInfo = this._warInfo;
            if (warInfo) {
                WarMap.WarMapBuildingListPanel.show({
                    configVersion   : warInfo.settingsForCommon.configVersion,
                    mapRawData      : await WarMapModel.getRawData(warInfo.settingsForMrw.mapId),
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelPlayerList.text  = Lang.getText(Lang.Type.B0395);
            this._btnMapNameTitle.label = Lang.getText(Lang.Type.B0225);
            this._btnBuildings.label    = Lang.getText(Lang.Type.B0333);
            this._updateLabelMapName();
            this._updateListPlayer();
        }

        private _updateListPlayer(): void {
            const warInfo = this._warInfo;
            if (warInfo) {
                const playersCount  = BwSettingsHelper.getPlayersCount(warInfo.settingsForCommon.warRule);
                const dataList      : DataForPlayerRenderer[] = [];
                for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                    dataList.push({
                        playerIndex,
                        warInfo: warInfo,
                    });
                }
                this._listPlayer.bindData(dataList);
            }
        }

        private async _updateLabelMapName(): Promise<void> {
            const warInfo = this._warInfo;
            if (warInfo) {
                const mapId             = warInfo.settingsForMrw.mapId;
                this._labelMapName.text = `${await WarMapModel.getMapNameInCurrentLanguage(mapId) || "----"} (${Lang.getText(Lang.Type.B0163)}: ${await WarMapModel.getDesignerName(mapId) || "----"})`;
            }
        }
    }

    type DataForPlayerRenderer = {
        playerIndex : number;
        warInfo     : IMpwWarInfo;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer {
        private _listInfo   : GameUi.UiScrollList;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected dataChanged(): void {
            super.dataChanged();

            this._updateView();
        }

        private _updateView(): void {
            this._listInfo.bindData(this._createDataForListInfo());
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this.data as DataForPlayerRenderer;
            const playerIndex   = data.playerIndex;
            const warInfo       = data.warInfo;
            return [
                this._createDataPlayerIndex(warInfo, playerIndex),
                this._createDataInitialFund(warInfo, playerIndex),
                this._createDataIncomeMultiplier(warInfo, playerIndex),
                this._createDataInitialEnergyPercentage(warInfo, playerIndex),
                this._createDataEnergyGrowthMultiplier(warInfo, playerIndex),
                this._createDataMoveRangeModifier(warInfo, playerIndex),
                this._createDataAttackPowerModifier(warInfo, playerIndex),
                this._createDataVisionRangeModifier(warInfo, playerIndex),
                this._createDataLuckLowerLimit(warInfo, playerIndex),
                this._createDataLuckUpperLimit(warInfo, playerIndex),
            ];
        }
        private _createDataPlayerIndex(warInfo: IMpwWarInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule = BwSettingsHelper.getPlayerRule(warInfo.settingsForCommon.warRule, playerIndex);
            return {
                titleText   : Lang.getText(Lang.Type.B0018),
                infoText    : `${Lang.getPlayerForceName(playerIndex)} (${Lang.getPlayerTeamName(playerRule.teamIndex)})`,
                infoColor   : 0xFFFFFF,
            };
        }
        private _createDataInitialFund(warInfo: IMpwWarInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(warInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.initialFund;
            return {
                titleText       : Lang.getText(Lang.Type.B0178),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            };
        }
        private _createDataIncomeMultiplier(warInfo: IMpwWarInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(warInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.incomeMultiplier;
            return {
                titleText       : Lang.getText(Lang.Type.B0179),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            };
        }
        private _createDataInitialEnergyPercentage(warInfo: IMpwWarInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(warInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.initialEnergyPercentage;
            return {
                titleText       : Lang.getText(Lang.Type.B0180),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleInitialEnergyPercentageDefault),
            };
        }
        private _createDataEnergyGrowthMultiplier(warInfo: IMpwWarInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(warInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.energyGrowthMultiplier;
            return {
                titleText       : Lang.getText(Lang.Type.B0181),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            };
        }
        private _createDataMoveRangeModifier(warInfo: IMpwWarInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(warInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.moveRangeModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0182),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            };
        }
        private _createDataAttackPowerModifier(warInfo: IMpwWarInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(warInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.attackPowerModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0183),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            };
        }
        private _createDataVisionRangeModifier(warInfo: IMpwWarInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(warInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.visionRangeModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0184),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            };
        }
        private _createDataLuckLowerLimit(warInfo: IMpwWarInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(warInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.luckLowerLimit;
            return {
                titleText       : Lang.getText(Lang.Type.B0189),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            };
        }
        private _createDataLuckUpperLimit(warInfo: IMpwWarInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(warInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.luckUpperLimit;
            return {
                titleText       : Lang.getText(Lang.Type.B0190),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit),
            };
        }
    }

    type DataForInfoRenderer = {
        titleText   : string;
        infoText    : string;
        infoColor   : number;
    }

    class InfoRenderer extends GameUi.UiListItemRenderer {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForInfoRenderer;
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
