
import CommonProxy          from "../../common/model/CommonProxy";
import CommonConstants      from "../../tools/helpers/CommonConstants";
import CompatibilityHelpers from "../../tools/helpers/CompatibilityHelpers";
import Helpers              from "../../tools/helpers/Helpers";
import Types                from "../../tools/helpers/Types";
import Lang                 from "../../tools/lang/Lang";
import TwnsLangTextType     from "../../tools/lang/LangTextType";
import TwnsNotifyType       from "../../tools/notify/NotifyType";
import ProtoTypes           from "../../tools/proto/ProtoTypes";
import TwnsUiButton         from "../../tools/ui/UiButton";
import TwnsUiImage          from "../../tools/ui/UiImage";
import TwnsUiLabel          from "../../tools/ui/UiLabel";
import TwnsUiPanel          from "../../tools/ui/UiPanel";

namespace TwnsCommonServerStatusPanel {
    import LangTextType     = TwnsLangTextType.LangTextType;
    import NotifyType       = TwnsNotifyType.NotifyType;

    export class CommonServerStatusPanel extends TwnsUiPanel.UiPanel<void> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud3;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: CommonServerStatusPanel;

        private readonly _imgMask!                  : TwnsUiImage.UiImage;
        private readonly _group!                    : eui.Group;
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnClose!                 : TwnsUiButton.UiButton;

        private readonly _labelAccountsTitle!       : TwnsUiLabel.UiLabel;
        private readonly _labelAccounts!            : TwnsUiLabel.UiLabel;
        private readonly _labelOnlineTimeTitle!     : TwnsUiLabel.UiLabel;
        private readonly _labelOnlineTime!          : TwnsUiLabel.UiLabel;
        private readonly _labelNewAccountsTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelNewAccounts!         : TwnsUiLabel.UiLabel;
        private readonly _labelActiveAccountsTitle! : TwnsUiLabel.UiLabel;
        private readonly _labelActiveAccounts!      : TwnsUiLabel.UiLabel;

        public static show(): void {
            if (!CommonServerStatusPanel._instance) {
                CommonServerStatusPanel._instance = new CommonServerStatusPanel();
            }
            CommonServerStatusPanel._instance.open();
        }

        public static async hide(): Promise<void> {
            if (CommonServerStatusPanel._instance) {
                await CommonServerStatusPanel._instance.close().catch(err => { CompatibilityHelpers.showError(err); throw err; });
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
                { type: NotifyType.MsgCommonGetServerStatus, callback: this._onMsgCommonGetServerStatus },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,   callback: this.close },
            ]);

            this._showOpenAnimation();

            this._updateComponentsForLanguage();

            CommonProxy.reqCommonGetServerStatus();
        }
        protected async _onClosed(): Promise<void> {
            await this._showCloseAnimation().catch(err => { CompatibilityHelpers.showError(err); throw err; });
        }

        private _onMsgCommonGetServerStatus(e: egret.Event): void {
            const data = e.data as ProtoTypes.NetMessage.MsgCommonGetServerStatus.IS;

            this._labelAccounts.text        = "" + data.totalAccounts;

            const totalOnlineTime           = data.totalOnlineTime;
            this._labelOnlineTime.text      = totalOnlineTime == null ? CommonConstants.ErrorTextForUndefined : Helpers.getTimeDurationText(totalOnlineTime);

            const activeAccounts            = data.activeAccounts;
            this._labelActiveAccounts.text  = activeAccounts == null ? CommonConstants.ErrorTextForUndefined : activeAccounts.join(" / ");

            const newAccounts               = data.newAccounts;
            this._labelNewAccounts.text     = newAccounts == null ? CommonConstants.ErrorTextForUndefined : newAccounts.join(" / ");
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = Lang.getText(LangTextType.B0327);
            this._labelAccountsTitle.text       = `${Lang.getText(LangTextType.B0328)}:`;
            this._labelOnlineTimeTitle.text     = `${Lang.getText(LangTextType.B0329)}:`;
            this._labelNewAccountsTitle.text    = `${Lang.getText(LangTextType.B0330)}:`;
            this._labelActiveAccountsTitle.text = `${Lang.getText(LangTextType.B0331)}:`;
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

export default TwnsCommonServerStatusPanel;
