
import { UiPanel }              from "../../../utility/ui/UiPanel";
import { UiButton }             from "../../../utility/ui/UiButton";
import { UiLabel }              from "../../../utility/ui/UiLabel";
import { UiTextInput }          from "../../../utility/ui/UiTextInput";
import { CommonConstants }      from "../../../utility/CommonConstants";
import { FloatText }            from "../../../utility/FloatText";
import { Lang }                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { Types }                from "../../../utility/Types";
import { ChangeLogProxy }       from "../../changeLog/model/ChangeLogProxy";
import ILanguageText            = ProtoTypes.Structure.ILanguageText;

export class ChangeLogAddPanel extends UiPanel<void> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: ChangeLogAddPanel;

    private _inputChinese   : UiTextInput;
    private _inputEnglish   : UiTextInput;
    private _labelTip       : UiLabel;
    private _labelTitle     : UiLabel;
    private _labelChinese   : UiLabel;
    private _labelEnglish   : UiLabel;
    private _btnModify      : UiButton;
    private _btnClose       : UiButton;

    public static show(): void {
        if (!ChangeLogAddPanel._instance) {
            ChangeLogAddPanel._instance = new ChangeLogAddPanel();
        }

        ChangeLogAddPanel._instance.open(undefined);
    }

    public static async hide(): Promise<void> {
        if (ChangeLogAddPanel._instance) {
            await ChangeLogAddPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName               = "resource/skins/changeLog/ChangeLogAddPanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.close },
            { ui: this._btnModify,  callback: this._onTouchedBtnModify },
        ]);

        this._inputChinese.maxChars = CommonConstants.ChangeLogTextMaxLength;
        this._inputEnglish.maxChars = CommonConstants.ChangeLogTextMaxLength;

        this._updateView();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedBtnModify(e: egret.TouchEvent): void {
        const chineseText   = this._inputChinese.text || ``;
        const englishText   = this._inputEnglish.text || ``;
        const textList      : ILanguageText[] = [
            { languageType: Types.LanguageType.Chinese, text: chineseText || englishText },
            { languageType: Types.LanguageType.English, text: englishText || chineseText },
        ];
        if (textList.every(v => v.text.length <= 0)) {
            FloatText.show(Lang.getText(LangTextType.A0155));
        } else if (textList.some(v => v.text.length > CommonConstants.ChangeLogTextMaxLength)) {
            FloatText.show(Lang.getFormattedText(LangTextType.F0034, CommonConstants.ChangeLogTextMaxLength));
        } else {
            ChangeLogProxy.reqChangeLogAddMessage(textList);
            this.close();
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnClose.label    = Lang.getText(LangTextType.B0146);
        this._btnModify.label   = Lang.getText(LangTextType.B0320);
        this._labelChinese.text = Lang.getText(LangTextType.B0455);
        this._labelEnglish.text = Lang.getText(LangTextType.B0456);
        this._labelTip.text     = Lang.getText(LangTextType.A0156);
        this._labelTitle.text   = Lang.getText(LangTextType.B0454);
    }
}
