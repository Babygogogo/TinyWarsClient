
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
    import LangTextType             = TwnsLangTextType.LangTextType;
    import NotifyType               = Twns.Notify.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventCondition       = CommonProto.WarEvent.IWarEventCondition;

    export type OpenDataForWeConditionModifyPanel32 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        condition   : IWarEventCondition;
    };
    /** WecPlayerIndexInTurnEqualTo */
    export class WeConditionModifyPanel32 extends TwnsUiPanel.UiPanel<OpenDataForWeConditionModifyPanel32> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _btnClose!         : TwnsUiButton.UiButton;
        private readonly _labelDesc!        : TwnsUiLabel.UiLabel;
        private readonly _labelError!       : TwnsUiLabel.UiLabel;

        private readonly _btnPlayerIndex!               : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndex!             : TwnsUiLabel.UiLabel;
        private readonly _btnTeamIndex!                 : TwnsUiButton.UiButton;
        private readonly _labelTeamIndex!               : TwnsUiLabel.UiLabel;
        private readonly _btnTileType!                  : TwnsUiButton.UiButton;
        private readonly _labelTileType!                : TwnsUiLabel.UiLabel;
        private readonly _btnLocation!                  : TwnsUiButton.UiButton;
        private readonly _labelLocation!                : TwnsUiLabel.UiLabel;
        private readonly _btnGridIndex!                 : TwnsUiButton.UiButton;
        private readonly _labelGridIndex!               : TwnsUiLabel.UiLabel;
        private readonly _btnTilesCountComparator!      : TwnsUiButton.UiButton;
        private readonly _labelTilesCountComparator!    : TwnsUiLabel.UiLabel;
        private readonly _labelTilesCount!              : TwnsUiLabel.UiLabel;
        private readonly _inputTilesCount!              : TwnsUiTextInput.UiTextInput;

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
                { ui: this._btnTileType,                callback: this._onTouchedBtnTileType },
                { ui: this._btnLocation,                callback: this._onTouchedBtnLocation },
                { ui: this._btnGridIndex,               callback: this._onTouchedBtnGridIndex },
                { ui: this._btnTilesCountComparator,    callback: this._onTouchedBtnTilesCountComparator },
                { ui: this._inputTilesCount,            callback: this._onFocusOutInputTilesCount,          eventType: egret.FocusEvent.FOCUS_OUT },
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
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
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
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnTileType(): void {
            const condition = this._getCondition();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseTileTypePanel, {
                gameConfig              : this._getOpenData().war.getGameConfig(),
                currentTileTypeArray    : condition.tileTypeArray ?? [],
                callbackOnConfirm       : tileTypeArray => {
                    condition.tileTypeArray = tileTypeArray;
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnLocation(): void {
            const condition = this._getCondition();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseLocationPanel, {
                currentLocationIdArray  : condition.locationIdArray ?? [],
                callbackOnConfirm       : locationIdArray => {
                    condition.locationIdArray = locationIdArray;
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
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
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnTilesCountComparator(): void {
            const condition                 = this._getCondition();
            condition.tilesCountComparator  = Helpers.getNextValueComparator(condition.tilesCountComparator);
            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }
        private _onFocusOutInputTilesCount(): void {
            const value = parseInt(this._inputTilesCount.text);
            if (isNaN(value)) {
                this._updateInputTilesCount();
            } else {
                this._getCondition().tilesCount = value;
                Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelPlayerIndex();
            this._updateLabelTeamIndex();
            this._updateLabelTileType();
            this._updateLabelLocation();
            this._updateLabelGridIndex();
            this._updateLabelTilesCountComparator();
            this._updateInputTilesCount();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = `${Lang.getText(LangTextType.B0501)} C${this._getOpenData().condition.WecCommonData?.conditionId}`;
            this._btnClose.label                = Lang.getText(LangTextType.B0146);
            this._btnType.label                 = Lang.getText(LangTextType.B0516);
            this._btnPlayerIndex.label          = Lang.getText(LangTextType.B0031);
            this._btnTeamIndex.label            = Lang.getText(LangTextType.B0377);
            this._btnTileType.label             = Lang.getText(LangTextType.B0718);
            this._btnLocation.label             = Lang.getText(LangTextType.B0764);
            this._btnGridIndex.label            = Lang.getText(LangTextType.B0531);
            this._btnTilesCountComparator.label = Lang.getText(LangTextType.B0774);
            this._labelTilesCount.text          = Lang.getText(LangTextType.B0778);
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
            labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
            this._labelDesc.text    = WarHelpers.WarEventHelpers.getDescForCondition(condition, war.getGameConfig()) || CommonConstants.ErrorTextForUndefined;
        }
        private _updateLabelPlayerIndex(): void {
            const playerIndexArray      = this._getCondition().playerIndexArray;
            this._labelPlayerIndex.text = playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelTeamIndex(): void {
            const teamIndexArray        = this._getCondition().teamIndexArray;
            this._labelTeamIndex.text   = teamIndexArray?.length ? teamIndexArray.map(v => Lang.getPlayerTeamName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelTileType(): void {
            const tileTypeArray         = this._getCondition().tileTypeArray;
            this._labelTileType.text    = tileTypeArray?.length ? tileTypeArray.map(v => Lang.getTileName(v)).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelLocation(): void {
            const locationIdArray       = this._getCondition().locationIdArray;
            this._labelLocation.text    = locationIdArray?.length ? locationIdArray.join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelGridIndex(): void {
            const gridIndexArray        = this._getCondition().gridIndexArray;
            this._labelGridIndex.text   = gridIndexArray?.length ? gridIndexArray.map(v => `(${v.x},${v.y})`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelTilesCountComparator(): void {
            const comparator                        = Helpers.getExisted(this._getCondition().tilesCountComparator);
            this._labelTilesCountComparator.text    = Lang.getValueComparatorName(comparator) ?? CommonConstants.ErrorTextForUndefined;
        }
        private _updateInputTilesCount(): void {
            this._inputTilesCount.text = `${this._getCondition().tilesCount}`;
        }

        private _getCondition(): CommonProto.WarEvent.IWecTilePresence {
            return Helpers.getExisted(this._getOpenData().condition.WecTilePresence);
        }
    }
}

// export default TwnsWeConditionModifyPanel15;
