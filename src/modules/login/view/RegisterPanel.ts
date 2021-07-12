
import { TwnsUiImage }                      from "../../../utility/ui/UiImage";
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { UiTextInput }                  from "../../../utility/ui/UiTextInput";
import { FloatText }                    from "../../../utility/FloatText";
import { Helpers }                      from "../../../utility/Helpers";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { LocalStorage }                 from "../../../utility/LocalStorage";
import { Logger }                       from "../../../utility/Logger";
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import { UserModel }                    from "../../user/model/UserModel";
import { UserProxy }                    from "../../user/model/UserProxy";

export class RegisterPanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud0;
    protected readonly _IS_EXCLUSIVE = false;

    // @ts-ignore
    private _imgMask            : TwnsUiImage.UiImage;
    // @ts-ignore
    private _group              : eui.Group;
    // @ts-ignore
    private _labelTitle         : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private _labelAccount       : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private _inputAccount       : UiTextInput;
    // @ts-ignore
    private _labelPassword      : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private _inputPassword      : UiTextInput;
    // @ts-ignore
    private _labelNickname      : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private _inputNickname      : UiTextInput;
    // @ts-ignore
    private _btnRegister        : TwnsUiButton.UiButton;
    // @ts-ignore
    private _btnClose           : TwnsUiButton.UiButton;
    // @ts-ignore
    private _labelTips          : TwnsUiLabel.UiLabel;

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
            { type: NotifyType.LanguageChanged, callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgUserRegister, callback: this._onMsgUserRegister },
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
        FloatText.show(Lang.getText(LangTextType.A0004));

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
            FloatText.show(Lang.getText(LangTextType.A0001));
        } else if (!Helpers.checkIsPasswordValid(password)) {
            FloatText.show(Lang.getText(LangTextType.A0003));
        } else if (!Helpers.checkIsNicknameValid(nickname)) {
            FloatText.show(Lang.getText(LangTextType.A0002));
        } else {
            UserProxy.reqUserRegister(account, password, nickname);
        }
    }

    private _updateComponentsForLanguage(): void {
        this._btnRegister.label     = Lang.getText(LangTextType.B0174);
        this._btnClose.label        = Lang.getText(LangTextType.B0154);
        this._labelTitle.text       = Lang.getText(LangTextType.B0174);
        this._labelAccount.text     = `${Lang.getText(LangTextType.B0170)}:`;
        this._labelPassword.text    = `${Lang.getText(LangTextType.B0171)}:`;
        this._labelNickname.text    = `${Lang.getText(LangTextType.B0175)}:`;
        this._labelTips.setRichText(Lang.getText(LangTextType.R0005));
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
