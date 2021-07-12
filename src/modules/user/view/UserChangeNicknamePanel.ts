
import { TwnsUiImage }              from "../../../utility/ui/UiImage";
import { TwnsUiPanel }              from "../../../utility/ui/UiPanel";
import { TwnsUiButton }              from "../../../utility/ui/UiButton";
import { TwnsUiLabel }              from "../../../utility/ui/UiLabel";
import { UiTextInput }          from "../../../utility/ui/UiTextInput";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { FloatText }            from "../../../utility/FloatText";
import { Helpers }              from "../../../utility/Helpers";
import { Lang }                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Types }                from "../../../utility/Types";
import { UserModel }            from "../../user/model/UserModel";
import { UserProxy }            from "../../user/model/UserProxy";

export class UserChangeNicknamePanel extends TwnsUiPanel.UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    // @ts-ignore
    private readonly _imgMask       : TwnsUiImage.UiImage;
    // @ts-ignore
    private readonly _group         : eui.Group;
    // @ts-ignore
    private readonly _labelTitle    : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelNickname : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelNote     : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _inputNickname : UiTextInput;
    // @ts-ignore
    private readonly _btnConfirm    : TwnsUiButton.UiButton;
    // @ts-ignore
    private readonly _btnClose      : TwnsUiButton.UiButton;

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
            FloatText.show(Lang.getText(LangTextType.A0046));
        } else {
            const nickname = this._inputNickname.text;
            if (!Helpers.checkIsNicknameValid(nickname)) {
                FloatText.show(Lang.getText(LangTextType.A0002));
            } else {
                this._isRequesting = true;
                UserProxy.reqSetNickname(nickname);
            }
        }
    }

    private _onMsgUserSetNickname(): void {
        FloatText.show(Lang.getText(LangTextType.A0047));
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
        this._labelTitle.text       = Lang.getText(LangTextType.B0149);
        this._labelNickname.text    = Lang.getText(LangTextType.B0242);
        this._labelNote.text        = Lang.getText(LangTextType.A0066);
        this._btnConfirm.label      = Lang.getText(LangTextType.B0026);
        this._btnClose.label        = Lang.getText(LangTextType.B0154);
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
