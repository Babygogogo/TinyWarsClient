
namespace TinyWars.SingleCustomRoom {
    import Lang         = Utility.Lang;
    import FlowManager  = Utility.FlowManager;

    export class ScrMainMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ScrMainMenuPanel;

        private _btnBack    : GameUi.UiButton;
        private _listCommand: GameUi.UiScrollList;

        public static show(): void {
            if (!ScrMainMenuPanel._instance) {
                ScrMainMenuPanel._instance = new ScrMainMenuPanel();
            }
            ScrMainMenuPanel._instance.open(undefined);
        }

        public static hide(): void {
            if (ScrMainMenuPanel._instance) {
                ScrMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this.skinName = "resource/skins/singleCustomRoom/ScrMainMenuPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: Utility.Notify.Type.MsgUserLogout, callback: this._onMsgUserLogout },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);

            this._listCommand.bindData(this._createDataForListCommand());
        }

        protected _onClosed(): void {
            this._listCommand.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            FlowManager.gotoLobby();
        }
        private _onMsgUserLogout(e: egret.Event): void {
            ScrMainMenuPanel.hide();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListCommand(): DataForCommandRenderer[] {
            return [
                {
                    name    : Lang.getText(Lang.Type.B0000),
                    callback: (): void => {
                        ScrMainMenuPanel.hide();
                        SingleCustomRoom.ScrCreateMapListPanel.show();
                    },
                },
                // {
                //     name    : Lang.getText(Lang.Type.B0023),
                //     callback: (): void => {
                //         ScrMainMenuPanel.hide();
                //         SingleCustomRoom.McrJoinMapListPanel.show();
                //     },
                // },
                // {
                //     name    : Lang.getText(Lang.Type.B0022),
                //     callback: (): void => {
                //         ScrMainMenuPanel.hide();
                //         SingleCustomRoom.McrExitMapListPanel.show();
                //     },
                // },
                // {
                //     name    : Lang.getText(Lang.Type.B0024),
                //     callback: () => {
                //         ScrMainMenuPanel.hide();
                //         SingleCustomRoom.McrContinueWarListPanel.show();
                //     },
                // },
                // {
                //     name    : Lang.getText(Lang.Type.B0092),
                //     callback: () => {
                //         ScrMainMenuPanel.hide();
                //         SingleCustomRoom.McrReplayListPanel.show();
                //     },
                // },
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
