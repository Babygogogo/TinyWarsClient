
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

    export type OpenDataForWeConditionModifyPanel6 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecPlayerIndexInTurnEqualTo */
    export class WeConditionModifyPanel6 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel6> {
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;
        private readonly _btnType!                      : TwnsUiButton.UiButton;
        private readonly _btnClose!                     : TwnsUiButton.UiButton;
        private readonly _labelDesc!                    : TwnsUiLabel.UiLabel;
        private readonly _labelError!                   : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!            : TwnsUiImage.UiImage;

        private readonly _labelTurnIndex!               : TwnsUiLabel.UiLabel;
        private readonly _inputTurnIndex!               : TwnsUiTextInput.UiTextInput;
        private readonly _btnTurnIndexComparator!       : TwnsUiButton.UiButton;
        private readonly _labelTurnIndexComparator!     : TwnsUiLabel.UiLabel;
        private readonly _labelTurnDivider!             : TwnsUiLabel.UiLabel;
        private readonly _inputTurnDivider!             : TwnsUiTextInput.UiTextInput;
        private readonly _labelTurnRemainder!           : TwnsUiLabel.UiLabel;
        private readonly _inputTurnRemainder!           : TwnsUiTextInput.UiTextInput;
        private readonly _btnTurnRemainderComparator!   : TwnsUiButton.UiButton;
        private readonly _labelTurnRemainderComparator! : TwnsUiLabel.UiLabel;
        private readonly _btnTurnPhase!                 : TwnsUiButton.UiButton;
        private readonly _labelTurnPhase!               : TwnsUiLabel.UiLabel;
        private readonly _btnPlayerIndex!               : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndex!             : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                       callback: this.close },
                { ui: this._btnType,                        callback: this._onTouchedBtnType },
                { ui: this._imgInnerTouchMask,              callback: this._onTouchedImgInnerTouchMask },
                { ui: this._btnTurnIndexComparator,         callback: this._onTouchedBtnTurnIndexComparator },
                { ui: this._btnTurnRemainderComparator,     callback: this._onTouchedBtnTurnRemainderComparator },
                { ui: this._btnTurnPhase,                   callback: this._onTouchedBtnTurnPhase },
                { ui: this._btnPlayerIndex,                 callback: this._onTouchedBtnPlayerIndex },
                { ui: this._inputTurnIndex,                 callback: this._onFocusInInputTurnIndex,            eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputTurnIndex,                 callback: this._onFocusOutInputTurnIndex,           eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputTurnDivider,               callback: this._onFocusInInputTurnDivider,          eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputTurnDivider,               callback: this._onFocusOutInputTurnDivider,         eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputTurnRemainder,             callback: this._onFocusInInputTurnRemainder,        eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputTurnRemainder,             callback: this._onFocusOutInputTurnRemainder,       eventType: egret.FocusEvent.FOCUS_OUT },
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
        private _onTouchedBtnTurnIndexComparator(): void {
            const condition                 = this._getCondition();
            condition.turnIndexComparator   = Helpers.getNextValueComparator(condition.turnIndexComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnTurnRemainderComparator(): void {
            const condition                         = this._getCondition();
            condition.turnIndexRemainderComparator  = Helpers.getNextValueComparator(condition.turnIndexRemainderComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnTurnPhase(): void {
            const condition = this._getCondition();
            const turnPhase = condition.turnPhase;
            if (turnPhase === Types.TurnPhaseCode.WaitBeginTurn) {
                condition.turnPhase = Types.TurnPhaseCode.Main;
            } else if (turnPhase === Types.TurnPhaseCode.Main) {
                condition.turnPhase = null;
            } else {
                condition.turnPhase = Types.TurnPhaseCode.WaitBeginTurn;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnPlayerIndex(): void {
            const condition = this._getCondition();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChoosePlayerIndexPanel, {
                currentPlayerIndexArray : condition.playerIndexArray ?? [],
                maxPlayerIndex          : this._getOpenData().war.getPlayersCountUnneutral(),
                callbackOnConfirm       : playerIndexArray => {
                    condition.playerIndexArray = playerIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onFocusInInputTurnIndex(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputTurnIndex(): void {
            const text  = this._inputTurnIndex.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().turnIndex = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputTurnIndex();
            }
        }
        private _onFocusInInputTurnDivider(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputTurnDivider(): void {
            const text  = this._inputTurnDivider.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (value >= 2)) {
                this._getCondition().turnIndexDivider = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputTurnDivider();
            }
        }
        private _onFocusInInputTurnRemainder(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputTurnRemainder(): void {
            const text  = this._inputTurnRemainder.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().turnIndexRemainder = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputTurnRemainder();
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateInputTurnIndex();
            this._updateLabelTurnIndexComparator();
            this._updateInputTurnDivider();
            this._updateInputTurnRemainder();
            this._updateLabelTurnRemainderComparator();
            this._updateLabelTurnPhase();
            this._updateLabelPlayerIndex();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                   = `${Lang.getText(LangTextType.B0501)} C${this._getOpenData().condition.WecCommonData?.conditionId}`;
            this._btnClose.label                    = Lang.getText(LangTextType.B0146);
            this._btnType.label                     = Lang.getText(LangTextType.B0516);
            this._labelTurnIndex.text               = Lang.getText(LangTextType.B0091);
            this._btnTurnIndexComparator.label      = Lang.getText(LangTextType.B0774);
            this._labelTurnDivider.text             = `${Lang.getText(LangTextType.B0518)}(>=2)`;
            this._labelTurnRemainder.text           = Lang.getText(LangTextType.B0519);
            this._btnTurnRemainderComparator.label  = Lang.getText(LangTextType.B0774);
            this._btnTurnPhase.label                = Lang.getText(LangTextType.B0782);
            this._btnPlayerIndex.label              = Lang.getText(LangTextType.B0031);

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
        private _updateInputTurnIndex(): void {
            const turnIndex             = this._getCondition().turnIndex;
            this._inputTurnIndex.text   = turnIndex == null ? `` : `${turnIndex}`;
        }
        private _updateLabelTurnIndexComparator(): void {
            const comparator                    = Helpers.getExisted(this._getCondition().turnIndexComparator);
            this._labelTurnIndexComparator.text = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputTurnDivider(): void {
            const turnDivider           = this._getCondition().turnIndexDivider;
            this._inputTurnDivider.text = turnDivider == null ? `` : `${turnDivider}`;
        }
        private _updateInputTurnRemainder(): void {
            const turnRemainder             = this._getCondition().turnIndexRemainder;
            this._inputTurnRemainder.text   = turnRemainder == null ? `` : `${turnRemainder}`;
        }
        private _updateLabelTurnRemainderComparator(): void {
            const comparator                        = Helpers.getExisted(this._getCondition().turnIndexRemainderComparator);
            this._labelTurnRemainderComparator.text = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateLabelTurnPhase(): void {
            const turnPhase             = this._getCondition().turnPhase;
            this._labelTurnPhase.text   = turnPhase == null ? Lang.getText(LangTextType.B0776) : (Lang.getTurnPhaseName(turnPhase) ?? CommonConstants.ErrorTextForUndefined);
        }
        private _updateLabelPlayerIndex(): void {
            const playerIndexArray      = this._getCondition().playerIndexArray;
            this._labelPlayerIndex.text = playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : Lang.getText(LangTextType.B0776);
        }

        private _getCondition(): CommonProto.WarEvent.IWecTurnAndPlayer {
            return Helpers.getExisted(this._getOpenData().condition.WecTurnAndPlayer);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}

// export default TwnsWeConditionModifyPanel15;
