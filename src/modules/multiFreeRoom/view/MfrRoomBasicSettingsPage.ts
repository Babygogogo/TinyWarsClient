
import TwnsUiButton              from "../../../utility/ui/UiButton";
import TwnsUiLabel              from "../../../utility/ui/UiLabel";
import TwnsUiTabPage            from "../../../utility/ui/UiTabPage";
import { CommonHelpPanel }      from "../../common/view/CommonHelpPanel";
import { Helpers }              from "../../../utility/Helpers";
import { Lang }                 from "../../../utility/lang/Lang";
import { TwnsLangTextType } from "../../../utility/lang/LangTextType";
import LangTextType         = TwnsLangTextType.LangTextType;
import { Notify }               from "../../../utility/notify/Notify";
import { TwnsNotifyType } from "../../../utility/notify/NotifyType";
import NotifyType       = TwnsNotifyType.NotifyType;
import { ProtoTypes }           from "../../../utility/proto/ProtoTypes";
import { Types }                from "../../../utility/Types";
import { MfrModel }             from "../../multiFreeRoom/model/MfrModel";

export type OpenDataForMfrRoomBasicSettingsPage = {
    roomId  : number | null;
};
export class MfrRoomBasicSettingsPage extends TwnsUiTabPage.UiTabPage<OpenDataForMfrRoomBasicSettingsPage> {
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

        this.skinName = "resource/skins/multiFreeRoom/MfrRoomBasicSettingsPage.exml";
    }

    protected _onOpened(): void {
        this._setUiListenerArray([
            { ui: this._btnHasFogHelp,          callback: this._onTouchedBtnHasFogHelp },
            { ui: this._btnTimerTypeHelp,       callback: this._onTouchedBtnTimerTypeHelp, },
        ]);
        this._setNotifyListenerArray([
            { type: NotifyType.LanguageChanged,    callback: this._onNotifyLanguageChanged },
            { type: NotifyType.MsgMfrGetRoomInfo,  callback: this._onNotifyMsgMfrGetRoomInfo },
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
    private _onNotifyLanguageChanged(e: egret.Event): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyMsgMfrGetRoomInfo(e: egret.Event): void {
        this._updateComponentsForRoomInfo();
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
        this._labelWarName.text = roomInfo ? roomInfo.settingsForMfw.warName : undefined;
    }

    private async _updateLabelWarPassword(): Promise<void> {
        const roomInfo              = await this._getRoomInfo();
        this._labelWarPassword.text = (roomInfo && roomInfo.settingsForMfw.warPassword) ? `****` : undefined;
    }

    private async _updateLabelWarComment(): Promise<void> {
        const roomInfo              = await this._getRoomInfo();
        this._labelWarComment.text  = roomInfo ? roomInfo.settingsForMfw.warComment : undefined;
    }

    private async _updateLabelMapName(): Promise<void> {
        this._labelMapName.text = `--`;
    }

    private async _updateLabelWarRule(): Promise<void> {
        this._labelWarRule.text = `--`;
    }

    private async _updateLabelHasFog(): Promise<void> {
        const roomInfo      = await this._getRoomInfo();
        const labelHasFog   = this._labelHasFog;
        if (!roomInfo) {
            labelHasFog.text = undefined;
        } else {
            const hasFog            = !!roomInfo.settingsForMfw.initialWarData.settingsForCommon.warRule.ruleForGlobalParams.hasFogByDefault;
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
        const params            = roomInfo ? roomInfo.settingsForMfw.bootTimerParams : undefined;
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

    private _getRoomInfo(): Promise<ProtoTypes.MultiFreeRoom.IMfrRoomInfo> {
        return MfrModel.getRoomInfo(this._getOpenData().roomId);
    }
}
