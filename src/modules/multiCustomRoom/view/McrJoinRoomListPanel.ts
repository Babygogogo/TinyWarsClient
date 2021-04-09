
namespace TinyWars.MultiCustomRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import WarMapModel      = WarMap.WarMapModel;
    import BwHelpers        = BaseWar.BwHelpers;
    import IMcrRoomInfo     = ProtoTypes.MultiCustomRoom.IMcrRoomInfo;

    export class McrJoinRoomListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrJoinRoomListPanel;

        private readonly _groupMapView          : eui.Group;
        private readonly _zoomMap               : GameUi.UiZoomableMap;
        private readonly _labelLoading          : GameUi.UiLabel;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : GameUi.UiLabel;
        private readonly _labelJoinRoom         : GameUi.UiLabel;
        private readonly _labelChooseRoom       : GameUi.UiLabel;

        private readonly _btnBack               : GameUi.UiButton;
        private readonly _btnNextStep           : GameUi.UiButton;

        private readonly _groupRoomList         : eui.Group;
        private readonly _listRoom              : GameUi.UiScrollList<DataForRoomRenderer, RoomRenderer>;
        private readonly _labelNoRoom           : GameUi.UiLabel;

        private _groupInfo          : eui.Group;
        private _labelMapName       : GameUi.UiLabel;
        private _labelDesigner      : GameUi.UiLabel;
        private _labelHasFogTitle   : GameUi.UiLabel;
        private _labelHasFog        : GameUi.UiLabel;
        private _labelWarComment    : GameUi.UiLabel;
        private _labelPlayersTitle  : GameUi.UiLabel;
        private _labelCommentTitle  : GameUi.UiLabel;
        private _listPlayer         : GameUi.UiScrollList<DataForPlayerRenderer, PlayerRenderer>;

        private _dataForListRoom    : DataForRoomRenderer[] = [];
        private _selectedRoomIndex  : number;

        public static show(): void {
            if (!McrJoinRoomListPanel._instance) {
                McrJoinRoomListPanel._instance = new McrJoinRoomListPanel();
            }
            McrJoinRoomListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (McrJoinRoomListPanel._instance) {
                await McrJoinRoomListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinRoomListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMcrGetJoinableRoomInfoList,  callback: this._onMsgMcrGetJoinableRoomInfoList },
                { type: Notify.Type.MsgMcrJoinRoom,                 callback: this._onMsgMcrJoinRoom },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._listRoom.setItemRenderer(RoomRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._showOpenAnimation();

            this._groupInfo.visible = false;
            this._updateComponentsForLanguage();

            McrProxy.reqMcrGetJoinableRoomInfoList();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();

            this._zoomMap.clearMap();
            this._listRoom.clear();
            this._listPlayer.clear();
            egret.Tween.removeTweens(this._groupInfo);
        }

        public async setSelectedIndex(newIndex: number): Promise<void> {
            const oldIndex         = this._selectedRoomIndex;
            const dataList         = this._dataForListRoom;
            this._selectedRoomIndex = dataList[newIndex] ? newIndex : undefined;

            if (dataList[oldIndex]) {
                this._listRoom.updateSingleData(oldIndex, dataList[oldIndex])
            };

            if (dataList[newIndex]) {
                this._listRoom.updateSingleData(newIndex, dataList[newIndex]);
                await this._showMap(newIndex);
            } else {
                this._zoomMap.clearMap();
                this._groupInfo.visible = false;
            }
        }
        public getSelectedIndex(): number {
            return this._selectedRoomIndex;
        }

        private _getSelectedRoomInfo(): IMcrRoomInfo | null {
            const data = this._dataForListRoom[this.getSelectedIndex()];
            return data ? data.roomInfo : null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private async _onMsgMcrGetJoinableRoomInfoList(e: egret.Event): Promise<void> {
            const newData        = this._createDataForListWar(await McrModel.getUnjoinedRoomInfoList());
            this._dataForListRoom = newData;

            if (newData.length > 0) {
                this._labelNoRoom.visible = false;
                this._listRoom.bindData(newData);
            } else {
                this._labelNoRoom.visible = true;
                this._listRoom.clear();
            }
            this.setSelectedIndex(0);
        }

        private _onMsgMcrJoinRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrJoinRoom.IS;
            this.close();
            McrRoomInfoPanel.show({ roomId: data.roomId });
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            McrMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
        }

        private async _onTouchedBtnNextStep(e: egret.TouchEvent): Promise<void> {
            const roomInfo = this._getSelectedRoomInfo();
            if (roomInfo) {
                if (roomInfo.settingsForMcw.warPassword) {
                    McrJoinPasswordPanel.show({ roomInfo });
                } else {
                    const joinData = McrModel.getFastJoinData(roomInfo);
                    if (joinData) {
                        McrProxy.reqMcrJoinRoom(joinData);
                    } else {
                        FloatText.show(Lang.getText(Lang.Type.A0145));
                        McrProxy.reqMcrGetJoinableRoomInfoList();
                    }
                }
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelLoading.text         = Lang.getText(Lang.Type.A0150);
            this._labelMultiPlayer.text     = Lang.getText(Lang.Type.B0137);
            this._labelJoinRoom.text        = Lang.getText(Lang.Type.B0580);
            this._labelChooseRoom.text      = Lang.getText(Lang.Type.B0581);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelNoRoom.text          = Lang.getText(Lang.Type.B0582);
            this._labelCommentTitle.text    = `${Lang.getText(Lang.Type.B0187)}:`;
            this._labelPlayersTitle.text    = `${Lang.getText(Lang.Type.B0232)}:`;
            this._labelHasFogTitle.text     = `${Lang.getText(Lang.Type.B0020)}:`;
            this._btnNextStep.label         = Lang.getText(Lang.Type.B0566);
        }

        private _createDataForListWar(infos: IMcrRoomInfo[]): DataForRoomRenderer[] {
            const data: DataForRoomRenderer[] = [];
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

        private _createDataForListPlayer(roomInfo: IMcrRoomInfo, mapPlayersCount: number): DataForPlayerRenderer[] {
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

        private async _showMap(index: number): Promise<void> {
            const roomInfo              = this._dataForListRoom[index].roomInfo;
            const mapId                 = roomInfo.settingsForMcw.mapId;
            const mapRawData            = await WarMapModel.getRawData(mapId);
            const hasFog                = roomInfo.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
            this._labelMapName.text     = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
            this._labelDesigner.text    = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
            this._labelHasFog.text      = Lang.getText(hasFog ? Lang.Type.B0012 : Lang.Type.B0001);
            this._labelHasFog.textColor = hasFog ? 0xFF0000 : 0x00FF00;
            this._labelWarComment.text  = roomInfo.settingsForMcw.warComment || "----";
            this._listPlayer.bindData(this._createDataForListPlayer(roomInfo, mapRawData.playersCountUnneutral));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});
            this._zoomMap.showMapByMapData(mapRawData);
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._groupMapView,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
            });
            Helpers.resetTween({
                obj         : this._groupNavigator,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupRoomList,
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._btnNextStep,
                beginProps  : { alpha: 0, right: -40 },
                endProps    : { alpha: 1, right: 0 },
            });
        }
        private async _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._groupMapView,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    callback    : resolve,
                });
                Helpers.resetTween({
                    obj         : this._groupNavigator,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
                });
                Helpers.resetTween({
                    obj         : this._groupRoomList,
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._btnNextStep,
                    beginProps  : { alpha: 1, right: 0 },
                    endProps    : { alpha: 0, right: -40 },
                });
            });
        }
    }

    type DataForRoomRenderer = {
        roomInfo: IMcrRoomInfo;
        index   : number;
        panel   : McrJoinRoomListPanel;
    }
    class RoomRenderer extends GameUi.UiListItemRenderer<DataForRoomRenderer> {
        private readonly _btnChoose     : GameUi.UiButton;
        private readonly _btnNext       : GameUi.UiButton;
        private readonly _labelName     : GameUi.UiLabel;
        private readonly _imgPassword   : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data                  = this.data;
            const warInfo               = data.roomInfo;
            const settingsForMcw        = warInfo.settingsForMcw;
            this.currentState           = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._imgPassword.visible   = !!settingsForMcw.warPassword;

            const warName = settingsForMcw.warName;
            if (warName) {
                this._labelName.text = warName;
            } else {
                WarMapModel.getMapNameInCurrentLanguage(warInfo.settingsForMcw.mapId).then(v => this._labelName.text = v);
            }
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const roomInfo = this.data.roomInfo;
            if (roomInfo.settingsForMcw.warPassword) {
                McrJoinPasswordPanel.show({ roomInfo });
            } else {
                const joinData = McrModel.getFastJoinData(roomInfo);
                if (joinData) {
                    McrProxy.reqMcrJoinRoom(joinData);
                } else {
                    FloatText.show(Lang.getText(Lang.Type.A0145));
                    McrProxy.reqMcrGetJoinableRoomInfoList();
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
