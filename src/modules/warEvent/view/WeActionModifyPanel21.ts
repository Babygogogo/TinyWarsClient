
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWeActionModifyPanel21 {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction          = ProtoTypes.WarEvent.IWarEventAction;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import BwWar                    = Twns.BaseWar.BwWar;

    export type OpenData = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel21 extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;
        private readonly _btnType!                      : TwnsUiButton.UiButton;
        private readonly _btnBack!                      : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndexTitle!        : TwnsUiLabel.UiLabel;
        private readonly _labelPlayerIndex!             : TwnsUiLabel.UiLabel;
        private readonly _btnSwitchPlayerIndex!         : TwnsUiButton.UiButton;
        private readonly _labelMultiplierPercentage!    : TwnsUiLabel.UiLabel;
        private readonly _inputMultiplierPercentage!    : TwnsUiTextInput.UiTextInput;
        private readonly _labelDeltaValue!              : TwnsUiLabel.UiLabel;
        private readonly _inputDeltaValue!              : TwnsUiTextInput.UiTextInput;
        private readonly _labelTips!                    : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnSwitchPlayerIndex,       callback: this._onTouchedBtnSwitchPlayerIndex },
                { ui: this._btnType,                    callback: this._onTouchedBtnType },
                { ui: this._btnBack,                    callback: this.close },
                { ui: this._inputDeltaValue,            callback: this._onFocusOutInputDeltaValue,              eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputMultiplierPercentage,  callback: this._onFocusOutInputMultiplierPercentage,    eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
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
            this._updateLabelPlayerIndex();
            this._updateInputDeltaValue();
            this._updateInputMultiplierPercentage();
            this._updateLabelTips();
        }

        private _onTouchedBtnSwitchPlayerIndex(): void {
            const openData      = this._getOpenData();
            const action        = this._getAction();
            action.playerIndex  = ((action.playerIndex || 0) % openData.war.getPlayersCountUnneutral()) + 1;

            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        private _onFocusOutInputDeltaValue(): void {
            const action    = this._getAction();
            const text      = this._inputDeltaValue.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.deltaValue = null;
            } else {
                const maxValue      = CommonConstants.WarEventActionSetPlayerFundMaxDeltaValue;
                action.deltaValue   = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusOutInputMultiplierPercentage(): void {
            const action    = this._getAction();
            const text      = this._inputMultiplierPercentage.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.multiplierPercentage = null;
            } else {
                const maxValue              = CommonConstants.WarEventActionSetPlayerFundMaxMultiplierPercentage;
                action.multiplierPercentage = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelPlayerIndex();
            this._updateInputDeltaValue();
            this._updateInputMultiplierPercentage();
            this._updateLabelTips();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                   = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label                     = Lang.getText(LangTextType.B0516);
            this._btnSwitchPlayerIndex.label        = Lang.getText(LangTextType.B0520);
            this._btnBack.label                     = Lang.getText(LangTextType.B0146);
            this._labelPlayerIndexTitle.text        = Lang.getText(LangTextType.B0521);
            this._labelDeltaValue.text              = Lang.getText(LangTextType.B0754);
            this._labelMultiplierPercentage.text    = `${Lang.getText(LangTextType.B0755)}%`;

            this._updateLabelTips();
        }

        private _updateLabelPlayerIndex(): void {
            this._labelPlayerIndex.text = `P${this._getAction().playerIndex || `??`}`;
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

        private _getAction(): ProtoTypes.WarEvent.IWeaDeprecatedSetPlayerFund {
            return Helpers.getExisted(this._getOpenData().action.WeaDeprecatedSetPlayerFund);
        }
    }
}

// export default TwnsWeActionModifyPanel8;
