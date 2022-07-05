
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType               = Notify.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventAction          = CommonProto.WarEvent.IWarEventAction;
    import LangTextType             = Lang.LangTextType;
    import BwWar                    = BaseWar.BwWar;

    export type OpenDataForWeActionModifyPanel24 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel24 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel24> {
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;
        private readonly _btnType!                      : TwnsUiButton.UiButton;
        private readonly _btnBack!                      : TwnsUiButton.UiButton;
        private readonly _labelDesc!                    : TwnsUiLabel.UiLabel;
        private readonly _labelError!                   : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!            : TwnsUiImage.UiImage;

        private readonly _btnSwitchPlayerIndex!                 : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndex!                     : TwnsUiLabel.UiLabel;
        private readonly _btnConIsPlayerInTurn!                 : TwnsUiButton.UiButton;
        private readonly _labelConIsPlayerInTurn!               : TwnsUiLabel.UiLabel;

        private readonly _btnConCoUsingSkillType!               : TwnsUiButton.UiButton;
        private readonly _labelConCoUsingSkillType!             : TwnsUiLabel.UiLabel;
        private readonly _btnConAliveState!                     : TwnsUiButton.UiButton;
        private readonly _labelConAliveState!                   : TwnsUiLabel.UiLabel;
        private readonly _labelConFund!                         : TwnsUiLabel.UiLabel;
        private readonly _inputConFund!                         : TwnsUiTextInput.UiTextInput;
        private readonly _btnConFundComparator!                 : TwnsUiButton.UiButton;
        private readonly _labelConFundComparator!               : TwnsUiLabel.UiLabel;
        private readonly _labelConEnergyPercentage!             : TwnsUiLabel.UiLabel;
        private readonly _inputConEnergyPercentage!             : TwnsUiTextInput.UiTextInput;
        private readonly _btnConEnergyPercentageComparator!     : TwnsUiButton.UiButton;
        private readonly _labelConEnergyPercentageComparator!   : TwnsUiLabel.UiLabel;

        private readonly _btnActAliveState!                 : TwnsUiButton.UiButton;
        private readonly _labelActAliveState!               : TwnsUiLabel.UiLabel;
        private readonly _btnActAliveStateHelp!             : TwnsUiButton.UiButton;
        private readonly _labelActFund!                     : TwnsUiLabel.UiLabel;
        private readonly _labelActFundMultiplierPct!        : TwnsUiLabel.UiLabel;
        private readonly _inputActFundMultiplierPct!        : TwnsUiTextInput.UiTextInput;
        private readonly _labelActFundDeltaValue!           : TwnsUiLabel.UiLabel;
        private readonly _inputActFundDeltaValue!           : TwnsUiTextInput.UiTextInput;
        private readonly _labelActCoEnergy!                 : TwnsUiLabel.UiLabel;
        private readonly _labelActCoEnergyMultiplierPct!    : TwnsUiLabel.UiLabel;
        private readonly _inputActCoEnergyMultiplierPct!    : TwnsUiTextInput.UiTextInput;
        private readonly _labelActCoEnergyDeltaPct!         : TwnsUiLabel.UiLabel;
        private readonly _inputActCoEnergyDeltaPct!         : TwnsUiTextInput.UiTextInput;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnType,                            callback: this._onTouchedBtnType },
                { ui: this._btnBack,                            callback: this.close },
                { ui: this._imgInnerTouchMask,                  callback: this._onTouchedImgInnerTouchMask },

                { ui: this._btnSwitchPlayerIndex,               callback: this._onTouchedBtnSwitchPlayerIndex },
                { ui: this._btnConIsPlayerInTurn,               callback: this._onTouchedBtnConIsPlayerInTurn },
                { ui: this._btnConCoUsingSkillType,             callback: this._onTouchedBtnConCoUsingSkillType },
                { ui: this._btnConAliveState,                   callback: this._onTouchedBtnConAliveState },
                { ui: this._inputConFund,                       callback: this._onFocusInInputConFund,                      eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputConFund,                       callback: this._onFocusOutInputConFund,                     eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnConFundComparator,               callback: this._onTouchedBtnConFundComparator },
                { ui: this._inputConEnergyPercentage,           callback: this._onFocusInInputConEnergyPercentage,          eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputConEnergyPercentage,           callback: this._onFocusOutInputConEnergyPercentage,         eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnConEnergyPercentageComparator,   callback: this._onTouchedBtnConEnergyPercentageComparator },

                { ui: this._btnActAliveState,                   callback: this._onTouchedBtnActAliveState },
                { ui: this._btnActAliveStateHelp,               callback: this._onTouchedBtnActAliveStateHelp },
                { ui: this._inputActFundDeltaValue,             callback: this._onFocusInInputActFundDeltaValue,            eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActFundDeltaValue,             callback: this._onFocusOutInputActFundDeltaValue,           eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputActFundMultiplierPct,          callback: this._onFocusInInputActFundMultiplierPct,         eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActFundMultiplierPct,          callback: this._onFocusOutInputActFundMultiplierPct,        eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputActCoEnergyDeltaPct,           callback: this._onFocusInInputActCoEnergyDeltaPct,          eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActCoEnergyDeltaPct,           callback: this._onFocusOutInputActCoEnergyDeltaPct,         eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputActCoEnergyMultiplierPct,      callback: this._onFocusInInputActCoEnergyMultiplierPct,     eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActCoEnergyMultiplierPct,      callback: this._onFocusOutInputActCoEnergyMultiplierPct,    eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
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

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            PanelHelpers.open(PanelHelpers.PanelDict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        private _onTouchedImgInnerTouchMask(): void {
            this._setInnerTouchMaskEnabled(false);
        }

        private _onTouchedBtnSwitchPlayerIndex(): void {
            const openData  = this._getOpenData();
            const action    = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChoosePlayerIndexPanel, {
                currentPlayerIndexArray : action.conPlayerIndexArray ?? [],
                maxPlayerIndex          : openData.war.getPlayersCountUnneutral(),
                callbackOnConfirm       : playerIndexArray => {
                    action.conPlayerIndexArray = playerIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnConIsPlayerInTurn(): void {
            const action            = this._getAction();
            const conIsPlayerInTurn = action.conIsPlayerInTurn;
            if (conIsPlayerInTurn == null) {
                action.conIsPlayerInTurn = true;
            } else if (conIsPlayerInTurn) {
                action.conIsPlayerInTurn = false;
            } else {
                action.conIsPlayerInTurn = null;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnConCoUsingSkillType(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseCoSkillTypePanel, {
                currentSkillTypeArray   : action.conCoUsingSkillTypeArray ?? [],
                callbackOnConfirm       : skillTypeArray => {
                    action.conCoUsingSkillTypeArray = skillTypeArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnConAliveState(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChoosePlayerAliveStatePanel, {
                currentAliveStateArray  : action.conAliveStateArray ?? [],
                callbackOnConfirm       : aliveStateArray => {
                    action.conAliveStateArray = aliveStateArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onFocusInInputConFund(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputConFund(): void {
            const text  = this._inputConFund.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (!isNaN(value))) {
                this._getAction().conFund = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputConFund();
            }
        }
        private _onTouchedBtnConFundComparator(): void {
            const condition             = this._getAction();
            condition.conFundComparator = Helpers.getNextValueComparator(condition.conFundComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputConEnergyPercentage(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputConEnergyPercentage(): void {
            const text  = this._inputConEnergyPercentage.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (!isNaN(value))) {
                this._getAction().conEnergyPercentage = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputConEnergyPercentage();
            }
        }
        private _onTouchedBtnConEnergyPercentageComparator(): void {
            const condition                         = this._getAction();
            condition.conEnergyPercentageComparator = Helpers.getNextValueComparator(condition.conEnergyPercentageComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnActAliveState(): void {
            const action        = this._getAction();
            const aliveState    = action.actAliveState;
            if (aliveState === Types.PlayerAliveState.Alive) {
                action.actAliveState = Types.PlayerAliveState.Dying;
            } else if (aliveState === Types.PlayerAliveState.Dying) {
                action.actAliveState = Types.PlayerAliveState.Dead;
            } else if (aliveState === Types.PlayerAliveState.Dead) {
                action.actAliveState = null;
            } else {
                action.actAliveState = Types.PlayerAliveState.Alive;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnActAliveStateHelp(): void {
            PanelHelpers.open(PanelHelpers.PanelDict.CommonHelpPanel, {
                title   : Lang.getText(LangTextType.B0784),
                content : Lang.getText(LangTextType.A0272),
            });
        }

        private _onFocusInInputActFundDeltaValue(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActFundDeltaValue(): void {
            const action    = this._getAction();
            const text      = this._inputActFundDeltaValue.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actFundDeltaValue = null;
            } else {
                const maxValue              = CommonConstants.WarEventActionSetPlayerFundMaxDeltaValue;
                action.actFundDeltaValue    = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputActFundMultiplierPct(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActFundMultiplierPct(): void {
            const action    = this._getAction();
            const text      = this._inputActFundMultiplierPct.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actFundMultiplierPercentage = null;
            } else {
                const maxValue                      = CommonConstants.WarEventActionSetPlayerFundMaxMultiplierPercentage;
                action.actFundMultiplierPercentage  = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputActCoEnergyDeltaPct(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActCoEnergyDeltaPct(): void {
            const action    = this._getAction();
            const text      = this._inputActCoEnergyDeltaPct.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actCoEnergyDeltaPct = null;
            } else {
                const maxValue              = CommonConstants.WarEventActionSetPlayerCoEnergyMaxDeltaPercentage;
                action.actCoEnergyDeltaPct  = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputActCoEnergyMultiplierPct(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActCoEnergyMultiplierPct(): void {
            const action    = this._getAction();
            const text      = this._inputActCoEnergyMultiplierPct.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actCoEnergyMultiplierPct = null;
            } else {
                const maxValue                  = CommonConstants.WarEventActionSetPlayerCoEnergyMaxMultiplierPercentage;
                action.actCoEnergyMultiplierPct = Math.min(
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
            this._updateLabelConIsPlayerInTurn();
            this._updateLabelConCoUsingSkillType();
            this._updateConLabelAliveState();
            this._updateInputConFund();
            this._updateLabelConFundComparator();
            this._updateInputConEnergyPercentage();
            this._updateLabelConEnergyPercentageComparator();

            this._updateLabelActAliveState();
            this._updateInputActFundDeltaValue();
            this._updateInputActFundMultiplierPercentage();
            this._updateInputActCoEnergyDeltaPct();
            this._updateInputActCoEnergyMultiplierPercentage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                           = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label                             = Lang.getText(LangTextType.B0516);
            this._btnBack.label                             = Lang.getText(LangTextType.B0146);
            this._btnSwitchPlayerIndex.label                = Lang.getText(LangTextType.B0521);
            this._btnConIsPlayerInTurn.label                   = Lang.getText(LangTextType.B0086);
            this._btnConCoUsingSkillType.label              = Lang.getText(LangTextType.B0785);
            this._btnConAliveState.label                    = Lang.getText(LangTextType.B0784);
            this._btnActAliveState.label                    = Lang.getText(LangTextType.B0784);
            this._labelConFund.text                         = Lang.getText(LangTextType.B0032);
            this._btnConFundComparator.label                = Lang.getText(LangTextType.B0774);
            this._labelConEnergyPercentage.text             = Lang.getText(LangTextType.B0787);
            this._btnConEnergyPercentageComparator.label    = Lang.getText(LangTextType.B0774);

            this._labelActFund.text                         = Lang.getText(LangTextType.B0032);
            this._labelActFundDeltaValue.text               = Lang.getText(LangTextType.B0754);
            this._labelActFundMultiplierPct.text            = `${Lang.getText(LangTextType.B0755)}%`;
            this._labelActCoEnergy.text                     = Lang.getText(LangTextType.B0809);
            this._labelActCoEnergyDeltaPct.text             = `${Lang.getText(LangTextType.B0754)}%`;
            this._labelActCoEnergyMultiplierPct.text        = `${Lang.getText(LangTextType.B0755)}%`;

            this._updateLabelDescAndLabelError();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const action            = openData.action;
            const war               = openData.war;
            const errorTip          = WarHelpers.WarEventHelpers.getErrorTipForAction(openData.fullData, action, war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
            this._labelDesc.text    = WarHelpers.WarEventHelpers.getDescForAction(action, war.getGameConfig()) || CommonConstants.ErrorTextForUndefined;
        }

        private _updateLabelPlayerIndex(): void {
            const playerIndexArray      = this._getAction().conPlayerIndexArray;
            this._labelPlayerIndex.text = playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`/`) : Lang.getText(LangTextType.B0766);
        }

        private _updateLabelConIsPlayerInTurn(): void {
            const conIsPlayerInTurn = this._getAction().conIsPlayerInTurn;
            const label             = this._labelConIsPlayerInTurn;
            if (conIsPlayerInTurn == null) {
                label.text = `--`;
            } else {
                label.text = Lang.getText(conIsPlayerInTurn ? LangTextType.B0012 : LangTextType.B0013);
            }
        }

        private _updateLabelConCoUsingSkillType(): void {
            const usingSkillTypeArray           = this._getAction().conCoUsingSkillTypeArray;
            this._labelConCoUsingSkillType.text = usingSkillTypeArray?.length ? usingSkillTypeArray.map(v => Lang.getCoSkillTypeName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }

        private _updateConLabelAliveState(): void {
            const aliveStateArray           = this._getAction().conAliveStateArray;
            this._labelConAliveState.text   = aliveStateArray?.length ? aliveStateArray.map(v => Lang.getPlayerAliveStateName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }

        private _updateInputConFund(): void {
            const fund              = this._getAction().conFund;
            this._inputConFund.text    = fund == null ? `` : `${fund}`;
        }

        private _updateLabelConFundComparator(): void {
            const comparator                    = this._getAction().conFundComparator;
            this._labelConFundComparator.text   = comparator == null ? CommonConstants.ErrorTextForUndefined : (Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined);
        }

        private _updateInputConEnergyPercentage(): void {
            const energyPercentage              = this._getAction().conEnergyPercentage;
            this._inputConEnergyPercentage.text    = energyPercentage == null ? `` : `${energyPercentage}`;
        }

        private _updateLabelConEnergyPercentageComparator(): void {
            const comparator                                = this._getAction().conEnergyPercentageComparator;
            this._labelConEnergyPercentageComparator.text   = comparator == null ? CommonConstants.ErrorTextForUndefined : (Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined);
        }

        private _updateLabelActAliveState(): void {
            const aliveState                = this._getAction().actAliveState;
            this._labelActAliveState.text   = aliveState == null ? `--` : (Lang.getPlayerAliveStateName(aliveState) ?? CommonConstants.ErrorTextForUndefined);
        }

        private _updateInputActFundDeltaValue(): void {
            const value                 = this._getAction().actFundDeltaValue;
            this._inputActFundDeltaValue.text  = `${value == null ? `` : value}`;
        }

        private _updateInputActFundMultiplierPercentage(): void {
            const value                             = this._getAction().actFundMultiplierPercentage;
            this._inputActFundMultiplierPct.text    = `${value == null ? `` : value}`;
        }

        private _updateInputActCoEnergyDeltaPct(): void {
            const value                         = this._getAction().actCoEnergyDeltaPct;
            this._inputActCoEnergyDeltaPct.text = `${value == null ? `` : value}`;
        }

        private _updateInputActCoEnergyMultiplierPercentage(): void {
            const value                                 = this._getAction().actCoEnergyMultiplierPct;
            this._inputActCoEnergyMultiplierPct.text    = `${value == null ? `` : value}`;
        }

        private _getAction(): CommonProto.WarEvent.IWeaSetPlayerState {
            return Helpers.getExisted(this._getOpenData().action.WeaSetPlayerState);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}

// export default TwnsWeActionModifyPanel8;
