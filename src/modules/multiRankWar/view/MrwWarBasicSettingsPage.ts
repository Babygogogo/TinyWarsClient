
import { TwnsUiButton }                      from "../../../utility/ui/UiButton";
import { TwnsUiLabel }                      from "../../../utility/ui/UiLabel";
import { UiTabPage }                    from "../../../utility/ui/UiTabPage";
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

export type OpenDataForMrwWarBasicSettingsPage = {
    warId  : number | null;
};
export class MrwWarBasicSettingsPage extends UiTabPage<OpenDataForMrwWarBasicSettingsPage> {
    private readonly _labelMapNameTitle             : TwnsUiLabel.UiLabel;
    private readonly _labelMapName                  : TwnsUiLabel.UiLabel;

    private readonly _labelWarNameTitle             : TwnsUiLabel.UiLabel;
    private readonly _labelWarName                  : TwnsUiLabel.UiLabel;

    private readonly _labelWarPasswordTitle         : TwnsUiLabel.UiLabel;
    private readonly _labelWarPassword              : TwnsUiLabel.UiLabel;

    private readonly _labelWarCommentTitle          : TwnsUiLabel.UiLabel;
    private readonly _labelWarComment               : TwnsUiLabel.UiLabel;

    private readonly _labelWarRuleTitle             : TwnsUiLabel.UiLabel;
    private readonly _labelWarRule                  : TwnsUiLabel.UiLabel;

    private readonly _labelHasFogTitle              : TwnsUiLabel.UiLabel;
    private readonly _labelHasFog                   : TwnsUiLabel.UiLabel;
    private readonly _btnHasFogHelp                 : TwnsUiButton.UiButton;

    private readonly _groupTimer                    : eui.Group;
    private readonly _labelTimerTypeTitle           : TwnsUiLabel.UiLabel;
    private readonly _labelTimerType                : TwnsUiLabel.UiLabel;
    private readonly _btnTimerTypeHelp              : TwnsUiButton.UiButton;

    private readonly _groupTimerRegular             : eui.Group;
    private readonly _labelTimerRegularTitle        : TwnsUiLabel.UiLabel;
    private readonly _labelTimerRegular             : TwnsUiLabel.UiLabel;

    private readonly _groupTimerIncremental         : eui.Group;
    private readonly _labelTimerIncrementalTitle1   : TwnsUiLabel.UiLabel;
    private readonly _labelTimerIncremental1        : TwnsUiLabel.UiLabel;
    private readonly _labelTimerIncrementalTitle2   : TwnsUiLabel.UiLabel;
    private readonly _labelTimerIncremental2        : TwnsUiLabel.UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/multiRankWar/MrwWarBasicSettingsPage.exml";
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
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgMpwCommonGetMyWarInfoList(e: egret.Event): void {
        const data  = e.data as ProtoTypes.NetMessage.MsgMpwCommonGetMyWarInfoList.IS;
        const warId = this._getOpenData().warId;
        if ((warId != null) && ((data.infos || []).find(v => v.warId === warId))) {
            this._updateComponentsForWarInfo();
        }
    }

    private _onTouchedBtnHasFogHelp(e: egret.TouchEvent): void {
        CommonHelpPanel.show({
            title  : Lang.getText(LangTextType.B0020),
            content: Lang.getText(LangTextType.R0002),
        });
    }

    private _onTouchedBtnTimerTypeHelp(e: egret.TouchEvent): void {
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

    private async _updateLabelWarName(): Promise<void> {
        const warInfo           = await this._getWarInfo();
        this._labelWarName.text = undefined;
    }

    private async _updateLabelWarPassword(): Promise<void> {
        const warInfo               = await this._getWarInfo();
        this._labelWarPassword.text = undefined;
    }

    private async _updateLabelWarComment(): Promise<void> {
        const warInfo               = await this._getWarInfo();
        this._labelWarComment.text  = undefined;
    }

    private async _updateLabelMapName(): Promise<void> {
        const warInfo           = await this._getWarInfo();
        this._labelMapName.text = warInfo ? await WarMapModel.getMapNameInCurrentLanguage(warInfo.settingsForMrw.mapId) : undefined;
    }

    private async _updateLabelWarRule(): Promise<void> {
        const warInfo           = await this._getWarInfo();
        const settingsForCommon = warInfo ? warInfo.settingsForCommon : undefined;
        const label             = this._labelWarRule;
        if (!settingsForCommon) {
            label.text      = undefined;
        } else {
            label.text      = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
            label.textColor = settingsForCommon.presetWarRuleId == null ? 0xFFFF00 : 0xFFFFFF;
        }
    }

    private async _updateLabelHasFog(): Promise<void> {
        const warInfo       = await this._getWarInfo();
        const labelHasFog   = this._labelHasFog;
        if (!warInfo) {
            labelHasFog.text = undefined;
        } else {
            const hasFog            = !!warInfo.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
            labelHasFog.text        = Lang.getText(hasFog ? LangTextType.B0012 : LangTextType.B0013);
            labelHasFog.textColor   = hasFog ? 0xFFFF00 : 0xFFFFFF;
        }
    }

    private async _updateGroupTimer(): Promise<void> {
        const groupTimer        = this._groupTimer;
        const groupRegular      = this._groupTimerRegular;
        const groupIncremental  = this._groupTimerIncremental;
        (groupRegular.parent) && (groupRegular.parent.removeChild(groupRegular));
        (groupIncremental.parent) && (groupIncremental.parent.removeChild(groupIncremental));

        const params            = CommonConstants.WarBootTimerDefaultParams;
        const labelTimerType    = this._labelTimerType;
        if (!params) {
            labelTimerType.text = undefined;
        } else {
            const timerType     : Types.BootTimerType = params[0];
            labelTimerType.text = Lang.getBootTimerTypeName(timerType);

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

    private _getWarInfo(): ProtoTypes.MultiPlayerWar.IMpwWarInfo {
        return MpwModel.getMyWarInfo(this._getOpenData().warId);
    }
}
