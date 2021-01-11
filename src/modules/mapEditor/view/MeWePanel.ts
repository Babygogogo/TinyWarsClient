
namespace TinyWars.MapEditor {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;

    export class MeWePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeWePanel;

        private _tab        : GameUi.UiTab;
        private _labelTitle : GameUi.UiLabel;
        private _btnBack    : GameUi.UiButton;

        public static show(): void {
            if (!MeWePanel._instance) {
                MeWePanel._instance = new MeWePanel();
            }
            MeWePanel._instance.open(undefined);
        }
        public static hide(): void {
            if (MeWePanel._instance) {
                MeWePanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this.skinName = "resource/skins/mapEditor/MeWePanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._tab.setBarItemRenderer(TabItemRenderer);

            this._tab.bindData([
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0470) },
                    pageClass  : MeWeEventsPage,
                },
            ]);

            this._updateComponentsForLanguage();
        }

        protected _onClosed(): void {
            this._tab.clear();
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close()
            MeWarRulePanel.show();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text   = Lang.getText(Lang.Type.B0469);
            this._btnBack.label     = Lang.getText(Lang.Type.B0146);
        }
    }

    type DataForTabItemRenderer = {
        name: string;
    }
    class TabItemRenderer extends GameUi.UiListItemRenderer {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            const data = (this.data as GameUi.DataForUiTab).tabItemData as DataForTabItemRenderer;
            this._labelName.text = data.name;
        }
    }
}
