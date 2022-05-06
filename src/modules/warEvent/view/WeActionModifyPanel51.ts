
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

    export type OpenDataForWeActionModifyPanel51 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel51 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel51> {
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;
        private readonly _btnType!                      : TwnsUiButton.UiButton;
        private readonly _btnClose!                     : TwnsUiButton.UiButton;
        private readonly _labelDesc!                    : TwnsUiLabel.UiLabel;
        private readonly _labelError!                   : TwnsUiLabel.UiLabel;
        private readonly _imgInnerTouchMask!            : TwnsUiImage.UiImage;

        private readonly _btnConPlayerIndexArray!       : TwnsUiButton.UiButton;
        private readonly _labelConPlayerIndexArray!     : TwnsUiLabel.UiLabel;
        private readonly _btnActBannedUnitTypeArray!    : TwnsUiButton.UiButton;
        private readonly _labelActBannedUnitTypeArray!  : TwnsUiLabel.UiLabel;
        private readonly _btnActCanActivateCoSkill!     : TwnsUiButton.UiButton;
        private readonly _labelActCanActivateCoSkill!   : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setNotifyListenerArray([
                { type: NotifyType.LanguageChanged,             callback: this._onNotifyLanguageChanged },
                { type: NotifyType.WarEventFullDataChanged,     callback: this._onNotifyWarEventFullDataChanged },
            ]);
            this._setUiListenerArray([
                { ui: this._btnClose,                           callback: this.close },
                { ui: this._btnType,                            callback: this._onTouchedBtnType },
                { ui: this._imgInnerTouchMask,                  callback: this._onTouchedImgInnerTouchMask },
                { ui: this._btnConPlayerIndexArray,             callback: this._onTouchedBtnConPlayerIndexArray },
                { ui: this._btnActBannedUnitTypeArray,          callback: this._onTouchedBtnActBannedUnitType },
                { ui: this._btnActCanActivateCoSkill,           callback: this._onTouchedBtnActCanActivateCoSkill },
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
        private _onTouchedBtnConPlayerIndexArray(): void {
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
        private _onTouchedBtnActBannedUnitType(): void {
            const action = this._getAction();
            PanelHelpers.open(PanelHelpers.PanelDict.CommonChooseUnitTypePanel, {
                gameConfig              : this._getOpenData().war.getGameConfig(),
                currentUnitTypeArray    : action.actBannedUnitTypeArray ?? [],
                callbackOnConfirm       : unitTypeArray => {
                    action.actBannedUnitTypeArray = unitTypeArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }
        private _onTouchedBtnActCanActivateCoSkill(): void {
            const condition     = this._getAction();
            const canActivate   = condition.actCanActivateCoSkill;
            if (canActivate ?? true) {
                condition.actCanActivateCoSkill = false;
            } else {
                condition.actCanActivateCoSkill = true;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelDescAndLabelError();
            this._updateLabelConPlayerIndexArray();
            this._updateLabelActBannedUnitTypeArray();
            this._updateLabelActCanActivateCoSkill();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text                   = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnClose.label                    = Lang.getText(LangTextType.B0146);
            this._btnType.label                     = Lang.getText(LangTextType.B0516);
            this._btnConPlayerIndexArray.label      = Lang.getText(LangTextType.B0031);
            this._btnActBannedUnitTypeArray.label   = Lang.getText(LangTextType.B0895);
            this._btnActCanActivateCoSkill.label    = Lang.getText(LangTextType.B0897);

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
        private _updateLabelConPlayerIndexArray(): void {
            const playerIndexArray              = this._getAction().conPlayerIndexArray;
            this._labelConPlayerIndexArray.text = playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`, `) : Lang.getText(LangTextType.B0776);
        }
        private _updateLabelActBannedUnitTypeArray(): void {
            const unitTypeArray                     = this._getAction().actBannedUnitTypeArray;
            this._labelActBannedUnitTypeArray.text  = unitTypeArray?.length ? unitTypeArray.map(v => Lang.getUnitName(v)).join(`, `) : `--`;
        }
        private _updateLabelActCanActivateCoSkill(): void {
            const canActivateCoSkill                = this._getAction().actCanActivateCoSkill;
            this._labelActCanActivateCoSkill.text   = (canActivateCoSkill ?? true) ? `--` : Lang.getText(LangTextType.B0013);
        }

        private _getAction(): CommonProto.WarEvent.IWeaPersistentModifyPlayerAttribute {
            return Helpers.getExisted(this._getOpenData().action.WeaPersistentModifyPlayerAttribute);
        }
        private _setInnerTouchMaskEnabled(isEnabled: boolean): void {
            this._imgInnerTouchMask.visible = isEnabled;
        }
    }
}
