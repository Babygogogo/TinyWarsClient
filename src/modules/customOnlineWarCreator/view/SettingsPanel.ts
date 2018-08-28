
namespace CustomOnlineWarCreator {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;
    import StageManager = Utility.StageManager;

    const CONFIRM_INTERVAL_MS = 5000;

    export class CreateWarPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: CreateWarPanel;

        private _tabSettings: GameUi.UiTab;
        private _btnBack    : GameUi.UiButton;
        private _btnConfirm : GameUi.UiButton;

        private _dataForTab            : GameUi.DataForUiTab[];
        private _timeoutIdForBtnConfirm: number;

        public static open(): void {
            if (!CreateWarPanel._instance) {
                CreateWarPanel._instance = new CreateWarPanel();
            }
            CreateWarPanel._instance.open();
        }
        public static close(): void {
            if (CreateWarPanel._instance) {
                CreateWarPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled(true);
            this.skinName = "resource/skins/customOnlineWarCreator/SettingsPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ];
            this._notifyListeners = [
                { name: Notify.Type.SCreateCustomOnlineWar, callback: this._onNotifySCreateCustomOnlineWar },
            ];
            this._tabSettings.setBarItemRenderer(TabItemRenderer);
        }

        protected _onOpened(): void {
            this._tabSettings.bindData([
                {
                    tabItemData: { name: Lang.getText(Lang.BigType.B01, Lang.SubType.S02) },
                    pageClass  : BasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.BigType.B01, Lang.SubType.S03) },
                    pageClass  : AdvancedSettingsPage,
                },
            ]);

            this._btnConfirm.enabled = true;
        }

        protected _onClosed(): void {
            this._tabSettings.clear();
            this._clearTimeoutForBtnConfirm();
        }

        private _onTouchedBtnBack(e: egret.TouchEvent): void {
            CreateWarPanel.close();
            ChooseMapPanel.open();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            CreateWarProxy.reqCreateCustomOnlineWar(CreateWarModel.createDataForCreateWar());

            this._btnConfirm.enabled = false;
            this._resetTimeoutForBtnConfirm();
        }

        private _onNotifySCreateCustomOnlineWar(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.BigType.B00, Lang.SubType.S15));
            StageManager.gotoLobby();
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
