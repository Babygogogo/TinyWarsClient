
namespace TinyWars.MultiCustomRoom {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;

    const CONFIRM_INTERVAL_MS = 5000;

    export class McrCreateSettingsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrCreateSettingsPanel;

        private _tabSettings    : GameUi.UiTab;
        private _labelMenuTitle : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _timeoutIdForBtnConfirm: number;

        public static show(): void {
            if (!McrCreateSettingsPanel._instance) {
                McrCreateSettingsPanel._instance = new McrCreateSettingsPanel();
            }
            McrCreateSettingsPanel._instance.open();
        }
        public static hide(): void {
            if (McrCreateSettingsPanel._instance) {
                McrCreateSettingsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this.skinName = "resource/skins/multiCustomRoom/McrCreateSettingsPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.MsgMcrCreateRoom,     callback: this._onNotifySCreateCustomOnlineWar },
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);

            this._tabSettings.bindData([
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0002) },
                    pageClass  : McrCreateBasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0003) },
                    pageClass  : McrCreateAdvancedSettingsPage,
                },
            ]);

            this._updateComponentsForLanguage();
            this._btnConfirm.enabled = true;
        }

        protected _onClosed(): void {
            this._tabSettings.clear();
            this._clearTimeoutForBtnConfirm();
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            McrCreateSettingsPanel.hide();
            McrCreateMapListPanel.show();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const data = McrModel.Create.getData();
            McrProxy.reqCreateRoom(data);

            this._btnConfirm.enabled = false;
            this._resetTimeoutForBtnConfirm();
        }

        private _onNotifySCreateCustomOnlineWar(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0015));
            Utility.FlowManager.gotoLobby();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _resetTimeoutForBtnConfirm(): void {
            this._clearTimeoutForBtnConfirm();
            this._timeoutIdForBtnConfirm = egret.setTimeout(() => {
                this._btnConfirm.enabled     = true;
                this._timeoutIdForBtnConfirm = undefined;
            }, this, CONFIRM_INTERVAL_MS);
        }

        private _clearTimeoutForBtnConfirm(): void {
            if (this._timeoutIdForBtnConfirm != null) {
                egret.clearTimeout(this._timeoutIdForBtnConfirm);
                this._timeoutIdForBtnConfirm = undefined;
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0000);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
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
