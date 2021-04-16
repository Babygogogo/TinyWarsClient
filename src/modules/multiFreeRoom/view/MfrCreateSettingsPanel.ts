
namespace TinyWars.MultiFreeRoom {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;

    const CONFIRM_INTERVAL_MS = 5000;

    export class MfrCreateSettingsPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MfrCreateSettingsPanel;

        private _tabSettings    : GameUi.UiTab<DataForTabItemRenderer>;
        private _labelMenuTitle : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _timeoutIdForBtnConfirm: number;

        public static show(): void {
            if (!MfrCreateSettingsPanel._instance) {
                MfrCreateSettingsPanel._instance = new MfrCreateSettingsPanel();
            }
            MfrCreateSettingsPanel._instance.open(undefined);
        }
        public static async hide(): Promise<void> {
            if (MfrCreateSettingsPanel._instance) {
                await MfrCreateSettingsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/multiFreeRoom/MfrCreateSettingsPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.MsgMfrCreateRoom,   callback: this._onNotifyMsgMfrCreateRoom },
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);

            this._tabSettings.bindData([
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0002) },
                    pageClass   : MfrCreateBasicSettingsPage,
                },
                {
                    tabItemData : { name: Lang.getText(Lang.Type.B0003) },
                    pageClass   : MfrCreateAdvancedSettingsPage,
                },
            ]);

            this._updateComponentsForLanguage();
            this._btnConfirm.enabled = true;
        }

        protected async _onClosed(): Promise<void> {
            this._tabSettings.clear();
            this._clearTimeoutForBtnConfirm();
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            this.close();
            MfrMainMenuPanel.show();
            Lobby.LobbyTopPanel.show();
            Lobby.LobbyBottomPanel.show();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const data = MfrModel.Create.getData();
            MfrProxy.reqCreateRoom(data);

            this._btnConfirm.enabled = false;
            this._resetTimeoutForBtnConfirm();
        }

        private _onNotifyMsgMfrCreateRoom(e: egret.Event): void {
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

    class TabItemRenderer extends GameUi.UiTabItemRenderer<DataForTabItemRenderer> {
        private _labelName: GameUi.UiLabel;

        protected dataChanged(): void {
            const data              = this.data.tabItemData;
            this._labelName.text    = data.name;
        }
    }
}
