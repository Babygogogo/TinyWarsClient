
// import TwnsBwWar                    from "../../baseWar/model/BwWar";
// import CommonConstants              from "../../tools/helpers/CommonConstants";
// import Helpers                      from "../../tools/helpers/Helpers";
// import Types                        from "../../tools/helpers/Types";
// import Lang                         from "../../tools/lang/Lang";
// import TwnsLangTextType             from "../../tools/lang/LangTextType";
// import Notify                       from "../../tools/notify/Notify";
// import Twns.Notify               from "../../tools/notify/NotifyType";
// import ProtoTypes                   from "../../tools/proto/ProtoTypes";
// import TwnsUiButton                 from "../../tools/ui/UiButton";
// import TwnsUiLabel                  from "../../tools/ui/UiLabel";
// import TwnsUiPanel                  from "../../tools/ui/UiPanel";
// import TwnsWeActionTypeListPanel    from "./WeActionTypeListPanel";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace Twns.WarEvent {
    import NotifyType               = Twns.Notify.NotifyType;
    import PlayerAliveState         = Twns.Types.PlayerAliveState;
    import IWarEventFullData        = CommonProto.Map.IWarEventFullData;
    import IWarEventAction          = CommonProto.WarEvent.IWarEventAction;
    import LangTextType             = Twns.Lang.LangTextType;
    import ClientErrorCode          = Twns.ClientErrorCode;
    import BwWar                    = Twns.BaseWar.BwWar;

    export type OpenDataForWeActionModifyPanel23 = {
        war         : BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    };
    export class WeActionModifyPanel23 extends TwnsUiPanel.UiPanel<OpenDataForWeActionModifyPanel23> {
        private readonly _labelTitle!               : TwnsUiLabel.UiLabel;
        private readonly _btnType!                  : TwnsUiButton.UiButton;
        private readonly _btnBack!                  : TwnsUiButton.UiButton;
        private readonly _labelPlayerIndex!         : TwnsUiLabel.UiLabel;
        private readonly _btnSwitchPlayerIndex!     : TwnsUiButton.UiButton;
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
            const openData  = this._getOpenData();
            const action    = this._getAction();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.CommonChoosePlayerIndexPanel, {
                currentPlayerIndexArray : action.playerIndexArray ?? [],
                maxPlayerIndex          : openData.war.getPlayersCountUnneutral(),
                callbackOnConfirm       : playerIndexArray => {
                    action.playerIndexArray = playerIndexArray;
                    Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
                },
            });
        }

        private _onTouchedBtnSwitchPlayerState(): void {
            const action    = this._getAction();
            const state     = action.playerAliveState;
            if (state === PlayerAliveState.Alive) {
                action.playerAliveState = PlayerAliveState.Dying;
            } else if (state === PlayerAliveState.Dying) {
                action.playerAliveState = PlayerAliveState.Dead;
            } else {
                action.playerAliveState = PlayerAliveState.Alive;
            }

            Twns.Notify.dispatch(NotifyType.WarEventFullDataChanged);
        }

        private _onTouchedBtnType(): void {
            const openData = this._getOpenData();
            Twns.PanelHelpers.open(Twns.PanelHelpers.PanelDict.WeActionTypeListPanel, {
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
            this._btnSwitchPlayerIndex.label    = Lang.getText(LangTextType.B0521);
            this._btnSwitchPlayerState.label    = Lang.getText(LangTextType.B0523);
            this._btnBack.label                 = Lang.getText(LangTextType.B0146);

            this._updateLabelPlayerState();
            this._updateLabelTips();
        }

        private _updateLabelPlayerIndex(): void {
            const playerIndexArray      = this._getAction().playerIndexArray;
            this._labelPlayerIndex.text = playerIndexArray?.length ? playerIndexArray.map(v => `P${v}`).join(`/`) : Lang.getText(LangTextType.B0766);
        }

        private _updateLabelPlayerState(): void {
            this._labelPlayerState.text = Lang.getPlayerAliveStateName(Twns.Helpers.getExisted(this._getAction().playerAliveState)) || Twns.CommonConstants.ErrorTextForUndefined;
        }

        private _updateLabelTips(): void {
            this._labelTips.text = getTipsForPlayerAliveState(Twns.Helpers.getExisted(this._getAction().playerAliveState)) || Twns.CommonConstants.ErrorTextForUndefined;
        }

        private _getAction(): CommonProto.WarEvent.IWeaSetPlayerAliveState {
            return Twns.Helpers.getExisted(this._getOpenData().action.WeaSetPlayerAliveState);
        }
    }

    function getTipsForPlayerAliveState(playerAliveState: PlayerAliveState): string {
        switch (playerAliveState) {
            case PlayerAliveState.Alive : return Lang.getText(LangTextType.A0214);
            case PlayerAliveState.Dying : return Lang.getText(LangTextType.A0215);
            case PlayerAliveState.Dead  : return Lang.getText(LangTextType.A0216);
            default                     : throw Twns.Helpers.newError(`Invalid playerAliveState: ${playerAliveState}`, ClientErrorCode.WeActionModifyPanel2_GetTipsForPlayerAliveState_00);
        }
    }
}

// export default TwnsWeActionModifyPanel2;
