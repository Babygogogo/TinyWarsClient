
namespace TinyWars.MultiRankRoom {
    import Notify       = Utility.Notify;
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import ProtoTypes   = Utility.ProtoTypes;
    import BwHelpers    = BaseWar.BwHelpers;
    import WarMapModel  = WarMap.WarMapModel;
    import IMrrRoomInfo = ProtoTypes.MultiRankRoom.IMrrRoomInfo;

    export class MrrMyRoomListPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrMyRoomListPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _listWar        : GameUi.UiScrollList;
        private _labelNoWar     : GameUi.UiLabel;
        private _zoomMap        : GameUi.UiZoomableMap;
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
            if (!MrrMyRoomListPanel._instance) {
                MrrMyRoomListPanel._instance = new MrrMyRoomListPanel();
            }
            MrrMyRoomListPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (MrrMyRoomListPanel._instance) {
                await MrrMyRoomListPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/multiRankRoom/MrrMyRoomListPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMrrGetMyRoomPublicInfoList,  callback: this._onMsgMrrGetMyRoomPublicInfoList },
                { type: Notify.Type.MrrMyRoomAdded,                 callback: this._onNotifyMrrMyRoomAdded },
                { type: Notify.Type.MrrMyRoomDeleted,               callback: this._onNotifyMrrMyRoomDeleted },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,   callback: this._onTouchTapBtnBack },
            ]);
            this._listWar.setItemRenderer(WarRenderer);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._updateComponentsForLanguage();

            this._groupInfo.visible = false;
            MrrProxy.reqMrrGetMyRoomPublicInfoList();
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

        private _onMsgMrrGetMyRoomPublicInfoList(e: egret.Event): void {
            this._updateComponentsForRoomList();
        }

        private _onNotifyMrrMyRoomAdded(e: egret.Event): void {
            this._updateComponentsForRoomList();
        }

        private _onNotifyMrrMyRoomDeleted(e: egret.Event): void {
            this._updateComponentsForRoomList();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            MrrMainMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListWar(infoList: IMrrRoomInfo[]): DataForWarRenderer[] {
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

        private _createDataForListPlayer(roomInfo: IMrrRoomInfo, mapRawData: ProtoTypes.Map.IMapRawData): DataForPlayerRenderer[] {
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
            const mapId                 = roomInfo.settingsForMrw.mapId;
            const mapRawData            = await WarMapModel.getRawData(mapId);
            this._labelMapName.text     = Lang.getFormattedText(Lang.Type.F0000, await WarMapModel.getMapNameInCurrentLanguage(mapId));
            this._labelDesigner.text    = Lang.getFormattedText(Lang.Type.F0001, mapRawData.designerName);
            this._labelHasFog.text      = Lang.getFormattedText(Lang.Type.F0005, Lang.getText(roomInfo.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault ? Lang.Type.B0012 : Lang.Type.B0013));
            this._listPlayer.bindData(this._createDataForListPlayer(roomInfo, mapRawData));

            this._groupInfo.visible      = true;
            this._groupInfo.alpha        = 1;
            egret.Tween.removeTweens(this._groupInfo);
            egret.Tween.get(this._groupInfo).wait(8000).to({alpha: 0}, 1000).call(() => {this._groupInfo.visible = false; this._groupInfo.alpha = 1});
            this._zoomMap.showMap(mapRawData);
        }

        private _updateComponentsForLanguage(): void {
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelMenuTitle.text       = Lang.getText(Lang.Type.B0410);
            this._labelNoWar.text           = Lang.getText(Lang.Type.B0210);
            this._labelPlayersTitle.text    = `${Lang.getText(Lang.Type.B0232)}:`;
        }

        private async _updateComponentsForRoomList(): Promise<void> {
            const newData        = this._createDataForListWar(MrrModel.getMyRoomInfoList());
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
        roomInfo: IMrrRoomInfo;
        index   : number;
        panel   : MrrMyRoomListPanel;
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
            WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForMrw.mapId).then(v => labelName.text = v);
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            const data = this.data as DataForWarRenderer;
            data.panel.setSelectedIndex(data.index);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            const data      = this.data as DataForWarRenderer;
            const roomInfo  = data.roomInfo;
            MrrModel.SelfSettings.resetData(roomInfo);
            MrrRoomInfoPanel.show({ roomId: roomInfo.roomId });
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
