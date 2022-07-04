
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

    export type OpenDataForWeActionModifyPanel41 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel41 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel41> {
        private readonly _labelTitle!                               : TwnsUiLabel.UiLabel;
        private readonly _btnType!                                  : TwnsUiButton.UiButton;
        private readonly _btnClose!                                 : TwnsUiButton.UiButton;
        private readonly _labelDesc!                                : TwnsUiLabel.UiLabel;
        private readonly _labelError!                               : TwnsUiLabel.UiLabel;
        private readonly _btnLocation!                              : TwnsUiButton.UiButton;
        private readonly _labelLocation!                            : TwnsUiLabel.UiLabel;
        private readonly _btnGridIndex!                             : TwnsUiButton.UiButton;
        private readonly _labelGridIndex!                           : TwnsUiLabel.UiLabel;
        private readonly _btnConIsHighlighted!                      : TwnsUiButton.UiButton;
        private readonly _labelConIsHighlighted!                    : TwnsUiLabel.UiLabel;

        private readonly _labelConHp!                               : TwnsUiLabel.UiLabel;
        private readonly _inputConHp!                               : TwnsUiTextInput.UiTextInput;
        private readonly _labelConHpComparator!                     : TwnsUiLabel.UiLabel;
        private readonly _btnConHpComparator!                       : TwnsUiButton.UiButton;

        private readonly _labelConBuildPoint!                       : TwnsUiLabel.UiLabel;
        private readonly _inputConBuildPoint!                       : TwnsUiTextInput.UiTextInput;
        private readonly _labelConBuildPointComparator!             : TwnsUiLabel.UiLabel;
        private readonly _btnConBuildPointComparator!               : TwnsUiButton.UiButton;

        private readonly _labelConCapturePoint!                     : TwnsUiLabel.UiLabel;
        private readonly _inputConCapturePoint!                     : TwnsUiTextInput.UiTextInput;
        private readonly _labelConCapturePointComparator!           : TwnsUiLabel.UiLabel;
        private readonly _btnConCapturePointComparator!             : TwnsUiButton.UiButton;

        private readonly _labelActHp!                               : TwnsUiLabel.UiLabel;
        private readonly _labelActHpMultiplierPercentage!           : TwnsUiLabel.UiLabel;
        private readonly _inputActHpMultiplierPercentage!           : TwnsUiTextInput.UiTextInput;
        private readonly _labelActHpDeltaValue!                     : TwnsUiLabel.UiLabel;
        private readonly _inputActHpDeltaValue!                     : TwnsUiTextInput.UiTextInput;

        private readonly _labelActCapturePoint!                     : TwnsUiLabel.UiLabel;
        private readonly _labelActCapturePointMultiplierPercentage! : TwnsUiLabel.UiLabel;
        private readonly _inputActCapturePointMultiplierPercentage! : TwnsUiTextInput.UiTextInput;
        private readonly _labelActCapturePointDeltaValue!           : TwnsUiLabel.UiLabel;
        private readonly _inputActCapturePointDeltaValue!           : TwnsUiTextInput.UiTextInput;

        private readonly _labelActBuildPoint!                       : TwnsUiLabel.UiLabel;
        private readonly _labelActBuildPointMultiplierPercentage!   : TwnsUiLabel.UiLabel;
        private readonly _inputActBuildPointMultiplierPercentage!   : TwnsUiTextInput.UiTextInput;
        private readonly _labelActBuildPointDeltaValue!             : TwnsUiLabel.UiLabel;
        private readonly _inputActBuildPointDeltaValue!             : TwnsUiTextInput.UiTextInput;

        private readonly _btnActIsHighlighted!                      : TwnsUiButton.UiButton;
        private readonly _labelActIsHighlighted!                    : TwnsUiLabel.UiLabel;
        private readonly _btnAddLocationIdArray!                    : TwnsUiButton.UiButton;
        private readonly _labelAddLocationIdArray!                  : TwnsUiLabel.UiLabel;
        private readonly _btnDeleteLocationIdArray!                 : TwnsUiButton.UiButton;
        private readonly _labelDeleteLocationIdArray!               : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!                        : TwnsUiImage.UiImage;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                                   callback: this.close },
                { ui: this._btnType,                                    callback: this._onTouchedBtnType },
                { ui: this._imgInnerTouchMask,                          callback: this._onTouchedImgInnerTouchMask },
                { ui: this._btnLocation,                                callback: this._onTouchedBtnLocation },
                { ui: this._btnGridIndex,                               callback: this._onTouchedBtnGridIndex },
                { ui: this._btnConIsHighlighted,                        callback: this._onTouchedBtnConIsHighlighted },

                { ui: this._btnConHpComparator,                         callback: this._onTouchedBtnConHpComparator },
                { ui: this._inputConHp,                                 callback: this._onFocusInInputConHp,                                    eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputConHp,                                 callback: this._onFocusOutInputConHp,                                   eventType: egret.FocusEvent.FOCUS_OUT },

                { ui: this._btnConBuildPointComparator,                 callback: this._onTouchedBtnConBuildPointComparator },
                { ui: this._inputConBuildPoint,                         callback: this._onFocusInInputConBuildPoint,                            eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputConBuildPoint,                         callback: this._onFocusOutInputConBuildPoint,                           eventType: egret.FocusEvent.FOCUS_OUT },

                { ui: this._btnConCapturePointComparator,               callback: this._onTouchedBtnConCapturePointComparator },
                { ui: this._inputConCapturePoint,                       callback: this._onFocusInInputConCapturePoint,                            eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputConCapturePoint,                       callback: this._onFocusOutInputConCapturePoint,                           eventType: egret.FocusEvent.FOCUS_OUT },

                { ui: this._inputActHpDeltaValue,                       callback: this._onFocusInInputActHpDeltaValue,                          eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActHpDeltaValue,                       callback: this._onFocusOutInputActHpDeltaValue,                         eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputActHpMultiplierPercentage,             callback: this._onFocusInInputActHpMultiplierPercentage,                eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActHpMultiplierPercentage,             callback: this._onFocusOutInputActHpMultiplierPercentage,               eventType: egret.FocusEvent.FOCUS_OUT },

                { ui: this._inputActCapturePointDeltaValue,             callback: this._onFocusInInputActCapturePointDeltaValue,                eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActCapturePointDeltaValue,             callback: this._onFocusOutInputActCapturePointDeltaValue,               eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputActCapturePointMultiplierPercentage,   callback: this._onFocusInInputActCapturePointMultiplierPercentage,      eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActCapturePointMultiplierPercentage,   callback: this._onFocusOutInputActCapturePointMultiplierPercentage,     eventType: egret.FocusEvent.FOCUS_OUT },

                { ui: this._inputActBuildPointDeltaValue,               callback: this._onFocusInInputActBuildPointDeltaValue,                  eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActBuildPointDeltaValue,               callback: this._onFocusOutInputActBuildPointDeltaValue,                 eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputActBuildPointMultiplierPercentage,     callback: this._onFocusInInputActBuildPointMultiplierPercentage,        eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputActBuildPointMultiplierPercentage,     callback: this._onFocusOutInputActBuildPointMultiplierPercentage,       eventType: egret.FocusEvent.FOCUS_OUT },

                { ui: this._btnActIsHighlighted,                        callback: this._onTouchedBtnActIsHighlighted },
                { ui: this._btnAddLocationIdArray,                      callback: this._onTouchedBtnAddLocationIdArray },
                { ui: this._btnDeleteLocationIdArray,                   callback: this._onTouchedBtnDeleteLocationIdArray },
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
        private _onTouchedBtnConIsHighlighted(): void {
            const action            = this._getAction();
            const conIsHighlighted  = action.conIsHighlighted;
            if (conIsHighlighted === true) {
                action.conIsHighlighted = false;
            } else if (conIsHighlighted === false) {
                action.conIsHighlighted = null;
            } else {
                action.conIsHighlighted = true;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnConHpComparator(): void {
            const con       = (this._getAction().conHp ??= {});
            con.comparator  = Helpers.getNextValueComparator(con.comparator);
            con.value       ??= 0;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputConHp(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputConHp(): void {
            const action    = this._getAction();
            const text      = this._inputConHp.text;
            const value     = text ? parseInt(text) : null;
            if (value == null) {
                action.conHp = null;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else if (isNaN(value)) {
                this._updateInputConHp();
            } else {
                const con       = (action.conHp ??= {});
                con.value       = value;
                con.comparator  ??= Types.ValueComparator.EqualTo;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnConBuildPointComparator(): void {
            const con       = (this._getAction().conBuildPoint ??= {});
            con.comparator  = Helpers.getNextValueComparator(con.comparator);
            con.value       ??= 0;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputConBuildPoint(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputConBuildPoint(): void {
            const action    = this._getAction();
            const text      = this._inputConBuildPoint.text;
            const value     = text ? parseInt(text) : null;
            if (value == null) {
                action.conBuildPoint = null;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else if (isNaN(value)) {
                this._updateInputConBuildPoint();
            } else {
                const con       = (action.conBuildPoint ??= {});
                con.value       = value;
                con.comparator  ??= Types.ValueComparator.EqualTo;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onTouchedBtnConCapturePointComparator(): void {
            const con       = (this._getAction().conCapturePoint ??= {});
            con.comparator  = Helpers.getNextValueComparator(con.comparator);
            con.value       ??= 0;
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusInInputConCapturePoint(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputConCapturePoint(): void {
            const action    = this._getAction();
            const text      = this._inputConCapturePoint.text;
            const value     = text ? parseInt(text) : null;
            if (value == null) {
                action.conCapturePoint = null;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            } else if (isNaN(value)) {
                this._updateInputConCapturePoint();
            } else {
                const con       = (action.conCapturePoint ??= {});
                con.value       = value;
                con.comparator  ??= Types.ValueComparator.EqualTo;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _onFocusInInputActHpDeltaValue(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActHpDeltaValue(): void {
            const action    = this._getAction();
            const text      = this._inputActHpDeltaValue.text;
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

        private _onFocusInInputActHpMultiplierPercentage(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActHpMultiplierPercentage(): void {
            const action    = this._getAction();
            const text      = this._inputActHpMultiplierPercentage.text;
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

        private _onFocusInInputActCapturePointDeltaValue(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActCapturePointDeltaValue(): void {
            const action    = this._getAction();
            const text      = this._inputActCapturePointDeltaValue.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actCapturePointDeltaValue = null;
            } else {
                const maxValue                      = CommonConstants.WarEventActionSetCustomCounterMaxDeltaValue;
                action.actCapturePointDeltaValue    = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputActCapturePointMultiplierPercentage(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActCapturePointMultiplierPercentage(): void {
            const action    = this._getAction();
            const text      = this._inputActCapturePointMultiplierPercentage.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actCapturePointMultiplierPercentage = null;
            } else {
                const maxValue                                  = CommonConstants.WarEventActionSetCustomCounterMaxMultiplierPercentage;
                action.actCapturePointMultiplierPercentage      = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputActBuildPointDeltaValue(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActBuildPointDeltaValue(): void {
            const action    = this._getAction();
            const text      = this._inputActBuildPointDeltaValue.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actBuildPointDeltaValue = null;
            } else {
                const maxValue                  = CommonConstants.WarEventActionSetCustomCounterMaxDeltaValue;
                action.actBuildPointDeltaValue  = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onFocusInInputActBuildPointMultiplierPercentage(): void {
            this._setInnerTouchMaskEnabled(true);
        }
        private _onFocusOutInputActBuildPointMultiplierPercentage(): void {
            const action    = this._getAction();
            const text      = this._inputActBuildPointMultiplierPercentage.text;
            const rawValue  = text ? parseInt(text) : null;
            if ((rawValue == null) || (isNaN(rawValue))) {
                action.actBuildPointMultiplierPercentage = null;
            } else {
                const maxValue                              = CommonConstants.WarEventActionSetCustomCounterMaxMultiplierPercentage;
                action.actBuildPointMultiplierPercentage    = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnActIsHighlighted(): void {
            const action            = this._getAction();
            const actIsHighlighted  = action.actIsHighlighted;
            if (actIsHighlighted === true) {
                action.actIsHighlighted = false;
            } else if (actIsHighlighted === false) {
                action.actIsHighlighted = null;
            } else {
                action.actIsHighlighted = true;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnAddLocationIdArray(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseLocationPanel, {
                currentLocationIdArray  : action.actAddLocationIdArray ?? [],
                callbackOnConfirm       : locationIdArray => {
                    action.actAddLocationIdArray = locationIdArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnDeleteLocationIdArray(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseLocationPanel, {
                currentLocationIdArray  : action.actDeleteLocationIdArray ?? [],
                callbackOnConfirm       : locationIdArray => {
                    action.actDeleteLocationIdArray = locationIdArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelLocation();
            this._updateLabelGridIndex();
            this._updateLabelConIsHighlighted();

            this._updateLabelConHpComparator();
            this._updateInputConHp();

            this._updateLabelConBuildPointComparator();
            this._updateInputConBuildPoint();

            this._updateLabelConCapturePointComparator();
            this._updateInputConCapturePoint();

            this._updateInputActHpDeltaValue();
            this._updateInputActHpMultiplierPercentage();
            this._updateInputActCapturePointDeltaValue();
            this._updateInputActCapturePointMultiplierPercentage();
            this._updateInputActBuildPointDeltaValue();
            this._updateInputActBuildPointMultiplierPercentage();
            this._updateLabelActAddLocationIdArray();
            this._updateLabelActDeleteLocationArray();
            this._updateLabelActIsHighlighted();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                               = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnClose.label                                = Lang.getText(LangTextType.B0146);
            this._btnType.label                                 = Lang.getText(LangTextType.B0516);
            this._btnLocation.label                             = Lang.getText(LangTextType.B0764);
            this._btnGridIndex.label                            = Lang.getText(LangTextType.B0531);
            this._btnConIsHighlighted.label                     = Lang.getText(LangTextType.B0847);
            this._labelConHp.text                               = Lang.getText(LangTextType.B0807);
            this._btnConHpComparator.label                      = Lang.getText(LangTextType.B0774);
            this._labelConBuildPoint.text                       = Lang.getText(LangTextType.B0362);
            this._btnConBuildPointComparator.label              = Lang.getText(LangTextType.B0774);
            this._labelConCapturePoint.text                     = Lang.getText(LangTextType.B0361);
            this._btnConCapturePointComparator.label            = Lang.getText(LangTextType.B0774);

            this._labelActHp.text                               = Lang.getText(LangTextType.B0807);
            this._labelActHpDeltaValue.text                     = Lang.getText(LangTextType.B0754);
            this._labelActHpMultiplierPercentage.text           = `${Lang.getText(LangTextType.B0755)}%`;
            this._labelActCapturePoint.text                     = Lang.getText(LangTextType.B0361);
            this._labelActCapturePointDeltaValue.text           = Lang.getText(LangTextType.B0754);
            this._labelActCapturePointMultiplierPercentage.text = `${Lang.getText(LangTextType.B0755)}%`;
            this._labelActBuildPoint.text                       = Lang.getText(LangTextType.B0362);
            this._labelActBuildPointDeltaValue.text             = Lang.getText(LangTextType.B0754);
            this._labelActBuildPointMultiplierPercentage.text   = `${Lang.getText(LangTextType.B0755)}%`;
            this._btnAddLocationIdArray.label                   = Lang.getText(LangTextType.B0759);
            this._btnDeleteLocationIdArray.label                = Lang.getText(LangTextType.B0760);
            this._btnActIsHighlighted.label                     = Lang.getText(LangTextType.B0847);

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
        private _updateLabelLocation(): void {
            const locationIdArray       = this._getAction().conLocationIdArray;
            this._labelLocation.text    = locationIdArray?.length ? locationIdArray.join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelGridIndex(): void {
            const gridIndexArray        = this._getAction().conGridIndexArray;
            this._labelGridIndex.text   = gridIndexArray?.length ? gridIndexArray.map(v => `(${v.x},${v.y})`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelConIsHighlighted(): void {
            const isHighlighted = this._getAction().conIsHighlighted;
            const label         = this._labelConIsHighlighted;
            if (isHighlighted == null) {
                label.text  = `--`;
            } else {
                label.text = Lang.getText(isHighlighted ? LangTextType.B0012 : LangTextType.B0013);
            }
        }

        private _updateLabelConHpComparator(): void {
            const comparator                = this._getAction().conHp?.comparator;
            this._labelConHpComparator.text = comparator == null ? `--` : (Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined);
        }
        private _updateInputConHp(): void {
            this._inputConHp.text = `${this._getAction().conHp?.value ?? ``}`;
        }

        private _updateLabelConBuildPointComparator(): void {
            const comparator                        = this._getAction().conBuildPoint?.comparator;
            this._labelConBuildPointComparator.text = comparator == null ? `--` : (Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined);
        }
        private _updateInputConBuildPoint(): void {
            this._inputConBuildPoint.text = `${this._getAction().conBuildPoint?.value ?? ``}`;
        }

        private _updateLabelConCapturePointComparator(): void {
            const comparator                            = this._getAction().conCapturePoint?.comparator;
            this._labelConCapturePointComparator.text   = comparator == null ? `--` : (Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined);
        }
        private _updateInputConCapturePoint(): void {
            this._inputConCapturePoint.text = `${this._getAction().conCapturePoint?.value ?? ``}`;
        }

        private _updateInputActHpDeltaValue(): void {
            const value                     = this._getAction().actHpDeltaValue;
            this._inputActHpDeltaValue.text = `${value == null ? `` : value}`;
        }
        private _updateInputActHpMultiplierPercentage(): void {
            const value                                 = this._getAction().actHpMultiplierPercentage;
            this._inputActHpMultiplierPercentage.text   = `${value == null ? `` : value}`;
        }
        private _updateInputActCapturePointDeltaValue(): void {
            const value                                 = this._getAction().actCapturePointDeltaValue;
            this._inputActCapturePointDeltaValue.text   = `${value == null ? `` : value}`;
        }
        private _updateInputActCapturePointMultiplierPercentage(): void {
            const value                                         = this._getAction().actCapturePointMultiplierPercentage;
            this._inputActCapturePointMultiplierPercentage.text = `${value == null ? `` : value}`;
        }
        private _updateInputActBuildPointDeltaValue(): void {
            const value                                 = this._getAction().actBuildPointDeltaValue;
            this._inputActBuildPointDeltaValue.text     = `${value == null ? `` : value}`;
        }
        private _updateInputActBuildPointMultiplierPercentage(): void {
            const value                                         = this._getAction().actBuildPointMultiplierPercentage;
            this._inputActBuildPointMultiplierPercentage.text   = `${value == null ? `` : value}`;
        }
        private _updateLabelActAddLocationIdArray(): void {
            const locationIdArray               = this._getAction().actAddLocationIdArray;
            this._labelAddLocationIdArray.text  = locationIdArray?.length ? locationIdArray.join(`, `) : `--`;
        }
        private _updateLabelActDeleteLocationArray(): void {
            const locationIdArray                   = this._getAction().actDeleteLocationIdArray;
            this._labelDeleteLocationIdArray.text   = locationIdArray?.length ? locationIdArray.join(`, `) : `--`;
        }
        private _updateLabelActIsHighlighted(): void {
            const isHighlighted = this._getAction().actIsHighlighted;
            const label         = this._labelActIsHighlighted;
            if (isHighlighted == null) {
                label.text  = `--`;
            } else {
                label.text = Lang.getText(isHighlighted ? LangTextType.B0012 : LangTextType.B0013);
            }
        }

        private _getAction(): CommonProto.WarEvent.IWeaSetTileState {
            return Helpers.getExisted(this._getOpenData().action.WeaSetTileState);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}
