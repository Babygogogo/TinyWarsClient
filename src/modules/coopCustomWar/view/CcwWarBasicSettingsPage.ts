
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { TwnsUiTabPage }                    from "../../../utility/ui/UiTabPage";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import { CommonConstants }              from "../../../utility/CommonConstants";
import { Helpers }                      from "../../../utility/Helpers";
import { Lang }                         from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }                       from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }                   from "../../../utility/proto/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import { MpwModel }                     from "../../multiPlayerWar/model/MpwModel";
import { WarMapModel }                  from "../../warMap/model/WarMapModel";

export type OpenDataForCcwWarBasicSettingsPage = {
    warId  : number | null | undefined;
};
export class CcwWarBasicSettingsPage extends TwnsUiTabPage.UiTabPage<OpenDataForCcwWarBasicSettingsPage> {
    // @ts-ignore
    private readonly _labelMapNameTitle             : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelMapName                  : TwnsUiLabel.UiLabel;

    // @ts-ignore
    private readonly _labelWarNameTitle             : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelWarName                  : TwnsUiLabel.UiLabel;

    // @ts-ignore
    private readonly _labelWarPasswordTitle         : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelWarPassword              : TwnsUiLabel.UiLabel;

    // @ts-ignore
    private readonly _labelWarCommentTitle          : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelWarComment               : TwnsUiLabel.UiLabel;

    // @ts-ignore
    private readonly _labelWarRuleTitle             : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelWarRule                  : TwnsUiLabel.UiLabel;

    // @ts-ignore
    private readonly _labelHasFogTitle              : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelHasFog                   : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _btnHasFogHelp                 : TwnsUiButton.UiButton;

    // @ts-ignore
    private readonly _groupTimer                    : eui.Group;
    // @ts-ignore
    private readonly _labelTimerTypeTitle           : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelTimerType                : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _btnTimerTypeHelp              : TwnsUiButton.UiButton;

    // @ts-ignore
    private readonly _groupTimerRegular             : eui.Group;
    // @ts-ignore
    private readonly _labelTimerRegularTitle        : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelTimerRegular             : TwnsUiLabel.UiLabel;

    // @ts-ignore
    private readonly _groupTimerIncremental         : eui.Group;
    // @ts-ignore
    private readonly _labelTimerIncrementalTitle1   : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelTimerIncremental1        : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelTimerIncrementalTitle2   : TwnsUiLabel.UiLabel;
    // @ts-ignore
    private readonly _labelTimerIncremental2        : TwnsUiLabel.UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/coopCustomWar/CcwWarBasicSettingsPage.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnHasFogHelp,          callback: this._onTouchedBtnHasFogHelp },
            { ui: this._btnTimerTypeHelp,       callback: this._onTouchedBtnTimerTypeHelp, },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,                callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMpwCommonGetMyWarInfoList,   callback: this._onNotifyMsgMpwCommonGetMyWarInfoList },
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
            title  : Lang.getText(LangTextType.B0020),
            content: Lang.getText(LangTextType.R0002),
        });
    }

    private _onTouchedBtnTimerTypeHelp(): void {
        CommonHelpPanel.show({
            title  : Lang.getText(LangTextType.B0574),
            content: Lang.getText(LangTextType.R0003),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelMapNameTitle.text            = Lang.getText(LangTextType.B0225);
        this._labelWarNameTitle.text            = Lang.getText(LangTextType.B0185);
        this._labelWarPasswordTitle.text        = Lang.getText(LangTextType.B0186);
        this._labelWarCommentTitle.text         = Lang.getText(LangTextType.B0187);
        this._labelWarRuleTitle.text            = Lang.getText(LangTextType.B0318);
        this._labelHasFogTitle.text             = Lang.getText(LangTextType.B0020);
        this._labelTimerTypeTitle.text          = Lang.getText(LangTextType.B0574);
        this._labelTimerRegularTitle.text       = Lang.getText(LangTextType.B0021);
        this._labelTimerIncrementalTitle1.text  = Lang.getText(LangTextType.B0389);
        this._labelTimerIncrementalTitle2.text  = Lang.getText(LangTextType.B0390);
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
        const settingsForCcw    = this._getSettingsForCcw();
        this._labelWarName.text = settingsForCcw ? settingsForCcw.warName || `` : ``;
    }

    private async _updateLabelWarPassword(): Promise<void> {
        const settingsForCcw        = this._getSettingsForCcw();
        this._labelWarPassword.text = (settingsForCcw && settingsForCcw.warPassword) ? `****` : ``;
    }

    private async _updateLabelWarComment(): Promise<void> {
        const settingsForCcw        = this._getSettingsForCcw();
        this._labelWarComment.text  = settingsForCcw ? settingsForCcw.warComment || `` : ``;
    }

    private async _updateLabelMapName(): Promise<void> {
        const settingsForCcw    = this._getSettingsForCcw();
        const mapId             = settingsForCcw ? settingsForCcw.mapId : undefined;
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
            labelHasFog.text            = Lang.getText(hasFog ? LangTextType.B0012 : LangTextType.B0013);
            labelHasFog.textColor       = hasFog ? 0xFFFF00 : 0xFFFFFF;
        }
    }

    private async _updateGroupTimer(): Promise<void> {
        const groupTimer        = this._groupTimer;
        const groupRegular      = this._groupTimerRegular;
        const groupIncremental  = this._groupTimerIncremental;
        (groupRegular.parent) && (groupRegular.parent.removeChild(groupRegular));
        (groupIncremental.parent) && (groupIncremental.parent.removeChild(groupIncremental));

        const settingsForCcw    = this._getSettingsForCcw();
        const params            = settingsForCcw ? settingsForCcw.bootTimerParams : undefined;
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

    private _getSettingsForCcw(): ProtoTypes.WarSettings.ISettingsForCcw | null | undefined {
        const warId = this._getOpenData().warId;
        if (warId == null) {
            return undefined;
        }
        const warInfo = MpwModel.getMyWarInfo(warId);
        return warInfo ? warInfo.settingsForCcw : undefined;
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
