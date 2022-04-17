
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
// import WarEventHelper               from "../model/WarEventHelper";
// import TwnsWeConditionTypeListPanel from "./WeConditionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventCondition       = CommonProto.WarEvent.IWarEventCondition;

    export type OpenDataForWeConditionModifyPanel60 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    export class WeConditionModifyPanel60 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel60> {
        private readonly _labelTitle!                       : TwnsUiLabel.UiLabel;
        private readonly _btnType!                          : TwnsUiButton.UiButton;
        private readonly _btnClose!                         : TwnsUiButton.UiButton;
        private readonly _labelDesc!                        : TwnsUiLabel.UiLabel;
        private readonly _labelError!                       : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!                : TwnsUiImage.UiImage;

        private readonly _btnCounterId!                     : TwnsUiButton.UiButton;
        private readonly _labelCounterId!                   : TwnsUiLabel.UiLabel;
        private readonly _labelValue!                       : TwnsUiLabel.UiLabel;
        private readonly _inputValue!                       : TwnsUiTextInput.UiTextInput;
        private readonly _btnValueComparator!               : TwnsUiButton.UiButton;
        private readonly _labelValueComparator!             : TwnsUiLabel.UiLabel;
        private readonly _labelValueDivider!                : TwnsUiLabel.UiLabel;
        private readonly _inputValueDivider!                : TwnsUiTextInput.UiTextInput;
        private readonly _labelValueRemainder!              : TwnsUiLabel.UiLabel;
        private readonly _inputValueRemainder!              : TwnsUiTextInput.UiTextInput;
        private readonly _btnValueRemainderComparator!      : TwnsUiButton.UiButton;
        private readonly _labelValueRemainderComparator!    : TwnsUiLabel.UiLabel;
        private readonly _labelCounterCount!                : TwnsUiLabel.UiLabel;
        private readonly _inputCounterCount!                : TwnsUiTextInput.UiTextInput;
        private readonly _btnCounterCountComparator!        : TwnsUiButton.UiButton;
        private readonly _labelCounterCountComparator!      : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                       callback: this.close },
                { ui: this._btnType,                        callback: this._onTouchedBtnType },
                { ui: this._imgInnerTouchMask,              callback: this._onTouchedImgInnerTouchMask },
                { ui: this._btnCounterId,                   callback: this._onTouchedBtnCounterId },
                { ui: this._inputValue,                     callback: this._onFocusInInputValue,                    eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputValue,                     callback: this._onFocusOutInputValue,                   eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnValueComparator,             callback: this._onTouchedBtnValueComparator },
                { ui: this._inputValueDivider,              callback: this._onFocusInInputValueDivider,             eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputValueDivider,              callback: this._onFocusOutInputValueDivider,            eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputValueRemainder,            callback: this._onFocusInInputValueRemainder,           eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputValueRemainder,            callback: this._onFocusOutInputValueRemainder,          eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnValueRemainderComparator,    callback: this._onTouchedBtnValueRemainderComparator },
                { ui: this._inputCounterCount,              callback: this._onFocusInInputCounterCount,             eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputCounterCount,              callback: this._onFocusOutInputCounterCount,            eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnCounterCountComparator,      callback: this._onTouchedBtnCounterCountComparator },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();

            this._imgInnerTouchMask.touchEnabled = true;
            this._setInnerTouchMaskEnabled(false);
        }
        protected async _updateOnOpenDataChanged(): Promise<void> {
            this._updateView();
        }
        protected _onClosing(): void {
            // nothing to do
        }

        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }
        private _onNotifyWarEventFullDataChanged(): void {
            this._updateView();
        }
        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeConditionTypeListPanel, {
                fullData    : openData.fullData,
                condition   : openData.condition,
                war         : openData.war,
            });
        }
        private _onTouchedImgInnerTouchMask(): void {
            this._setInnerTouchMaskEnabled(false);
        }
        private _onTouchedBtnCounterId(): void {
            const condition = this._getCondition();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseCustomCounterIdPanel, {
                currentCustomCounterIdArray : condition.counterIdArray ?? [],
                callbackOnConfirm           : counterIdArray => {
                    condition.counterIdArray = counterIdArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onFocusInInputValue(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputValue(): void {
            const text  = this._inputValue.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().value = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputValue();
            }
        }
        private _onTouchedBtnValueComparator(): void {
            const condition             = this._getCondition();
            condition.valueComparator   = Helpers.getNextValueComparator(condition.valueComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputValueDivider(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputValueDivider(): void {
            const text  = this._inputValueDivider.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (value >= 2)) {
                this._getCondition().valueDivider = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputValueDivider();
            }
        }
        private _onFocusInInputValueRemainder(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputValueRemainder(): void {
            const text  = this._inputValueRemainder.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().valueRemainder = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputValueRemainder();
            }
        }
        private _onTouchedBtnValueRemainderComparator(): void {
            const condition                     = this._getCondition();
            condition.valueRemainderComparator  = Helpers.getNextValueComparator(condition.valueRemainderComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputCounterCount(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputCounterCount(): void {
            const text  = this._inputCounterCount.text;
            const value = !text ? null : parseInt(text);
            if ((value != null) && (!isNaN(value))) {
                this._getCondition().counterCount = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputCounterCount();
            }
        }
        private _onTouchedBtnCounterCountComparator(): void {
            const condition                     = this._getCondition();
            condition.counterCountComparator    = Helpers.getNextValueComparator(condition.counterCountComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelCounterId();
            this._updateInputValue();
            this._updateLabelValueComparator();
            this._updateInputValueDivider();
            this._updateInputValueRemainder();
            this._updateLabelValueRemainderComparator();
            this._updateInputCounterCount();
            this._updateLabelCounterCountComparator();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                       = `${Lang.getText(LangTextType.B0501)} C${this._getOpenData().condition.WecCommonData?.conditionId}`;
            this._btnClose.label                        = Lang.getText(LangTextType.B0146);
            this._btnType.label                         = Lang.getText(LangTextType.B0516);
            this._btnCounterId.label                    = Lang.getText(LangTextType.B0799);
            this._labelValue.text                       = Lang.getText(LangTextType.B0803);
            this._btnValueComparator.label              = Lang.getText(LangTextType.B0774);
            this._labelValueDivider.text                = `${Lang.getText(LangTextType.B0518)}(>=2)`;
            this._labelValueRemainder.text              = Lang.getText(LangTextType.B0519);
            this._btnValueRemainderComparator.label     = Lang.getText(LangTextType.B0774);
            this._labelCounterCount.text                = Lang.getText(LangTextType.B0801);
            this._btnCounterCountComparator.label       = Lang.getText(LangTextType.B0774);

            this._updateLabelDescAndLabelError();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const condition         = openData.condition;
            const war               = openData.war;
            const errorTip          = WarHelpers.WarEventHelpers.getErrorTipForCondition(openData.fullData, condition, war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
            this._labelDesc.text    = WarHelpers.WarEventHelpers.getDescForCondition(condition, war.getGameConfig()) || CommonConstants.ErrorTextForUndefined;
        }
        private _updateLabelCounterId(): void {
            const counterIdArray        = this._getCondition().counterIdArray;
            this._labelCounterId.text   = counterIdArray?.length ? counterIdArray.join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateInputValue(): void {
            const value             = this._getCondition().value;
            this._inputValue.text   = value == null ? `` : `${value}`;
        }
        private _updateLabelValueComparator(): void {
            const comparator                = Helpers.getExisted(this._getCondition().valueComparator);
            this._labelValueComparator.text = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputValueDivider(): void {
            const divider                   = this._getCondition().valueDivider;
            this._inputValueDivider.text    = divider == null ? `` : `${divider}`;
        }
        private _updateInputValueRemainder(): void {
            const remainder                 = this._getCondition().valueRemainder;
            this._inputValueRemainder.text  = remainder == null ? `` : `${remainder}`;
        }
        private _updateLabelValueRemainderComparator(): void {
            const comparator                            = Helpers.getExisted(this._getCondition().valueRemainderComparator);
            this._labelValueRemainderComparator.text    = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputCounterCount(): void {
            const value                     = this._getCondition().counterCount;
            this._inputCounterCount.text    = value == null ? `` : `${value}`;
        }
        private _updateLabelCounterCountComparator(): void {
            const comparator                        = Helpers.getExisted(this._getCondition().counterCountComparator);
            this._labelCounterCountComparator.text  = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _getCondition(): CommonProto.WarEvent.IWecCustomCounter {
            return Helpers.getExisted(this._getOpenData().condition.WecCustomCounter);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}

// export default TwnsWeConditionModifyPanel15;
