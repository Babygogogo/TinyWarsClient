
import { TwnsUiImage }                      from "../../../utility/ui/UiImage";
import { TwnsUiPanel }                      from "../../../utility/ui/UiPanel";
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiTextInput }                  from "../../../utility/ui/UiTextInput";
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

type OpenDataForWeConditionModifyPanel12 = {
    fullData    : IWarEventFullData;
    condition   : IWarEventCondition;
};
/** WecPlayerAliveStateEqualTo */
export class WeConditionModifyPanel12 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel12> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeConditionModifyPanel12;

    private _labelTitle         : TwnsUiLabel.UiLabel;
    private _btnClose           : TwnsUiButton.UiButton;
    private _btnType            : TwnsUiButton.UiButton;
    private _labelDesc          : TwnsUiLabel.UiLabel;
    private _labelError         : TwnsUiLabel.UiLabel;
    private _groupIsNot         : eui.Group;
    private _labelIsNot         : TwnsUiLabel.UiLabel;
    private _imgIsNot           : TwnsUiImage.UiImage;
    private _labelAliveState    : TwnsUiLabel.UiLabel;
    private _btnAliveState      : TwnsUiButton.UiButton;
    private _labelPlayerIndex   : TwnsUiLabel.UiLabel;
    private _inputPlayerIndex   : TwnsUiTextInput.UiTextInput;

    public static show(openData: OpenDataForWeConditionModifyPanel12): void {
        if (!WeConditionModifyPanel12._instance) {
            WeConditionModifyPanel12._instance = new WeConditionModifyPanel12();
        }
        WeConditionModifyPanel12._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WeConditionModifyPanel12._instance) {
            await WeConditionModifyPanel12._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/warEvent/WeConditionModifyPanel12.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.close },
            { ui: this._btnType,            callback: this._onTouchedBtnType },
            { ui: this._groupIsNot,         callback: this._onTouchedGroupIsNot },
            { ui: this._btnAliveState,      callback: this._onTouchedBtnAliveState },
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
        const data  = this._getCondition().WecPlayerAliveStateEqualTo;
        data.isNot  = !data.isNot;
        this._updateImgIsNot();
        this._updateLabelDesc();
        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }
    private _onTouchedBtnAliveState(e: egret.TouchEvent): void {
        const data              = this._getCondition().WecPlayerAliveStateEqualTo;
        const currAliveState    = data.aliveStateEqualTo;
        if (currAliveState === Types.PlayerAliveState.Alive) {
            data.aliveStateEqualTo = Types.PlayerAliveState.Dying;
        } else if (currAliveState === Types.PlayerAliveState.Dying) {
            data.aliveStateEqualTo = Types.PlayerAliveState.Dead;
        } else {
            data.aliveStateEqualTo = Types.PlayerAliveState.Alive;
        }
        this._updateLabelDesc();
        this._updateLabelAliveState();
        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }
    private _onFocusOutInputPlayerIndex(e: egret.FocusEvent): void {
        const value = parseInt(this._inputPlayerIndex.text);
        const data  = this._getCondition().WecPlayerAliveStateEqualTo;
        if (isNaN(value)) {
            this._updateInputPlayerIndex();
        } else {
            data.playerIndexEqualTo = value;
            this._updateLabelDesc();
            this._updateInputPlayerIndex();
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDesc();
        this._updateImgIsNot();
        this._updateLabelAliveState();
        this._updateInputPlayerIndex();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData.conditionId}`;
        this._btnClose.label        = Lang.getText(LangTextType.B0146);
        this._btnType.label         = Lang.getText(LangTextType.B0516);
        this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
        this._btnAliveState.label   = Lang.getText(LangTextType.B0523);
        this._labelPlayerIndex.text = Lang.getText(LangTextType.B0521);

        this._updateLabelDesc();
        this._updateLabelAliveState();
        this._updateInputPlayerIndex();
    }

    private _updateLabelDesc(): void {
        const openData          = this._getOpenData();
        const condition         = openData.condition;
        const errorTip          = WarEventHelper.getErrorTipForCondition(openData.fullData, condition);
        const labelError        = this._labelError;
        labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
        labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
        this._labelDesc.text    = WarEventHelper.getDescForCondition(condition);
    }
    private _updateImgIsNot(): void {
        this._imgIsNot.visible = !!this._getCondition().WecPlayerAliveStateEqualTo.isNot;
    }
    private _updateLabelAliveState(): void {
        this._labelAliveState.text = Lang.getPlayerAliveStateName(this._getCondition().WecPlayerAliveStateEqualTo.aliveStateEqualTo);
    }
    private _updateInputPlayerIndex(): void {
        this._inputPlayerIndex.text = `${this._getCondition().WecPlayerAliveStateEqualTo.playerIndexEqualTo}`;
    }

    private _getCondition(): IWarEventCondition {
        return this._getOpenData().condition;
    }
}
