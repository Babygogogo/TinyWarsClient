
import TwnsUiImage                      from "../../../utility/ui/UiImage";
import TwnsUiPanel                      from "../../../utility/ui/UiPanel";
import TwnsUiButton                      from "../../../utility/ui/UiButton";
import TwnsUiLabel                      from "../../../utility/ui/UiLabel";
import TwnsUiTextInput                  from "../../../utility/ui/UiTextInput";
import { WeConditionTypeListPanel }     from "./WeConditionTypeListPanel";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import * as WarEventHelper              from "../model/WarEventHelper";
import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
import IWarEventCondition               = ProtoTypes.WarEvent.IWarEventCondition;
import LangTextType         = TwnsLangTextType.LangTextType;

type OpenDataForWeConditionModifyPanel1 = {
    fullData    : IWarEventFullData;
    condition   : IWarEventCondition;
};
/** WecTurnIndexEqualTo */
export class WeConditionModifyPanel1 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel1> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeConditionModifyPanel1;

    private _labelTitle     : TwnsUiLabel.UiLabel;
    private _btnClose       : TwnsUiButton.UiButton;
    private _btnType        : TwnsUiButton.UiButton;
    private _labelDesc      : TwnsUiLabel.UiLabel;
    private _labelError     : TwnsUiLabel.UiLabel;
    private _groupIsNot     : eui.Group;
    private _labelIsNot     : TwnsUiLabel.UiLabel;
    private _imgIsNot       : TwnsUiImage.UiImage;
    private _labelTurnIndex : TwnsUiLabel.UiLabel;
    private _inputTurnIndex : TwnsUiTextInput.UiTextInput;

    public static show(openData: OpenDataForWeConditionModifyPanel1): void {
        if (!WeConditionModifyPanel1._instance) {
            WeConditionModifyPanel1._instance = new WeConditionModifyPanel1();
        }
        WeConditionModifyPanel1._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WeConditionModifyPanel1._instance) {
            await WeConditionModifyPanel1._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/warEvent/WeConditionModifyPanel1.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.close },
            { ui: this._btnType,        callback: this._onTouchedBtnType },
            { ui: this._groupIsNot,     callback: this._onTouchedGroupIsNot },
            { ui: this._inputTurnIndex, callback: this._onFocusOutInputTurnIndex, eventType: egret.FocusEvent.FOCUS_OUT },
        ]);
        this._inputTurnIndex.restrict = `0-9`;

        this._updateView();
    }

    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnType(e: egret.TouchEvent): void {
        const openData = this._getOpenData();
        WeConditionTypeListPanel.show({
            fullData    : openData.fullData,
            condition   : openData.condition,
        });
    }
    private _onTouchedGroupIsNot(e: egret.TouchEvent): void {
        const data  = this._getCondition().WecTurnIndexEqualTo;
        data.isNot  = !data.isNot;
        this._updateImgIsNot();
        this._updateLabelDescAndLabelError();
        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }
    private _onFocusOutInputTurnIndex(e: egret.FocusEvent): void {
        const value = parseInt(this._inputTurnIndex.text);
        const data  = this._getCondition().WecTurnIndexEqualTo;
        if (isNaN(value)) {
            this._updateInputTurnIndex();
        } else {
            data.valueEqualTo = value;
            this._updateLabelDescAndLabelError();
            this._updateInputTurnIndex();
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateImgIsNot();
        this._updateInputTurnIndex();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData.conditionId}`;
        this._btnClose.label        = Lang.getText(LangTextType.B0146);
        this._btnType.label         = Lang.getText(LangTextType.B0516);
        this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
        this._labelTurnIndex.text   = Lang.getText(LangTextType.B0091);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData          = this._getOpenData();
        const condition         = openData.condition;
        const errorTip          = WarEventHelper.getErrorTipForCondition(openData.fullData, condition);
        const labelError        = this._labelError;
        labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
        labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
        this._labelDesc.text    = WarEventHelper.getDescForCondition(condition);
    }
    private _updateImgIsNot(): void {
        this._imgIsNot.visible = !!this._getCondition().WecTurnIndexEqualTo.isNot;
    }
    private _updateInputTurnIndex(): void {
        this._inputTurnIndex.text = `${this._getCondition().WecTurnIndexEqualTo.valueEqualTo}`;
    }

    private _getCondition(): IWarEventCondition {
        return this._getOpenData().condition;
    }
}
