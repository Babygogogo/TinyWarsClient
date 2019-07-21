
namespace TinyWars.MultiCustomRoom {
    import Lang         = Utility.Lang;
    import FlowManager  = Utility.FlowManager;

    export class McrMainMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrMainMenuPanel;

        private _btnBack    : GameUi.UiButton;
        private _listCommand: GameUi.UiScrollList;

        public static show(): void {
            if (!McrMainMenuPanel._instance) {
                McrMainMenuPanel._instance = new McrMainMenuPanel();
            }
            McrMainMenuPanel._instance.open();
        }

        public static hide(): void {
            if (McrMainMenuPanel._instance) {
                McrMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrMainMenuPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ];
            this._notifyListeners = [
                { type: Utility.Notify.Type.SLogout, callback: this._onNotifySLogout },
            ];

            this._listCommand.setItemRenderer(CommandRenderer);
        }

        protected _onOpened(): void {
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
        private _onNotifySLogout(e: egret.Event): void {
            McrMainMenuPanel.hide();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListCommand(): DataForCommandRenderer[] {
            return [
                {
                    name    : Lang.getText(Lang.Type.B0000),
                    callback: (): void => {
                        McrMainMenuPanel.hide();
                        WarMap.WarMapProxy.reqGetNewestMultiPlayerMapInfos();
                        MultiCustomRoom.McrCreateMapListPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0023),
                    callback: (): void => {
                        McrMainMenuPanel.hide();
                        MultiCustomRoom.McrJoinMapListPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0022),
                    callback: (): void => {
                        McrMainMenuPanel.hide();
                        MultiCustomRoom.McrExitMapListPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0024),
                    callback: () => {
                        McrMainMenuPanel.hide();
                        MultiCustomRoom.McrContinueWarListPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0092),
                    callback: () => {
                        McrMainMenuPanel.hide();
                        MultiCustomRoom.McrReplayListPanel.show();
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
