
namespace TinyWars.User {
    import FloatText    = Utility.FloatText;
    import Lang         = Utility.Lang;
    import NotifyType   = Utility.Notify.Type;

    export class UserChangeDiscordIdPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

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
                { type: NotifyType.SUserChangeDiscordId,         callback: this._onSUserChangeDiscordId },
                { type: NotifyType.SUserChangeDiscordIdFailed,   callback: this._onSUserChangeDiscordIdFailed },
            ];
            this._uiListeners = [
                { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            ];
        }
        protected _onOpened(): void {
            this._isRequesting          = false;
            this._inputDiscordId.text   = UserModel.getSelfDiscordId();
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
    }
}
