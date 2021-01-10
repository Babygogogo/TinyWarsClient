
namespace TinyWars.RankMatchRoom {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import ProtoTypes   = Utility.ProtoTypes;
    import MpwProxy     = MultiPlayerWar.MpwProxy;
    import IMpwWarInfo  = ProtoTypes.MultiPlayerWar.IMpwWarInfo;

    export class RmrWarInfoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: RmrWarInfoPanel;

        private _tabSettings    : TinyWars.GameUi.UiTab;
        private _labelMenuTitle : TinyWars.GameUi.UiLabel;
        private _btnContinueWar : TinyWars.GameUi.UiButton;
        private _btnBack        : TinyWars.GameUi.UiButton;

        private _warInfo        : IMpwWarInfo;

        public static show(warInfo: IMpwWarInfo): void {
            if (!RmrWarInfoPanel._instance) {
                RmrWarInfoPanel._instance = new RmrWarInfoPanel();
            }
            RmrWarInfoPanel._instance._warInfo = warInfo;
            RmrWarInfoPanel._instance.open();
        }
        public static hide(): void {
            if (RmrWarInfoPanel._instance) {
                RmrWarInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this.skinName = "resource/skins/rankMatchRoom/RmrWarInfoPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnContinueWar, callback: this._onTouchedBtnContinueWar },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);

            this._btnBack.setTextColor(0x00FF00);
            this._btnContinueWar.setTextColor(0x00FF00);

            const warInfo = this._warInfo;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : RmrWarBasicSettingsPage,
                    pageData    : {
                        warInfo
                    } as OpenParamForWarBasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0003) },
                    pageClass  : RmrWarAdvancedSettingsPage,
                    pageData    : {
                        warInfo
                    } as OpenParamForWarAdvancedSettingsPage,
                },
            ]);

            this._updateComponentsForLanguage();
        }

        protected _onClosed(): void {
            this._tabSettings.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            RmrMyWarListPanel.show();
        }

        private _onTouchedBtnContinueWar(e: egret.TouchEvent): void {
            const warInfo = this._warInfo;
            if (warInfo) {
                MpwProxy.reqMcwCommonContinueWar(warInfo.warId);
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0024);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
            this._btnContinueWar.label  = Lang.getText(Lang.Type.B0401);
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
