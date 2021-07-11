
import { UiImage }              from "../../../gameui/UiImage";
import { UiLabel }              from "../../../gameui/UiLabel";
import { UiButton }             from "../../../gameui/UiButton";
import { UiPanel }              from "../../../gameui/UiPanel";
import * as CommonConstants     from "../../../utility/CommonConstants";
import * as Helpers             from "../../../utility/Helpers";
import * as Lang                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify              from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes          from "../../../utility/ProtoTypes";
import * as Types               from "../../../utility/Types";
import * as CommonProxy         from "../../common/model/CommonProxy";

export class CommonServerStatusPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud3;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: CommonServerStatusPanel;

    // @ts-ignore
    private readonly _imgMask                   : UiImage;
    // @ts-ignore
    private readonly _group                     : eui.Group;
    // @ts-ignore
    private readonly _labelTitle                : UiLabel;
    // @ts-ignore
    private readonly _btnClose                  : UiButton;

    // @ts-ignore
    private readonly _labelAccountsTitle        : UiLabel;
    // @ts-ignore
    private readonly _labelAccounts             : UiLabel;
    // @ts-ignore
    private readonly _labelOnlineTimeTitle      : UiLabel;
    // @ts-ignore
    private readonly _labelOnlineTime           : UiLabel;
    // @ts-ignore
    private readonly _labelNewAccountsTitle     : UiLabel;
    // @ts-ignore
    private readonly _labelNewAccounts          : UiLabel;
    // @ts-ignore
    private readonly _labelActiveAccountsTitle  : UiLabel;
    // @ts-ignore
    private readonly _labelActiveAccounts       : UiLabel;

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
        await this._showCloseAnimation();
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
