
import TwnsUiPanel                      from "../../../utility/ui/UiPanel";
import TwnsUiButton                      from "../../../utility/ui/UiButton";
import TwnsUiLabel                      from "../../../utility/ui/UiLabel";
import TwnsUiTextInput                  from "../../../utility/ui/UiTextInput";
import { BwWar }                        from "../../baseWar/model/BwWar";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { FloatText }                    from "../../../utility/FloatText";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import ILanguageText                    = ProtoTypes.Structure.ILanguageText;

type OpenDataForWeEventRenamePanel = {
    war         : BwWar;
    warEventId  : number;
};
export class WeEventRenamePanel extends TwnsUiPanel.UiPanel<OpenDataForWeEventRenamePanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeEventRenamePanel;

    private _inputChinese   : TwnsUiTextInput.UiTextInput;
    private _inputEnglish   : TwnsUiTextInput.UiTextInput;
    private _labelTip       : TwnsUiLabel.UiLabel;
    private _labelTitle     : TwnsUiLabel.UiLabel;
    private _labelChinese   : TwnsUiLabel.UiLabel;
    private _labelEnglish   : TwnsUiLabel.UiLabel;
    private _btnModify      : TwnsUiButton.UiButton;
    private _btnClose       : TwnsUiButton.UiButton;

    public static show(openData: OpenDataForWeEventRenamePanel): void {
        if (!WeEventRenamePanel._instance) {
            WeEventRenamePanel._instance = new WeEventRenamePanel();
        }

        WeEventRenamePanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WeEventRenamePanel._instance) {
            await WeEventRenamePanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/warEvent/WeEventRenamePanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.close },
            { ui: this._btnModify,  callback: this._onTouchedBtnModify },
        ]);

        this._inputChinese.maxChars = CommonConstants.WarEventNameMaxLength;
        this._inputEnglish.maxChars = CommonConstants.WarEventNameMaxLength;

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
        } else if (textList.some(v => v.text.length > CommonConstants.WarEventNameMaxLength)) {
            FloatText.show(Lang.getFormattedText(LangTextType.F0034, CommonConstants.WarEventNameMaxLength));
        } else {
            const openData = this._getOpenData();
            openData.war.getWarEventManager().getWarEvent(openData.warEventId).eventNameArray = textList;

            Notify.dispatch(NotifyType.WarEventFullDataChanged);
            this.close();
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        const openData          = this._getOpenData();
        const nameArray         = openData.war.getWarEventManager().getWarEvent(openData.warEventId).eventNameArray;
        this._inputChinese.text = Lang.getLanguageText({ textArray: nameArray, languageType: Types.LanguageType.Chinese, useAlternate: false });
        this._inputEnglish.text = Lang.getLanguageText({ textArray: nameArray, languageType: Types.LanguageType.English, useAlternate: false });
    }

    private _updateComponentsForLanguage(): void {
        this._btnClose.label    = Lang.getText(LangTextType.B0146);
        this._btnModify.label   = Lang.getText(LangTextType.B0026);
        this._labelChinese.text = Lang.getText(LangTextType.B0455);
        this._labelEnglish.text = Lang.getText(LangTextType.B0456);
        this._labelTip.text     = Lang.getText(LangTextType.A0156);
        this._labelTitle.text   = Lang.getText(LangTextType.B0478);
    }
}
