
namespace NewCustomWarSettings {
    export class BasicSettingsPage extends GameUi.UiTabPage {
        private _labelMapName       : GameUi.UiLabel;
        private _labelPlayersCount  : GameUi.UiLabel;

        private _inputWarName       : GameUi.UiTextInput;
        private _inputWarPassword   : GameUi.UiTextInput;
        private _inputWarComment    : GameUi.UiTextInput;

        private _btnPrevPlayerIndex : GameUi.UiButton;
        private _btnNextPlayerIndex : GameUi.UiButton;
        private _labelPlayerIndex   : GameUi.UiLabel;

        private _btnPrevTeam    : GameUi.UiButton;
        private _btnNextTeam    : GameUi.UiButton;
        private _labelTeam      : GameUi.UiLabel;
        private _btnHelpTeam    : GameUi.UiButton;

        private _btnPrevFog : GameUi.UiButton;
        private _btnNextFog : GameUi.UiButton;
        private _labelFog   : GameUi.UiLabel;
        private _btnHelpFog : GameUi.UiButton;

        private _btnPrevTimeLimit   : GameUi.UiButton;
        private _btnNextTimeLimit   : GameUi.UiButton;
        private _labelTimeLimit     : GameUi.UiLabel;
        private _btnHelpTimeLimit   : GameUi.UiButton;

        protected _dataForOpen: any;

        public constructor() {
            super();

            this.skinName = "resource/skins/newCustomWarSettings/BasicSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnHelpTeam, callback: this._onTouchedBtnHelpTeam },
            ];
        }

        protected _onOpened(): void {

        }

        private _onTouchedBtnHelpTeam(e: egret.TouchEvent): void {
            Common.HelpPanel.open({
                title: "AAAAAAAAA",
                content: `BBBBBBB
                CCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\n`,
            });
        }
    }
}
