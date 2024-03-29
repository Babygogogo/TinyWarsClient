
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

    export type OpenDataForWeActionModifyPanel5 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel5 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel5> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _btnWeather!       : TwnsUiButton.UiButton;
        private readonly _labelWeather!     : TwnsUiLabel.UiLabel;
        private readonly _labelTurns!       : TwnsUiLabel.UiLabel;
        private readonly _inputTurns!       : TwnsUiTextInput.UiTextInput;
        private readonly _labelTurnsTips!   : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnWeather,             callback: this._onTouchedBtnWeather },
                { ui: this._btnType,                callback: this._onTouchedBtnType },
                { ui: this._btnBack,                callback: this.close },
                { ui: this._inputTurns,             callback: this._onFocusOutInputTurns,               eventType: egret.FocusEvent.FOCUS_OUT },
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
            this._updateInputTurns();
            this._updateLabelWeather();
        }

        private _onTouchedBtnWeather(): void {
            const openData      = this._getOpenData();
            const action        = Helpers.getExisted(openData.action.WeaSetWeather);
            action.weatherType  = openData.war.getGameConfig().getNextWeatherType(action.weatherType);

            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            PanelHelpers.open(PanelHelpers.PanelDict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        private _onFocusOutInputTurns(): void {
            const data = Helpers.getExisted(this._getOpenData().action.WeaSetWeather);
            const newTurns  = Math.min(parseInt(this._inputTurns.text)) || 0;
            if (newTurns !== data.weatherTurnsCount) {
                data.weatherTurnsCount = newTurns;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelWeather();
            this._updateInputTurns();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label             = Lang.getText(LangTextType.B0516);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelTurnsTips.text       = `(${Lang.getText(LangTextType.A0254)})`;
            this._btnWeather.label          = Lang.getText(LangTextType.B0705);
            this._labelTurns.text           = Lang.getText(LangTextType.B0091);

            this._updateLabelWeather();
        }

        private _updateLabelWeather(): void {
            const openData          = this._getOpenData();
            this._labelWeather.text = Lang.getWeatherName(Helpers.getExisted(openData.action.WeaSetWeather?.weatherType), openData.war.getGameConfig()) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _updateInputTurns(): void {
            this._inputTurns.text = `${this._getOpenData().action.WeaSetWeather?.weatherTurnsCount}`;
        }
    }
}

// export default TwnsWeActionModifyPanel5;
