
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

type OpenDataForWeConditionModifyPanel6 = {
    fullData    : IWarEventFullData;
    condition   : IWarEventCondition;
};
/** WecPlayerIndexInTurnEqualTo */
export class WeConditionModifyPanel6 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel6> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeConditionModifyPanel6;

    private _labelTitle         : TwnsUiLabel.UiLabel;
    private _btnClose           : TwnsUiButton.UiButton;
    private _btnType            : TwnsUiButton.UiButton;
    private _labelDesc          : TwnsUiLabel.UiLabel;
    private _labelError         : TwnsUiLabel.UiLabel;
    private _groupIsNot         : eui.Group;
    private _labelIsNot         : TwnsUiLabel.UiLabel;
    private _imgIsNot           : TwnsUiImage.UiImage;
    private _labelPlayerIndex   : TwnsUiLabel.UiLabel;
    private _inputPlayerIndex   : TwnsUiTextInput.UiTextInput;

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
