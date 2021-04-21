
namespace TinyWars.MultiCustomRoom {
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import CommonConstants  = Utility.CommonConstants;
    import Notify           = Utility.Notify;
    import ProtoTypes       = Utility.ProtoTypes;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
    import PlayerRuleType   = Types.PlayerRuleType;

    export type OpenDataForMcrRoomAdvancedSettingsPage = {
        roomId  : number;
    }
    export class McrRoomAdvancedSettingsPage extends GameUi.UiTabPage<OpenDataForMcrRoomAdvancedSettingsPage> {
        private readonly _scroller      : eui.Scroller;
        private readonly _listSetting   : GameUi.UiScrollList<DataForSettingRenderer, SettingRenderer>;
        private readonly _listPlayer    : GameUi.UiScrollList<DataForPlayerRenderer, PlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrRoomAdvancedSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMcrGetRoomInfo,  callback: this._onNotifyMsgMcrGetRoomInfo },
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
        }

        private _initListSetting(): void {
            this._listSetting.bindData([
                { playerRuleType: PlayerRuleType.TeamIndex },
                { playerRuleType: PlayerRuleType.AvailableCoIdList },
                { playerRuleType: PlayerRuleType.InitialFund },
                { playerRuleType: PlayerRuleType.IncomeMultiplier },
                { playerRuleType: PlayerRuleType.InitialEnergyPercentage },
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
    }
    class SettingRenderer extends GameUi.UiListItemRenderer<DataForSettingRenderer> {
        private readonly _labelName : GameUi.UiLabel;
        private readonly _btnHelp   : GameUi.UiButton;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHelp,    callback: this._onTouchedBtnHelp },
            ]);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data;
            if (data) {
                const playerRuleType    = data.playerRuleType;
                this._labelName.text    = Lang.getPlayerRuleName(playerRuleType);
                this._btnHelp.visible   = playerRuleType === PlayerRuleType.AvailableCoIdList;
            }
        }

        private _onTouchedBtnHelp(e: egret.Event): void {
            const data              = this.data;
            const playerRuleType    = data ? data.playerRuleType : null;
            if (playerRuleType === PlayerRuleType.AvailableCoIdList) {
                Common.CommonHelpPanel.show({
                    title   : `CO`,
                    content : Lang.getRichText(Lang.RichType.R0004),
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
    }
    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private _labelPlayerIndex   : GameUi.UiLabel;
        private _listInfo           : GameUi.UiScrollList<DataForInfoRenderer, InfoRenderer>;

        protected _onOpened(): void {
            this._listInfo.setItemRenderer(InfoRenderer);
        }

        protected dataChanged(): void {
            super.dataChanged();

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
                { roomId, playerIndex, playerRuleType: PlayerRuleType.AvailableCoIdList },
                { roomId, playerIndex, playerRuleType: PlayerRuleType.InitialFund },
                { roomId, playerIndex, playerRuleType: PlayerRuleType.IncomeMultiplier },
                { roomId, playerIndex, playerRuleType: PlayerRuleType.InitialEnergyPercentage },
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
    }
    class InfoRenderer extends GameUi.UiListItemRenderer<DataForInfoRenderer> {
        private readonly _labelValue    : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            this._updateComponentsForValue();
        }

        private _updateComponentsForValue(): void {
            const data = this.data;
            if (data) {
                const playerIndex = data.playerIndex;
                switch (data.playerRuleType) {
                    case PlayerRuleType.TeamIndex               : this._updateComponentsForValueAsTeamIndex(playerIndex);               return;
                    case PlayerRuleType.AvailableCoIdList       : this._updateComponentsForValueAsAvailableCoIdList(playerIndex);       return;
                    case PlayerRuleType.InitialFund             : this._updateComponentsForValueAsInitialFund(playerIndex);             return;
                    case PlayerRuleType.IncomeMultiplier        : this._updateComponentsForValueAsIncomeMultiplier(playerIndex);        return;
                    case PlayerRuleType.InitialEnergyPercentage : this._updateComponentsForValueAsInitialEnergyPercentage(playerIndex); return;
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
            const teamIndex         = roomInfo ? BwWarRuleHelper.getTeamIndex(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = teamIndex == null ? null : Lang.getPlayerTeamName(teamIndex);
            labelValue.textColor    = 0xFFFFFF;
        }
        private async _updateComponentsForValueAsAvailableCoIdList(playerIndex: number): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            const coIdArray         = roomInfo ? BwWarRuleHelper.getAvailableCoIdList(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = coIdArray ? `${coIdArray.length}` : null;
            labelValue.textColor    = 0xFFFFFF;
        }
        private async _updateComponentsForValueAsInitialFund(playerIndex: number): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            const currValue         = roomInfo ? BwWarRuleHelper.getInitialFund(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault);
        }
        private async _updateComponentsForValueAsIncomeMultiplier(playerIndex: number): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            const currValue         = roomInfo ? BwWarRuleHelper.getIncomeMultiplier(roomInfo.settingsForCommon.warRule, playerIndex): undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault);
        }
        private async _updateComponentsForValueAsInitialEnergyPercentage(playerIndex: number): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            const currValue         = roomInfo ? BwWarRuleHelper.getInitialEnergyPercentage(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleInitialEnergyPercentageDefault);
        }
        private async _updateComponentsForValueAsEnergyGrowthMultiplier(playerIndex: number): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            const currValue         = roomInfo ? BwWarRuleHelper.getEnergyGrowthMultiplier(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault);
        }
        private async _updateComponentsForValueAsMoveRangeModifier(playerIndex: number): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            const currValue         = roomInfo ? BwWarRuleHelper.getMoveRangeModifier(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault);
        }
        private async _updateComponentsForValueAsAttackPowerModifier(playerIndex: number): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            const currValue         = roomInfo ? BwWarRuleHelper.getAttackPowerModifier(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault);
        }
        private async _updateComponentsForValueAsVisionRangeModifier(playerIndex: number): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            const currValue         = roomInfo ? BwWarRuleHelper.getVisionRangeModifier(roomInfo.settingsForCommon.warRule, playerIndex): undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault);
        }
        private async _updateComponentsForValueAsLuckLowerLimit(playerIndex: number): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            const currValue         = roomInfo ? BwWarRuleHelper.getLuckLowerLimit(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
            const labelValue        = this._labelValue;
            labelValue.text         = currValue == null ? null : `${currValue}`;
            labelValue.textColor    = getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit);
        }
        private async _updateComponentsForValueAsLuckUpperLimit(playerIndex: number): Promise<void> {
            const roomInfo          = await this._getRoomInfo();
            const currValue         = roomInfo ? BwWarRuleHelper.getLuckUpperLimit(roomInfo.settingsForCommon.warRule, playerIndex) : undefined;
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
}
