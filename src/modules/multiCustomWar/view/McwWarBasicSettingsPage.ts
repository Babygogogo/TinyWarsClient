
// eslint-disable-next-line @typescript-eslint/no-unused-vars
namespace TinyWars.MultiCustomWar {
    import Helpers          = Utility.Helpers;
    import Lang             = Utility.Lang;
    import Notify           = Utility.Notify;
    import Types            = Utility.Types;
    import ProtoTypes       = Utility.ProtoTypes;
    import CommonConstants  = Utility.CommonConstants;
    import MpwModel         = MultiPlayerWar.MpwModel;
    import WarMapModel      = WarMap.WarMapModel;
    import CommonHelpPanel  = Common.CommonHelpPanel;

    export type OpenDataForMcwWarBasicSettingsPage = {
        warId  : number | null | undefined;
    }
    export class McwWarBasicSettingsPage extends GameUi.UiTabPage<OpenDataForMcwWarBasicSettingsPage> {
        // @ts-ignore
        private readonly _labelMapNameTitle             : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelMapName                  : GameUi.UiLabel;

        // @ts-ignore
        private readonly _labelWarNameTitle             : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelWarName                  : GameUi.UiLabel;

        // @ts-ignore
        private readonly _labelWarPasswordTitle         : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelWarPassword              : GameUi.UiLabel;

        // @ts-ignore
        private readonly _labelWarCommentTitle          : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelWarComment               : GameUi.UiLabel;

        // @ts-ignore
        private readonly _labelWarRuleTitle             : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelWarRule                  : GameUi.UiLabel;

        // @ts-ignore
        private readonly _labelHasFogTitle              : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelHasFog                   : GameUi.UiLabel;
        // @ts-ignore
        private readonly _btnHasFogHelp                 : GameUi.UiButton;

        // @ts-ignore
        private readonly _groupTimer                    : eui.Group;
        // @ts-ignore
        private readonly _labelTimerTypeTitle           : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelTimerType                : GameUi.UiLabel;
        // @ts-ignore
        private readonly _btnTimerTypeHelp              : GameUi.UiButton;

        // @ts-ignore
        private readonly _groupTimerRegular             : eui.Group;
        // @ts-ignore
        private readonly _labelTimerRegularTitle        : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelTimerRegular             : GameUi.UiLabel;

        // @ts-ignore
        private readonly _groupTimerIncremental         : eui.Group;
        // @ts-ignore
        private readonly _labelTimerIncrementalTitle1   : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelTimerIncremental1        : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelTimerIncrementalTitle2   : GameUi.UiLabel;
        // @ts-ignore
        private readonly _labelTimerIncremental2        : GameUi.UiLabel;

        public constructor() {
            super();

            this.skinName = "resource/skins/multiCustomWar/McwWarBasicSettingsPage.exml";
        }

        protected _onOpened(): void {
            this._setUiListenerArray([
                { ui: this._btnHasFogHelp,          callback: this._onTouchedBtnHasFogHelp },
                { ui: this._btnTimerTypeHelp,       callback: this._onTouchedBtnTimerTypeHelp, },
            ]);
            this._setNotifyListenerArray([
                { type: Notify.Type.LanguageChanged,                callback: this._onNotifyLanguageChanged },
                { type: Notify.Type.MsgMpwCommonGetMyWarInfoList,   callback: this._onNotifyMsgMpwCommonGetMyWarInfoList },
            ]);
            this.left       = 0;
            this.right      = 0;
            this.top        = 0;
            this.bottom     = 0;

            this._updateComponentsForLanguage();
            this._updateComponentsForWarInfo();
        }

        ////////////////////////////////////////////////////////////////////////////////
        // Event callbacks.
        ////////////////////////////////////////////////////////////////////////////////
        private _onNotifyLanguageChanged(): void {
            this._updateComponentsForLanguage();
        }

        private _onNotifyMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
            const data  = e.data as ProtoTypes.NetMessage.MsgMpwCommonGetMyWarInfoList.IS;
            const warId = this._getOpenData().warId;
            if ((warId != null) && ((data.infos || []).find(v => v.warId === warId))) {
                this._updateComponentsForWarInfo();
            }
        }

