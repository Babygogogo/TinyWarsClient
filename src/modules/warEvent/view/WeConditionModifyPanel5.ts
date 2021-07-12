
import { UiImage }                      from "../../../utility/ui/UiImage";
import { UiPanel }                      from "../../../utility/ui/UiPanel";
import { UiButton }                     from "../../../utility/ui/UiButton";
import { UiLabel }                      from "../../../utility/ui/UiLabel";
import { WeConditionTypeListPanel }     from "./WeConditionTypeListPanel";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import * as WarEventHelper              from "../model/WarEventHelper";
import IWarEventFullData                = ProtoTypes.Map.IWarEventFullData;
import IWarEventCondition               = ProtoTypes.WarEvent.IWarEventCondition;

type OpenDataForWeConditionModifyPanel5 = {
    fullData    : IWarEventFullData;
    condition   : IWarEventCondition;
};
/** WecTurnPhaseEqualTo */
export class WeConditionModifyPanel5 extends UiPanel<OpenDataForWeConditionModifyPanel5> {
    protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
    protected readonly _IS_EXCLUSIVE = false;

    private static _instance: WeConditionModifyPanel5;

    private _labelTitle     : UiLabel;
    private _btnClose       : UiButton;
    private _btnType        : UiButton;
    private _labelDesc      : UiLabel;
    private _labelError     : UiLabel;
    private _groupIsNot     : eui.Group;
    private _labelIsNot     : UiLabel;
    private _imgIsNot       : UiImage;
    private _labelTurnPhase : UiLabel;
    private _btnTurnPhase   : UiButton;

    public static show(openData: OpenDataForWeConditionModifyPanel5): void {
        if (!WeConditionModifyPanel5._instance) {
            WeConditionModifyPanel5._instance = new WeConditionModifyPanel5();
        }
        WeConditionModifyPanel5._instance.open(openData);
    }

    public static async hide(): Promise<void> {
        if (WeConditionModifyPanel5._instance) {
            await WeConditionModifyPanel5._instance.close();
        }
    }

    private constructor() {
        super();

        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this.skinName = "resource/skins/warEvent/WeConditionModifyPanel5.exml";
    }

    protected _onOpened(): void {
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.close },
            { ui: this._btnType,        callback: this._onTouchedBtnType },
            { ui: this._groupIsNot,     callback: this._onTouchedGroupIsNot },
            { ui: this._btnTurnPhase,   callback: this._onTouchedBtnTurnPhase },
        ]);

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
        const data  = this._getCondition().WecTurnPhaseEqualTo;
        data.isNot  = !data.isNot;
        this._updateImgIsNot();
        this._updateLabelDescAndLabelError();
        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }
    private _onTouchedBtnTurnPhase(e: egret.TouchEvent): void {
        const data          = this._getCondition().WecTurnPhaseEqualTo;
        const currTurnPhase = data.valueEqualTo;
        if (currTurnPhase == Types.TurnPhaseCode.WaitBeginTurn) {
            data.valueEqualTo = Types.TurnPhaseCode.Main;
        } else {
            data.valueEqualTo = Types.TurnPhaseCode.WaitBeginTurn;
        }
        this._updateLabelDescAndLabelError();
        this._updateLabelTurnPhase();
        Notify.dispatch(NotifyType.WarEventFullDataChanged);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateImgIsNot();
        this._updateLabelTurnPhase();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.text       = `${Lang.getText(LangTextType.B0501)} C${this._getCondition().WecCommonData.conditionId}`;
        this._btnClose.label        = Lang.getText(LangTextType.B0146);
        this._btnType.label         = Lang.getText(LangTextType.B0516);
        this._labelIsNot.text       = Lang.getText(LangTextType.B0517);
        this._btnTurnPhase.label    = Lang.getText(LangTextType.B0520);

        this._updateLabelDescAndLabelError();
        this._updateLabelTurnPhase();
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
        this._imgIsNot.visible = !!this._getCondition().WecTurnPhaseEqualTo.isNot;
    }
    private _updateLabelTurnPhase(): void {
        this._labelTurnPhase.text = Lang.getTurnPhaseName(this._getCondition().WecTurnPhaseEqualTo.valueEqualTo);
    }

    private _getCondition(): IWarEventCondition {
        return this._getOpenData().condition;
    }
}
