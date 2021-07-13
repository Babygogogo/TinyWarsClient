
import TwnsUiPanel              from "../../../utility/ui/UiPanel";
import TwnsUiButton              from "../../../utility/ui/UiButton";
import TwnsUiLabel              from "../../../utility/ui/UiLabel";
import TwnsUiTextInput          from "../../../utility/ui/UiTextInput";
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
import { ChangeLogModel }       from "../../changeLog/model/ChangeLogModel";
import { ChangeLogProxy }       from "../../changeLog/model/ChangeLogProxy";
import ILanguageText            = ProtoTypes.Structure.ILanguageText;

type OpenDataForChangeLogModifyPanel = {
    messageId   : number;
};
export class ChangeLogModifyPanel extends TwnsUiPanel.UiPanel<OpenDataForChangeLogModifyPanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: ChangeLogModifyPanel;

    private _inputChinese   : TwnsUiTextInput.UiTextInput;
    private _inputEnglish   : TwnsUiTextInput.UiTextInput;
    private _labelTip       : TwnsUiLabel.UiLabel;
    private _labelTitle     : TwnsUiLabel.UiLabel;
    private _labelChinese   : TwnsUiLabel.UiLabel;
    private _labelEnglish   : TwnsUiLabel.UiLabel;
    private _btnModify      : TwnsUiButton.UiButton;
    private _btnClose       : TwnsUiButton.UiButton;

    public static show(openData: OpenDataForChangeLogModifyPanel): void {
        if (!ChangeLogModifyPanel._instance) {
            ChangeLogModifyPanel._instance = new ChangeLogModifyPanel();
        }

        ChangeLogModifyPanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (ChangeLogModifyPanel._instance) {
            await ChangeLogModifyPanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName               = "resource/skins/changeLog/ChangeLogModifyPanel.exml";
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
            ChangeLogProxy.reqChangeLogModifyMessage(this._getOpenData().messageId, textList);
            this.close();
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        const textList          = ChangeLogModel.getMessage(this._getOpenData().messageId).textList || [];
        this._inputChinese.text = Lang.getLanguageText({ textArray: textList, languageType: Types.LanguageType.Chinese });
        this._inputEnglish.text = Lang.getLanguageText({ textArray: textList, languageType: Types.LanguageType.English });
    }

    private _updateComponentsForLanguage(): void {
        this._btnClose.label    = Lang.getText(LangTextType.B0146);
        this._btnModify.label   = Lang.getText(LangTextType.B0317);
        this._labelChinese.text = Lang.getText(LangTextType.B0455);
        this._labelEnglish.text = Lang.getText(LangTextType.B0456);
        this._labelTip.text     = Lang.getText(LangTextType.A0156);
        this._labelTitle.text   = `${Lang.getText(LangTextType.B0317)} #${this._getOpenData().messageId}`;
    }
}
