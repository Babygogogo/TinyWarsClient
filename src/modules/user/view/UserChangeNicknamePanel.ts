
import { UiImage }              from "../../../gameui/UiImage";
import { UiPanel }              from "../../../gameui/UiPanel";
import { UiButton }             from "../../../gameui/UiButton";
import { UiLabel }              from "../../../gameui/UiLabel";
import { UiTextInput }          from "../../../gameui/UiTextInput";
import * as FloatText           from "../../../utility/FloatText";
import * as Helpers             from "../../../utility/Helpers";
import * as Lang                from "../../../utility/Lang";
import * as Notify              from "../../../utility/Notify";
import * as Types               from "../../../utility/Types";
import * as UserModel           from "../../user/model/UserModel";
import * as UserProxy           from "../../user/model/UserProxy";
import NotifyType               = Notify.Type;

export class UserChangeNicknamePanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    // @ts-ignore
    private readonly _imgMask       : UiImage;
    // @ts-ignore
    private readonly _group         : eui.Group;
    // @ts-ignore
    private readonly _labelTitle    : UiLabel;
    // @ts-ignore
    private readonly _labelNickname : UiLabel;
    // @ts-ignore
    private readonly _labelNote     : UiLabel;
    // @ts-ignore
    private readonly _inputNickname : UiTextInput;
    // @ts-ignore
    private readonly _btnConfirm    : UiButton;
    // @ts-ignore
    private readonly _btnClose      : UiButton;

    private _isRequesting   = false;

    private static _instance: UserChangeNicknamePanel;

    public static show(): void {
        if (!UserChangeNicknamePanel._instance) {
            UserChangeNicknamePanel._instance = new UserChangeNicknamePanel();
        }
        UserChangeNicknamePanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (UserChangeNicknamePanel._instance) {
            await UserChangeNicknamePanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/user/UserChangeNicknamePanel.exml";
    }

    protected async _onOpened(): Promise<void> {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgUserSetNickname,          callback: this._onMsgUserSetNickname },
            { type: NotifyType.MsgUserSetNicknameFailed,    callback: this._onMsgUserSetNicknameFailed },
        ]);
        this._setUiListenerArray([
            { ui: this._btnConfirm, callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,   callback: this.close },
        ]);

        this._isRequesting          = false;
        this._inputNickname.text    = UserModel.getSelfNickname() || ``;
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
            const nickname = this._inputNickname.text;
            if (!Helpers.checkIsNicknameValid(nickname)) {
                FloatText.show(Lang.getText(Lang.Type.A0002));
            } else {
                this._isRequesting = true;
                UserProxy.reqSetNickname(nickname);
            }
        }
    }

    private _onMsgUserSetNickname(): void {
        FloatText.show(Lang.getText(Lang.Type.A0047));
        this.close();
    }
    private _onMsgUserSetNicknameFailed(): void {
        this._isRequesting = false;
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.text       = Lang.getText(Lang.Type.B0149);
        this._labelNickname.text    = Lang.getText(Lang.Type.B0242);
        this._labelNote.text        = Lang.getText(Lang.Type.A0066);
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
