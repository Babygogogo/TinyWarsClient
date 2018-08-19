
namespace OnlineWar {
    export class ChooseSettingsPanel extends GameUi.UiPanel {
        protected readonly _layerType   = Utility.Types.LayerType.Hud0;
        protected readonly _isExclusive = true;

        private static _instance: ChooseSettingsPanel;

        private _tabSettings: GameUi.UiTab;
        private _btnBack    : GameUi.UiButton;

        private _dataForTab: GameUi.DataForUiTab[];

        public static open(): void {
            if (!ChooseSettingsPanel._instance) {
                ChooseSettingsPanel._instance = new ChooseSettingsPanel();
            }
            ChooseSettingsPanel._instance.open();
        }
        public static close(): void {
            if (ChooseSettingsPanel._instance) {
                ChooseSettingsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled(true);
            this.skinName = "resource/skins/onlineWar/ChooseSettingsPanel.exml";
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
                    tabItemData: {name: "" + Math.random()},
                    pageClass  : ChooseWarNamePage,
                    pageData   : undefined,
                },
                {
                    tabItemData: {name: "" + Math.random()},
                    pageClass  : ChooseWarNamePage,
                    pageData   : undefined,
                },
                {
                    tabItemData: {name: "" + Math.random()},
                    pageClass  : ChooseWarNamePage,
                    pageData   : undefined,
                },
                {
                    tabItemData: {name: "" + Math.random()},
                    pageClass  : ChooseWarNamePage,
                    pageData   : undefined,
                },
                {
                    tabItemData: {name: "" + Math.random()},
                    pageClass  : ChooseWarNamePage,
                    pageData   : undefined,
                },
                {
                    tabItemData: {name: "" + Math.random()},
                    pageClass  : ChooseWarNamePage,
                    pageData   : undefined,
                },
                {
                    tabItemData: {name: "" + Math.random()},
                    pageClass  : ChooseWarNamePage,
                    pageData   : undefined,
                },
                {
                    tabItemData: {name: "" + Math.random()},
                    pageClass  : ChooseWarNamePage,
                    pageData   : undefined,
                },
            ]);
        }

        protected _onClosed(): void {
            this._tabSettings.clear();
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            ChooseSettingsPanel.close();
            ChooseNewMapPanel.open();
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
