
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

    export type OpenDataForWeConditionModifyPanel14 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecPlayerIndexInTurnEqualTo */
    export class WeConditionModifyPanel14 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel14> {
        private readonly _labelTitle!                       : TwnsUiLabel.UiLabel;
        private readonly _btnType!                          : TwnsUiButton.UiButton;
        private readonly _btnClose!                         : TwnsUiButton.UiButton;
        private readonly _labelDesc!                        : TwnsUiLabel.UiLabel;
        private readonly _labelError!                       : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!                : TwnsUiImage.UiImage;

        private readonly _btnPlayerIndex!                   : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndex!                 : TwnsUiLabel.UiLabel;
        private readonly _btnAliveState!                    : TwnsUiButton.UiButton;
        private readonly _labelAliveState!                  : TwnsUiLabel.UiLabel;
        private readonly _btnCoCategory!                    : TwnsUiButton.UiButton;
        private readonly _labelCoCategory!                  : TwnsUiLabel.UiLabel;
        private readonly _btnUsingSkillType!                : TwnsUiButton.UiButton;
        private readonly _labelUsingSkillType!              : TwnsUiLabel.UiLabel;
        private readonly _labelFund!                        : TwnsUiLabel.UiLabel;
        private readonly _inputFund!                        : TwnsUiTextInput.UiTextInput;
        private readonly _btnFundComparator!                : TwnsUiButton.UiButton;
        private readonly _labelFundComparator!              : TwnsUiLabel.UiLabel;
        private readonly _labelEnergyPercentage!            : TwnsUiLabel.UiLabel;
        private readonly _inputEnergyPercentage!            : TwnsUiTextInput.UiTextInput;
        private readonly _btnEnergyPercentageComparator!    : TwnsUiButton.UiButton;
        private readonly _labelEnergyPercentageComparator!  : TwnsUiLabel.UiLabel;
        private readonly _labelPlayersCount!                : TwnsUiLabel.UiLabel;
        private readonly _inputPlayersCount!                : TwnsUiTextInput.UiTextInput;
        private readonly _btnPlayersCountComparator!        : TwnsUiButton.UiButton;
        private readonly _labelPlayersCountComparator!      : TwnsUiLabel.UiLabel;

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
                { ui: this._btnAliveState,                  callback: this._onTouchedBtnAliveState },
                { ui: this._btnCoCategory,                  callback: this._onTouchedBtnCoCategory },
                { ui: this._btnUsingSkillType,              callback: this._onTouchedBtnUsingSkillType },
                { ui: this._inputFund,                      callback: this._onFocusInInputFund,                     eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputFund,                      callback: this._onFocusOutInputFund,                    eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnFundComparator,              callback: this._onTouchedBtnFundComparator },
                { ui: this._inputEnergyPercentage,          callback: this._onFocusInInputEnergyPercentage,         eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputEnergyPercentage,          callback: this._onFocusOutInputEnergyPercentage,        eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnEnergyPercentageComparator,  callback: this._onTouchedBtnEnergyPercentageComparator },
                { ui: this._inputPlayersCount,              callback: this._onFocusInInputPlayersCount,             eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputPlayersCount,              callback: this._onFocusOutInputPlayersCount,            eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnPlayersCountComparator,      callback: this._onTouchedBtnPlayersCountComparator },
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
        private _onTouchedBtnAliveState(): void {
            const condition = this._getCondition();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChoosePlayerAliveStatePanel, {
                currentAliveStateArray  : condition.aliveStateArray ?? [],
                callbackOnConfirm       : aliveStateArray => {
                    condition.aliveStateArray = aliveStateArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnCoCategory(): void {
            const condition = this._getCondition();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseCoCategoryIdPanel, {
                currentCoCategoryIdArray        : condition.coCategoryIdArray ?? [],
                gameConfig                      : this._getOpenData().war.getGameConfig(),
                forceUnchosenCoCategoryIdArray  : null,
                callbackOnConfirm               : coCategoryIdArray => {
                    condition.coCategoryIdArray = coCategoryIdArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                }
            });
        }
        private _onTouchedBtnUsingSkillType(): void {
            const condition = this._getCondition();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseCoSkillTypePanel, {
                currentSkillTypeArray   : condition.coUsingSkillTypeArray ?? [],
                callbackOnConfirm       : skillTypeArray => {
                    condition.coUsingSkillTypeArray = skillTypeArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onFocusInInputFund(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputFund(): void {
            const text  = this._inputFund.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().fund = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputFund();
            }
        }
        private _onTouchedBtnFundComparator(): void {
            const condition             = this._getCondition();
            condition.fundComparator    = Helpers.getNextValueComparator(condition.fundComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputEnergyPercentage(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputEnergyPercentage(): void {
            const text  = this._inputEnergyPercentage.text;
            const value = !text ? null : parseInt(text);
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().energyPercentage = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputEnergyPercentage();
            }
        }
        private _onTouchedBtnEnergyPercentageComparator(): void {
            const condition                         = this._getCondition();
            condition.energyPercentageComparator    = Helpers.getNextValueComparator(condition.energyPercentageComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputPlayersCount(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputPlayersCount(): void {
            const text  = this._inputPlayersCount.text;
            const value = !text ? null : parseInt(text);
            if ((value != null) && (!isNaN(value))) {
                this._getCondition().playersCount = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputPlayersCount();
            }
        }
        private _onTouchedBtnPlayersCountComparator(): void {
            const condition                     = this._getCondition();
            condition.playersCountComparator    = Helpers.getNextValueComparator(condition.playersCountComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelPlayerIndex();
            this._updateLabelAliveState();
            this._updateLabelCoCategory();
            this._updateLabelUsingSkillType();
            this._updateInputFund();
            this._updateLabelFundComparator();
            this._updateInputEnergyPercentage();
            this._updateLabelEnergyPercentageComparator();
            this._updateInputPlayersCount();
            this._updatePlayersCountComparator();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                       = `${Lang.getText(LangTextType.B0501)} C${this._getOpenData().condition.WecCommonData?.conditionId}`;
            this._btnClose.label                        = Lang.getText(LangTextType.B0146);
            this._btnType.label                         = Lang.getText(LangTextType.B0516);
            this._btnPlayerIndex.label                  = Lang.getText(LangTextType.B0521);
            this._btnAliveState.label                   = Lang.getText(LangTextType.B0784);
            this._btnCoCategory.label                   = Lang.getText(LangTextType.B0425);
            this._btnUsingSkillType.label               = Lang.getText(LangTextType.B0785);
            this._labelFund.text                        = Lang.getText(LangTextType.B0032);
            this._btnFundComparator.label               = Lang.getText(LangTextType.B0774);
            this._labelEnergyPercentage.text            = Lang.getText(LangTextType.B0787);
            this._btnEnergyPercentageComparator.label   = Lang.getText(LangTextType.B0774);
            this._labelPlayersCount.text                = Lang.getText(LangTextType.B0229);
            this._btnPlayersCountComparator.label       = Lang.getText(LangTextType.B0774);

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
        private _updateLabelAliveState(): void {
            const aliveStateArray       = this._getCondition().aliveStateArray;
            this._labelAliveState.text  = aliveStateArray?.length ? aliveStateArray.map(v => Lang.getPlayerAliveStateName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelCoCategory(): void {
            const coCategoryIdArray     = this._getCondition().coCategoryIdArray;
            const gameConfig            = this._getOpenData().war.getGameConfig();
            this._labelCoCategory.text  = coCategoryIdArray?.length ? coCategoryIdArray.map(v => gameConfig.getCoCategoryCfg(v)?.name).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelUsingSkillType(): void {
            const usingSkillTypeArray       = this._getCondition().coUsingSkillTypeArray;
            this._labelUsingSkillType.text  = usingSkillTypeArray?.length ? usingSkillTypeArray.map(v => Lang.getCoSkillTypeName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateInputFund(): void {
            const fund              = this._getCondition().fund;
            this._inputFund.text    = fund == null ? `` : `${fund}`;
        }
        private _updateLabelFundComparator(): void {
            const comparator                = Helpers.getExisted(this._getCondition().fundComparator);
            this._labelFundComparator.text  = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputEnergyPercentage(): void {
            const energyPercentage              = this._getCondition().energyPercentage;
            this._inputEnergyPercentage.text    = energyPercentage == null ? `` : `${energyPercentage}`;
        }
        private _updateLabelEnergyPercentageComparator(): void {
            const comparator                            = Helpers.getExisted(this._getCondition().energyPercentageComparator);
            this._labelEnergyPercentageComparator.text  = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputPlayersCount(): void {
            const playersCount              = this._getCondition().playersCount;
            this._inputPlayersCount.text    = playersCount == null ? `` : `${playersCount}`;
        }
        private _updatePlayersCountComparator(): void {
            const comparator                        = Helpers.getExisted(this._getCondition().playersCountComparator);
            this._labelPlayersCountComparator.text  = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _getCondition(): CommonProto.WarEvent.IWecPlayerPresence {
            return Helpers.getExisted(this._getOpenData().condition.WecPlayerPresence);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}

// export default TwnsWeConditionModifyPanel15;
