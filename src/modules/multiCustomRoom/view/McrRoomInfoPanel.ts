
namespace TinyWars.MultiCustomRoom {
    import Lang                 = Utility.Lang;
    import Notify               = Utility.Notify;
    import FloatText            = Utility.FloatText;
    import ProtoTypes           = Utility.ProtoTypes;
    import CommonConfirmPanel   = Common.CommonConfirmPanel;
    import NetMessage           = ProtoTypes.NetMessage;

    type OpenDataForMcrRoomInfoPanel = {
        roomId  : number;
    }
    export class McrRoomInfoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrRoomInfoPanel;

        private _tabSettings    : TinyWars.GameUi.UiTab;
        private _labelMenuTitle : TinyWars.GameUi.UiLabel;

        private _groupButton    : eui.Group;
        private _btnStartGame   : TinyWars.GameUi.UiButton;
        private _btnDeleteRoom  : TinyWars.GameUi.UiButton;
        private _btnChat        : TinyWars.GameUi.UiButton;
        private _btnExitRoom    : TinyWars.GameUi.UiButton;
        private _btnBack        : TinyWars.GameUi.UiButton;

        public static show(openData: OpenDataForMcrRoomInfoPanel): void {
            if (!McrRoomInfoPanel._instance) {
                McrRoomInfoPanel._instance = new McrRoomInfoPanel();
            }
            McrRoomInfoPanel._instance.open(openData);
        }
        public static hide(): void {
            if (McrRoomInfoPanel._instance) {
                McrRoomInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this.skinName = "resource/skins/multiCustomRoom/McrRoomInfoPanel.exml";
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
                { type: Notify.Type.MsgMcrGetRoomInfo,  callback: this._onMsgMcrGetRoomInfo },
                { type: Notify.Type.MsgMcrExitRoom,     callback: this._onMsgMcrExitRoom },
                { type: Notify.Type.MsgMcrDeleteRoom,   callback: this._onMsgMcrDeleteRoom },
                { type: Notify.Type.MsgMcrStartWar,     callback: this._onMsgMcrStartWar },
                { type: Notify.Type.MsgMcrDeletePlayer, callback: this._onMsgMcrDeletePlayer },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);

            this._btnBack.setTextColor(0x00FF00);
            this._btnStartGame.setTextColor(0x00FF00);
            this._btnDeleteRoom.setTextColor(0xFF0000);
            this._btnChat.setTextColor(0x00FF00);
            this._btnExitRoom.setTextColor(0xFF0000);

            const roomId = this._getOpenData<OpenDataForMcrRoomInfoPanel>().roomId;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : McrRoomBasicSettingsPage,
                    pageData    : {
                        roomId
                    } as OpenDataForMcrRoomBasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0003) },
                    pageClass  : McrRoomAdvancedSettingsPage,
                    pageData    : {
                        roomId
                    } as OpenDataForMcrRoomAdvancedSettingsPage,
                },
            ]);

            this._updateComponentsForLanguage();
            this._updateGroupButton();
        }

        protected _onClosed(): void {
            this._tabSettings.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            McrMyRoomListPanel.show();
        }

        private _onTouchedBtnStartGame(e: egret.TouchEvent): void {
            const roomId = this._getOpenData<OpenDataForMcrRoomInfoPanel>().roomId;
            if (roomId != null) {
                McrProxy.reqMcrStartWar(roomId);
            }
        }

        private _onTouchedBtnDeleteRoom(e: egret.TouchEvent): void {
            const roomId = this._getOpenData<OpenDataForMcrRoomInfoPanel>().roomId;
            if (roomId != null) {
                CommonConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0149),
                    callback: () => {
                        McrProxy.reqMcrDestroyRoom(roomId);
                    },
                });
            }
        }

        private _onTouchedBtnChat(e: egret.TouchEvent): void {
            Chat.ChatPanel.show({
                toMcrRoomId: this._getOpenData<OpenDataForMcrRoomInfoPanel>().roomId,
            });
        }

        private async _onTouchedBtnExitRoom(e: egret.TouchEvent): Promise<void> {
            CommonConfirmPanel.show({
                title   : Lang.getText(Lang.Type.B0088),
                content : Lang.getText(Lang.Type.A0126),
                callback: () => {
                    McrProxy.reqMcrExitRoom(this._getOpenData<OpenDataForMcrRoomInfoPanel>().roomId);
                },
            });
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private async _onMsgMcrGetRoomInfo(e: egret.Event): Promise<void> {
            const data      = e.data as NetMessage.MsgMcrGetRoomInfo.IS;
            const roomId    = data.roomId;
            if (roomId === this._getOpenData<OpenDataForMcrRoomInfoPanel>().roomId) {
                const selfUserId = User.UserModel.getSelfUserId();
                if ((await McrModel.getRoomInfo(roomId)).playerDataList.some(v => v.userId === selfUserId)) {
                    this._updateGroupButton();
                }
            }
        }

        private _onMsgMcrExitRoom(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMcrExitRoom.IS;
            if (data.roomId === this._getOpenData<OpenDataForMcrRoomInfoPanel>().roomId) {
                FloatText.show(Lang.getText(Lang.Type.A0016));
                this.close();
                McrMyRoomListPanel.show();
            }
        }

        private _onMsgMcrDeleteRoom(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMcrDeleteRoom.IS;
            if (data.roomId === this._getOpenData<OpenDataForMcrRoomInfoPanel>().roomId) {
                FloatText.show(Lang.getText(Lang.Type.A0019));
                this.close();
                McrMyRoomListPanel.show();
            }
        }

        private _onMsgMcrStartWar(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMcrStartWar.IS;
            if (data.roomId === this._getOpenData<OpenDataForMcrRoomInfoPanel>().roomId) {
                this.close();
                McrMyRoomListPanel.show();
            }
        }

        private _onMsgMcrDeletePlayer(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgMcrDeletePlayer.IS;
            if ((data.roomId === this._getOpenData<OpenDataForMcrRoomInfoPanel>().roomId) && (data.targetUserId === User.UserModel.getSelfUserId())) {
                FloatText.show(Lang.getText(Lang.Type.A0127));
                this.close();
                McrMyRoomListPanel.show();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _updateGroupButton(): Promise<void> {
            const roomId                = this._getOpenData<OpenDataForMcrRoomInfoPanel>().roomId;
            const roomInfo              = await McrModel.getRoomInfo(roomId);
            const playerDataList        = roomInfo.playerDataList;
            const ownerInfo             = playerDataList.find(v => v.playerIndex === roomInfo.ownerPlayerIndex);
            const isSelfOwner           = (!!ownerInfo) && (ownerInfo.userId === User.UserModel.getSelfUserId());
            const btnStartGame          = this._btnStartGame;
            btnStartGame.setRedVisible(await McrModel.checkIsRedForRoom(roomId));

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
