
namespace TinyWars.Common {
    import Notify       = Utility.Notify;
    import ProtoTypes   = Utility.ProtoTypes;
    import Lang         = Utility.Lang;

    export class CommonServerStatusPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonServerStatusPanel;

        private _labelTitle                 : TinyWars.GameUi.UiLabel;
        private _labelAccountsTitle         : TinyWars.GameUi.UiLabel;
        private _labelAccounts              : TinyWars.GameUi.UiLabel;
        private _labelOnlineTimeTitle       : TinyWars.GameUi.UiLabel;
        private _labelOnlineTime            : TinyWars.GameUi.UiLabel;
        private _labelNewAccountsTitle      : TinyWars.GameUi.UiLabel;
        private _labelNewAccounts           : TinyWars.GameUi.UiLabel;
        private _labelActiveAccountsTitle   : TinyWars.GameUi.UiLabel;
        private _labelActiveAccounts        : TinyWars.GameUi.UiLabel;

        public static show(): void {
            if (!CommonServerStatusPanel._instance) {
                CommonServerStatusPanel._instance = new CommonServerStatusPanel();
            }
            CommonServerStatusPanel._instance.open(undefined);
        }

        public static hide(): void {
            if (CommonServerStatusPanel._instance) {
                CommonServerStatusPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsAutoAdjustHeight();
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName               = "resource/skins/common/CommonServerStatusPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.MsgCommonGetServerStatus, callback: this._onMsgCommonGetServerStatus },
            ]);

            this._updateComponentsForLanguage();

            CommonProxy.reqCommonGetServerStatus();
        }

        private _onMsgCommonGetServerStatus(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCommonGetServerStatus.IS;

            this._labelAccounts.text        = "" + data.totalAccounts;
            this._labelOnlineTime.text      = Utility.Helpers.getTimeDurationText(data.totalOnlineTime);
            this._labelActiveAccounts.text  = data.activeAccounts.join(" / ");
            this._labelNewAccounts.text     = data.newAccounts.join(" / ");
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = Lang.getText(Lang.Type.B0327);
            this._labelAccountsTitle.text       = `${Lang.getText(Lang.Type.B0328)}:`;
            this._labelOnlineTimeTitle.text     = `${Lang.getText(Lang.Type.B0329)}:`;
            this._labelNewAccountsTitle.text    = `${Lang.getText(Lang.Type.B0330)}:`;
            this._labelActiveAccountsTitle.text = `${Lang.getText(Lang.Type.B0331)}:`;
        }
    }
}
