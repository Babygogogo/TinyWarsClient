
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import Notify           = Utility.Notify;
    import FloatText        = Utility.FloatText;
    import BwSettingsHelper = BaseWar.BwSettingsHelper;
    import WarMapModel      = WarMap.WarMapModel;
    import NetMessage       = ProtoTypes.NetMessage;
    import IMcrRoomInfo     = ProtoTypes.MultiCustomRoom.IMcrRoomInfo;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export type OpenDataForMcrRoomAdvancedSettingsPage = {
        roomId  : number;
    }

    export class McrRoomAdvancedSettingsPage extends GameUi.UiTabPage {
        private _btnMapNameTitle    : TinyWars.GameUi.UiButton;
        private _labelMapName       : TinyWars.GameUi.UiLabel;
        private _btnBuildings       : TinyWars.GameUi.UiButton;
        private _labelPlayerList    : TinyWars.GameUi.UiLabel;
        private _listPlayer         : TinyWars.GameUi.UiScrollList;

        private _roomInfo           : IMcrRoomInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrRoomAdvancedSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnBuildings,   callback: this._onTouchedBtnBuildings },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMcrGetRoomInfo,  callback: this._onMsgMcrGetRoomInfo },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            const roomId    = this._getOpenData<OpenDataForMcrRoomAdvancedSettingsPage>().roomId;
            this._roomInfo  = await McrModel.getRoomInfo(roomId);

            this._updateComponentsForLanguage();
        }

        protected _onClosed(): void {
            this._listPlayer.clear();
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const settingsForCommon = roomInfo.settingsForCommon;
                WarMap.WarMapBuildingListPanel.show({
                    configVersion   : roomInfo.settingsForCommon.configVersion,
                    mapRawData      : await WarMapModel.getRawData(roomInfo.settingsForMcw.mapId),
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onMsgMcrGetRoomInfo(e: egret.Event): void {
            const data          = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
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
            this._btnMapNameTitle.label = Lang.getText(Lang.Type.B0225);
            this._btnBuildings.label    = Lang.getText(Lang.Type.B0333);
            this._updateLabelMapName();
            this._updateListPlayer();
        }

        private _updateListPlayer(): void {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const playersCount  = BwSettingsHelper.getPlayersCount(roomInfo.settingsForCommon.warRule);
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

        private async _updateLabelMapName(): Promise<void> {
            const roomInfo = this._roomInfo;
            if (roomInfo) {
                const mapId             = roomInfo.settingsForMcw.mapId;
                this._labelMapName.text = `${await WarMapModel.getMapNameInCurrentLanguage(mapId) || "----"} (${Lang.getText(Lang.Type.B0163)}: ${await WarMapModel.getDesignerName(mapId) || "----"})`;
            }
        }
    }

    type DataForPlayerRenderer = {
        playerIndex : number;
        roomInfo    : IMcrRoomInfo;
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
        private _createDataPlayerIndex(roomInfo: IMcrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            return {
                titleText   : Lang.getText(Lang.Type.B0018),
                infoText    : `${Lang.getPlayerForceName(playerIndex)} (${Lang.getPlayerTeamName(playerRule.teamIndex)})`,
                infoColor   : 0xFFFFFF,
            };
        }
        private _createDataInitialFund(roomInfo: IMcrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.initialFund;
            return {
                titleText       : Lang.getText(Lang.Type.B0178),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            };
        }
        private _createDataIncomeMultiplier(roomInfo: IMcrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.incomeMultiplier;
            return {
                titleText       : Lang.getText(Lang.Type.B0179),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            };
        }
        private _createDataInitialEnergyPercentage(roomInfo: IMcrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.initialEnergyPercentage;
            return {
                titleText       : Lang.getText(Lang.Type.B0180),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleInitialEnergyPercentageDefault),
            };
        }
        private _createDataEnergyGrowthMultiplier(roomInfo: IMcrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.energyGrowthMultiplier;
            return {
                titleText       : Lang.getText(Lang.Type.B0181),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            };
        }
        private _createDataMoveRangeModifier(roomInfo: IMcrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.moveRangeModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0182),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            };
        }
        private _createDataAttackPowerModifier(roomInfo: IMcrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.attackPowerModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0183),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            };
        }
        private _createDataVisionRangeModifier(roomInfo: IMcrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.visionRangeModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0184),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            };
        }
        private _createDataLuckLowerLimit(roomInfo: IMcrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.luckLowerLimit;
            return {
                titleText       : Lang.getText(Lang.Type.B0189),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            };
        }
        private _createDataLuckUpperLimit(roomInfo: IMcrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
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
