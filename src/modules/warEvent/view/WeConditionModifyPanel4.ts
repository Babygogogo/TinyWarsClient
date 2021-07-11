
import { UiImage }                      from "../../../gameui/UiImage";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import { WeConditionTypeListPanel }     from "./WeConditionTypeListPanel";
import * as Lang                        from "../../../utility/Lang";
import * as Notify                      from "../../../utility/Notify";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import * as WarEventHelper              from "../model/WarEventHelper";
import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
import IWarEventCondition               = ProtoTypes.WarEvent.IWarEventCondition;

type OpenDataForWeConditionModifyPanel4 = {
    fullData    : IWarEventFullData;
    condition   : IWarEventCondition;
};
/** WecTurnIndexRemainderEqualTo */
export class WeConditionModifyPanel4 extends UiPanel<OpenDataForWeConditionModifyPanel4> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeConditionModifyPanel4;

    private _labelTitle     : UiLabel;
    private _btnClose       : UiButton;
    private _btnType        : UiButton;
    private _labelDesc      : UiLabel;
    private _labelError     : UiLabel;
    private _groupIsNot     : eui.Group;
    private _labelIsNot     : UiLabel;
    private _imgIsNot       : UiImage;
    private _labelDivider   : UiLabel;
    private _inputDivider   : UiTextInput;
    private _labelRemainder : UiLabel;
    private _inputRemainder : UiTextInput;

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
            { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        Notify.dispatch(Notify.Type.WarEventFullDataChanged);
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
            Notify.dispatch(Notify.Type.WarEventFullDataChanged);
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
            Notify.dispatch(Notify.Type.WarEventFullDataChanged);
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
        this._labelTitle.text       = `${Lang.getText(Lang.Type.B0501)} C${this._getCondition().WecCommonData.conditionId}`;
        this._btnClose.label        = Lang.getText(Lang.Type.B0146);
        this._btnType.label         = Lang.getText(Lang.Type.B0516);
        this._labelIsNot.text       = Lang.getText(Lang.Type.B0517);
        this._labelDivider.text     = Lang.getText(Lang.Type.B0518);
        this._labelRemainder.text   = Lang.getText(Lang.Type.B0519);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData          = this._getOpenData();
        const condition         = openData.condition;
        const errorTip          = WarEventHelper.getErrorTipForCondition(openData.fullData, condition);
        const labelError        = this._labelError;
        labelError.text         = errorTip || Lang.getText(Lang.Type.B0493);
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
