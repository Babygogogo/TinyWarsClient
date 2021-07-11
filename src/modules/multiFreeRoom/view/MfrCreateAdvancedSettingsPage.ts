
import { UiListItemRenderer }   from "../../../gameui/UiListItemRenderer";
import { UiButton }             from "../../../gameui/UiButton";
import { UiLabel }              from "../../../gameui/UiLabel";
import { UiScrollList }         from "../../../gameui/UiScrollList";
import { UiTabPage }            from "../../../gameui/UiTabPage";
import { CommonHelpPanel }      from "../../common/view/CommonHelpPanel";
import * as CommonConstants     from "../../../utility/CommonConstants";
import * as Lang                from "../../../utility/Lang";
import * as Notify              from "../../../utility/Notify";
import * as Types               from "../../../utility/Types";
import * as BwWarRuleHelper     from "../../baseWar/model/BwWarRuleHelper";
import * as MfrModel            from "../../multiFreeRoom/model/MfrModel";
import PlayerRuleType   = Types.PlayerRuleType;

export class MfrCreateAdvancedSettingsPage extends UiTabPage<void> {
    private readonly _scroller      : eui.Scroller;
    private readonly _listSetting   : UiScrollList<DataForSettingRenderer>;
    private readonly _listPlayer    : UiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiFreeRoom/MfrCreateAdvancedSettingsPage.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.MsgMfrGetRoomInfo,  callback: this._onNotifyMsgMfrGetRoomInfo },
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

    private _onNotifyMsgMfrGetRoomInfo(e: egret.Event): void {
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
        const warData       = MfrModel.Create.getInitialWarData();
        const playersCount  = warData ? warData.settingsForCommon.warRule.ruleForPlayers.playerRuleDataArray.length : null;
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
class SettingRenderer extends UiListItemRenderer<DataForSettingRenderer> {
    private readonly _labelName : UiLabel;
    private readonly _btnHelp   : UiButton;

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
                content : Lang.getText(Lang.Type.R0004),
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
class PlayerRenderer extends UiListItemRenderer<DataForPlayerRenderer> {
    private _labelPlayerIndex   : UiLabel;
    private _listInfo           : UiScrollList<DataForInfoRenderer>;

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
class InfoRenderer extends UiListItemRenderer<DataForInfoRenderer> {
    private readonly _labelValue    : UiLabel;

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
        const warData           = MfrModel.Create.getInitialWarData();
        const teamIndex         = warData ? BwWarRuleHelper.getTeamIndex(warData.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = teamIndex == null ? null : Lang.getPlayerTeamName(teamIndex);
        labelValue.textColor    = 0xFFFFFF;
    }
    private async _updateComponentsForValueAsBannedCoIdArray(playerIndex: number): Promise<void> {
        const warData           = MfrModel.Create.getInitialWarData();
        const currValue         = warData ? (BwWarRuleHelper.getBannedCoIdArray(warData.settingsForCommon.warRule, playerIndex) || []).length : 0;
        const labelValue        = this._labelValue;
        labelValue.text         = `${currValue}`;
        labelValue.textColor    = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
    }
    private async _updateComponentsForValueAsInitialFund(playerIndex: number): Promise<void> {
        const warData           = MfrModel.Create.getInitialWarData();
        const currValue         = warData ? BwWarRuleHelper.getInitialFund(warData.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault);
    }
    private async _updateComponentsForValueAsIncomeMultiplier(playerIndex: number): Promise<void> {
        const warData           = MfrModel.Create.getInitialWarData();
        const currValue         = warData ? BwWarRuleHelper.getIncomeMultiplier(warData.settingsForCommon.warRule, playerIndex): undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault);
    }
    private async _updateComponentsForValueAsEnergyAddPctOnLoadCo(playerIndex: number): Promise<void> {
        const warData           = MfrModel.Create.getInitialWarData();
        const currValue         = warData ? BwWarRuleHelper.getEnergyAddPctOnLoadCo(warData.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault);
    }
    private async _updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex: number): Promise<void> {
        const warData           = MfrModel.Create.getInitialWarData();
        const currValue         = warData ? BwWarRuleHelper.getEnergyGrowthMultiplier(warData.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault);
    }
    private async _updateComponentsForValueAsMoveRangeModifier(playerIndex: number): Promise<void> {
        const warData           = MfrModel.Create.getInitialWarData();
        const currValue         = warData ? BwWarRuleHelper.getMoveRangeModifier(warData.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault);
    }
    private async _updateComponentsForValueAsAttackPowerModifier(playerIndex: number): Promise<void> {
        const warData           = MfrModel.Create.getInitialWarData();
        const currValue         = warData ? BwWarRuleHelper.getAttackPowerModifier(warData.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault);
    }
    private async _updateComponentsForValueAsVisionRangeModifier(playerIndex: number): Promise<void> {
        const warData           = MfrModel.Create.getInitialWarData();
        const currValue         = warData ? BwWarRuleHelper.getVisionRangeModifier(warData.settingsForCommon.warRule, playerIndex): undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault);
    }
    private async _updateComponentsForValueAsLuckLowerLimit(playerIndex: number): Promise<void> {
        const warData           = MfrModel.Create.getInitialWarData();
        const currValue         = warData ? BwWarRuleHelper.getLuckLowerLimit(warData.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit);
    }
    private async _updateComponentsForValueAsLuckUpperLimit(playerIndex: number): Promise<void> {
        const warData           = MfrModel.Create.getInitialWarData();
        const currValue         = warData ? BwWarRuleHelper.getLuckUpperLimit(warData.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit);
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
