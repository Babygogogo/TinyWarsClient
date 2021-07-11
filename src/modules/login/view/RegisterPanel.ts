
import { UiImage }                      from "../../../gameui/UiImage";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import * as FloatText                   from "../../../utility/FloatText";
import * as Helpers                     from "../../../utility/Helpers";
import * as Lang                        from "../../../utility/Lang";
import * as LocalStorage                from "../../../utility/LocalStorage";
import * as Logger                      from "../../../utility/Logger";
import * as Notify                      from "../../../utility/Notify";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import * as UserModel                   from "../../user/model/UserModel";
import * as UserProxy                   from "../../user/model/UserProxy";

export class RegisterPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    // @ts-ignore
    private _imgMask            : UiImage;
    // @ts-ignore
    private _group              : eui.Group;
    // @ts-ignore
    private _labelTitle         : UiLabel;
    // @ts-ignore
    private _labelAccount       : UiLabel;
    // @ts-ignore
    private _inputAccount       : UiTextInput;
    // @ts-ignore
    private _labelPassword      : UiLabel;
    // @ts-ignore
    private _inputPassword      : UiTextInput;
    // @ts-ignore
    private _labelNickname      : UiLabel;
    // @ts-ignore
    private _inputNickname      : UiTextInput;
    // @ts-ignore
    private _btnRegister        : UiButton;
    // @ts-ignore
    private _btnClose           : UiButton;
    // @ts-ignore
    private _labelTips          : UiLabel;

    private static _instance: RegisterPanel;

    public static show(): void {
        if (!RegisterPanel._instance) {
            RegisterPanel._instance = new RegisterPanel();
        }
        RegisterPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (RegisterPanel._instance) {
            await RegisterPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/login/RegisterPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            { type: Notify.Type.MsgUserRegister, callback: this._onMsgUserRegister },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,    callback: this.close },
            { ui: this._btnRegister, callback: this._onTouchedBtnRegister },
        ]);

        this._showOpenAnimation();
        this._updateComponentsForLanguage();
    }
    protected async _onClosed(): Promise<void> {
        await this._showCloseAnimation();
    }

    private _onMsgUserRegister(e: egret.Event): void {
        const data = e.data as ProtoTypes.NetMessage.MsgUserRegister.IS;
        FloatText.show(Lang.getText(Lang.Type.A0004));

        const account = data.account;
        if (account == null) {
            Logger.error(`RegisterPanel._onMsgUserRegister() empty account!`);
            return;
        }

        const password  = this._inputPassword.text;
        LocalStorage.setAccount(account);
        LocalStorage.setPassword(password);
        UserModel.setSelfAccount(account);
        UserModel.setSelfPassword(password);
        UserProxy.reqLogin(account, password, false);
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnRegister(): void {
        const account  = this._inputAccount.text;
        const password = this._inputPassword.text;
        const nickname = this._inputNickname.text;
        if (!Helpers.checkIsAccountValid(account)) {
            FloatText.show(Lang.getText(Lang.Type.A0001));
        } else if (!Helpers.checkIsPasswordValid(password)) {
            FloatText.show(Lang.getText(Lang.Type.A0003));
        } else if (!Helpers.checkIsNicknameValid(nickname)) {
            FloatText.show(Lang.getText(Lang.Type.A0002));
        } else {
            UserProxy.reqUserRegister(account, password, nickname);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnRegister.label     = Lang.getText(Lang.Type.B0174);
        this._btnClose.label        = Lang.getText(Lang.Type.B0154);
        this._labelTitle.text       = Lang.getText(Lang.Type.B0174);
        this._labelAccount.text     = `${Lang.getText(Lang.Type.B0170)}:`;
        this._labelPassword.text    = `${Lang.getText(Lang.Type.B0171)}:`;
        this._labelNickname.text    = `${Lang.getText(Lang.Type.B0175)}:`;
        this._labelTips.setRichText(Lang.getText(Lang.Type.R0005));
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
