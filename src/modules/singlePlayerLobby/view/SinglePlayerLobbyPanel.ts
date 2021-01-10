
namespace TinyWars.SinglePlayerLobby {
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import Notify       = Utility.Notify;

    export class SinglePlayerLobbyPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: SinglePlayerLobbyPanel;

        private _btnBack        : GameUi.UiButton;
        private _labelMenuTitle : GameUi.UiLabel;
        private _listCommand    : GameUi.UiScrollList;

        public static show(): void {
            if (!SinglePlayerLobbyPanel._instance) {
                SinglePlayerLobbyPanel._instance = new SinglePlayerLobbyPanel();
            }
            SinglePlayerLobbyPanel._instance.open();
        }

        public static hide(): void {
            if (SinglePlayerLobbyPanel._instance) {
                SinglePlayerLobbyPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/singlePlayerLobby/SinglePlayerLobbyPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserLogout,      callback: this._onMsgUserLogout },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);

            this._updateComponentsForLanguage();
            this._listCommand.bindData(this._createDataForListCommand());
        }

        protected _onClosed(): void {
            this._listCommand.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onMsgUserLogout(e: egret.Event): void {
            SinglePlayerLobbyPanel.hide();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            Lobby.LobbyPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0138);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
        }

        private _createDataForListCommand(): DataForCommandRenderer[] {
            return [
                // TODO enable creating new wars.
                // {
                //     name    : Lang.getText(Lang.Type.B0254),
                //     callback: (): void => {
                //         this.close();
                //         SingleCustomRoom.ScrCreateMapListPanel.show();
                //     },
                // },
                {
                    name    : Lang.getText(Lang.Type.B0261),
                    callback: (): void => {
                        this.close();
                        SingleCustomRoom.ScrContinueWarListPanel.show();
                    },
                },
            ];
        }
    }

    type DataForCommandRenderer = {
        name    : string;
        callback: () => void;
    }

    class CommandRenderer extends GameUi.UiListItemRenderer {
        private _labelCommand: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data as DataForCommandRenderer;
            this._labelCommand.text = data.name;
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            (this.data as DataForCommandRenderer).callback();
        }
    }
}
