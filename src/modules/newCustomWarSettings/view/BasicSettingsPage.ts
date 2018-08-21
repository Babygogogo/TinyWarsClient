
namespace NewCustomWarSettings {
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import TemplateMapModel = TemplateMap.TemplateMapModel;

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

        protected _mapInfo: ProtoTypes.IMapInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/newCustomWarSettings/BasicSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._inputWarName,       callback: this._onFocusOutInputWarName,     eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputWarPassword,   callback: this._onFocusOutInputWarPassword, eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputWarComment,    callback: this._onFocusOutInputWarComment,  eventType: egret.Event.FOCUS_OUT, },
                { ui: this._btnPrevPlayerIndex, callback: this._onTouchedBtnPrevPlayerIndex, },
                { ui: this._btnNextPlayerIndex, callback: this._onTouchedBtnNextPlayerIndex, },
                { ui: this._btnPrevTeam,        callback: this._onTouchedBtnPrevTeam, },
                { ui: this._btnNextTeam,        callback: this._onTouchedBtnNextTeam, },
                { ui: this._btnHelpTeam,        callback: this._onTouchedBtnHelpTeam, },
                { ui: this._btnPrevFog,         callback: this._onTouchedBtnPrevFog, },
                { ui: this._btnNextFog,         callback: this._onTouchedBtnNextFog, },
                { ui: this._btnHelpFog,         callback: this._onTouchedBtnHelpFog, },
                { ui: this._btnPrevTimeLimit,   callback: this._onTouchedBtnPrevTimeLimit, },
                { ui: this._btnNextTimeLimit,   callback: this._onTouchedBtnNextTimeLimit, },
                { ui: this._btnHelpTimeLimit,   callback: this._onTouchedBtnHelpTimeLimit, },
            ];
        }

        protected _onOpened(): void {
            this._mapInfo = TemplateMapModel.getMapInfo(SettingsModel.getMapIndexKeys());

            this._updateLabelMapName();
            this._updateLabelPlayersCount();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onFocusOutInputWarName(e: egret.Event): void {
            FloatText.show("AAAA");
        }

        private _onFocusOutInputWarPassword(e: egret.Event): void {
            FloatText.show("AAAA");
        }

        private _onFocusOutInputWarComment(e: egret.Event): void {
            FloatText.show("AAAA");
        }

        private _onTouchedBtnPrevPlayerIndex(e: egret.TouchEvent): void {

        }

        private _onTouchedBtnNextPlayerIndex(e: egret.TouchEvent): void {

        }

        private _onTouchedBtnPrevTeam(e: egret.TouchEvent): void {

        }

        private _onTouchedBtnNextTeam(e: egret.TouchEvent): void {

        }

        private _onTouchedBtnHelpTeam(e: egret.TouchEvent): void {
            Common.HelpPanel.open({
                title: "AAAAAAAAA",
                content: `BBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\nBBBBBBBB\nCCCCCCCCCCCCC\nDDDDDDDDDDDDD\n`,
            });
        }

        private _onTouchedBtnPrevFog(e: egret.TouchEvent): void {

        }

        private _onTouchedBtnNextFog(e: egret.TouchEvent): void {

        }

        private _onTouchedBtnHelpFog(e: egret.TouchEvent): void {

        }

        private _onTouchedBtnPrevTimeLimit(e: egret.TouchEvent): void {

        }

        private _onTouchedBtnNextTimeLimit(e: egret.TouchEvent): void {

        }

        private _onTouchedBtnHelpTimeLimit(e: egret.TouchEvent): void {

        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateLabelMapName(): void {
            this._labelMapName.text = this._mapInfo.mapName;
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapInfo.playersCount;
        }
    }
}
