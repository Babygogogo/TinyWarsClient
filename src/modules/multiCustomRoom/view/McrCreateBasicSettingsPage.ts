
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import HelpPanel        = Common.HelpPanel;

    export class McrCreateBasicSettingsPage extends GameUi.UiTabPage {
        private _labelMapName       : GameUi.UiLabel;
        private _labelPlayersCount  : GameUi.UiLabel;

        private _labelWarNameTitle  : GameUi.UiLabel;
        private _inputWarName       : GameUi.UiTextInput;

        private _labelWarPasswordTitle  : GameUi.UiLabel;
        private _inputWarPassword       : GameUi.UiTextInput;

        private _labelWarCommentTitle   : GameUi.UiLabel;
        private _inputWarComment        : GameUi.UiTextInput;

        private _labelPlayerIndexTitle  : GameUi.UiLabel;
        private _btnPrevPlayerIndex     : GameUi.UiButton;
        private _btnNextPlayerIndex     : GameUi.UiButton;
        private _labelPlayerIndex       : GameUi.UiLabel;
        private _btnHelpPlayerIndex     : GameUi.UiButton;

        private _labelTeamTitle : GameUi.UiLabel;
        private _btnPrevTeam    : GameUi.UiButton;
        private _btnNextTeam    : GameUi.UiButton;
        private _labelTeam      : GameUi.UiLabel;
        private _btnHelpTeam    : GameUi.UiButton;

        private _labelFogTitle  : GameUi.UiLabel;
        private _btnPrevFog     : GameUi.UiButton;
        private _btnNextFog     : GameUi.UiButton;
        private _labelFog       : GameUi.UiLabel;
        private _btnHelpFog     : GameUi.UiButton;

        private _labelTimeLimitTitle: GameUi.UiLabel;
        private _btnPrevTimeLimit   : GameUi.UiButton;
        private _btnNextTimeLimit   : GameUi.UiButton;
        private _labelTimeLimit     : GameUi.UiLabel;
        private _btnHelpTimeLimit   : GameUi.UiButton;

        private _labelCoName        : GameUi.UiLabel;
        private _btnChangeCo        : GameUi.UiLabel;

        protected _mapInfo: ProtoTypes.IMapDynamicInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateBasicSettingsPage.exml";
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
                { ui: this._btnChangeCo,        callback: this._onTouchedBtnChangeCo, },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
        }

        protected _onOpened(): void {
            this._mapInfo = McrModel.getCreateWarMapInfo();

            this._updateTitles();
            this._updateInputWarName();
            this._updateInputWarPassword();
            this._updateInputWarComment();
            this._updateLabelMapName();
            this._updateLabelPlayersCount();
            this._updateLabelPlayerIndex();
            this._updateLabelTeam();
            this._updateLabelFog();
            this._updateLabelTimeLimit();
            this._updateLabelCoName();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateTitles();
        }

        private _onFocusOutInputWarName(e: egret.Event): void {
            McrModel.setCreateWarName(this._inputWarName.text);
        }

        private _onFocusOutInputWarPassword(e: egret.Event): void {
            McrModel.setCreateWarPassword(this._inputWarPassword.text);
        }

        private _onFocusOutInputWarComment(e: egret.Event): void {
            McrModel.setCreateWarComment(this._inputWarComment.text);
        }

        private _onTouchedBtnPrevPlayerIndex(e: egret.TouchEvent): void {
            McrModel.setCreateWarPrevPlayerIndex();
            this._updateLabelPlayerIndex();
        }

        private _onTouchedBtnNextPlayerIndex(e: egret.TouchEvent): void {
            McrModel.setCreateWarNextPlayerIndex();
            this._updateLabelPlayerIndex();
        }

        private _onTouchedBtnHelpPlayerIndex(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0018),
                content: Lang.getRichText(Lang.RichType.R0000),
            });
        }

        private _onTouchedBtnPrevTeam(e: egret.TouchEvent): void {
            McrModel.setCreateWarPrevTeamIndex();
            this._updateLabelTeam();
        }

        private _onTouchedBtnNextTeam(e: egret.TouchEvent): void {
            McrModel.setCreateWarNextTeamIndex();
            this._updateLabelTeam();
        }

        private _onTouchedBtnHelpTeam(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0019),
                content: Lang.getRichText(Lang.RichType.R0001),
            });
        }

        private _onTouchedBtnPrevFog(e: egret.TouchEvent): void {
            McrModel.setCreateWarPrevHasFog();
            this._updateLabelFog();
        }

        private _onTouchedBtnNextFog(e: egret.TouchEvent): void {
            McrModel.setCreateWarNextHasFog();
            this._updateLabelFog();
        }

        private _onTouchedBtnHelpFog(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private _onTouchedBtnPrevTimeLimit(e: egret.TouchEvent): void {
            McrModel.setCreateWarPrevTimeLimit();
            this._updateLabelTimeLimit();
        }

        private _onTouchedBtnNextTimeLimit(e: egret.TouchEvent): void {
            McrModel.setCreateWarNextTimeLimit();
            this._updateLabelTimeLimit();
        }

        private _onTouchedBtnHelpTimeLimit(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0021),
                content: Lang.getRichText(Lang.RichType.R0003),
            });
        }

        private _onTouchedBtnChangeCo(e: egret.TouchEvent): void {
            McrCreateSettingsPanel.hide();
            McrCreateCoListPanel.show(McrModel.getCreateWarCoId());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateTitles(): void {
            this._labelWarNameTitle.text        = `${Lang.getText(Lang.Type.B0185)}: `;
            this._labelWarPasswordTitle.text    = `${Lang.getText(Lang.Type.B0186)}: `;
            this._labelWarCommentTitle.text     = `${Lang.getText(Lang.Type.B0187)}: `;
            this._labelPlayerIndexTitle.text    = `${Lang.getText(Lang.Type.B0018)}: `;
            this._labelTeamTitle.text           = `${Lang.getText(Lang.Type.B0019)}: `;
            this._labelFogTitle.text            = `${Lang.getText(Lang.Type.B0020)}: `;
            this._labelTimeLimitTitle.text      = `${Lang.getText(Lang.Type.B0188)}: `;
        }

        private _updateInputWarName(): void {
            this._inputWarName.text = McrModel.getCreateWarName();
        }

        private _updateInputWarPassword(): void {
            this._inputWarPassword.text = McrModel.getCreateWarPassword();
        }

        private _updateInputWarComment(): void {
            this._inputWarComment.text = McrModel.getCreateWarComment();
        }

        private _updateLabelMapName(): void {
            this._labelMapName.text = this._mapInfo.mapName;
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapInfo.playersCount;
        }

        private _updateLabelPlayerIndex(): void {
            const index = McrModel.getCreateWarPlayerIndex();
            this._labelPlayerIndex.text = `${index} (${Helpers.getColorTextForPlayerIndex(index)})`;
        }

        private _updateLabelTeam(): void {
            this._labelTeam.text = Helpers.getTeamText(McrModel.getCreateWarTeamIndex());
        }

        private _updateLabelFog(): void {
            this._labelFog.text = Lang.getText(McrModel.getCreateWarHasFog() ? Lang.Type.B0012 : Lang.Type.B0013);
        }

        private _updateLabelTimeLimit(): void {
            this._labelTimeLimit.text = Helpers.getTimeDurationText(McrModel.getCreateWarTimeLimit());
        }

        private _updateLabelCoName(): void {
            const coId              = McrModel.getCreateWarCoId();
            this._labelCoName.text  = coId == null
                ? `(${Lang.getText(Lang.Type.B0001)}CO)`
                : ConfigManager.getCoBasicCfg(ConfigManager.getNewestConfigVersion(), coId).name;
        }
    }
}
