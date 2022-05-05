
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Twns.Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType               = Twns.Notify.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventAction          = CommonProto.WarEvent.IWarEventAction;
    import LangTextType             = Twns.Lang.LangTextType;
    import BwWar                    = BaseWar.BwWar;

    export type OpenDataForWeActionModifyPanel2 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel2 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel2> {
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;
        private readonly _btnType!                      : TwnsUiButton.UiButton;
        private readonly _btnBack!                      : TwnsUiButton.UiButton;
        private readonly _labelDesc!                    : TwnsUiLabel.UiLabel;
        private readonly _labelError!                   : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!            : TwnsUiImage.UiImage;

        private readonly _labelCounterId!               : TwnsUiLabel.UiLabel;
        private readonly _btnSwitchCounterId!           : TwnsUiButton.UiButton;
        private readonly _labelMultiplierPercentage!    : TwnsUiLabel.UiLabel;
        private readonly _inputMultiplierPercentage!    : TwnsUiTextInput.UiTextInput;
        private readonly _labelDeltaValue!              : TwnsUiLabel.UiLabel;
        private readonly _inputDeltaValue!              : TwnsUiTextInput.UiTextInput;
        private readonly _labelTips!                    : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnType,                    callback: this._onTouchedBtnType },
                { ui: this._btnBack,                    callback: this.close },
                { ui: this._imgInnerTouchMask,          callback: this._onTouchedImgInnerTouchMask },
                { ui: this._btnSwitchCounterId,         callback: this._onTouchedBtnSwitchCounterId },
                { ui: this._inputDeltaValue,            callback: this._onFocusInInputDeltaValue,               eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputDeltaValue,            callback: this._onFocusOutInputDeltaValue,              eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputMultiplierPercentage,  callback: this._onFocusInInputMultiplierPercentage,     eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputMultiplierPercentage,  callback: this._onFocusOutInputMultiplierPercentage,    eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setIsTouchMaskEnabled();
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

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyWarEventFullDataChanged(): void {
            this._updateView();
        }

        private _onTouchedImgInnerTouchMask(): void {
            this._setInnerTouchMaskEnabled(false);
        }

        private _onTouchedBtnSwitchCounterId(): void {
            const action = this._getAction();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChooseCustomCounterIdPanel, {
                currentCustomCounterIdArray : action.customCounterIdArray ?? [],
                callbackOnConfirm           : customCounterIdArray => {
                    action.customCounterIdArray = customCounterIdArray;
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        private _onFocusInInputDeltaValue(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputDeltaValue(): void {
            const action    = this._getAction();
            const text      = this._inputDeltaValue.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.deltaValue = null;
            } else {
                const maxValue      = Twns.CommonConstants.WarEventActionSetCustomCounterMaxDeltaValue;
                action.deltaValue   = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputMultiplierPercentage(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputMultiplierPercentage(): void {
            const action    = this._getAction();
            const text      = this._inputMultiplierPercentage.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.multiplierPercentage = null;
            } else {
                const maxValue              = Twns.CommonConstants.WarEventActionSetCustomCounterMaxMultiplierPercentage;
                action.multiplierPercentage = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelCounterId();
            this._updateInputDeltaValue();
            this._updateInputMultiplierPercentage();
            this._updateLabelTips();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                   = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label                     = Lang.getText(LangTextType.B0516);
            this._btnSwitchCounterId.label          = Lang.getText(LangTextType.B0792);
            this._btnBack.label                     = Lang.getText(LangTextType.B0146);
            this._labelDeltaValue.text              = Lang.getText(LangTextType.B0754);
            this._labelMultiplierPercentage.text    = `${Lang.getText(LangTextType.B0755)}%`;

            this._updateLabelDescAndLabelError();
            this._updateLabelTips();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const action            = openData.action;
            const war               = openData.war;
            const errorTip          = WarHelpers.WarEventHelpers.getErrorTipForAction(openData.fullData, action, war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Twns.Types.ColorValue.Red : Twns.Types.ColorValue.Green;
            this._labelDesc.text    = WarHelpers.WarEventHelpers.getDescForAction(action, war.getGameConfig()) || Twns.CommonConstants.ErrorTextForUndefined;
        }

        private _updateLabelCounterId(): void {
            const counterIdArray        = this._getAction().customCounterIdArray;
            this._labelCounterId.text   = counterIdArray?.length ? counterIdArray.join(`/`) : Lang.getFormattedText(LangTextType.F0097, Lang.getText(LangTextType.B0792));
        }

        private _updateInputDeltaValue(): void {
            const value                 = this._getAction().deltaValue;
            this._inputDeltaValue.text  = `${value == null ? `` : value}`;
        }

        private _updateInputMultiplierPercentage(): void {
            const value                             = this._getAction().multiplierPercentage;
            this._inputMultiplierPercentage.text    = `${value == null ? `` : value}`;
        }

        private _updateLabelTips(): void {
            const action            = this._getAction();
            this._labelTips.text    = Lang.getFormattedText(LangTextType.F0088, Math.floor(10000 * (action.multiplierPercentage ?? 100) / 100 + (action.deltaValue ?? 0)));
        }

        private _getAction(): CommonProto.WarEvent.IWeaSetCustomCounter {
            return Twns.Helpers.getExisted(this._getOpenData().action.WeaSetCustomCounter);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}

// export default TwnsWeActionModifyPanel8;
