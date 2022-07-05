
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Notify               from "../../tools/notify/NotifyType";
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
    import LangTextType             = Lang.LangTextType;
    import NotifyType               = Notify.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventCondition       = CommonProto.WarEvent.IWarEventCondition;

    export type OpenDataForWeConditionModifyPanel80 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecPlayerIndexInTurnEqualTo */
    export class WeConditionModifyPanel80 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel80> {
        private readonly _labelTitle!                       : TwnsUiLabel.UiLabel;
        private readonly _btnType!                          : TwnsUiButton.UiButton;
        private readonly _btnClose!                         : TwnsUiButton.UiButton;
        private readonly _labelDesc!                        : TwnsUiLabel.UiLabel;
        private readonly _labelError!                       : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!                : TwnsUiImage.UiImage;

        private readonly _btnPlayerIndex!                   : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndex!                 : TwnsUiLabel.UiLabel;
        private readonly _btnIsPlayerInTurn!                : TwnsUiButton.UiButton;
        private readonly _labelIsPlayerInTurn!              : TwnsUiLabel.UiLabel;

        private readonly _labelRecentTurnsCount!            : TwnsUiLabel.UiLabel;
        private readonly _inputRecentTurnsCount!            : TwnsUiTextInput.UiTextInput;

        private readonly _labelActionsCount!                : TwnsUiLabel.UiLabel;
        private readonly _inputActionsCount!                : TwnsUiTextInput.UiTextInput;
        private readonly _btnActionsCountComparator!        : TwnsUiButton.UiButton;
        private readonly _labelActionsCountComparator!      : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                       callback: this.close },
                { ui: this._btnType,                        callback: this._onTouchedBtnType },
                { ui: this._imgInnerTouchMask,              callback: this._onTouchedImgInnerTouchMask },

                { ui: this._btnPlayerIndex,                 callback: this._onTouchedBtnPlayerIndex },
                { ui: this._btnIsPlayerInTurn,              callback: this._onTouchedBtnIsPlayerInTurn },

                { ui: this._inputRecentTurnsCount,          callback: this._onFocusInInputRecentTurnsCount,         eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputRecentTurnsCount,          callback: this._onFocusOutInputRecentTurnsCount,        eventType: egret.FocusEvent.FOCUS_OUT },

                { ui: this._inputActionsCount,              callback: this._onFocusInInputActionsCount,             eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActionsCount,              callback: this._onFocusOutInputActionsCount,            eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnActionsCountComparator,      callback: this._onTouchedBtnActionsCountComparator },
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
            PanelHelpers.open(PanelHelpers.PanelDict.WeConditionTypeListPanel, {
                fullData    : openData.fullData,
                condition   : openData.condition,
                war         : openData.war,
            });
        }
        private _onTouchedImgInnerTouchMask(): void {
            this._setInnerTouchMaskEnabled(false);
        }
        private _onTouchedBtnPlayerIndex(): void {
            const condition = this._getCondition();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChoosePlayerIndexPanel, {
                currentPlayerIndexArray : condition.playerIndexArray ?? [],
                maxPlayerIndex          : this._getOpenData().war.getPlayersCountUnneutral(),
                callbackOnConfirm       : playerIndexArray => {
                    condition.playerIndexArray = playerIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnIsPlayerInTurn(): void {
            const condition = this._getCondition();
            const isPlayerInTurn    = condition.isPlayerInTurn;
            if (isPlayerInTurn == null) {
                condition.isPlayerInTurn = true;
            } else if (isPlayerInTurn) {
                condition.isPlayerInTurn = false;
            } else {
                condition.isPlayerInTurn = null;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputRecentTurnsCount(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputRecentTurnsCount(): void {
            const text  = this._inputRecentTurnsCount.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().recentTurnsCount = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputRecentTurnsCount();
            }
        }

        private _onFocusInInputActionsCount(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActionsCount(): void {
            const text  = this._inputActionsCount.text;
            const value = !text ? null : parseInt(text);
            if ((value != null) && (!isNaN(value))) {
                (this._getCondition().totalActions ??= {comparator: Types.ValueComparator.EqualTo }).value = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputActionsCount();
            }
        }
        private _onTouchedBtnActionsCountComparator(): void {
            const condition = this._getCondition();
            (condition.totalActions ??= { value: 0 }).comparator = Helpers.getNextValueComparator(condition.totalActions.comparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelPlayerIndex();
            this._updateLabelIsPlayerInTurn();
            this._updateInputRecentTurnsCount();
            this._updateInputActionsCount();
            this._updatePlayersCountComparator();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                       = `${Lang.getText(LangTextType.B0501)} C${this._getOpenData().condition.WecCommonData?.conditionId}`;
            this._btnClose.label                        = Lang.getText(LangTextType.B0146);
            this._btnType.label                         = Lang.getText(LangTextType.B0516);
            this._btnPlayerIndex.label                  = Lang.getText(LangTextType.B0521);
            this._btnIsPlayerInTurn.label               = Lang.getText(LangTextType.B0086);
            this._labelRecentTurnsCount.text            = Lang.getText(LangTextType.B0930);
            this._labelActionsCount.text                = Lang.getText(LangTextType.B0090);
            this._btnActionsCountComparator.label       = Lang.getText(LangTextType.B0774);

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
        private _updateLabelPlayerIndex(): void {
            const playerIndexArray      = this._getCondition().playerIndexArray;
            this._labelPlayerIndex.text = playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelIsPlayerInTurn(): void {
            const isPlayerInTurn    = this._getCondition().isPlayerInTurn;
            const label             = this._labelIsPlayerInTurn;
            if (isPlayerInTurn == null) {
                label.text = `--`;
            } else {
                label.text = Lang.getText(isPlayerInTurn ? LangTextType.B0012 : LangTextType.B0013);
            }
        }
        private _updateInputRecentTurnsCount(): void {
            const recentTurnsCount              = this._getCondition().recentTurnsCount;
            this._inputRecentTurnsCount.text    = recentTurnsCount == null ? `` : `${recentTurnsCount}`;
        }
        private _updateInputActionsCount(): void {
            const actionsCount              = this._getCondition().totalActions?.value;
            this._inputActionsCount.text    = actionsCount == null ? CommonConstants.ErrorTextForUndefined : `${actionsCount}`;
        }
        private _updatePlayersCountComparator(): void {
            const comparator                        = this._getCondition().totalActions?.comparator;
            this._labelActionsCountComparator.text  = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _getCondition(): CommonProto.WarEvent.IWecManualActionStatistics {
            return Helpers.getExisted(this._getOpenData().condition.WecManualActionStatistics);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}

// export default TwnsWeConditionModifyPanel15;
