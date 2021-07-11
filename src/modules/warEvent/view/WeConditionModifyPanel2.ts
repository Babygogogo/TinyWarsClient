
import { UiImage }                      from "../../../gameui/UiImage";
import { UiPanel }                      from "../../../gameui/UiPanel";
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTextInput }                  from "../../../gameui/UiTextInput";
import { WeConditionTypeListPanel }     from "./WeConditionTypeListPanel";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import * as WarEventHelper              from "../model/WarEventHelper";
import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
import IWarEventCondition               = ProtoTypes.WarEvent.IWarEventCondition;

type OpenDataForWeConditionModifyPanel2 = {
    fullData    : IWarEventFullData;
    condition   : IWarEventCondition;
};
/** WecTurnIndexGreaterThan */
export class WeConditionModifyPanel2 extends UiPanel<OpenDataForWeConditionModifyPanel2> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeConditionModifyPanel2;

    private _labelTitle     : UiLabel;
    private _btnClose       : UiButton;
    private _btnType        : UiButton;
    private _labelDesc      : UiLabel;
    private _labelError     : UiLabel;
    private _groupIsNot     : eui.Group;
    private _labelIsNot     : UiLabel;
    private _imgIsNot       : UiImage;
    private _labelTurnIndex : UiLabel;
    private _inputTurnIndex : UiTextInput;

    public static show(openData: OpenDataForWeConditionModifyPanel2): void {
        if (!WeConditionModifyPanel2._instance) {
            WeConditionModifyPanel2._instance = new WeConditionModifyPanel2();
        }
        WeConditionModifyPanel2._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WeConditionModifyPanel2._instance) {
            await WeConditionModifyPanel2._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/warEvent/WeConditionModifyPanel2.exml";
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
        const data  = this._getCondition().WecTurnIndexGreaterThan;
        data.isNot  = !data.isNot;
        this._updateImgIsNot();
        this._updateLabelDescAndLabelError();
        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }
    private _onFocusOutInputTurnIndex(e: egret.FocusEvent): void {
        const value = parseInt(this._inputTurnIndex.text);
        const data  = this._getCondition().WecTurnIndexGreaterThan;
        if (isNaN(value)) {
            this._updateInputTurnIndex();
        } else {
            data.valueGreaterThan = value;
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
        this._imgIsNot.visible = !!this._getCondition().WecTurnIndexGreaterThan.isNot;
    }
    private _updateInputTurnIndex(): void {
        this._inputTurnIndex.text = `${this._getCondition().WecTurnIndexGreaterThan.valueGreaterThan}`;
    }

    private _getCondition(): IWarEventCondition {
        return this._getOpenData().condition;
    }
}
