
// import TwnsCommonHelpPanel      from "../../common/view/CommonHelpPanel";
// import CommonConstants          from "../../tools/helpers/CommonConstants";
// import ConfigManager            from "../../tools/helpers/ConfigManager";
// import Helpers                  from "../../tools/helpers/Helpers";
// import Types                    from "../../tools/helpers/Types";
// import Lang                     from "../../tools/lang/Lang";
// import TwnsLangTextType         from "../../tools/lang/LangTextType";
// import Notify           from "../../tools/notify/NotifyType";
// import ProtoTypes               from "../../tools/proto/ProtoTypes";
// import TwnsUiButton             from "../../tools/ui/UiButton";
// import TwnsUiLabel              from "../../tools/ui/UiLabel";
// import TwnsUiListItemRenderer   from "../../tools/ui/UiListItemRenderer";
// import TwnsUiScrollList         from "../../tools/ui/UiScrollList";
// import TwnsUiTabPage            from "../../tools/ui/UiTabPage";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.Common {
    import GameConfig           = Config.GameConfig;
    import LangTextType         = Lang.LangTextType;
    import NotifyType           = Notify.NotifyType;
    import PlayerRuleType       = Types.PlayerRuleType;
    import WarType              = Types.WarType;
    import IDataForPlayerRule   = CommonProto.WarRule.IDataForPlayerRule;

    export type OpenDataForCommonWarAdvancedSettingsPage = {
        instanceWarRule : CommonProto.WarRule.IInstanceWarRule;
        warType         : WarType;
        gameConfig      : GameConfig;
    } | null;
    export class CommonWarAdvancedSettingsPage extends TwnsUiTabPage.UiTabPage<OpenDataForCommonWarAdvancedSettingsPage> {
        private readonly _scroller!         : eui.Scroller;
        private readonly _listRuleTitle!    : TwnsUiScrollList.UiScrollList<DataForRuleTitleRenderer>;
        private readonly _listPlayer!       : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

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
            const openData = this._getOpenData();
            if (openData == null) {
                return;
            }

            const gameConfig        = openData.gameConfig;
            const playerRuleArray   = Helpers.getExisted(openData.instanceWarRule?.ruleForPlayers?.playerRuleDataArray);
            const dataArray         : DataForPlayerRenderer[] = [];
            for (let playerIndex = Twns.CommonConstants.WarFirstPlayerIndex; playerIndex <= playerRuleArray.length; ++playerIndex) {
                dataArray.push({
                    gameConfig,
                    playerRule          : Helpers.getExisted(playerRuleArray.find(v => v.playerIndex === playerIndex)),
                    playerRuleTypeArray,
                });
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
        private readonly _labelName!    : TwnsUiLabel.UiLabel;
        private readonly _btnHelp!      : TwnsUiButton.UiButton;

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
                PanelHelpers.open(PanelHelpers.PanelDict.CommonHelpPanel, {
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
                this._labelName.text    = Lang.getPlayerRuleName(playerRuleType) || Twns.CommonConstants.ErrorTextForUndefined;
                this._btnHelp.visible   = playerRuleType === PlayerRuleType.BannedCoIdArray;
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // PlayerRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForPlayerRenderer = {
        gameConfig          : GameConfig;
        playerRule          : IDataForPlayerRule;
        playerRuleTypeArray : PlayerRuleType[];
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
            const data = this._getData();
            if (data) {
                this._labelPlayerIndex.text = `P${data.playerRule.playerIndex}`;
                this._listInfo.bindData(this._createDataForListInfo());
            }
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const data          = this._getData();
            const playerRule    = data.playerRule;
            const gameConfig    = data.gameConfig;
            const dataArray     : DataForInfoRenderer[] = [];
            for (const playerRuleType of data.playerRuleTypeArray) {
                dataArray.push({
                    gameConfig,
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
        gameConfig      : GameConfig;
        playerRule      : IDataForPlayerRule;
        playerRuleType  : PlayerRuleType;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _labelValue!   : TwnsUiLabel.UiLabel;

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
            } else if (playerRuleType === PlayerRuleType.BannedUnitTypeArray) {
                this._updateViewAsBannedUnitTypeArray();
            } else if (playerRuleType === PlayerRuleType.CanActivateCoSkill) {
                this._updateViewAsCanActivateCoSkill();
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
                throw Helpers.newError(`CommonWarAdvancedSettingsPage.InfoRenderer._updateView() invalid playerRuleType: ${playerRuleType}`);
            }
        }
        private _updateViewAsTeamIndex(): void {
            const teamIndex         = Helpers.getExisted(this._getData().playerRule.teamIndex);
            const labelValue        = this._labelValue;
            labelValue.text         = Lang.getPlayerTeamName(teamIndex) || Twns.CommonConstants.ErrorTextForUndefined;
            labelValue.textColor    = 0xFFFFFF;
        }
        private _updateViewAsBannedCoIdArray(): void {
            const currValue         = (this._getData().playerRule.bannedCoIdArray || []).length;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
        }
        private _updateViewAsBannedUnitTypeArray(): void {
            const currValue         = this._getData().playerRule.bannedUnitTypeArray?.length ?? 0;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
        }
        private _updateViewAsCanActivateCoSkill(): void {
            const currValue         = this._getData().playerRule.canActivateCoSkill !== false;
            const labelValue        = this._labelValue;
            labelValue.text         = Lang.getText(currValue ? LangTextType.B0012 : LangTextType.B0013);
            labelValue.textColor    = currValue ? 0xFFFFFF : 0xFF0000;
        }
        private _updateViewAsInitialFund(): void {
            const currValue         = Helpers.getExisted(this._getData().playerRule.initialFund);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, Twns.CommonConstants.WarRuleInitialFundDefault);
        }
        private _updateViewAsIncomeMultiplier(): void {
            const currValue         = Helpers.getExisted(this._getData().playerRule.incomeMultiplier);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, Twns.CommonConstants.WarRuleIncomeMultiplierDefault);
        }
        private _updateViewAsEnergyAddPctOnLoadCo(): void {
            const currValue         = Helpers.getExisted(this._getData().playerRule.energyAddPctOnLoadCo);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, Twns.CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault);
        }
        private _updateViewAsEnergyGrowthMultiplier(): void {
            const currValue         = Helpers.getExisted(this._getData().playerRule.energyGrowthMultiplier);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, Twns.CommonConstants.WarRuleEnergyGrowthMultiplierDefault);
        }
        private _updateViewAsMoveRangeModifier(): void {
            const currValue         = Helpers.getExisted(this._getData().playerRule.moveRangeModifier);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, Twns.CommonConstants.WarRuleMoveRangeModifierDefault);
        }
        private _updateViewAsAttackPowerModifier(): void {
            const currValue         = Helpers.getExisted(this._getData().playerRule.attackPowerModifier);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, Twns.CommonConstants.WarRuleOffenseBonusDefault);
        }
        private _updateViewAsVisionRangeModifier(): void {
            const currValue         = Helpers.getExisted(this._getData().playerRule.visionRangeModifier);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, Twns.CommonConstants.WarRuleVisionRangeModifierDefault);
        }
        private _updateViewAsLuckLowerLimit(): void {
            const currValue         = Helpers.getExisted(this._getData().playerRule.luckLowerLimit);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, Twns.CommonConstants.WarRuleLuckDefaultLowerLimit);
        }
        private _updateViewAsLuckUpperLimit(): void {
            const currValue         = Helpers.getExisted(this._getData().playerRule.luckUpperLimit);
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, Twns.CommonConstants.WarRuleLuckDefaultUpperLimit);
        }
        private _updateViewAsAiControlInCcw(): void {
            const isAi              = this._getData().playerRule.fixedCoIdInCcw != null;
            const labelValue        = this._labelValue;
            labelValue.text         = Lang.getText(isAi ? LangTextType.B0012 : LangTextType.B0013);
            labelValue.textColor    = isAi ? 0x00FF00 : 0xFFFFFF;
        }
        private _updateViewAsAiCoIdInCcw(): void {
            const data              = this._getData();
            const coId              = data.playerRule.fixedCoIdInCcw;
            const labelValue        = this._labelValue;
            labelValue.text         = coId == null ? `--` : data.gameConfig.getCoNameAndTierText(coId) ?? Twns.CommonConstants.ErrorTextForUndefined;
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
            PlayerRuleType.BannedUnitTypeArray,
            PlayerRuleType.InitialFund,
            PlayerRuleType.IncomeMultiplier,
            PlayerRuleType.EnergyAddPctOnLoadCo,
            PlayerRuleType.EnergyGrowthMultiplier,
            PlayerRuleType.CanActivateCoSkill,
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

// export default TwnsCommonWarAdvancedSettingsPage;
