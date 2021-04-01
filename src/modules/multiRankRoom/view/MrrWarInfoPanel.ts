
namespace TinyWars.MultiRankRoom {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import ProtoTypes   = Utility.ProtoTypes;
    import MpwProxy     = MultiPlayerWar.MpwProxy;
    import IMpwWarInfo  = ProtoTypes.MultiPlayerWar.IMpwWarInfo;

    type OpenDataForMrrWarInfoPanel = {
        warInfo : IMpwWarInfo;
    }
    export class MrrWarInfoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MrrWarInfoPanel;

        private _tabSettings    : TinyWars.GameUi.UiTab<DataForTabItemRenderer>;
        private _labelMenuTitle : TinyWars.GameUi.UiLabel;
        private _btnContinueWar : TinyWars.GameUi.UiButton;
        private _btnBack        : TinyWars.GameUi.UiButton;

        public static show(openData: OpenDataForMrrWarInfoPanel): void {
            if (!MrrWarInfoPanel._instance) {
                MrrWarInfoPanel._instance = new MrrWarInfoPanel();
            }
            MrrWarInfoPanel._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (MrrWarInfoPanel._instance) {
                await MrrWarInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrWarInfoPanel.exml";
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

            const warInfo = this._getOpenData<OpenDataForMrrWarInfoPanel>().warInfo;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : MrrWarBasicSettingsPage,
                    pageData    : {
                        warInfo
                    } as OpenDataForMrrWarBasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0003) },
                    pageClass  : MrrWarAdvancedSettingsPage,
                    pageData    : {
                        warInfo
                    } as OpenDataForWarAdvancedSettingsPage,
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
            MrrMyWarListPanel.show();
        }

        private _onTouchedBtnContinueWar(e: egret.TouchEvent): void {
            const warInfo = this._getOpenData<OpenDataForMrrWarInfoPanel>().warInfo;
            if (warInfo) {
                MpwProxy.reqMpwCommonContinueWar(warInfo.warId);
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

    class TabItemRenderer extends GameUi.UiTabItemRenderer<DataForTabItemRenderer> {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            const data = this.data.tabItemData;
            this._labelName.text = data.name;
        }
    }
}
