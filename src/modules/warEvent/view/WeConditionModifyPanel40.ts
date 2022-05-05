
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Twns.Notify               from "../../tools/notify/NotifyType";
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
    import LangTextType             = Twns.Lang.LangTextType;
    import NotifyType               = Twns.Notify.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventCondition       = CommonProto.WarEvent.IWarEventCondition;

    export type OpenDataForWeConditionModifyPanel40 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecPlayerIndexInTurnEqualTo */
    export class WeConditionModifyPanel40 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel40> {
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;
        private readonly _btnType!                      : TwnsUiButton.UiButton;
        private readonly _btnClose!                     : TwnsUiButton.UiButton;
        private readonly _labelDesc!                    : TwnsUiLabel.UiLabel;
        private readonly _labelError!                   : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!            : TwnsUiImage.UiImage;

        private readonly _btnPlayerIndex!               : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndex!             : TwnsUiLabel.UiLabel;
        private readonly _btnTeamIndex!                 : TwnsUiButton.UiButton;
        private readonly _labelTeamIndex!               : TwnsUiLabel.UiLabel;
        private readonly _btnUnitType!                  : TwnsUiButton.UiButton;
        private readonly _labelUnitType!                : TwnsUiLabel.UiLabel;
        private readonly _btnLocation!                  : TwnsUiButton.UiButton;
        private readonly _labelLocation!                : TwnsUiLabel.UiLabel;
        private readonly _btnGridIndex!                 : TwnsUiButton.UiButton;
        private readonly _labelGridIndex!               : TwnsUiLabel.UiLabel;
        private readonly _btnActionState!               : TwnsUiButton.UiButton;
        private readonly _labelActionState!             : TwnsUiLabel.UiLabel;
        private readonly _btnHasLoadedCo!               : TwnsUiButton.UiButton;
        private readonly _labelHasLoadedCo!             : TwnsUiLabel.UiLabel;
        private readonly _btnHpComparator!              : TwnsUiButton.UiButton;
        private readonly _labelHpComparator!            : TwnsUiLabel.UiLabel;
        private readonly _labelHp!                      : TwnsUiLabel.UiLabel;
        private readonly _inputHp!                      : TwnsUiTextInput.UiTextInput;
        private readonly _btnFuelPctComparator!         : TwnsUiButton.UiButton;
        private readonly _labelFuelPctComparator!       : TwnsUiLabel.UiLabel;
        private readonly _labelFuelPct!                 : TwnsUiLabel.UiLabel;
        private readonly _inputFuelPct!                 : TwnsUiTextInput.UiTextInput;
        private readonly _btnPriAmmoPctComparator!      : TwnsUiButton.UiButton;
        private readonly _labelPriAmmoPctComparator!    : TwnsUiLabel.UiLabel;
        private readonly _labelPriAmmoPct!              : TwnsUiLabel.UiLabel;
        private readonly _inputPriAmmoPct!              : TwnsUiTextInput.UiTextInput;
        private readonly _btnPromotionComparator!       : TwnsUiButton.UiButton;
        private readonly _labelPromotionComparator!     : TwnsUiLabel.UiLabel;
        private readonly _labelPromotion!               : TwnsUiLabel.UiLabel;
        private readonly _inputPromotion!               : TwnsUiTextInput.UiTextInput;
        private readonly _btnUnitsCountComparator!      : TwnsUiButton.UiButton;
        private readonly _labelUnitsCountComparator!    : TwnsUiLabel.UiLabel;
        private readonly _labelUnitsCount!              : TwnsUiLabel.UiLabel;
        private readonly _inputUnitsCount!              : TwnsUiTextInput.UiTextInput;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                   callback: this.close },
                { ui: this._btnType,                    callback: this._onTouchedBtnType },
                { ui: this._imgInnerTouchMask,          callback: this._onTouchedImgInnerTouchMask },
                { ui: this._btnPlayerIndex,             callback: this._onTouchedBtnPlayerIndex },
                { ui: this._btnTeamIndex,               callback: this._onTouchedBtnTeamIndex },
                { ui: this._btnUnitType,                callback: this._onTouchedBtnUnitType },
                { ui: this._btnLocation,                callback: this._onTouchedBtnLocation },
                { ui: this._btnGridIndex,               callback: this._onTouchedBtnGridIndex },
                { ui: this._btnActionState,             callback: this._onTouchedBtnActionState },
                { ui: this._btnHasLoadedCo,             callback: this._onTouchedBtnHasLoadedCo },
                { ui: this._btnHpComparator,            callback: this._onTouchedBtnHpComparator },
                { ui: this._inputHp,                    callback: this._onFocusInInputHp,                   eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputHp,                    callback: this._onFocusOutInputHp,                  eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnFuelPctComparator,       callback: this._onTouchedBtnFuelPctComparator },
                { ui: this._inputFuelPct,               callback: this._onFocusInInputFuelPct,              eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputFuelPct,               callback: this._onFocusOutInputFuelPct,             eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnPriAmmoPctComparator,    callback: this._onTouchedBtnPriAmmoPctComparator },
                { ui: this._inputPriAmmoPct,            callback: this._onFocusInInputPriAmmoPct,           eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputPriAmmoPct,            callback: this._onFocusOutInputPriAmmoPct,          eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnPromotionComparator,     callback: this._onTouchedBtnPromotionComparator },
                { ui: this._inputPromotion,             callback: this._onFocusInInputPromotion,            eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputPromotion,             callback: this._onFocusOutInputPromotion,           eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnUnitsCountComparator,    callback: this._onTouchedBtnUnitsCountComparator },
                { ui: this._inputUnitsCount,            callback: this._onFocusInInputUnitsCount,           eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputUnitsCount,            callback: this._onFocusOutInputUnitsCount,          eventType: egret.FocusEvent.FOCUS_OUT },
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
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.WeConditionTypeListPanel, {
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
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChoosePlayerIndexPanel, {
                currentPlayerIndexArray : condition.playerIndexArray ?? [],
                maxPlayerIndex          : this._getOpenData().war.getPlayersCountUnneutral(),
                callbackOnConfirm       : playerIndexArray => {
                    condition.playerIndexArray = playerIndexArray;
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnTeamIndex(): void {
            const condition = this._getCondition();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChooseTeamIndexPanel, {
                currentTeamIndexArray   : condition.teamIndexArray ?? [],
                maxTeamIndex            : this._getOpenData().war.getPlayersCountUnneutral(),
                callbackOnConfirm       : teamIndexArray => {
                    condition.teamIndexArray = teamIndexArray;
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnUnitType(): void {
            const condition = this._getCondition();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChooseUnitTypePanel, {
                gameConfig              : this._getOpenData().war.getGameConfig(),
                currentUnitTypeArray    : condition.unitTypeArray ?? [],
                callbackOnConfirm       : unitTypeArray => {
                    condition.unitTypeArray = unitTypeArray;
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnLocation(): void {
            const condition = this._getCondition();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChooseLocationPanel, {
                currentLocationIdArray  : condition.locationIdArray ?? [],
                callbackOnConfirm       : locationIdArray => {
                    condition.locationIdArray = locationIdArray;
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnGridIndex(): void {
            const condition = this._getCondition();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChooseGridIndexPanel, {
                currentGridIndexArray   : Twns.Helpers.getNonNullElements(condition.gridIndexArray?.map(v => GridIndexHelpers.convertGridIndex(v)) ?? []),
                mapSize                 : this._getOpenData().war.getTileMap().getMapSize(),
                callbackOnConfirm       : gridIndexArray => {
                    condition.gridIndexArray = gridIndexArray;
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnActionState(): void {
            const condition = this._getCondition();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChooseUnitActionStatePanel, {
                currentActionStateArray : condition.actionStateArray ?? [],
                callbackOnConfirm       : actionStateArray => {
                    condition.actionStateArray = actionStateArray;
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnHasLoadedCo(): void {
            const condition     = this._getCondition();
            const hasLoadedCo   = condition.hasLoadedCo;
            if (hasLoadedCo) {
                condition.hasLoadedCo = false;
            } else if (hasLoadedCo == false) {
                condition.hasLoadedCo = null;
            } else {
                condition.hasLoadedCo = true;
            }
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnHpComparator(): void {
            const condition         = this._getCondition();
            condition.hpComparator  = Twns.Helpers.getNextValueComparator(condition.hpComparator);
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputHp(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputHp(): void {
            const text  = this._inputHp.text;
            const value = text ? parseInt(text) : null;
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().hp = value;
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputHp();
            }
        }
        private _onTouchedBtnFuelPctComparator(): void {
            const condition             = this._getCondition();
            condition.fuelPctComparator = Twns.Helpers.getNextValueComparator(condition.fuelPctComparator);
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputFuelPct(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputFuelPct(): void {
            const text  = this._inputFuelPct.text;
            const value = text ? parseInt(text) : null;
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().fuelPct = value;
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputFuelPct();
            }
        }
        private _onTouchedBtnPriAmmoPctComparator(): void {
            const condition                 = this._getCondition();
            condition.priAmmoPctComparator  = Twns.Helpers.getNextValueComparator(condition.priAmmoPctComparator);
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputPriAmmoPct(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputPriAmmoPct(): void {
            const text  = this._inputPriAmmoPct.text;
            const value = text ? parseInt(text) : null;
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().priAmmoPct = value;
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputPriAmmoPct();
            }
        }
        private _onTouchedBtnPromotionComparator(): void {
            const condition                 = this._getCondition();
            condition.promotionComparator   = Twns.Helpers.getNextValueComparator(condition.promotionComparator);
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputPromotion(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputPromotion(): void {
            const text  = this._inputPromotion.text;
            const value = text ? parseInt(text) : null;
            if ((value == null) || (!isNaN(value))) {
                this._getCondition().promotion = value;
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputPromotion();
            }
        }
        private _onTouchedBtnUnitsCountComparator(): void {
            const condition                 = this._getCondition();
            condition.unitsCountComparator  = Twns.Helpers.getNextValueComparator(condition.unitsCountComparator);
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputUnitsCount(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputUnitsCount(): void {
            const value = parseInt(this._inputUnitsCount.text);
            if (isNaN(value)) {
                this._updateInputUnitsCount();
            } else {
                this._getCondition().unitsCount = value;
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelPlayerIndex();
            this._updateLabelTeamIndex();
            this._updateLabelUnitType();
            this._updateLabelLocation();
            this._updateLabelGridIndex();
            this._updateLabelActionState();
            this._updateLabelHasLoadedCo();
            this._updateLabelHpComparator();
            this._updateInputHp();
            this._updateLabelFuelPctComparator();
            this._updateInputFuelPct();
            this._updateLabelPriAmmoPctComparator();
            this._updateInputPriAmmoPct();
            this._updateLabelPromotionComparator();
            this._updateInputPromotion();
            this._updateLabelUnitsCountComparator();
            this._updateInputUnitsCount();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = `${Lang.getText(LangTextType.B0501)} C${this._getOpenData().condition.WecCommonData?.conditionId}`;
            this._btnClose.label                = Lang.getText(LangTextType.B0146);
            this._btnType.label                 = Lang.getText(LangTextType.B0516);
            this._btnPlayerIndex.label          = Lang.getText(LangTextType.B0031);
            this._btnTeamIndex.label            = Lang.getText(LangTextType.B0377);
            this._btnUnitType.label             = Lang.getText(LangTextType.B0525);
            this._btnLocation.label             = Lang.getText(LangTextType.B0764);
            this._btnGridIndex.label            = Lang.getText(LangTextType.B0531);
            this._btnActionState.label          = Lang.getText(LangTextType.B0526);
            this._btnHasLoadedCo.label          = Lang.getText(LangTextType.B0421);
            this._btnHpComparator.label         = Lang.getText(LangTextType.B0774);
            this._labelHp.text                  = Lang.getText(LangTextType.B0807);
            this._btnFuelPctComparator.label    = Lang.getText(LangTextType.B0774);
            this._labelFuelPct.text             = `${Lang.getText(LangTextType.B0342)}%`;
            this._btnPriAmmoPctComparator.label = Lang.getText(LangTextType.B0774);
            this._labelPriAmmoPct.text          = `${Lang.getText(LangTextType.B0350)}%`;
            this._btnPromotionComparator.label  = Lang.getText(LangTextType.B0774);
            this._labelPromotion.text           = Lang.getText(LangTextType.B0370);
            this._btnUnitsCountComparator.label = Lang.getText(LangTextType.B0774);
            this._labelUnitsCount.text          = Lang.getText(LangTextType.B0773);
            // this._labelGridIndex.text   = Lang.getText(LangTextType.B0531);

            this._updateLabelDescAndLabelError();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const condition         = openData.condition;
            const war               = openData.war;
            const errorTip          = WarHelpers.WarEventHelpers.getErrorTipForCondition(openData.fullData, condition, war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Twns.Types.ColorValue.Red : Twns.Types.ColorValue.Green;
            this._labelDesc.text    = WarHelpers.WarEventHelpers.getDescForCondition(condition, war.getGameConfig()) || Twns.CommonConstants.ErrorTextForUndefined;
        }
        private _updateLabelPlayerIndex(): void {
            const playerIndexArray      = this._getCondition().playerIndexArray;
            this._labelPlayerIndex.text = playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelTeamIndex(): void {
            const teamIndexArray        = this._getCondition().teamIndexArray;
            this._labelTeamIndex.text   = teamIndexArray?.length ? teamIndexArray.map(v => Lang.getPlayerTeamName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelUnitType(): void {
            const unitTypeArray         = this._getCondition().unitTypeArray;
            this._labelUnitType.text    = unitTypeArray?.length ? unitTypeArray.map(v => Lang.getUnitName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelLocation(): void {
            const locationIdArray       = this._getCondition().locationIdArray;
            this._labelLocation.text    = locationIdArray?.length ? locationIdArray.join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelGridIndex(): void {
            const gridIndexArray        = this._getCondition().gridIndexArray;
            this._labelGridIndex.text   = gridIndexArray?.length ? gridIndexArray.map(v => `(${v.x},${v.y})`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelActionState(): void {
            const actionStateArray      = this._getCondition().actionStateArray;
            this._labelActionState.text = actionStateArray?.length ? actionStateArray.map(v => Lang.getUnitActionStateText(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelHasLoadedCo(): void {
            const hasLoadedCo           = this._getCondition().hasLoadedCo;
            this._labelHasLoadedCo.text = hasLoadedCo != null ? (Lang.getText(hasLoadedCo ? LangTextType.B0012 : LangTextType.B0013)) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelHpComparator(): void {
            const comparator                = this._getCondition().hpComparator;
            this._labelHpComparator.text    = comparator == null ? Twns.CommonConstants.ErrorTextForUndefined : Lang.getValueComparatorName(comparator) ?? Twns.CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputHp(): void {
            this._inputHp.text = `${this._getCondition().hp ?? ``}`;
        }
        private _updateLabelFuelPctComparator(): void {
            const comparator                    = this._getCondition().fuelPctComparator;
            this._labelFuelPctComparator.text   = comparator == null ? Twns.CommonConstants.ErrorTextForUndefined : Lang.getValueComparatorName(comparator) ?? Twns.CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputFuelPct(): void {
            this._inputFuelPct.text = `${this._getCondition().fuelPct ?? ``}`;
        }
        private _updateLabelPriAmmoPctComparator(): void {
            const comparator                        = this._getCondition().priAmmoPctComparator;
            this._labelPriAmmoPctComparator.text    = comparator == null ? Twns.CommonConstants.ErrorTextForUndefined : Lang.getValueComparatorName(comparator) ?? Twns.CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputPriAmmoPct(): void {
            this._inputPriAmmoPct.text = `${this._getCondition().priAmmoPct ?? ``}`;
        }
        private _updateLabelPromotionComparator(): void {
            const comparator                    = this._getCondition().promotionComparator;
            this._labelPromotionComparator.text = comparator == null ? Twns.CommonConstants.ErrorTextForUndefined : Lang.getValueComparatorName(comparator) ?? Twns.CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputPromotion(): void {
            this._inputPromotion.text = `${this._getCondition().promotion ?? ``}`;
        }
        private _updateLabelUnitsCountComparator(): void {
            const comparator                        = Twns.Helpers.getExisted(this._getCondition().unitsCountComparator);
            this._labelUnitsCountComparator.text    = Lang.getValueComparatorName(comparator) ?? Twns.CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputUnitsCount(): void {
            this._inputUnitsCount.text = `${this._getCondition().unitsCount}`;
        }

        private _getCondition(): CommonProto.WarEvent.IWecUnitPresence {
            return Twns.Helpers.getExisted(this._getOpenData().condition.WecUnitPresence);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}

// export default TwnsWeConditionModifyPanel16;
