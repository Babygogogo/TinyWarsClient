
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
// import TwnsWeConditionTypeListPanel from "./WeConditionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TwnsWeConditionModifyPanel40 {
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventCondition       = ProtoTypes.WarEvent.IWarEventCondition;

    export type OpenData = {
        war         : TwnsBwWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecPlayerIndexInTurnEqualTo */
    export class WeConditionModifyPanel40 extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _btnClose!         : TwnsUiButton.UiButton;
        private readonly _labelDesc!        : TwnsUiLabel.UiLabel;
        private readonly _labelError!       : TwnsUiLabel.UiLabel;

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
                { ui: this._btnPlayerIndex,             callback: this._onTouchedBtnPlayerIndex },
                { ui: this._btnTeamIndex,               callback: this._onTouchedBtnTeamIndex },
                { ui: this._btnUnitType,                callback: this._onTouchedBtnUnitType },
                { ui: this._btnLocation,                callback: this._onTouchedBtnLocation },
                { ui: this._btnGridIndex,               callback: this._onTouchedBtnGridIndex },
                { ui: this._btnUnitsCountComparator,    callback: this._onTouchedBtnUnitsCountComparator },
                { ui: this._inputUnitsCount,            callback: this._onFocusOutInputUnitsCount,          eventType: egret.FocusEvent.FOCUS_OUT },
            ]);
            this._setIsTouchMaskEnabled(true);
            this._setIsCloseOnTouchedMask();
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
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeConditionTypeListPanel, {
                fullData    : openData.fullData,
                condition   : openData.condition,
                war         : openData.war,
            });
        }
        private _onTouchedBtnPlayerIndex(): void {
            const condition = this._getCondition();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChoosePlayerIndexPanel, {
                currentPlayerIndexArray : condition.playerIndexArray ?? [],
                maxPlayerIndex          : this._getOpenData().war.getPlayersCountUnneutral(),
                callbackOnConfirm       : playerIndexArray => {
                    condition.playerIndexArray = playerIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnTeamIndex(): void {
            const condition = this._getCondition();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseTeamIndexPanel, {
                currentTeamIndexArray   : condition.teamIndexArray ?? [],
                maxTeamIndex            : this._getOpenData().war.getPlayersCountUnneutral(),
                callbackOnConfirm       : teamIndexArray => {
                    condition.teamIndexArray = teamIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnUnitType(): void {
            const condition = this._getCondition();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseUnitTypePanel, {
                currentUnitTypeArray    : condition.unitTypeArray ?? [],
                callbackOnConfirm       : unitTypeArray => {
                    condition.unitTypeArray = unitTypeArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnLocation(): void {
            const condition = this._getCondition();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseLocationPanel, {
                currentLocationIdArray  : condition.locationIdArray ?? [],
                callbackOnConfirm       : locationIdArray => {
                    condition.locationIdArray = locationIdArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnGridIndex(): void {
            const condition = this._getCondition();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseGridIndexPanel, {
                currentGridIndexArray   : Helpers.getNonNullElements(condition.gridIndexArray?.map(v => GridIndexHelpers.convertGridIndex(v)) ?? []),
                mapSize                 : this._getOpenData().war.getTileMap().getMapSize(),
                callbackOnConfirm       : gridIndexArray => {
                    condition.gridIndexArray = gridIndexArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnUnitsCountComparator(): void {
            const condition                 = this._getCondition();
            condition.unitsCountComparator  = Helpers.getNextValueComparator(condition.unitsCountComparator);
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusOutInputUnitsCount(): void {
            const value = parseInt(this._inputUnitsCount.text);
            if (isNaN(value)) {
                this._updateInputUnitsCount();
            } else {
                this._getCondition().unitsCount = value;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
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
            this._btnUnitsCountComparator.label = Lang.getText(LangTextType.B0774);
            this._labelUnitsCount.text          = Lang.getText(LangTextType.B0773);
            // this._labelGridIndex.text   = Lang.getText(LangTextType.B0531);

            this._updateLabelDescAndLabelError();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const condition         = openData.condition;
            const errorTip          = WarEventHelper.getErrorTipForCondition(openData.fullData, condition, openData.war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
            this._labelDesc.text    = WarEventHelper.getDescForCondition(condition) || CommonConstants.ErrorTextForUndefined;
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
        private _updateLabelUnitsCountComparator(): void {
            const comparator                        = Helpers.getExisted(this._getCondition().unitsCountComparator);
            this._labelUnitsCountComparator.text    = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputUnitsCount(): void {
            this._inputUnitsCount.text = `${this._getCondition().unitsCount}`;
        }

        private _getCondition(): ProtoTypes.WarEvent.IWecUnitPresence {
            return Helpers.getExisted(this._getOpenData().condition.WecUnitPresence);
        }
    }
}

// export default TwnsWeConditionModifyPanel16;