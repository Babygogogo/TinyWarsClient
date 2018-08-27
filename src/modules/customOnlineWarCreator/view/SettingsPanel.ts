
namespace CustomOnlineWarCreator {
    import Lang = Utility.Lang;

    export class CreateWarPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CreateWarPanel;

        private _tabSettings: GameUi.UiTab;
        private _btnBack    : GameUi.UiButton;
        private _btnConfirm : GameUi.UiButton;

        private _dataForTab: GameUi.DataForUiTab[];

        public static open(): void {
            if (!CreateWarPanel._instance) {
                CreateWarPanel._instance = new CreateWarPanel();
            }
            CreateWarPanel._instance.open();
        }
        public static close(): void {
            if (CreateWarPanel._instance) {
                CreateWarPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled(true);
            this.skinName = "resource/skins/customOnlineWarCreator/SettingsPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ];
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
        }

        protected _onOpened(): void {
            this._tabSettings.bindData([
                {
                    tabItemData: { name: Lang.getText(Lang.BigType.B01, Lang.SubType.S02) },
                    pageClass  : BasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.BigType.B01, Lang.SubType.S03) },
                    pageClass  : AdvancedSettingsPage,
                },
            ]);
        }

        protected _onClosed(): void {
            this._tabSettings.clear();
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            CreateWarPanel.close();
            ChooseMapPanel.open();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            CreateWarProxy.reqCreateCustomOnlineWar(CreateWarModel.createDataForCreateWar());
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    }

    class TabItemRenderer extends eui.ItemRenderer {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            const data = (this.data as GameUi.DataForUiTab).tabItemData as DataForTabItemRenderer;
            this._labelName.text = data.name;
        }
    }
}
