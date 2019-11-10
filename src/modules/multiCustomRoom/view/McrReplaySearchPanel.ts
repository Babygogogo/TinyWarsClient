
namespace TinyWars.MultiCustomRoom {
    import Types        = Utility.Types;
    import Lang         = Utility.Lang;
    import FloatText    = Utility.FloatText;
    import Notify       = Utility.Notify;
    import Helpers      = Utility.Helpers;
    import ProtoTypes   = Utility.ProtoTypes;

    export class McrReplaySearchPanel extends GameUi.UiPanel {
        protected _IS_EXCLUSIVE = false;
        protected _LAYER_TYPE   = Types.LayerType.Hud2;

        private static _instance: McrReplaySearchPanel;

        private _labelTitle         : GameUi.UiLabel;
        private _labelDesc          : GameUi.UiLabel;
        private _btnClose           : GameUi.UiButton;
        private _btnReset           : GameUi.UiButton;
        private _btnSearch          : GameUi.UiButton;
        private _labelMapNameTitle  : GameUi.UiLabel;
        private _inputMapName       : GameUi.UiTextInput;
        private _labelReplayIdTitle : GameUi.UiLabel;
        private _inputReplayId      : GameUi.UiTextInput;

        public static show(): void {
            if (!McrReplaySearchPanel._instance) {
                McrReplaySearchPanel._instance = new McrReplaySearchPanel();
            }
            McrReplaySearchPanel._instance.open();
        }
        public static hide(): void {
            if (McrReplaySearchPanel._instance) {
                McrReplaySearchPanel._instance.close();
            }
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/multiCustomRoom/McrReplaySearchPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnClose,  callback: this.close },
                { ui: this._btnReset,  callback: this._onTouchedBtnReset },
                { ui: this._btnSearch, callback: this._onTouchedBtnSearch },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];
        }

        protected _onOpened(): void {
            this._updateComponentsForLanguage();
            this._btnReset.enabled  = true;
            this._btnSearch.enabled = true;
        }

        private _onTouchedBtnReset(e: egret.TouchEvent): void {
            McrProxy.reqReplayInfos();
            this.close();
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnSearch(e: egret.TouchEvent): void {
            const replayIdText  = this._inputReplayId.text;
            const replayId      = replayIdText ? Number(this._inputReplayId.text) : null;
            McrProxy.reqReplayInfos({
                replayId: Helpers.checkIsNumber(replayId) ? replayId : null,
                mapName : this._inputMapName.text || null,
            });

            this.close();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = Lang.getText(Lang.Type.B0234);
            this._labelReplayIdTitle.text   = Lang.getText(Lang.Type.B0235);
            this._labelMapNameTitle.text    = Lang.getText(Lang.Type.B0225);
            this._labelDesc.text            = Lang.getText(Lang.Type.A0063);
            this._btnClose.label            = Lang.getText(Lang.Type.B0146);
            this._btnReset.label            = Lang.getText(Lang.Type.B0233);
            this._btnSearch.label           = Lang.getText(Lang.Type.B0228);
        }
    }
}
