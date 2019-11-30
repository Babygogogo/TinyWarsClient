
namespace TinyWars.Replay {
    import Notify       = Utility.Notify;
    import Lang         = Utility.Lang;
    import StageManager = Utility.StageManager;
    import Types        = Utility.Types;

    const _CELL_WIDTH           = 80;
    const _LEFT_X               = 80;
    const _RIGHT_X              = 880;

    export class ReplaConsolePanel extends GameUi.UiPanel {
        protected readonly _LAYER_TYPE = Utility.Types.LayerType.Hud0;
        protected readonly _IS_EXCLUSIVE = false;

        private static _instance: ReplaConsolePanel;

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
        private _btnLastTurn                : GameUi.UiButton;
        private _btnJumpCurrentTurn         : GameUi.UiButton;
        private _groupActionEditon          : eui.Group;
        private _labelCurrentActionTitle    : GameUi.UiLabel;
        private _btnFirstAction             : GameUi.UiButton;
        private _btnPrevAction              : GameUi.UiButton;
        private _inputCurrentAction         : GameUi.UiTextInput;
        private _btnNextAction              : GameUi.UiButton;
        private _btnLastAction              : GameUi.UiButton;
        private _btnJumpCurrentAction       : GameUi.UiButton;
        private _labelName                  : GameUi.UiLabel;
        private _groupControlEdtion         : eui.Group;
        private _btnStartReplay             : GameUi.UiButton;
        private _btnPauseReplay             : GameUi.UiButton;
        private _bthHideNotify              : GameUi.UiButton;
        private _btnShowNotify              : GameUi.UiButton;


        public static show(): void {
            if (!ReplaConsolePanel._instance) {
                ReplaConsolePanel._instance = new ReplaConsolePanel();
            }
            ReplaConsolePanel._instance.open();
        }

        public static hide(): void {
            if (ReplaConsolePanel._instance) {
                ReplaConsolePanel._instance.close();
            }
        }

        public static getInstance(): ReplaConsolePanel {
            return ReplaConsolePanel._instance;
        }

        public constructor() {
            super();

            this._setAutoAdjustHeightEnabled();
            this.skinName = `resource/skins/replay/ReplaConsolePanel.exml`;
        }

        protected _onFirstOpened(): void {
            this._notifyListeners = [];
        }

        protected _onOpened(): void {
            this._updateView();
        }

        protected _onClosed(): void {

        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Callbacks.
        ////////////////////////////////////////////////////////////////////////////////////////////////////

        private _onNotifyGlobalTouchBegin(e: egret.Event): void {

        }

        ////////////////////////////////////////////////////////////////////////////////////////////////////
        // Functions for view.
        ////////////////////////////////////////////////////////////////////////////////////////////////////
        private _updateView(): void {
            this._updateComponentsForLanguage();
        }

        private _updateComponentsForLanguage(): void {
            this._labelName.text                = Lang.getText(Lang.Type.B0234);
            this._labelPlayRateTitle.text       = Lang.getText(Lang.Type.B0234);
            this._labelPlayRate.text            = Lang.getText(Lang.Type.B0234);
            this._labelCurrentTurnTitle.text    = Lang.getText(Lang.Type.B0234);
            this._labelCurrentActionTitle.text  = Lang.getText(Lang.Type.B0234);
            this._btnHideConsole.label          = Lang.getText(Lang.Type.B0234);
            this._btnJumpCurrentTurn.label      = Lang.getText(Lang.Type.B0234);
            this._btnJumpCurrentAction.label    = Lang.getText(Lang.Type.B0234);
            this._btnStartReplay.label          = Lang.getText(Lang.Type.B0234);
            this._btnPauseReplay.label          = Lang.getText(Lang.Type.B0234);
        }
    }
}
