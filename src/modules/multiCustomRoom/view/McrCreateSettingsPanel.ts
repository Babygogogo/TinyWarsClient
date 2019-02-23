
namespace TinyWars.MultiCustomRoom {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;
    import StageManager = Utility.StageManager;

    const CONFIRM_INTERVAL_MS = 5000;

    export class McrCreateSettingsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrCreateSettingsPanel;

        private _tabSettings: GameUi.UiTab;
        private _btnBack    : GameUi.UiButton;
        private _btnConfirm : GameUi.UiButton;

        private _dataForTab            : GameUi.DataForUiTab[];
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

            this._setAutoAdjustHeightEnabled(true);
            this.skinName = "resource/skins/multiCustomRoom/McrCreateSettingsPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ];
            this._notifyListeners = [
                { type: Notify.Type.SMcrCreateWar, callback: this._onNotifySCreateCustomOnlineWar },
            ];
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
        }

        protected _onOpened(): void {
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
            McrProxy.reqCreate(McrModel.getCreateWarData());

            this._btnConfirm.enabled = false;
            this._resetTimeoutForBtnConfirm();
        }

        private _onNotifySCreateCustomOnlineWar(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0015));
            Utility.FlowManager.gotoLobby();
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
