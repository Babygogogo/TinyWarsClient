
import TwnsUiImage                      from "../../tools/ui/UiImage";
import TwnsUiPanel                      from "../../tools/ui/UiPanel";
import TwnsUiButton                      from "../../tools/ui/UiButton";
import TwnsUiLabel                      from "../../tools/ui/UiLabel";
import TwnsUiTextInput                  from "../../tools/ui/UiTextInput";
import { WeConditionTypeListPanel }     from "./WeConditionTypeListPanel";
import Lang                         from "../../tools/lang/Lang";
import TwnsLangTextType from "../../tools/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import Notify                       from "../../tools/notify/Notify";
import TwnsNotifyType from "../../tools/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import ProtoTypes                   from "../../tools/proto/ProtoTypes";
import Types                        from "../../tools/helpers/Types";
import * as WarEventHelper              from "../model/WarEventHelper";
import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
import IWarEventCondition               = ProtoTypes.WarEvent.IWarEventCondition;

type OpenDataForWeConditionModifyPanel4 = {
    fullData    : IWarEventFullData;
    condition   : IWarEventCondition;
};
/** WecTurnIndexRemainderEqualTo */
export class WeConditionModifyPanel4 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel4> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeConditionModifyPanel4;

    private _labelTitle     : TwnsUiLabel.UiLabel;
    private _btnClose       : TwnsUiButton.UiButton;
    private _btnType        : TwnsUiButton.UiButton;
    private _labelDesc      : TwnsUiLabel.UiLabel;
    private _labelError     : TwnsUiLabel.UiLabel;
    private _groupIsNot     : eui.Group;
    private _labelIsNot     : TwnsUiLabel.UiLabel;
    private _imgIsNot       : TwnsUiImage.UiImage;
    private _labelDivider   : TwnsUiLabel.UiLabel;
    private _inputDivider   : TwnsUiTextInput.UiTextInput;
    private _labelRemainder : TwnsUiLabel.UiLabel;
    private _inputRemainder : TwnsUiTextInput.UiTextInput;

    public static show(openData: OpenDataForWeConditionModifyPanel4): void {
        if (!WeConditionModifyPanel4._instance) {
            WeConditionModifyPanel4._instance = new WeConditionModifyPanel4();
        }
        WeConditionModifyPanel4._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WeConditionModifyPanel4._instance) {
            await WeConditionModifyPanel4._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/warEvent/WeConditionModifyPanel4.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.close },
            { ui: this._btnType,        callback: this._onTouchedBtnType },
            { ui: this._groupIsNot,     callback: this._onTouchedGroupIsNot },
            { ui: this._inputDivider,   callback: this._onFocusOutInputDivider, eventType: egret.FocusEvent.FOCUS_OUT },
            { ui: this._inputRemainder, callback: this._onFocusOutInputRemainder, eventType: egret.FocusEvent.FOCUS_OUT },
        ]);
        this._inputDivider.restrict = `0-9`;

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
        const data  = this._getCondition().WecTurnIndexRemainderEqualTo;
        data.isNot  = !data.isNot;
        this._updateImgIsNot();
        this._updateLabelDescAndLabelError();
        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }
    private _onFocusOutInputDivider(e: egret.FocusEvent): void {
        const value = parseInt(this._inputDivider.text);
        const data  = this._getCondition().WecTurnIndexRemainderEqualTo;
        if ((isNaN(value)) || (value <= 1)) {
            this._updateInputDivider();
        } else {
            data.divider = value;
            this._updateLabelDescAndLabelError();
            this._updateInputDivider();
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
    }
    private _onFocusOutInputRemainder(e: egret.FocusEvent): void {
        const value = parseInt(this._inputRemainder.text);
        const data  = this._getCondition().WecTurnIndexRemainderEqualTo;
        if ((isNaN(value)) || (value >= data.divider)) {
            this._updateInputRemainder();
        } else {
            data.remainderEqualTo = value;
            this._updateLabelDescAndLabelError();
            this._updateInputRemainder();
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateImgIsNot();
        this._updateInputDivider();
        this._updateInputRemainder();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData.conditionId}`;
        this._btnClose.label        = Lang.getText(LangTextType.B0146);
        this._btnType.label         = Lang.getText(LangTextType.B0516);
        this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
        this._labelDivider.text     = Lang.getText(LangTextType.B0518);
        this._labelRemainder.text   = Lang.getText(LangTextType.B0519);

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
        this._imgIsNot.visible = !!this._getCondition().WecTurnIndexRemainderEqualTo.isNot;
    }
    private _updateInputDivider(): void {
        this._inputDivider.text = `${this._getCondition().WecTurnIndexRemainderEqualTo.divider}`;
    }
    private _updateInputRemainder(): void {
        this._inputRemainder.text = `${this._getCondition().WecTurnIndexRemainderEqualTo.remainderEqualTo}`;
    }

    private _getCondition(): IWarEventCondition {
        return this._getOpenData().condition;
    }
}
