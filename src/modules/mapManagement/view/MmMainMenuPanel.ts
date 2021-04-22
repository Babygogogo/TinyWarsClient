
namespace TinyWars.MapManagement {
    import Lang         = Utility.Lang;
    import FlowManager  = Utility.FlowManager;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;

    export class MmMainMenuPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmMainMenuPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _listCommand    : GameUi.UiScrollList<DataForCommandRenderer>;

        public static show(): void {
            if (!MmMainMenuPanel._instance) {
                MmMainMenuPanel._instance = new MmMainMenuPanel();
            }
            MmMainMenuPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MmMainMenuPanel._instance) {
                await MmMainMenuPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/mapManagement/MmMainMenuPanel.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgUserLogout,      callback: this._onMsgUserLogout },
                { type: Notify.Type.MsgMmReloadAllMaps, callback: this._onMsgMmReloadAllMaps },
            ]);
            this._listCommand.setItemRenderer(CommandRenderer);

            this._updateView();
            this._listCommand.bindData(await this._createDataForListCommand());
        }

        protected async _onClosed(): Promise<void> {
            this._listCommand.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            FlowManager.gotoLobby();
        }
        private _onMsgUserLogout(e: egret.Event): void {
            this.close();
        }
        private _onMsgMmReloadAllMaps(e: egret.Event): void {
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
                    name    : Lang.getText(Lang.Type.B0295),
                    callback: (): void => {
                        this.close();
                        MmReviewListPanel.show();
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0193),
                    callback: (): void => {
                        this.close();
                        MmAvailabilityListPanel.show({});
                    },
                },
                {
                    name    : Lang.getText(Lang.Type.B0444),
                    callback: (): void => {
                        this.close();
                        MmTagListPanel.show();
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

    class CommandRenderer extends GameUi.UiListItemRenderer<DataForCommandRenderer> {
        private _labelCommand: GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data = this.data;
            this._labelCommand.text = data.name;
        }

        public onItemTapEvent(e: eui.ItemTapEvent): void {
            this.data.callback();
        }
    }
}
