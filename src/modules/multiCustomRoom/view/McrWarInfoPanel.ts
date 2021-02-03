
namespace TinyWars.MultiCustomRoom {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import ProtoTypes   = Utility.ProtoTypes;
    import MpwProxy     = MultiPlayerWar.MpwProxy;
    import IMpwWarInfo  = ProtoTypes.MultiPlayerWar.IMpwWarInfo;

    type OpenDataForMcrWarInfoPanel = {
        warInfo: IMpwWarInfo;
    }
    export class McrWarInfoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrWarInfoPanel;

        private _tabSettings    : TinyWars.GameUi.UiTab;
        private _labelMenuTitle : TinyWars.GameUi.UiLabel;
        private _btnContinueWar : TinyWars.GameUi.UiButton;
        private _btnBack        : TinyWars.GameUi.UiButton;

        public static show(openData: OpenDataForMcrWarInfoPanel): void {
            if (!McrWarInfoPanel._instance) {
                McrWarInfoPanel._instance = new McrWarInfoPanel();
            }
            McrWarInfoPanel._instance.open(openData);
        }
        public static hide(): void {
            if (McrWarInfoPanel._instance) {
                McrWarInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this.skinName = "resource/skins/multiCustomRoom/McrWarInfoPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnContinueWar, callback: this._onTouchedBtnStartGame },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);

            this._btnBack.setTextColor(0x00FF00);
            this._btnContinueWar.setTextColor(0x00FF00);

            const warInfo = this._getOpenData<OpenDataForMcrWarInfoPanel>();
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : McrWarBasicSettingsPage,
                    pageData    : {
                        warInfo
                    } as OpenDataForMcrWarBasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0003) },
                    pageClass  : McrWarAdvancedSettingsPage,
                    pageData    : {
                        warInfo
                    } as OpenDataForMcrWarAdvancedSettingsPage,
                },
            ]);

            this._updateComponentsForLanguage();
        }

        protected async _onClosed(): Promise<void> {
            this._tabSettings.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            McrMyWarListPanel.show();
        }

        private _onTouchedBtnStartGame(e: egret.TouchEvent): void {
            const warInfo = this._getOpenData<OpenDataForMcrWarInfoPanel>().warInfo;
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
