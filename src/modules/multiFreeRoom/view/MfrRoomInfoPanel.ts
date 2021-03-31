
namespace TinyWars.MultiFreeRoom {
    import Lang                 = Utility.Lang;
    import Notify               = Utility.Notify;
    import FloatText            = Utility.FloatText;
    import ProtoTypes           = Utility.ProtoTypes;
    import CommonConfirmPanel   = Common.CommonConfirmPanel;
    import NetMessage           = ProtoTypes.NetMessage;

    type OpenDataForMfrRoomInfoPanel = {
        roomId  : number;
    }
    export class MfrRoomInfoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrRoomInfoPanel;

        private _tabSettings    : TinyWars.GameUi.UiTab;
        private _labelMenuTitle : TinyWars.GameUi.UiLabel;

        private _groupButton    : eui.Group;
        private _btnStartGame   : TinyWars.GameUi.UiButton;
        private _btnDeleteRoom  : TinyWars.GameUi.UiButton;
        private _btnChat        : TinyWars.GameUi.UiButton;
        private _btnExitRoom    : TinyWars.GameUi.UiButton;
        private _btnBack        : TinyWars.GameUi.UiButton;

        public static show(openData: OpenDataForMfrRoomInfoPanel): void {
            if (!MfrRoomInfoPanel._instance) {
                MfrRoomInfoPanel._instance = new MfrRoomInfoPanel();
            }
            MfrRoomInfoPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (MfrRoomInfoPanel._instance) {
                await MfrRoomInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrRoomInfoPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnStartGame,   callback: this._onTouchedBtnStartGame },
                { ui: this._btnDeleteRoom,  callback: this._onTouchedBtnDeleteRoom },
                { ui: this._btnChat,        callback: this._onTouchedBtnChat },
                { ui: this._btnExitRoom,    callback: this._onTouchedBtnExitRoom },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMfrGetRoomInfo,  callback: this._onMsgMfrGetRoomInfo },
                { type: Notify.Type.MsgMfrExitRoom,     callback: this._onMsgMfrExitRoom },
                { type: Notify.Type.MsgMfrDeleteRoom,   callback: this._onMsgMfrDeleteRoom },
                { type: Notify.Type.MsgMfrStartWar,     callback: this._onMsgMfrStartWar },
                { type: Notify.Type.MsgMfrDeletePlayer, callback: this._onMsgMfrDeletePlayer },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);

            this._btnBack.setTextColor(0x00FF00);
            this._btnStartGame.setTextColor(0x00FF00);
            this._btnDeleteRoom.setTextColor(0xFF0000);
            this._btnChat.setTextColor(0x00FF00);
            this._btnExitRoom.setTextColor(0xFF0000);

            const roomId = this._getOpenData<OpenDataForMfrRoomInfoPanel>().roomId;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : MfrRoomBasicSettingsPage,
                    pageData    : {
                        roomId
                    } as OpenDataForMfrRoomBasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0003) },
                    pageClass  : MfrRoomAdvancedSettingsPage,
                    pageData    : {
                        roomId
                    } as OpenDataForMfrRoomAdvancedSettingsPage,
                },
            ]);

            this._updateComponentsForLanguage();
            this._updateGroupButton();
        }

        protected async _onClosed(): Promise<void> {
            this._tabSettings.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            MfrMyRoomListPanel.show();
        }

        private _onTouchedBtnStartGame(e: egret.TouchEvent): void {
            const roomId = this._getOpenData<OpenDataForMfrRoomInfoPanel>().roomId;
            if (roomId != null) {
                MfrProxy.reqMfrStartWar(roomId);
            }
        }

        private _onTouchedBtnDeleteRoom(e: egret.TouchEvent): void {
            const roomId = this._getOpenData<OpenDataForMfrRoomInfoPanel>().roomId;
            if (roomId != null) {
                CommonConfirmPanel.show({
                    content : Lang.getText(Lang.Type.A0149),
                    callback: () => {
                        MfrProxy.reqMfrDestroyRoom(roomId);
                    },
                });
            }
        }

        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            Chat.ChatPanel.show({
                toMfrRoomId: this._getOpenData<OpenDataForMfrRoomInfoPanel>().roomId,
            });
        }

        private async _onTouchedBtnExitRoom(e: egret.TouchEvent): Promise<void> {
            CommonConfirmPanel.show({
                content : Lang.getText(Lang.Type.A0126),
                callback: () => {
                    MfrProxy.reqMfrExitRoom(this._getOpenData<OpenDataForMfrRoomInfoPanel>().roomId);
                },
            });
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private async _onMsgMfrGetRoomInfo(e: egret.Event): Promise<void> {
            const data      = e.data as NetMessage.MsgMfrGetRoomInfo.IS;
            const roomId    = data.roomId;
            if (roomId === this._getOpenData<OpenDataForMfrRoomInfoPanel>().roomId) {
                const selfUserId = User.UserModel.getSelfUserId();
                if ((await MfrModel.getRoomInfo(roomId)).playerDataList.some(v => v.userId === selfUserId)) {
                    this._updateGroupButton();
                }
            }
        }

        private _onMsgMfrExitRoom(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrExitRoom.IS;
            if (data.roomId === this._getOpenData<OpenDataForMfrRoomInfoPanel>().roomId) {
                FloatText.show(Lang.getText(Lang.Type.A0016));
                this.close();
                MfrMyRoomListPanel.show();
            }
        }

        private _onMsgMfrDeleteRoom(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrDeleteRoom.IS;
            if (data.roomId === this._getOpenData<OpenDataForMfrRoomInfoPanel>().roomId) {
                FloatText.show(Lang.getText(Lang.Type.A0019));
                this.close();
                MfrMyRoomListPanel.show();
            }
        }

        private _onMsgMfrStartWar(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMfrStartWar.IS;
            if (data.roomId === this._getOpenData<OpenDataForMfrRoomInfoPanel>().roomId) {
                this.close();
                MfrMyRoomListPanel.show();
            }
        }

        private _onMsgMfrDeletePlayer(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMfrDeletePlayer.IS;
            if ((data.roomId === this._getOpenData<OpenDataForMfrRoomInfoPanel>().roomId) && (data.targetUserId === User.UserModel.getSelfUserId())) {
                FloatText.show(Lang.getText(Lang.Type.A0127));
                this.close();
                MfrMyRoomListPanel.show();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _updateGroupButton(): Promise<void> {
            const roomId                = this._getOpenData<OpenDataForMfrRoomInfoPanel>().roomId;
            const roomInfo              = await MfrModel.getRoomInfo(roomId);
            const playerDataList        = roomInfo.playerDataList;
            const ownerInfo             = playerDataList.find(v => v.playerIndex === roomInfo.ownerPlayerIndex);
            const isSelfOwner           = (!!ownerInfo) && (ownerInfo.userId === User.UserModel.getSelfUserId());
            const btnStartGame          = this._btnStartGame;
            btnStartGame.setRedVisible(await MfrModel.checkIsRedForRoom(roomId));

            const groupButton = this._groupButton;
            groupButton.removeChildren();
            (isSelfOwner) && (groupButton.addChild(btnStartGame));
            groupButton.addChild(this._btnChat);
            (isSelfOwner) && (groupButton.addChild(this._btnDeleteRoom));
            groupButton.addChild(this._btnExitRoom);
            groupButton.addChild(this._btnBack);
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0398);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
            this._btnStartGame.label    = Lang.getText(Lang.Type.B0401);
            this._btnDeleteRoom.label   = Lang.getText(Lang.Type.B0400);
            this._btnExitRoom.label     = Lang.getText(Lang.Type.B0022);
            this._btnChat.label         = Lang.getText(Lang.Type.B0383);
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    }

    class TabItemRenderer extends GameUi.UiListItemRenderer {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            const data = (this.data as GameUi.DataForUiTab).tabItemData as DataForTabItemRenderer;
            this._labelName.text = data.name;
        }
    }
}
