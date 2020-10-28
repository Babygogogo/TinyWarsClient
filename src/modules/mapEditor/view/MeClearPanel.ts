
namespace TinyWars.MapEditor {
    import Lang         = Utility.Lang;
    import Notify       = Utility.Notify;
    import FloatText    = Utility.FloatText;

    export class MeClearPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: MeClearPanel;

        private _labelTitle         : GameUi.UiLabel;
        private _labelCurrSizeTitle : GameUi.UiLabel;
        private _labelCurrWidth     : GameUi.UiLabel;
        private _labelCurrHeight    : GameUi.UiLabel;
        private _labelNewSizeTitle  : GameUi.UiLabel;
        private _inputNewWidth      : GameUi.UiTextInput;
        private _inputNewHeight     : GameUi.UiTextInput;
        private _labelTips1         : GameUi.UiLabel;
        private _labelTips2         : GameUi.UiLabel;
        private _btnCancel          : GameUi.UiButton;
        private _btnConfirm         : GameUi.UiButton;

        private _newWidth   : number;
        private _newHeight  : number;

        public static show(): void {
            if (!MeClearPanel._instance) {
                MeClearPanel._instance = new MeClearPanel();
            }
            MeClearPanel._instance.open();
        }

        public static hide(): void {
            if (MeClearPanel._instance) {
                MeClearPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this.skinName = "resource/skins/mapEditor/MeClearPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnCancel,          callback: this._onTouchedBtnCancel, },
                { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm, },
                { ui: this._inputNewWidth,      callback: this._onFocusOutInputNewWidth,    eventType: egret.Event.FOCUS_OUT },
                { ui: this._inputNewHeight,     callback: this._onFocusOutInputNewHeight,   eventType: egret.Event.FOCUS_OUT },
            ];
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();

            const war                   = MeManager.getWar();
            const { width, height }     = war.getTileMap().getMapSize();
            this._labelCurrHeight.text  = "" + height;
            this._labelCurrWidth.text   = "" + width;
            this._inputNewHeight.text   = "" + height;
            this._inputNewWidth.text    = "" + width;
            this._newWidth              = width;
            this._newHeight             = height;
        }

        private _onTouchedBtnCancel(e: egret.TouchEvent): void {
            this.close();
        }

        private async _onTouchedBtnConfirm(e: egret.TouchEvent): Promise<void> {
            const width         = this._newWidth;
            const height        = this._newHeight;
            const gridsCount    = width * height;
            if ((!gridsCount) || (gridsCount <= 0)) {
                FloatText.show(Lang.getText(Lang.Type.A0087));
            } else {
                const war       = MeManager.getWar();
                const currSize  = war.getTileMap().getMapSize();
                if ((width !== currSize.width) || (height !== currSize.height)) {
                    war.stopRunning();
                    await war.initWithMapEditorData({
                        mapRawData  : MeUtility.clearMap(war.serializeForMap(), width, height),
                        slotIndex   : war.getMapSlotIndex(),
                    });
                    war.setIsMapModified(true);
                    war.startRunning()
                        .startRunningView();
                }

                this.close();
                MeWarMenuPanel.hide();
            }
        }

        private _onFocusOutInputNewWidth(e: egret.Event): void {
            const input = this._inputNewWidth;
            let width = Number(input.text);
            if ((isNaN(width)) || (width <= 0)) {
                width = MeManager.getWar().getTileMap().getMapSize().width;
            }
            this._newWidth  = width;
            input.text      = "" + width;
        }

        private _onFocusOutInputNewHeight(e: egret.Event): void {
            const input = this._inputNewHeight;
            let width = Number(input.text);
            if ((isNaN(width)) || (width <= 0)) {
                width = MeManager.getWar().getTileMap().getMapSize().height;
            }
            this._newHeight = width;
            input.text      = "" + width;
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._btnConfirm.label          = Lang.getText(Lang.Type.B0026);
            this._btnCancel.label           = Lang.getText(Lang.Type.B0154);
            this._labelTitle.text           = Lang.getText(Lang.Type.B0391);
            this._labelCurrSizeTitle.text   = Lang.getText(Lang.Type.B0291);
            this._labelNewSizeTitle.text    = Lang.getText(Lang.Type.B0292);
            this._labelTips1.text           = Lang.getText(Lang.Type.A0117);
            this._labelTips2.text           = Lang.getFormattedText(Lang.Type.F0023, Utility.ConfigManager.MAP_CONSTANTS.MaxGridsCount);
        }
    }
}
