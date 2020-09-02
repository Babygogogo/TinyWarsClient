
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonHelpPanel  = Common.CommonHelpPanel;
    import CommonConstants  = Utility.ConfigManager.COMMON_CONSTANTS;

    export class McrCreateBasicSettingsPage extends GameUi.UiTabPage {
        private _btnMapNameTitle    : GameUi.UiButton;
        private _labelMapName       : GameUi.UiLabel;
        private _btnBuildings       : GameUi.UiButton;

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

        private _groupTimer                 : eui.Group;
        private _btnModifyTimerType         : GameUi.UiButton;
        private _labelTimerType             : GameUi.UiLabel;
        private _btnHelpTimer               : GameUi.UiButton;
        private _groupTimerRegular          : eui.Group;
        private _btnModifyTimerRegular      : GameUi.UiButton;
        private _groupTimerIncremental      : eui.Group;
        private _btnModifyTimerIncremental1 : GameUi.UiButton;
        private _btnModifyTimerIncremental2 : GameUi.UiButton;

        private _labelCoName        : GameUi.UiLabel;
        private _btnChangeCo        : GameUi.UiButton;

        protected _mapExtraData: ProtoTypes.IMapExtraData;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateBasicSettingsPage.exml";
        }

        protected _onFirstOpened(): void {
            this._uiListeners = [
                { ui: this._btnModifyWarName,           callback: this._onTouchedBtnModifyWarName, },
                { ui: this._btnModifyWarPassword,       callback: this._onTouchedBtnModifyWarPassword, },
                { ui: this._btnModifyWarComment,        callback: this._onTouchedBtnModifyWarComment, },
                { ui: this._btnModifyWarRule,           callback: this._onTouchedBtnModifyWarRule },
                { ui: this._btnModifyPlayerIndex,       callback: this._onTouchedBtnModifyPlayerIndex, },
                { ui: this._btnHelpPlayerIndex,         callback: this._onTouchedBtnHelpPlayerIndex, },
                { ui: this._btnModifyTeam,              callback: this._onTouchedBtnModifyTeam, },
                { ui: this._btnHelpTeam,                callback: this._onTouchedBtnHelpTeam, },
                { ui: this._btnModifyHasFog,            callback: this._onTouchedBtnModifyHasFog, },
                { ui: this._btnHelpHasFog,              callback: this._onTouchedBtnHelpHasFog, },
                { ui: this._btnModifyTimerType,         callback: this._onTouchedBtnModifyTimerType, },
                { ui: this._btnHelpTimer,               callback: this._onTouchedBtnHelpTimer, },
                { ui: this._btnModifyTimerRegular,      callback: this._onTouchedBtnModifyTimerRegular, },
                { ui: this._btnModifyTimerIncremental1, callback: this._onTouchedBtnModifyTimerIncremental1 },
                { ui: this._btnModifyTimerIncremental2, callback: this._onTouchedBtnModifyTimerIncremental2 },
                { ui: this._btnChangeCo,                callback: this._onTouchedBtnChangeCo, },
                { ui: this._btnBuildings,               callback: this._onTouchedBtnBuildings },
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
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(e: egret.Event): void {
            this._updateComponentsForLanguage();
        }

        private _onTouchedBtnModifyWarName(e: egret.TouchEvent): void {
            Common.CommonInputPanel.show({
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
            Common.CommonInputPanel.show({
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
            Common.CommonInputPanel.show({
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
            CommonHelpPanel.show({
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
            CommonHelpPanel.show({
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
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private _onTouchedBtnModifyTimerType(e: egret.TouchEvent): void {
            McrModel.setCreateWarNextBootTimerType();
            this._updateGroupTimer();
        }

        private _onTouchedBtnHelpTimer(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0021),
                content: Lang.getRichText(Lang.RichType.R0003),
            });
        }

        private _onTouchedBtnModifyTimerRegular(e: egret.TouchEvent): void {
            McrModel.setCreateWarNextTimerRegularTime();
            this._updateGroupTimer();
        }

        private _onTouchedBtnModifyTimerIncremental1(e: egret.TouchEvent): void {
            const minValue = 1;
            const maxValue = CommonConstants.WarBootTimerIncrementalMaxLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0389),
                currentValue    : "" + McrModel.getCreateWarBootTimerParams()[1],
                maxChars        : 5,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(Lang.Type.B0017)})`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        McrModel.setCreateWarTimerIncrementalInitialTime(value);
                        this._updateGroupTimer();
                    }
                },
            });
        }

        private _onTouchedBtnModifyTimerIncremental2(e: egret.TouchEvent): void {
            const minValue = 0;
            const maxValue = CommonConstants.WarBootTimerIncrementalMaxLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0390),
                currentValue    : "" + McrModel.getCreateWarBootTimerParams()[2],
                maxChars        : 5,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(Lang.Type.B0017)})`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        McrModel.setCreateWarTimerIncrementalIncrementalValue(value);
                        this._updateGroupTimer();
                    }
                },
            });
        }

        private _onTouchedBtnChangeCo(e: egret.TouchEvent): void {
            McrCreateSettingsPanel.hide();
            McrCreateCoListPanel.show(McrModel.getCreateWarCoId());
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            McrBuildingListPanel.show({
                configVersion   : McrModel.getCreateWarData().configVersion,
                mapRawData      : await WarMapModel.getMapRawData(McrModel.getCreateWarMapFileName()) as Types.MapRawData,
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._btnMapNameTitle.label         = Lang.getText(Lang.Type.B0225);
            this._btnModifyWarPassword.label    = Lang.getText(Lang.Type.B0186);
            this._btnModifyWarComment.label     = Lang.getText(Lang.Type.B0187);
            this._btnModifyHasFog.label         = Lang.getText(Lang.Type.B0020);
            this._btnModifyPlayerIndex.label    = Lang.getText(Lang.Type.B0018);
            this._btnModifyTeam.label           = Lang.getText(Lang.Type.B0019);
            this._btnModifyTimerType.label      = Lang.getText(Lang.Type.B0188);
            this._btnModifyWarRule.label        = Lang.getText(Lang.Type.B0318);
            this._btnModifyWarName.label        = Lang.getText(Lang.Type.B0185);
            this._btnBuildings.label            = Lang.getText(Lang.Type.B0333);
        }

        private _updateComponentsForWarRule(): void {
            this._updateLabelWarRule();
            this._updateLabelPlayerIndex();
            this._updateLabelTeam();
            this._updateImgHasFog();
            this._updateGroupTimer();
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
            WarMapModel.getMapNameInCurrentLanguage(this._mapExtraData.mapFileName).then(v =>
                this._labelMapName.text = `${v} (${this._mapExtraData.playersCount}P)`
            );
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

        private _updateGroupTimer(): void {
            const params                = McrModel.getCreateWarBootTimerParams();
            const timerType             : Types.BootTimerType = params[0];
            this._labelTimerType.text   = Lang.getBootTimerTypeName(timerType);

            const groupTimer        = this._groupTimer;
            const groupRegular      = this._groupTimerRegular;
            const groupIncremental  = this._groupTimerIncremental;
            (groupRegular.parent) && (groupRegular.parent.removeChild(groupRegular));
            (groupIncremental.parent) && (groupIncremental.parent.removeChild(groupIncremental));

            if (timerType === Types.BootTimerType.Regular) {
                groupTimer.addChild(groupRegular);
                this._btnModifyTimerRegular.label = Helpers.getTimeDurationText(params[1]);

            } else if (timerType === Types.BootTimerType.Incremental) {
                groupTimer.addChild(groupIncremental);
                this._btnModifyTimerIncremental1.label  = Helpers.getTimeDurationText2(params[1]);
                this._btnModifyTimerIncremental2.label  = Helpers.getTimeDurationText2(params[2]);
            }
        }

        private _updateLabelCoName(): void {
            const coId = McrModel.getCreateWarCoId();
            if (coId == null) {
                this._labelCoName.text = `(${Lang.getText(Lang.Type.B0001)} CO)`;
            } else {
                const cfg               = Utility.ConfigManager.getCoBasicCfg(Utility.ConfigManager.getNewestConfigVersion(), coId);
                this._labelCoName.text  = `${cfg.name} (T${cfg.tier})`;
            }
        }
    }
}
