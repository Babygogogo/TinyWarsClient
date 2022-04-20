
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import TwnsNotifyType               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventAction          = CommonProto.WarEvent.IWarEventAction;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import WarEventHelpers          = WarHelpers.WarEventHelpers;
    import BwWar                    = BaseWar.BwWar;

    export type OpenDataForWeActionModifyPanel11 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel11 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel11> {
        private readonly _labelTitle!                   : TwnsUiLabel.UiLabel;
        private readonly _btnType!                      : TwnsUiButton.UiButton;
        private readonly _btnBack!                      : TwnsUiButton.UiButton;
        private readonly _labelDesc!                    : TwnsUiLabel.UiLabel;
        private readonly _labelError!                   : TwnsUiLabel.UiLabel;

        private readonly _labelActionIdArray!           : TwnsUiLabel.UiLabel;
        private readonly _btnActionIdArray!             : TwnsUiButton.UiButton;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnType,                    callback: this._onTouchedBtnType },
                { ui: this._btnBack,                    callback: this.close },
                { ui: this._btnActionIdArray,           callback: this._onTouchedBtnSwitchCounterId },
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
            this._updateView();
        }

        private _onTouchedBtnSwitchCounterId(): void {
            const action            = this._getAction();
            const openData          = this._getOpenData();
            const warEventFullData  = openData.fullData;
            TwnsPanelManager.open(TwnsPanelConfig.Dict.CommonChooseWarEventActionIdPanel, {
                currentActionIdArray    : action.actionIdArray ?? [],
                availableActionIdArray  : warEventFullData.actionArray?.filter(v => WarEventHelpers.checkIsPersistentAction(v)).map(v => Helpers.getExisted(v.WeaCommonData?.actionId)) ?? [],
                warEventFullData,
                war                     : openData.war,
                callbackOnConfirm       : actionIdArray => {
                    action.actionIdArray = actionIdArray;
                    Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelActionIdArray();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label             = Lang.getText(LangTextType.B0516);
            this._btnActionIdArray.label    = Lang.getText(LangTextType.B0889);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);

            this._updateLabelDescAndLabelError();
        }

        private _updateLabelDescAndLabelError(): void {
            const openData          = this._getOpenData();
            const action            = openData.action;
            const war               = openData.war;
            const errorTip          = WarEventHelpers.getErrorTipForAction(openData.fullData, action, war);
            const labelError        = this._labelError;
            labelError.text         = errorTip || Lang.getText(LangTextType.B0493);
            labelError.textColor    = errorTip ? Types.ColorValue.Red : Types.ColorValue.Green;
            this._labelDesc.text    = WarEventHelpers.getDescForAction(action, war.getGameConfig()) || CommonConstants.ErrorTextForUndefined;
        }

        private _updateLabelActionIdArray(): void {
            const actionIdArray             = this._getAction().actionIdArray;
            this._labelActionIdArray.text   = actionIdArray?.length ? actionIdArray.join(`, `) : CommonConstants.ErrorTextForUndefined;
        }

        private _getAction(): CommonProto.WarEvent.IWeaStopPersistentAction {
            return Helpers.getExisted(this._getOpenData().action.WeaStopPersistentAction);
        }
    }
}

// export default TwnsWeActionModifyPanel8;
