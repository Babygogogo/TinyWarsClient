
namespace TinyWars.User {
    import Lang     = Utility.Lang;
    import Helpers  = Utility.Helpers;

    export class UserPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = true;

        private static _instance: UserPanel;

        private _labelTitle         : TinyWars.GameUi.UiLabel;

        private _labelRankScore     : TinyWars.GameUi.UiLabel;
        private _labelRankName      : TinyWars.GameUi.UiLabel;
        private _labelRank2pWins    : TinyWars.GameUi.UiLabel;
        private _labelRank2pLoses   : TinyWars.GameUi.UiLabel;
        private _labelRank2pDraws   : TinyWars.GameUi.UiLabel;

        private _labelMcw2pWins     : TinyWars.GameUi.UiLabel;
        private _labelMcw2pLoses    : TinyWars.GameUi.UiLabel;
        private _labelMcw2pDraws    : TinyWars.GameUi.UiLabel;
        private _labelMcw3pWins     : TinyWars.GameUi.UiLabel;
        private _labelMcw3pLoses    : TinyWars.GameUi.UiLabel;
        private _labelMcw3pDraws    : TinyWars.GameUi.UiLabel;
        private _labelMcw4pWins     : TinyWars.GameUi.UiLabel;
        private _labelMcw4pLoses    : TinyWars.GameUi.UiLabel;
        private _labelMcw4pDraws    : TinyWars.GameUi.UiLabel;

        private _labelRegisterTime  : TinyWars.GameUi.UiLabel;
        private _labelLastLoginTime : TinyWars.GameUi.UiLabel;
        private _labelOnlineTime    : TinyWars.GameUi.UiLabel;
        private _labelLoginCount    : TinyWars.GameUi.UiLabel;

        private _btnClose           : TinyWars.GameUi.UiButton;

        private _userId: number;

        public static show(userId: number): void {
            if (!UserPanel._instance) {
                UserPanel._instance = new UserPanel();
            }
            UserPanel._instance._userId = userId;
            UserPanel._instance.open();
        }

        public static hide(): void {
            if (UserPanel._instance) {
                UserPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = "resource/skins/user/UserPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Utility.Notify.Type.SGetUserPublicInfo, callback: this._onNotifySGetUserPublicInfo },
            ];
            this._uiListeners = [
                { ui: this._btnClose, callback: this.close },
            ];
        }

        protected _onOpened(): void {
            UserProxy.reqGetUserPublicInfo(this._userId);

            this._updateView();
        }

        private _onNotifySGetUserPublicInfo(e: egret.Event): void {
            this._updateView();
        }

        private _updateView(): void {
            const info = this._userId != null ? UserModel.getUserInfo(this._userId) : undefined;
            if (info) {
                this._labelTitle.text       = Lang.getFormatedText(Lang.Type.F0009, info.nickname);

                this._labelRankScore.text   = `${info.rank2pScore}`;
                this._labelRankName.text    = ConfigManager.getRankName(info.rank2pScore);
                this._labelRank2pWins.text  = Lang.getFormatedText(Lang.Type.F0010, info.rank2pWins);
                this._labelRank2pLoses.text = Lang.getFormatedText(Lang.Type.F0011, info.rank2pLoses);
                this._labelRank2pDraws.text = Lang.getFormatedText(Lang.Type.F0012, info.rank2pDraws);

                this._labelMcw2pWins.text   = Lang.getFormatedText(Lang.Type.F0010, info.mcw2pWins);
                this._labelMcw2pLoses.text  = Lang.getFormatedText(Lang.Type.F0011, info.mcw2pLoses);
                this._labelMcw2pDraws.text  = Lang.getFormatedText(Lang.Type.F0012, info.mcw2pDraws);
                this._labelMcw3pWins.text   = Lang.getFormatedText(Lang.Type.F0010, info.mcw3pWins);
                this._labelMcw3pLoses.text  = Lang.getFormatedText(Lang.Type.F0011, info.mcw3pLoses);
                this._labelMcw3pDraws.text  = Lang.getFormatedText(Lang.Type.F0012, info.mcw3pDraws);
                this._labelMcw4pWins.text   = Lang.getFormatedText(Lang.Type.F0010, info.mcw4pWins);
                this._labelMcw4pLoses.text  = Lang.getFormatedText(Lang.Type.F0011, info.mcw4pLoses);
                this._labelMcw4pDraws.text  = Lang.getFormatedText(Lang.Type.F0012, info.mcw4pDraws);

                this._labelRegisterTime.text    = Helpers.getTimestampText(info.registerTime);
                this._labelLastLoginTime.text   = Helpers.getTimestampText(info.lastLoginTime);
                this._labelOnlineTime.text      = Helpers.getTimeDurationText(info.onlineTime);
                this._labelLoginCount.text      = `${info.loginCount}`;
            }
        }
    }
}
