
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
namespace TwnsWeActionModifyPanel2 {
    import NotifyType               = TwnsNotifyType.NotifyType;
    import PlayerAliveState         = Types.PlayerAliveState;
    import IWarEventFullData        = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction          = ProtoTypes.WarEvent.IWarEventAction;
    import LangTextType             = TwnsLangTextType.LangTextType;
    import ClientErrorCode          = TwnsClientErrorCode.ClientErrorCode;
    import BwWar                    = TwnsBwWar.BwWar;

    export type OpenData = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel2 extends TwnsUiPanel.UiPanel<OpenData> {
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnType!                  : TwnsUiButton.UiButton;
        private readonly _btnBack!                  : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndexTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelPlayerIndex!         : TwnsUiLabel.UiLabel;
        private readonly _btnSwitchPlayerIndex!     : TwnsUiButton.UiButton;
        private readonly _labelPlayerStateTitle!    : TwnsUiLabel.UiLabel;
        private readonly _labelPlayerState!         : TwnsUiLabel.UiLabel;
        private readonly _btnSwitchPlayerState!     : TwnsUiButton.UiButton;
        private readonly _labelTips!                : TwnsUiLabel.UiLabel;

        protected _onOpening(): void {
            this._setUiListenerArray([
                { ui: this._btnSwitchPlayerIndex,   callback: this._onTouchedBtnSwitchPlayerIndex },
                { ui: this._btnSwitchPlayerState,   callback: this._onTouchedBtnSwitchPlayerState },
                { ui: this._btnType,                callback: this._onTouchedBtnType },
                { ui: this._btnBack,                callback: this.close },
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
            this._updateLabelPlayerIndex();
            this._updateLabelPlayerState();
            this._updateLabelTips();
        }

        private _onTouchedBtnSwitchPlayerIndex(): void {
            const action        = Helpers.getExisted(this._getOpenData().action.WeaSetPlayerAliveState);
            action.playerIndex  = ((action.playerIndex || 0) % CommonConstants.WarMaxPlayerIndex) + 1;

            Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnSwitchPlayerState(): void {
            const action    = Helpers.getExisted(this._getOpenData().action.WeaSetPlayerAliveState);
            const state     = action.playerAliveState;
            if (state === PlayerAliveState.Alive) {
                action.playerAliveState = PlayerAliveState.Dying;
            } else if (state === PlayerAliveState.Dying) {
                action.playerAliveState = PlayerAliveState.Dead;
            } else {
                action.playerAliveState = PlayerAliveState.Alive;
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

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();

            this._updateLabelPlayerIndex();
            this._updateLabelPlayerState();
            this._updateLabelTips();
        }

        private _updateComponentsForLanguage(): void {
            this._labelTitle.text               = `${Lang.getText(LangTextType.B0533)} A${this._getOpenData().action.WeaCommonData?.actionId}`;
            this._btnType.label                 = Lang.getText(LangTextType.B0516);
            this._btnSwitchPlayerIndex.label    = Lang.getText(LangTextType.B0520);
            this._btnSwitchPlayerState.label    = Lang.getText(LangTextType.B0520);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);
            this._labelPlayerIndexTitle.text    = Lang.getText(LangTextType.B0521);
            this._labelPlayerStateTitle.text    = Lang.getText(LangTextType.B0523);

            this._updateLabelPlayerState();
            this._updateLabelTips();
        }

        private _updateLabelPlayerIndex(): void {
            this._labelPlayerIndex.text = `P${this._getOpenData().action.WeaSetPlayerAliveState?.playerIndex || `??`}`;
        }

        private _updateLabelPlayerState(): void {
            this._labelPlayerState.text = Lang.getPlayerAliveStateName(Helpers.getExisted(this._getOpenData().action.WeaSetPlayerAliveState?.playerAliveState)) || CommonConstants.ErrorTextForUndefined;
        }

        private _updateLabelTips(): void {
            this._labelTips.text = getTipsForPlayerAliveState(Helpers.getExisted(this._getOpenData().action.WeaSetPlayerAliveState?.playerAliveState)) || CommonConstants.ErrorTextForUndefined;
        }
    }

    function getTipsForPlayerAliveState(playerAliveState: PlayerAliveState): string {
        switch (playerAliveState) {
            case PlayerAliveState.Alive : return Lang.getText(LangTextType.A0214);
            case PlayerAliveState.Dying : return Lang.getText(LangTextType.A0215);
            case PlayerAliveState.Dead  : return Lang.getText(LangTextType.A0216);
            default                     : throw Helpers.newError(`Invalid playerAliveState: ${playerAliveState}`, ClientErrorCode.WeActionModifyPanel2_GetTipsForPlayerAliveState_00);
        }
    }
}

// export default TwnsWeActionModifyPanel2;
