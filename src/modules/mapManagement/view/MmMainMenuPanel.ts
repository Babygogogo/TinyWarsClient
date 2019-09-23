
namespace TinyWars.MapManagement {
    import Lang         = Utility.Lang;
    import FlowManager  = Utility.FlowManager;

    export class MmMainMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmMainMenuPanel;

        private _btnBack    : GameUi.UiButton;
        private _listCommand: GameUi.UiScrollList;

        public static show(): void {
            if (!MmMainMenuPanel._instance) {
                MmMainMenuPanel._instance = new MmMainMenuPanel();
            }
            MmMainMenuPanel._instance.open();
        }

        public static hide(): void {
            if (MmMainMenuPanel._instance) {
                MmMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/mapManagement/MmMainMenuPanel.exml";
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
            MmMainMenuPanel.hide();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _createDataForListCommand(): DataForCommandRenderer[] {
            return [
                {
                    name    : Lang.getText(Lang.Type.B0193),
                    callback: (): void => {
                        MmMainMenuPanel.hide();
                        MmAvailabilityListPanel.show({});
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
