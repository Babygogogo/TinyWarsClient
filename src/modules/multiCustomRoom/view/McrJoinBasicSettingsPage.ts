
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import ConfigManager    = Utility.ConfigManager;
    import Notify           = Utility.Notify;
    import FloatText        = Utility.FloatText;
    import CommonHelpPanel  = Common.CommonHelpPanel;
    import BwSettingsHelper = BaseWar.BwSettingsHelper;
    import WarMapModel      = WarMap.WarMapModel;

    export class McrJoinBasicSettingsPage extends GameUi.UiTabPage {
        private _btnMapNameTitle        : TinyWars.GameUi.UiButton;
        private _labelMapName           : TinyWars.GameUi.UiLabel;
        private _btnBuildings           : TinyWars.GameUi.UiButton;

        private _btnModifyWarName       : TinyWars.GameUi.UiButton;
        private _labelWarName           : TinyWars.GameUi.UiLabel;

        private _btnModifyWarPassword   : TinyWars.GameUi.UiButton;
        private _labelWarPassword       : TinyWars.GameUi.UiLabel;

        private _btnModifyWarComment    : TinyWars.GameUi.UiButton;
        private _labelWarComment        : TinyWars.GameUi.UiLabel;

        private _btnModifyWarRule       : TinyWars.GameUi.UiButton;
        private _labelWarRule           : TinyWars.GameUi.UiLabel;

        private _btnModifyHasFog        : TinyWars.GameUi.UiButton;
        private _imgHasFog              : TinyWars.GameUi.UiImage;
        private _btnHelpHasFog          : TinyWars.GameUi.UiButton;

        private _btnModifyTimeLimit     : TinyWars.GameUi.UiButton;
        private _labelTimeLimit         : TinyWars.GameUi.UiLabel;
        private _btnHelpTimeLimit       : TinyWars.GameUi.UiButton;

        private _btnModifyPlayerIndex   : TinyWars.GameUi.UiButton;
        private _labelPlayerIndex       : TinyWars.GameUi.UiLabel;
        private _btnHelpPlayerIndex     : TinyWars.GameUi.UiButton;

        private _btnChangeCo            : TinyWars.GameUi.UiButton;
        private _labelCoName            : TinyWars.GameUi.UiLabel;

        private _btnModifySkinId        : TinyWars.GameUi.UiButton;
        private _labelSkinId            : TinyWars.GameUi.UiLabel;
        private _btnHelpSkinId          : TinyWars.GameUi.UiButton;

        private _labelPlayersTitle      : TinyWars.GameUi.UiLabel;
        private _listPlayer             : TinyWars.GameUi.UiScrollList;

        private _mapRawData: ProtoTypes.Map.IMapRawData;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrJoinBasicSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnBuildings,           callback: this._onTouchedBtnBuildings },
                { ui: this._btnHelpHasFog,          callback: this._onTouchedBtnHelpHasFog },
                { ui: this._btnModifyPlayerIndex,   callback: this._onTouchedBtnModifyPlayerIndex, },
                { ui: this._btnHelpPlayerIndex,     callback: this._onTouchedBtnHelpPlayerIndex, },
                { ui: this._btnModifySkinId,        callback: this._onTouchedBtnModifySkinId, },
                { ui: this._btnHelpSkinId,          callback: this._onTouchedBtnHelpSkinId, },
                { ui: this._btnHelpTimeLimit,       callback: this._onTouchedBtnHelpTimeLimit, },
                { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo, },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ];

            this._listPlayer.setItemRenderer(PlayerRenderer);
            this._btnModifyPlayerIndex.setTextColor(0x00FF00);
            this._btnModifySkinId.setTextColor(0x00FF00);
            this._btnChangeCo.setTextColor(0x00FF00);
        }

        protected async _onOpened(): Promise<void> {
            this._mapRawData = await McrModel.Join.getMapRawData();

            this._updateComponentsForLanguage();
            this._updateLabelWarName();
            this._updateLabelWarPassword();
            this._updateLabelWarComment();
            this._updateLabelMapName();
            this._updateLabelWarRule();
            this._updateLabelPlayerIndex();
            this._updateImgHasFog();
            this._updateLabelTimeLimit();
            this._updateLabelCoName();
            this._updateLabelSkinId();
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

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const settingsForCommon = (await McrModel.Join.getRoomInfo()).settingsForCommon;
            WarMap.WarMapBuildingListPanel.show({
                configVersion   : settingsForCommon.configVersion,
                mapRawData      : await WarMapModel.getRawData(settingsForCommon.mapId),
            });
        }

        private _onTouchedBtnHelpHasFog(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private async _onTouchedBtnModifyPlayerIndex(e: egret.TouchEvent): Promise<void> {
            const currPlayerIndex = McrModel.Join.getPlayerIndex();
            await McrModel.Join.tickPlayerIndex();
            if (currPlayerIndex === McrModel.Join.getPlayerIndex()) {
                FloatText.show(Lang.getText(Lang.Type.B0332));
            } else {
                this._updateLabelPlayerIndex();
                this._updateLabelCoName();
            }
        }

        private _onTouchedBtnHelpPlayerIndex(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0018),
                content: Lang.getRichText(Lang.RichType.R0000),
            });
        }

        private _onTouchedBtnModifySkinId(e: egret.TouchEvent): void {
            const currSkinId = McrModel.Join.getUnitAndTileSkinId();
            McrModel.Join.tickUnitAndTileSkinId();
            if (currSkinId === McrModel.Join.getUnitAndTileSkinId()) {
                FloatText.show(Lang.getText(Lang.Type.B0332));
            } else {
                this._updateLabelSkinId();
            }
        }

        private _onTouchedBtnHelpSkinId(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0397),
                content: Lang.getRichText(Lang.RichType.R0001),
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
            McrJoinCoListPanel.show(McrModel.Join.getCoId());
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
            this._btnModifySkinId.label         = Lang.getText(Lang.Type.B0397);
            this._btnModifyHasFog.label         = Lang.getText(Lang.Type.B0020);
            this._btnModifyTimeLimit.label      = Lang.getText(Lang.Type.B0188);
            this._btnBuildings.label            = Lang.getText(Lang.Type.B0333);
            this._labelPlayersTitle.text        = `${Lang.getText(Lang.Type.B0395)}:`;
        }

        private async _updateLabelWarName(): Promise<void> {
            this._labelWarName.text = (await McrModel.Join.getRoomInfo()).settingsForMcw.warName || "--";
        }

        private async _updateLabelWarPassword(): Promise<void> {
            this._labelWarPassword.text = (await McrModel.Join.getRoomInfo()).settingsForMcw.warPassword || "--";
        }

        private async _updateLabelWarComment(): Promise<void> {
            this._labelWarComment.text = (await McrModel.Join.getRoomInfo()).settingsForMcw.warComment || "--";
        }

        private _updateLabelMapName(): void {
            WarMapModel.getMapNameInCurrentLanguage(this._mapRawData.mapId).then(v =>
                this._labelMapName.text = `${v} (${this._mapRawData.playersCount}P)`
            );
        }

        private async _updateLabelWarRule(): Promise<void> {
            this._labelWarRule.text = Lang.getWarRuleNameInLanguage((await McrModel.Join.getRoomInfo()).settingsForCommon.warRule);
        }

        private async _updateLabelPlayerIndex(): Promise<void> {
            const playerIndex           = McrModel.Join.getPlayerIndex();
            const playerRule            = BwSettingsHelper.getPlayerRule((await McrModel.Join.getRoomInfo()).settingsForCommon.warRule, playerIndex);
            this._labelPlayerIndex.text = `${Lang.getPlayerForceName(playerIndex)} (${Lang.getPlayerTeamName(playerRule.teamIndex)})`;
        }

        private async _updateImgHasFog(): Promise<void> {
            this._imgHasFog.visible = (await McrModel.Join.getRoomInfo()).settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
        }

        private async _updateLabelTimeLimit(): Promise<void> {
            this._labelTimeLimit.text = Lang.getBootTimerDesc((await McrModel.Join.getRoomInfo()).settingsForMcw.bootTimerParams);
        }

        private _updateLabelCoName(): void {
            const coId = McrModel.Join.getCoId();
            if (coId == null) {
                this._labelCoName.text = `(${Lang.getText(Lang.Type.B0001)} CO)`;
            } else {
                const cfg               = Utility.ConfigManager.getCoBasicCfg(Utility.ConfigManager.getLatestConfigVersion(), coId);
                this._labelCoName.text  = `${cfg.name} (T${cfg.tier})`;
            }
        }

        private _updateLabelSkinId(): void {
            this._labelSkinId.text = Lang.getUnitAndTileSkinName(McrModel.Join.getUnitAndTileSkinId());
        }

        private async _updateListPlayer(): Promise<void> {
            this._listPlayer.bindData(await this._getDataForListPlayer());
        }

        private async _getDataForListPlayer(): Promise<DataForPlayerRenderer[]> {
            const roomInfo          = await McrModel.Join.getRoomInfo();
            const playersCount      = BwSettingsHelper.getPlayersCount(roomInfo.settingsForCommon.warRule);
            const dataList          : DataForPlayerRenderer[] = [];
            for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                dataList.push({
                    roomInfo,
                    playerIndex,
                });
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        roomInfo        : ProtoTypes.MultiCustomRoom.IMcrRoomInfo;
        playerIndex     : number;
    }

    class PlayerRenderer extends eui.ItemRenderer {
        private _labelIndex     : GameUi.UiLabel;
        private _labelNickname  : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            const playerIndex       = data.playerIndex;
            const roomInfo          = data.roomInfo;
            const labelIndex        = this._labelIndex;
            const playerData        = roomInfo.playerDataList.find(v => v.playerIndex === playerIndex);
            labelIndex.text         = `${Lang.getPlayerForceName(playerIndex)} (${Lang.getPlayerTeamName(BwSettingsHelper.getTeamIndex(roomInfo.settingsForCommon.warRule, playerIndex))})`;
            labelIndex.textColor    = (playerData && playerData.isReady) ? 0x00FF00 : 0xFFFFFF;

            const lbNickname        = this._labelNickname;
            lbNickname.textColor    = roomInfo.ownerPlayerIndex === playerIndex ? 0x00FF00 : 0xFFFFFF;
            if (!playerData) {
                lbNickname.text = "----";
            } else {
                lbNickname.text = "";
                User.UserModel.getUserNickname(playerData.userId).then(name => {
                    lbNickname.text = `${name} ${ConfigManager.getCoNameAndTierText(roomInfo.settingsForCommon.configVersion, playerData.coId)}`;
                });
            }
        }
    }
}
