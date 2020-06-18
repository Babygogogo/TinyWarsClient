
namespace TinyWars.MultiCustomRoom {
    import Lang         = Utility.Lang;
    import Types        = Utility.Types;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;
    import ProtoTypes   = Utility.ProtoTypes;
    import ConfirmPanel = Common.ConfirmPanel;

    const CONFIRM_INTERVAL_MS = 5000;

    export class McrJoinSettingsPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Scene;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: McrJoinSettingsPanel;

        private _labelMenuTitle : GameUi.UiLabel;
        private _tabSettings    : GameUi.UiTab;
        private _btnBack        : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

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
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.SMcrJoinWar,        callback: this._onNotifySMcrJoinWar },
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

            this._updateComponentsForLanguage();
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
            const data      = McrModel.getJoinWarData();
            const callback1 = () => {
                McrProxy.reqJoin(data);

                this._btnConfirm.enabled = false;
                this._resetTimeoutForBtnConfirm();
            };
            const callback2 = () => {
                if (data.coId != null) {
                    callback1();
                } else {
                    ConfirmPanel.show({
                        title   : Lang.getText(Lang.Type.B0088),
                        content : `${Lang.getText(Lang.Type.A0050)}\n${Lang.getText(Lang.Type.A0052)}`,
                        callback: callback1,
                    });
                }
            }

            if (McrModel.getJoinWarWarRuleIndex() != null) {
                callback2();
            } else {
                ConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0102),
                    callback: callback2,
                });
            }
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifySMcrJoinWar(e: egret.Event): void {
            const data  = e.data as ProtoTypes.IS_McrJoinWar;
            const warId = data.warId;
            FloatText.show(Lang.getText(warId != null ? Lang.Type.A0019 : Lang.Type.A0018));
            this.close();
            McrJoinMapListPanel.show();

            if (data.isSelfInTurn) {
                ConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0116),
                    callback: () => {
                        McrProxy.reqContinueWar(warId);
                    },
                });
            }
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
            this._labelMenuTitle.text   = Lang.getText(Lang.Type.B0023);
            this._btnBack.label         = Lang.getText(Lang.Type.B0146);
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
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
