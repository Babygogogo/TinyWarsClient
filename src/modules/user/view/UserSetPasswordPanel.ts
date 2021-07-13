
import { TwnsUiButton }              from "../../../utility/ui/UiButton";
import { TwnsUiTextInput }          from "../../../utility/ui/UiTextInput";
import { TwnsUiImage }              from "../../../utility/ui/UiImage";
import { TwnsUiPanel }              from "../../../utility/ui/UiPanel";
import { TwnsUiLabel }              from "../../../utility/ui/UiLabel";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { FloatText }            from "../../../utility/FloatText";
import { Helpers }              from "../../../utility/Helpers";
import { Lang }                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { LocalStorage }         from "../../../utility/LocalStorage";
import { Types }                from "../../../utility/Types";
import { UserModel }            from "../../user/model/UserModel";
import { UserProxy }            from "../../user/model/UserProxy";

export class UserSetPasswordPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    // @ts-ignore
    private readonly _imgMask                   : TwnsUiImage.UiImage;
    // @ts-ignore
    private readonly _group                     : eui.Group;
    // @ts-ignore
    private readonly _labelTitle                : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelOldPasswordTitle     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _inputOldPassword          : TwnsUiTextInput.UiTextInput;
    // @ts-ignore
    private readonly _labelNewPasswordTitle0    : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _inputNewPassword0         : TwnsUiTextInput.UiTextInput;
    // @ts-ignore
    private readonly _labelNewPasswordTitle1    : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _inputNewPassword1         : TwnsUiTextInput.UiTextInput;
    // @ts-ignore
    private readonly _btnConfirm                : TwnsUiButton.UiButton;
    // @ts-ignore
    private readonly _btnCancel                 : TwnsUiButton.UiButton;

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
