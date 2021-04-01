
namespace TinyWars.MultiFreeRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import CommonConstants  = Utility.CommonConstants;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
    import NetMessage       = ProtoTypes.NetMessage;
    import IMfrRoomInfo     = ProtoTypes.MultiFreeRoom.IMfrRoomInfo;

    export type OpenDataForMfrRoomAdvancedSettingsPage = {
        roomId  : number;
    }

    export class MfrRoomAdvancedSettingsPage extends GameUi.UiTabPage {
        private _btnBuildings       : TinyWars.GameUi.UiButton;
        private _labelPlayerList    : TinyWars.GameUi.UiLabel;
        private _listPlayer         : TinyWars.GameUi.UiScrollList<DataForPlayerRenderer, PlayerRenderer>;

        private _roomInfo           : IMfrRoomInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrRoomAdvancedSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnBuildings,   callback: this._onTouchedBtnBuildings },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMfrGetRoomInfo,  callback: this._onMsgMfrGetRoomInfo },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            const roomId    = this._getOpenData<OpenDataForMfrRoomAdvancedSettingsPage>().roomId;
            this._roomInfo  = await MfrModel.getRoomInfo(roomId);

            this._updateComponentsForLanguage();
        }

        protected async _onClosed(): Promise<void> {
            this._listPlayer.clear();
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const warData = roomInfo.settingsForMfw.initialWarData;
                WarMap.WarMapBuildingListPanel.show({
                    configVersion           : warData.settingsForCommon.configVersion,
                    tileDataArray           : warData.field.tileMap.tiles,
                    playersCountUnneutral   : warData.playerManager.players.length - 1,
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onMsgMfrGetRoomInfo(e: egret.Event): void {
            const data          = e.data as NetMessage.MsgMfrGetRoomInfo.IS;
            const roomId        = data.roomId;
            const currRoomInfo  = this._roomInfo;
            if ((currRoomInfo) && (roomId === currRoomInfo.roomId)) {
                const newRoomInfo   = data.roomInfo;
                const selfUserId    = User.UserModel.getSelfUserId();
                if (newRoomInfo.playerDataList.some(v => v.userId === selfUserId)) {
                    this._roomInfo = newRoomInfo;
                    this._updateListPlayer();
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelPlayerList.text  = Lang.getText(Lang.Type.B0395);
            this._btnBuildings.label    = Lang.getText(Lang.Type.B0333);
            this._updateListPlayer();
        }

        private _updateListPlayer(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const playersCount  = BwWarRuleHelper.getPlayersCount(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule);
                const dataList      : DataForPlayerRenderer[] = [];
                for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                    dataList.push({
                        playerIndex,
                        roomInfo,
                    });
                }
                this._listPlayer.bindData(dataList);
            }
        }
    }

    type DataForPlayerRenderer = {
        playerIndex : number;
        roomInfo    : IMfrRoomInfo;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private _listInfo   : GameUi.UiScrollList<DataForInfoRenderer, InfoRenderer>;

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
            const data          = this.data;
            const playerIndex   = data.playerIndex;
            const roomInfo      = data.roomInfo;
            return [
                this._createDataPlayerIndex(roomInfo, playerIndex),
                this._createDataInitialFund(roomInfo, playerIndex),
                this._createDataIncomeMultiplier(roomInfo, playerIndex),
                this._createDataInitialEnergyPercentage(roomInfo, playerIndex),
                this._createDataEnergyGrowthMultiplier(roomInfo, playerIndex),
                this._createDataMoveRangeModifier(roomInfo, playerIndex),
                this._createDataAttackPowerModifier(roomInfo, playerIndex),
                this._createDataVisionRangeModifier(roomInfo, playerIndex),
                this._createDataLuckLowerLimit(roomInfo, playerIndex),
                this._createDataLuckUpperLimit(roomInfo, playerIndex),
            ];
        }
        private _createDataPlayerIndex(roomInfo: IMfrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule = BwWarRuleHelper.getPlayerRule(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex);
            return {
                titleText   : Lang.getText(Lang.Type.B0018),
                infoText    : `${Lang.getPlayerForceName(playerIndex)} (${Lang.getPlayerTeamName(playerRule.teamIndex)})`,
                infoColor   : 0xFFFFFF,
            };
        }
        private _createDataInitialFund(roomInfo: IMfrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwWarRuleHelper.getPlayerRule(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.initialFund;
            return {
                titleText       : Lang.getText(Lang.Type.B0178),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            };
        }
        private _createDataIncomeMultiplier(roomInfo: IMfrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwWarRuleHelper.getPlayerRule(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.incomeMultiplier;
            return {
                titleText       : Lang.getText(Lang.Type.B0179),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            };
        }
        private _createDataInitialEnergyPercentage(roomInfo: IMfrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwWarRuleHelper.getPlayerRule(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.initialEnergyPercentage;
            return {
                titleText       : Lang.getText(Lang.Type.B0180),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleInitialEnergyPercentageDefault),
            };
        }
        private _createDataEnergyGrowthMultiplier(roomInfo: IMfrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwWarRuleHelper.getPlayerRule(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.energyGrowthMultiplier;
            return {
                titleText       : Lang.getText(Lang.Type.B0181),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            };
        }
        private _createDataMoveRangeModifier(roomInfo: IMfrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwWarRuleHelper.getPlayerRule(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.moveRangeModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0182),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            };
        }
        private _createDataAttackPowerModifier(roomInfo: IMfrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwWarRuleHelper.getPlayerRule(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.attackPowerModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0183),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            };
        }
        private _createDataVisionRangeModifier(roomInfo: IMfrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwWarRuleHelper.getPlayerRule(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.visionRangeModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0184),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            };
        }
        private _createDataLuckLowerLimit(roomInfo: IMfrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwWarRuleHelper.getPlayerRule(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.luckLowerLimit;
            return {
                titleText       : Lang.getText(Lang.Type.B0189),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            };
        }
        private _createDataLuckUpperLimit(roomInfo: IMfrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwWarRuleHelper.getPlayerRule(roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule, playerIndex);
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

    class InfoRenderer extends GameUi.UiListItemRenderer<DataForInfoRenderer> {
        private _btnTitle   : GameUi.UiButton;
        private _labelValue : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data;
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
