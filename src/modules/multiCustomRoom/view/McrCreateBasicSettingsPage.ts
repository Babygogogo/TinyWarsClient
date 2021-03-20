
namespace TinyWars.MultiCustomRoom {
    import ProtoTypes       = Utility.ProtoTypes;
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import FloatText        = Utility.FloatText;
    import ConfigManager    = Utility.ConfigManager;
    import CommonConstants  = Utility.CommonConstants;
    import BwWarRuleHelper  = BaseWar.BwWarRuleHelper;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonHelpPanel  = Common.CommonHelpPanel;

    export class McrCreateBasicSettingsPage extends GameUi.UiTabPage {
        private _btnMapNameTitle            : TinyWars.GameUi.UiButton;
        private _labelMapName               : TinyWars.GameUi.UiLabel;
        private _btnBuildings               : TinyWars.GameUi.UiButton;

        private _btnModifyWarName           : TinyWars.GameUi.UiButton;
        private _labelWarName               : TinyWars.GameUi.UiLabel;

        private _btnModifyWarPassword       : TinyWars.GameUi.UiButton;
        private _labelWarPassword           : TinyWars.GameUi.UiLabel;

        private _btnModifyWarComment        : TinyWars.GameUi.UiButton;
        private _labelWarComment            : TinyWars.GameUi.UiLabel;

        private _btnModifyWarRule           : TinyWars.GameUi.UiButton;
        private _labelWarRule               : TinyWars.GameUi.UiLabel;

        private _btnModifyHasFog            : TinyWars.GameUi.UiButton;
        private _imgHasFog                  : TinyWars.GameUi.UiImage;
        private _btnHelpHasFog              : TinyWars.GameUi.UiButton;

        private _groupTimer                 : eui.Group;
        private _btnModifyTimerType         : TinyWars.GameUi.UiButton;
        private _btnHelpTimer               : TinyWars.GameUi.UiButton;
        private _labelTimerType             : TinyWars.GameUi.UiLabel;
        private _groupTimerRegular          : eui.Group;
        private _btnModifyTimerRegular      : TinyWars.GameUi.UiButton;
        private _groupTimerIncremental      : eui.Group;
        private _btnModifyTimerIncremental1 : TinyWars.GameUi.UiButton;
        private _btnModifyTimerIncremental2 : TinyWars.GameUi.UiButton;

        private _btnModifyPlayerIndex       : TinyWars.GameUi.UiButton;
        private _labelPlayerIndex           : TinyWars.GameUi.UiLabel;
        private _btnHelpPlayerIndex         : TinyWars.GameUi.UiButton;

        private _btnChangeCo                : TinyWars.GameUi.UiButton;
        private _labelCoName                : TinyWars.GameUi.UiLabel;

        private _btnModifySkinId            : TinyWars.GameUi.UiButton;
        private _labelSkinId                : TinyWars.GameUi.UiLabel;
        private _btnHelpSkinId              : TinyWars.GameUi.UiButton;

        private _mapRawData : ProtoTypes.Map.IMapRawData;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomRoom/McrCreateBasicSettingsPage.exml";
        }

        protected async _onOpened(): Promise<void> {
            this._setUiListenerArray([
                { ui: this._btnModifyWarName,           callback: this._onTouchedBtnModifyWarName, },
                { ui: this._btnModifyWarPassword,       callback: this._onTouchedBtnModifyWarPassword, },
                { ui: this._btnModifyWarComment,        callback: this._onTouchedBtnModifyWarComment, },
                { ui: this._btnModifyWarRule,           callback: this._onTouchedBtnModifyWarRule },
                { ui: this._btnModifyPlayerIndex,       callback: this._onTouchedBtnModifyPlayerIndex, },
                { ui: this._btnHelpPlayerIndex,         callback: this._onTouchedBtnHelpPlayerIndex, },
                { ui: this._btnModifySkinId,            callback: this._onTouchedBtnModifySkin, },
                { ui: this._btnHelpSkinId,              callback: this._onTouchedBtnHelpSkinId, },
                { ui: this._btnModifyHasFog,            callback: this._onTouchedBtnModifyHasFog, },
                { ui: this._btnHelpHasFog,              callback: this._onTouchedBtnHelpHasFog, },
                { ui: this._btnModifyTimerType,         callback: this._onTouchedBtnModifyTimerType, },
                { ui: this._btnHelpTimer,               callback: this._onTouchedBtnHelpTimer, },
                { ui: this._btnModifyTimerRegular,      callback: this._onTouchedBtnModifyTimerRegular, },
                { ui: this._btnModifyTimerIncremental1, callback: this._onTouchedBtnModifyTimerIncremental1 },
                { ui: this._btnModifyTimerIncremental2, callback: this._onTouchedBtnModifyTimerIncremental2 },
                { ui: this._btnChangeCo,                callback: this._onTouchedBtnChangeCo, },
                { ui: this._btnBuildings,               callback: this._onTouchedBtnBuildings },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged, callback: this._onNotifyLanguageChanged },
            ]);

