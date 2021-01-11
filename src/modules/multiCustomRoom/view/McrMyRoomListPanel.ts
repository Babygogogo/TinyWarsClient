
namespace TinyWars.MultiCustomRoom {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import BwHelpers    = BaseWar.BwHelpers;
    import WarMapModel  = WarMap.WarMapModel;

    export class McrMyRoomListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrMyRoomListPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _listWar        : GameUi.UiScrollList;
        private _labelNoWar     : GameUi.UiLabel;
        private _zoomMap        : GameUi.UiZoomableComponent;
        private _btnBack        : GameUi.UiButton;

        private _groupInfo          : eui.Group;
        private _labelMapName       : GameUi.UiLabel;
        private _labelDesigner      : GameUi.UiLabel;
        private _labelHasFog        : GameUi.UiLabel;
        private _labelWarComment    : GameUi.UiLabel;
        private _listPlayer         : GameUi.UiScrollList;
        private _labelCommentTitle  : GameUi.UiLabel;
        private _labelPlayersTitle  : GameUi.UiLabel;

        private _dataForListWar     : DataForWarRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!McrMyRoomListPanel._instance) {
                McrMyRoomListPanel._instance = new McrMyRoomListPanel();
            }
            McrMyRoomListPanel._instance.open(undefined);
        }
        public static hide(): void {
            if (McrMyRoomListPanel._instance) {
                McrMyRoomListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/multiCustomRoom/McrMyRoomListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMcrGetJoinedRoomInfoList,    callback: this._onMsgMcrGetJoinedRoomInfoList },
                { type: Notify.Type.MsgMcrExitRoom,                 callback: this._onMsgMcrExitRoom },
                { type: Notify.Type.MsgMcrDeletePlayer,             callback: this._onMsgMcrDeletePlayer },
                { type: Notify.Type.MsgMcrDeleteRoom,               callback: this._onMsgMcrDeleteRoom },
                { type: Notify.Type.MsgMcrStartWar,                 callback: this._onMsgMcrStartWar },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();

            this._groupInfo.visible = false;
            this._zoomMap.setMouseWheelListenerEnabled(true);
            this._zoomMap.setTouchListenerEnabled(true);
            McrProxy.reqMcrGetJoinedRoomInfoList();
        }

        protected _onClosed(): void {
            this._zoomMap.removeAllContents();
            this._zoomMap.setMouseWheelListenerEnabled(false);
            this._zoomMap.setTouchListenerEnabled(false);
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
                this._zoomMap.removeAllContents();
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

        private _onMsgMcrGetJoinedRoomInfoList(e: egret.Event): void {
            this._updateComponentsForRoomList();
        }

        private _onMsgMcrExitRoom(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0016));
        }

        private _onMsgMcrDeletePlayer(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrDeletePlayer.IS;
            if (data.targetUserId === User.UserModel.getSelfUserId()) {
                this._updateComponentsForRoomList();
            }
        }

        private _onMsgMcrDeleteRoom(e: egret.Event): void {
            this._updateComponentsForRoomList();
        }

        private _onMsgMcrStartWar(e: egret.Event): void {
            this._updateComponentsForRoomList();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            McrMyRoomListPanel.hide();
            McrMainMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListWar(infos: ProtoTypes.MultiCustomRoom.IMcrRoomInfo[]): DataForWarRenderer[] {
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

        private _createDataForListPlayer(roomInfo: ProtoTypes.MultiCustomRoom.IMcrRoomInfo, mapRawData: ProtoTypes.Map.IMapRawData): DataForPlayerRenderer[] {
            const playerDataList    = roomInfo.playerDataList;
            const playerRules       = roomInfo.settingsForCommon.warRule.ruleForPlayers;
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= mapRawData.playersCountUnneutral; ++playerIndex) {
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
            const settingsForCommon     = roomInfo.settingsForCommon;
            const mapId                 = settingsForCommon.mapId;
            const mapRawData            = await WarMapModel.getRawData(mapId);
            this._labelMapName.text     = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
            this._labelDesigner.text    = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
            this._labelHasFog.text      = Lang.getFormattedText(Lang.Type.F0005, Lang.getText(settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault ? Lang.Type.B0012 : Lang.Type.B0013));
            this._labelWarComment.text  = roomInfo.settingsForMcw.warComment || "----";
            this._listPlayer.bindData(this._createDataForListPlayer(roomInfo, mapRawData));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});

            const tileMapView = new WarMap.WarMapTileMapView();
            tileMapView.init(mapRawData.mapWidth, mapRawData.mapHeight);
            tileMapView.updateWithTileDataList(mapRawData.tileDataList);

            const unitMapView = new WarMap.WarMapUnitMapView();
            unitMapView.initWithMapRawData(mapRawData);

            const gridSize = Utility.ConfigManager.getGridSize();
            this._zoomMap.removeAllContents();
            this._zoomMap.setContentWidth(mapRawData.mapWidth * gridSize.width);
            this._zoomMap.setContentHeight(mapRawData.mapHeight * gridSize.height);
            this._zoomMap.addContent(tileMapView);
            this._zoomMap.addContent(unitMapView);
            this._zoomMap.setContentScale(0, true);
        }

        private _updateComponentsForLanguage(): void {
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0410);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0210);
            this._labelCommentTitle.text    = `${Lang.getText(Lang.Type.B0187)}:`;
            this._labelPlayersTitle.text    = `${Lang.getText(Lang.Type.B0232)}:`;
        }

        private async _updateComponentsForRoomList(): Promise<void> {
            const newData        = this._createDataForListWar(await McrModel.getJoinedRoomInfoList());
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
        roomInfo: ProtoTypes.MultiCustomRoom.IMcrRoomInfo;
        index   : number;
        panel   : McrMyRoomListPanel;
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
            this._imgRed.visible    = await McrModel.checkIsRedForRoom(roomInfo.roomId);

            const warName   = roomInfo.settingsForMcw.warName;
            const labelName = this._labelName;
            if (warName) {
                labelName.text = warName;
            } else {
                labelName.text = "";
                labelName.text = await WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForCommon.mapId);
            }
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            McrRoomInfoPanel.show({ roomId: data.roomInfo.roomId });
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
