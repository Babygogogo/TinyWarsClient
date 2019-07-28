
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes   = Utility.ProtoTypes;
    import Helpers      = Utility.Helpers;
    import Lang         = Utility.Lang;
    import HelpPanel    = Common.HelpPanel;

    export class McrJoinBasicSettingsPage extends GameUi.UiTabPage {
        private _labelMapName       : GameUi.UiLabel;
        private _labelPlayersCount  : GameUi.UiLabel;

        private _labelWarName       : GameUi.UiTextInput;
        private _labelWarPassword   : GameUi.UiTextInput;
        private _labelWarComment    : GameUi.UiTextInput;

        private _btnPrevPlayerIndex : GameUi.UiButton;
        private _btnNextPlayerIndex : GameUi.UiButton;
        private _labelPlayerIndex   : GameUi.UiLabel;
        private _btnHelpPlayerIndex : GameUi.UiButton;

        private _btnPrevTeam    : GameUi.UiButton;
        private _btnNextTeam    : GameUi.UiButton;
        private _labelTeam      : GameUi.UiLabel;
        private _btnHelpTeam    : GameUi.UiButton;

        private _labelFog   : GameUi.UiLabel;
        private _btnHelpFog : GameUi.UiButton;

        private _labelTimeLimit     : GameUi.UiLabel;
        private _btnHelpTimeLimit   : GameUi.UiButton;

        private _labelCoName    : GameUi.UiLabel;
        private _btnChangeCo    : GameUi.UiLabel;

        private _mapInfo: ProtoTypes.IMapDynamicInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinBasicSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnPrevPlayerIndex, callback: this._onTouchedBtnPrevPlayerIndex, },
                { ui: this._btnNextPlayerIndex, callback: this._onTouchedBtnNextPlayerIndex, },
                { ui: this._btnHelpPlayerIndex, callback: this._onTouchedBtnHelpPlayerIndex, },
                { ui: this._btnPrevTeam,        callback: this._onTouchedBtnPrevTeam, },
                { ui: this._btnNextTeam,        callback: this._onTouchedBtnNextTeam, },
                { ui: this._btnHelpTeam,        callback: this._onTouchedBtnHelpTeam, },
                { ui: this._btnHelpFog,         callback: this._onTouchedBtnHelpFog, },
                { ui: this._btnHelpTimeLimit,   callback: this._onTouchedBtnHelpTimeLimit, },
                { ui: this._btnChangeCo,        callback: this._onTouchedBtnChangeCo, },
            ];
        }

        protected _onOpened(): void {
            this._mapInfo = McrModel.getJoinWarMapInfo();

            this._updateLabelWarName();
            this._updateLabelWarPassword();
            this._updateLabelWarComment();
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
        private _onTouchedBtnPrevPlayerIndex(e: egret.TouchEvent): void {
            McrModel.setJoinWarPrevPlayerIndex();
            this._updateLabelPlayerIndex();
        }

        private _onTouchedBtnNextPlayerIndex(e: egret.TouchEvent): void {
            McrModel.setJoinWarNextPlayerIndex();
            this._updateLabelPlayerIndex();
        }

        private _onTouchedBtnHelpPlayerIndex(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0018),
                content: Lang.getRichText(Lang.RichType.R000),
            });
        }

        private _onTouchedBtnPrevTeam(e: egret.TouchEvent): void {
            McrModel.setJoinWarPrevTeamIndex();
            this._updateLabelTeam();
        }

        private _onTouchedBtnNextTeam(e: egret.TouchEvent): void {
            McrModel.setJoinWarNextTeamIndex();
            this._updateLabelTeam();
        }

        private _onTouchedBtnHelpTeam(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0019),
                content: Lang.getRichText(Lang.RichType.R001),
            });
        }

        private _onTouchedBtnHelpFog(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R002),
            });
        }

        private _onTouchedBtnHelpTimeLimit(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0021),
                content: Lang.getRichText(Lang.RichType.R003),
            });
        }

        private _onTouchedBtnChangeCo(e: egret.TouchEvent): void {
            McrJoinSettingsPanel.hide();
            McrCreateCoListPanel.show(McrModel.getJoinWarCoId());
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateLabelWarName(): void {
            this._labelWarName.text = McrModel.getJoinWarRoomInfo().warName || "--";
        }

        private _updateLabelWarPassword(): void {
            this._labelWarPassword.text = McrModel.getJoinWarRoomInfo().warPassword || "--";
        }

        private _updateLabelWarComment(): void {
            this._labelWarComment.text = McrModel.getJoinWarRoomInfo().warComment || "--";
        }

        private _updateLabelMapName(): void {
            this._labelMapName.text = this._mapInfo.mapName;
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapInfo.playersCount;
        }

        private _updateLabelPlayerIndex(): void {
            const index = McrModel.getJoinWarPlayerIndex();
            this._labelPlayerIndex.text = `${index} (${Helpers.getColorTextForPlayerIndex(index)})`;
        }

        private _updateLabelTeam(): void {
            this._labelTeam.text = Helpers.getTeamText(McrModel.getJoinWarTeamIndex());
        }

        private _updateLabelFog(): void {
            this._labelFog.text = Lang.getText(McrModel.getJoinWarRoomInfo() ? Lang.Type.B0012 : Lang.Type.B0013);
        }

        private _updateLabelTimeLimit(): void {
            this._labelTimeLimit.text = Helpers.getTimeDurationText(McrModel.getJoinWarRoomInfo().timeLimit);
        }

        private _updateLabelCoName(): void {
            const coId              = McrModel.getJoinWarCoId();
            this._labelCoName.text  = coId == null
                ? `(${Lang.getText(Lang.Type.B0001)})`
                : ConfigManager.getCoBasicCfg(ConfigManager.getNewestConfigVersion(), coId).name;
        }
    }
}
