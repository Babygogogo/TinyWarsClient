
namespace TinyWars.MapManagement {
    import Lang     = Utility.Lang;
    import Notify   = Utility.Notify;

    export class MmAcceptMapPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: MmAcceptMapPanel;

        private _labelTitle     : GameUi.UiLabel;
        private _labelTips      : GameUi.UiLabel;
        private _inputReason    : GameUi.UiTextInput;
        private _btnCancel      : GameUi.UiButton;
        private _btnConfirm     : GameUi.UiButton;

        private _groupMcw       : eui.Group;
        private _labelMcw       : GameUi.UiLabel;
        private _imgMcw         : GameUi.UiImage;

        private _groupScw       : eui.Group;
        private _labelScw       : GameUi.UiLabel;
        private _imgScw         : GameUi.UiImage;

        private _groupMrwStd    : eui.Group;
        private _labelMrwStd    : GameUi.UiLabel;
        private _imgMrwStd      : GameUi.UiImage;

        private _groupMrwFog    : eui.Group;
        private _labelMrwFog    : GameUi.UiLabel;
        private _imgMrwFog      : GameUi.UiImage;

        public static show(): void {
            if (!MmAcceptMapPanel._instance) {
                MmAcceptMapPanel._instance = new MmAcceptMapPanel();
            }
            MmAcceptMapPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (MmAcceptMapPanel._instance) {
                await MmAcceptMapPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/mapManagement/MmAcceptMapPanel.exml";
            this._setIsTouchMaskEnabled();
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm, },
                { ui: this._groupMcw,       callback: this._onTouchedGroupMcw },
                { ui: this._groupScw,       callback: this._onTouchedGroupScw },
                { ui: this._groupMrwStd,      callback: this._onTouchedGroupMrwStd },
                { ui: this._groupMrwFog,   callback: this._onTouchedGroupMrwFog },
            ]);

            this._updateComponentsForLanguage();

            this._imgMcw.visible    = false;
            this._imgScw.visible    = false;
            this._imgMrwStd.visible = false;
            this._imgMrwFog.visible = false;
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
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
                isAccept        : true,
                reviewComment   : this._inputReason.text,
                availability    : {
                    canMcw      : this._imgMcw.visible,
                    canScw      : this._imgScw.visible,
                    canMrwStd   : this._imgMrwStd.visible,
                    canMrwFog   : this._imgMrwFog.visible,
                },
            });
            this.close();
        }
        private _onTouchedGroupMcw(e: egret.TouchEvent): void {
            this._imgMcw.visible = !this._imgMcw.visible;
        }
        private _onTouchedGroupScw(e: egret.TouchEvent): void {
            this._imgScw.visible = !this._imgScw.visible;
        }
        private _onTouchedGroupMrwStd(e: egret.TouchEvent): void {
            this._imgMrwStd.visible = !this._imgMrwStd.visible;
        }
        private _onTouchedGroupMrwFog(e: egret.TouchEvent): void {
            this._imgMrwFog.visible = !this._imgMrwFog.visible;
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label  = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label   = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text   = Lang.getText(Lang.Type.B0296);
            this._labelTips.text    = Lang.getText(Lang.Type.A0105);
            this._labelMcw.text     = Lang.getText(Lang.Type.B0200);
            this._labelMrwStd.text  = Lang.getText(Lang.Type.B0404);
            this._labelMrwFog.text  = Lang.getText(Lang.Type.B0408);
            this._labelScw.text     = Lang.getText(Lang.Type.B0409);
        }
    }
}
