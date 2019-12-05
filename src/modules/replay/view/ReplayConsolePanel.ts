
namespace TinyWars.Replay {
    import FloatText     = Utility.FloatText;
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;

    export class ReplayConsolePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ReplayConsolePanel;

        private _group                      : eui.Group;
        private _labelPlayRateTitle         : GameUi.UiLabel;
        private _btnDecreasePlayRate        : GameUi.UiButton;
        private _btnIncreasePlayRate        : GameUi.UiButton;
        private _labelPlayRate              : GameUi.UiLabel;
        private _btnHideConsole             : GameUi.UiButton;
        private _groupTurnEditon            : eui.Group;
        private _labelCurrentTurnTitle      : GameUi.UiLabel;
        private _btnFirstTurn               : GameUi.UiButton;
        private _btnPrevTurn                : GameUi.UiButton;
        private _btnNextTurn                : GameUi.UiButton;
        private _inputCurrentTurn           : GameUi.UiTextInput;
        private _labelMaxTurn               : GameUi.UiLabel;
        private _btnLastTurn                : GameUi.UiButton;
        private _btnJumpCurrentTurn         : GameUi.UiButton;
        private _groupActionEditon          : eui.Group;
        private _labelCurrentActionTitle    : GameUi.UiLabel;
        private _btnFirstAction             : GameUi.UiButton;
        private _btnPrevAction              : GameUi.UiButton;
        private _inputCurrentAction         : GameUi.UiTextInput;
        private _labelMaxAction             : GameUi.UiLabel;
        private _btnNextAction              : GameUi.UiButton;
        private _btnLastAction              : GameUi.UiButton;
        private _btnJumpCurrentAction       : GameUi.UiButton;
        private _labelName                  : GameUi.UiLabel;
        private _groupControlEdtion         : eui.Group;
        private _btnStartReplay             : GameUi.UiButton;
        private _btnPauseReplay             : GameUi.UiButton;
        private _btnHideNotify              : GameUi.UiButton;
        private _btnShowNotify              : GameUi.UiButton;

        private _war                        : ReplayWar;


        public static show(): void {
            if (!ReplayConsolePanel._instance) {
                ReplayConsolePanel._instance = new ReplayConsolePanel();
            }
            ReplayConsolePanel._instance.open();
        }

        public static hide(): void {
            if (ReplayConsolePanel._instance) {
                ReplayConsolePanel._instance.close();
            }
        }

        public static getInstance(): ReplayConsolePanel {
            return ReplayConsolePanel._instance;
        }

        public static getIsOpening(): boolean {
            const instance = ReplayConsolePanel._instance;
            return instance ? instance.getIsOpening() : false;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/replay/ReplayConsolePanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [
                { type: Notify.Type.ReplayAutoReplayChanged,    callback: this._onNotifyReplayAutoReplayChanged },
                { type: Notify.Type.ReplayInfoDisplayChanged,   callback: this._onNotifyReplayInfoDisplayChanged },
                { type: Notify.Type.ReplayPlaybackRateChanged,  callback: this._onNotifyReplayPlaybackRateChanged},
                { type: Notify.Type.BwTurnIndexChanged,         callback: this._onNotifyBwTurnIndexChanged },
                { type: Notify.Type.ActionIDChanged,            callback: this._onNotifyActionIDChanged },
            ];
            this._uiListeners = [
                { ui: this._btnHideConsole,      callback: this._onTouchedBtnHideConsole },
                { ui: this._btnJumpCurrentTurn,  callback: this._onTouchedJumpCurrentTurn },
                { ui: this._btnIncreasePlayRate, callback: this._onTouchedBtnIncreasePlayRate },
                { ui: this._btnDecreasePlayRate, callback: this._onTouchedBtnDecreasePlayRate },
                { ui: this._btnStartReplay,      callback: this._onTouchedStartReplay },
                { ui: this._btnPauseReplay,      callback: this._onTouchedPauseReplay },
                { ui: this._btnHideNotify,       callback: this._onTouchedBtnHideNotify },
                { ui: this._btnShowNotify,       callback: this._onTouchedBtnShowNotify },
                { ui: this._btnNextTurn,         callback: this._onTouchedBtnNextTurn },
                { ui: this._btnPrevTurn,         callback: this._onTouchedBtnPrevTurn },
            ];
            this._updateComponentsForLanguage();
        }

        protected _onOpened(): void {
            this._war = ReplayModel.getWar();
            this._updatebtnvvisible();
            this._updateNotifyButton();
            this._inputCurrentTurn.textDisplay.text     = `${this._war.getTurnManager().getTurnIndex()}`
            this._inputCurrentAction.textDisplay.text   = `${this._war.getNextActionId()}`
            this._labelPlayRate.text                    = `x${this._war.getReplayPlaybackRate().toFixed(1)}`
        }

