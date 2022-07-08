
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import LangTextType             = Lang.LangTextType;
    import NotifyType               = Notify.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventAction          = CommonProto.WarEvent.IWarEventAction;

    export type OpenDataForWeActionModifyPanel30 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel30 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel30> {
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;
        private readonly _btnType!                      : TwnsUiButton.UiButton;
        private readonly _btnClose!                     : TwnsUiButton.UiButton;
        private readonly _labelDesc!                    : TwnsUiLabel.UiLabel;
        private readonly _labelError!                   : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!            : TwnsUiImage.UiImage;

        private readonly _btnPlayerIndex!                       : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndex!                     : TwnsUiLabel.UiLabel;
        private readonly _btnConIsPlayerInTurn!                 : TwnsUiButton.UiButton;
        private readonly _labelConIsPlayerInTurn!               : TwnsUiLabel.UiLabel;

        private readonly _btnTeamIndex!                         : TwnsUiButton.UiButton;
        private readonly _labelTeamIndex!                       : TwnsUiLabel.UiLabel;
        private readonly _btnUnitType!                          : TwnsUiButton.UiButton;
        private readonly _labelUnitType!                        : TwnsUiLabel.UiLabel;
        private readonly _btnLocation!                          : TwnsUiButton.UiButton;
        private readonly _labelLocation!                        : TwnsUiLabel.UiLabel;
        private readonly _btnGridIndex!                         : TwnsUiButton.UiButton;
        private readonly _labelGridIndex!                       : TwnsUiLabel.UiLabel;
        private readonly _btnActionState!                       : TwnsUiButton.UiButton;
        private readonly _labelActionState!                     : TwnsUiLabel.UiLabel;
        private readonly _btnHasLoadedCo!                       : TwnsUiButton.UiButton;
        private readonly _labelHasLoadedCo!                     : TwnsUiLabel.UiLabel;
        private readonly _btnConHpComparator!                   : TwnsUiButton.UiButton;
        private readonly _labelConHpComparator!                 : TwnsUiLabel.UiLabel;
        private readonly _labelConHp!                           : TwnsUiLabel.UiLabel;
        private readonly _inputConHp!                           : TwnsUiTextInput.UiTextInput;
        private readonly _btnConFuelPctComparator!              : TwnsUiButton.UiButton;
        private readonly _labelConFuelPctComparator!            : TwnsUiLabel.UiLabel;
        private readonly _labelConFuelPct!                      : TwnsUiLabel.UiLabel;
        private readonly _inputConFuelPct!                      : TwnsUiTextInput.UiTextInput;
        private readonly _btnConPriAmmoPctComparator!           : TwnsUiButton.UiButton;
        private readonly _labelConPriAmmoPctComparator!         : TwnsUiLabel.UiLabel;
        private readonly _labelConPriAmmoPct!                   : TwnsUiLabel.UiLabel;
        private readonly _inputConPriAmmoPct!                   : TwnsUiTextInput.UiTextInput;
        private readonly _btnConPromotionComparator!            : TwnsUiButton.UiButton;
        private readonly _labelConPromotionComparator!          : TwnsUiLabel.UiLabel;
        private readonly _labelConPromotion!                    : TwnsUiLabel.UiLabel;
        private readonly _inputConPromotion!                    : TwnsUiTextInput.UiTextInput;

        private readonly _btnConIsDiving!                       : TwnsUiButton.UiButton;
        private readonly _labelConIsDiving!                     : TwnsUiLabel.UiLabel;

        private readonly _btnDestroyUnit!                       : TwnsUiButton.UiButton;
        private readonly _labelDestroyUnit!                     : TwnsUiLabel.UiLabel;
        private readonly _btnActUnitType!                       : TwnsUiButton.UiButton;
        private readonly _btnClearActUnitType!                  : TwnsUiButton.UiButton;
        private readonly _labelActUnitType!                     : TwnsUiLabel.UiLabel;
        private readonly _btnActPlayerIndex!                    : TwnsUiButton.UiButton;
        private readonly _labelActPlayerIndex!                  : TwnsUiLabel.UiLabel;

        private readonly _btnActActionState!                    : TwnsUiButton.UiButton;
        private readonly _labelActActionState!                  : TwnsUiLabel.UiLabel;
        private readonly _btnActHasLoadedCo!                    : TwnsUiButton.UiButton;
        private readonly _labelActHasLoadedCo!                  : TwnsUiLabel.UiLabel;
        private readonly _btnActIsDiving!                       : TwnsUiButton.UiButton;
        private readonly _labelActIsDiving!                     : TwnsUiLabel.UiLabel;

        private readonly _labelHp!                              : TwnsUiLabel.UiLabel;
        private readonly _labelHpMultiplierPercentage!          : TwnsUiLabel.UiLabel;
        private readonly _inputHpMultiplierPercentage!          : TwnsUiTextInput.UiTextInput;
        private readonly _labelHpDeltaValue!                    : TwnsUiLabel.UiLabel;
        private readonly _inputHpDeltaValue!                    : TwnsUiTextInput.UiTextInput;
        private readonly _labelFuel!                            : TwnsUiLabel.UiLabel;
        private readonly _labelFuelMultiplierPercentage!        : TwnsUiLabel.UiLabel;
        private readonly _inputFuelMultiplierPercentage!        : TwnsUiTextInput.UiTextInput;
        private readonly _labelFuelDeltaValue!                  : TwnsUiLabel.UiLabel;
        private readonly _inputFuelDeltaValue!                  : TwnsUiTextInput.UiTextInput;
        private readonly _labelPriAmmo!                         : TwnsUiLabel.UiLabel;
        private readonly _labelPriAmmoMultiplierPercentage!     : TwnsUiLabel.UiLabel;
        private readonly _inputPriAmmoMultiplierPercentage!     : TwnsUiTextInput.UiTextInput;
        private readonly _labelPriAmmoDeltaValue!               : TwnsUiLabel.UiLabel;
        private readonly _inputPriAmmoDeltaValue!               : TwnsUiTextInput.UiTextInput;
        private readonly _labelPromotion!                       : TwnsUiLabel.UiLabel;
        private readonly _labelPromotionMultiplierPercentage!   : TwnsUiLabel.UiLabel;
        private readonly _inputPromotionMultiplierPercentage!   : TwnsUiTextInput.UiTextInput;
        private readonly _labelPromotionDeltaValue!             : TwnsUiLabel.UiLabel;
        private readonly _inputPromotionDeltaValue!             : TwnsUiTextInput.UiTextInput;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,         callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                           callback: this.close },
                { ui: this._btnType,                            callback: this._onTouchedBtnType },
                { ui: this._imgInnerTouchMask,                  callback: this._onTouchedImgInnerTouchMask },
                { ui: this._btnPlayerIndex,                     callback: this._onTouchedBtnPlayerIndex },
                { ui: this._btnConIsPlayerInTurn,               callback: this._onTouchedBtnConIsPlayerInTurn },
                { ui: this._btnTeamIndex,                       callback: this._onTouchedBtnTeamIndex },
                { ui: this._btnUnitType,                        callback: this._onTouchedBtnUnitType },
                { ui: this._btnLocation,                        callback: this._onTouchedBtnLocation },
                { ui: this._btnGridIndex,                       callback: this._onTouchedBtnGridIndex },
                { ui: this._btnActionState,                     callback: this._onTouchedBtnActionState },
                { ui: this._btnHasLoadedCo,                     callback: this._onTouchedBtnHasLoadedCo },
                { ui: this._btnConIsDiving,                     callback: this._onTouchedBtnConIsDiving },
                { ui: this._btnConHpComparator,                 callback: this._onTouchedBtnConHpComparator },
                { ui: this._inputConHp,                         callback: this._onFocusInInputConHp,                            eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputConHp,                         callback: this._onFocusOutInputConHp,                           eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnConFuelPctComparator,            callback: this._onTouchedBtnConFuelPctComparator },
                { ui: this._inputConFuelPct,                    callback: this._onFocusInInputConFuelPct,                       eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputConFuelPct,                    callback: this._onFocusOutInputConFuelPct,                      eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnConPriAmmoPctComparator,         callback: this._onTouchedBtnConPriAmmoPctComparator },
                { ui: this._inputConPriAmmoPct,                 callback: this._onFocusInInputConPriAmmoPct,                    eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputConPriAmmoPct,                 callback: this._onFocusOutInputConPriAmmoPct,                   eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._btnConPromotionComparator,          callback: this._onTouchedBtnConPromotionComparator },
                { ui: this._inputConPromotion,                  callback: this._onFocusInInputConPromotion,                     eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputConPromotion,                  callback: this._onFocusOutInputConPromotion,                    eventType: egret.FocusEvent.FOCUS_OUT },

                { ui: this._btnDestroyUnit,                     callback: this._onTouchedBtnDestroyUnit },
                { ui: this._btnActUnitType,                     callback: this._onTouchedBtnActUnitType },
                { ui: this._btnClearActUnitType,                callback: this._onTouchedBtnClearActUnitType },
                { ui: this._btnActPlayerIndex,                  callback: this._onTouchedBtnActPlayerIndex },
                { ui: this._btnActActionState,                  callback: this._onTouchedBtnActActionState },
                { ui: this._btnActHasLoadedCo,                  callback: this._onTouchedBtnActHasLoadedCo },
                { ui: this._btnActIsDiving,                     callback: this._onTouchedBtnActIsDiving },

                { ui: this._inputHpDeltaValue,                  callback: this._onFocusInInputHpDeltaValue,                     eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputHpDeltaValue,                  callback: this._onFocusOutInputHpDeltaValue,                    eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputHpMultiplierPercentage,        callback: this._onFocusInInputHpMultiplierPercentage,           eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputHpMultiplierPercentage,        callback: this._onFocusOutInputHpMultiplierPercentage,          eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputFuelDeltaValue,                callback: this._onFocusInInputFuelDeltaValue,                   eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputFuelDeltaValue,                callback: this._onFocusOutInputFuelDeltaValue,                  eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputFuelMultiplierPercentage,      callback: this._onFocusInInputFuelMultiplierPercentage,         eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputFuelMultiplierPercentage,      callback: this._onFocusOutInputFuelMultiplierPercentage,        eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputPriAmmoDeltaValue,             callback: this._onFocusInInputPriAmmoDeltaValue,                eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputPriAmmoDeltaValue,             callback: this._onFocusOutInputPriAmmoDeltaValue,               eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputPriAmmoMultiplierPercentage,   callback: this._onFocusInInputPriAmmoMultiplierPercentage,      eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputPriAmmoMultiplierPercentage,   callback: this._onFocusOutInputPriAmmoMultiplierPercentage,     eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputPromotionDeltaValue,           callback: this._onFocusInInputPromotionDeltaValue,              eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputPromotionDeltaValue,           callback: this._onFocusOutInputPromotionDeltaValue,             eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputPromotionMultiplierPercentage, callback: this._onFocusInInputPromotionMultiplierPercentage,    eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputPromotionMultiplierPercentage, callback: this._onFocusOutInputPromotionMultiplierPercentage,   eventType: egret.FocusEvent.FOCUS_OUT },
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
            PanelHelpers.open(PanelHelpers.PanelDict.WeActionTypeListPanel, {
                fullData    : openData.fullData,
                action      : openData.action,
                war         : openData.war,
            });
        }
        private _onTouchedImgInnerTouchMask(): void {
            this._setInnerTouchMaskEnabled(false);
        }
        private _onTouchedBtnPlayerIndex(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChoosePlayerIndexPanel, {
                currentPlayerIndexArray : action.conPlayerIndexArray ?? [],
                maxPlayerIndex          : this._getOpenData().war.getPlayersCountUnneutral(),
                callbackOnConfirm       : playerIndexArray => {
                    action.conPlayerIndexArray = playerIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnConIsPlayerInTurn(): void {
            const action                    = this._getAction();
            const conIsOwnerPlayerInTurn    = action.conIsOwnerPlayerInTurn;
            if (conIsOwnerPlayerInTurn == null) {
                action.conIsOwnerPlayerInTurn = true;
            } else if (conIsOwnerPlayerInTurn) {
                action.conIsOwnerPlayerInTurn = false;
            } else {
                action.conIsOwnerPlayerInTurn = null;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnTeamIndex(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseTeamIndexPanel, {
                currentTeamIndexArray   : action.conTeamIndexArray ?? [],
                maxTeamIndex            : this._getOpenData().war.getPlayersCountUnneutral(),
                callbackOnConfirm       : teamIndexArray => {
                    action.conTeamIndexArray = teamIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnUnitType(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseUnitTypePanel, {
                gameConfig              : this._getOpenData().war.getGameConfig(),
                currentUnitTypeArray    : action.conUnitTypeArray ?? [],
                callbackOnConfirm       : unitTypeArray => {
                    action.conUnitTypeArray = unitTypeArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnLocation(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseLocationPanel, {
                currentLocationIdArray  : action.conLocationIdArray ?? [],
                callbackOnConfirm       : locationIdArray => {
                    action.conLocationIdArray = locationIdArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnGridIndex(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseGridIndexPanel, {
                currentGridIndexArray   : Helpers.getNonNullElements(action.conGridIndexArray?.map(v => GridIndexHelpers.convertGridIndex(v)) ?? []),
                mapSize                 : this._getOpenData().war.getTileMap().getMapSize(),
                callbackOnConfirm       : gridIndexArray => {
                    action.conGridIndexArray = gridIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnActionState(): void {
            const condition = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseUnitActionStatePanel, {
                currentActionStateArray : condition.conActionStateArray ?? [],
                callbackOnConfirm       : actionStateArray => {
                    condition.conActionStateArray = actionStateArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnHasLoadedCo(): void {
            const condition     = this._getAction();
            const hasLoadedCo   = condition.conHasLoadedCo;
            if (hasLoadedCo) {
                condition.conHasLoadedCo = false;
            } else if (hasLoadedCo == false) {
                condition.conHasLoadedCo = null;
            } else {
                condition.conHasLoadedCo = true;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnConIsDiving(): void {
            const action        = this._getAction();
            const conIsDiving   = action.conIsDiving;
            if (conIsDiving == null) {
                action.conIsDiving = true;
            } else if (conIsDiving) {
                action.conIsDiving = false;
            } else {
                action.conIsDiving = null;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnConHpComparator(): void {
            const condition             = this._getAction();
            condition.conHpComparator   = Helpers.getNextValueComparator(condition.conHpComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputConHp(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputConHp(): void {
            const text  = this._inputConHp.text;
            const value = text ? parseInt(text) : null;
            if ((value == null) || (!isNaN(value))) {
                this._getAction().conHp = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputConHp();
            }
        }
        private _onTouchedBtnConFuelPctComparator(): void {
            const condition                 = this._getAction();
            condition.conFuelPctComparator  = Helpers.getNextValueComparator(condition.conFuelPctComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputConFuelPct(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputConFuelPct(): void {
            const text  = this._inputConFuelPct.text;
            const value = text ? parseInt(text) : null;
            if ((value == null) || (!isNaN(value))) {
                this._getAction().conFuelPct = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputConFuelPct();
            }
        }
        private _onTouchedBtnConPriAmmoPctComparator(): void {
            const condition                     = this._getAction();
            condition.conPriAmmoPctComparator   = Helpers.getNextValueComparator(condition.conPriAmmoPctComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputConPriAmmoPct(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputConPriAmmoPct(): void {
            const text  = this._inputConPriAmmoPct.text;
            const value = text ? parseInt(text) : null;
            if ((value == null) || (!isNaN(value))) {
                this._getAction().conPriAmmoPct = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputConPriAmmoPct();
            }
        }
        private _onTouchedBtnConPromotionComparator(): void {
            const condition                     = this._getAction();
            condition.conPromotionComparator    = Helpers.getNextValueComparator(condition.conPromotionComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputConPromotion(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputConPromotion(): void {
            const text  = this._inputConPromotion.text;
            const value = text ? parseInt(text) : null;
            if ((value == null) || (!isNaN(value))) {
                this._getAction().conPromotion = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else {
                this._updateInputConPromotion();
            }
        }

        private _onTouchedBtnDestroyUnit(): void {
            const action          = this._getAction();
            action.actDestroyUnit = !action.actDestroyUnit;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnActUnitType(): void {
            const gameConfig    = this._getOpenData().war.getGameConfig();
            const action        = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseSingleUnitTypePanel, {
                gameConfig,
                currentUnitType : action.actUnitType ?? null,
                unitTypeArray   : gameConfig.getAllUnitTypeArray(),
                playerIndex     : action.actPlayerIndex || CommonConstants.PlayerIndex.First,
                callback        : unitType => {
                    if (action.actUnitType !== unitType) {
                        action.actUnitType = unitType;
                        Notify.dispatch(NotifyType.WarEventFullDataChanged);
                    }
                },
            });
        }
        private _onTouchedBtnClearActUnitType(): void {
            const action = this._getAction();
            if (action.actUnitType != null) {
                action.actUnitType = null;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }
        private _onTouchedBtnActPlayerIndex(): void {
            const action            = this._getAction();
            const actPlayerIndex    = action.actPlayerIndex;
            if (actPlayerIndex == null) {
                action.actPlayerIndex = CommonConstants.PlayerIndex.First;
            } else {
                const nextPlayerIndex = actPlayerIndex + 1;
                action.actPlayerIndex = nextPlayerIndex > this._getOpenData().war.getPlayersCountUnneutral()
                    ? null
                    : nextPlayerIndex;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnActActionState(): void {
            const action        = this._getAction();
            const actionState   = action.actActionState;
            if (actionState == Types.UnitActionState.Idle) {
                action.actActionState = Types.UnitActionState.Acted;
            } else if (actionState === Types.UnitActionState.Acted) {
                action.actActionState = null;
            } else {
                action.actActionState = Types.UnitActionState.Idle;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnActHasLoadedCo(): void {
            const action        = this._getAction();
            const hasLoadedCo   = action.actHasLoadedCo;
            if (hasLoadedCo === true) {
                action.actHasLoadedCo = false;
            } else if (hasLoadedCo === false) {
                action.actHasLoadedCo = null;
            } else {
                action.actHasLoadedCo = true;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onTouchedBtnActIsDiving(): void {
            const action    = this._getAction();
            const isDiving  = action.actIsDiving;
            if (isDiving === true) {
                action.actIsDiving = false;
            } else if (isDiving === false) {
                action.actIsDiving = null;
            } else {
                action.actIsDiving = true;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputHpDeltaValue(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputHpDeltaValue(): void {
            const action    = this._getAction();
            const text      = this._inputHpDeltaValue.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actHpDeltaValue = null;
            } else {
                const maxValue          = CommonConstants.WarEventActionSetCustomCounterMaxDeltaValue;
                action.actHpDeltaValue  = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputHpMultiplierPercentage(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputHpMultiplierPercentage(): void {
            const action    = this._getAction();
            const text      = this._inputHpMultiplierPercentage.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actHpMultiplierPercentage = null;
            } else {
                const maxValue                      = CommonConstants.WarEventActionSetCustomCounterMaxMultiplierPercentage;
                action.actHpMultiplierPercentage    = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputFuelDeltaValue(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputFuelDeltaValue(): void {
            const action    = this._getAction();
            const text      = this._inputFuelDeltaValue.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actFuelDeltaValue = null;
            } else {
                const maxValue              = CommonConstants.WarEventActionSetCustomCounterMaxDeltaValue;
                action.actFuelDeltaValue    = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputFuelMultiplierPercentage(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputFuelMultiplierPercentage(): void {
            const action    = this._getAction();
            const text      = this._inputFuelMultiplierPercentage.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actFuelMultiplierPercentage = null;
            } else {
                const maxValue                      = CommonConstants.WarEventActionSetCustomCounterMaxMultiplierPercentage;
                action.actFuelMultiplierPercentage  = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputPriAmmoDeltaValue(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputPriAmmoDeltaValue(): void {
            const action    = this._getAction();
            const text      = this._inputPriAmmoDeltaValue.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actPriAmmoDeltaValue = null;
            } else {
                const maxValue              = CommonConstants.WarEventActionSetCustomCounterMaxDeltaValue;
                action.actPriAmmoDeltaValue = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputPriAmmoMultiplierPercentage(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputPriAmmoMultiplierPercentage(): void {
            const action    = this._getAction();
            const text      = this._inputPriAmmoMultiplierPercentage.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actPriAmmoMultiplierPercentage = null;
            } else {
                const maxValue                          = CommonConstants.WarEventActionSetCustomCounterMaxMultiplierPercentage;
                action.actPriAmmoMultiplierPercentage   = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputPromotionDeltaValue(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputPromotionDeltaValue(): void {
            const action    = this._getAction();
            const text      = this._inputPromotionDeltaValue.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actPromotionDeltaValue = null;
            } else {
                const maxValue                  = CommonConstants.WarEventActionSetCustomCounterMaxDeltaValue;
                action.actPromotionDeltaValue   = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputPromotionMultiplierPercentage(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputPromotionMultiplierPercentage(): void {
            const action    = this._getAction();
            const text      = this._inputPromotionMultiplierPercentage.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actPromotionMultiplierPercentage = null;
            } else {
                const maxValue                          = CommonConstants.WarEventActionSetCustomCounterMaxMultiplierPercentage;
                action.actPromotionMultiplierPercentage = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelPlayerIndex();
            this._updateLabelConIsPlayerInTurn();
            this._updateLabelTeamIndex();
            this._updateLabelUnitType();
            this._updateLabelLocation();
            this._updateLabelGridIndex();
            this._updateLabelActionState();
            this._updateLabelHasLoadedCo();
            this._updateLabelConIsDiving();
            this._updateLabelConHpComparator();
            this._updateInputConHp();
            this._updateLabelConFuelPctComparator();
            this._updateInputConFuelPct();
            this._updateLabelConPriAmmoPctComparator();
            this._updateInputConPriAmmoPct();
            this._updateLabelConPromotionComparator();
            this._updateInputConPromotion();

            this._updateLabelDestroyUnit();
            this._updateLabelActActionState();
            this._updateLabelActUnitType();
            this._updateLabelActPlayerIndex();
            this._updateLabelActHasLoadedCo();
            this._updateLabelActIsDiving();
            this._updateInputHpDeltaValue();
            this._updateInputHpMultiplierPercentage();
            this._updateInputFuelDeltaValue();
            this._updateInputFuelMultiplierPercentage();
            this._updateInputPriAmmoDeltaValue();
            this._updateInputPriAmmoMultiplierPercentage();
            this._updateInputPromotionDeltaValue();
            this._updateInputPromotionMultiplierPercentage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                           = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnClose.label                            = Lang.getText(LangTextType.B0146);
            this._btnType.label                             = Lang.getText(LangTextType.B0516);
            this._btnPlayerIndex.label                      = Lang.getText(LangTextType.B0031);
            this._btnConIsPlayerInTurn.label                = Lang.getText(LangTextType.B0086);
            this._btnTeamIndex.label                        = Lang.getText(LangTextType.B0377);
            this._btnUnitType.label                         = Lang.getText(LangTextType.B0525);
            this._btnLocation.label                         = Lang.getText(LangTextType.B0764);
            this._btnGridIndex.label                        = Lang.getText(LangTextType.B0531);
            this._btnActionState.label                      = Lang.getText(LangTextType.B0526);
            this._btnHasLoadedCo.label                      = Lang.getText(LangTextType.B0421);
            this._btnConIsDiving.label                      = Lang.getText(LangTextType.B0371);
            this._btnConHpComparator.label                  = Lang.getText(LangTextType.B0774);
            this._labelConHp.text                           = Lang.getText(LangTextType.B0807);
            this._btnConFuelPctComparator.label             = Lang.getText(LangTextType.B0774);
            this._labelConFuelPct.text                      = `${Lang.getText(LangTextType.B0342)}%`;
            this._btnConPriAmmoPctComparator.label          = Lang.getText(LangTextType.B0774);
            this._labelConPriAmmoPct.text                   = `${Lang.getText(LangTextType.B0350)}%`;
            this._btnConPromotionComparator.label           = Lang.getText(LangTextType.B0774);
            this._labelConPromotion.text                    = Lang.getText(LangTextType.B0370);

            this._btnDestroyUnit.label                      = Lang.getText(LangTextType.B0808);
            this._btnActActionState.label                   = Lang.getText(LangTextType.B0526);
            this._btnActHasLoadedCo.label                   = Lang.getText(LangTextType.B0421);
            this._btnActUnitType.label                      = Lang.getText(LangTextType.B0525);
            this._btnActPlayerIndex.label                   = Lang.getText(LangTextType.B0521);
            this._btnActIsDiving.label                      = Lang.getText(LangTextType.B0371);
            this._labelHp.text                              = Lang.getText(LangTextType.B0807);
            this._labelHpDeltaValue.text                    = Lang.getText(LangTextType.B0754);
            this._labelHpMultiplierPercentage.text          = `${Lang.getText(LangTextType.B0755)}%`;
            this._labelFuel.text                            = Lang.getText(LangTextType.B0342);
            this._labelFuelDeltaValue.text                  = Lang.getText(LangTextType.B0754);
            this._labelFuelMultiplierPercentage.text        = `${Lang.getText(LangTextType.B0755)}%`;
            this._labelPriAmmo.text                         = Lang.getText(LangTextType.B0350);
            this._labelPriAmmoDeltaValue.text               = Lang.getText(LangTextType.B0754);
            this._labelPriAmmoMultiplierPercentage.text     = `${Lang.getText(LangTextType.B0755)}%`;
            this._labelPromotion.text                       = Lang.getText(LangTextType.B0370);
            this._labelPromotionDeltaValue.text             = Lang.getText(LangTextType.B0754);
            this._labelPromotionMultiplierPercentage.text   = `${Lang.getText(LangTextType.B0755)}%`;
            // this._labelGridIndex.text   = Lang.getText(LangTextType.B0531);

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
            this._labelPlayerIndex.text = playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelConIsPlayerInTurn(): void {
            const conIsOwnerPlayerInTurn    = this._getAction().conIsOwnerPlayerInTurn;
            const label                     = this._labelConIsPlayerInTurn;
            if (conIsOwnerPlayerInTurn == null) {
                label.text = `--`;
            } else {
                label.text = Lang.getText(conIsOwnerPlayerInTurn ? LangTextType.B0012 : LangTextType.B0013);
            }
        }
        private _updateLabelTeamIndex(): void {
            const teamIndexArray        = this._getAction().conTeamIndexArray;
            this._labelTeamIndex.text   = teamIndexArray?.length ? teamIndexArray.map(v => Lang.getPlayerTeamName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelUnitType(): void {
            const unitTypeArray         = this._getAction().conUnitTypeArray;
            const gameConfig            = this._getOpenData().war.getGameConfig();
            this._labelUnitType.text    = unitTypeArray?.length ? unitTypeArray.map(v => Lang.getUnitName(v, gameConfig)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelLocation(): void {
            const locationIdArray       = this._getAction().conLocationIdArray;
            this._labelLocation.text    = locationIdArray?.length ? locationIdArray.join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelGridIndex(): void {
            const gridIndexArray        = this._getAction().conGridIndexArray;
            this._labelGridIndex.text   = gridIndexArray?.length ? gridIndexArray.map(v => `(${v.x},${v.y})`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelActionState(): void {
            const actionStateArray      = this._getAction().conActionStateArray;
            this._labelActionState.text = actionStateArray?.length ? actionStateArray.map(v => Lang.getUnitActionStateText(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelHasLoadedCo(): void {
            const hasLoadedCo           = this._getAction().conHasLoadedCo;
            this._labelHasLoadedCo.text = hasLoadedCo != null ? (Lang.getText(hasLoadedCo ? LangTextType.B0012 : LangTextType.B0013)) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelConIsDiving(): void {
            const conIsDiving   = this._getAction().conIsDiving;
            const label         = this._labelConIsDiving;
            if (conIsDiving == null) {
                label.text = `--`;
            } else {
                label.text = Lang.getText(conIsDiving ? LangTextType.B0012 : LangTextType.B0013);
            }
        }
        private _updateLabelConHpComparator(): void {
            const comparator                = this._getAction().conHpComparator;
            this._labelConHpComparator.text = comparator == null ? CommonConstants.ErrorTextForUndefined : Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputConHp(): void {
            this._inputConHp.text = `${this._getAction().conHp ?? ``}`;
        }
        private _updateLabelConFuelPctComparator(): void {
            const comparator                        = this._getAction().conFuelPctComparator;
            this._labelConFuelPctComparator.text    = comparator == null ? CommonConstants.ErrorTextForUndefined : Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputConFuelPct(): void {
            this._inputConFuelPct.text = `${this._getAction().conFuelPct ?? ``}`;
        }
        private _updateLabelConPriAmmoPctComparator(): void {
            const comparator                        = this._getAction().conPriAmmoPctComparator;
            this._labelConPriAmmoPctComparator.text = comparator == null ? CommonConstants.ErrorTextForUndefined : Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputConPriAmmoPct(): void {
            this._inputConPriAmmoPct.text = `${this._getAction().conPriAmmoPct ?? ``}`;
        }
        private _updateLabelConPromotionComparator(): void {
            const comparator                        = this._getAction().conPromotionComparator;
            this._labelConPromotionComparator.text  = comparator == null ? CommonConstants.ErrorTextForUndefined : Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputConPromotion(): void {
            this._inputConPromotion.text = `${this._getAction().conPromotion ?? ``}`;
        }

        private _updateLabelDestroyUnit(): void {
            this._labelDestroyUnit.text = Lang.getText(this._getAction().actDestroyUnit ? LangTextType.B0012 : LangTextType.B0013);
        }
        private _updateLabelActActionState(): void {
            const actionState               = this._getAction().actActionState;
            this._labelActActionState.text  = actionState == null
                ? `--`
                : (Lang.getUnitActionStateText(actionState) ?? CommonConstants.ErrorTextForUndefined);
        }
        private _updateLabelActUnitType(): void {
            const actUnitType           = this._getAction().actUnitType;
            this._labelActUnitType.text = actUnitType == null
                ? `--`
                : (Lang.getUnitName(actUnitType, this._getOpenData().war.getGameConfig()) ?? CommonConstants.ErrorTextForUndefined);
        }
        private _updateLabelActPlayerIndex(): void {
            const actPlayerIndex            = this._getAction().actPlayerIndex;
            this._labelActPlayerIndex.text  = actPlayerIndex == null
                ? `--`
                : `P${actPlayerIndex}`;
        }
        private _updateLabelActHasLoadedCo(): void {
            const hasLoadedCo               = this._getAction().actHasLoadedCo;
            this._labelActHasLoadedCo.text  = hasLoadedCo == null
                ? `--`
                : Lang.getText(hasLoadedCo ? LangTextType.B0012 : LangTextType.B0013);
        }
        private _updateLabelActIsDiving(): void {
            const actIsDiving           = this._getAction().actIsDiving;
            this._labelActIsDiving.text = actIsDiving == null
                ? `--`
                : Lang.getText(actIsDiving ? LangTextType.B0012 : LangTextType.B0013);
        }
        private _updateInputHpDeltaValue(): void {
            const value                     = this._getAction().actHpDeltaValue;
            this._inputHpDeltaValue.text    = `${value == null ? `` : value}`;
        }
        private _updateInputHpMultiplierPercentage(): void {
            const value                             = this._getAction().actHpMultiplierPercentage;
            this._inputHpMultiplierPercentage.text  = `${value == null ? `` : value}`;
        }
        private _updateInputFuelDeltaValue(): void {
            const value                     = this._getAction().actFuelDeltaValue;
            this._inputFuelDeltaValue.text  = `${value == null ? `` : value}`;
        }
        private _updateInputFuelMultiplierPercentage(): void {
            const value                                 = this._getAction().actFuelMultiplierPercentage;
            this._inputFuelMultiplierPercentage.text    = `${value == null ? `` : value}`;
        }
        private _updateInputPriAmmoDeltaValue(): void {
            const value                         = this._getAction().actPriAmmoDeltaValue;
            this._inputPriAmmoDeltaValue.text   = `${value == null ? `` : value}`;
        }
        private _updateInputPriAmmoMultiplierPercentage(): void {
            const value                                 = this._getAction().actPriAmmoMultiplierPercentage;
            this._inputPriAmmoMultiplierPercentage.text = `${value == null ? `` : value}`;
        }
        private _updateInputPromotionDeltaValue(): void {
            const value                         = this._getAction().actPromotionDeltaValue;
            this._inputPromotionDeltaValue.text = `${value == null ? `` : value}`;
        }
        private _updateInputPromotionMultiplierPercentage(): void {
            const value                                     = this._getAction().actPromotionMultiplierPercentage;
            this._inputPromotionMultiplierPercentage.text   = `${value == null ? `` : value}`;
        }

        private _getAction(): CommonProto.WarEvent.IWeaSetUnitState {
            return Helpers.getExisted(this._getOpenData().action.WeaSetUnitState);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}
