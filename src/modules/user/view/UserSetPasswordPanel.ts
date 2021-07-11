
import { UiButton }             from "../../../gameui/UiButton";
import { UiTextInput }          from "../../../gameui/UiTextInput";
import { UiImage }              from "../../../gameui/UiImage";
import { UiPanel }              from "../../../gameui/UiPanel";
import { UiLabel }              from "../../../gameui/UiLabel";
import { NotifyType }           from "../../../utility/NotifyType";
import * as FloatText           from "../../../utility/FloatText";
import * as Helpers             from "../../../utility/Helpers";
import * as Lang                from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as LocalStorage        from "../../../utility/LocalStorage";
import * as Types               from "../../../utility/Types";
import * as UserModel           from "../../user/model/UserModel";
import * as UserProxy           from "../../user/model/UserProxy";

export class UserSetPasswordPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    // @ts-ignore
    private readonly _imgMask                   : UiImage;
    // @ts-ignore
    private readonly _group                     : eui.Group;
    // @ts-ignore
    private readonly _labelTitle                : UiLabel;
    // @ts-ignore
    private readonly _labelOldPasswordTitle     : UiLabel;
    // @ts-ignore
    private readonly _inputOldPassword          : UiTextInput;
    // @ts-ignore
    private readonly _labelNewPasswordTitle0    : UiLabel;
    // @ts-ignore
    private readonly _inputNewPassword0         : UiTextInput;
    // @ts-ignore
    private readonly _labelNewPasswordTitle1    : UiLabel;
    // @ts-ignore
    private readonly _inputNewPassword1         : UiTextInput;
    // @ts-ignore
    private readonly _btnConfirm                : UiButton;
    // @ts-ignore
    private readonly _btnCancel                 : UiButton;

    private static _instance: UserSetPasswordPanel;

    public static show(): void {
        if (!UserSetPasswordPanel._instance) {
            UserSetPasswordPanel._instance = new UserSetPasswordPanel();
        }
        UserSetPasswordPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (UserSetPasswordPanel._instance) {
            await UserSetPasswordPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/user/UserSetPasswordPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgUserSetPassword,  callback: this._onMsgUserSetPassword },
        ]);
        this._setUiListenerArray([
            { ui: this._btnCancel,  callback: this.close },
            { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
        ]);

        this._showOpenAnimation();
        this._updateOnLanguageChanged();
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    private _onMsgUserSetPassword(): void {
        FloatText.show(Lang.getText(LangTextType.A0148));

        const password = this._inputNewPassword0.text;
        LocalStorage.setPassword(password);
        UserModel.setSelfPassword(password);
        this.close();
    }
    private _onNotifyLanguageChanged(): void {
        this._updateOnLanguageChanged();
    }

    private _onTouchedBtnConfirm(): void {
        const newPassword = this._inputNewPassword0.text;
        if (!Helpers.checkIsPasswordValid(newPassword)) {
            FloatText.show(Lang.getText(LangTextType.A0003));
        } else if (newPassword !== this._inputNewPassword1.text) {
            FloatText.show(Lang.getText(LangTextType.A0147));
        } else {
            UserProxy.reqUserSetPassword(this._inputOldPassword.text, newPassword);
        }
    }

    private _updateOnLanguageChanged(): void {
        this._labelTitle.text               = Lang.getText(LangTextType.B0426);
        this._labelOldPasswordTitle.text    = Lang.getText(LangTextType.B0427);
        this._labelNewPasswordTitle0.text   = Lang.getText(LangTextType.B0428);
        this._labelNewPasswordTitle1.text   = Lang.getText(LangTextType.B0429);
        this._btnConfirm.label              = Lang.getText(LangTextType.B0026);
        this._btnCancel.label               = Lang.getText(LangTextType.B0154);
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