        protected _onClosed(): void {

        }


        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        private _onNotifyReplayAutoReplayChanged(e: egret.Event): void {
            this._updateAutoReplayButton();
        }

        private _onNotifyReplayInfoDisplayChanged(e: egret.Event): void {
            this._updateNotifyButton();
        }


        private _onNotifyBwTurnIndexChanged(e: egret.Event): void {
            this._inputCurrentTurn.textDisplay.text = `${this._war.getTurnManager().getTurnIndex()}`
        }

        private _onNotifyActionIDChanged(e: egret.Event): void {
            this._inputCurrentAction.textDisplay.text = `${this._war.getNextActionId()}`
        }

        private _onNotifyReplayPlaybackRateChanged(e: egret.Event): void {
            this._labelPlayRate.text = `x${this._war.getReplayPlaybackRate().toFixed(1)}`
        }

        private _onTouchedBtnHideConsole(e: egret.Event): void {
            this.close();
        }

        private _onTouchedBtnHideNotify(e: egret.Event): void {
            this._war.setIsInfoDisplay(false);
        }

        private _onTouchedBtnShowNotify(e: egret.Event): void {
            this._war.setIsInfoDisplay(true);
        }

        private _onTouchedJumpCurrentTurn(e: egret.Event): void {
            FloatText.show("TODO");
        }

        private _onTouchedBtnIncreasePlayRate(e: egret.Event): void {
            const war = this._war;
            war.setReplayPlaybackRateIndex(war.getReplayPlaybackRateIndex()+1);
        }

        private _onTouchedBtnDecreasePlayRate(e: egret.Event): void {
            const war = this._war;
            war.setReplayPlaybackRateIndex(war.getReplayPlaybackRateIndex()-1);
        }


        private _onTouchedStartReplay(e: egret.Event): void {
            const war = this._war;
            if (war.checkIsInEnd()) {
                FloatText.show(Lang.getText(Lang.Type.A0041));
            } else {
                this._war.setIsAutoReplay(true);
            }
        }

        private _onTouchedPauseReplay(e: egret.Event): void {
            this._war.setIsAutoReplay(false);
        }

        private _onTouchedBtnPrevTurn(e: egret.Event): void {
            const war = this._war;
            war.setIsAutoReplay(false);

            if (!war.getIsRunning()) {
                FloatText.show(Lang.getText(Lang.Type.A0040));
            } else if (war.getIsExecutingAction()) {
                FloatText.show(Lang.getText(Lang.Type.A0044));
            } else if (war.checkIsInBeginning()) {
                FloatText.show(Lang.getText(Lang.Type.A0042));
            } else {
                war.loadPreviousCheckPoint();
            }
        }

        private _onTouchedBtnNextTurn(e: egret.Event): void {
            const war = this._war;
            war.setIsAutoReplay(false);

            if (!war.getIsRunning()) {
                FloatText.show(Lang.getText(Lang.Type.A0040));
            } else if (war.getIsExecutingAction()) {
                FloatText.show(Lang.getText(Lang.Type.A0044));
            } else if (war.checkIsInEnd()) {
                FloatText.show(Lang.getText(Lang.Type.A0043));
            } else {
                war.loadNextCheckPoint();
            }
        }




        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        private _updateView(): void {
            // this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelName.text                = Lang.getText(Lang.Type.B0255);
            this._btnHideConsole.label          = Lang.getText(Lang.Type.B0261);
            this._labelPlayRateTitle.text       = `${Lang.getText(Lang.Type.B0256)}:`;
            this._labelCurrentTurnTitle.text    = `${Lang.getText(Lang.Type.B0091)}:`;
            this._labelCurrentActionTitle.text  = `${Lang.getText(Lang.Type.B0254)}:`;
            this._btnJumpCurrentTurn.label      = Lang.getText(Lang.Type.B0257);
            this._btnJumpCurrentAction.label    = Lang.getText(Lang.Type.B0258);
            this._btnStartReplay.label          = Lang.getText(Lang.Type.B0249);
            this._btnPauseReplay.label          = Lang.getText(Lang.Type.B0250);
            this._btnHideNotify.label           = Lang.getText(Lang.Type.B0259);
            this._btnShowNotify.label           = Lang.getText(Lang.Type.B0260);
        }

        private _updatebtnvvisible(): void{
            this._updateAutoReplayButton();
            this._updateNotifyButton();
        }

        private _updateAutoReplayButton(): void{
            this._btnStartReplay.visible = !this._war.getIsAutoReplay();
            this._btnPauseReplay.visible = this._war.getIsAutoReplay();
        }

        private _updateNotifyButton(): void{
            this._btnShowNotify.visible = !this._war.getIsInfoDisplay();
            this._btnHideNotify.visible = this._war.getIsInfoDisplay();
        }
    }
}
