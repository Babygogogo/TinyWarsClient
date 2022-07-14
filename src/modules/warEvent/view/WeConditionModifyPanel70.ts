
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

    export type OpenDataForWeConditionModifyPanel70 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    export class WeConditionModifyPanel70 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel70> {
        private readonly _labelTitle!                       : TwnsUiLabel.UiLabel;
        private readonly _btnType!                          : TwnsUiButton.UiButton;
        private readonly _btnClose!                         : TwnsUiButton.UiButton;
        private readonly _labelDesc!                        : TwnsUiLabel.UiLabel;
        private readonly _labelError!                       : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!                : TwnsUiImage.UiImage;

        private readonly _btnActionId!                      : TwnsUiButton.UiButton;
        private readonly _labelActionId!                    : TwnsUiLabel.UiLabel;
        private readonly _labelActionCount!                 : TwnsUiLabel.UiLabel;
        private readonly _inputActionCount!                 : TwnsUiTextInput.UiTextInput;
        private readonly _btnActionCountComparator!         : TwnsUiButton.UiButton;
        private readonly _labelActionCountComparator!       : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                       callback: this.close },
                { ui: this._btnType,                        callback: this._onTouchedBtnType },
                { ui: this._imgInnerTouchMask,              callback: this._onTouchedImgInnerTouchMask },
                { ui: this._btnActionId,                    callback: this._onTouchedBtnActionId },
                { ui: this._inputActionCount,               callback: this._onFocusInInputActionCount,              eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActionCount,               callback: this._onFocusOutInputActionCount,             eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnActionCountComparator,       callback: this._onTouchedBtnActionCountComparator },
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
        private _onTouchedBtnActionId(): void {
            const openData          = this._getOpenData();
            const condition         = this._getCondition();
            const warEventFullData  = openData.fullData;
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseWarEventActionIdPanel, {
                currentActionIdArray    : condition.ongoingActionIdArray ?? [],
                availableActionIdArray  : warEventFullData.actionArray?.filter(v => WarHelpers.WarEventHelpers.checkIsPersistentAction(v)).map(v => Helpers.getExisted(v.WeaCommonData?.actionId)) ?? [],
                warEventFullData,
                war                     : openData.war,
                callbackOnConfirm       : actionIdArray => {
                    condition.ongoingActionIdArray = actionIdArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onFocusInInputActionCount(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActionCount(): void {
            const text  = this._inputActionCount.text;
            const value = !text ? null : parseInt(text);
            if ((value != null) && (!isNaN(value))) {
                this._getCondition().ongoingActionsCount = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputActionCount();
            }
        }
        private _onTouchedBtnActionCountComparator(): void {
            const condition                         = this._getCondition();
            condition.ongoingActionsCountComparator = Helpers.getNextValueComparator(condition.ongoingActionsCountComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelActionId();
            this._updateInputActionCount();
            this._updateLabelActionCountComparator();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                   = `${Lang.getText(LangTextType.B0501)} C${this._getOpenData().condition.WecCommonData?.conditionId}`;
            this._btnClose.label                    = Lang.getText(LangTextType.B0146);
            this._btnType.label                     = Lang.getText(LangTextType.B0516);
            this._btnActionId.label                 = Lang.getText(LangTextType.B0799);
            this._labelActionCount.text             = Lang.getText(LangTextType.B0902);
            this._btnActionCountComparator.label    = Lang.getText(LangTextType.B0774);

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
        private _updateLabelActionId(): void {
            const actionIdArray         = this._getCondition().ongoingActionIdArray;
            this._labelActionId.text    = actionIdArray?.length ? actionIdArray.join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateInputActionCount(): void {
            const value                     = this._getCondition().ongoingActionsCount;
            this._inputActionCount.text     = value == null ? `` : `${value}`;
        }
        private _updateLabelActionCountComparator(): void {
            const comparator                        = Helpers.getExisted(this._getCondition().ongoingActionsCountComparator);
            this._labelActionCountComparator.text  = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _getCondition(): CommonProto.WarEvent.IWecOngoingPersistentActionPresence {
            return Helpers.getExisted(this._getOpenData().condition.WecOngoingPersistentActionPresence);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}

// export default TwnsWeConditionModifyPanel15;
