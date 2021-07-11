
import { UiImage }              from "../../../gameui/UiImage";
import { UiPanel }              from "../../../gameui/UiPanel";
import { UiButton }             from "../../../gameui/UiButton";
import { UiTextInput }          from "../../../gameui/UiTextInput";
import { UiLabel }              from "../../../gameui/UiLabel";
import { CommonConfirmPanel }   from "../../common/view/CommonConfirmPanel";
import * as CommonConstants     from "../../../utility/CommonConstants";
import * as FloatText           from "../../../utility/FloatText";
import * as Helpers             from "../../../utility/Helpers";
import * as Lang                from "../../../utility/Lang";
import * as Notify              from "../../../utility/Notify";
import * as Types               from "../../../utility/Types";
import * as UserModel           from "../../user/model/UserModel";
import * as UserProxy           from "../../user/model/UserProxy";
import NotifyType               = Notify.Type;

export class UserChangeDiscordIdPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    // @ts-ignore
    private readonly _imgMask           : UiImage;
    // @ts-ignore
    private readonly _group             : eui.Group;
    // @ts-ignore
    private readonly _labelTitle        : UiLabel;
    // @ts-ignore
    private readonly _labelDiscordId    : UiLabel;
    // @ts-ignore
    private readonly _labelNote         : UiLabel;
    // @ts-ignore
    private readonly _inputDiscordId    : UiTextInput;
    // @ts-ignore
    private readonly _labelUrl          : UiLabel;
    // @ts-ignore
    private readonly _btnConfirm        : UiButton;
    // @ts-ignore
    private readonly _btnClose          : UiButton;

    private _isRequesting   = false;

    private static _instance: UserChangeDiscordIdPanel;

    public static show(): void {
        if (!UserChangeDiscordIdPanel._instance) {
            UserChangeDiscordIdPanel._instance = new UserChangeDiscordIdPanel();
        }
        UserChangeDiscordIdPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (UserChangeDiscordIdPanel._instance) {
            await UserChangeDiscordIdPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/user/UserChangeDiscordIdPanel.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgUserSetDiscordId,         callback: this._onMsgUserSetDiscordId },
            { type: NotifyType.MsgUserSetDiscordIdFailed,   callback: this._onMsgUserSetDiscordIdFailed },
        ]);
        this._setUiListenerArray([
            { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,   callback: this.close },
            { ui: this._labelUrl,   callback: this._onTouchedLabelUrl },
        ]);

        this._isRequesting          = false;
        this._inputDiscordId.text   = UserModel.getSelfDiscordId();

        const labelUrl          = this._labelUrl;
        labelUrl.touchEnabled   = true;
        labelUrl.textFlow       = [{
            text    : CommonConstants.DiscordUrl,
            style   : { underline: true },
        }];

        this._showOpenAnimation();
        this._updateComponentsForLanguage();
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    private _onTouchedBtnConfirm(): void {
        if (this._isRequesting) {
            FloatText.show(Lang.getText(Lang.Type.A0046));
        } else {
            const discordId = this._inputDiscordId.text;
            if (!Helpers.checkIsDiscordIdValid(discordId)) {
                FloatText.show(Lang.getText(Lang.Type.A0048));
            } else {
                this._isRequesting = true;
                UserProxy.reqSetDiscordId(discordId);
            }
        }
    }

    private _onTouchedLabelUrl(): void {
        if ((window) && (window.open)) {
            CommonConfirmPanel.show({
                content : Lang.getFormattedText(Lang.Type.F0065, `Discord`),
                callback: () => {
                    window.open(CommonConstants.DiscordUrl);
                },
            });
        }
    }

    private _onMsgUserSetDiscordId(): void {
        FloatText.show(Lang.getText(Lang.Type.A0049));
        this.close();
    }
    private _onMsgUserSetDiscordIdFailed(): void {
        this._isRequesting = false;
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.text       = Lang.getText(Lang.Type.B0150);
        this._labelDiscordId.text   = Lang.getText(Lang.Type.B0243);
        this._labelNote.text        = Lang.getText(Lang.Type.A0067);
        this._btnConfirm.label      = Lang.getText(Lang.Type.B0026);
        this._btnClose.label        = Lang.getText(Lang.Type.B0154);
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
        return new Promise<void>((resolve) => {
            Helpers.resetTween({
                obj         : this._imgMask,
                beginProps  : { alpha: 1 },
                endProps    : { alpha: 0 },
            });
            Helpers.resetTween({
                obj         : this._group,
                beginProps  : { alpha: 1, verticalCenter: 0 },
                endProps    : { alpha: 0, verticalCenter: 40 },
                callback    : resolve,
            });
        });
    }
}
