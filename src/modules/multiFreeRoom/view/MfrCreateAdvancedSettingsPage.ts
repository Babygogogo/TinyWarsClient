
// import TwnsCommonHelpPanel      from "../../common/view/CommonHelpPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import TwnsNotifyType           from "../../tools/notify/NotifyType";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
// import WarRuleHelpers           from "../../tools/warHelpers/WarRuleHelpers";
// import MfrCreateModel           from "../model/MfrCreateModel";

namespace TwnsMfrCreateAdvancedSettingsPage {
    import CommonHelpPanel  = TwnsCommonHelpPanel.CommonHelpPanel;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import PlayerRuleType   = Types.PlayerRuleType;

    export class MfrCreateAdvancedSettingsPage extends TwnsUiTabPage.UiTabPage<void> {
        private readonly _scroller!     : eui.Scroller;
        private readonly _listSetting!  : TwnsUiScrollList.UiScrollList<DataForSettingRenderer>;
        private readonly _listPlayer!   : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrCreateAdvancedSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMfrGetRoomInfo,  callback: this._onNotifyMsgMfrGetRoomInfo },
            ]);
            this._listSetting.setItemRenderer(SettingRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._updateComponentsForLanguage();
            this._initListSetting();
            this._updateListPlayer();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMfrGetRoomInfo(): void {
            this._updateListPlayer();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            // nothing to do
        }

        private _initListSetting(): void {
            this._listSetting.bindData([
                { playerRuleType: PlayerRuleType.TeamIndex },
                { playerRuleType: PlayerRuleType.BannedCoIdArray },
                { playerRuleType: PlayerRuleType.InitialFund },
                { playerRuleType: PlayerRuleType.IncomeMultiplier },
                { playerRuleType: PlayerRuleType.EnergyAddPctOnLoadCo },
                { playerRuleType: PlayerRuleType.EnergyGrowthMultiplier },
                { playerRuleType: PlayerRuleType.MoveRangeModifier },
                { playerRuleType: PlayerRuleType.AttackPowerModifier },
                { playerRuleType: PlayerRuleType.VisionRangeModifier },
                { playerRuleType: PlayerRuleType.LuckLowerLimit },
                { playerRuleType: PlayerRuleType.LuckUpperLimit },
            ]);
        }

        private async _updateListPlayer(): Promise<void> {
            const warData       = MfrCreateModel.getInitialWarData();
            const playersCount  = warData ? warData.settingsForCommon?.warRule?.ruleForPlayers?.playerRuleDataArray?.length : null;
            const listPlayer    = this._listPlayer;
            if (playersCount == null) {
                listPlayer.clear();
            } else {
                const dataList: DataForPlayerRenderer[] = [];
                for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                    dataList.push({ playerIndex });
                }
                listPlayer.bindData(dataList);
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // SettingRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForSettingRenderer = {
        playerRuleType  : PlayerRuleType;
    };
    class SettingRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSettingRenderer> {
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _btnHelp!      : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            ]);
        }

        protected _onDataChanged(): void {
            const data = this.data;
            if (data) {
                const playerRuleType    = data.playerRuleType;
                this._labelName.text    = Lang.getPlayerRuleName(playerRuleType) ?? CommonConstants.ErrorTextForUndefined;
                this._btnHelp.visible   = playerRuleType === PlayerRuleType.BannedCoIdArray;
            }
        }

        private _onTouchedBtnHelp(): void {
            const data              = this.data;
            const playerRuleType    = data ? data.playerRuleType : null;
            if (playerRuleType === PlayerRuleType.BannedCoIdArray) {
                TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonHelpPanel, {
                    title   : `CO`,
                    content : Lang.getText(LangTextType.R0004),
                });
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // PlayerRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForPlayerRenderer = {
        playerIndex : number;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private readonly _labelPlayerIndex! : TwnsUiLabel.UiLabel;
        private readonly _listInfo!         : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        protected _onOpened(): void {
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            const data                  = this._getData();
            this._labelPlayerIndex.text = `P${data.playerIndex}`;
            this._listInfo.bindData(this._createDataForListInfo());
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this._getData();
            const playerIndex   = data.playerIndex;
            return [
                { playerIndex, playerRuleType: PlayerRuleType.TeamIndex },
                { playerIndex, playerRuleType: PlayerRuleType.BannedCoIdArray },
                { playerIndex, playerRuleType: PlayerRuleType.InitialFund },
                { playerIndex, playerRuleType: PlayerRuleType.IncomeMultiplier },
                { playerIndex, playerRuleType: PlayerRuleType.EnergyAddPctOnLoadCo },
                { playerIndex, playerRuleType: PlayerRuleType.EnergyGrowthMultiplier },
                { playerIndex, playerRuleType: PlayerRuleType.MoveRangeModifier },
                { playerIndex, playerRuleType: PlayerRuleType.AttackPowerModifier },
                { playerIndex, playerRuleType: PlayerRuleType.VisionRangeModifier },
                { playerIndex, playerRuleType: PlayerRuleType.LuckLowerLimit },
                { playerIndex, playerRuleType: PlayerRuleType.LuckUpperLimit },
            ];
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // InfoRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForInfoRenderer = {
        playerIndex     : number;
        playerRuleType  : PlayerRuleType;
        infoText?       : string;
        infoColor?      : number;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _labelValue!   : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._updateComponentsForValue();
        }

        private _updateComponentsForValue(): void {
            const data = this.data;
            if (data) {
                const playerIndex = data.playerIndex;
                switch (data.playerRuleType) {
                    case PlayerRuleType.TeamIndex               : this._updateComponentsForValueAsTeamIndex(playerIndex);               return;
                    case PlayerRuleType.BannedCoIdArray         : this._updateComponentsForValueAsBannedCoIdArray(playerIndex);         return;
                    case PlayerRuleType.InitialFund             : this._updateComponentsForValueAsInitialFund(playerIndex);             return;
                    case PlayerRuleType.IncomeMultiplier        : this._updateComponentsForValueAsIncomeMultiplier(playerIndex);        return;
                    case PlayerRuleType.EnergyAddPctOnLoadCo    : this._updateComponentsForValueAsEnergyAddPctOnLoadCo(playerIndex);    return;
                    case PlayerRuleType.EnergyGrowthMultiplier  : this._updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex);  return;
                    case PlayerRuleType.MoveRangeModifier       : this._updateComponentsForValueAsMoveRangeModifier(playerIndex);       return;
                    case PlayerRuleType.AttackPowerModifier     : this._updateComponentsForValueAsAttackPowerModifier(playerIndex);     return;
                    case PlayerRuleType.VisionRangeModifier     : this._updateComponentsForValueAsVisionRangeModifier(playerIndex);     return;
                    case PlayerRuleType.LuckLowerLimit          : this._updateComponentsForValueAsLuckLowerLimit(playerIndex);          return;
                    case PlayerRuleType.LuckUpperLimit          : this._updateComponentsForValueAsLuckUpperLimit(playerIndex);          return;
                    default                                     : return;
                }
            }
        }
        private async _updateComponentsForValueAsTeamIndex(playerIndex: number): Promise<void> {
            const warData           = MfrCreateModel.getInitialWarData();
            const teamIndex         = warData ? WarRuleHelpers.getTeamIndex(Helpers.getExisted(warData.settingsForCommon?.warRule), playerIndex) : null;
            const labelValue        = this._labelValue;
            labelValue.text         = teamIndex == null ? `` : Lang.getPlayerTeamName(teamIndex) ?? CommonConstants.ErrorTextForUndefined;
            labelValue.textColor    = 0xFFFFFF;
        }
        private async _updateComponentsForValueAsBannedCoIdArray(playerIndex: number): Promise<void> {
            const warData           = MfrCreateModel.getInitialWarData();
            const currValue         = warData ? (WarRuleHelpers.getBannedCoIdArray(Helpers.getExisted(warData.settingsForCommon?.warRule), playerIndex) || []).length : 0;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
        }
        private async _updateComponentsForValueAsInitialFund(playerIndex: number): Promise<void> {
            const warData           = MfrCreateModel.getInitialWarData();
            const currValue         = warData ? WarRuleHelpers.getInitialFund(Helpers.getExisted(warData.settingsForCommon?.warRule), playerIndex) : null;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? `` : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault);
        }
        private async _updateComponentsForValueAsIncomeMultiplier(playerIndex: number): Promise<void> {
            const warData           = MfrCreateModel.getInitialWarData();
            const currValue         = warData ? WarRuleHelpers.getIncomeMultiplier(Helpers.getExisted(warData.settingsForCommon?.warRule), playerIndex): null;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? `` : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault);
        }
        private async _updateComponentsForValueAsEnergyAddPctOnLoadCo(playerIndex: number): Promise<void> {
            const warData           = MfrCreateModel.getInitialWarData();
            const currValue         = warData ? WarRuleHelpers.getEnergyAddPctOnLoadCo(Helpers.getExisted(warData.settingsForCommon?.warRule), playerIndex) : null;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? `` : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault);
        }
        private async _updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex: number): Promise<void> {
            const warData           = MfrCreateModel.getInitialWarData();
            const currValue         = warData ? WarRuleHelpers.getEnergyGrowthMultiplier(Helpers.getExisted(warData.settingsForCommon?.warRule), playerIndex) : null;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? `` : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault);
        }
        private async _updateComponentsForValueAsMoveRangeModifier(playerIndex: number): Promise<void> {
            const warData           = MfrCreateModel.getInitialWarData();
            const currValue         = warData ? WarRuleHelpers.getMoveRangeModifier(Helpers.getExisted(warData.settingsForCommon?.warRule), playerIndex) : null;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? `` : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault);
        }
        private async _updateComponentsForValueAsAttackPowerModifier(playerIndex: number): Promise<void> {
            const warData           = MfrCreateModel.getInitialWarData();
            const currValue         = warData ? WarRuleHelpers.getAttackPowerModifier(Helpers.getExisted(warData.settingsForCommon?.warRule), playerIndex) : null;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? `` : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault);
        }
        private async _updateComponentsForValueAsVisionRangeModifier(playerIndex: number): Promise<void> {
            const warData           = MfrCreateModel.getInitialWarData();
            const currValue         = warData ? WarRuleHelpers.getVisionRangeModifier(Helpers.getExisted(warData.settingsForCommon?.warRule), playerIndex): null;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? `` : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault);
        }
        private async _updateComponentsForValueAsLuckLowerLimit(playerIndex: number): Promise<void> {
            const warData           = MfrCreateModel.getInitialWarData();
            const currValue         = warData ? WarRuleHelpers.getLuckLowerLimit(Helpers.getExisted(warData.settingsForCommon?.warRule), playerIndex) : null;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? `` : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit);
        }
        private async _updateComponentsForValueAsLuckUpperLimit(playerIndex: number): Promise<void> {
            const warData           = MfrCreateModel.getInitialWarData();
            const currValue         = warData ? WarRuleHelpers.getLuckUpperLimit(Helpers.getExisted(warData.settingsForCommon?.warRule), playerIndex) : null;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? `` : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit);
        }
    }

    function getTextColor(value: number | null, defaultValue: number): number {
        if (value == null) {
            return 0xFFFFFF;
        } else {
            if (value > defaultValue) {
                return 0x00FF00;
            } else if (value < defaultValue) {
                return 0xFF0000;
            } else {
                return 0xFFFFFF;
            }
        }
    }
}

// export default TwnsMfrCreateAdvancedSettingsPage;
