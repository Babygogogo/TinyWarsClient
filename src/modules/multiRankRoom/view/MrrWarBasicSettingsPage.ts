
namespace TinyWars.MultiRankRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import ConfigManager    = Utility.ConfigManager;
    import CommonHelpPanel  = Common.CommonHelpPanel;
    import BwHelpers        = BaseWar.BwHelpers;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
    import WarMapModel      = WarMap.WarMapModel;
    import UserModel        = User.UserModel;
    import IMpwWarInfo      = ProtoTypes.MultiPlayerWar.IMpwWarInfo;
    import IWarPlayerInfo   = ProtoTypes.Structure.IWarPlayerInfo;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export type OpenDataForMrrWarBasicSettingsPage = {
        warInfo  : IMpwWarInfo;
    }

    export class MrrWarBasicSettingsPage extends GameUi.UiTabPage {
        private _btnMapNameTitle        : TinyWars.GameUi.UiButton;
        private _labelMapName           : TinyWars.GameUi.UiLabel;
        private _btnBuildings           : TinyWars.GameUi.UiButton;

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

        private _warInfo                : IMpwWarInfo;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiRankRoom/MrrWarBasicSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnBuildings,           callback: this._onTouchedBtnBuildings },
                { ui: this._btnHelpHasFog,          callback: this._onTouchedBtnHelpHasFog },
                { ui: this._btnHelpPlayerIndex,     callback: this._onTouchedBtnHelpPlayerIndex, },
                { ui: this._btnHelpSkinId,          callback: this._onTouchedBtnHelpSkinId, },
                { ui: this._btnHelpTimeLimit,       callback: this._onTouchedBtnHelpTimeLimit, },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            ]);
            this._listPlayer.setItemRenderer(PlayerRenderer);

            this._warInfo = this._getOpenData<OpenDataForMrrWarBasicSettingsPage>().warInfo;

            this._updateComponentsForLanguage();
            this._updateComponentsForWarInfo();
        }

        protected _onClosed(): void {
            this._listPlayer.clear();
            this._warInfo = null;
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const warInfo = this._warInfo;
            if (warInfo) {
                WarMap.WarMapBuildingListPanel.show({
                    configVersion   : warInfo.settingsForCommon.configVersion,
                    mapRawData      : await WarMapModel.getRawData(warInfo.settingsForMrw.mapId),
                });
            }
        }

        private _onTouchedBtnHelpHasFog(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private _onTouchedBtnHelpPlayerIndex(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0018),
                content: Lang.getRichText(Lang.RichType.R0000),
            });
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

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnMapNameTitle.label         = Lang.getText(Lang.Type.B0225);
            this._btnModifyWarRule.label        = Lang.getText(Lang.Type.B0318);
            this._btnModifyPlayerIndex.label    = Lang.getText(Lang.Type.B0018);
            this._btnModifySkinId.label         = Lang.getText(Lang.Type.B0397);
            this._btnModifyHasFog.label         = Lang.getText(Lang.Type.B0020);
            this._btnModifyTimeLimit.label      = Lang.getText(Lang.Type.B0188);
            this._btnBuildings.label            = Lang.getText(Lang.Type.B0333);
            this._labelPlayersTitle.text        = `${Lang.getText(Lang.Type.B0232)}:`;
        }

        private _updateComponentsForWarInfo(): void {
            this._updateLabelMapName();
            this._updateLabelWarRule();
            this._updateLabelPlayerIndex();
            this._updateImgHasFog();
            this._updateLabelTimeLimit();
            this._updateLabelCoName();
            this._updateLabelSkinId();
            this._updateListPlayer();
        }

        private _updateLabelMapName(): void {
            const warInfo = this._warInfo;
            if (warInfo) {
                WarMapModel.getMapNameInCurrentLanguage(warInfo.settingsForMrw.mapId).then(v =>
                    this._labelMapName.text = `${v} (${BwWarRuleHelper.getPlayersCount(warInfo.settingsForCommon.warRule)}P)`
                );
            }
        }

        private _updateLabelWarRule(): void {
            const warInfo           = this._warInfo;
            this._labelWarRule.text = warInfo
                ? Lang.getWarRuleNameInLanguage(warInfo.settingsForCommon.warRule)
                : undefined;
        }

        private _updateLabelPlayerIndex(): void {
            const warInfo = this._warInfo;
            if (warInfo) {
                const selfUserId = UserModel.getSelfUserId();
                const playerData = warInfo.playerInfoList.find(v => v.userId === selfUserId);
                if (playerData) {
                    const playerIndex           = playerData.playerIndex;
                    const playerRule            = BwWarRuleHelper.getPlayerRule(warInfo.settingsForCommon.warRule, playerIndex);
                    this._labelPlayerIndex.text = `${Lang.getPlayerForceName(playerIndex)} (${Lang.getPlayerTeamName(playerRule.teamIndex)})`;
                }
            }
        }

        private _updateImgHasFog(): void {
            const warInfo = this._warInfo;
            if (warInfo) {
                this._imgHasFog.visible = warInfo.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
            }
        }

        private _updateLabelTimeLimit(): void {
            this._labelTimeLimit.text = Lang.getBootTimerDesc([Types.BootTimerType.Regular, CommonConstants.WarBootTimerRegularDefaultValue]);
        }

        private _updateLabelCoName(): void {
            const warInfo = this._warInfo;
            if (warInfo) {
                const selfUserId    = UserModel.getSelfUserId();
                const playerData    = warInfo.playerInfoList.find(v => v.userId === selfUserId);
                const coId          = playerData ? playerData.coId : null;
                if (coId != null) {
                    const cfg               = ConfigManager.getCoBasicCfg(ConfigManager.getLatestFormalVersion(), coId);
                    this._labelCoName.text  = `${cfg.name} (T${cfg.tier})`;
                }
            }
        }

        private _updateLabelSkinId(): void {
            const warInfo = this._warInfo;
            if (warInfo) {
                const selfUserId    = UserModel.getSelfUserId();
                const playerData    = warInfo.playerInfoList.find(v => v.userId === selfUserId);
                const skinId        = playerData ? playerData.unitAndTileSkinId : null;
                if (skinId != null) {
                    this._labelSkinId.text = Lang.getUnitAndTileSkinName(skinId);
                }
            }
        }

        private async _updateListPlayer(): Promise<void> {
            this._listPlayer.bindData(await this._getDataForListPlayer());
        }

        private async _getDataForListPlayer(): Promise<DataForPlayerRenderer[]> {
            const dataList  : DataForPlayerRenderer[] = [];
            const warInfo  = this._warInfo;
            if (warInfo) {
                const settingsForCommon = warInfo.settingsForCommon;
                const playerInfoList    = warInfo.playerInfoList;
                const playerRules       = settingsForCommon.warRule.ruleForPlayers;
                const configVersion     = settingsForCommon.configVersion;
                const playersCount      = (await WarMapModel.getRawData(warInfo.settingsForMrw.mapId)).playersCountUnneutral;
                for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
                    dataList.push({
                        configVersion,
                        playerIndex,
                        teamIndex   : BwHelpers.getTeamIndexByRuleForPlayers(playerRules, playerIndex),
                        playerInfo  : playerInfoList.find(v => v.playerIndex === playerIndex),
                    });
                }
            }

            return dataList;
        }
    }

    type DataForPlayerRenderer = {
        configVersion   : string;
        playerIndex     : number;
        teamIndex       : number;
        playerInfo      : IWarPlayerInfo;
    }

    class PlayerRenderer extends GameUi.UiListItemRenderer {
        private _labelNickname  : GameUi.UiLabel;
        private _labelIndex     : GameUi.UiLabel;
        private _labelTeam      : GameUi.UiLabel;
        private _labelCoName    : GameUi.UiLabel;

        protected dataChanged(): void {
            super.dataChanged();

            const data              = this.data as DataForPlayerRenderer;
            this._labelIndex.text   = Lang.getPlayerForceName(data.playerIndex);
            this._labelTeam.text    = Lang.getPlayerTeamName(data.teamIndex);

            const playerData    = data.playerInfo;
            const lbCoName      = this._labelCoName;
            const lbNickname    = this._labelNickname;
            if (playerData) {
                lbCoName.text = ConfigManager.getCoNameAndTierText(data.configVersion, playerData.coId);
                User.UserModel.getUserNickname(playerData.userId).then(name => lbNickname.text = name);
            } else {
                lbCoName.text   = "----";
                lbNickname.text = "----";
            }
        }
    }
}
