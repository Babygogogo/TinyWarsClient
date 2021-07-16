
import TwnsCommonHelpPanel      from "../../common/view/CommonHelpPanel";
import CommonConstants          from "../../tools/helpers/CommonConstants";
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
import WarMapModel              from "../../warMap/model/WarMapModel";

namespace TwnsMrrPreviewAdvancedSettingsPage {
    import CommonHelpPanel  = TwnsCommonHelpPanel.CommonHelpPanel;
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;
    import PlayerRuleType   = Types.PlayerRuleType;

    export type OpenDataForMrrPreviewAdvancedSettingsPage = {
        hasFog  : boolean;
        mapId   : number;
    };
    export class MrrPreviewAdvancedSettingsPage extends TwnsUiTabPage.UiTabPage<OpenDataForMrrPreviewAdvancedSettingsPage> {
        private readonly _scroller      : eui.Scroller;
        private readonly _listSetting   : TwnsUiScrollList.UiScrollList<DataForSettingRenderer>;
        private readonly _listPlayer    : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrPreviewAdvancedSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: NotifyType.MsgMapGetRawData,   callback: this._onNotifyMsgMapGetRawData },
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
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMapGetRawData(e: egret.Event): void {
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
            const { mapId, hasFog } = this._getOpenData();
            const warRule           = await getWarRule(mapId, hasFog);
            const playersCount      = warRule ? warRule.ruleForPlayers.playerRuleDataArray.length : null;
            const listPlayer        = this._listPlayer;
            if (playersCount == null) {
                listPlayer.clear();
            } else {
                const dataList: DataForPlayerRenderer[] = [];
                for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                    dataList.push({ mapId, hasFog, playerIndex });
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
        private readonly _labelName : TwnsUiLabel.UiLabel;
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
                this._labelName.text    = Lang.getPlayerRuleName(playerRuleType);
                this._btnHelp.visible   = playerRuleType === PlayerRuleType.BannedCoIdArray;
            }
        }

        private _onTouchedBtnHelp(e: egret.Event): void {
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
        mapId       : number;
        hasFog      : boolean;
        playerIndex : number;
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
                this._labelPlayerIndex.text = `P${data.playerIndex}`;
                this._listInfo.bindData(this._createDataForListInfo());
            }
        }

        private _createDataForListInfo(): DataForInfoRenderer[] {
            const { mapId, playerIndex, hasFog } = this.data;
            return [
                { mapId, hasFog, playerIndex, playerRuleType: PlayerRuleType.TeamIndex },
                { mapId, hasFog, playerIndex, playerRuleType: PlayerRuleType.BannedCoIdArray },
                { mapId, hasFog, playerIndex, playerRuleType: PlayerRuleType.InitialFund },
                { mapId, hasFog, playerIndex, playerRuleType: PlayerRuleType.IncomeMultiplier },
                { mapId, hasFog, playerIndex, playerRuleType: PlayerRuleType.EnergyAddPctOnLoadCo },
                { mapId, hasFog, playerIndex, playerRuleType: PlayerRuleType.EnergyGrowthMultiplier },
                { mapId, hasFog, playerIndex, playerRuleType: PlayerRuleType.MoveRangeModifier },
                { mapId, hasFog, playerIndex, playerRuleType: PlayerRuleType.AttackPowerModifier },
                { mapId, hasFog, playerIndex, playerRuleType: PlayerRuleType.VisionRangeModifier },
                { mapId, hasFog, playerIndex, playerRuleType: PlayerRuleType.LuckLowerLimit },
                { mapId, hasFog, playerIndex, playerRuleType: PlayerRuleType.LuckUpperLimit },
            ];
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // InfoRenderer
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    type DataForInfoRenderer = {
        mapId                   : number;
        hasFog                  : boolean;
        playerIndex             : number;
        playerRuleType          : PlayerRuleType;
        infoText?               : string;
        infoColor?              : number;
        callbackOnTouchedTitle? : (() => void) | null;
    };
    class InfoRenderer extends TwnsUiListItemRenderer.UiListItemRenderer<DataForInfoRenderer> {
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
            const warRule           = await this._getWarRule();
            const teamIndex         = warRule ? WarRuleHelpers.getTeamIndex(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = teamIndex == null ? null : Lang.getPlayerTeamName(teamIndex);
            labelValue.textColor    = 0xFFFFFF;
        }
        private async _updateComponentsForValueAsBannedCoIdArray(playerIndex: number): Promise<void> {
            const warRule           = await this._getWarRule();
            const currValue         = warRule ? (WarRuleHelpers.getBannedCoIdArray(warRule, playerIndex) || []).length : 0;
            const labelValue        = this._labelValue;
            labelValue.text         = `${currValue}`;
            labelValue.textColor    = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
        }
        private async _updateComponentsForValueAsInitialFund(playerIndex: number): Promise<void> {
            const warRule           = await this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getInitialFund(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault);
        }
        private async _updateComponentsForValueAsIncomeMultiplier(playerIndex: number): Promise<void> {
            const warRule           = await this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getIncomeMultiplier(warRule, playerIndex): undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault);
        }
        private async _updateComponentsForValueAsEnergyAddPctOnLoadCo(playerIndex: number): Promise<void> {
            const warRule           = await this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getEnergyAddPctOnLoadCo(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault);
        }
        private async _updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex: number): Promise<void> {
            const warRule           = await this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getEnergyGrowthMultiplier(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault);
        }
        private async _updateComponentsForValueAsMoveRangeModifier(playerIndex: number): Promise<void> {
            const warRule           = await this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getMoveRangeModifier(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault);
        }
        private async _updateComponentsForValueAsAttackPowerModifier(playerIndex: number): Promise<void> {
            const warRule           = await this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getAttackPowerModifier(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault);
        }
        private async _updateComponentsForValueAsVisionRangeModifier(playerIndex: number): Promise<void> {
            const warRule           = await this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getVisionRangeModifier(warRule, playerIndex): undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault);
        }
        private async _updateComponentsForValueAsLuckLowerLimit(playerIndex: number): Promise<void> {
            const warRule           = await this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getLuckLowerLimit(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit);
        }
        private async _updateComponentsForValueAsLuckUpperLimit(playerIndex: number): Promise<void> {
            const warRule           = await this._getWarRule();
            const currValue         = warRule ? WarRuleHelpers.getLuckUpperLimit(warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit);
        }

        private _getWarRule(): Promise<ProtoTypes.WarRule.IWarRule | null | undefined> {
            const data = this.data;
            return data ? getWarRule(data.mapId, data.hasFog) : null;
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

    async function getWarRule(mapId: number, hasFog: boolean): Promise<ProtoTypes.WarRule.IWarRule | null | undefined> {
        const mapRawData = await WarMapModel.getRawData(mapId);
        return (mapRawData ? mapRawData.warRuleArray || [] : []).find(v => v.ruleForGlobalParams.hasFogByDefault === hasFog);
    }
}

export default TwnsMrrPreviewAdvancedSettingsPage;
