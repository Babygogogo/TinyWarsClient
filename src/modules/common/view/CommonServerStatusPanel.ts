
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.Common {
    import Notify           = Utility.Notify;
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import CommonConstants  = Utility.CommonConstants;
    import Helpers          = Utility.Helpers;

    export class CommonServerStatusPanel extends GameUi.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonServerStatusPanel;

        // @ts-ignore
        private readonly _imgMask                   : GameUi.UiImage;
        // @ts-ignore
        private readonly _group                     : eui.Group;
        // @ts-ignore
        private readonly _labelTitle                : GameUi.UiLabel;
        // @ts-ignore
        private readonly _btnClose                  : GameUi.UiButton;

        // @ts-ignore
        private readonly _labelAccountsTitle        : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelAccounts             : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelOnlineTimeTitle      : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelOnlineTime           : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelNewAccountsTitle     : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelNewAccounts          : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelActiveAccountsTitle  : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelActiveAccounts       : GameUi.UiLabel;

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
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
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

            const totalOnlineTime           = data.totalOnlineTime;
            this._labelOnlineTime.text      = totalOnlineTime == null ? CommonConstants.ErrorTextForUndefined : Utility.Helpers.getTimeDurationText(totalOnlineTime);

            const activeAccounts            = data.activeAccounts;
            this._labelActiveAccounts.text  = activeAccounts == null ? CommonConstants.ErrorTextForUndefined : activeAccounts.join(" / ");

            const newAccounts               = data.newAccounts;
            this._labelNewAccounts.text     = newAccounts == null ? CommonConstants.ErrorTextForUndefined : newAccounts.join(" / ");
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
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 0, verticalCenter: 40 },
                endProps    : { alpha: 1, verticalCenter: 0 },
            });
        }
        private _showCloseAnimation(): Promise<void> {
            return new Promise<void>(resolve => {
                Helpers.resetTween({
                    obj         : this._imgMask,
                    beginProps  : { alpha: 1 },
                    endProps    : { alpha: 0 },
                    callback    : resolve,
                });
                Helpers.resetTween({
                    obj         : this._group,
                    beginProps  : { alpha: 1, verticalCenter: 0 },
                    endProps    : { alpha: 0, verticalCenter: 40 },
                });
            });
        }
    }
}