            this._btnChangeCo.setTextColor(0x00FF00);
            this._btnModifyHasFog.setTextColor(0x00FF00);
            this._btnModifyPlayerIndex.setTextColor(0x00FF00);
            this._btnModifySkinId.setTextColor(0x00FF00);
            this._btnModifyTimerIncremental1.setTextColor(0x00FF00);
            this._btnModifyTimerIncremental2.setTextColor(0x00FF00);
            this._btnModifyTimerRegular.setTextColor(0x00FF00);
            this._btnModifyTimerType.setTextColor(0x00FF00);
            this._btnModifyWarComment.setTextColor(0x00FF00);
            this._btnModifyWarName.setTextColor(0x00FF00);
            this._btnModifyWarPassword.setTextColor(0x00FF00);
            this._btnModifyWarRule.setTextColor(0x00FF00);

            this._mapRawData = await McrModel.Create.getMapRawData();

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
                currentValue    : McrModel.Create.getWarName(),
                maxChars        : CommonConstants.WarNameMaxLength,
                charRestrict    : null,
                tips            : null,
                callback        : panel => {
                    McrModel.Create.setWarName(panel.getInputText());
                    this._updateLabelWarName();
                },
            });
        }

        private _onTouchedBtnModifyWarPassword(e: egret.Event): void {
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0186),
                currentValue    : McrModel.Create.getWarPassword(),
                maxChars        : CommonConstants.WarPasswordMaxLength,
                charRestrict    : "0-9",
                tips            : Lang.getText(Lang.Type.B0323),
                callback        : panel => {
                    McrModel.Create.setWarPassword(panel.getInputText());
                    this._updateLabelWarPassword();
                },
            });
        }

        private _onTouchedBtnModifyWarComment(e: egret.Event): void {
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0187),
                currentValue    : McrModel.Create.getWarComment(),
                maxChars        : CommonConstants.WarCommentMaxLength,
                charRestrict    : null,
                tips            : null,
                callback        : panel => {
                    McrModel.Create.setWarComment(panel.getInputText());
                    this._updateLabelWarComment();
                },
            });
        }

        private async _onTouchedBtnModifyWarRule(e: egret.TouchEvent): Promise<void> {
            await McrModel.Create.tickPresetWarRuleId();
            this._updateComponentsForWarRule();
        }

        private async _onTouchedBtnModifyPlayerIndex(e: egret.TouchEvent): Promise<void> {
            const creator = McrModel.Create;
            await creator.tickSelfPlayerIndex();
            creator.setSelfCoId(BwWarRuleHelper.getRandomCoIdWithSettingsForCommon(creator.getData().settingsForCommon, creator.getSelfPlayerIndex()));
            this._updateLabelPlayerIndex();
            this._updateLabelCoName();
        }

        private _onTouchedBtnHelpPlayerIndex(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0018),
                content: Lang.getRichText(Lang.RichType.R0000),
            });
        }

        private async _onTouchedBtnModifySkin(e: egret.TouchEvent): Promise<void> {
            McrModel.Create.tickSelfUnitAndTileSkinId();
            this._updateLabelSkinId();
        }

        private _onTouchedBtnHelpSkinId(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0019),
                content: Lang.getRichText(Lang.RichType.R0001),
            });
        }

        private _onTouchedBtnModifyHasFog(e: egret.TouchEvent): void {
            const callback = () => {
                McrModel.Create.setHasFog(!McrModel.Create.getHasFog());
                this._updateImgHasFog();
                this._updateLabelWarRule();
            };
            if (McrModel.Create.getPresetWarRuleId() == null) {
                callback();
            } else {
                Common.CommonConfirmPanel.show({
                    title   : Lang.getText(Lang.Type.B0088),
                    content : Lang.getText(Lang.Type.A0129),
                    callback: () => {
                        McrModel.Create.setPresetWarRuleId(null);
                        callback();
                    },
                });
            }
        }

        private _onTouchedBtnHelpHasFog(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getRichText(Lang.RichType.R0002),
            });
        }

        private _onTouchedBtnModifyTimerType(e: egret.TouchEvent): void {
            McrModel.Create.tickBootTimerType();
            this._updateGroupTimer();
        }

        private _onTouchedBtnHelpTimer(e: egret.TouchEvent): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0021),
                content: Lang.getRichText(Lang.RichType.R0003),
            });
        }

        private _onTouchedBtnModifyTimerRegular(e: egret.TouchEvent): void {
            McrModel.Create.tickTimerRegularTime();
            this._updateGroupTimer();
        }

        private _onTouchedBtnModifyTimerIncremental1(e: egret.TouchEvent): void {
            const minValue = 1;
            const maxValue = CommonConstants.WarBootTimerIncrementalMaxLimit;
            Common.CommonInputPanel.show({
                title           : Lang.getText(Lang.Type.B0389),
                currentValue    : "" + McrModel.Create.getBootTimerParams()[1],
                maxChars        : 5,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(Lang.Type.B0017)})`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        McrModel.Create.setTimerIncrementalInitialTime(value);
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
                currentValue    : "" + McrModel.Create.getBootTimerParams()[2],
                maxChars        : 5,
                charRestrict    : "0-9",
                tips            : `${Lang.getText(Lang.Type.B0319)}: [${minValue}, ${maxValue}] (${Lang.getText(Lang.Type.B0017)})`,
                callback        : panel => {
                    const text  = panel.getInputText();
                    const value = text ? Number(text) : NaN;
                    if ((isNaN(value)) || (value > maxValue) || (value < minValue)) {
                        FloatText.show(Lang.getText(Lang.Type.A0098));
                    } else {
                        McrModel.Create.setTimerIncrementalIncrementalValue(value);
                        this._updateGroupTimer();
                    }
                },
            });
        }

        private _onTouchedBtnChangeCo(e: egret.TouchEvent): void {
            McrCreateSettingsPanel.hide();
            McrCreateChooseCoPanel.show({ coId: McrModel.Create.getSelfCoId() });
        }

        private async _onTouchedBtnBuildings(e: egret.TouchEvent): Promise<void> {
            const mapRawData = await WarMapModel.getRawData(McrModel.Create.getMapId());
            WarMap.WarMapBuildingListPanel.show({
                configVersion           : McrModel.Create.getData().settingsForCommon.configVersion,
                tileDataArray           : mapRawData.tileDataArray,
                playersCountUnneutral   : mapRawData.playersCountUnneutral,
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
            this._btnModifySkinId.label         = Lang.getText(Lang.Type.B0397);
            this._btnModifyTimerType.label      = Lang.getText(Lang.Type.B0188);
            this._btnModifyWarRule.label        = Lang.getText(Lang.Type.B0318);
            this._btnModifyWarName.label        = Lang.getText(Lang.Type.B0185);
            this._btnBuildings.label            = Lang.getText(Lang.Type.B0333);
        }

        private _updateComponentsForWarRule(): void {
            this._updateLabelWarRule();
            this._updateLabelPlayerIndex();
            this._updateLabelSkinId();
            this._updateImgHasFog();
            this._updateGroupTimer();
            this._updateLabelCoName();
        }

        private _updateLabelWarName(): void {
            this._labelWarName.text = McrModel.Create.getWarName() || `(${Lang.getText(Lang.Type.B0001)})`;
        }

        private _updateLabelWarPassword(): void {
            this._labelWarPassword.text = McrModel.Create.getWarPassword() || `(${Lang.getText(Lang.Type.B0001)})`;
        }

        private _updateLabelWarComment(): void {
            this._labelWarComment.text = McrModel.Create.getWarComment() || `(${Lang.getText(Lang.Type.B0001)})`;
        }

        private _updateLabelMapName(): void {
            WarMapModel.getMapNameInCurrentLanguage(this._mapRawData.mapId).then(v =>
                this._labelMapName.text = `${v} (${this._mapRawData.playersCountUnneutral}P)`
            );
        }

        private async _updateLabelWarRule(): Promise<void> {
            const label             = this._labelWarRule;
            const settingsForCommon = McrModel.Create.getData().settingsForCommon;
            label.text              = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
            label.textColor         = settingsForCommon.presetWarRuleId == null ? 0xFF0000 : 0x00FF00;
        }

        private _updateLabelPlayerIndex(): void {
            const playerIndex           = McrModel.Create.getSelfPlayerIndex();
            const teamIndex             = BwWarRuleHelper.getTeamIndex(McrModel.Create.getData().settingsForCommon.warRule, playerIndex);
            this._labelPlayerIndex.text = `${Lang.getPlayerForceName(playerIndex)} (${Lang.getPlayerTeamName(teamIndex)})`;
        }

        private _updateLabelSkinId(): void {
            this._labelSkinId.text = Lang.getUnitAndTileSkinName(McrModel.Create.getSelfUnitAndTileSkinId());
        }

        private _updateImgHasFog(): void {
            this._imgHasFog.visible = McrModel.Create.getHasFog();
        }

        private _updateGroupTimer(): void {
            const params                = McrModel.Create.getBootTimerParams();
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
            const cfg               = ConfigManager.getCoBasicCfg(McrModel.Create.getData().settingsForCommon.configVersion, McrModel.Create.getSelfCoId());
            this._labelCoName.text  = `${cfg.name} (T${cfg.tier})`;
        }
    }
}
