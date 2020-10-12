
namespace TinyWars.User {
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;

    export class UserChangeDiscordIdPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private _labelName      : GameUi.UiLabel;
        private _labelDiscordId : GameUi.UiLabel;
        private _labelNote      : GameUi.UiLabel;
        private _inputDiscordId : GameUi.UiTextInput;
        private _btnConfirm     : GameUi.UiButton;

        private _isRequesting   = false;

        private static _instance: UserChangeDiscordIdPanel;

        public static show(): void {
            if (!UserChangeDiscordIdPanel._instance) {
                UserChangeDiscordIdPanel._instance = new UserChangeDiscordIdPanel();
            }
            UserChangeDiscordIdPanel._instance.open();
        }

        public static hide(): void {
            if (UserChangeDiscordIdPanel._instance) {
                UserChangeDiscordIdPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this._setTouchMaskEnabled();
            this._callbackForTouchMask = () => this.close();
            this.skinName = "resource/skins/user/UserChangeDiscordIdPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: NotifyType.MsgUserChangeDiscordId,         callback: this._onSUserChangeDiscordId },
                { type: NotifyType.MsgUserChangeDiscordIdFailed,   callback: this._onSUserChangeDiscordIdFailed },
                { type: NotifyType.LanguageChanged,              callback: this._onNotifyLanguageChanged },
            ];
            this._uiListeners = [
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ];
        }
        protected async _onOpened(): Promise<void> {
            this._isRequesting          = false;
            this._inputDiscordId.text   = await UserModel.getSelfDiscordId();
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnConfirm(e: egret.TouchEvent): void {
            if (this._isRequesting) {
                FloatText.show(Lang.getText(Lang.Type.A0046));
            } else {
                const discordId = this._inputDiscordId.text;
                if (!Utility.Helpers.checkIsDiscordIdValid(discordId)) {
                    FloatText.show(Lang.getText(Lang.Type.A0048));
                } else {
                    this._isRequesting = true;
                    UserProxy.reqChangeDiscordId(discordId);
                }
            }
        }

        private _onSUserChangeDiscordId(e: egret.Event): void {
            FloatText.show(Lang.getText(Lang.Type.A0049));
            this.close();
        }
        private _onSUserChangeDiscordIdFailed(e: egret.Event): void {
            this._isRequesting = false;
        }

        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelName.text        = Lang.getText(Lang.Type.B0150);
            this._labelDiscordId.text   = `${Lang.getText(Lang.Type.B0243)}:`;
            this._labelNote.text        = Lang.getText(Lang.Type.A0067);
            this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
        }
    }
}
