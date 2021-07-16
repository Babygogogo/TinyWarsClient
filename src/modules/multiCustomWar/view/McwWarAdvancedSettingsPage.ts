
import TwnsCommonHelpPanel      from "../../common/view/CommonHelpPanel";
import MpwModel                 from "../../multiPlayerWar/model/MpwModel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import Logger                   from "../../tools/helpers/Logger";
import Types                    from "../../tools/helpers/Types";
import Lang                     from "../../tools/lang/Lang";
import TwnsLangTextType         from "../../tools/lang/LangTextType";
import TwnsNotifyType           from "../../tools/notify/NotifyType";
import ProtoTypes               from "../../tools/proto/ProtoTypes";
import TwnsUiButton             from "../../tools/ui/UiButton";
import TwnsUiLabel              from "../../tools/ui/UiLabel";
import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
import TwnsUiTabPage            from "../../tools/ui/UiTabPage";
import WarRuleHelpers           from "../../tools/warHelpers/WarRuleHelpers";

namespace TwnsMcwWarAdvancedSettingsPage {
    import CommonHelpPanel  = TwnsCommonHelpPanel.CommonHelpPanel;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import PlayerRuleType   = Types.PlayerRuleType;

    export type OpenDataForMcwWarAdvancedSettingsPage = {
        warId  : number | null | undefined;
    };
    export class McwWarAdvancedSettingsPage extends TwnsUiTabPage.UiTabPage<OpenDataForMcwWarAdvancedSettingsPage> {
        // @ts-ignore
        private readonly _scroller      : eui.Scroller;
        // @ts-ignore
        private readonly _listSetting   : TwnsUiScrollList.UiScrollList<DataForSettingRenderer>;
        // @ts-ignore
        private readonly _listPlayer    : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomWar/McwWarAdvancedSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMpwCommonGetMyWarInfoList,   callback: this._onNotifyMsgMpwCommonGetMyWarInfoList },
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