        private _onTouchedBtnHasFogHelp(): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0020),
                content: Lang.getText(Lang.Type.R0002),
            });
        }

        private _onTouchedBtnTimerTypeHelp(): void {
            CommonHelpPanel.show({
                title  : Lang.getText(Lang.Type.B0574),
                content: Lang.getText(Lang.Type.R0003),
            });
        }

        ////////////////////////////////////////////////////////////////////////////////
        // View functions.
        ////////////////////////////////////////////////////////////////////////////////
        private _updateComponentsForLanguage(): void {
            this._labelMapNameTitle.text            = Lang.getText(Lang.Type.B0225);
            this._labelWarNameTitle.text            = Lang.getText(Lang.Type.B0185);
            this._labelWarPasswordTitle.text        = Lang.getText(Lang.Type.B0186);
            this._labelWarCommentTitle.text         = Lang.getText(Lang.Type.B0187);
            this._labelWarRuleTitle.text            = Lang.getText(Lang.Type.B0318);
            this._labelHasFogTitle.text             = Lang.getText(Lang.Type.B0020);
            this._labelTimerTypeTitle.text          = Lang.getText(Lang.Type.B0574);
            this._labelTimerRegularTitle.text       = Lang.getText(Lang.Type.B0021);
            this._labelTimerIncrementalTitle1.text  = Lang.getText(Lang.Type.B0389);
            this._labelTimerIncrementalTitle2.text  = Lang.getText(Lang.Type.B0390);
        }

        private _updateComponentsForWarInfo(): void {
            this._updateLabelWarName();
            this._updateLabelWarPassword();
            this._updateLabelWarComment();
            this._updateLabelMapName();
            this._updateLabelWarRule();
            this._updateLabelHasFog();
            this._updateGroupTimer();
        }

        private _updateLabelWarName(): void {
            const settingsForMcw    = this._getSettingsForMcw();
            this._labelWarName.text = settingsForMcw ? settingsForMcw.warName || `` : ``;
        }

        private async _updateLabelWarPassword(): Promise<void> {
            const settingsForMcw        = this._getSettingsForMcw();
            this._labelWarPassword.text = (settingsForMcw && settingsForMcw.warPassword) ? `****` : ``;
        }

        private async _updateLabelWarComment(): Promise<void> {
            const settingsForMcw        = this._getSettingsForMcw();
            this._labelWarComment.text  = settingsForMcw ? settingsForMcw.warComment || `` : ``;
        }

        private async _updateLabelMapName(): Promise<void> {
            const settingsForMcw    = this._getSettingsForMcw();
            const mapId             = settingsForMcw ? settingsForMcw.mapId : undefined;
            const labelMapName      = this._labelMapName;
            if (mapId == null) {
                labelMapName.text = ``;
            } else {
                labelMapName.text = (await WarMapModel.getMapNameInCurrentLanguage(mapId)) || CommonConstants.ErrorTextForUndefined;
            }
        }

        private async _updateLabelWarRule(): Promise<void> {
            const labelWarRule      = this._labelWarRule;
            const settingsForCommon = this._getSettingsForCommon();
            if (settingsForCommon == null) {
                labelWarRule.text       = ``;
                labelWarRule.textColor  = 0xFFFFFF;
                return;
            }

            const warRule = settingsForCommon.warRule;
            if (warRule == null) {
                labelWarRule.text       = CommonConstants.ErrorTextForUndefined;
                labelWarRule.textColor  = 0xFFFFFF;
            } else {
                labelWarRule.text       = Lang.getWarRuleNameInLanguage(warRule) || CommonConstants.ErrorTextForUndefined;
                labelWarRule.textColor  = settingsForCommon.presetWarRuleId == null ? 0xFFFF00 : 0xFFFFFF;
            }
        }

        private async _updateLabelHasFog(): Promise<void> {
            const settingsForCommon = this._getSettingsForCommon();
            const labelHasFog       = this._labelHasFog;
            if (!settingsForCommon) {
                labelHasFog.text        = ``;
                labelHasFog.textColor   = 0xFFFFFF;
            } else {
                const warRule               = settingsForCommon.warRule;
                const ruleForGlobalParams   = warRule ? warRule.ruleForGlobalParams : undefined;
                const hasFog                = ruleForGlobalParams ? !!ruleForGlobalParams.hasFogByDefault : false;
                labelHasFog.text            = Lang.getText(hasFog ? Lang.Type.B0012 : Lang.Type.B0013);
                labelHasFog.textColor       = hasFog ? 0xFFFF00 : 0xFFFFFF;
            }
        }

        private async _updateGroupTimer(): Promise<void> {
            const groupTimer        = this._groupTimer;
            const groupRegular      = this._groupTimerRegular;
            const groupIncremental  = this._groupTimerIncremental;
            (groupRegular.parent) && (groupRegular.parent.removeChild(groupRegular));
            (groupIncremental.parent) && (groupIncremental.parent.removeChild(groupIncremental));

            const settingsForMcw    = this._getSettingsForMcw();
            const params            = settingsForMcw ? settingsForMcw.bootTimerParams : undefined;
            const labelTimerType    = this._labelTimerType;
            if (!params) {
                labelTimerType.text = ``;
            } else {
                const timerType     : Types.BootTimerType = params[0];
                labelTimerType.text = Lang.getBootTimerTypeName(timerType) || CommonConstants.ErrorTextForUndefined;

                if (timerType === Types.BootTimerType.Regular) {
                    groupTimer.addChild(groupRegular);
                    this._labelTimerRegular.text = Helpers.getTimeDurationText2(params[1]);

                } else if (timerType === Types.BootTimerType.Incremental) {
                    groupTimer.addChild(groupIncremental);
                    this._labelTimerIncremental1.text = Helpers.getTimeDurationText2(params[1]);
                    this._labelTimerIncremental2.text = Helpers.getTimeDurationText2(params[2]);
                }
            }
        }

        private _getSettingsForMcw(): ProtoTypes.WarSettings.ISettingsForMcw | null | undefined {
            const warId = this._getOpenData().warId;
            if (warId == null) {
                return undefined;
            }
            const warInfo = MpwModel.getMyWarInfo(warId);
            return warInfo ? warInfo.settingsForMcw : undefined;
        }
        private _getSettingsForCommon(): ProtoTypes.WarSettings.ISettingsForCommon | null | undefined {
            const warId = this._getOpenData().warId;
            if (warId == null) {
                return undefined;
            }
            const warInfo = MpwModel.getMyWarInfo(warId);
            return warInfo ? warInfo.settingsForCommon : undefined;
        }
    }
}
