
import { UiImage }                      from "../../../utility/ui/UiImage";
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { UiTextInput }                  from "../../../utility/ui/UiTextInput";
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

type OpenDataForWeConditionModifyPanel11 = {
    fullData    : IWarEventFullData;
    condition   : IWarEventCondition;
};
/** WecEventCalledCountTotalLessThan */
export class WeConditionModifyPanel11 extends UiPanel<OpenDataForWeConditionModifyPanel11> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeConditionModifyPanel11;

    private _labelTitle         : UiLabel;
    private _btnClose           : UiButton;
    private _btnType            : UiButton;
    private _labelDesc          : UiLabel;
    private _labelError         : UiLabel;
    private _groupIsNot         : eui.Group;
    private _labelIsNot         : UiLabel;
    private _imgIsNot           : UiImage;
    private _labelEvent         : UiLabel;
    private _btnEvent           : UiButton;
    private _labelCalledCount   : UiLabel;
    private _inputCalledCount   : UiTextInput;

    public static show(openData: OpenDataForWeConditionModifyPanel11): void {
        if (!WeConditionModifyPanel11._instance) {
            WeConditionModifyPanel11._instance = new WeConditionModifyPanel11();
        }
        WeConditionModifyPanel11._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WeConditionModifyPanel11._instance) {
            await WeConditionModifyPanel11._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/warEvent/WeConditionModifyPanel11.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.close },
            { ui: this._btnType,            callback: this._onTouchedBtnType },
            { ui: this._groupIsNot,         callback: this._onTouchedGroupIsNot },
            { ui: this._btnEvent,           callback: this._onTouchedBtnTurnEvent },
            { ui: this._inputCalledCount,   callback: this._onFocusOutInputCalledCount, eventType: egret.FocusEvent.FOCUS_OUT },
        ]);
        this._inputCalledCount.restrict = `0-9`;

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
        const data  = this._getCondition().WecEventCalledCountTotalLessThan;
        data.isNot  = !data.isNot;
        this._updateImgIsNot();
        this._updateLabelDescAndLabelError();
        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }
    private _onTouchedBtnTurnEvent(e: egret.TouchEvent): void {
        const openData              = this._getOpenData();
        const eventArray            = openData.fullData.eventArray;
        const condition             = openData.condition.WecEventCalledCountTotalLessThan;
        const newIndex              = (eventArray.findIndex(v => v.eventId === condition.eventIdEqualTo) + 1) % eventArray.length;
        condition.eventIdEqualTo    = eventArray[newIndex].eventId;

        this._updateLabelDescAndLabelError();
        this._updateLabelEvent();
        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }
    private _onFocusOutInputCalledCount(e: egret.FocusEvent): void {
        const value = parseInt(this._inputCalledCount.text);
        const data  = this._getCondition().WecEventCalledCountTotalLessThan;
        if (isNaN(value)) {
            this._updateInputCalledCount();
        } else {
            data.countLessThan = value;
            this._updateLabelDescAndLabelError();
            this._updateInputCalledCount();
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateImgIsNot();
        this._updateLabelEvent();
        this._updateInputCalledCount();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData.conditionId}`;
        this._btnClose.label        = Lang.getText(LangTextType.B0146);
        this._btnType.label         = Lang.getText(LangTextType.B0516);
        this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
        this._btnEvent.label        = Lang.getText(LangTextType.B0469);
        this._labelCalledCount.text = Lang.getText(LangTextType.B0522);

        this._updateLabelDescAndLabelError();
        this._updateLabelEvent();
        this._updateInputCalledCount();
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
        this._imgIsNot.visible = !!this._getCondition().WecEventCalledCountTotalLessThan.isNot;
    }
    private _updateLabelEvent(): void {
        const openData          = this._getOpenData();
        const eventId           = openData.condition.WecEventCalledCountTotalLessThan.eventIdEqualTo;
        const event             = WarEventHelper.getEvent(openData.fullData, eventId);
        this._labelEvent.text   = `#${eventId} (${event ? Lang.getLanguageText({ textArray: event.eventNameArray }) : `---`})`;
    }
    private _updateInputCalledCount(): void {
        this._inputCalledCount.text = `${this._getCondition().WecEventCalledCountTotalLessThan.eventIdEqualTo}`;
    }

    private _getCondition(): IWarEventCondition {
        return this._getOpenData().condition;
    }
}
