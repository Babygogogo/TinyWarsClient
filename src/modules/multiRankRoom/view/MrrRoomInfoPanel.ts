
namespace TinyWars.MultiRankRoom {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;
    import ProtoTypes   = Utility.ProtoTypes;
    import NetMessage   = ProtoTypes.NetMessage;

    type OpenDataForMrrRoomInfoPanel = {
        roomId  : number;
    }
    export class MrrRoomInfoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrRoomInfoPanel;

        private _tabSettings    : TinyWars.GameUi.UiTab;
        private _labelMenuTitle : TinyWars.GameUi.UiLabel;
        private _btnBack        : TinyWars.GameUi.UiButton;

        public static show(openData: OpenDataForMrrRoomInfoPanel): void {
            if (!MrrRoomInfoPanel._instance) {
                MrrRoomInfoPanel._instance = new MrrRoomInfoPanel();
            }
            MrrRoomInfoPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (MrrRoomInfoPanel._instance) {
                await MrrRoomInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrRoomInfoPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMrrDeleteRoom,   callback: this._onMsgMrrDeleteRoom },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);

            this._btnBack.setTextColor(0x00FF00);

            this._updateComponentsForLanguage();

            const roomId = this._getOpenData<OpenDataForMrrRoomInfoPanel>().roomId;
            if ((await MrrModel.getRoomInfo(roomId)) == null) {
                this.close();
                MrrMyRoomListPanel.show();
            } else {
                this._tabSettings.bindData([
                    {
                        tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                        pageClass   : MrrRoomBasicSettingsPage,
                        pageData    : {
                            roomId
                        } as OpenDataForMrrRoomBasicSettingsPage,
                    },
                    {
                        tabItemData: { name: Lang.getText(Lang.Type.B0003) },
                        pageClass  : MrrRoomAdvancedSettingsPage,
                        pageData    : {
                            roomId
                        } as OpenDataForMrrRoomAdvancedSettingsPage,
                    },
                ]);
            }
        }

        protected async _onClosed(): Promise<void> {
            this._tabSettings.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            MrrMyRoomListPanel.show();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onMsgMrrDeleteRoom(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMrrDeleteRoom.IS;
            if (data.roomId === this._getOpenData<OpenDataForMrrRoomInfoPanel>().roomId) {
                FloatText.show(Lang.getText(Lang.Type.A0019));
                this.close();
                MrrMyRoomListPanel.show();
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0398);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
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
