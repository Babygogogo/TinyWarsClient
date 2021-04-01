
namespace TinyWars.MultiFreeRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import WarMapModel      = WarMap.WarMapModel;
    import BwHelpers        = BaseWar.BwHelpers;
    import IMfrRoomInfo     = ProtoTypes.MultiFreeRoom.IMfrRoomInfo;

    export class MfrJoinRoomListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrJoinRoomListPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _listWar        : GameUi.UiScrollList<DataForWarRenderer>;
        private _labelNoWar     : GameUi.UiLabel;
        private _zoomMap        : GameUi.UiZoomableMap;
        private _btnBack        : GameUi.UiButton;

        private _groupInfo          : eui.Group;
        private _labelHasFogTitle   : GameUi.UiLabel;
        private _labelHasFog        : GameUi.UiLabel;
        private _labelWarComment    : GameUi.UiLabel;
        private _labelPlayersTitle  : GameUi.UiLabel;
        private _labelCommentTitle  : GameUi.UiLabel;
        private _listPlayer         : GameUi.UiScrollList<DataForPlayerRenderer>;

        private _dataForListWar     : DataForWarRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!MfrJoinRoomListPanel._instance) {
                MfrJoinRoomListPanel._instance = new MfrJoinRoomListPanel();
            }
            MfrJoinRoomListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (MfrJoinRoomListPanel._instance) {
                await MfrJoinRoomListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrJoinRoomListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMfrGetJoinableRoomInfoList,  callback: this._onMsgMfrGetJoinableRoomInfoList },
                { type: Notify.Type.MsgMfrJoinRoom,                 callback: this._onMsgMfrJoinRoom },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._groupInfo.visible = false;
            this._updateComponentsForLanguage();

            MfrProxy.reqMfrGetJoinableRoomInfoList();
        }

        protected async _onClosed(): Promise<void> {
            this._zoomMap.clearMap();
            this._listWar.clear();
            this._listPlayer.clear();
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const oldIndex         = this._selectedWarIndex;
            const dataList         = this._dataForListWar;
            this._selectedWarIndex = dataList[newIndex] ? newIndex : undefined;

            if (dataList[oldIndex]) {
                this._listWar.updateSingleData(oldIndex, dataList[oldIndex])
            };

            if (dataList[newIndex]) {
                this._listWar.updateSingleData(newIndex, dataList[newIndex]);
                await this._showMap(newIndex);
            } else {
                this._zoomMap.clearMap();
                this._groupInfo.visible = false;
            }
        }
        public getSelectedIndex(): number {
            return this._selectedWarIndex;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private async _onMsgMfrGetJoinableRoomInfoList(e: egret.Event): Promise<void> {
            const newData        = this._createDataForListWar(await MfrModel.getUnjoinedRoomInfoList());
            this._dataForListWar = newData;

            if (newData.length > 0) {
                this._labelNoWar.visible = false;
                this._listWar.bindData(newData);
            } else {
                this._labelNoWar.visible = true;
                this._listWar.clear();
            }
            this.setSelectedIndex(0);
        }

        private _onMsgMfrJoinRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrJoinRoom.IS;
            this.close();
            MfrRoomInfoPanel.show({ roomId: data.roomId });
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            MfrMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0023);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0210);
            this._labelCommentTitle.text    = `${Lang.getText(Lang.Type.B0187)}:`;
            this._labelPlayersTitle.text    = `${Lang.getText(Lang.Type.B0232)}:`;
            this._labelHasFogTitle.text     = `${Lang.getText(Lang.Type.B0020)}:`;
        }

        private _createDataForListWar(infos: IMfrRoomInfo[]): DataForWarRenderer[] {
            const data: DataForWarRenderer[] = [];
            if (infos) {
                for (let i = 0; i < infos.length; ++i) {
                    data.push({
                        roomInfo : infos[i],
                        index   : i,
                        panel   : this,
                    });
                }
            }

            return data;
        }

        private _createDataForListPlayer(roomInfo: IMfrRoomInfo): DataForPlayerRenderer[] {
            const playerInfoList    = roomInfo.playerDataList;
            const settingsForCommon = roomInfo.settingsForMfw.initialWarData.settingsForCommon;
            const configVersion     = settingsForCommon.configVersion;
            const playerRuleList    = settingsForCommon.warRule.ruleForPlayers;
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playerRuleList.playerRuleDataArray.length ; ++playerIndex) {
                dataList.push({
                    configVersion,
                    playerIndex,
                    teamIndex   : BwHelpers.getTeamIndexByRuleForPlayers(playerRuleList, playerIndex),
                    playerData  : playerInfoList.find(v => v.playerIndex === playerIndex),
                });
            }

            return dataList;
        }

        private async _showMap(index: number): Promise<void> {
            const roomInfo              = this._dataForListWar[index].roomInfo;
            const settingsForMfw        = roomInfo.settingsForMfw;
            const warData               = settingsForMfw.initialWarData;
            const hasFog                = warData.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
            this._labelHasFog.text      = Lang.getText(hasFog ? Lang.Type.B0012 : Lang.Type.B0001);
            this._labelHasFog.textColor = hasFog ? 0xFF0000 : 0x00FF00;
            this._labelWarComment.text  = settingsForMfw.warComment || "----";
            this._listPlayer.bindData(this._createDataForListPlayer(roomInfo));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});
            this._zoomMap.showMapByWarData(warData);
        }
    }

    type DataForWarRenderer = {
        roomInfo    : IMfrRoomInfo;
        index       : number;
        panel       : MfrJoinRoomListPanel;
    }

    class WarRenderer extends GameUi.UiListItemRenderer {
        private _btnChoose      : GameUi.UiButton;
        private _btnNext        : GameUi.UiButton;
        private _labelName      : GameUi.UiLabel;
        private _labelPassword  : GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data as DataForWarRenderer;
            const settingsForMfw        = data.roomInfo.settingsForMfw;
            this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._labelPassword.text    = settingsForMfw.warPassword ? Lang.getText(Lang.Type.B0448) : ``;
            this._labelName.text        = settingsForMfw.warName || Lang.getText(Lang.Type.B0555);
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data      = this.data as DataForWarRenderer;
            const roomInfo  = data.roomInfo;
            if (roomInfo.settingsForMfw.warPassword) {
                MfrJoinPasswordPanel.show({ roomInfo });
            } else {
                const joinData = MfrModel.Join.getFastJoinData(roomInfo);
                if (joinData) {
                    MfrProxy.reqMfrJoinRoom(joinData);
                } else {
                    FloatText.show(Lang.getText(Lang.Type.A0145));
                    MfrProxy.reqMfrGetJoinableRoomInfoList();
                }
            }
        }
    }

    type DataForPlayerRenderer = {
        configVersion   : string;
        playerIndex     : number;
        teamIndex       : number;
        playerData      : ProtoTypes.Structure.IDataForPlayerInRoom | null;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer {
        private _labelName : GameUi.UiLabel;
        private _labelIndex: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
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
