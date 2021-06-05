
namespace TinyWars.WarEvent {
    import Lang                 = Utility.Lang;
    import Notify               = Utility.Notify;
    import Types                = Utility.Types;
    import ProtoTypes           = Utility.ProtoTypes;
    import CommonConstants      = Utility.CommonConstants;
    import PlayerAliveState     = Types.PlayerAliveState;
    import IWarEventFullData    = ProtoTypes.Map.IWarEventFullData;
    import IWarEventAction      = ProtoTypes.WarEvent.IWarEventAction;

    type OpenDataForWeActionModifyPanel2 = {
        war         : BaseWar.BwWar;
        fullData    : IWarEventFullData;
        action      : IWarEventAction;
    }
    export class WeActionModifyPanel2 extends GameUi.UiPanel<OpenDataForWeActionModifyPanel2> {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud1;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: WeActionModifyPanel2;

        private _labelTitle             : TinyWars.GameUi.UiLabel;
        private _btnType                : TinyWars.GameUi.UiButton;
        private _btnBack                : TinyWars.GameUi.UiButton;
        private _labelPlayerIndexTitle  : TinyWars.GameUi.UiLabel;
        private _labelPlayerIndex       : TinyWars.GameUi.UiLabel;
        private _btnSwitchPlayerIndex   : TinyWars.GameUi.UiButton;
        private _labelPlayerStateTitle  : TinyWars.GameUi.UiLabel;
        private _labelPlayerState       : TinyWars.GameUi.UiLabel;
        private _btnSwitchPlayerState   : TinyWars.GameUi.UiButton;
        private _labelTips              : TinyWars.GameUi.UiLabel;

        public static show(openData: OpenDataForWeActionModifyPanel2): void {
            if (!WeActionModifyPanel2._instance) {
                WeActionModifyPanel2._instance = new WeActionModifyPanel2();
            }
            WeActionModifyPanel2._instance.open(openData);
        }
        public static async hide(): Promise<void> {
            if (WeActionModifyPanel2._instance) {
                await WeActionModifyPanel2._instance.close();
            }
        }

        public constructor() {
            super();

            this.skinName = "resource/skins/warEvent/WeActionModifyPanel2.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnSwitchPlayerIndex,   callback: this._onTouchedBtnSwitchPlayerIndex },
                { ui: this._btnSwitchPlayerState,   callback: this._onTouchedBtnSwitchPlayerState },
                { ui: this._btnType,                callback: this._onTouchedBtnType },
                { ui: this._btnBack,                callback: this.close },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,            callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.WarEventFullDataChanged,    callback: this._onNotifyWarEventFullDataChanged },
            ]);

            this._updateView();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyWarEventFullDataChanged(e: egret.Event): void {
            this._updateLabelPlayerIndex();
            this._updateLabelPlayerState();
            this._updateLabelTips();
        }

        private _onTouchedBtnSwitchPlayerIndex(e: egret.TouchEvent): void {
            const action        = this._getOpenData().action.WeaSetPlayerAliveState;
            action.playerIndex  = ((action.playerIndex || 0) % CommonConstants.WarMaxPlayerIndex) + 1;

            Notify.dispatch(Notify.Type.WarEventFullDataChanged);
        }

        private _onTouchedBtnSwitchPlayerState(e: egret.TouchEvent): void {
            const action    = this._getOpenData().action.WeaSetPlayerAliveState;
            const state     = action.playerAliveState;
            if (state === PlayerAliveState.Alive) {
                action.playerAliveState = PlayerAliveState.Dying;
            } else if (state === PlayerAliveState.Dying) {
                action.playerAliveState = PlayerAliveState.Dead;
            } else {
                action.playerAliveState = PlayerAliveState.Alive;
            }

            Notify.dispatch(Notify.Type.WarEventFullDataChanged);
        }

        private _onTouchedBtnType(e: egret.TouchEvent): void {
            const openData = this._getOpenData();
            WeActionTypeListPanel.show({
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
            this._labelTitle.text               = `${Lang.getText(Lang.Type.B0533)} A${this._getOpenData().action.WeaCommonData.actionId}`;
            this._btnType.label                 = Lang.getText(Lang.Type.B0516);
            this._btnSwitchPlayerIndex.label    = Lang.getText(Lang.Type.B0520);
            this._btnSwitchPlayerState.label    = Lang.getText(Lang.Type.B0520);
            this._btnBack.label                 = Lang.getText(Lang.Type.B0146);
            this._labelPlayerIndexTitle.text    = Lang.getText(Lang.Type.B0521);
            this._labelPlayerStateTitle.text    = Lang.getText(Lang.Type.B0523);

            this._updateLabelPlayerState();
            this._updateLabelTips();
        }

        private _updateLabelPlayerIndex(): void {
            this._labelPlayerIndex.text = `P${this._getOpenData().action.WeaSetPlayerAliveState.playerIndex || `??`}`;
        }

        private _updateLabelPlayerState(): void {
            this._labelPlayerState.text = Lang.getPlayerAliveStateName(this._getOpenData().action.WeaSetPlayerAliveState.playerAliveState);
        }

        private _updateLabelTips(): void {
            this._labelTips.text = getTipsForPlayerAliveState(this._getOpenData().action.WeaSetPlayerAliveState.playerAliveState);
        }
    }

    function getTipsForPlayerAliveState(playerAliveState: PlayerAliveState): string {
        switch (playerAliveState) {
            case PlayerAliveState.Alive : return Lang.getText(Lang.Type.A0214);
            case PlayerAliveState.Dying : return Lang.getText(Lang.Type.A0215);
            case PlayerAliveState.Dead  : return Lang.getText(Lang.Type.A0216);
            default                     : return undefined;
        }
    }
}
