
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
namespace TwnsWeActionModifyPanel10 {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction          = ProtoTypes.WarEvent.IWarEventAction;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import BwWar                    = Twns.BaseWar.BwWar;

    export type OpenData = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel10 extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!       : TwnsUiLabel.UiLabel;
        private readonly _btnType!          : TwnsUiButton.UiButton;
        private readonly _btnBack!          : TwnsUiButton.UiButton;
        private readonly _btnHasFog!        : TwnsUiButton.UiButton;
        private readonly _labelHasFog!      : TwnsUiLabel.UiLabel;
        private readonly _labelTurns!       : TwnsUiLabel.UiLabel;
        private readonly _inputTurns!       : TwnsUiTextInput.UiTextInput;
        private readonly _labelTurnsTips!   : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnHasFog,              callback: this._onTouchedBtnHasFog },
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
            this._updateLabelHasFog();
        }

        private _onTouchedBtnHasFog(): void {
            const action        = this.getAction();
            const forceFogCode  = action.forceFogCode;
            if (forceFogCode === Types.ForceFogCode.Fog) {
                action.forceFogCode = Types.ForceFogCode.Clear;
            } else if (forceFogCode === Types.ForceFogCode.Clear) {
                action.forceFogCode = Types.ForceFogCode.None;
            } else {
                action.forceFogCode = Types.ForceFogCode.Fog;
            }
            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            TwnsPanelManager.open(TwnsPanelConfig.Dict.WeActionTypeListPanel, {
                war         : openData.war,
                fullData    : openData.fullData,
                action      : openData.action,
            });
        }

        private _onFocusOutInputTurns(): void {
            const action    = this.getAction();
            const newTurns  = Math.min(parseInt(this._inputTurns.text)) || 0;
            if (newTurns !== action.turnsCount) {
                action.turnsCount = newTurns;
                Notify.dispatch(NotifyType.WarEventFullDataChanged);
            }
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelHasFog();
            this._updateInputTurns();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text           = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label             = Lang.getText(LangTextType.B0516);
            this._btnBack.label             = Lang.getText(LangTextType.B0146);
            this._labelTurnsTips.text       = `(${Lang.getText(LangTextType.A0254)})`;
            this._btnHasFog.label           = Lang.getText(LangTextType.B0020);
            this._labelTurns.text           = Lang.getText(LangTextType.B0091);

            this._updateLabelHasFog();
        }

        private _updateLabelHasFog(): void {
            this._labelHasFog.text = Lang.getForceFogCodeName(Helpers.getExisted(this.getAction().forceFogCode)) ?? CommonConstants.ErrorTextForUndefined;
        }

        private _updateInputTurns(): void {
            this._inputTurns.text = `${this.getAction().turnsCount}`;
        }

        private getAction(): ProtoTypes.WarEvent.IWeaSetForceFogCode {
            return Helpers.getExisted(this._getOpenData().action.WeaSetForceFogCode);
        }
    }
}

// export default TwnsWeActionModifyPanel10;
