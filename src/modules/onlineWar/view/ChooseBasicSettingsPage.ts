
namespace OnlineWar {
    export class ChooseBasicSettingsPage extends GameUi.UiTabPage {
        private _btnHelpPassword: GameUi.UiButton;

        protected _dataForOpen: any;

        public constructor() {
            super();

            this.skinName = "resource/skins/onlineWar/ChooseBasicSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnHelpPassword, callback: this._onTouchedBtnHelpPassword },
            ];
        }

        protected _onOpened(): void {

        }

        private _onTouchedBtnHelpPassword(e: egret.TouchEvent): void {
            Common.HelpPanel.open({
                title: "AAAAAAAAA",
                content: `BBBBBBB
                CCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\n`,
            });
        }
    }
}
