
namespace TinyWars.MapManagement {
    import Lang = Utility.Lang;

    export class MmAcceptMapPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmAcceptMapPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelTips      : GameUi.UiLabel;
        private _inputReason    : GameUi.UiTextInput;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        public static show(): void {
            if (!MmAcceptMapPanel._instance) {
                MmAcceptMapPanel._instance = new MmAcceptMapPanel();
            }
            MmAcceptMapPanel._instance.open();
        }

        public static hide(): void {
            if (MmAcceptMapPanel._instance) {
                MmAcceptMapPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/mapManagement/MmAcceptMapPanel.exml";
            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
            ];
        }

        protected _onOpened(): void {
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text   = Lang.getText(Lang.Type.B0296);
            this._labelTips.text    = Lang.getText(Lang.Type.A0105);
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            MmAcceptMapPanel.hide();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const war = MapEditor.MeManager.getWar();
            WarMap.WarMapProxy.reqReviewMap(war.getDesignerUserId(), war.getSlotIndex(), war.getModifiedTime(), true, this._inputReason.text);
            this.close();
        }
    }
}
