
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MapManagement {
    import Lang = Utility.Lang;

    type OpenData = {
        war: MapEditor.MeWar;
    }
    export class MmRejectMapPanel extends GameUi.UiPanel<OpenData> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmRejectMapPanel;

        // @ts-ignore
        private _labelTitle     : GameUi.UiLabel;
        // @ts-ignore
        private _labelTips      : GameUi.UiLabel;
        // @ts-ignore
        private _inputReason    : GameUi.UiTextInput;
        // @ts-ignore
        private _btnCancel      : GameUi.UiButton;
        // @ts-ignore
        private _btnConfirm     : GameUi.UiButton;

        public static show(openData: OpenData): void {
            if (!MmRejectMapPanel._instance) {
                MmRejectMapPanel._instance = new MmRejectMapPanel();
            }
            MmRejectMapPanel._instance.open(openData);
        }

        public static async hide(): Promise<void> {
            if (MmRejectMapPanel._instance) {
                await MmRejectMapPanel._instance.close();
            }
        }

        public constructor() {
            super();

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

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private _onTouchedBtnConfirm(): void {
            const war = this._getOpenData().war;
            WarMap.WarMapProxy.reqMmReviewMap({
                designerUserId  : war.getMapDesignerUserId(),
                slotIndex       : war.getMapSlotIndex(),
                modifiedTime    : war.getMapModifiedTime(),
                isAccept        : false,
                reviewComment   : this._inputReason.text,
                availability    : {
                    canMcw      : false,
                    canCcw      : false,
                    canMrwStd   : false,
                    canMrwFog   : false,
                    canScw      : false,
                    canSrw      : false,
                },
            });
            this.close();
        }
    }
}
