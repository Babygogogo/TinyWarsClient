
namespace TinyWars.MultiCustomRoom {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;
    import ProtoTypes   = Utility.ProtoTypes;

    const CONFIRM_INTERVAL_MS = 5000;

    export class McrJoinSettingsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrJoinSettingsPanel;

        private _tabSettings: GameUi.UiTab;
        private _btnBack    : GameUi.UiButton;
        private _btnConfirm : GameUi.UiButton;

        private _timeoutIdForBtnConfirm: number;

        public static show(): void {
            if (!McrJoinSettingsPanel._instance) {
                McrJoinSettingsPanel._instance = new McrJoinSettingsPanel();
            }
            McrJoinSettingsPanel._instance.open();
        }
        public static hide(): void {
            if (McrJoinSettingsPanel._instance) {
                McrJoinSettingsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled(true);
            this.skinName = "resource/skins/multiCustomRoom/McrJoinSettingsPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ];
            this._notifyListeners = [
                { type: Notify.Type.SMcrJoinWar, callback: this._onNotifySMcrJoinWar },
            ];
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
        }

        protected _onOpened(): void {
            this._tabSettings.bindData([
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0002) },
                    pageClass  : McrJoinBasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0003) },
                    pageClass  : McrJoinAdvancedSettingsPage,
                },
            ]);

            this._btnConfirm.enabled = true;
        }

        protected _onClosed(): void {
            this._tabSettings.clear();
            this._clearTimeoutForBtnConfirm();
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            McrJoinSettingsPanel.hide();
            McrJoinMapListPanel.show();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            McrProxy.reqJoin(McrModel.getJoinWarData());

            this._btnConfirm.enabled = false;
            this._resetTimeoutForBtnConfirm();
        }

        private _onNotifySMcrJoinWar(e: egret.Event): void {
            const data = e.data as ProtoTypes.IS_McrJoinWar;
            FloatText.show(Lang.getText(data.isStarted ? Lang.Type.A0019 : Lang.Type.A0018));
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
