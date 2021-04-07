
namespace TinyWars.Common {
    import Notify       = Utility.Notify;
    import ProtoTypes   = Utility.ProtoTypes;
    import Lang         = Utility.Lang;
    import Helpers      = Utility.Helpers;

    export class CommonServerStatusPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonServerStatusPanel;

        private readonly _imgMask                   : GameUi.UiImage;
        private readonly _group                     : eui.Group;
        private readonly _labelTitle                : TinyWars.GameUi.UiLabel;
        private readonly _labelAccountsTitle        : TinyWars.GameUi.UiLabel;
        private readonly _labelAccounts             : TinyWars.GameUi.UiLabel;
        private readonly _labelOnlineTimeTitle      : TinyWars.GameUi.UiLabel;
        private readonly _labelOnlineTime           : TinyWars.GameUi.UiLabel;
        private readonly _labelNewAccountsTitle     : TinyWars.GameUi.UiLabel;
        private readonly _labelNewAccounts          : TinyWars.GameUi.UiLabel;
        private readonly _labelActiveAccountsTitle  : TinyWars.GameUi.UiLabel;
        private readonly _labelActiveAccounts       : TinyWars.GameUi.UiLabel;

        public static show(): void {
            if (!CommonServerStatusPanel._instance) {
                CommonServerStatusPanel._instance = new CommonServerStatusPanel();
            }
            CommonServerStatusPanel._instance.open(undefined);
        }

        public static async hide(): Promise<void> {
            if (CommonServerStatusPanel._instance) {
                await CommonServerStatusPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/common/CommonServerStatusPanel.exml";
        }

        protected _onOpened(): void {
            this._setNotifyListenerArray([
                { type: Notify.Type.MsgCommonGetServerStatus, callback: this._onMsgCommonGetServerStatus },
            ]);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();

            CommonProxy.reqCommonGetServerStatus();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation();
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

        private _showOpenAnimation(): void {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 0 },
                endProps    : { alpha: 1 },
                tweenTime   : 200,
                waitTime    : 0,
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
                tweenTime   : 200,
                waitTime    : 0,
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    tweenTime   : 200,
                    waitTime    : 0,
                    callback    : resolve,
                });
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                    tweenTime   : 200,
                    waitTime    : 0,
                });
            });
        }
    }
}
