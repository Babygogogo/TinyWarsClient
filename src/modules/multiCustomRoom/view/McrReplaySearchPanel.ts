
namespace TinyWars.MultiCustomRoom {
    import Types            = Utility.Types;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Helpers          = Utility.Helpers;
    import CommonConstants  = Utility.ConfigManager.COMMON_CONSTANTS;

    export class McrReplaySearchPanel extends GameUi.UiPanel {
        protected _IS_EXCLUSIVE = false;
        protected _LAYER_TYPE   = Types.LayerType.Hud2;

        private static _instance: McrReplaySearchPanel;

        private _labelTitle             : GameUi.UiLabel;
        private _labelDesc              : GameUi.UiLabel;
        private _btnClose               : GameUi.UiButton;
        private _btnReset               : GameUi.UiButton;
        private _btnSearch              : GameUi.UiButton;
        private _labelMapNameTitle      : GameUi.UiLabel;
        private _inputMapName           : GameUi.UiTextInput;
        private _labelReplayIdTitle     : GameUi.UiLabel;
        private _inputReplayId          : GameUi.UiTextInput;
        private _labelMyRatingTitle     : GameUi.UiLabel;
        private _inputMyRating          : GameUi.UiTextInput;
        private _labelGlobalRatingTitle : GameUi.UiLabel;
        private _inputGlobalRating      : GameUi.UiTextInput;
        private _labelCoNameTitle       : GameUi.UiLabel;
        private _inputCoName            : GameUi.UiTextInput;
        private _labelUserNicknameTitle : GameUi.UiLabel;
        private _inputUserNickname      : GameUi.UiTextInput;

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
                { ui: this._btnClose,           callback: this.close },
                { ui: this._btnReset,           callback: this._onTouchedBtnReset },
                { ui: this._btnSearch,          callback: this._onTouchedBtnSearch },
                { ui: this._inputGlobalRating,  callback: this._onFocusOutInputGlobalRating,    eventType: egret.Event.FOCUS_OUT },
                { ui: this._inputMyRating,      callback: this._onFocusOutInputMyRating,        eventType: egret.Event.FOCUS_OUT },
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
            const replayId      = replayIdText ? Number(replayIdText) : null;

            const myRatingText  = this._inputMyRating.text;
            const myRating      = myRatingText ? Number(myRatingText) : null;

            const globalRatingText  = this._inputGlobalRating.text;
            const globalRating      = globalRatingText ? Number(globalRatingText) : null;

            McrProxy.reqReplayInfos({
                replayId        : Helpers.checkIsNumber(replayId) ? replayId : null,
                mapName         : this._inputMapName.text || null,
                minMyRating     : myRating != null ? Math.min(myRating, CommonConstants.ReplayMaxRating) : null,
                minGlobalRating : globalRating != null ? Math.min(globalRating, CommonConstants.ReplayMaxRating) : null,
                userNickname    : this._inputUserNickname.text || null,
                coName          : this._inputCoName.text || null,
            });

            this.close();
        }

        private _onFocusOutInputGlobalRating(e: egret.Event): void {
            const input     = this._inputGlobalRating;
            const maxRating = CommonConstants.ReplayMaxRating;
            if (Number(input.text) > maxRating) {
                input.text = "" + maxRating;
            }
        }

        private _onFocusOutInputMyRating(e: egret.Event): void {
            const input     = this._inputMyRating;
            const maxRating = CommonConstants.ReplayMaxRating;
            if (Number(input.text) > maxRating) {
                input.text = "" + maxRating;
            }
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = Lang.getText(Lang.Type.B0234);
            this._labelReplayIdTitle.text       = Lang.getText(Lang.Type.B0235);
            this._labelMapNameTitle.text        = Lang.getText(Lang.Type.B0225);
            this._labelMyRatingTitle.text       = Lang.getText(Lang.Type.B0363);
            this._labelGlobalRatingTitle.text   = Lang.getText(Lang.Type.B0364);
            this._labelUserNicknameTitle.text   = Lang.getText(Lang.Type.B0393);
            this._labelCoNameTitle.text         = Lang.getText(Lang.Type.B0394);
            this._labelDesc.text                = Lang.getText(Lang.Type.A0063);
            this._btnReset.label                = Lang.getText(Lang.Type.B0233);
            this._btnSearch.label               = Lang.getText(Lang.Type.B0228);
        }
    }
}
