
namespace TinyWars.MultiCustomRoom {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import ProtoTypes   = Utility.ProtoTypes;
    import FlowManager  = Utility.FlowManager;
    import McwProxy     = MultiCustomWar.McwProxy;
    import NetMessage   = ProtoTypes.NetMessage;
    import IMcwWarInfo  = ProtoTypes.MultiCustomWar.IMcwWarInfo;

    export class McrContinueWarInfoPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrContinueWarInfoPanel;

        private _tabSettings    : TinyWars.GameUi.UiTab;
        private _labelMenuTitle : TinyWars.GameUi.UiLabel;
        private _btnContinueWar : TinyWars.GameUi.UiButton;
        private _btnBack        : TinyWars.GameUi.UiButton;

        private _warInfo        : IMcwWarInfo;

        public static show(warInfo: IMcwWarInfo): void {
            if (!McrContinueWarInfoPanel._instance) {
                McrContinueWarInfoPanel._instance = new McrContinueWarInfoPanel();
            }
            McrContinueWarInfoPanel._instance._warInfo = warInfo;
            McrContinueWarInfoPanel._instance.open();
        }
        public static hide(): void {
            if (McrContinueWarInfoPanel._instance) {
                McrContinueWarInfoPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled(true);
            this.skinName = "resource/skins/multiCustomRoom/McrContinueWarInfoPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBack,        callback: this._onTouchedBtnBack },
                { ui: this._btnContinueWar,   callback: this._onTouchedBtnStartGame },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,        callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMcwCommonContinueWar,  callback: this._onNotifySMcwCommonContinueWar },
            ];
            this._tabSettings.setBarItemRenderer(TabItemRenderer);

            this._btnBack.setTextColor(0x00FF00);
            this._btnContinueWar.setTextColor(0x00FF00);
        }

        protected _onOpened(): void {
            const warInfo = this._warInfo;
            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : McrContinueWarBasicSettingsPage,
                    pageData    : {
                        warInfo
                    } as OpenParamForContinueWarBasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0003) },
                    pageClass  : McrContinueWarAdvancedSettingsPage,
                    pageData    : {
                        warInfo
                    } as OpenParamForContinueWarAdvancedSettingsPage,
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
            McrContinueWarListPanel.show();
        }

        private _onTouchedBtnStartGame(e: egret.TouchEvent): void {
            const warInfo = this._warInfo;
            if (warInfo) {
                McwProxy.reqMcwCommonContinueWar(warInfo.warId);
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySMcwCommonContinueWar(e: egret.Event): void {
            const data = e.data as NetMessage.MsgMcwCommonContinueWar.IS;
            FlowManager.gotoMultiCustomWar(data.war);
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

    class TabItemRenderer extends eui.ItemRenderer {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            const data = (this.data as GameUi.DataForUiTab).tabItemData as DataForTabItemRenderer;
            this._labelName.text = data.name;
        }
    }
}
