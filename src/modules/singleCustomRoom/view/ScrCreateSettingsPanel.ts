
namespace TinyWars.SingleCustomRoom {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;
    import ProtoTypes   = Utility.ProtoTypes;
    import Types        = Utility.Types;

    const CONFIRM_INTERVAL_MS = 5000;

    export class ScrCreateSettingsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: ScrCreateSettingsPanel;

        private _tabSettings    : GameUi.UiTab;
        private _labelMenuTitle : GameUi.UiLabel;
        private _btnBack        : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _timeoutIdForBtnConfirm: number;

        public static show(): void {
            if (!ScrCreateSettingsPanel._instance) {
                ScrCreateSettingsPanel._instance = new ScrCreateSettingsPanel();
            }
            ScrCreateSettingsPanel._instance.open(undefined);
        }
        public static hide(): void {
            if (ScrCreateSettingsPanel._instance) {
                ScrCreateSettingsPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight(true);
            this.skinName = "resource/skins/singleCustomRoom/ScrCreateSettingsPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBack,    callback: this._onTouchedBtnBack },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgScrCreateWar,    callback: this._onMsgScrCreateWar },
            ]);
            this._tabSettings.setBarItemRenderer(TabItemRenderer);

            this._tabSettings.bindData([
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0002) },
                    pageClass  : ScrCreateBasicSettingsPage,
                },
                {
                    tabItemData: { name: Lang.getText(Lang.Type.B0003) },
                    pageClass  : ScrCreateAdvancedSettingsPage,
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
            ScrCreateMapListPanel.show();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const tips = ScrModel.getCreateWarInvalidParamTips();
            if (tips) {
                FloatText.show(tips);
            } else {
                const data  = ScrModel.getCreateWarData();
                const func  = () => {
                    ScrProxy.reqScrCreateWar(ScrModel.getCreateWarData());

                    this._btnConfirm.enabled = false;
                    this._resetTimeoutForBtnConfirm();
                }

                if (ScrModel.checkIsSaveSlotEmpty(data.slotIndex)) {
                    func();
                } else {
                    Common.CommonConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : Lang.getText(Lang.Type.A0070),
                        callback: func,
                    });
                }
            }
        }

        private _onMsgScrCreateWar(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgScrCreateWar.IS;
            Utility.FlowManager.gotoSingleCustomWar({
                slotComment : null,
                slotIndex   : data.slotIndex,
                warData     : data.warData,
            });
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
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0155);
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
