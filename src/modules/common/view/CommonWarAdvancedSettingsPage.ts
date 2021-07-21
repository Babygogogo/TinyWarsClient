
import TwnsCommonHelpPanel      from "../../common/view/CommonHelpPanel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
import ConfigManager            from "../../tools/helpers/ConfigManager";
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

namespace TwnsCommonWarAdvancedSettingsPage {
    import CommonHelpPanel      = TwnsCommonHelpPanel.CommonHelpPanel;
    import LangTextType         = TwnsLangTextType.LangTextType;
    import NotifyType           = TwnsNotifyType.NotifyType;
    import PlayerRuleType       = Types.PlayerRuleType;
    import WarType              = Types.WarType;
    import IWarRule             = ProtoTypes.WarRule.IWarRule;
    import IDataForPlayerRule   = ProtoTypes.WarRule.IDataForPlayerRule;

    export type OpenDataForCommonWarAdvancedSettingsPage = {
        warRule         : IWarRule;
        warType         : WarType;
        configVersion   : string;
    };
    export class CommonWarAdvancedSettingsPage extends TwnsUiTabPage.UiTabPage<OpenDataForCommonWarAdvancedSettingsPage> {
        private readonly _scroller      : eui.Scroller;
        private readonly _listRuleTitle : TwnsUiScrollList.UiScrollList<DataForRuleTitleRenderer>;
        private readonly _listPlayer    : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/common/CommonWarAdvancedSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._listRuleTitle.setItemRenderer(RuleTitleRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._scroller.scrollPolicyH = eui.ScrollPolicy.OFF;
            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            const openData = this._getOpenData();
            if (openData == null) {
                return;
            }

            const playerRuleTypeArray = getPlayerRuleTypeArray(openData.warType);
            this._initListSetting(playerRuleTypeArray);
            this._updateListPlayer(playerRuleTypeArray);
        }

        private _initListSetting(playerRuleTypeArray: PlayerRuleType[]): void {
            const dataArray: DataForRuleTitleRenderer[] = [];
            for (const playerRuleType of playerRuleTypeArray) {
                dataArray.push({ playerRuleType });
            }
            this._listRuleTitle.bindData(dataArray);
        }

        private _updateListPlayer(playerRuleTypeArray: PlayerRuleType[]): void {
            const openData          = this._getOpenData();
            const configVersion     = openData.configVersion;
            const playerRuleArray   = openData.warRule.ruleForPlayers.playerRuleDataArray;
            const dataArray         : DataForPlayerRenderer[] = [];
            for (let playerIndex = CommonConstants.WarFirstPlayerIndex; playerIndex <= playerRuleArray.length; ++playerIndex) {
                const playerRule = playerRuleArray.find(v => v.playerIndex === playerIndex);
                if (playerRule == null) {
                    Logger.error(`CommonWarAdvancedSettingsPage._updateListPlayer() empty playerRule.`);
                    continue;
                }

                dataArray.push({ configVersion, playerRule, playerRuleTypeArray });
            }
            this._listPlayer.bindData(dataArray);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // RuleTitleRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForRuleTitleRenderer = {
        playerRuleType  : PlayerRuleType;
    };
    class RuleTitleRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForRuleTitleRenderer> {
        private readonly _labelName : TwnsUiLabel.UiLabel;
        private readonly _btnHelp   : TwnsUiButton.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
        }

