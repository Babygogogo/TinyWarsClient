
import { UiImage }                      from "../../../gameui/UiImage";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import { WeConditionTypeListPanel }     from "./WeConditionTypeListPanel";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import * as Notify                      from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import * as Types                       from "../../../utility/Types";
import * as WarEventHelper              from "../model/WarEventHelper";
import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
import IWarEventCondition               = ProtoTypes.WarEvent.IWarEventCondition;

type OpenDataForWeConditionModifyPanel6 = {
    fullData    : IWarEventFullData;
    condition   : IWarEventCondition;
};
/** WecPlayerIndexInTurnEqualTo */
export class WeConditionModifyPanel6 extends UiPanel<OpenDataForWeConditionModifyPanel6> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeConditionModifyPanel6;

    private _labelTitle         : UiLabel;
    private _btnClose           : UiButton;
    private _btnType            : UiButton;
    private _labelDesc          : UiLabel;
    private _labelError         : UiLabel;
    private _groupIsNot         : eui.Group;
    private _labelIsNot         : UiLabel;
    private _imgIsNot           : UiImage;
    private _labelPlayerIndex   : UiLabel;
    private _inputPlayerIndex   : UiTextInput;

    public static show(openData: OpenDataForWeConditionModifyPanel6): void {
        if (!WeConditionModifyPanel6._instance) {
            WeConditionModifyPanel6._instance = new WeConditionModifyPanel6();
        }
        WeConditionModifyPanel6._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WeConditionModifyPanel6._instance) {
            await WeConditionModifyPanel6._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/warEvent/WeConditionModifyPanel6.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.close },
            { ui: this._btnType,            callback: this._onTouchedBtnType },
            { ui: this._groupIsNot,         callback: this._onTouchedGroupIsNot },
            { ui: this._inputPlayerIndex,   callback: this._onFocusOutInputPlayerIndex, eventType: egret.FocusEvent.FOCUS_OUT },
        ]);
        this._inputPlayerIndex.restrict = `0-9`;

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
        const data  = this._getCondition().WecPlayerIndexInTurnEqualTo;
        data.isNot  = !data.isNot;
        this._updateImgIsNot();
        this._updateLabelDescAndLabelError();
        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }
    private _onFocusOutInputPlayerIndex(e: egret.FocusEvent): void {
        const value = parseInt(this._inputPlayerIndex.text);
        const data  = this._getCondition().WecPlayerIndexInTurnEqualTo;
        if (isNaN(value)) {
            this._updateInputPlayerIndex();
        } else {
            data.valueEqualTo = value;
            this._updateLabelDescAndLabelError();
            this._updateInputPlayerIndex();
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateImgIsNot();
        this._updateInputPlayerIndex();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData.conditionId}`;
        this._btnClose.label        = Lang.getText(LangTextType.B0146);
        this._btnType.label         = Lang.getText(LangTextType.B0516);
        this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
        this._labelPlayerIndex.text = Lang.getText(LangTextType.B0521);

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
        this._imgIsNot.visible = !!this._getCondition().WecPlayerIndexInTurnEqualTo.isNot;
    }
    private _updateInputPlayerIndex(): void {
        this._inputPlayerIndex.text = `${this._getCondition().WecPlayerIndexInTurnEqualTo.valueEqualTo}`;
    }

    private _getCondition(): IWarEventCondition {
        return this._getOpenData().condition;
    }
}
