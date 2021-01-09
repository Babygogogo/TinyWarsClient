
namespace TinyWars.RankMatchRoom {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import BwHelpers    = BaseWar.BwHelpers;
    import WarMapModel  = WarMap.WarMapModel;
    import IRmrRoomInfo = ProtoTypes.RankMatchRoom.IRmrRoomInfo;

    export class RmrMyRoomListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: RmrMyRoomListPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _listWar        : GameUi.UiScrollList;
        private _labelNoWar     : GameUi.UiLabel;
        private _zoomMap        : GameUi.UiZoomableComponent;
        private _btnBack        : GameUi.UiButton;

        private _groupInfo          : eui.Group;
        private _labelMapName       : GameUi.UiLabel;
        private _labelDesigner      : GameUi.UiLabel;
        private _labelHasFog        : GameUi.UiLabel;
        private _listPlayer         : GameUi.UiScrollList;
        private _labelPlayersTitle  : GameUi.UiLabel;

        private _dataForListWar     : DataForWarRenderer[] = [];
        private _selectedWarIndex   : number;

        public static show(): void {
            if (!RmrMyRoomListPanel._instance) {
                RmrMyRoomListPanel._instance = new RmrMyRoomListPanel();
            }
            RmrMyRoomListPanel._instance.open();
        }
        public static hide(): void {
            if (RmrMyRoomListPanel._instance) {
                RmrMyRoomListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/rankMatchRoom/RmrMyRoomListPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgRmrGetMyRoomPublicInfoList,  callback: this._onMsgRmrGetMyRoomPublicInfoList },
                { type: Notify.Type.RmrMyRoomAdded,                 callback: this._onNotifyRmrMyRoomAdded },
                { type: Notify.Type.RmrMyRoomDeleted,               callback: this._onNotifyRmrMyRoomDeleted },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            this._groupInfo.visible = false;
            this._zoomMap.setMouseWheelListenerEnabled(true);
            this._zoomMap.setTouchListenerEnabled(true);
            RmrProxy.reqRmrGetMyRoomPublicInfoList();
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

        private _onMsgRmrGetMyRoomPublicInfoList(e: egret.Event): void {
            this._updateComponentsForRoomList();
        }

        private _onNotifyRmrMyRoomAdded(e: egret.Event): void {
            this._updateComponentsForRoomList();
        }

        private _onNotifyRmrMyRoomDeleted(e: egret.Event): void {
            this._updateComponentsForRoomList();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            RmrMainMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListWar(infoList: IRmrRoomInfo[]): DataForWarRenderer[] {
            const data: DataForWarRenderer[] = [];
            let index = 0;
            for (const roomInfo of infoList) {
                data.push({
                    roomInfo,
                    index,
                    panel   : this,
                });
                ++index;
            }

            return data;
        }

        private _createDataForListPlayer(roomInfo: IRmrRoomInfo, mapRawData: ProtoTypes.Map.IMapRawData): DataForPlayerRenderer[] {
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
            this._labelPlayersTitle.text    = `${Lang.getText(Lang.Type.B0232)}:`;
        }

        private async _updateComponentsForRoomList(): Promise<void> {
            const newData        = this._createDataForListWar(RmrModel.getMyRoomInfoList());
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
        roomInfo: IRmrRoomInfo;
        index   : number;
        panel   : RmrMyRoomListPanel;
    }

    class WarRenderer extends GameUi.UiListItemRenderer {
        private _btnChoose: GameUi.UiButton;
        private _btnNext  : GameUi.UiButton;
        private _labelName: GameUi.UiLabel;

        protected childrenCreated(): void {
            super.childrenCreated();

            this._btnChoose.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnChoose, this);
            this._btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onTouchTapBtnNext, this);
        }

        protected dataChanged(): void {
            super.dataChanged();

            const data          = this.data as DataForWarRenderer;
            const roomInfo      = data.roomInfo;
            const labelName     = this._labelName;
            this.currentState   = data.index === data.panel.getSelectedIndex() ? Types.UiState.Down : Types.UiState.Up;
            labelName.text      = "";
            WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForCommon.mapId).then(v => labelName.text = v);
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data      = this.data as DataForWarRenderer;
            const roomInfo  = data.roomInfo;
            RmrModel.SelfSettings.resetData(roomInfo);
            RmrRoomInfoPanel.show(roomInfo.roomId);
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
