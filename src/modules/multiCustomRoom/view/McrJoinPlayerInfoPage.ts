
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import ProtoTypes       = Utility.ProtoTypes;
    import BwHelpers        = BaseWar.BwHelpers;

    export class McrJoinPlayerInfoPage extends GameUi.UiTabPage {
        private readonly _groupInfo          : eui.Group;
        private readonly _labelPlayersTitle  : GameUi.UiLabel;
        private readonly _listPlayer         : GameUi.UiScrollList<DataForPlayerRenderer, PlayerRenderer>;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinPlayerInfoPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.McrJoinTargetRoomIdChanged, callback: this._onNotifyMcrJoinTargetRoomIdChanged },
            ]);

            this.left   = 0;
            this.right  = 0;
            this.top    = 0;
            this.bottom = 0;

            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();
            this._updateComponentsForTargetRoomInfo();
        }

        protected async _onClosed(): Promise<void> {
            this._listPlayer.clear();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyMcrJoinTargetRoomIdChanged(e: egret.Event): void {
            this._updateComponentsForTargetRoomInfo();
        }

        private _updateComponentsForLanguage(): void {
            this._labelPlayersTitle.text = `${Lang.getText(Lang.Type.B0232)}:`;
        }
        private async _updateComponentsForTargetRoomInfo(): Promise<void> {
            const roomInfo      = await McrModel.Join.getTargetRoomInfo();
            const mapRawData    = roomInfo ? await WarMap.WarMapModel.getRawData(roomInfo.settingsForMcw.mapId) : null;
            const listPlayer    = this._listPlayer;
            if (mapRawData) {
                listPlayer.bindData(this._createDataForListPlayer(roomInfo, mapRawData.playersCountUnneutral));
            } else {
                listPlayer.clear();
            }
        }

        private _createDataForListPlayer(roomInfo: ProtoTypes.MultiCustomRoom.IMcrRoomInfo, mapPlayersCount: number): DataForPlayerRenderer[] {
            const playerInfoList    = roomInfo.playerDataList;
            const configVersion     = roomInfo.settingsForCommon.configVersion;
            const playerRuleList    = roomInfo.settingsForCommon.warRule.ruleForPlayers;
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= mapPlayersCount; ++playerIndex) {
                dataList.push({
                    configVersion,
                    playerIndex,
                    teamIndex   : BwHelpers.getTeamIndexByRuleForPlayers(playerRuleList, playerIndex),
                    playerData  : playerInfoList.find(v => v.playerIndex === playerIndex),
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        configVersion   : string;
        playerIndex     : number;
        teamIndex       : number;
        playerData      : ProtoTypes.Structure.IDataForPlayerInRoom | null;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer<DataForPlayerRenderer> {
        private _labelName : GameUi.UiLabel;
        private _labelIndex: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data;
            const playerData        = data.playerData;
            const userId            = playerData ? playerData.userId : null;
            this._labelIndex.text   = `${Lang.getPlayerForceName(data.playerIndex)}(${Lang.getPlayerTeamName(data.teamIndex)})`;

            const labelName = this._labelName;
            if (userId == null) {
                labelName.text = "????";
            } else {
                labelName.text = "";
                User.UserModel.getUserNickname(userId).then(name => {
                    labelName.text = `${name} (${ConfigManager.getCoNameAndTierText(data.configVersion, playerData.coId)})`;
                });
            }
        }
    }
}