        protected _onDataChanged(): void {
            this._updateView();
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

        private _onNotifyLanguageChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            const data = this.data;
            if (data) {
                const playerRuleType    = data.playerRuleType;
                this._labelName.text    = Lang.getPlayerRuleName(playerRuleType);
                this._btnHelp.visible   = playerRuleType === PlayerRuleType.BannedCoIdArray;
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // PlayerRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForPlayerRenderer = {
        configVersion       : string;
        playerRule          : IDataForPlayerRule;
        playerRuleTypeArray : PlayerRuleType[];
    };
    class PlayerRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForPlayerRenderer> {
        private _labelPlayerIndex   : TwnsUiLabel.UiLabel;
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
                this._labelPlayerIndex.text = `P${data.playerRule.playerIndex}`;
                this._listInfo.bindData(this._createDataForListInfo());
            }
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this.data;
            const playerRule    = data.playerRule;
            const configVersion = data.configVersion;
            const dataArray     : DataForInfoRenderer[] = [];
            for (const playerRuleType of data.playerRuleTypeArray) {
                dataArray.push({
                    configVersion,
                    playerRule,
                    playerRuleType,
                });
            }
            return dataArray;
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // InfoRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForInfoRenderer = {
        configVersion   : string;
        playerRule      : IDataForPlayerRule;
        playerRuleType  : PlayerRuleType;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _labelValue    : TwnsUiLabel.UiLabel;

        protected _onDataChanged(): void {
            this._updateView();
        }

        private _updateView(): void {
            const data = this.data;
            if (data == null) {
                return;
            }

            const playerRuleType = data.playerRuleType;
            if (playerRuleType === PlayerRuleType.TeamIndex) {
                this._updateViewAsTeamIndex();
            } else if (playerRuleType === PlayerRuleType.BannedCoIdArray) {
                this._updateViewAsBannedCoIdArray();
            } else if (playerRuleType === PlayerRuleType.InitialFund) {
                this._updateViewAsInitialFund();
            } else if (playerRuleType === PlayerRuleType.IncomeMultiplier) {
                this._updateViewAsIncomeMultiplier();
            } else if (playerRuleType === PlayerRuleType.EnergyAddPctOnLoadCo) {
                this._updateViewAsEnergyAddPctOnLoadCo();
            } else if (playerRuleType === PlayerRuleType.EnergyGrowthMultiplier) {
                this._updateViewAsEnergyGrowthMultiplier();
            } else if (playerRuleType === PlayerRuleType.MoveRangeModifier) {
                this._updateViewAsMoveRangeModifier();
            } else if (playerRuleType === PlayerRuleType.AttackPowerModifier) {
                this._updateViewAsAttackPowerModifier();
            } else if (playerRuleType === PlayerRuleType.VisionRangeModifier) {
                this._updateViewAsVisionRangeModifier();
            } else if (playerRuleType === PlayerRuleType.LuckLowerLimit) {
                this._updateViewAsLuckLowerLimit();
            } else if (playerRuleType === PlayerRuleType.LuckUpperLimit) {
                this._updateViewAsLuckUpperLimit();
            } else if (playerRuleType === PlayerRuleType.AiControlInCcw) {
                this._updateViewAsAiControlInCcw();
            } else if (playerRuleType === PlayerRuleType.AiCoIdInCcw) {
                this._updateViewAsAiCoIdInCcw();
            } else {
                Logger.error(`CommonWarAdvancedSettingsPage.InfoRenderer._updateView() invalid playerRuleType: ${playerRuleType}`);
            }
        }
        private _updateViewAsTeamIndex(): void {
            const teamIndex         = this.data.playerRule.teamIndex;
            const labelValue        = this._labelValue;
            labelValue.text         = Lang.getPlayerTeamName(teamIndex) || CommonConstants.ErrorTextForUndefined;
            labelValue.textColor    = 0xFFFFFF;
        }
        private _updateViewAsBannedCoIdArray(): void {
            const currValue         = (this.data.playerRule.bannedCoIdArray || []).length;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
        }
        private _updateViewAsInitialFund(): void {
            const currValue         = this.data.playerRule.initialFund;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault);
        }
        private _updateViewAsIncomeMultiplier(): void {
            const currValue         = this.data.playerRule.incomeMultiplier;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault);
        }
        private _updateViewAsEnergyAddPctOnLoadCo(): void {
            const currValue         = this.data.playerRule.energyAddPctOnLoadCo;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault);
        }
        private _updateViewAsEnergyGrowthMultiplier(): void {
            const currValue         = this.data.playerRule.energyGrowthMultiplier;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault);
        }
        private _updateViewAsMoveRangeModifier(): void {
            const currValue         = this.data.playerRule.moveRangeModifier;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault);
        }
        private _updateViewAsAttackPowerModifier(): void {
            const currValue         = this.data.playerRule.attackPowerModifier;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault);
        }
        private _updateViewAsVisionRangeModifier(): void {
            const currValue         = this.data.playerRule.visionRangeModifier;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault);
        }
        private _updateViewAsLuckLowerLimit(): void {
            const currValue         = this.data.playerRule.luckLowerLimit;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit);
        }
        private _updateViewAsLuckUpperLimit(): void {
            const currValue         = this.data.playerRule.luckUpperLimit;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit);
        }
        private _updateViewAsAiControlInCcw(): void {
            const isAi              = this.data.playerRule.fixedCoIdInCcw != null;
            const labelValue        = this._labelValue;
            labelValue.text         = Lang.getText(isAi ? LangTextType.B0012 : LangTextType.B0013);
            labelValue.textColor    = isAi ? 0x00FF00 : 0xFFFFFF;
        }
        private _updateViewAsAiCoIdInCcw(): void {
            const data              = this.data;
            const coId              = data.playerRule.fixedCoIdInCcw;
            const labelValue        = this._labelValue;
            labelValue.text         = coId == null ? `--` : ConfigManager.getCoNameAndTierText(data.configVersion, coId);
            labelValue.textColor    = 0xFFFFFF;
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

    function getPlayerRuleTypeArray(warType: WarType): PlayerRuleType[] {
        const typeArray: PlayerRuleType[] = [
            PlayerRuleType.TeamIndex,
            PlayerRuleType.BannedCoIdArray,
            PlayerRuleType.InitialFund,
            PlayerRuleType.IncomeMultiplier,
            PlayerRuleType.EnergyAddPctOnLoadCo,
            PlayerRuleType.EnergyGrowthMultiplier,
            PlayerRuleType.MoveRangeModifier,
            PlayerRuleType.AttackPowerModifier,
            PlayerRuleType.VisionRangeModifier,
            PlayerRuleType.LuckLowerLimit,
            PlayerRuleType.LuckUpperLimit,
        ];
        if ((warType === WarType.CcwFog) || (warType === WarType.CcwStd)) {
            typeArray.push(PlayerRuleType.AiControlInCcw, PlayerRuleType.AiCoIdInCcw);
        }

        return typeArray;
    }
}

export default TwnsCommonWarAdvancedSettingsPage;
