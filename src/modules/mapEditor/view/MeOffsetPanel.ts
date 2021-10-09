
// import Helpers              from "../../tools/helpers/Helpers";
// import Types                from "../../tools/helpers/Types";
// import Lang                 from "../../tools/lang/Lang";
// import TwnsLangTextType     from "../../tools/lang/LangTextType";
// import TwnsNotifyType       from "../../tools/notify/NotifyType";
// import TwnsUiButton         from "../../tools/ui/UiButton";
// import TwnsUiLabel          from "../../tools/ui/UiLabel";
// import TwnsUiPanel          from "../../tools/ui/UiPanel";
// import TwnsUiTextInput      from "../../tools/ui/UiTextInput";
// import MeModel              from "../model/MeModel";
// import MeUtility            from "../model/MeUtility";
// import TwnsMeWarMenuPanel   from "./MeWarMenuPanel";

namespace TwnsMeOffsetPanel {
    import NotifyType       = TwnsNotifyType.NotifyType;
    import LangTextType     = TwnsLangTextType.LangTextType;

    export class MeOffsetPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeOffsetPanel;

        private readonly _labelTitle!   : TwnsUiLabel.UiLabel;
        private readonly _inputOffsetX! : TwnsUiTextInput.UiTextInput;
        private readonly _inputOffsetY! : TwnsUiTextInput.UiTextInput;
        private readonly _labelTips!    : TwnsUiLabel.UiLabel;
        private readonly _btnCancel!    : TwnsUiButton.UiButton;
        private readonly _btnConfirm!   : TwnsUiButton.UiButton;

        private _offsetX    : number | null = null;
        private _offsetY    : number | null = null;

        public static show(): void {
            if (!MeOffsetPanel._instance) {
                MeOffsetPanel._instance = new MeOffsetPanel();
            }
            MeOffsetPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (MeOffsetPanel._instance) {
                await MeOffsetPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this.skinName = "resource/skins/mapEditor/MeOffsetPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnCancel,      callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm, },
                { ui: this._inputOffsetX,   callback: this._onFocusOutInputOffsetX, eventType: egret.Event.FOCUS_OUT },
                { ui: this._inputOffsetY,   callback: this._onFocusOutInputOffsetY, eventType: egret.Event.FOCUS_OUT },
            ]);

            this._updateComponentsForLanguage();

            this._inputOffsetY.text = "" + 0;
            this._inputOffsetX.text = "" + 0;
            this._offsetX           = 0;
            this._offsetY           = 0;
        }

        private _onTouchedBtnCancel(): void {
            this.close();
        }

        private async _onTouchedBtnConfirm(): Promise<void> {
            const offsetX   = Helpers.getExisted(this._offsetX);
            const offsetY   = Helpers.getExisted(this._offsetY);
            const war       = Helpers.getExisted(MeModel.getWar());
            if ((offsetX !== 0) || (offsetY !== 0)) {
                war.stopRunning();
                await war.initWithMapEditorData({
                    mapRawData  : MeUtility.addOffset(war.serializeForMap(), offsetX, offsetY),
                    slotIndex   : war.getMapSlotIndex(),
                });
                war.setIsMapModified(true);
                war.startRunning()
                    .startRunningView();
            }

            this.close();
            TwnsMeWarMenuPanel.MeWarMenuPanel.hide();
        }

        private _onFocusOutInputOffsetX(): void {
            const input = this._inputOffsetX;
            let offsetX = Number(input.text);
            if (isNaN(offsetX)) {
                offsetX = 0;
            }
            this._offsetX  = offsetX;
            input.text      = "" + offsetX;
        }

        private _onFocusOutInputOffsetY(): void {
            const input = this._inputOffsetY;
            let offsetY = Number(input.text);
            if (isNaN(offsetY)) {
                offsetY = 0;
            }
            this._offsetY = offsetY;
            input.text      = "" + offsetY;
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label  = Lang.getText(LangTextType.B0026);
            this._btnCancel.label   = Lang.getText(LangTextType.B0154);
            this._labelTitle.text   = Lang.getText(LangTextType.B0293);
            this._labelTips.text    = Lang.getText(LangTextType.A0088);
        }
    }
}

// export default TwnsMeOffsetPanel;
