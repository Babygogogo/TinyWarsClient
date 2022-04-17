
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

    export type OpenDataForWeConditionModifyPanel23 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecPlayerIndexInTurnEqualTo */
    export class WeConditionModifyPanel23 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel23> {
        private readonly _labelTitle!                       : TwnsUiLabel.UiLabel;
        private readonly _btnType!                          : TwnsUiButton.UiButton;
        private readonly _btnClose!                         : TwnsUiButton.UiButton;
        private readonly _labelDesc!                        : TwnsUiLabel.UiLabel;
        private readonly _labelError!                       : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!                : TwnsUiImage.UiImage;

        private readonly _btnEventId!                       : TwnsUiButton.UiButton;
        private readonly _labelEventId!                     : TwnsUiLabel.UiLabel;
        private readonly _labelTimesInTurn!                 : TwnsUiLabel.UiLabel;
        private readonly _inputTimesInTurn!                 : TwnsUiTextInput.UiTextInput;
        private readonly _btnTimesInTurnComparator!         : TwnsUiButton.UiButton;
        private readonly _labelTimesInTurnComparator!       : TwnsUiLabel.UiLabel;
        private readonly _labelTimesTotal!                  : TwnsUiLabel.UiLabel;
        private readonly _inputTimesTotal!                  : TwnsUiTextInput.UiTextInput;
        private readonly _btnTimesTotalComparator!          : TwnsUiButton.UiButton;
        private readonly _labelTimesTotalComparator!        : TwnsUiLabel.UiLabel;
        private readonly _labelEventsCount!                 : TwnsUiLabel.UiLabel;
        private readonly _inputEventsCount!                 : TwnsUiTextInput.UiTextInput;
        private readonly _btnEventsCountComparator!         : TwnsUiButton.UiButton;
        private readonly _labelEventsCountComparator!       : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                       callback: this.close },
                { ui: this._btnType,                        callback: this._onTouchedBtnType },
                { ui: this._imgInnerTouchMask,              callback: this._onTouchedImgInnerTouchMask },
                { ui: this._btnEventId,                     callback: this._onTouchedBtnEventId },
                { ui: this._inputTimesInTurn,               callback: this._onFocusInInputTimesInTurn,              eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputTimesInTurn,               callback: this._onFocusOutInputTimesInTurn,             eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnTimesInTurnComparator,       callback: this._onTouchedBtnTimesInTurnComparator },
                { ui: this._inputTimesTotal,                callback: this._onFocusInInputTimesTotal,               eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputTimesTotal,                callback: this._onFocusOutInputTimesTotal,              eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnTimesTotalComparator,        callback: this._onTouchedBtnTimesTotalComparator },
                { ui: this._inputEventsCount,               callback: this._onFocusInInputEventsCount,              eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputEventsCount,               callback: this._onFocusOutInputEventsCount,             eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnEventsCountComparator,       callback: this._onTouchedBtnEventsCountComparator },
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
        private _onTouchedBtnEventId(): void {
            const condition = this._getCondition();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseWarEventIdPanel, {
                currentEventIdArray     : condition.eventIdArray ?? [],
                availableEventIdArray   : Helpers.getNonNullElements(this._getOpenData().fullData.eventArray?.map(v => v.eventId) ?? []),
                callbackOnConfirm       : eventIdArray => {
                    condition.eventIdArray = eventIdArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onFocusInInputTimesInTurn(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputTimesInTurn(): void {
            const text  = this._inputTimesInTurn.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().timesInTurn = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputTimesInTurn();
            }
        }
        private _onTouchedBtnTimesInTurnComparator(): void {
            const condition                 = this._getCondition();
            condition.timesInTurnComparator = Helpers.getNextValueComparator(condition.timesInTurnComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputTimesTotal(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputTimesTotal(): void {
            const text  = this._inputTimesTotal.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().timesTotal = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputTimesTotal();
            }
        }
        private _onTouchedBtnTimesTotalComparator(): void {
            const condition                 = this._getCondition();
            condition.timesTotalComparator  = Helpers.getNextValueComparator(condition.timesTotalComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputEventsCount(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputEventsCount(): void {
            const text  = this._inputEventsCount.text;
            const value = !text ? null : parseInt(text);
            if ((value != null) && (!isNaN(value))) {
                this._getCondition().eventsCount = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputEventsCount();
            }
        }
        private _onTouchedBtnEventsCountComparator(): void {
            const condition                 = this._getCondition();
            condition.eventsCountComparator = Helpers.getNextValueComparator(condition.eventsCountComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelEventId();
            this._updateInputTimesInTurn();
            this._updateLabelTimesInTurnComparator();
            this._updateInputTimesTotal();
            this._updateLabelTimesTotalComparator();
            this._updateInputEventsCount();
            this._updateEventsCountComparator();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                       = `${Lang.getText(LangTextType.B0501)} C${this._getOpenData().condition.WecCommonData?.conditionId}`;
            this._btnClose.label                        = Lang.getText(LangTextType.B0146);
            this._btnType.label                         = Lang.getText(LangTextType.B0516);
            this._btnEventId.label                      = Lang.getText(LangTextType.B0462);
            this._labelTimesInTurn.text                 = Lang.getText(LangTextType.B0790);
            this._btnTimesInTurnComparator.label        = Lang.getText(LangTextType.B0774);
            this._labelTimesTotal.text                  = Lang.getText(LangTextType.B0791);
            this._btnTimesTotalComparator.label         = Lang.getText(LangTextType.B0774);
            this._labelEventsCount.text                 = Lang.getText(LangTextType.B0788);
            this._btnEventsCountComparator.label        = Lang.getText(LangTextType.B0774);

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
        private _updateLabelEventId(): void {
            const eventIdArray      = this._getCondition().eventIdArray;
            this._labelEventId.text = eventIdArray?.length ? eventIdArray.map(v => `${v}`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateInputTimesInTurn(): void {
            const timesInTurn           = this._getCondition().timesInTurn;
            this._inputTimesInTurn.text = timesInTurn == null ? `` : `${timesInTurn}`;
        }
        private _updateLabelTimesInTurnComparator(): void {
            const comparator                = Helpers.getExisted(this._getCondition().timesInTurnComparator);
            this._labelTimesInTurnComparator.text  = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputTimesTotal(): void {
            const timesTotal            = this._getCondition().timesTotal;
            this._inputTimesTotal.text  = timesTotal == null ? `` : `${timesTotal}`;
        }
        private _updateLabelTimesTotalComparator(): void {
            const comparator                        = Helpers.getExisted(this._getCondition().timesTotalComparator);
            this._labelTimesTotalComparator.text    = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputEventsCount(): void {
            const eventsCount           = this._getCondition().eventsCount;
            this._inputEventsCount.text = eventsCount == null ? `` : `${eventsCount}`;
        }
        private _updateEventsCountComparator(): void {
            const comparator                        = Helpers.getExisted(this._getCondition().eventsCountComparator);
            this._labelEventsCountComparator.text   = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _getCondition(): CommonProto.WarEvent.IWecEventCalledCount {
            return Helpers.getExisted(this._getOpenData().condition.WecEventCalledCount);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}

// export default TwnsWeConditionModifyPanel15;
