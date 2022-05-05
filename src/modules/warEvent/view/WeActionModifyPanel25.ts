
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
    import BwWar                    = Twns.BaseWar.BwWar;

    export type OpenDataForWeActionModifyPanel25 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel25 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel25> {
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;
        private readonly _btnType!                      : TwnsUiButton.UiButton;
        private readonly _btnBack!                      : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndex!             : TwnsUiLabel.UiLabel;
        private readonly _btnSwitchPlayerIndex!         : TwnsUiButton.UiButton;
        private readonly _labelMultiplierPercentage!    : TwnsUiLabel.UiLabel;
        private readonly _inputMultiplierPercentage!    : TwnsUiTextInput.UiTextInput;
        private readonly _labelDeltaPercentage!         : TwnsUiLabel.UiLabel;
        private readonly _inputDeltaPercentage!         : TwnsUiTextInput.UiTextInput;
        private readonly _labelTips!                    : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnSwitchPlayerIndex,       callback: this._onTouchedBtnSwitchPlayerIndex },
                { ui: this._btnType,                    callback: this._onTouchedBtnType },
                { ui: this._btnBack,                    callback: this.close },
                { ui: this._inputDeltaPercentage,       callback: this._onFocusOutInputDeltaPercentage,         eventType: egret.FocusEvent.FOCUS_OUT },
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
            this._updateInputDeltaPercentage();
            this._updateInputMultiplierPercentage();
            this._updateLabelTips();
        }

        private _onTouchedBtnSwitchPlayerIndex(): void {
            const openData  = this._getOpenData();
            const action    = this._getAction();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChoosePlayerIndexPanel, {
                currentPlayerIndexArray : action.playerIndexArray ?? [],
                maxPlayerIndex          : openData.war.getPlayersCountUnneutral(),
                callbackOnConfirm       : playerIndexArray => {
                    action.playerIndexArray = playerIndexArray;
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

        private _onFocusOutInputDeltaPercentage(): void {
            const action    = this._getAction();
            const text      = this._inputDeltaPercentage.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actCoEnergyDeltaPct = null;
            } else {
                const maxValue              = Twns.CommonConstants.WarEventActionSetPlayerCoEnergyMaxDeltaPercentage;
                action.actCoEnergyDeltaPct  = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusOutInputMultiplierPercentage(): void {
            const action    = this._getAction();
            const text      = this._inputMultiplierPercentage.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actCoEnergyMultiplierPct = null;
            } else {
                const maxValue                  = Twns.CommonConstants.WarEventActionSetPlayerCoEnergyMaxMultiplierPercentage;
                action.actCoEnergyMultiplierPct = Math.min(
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

            this._updateLabelPlayerIndex();
            this._updateInputDeltaPercentage();
            this._updateInputMultiplierPercentage();
            this._updateLabelTips();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                   = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label                     = Lang.getText(LangTextType.B0516);
            this._btnSwitchPlayerIndex.label        = Lang.getText(LangTextType.B0521);
            this._btnBack.label                     = Lang.getText(LangTextType.B0146);
            this._labelDeltaPercentage.text         = `${Lang.getText(LangTextType.B0754)}%`;
            this._labelMultiplierPercentage.text    = `${Lang.getText(LangTextType.B0755)}%`;

            this._updateLabelTips();
        }

        private _updateLabelPlayerIndex(): void {
            const playerIndexArray      = this._getAction().playerIndexArray;
            this._labelPlayerIndex.text = playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`/`) : Lang.getText(LangTextType.B0766);
        }

        private _updateInputDeltaPercentage(): void {
            const value                     = this._getAction().actCoEnergyDeltaPct;
            this._inputDeltaPercentage.text = `${value == null ? `` : value}`;
        }

        private _updateInputMultiplierPercentage(): void {
            const value                             = this._getAction().actCoEnergyMultiplierPct;
            this._inputMultiplierPercentage.text    = `${value == null ? `` : value}`;
        }

        private _updateLabelTips(): void {
            const action            = this._getAction();
            this._labelTips.text    = Lang.getFormattedText(
                LangTextType.F0089,
                Math.max(0, Math.min(100, Math.floor(40 * (action.actCoEnergyMultiplierPct ?? 100) / 100 + (action.actCoEnergyDeltaPct ?? 0))))
            );
        }

        private _getAction(): CommonProto.WarEvent.IWeaSetPlayerCoEnergy {
            return Twns.Helpers.getExisted(this._getOpenData().action.WeaSetPlayerCoEnergy);
        }
    }
}

// export default TwnsWeActionModifyPanel9;
