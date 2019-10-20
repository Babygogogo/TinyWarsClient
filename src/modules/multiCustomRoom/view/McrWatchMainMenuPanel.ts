
namespace TinyWars.MultiCustomRoom {
    import Lang         = Utility.Lang;
    import FlowManager  = Utility.FlowManager;
    import Notify       = Utility.Notify;

    export class McrWatchMainMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrWatchMainMenuPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _listCommand    : GameUi.UiScrollList;

        public static show(): void {
            if (!McrWatchMainMenuPanel._instance) {
                McrWatchMainMenuPanel._instance = new McrWatchMainMenuPanel();
            }
            McrWatchMainMenuPanel._instance.open();
        }

        public static hide(): void {
            if (McrWatchMainMenuPanel._instance) {
                McrWatchMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/multiCustomRoom/McrWatchMainMenuPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ];
            this._notifyListeners = [
                { type: Notify.Type.SLogout,            callback: this._onNotifySLogout },
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];

            this._listCommand.setItemRenderer(CommandRenderer);
        }

        protected _onOpened(): void {
            this._updateView();
        }

        protected _onClosed(): void {
            this._listCommand.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            McrWatchMainMenuPanel.hide();
            McrMainMenuPanel.show();
        }

        private _onNotifySLogout(e: egret.Event): void {
            McrWatchMainMenuPanel.hide();
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0206);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
            this._listCommand.bindData(this._createDataForListCommand());
        }

        private _createDataForListCommand(): DataForCommandRenderer[] {
            return [
                {
                    name    : Lang.getText(Lang.Type.B0207),
                    callback: (): void => {
                        McrWatchMainMenuPanel.hide();
                        McrWatchMakeRequestWarsPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0208),
                    callback: (): void => {
                        McrWatchMainMenuPanel.hide();
                        McrWatchHandleRequestWarsPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0219),
                    callback: (): void => {
                        McrWatchMainMenuPanel.hide();
                        McrWatchDeleteWatcherWarsPanel.show();
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