        private _onNotifyMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
            const data  = e.data as ProtoTypes.NetMessage.MsgMpwCommonGetMyWarInfoList.IS;
            const warId = this._getOpenData().warId;
            if ((warId != null) && ((data.infos || []).find(v => v.warId === warId))) {
                this._updateListPlayer();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            // nothing to do.
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
            const listPlayer    = this._listPlayer;
            const warId         = this._getOpenData().warId;
            if (warId == null) {
                listPlayer.clear();
                return;
            }

            const warInfo               = MpwModel.getMyWarInfo(warId);
            const settingsForCommon     = warInfo ? warInfo.settingsForCommon : null;
            const warRule               = settingsForCommon ? settingsForCommon.warRule : null;
            const playersCountUnneutral = warRule ? WarRuleHelpers.getPlayersCount(warRule) : undefined;
            if (playersCountUnneutral == null) {
                Logger.error(`McwWarAdvancedSettingsPage._updateListPlayer() empty playersCountUnneutral.`);
                listPlayer.clear();
                return;
            }

            const dataArray: DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCountUnneutral; ++playerIndex) {
                dataArray.push({ warId, playerIndex });
            }
            listPlayer.bindData(dataArray);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // SettingRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForSettingRenderer = {
        playerRuleType  : PlayerRuleType;
    };
    class SettingRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForSettingRenderer> {
        // @ts-ignore
        private readonly _labelName : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private readonly _btnHelp   : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            ]);
        }

        protected _onDataChanged(): void {
            const data = this.data;
            if (data) {
                const playerRuleType    = data.playerRuleType;
                this._btnHelp.visible   = playerRuleType === PlayerRuleType.BannedCoIdArray;
                this._labelName.text    = Lang.getPlayerRuleName(playerRuleType) || CommonConstants.ErrorTextForUndefined;
            }
        }

        private _onTouchedBtnHelp(): void {
            const data              = this.data;
            const playerRuleType    = data ? data.playerRuleType : null;
            if (playerRuleType === PlayerRuleType.BannedCoIdArray) {
                CommonHelpPanel.show({
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
        warId      : number;
        playerIndex : number;
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        // @ts-ignore
        private _labelPlayerIndex   : TwnsUiLabel.UiLabel;
        // @ts-ignore
        private _listInfo           : TwnsUiScrollList.UiScrollList<DataForInfoRenderer>;

        protected _onOpened(): void {
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            const data = this.data;
            if (data) {
                this._labelPlayerIndex.text = `P${data.playerIndex}`;
                this._listInfo.bindData(this._createDataForListInfo());
            }
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this.data;
            const warId         = data.warId;
            const playerIndex   = data.playerIndex;
            return [
                { warId, playerIndex, playerRuleType: PlayerRuleType.TeamIndex },
                { warId, playerIndex, playerRuleType: PlayerRuleType.BannedCoIdArray },
                { warId, playerIndex, playerRuleType: PlayerRuleType.InitialFund },
                { warId, playerIndex, playerRuleType: PlayerRuleType.IncomeMultiplier },
                { warId, playerIndex, playerRuleType: PlayerRuleType.EnergyAddPctOnLoadCo },
                { warId, playerIndex, playerRuleType: PlayerRuleType.EnergyGrowthMultiplier },
                { warId, playerIndex, playerRuleType: PlayerRuleType.MoveRangeModifier },
                { warId, playerIndex, playerRuleType: PlayerRuleType.AttackPowerModifier },
                { warId, playerIndex, playerRuleType: PlayerRuleType.VisionRangeModifier },
                { warId, playerIndex, playerRuleType: PlayerRuleType.LuckLowerLimit },
                { warId, playerIndex, playerRuleType: PlayerRuleType.LuckUpperLimit },
            ];
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // InfoRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForInfoRenderer = {
        warId                  : number;
        playerIndex             : number;
        playerRuleType          : PlayerRuleType;
        infoText?               : string;
        infoColor?              : number;
        callbackOnTouchedTitle? : (() => void) | null;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        // @ts-ignore
        private readonly _labelValue    : TwnsUiLabel.UiLabel;

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
            const warRule           = this._getWarRule();
            const teamIndex         = warRule ? WarRuleHelpers.getTeamIndex(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.textColor    = 0xFFFFFF;

            if (teamIndex == null) {
                Logger.error(`McwWarAdvancedSettingsPage.InfoRenderer._updateComponentsForValueAsTeamIndex() empty teamIndex.`);
                labelValue.text = CommonConstants.ErrorTextForUndefined;
            } else {
                const teamName = Lang.getPlayerTeamName(teamIndex);
                if (teamName == null) {
                    Logger.error(`McwWarAdvancedSettingsPage.InfoRenderer._updateComponentsForValueAsTeamIndex() empty teamName.`);
                    labelValue.text = CommonConstants.ErrorTextForUndefined;
                } else {
                    labelValue.text = teamName;
                }
            }
        }
        private async _updateComponentsForValueAsBannedCoIdArray(playerIndex: number): Promise<void> {
            const warRule           = this._getWarRule();
            const currValue         = warRule ? (WarRuleHelpers.getBannedCoIdArray(warRule, playerIndex) || []).length : 0;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
        }
        private async _updateComponentsForValueAsInitialFund(playerIndex: number): Promise<void> {
            const warRule           = this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getInitialFund(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            if (currValue == null) {
                Logger.error(`McwWarAdvancedSettingsPage.InfoRenderer._updateComponentsForValueAsInitialFund() empty currValue.`);
                labelValue.text         = CommonConstants.ErrorTextForUndefined;
                labelValue.textColor    = 0xFFFFFF;
            } else {
                labelValue.text         = `${currValue}`;
                labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault);
            }
        }
        private async _updateComponentsForValueAsIncomeMultiplier(playerIndex: number): Promise<void> {
            const warRule           = this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getIncomeMultiplier(warRule, playerIndex): undefined;
            const labelValue        = this._labelValue;
            if (currValue == null) {
                Logger.error(`McwWarAdvancedSettingsPage.InfoRenderer._updateComponentsForValueAsIncomeMultiplier() empty currValue.`);
                labelValue.text         = CommonConstants.ErrorTextForUndefined;
                labelValue.textColor    = 0xFFFFFF;
            } else {
                labelValue.text         = `${currValue}`;
                labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault);
            }
        }
        private async _updateComponentsForValueAsEnergyAddPctOnLoadCo(playerIndex: number): Promise<void> {
            const warRule           = this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getEnergyAddPctOnLoadCo(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            if (currValue == null) {
                Logger.error(`McwWarAdvancedSettingsPage.InfoRenderer._updateComponentsForValueAsEnergyAddPctOnLoadCo() empty currValue.`);
                labelValue.text         = CommonConstants.ErrorTextForUndefined;
                labelValue.textColor    = 0xFFFFFF;
            } else {
                labelValue.text         = `${currValue}`;
                labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault);
            }
        }
        private async _updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex: number): Promise<void> {
            const warRule           = this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getEnergyGrowthMultiplier(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            if (currValue == null) {
                Logger.error(`McwWarAdvancedSettingsPage.InfoRenderer._updateComponentsForValueAsEnergyGrowthMultiplier() empty currValue.`);
                labelValue.text         = CommonConstants.ErrorTextForUndefined;
                labelValue.textColor    = 0xFFFFFF;
            } else {
                labelValue.text         = `${currValue}`;
                labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault);
            }
        }
        private async _updateComponentsForValueAsMoveRangeModifier(playerIndex: number): Promise<void> {
            const warRule           = this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getMoveRangeModifier(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            if (currValue == null) {
                Logger.error(`McwWarAdvancedSettingsPage.InfoRenderer._updateComponentsForValueAsMoveRangeModifier() empty currValue.`);
                labelValue.text         = CommonConstants.ErrorTextForUndefined;
                labelValue.textColor    = 0xFFFFFF;
            } else {
                labelValue.text         = `${currValue}`;
                labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault);
            }
        }
        private async _updateComponentsForValueAsAttackPowerModifier(playerIndex: number): Promise<void> {
            const warRule           = this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getAttackPowerModifier(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            if (currValue == null) {
                Logger.error(`McwWarAdvancedSettingsPage.InfoRenderer._updateComponentsForValueAsAttackPowerModifier() empty currValue.`);
                labelValue.text         = CommonConstants.ErrorTextForUndefined;
                labelValue.textColor    = 0xFFFFFF;
            } else {
                labelValue.text         = `${currValue}`;
                labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault);
            }
        }
        private async _updateComponentsForValueAsVisionRangeModifier(playerIndex: number): Promise<void> {
            const warRule           = this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getVisionRangeModifier(warRule, playerIndex): undefined;
            const labelValue        = this._labelValue;
            if (currValue == null) {
                Logger.error(`McwWarAdvancedSettingsPage.InfoRenderer._updateComponentsForValueAsVisionRangeModifier() empty currValue.`);
                labelValue.text         = CommonConstants.ErrorTextForUndefined;
                labelValue.textColor    = 0xFFFFFF;
            } else {
                labelValue.text         = `${currValue}`;
                labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault);
            }
        }
        private async _updateComponentsForValueAsLuckLowerLimit(playerIndex: number): Promise<void> {
            const warRule           = this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getLuckLowerLimit(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            if (currValue == null) {
                Logger.error(`McwWarAdvancedSettingsPage.InfoRenderer._updateComponentsForValueAsLuckLowerLimit() empty currValue.`);
                labelValue.text         = CommonConstants.ErrorTextForUndefined;
                labelValue.textColor    = 0xFFFFFF;
            } else {
                labelValue.text         = `${currValue}`;
                labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit);
            }
        }
        private async _updateComponentsForValueAsLuckUpperLimit(playerIndex: number): Promise<void> {
            const warRule           = this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getLuckUpperLimit(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            if (currValue == null) {
                Logger.error(`McwWarAdvancedSettingsPage.InfoRenderer._updateComponentsForValueAsLuckUpperLimit() empty currValue.`);
                labelValue.text         = CommonConstants.ErrorTextForUndefined;
                labelValue.textColor    = 0xFFFFFF;
            } else {
                labelValue.text         = `${currValue}`;
                labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit);
            }
        }

        private _getWarRule(): ProtoTypes.WarRule.IWarRule | null | undefined {
            const warInfo           = MpwModel.getMyWarInfo(this.data.warId);
            const settingsForCommon = warInfo ? warInfo.settingsForCommon : null;
            return settingsForCommon ? settingsForCommon.warRule : undefined;
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

export default TwnsMcwWarAdvancedSettingsPage;
