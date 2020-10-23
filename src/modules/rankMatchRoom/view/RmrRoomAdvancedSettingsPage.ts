
namespace TinyWars.RankMatchRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import Notify           = Utility.Notify;
    import BwSettingsHelper = BaseWar.BwSettingsHelper;
    import WarMapModel      = WarMap.WarMapModel;
    import NetMessage       = ProtoTypes.NetMessage;
    import IRmrRoomInfo     = ProtoTypes.RankMatchRoom.IRmrRoomInfo;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export type OpenParamForRoomAdvancedSettingsPage = {
        roomId  : number;
    }

    export class RmrRoomAdvancedSettingsPage extends GameUi.UiTabPage {
        private _btnMapNameTitle    : TinyWars.GameUi.UiButton;
        private _labelMapName       : TinyWars.GameUi.UiLabel;
        private _btnBuildings       : TinyWars.GameUi.UiButton;
        private _labelPlayerList    : TinyWars.GameUi.UiLabel;
        private _listPlayer         : TinyWars.GameUi.UiScrollList;

        protected _dataForOpen  : OpenParamForRoomAdvancedSettingsPage;
        private _roomInfo       : IRmrRoomInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/rankMatchRoom/RmrRoomAdvancedSettingsPage.exml";
        }

        public _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBuildings,   callback: this._onTouchedBtnBuildings },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgRmrGetRoomPublicInfo,    callback: this._onMsgRmrGetRoomPublicInfo },
            ];
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }

        protected async _onOpened(): Promise<void> {
            const roomId    = this._dataForOpen.roomId;
            this._roomInfo  = await RmrModel.getRoomInfo(roomId);

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
                    configVersion   : settingsForCommon.configVersion,
                    mapRawData      : await WarMapModel.getRawData(settingsForCommon.mapId),
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onMsgRmrGetRoomPublicInfo(e: egret.Event): void {
            const data          = e.data as NetMessage.MsgRmrGetRoomPublicInfo.IS;
            const currRoomInfo  = this._roomInfo;
            if ((currRoomInfo) && (data.roomId === currRoomInfo.roomId)) {
                this._roomInfo = data.roomInfo;
                this._updateListPlayer();
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
                const mapId             = roomInfo.settingsForCommon.mapId;
                this._labelMapName.text = `${await WarMapModel.getMapNameInCurrentLanguage(mapId) || "----"} (${Lang.getText(Lang.Type.B0163)}: ${await WarMapModel.getDesignerName(mapId) || "----"})`;
            }
        }
    }

    type DataForPlayerRenderer = {
        playerIndex : number;
        roomInfo    : IRmrRoomInfo;
    }

    class PlayerRenderer extends eui.ItemRenderer {
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
        private _createDataPlayerIndex(roomInfo: IRmrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            return {
                titleText   : Lang.getText(Lang.Type.B0018),
                infoText    : `${Lang.getPlayerForceName(playerIndex)} (${Lang.getPlayerTeamName(playerRule.teamIndex)})`,
                infoColor   : 0xFFFFFF,
            };
        }
        private _createDataInitialFund(roomInfo: IRmrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.initialFund;
            return {
                titleText       : Lang.getText(Lang.Type.B0178),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleInitialFundDefault),
            };
        }
        private _createDataIncomeMultiplier(roomInfo: IRmrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.incomeMultiplier;
            return {
                titleText       : Lang.getText(Lang.Type.B0179),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleIncomeMultiplierDefault),
            };
        }
        private _createDataInitialEnergyPercentage(roomInfo: IRmrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.initialEnergyPercentage;
            return {
                titleText       : Lang.getText(Lang.Type.B0180),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleInitialEnergyPercentageDefault),
            };
        }
        private _createDataEnergyGrowthMultiplier(roomInfo: IRmrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.energyGrowthMultiplier;
            return {
                titleText       : Lang.getText(Lang.Type.B0181),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleEnergyGrowthMultiplierDefault),
            };
        }
        private _createDataMoveRangeModifier(roomInfo: IRmrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.moveRangeModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0182),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleMoveRangeModifierDefault),
            };
        }
        private _createDataAttackPowerModifier(roomInfo: IRmrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.attackPowerModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0183),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleOffenseBonusDefault),
            };
        }
        private _createDataVisionRangeModifier(roomInfo: IRmrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.visionRangeModifier;
            return {
                titleText       : Lang.getText(Lang.Type.B0184),
                infoText        : `${currValue}`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleVisionRangeModifierDefault),
            };
        }
        private _createDataLuckLowerLimit(roomInfo: IRmrRoomInfo, playerIndex: number): DataForInfoRenderer {
            const playerRule    = BwSettingsHelper.getPlayerRule(roomInfo.settingsForCommon.warRule, playerIndex);
            const currValue     = playerRule.luckLowerLimit;
            return {
                titleText       : Lang.getText(Lang.Type.B0189),
                infoText        : `${currValue}%`,
                infoColor       : getTextColor(currValue, CommonConstants.WarRuleLuckDefaultLowerLimit),
            };
        }
        private _createDataLuckUpperLimit(roomInfo: IRmrRoomInfo, playerIndex: number): DataForInfoRenderer {
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

    class InfoRenderer extends eui.ItemRenderer {
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
