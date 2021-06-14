
namespace TinyWars.MultiFreeRoom {
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import WarMapModel      = WarMap.WarMapModel;

    export class MfrJoinRoomListPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrJoinRoomListPanel;

        private readonly _groupTab              : eui.Group;
        private readonly _tabSettings           : GameUi.UiTab<DataForTabItemRenderer, OpenDataForMfrRoomMapInfoPage | OpenDataForMfrRoomAdvancedSettingsPage | OpenDataForMfrRoomBasicSettingsPage | OpenDataForMfrRoomPlayerInfoPage>;

        private readonly _groupNavigator        : eui.Group;
        private readonly _labelMultiPlayer      : GameUi.UiLabel;
        private readonly _labelFreeMode         : GameUi.UiLabel;
        private readonly _labelJoinRoom         : GameUi.UiLabel;

        private readonly _btnBack               : GameUi.UiButton;
        private readonly _btnNextStep           : GameUi.UiButton;

        private readonly _groupRoomList         : eui.Group;
        private readonly _listRoom              : GameUi.UiScrollList<DataForRoomRenderer>;
        private readonly _labelNoRoom           : GameUi.UiLabel;
        private readonly _labelLoading          : GameUi.UiLabel;

        private _hasReceivedData    = false;

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
                { type: Notify.Type.MfrJoinTargetRoomIdChanged,     callback: this._onNotifyMfrJoinTargetRoomIdChanged },
                { type: Notify.Type.MsgMfrGetJoinableRoomInfoList,  callback: this._onNotifyMsgMfrGetJoinableRoomInfoList },
                { type: Notify.Type.MsgMfrCreateRoom,               callback: this._onNotifyMsgCreateRoom },
                { type: Notify.Type.MsgMfrDeleteRoomByServer,       callback: this._onNotifyMsgMfrDeleteRoomByServer },
                { type: Notify.Type.MsgMfrJoinRoom,                 callback: this._onNotifyMsgMfrJoinRoom },
                { type: Notify.Type.MsgMfrDeletePlayer,             callback: this._onNotifyMsgMfrDeletePlayer },
                { type: Notify.Type.MsgMfrExitRoom,                 callback: this._onNotifyMsgMfrExitRoom },
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
            this._updateComponentsForTargetRoomInfo();

            MfrProxy.reqMfrGetJoinableRoomInfoList();
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

        private _onNotifyMfrJoinTargetRoomIdChanged(): void {
            this._updateComponentsForTargetRoomInfo();
        }

        private async _onNotifyMsgMfrGetJoinableRoomInfoList(e: egret.Event): Promise<void> {
            this._hasReceivedData = true;
            this._updateGroupRoomList();
            this._updateComponentsForTargetRoomInfo();
        }

        private _onNotifyMsgCreateRoom(e: egret.Event): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrDeleteRoomByServer(e: egret.Event): void {
            this._updateGroupRoomList();
        }

        private _onNotifyMsgMfrJoinRoom(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrJoinRoom.IS;
            if (data.userId === User.UserModel.getSelfUserId()) {
                this.close();
                MfrRoomInfoPanel.show({ roomId: data.roomId });
            }
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

        private async _onTouchedBtnNextStep(e: egret.TouchEvent): Promise<void> {
            const roomInfo = await MfrModel.getRoomInfo(MfrModel.Join.getTargetRoomId());
            if (roomInfo) {
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
            this._labelJoinRoom.text        = Lang.getText(Lang.Type.B0580);
            this._btnBack.label             = Lang.getText(Lang.Type.B0146);
            this._labelNoRoom.text          = Lang.getText(Lang.Type.B0582);
            this._btnNextStep.label         = Lang.getText(Lang.Type.B0583);
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

                const roomId = MfrModel.Join.getTargetRoomId();
                if (dataArray.every(v => v.roomId != roomId)) {
                    MfrModel.Join.setTargetRoomId(dataArray.length ? dataArray[0].roomId : null);
                }
            }
        }

        private async _updateComponentsForTargetRoomInfo(): Promise<void> {
            const groupTab      = this._groupTab;
            const btnNextStep   = this._btnNextStep;
            const roomId        = MfrModel.Join.getTargetRoomId();
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
            for (const roomId of MfrModel.getUnjoinedRoomIdSet()) {
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

        protected _onDataChanged(): void {
            this._labelName.text = this.data.name;
        }
    }

    type DataForRoomRenderer = {
        roomId  : number;
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
            this._setNotifyListenerArray([
                { type: Notify.Type.MfrJoinTargetRoomIdChanged, callback: this._onNotifyMfrJoinTargetRoomIdChanged },
            ]);
        }

        protected async _onDataChanged(): Promise<void> {
            this._updateState();

            const roomInfo = await MfrModel.getRoomInfo(this.data.roomId);
            if (roomInfo == null) {
                return;
            }

            const settingsForMfw        = roomInfo.settingsForMfw;
            this._imgPassword.visible   = !!settingsForMfw.warPassword;
            this._labelName.text        = settingsForMfw.warName || `--`;
        }

        private _onNotifyMfrJoinTargetRoomIdChanged(e: egret.Event): void {
            this._updateState();
        }

        private _onTouchTapBtnChoose(e: egret.TouchEvent): void {
            MfrModel.Join.setTargetRoomId(this.data.roomId);
        }

        private async _onTouchTapBtnNext(e: egret.TouchEvent): Promise<void> {
            const roomInfo = await MfrModel.getRoomInfo(this.data.roomId);
            if (roomInfo == null) {
                return;
            }

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

        private _updateState(): void {
            this.currentState = this.data.roomId === MfrModel.Join.getTargetRoomId() ? Types.UiState.Down : Types.UiState.Up;
        }
    }
}
