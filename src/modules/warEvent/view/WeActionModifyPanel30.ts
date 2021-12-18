
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiImage                  from "../../tools/ui/UiImage";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsUiTextInput              from "../../tools/ui/UiTextInput";
// import WarEventHelper               from "../model/WarEventHelper";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWeActionModifyPanel30 {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction          = ProtoTypes.WarEvent.IWarEventAction;

    export type OpenData = {
        war         : TwnsBwWar.BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel30 extends TwnsUiPanel.UiPanel<OpenData> {
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
        private readonly _labelMultiplierPercentage!    : TwnsUiLabel.UiLabel;
        private readonly _inputMultiplierPercentage!    : TwnsUiTextInput.UiTextInput;
        private readonly _labelDeltaValue!              : TwnsUiLabel.UiLabel;
        private readonly _inputDeltaValue!              : TwnsUiTextInput.UiTextInput;

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
                { ui: this._inputDeltaValue,            callback: this._onFocusInInputDeltaValue,               eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputDeltaValue,            callback: this._onFocusOutInputDeltaValue,              eventType: egret.FocusEvent.FOCUS_OUT },
                { ui: this._inputMultiplierPercentage,  callback: this._onFocusInInputMultiplierPercentage,     eventType: egret.FocusEvent.FOCUS_IN },
                { ui: this._inputMultiplierPercentage,  callback: this._onFocusOutInputMultiplierPercentage,    eventType: egret.FocusEvent.FOCUS_OUT },
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
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeActionTypeListPanel, {
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
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChoosePlayerIndexPanel, {
                currentPlayerIndexArray : action.playerIndexArray ?? [],
                maxPlayerIndex          : this._getOpenData().war.getPlayersCountUnneutral(),
                callbackOnConfirm       : playerIndexArray => {
                    action.playerIndexArray = playerIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnTeamIndex(): void {
            const action = this._getAction();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseTeamIndexPanel, {
                currentTeamIndexArray   : action.teamIndexArray ?? [],
                maxTeamIndex            : this._getOpenData().war.getPlayersCountUnneutral(),
                callbackOnConfirm       : teamIndexArray => {
                    action.teamIndexArray = teamIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnUnitType(): void {
            const action = this._getAction();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseUnitTypePanel, {
                currentUnitTypeArray    : action.unitTypeArray ?? [],
                callbackOnConfirm       : unitTypeArray => {
                    action.unitTypeArray = unitTypeArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnLocation(): void {
            const action = this._getAction();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseLocationPanel, {
                currentLocationIdArray  : action.locationIdArray ?? [],
                callbackOnConfirm       : locationIdArray => {
                    action.locationIdArray = locationIdArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnGridIndex(): void {
            const action = this._getAction();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseGridIndexPanel, {
                currentGridIndexArray   : Helpers.getNonNullElements(action.gridIndexArray?.map(v => GridIndexHelpers.convertGridIndex(v)) ?? []),
                mapSize                 : this._getOpenData().war.getTileMap().getMapSize(),
                callbackOnConfirm       : gridIndexArray => {
                    action.gridIndexArray = gridIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
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
                const maxValue      = CommonConstants.WarEventActionSetCustomCounterMaxDeltaValue;
                action.deltaValue   = Math.min(
                    maxValue,
                    Math.max(-maxValue, rawValue)
                );
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
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
                const maxValue              = CommonConstants.WarEventActionSetCustomCounterMaxMultiplierPercentage;
                action.multiplierPercentage = Math.min(
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
            this._updateLabelTeamIndex();
            this._updateLabelUnitType();
            this._updateLabelLocation();
            this._updateLabelGridIndex();
            this._updateInputDeltaValue();
            this._updateInputMultiplierPercentage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                   = `${Lang.getText(LangTextType.B0501)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnClose.label                    = Lang.getText(LangTextType.B0146);
            this._btnType.label                     = Lang.getText(LangTextType.B0516);
            this._btnPlayerIndex.label              = Lang.getText(LangTextType.B0031);
            this._btnTeamIndex.label                = Lang.getText(LangTextType.B0377);
            this._btnUnitType.label                 = Lang.getText(LangTextType.B0525);
            this._btnLocation.label                 = Lang.getText(LangTextType.B0764);
            this._btnGridIndex.label                = Lang.getText(LangTextType.B0531);
            this._labelDeltaValue.text              = Lang.getText(LangTextType.B0754);
            this._labelMultiplierPercentage.text    = `${Lang.getText(LangTextType.B0755)}%`;
            // this._labelGridIndex.text   = Lang.getText(LangTextType.B0531);

            this._updateLabelDescAndLabelError();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const action         = openData.action;
            const errorTip          = WarEventHelper.getErrorTipForAction(openData.fullData, action, openData.war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
            this._labelDesc.text    = WarEventHelper.getDescForAction(action) || CommonConstants.ErrorTextForUndefined;
        }
        private _updateLabelPlayerIndex(): void {
            const playerIndexArray      = this._getAction().playerIndexArray;
            this._labelPlayerIndex.text = playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelTeamIndex(): void {
            const teamIndexArray        = this._getAction().teamIndexArray;
            this._labelTeamIndex.text   = teamIndexArray?.length ? teamIndexArray.map(v => Lang.getPlayerTeamName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelUnitType(): void {
            const unitTypeArray         = this._getAction().unitTypeArray;
            this._labelUnitType.text    = unitTypeArray?.length ? unitTypeArray.map(v => Lang.getUnitName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelLocation(): void {
            const locationIdArray       = this._getAction().locationIdArray;
            this._labelLocation.text    = locationIdArray?.length ? locationIdArray.join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelGridIndex(): void {
            const gridIndexArray        = this._getAction().gridIndexArray;
            this._labelGridIndex.text   = gridIndexArray?.length ? gridIndexArray.map(v => `(${v.x},${v.y})`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateInputDeltaValue(): void {
            const value                 = this._getAction().deltaValue;
            this._inputDeltaValue.text  = `${value == null ? `` : value}`;
        }
        private _updateInputMultiplierPercentage(): void {
            const value                             = this._getAction().multiplierPercentage;
            this._inputMultiplierPercentage.text    = `${value == null ? `` : value}`;
        }

        private _getAction(): ProtoTypes.WarEvent.IWeaSetUnitHp {
            return Helpers.getExisted(this._getOpenData().action.WeaSetUnitHp);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}
