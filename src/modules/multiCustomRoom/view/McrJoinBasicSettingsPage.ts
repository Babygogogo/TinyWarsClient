
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import Types            = Utility.Types;
    import Notify           = Utility.Notify;
    import FloatText        = Utility.FloatText;
    import CommonHelpPanel  = Common.CommonHelpPanel;
    import BwHelpers        = BaseWar.BwHelpers;
    import WarMapModel      = WarMap.WarMapModel;

    export class McrJoinBasicSettingsPage extends GameUi.UiTabPage {
        private _btnMapNameTitle        : GameUi.UiButton;
        private _labelMapName           : GameUi.UiLabel;

        private _btnModifyWarName       : GameUi.UiButton;
        private _labelWarName           : GameUi.UiLabel;
        private _btnModifyWarPassword   : GameUi.UiButton;
        private _labelWarPassword       : GameUi.UiLabel;
        private _btnModifyWarComment    : GameUi.UiButton;
        private _labelWarComment        : GameUi.UiLabel;

        private _btnModifyWarRule       : GameUi.UiButton;
        private _labelWarRule           : GameUi.UiLabel;

        private _btnModifyPlayerIndex   : GameUi.UiButton;
        private _labelPlayerIndex       : GameUi.UiLabel;
        private _btnHelpPlayerIndex     : GameUi.UiButton;

        private _btnModifyTeam  : GameUi.UiButton;
        private _labelTeam      : GameUi.UiLabel;
        private _btnHelpTeam    : GameUi.UiButton;

        private _btnModifyHasFog    : GameUi.UiButton;
        private _imgHasFog          : GameUi.UiImage;
        private _btnHelpHasFog      : GameUi.UiButton;

        private _btnModifyTimeLimit : GameUi.UiButton;
        private _labelTimeLimit     : GameUi.UiLabel;
        private _btnHelpTimeLimit   : GameUi.UiButton;

        private _labelCoName    : GameUi.UiLabel;
        private _btnChangeCo    : GameUi.UiButton;

        private _labelPlayersTitle  : GameUi.UiLabel;
        private _listPlayer         : GameUi.UiScrollList;

        private _btnBuildings: GameUi.UiButton;

        private _mapRawData: ProtoTypes.Map.IMapRawData;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinBasicSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnModifyPlayerIndex,   callback: this._onTouchedBtnModifyPlayerIndex, },
                { ui: this._btnHelpPlayerIndex,     callback: this._onTouchedBtnHelpPlayerIndex, },
                { ui: this._btnModifyTeam,          callback: this._onTouchedBtnModifyTeam, },
                { ui: this._btnHelpTeam,            callback: this._onTouchedBtnHelpTeam, },
                { ui: this._btnHelpHasFog,          callback: this._onTouchedBtnHelpHasFog, },
                { ui: this._btnHelpTimeLimit,       callback: this._onTouchedBtnHelpTimeLimit, },
                { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo, },
                { ui: this._btnBuildings,           callback: this._onTouchedBtnBuildings },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];

            this._listPlayer.setItemRenderer(PlayerRenderer);
        }

        protected async _onOpened(): Promise<void> {
            this._mapRawData = await McrModel.getJoinWarMapRawData();

            this._updateComponentsForLanguage();
            this._updateLabelWarName();
            this._updateLabelWarPassword();
            this._updateLabelWarComment();
            this._updateLabelMapName();
            this._updateLabelWarRule();
            this._updateLabelPlayerIndex();
            this._updateLabelTeam();
            this._updateImgHasFog();
            this._updateLabelTimeLimit();
            this._updateLabelCoName();
            this._updateListPlayer();
        }

        protected _onClosed(): void {
            this._listPlayer.clear();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private async _onTouchedBtnModifyPlayerIndex(e: egret.TouchEvent): Promise<void> {
            const playerIndex = McrModel.getJoinWarPlayerIndex();
            McrModel.setJoinWarNextPlayerIndex();
            if (playerIndex === McrModel.getJoinWarPlayerIndex()) {
                FloatText.show(Lang.getText(Lang.Type.B0332));
            } else {
                this._updateLabelPlayerIndex();

                const index = McrModel.getJoinWarWarRuleIndex();
                if (index != null) {
                    McrModel.setJoinWarTeamIndex((await WarMapModel.getPlayerRule(McrModel.getJoinWarMapId(), index, McrModel.getJoinWarPlayerIndex())).teamIndex);
                    this._updateLabelTeam();
                }
            }
        }

        private _onTouchedBtnHelpPlayerIndex(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0018),
                content: Lang.getRichText(Lang.RichType.R0000),
            });
        }

        private _onTouchedBtnModifyTeam(e: egret.TouchEvent): void {
            if (McrModel.getJoinWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                const teamIndex = McrModel.getJoinWarTeamIndex();
                McrModel.setJoinWarNextTeamIndex();
                if (teamIndex === McrModel.getJoinWarTeamIndex()) {
                    FloatText.show(Lang.getText(Lang.Type.B0332));
                } else {
                    this._updateLabelTeam();
                }
            }
        }

        private _onTouchedBtnHelpTeam(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0019),
                content: Lang.getRichText(Lang.RichType.R0001),
            });
        }

        private _onTouchedBtnHelpHasFog(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private _onTouchedBtnHelpTimeLimit(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0021),
                content: Lang.getRichText(Lang.RichType.R0003),
            });
        }

        private _onTouchedBtnChangeCo(e: egret.TouchEvent): void {
            McrJoinSettingsPanel.hide();
            McrJoinCoListPanel.show(McrModel.getJoinWarCoId());
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const settingsForCommon = McrModel.getJoinWarRoomInfo().settingsForCommon;
            McrBuildingListPanel.show({
                configVersion   : settingsForCommon.configVersion,
                mapRawData      : await WarMapModel.getRawData(settingsForCommon.mapId),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnMapNameTitle.label         = Lang.getText(Lang.Type.B0225);
            this._btnModifyWarName.label        = Lang.getText(Lang.Type.B0185);
            this._btnModifyWarPassword.label    = Lang.getText(Lang.Type.B0186);
            this._btnModifyWarComment.label     = Lang.getText(Lang.Type.B0187);
            this._btnModifyWarRule.label        = Lang.getText(Lang.Type.B0318);
            this._btnModifyPlayerIndex.label    = Lang.getText(Lang.Type.B0018);
            this._btnModifyTeam.label           = Lang.getText(Lang.Type.B0019);
            this._btnModifyHasFog.label         = Lang.getText(Lang.Type.B0020);
            this._btnModifyTimeLimit.label      = Lang.getText(Lang.Type.B0188);
            this._btnBuildings.label            = Lang.getText(Lang.Type.B0333);
            this._labelPlayersTitle.text        = `${Lang.getText(Lang.Type.B0232)}:`;
        }

        private _updateLabelWarName(): void {
            this._labelWarName.text = McrModel.getJoinWarRoomInfo().settingsForMultiPlayer.warName || "--";
        }

        private _updateLabelWarPassword(): void {
            this._labelWarPassword.text = McrModel.getJoinWarRoomInfo().settingsForMultiPlayer.warPassword || "--";
        }

        private _updateLabelWarComment(): void {
            this._labelWarComment.text = McrModel.getJoinWarRoomInfo().settingsForMultiPlayer.warComment || "--";
        }

        private _updateLabelMapName(): void {
            WarMapModel.getMapNameInCurrentLanguage(this._mapRawData.mapId).then(v =>
                this._labelMapName.text = `${v} (${this._mapRawData.playersCount}P)`
            );
        }

        private async _updateLabelWarRule(): Promise<void> {
            const index = McrModel.getJoinWarWarRuleIndex();
            const label = this._labelWarRule;
            if (index == null) {
                label.text = Lang.getText(Lang.Type.B0321);
            } else {
                const rule  = (await McrModel.getJoinWarMapRawData()).warRuleList[index];
                label.text  = Lang.getLanguageType() === Types.LanguageType.Chinese
                    ? rule.ruleName
                    : rule.ruleNameEnglish;
            }
        }

        private _updateLabelPlayerIndex(): void {
            const index = McrModel.getJoinWarPlayerIndex();
            this._labelPlayerIndex.text = `${index} (${Lang.getPlayerForceName(index)})`;
        }

        private _updateLabelTeam(): void {
            this._labelTeam.text = Lang.getPlayerTeamName(McrModel.getJoinWarTeamIndex());
        }

        private _updateImgHasFog(): void {
            this._imgHasFog.visible = !!McrModel.getJoinWarRoomInfo().settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
        }

        private _updateLabelTimeLimit(): void {
            this._labelTimeLimit.text = Lang.getBootTimerDesc(McrModel.getJoinWarRoomInfo().settingsForMultiPlayer.bootTimerParams);
        }

        private _updateLabelCoName(): void {
            const coId = McrModel.getJoinWarCoId();
            if (coId == null) {
                this._labelCoName.text = `(${Lang.getText(Lang.Type.B0001)} CO)`;
            } else {
                const cfg               = Utility.ConfigManager.getCoBasicCfg(Utility.ConfigManager.getNewestConfigVersion(), coId);
                this._labelCoName.text  = `${cfg.name} (T${cfg.tier})`;
            }
        }

        private async _updateListPlayer(): Promise<void> {
            this._listPlayer.bindData(await this._getDataForListPlayer());
        }

        private async _getDataForListPlayer(): Promise<DataForPlayerRenderer[]> {
            const roomInfo          = McrModel.getJoinWarRoomInfo();
            const settingsForCommon = roomInfo.settingsForCommon;
            const playerDataList    = roomInfo.playerDataList;
            const playerRules       = settingsForCommon.warRule.ruleForPlayers;
            const configVersion     = settingsForCommon.configVersion;
            const playersCount      = (await WarMapModel.getRawData(settingsForCommon.mapId)).playersCount;
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                dataList.push({
                    configVersion,
                    playerIndex,
                    teamIndex   : BwHelpers.getTeamIndexByRuleForPlayers(playerRules, playerIndex),
                    playerData  : playerDataList.find(v => v.playerIndex === playerIndex),
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        configVersion   : string;
        playerIndex     : number;
        teamIndex       : number;
        playerData      : ProtoTypes.MultiCustomRoom.IDataForPlayerInRoom;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelNickname  : GameUi.UiLabel;
        private _labelIndex     : GameUi.UiLabel;
        private _labelTeam      : GameUi.UiLabel;
        private _labelCoName    : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            this._labelIndex.text   = Lang.getPlayerForceName(data.playerIndex);
            this._labelTeam.text    = Lang.getPlayerTeamName(data.teamIndex);

            const playerData    = data.playerData;
            const lbCoName      = this._labelCoName;
            const lbNickname    = this._labelNickname;
            if (playerData) {
                lbCoName.text = Utility.ConfigManager.getCoNameAndTierText(data.configVersion, playerData.coId);
                User.UserModel.getUserNickname(playerData.userId).then(name => lbNickname.text = name);
            } else {
                lbCoName.text   = "----";
                lbNickname.text = "----";
            }
        }
    }
}
