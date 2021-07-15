
import TwnsUiListItemRenderer           from "../../tools/ui/UiListItemRenderer";
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiScrollList                 from "../../tools/ui/UiScrollList";
import TwnsUiTabPage                    from "../../tools/ui/UiTabPage";
import CommonHelpPanel = TwnsCommonHelpPanel.CommonHelpPanel;import TwnsCommonHelpPanel              from "../../common/view/CommonHelpPanel";
import CommonConstants              from "../../tools/helpers/CommonConstants";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import Types                        from "../../tools/helpers/Types";
import WarRuleHelpers              from "../../tools/warHelpers/WarRuleHelpers";
import McrModel                     from "../../multiCustomRoom/model/McrModel";
import PlayerRuleType                   = Types.PlayerRuleType;

export type OpenDataForMcrRoomAdvancedSettingsPage = {
    roomId  : number;
};
export class McrRoomAdvancedSettingsPage extends TwnsUiTabPage.UiTabPage<OpenDataForMcrRoomAdvancedSettingsPage> {
    private readonly _scroller      : eui.Scroller;
    private readonly _listSetting   : TwnsUiScrollList.UiScrollList<DataForSettingRenderer>;
    private readonly _listPlayer    : TwnsUiScrollList.UiScrollList<DataForPlayerRenderer>;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiCustomRoom/McrRoomAdvancedSettingsPage.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMcrGetRoomInfo,  callback: this._onNotifyMsgMcrGetRoomInfo },
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

    private _onNotifyMsgMcrGetRoomInfo(e: egret.Event): void {
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
        const roomId        = this._getOpenData().roomId;
        const roomInfo      = await McrModel.getRoomInfo(roomId);
        const playersCount  = roomInfo ? roomInfo.settingsForCommon.warRule.ruleForPlayers.playerRuleDataArray.length : null;
        const listPlayer    = this._listPlayer;
        if (playersCount == null) {
            listPlayer.clear();
        } else {
            const dataList: DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                dataList.push({ roomId, playerIndex });
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
    roomId      : number;
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
        const data          = this.data;
        const roomId        = data.roomId;
        const playerIndex   = data.playerIndex;
        return [
            { roomId, playerIndex, playerRuleType: PlayerRuleType.TeamIndex },
            { roomId, playerIndex, playerRuleType: PlayerRuleType.BannedCoIdArray },
            { roomId, playerIndex, playerRuleType: PlayerRuleType.InitialFund },
            { roomId, playerIndex, playerRuleType: PlayerRuleType.IncomeMultiplier },
            { roomId, playerIndex, playerRuleType: PlayerRuleType.EnergyAddPctOnLoadCo },
            { roomId, playerIndex, playerRuleType: PlayerRuleType.EnergyGrowthMultiplier },
            { roomId, playerIndex, playerRuleType: PlayerRuleType.MoveRangeModifier },
            { roomId, playerIndex, playerRuleType: PlayerRuleType.AttackPowerModifier },
            { roomId, playerIndex, playerRuleType: PlayerRuleType.VisionRangeModifier },
            { roomId, playerIndex, playerRuleType: PlayerRuleType.LuckLowerLimit },
            { roomId, playerIndex, playerRuleType: PlayerRuleType.LuckUpperLimit },
        ];
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// InfoRenderer
////////////////////////////////////////////////////////////////////////////////////////////////////
type DataForInfoRenderer = {
    roomId                  : number;
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
        const roomInfo          = await this._getRoomInfo();
        const teamIndex         = roomInfo ? WarRuleHelpers.getTeamIndex(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = teamIndex == null ? null : Lang.getPlayerTeamName(teamIndex);
        labelValue.textColor    = 0xFFFFFF;
    }
    private async _updateComponentsForValueAsBannedCoIdArray(playerIndex: number): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        const currValue         = roomInfo ? (WarRuleHelpers.getBannedCoIdArray(roomInfo.settingsForCommon.warRule, playerIndex) || []).length : 0;
        const labelValue        = this._labelValue;
        labelValue.text         = `${currValue}`;
        labelValue.textColor    = currValue > 0 ? 0xFF0000 : 0xFFFFFF;
    }
    private async _updateComponentsForValueAsInitialFund(playerIndex: number): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        const currValue         = roomInfo ? WarRuleHelpers.getInitialFund(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault);
    }
    private async _updateComponentsForValueAsIncomeMultiplier(playerIndex: number): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        const currValue         = roomInfo ? WarRuleHelpers.getIncomeMultiplier(roomInfo.settingsForCommon.warRule, playerIndex): undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault);
    }
    private async _updateComponentsForValueAsEnergyAddPctOnLoadCo(playerIndex: number): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        const currValue         = roomInfo ? WarRuleHelpers.getEnergyAddPctOnLoadCo(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyAddPctOnLoadCoDefault);
    }
    private async _updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex: number): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        const currValue         = roomInfo ? WarRuleHelpers.getEnergyGrowthMultiplier(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault);
    }
    private async _updateComponentsForValueAsMoveRangeModifier(playerIndex: number): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        const currValue         = roomInfo ? WarRuleHelpers.getMoveRangeModifier(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault);
    }
    private async _updateComponentsForValueAsAttackPowerModifier(playerIndex: number): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        const currValue         = roomInfo ? WarRuleHelpers.getAttackPowerModifier(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault);
    }
    private async _updateComponentsForValueAsVisionRangeModifier(playerIndex: number): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        const currValue         = roomInfo ? WarRuleHelpers.getVisionRangeModifier(roomInfo.settingsForCommon.warRule, playerIndex): undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault);
    }
    private async _updateComponentsForValueAsLuckLowerLimit(playerIndex: number): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        const currValue         = roomInfo ? WarRuleHelpers.getLuckLowerLimit(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit);
    }
    private async _updateComponentsForValueAsLuckUpperLimit(playerIndex: number): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        const currValue         = roomInfo ? WarRuleHelpers.getLuckUpperLimit(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
        const labelValue        = this._labelValue;
        labelValue.text         = currValue == null ? null : `${currValue}`;
        labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultUpperLimit);
    }

    private _getRoomInfo(): Promise<ProtoTypes.MultiCustomRoom.IMcrRoomInfo> {
        return McrModel.getRoomInfo(this.data.roomId);
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
