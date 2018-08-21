
namespace NewCustomWarSettings {
    import Lang = Utility.Lang;

    export class SettingsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: SettingsPanel;

        private _tabSettings: GameUi.UiTab;
        private _btnBack    : GameUi.UiButton;

        private _dataForTab: GameUi.DataForUiTab[];

        public static open(): void {
            if (!SettingsPanel._instance) {
                SettingsPanel._instance = new SettingsPanel();
            }
            SettingsPanel._instance.open();
        }
        public static close(): void {
            if (SettingsPanel._instance) {
                SettingsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled(true);
            this.skinName = "resource/skins/newCustomWarSettings/SettingsPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBack, callback: this._onTouchedBtnBack },
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
                    pageClass  : BasicSettingsPage,
                },
            ]);
        }

        protected _onClosed(): void {
            this._tabSettings.clear();
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            SettingsPanel.close();
            ChooseMapPanel.open();
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
