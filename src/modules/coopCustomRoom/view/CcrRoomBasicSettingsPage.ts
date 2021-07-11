
import { UiButton }                     from "../../../gameui/UiButton";
import { UiLabel }                      from "../../../gameui/UiLabel";
import { UiTabPage }                    from "../../../gameui/UiTabPage";
import { CommonHelpPanel }              from "../../common/view/CommonHelpPanel";
import * as Helpers                     from "../../../utility/Helpers";
import * as Lang                        from "../../../utility/Lang";
import { LangTextType } from "../../../utility/LangTextType";
import { Notify }                       from "../../../utility/Notify";
import { NotifyType } from "../../../utility/NotifyType";
import * as ProtoTypes                  from "../../../utility/ProtoTypes";
import { Types }                        from "../../../utility/Types";
import * as CcrModel                    from "../../coopCustomRoom/model/CcrModel";
import * as WarMapModel                 from "../../warMap/model/WarMapModel";

export type OpenDataForCcrRoomBasicSettingsPage = {
    roomId  : number | null;
};
export class CcrRoomBasicSettingsPage extends UiTabPage<OpenDataForCcrRoomBasicSettingsPage> {
    private readonly _labelMapNameTitle             : UiLabel;
    private readonly _labelMapName                  : UiLabel;

    private readonly _labelWarNameTitle             : UiLabel;
    private readonly _labelWarName                  : UiLabel;

    private readonly _labelWarPasswordTitle         : UiLabel;
    private readonly _labelWarPassword              : UiLabel;

    private readonly _labelWarCommentTitle          : UiLabel;
    private readonly _labelWarComment               : UiLabel;

    private readonly _labelWarRuleTitle             : UiLabel;
    private readonly _labelWarRule                  : UiLabel;

    private readonly _labelHasFogTitle              : UiLabel;
    private readonly _labelHasFog                   : UiLabel;
    private readonly _btnHasFogHelp                 : UiButton;

    private readonly _groupTimer                    : eui.Group;
    private readonly _labelTimerTypeTitle           : UiLabel;
    private readonly _labelTimerType                : UiLabel;
    private readonly _btnTimerTypeHelp              : UiButton;

    private readonly _groupTimerRegular             : eui.Group;
    private readonly _labelTimerRegularTitle        : UiLabel;
    private readonly _labelTimerRegular             : UiLabel;

    private readonly _groupTimerIncremental         : eui.Group;
    private readonly _labelTimerIncrementalTitle1   : UiLabel;
    private readonly _labelTimerIncremental1        : UiLabel;
    private readonly _labelTimerIncrementalTitle2   : UiLabel;
    private readonly _labelTimerIncremental2        : UiLabel;

    public constructor() {
        super();

        this.skinName = "resource/skins/coopCustomRoom/CcrRoomBasicSettingsPage.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnHasFogHelp,          callback: this._onTouchedBtnHasFogHelp },
            { ui: this._btnTimerTypeHelp,       callback: this._onTouchedBtnTimerTypeHelp, },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgCcrGetRoomInfo,  callback: this._onNotifyMsgCcrGetRoomInfo },
        ]);
        this.left       = 0;
        this.right      = 0;
        this.top        = 0;
        this.bottom     = 0;

        this._updateComponentsForLanguage();
        this._updateComponentsForRoomInfo();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgCcrGetRoomInfo(): void {
        this._updateComponentsForRoomInfo();
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

    private _updateComponentsForRoomInfo(): void {
        this._updateLabelWarName();
        this._updateLabelWarPassword();
        this._updateLabelWarComment();
        this._updateLabelMapName();
        this._updateLabelWarRule();
        this._updateLabelHasFog();
        this._updateGroupTimer();
    }

    private async _updateLabelWarName(): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        this._labelWarName.text = roomInfo ? roomInfo.settingsForCcw.warName : undefined;
    }

    private async _updateLabelWarPassword(): Promise<void> {
        const roomInfo              = await this._getRoomInfo();
        this._labelWarPassword.text = (roomInfo && roomInfo.settingsForCcw.warPassword) ? `****` : undefined;
    }

    private async _updateLabelWarComment(): Promise<void> {
        const roomInfo              = await this._getRoomInfo();
        this._labelWarComment.text  = roomInfo ? roomInfo.settingsForCcw.warComment : undefined;
    }

    private async _updateLabelMapName(): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        this._labelMapName.text = roomInfo ? await WarMapModel.getMapNameInCurrentLanguage(roomInfo.settingsForCcw.mapId) : undefined;
    }

    private async _updateLabelWarRule(): Promise<void> {
        const roomInfo          = await this._getRoomInfo();
        const settingsForCommon = roomInfo ? roomInfo.settingsForCommon : undefined;
        const label             = this._labelWarRule;
        if (!settingsForCommon) {
            label.text      = undefined;
        } else {
            label.text      = Lang.getWarRuleNameInLanguage(settingsForCommon.warRule);
            label.textColor = settingsForCommon.presetWarRuleId == null ? 0xFFFF00 : 0xFFFFFF;
        }
    }

    private async _updateLabelHasFog(): Promise<void> {
        const roomInfo      = await this._getRoomInfo();
        const labelHasFog   = this._labelHasFog;
        if (!roomInfo) {
            labelHasFog.text = undefined;
        } else {
            const hasFog            = !!roomInfo.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
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

        const roomInfo          = await this._getRoomInfo();
        const params            = roomInfo ? roomInfo.settingsForCcw.bootTimerParams : undefined;
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

    private _getRoomInfo(): Promise<ProtoTypes.CoopCustomRoom.ICcrRoomInfo> {
        return CcrModel.getRoomInfo(this._getOpenData().roomId);
    }
}
