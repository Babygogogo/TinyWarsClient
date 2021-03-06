
namespace TinyWars.MapManagement {
    import Lang = Utility.Lang;

    export class MmRejectMapPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmRejectMapPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelTips      : GameUi.UiLabel;
        private _inputReason    : GameUi.UiTextInput;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        public static show(): void {
            if (!MmRejectMapPanel._instance) {
                MmRejectMapPanel._instance = new MmRejectMapPanel();
            }
            MmRejectMapPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MmRejectMapPanel._instance) {
                await MmRejectMapPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/mapManagement/MmRejectMapPanel.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnCancel,  callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm, },
            ]);

            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text   = Lang.getText(Lang.Type.B0297);
            this._labelTips.text    = Lang.getText(Lang.Type.A0094);
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            const war = MapEditor.MeModel.getWar();
            WarMap.WarMapProxy.reqMmReviewMap({
                designerUserId  : war.getMapDesignerUserId(),
                slotIndex       : war.getMapSlotIndex(),
                modifiedTime    : war.getMapModifiedTime(),
                isAccept        : false,
                reviewComment   : this._inputReason.text,
                availability    : {
                    canMcw      : false,
                    canMrwStd   : false,
                    canMrwFog   : false,
                    canScw      : false,
                },
            });
            this.close();
        }
    }
}
