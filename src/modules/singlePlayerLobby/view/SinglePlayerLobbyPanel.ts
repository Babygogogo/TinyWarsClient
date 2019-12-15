
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

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/singlePlayerLobby/SinglePlayerLobbyPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
            ];
            this._notifyListeners = [
                { type: Notify.Type.SLogout,            callback: this._onNotifySLogout },
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];

            this._listCommand.setItemRenderer(CommandRenderer);
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();
            this._listCommand.bindData(this._createDataForListCommand());
        }

        protected _onClosed(): void {
            this._listCommand.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifySLogout(e: egret.Event): void {
            SinglePlayerLobbyPanel.hide();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            Utility.FlowManager.gotoLobby();
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
                {
                    name    : Lang.getText(Lang.Type.B0254),
                    callback: (): void => {
                        this.close();
                        SingleCustomRoom.ScrCreateMapListPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0024),
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

    class CommandRenderer extends eui.ItemRenderer {
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
