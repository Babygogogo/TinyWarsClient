
namespace TinyWars.Replay {
    import ConfirmPanel     = Common.ConfirmPanel;
    import FloatText        = Utility.FloatText;
    import Lang             = Utility.Lang;
    import Helpers          = Utility.Helpers;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;

    export class ReplayTopPanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE   = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ReplayTopPanel;

        private _labelPlayer    : GameUi.UiLabel;
        private _labelFund      : GameUi.UiLabel;
        private _labelEnergy    : GameUi.UiLabel;
        private _btnFastRewind  : GameUi.UiButton;
        private _btnFastForward : GameUi.UiButton;
        private _btnPlay        : GameUi.UiButton;
        private _btnPause       : GameUi.UiButton;
        private _btnUnitList    : GameUi.UiButton;
        private _btnMenu        : GameUi.UiButton;

        private _war    : ReplayWar;

        public static show(): void {
            if (!ReplayTopPanel._instance) {
                ReplayTopPanel._instance = new ReplayTopPanel();
            }
            ReplayTopPanel._instance.open();
        }

        public static hide(): void {
            if (ReplayTopPanel._instance) {
                ReplayTopPanel._instance.close();
            }
        }

        private constructor() {
            super();

            this.skinName = "resource/skins/replay/ReplayTopPanel.exml";
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.McwPlayerFundChanged,           callback: this._onNotifyMcwPlayerFundChanged },
                { type: Notify.Type.McwPlayerIndexInTurnChanged,    callback: this._onNotifyMcwPlayerIndexInTurnChanged },
                { type: Notify.Type.McwPlayerEnergyChanged,         callback: this._onNotifyMcwPlayerEnergyChanged },
            ];
            this._uiListeners = [
                { ui: this._btnFastRewind,      callback: this._onTouchedBtnFastRewind },
                { ui: this._btnFastForward,     callback: this._onTouchedBtnFastForward, },
                { ui: this._btnPlay,            callback: this._onTouchedBtnPlay, },
                { ui: this._btnPause,           callback: this._onTouchedBtnPause, },
                { ui: this._btnUnitList,        callback: this._onTouchedBtnUnitList, },
                { ui: this._btnMenu,            callback: this._onTouchedBtnMenu, },
            ];
        }

        protected _onOpened(): void {
            this._war = ReplayModel.getWar();
            this._updateView();
        }

        protected _onClosed(): void {
            delete this._war;
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _onNotifyMcwPlayerFundChanged(e: egret.Event): void {
            this._updateLabelFund();
        }
        private _onNotifyMcwPlayerIndexInTurnChanged(e: egret.Event): void {
            this._updateView();
        }
        private _onNotifyMcwPlayerEnergyChanged(e: egret.Event): void {
            this._updateLabelEnergy();
        }

        private _onTouchedBtnFastRewind(e: egret.TouchEvent): void {
            FloatText.show("TODO");
        }
        private _onTouchedBtnFastForward(e: egret.TouchEvent): void {
            FloatText.show("TODO");
        }
        private _onTouchedBtnPlay(e: egret.TouchEvent): void {
            this._war.setIsAutoReplay(true);
            this._updateView();
        }
        private _onTouchedBtnPause(e: egret.TouchEvent): void {
            this._war.setIsAutoReplay(false);
            this._updateView();
        }
        private _onTouchedBtnUnitList(e: egret.TouchEvent): void {
            this._war.getField().getActionPlanner().setStateIdle();
            ReplayUnitListPanel.show();
        }
        private _onTouchedBtnMenu(e: egret.TouchEvent): void {
            const actionPlanner = this._war.getActionPlanner();
            if (!actionPlanner.checkIsStateRequesting()) {
                actionPlanner.setStateIdle();
            }
            ReplayWarMenuPanel.show();
        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for views.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateLabelPlayer();
            this._updateLabelFund();
            this._updateLabelEnergy();
            this._updateBtnPlay();
            this._updateBtnPause();
        }

        private _updateLabelPlayer(): void {
            const war                   = this._war;
            const player                = war.getPlayerInTurn();
            this._labelPlayer.text      = `${Lang.getText(Lang.Type.B0031)}:${player.getNickname()} (${Helpers.getColorTextForPlayerIndex(player.getPlayerIndex())})`;
        }

        private _updateLabelFund(): void {
            const war               = this._war;
            const playerInTurn      = war.getPlayerInTurn();
            this._labelFund.text    = `${Lang.getText(Lang.Type.B0032)}: ${playerInTurn.getFund()}`;
        }

        private _updateLabelEnergy(): void {
            // TODO
            this._labelEnergy.visible = false;
        }

        private _updateBtnPlay(): void {
            this._btnPlay.visible = !this._war.getIsAutoReplay();
        }

        private _updateBtnPause(): void {
            this._btnPause.visible = this._war.getIsAutoReplay();
        }
    }
}
