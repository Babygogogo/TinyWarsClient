
namespace TinyWars.MultiCustomWarRoom {
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import FloatText        = Utility.FloatText;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import HelpPanel        = Common.HelpPanel;
    import TemplateMapModel = WarMap.WarMapModel;

    export class McwrCreateBasicSettingsPage extends GameUi.UiTabPage {
        private _labelMapName       : GameUi.UiLabel;
        private _labelPlayersCount  : GameUi.UiLabel;

        private _inputWarName       : GameUi.UiTextInput;
        private _inputWarPassword   : GameUi.UiTextInput;
        private _inputWarComment    : GameUi.UiTextInput;

        private _btnPrevPlayerIndex : GameUi.UiButton;
        private _btnNextPlayerIndex : GameUi.UiButton;
        private _labelPlayerIndex   : GameUi.UiLabel;
        private _btnHelpPlayerIndex : GameUi.UiButton;

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

            this.skinName = "resource/skins/multiCustomWarRoom/McwrCreateBasicSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._inputWarName,       callback: this._onFocusOutInputWarName,     eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputWarPassword,   callback: this._onFocusOutInputWarPassword, eventType: egret.Event.FOCUS_OUT, },
                { ui: this._inputWarComment,    callback: this._onFocusOutInputWarComment,  eventType: egret.Event.FOCUS_OUT, },
                { ui: this._btnPrevPlayerIndex, callback: this._onTouchedBtnPrevPlayerIndex, },
                { ui: this._btnNextPlayerIndex, callback: this._onTouchedBtnNextPlayerIndex, },
                { ui: this._btnHelpPlayerIndex, callback: this._onTouchedBtnHelpPlayerIndex, },
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
            this._mapInfo = McwrModel.getCreateWarMapInfo();

            this._updateInputWarName();
            this._updateInputWarPassword();
            this._updateInputWarComment();
            this._updateLabelMapName();
            this._updateLabelPlayersCount();
            this._updateLabelPlayerIndex();
            this._updateLabelTeam();
            this._updateLabelFog();
            this._updateLabelTimeLimit();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onFocusOutInputWarName(e: egret.Event): void {
            McwrModel.setCreateWarName(this._inputWarName.text);
        }

        private _onFocusOutInputWarPassword(e: egret.Event): void {
            McwrModel.setCreateWarPassword(this._inputWarPassword.text);
        }

        private _onFocusOutInputWarComment(e: egret.Event): void {
            McwrModel.setCreateWarComment(this._inputWarComment.text);
        }

        private _onTouchedBtnPrevPlayerIndex(e: egret.TouchEvent): void {
            McwrModel.setCreateWarPrevPlayerIndex();
            this._updateLabelPlayerIndex();
        }

        private _onTouchedBtnNextPlayerIndex(e: egret.TouchEvent): void {
            McwrModel.setCreateWarNextPlayerIndex();
            this._updateLabelPlayerIndex();
        }

        private _onTouchedBtnHelpPlayerIndex(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.BigType.B01, Lang.SubType.S18),
                content: Lang.getRichText(Lang.RichType.R000),
            });
        }

        private _onTouchedBtnPrevTeam(e: egret.TouchEvent): void {
            McwrModel.setCreateWarPrevTeamIndex();
            this._updateLabelTeam();
        }

        private _onTouchedBtnNextTeam(e: egret.TouchEvent): void {
            McwrModel.setCreateWarNextTeamIndex();
            this._updateLabelTeam();
        }

        private _onTouchedBtnHelpTeam(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.BigType.B01, Lang.SubType.S19),
                content: Lang.getRichText(Lang.RichType.R001),
            });
        }

        private _onTouchedBtnPrevFog(e: egret.TouchEvent): void {
            McwrModel.setCreateWarPrevHasFog();
            this._updateLabelFog();
        }

        private _onTouchedBtnNextFog(e: egret.TouchEvent): void {
            McwrModel.setCreateWarNextHasFog();
            this._updateLabelFog();
        }

        private _onTouchedBtnHelpFog(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.BigType.B01, Lang.SubType.S20),
                content: Lang.getRichText(Lang.RichType.R002),
            });
        }

        private _onTouchedBtnPrevTimeLimit(e: egret.TouchEvent): void {
            McwrModel.setCreateWarPrevTimeLimit();
            this._updateLabelTimeLimit();
        }

        private _onTouchedBtnNextTimeLimit(e: egret.TouchEvent): void {
            McwrModel.setCreateWarNextTimeLimit();
            this._updateLabelTimeLimit();
        }

        private _onTouchedBtnHelpTimeLimit(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.BigType.B01, Lang.SubType.S21),
                content: Lang.getRichText(Lang.RichType.R003),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateInputWarName(): void {
            this._inputWarName.text = McwrModel.getCreateWarName();
        }

        private _updateInputWarPassword(): void {
            this._inputWarPassword.text = McwrModel.getCreateWarPassword();
        }

        private _updateInputWarComment(): void {
            this._inputWarComment.text = McwrModel.getCreateWarComment();
        }

        private _updateLabelMapName(): void {
            this._labelMapName.text = this._mapInfo.mapName;
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapInfo.playersCount;
        }

        private _updateLabelPlayerIndex(): void {
            const index = McwrModel.getCreateWarPlayerIndex();
            this._labelPlayerIndex.text = `${index} (${Helpers.getColorText(index)})`;
        }

        private _updateLabelTeam(): void {
            this._labelTeam.text = Helpers.getTeamText(McwrModel.getCreateWarTeamIndex());
        }

        private _updateLabelFog(): void {
            this._labelFog.text = Lang.getText(Lang.BigType.B01, McwrModel.getCreateWarHasFog() ? Lang.SubType.S12 : Lang.SubType.S13);
        }

        private _updateLabelTimeLimit(): void {
            this._labelTimeLimit.text = Helpers.getTimeText(McwrModel.getCreateWarTimeLimit());
        }
    }
}