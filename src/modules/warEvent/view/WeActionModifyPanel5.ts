
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
namespace TwnsWeActionModifyPanel5 {
    import WeActionTypeListPanel    = TwnsWeActionTypeListPanel.WeActionTypeListPanel;
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction          = ProtoTypes.WarEvent.IWarEventAction;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import BwWar                    = TwnsBwWar.BwWar;
    import WeatherType              = Types.WeatherType;

    type OpenDataForWeActionModifyPanel5 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel5 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel5> {
        protected readonly _LAYER_TYPE   = Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeActionModifyPanel5;

        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _btnWeather!       : TwnsUiButton.UiButton;
        private readonly _labelWeather!     : TwnsUiLabel.UiLabel;
        private readonly _labelTurns!       : TwnsUiLabel.UiLabel;
        private readonly _inputTurns!       : TwnsUiTextInput.UiTextInput;
        private readonly _labelTurnsTips!   : TwnsUiLabel.UiLabel;

        public static show(openData: OpenDataForWeActionModifyPanel5): void {
            if (!WeActionModifyPanel5._instance) {
                WeActionModifyPanel5._instance = new WeActionModifyPanel5();
            }
            WeActionModifyPanel5._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (WeActionModifyPanel5._instance) {
                await WeActionModifyPanel5._instance.close();
            }
        }

        public constructor() {
            super();

            this._setIsTouchMaskEnabled();
            this._setIsCloseOnTouchedMask();
            this.skinName = "resource/skins/warEvent/WeActionModifyPanel5.exml";
        }

        protected _onOpened(): void {
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

            this._updateView();
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
            const action            = Helpers.getExisted(this._getOpenData().action.WeaSetWeather);
            const weatherType = action.weatherType;
            if (weatherType === WeatherType.Clear) {
                action.weatherType = WeatherType.Rainy;
            } else if (weatherType === WeatherType.Rainy) {
                action.weatherType = WeatherType.Sandstorm;
            } else if (weatherType === WeatherType.Sandstorm) {
                action.weatherType = WeatherType.Snowy;
            } else {
                action.weatherType = WeatherType.Clear;
            }

            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            WeActionTypeListPanel.show({
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        private _onFocusOutInputTurns(): void {
            const data = Helpers.getExisted(this._getOpenData().action.WeaSetWeather);
            const newTurns  = Math.min(parseInt(this._inputTurns.text)) || 0;
            if (newTurns !== data.turnsCount) {
                data.turnsCount = newTurns;
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
            this._labelWeather.text = Lang.getWeatherName(Helpers.getExisted(this._getOpenData().action.WeaSetWeather?.weatherType));
        }

        private _updateInputTurns(): void {
            this._inputTurns.text = `${this._getOpenData().action.WeaSetWeather?.turnsCount}`;
        }
    }
}

// export default TwnsWeActionModifyPanel5;
