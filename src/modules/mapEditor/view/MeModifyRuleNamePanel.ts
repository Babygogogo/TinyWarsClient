
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import * as CommonConstants             from "../../../utility/CommonConstants";
import * as FloatText                   from "../../../utility/FloatText";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import * as MeModel                     from "../model/MeModel";
import ILanguageText                    = ProtoTypes.Structure.ILanguageText;

type OpenDataForModifyRuleNamePanel = {
    ruleId  : number;
};
export class MeModifyRuleNamePanel extends UiPanel<OpenDataForModifyRuleNamePanel> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: MeModifyRuleNamePanel;

    private _inputChinese   : UiTextInput;
    private _inputEnglish   : UiTextInput;
    private _labelTip       : UiLabel;
    private _labelTitle     : UiLabel;
    private _labelChinese   : UiLabel;
    private _labelEnglish   : UiLabel;
    private _btnModify      : UiButton;
    private _btnClose       : UiButton;

    public static show(openData: OpenDataForModifyRuleNamePanel): void {
        if (!MeModifyRuleNamePanel._instance) {
            MeModifyRuleNamePanel._instance = new MeModifyRuleNamePanel();
        }

        MeModifyRuleNamePanel._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (MeModifyRuleNamePanel._instance) {
            await MeModifyRuleNamePanel._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName               = "resource/skins/mapEditor/MeModifyRuleNamePanel.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.close },
            { ui: this._btnModify,  callback: this._onTouchedBtnModify },
        ]);

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
        } else if (textList.some(v => v.text.length > CommonConstants.WarRuleNameMaxLength)) {
            FloatText.show(Lang.getFormattedText(LangTextType.F0034, CommonConstants.WarRuleNameMaxLength));
        } else {
            MeModel.getWar().setWarRuleNameList(this._getOpenData().ruleId, textList);
            Notify.dispatch(NotifyType.MeWarRuleNameChanged);
            this.close();
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        const textList          = MeModel.getWar().getWarRuleByRuleId(this._getOpenData().ruleId).ruleNameArray;
        this._inputChinese.text = Lang.getLanguageText({ textArray: textList, languageType: Types.LanguageType.Chinese });
        this._inputEnglish.text = Lang.getLanguageText({ textArray: textList, languageType: Types.LanguageType.English });
    }

    private _updateComponentsForLanguage(): void {
        this._btnClose.label    = Lang.getText(LangTextType.B0146);
        this._btnModify.label   = Lang.getText(LangTextType.B0317);
        this._labelChinese.text = Lang.getText(LangTextType.B0455);
        this._labelEnglish.text = Lang.getText(LangTextType.B0456);
        this._labelTip.text     = Lang.getText(LangTextType.A0156);
        this._labelTitle.text   = `${Lang.getText(LangTextType.B0459)} #${this._getOpenData().ruleId}`;
    }
}
