
namespace TinyWars.MapManagement {
    import Lang         = Utility.Lang;
    import FlowManager  = Utility.FlowManager;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;

    export class MmMainMenuPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmMainMenuPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _listCommand    : GameUi.UiScrollList;

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
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserLogout,            callback: this._onNotifySLogout },
                { type: Notify.Type.MsgMmReloadAllMaps,   callback: this._onNotifySMmReloadAllMaps },
            ];

            this._listCommand.setItemRenderer(CommandRenderer);
        }

        protected async _onOpened(): Promise<void> {
            this._updateView();
            this._listCommand.bindData(await this._createDataForListCommand());
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
        private _onNotifySMmReloadAllMaps(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0075));
        }
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Private functions.
        ////////////////////////////////////////////////////////////////////////////////
        private async _updateView(): Promise<void> {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0192);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
            this._listCommand.bindData(await this._createDataForListCommand());
        }

        private async _createDataForListCommand(): Promise<DataForCommandRenderer[]> {
            const dataList: DataForCommandRenderer[] = [
                {
                    name    : Lang.getText(Lang.Type.B0193),
                    callback: (): void => {
                        this.close();
                        MmAvailabilityListPanel.show({});
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0295),
                    callback: (): void => {
                        this.close();
                        MmReviewListPanel.show();
                    },
                },
            ];

            return dataList;
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
