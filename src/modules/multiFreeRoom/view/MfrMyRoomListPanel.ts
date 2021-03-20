
namespace TinyWars.MultiFreeRoom {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import BwHelpers    = BaseWar.BwHelpers;
    import WarMapModel  = WarMap.WarMapModel;
    import IMfrRoomInfo = ProtoTypes.MultiFreeRoom.IMfrRoomInfo;

    export class MfrMyRoomListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrMyRoomListPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _listWar        : GameUi.UiScrollList;
        private _labelNoWar     : GameUi.UiLabel;
        private _zoomMap        : GameUi.UiZoomableMap;
        private _btnBack        : GameUi.UiButton;

        private _groupInfo          : eui.Group;
        private _labelHasFog        : GameUi.UiLabel;
        private _labelWarComment    : GameUi.UiLabel;
        private _listPlayer         : GameUi.UiScrollList;
        private _labelCommentTitle  : GameUi.UiLabel;
        private _labelPlayersTitle  : GameUi.UiLabel;

        private _dataForListWar     : DataForWarRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!MfrMyRoomListPanel._instance) {
                MfrMyRoomListPanel._instance = new MfrMyRoomListPanel();
            }
            MfrMyRoomListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (MfrMyRoomListPanel._instance) {
                await MfrMyRoomListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrMyRoomListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMfrGetJoinedRoomInfoList,    callback: this._onMsgMfrGetJoinedRoomInfoList },
                { type: Notify.Type.MsgMfrExitRoom,                 callback: this._onMsgMfrExitRoom },
                { type: Notify.Type.MsgMfrDeletePlayer,             callback: this._onMsgMfrDeletePlayer },
                { type: Notify.Type.MsgMfrDeleteRoom,               callback: this._onMsgMfrDeleteRoom },
                { type: Notify.Type.MsgMfrStartWar,                 callback: this._onMsgMfrStartWar },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();

            this._groupInfo.visible = false;
            MfrProxy.reqMfrGetJoinedRoomInfoList();
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
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onMsgMfrGetJoinedRoomInfoList(e: egret.Event): void {
            this._updateComponentsForRoomList();
        }

        private _onMsgMfrExitRoom(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0016));
        }

        private _onMsgMfrDeletePlayer(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrDeletePlayer.IS;
            if (data.targetUserId === User.UserModel.getSelfUserId()) {
                this._updateComponentsForRoomList();
            }
        }

        private _onMsgMfrDeleteRoom(e: egret.Event): void {
            this._updateComponentsForRoomList();
        }

        private _onMsgMfrStartWar(e: egret.Event): void {
            this._updateComponentsForRoomList();
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
        private _createDataForListWar(infos: IMfrRoomInfo[]): DataForWarRenderer[] {
            const data: DataForWarRenderer[] = [];
            if (infos) {
                for (let i = 0; i < infos.length; ++i) {
                    data.push({
                        roomInfo: infos[i],
                        index   : i,
                        panel   : this,
                    });
                }
            }

            return data;
        }

        private _createDataForListPlayer(roomInfo: IMfrRoomInfo): DataForPlayerRenderer[] {
            const playerDataList    = roomInfo.playerDataList;
            const playerRules       = roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule.ruleForPlayers;
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playerRules.playerRuleDataArray.length; ++playerIndex) {
                const playerData = playerDataList.find(v => v.playerIndex === playerIndex);
                dataList.push({
                    playerIndex,
                    userId      : playerData ? playerData.userId : null,
                    teamIndex   : BwHelpers.getTeamIndexByRuleForPlayers(playerRules, playerIndex),
                });
            }

            return dataList;
        }

        private async _showMap(index: number): Promise<void> {
            const roomInfo              = this._dataForListWar[index].roomInfo;
            const settingsForMfw        = roomInfo.settingsForMfw;
            const warData               = settingsForMfw.initialWarData;
            this._labelHasFog.text      = Lang.getFormattedText(Lang.Type.F0005, Lang.getText(warData.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault ? Lang.Type.B0012 : Lang.Type.B0013));
            this._labelWarComment.text  = settingsForMfw.warComment || "----";
            this._listPlayer.bindData(this._createDataForListPlayer(roomInfo));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});
            this._zoomMap.showMapByWarData(warData);
        }

        private _updateComponentsForLanguage(): void {
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0410);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0210);
            this._labelCommentTitle.text    = `${Lang.getText(Lang.Type.B0187)}:`;
            this._labelPlayersTitle.text    = `${Lang.getText(Lang.Type.B0232)}:`;
        }

        private async _updateComponentsForRoomList(): Promise<void> {
            const newData        = this._createDataForListWar(await MfrModel.getJoinedRoomInfoList());
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
    }

    type DataForWarRenderer = {
        roomInfo: IMfrRoomInfo;
        index   : number;
        panel   : MfrMyRoomListPanel;
    }

    class WarRenderer extends GameUi.UiListItemRenderer {
        private _btnChoose  : GameUi.UiButton;
        private _btnNext    : GameUi.UiButton;
        private _labelName  : GameUi.UiLabel;
        private _imgRed     : GameUi.UiImage;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            const data              = this.data as DataForWarRenderer;
            const roomInfo          = data.roomInfo;
            this.currentState       = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            this._imgRed.visible    = await MfrModel.checkIsRedForRoom(roomInfo.roomId);
            this._labelName.text    = roomInfo.settingsForMfw.warName || Lang.getText(Lang.Type.B0555);
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            MfrRoomInfoPanel.show({ roomId: data.roomInfo.roomId });
        }
    }

    type DataForPlayerRenderer = {
        playerIndex : number;
        userId      : number | null;
        teamIndex   : number;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer {
        private _labelName : GameUi.UiLabel;
        private _labelIndex: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            this._labelIndex.text   = `${Lang.getPlayerForceName(data.playerIndex)} (${Lang.getPlayerTeamName(data.teamIndex)})`;
            User.UserModel.getUserNickname(data.userId).then(name => this._labelName.text = name || "----");
        }
    }
}
