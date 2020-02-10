
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import WarMapModel      = WarMap.WarMapModel;
    import HelpPanel        = Common.HelpPanel;
    import CommonConstants  = ConfigManager.COMMON_CONSTANTS;

    export class McrCreateBasicSettingsPage extends GameUi.UiTabPage {
        private _labelMapNameTitle      : GameUi.UiLabel;
        private _labelMapName           : GameUi.UiLabel;
        private _labelPlayersCountTitle : GameUi.UiLabel;
        private _labelPlayersCount      : GameUi.UiLabel;

        private _btnModifyWarName   : GameUi.UiButton;
        private _labelWarName       : GameUi.UiLabel;

        private _btnModifyWarPassword   : GameUi.UiButton;
        private _labelWarPassword       : GameUi.UiLabel;

        private _btnModifyWarComment    : GameUi.UiButton;
        private _labelWarComment        : GameUi.UiLabel;

        private _labelWarRule           : GameUi.UiLabel;
        private _btnModifyWarRule       : GameUi.UiButton;

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

        private _labelCoName        : GameUi.UiLabel;
        private _btnChangeCo        : GameUi.UiButton;

        protected _mapExtraData: ProtoTypes.IMapExtraData;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateBasicSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnModifyWarName,       callback: this._onTouchedBtnModifyWarName, },
                { ui: this._btnModifyWarPassword,   callback: this._onTouchedBtnModifyWarPassword, },
                { ui: this._btnModifyWarComment,    callback: this._onTouchedBtnModifyWarComment, },
                { ui: this._btnModifyWarRule,       callback: this._onTouchedBtnModifyWarRule },
                { ui: this._btnModifyPlayerIndex,   callback: this._onTouchedBtnModifyPlayerIndex, },
                { ui: this._btnHelpPlayerIndex,     callback: this._onTouchedBtnHelpPlayerIndex, },
                { ui: this._btnModifyTeam,          callback: this._onTouchedBtnModifyTeam, },
                { ui: this._btnHelpTeam,            callback: this._onTouchedBtnHelpTeam, },
                { ui: this._btnModifyHasFog,        callback: this._onTouchedBtnModifyHasFog, },
                { ui: this._btnHelpHasFog,          callback: this._onTouchedBtnHelpHasFog, },
                { ui: this._btnModifyTimeLimit,     callback: this._onTouchedBtnModifyTimeLimit, },
                { ui: this._btnHelpTimeLimit,       callback: this._onTouchedBtnHelpTimeLimit, },
                { ui: this._btnChangeCo,            callback: this._onTouchedBtnChangeCo, },
            ];
            this._notifyListeners = [
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ];
        }

        protected async _onOpened(): Promise<void> {
            this._mapExtraData = await McrModel.getCreateWarMapExtraData();

            this._updateComponentsForLanguage();
            this._updateComponentsForWarRule();
            this._updateLabelWarName();
            this._updateLabelWarPassword();
            this._updateLabelWarComment();
            this._updateLabelMapName();
            this._updateLabelPlayersCount();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModifyWarName(e: egret.TouchEvent): void {
            Common.InputPanel.show({
                title           : Lang.getText(Lang.Type.B0185),
                currentValue    : McrModel.getCreateWarName(),
                maxChars        : CommonConstants.WarNameMaxLength,
                charRestrict    : null,
                tips            : null,
                callback        : panel => {
                    McrModel.setCreateWarName(panel.getInputText());
                    this._updateLabelWarName();
                },
            });
        }

        private _onTouchedBtnModifyWarPassword(e: egret.Event): void {
            Common.InputPanel.show({
                title           : Lang.getText(Lang.Type.B0186),
                currentValue    : McrModel.getCreateWarPassword(),
                maxChars        : CommonConstants.WarPasswordMaxLength,
                charRestrict    : "0-9",
                tips            : Lang.getText(Lang.Type.B0323),
                callback        : panel => {
                    McrModel.setCreateWarPassword(panel.getInputText());
                    this._updateLabelWarPassword();
                },
            });
        }

        private _onTouchedBtnModifyWarComment(e: egret.Event): void {
            Common.InputPanel.show({
                title           : Lang.getText(Lang.Type.B0187),
                currentValue    : McrModel.getCreateWarComment(),
                maxChars        : CommonConstants.WarCommentMaxLength,
                charRestrict    : null,
                tips            : null,
                callback        : panel => {
                    McrModel.setCreateWarComment(panel.getInputText());
                    this._updateLabelWarComment();
                },
            });
        }

        private async _onTouchedBtnModifyWarRule(e: egret.TouchEvent): Promise<void> {
            const rules         = (await McrModel.getCreateWarMapRawData()).warRuleList;
            const rulesCount    = rules ? rules.length : 0;
            if (rulesCount <= 0) {
                FloatText.show(Lang.getText(Lang.Type.A0100));
            } else {
                const currIndex = McrModel.getCreateWarWarRuleIndex();
                const newIndex  = currIndex == null
                    ? 0
                    : (currIndex + 1 >= rulesCount ? null : currIndex + 1);
                McrModel.setCreateWarWarRuleIndex(newIndex);
                await McrModel.resetCreateWarDataForSelectedRule();
                this._updateComponentsForWarRule();
            }
        }

        private async _onTouchedBtnModifyPlayerIndex(e: egret.TouchEvent): Promise<void> {
            await McrModel.setCreateWarNextPlayerIndex();
            this._updateLabelPlayerIndex();

            const index = McrModel.getCreateWarWarRuleIndex();
            if (index != null) {
                McrModel.setCreateWarTeamIndex((await WarMapModel.getPlayerRule(McrModel.getCreateWarMapFileName(), index, McrModel.getCreateWarPlayerIndex())).teamIndex);
                this._updateLabelTeam();
            }
        }

        private _onTouchedBtnHelpPlayerIndex(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0018),
                content: Lang.getRichText(Lang.RichType.R0000),
            });
        }

        private async _onTouchedBtnModifyTeam(e: egret.TouchEvent): Promise<void> {
            if (McrModel.getCreateWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                await McrModel.setCreateWarNextTeamIndex();
                this._updateLabelTeam();
            }
        }

        private _onTouchedBtnHelpTeam(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0019),
                content: Lang.getRichText(Lang.RichType.R0001),
            });
        }

        private _onTouchedBtnModifyHasFog(e: egret.TouchEvent): void {
            if (McrModel.getCreateWarWarRuleIndex() != null) {
                FloatText.show(Lang.getText(Lang.Type.A0101));
            } else {
                McrModel.setCreateWarNextHasFog();
                this._updateImgHasFog();
            }
        }

        private _onTouchedBtnHelpHasFog(e: egret.TouchEvent): void {
            HelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private _onTouchedBtnModifyTimeLimit(e: egret.TouchEvent): void {
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
        private _updateComponentsForLanguage(): void {
            this._labelMapNameTitle.text        = `${Lang.getText(Lang.Type.B0225)}:`;
            this._labelPlayersCountTitle.text   = `${Lang.getText(Lang.Type.B0229)}:`;
            this._btnModifyWarPassword.label    = Lang.getText(Lang.Type.B0186);
            this._btnModifyWarComment.label     = Lang.getText(Lang.Type.B0187);
            this._btnModifyHasFog.label         = Lang.getText(Lang.Type.B0020);
            this._btnModifyPlayerIndex.label    = Lang.getText(Lang.Type.B0018);
            this._btnModifyTeam.label           = Lang.getText(Lang.Type.B0019);
            this._btnModifyTimeLimit.label      = Lang.getText(Lang.Type.B0188);
            this._btnModifyWarRule.label        = Lang.getText(Lang.Type.B0318);
            this._btnModifyWarName.label        = Lang.getText(Lang.Type.B0185);
        }

        private _updateComponentsForWarRule(): void {
            this._updateLabelWarRule();
            this._updateLabelPlayerIndex();
            this._updateLabelTeam();
            this._updateImgHasFog();
            this._updateLabelTimeLimit();
            this._updateLabelCoName();
        }

        private _updateLabelWarName(): void {
            this._labelWarName.text = McrModel.getCreateWarName() || `(${Lang.getText(Lang.Type.B0001)})`;
        }

        private _updateLabelWarPassword(): void {
            this._labelWarPassword.text = McrModel.getCreateWarPassword() || `(${Lang.getText(Lang.Type.B0001)})`;
        }

        private _updateLabelWarComment(): void {
            this._labelWarComment.text = McrModel.getCreateWarComment() || `(${Lang.getText(Lang.Type.B0001)})`;
        }

        private _updateLabelMapName(): void {
            WarMapModel.getMapNameInLanguage(this._mapExtraData.mapFileName).then(v => this._labelMapName.text = v);
        }

        private _updateLabelPlayersCount(): void {
            this._labelPlayersCount.text = "" + this._mapExtraData.playersCount;
        }

        private async _updateLabelWarRule(): Promise<void> {
            const index = McrModel.getCreateWarWarRuleIndex();
            const label = this._labelWarRule;
            if (index == null) {
                label.text = Lang.getText(Lang.Type.B0321);
            } else {
                const rule  = (await McrModel.getCreateWarMapRawData()).warRuleList[index];
                label.text  = Lang.getLanguageType() === Types.LanguageType.Chinese
                    ? rule.ruleName
                    : rule.ruleNameEnglish;
            }
        }

        private _updateLabelPlayerIndex(): void {
            const index = McrModel.getCreateWarPlayerIndex();
            this._labelPlayerIndex.text = `${index} (${Helpers.getColorTextForPlayerIndex(index)})`;
        }

        private _updateLabelTeam(): void {
            this._labelTeam.text = Helpers.getTeamText(McrModel.getCreateWarTeamIndex());
        }

        private _updateImgHasFog(): void {
            this._imgHasFog.visible = McrModel.getCreateWarHasFog();
        }

        private _updateLabelTimeLimit(): void {
            this._labelTimeLimit.text = Helpers.getTimeDurationText(McrModel.getCreateWarTimeLimit());
        }

        private _updateLabelCoName(): void {
            const coId = McrModel.getCreateWarCoId();
            if (coId == null) {
                this._labelCoName.text = `(${Lang.getText(Lang.Type.B0001)} CO)`;
            } else {
                const cfg               = ConfigManager.getCoBasicCfg(ConfigManager.getNewestConfigVersion(), coId);
                this._labelCoName.text  = `${cfg.name} (T${cfg.tier})`;
            }
        }
    }
}
