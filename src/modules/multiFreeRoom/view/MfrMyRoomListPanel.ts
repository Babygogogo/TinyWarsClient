
namespace TinyWars.MultiFreeRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import WarMapModel      = WarMap.WarMapModel;

    export class MfrMyRoomListPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrMyRoomListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : GameUi.UiTab<DataForTabItemRenderer, OpenDataForMfrRoomMapInfoPage | OpenDataForMfrRoomPlayerInfoPage | OpenDataForMfrRoomAdvancedSettingsPage | OpenDataForMfrRoomBasicSettingsPage>;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : GameUi.UiLabel;
        private readonly _labelFreeMode         : GameUi.UiLabel;
        private readonly _labelMyRoom           : GameUi.UiLabel;

        private readonly _btnBack               : GameUi.UiButton;
        private readonly _btnNextStep           : GameUi.UiButton;

        private readonly _groupRoomList         : eui.Group;
        private readonly _listRoom              : GameUi.UiScrollList<DataForRoomRenderer>;
        private readonly _labelNoRoom           : GameUi.UiLabel;
        private readonly _labelLoading          : GameUi.UiLabel;

        private _hasReceivedData    = false;

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
                { type: Notify.Type.LanguageChanged,                    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MfrJoinedPreviewingRoomIdChanged,   callback: this._onNotifyMfrJoinedPreviewingRoomIdChanged },
                { type: Notify.Type.MsgMfrGetJoinedRoomInfoList,        callback: this._onNotifyMsgMfrGetJoinedRoomInfoList },
                { type: Notify.Type.MsgMfrCreateRoom,                   callback: this._onNotifyMsgCreateRoom },
                { type: Notify.Type.MsgMfrDeleteRoomByServer,           callback: this._onNotifyMsgMfrDeleteRoomByServer },
                { type: Notify.Type.MsgMfrJoinRoom,                     callback: this._onNotifyMsgMfrJoinRoom },
                { type: Notify.Type.MsgMfrDeletePlayer,                 callback: this._onNotifyMsgMfrDeletePlayer },
                { type: Notify.Type.MsgMfrExitRoom,                     callback: this._onNotifyMsgMfrExitRoom },
            ]);
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchTapBtnBack },
                { ui: this._btnNextStep,    callback: this._onTouchedBtnNextStep },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
            this._listRoom.setItemRenderer(RoomRenderer);

            this._showOpenAnimation();

            this._hasReceivedData = false;
            this._initTabSettings();
            this._updateComponentsForLanguage();
            this._updateGroupRoomList();
            this._updateComponentsForPreviewingRoomInfo();

            MfrProxy.reqMfrGetJoinedRoomInfoList();
        }

        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMfrJoinedPreviewingRoomIdChanged(e: egret.Event): void {
            this._updateComponentsForPreviewingRoomInfo();
        }

        private _onNotifyMsgMfrGetJoinedRoomInfoList(e: egret.Event): void {
            this._hasReceivedData = true;
            this._updateGroupRoomList();
            this._updateComponentsForPreviewingRoomInfo();
        }

        private _onNotifyMsgCreateRoom(e: egret.Event): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrDeleteRoomByServer(e: egret.Event): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrJoinRoom(e: egret.Event): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrDeletePlayer(e: egret.Event): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrExitRoom(e: egret.Event): void {
            this._updateGroupRoomList();
        }

        private _onTouchTapBtnBack(e: egret.TouchEvent): void {
            this.close();
            MfrMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
        }

        private _onTouchedBtnNextStep(e: egret.TouchEvent): void {
            const roomId = MfrModel.Joined.getPreviewingRoomId();
            if (roomId != null) {
                this.close();
                MfrRoomInfoPanel.show({
                    roomId,
                });
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _initTabSettings(): void {
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0298) },
                    pageClass   : MfrRoomMapInfoPage,
                    pageData    : { roomId: null } as OpenDataForMfrRoomMapInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0224) },
                    pageClass   : MfrRoomPlayerInfoPage,
                    pageData    : { roomId: null } as OpenDataForMfrRoomPlayerInfoPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : MfrRoomBasicSettingsPage,
                    pageData    : { roomId: null } as OpenDataForMfrRoomBasicSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0003) },
                    pageClass   : MfrRoomAdvancedSettingsPage,
                    pageData    : { roomId: null } as OpenDataForMfrRoomAdvancedSettingsPage,
                },
            ]);
        }

        private _updateComponentsForLanguage(): void {
            this._labelLoading.text         = Lang.getText(Lang.Type.A0040);
            this._labelMultiPlayer.text     = Lang.getText(Lang.Type.B0137);
            this._labelFreeMode.text        = Lang.getText(Lang.Type.B0557);
            this._labelMyRoom.text          = Lang.getText(Lang.Type.B0410);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelNoRoom.text          = Lang.getText(Lang.Type.B0582);
            this._btnNextStep.label         = Lang.getText(Lang.Type.B0398);
        }

        private _updateGroupRoomList(): void {
            const labelLoading  = this._labelLoading;
            const labelNoRoom   = this._labelNoRoom;
            const listRoom      = this._listRoom;
            if (!this._hasReceivedData) {
                labelLoading.visible    = true;
                labelNoRoom.visible     = false;
                listRoom.clear();

            } else {
                const dataArray         = this._createDataForListRoom();
                labelLoading.visible    = false;
                labelNoRoom.visible     = !dataArray.length;
                listRoom.bindData(dataArray);

                const roomId = MfrModel.Joined.getPreviewingRoomId();
                if (dataArray.every(v => v.roomId != roomId)) {
                    MfrModel.Joined.setPreviewingRoomId(dataArray.length ? dataArray[0].roomId : null);
                }
            }
        }

        private _updateComponentsForPreviewingRoomInfo(): void {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const roomId        = MfrModel.Joined.getPreviewingRoomId();
            if ((!this._hasReceivedData) || (roomId == null)) {
                groupTab.visible    = false;
                btnNextStep.visible = false;
            } else {
                groupTab.visible    = true;
                btnNextStep.visible = true;

                const tab = this._tabSettings;
                tab.updatePageData(0, { roomId } as OpenDataForMfrRoomMapInfoPage);
                tab.updatePageData(1, { roomId } as OpenDataForMfrRoomPlayerInfoPage);
                tab.updatePageData(2, { roomId } as OpenDataForMfrRoomBasicSettingsPage);
                tab.updatePageData(3, { roomId } as OpenDataForMfrRoomAdvancedSettingsPage);
            }
        }

        private _createDataForListRoom(): DataForRoomRenderer[] {
            const dataArray: DataForRoomRenderer[] = [];
            for (const roomId of MfrModel.getJoinedRoomIdSet()) {
                dataArray.push({
                    roomId,
                });
            }

            return dataArray.sort((v1, v2) => v1.roomId - v2.roomId);
        }

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._btnBack,
                beginProps  : { alpha: 0, y: -20 },
                endProps    : { alpha: 1, y: 20 },
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
                beginProps  : { alpha: 0, left: -20 },
                endProps    : { alpha: 1, left: 20 },
            });
            Helpers.resetTween({
                obj         : this._groupTab,
                beginProps  : { alpha: 0, },
                endProps    : { alpha: 1, },
            });
        }
        private async _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._btnBack,
                    beginProps  : { alpha: 1, y: 20 },
                    endProps    : { alpha: 0, y: -20 },
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
                    beginProps  : { alpha: 1, left: 20 },
                    endProps    : { alpha: 0, left: -20 },
                });
                Helpers.resetTween({
                    obj         : this._groupTab,
                    beginProps  : { alpha: 1, },
                    endProps    : { alpha: 0, },
                });
            });
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    }
    class TabItemRenderer extends GameUi.UiTabItemRenderer<DataForTabItemRenderer> {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            this._labelName.text = this.data.name;
        }
    }

    type DataForRoomRenderer = {
        roomId: number;
    }
    class RoomRenderer extends GameUi.UiListItemRenderer<DataForRoomRenderer> {
        private readonly _btnChoose     : GameUi.UiButton;
        private readonly _btnNext       : GameUi.UiButton;
        private readonly _labelName     : GameUi.UiLabel;
        private readonly _imgRed        : GameUi.UiLabel;

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnChoose,  callback: this._onTouchTapBtnChoose },
                { ui: this._btnNext,    callback: this._onTouchTapBtnNext },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.MfrJoinedPreviewingRoomIdChanged,   callback: this._onNotifyMfrJoinedPreviewingRoomIdChanged },
            ]);
        }

        protected async dataChanged(): Promise<void> {
            super.dataChanged();

            this._updateState();

            const roomId            = this.data.roomId;
            const roomInfo          = await MfrModel.getRoomInfo(roomId);
            this._imgRed.visible    = await MfrModel.checkIsRedForRoom(roomId);
            this._labelName.text    = roomInfo ? roomInfo.settingsForMfw.warName || `--` : `--`;
        }

        private _onNotifyMfrJoinedPreviewingRoomIdChanged(e: egret.Event): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            MfrModel.Joined.setPreviewingRoomId(this.data.roomId);
        }

        private _onTouchTapBtnNext(e: egret.TouchEvent): void {
            MfrMyRoomListPanel.hide();
            MfrRoomInfoPanel.show({
                roomId  : this.data.roomId,
            });
        }

        private _updateState(): void {
            this.currentState = this.data.roomId === MfrModel.Joined.getPreviewingRoomId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}
